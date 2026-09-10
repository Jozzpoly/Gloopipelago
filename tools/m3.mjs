import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { Simulation } from '../src/core/v1-mirror.mjs';
import {
  LOGICAL_WORLD_WIDTH,
  LOGICAL_WORLD_HEIGHT,
  POINTER_WORLD_QUANTUM,
  computeViewTransform,
  worldToView,
  viewToWorld,
} from '../src/browser/view-transform.mjs';
import {
  BROWSER_CONFIG,
  FIXED_DT,
  causalState,
  exactFingerprint,
  firstDiff,
} from './m0/lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CORE = path.join(ROOT, 'src/core/v1-mirror.mjs');
const APP = path.join(ROOT, 'src/browser/app.mjs');
const BUILDER = path.join(ROOT, 'tools/build-standalone.mjs');
const OUT = path.join(ROOT, 'dist/gloopipelago.html');
const EXPECTED_M2A_CORE_SHA256 = '18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56';
const TICKS = 2400;

const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');

function sourceBoundary() {
  const coreSha256 = sha256(fs.readFileSync(CORE));
  assert.equal(coreSha256, EXPECTED_M2A_CORE_SHA256, 'M3 must preserve the promoted M2a core byte-for-byte');
  assert.equal(LOGICAL_WORLD_WIDTH, 900);
  assert.equal(LOGICAL_WORLD_HEIGHT, 700);
  assert.equal(POINTER_WORLD_QUANTUM, 1e-9);

  const app = fs.readFileSync(APP, 'utf8');
  const builder = fs.readFileSync(BUILDER, 'utf8');
  assert(!app.includes('sim.setSize('), 'Browser resize must not retain logical-world resize authority');
  assert(app.includes('width:LOGICAL_WORLD_WIDTH,height:LOGICAL_WORLD_HEIGHT'), 'Browser world construction must use canonical logical geometry');
  assert(app.includes('view=computeViewTransform(W,H)'), 'Browser resize must recompute presentation transform');
  assert(app.includes('const worldPoint=viewToWorld('), 'Pointer intervention must map through view -> world');
  assert(app.includes('if(worldPoint) sim.addFood(18,false,worldPoint)'), 'Letterbox pointer must be a no-op');
  assert(builder.includes("src/browser/view-transform.mjs"), 'Standalone build must own the view-transform source');

  return { coreSha256, appBoundary: 'PASS', builderBoundary: 'PASS' };
}

function canonicalPoint(x, y) {
  const t = computeViewTransform(LOGICAL_WORLD_WIDTH, LOGICAL_WORLD_HEIGHT);
  const p = viewToWorld(...Object.values(worldToView(x, y, t)), t);
  assert(p);
  return p;
}

function transformSpecimens() {
  const views = [
    { id:'exact', width:900, height:700 },
    { id:'wide', width:1400, height:800 },
    { id:'compact', width:390, height:600 },
    { id:'ultrawide', width:1920, height:600 },
    { id:'portrait', width:600, height:1200 },
  ];
  const points = [
    [0,0], [900,700], [450,350], [123.456789123,612.345678901], [899.999999999,0.000000001],
  ];

  const rows = [];
  for (const v of views) {
    const t = computeViewTransform(v.width, v.height);
    assert(t.scale > 0);
    assert(Math.abs(t.displayWidth / LOGICAL_WORLD_WIDTH - t.displayHeight / LOGICAL_WORLD_HEIGHT) < 1e-15, `${v.id} non-uniform transform`);
    for (const [x,y] of points) {
      const expected = canonicalPoint(x,y);
      const vp = worldToView(x,y,t);
      const back = viewToWorld(vp.x,vp.y,t);
      assert.deepEqual(back, expected, `${v.id} round-trip ${x},${y}`);
      rows.push({ view:v.id, logical:[x,y], canonical:[back.x,back.y], viewPoint:[vp.x,vp.y] });
    }
  }

  const wide = computeViewTransform(1400,800);
  const compact = computeViewTransform(390,600);
  assert.equal(viewToWorld(0,400,wide), null, 'wide pillarbox click must be outside world');
  assert.equal(viewToWorld(1399,400,wide), null, 'wide opposite pillarbox click must be outside world');
  assert.equal(viewToWorld(195,0,compact), null, 'compact top letterbox click must be outside world');
  assert.equal(viewToWorld(195,599,compact), null, 'compact bottom letterbox click must be outside world');
  assert.equal(viewToWorld(0,0,computeViewTransform(0,0)), null, 'zero-area view must not create world coordinates');

  return { views, points:points.length, rows, outsideSpace:'PASS' };
}

