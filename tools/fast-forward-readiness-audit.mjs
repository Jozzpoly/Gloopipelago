import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { Simulation } from '../src/core/v1-mirror.mjs';
import { BROWSER_CONFIG, FIXED_DT, causalState, exactFingerprint } from './m0/lib.mjs';

const GUARD_STEPS = 20;
const RAW_CLAMP_SECONDS = 0.05;

function currentSchedulerFrame(acc, rawSeconds, speedMul) {
  const raw = Math.min(RAW_CLAMP_SECONDS, rawSeconds);
  acc += raw * speedMul;
  let steps = 0;
  while (acc >= FIXED_DT && steps < GUARD_STEPS) {
    acc -= FIXED_DT;
    steps++;
  }
  return { acc, steps, simulatedSeconds: steps * FIXED_DT };
}

function schedulerRun({ fps, speedMul, wallSeconds }) {
  const frames = Math.round(fps * wallSeconds);
  const raw = 1 / fps;
  let acc = 0;
  let simulatedSeconds = 0;
  let steps = 0;
  for (let i = 0; i < frames; i++) {
    const r = currentSchedulerFrame(acc, raw, speedMul);
    acc = r.acc;
    steps += r.steps;
    simulatedSeconds += r.simulatedSeconds;
  }
  return { fps, targetMultiplier:speedMul, wallSeconds, frames, steps, simulatedSeconds, achievedMultiplier:simulatedSeconds/wallSeconds, backlogSeconds:acc };
}

function schedulerMatrix() {
  const fpsValues = [30, 60, 90, 120, 144];
  const speedValues = [1, 4, 10, 20, 40];
  return fpsValues.flatMap(fps => speedValues.map(speedMul => schedulerRun({ fps, speedMul, wallSeconds:10 })));
}

function debtScenario() {
  const fps = 60;
  let acc = 0;
  let sim = 0;
  const phases = [];
  for (const phase of [{label:'40x-request',speedMul:40,wallSeconds:10},{label:'1x-after-40x',speedMul:1,wallSeconds:20}]) {
    const startAcc=acc,startSim=sim,frames=Math.round(fps*phase.wallSeconds);
    for(let i=0;i<frames;i++){
      const r=currentSchedulerFrame(acc,1/fps,phase.speedMul); acc=r.acc; sim+=r.simulatedSeconds;
    }
    phases.push({...phase,fps,simulatedSeconds:sim-startSim,achievedMultiplier:(sim-startSim)/phase.wallSeconds,backlogStartSeconds:startAcc,backlogEndSeconds:acc});
  }
  return phases;
}

function applyInterventions(sim, tick) {
  switch (tick) {
    case 240: sim.addFood(50); break;
    case 777: sim.addFood(18,false,{x:450,y:350}); break;
    case 1200: sim.catastrophe(); break;
    case 1601: sim.addFood(50); break;
    case 2357: sim.addFood(18,false,{x:130.25,y:611.75}); break;
    case 3000: sim.catastrophe(); break;
  }
}

function runExact(seed,totalTicks,batchSize,{interventions=false}={}) {
  const sim=new Simulation({seed,width:900,height:700,...BROWSER_CONFIG});
  let tick=0;
  while(tick<totalTicks){
    const n=Math.min(batchSize,totalTicks-tick);
    for(let i=0;i<n;i++){
      if(interventions) applyInterventions(sim,tick);
      sim.step(FIXED_DT);
      tick++;
    }
  }
  return {seed:seed>>>0,batchSize,fingerprint:exactFingerprint(causalState(sim)).sha256,rngState:sim.rngStream.snapshot(),snapshot:sim.snapshot()};
}

function batchEquivalence() {
  const seeds=[1,0x12345678,0x9E3779B9,956866913];
  const totalTicks=4800;
  const batchSizes=[1,4,20,40,120];
  const rows=[];
  for(const seed of seeds){
    const base=runExact(seed,totalTicks,1);
    for(const batchSize of batchSizes){
      const row=runExact(seed,totalTicks,batchSize);
      assert.equal(row.fingerprint,base.fingerprint,`batch ${batchSize} changed causal state for seed ${seed}`);
      assert.equal(row.rngState,base.rngState,`batch ${batchSize} changed RNG state for seed ${seed}`);
      rows.push(row);
    }
  }
  return {totalTicks,seeds,batchSizes,rows,status:'PASS'};
}

