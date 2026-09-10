import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Simulation } from '../src/core/v1-mirror.mjs';
import { createM4Simulation, M4_HABITATS } from '../src/core/m4-ecological-mosaic.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const CORE_SHA='18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56';
const M4_SHA='b4539d91f31c8aa7b2a966244ad8e7b5c851698a7000ba3c3799c70611340c0e';
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
const M4Simulation=createM4Simulation(Simulation);
const DT=1/60;
const SEEDS=[1,0x12345678,956866913,0x9e3779b9,20260910].map(x=>x>>>0);
const RANGES={speed:[.35,1.9],sense:[20,150],size:[2.4,9],eff:[.55,1.45],wander:[.15,1.5],diet:[-1,1]};
const PROFILES=Object.freeze({
  control:Object.freeze({enabled:false,floor:1,decrement:0,tau:1,exponent:1}),
  gentle:Object.freeze({enabled:true,floor:.45,decrement:.010,tau:45,exponent:1}),
  medium:Object.freeze({enabled:true,floor:.30,decrement:.018,tau:70,exponent:1.35}),
  strong:Object.freeze({enabled:true,floor:.18,decrement:.030,tau:100,exponent:1.7}),
});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mean=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:0;
const median=xs=>{const a=[...xs].sort((x,y)=>x-y);if(!a.length)return 0;const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2};
const effective=counts=>{const total=counts.reduce((a,b)=>a+b,0);if(!total)return 0;let h=0;for(const c of counts)if(c){const p=c/total;h-=p*Math.log(p)}return Math.exp(h)};
const tv=(a,b)=>.5*a.reduce((s,x,i)=>s+Math.abs(x-(b[i]??0)),0);
const shares=counts=>{const total=counts.reduce((a,b)=>a+b,0);return total?counts.map(x=>x/total):counts.map(()=>0)};
const dominant=v=>v.length?v.reduce((best,x,i)=>x>v[best]?i:best,0):-1;
const dominantChanges=series=>series.slice(1).reduce((n,v,i)=>n+(dominant(v)!==dominant(series[i])?1:0),0);
const averageTurnover=series=>series.length<2?0:mean(series.slice(1).map((v,i)=>tv(series[i],v)));

function sourceBoundary(){
  const core=sha256(fs.readFileSync(path.join(ROOT,'src/core/v1-mirror.mjs')));
  const m4=sha256(fs.readFileSync(path.join(ROOT,'src/core/m4-ecological-mosaic.mjs')));
  assert.equal(core,CORE_SHA,'probe changed protected maintained core');
  assert.equal(m4,M4_SHA,'probe changed qualified M4 ecology');
  return {status:'PASS',coreSha256:core,m4Sha256:m4};
}

function causalState(sim){
  return JSON.stringify({
    seed:sim.seed,width:sim.width,height:sim.height,simTime:sim.simTime,season:sim.season,nextId:sim.nextId,
    births:sim.births,deaths:sim.deaths,extinctions:sim.extinctions,rngState:sim.rngStream.snapshot(),
    blobs:sim.blobs,foods:sim.foods,
  });
}

function habitatIndexByObject(habitats,h){
  const direct=habitats.indexOf(h);if(direct>=0)return direct;
  return habitats.findIndex(x=>x.id===h.id);
}

class HabitatMemoryProbeSimulation extends M4Simulation {
  constructor({memoryProfile='control',...options}={},apparatus={}){
    super(options,apparatus);
    assert(PROFILES[memoryProfile],`unknown memory profile ${memoryProfile}`);
    this._m5ProfileName=memoryProfile;
    this._m5Profile=PROFILES[memoryProfile];
    this._m5Productivity=Array(this.m4Habitats.length).fill(1);
    this._m5ObservationAccumulator=0;
    this._m5ConsumedByHabitat=Array(this.m4Habitats.length).fill(0);
    this._m5ConsumptionIntervals=0;
    this._m5OrdinaryCreated=0;
    this._m5NextFoodSerial=1;
    this._m5Registry=new Map();
    for(const f of this.foods){
      if(f.rich||f.kind<0)continue;
      const hi=this._inferFoodHabitat(f);
      this._tagFood(f,hi);
      this._m5OrdinaryCreated++;
    }
  }