const HISTORIES = [
  { id:'stable-wide', initial:[1400,800], resizes:[] },
  { id:'stable-compact', initial:[390,600], resizes:[] },
  { id:'wide-compact-wide', initial:[1400,800], resizes:[[400,390,600],[1300,1400,800]] },
  { id:'compact-wide-compact', initial:[390,600], resizes:[[400,1400,800],[1300,390,600]] },
  { id:'desktop-portrait-desktop', initial:[1100,800], resizes:[[700,600,1200],[1700,1100,800]] },
];

const POINTERS = [
  { boundary:300, logical:[450,350] },
  { boundary:900, logical:[123.456789123,612.345678901] },
  { boundary:1500, logical:[899.999999999,0.000000001] },
  { boundary:2100, logical:[77.125000001,101.875000001] },
];

function runHistory(seed, history) {
  const events = [];
  const sim = new Simulation(
    { seed, width:LOGICAL_WORLD_WIDTH, height:LOGICAL_WORLD_HEIGHT, ...BROWSER_CONFIG },
    { lifecycleWitness: e => events.push(e) },
  );
  let rngCalls = 0;
  const baseRng = sim.rng;
  sim.rng = () => { rngCalls++; return baseRng(); };

  let transform = computeViewTransform(...history.initial);
  const resizes = new Map(history.resizes.map(([boundary,width,height]) => [boundary,[width,height]]));
  const pointers = new Map(POINTERS.map(p => [p.boundary,p.logical]));
  const resizeDeltas = [];

  for (let tick=0; tick<TICKS; tick++) {
    if (resizes.has(tick)) {
      const before = exactFingerprint(causalState(sim)).sha256;
      transform = computeViewTransform(...resizes.get(tick));
      const after = exactFingerprint(causalState(sim)).sha256;
      assert.equal(after,before,`${history.id} resize gained causal authority at ${tick}`);
      resizeDeltas.push({ boundary:tick, before, after, equal:before===after });
    }

    if (pointers.has(tick)) {
      const [x,y] = pointers.get(tick);
      const expected = canonicalPoint(x,y);
      const viewPoint = worldToView(x,y,transform);
      const mapped = viewToWorld(viewPoint.x,viewPoint.y,transform);
      assert.deepEqual(mapped,expected,`${history.id} pointer mapping at ${tick}`);
      sim.addFood(18,false,mapped);
    }

    sim.step(FIXED_DT);
  }

  return {
    id:history.id,
    seed:seed>>>0,
    final:exactFingerprint(causalState(sim)).sha256,
    rngState:sim.rngStream.snapshot(),
    rngCalls,
    lifecycle:exactFingerprint(events).sha256,
    lifecycleEvents:events.length,
    births:sim.births,
    deaths:sim.deaths,
    population:sim.blobs.length,
    food:sim.foods.length,
    resizeDeltas,
  };
}