function interventionBatchEquivalence() {
  const seeds=[1,0x12345678,956866913];
  const totalTicks=3600;
  const batchSizes=[1,7,20,40,120];
  const interventionTicks=[240,777,1200,1601,2357,3000];
  const rows=[];
  for(const seed of seeds){
    const base=runExact(seed,totalTicks,1,{interventions:true});
    for(const batchSize of batchSizes){
      const row=runExact(seed,totalTicks,batchSize,{interventions:true});
      assert.equal(row.fingerprint,base.fingerprint,`intervention trace: batch ${batchSize} changed causal state for seed ${seed}`);
      assert.equal(row.rngState,base.rngState,`intervention trace: batch ${batchSize} changed RNG state for seed ${seed}`);
      rows.push(row);
    }
  }
  return {totalTicks,seeds,batchSizes,interventionTicks,semantics:'interventions applied immediately before the same numbered fixed step',rows,status:'PASS'};
}

function benchmarkNatural(seed,warmupTicks=1200,measuredTicks=2400){
  const sim=new Simulation({seed,width:900,height:700,...BROWSER_CONFIG});
  for(let i=0;i<warmupTicks;i++)sim.step(FIXED_DT);
  const start=sim.snapshot(),t0=performance.now();
  for(let i=0;i<measuredTicks;i++)sim.step(FIXED_DT);
  const ms=performance.now()-t0,end=sim.snapshot(),stepsPerSecond=measuredTicks/(ms/1000);
  return {kind:'natural',seed:seed>>>0,warmupTicks,measuredTicks,ms,stepsPerSecond,equivalentRealtimeMultiplier:stepsPerSecond/60,start:{time:start.time,population:start.population,food:start.food,maxGeneration:start.maxGeneration},end:{time:end.time,population:end.population,food:end.food,maxGeneration:end.maxGeneration}};
}

function syntheticHeavy(seed=0xC0FFEE){
  const sim=new Simulation({seed,width:900,height:700,...BROWSER_CONFIG});
  sim.simTime=100; sim.season=2; sim.births=166; sim.deaths=0; sim.extinctions=0; sim.nextId=201;
  sim.blobs=Array.from({length:200},(_,i)=>({id:i+1,x:(37*i+23)%900,y:(53*i+31)%700,vx:((i%11)-5)*1.7,vy:((i%13)-6)*1.4,a:(i%31)/31*Math.PI*2,energy:1e9,age:0,generation:i%14,reproCooldown:1e9,g:{hue:(i*29)%360,speed:.45+(i%23)/20,sense:30+(i%121),size:2.5+(i%13)*.5,eff:.6+(i%17)*.04,wander:.2+(i%12)*.1,diet:-1+2*(i%41)/40}}));
  sim.foods=Array.from({length:500},(_,i)=>({x:(71*i+17)%900,y:(47*i+19)%700,e:6+(i%13),rich:false,kind:i%2,expiresAt:1e12}));
  sim.initial=sim.snapshot();
  return sim;
}

function benchmarkHeavy(measuredTicks=300){
  const reps=[];
  for(let rep=0;rep<3;rep++){
    const sim=syntheticHeavy(0xC0FFEE+rep);
    for(let i=0;i<20;i++)sim.step(FIXED_DT);
    const t0=performance.now(); for(let i=0;i<measuredTicks;i++)sim.step(FIXED_DT); const ms=performance.now()-t0;
    const stepsPerSecond=measuredTicks/(ms/1000);
    reps.push({rep,ms,stepsPerSecond,equivalentRealtimeMultiplier:stepsPerSecond/60,population:sim.blobs.length,food:sim.foods.length});
  }
  return {kind:'synthetic-heavy',population:200,initialFood:500,measuredTicks,reps};
}

function throughput(){return {natural:[1,0x12345678,956866913].map(seed=>benchmarkNatural(seed)),heavy:benchmarkHeavy(),note:'Node/V8 core throughput only; browser rendering/compositing are not included.'};}

const matrix=schedulerMatrix();
const x40at60=matrix.find(r=>r.fps===60&&r.targetMultiplier===40);
assert(x40at60.achievedMultiplier<=20.01,'current scheduler unexpectedly exceeds 20x guard ceiling at 60 Hz');
assert(x40at60.backlogSeconds>0,'x40 at 60 Hz should accumulate backlog under current scheduler');

const receipt={format:'gloopipelago-fast-forward-readiness-audit',schema:2,currentScheduler:{guardSteps:GUARD_STEPS,rawClampSeconds:RAW_CLAMP_SECONDS,fixedDt:FIXED_DT,matrix,debtScenario:debtScenario()},fixedStepBatching:batchEquivalence(),interventionTraceBatching:interventionBatchEquivalence(),throughput:throughput(),interpretation:{x40CurrentRafLoop:'NOT CAPABLE RELIABLY',fixedDtBatching:'EXACT FOR EQUIVALENT STEP ORDER',interventionTraceBatching:'EXACT WHEN INTERVENTIONS COMMIT AT THE SAME FIXED-STEP BOUNDARIES',nextEvidenceNeed:'qualify a decoupled fast-forward scheduler with bounded input latency, achieved-speed reporting and browser responsiveness'}};
console.log(JSON.stringify(receipt,null,2));
