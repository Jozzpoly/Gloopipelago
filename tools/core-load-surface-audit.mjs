import { performance } from 'node:perf_hooks';
import { Simulation } from '../src/core/v1-mirror.mjs';
import { BROWSER_CONFIG, FIXED_DT } from './m0/lib.mjs';

function syntheticLoad(population, food, seed = 0xC0FFEE) {
  const sim = new Simulation({ seed, width:900, height:700, ...BROWSER_CONFIG, foodRate:0, foodLifetime:1e12 });
  sim.simTime = 100;
  sim.season = 2;
  sim.births = Math.max(0,population-34);
  sim.deaths = 0;
  sim.extinctions = 0;
  sim.nextId = population + 1;
  sim.blobs = Array.from({length:population},(_,i)=>({
    id:i+1,x:(37*i+23)%900,y:(53*i+31)%700,
    vx:0,vy:0,a:(i%31)/31*Math.PI*2,
    energy:1e12,age:0,generation:i%14,reproCooldown:1e12,
    g:{hue:(i*29)%360,speed:.45+(i%23)/20,sense:30+(i%121),size:2.5+(i%13)*.5,eff:.6+(i%17)*.04,wander:.2+(i%12)*.1,diet:-1+2*(i%41)/40}
  }));
  // Keep food far outside sensing/collision range so B×F traversal cost remains stable without consumption.
  sim.foods = Array.from({length:food},(_,i)=>({x:1000000+i*3,y:1000000+i*5,e:8,rich:false,kind:i%2,expiresAt:1e12}));
  sim.initial = sim.snapshot();
  return sim;
}

function measure(population, food, ticks=180, reps=3) {
  const rows=[];
  for(let rep=0;rep<reps;rep++){
    const sim=syntheticLoad(population,food,0xC0FFEE+rep);
    for(let i=0;i<30;i++) sim.step(FIXED_DT);
    const t0=performance.now();
    for(let i=0;i<ticks;i++) sim.step(FIXED_DT);
    const ms=performance.now()-t0;
    const stepsPerSecond=ticks/(ms/1000);
    rows.push({rep,ms,stepsPerSecond,equivalentRealtimeMultiplier:stepsPerSecond/60,finalPopulation:sim.blobs.length,finalFood:sim.foods.length});
  }
  const sorted=rows.map(r=>r.equivalentRealtimeMultiplier).sort((a,b)=>a-b);
  return {population,food,workProduct:population*food,ticks,reps:rows,medianRealtimeMultiplier:sorted[Math.floor(sorted.length/2)]};
}

const populations=[34,80,160,260];
const foods=[25,75,150,300,500];
const matrix=[];
for(const p of populations) for(const f of foods) matrix.push(measure(p,f));

const receipt={
  format:'gloopipelago-core-load-surface-audit',schema:1,
  matrix,
  interpretation:{
    targetRealtimeMultiplier:40,
    rowsAtOrAbove40:matrix.filter(r=>r.medianRealtimeMultiplier>=40).map(r=>({population:r.population,food:r.food,median:r.medianRealtimeMultiplier})),
    rowsBelow40:matrix.filter(r=>r.medianRealtimeMultiplier<40).map(r=>({population:r.population,food:r.food,median:r.medianRealtimeMultiplier})),
    warning:'Node/V8 synthetic traversal ceiling only; not a browser achieved-speed guarantee.'
  }
};
console.log(JSON.stringify(receipt,null,2));