  _profile(){return this._m5Profile??PROFILES.control}
  _habitats(){return this.m4Habitats??M4_HABITATS}

  _chooseHabitatIndex(kind){
    const habitats=this._habitats();
    const eligible=[];
    for(let i=0;i<habitats.length;i++)if(habitats[i].kind===kind)eligible.push(i);
    if(!eligible.length)return -1;
    const u=this.rng();
    const profile=this._profile();
    if(!profile.enabled||!this._m5Productivity){
      return eligible[Math.min(eligible.length-1,Math.floor(u*eligible.length))];
    }
    const weights=eligible.map(i=>Math.pow(this._m5Productivity[i],profile.exponent));
    const total=weights.reduce((a,b)=>a+b,0);
    let target=u*total;
    for(let j=0;j<eligible.length;j++){
      target-=weights[j];
      if(target<0||j===eligible.length-1)return eligible[j];
    }
    return eligible.at(-1);
  }

  foodPatch(kind=null){
    const k=kind??(this.rng()<.5?0:1);
    const habitats=this._habitats();
    const hi=this._chooseHabitatIndex(k);
    if(hi<0)return super.foodPatch(k);
    const habitat=habitats[hi];
    const spread=Math.min(this.width,this.height)*habitat.spread;
    return {
      x:clamp(habitat.x*this.width+this.rand(-spread,spread),8,this.width-8),
      y:clamp(habitat.y*this.height+this.rand(-spread,spread),8,this.height-8),
      kind:k,_m5HabitatIndex:hi,
    };
  }

  _tagFood(food,habitatIndex){
    const serial=this._m5NextFoodSerial??1;
    this._m5NextFoodSerial=serial+1;
    Object.defineProperty(food,'__m5Serial',{value:serial,writable:true,configurable:true,enumerable:false});
    Object.defineProperty(food,'__m5HabitatIndex',{value:habitatIndex,writable:true,configurable:true,enumerable:false});
    if(!this._m5Registry)this._m5Registry=new Map();
    this._m5Registry.set(serial,{habitatIndex,expiresAt:food.expiresAt});
  }

  addFood(n=1,rich=false,around=null){
    for(let i=0;i<n;i++){
      const p=around?{
        x:clamp(around.x+this.rand(34,-34),0,this.width),
        y:clamp(around.y+this.rand(34,-34),0,this.height),
        kind:this.rng()<.5?0:1,
        _m5HabitatIndex:-1,
      }:this.foodPatch();
      const food={x:p.x,y:p.y,e:(rich?this.rand(18,12):this.rand(11,6))*this.foodEnergyScale,rich,kind:rich?-1:p.kind,expiresAt:this.simTime+this.foodLifetime};
      this.foods.push(food);
      if(!rich&&!around&&Number.isInteger(p._m5HabitatIndex)&&p._m5HabitatIndex>=0){
        this._tagFood(food,p._m5HabitatIndex);
        if(this._m5OrdinaryCreated!==undefined)this._m5OrdinaryCreated++;
      }
    }
  }

  _inferFoodHabitat(food){
    const habitats=this._habitats();
    let best=-1,bestD=Infinity;
    for(let i=0;i<habitats.length;i++){
      const h=habitats[i];if(h.kind!==food.kind)continue;
      const dx=food.x-h.x*this.width,dy=food.y-h.y*this.height,d=dx*dx+dy*dy;
      if(d<bestD){bestD=d;best=i}
    }
    return best;
  }

  _observeConsumptionAndMemory(interval){
    const current=new Set();
    for(const f of this.foods)if(Number.isInteger(f.__m5Serial))current.add(f.__m5Serial);
    const consumed=Array(this._habitats().length).fill(0);
    for(const [serial,meta] of this._m5Registry){
      if(current.has(serial))continue;
      if(meta.expiresAt>this.simTime+1e-9&&meta.habitatIndex>=0)consumed[meta.habitatIndex]++;
      this._m5Registry.delete(serial);
    }
    for(let i=0;i<consumed.length;i++)this._m5ConsumedByHabitat[i]+=consumed[i];
    this._m5ConsumptionIntervals++;
    const profile=this._profile();
    if(profile.enabled){
      const recovery=Math.exp(-interval/profile.tau);
      for(let i=0;i<this._m5Productivity.length;i++){
        let p=1-(1-this._m5Productivity[i])*recovery;
        p-=consumed[i]*profile.decrement;
        this._m5Productivity[i]=clamp(p,profile.floor,1);
      }
    }
  }