function viewportInvariance() {
  const seeds = [1,0x12345678,0x9E3779B9,956866913];
  const out = [];
  for (const seed of seeds) {
    const rows = HISTORIES.map(h => runHistory(seed,h));
    const ref = rows[0];
    for (const row of rows.slice(1)) {
      assert.equal(row.final,ref.final,`seed ${seed} full causal state differs: ${row.id}`);
      assert.equal(row.rngState,ref.rngState,`seed ${seed} RNG state differs: ${row.id}`);
      assert.equal(row.rngCalls,ref.rngCalls,`seed ${seed} RNG call topology differs: ${row.id}`);
      assert.equal(row.lifecycle,ref.lifecycle,`seed ${seed} lifecycle differs: ${row.id}`);
    }
    out.push({ seed:seed>>>0, reference:ref.id, final:ref.final, rngState:ref.rngState, rngCalls:ref.rngCalls, lifecycle:ref.lifecycle, histories:rows });
  }
  return { seeds, histories:HISTORIES.map(h=>h.id), ticks:TICKS, pointers:POINTERS, runs:seeds.length*HISTORIES.length, results:out };
}

function runBuild() {
  const r = spawnSync(process.execPath,['tools/build-standalone.mjs','build'],{cwd:ROOT,encoding:'utf8'});
  assert.equal(r.status,0,`standalone build failed: ${r.stderr || r.stdout}`);
  const receipt = JSON.parse(r.stdout);
  assert.equal(receipt.coreSha256,EXPECTED_M2A_CORE_SHA256);
  assert.equal(receipt.syntaxCheck,'PASS');
  assert.equal(receipt.standaloneNoExternalScript,true);
  return receipt;
}

