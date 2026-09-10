import { Simulation } from '../src/core/v1-mirror.mjs';
import { createM4Simulation } from '../src/core/m4-ecological-mosaic.mjs';

const M4Simulation = createM4Simulation(Simulation);
const DT = 1/60;
const HORIZON = Number(process.env.M4A_HORIZON || 900);
const SEEDS = [1, 0x12345678, 956866913, 0x9e3779b9, 42424242];
const PROFILES = [
  { name:'lean', founderCount:54, initialFoodCount:225, foodRate:15.5 },
  { name:'area', founderCount:60, initialFoodCount:250, foodRate:17 },
  { name:'rich', founderCount:66, initialFoodCount:275, foodRate:18.5 },
];
const RANGES={speed:[.35,1.9],sense:[20,150],size:[2.4,9],eff:[.55,1.45],wander:[.15,1.5],diet:[-1,1]};
const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
const median=a=>{const s=[...a].sort((x,y)=>x-y),m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2};
const effective=counts=>{const n=counts.reduce((a,b)=>a+b,0);if(!n)return 0;let h=0;for(const c of counts)if(c){const p=c/n;h-=p*Math.log(p)}return Math.exp(h)};
const norm=(g,k)=>{const[a,b]=RANGES[k];return Math.max(0,Math.min(1,(g[k]-a)/(b-a)))};
function strategy(bs){const bins=new Map();for(const b of bs){const key=Object.keys(RANGES).map(k=>Math.min(2,Math.floor(norm(b.g,k)*3))).join('');bins.set(key,(bins.get(key)||0)+1)}return effective([...bins.values()])}
function occupied(sim){const C=12,R=9,s=new Set();for(const b of sim.blobs){const x=Math.min(C-1,Math.max(0,Math.floor(b.x/sim.width*C))),y=Math.min(R-1,Math.max(0,Math.floor(b.y/sim.height*R)));s.add(y*C+x)}return s.size/(C*R)}
function run(profile,seed){
  const roots=new Map();
  const witness=r=>{if(r.kind==='founder')roots.set(r.id,r.id);else if(r.kind==='birth')roots.set(r.id,roots.get(r.parentId)??r.parentId)};
  const sim=new M4Simulation({seed,founderCount:profile.founderCount,initialFoodCount:profile.initialFoodCount,foodRate:profile.foodRate},{lifecycleWitness:witness});
  const sample=[];
  for(let tick=1;tick<=HORIZON/DT;tick++){
    sim.step(DT);
    if(tick%(60/DT)===0) sample.push(sim.blobs.length);
  }
  const counts=new Map();
  for(const b of sim.blobs){const root=roots.get(b.id)??b.id;counts.set(root,(counts.get(root)||0)+1)}
  const lineageCounts=[...counts.values()];
  return {profile:profile.name,seed:seed>>>0,population:sim.blobs.length,populationTimeMean:mean(sample),occupiedFraction:occupied(sim),strategyEffective:strategy(sim.blobs),activeFounderRoots:counts.size,lineageEffective:effective(lineageCounts),topLineageShare:sim.blobs.length?Math.max(...lineageCounts)/sim.blobs.length:0,dietAbs:sim.snapshot().dietAbs,speed:sim.avg('speed'),sense:sim.avg('sense')};
}
const runs=[];for(const p of PROFILES)for(const seed of SEEDS)runs.push(run(p,seed));
const aggregate={};for(const p of PROFILES){const rs=runs.filter(r=>r.profile===p.name),v=k=>rs.map(x=>x[k]);aggregate[p.name]={populationMedian:median(v('population')),populationTimeMeanMedian:median(v('populationTimeMean')),occupiedFractionMedian:median(v('occupiedFraction')),strategyEffectiveMedian:median(v('strategyEffective')),activeFounderRootsMedian:median(v('activeFounderRoots')),lineageEffectiveMedian:median(v('lineageEffective')),topLineageShareMedian:median(v('topLineageShare')),dietAbsMedian:median(v('dietAbs')),speedMedian:median(v('speed')),senseMedian:median(v('sense'))}}
process.stdout.write(JSON.stringify({status:'M4A PRE-QUALIFICATION BUDGET SWEEP — NOT PRODUCT AUTHORITY',horizonSeconds:HORIZON,seeds:SEEDS.map(x=>x>>>0),profiles:PROFILES,aggregate,runs},null,2)+'\n');