  step(dt=DT){
    super.step(dt);
    this._m5ObservationAccumulator+=dt;
    while(this._m5ObservationAccumulator>=1-1e-12){
      this._m5ObservationAccumulator-=1;
      this._observeConsumptionAndMemory(1);
    }
  }

  m5Productivity(){return [...this._m5Productivity]}
  m5ConsumedByHabitat(){return [...this._m5ConsumedByHabitat]}
  m5OrdinaryCreated(){return this._m5OrdinaryCreated}
}

function structuralControl(){
  const seeds=[1,0x12345678,956866913].map(x=>x>>>0);
  const rows=[];
  for(const seed of seeds){
    const a=new M4Simulation({seed});
    const b=new HabitatMemoryProbeSimulation({seed,memoryProfile:'control'});
    assert.equal(causalState(a),causalState(b),`control construction drift seed ${seed}`);
    for(let i=0;i<36000;i++){a.step(DT);b.step(DT)}
    assert.equal(causalState(a),causalState(b),`memory-disabled probe drift seed ${seed}`);
    assert.equal(a.rngStream.snapshot(),b.rngStream.snapshot(),`memory-disabled RNG drift seed ${seed}`);
    rows.push({seed,simTime:a.simTime,population:a.blobs.length,food:a.foods.length,rngState:a.rngStream.snapshot(),fingerprint:sha256(Buffer.from(causalState(a)))});
  }
  return {status:'PASS',ticks:36000,seeds,rows};
}

function makeLineageWitness(){
  const rootById=new Map(),originByRoot=new Map();
  let initialFounders=0,reseedFounders=0;
  const sink=rec=>{
    if(rec.kind==='founder'){
      rootById.set(rec.id,rec.id);
      const origin=rec.origin==='auto-reseed'?'auto-reseed':'initial';
      originByRoot.set(rec.id,origin);
      if(origin==='initial')initialFounders++;else reseedFounders++;
    }else if(rec.kind==='birth'){
      const root=rootById.get(rec.parentId);if(root!==undefined)rootById.set(rec.id,root);
    }
  };
  return {sink,rootById,originByRoot,counts:()=>({initialFounders,reseedFounders})};
}

function lineageMetrics(sim,lineage){
  const counts=new Map();
  for(const b of sim.blobs){
    const root=lineage.rootById.get(b.id);if(root===undefined||lineage.originByRoot.get(root)!=='initial')continue;
    counts.set(root,(counts.get(root)||0)+1);
  }
  return {activeOriginalFounderRoots:counts.size,effectiveOriginalLineages:effective([...counts.values()])};
}

