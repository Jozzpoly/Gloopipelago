import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { Simulation } from '../src/core/v1-mirror.mjs';
import {
  M4_WORLD_WIDTH,
  M4_WORLD_HEIGHT,
  M4_FOUNDER_COUNT,
  M4_INITIAL_FOOD_COUNT,
  M4_HABITATS,
  M4_PRODUCT_OPTIONS,
  createM4Simulation,
} from '../src/core/m4-ecological-mosaic.mjs';

const M4Simulation = createM4Simulation(Simulation);
const DT = 1 / 60;
const SEEDS = [1, 0x12345678, 956866913, 0x9e3779b9, 42424242, 0xdeadbeef, 0xcafebabe, 20260910].map(x => x >>> 0);
const EXTENDED = new Set(SEEDS.slice(0, 3));
const RANGES = { speed:[.35,1.9], sense:[20,150], size:[2.4,9], eff:[.55,1.45], wander:[.15,1.5], diet:[-1,1] };

const mean = xs => xs.length ? xs.reduce((a,b)=>a+b,0)/xs.length : 0;
const median = xs => {
  const a = [...xs].sort((x,y)=>x-y);
  if (!a.length) return 0;
  const m = Math.floor(a.length/2);
  return a.length%2 ? a[m] : (a[m-1]+a[m])/2;
};
const effective = counts => {
  const total = counts.reduce((a,b)=>a+b,0);
  if (!total) return 0;
  let h = 0;
  for (const c of counts) if (c) { const p=c/total; h -= p*Math.log(p); }
  return Math.exp(h);
};
const normalizedTrait = (g,key) => {
  const [lo,hi]=RANGES[key];
  return Math.max(0,Math.min(1,(g[key]-lo)/(hi-lo)));
};

