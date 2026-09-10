import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

const SELF = fileURLToPath(import.meta.url);
const INVESTIGATE_RATIO = 1.25;

function median(values) {
  const a=[...values].sort((x,y)=>x-y);
  return a[Math.floor(a.length/2)];
}

function extractInline(html) {
  const open=html.indexOf('<script type="module">');
  const start=open+'<script type="module">'.length;
  const end=html.indexOf('</script>',start);
  assert(open>=0 && end>start,'inline module missing');
  return html.slice(start,end);
}

function syntheticWorld(sim) {
  sim.width=900;sim.height=700;sim.simTime=100;sim.season=2;sim.births=166;sim.deaths=0;sim.extinctions=0;sim.nextId=201;
  sim.blobs=Array.from({length:200},(_,i)=>({
    id:i+1,
    x:(37*i+23)%900,
    y:(53*i+31)%700,
    vx:((i%11)-5)*1.7,
    vy:((i%13)-6)*1.4,
    a:(i%31)/31*Math.PI*2,
    energy:55+(i%80),
    age:(i%120)+.25,
    generation:i%14,
    reproCooldown:(i%7)*.2,
    g:{
      hue:(i*29)%360,
      speed:.45+(i%23)/20,
      sense:30+(i%121),
      size:2.5+(i%13)*.5,
      eff:.6+(i%17)*.04,
      wander:.2+(i%12)*.1,
      diet:-1+2*(i%41)/40,
    },
  }));
  sim.foods=Array.from({length:500},(_,i)=>({
    x:(71*i+17)%900,
    y:(47*i+19)%700,
    e:6+(i%13),
    rich:i%17===0,
    kind:i%17===0?-1:i%2,
    expiresAt:175,
  }));
  sim.initial=sim.snapshot();
}

async function worker(htmlPath,frames,warmup) {
  let js=extractInline(fs.readFileSync(htmlPath,'utf8'));
  assert(js.includes('let sim;'),'controller sim seam missing');
  js=js.replace('let sim;','let sim; globalThis.__m3PerfSim=()=>sim;');

  const ids=['world','overlay','pause','burst','catastrophe','reset','newSeed','pop','gen','food','age','seed','births','speed','speedLabel','avgSpeed','avgSense','avgSize','avgEff','avgDiet'];
  const elements={};const listeners={};
  const ctx={setTransform(){},clearRect(){},beginPath(){},arc(){},fill(){},stroke(){},moveTo(){},lineTo(){},createRadialGradient(){return{addColorStop(){}}}};
  for(const id of ids) elements[id]={id,textContent:'',innerHTML:'',value:id==='speed'?'1':'',onclick:null,oninput:null,addEventListener(type,fn){listeners[id+':'+type]=fn;}};
  const canvas=elements.world;canvas.width=0;canvas.height=0;canvas.getContext=()=>ctx;canvas.getBoundingClientRect=()=>({width:900,height:700,left:0,top:0});
  globalThis.document={getElementById:id=>elements[id],querySelectorAll:sel=>sel==='[id]'?Object.values(elements):[]};
  globalThis.devicePixelRatio=1;
  globalThis.addEventListener=(type,fn)=>{listeners['global:'+type]=fn};
  const raf=[];globalThis.requestAnimationFrame=fn=>{raf.push(fn);return raf.length};
  Math.random=()=>0.123456789;

  await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64')+`#perf-${Date.now()}-${Math.random()}`);
  const sim=globalThis.__m3PerfSim();assert(sim,'simulation unavailable');
  syntheticWorld(sim);
  elements.pause.onclick();assert.equal(elements.pause.textContent,'Wznów');

  let now=performance.now();
  function drawOne(){const fn=raf.shift();assert.equal(typeof fn,'function');fn(++now);}
  for(let i=0;i<warmup;i++)drawOne();
  const t0=performance.now();
  for(let i=0;i<frames;i++)drawOne();
  const ms=performance.now()-t0;
  console.log(JSON.stringify({frames,warmup,ms,framesPerSecond:frames/(ms/1000),population:sim.blobs.length,food:sim.foods.length}));
}

function one(htmlPath,frames,warmup) {
  const r=spawnSync(process.execPath,[SELF,'worker',htmlPath,String(frames),String(warmup)],{encoding:'utf8'});
  assert.equal(r.status,0,r.stderr||r.stdout);
  return JSON.parse(r.stdout.trim());
}

function compare(baseline,candidate) {
  const frames=1200,warmup=250,reps=7,rows=[];
  for(let rep=0;rep<reps;rep++){
    const order=rep%2===0?['baseline','candidate']:['candidate','baseline'];
    const row={rep};
    for(const which of order) row[which]=one(which==='baseline'?baseline:candidate,frames,warmup);
    rows.push(row);
  }
  const baselineMs=median(rows.map(r=>r.baseline.ms));
  const candidateMs=median(rows.map(r=>r.candidate.ms));
  const pairedRatios=rows.map(r=>r.candidate.ms/r.baseline.ms);
  const pairedMedianRatio=median(pairedRatios);
  const status=pairedMedianRatio<=INVESTIGATE_RATIO?'PASS':'INVESTIGATE';
  if(status!=='PASS') throw new Error(`M3 render-controller median paired frame-time ratio ${pairedMedianRatio.toFixed(4)} exceeds predeclared ${INVESTIGATE_RATIO}`);
  console.log(JSON.stringify({
    format:'gloopipelago-m3-render-controller-performance',schema:1,status,
    baseline:path.resolve(baseline),candidate:path.resolve(candidate),frames,warmup,reps,
    workload:{population:200,food:500,senseRings:200,viewport:[900,700],paused:true},
    predeclaredInvestigateRatio:INVESTIGATE_RATIO,
    medianMs:{baseline:baselineMs,candidate:candidateMs},
    pairedMedianFrameTimeRatio:pairedMedianRatio,
    pairedRatios,rows,
    claim:'Node/no-op-canvas JS render-controller sentinel only. Real-browser achieved 4x remains a separate Owner promotion gate.'
  },null,2));
}

const cmd=process.argv[2]??'help';
if(cmd==='worker') await worker(process.argv[3],Number(process.argv[4]),Number(process.argv[5]));
else if(cmd==='compare') compare(process.argv[3],process.argv[4]);
else console.log('Usage: node tools/m3-performance.mjs <compare baseline.html candidate.html|worker html frames warmup>');