function occupiedFraction(sim,cols=12,rows=9){
  const occupied=new Set();
  for(const b of sim.blobs){
    const x=Math.min(cols-1,Math.max(0,Math.floor(b.x/sim.width*cols)));
    const y=Math.min(rows-1,Math.max(0,Math.floor(b.y/sim.height*rows)));
    occupied.add(y*cols+x);
  }
  return occupied.size/(cols*rows);
}
function normalizedTrait(g,key){const [lo,hi]=RANGES[key];return clamp((g[key]-lo)/(hi-lo),0,1)}
function strategyEffective(blobs){
  const bins=new Map();
  for(const b of blobs){const sig=Object.keys(RANGES).map(key=>Math.min(2,Math.floor(normalizedTrait(b.g,key)*3))).join('');bins.set(sig,(bins.get(sig)||0)+1)}
  return effective([...bins.values()]);
}
function nearestHabitatIndexForBlob(sim,b){
  let best=0,bestD=Infinity;
  for(let i=0;i<M4_HABITATS.length;i++){
    const h=M4_HABITATS[i],dx=b.x-h.x*sim.width,dy=b.y-h.y*sim.height,d=dx*dx+dy*dy;
    if(d<bestD){bestD=d;best=i}
  }
  return best;
}
function nearestHabitatIndexForFood(sim,f){
  let best=-1,bestD=Infinity;
  for(let i=0;i<M4_HABITATS.length;i++){
    const h=M4_HABITATS[i];if(h.kind!==f.kind)continue;
    const dx=f.x-h.x*sim.width,dy=f.y-h.y*sim.height,d=dx*dx+dy*dy;
    if(d<bestD){bestD=d;best=i}
  }
  return best;
}
function habitatVectors(sim){
  const blobs=Array(M4_HABITATS.length).fill(0),foods=Array(M4_HABITATS.length).fill(0);
  for(const b of sim.blobs)blobs[nearestHabitatIndexForBlob(sim,b)]++;
  for(const f of sim.foods){if(f.rich||f.kind<0)continue;const i=nearestHabitatIndexForFood(sim,f);if(i>=0)foods[i]++}
  return {blobCounts:blobs,blobShares:shares(blobs),foodCounts:foods,foodShares:shares(foods)};
}
function finalMetrics(sim,lineage){
  return {population:sim.blobs.length,food:sim.foods.length,births:sim.births,deaths:sim.deaths,extinctions:sim.extinctions,occupiedFraction:occupiedFraction(sim),strategyEffective:strategyEffective(sim.blobs),...lineageMetrics(sim,lineage)};
}
function recoveryTransitions(series){
  if(series.length<3)return 0;
  let total=0;
  for(let h=0;h<M4_HABITATS.length;h++){
    let prevSign=0;
    for(let i=1;i<series.length;i++){
      const d=series[i][h]-series[i-1][h];
      const sign=d>.01?1:d<-.01?-1:0;
      if(prevSign===-1&&sign===1)total++;
      if(sign!==0)prevSign=sign;
    }
  }
  return total;
}

function runOne(seed,profileName){
  const lineage=makeLineageWitness();
  const sim=new HabitatMemoryProbeSimulation({seed,memoryProfile:profileName},{lifecycleWitness:lineage.sink});
  const sampleEveryTicks=60*60;
  const productivityEveryTicks=10*60;
  const totalTicks=1800*60;
  const samples=[],productivitySeries=[];
  let maxPopulation=sim.blobs.length,maxFood=sim.foods.length;
  for(let tick=1;tick<=totalTicks;tick++){
    sim.step(DT);
    if(sim.blobs.length>maxPopulation)maxPopulation=sim.blobs.length;
    if(sim.foods.length>maxFood)maxFood=sim.foods.length;
    if(tick%productivityEveryTicks===0&&tick>=300*60)productivitySeries.push(sim.m5Productivity());
    if(tick%sampleEveryTicks===0&&tick>=300*60){
      const vectors=habitatVectors(sim);
      samples.push({time:tick/60,...vectors,productivity:sim.m5Productivity()});
    }
  }
  const blobSeries=samples.map(s=>s.blobShares),foodSeries=samples.map(s=>s.foodShares);
  const productivityRanges=productivitySeries.map(p=>Math.max(...p)-Math.min(...p));
  return {
    seed,profile:profileName,final:finalMetrics(sim,lineage),maxPopulation,maxFood,
    habitatOccupancyTurnover:averageTurnover(blobSeries),
    habitatFoodTurnover:averageTurnover(foodSeries),
    dominantOccupiedHabitatChanges:dominantChanges(blobSeries),
    dominantFoodHabitatChanges:dominantChanges(foodSeries),
    productivity:{min:Math.min(...productivitySeries.flat()),max:Math.max(...productivitySeries.flat()),meanRange:mean(productivityRanges),maxRange:Math.max(...productivityRanges),recoveryTransitions:recoveryTransitions(productivitySeries)},
    consumedByHabitat:sim.m5ConsumedByHabitat(),ordinaryFoodCreated:sim.m5OrdinaryCreated(),witness:lineage.counts(),samples,
  };
}

