import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Simulation } from '../src/core/v1-mirror.mjs';
import { BROWSER_CONFIG, FIXED_DT, causalState, exactFingerprint } from './m0/lib.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const CORE=path.join(ROOT,'src/core/v1-mirror.mjs');
const APP=path.join(ROOT,'src/browser/app.mjs');
const SHELL=path.join(ROOT,'src/browser/shell-prefix.html');
const EXPECTED_CORE='18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56';
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');

function sourceBoundary(){
  const coreSha256=sha256(fs.readFileSync(CORE));
  assert.equal(coreSha256,EXPECTED_CORE,'x40 must preserve promoted M2a core byte-for-byte');
  const app=fs.readFileSync(APP,'utf8');
  const shell=fs.readFileSync(SHELL,'utf8');
  for(const specimen of [
    'const FIXED_DT_BROWSER=1/60',
    'const SCHEDULER_CPU_BUDGET_MS=6',
    'const MAX_WALL_DELTA_SECONDS=.05',
    'const MAX_SIM_BACKLOG_SECONDS=.25',
    'const FAST_RENDER_INTERVAL_MS=100',
    'function simulationPump()',
    'sim.step(FIXED_DT_BROWSER)',
    'resetSchedulerTiming()',
  ]) assert(app.includes(specimen),`missing x40 source boundary: ${specimen}`);
  assert(!app.includes('guard++<20'),'legacy RAF guard scheduler must not remain active');
  assert(!app.includes('acc+=raw*speedMul; const fixed=1/60'),'legacy RAF stepping must be removed');
  assert(shell.includes('max="40"'),'speed control must expose 40x target');
  assert(shell.includes('id="achievedSpeed"'),'achieved-speed UI must exist');
  for(const target of ['data-speed="1"','data-speed="4"','data-speed="10"','data-speed="20"','data-speed="40"']) assert(shell.includes(target),`missing speed preset ${target}`);
  return {status:'PASS',coreSha256};
}

const INTERVENTIONS=new Map([
  [240,{kind:'food',n:50}],
  [777,{kind:'pointer',n:18,around:{x:450,y:350}}],
  [1200,{kind:'catastrophe'}],
  [1601,{kind:'pointer',n:18,around:{x:123.456789123,y:612.345678901}}],
  [2357,{kind:'food',n:50}],
  [3000,{kind:'catastrophe'}],
]);

function applyIntervention(sim,item){
  if(item.kind==='food') sim.addFood(item.n);
  else if(item.kind==='pointer') sim.addFood(item.n,false,item.around);
  else if(item.kind==='catastrophe') sim.catastrophe();
  else throw new Error(`unknown intervention ${item.kind}`);
}

function run(seed,totalTicks,batchSize,withInterventions=false){
  const sim=new Simulation({seed,width:900,height:700,...BROWSER_CONFIG});
  let tick=0;
  while(tick<totalTicks){
    const end=Math.min(totalTicks,tick+batchSize);
    while(tick<end){
      if(withInterventions&&INTERVENTIONS.has(tick)) applyIntervention(sim,INTERVENTIONS.get(tick));
      sim.step(FIXED_DT);
      tick++;
    }
  }
  return {
    seed:seed>>>0,batchSize,
    fingerprint:exactFingerprint(causalState(sim)).sha256,
    rngState:sim.rngStream.snapshot(),
    snapshot:sim.snapshot(),
  };
}

function exactBatching(){
  const seeds=[1,0x12345678,956866913];
  const batchSizes=[1,7,20,40,120];
  const totalTicks=3600;
  const rows=[];
  for(const seed of seeds){
    const plainBase=run(seed,totalTicks,1,false);
    const interventionBase=run(seed,totalTicks,1,true);
    for(const batchSize of batchSizes){
      const plain=run(seed,totalTicks,batchSize,false);
      const intervention=run(seed,totalTicks,batchSize,true);
      assert.equal(plain.fingerprint,plainBase.fingerprint,`plain batch ${batchSize} changed causal state for ${seed}`);
      assert.equal(plain.rngState,plainBase.rngState,`plain batch ${batchSize} changed RNG for ${seed}`);
      assert.equal(intervention.fingerprint,interventionBase.fingerprint,`intervention batch ${batchSize} changed causal state for ${seed}`);
      assert.equal(intervention.rngState,interventionBase.rngState,`intervention batch ${batchSize} changed RNG for ${seed}`);
      rows.push({seed:seed>>>0,batchSize,plainFingerprint:plain.fingerprint,interventionFingerprint:intervention.fingerprint,plainRngState:plain.rngState,interventionRngState:intervention.rngState});
    }
  }
  return {status:'PASS',seeds,batchSizes,totalTicks,interventionTicks:[...INTERVENTIONS.keys()],semantics:'interventions commit immediately before the same numbered fixed step',rows};
}

const receipt={format:'gloopipelago-x40-causal-qualification',schema:1,sourceBoundary:sourceBoundary(),exactBatching:exactBatching(),status:'PASS'};
console.log(JSON.stringify(receipt,null,2));
