import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Simulation } from '../src/core/v1-mirror.mjs';
import { createM4Simulation, M4_HABITATS } from '../src/core/m4-ecological-mosaic.mjs';
import { m4bPhenotypeVisual, m4bHabitatVisual, drawM4bHabitat, drawM4bBlob } from '../src/browser/m4b-visuals.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
const CORE_SHA='18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56';
const M4_SHA='b4539d91f31c8aa7b2a966244ad8e7b5c851698a7000ba3c3799c70611340c0e';
const M4Simulation=createM4Simulation(Simulation);
const DT=1/60;

function sourceBoundary(){
  const core=sha256(fs.readFileSync(path.join(ROOT,'src/core/v1-mirror.mjs')));
  const m4=sha256(fs.readFileSync(path.join(ROOT,'src/core/m4-ecological-mosaic.mjs')));
  assert.equal(core,CORE_SHA,'M4b changed protected maintained core');
  assert.equal(m4,M4_SHA,'M4b changed qualified M4a ecology layer');
  return {status:'PASS',coreSha256:core,m4Sha256:m4};
}

function mapping(){
  const base={speed:1.1,sense:85,size:5.5,eff:1,wander:.8,diet:0,hue:120};
  const lowSize=m4bPhenotypeVisual({...base,size:2.4});
  const highSize=m4bPhenotypeVisual({...base,size:9});
  assert(highSize.bodyRadius>lowSize.bodyRadius);
  assert(highSize.bodyLength>lowSize.bodyLength);
  assert(highSize.bodyWidth>lowSize.bodyWidth);

  const lowSpeed=m4bPhenotypeVisual({...base,speed:.35});
  const highSpeed=m4bPhenotypeVisual({...base,speed:1.9});
  assert(highSpeed.tailLength>lowSpeed.tailLength);
  assert(highSpeed.bodyLength>lowSpeed.bodyLength);

  const lowSense=m4bPhenotypeVisual({...base,sense:20});
  const highSense=m4bPhenotypeVisual({...base,sense:150});
  assert(highSense.senseLength>lowSense.senseLength);
  assert(highSense.senseHalfAngle>lowSense.senseHalfAngle);

  const diets=[];
  for(let i=0;i<=40;i++) diets.push(m4bPhenotypeVisual({...base,diet:-1+i/20}).dietHue);
  for(let i=1;i<diets.length;i++) assert(diets[i]<=diets[i-1],'diet hue mapping must be continuous monotonic');
  assert.notEqual(diets[0],diets.at(-1));

  const hueA=m4bPhenotypeVisual({...base,diet:.25,hue:15});
  const hueB=m4bPhenotypeVisual({...base,diet:.25,hue:215});
  assert.equal(hueA.dietHue,hueB.dietHue,'inherited hue stole primary diet color');
  assert.notEqual(hueA.accentHue,hueB.accentHue,'inherited hue does not affect accent');

  const dense=m4bHabitatVisual(M4_HABITATS.find(h=>h.regime==='dense'),1200,900);
  const diffuse=m4bHabitatVisual(M4_HABITATS.find(h=>h.regime==='diffuse'),1200,900);
  assert(dense.coreAlpha>diffuse.coreAlpha,'dense habitat must read stronger than diffuse');
  assert(dense.radius!==diffuse.radius,'qualified spread difference should remain visible');

  return {status:'PASS',size:{low:lowSize,high:highSize},speed:{low:lowSpeed,high:highSpeed},sense:{low:lowSense,high:highSense},dietHues:{a:diets[0],mid:diets[20],b:diets.at(-1)},accent:{a:hueA.accentHue,b:hueB.accentHue},habitat:{dense,diffuse}};
}

function noopContext(){
  const grad=()=>({addColorStop(){}});
  return {
    fillStyle:'',strokeStyle:'',lineWidth:1,lineCap:'butt',
    createRadialGradient:grad,beginPath(){},arc(){},fill(){},stroke(){},save(){},restore(){},translate(){},rotate(){},ellipse(){},moveTo(){},lineTo(){},
  };
}

function state(sim){
  return JSON.stringify({seed:sim.seed,width:sim.width,height:sim.height,simTime:sim.simTime,season:sim.season,nextId:sim.nextId,births:sim.births,deaths:sim.deaths,extinctions:sim.extinctions,rngState:sim.rngStream.snapshot(),blobs:sim.blobs,foods:sim.foods});
}

function renderM4b(ctx,sim){
  for(const h of M4_HABITATS) drawM4bHabitat(ctx,h,sim.width,sim.height);
  for(const b of sim.blobs) drawM4bBlob(ctx,b);
}

function runCadence(seed,cadence){
  const events=[];
  const sim=new M4Simulation({seed},{lifecycleWitness:r=>events.push(r)});
  const ctx=noopContext();
  const ticks=3600;
  for(let tick=1;tick<=ticks;tick++){
    sim.step(DT);
    if(cadence!==null&&tick%cadence===0) renderM4b(ctx,sim);
  }
  return {seed:seed>>>0,cadence,state:state(sim),rngState:sim.rngStream.snapshot(),events:JSON.stringify(events),eventCount:events.length,population:sim.blobs.length};
}

function causalNeutrality(){
  const seeds=[1,0x12345678,956866913];
  const cadences=[1,7,60];
  const rows=[];
  for(const seed of seeds){
    const control=runCadence(seed,null);
    for(const cadence of cadences){
      const drawn=runCadence(seed,cadence);
      assert.equal(drawn.state,control.state,`draw cadence ${cadence} changed full state for seed ${seed}`);
      assert.equal(drawn.rngState,control.rngState,`draw cadence ${cadence} changed RNG for seed ${seed}`);
      assert.equal(drawn.events,control.events,`draw cadence ${cadence} changed lifecycle sequence for seed ${seed}`);
      rows.push({seed:seed>>>0,cadence,eventCount:drawn.eventCount,population:drawn.population,rngState:drawn.rngState});
    }
  }
  return {status:'PASS',seeds:seeds.map(x=>x>>>0),cadences,ticks:3600,rows};
}

const receipt={format:'gloopipelago-m4b-presentation-semantics',schema:1,status:'PASS',sourceBoundary:sourceBoundary(),mapping:mapping(),causalNeutrality:causalNeutrality()};
console.log(JSON.stringify(receipt,null,2));