function aggregateProfile(runs){
  return {
    populationMedian:median(runs.map(r=>r.final.population)),
    occupancyMedian:median(runs.map(r=>r.final.occupiedFraction)),
    strategyEffectiveMedian:median(runs.map(r=>r.final.strategyEffective)),
    founderRootsMedian:median(runs.map(r=>r.final.activeOriginalFounderRoots)),
    effectiveLineagesMedian:median(runs.map(r=>r.final.effectiveOriginalLineages)),
    extinctionSeeds:runs.filter(r=>r.final.extinctions>0).length,
    occupancyTurnoverMedian:median(runs.map(r=>r.habitatOccupancyTurnover)),
    foodTurnoverMedian:median(runs.map(r=>r.habitatFoodTurnover)),
    dominantOccupiedChangesMedian:median(runs.map(r=>r.dominantOccupiedHabitatChanges)),
    dominantFoodChangesMedian:median(runs.map(r=>r.dominantFoodHabitatChanges)),
    productivityMeanRangeMedian:median(runs.map(r=>r.productivity.meanRange)),
    productivityRecoveryTransitionsMedian:median(runs.map(r=>r.productivity.recoveryTransitions)),
    maxPopulation:Math.max(...runs.map(r=>r.maxPopulation)),maxFood:Math.max(...runs.map(r=>r.maxFood)),
  };
}
function pairedScreen(control,candidate){
  const bySeed=new Map(control.map(r=>[r.seed,r]));
  const rows=candidate.map(r=>{
    const c=bySeed.get(r.seed);
    return {
      seed:r.seed,
      occupancyTurnoverRatio:c.habitatOccupancyTurnover?r.habitatOccupancyTurnover/c.habitatOccupancyTurnover:0,
      foodTurnoverRatio:c.habitatFoodTurnover?r.habitatFoodTurnover/c.habitatFoodTurnover:0,
      strategyRatio:c.final.strategyEffective?r.final.strategyEffective/c.final.strategyEffective:0,
      founderRootDelta:r.final.activeOriginalFounderRoots-c.final.activeOriginalFounderRoots,
      populationRatio:c.final.population?r.final.population/c.final.population:0,
    };
  });
  const agg={
    occupancyTurnoverRatioMedian:median(rows.map(r=>r.occupancyTurnoverRatio)),
    occupancyTurnoverPositiveSeeds:rows.filter(r=>r.occupancyTurnoverRatio>1).length,
    occupancyTurnoverAtLeast15PctSeeds:rows.filter(r=>r.occupancyTurnoverRatio>=1.15).length,
    foodTurnoverRatioMedian:median(rows.map(r=>r.foodTurnoverRatio)),
    foodTurnoverPositiveSeeds:rows.filter(r=>r.foodTurnoverRatio>1).length,
    foodTurnoverAtLeast20PctSeeds:rows.filter(r=>r.foodTurnoverRatio>=1.20).length,
    strategyRatioMedian:median(rows.map(r=>r.strategyRatio)),
    founderRootDeltaMedian:median(rows.map(r=>r.founderRootDelta)),
    populationRatioMedian:median(rows.map(r=>r.populationRatio)),
  };
  const numericGo=agg.occupancyTurnoverRatioMedian>=1.15&&agg.occupancyTurnoverPositiveSeeds>=4&&agg.foodTurnoverRatioMedian>=1.20&&agg.foodTurnoverPositiveSeeds>=4&&agg.strategyRatioMedian>=.80&&agg.founderRootDeltaMedian>=-1&&candidate.filter(r=>r.final.extinctions>0).length<=1;
  return {numericGo,aggregate:agg,rows};
}

function matrix(){
  const boundary=sourceBoundary();
  const structural=structuralControl();
  const results={};
  for(const profile of Object.keys(PROFILES))results[profile]=SEEDS.map(seed=>runOne(seed,profile));
  const aggregate=Object.fromEntries(Object.entries(results).map(([k,v])=>[k,aggregateProfile(v)]));
  const screens={};
  for(const profile of ['gentle','medium','strong'])screens[profile]=pairedScreen(results.control,results[profile]);
  return {format:'gloopipelago-post-m4-habitat-memory-probe',schema:1,status:'PASS',boundary,structural,seeds:SEEDS,profiles:PROFILES,aggregate,screens,results,claim:'Audit-only characterization. Numeric go screen does not authorize product implementation; temporal-pattern review remains required.'};
}

const cmd=process.argv[2]??'matrix';
if(cmd==='structural')console.log(JSON.stringify({format:'gloopipelago-m5a-structural-control',schema:1,status:'PASS',boundary:sourceBoundary(),structural:structuralControl()},null,2));
else if(cmd==='matrix')console.log(JSON.stringify(matrix(),null,2));
else throw new Error('Usage: node tools/m5a-habitat-memory-probe.mjs <structural|matrix>');
