import { Simulation } from '../src/core/v1-mirror.mjs';

const DT=1/60,HORIZON=1800,SEEDS=[1,0x12345678,956866913];
const BASE={mutationScale:1,senseCost:.0026,digestExponent:3,minDigestion:.4,autoReseed:true,foodRate:10,foodEnergyScale:1,foodLifetime:75,dietJumpRate:.02,stableNiches:true};
const PATCHES={
  four:{0:[[.20,.25],[.32,.72]],1:[[.70,.24],[.82,.70]]},
  eight:{0:[[.14,.18],[.42,.18],[.18,.56],[.45,.78]],1:[[.70,.18],[.86,.42],[.68,.70],[.88,.80]]}
};
class MultiPatchSimulation extends Simulation{
  constructor(options,apparatus,layout){super(options,apparatus);this._auditLayout=layout}
  foodPatch(kind=null){
    const layout=this._auditLayout||'four', table=PATCHES[layout];
    const k=kind??(this.rng()<.5?0:1), list=table[k];
    const c=list[Math.floor(this.rng()*list.length)];
    const spread=Math.min(this.width,this.height)*.075;
    const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
    return{x:clamp(c[0]*this.width+this.rand(-spread,spread),8,this.width-8),y:clamp(c[1]*this.height+this.rand(-spread,spread),8,this.height-8),kind:k};
  }
}
const profiles=[
  {name:'four-patches-900',layout:'four',width:900,height:700,foodRate:10},
  {name:'eight-patches-900',layout:'eight',width:900,height:700,foodRate:10},
  {name:'eight-patches-1200-scaled',layout:'eight',width:1200,height:900,foodRate:16,extraFounders:34,extraFood:145}
];
const ranges={speed:[.35,1.9],sense:[20,150],size:[2.4,9],eff:[.55,1.45],wander:[.15,1.5],diet:[-1,1]};
const median=a=>{const s=[...a].sort((x,y)=>x-y),m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2};
function effective(c){const n=c.reduce((a,b)=>a+b,0);if(!n)return 0;let h=0;for(const x of c)if(x){const p=x/n;h-=p*Math.log(p)}return Math.exp(h)}
function norm(g,k){const[a,b]=ranges[k];return Math.max(0,Math.min(1,(g[k]-a)/(b-a)))}
function strategy(bs){const bins=new Map();for(const b of bs){const k=Object.keys(ranges).map(x=>Math.min(2,Math.floor(norm(b.g,x)*3))).join('');bins.set(k,(bins.get(k)||0)+1)}return{bins:bins.size,effective:effective([...bins.values()])}}
function occupancy(sim){const C=12,R=9,s=new Set();for(const b of sim.blobs)s.add(Math.min(R-1,Math.floor(b.y/sim.height*R))*C+Math.min(C-1,Math.floor(b.x/sim.width*C)));return s.size/(C*R)}
function run(p,seed){const roots=new Map();const witness=r=>{if(r.kind==='founder')roots.set(r.id,r.id);else if(r.kind==='birth')roots.set(r.id,roots.get(r.parentId)??r.parentId)};const sim=new MultiPatchSimulation({seed,width:p.width,height:p.height,...BASE,foodRate:p.foodRate},{lifecycleWitness:witness},p.layout);sim._auditLayout=p.layout;for(let i=0;i<(p.extraFounders||0);i++){const b=sim.spawnBlob();roots.set(b.id,b.id)}if(p.extraFood)sim.addFood(p.extraFood);for(let i=0;i<HORIZON/DT;i++)sim.step(DT);const rc=new Map();for(const b of sim.blobs){const r=roots.get(b.id)??b.id;rc.set(r,(rc.get(r)||0)+1)}const counts=[...rc.values()],st=strategy(sim.blobs),snap=sim.snapshot();return{profile:p.name,seed:seed>>>0,population:sim.blobs.length,births:sim.births,maxGeneration:snap.maxGeneration,dietAbs:snap.dietAbs,occupiedFraction:occupancy(sim),strategyBins:st.bins,strategyEffective:st.effective,activeFounderRoots:rc.size,lineageEffective:effective(counts),topLineageShare:sim.blobs.length?Math.max(...counts)/sim.blobs.length:0,speed:sim.avg('speed'),sense:sim.avg('sense')}}
const runs=[];for(const p of profiles)for(const seed of SEEDS)runs.push(run(p,seed));const aggregate={};for(const p of profiles){const rs=runs.filter(r=>r.profile===p.name),v=k=>rs.map(x=>x[k]);aggregate[p.name]={populationMedian:median(v('population')),occupiedFractionMedian:median(v('occupiedFraction')),strategyEffectiveMedian:median(v('strategyEffective')),strategyBinsMedian:median(v('strategyBins')),activeFounderRootsMedian:median(v('activeFounderRoots')),lineageEffectiveMedian:median(v('lineageEffective')),topLineageShareMedian:median(v('topLineageShare')),dietAbsMedian:median(v('dietAbs')),speedMedian:median(v('speed')),senseMedian:median(v('sense'))}}process.stdout.write(JSON.stringify({status:'EXPLORATORY MODEL PROBE — NOT PRODUCT AUTHORITY',horizonSeconds:HORIZON,seeds:SEEDS.map(x=>x>>>0),profiles,aggregate,runs},null,2)+'\n');