function fullState(sim) {
  return {
    seed:sim.seed, width:sim.width, height:sim.height,
    simTime:sim.simTime, season:sim.season, nextId:sim.nextId,
    births:sim.births, deaths:sim.deaths, extinctions:sim.extinctions,
    rngState:sim.rngStream.snapshot(),
    blobs:sim.blobs, foods:sim.foods,
  };
}
function fingerprint(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function occupiedFraction(sim, cols=12, rows=9) {
  const occupied = new Set();
  for (const b of sim.blobs) {
    const x=Math.min(cols-1,Math.max(0,Math.floor(b.x/sim.width*cols)));
    const y=Math.min(rows-1,Math.max(0,Math.floor(b.y/sim.height*rows)));
    occupied.add(y*cols+x);
  }
  return occupied.size/(cols*rows);
}

function strategyEffective(blobs) {
  const bins=new Map();
  for (const b of blobs) {
    const signature=Object.keys(RANGES).map(key=>Math.min(2,Math.floor(normalizedTrait(b.g,key)*3))).join('');
    bins.set(signature,(bins.get(signature)||0)+1);
  }
  return effective([...bins.values()]);
}

function makeLineageWitness() {
  const rootById=new Map();
  const originByRoot=new Map();
  let founderEvents=0;
  let initialFounderEvents=0;
  let reseedFounderEvents=0;
  const sink=rec=>{
    if (rec.kind==='founder') {
      founderEvents++;
      rootById.set(rec.id,rec.id);
      const origin=rec.origin==='auto-reseed'?'auto-reseed':'initial';
      originByRoot.set(rec.id,origin);
      if (origin==='initial') initialFounderEvents++;
      else reseedFounderEvents++;
    } else if (rec.kind==='birth') {
      const root=rootById.get(rec.parentId);
      if (root!==undefined) rootById.set(rec.id,root);
    }
  };
  return {sink,rootById,originByRoot,counts:()=>({founderEvents,initialFounderEvents,reseedFounderEvents})};
}

function lineageMetrics(sim,lineage) {
  const original=new Map(), reseed=new Map();
  for (const b of sim.blobs) {
    const root=lineage.rootById.get(b.id);
    if (root===undefined) continue;
    const target=lineage.originByRoot.get(root)==='initial'?original:reseed;
    target.set(root,(target.get(root)||0)+1);
  }
  const orig=[...original.values()], auto=[...reseed.values()];
  return {
    activeOriginalFounderRoots:original.size,
    effectiveOriginalLineages:effective(orig),
    topOriginalLineageShare:sim.blobs.length&&orig.length?Math.max(...orig)/sim.blobs.length:0,
    activeReseedRoots:reseed.size,
    effectiveReseedLineages:effective(auto),
  };
}

function snapshotMetrics(sim,lineage) {
  const s=sim.snapshot();
  return {
    time:s.time, population:s.population, food:s.food,
    births:s.births, deaths:s.deaths, extinctions:s.extinctions,
    maxGeneration:s.maxGeneration, dietAbs:s.dietAbs,
    speed:s.speed, sense:s.sense, size:s.size, eff:s.eff, wander:s.wander,
    occupiedFraction:occupiedFraction(sim),
    strategyEffective:strategyEffective(sim.blobs),
    ...lineageMetrics(sim,lineage),
  };
}

function construction() {
  const seed=0x12345678;
  const events=[];
  const sim=new M4Simulation({seed},{lifecycleWitness:r=>events.push(r)});
  assert.equal(sim.width,M4_WORLD_WIDTH);
  assert.equal(sim.height,M4_WORLD_HEIGHT);
  assert.equal(sim.foodRate,18.5);
  assert.equal(sim.blobs.length,M4_FOUNDER_COUNT);
  assert.equal(sim.foods.length,M4_INITIAL_FOOD_COUNT);
  assert.equal(events.length,M4_FOUNDER_COUNT,'transient super-construction leaked lifecycle events');
  assert(events.every(r=>r.kind==='founder'&&r.origin==='initial'));
  assert.deepEqual(events.map(r=>r.id),Array.from({length:M4_FOUNDER_COUNT},(_,i)=>i+1));
  assert.equal(M4_HABITATS.length,8);
  assert.equal(M4_HABITATS.filter(h=>h.regime==='dense').length,4);
  assert.equal(M4_HABITATS.filter(h=>h.regime==='diffuse').length,4);
  assert.equal(M4_HABITATS.filter(h=>h.kind===0).length,4);
  assert.equal(M4_HABITATS.filter(h=>h.kind===1).length,4);

  const initial=fullState(sim), initialFp=fingerprint(initial);
  events.length=0;
  sim.reset(seed);
  assert.equal(fingerprint(fullState(sim)),initialFp,'same-seed reset did not restore exact M4 initial state');
  assert.equal(events.length,M4_FOUNDER_COUNT);
  assert(events.every(r=>r.kind==='founder'&&r.origin==='reset'));

  const a=new M4Simulation({seed}), b=new M4Simulation({seed});
  assert.equal(fingerprint(fullState(a)),fingerprint(fullState(b)),'same-seed construction mismatch');
  for(let i=0;i<2400;i++){a.step(DT);b.step(DT);}
  assert.equal(fingerprint(fullState(a)),fingerprint(fullState(b)),'same-seed stepped state mismatch');

  return {
    status:'PASS', seed, world:[M4_WORLD_WIDTH,M4_WORLD_HEIGHT],
    founders:M4_FOUNDER_COUNT, initialFood:M4_INITIAL_FOOD_COUNT,
    foodRate:M4_PRODUCT_OPTIONS.foodRate, habitats:M4_HABITATS,
    initialFingerprint:initialFp,
    steppedFingerprint:fingerprint(fullState(a)),
  };
}

function runEcology(seed) {
  const lineage=makeLineageWitness();
  const sim=new M4Simulation({seed},{lifecycleWitness:lineage.sink});
  const maxSeconds=EXTENDED.has(seed)?3600:1800;
  const totalTicks=Math.round(maxSeconds/DT);
  const checkpoints=new Map();
  let maxPopulation=sim.blobs.length, capTicks=0, foodSampleSum=0, foodSamples=0, maxFood=sim.foods.length;
  const checkpointTicks=new Map([[Math.round(600/DT),600],[Math.round(1800/DT),1800],[Math.round(3600/DT),3600]]);
  for(let tick=1;tick<=totalTicks;tick++){
    sim.step(DT);
    if(sim.blobs.length>maxPopulation)maxPopulation=sim.blobs.length;
    if(sim.blobs.length>=260)capTicks++;
    if(sim.foods.length>maxFood)maxFood=sim.foods.length;
    if(tick%3600===0){foodSampleSum+=sim.foods.length;foodSamples++;}
    const seconds=checkpointTicks.get(tick);
    if(seconds&&seconds<=maxSeconds)checkpoints.set(seconds,snapshotMetrics(sim,lineage));
  }
  const witness=lineage.counts();
  assert.equal(witness.initialFounderEvents,M4_FOUNDER_COUNT,'initial founder witness count mismatch');
  const c600=checkpoints.get(600), c1800=checkpoints.get(1800);
  return {
    seed, maxSeconds, checkpoints:Object.fromEntries(checkpoints),
    strategyRetention600to1800:c600.strategyEffective?c1800.strategyEffective/c600.strategyEffective:0,
    maxPopulation, capTickFraction:capTicks/totalTicks,
    meanFoodSampled:foodSamples?foodSampleSum/foodSamples:0, maxFood,
    witness,
  };
}

function ecology() {
  const runs=SEEDS.map(runEcology);
  const c1800=runs.map(r=>r.checkpoints['1800']);
  const retention=runs.map(r=>r.strategyRetention600to1800);
  const aggregate={
    occupiedFractionMedian:median(c1800.map(x=>x.occupiedFraction)),
    strategyEffective1800Median:median(c1800.map(x=>x.strategyEffective)),
    strategyRetentionMedian:median(retention),
    activeOriginalFounderRootsMedian:median(c1800.map(x=>x.activeOriginalFounderRoots)),
    effectiveOriginalLineagesMedian:median(c1800.map(x=>x.effectiveOriginalLineages)),
    topOriginalLineageShareMedian:median(c1800.map(x=>x.topOriginalLineageShare)),
    populationMedian:median(c1800.map(x=>x.population)),
    singleOrZeroOriginalLineageSeeds:c1800.filter(x=>x.activeOriginalFounderRoots<=1).length,
    extinctionSeeds1800:c1800.filter(x=>x.extinctions>0).length,
    maxPopulationAcrossRuns:Math.max(...runs.map(r=>r.maxPopulation)),
    maxCapTickFraction:Math.max(...runs.map(r=>r.capTickFraction)),
  };
  assert(aggregate.occupiedFractionMedian>=.25,`occupied median ${aggregate.occupiedFractionMedian}`);
  assert(aggregate.strategyEffective1800Median>=10,`strategy median ${aggregate.strategyEffective1800Median}`);
  assert(aggregate.strategyRetentionMedian>=.65,`retention median ${aggregate.strategyRetentionMedian}`);
  assert(aggregate.activeOriginalFounderRootsMedian>=3,`founder roots median ${aggregate.activeOriginalFounderRootsMedian}`);
  assert(aggregate.effectiveOriginalLineagesMedian>=2.2,`lineage effective median ${aggregate.effectiveOriginalLineagesMedian}`);
  assert(aggregate.singleOrZeroOriginalLineageSeeds<=2,`collapsed seeds ${aggregate.singleOrZeroOriginalLineageSeeds}`);

  const extended=runs.filter(r=>EXTENDED.has(r.seed)).map(r=>({seed:r.seed,...r.checkpoints['3600'],maxPopulation:r.maxPopulation,capTickFraction:r.capTickFraction}));
  const longCollapsed=extended.filter(x=>x.extinctions>0||x.activeOriginalFounderRoots<=1).length;
  assert(longCollapsed<2,`3600s hard-stop: ${longCollapsed}/3 extended seeds extinct or <=1 original founder root`);

  return {status:'PASS',seeds:SEEDS,extendedSeeds:[...EXTENDED],aggregate,longHorizon:{hardStopCollapsedSeeds:longCollapsed,runs:extended},runs};
}

function nearestHabitat(sim,b) {
  let best=null,bestD=Infinity;
  for(const h of M4_HABITATS){
    const dx=b.x-h.x*sim.width,dy=b.y-h.y*sim.height,d=dx*dx+dy*dy;
    if(d<bestD){bestD=d;best=h;}
  }
  return best;
}
function localStats(sim) {
  const groups={dense:[],diffuse:[]};
  for(const b of sim.blobs)groups[nearestHabitat(sim,b).regime].push(b);
  assert(groups.dense.length>0&&groups.diffuse.length>0,'empty local-adaptation regime group');
  const stats={};
  for(const [name,bs] of Object.entries(groups))stats[name]={
    n:bs.length,
    speed:mean(bs.map(b=>b.g.speed)), sense:mean(bs.map(b=>b.g.sense)), size:mean(bs.map(b=>b.g.size)),
    eff:mean(bs.map(b=>b.g.eff)), wander:mean(bs.map(b=>b.g.wander)), dietAbs:mean(bs.map(b=>Math.abs(b.g.diet))),
  };
  stats.delta={};
  for(const key of ['speed','sense','size','eff','wander','dietAbs'])stats.delta[key]=stats.diffuse[key]-stats.dense[key];
  return stats;
}
function runAdaptation(seed,habitats) {
  const sim=new M4Simulation({seed,habitats});
  for(let i=0;i<1800/DT;i++)sim.step(DT);
  return {population:sim.blobs.length,extinctions:sim.extinctions,stats:localStats(sim)};
}
function adaptation() {
  const uniform=M4_HABITATS.map(h=>Object.freeze({...h,spread:.075}));
  const pairs=SEEDS.map(seed=>{
    const heterogeneous=runAdaptation(seed,M4_HABITATS);
    const control=runAdaptation(seed,uniform);
    const contrast={};
    for(const key of ['speed','sense','size','eff','wander','dietAbs'])contrast[key]=heterogeneous.stats.delta[key]-control.stats.delta[key];
    return {seed,heterogeneous,uniform:control,heterogeneityContrast:contrast};
  });
  const hd=key=>pairs.map(p=>p.heterogeneous.stats.delta[key]);
  const cd=key=>pairs.map(p=>p.heterogeneityContrast[key]);
  const simultaneousHeterogeneous=pairs.filter(p=>p.heterogeneous.stats.delta.speed>0&&p.heterogeneous.stats.delta.sense>0&&p.heterogeneous.stats.delta.size<0).length;
  const simultaneousContrast=pairs.filter(p=>p.heterogeneityContrast.speed>0&&p.heterogeneityContrast.sense>0&&p.heterogeneityContrast.size<0).length;
  const aggregate={
    speedDiffuseMinusDenseMedian:median(hd('speed')),
    senseDiffuseMinusDenseMedian:median(hd('sense')),
    sizeDiffuseMinusDenseMedian:median(hd('size')),
    simultaneousExpectedSigns:simultaneousHeterogeneous,
    speedControlSubtractedMedian:median(cd('speed')),
    senseControlSubtractedMedian:median(cd('sense')),
    sizeControlSubtractedMedian:median(cd('size')),
    simultaneousControlSubtractedSigns:simultaneousContrast,
    heterogeneousPopulationMedian:median(pairs.map(p=>p.heterogeneous.population)),
    uniformPopulationMedian:median(pairs.map(p=>p.uniform.population)),
  };
  assert(aggregate.speedDiffuseMinusDenseMedian>=.20,`speed delta ${aggregate.speedDiffuseMinusDenseMedian}`);
  assert(aggregate.senseDiffuseMinusDenseMedian>=5,`sense delta ${aggregate.senseDiffuseMinusDenseMedian}`);
  assert(aggregate.sizeDiffuseMinusDenseMedian<=-.60,`size delta ${aggregate.sizeDiffuseMinusDenseMedian}`);
  assert(aggregate.simultaneousExpectedSigns>=6,`heterogeneous expected-sign seeds ${aggregate.simultaneousExpectedSigns}`);
  assert(aggregate.speedControlSubtractedMedian>=.10,`control-subtracted speed ${aggregate.speedControlSubtractedMedian}`);
  assert(aggregate.senseControlSubtractedMedian>=2.5,`control-subtracted sense ${aggregate.senseControlSubtractedMedian}`);
  assert(aggregate.sizeControlSubtractedMedian<=-.30,`control-subtracted size ${aggregate.sizeControlSubtractedMedian}`);
  assert(aggregate.simultaneousControlSubtractedSigns>=5,`control-subtracted expected-sign seeds ${aggregate.simultaneousControlSubtractedSigns}`);
  return {status:'PASS',seeds:SEEDS,uniformSpread:.075,aggregate,pairs};
}

const cmd=process.argv[2]??'help';
if(cmd==='construction')console.log(JSON.stringify(construction(),null,2));
else if(cmd==='ecology')console.log(JSON.stringify(ecology(),null,2));
else if(cmd==='adaptation')console.log(JSON.stringify(adaptation(),null,2));
else console.log('Usage: node tools/m4a-final.mjs <construction|ecology|adaptation>');