async function domSmoke() {
  const build = runBuild();
  const html = fs.readFileSync(OUT,'utf8');
  const open = html.indexOf('<script type="module">');
  const start = open + '<script type="module">'.length;
  const end = html.indexOf('</script>',start);
  assert(open>=0 && end>start,'inline module missing');
  const js = html.slice(start,end);

  const ids=['world','overlay','pause','burst','catastrophe','reset','newSeed','pop','gen','food','age','seed','births','speed','speedLabel','avgSpeed','avgSense','avgSize','avgEff','avgDiet'];
  const elements={};
  const listeners={};
  const transforms=[];
  const ctx={
    setTransform(...args){transforms.push(args)},clearRect(){},beginPath(){},arc(){},fill(){},stroke(){},moveTo(){},lineTo(){},
    createRadialGradient(){return{addColorStop(){}}}
  };
  for(const id of ids) elements[id]={id,textContent:'',innerHTML:'',value:id==='speed'?'1':'',onclick:null,oninput:null,addEventListener(type,fn){listeners[id+':'+type]=fn;}};
  const canvas=elements.world;
  canvas.width=0;canvas.height=0;
  canvas.getContext=()=>ctx;
  let rect={width:1400,height:800,left:0,top:0};
  canvas.getBoundingClientRect=()=>({...rect});

  globalThis.document={getElementById:id=>elements[id],querySelectorAll:sel=>sel==='[id]'?Object.values(elements):[]};
  globalThis.devicePixelRatio=1;
  globalThis.addEventListener=(type,fn)=>{listeners['global:'+type]=fn};
  const raf=[];
  globalThis.requestAnimationFrame=fn=>{raf.push(fn);return raf.length};

  const originalRandom=Math.random;
  Math.random=()=>0.123456789;
  const url='data:text/javascript;base64,'+Buffer.from(js).toString('base64')+`#m3-${Date.now()}`;
  await import(url);
  assert.equal(typeof listeners['global:resize'],'function');
  assert.equal(typeof listeners['world:pointerdown'],'function');
  assert.equal(typeof elements.pause.onclick,'function');
  assert(raf.length>=1,'animation frame not scheduled');

  let now=performance.now();
  raf.shift()(now+1);
  elements.pause.onclick();
  assert.equal(elements.pause.textContent,'Wznów');
  const initial={population:Number(elements.pop.textContent),food:Number(elements.food.textContent),seed:elements.seed.textContent};
  assert(initial.population>0 && initial.food>0,'world did not render');

  rect={width:390,height:600,left:0,top:0};
  globalThis.devicePixelRatio=2;
  listeners['global:resize']();
  assert.equal(canvas.width,780);assert.equal(canvas.height,1200);
  raf.shift()(now+2);
  assert.deepEqual({population:Number(elements.pop.textContent),food:Number(elements.food.textContent),seed:elements.seed.textContent},initial,'paused compact resize changed visible world state');
  const compactTransform=transforms.at(-1);
  assert(Math.abs(compactTransform[0]-(2*390/900))<1e-12,'compact contain scale incorrect');
  assert(compactTransform[5]>0,'compact view should letterbox vertically');

  listeners['world:pointerdown']({clientX:195,clientY:10});
  raf.shift()(now+3);
  assert.equal(Number(elements.food.textContent),initial.food,'compact letterbox click changed food');
  listeners['world:pointerdown']({clientX:195,clientY:300});
  raf.shift()(now+4);
  assert.equal(Number(elements.food.textContent),initial.food+18,'compact logical-center pointer did not add exactly 18 food');

  const afterCompactFood=Number(elements.food.textContent);
  rect={width:1400,height:800,left:0,top:0};
  globalThis.devicePixelRatio=1.5;
  listeners['global:resize']();
  assert.equal(canvas.width,2100);assert.equal(canvas.height,1200);
  raf.shift()(now+5);
  assert.equal(Number(elements.food.textContent),afterCompactFood,'paused wide/DPR resize changed food');
  const wideTransform=transforms.at(-1);
  assert(wideTransform[4]>0,'wide view should pillarbox horizontally');

  listeners['world:pointerdown']({clientX:10,clientY:400});
  raf.shift()(now+6);
  assert.equal(Number(elements.food.textContent),afterCompactFood,'wide pillarbox click changed food');
  listeners['world:pointerdown']({clientX:700,clientY:400});
  raf.shift()(now+7);
  assert.equal(Number(elements.food.textContent),afterCompactFood+18,'wide logical-center pointer did not add exactly 18 food');

  const seedBeforeReset=elements.seed.textContent;
  elements.reset.onclick();
  raf.shift()(now+8);
  assert.equal(elements.seed.textContent,seedBeforeReset,'reset changed seed');
  assert.equal(Number(elements.food.textContent),145,'reset did not restore canonical initial food');

  Math.random=()=>0.987654321;
  elements.newSeed.onclick();
  raf.shift()(now+9);
  assert.notEqual(elements.seed.textContent,seedBeforeReset,'new seed control did not change seed');
  assert.equal(Number(elements.pop.textContent),34,'new seed did not start canonical founder population');

  Math.random=originalRandom;
  return {
    status:'PASS',
    build,
    initial,
    compact:{canvas:[780,1200],letterboxNoop:true,centerFoodDelta:18},
    wide:{canvas:[2100,1200],pillarboxNoop:true,centerFoodDelta:18,dpr:1.5},
    reset:'PASS',
    newSeed:'PASS',
    claim:'Node DOM/canvas/controller contract smoke; not real-browser Owner evidence.',
  };
}

async function qualify() {
  const receipt = {
    format:'gloopipelago-m3-world-view-qualification',
    schema:1,
    sourceBoundary:sourceBoundary(),
    transform:transformSpecimens(),
    viewportInvariance:viewportInvariance(),
    dom:await domSmoke(),
  };
  console.log(JSON.stringify(receipt,null,2));
}

const cmd=process.argv[2]??'help';
if(cmd==='qualify') await qualify();
else if(cmd==='transform') console.log(JSON.stringify(transformSpecimens(),null,2));
else if(cmd==='viewport') console.log(JSON.stringify(viewportInvariance(),null,2));
else if(cmd==='dom-smoke') console.log(JSON.stringify(await domSmoke(),null,2));
else console.log('Usage: node tools/m3.mjs <qualify|transform|viewport|dom-smoke>');
