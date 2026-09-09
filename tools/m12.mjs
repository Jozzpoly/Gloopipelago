import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE = path.join(ROOT, 'archive/v1/gloopipelago_single.html');
const CORE = path.join(ROOT, 'src/core/v1-mirror.mjs');
const OUT = path.join(ROOT, 'dist/gloopipelago.html');
const RECEIPT = path.join(ROOT, 'evidence/m1/m1_2_build_receipt.json');
const DOM_SMOKE_RECEIPT = path.join(ROOT, 'evidence/m1/m1_2_node_dom_smoke.json');
const START = 'function mulberry32(seed) {';
const UI = "const canvas = document.getElementById('world');";
const sha256 = b => crypto.createHash('sha256').update(b).digest('hex');

function splitTemplate(text) {
  const start = text.indexOf(START);
  const ui = text.indexOf(UI);
  assert(start >= 0 && ui > start, 'V1 template anchors missing or reordered');
  return { prefix:text.slice(0,start), legacyCore:text.slice(start,ui), suffix:text.slice(ui) };
}

function buildText() {
  const template = fs.readFileSync(TEMPLATE, 'utf8');
  const core = fs.readFileSync(CORE, 'utf8').trimEnd() + '\n\n';
  const {prefix,suffix} = splitTemplate(template);
  return { text:prefix + core + suffix, template, core, prefix, suffix };
}

function extractGeneratedCore(text) {
  const start = text.indexOf('// Maintained V1-compatible core.');
  const ui = text.indexOf(UI);
  assert(start >= 0 && ui > start, 'Generated core/UI anchors missing');
  return text.slice(start, ui);
}

function verifyStatic(text, expectedCore, prefix, suffix) {
  const generated = splitTemplate(fs.readFileSync(TEMPLATE,'utf8'));
  assert(text.startsWith(prefix), 'Generated prefix differs from frozen V1 shell');
  assert(text.endsWith(suffix), 'Generated suffix differs from frozen V1 shell');
  assert.equal(extractGeneratedCore(text), expectedCore, 'Injected maintained core differs byte-for-byte');
  assert.equal(generated.prefix, prefix);
  assert.equal(generated.suffix, suffix);

  const markers = [
    'id="pause"','id="burst"','id="catastrophe"','id="reset"','id="newSeed"',
    'id="speed" type="range" min="0.25" max="4" step="0.25" value="1"',
    'new Simulation({seed,width:W,height:H,digestExponent:3,minDigestion:.4,foodRate:10,foodLifetime:75,dietJumpRate:.02,stableNiches:true})',
    "ui.speed.oninput=e=>{speedMul=+e.target.value;ui.speedLabel.textContent=speedMul+'×'};",
    "ui.pause.onclick=()=>{paused=!paused;",
    "ui.burst.onclick=()=>sim.addFood(50);",
    "ui.catastrophe.onclick=()=>sim.catastrophe();",
    "ui.reset.onclick=()=>startWorld(seed);",
    "ui.newSeed.onclick=()=>startWorld((Math.random()*0xffffffff)>>>0);"
  ];
  for (const marker of markers) assert(text.includes(marker), `Missing V1 product marker: ${marker}`);
  assert(text.includes('requestAnimationFrame(frame);'), 'Animation loop missing');
  assert(text.includes('<script type="module">'), 'Inline module shell missing');
  assert(!text.includes('src="'), 'Standalone artifact unexpectedly references external script');
}

function syntaxCheck(text) {
  const open = text.indexOf('<script type="module">');
  const start = open + '<script type="module">'.length;
  const end = text.indexOf('</script>', start);
  assert(open >= 0 && end > start, 'Inline module not found');
  const tmp = path.join(ROOT, '.m12-inline-check.mjs');
  fs.writeFileSync(tmp, text.slice(start,end));
  const r = spawnSync(process.execPath, ['--check', tmp], {encoding:'utf8'});
  fs.rmSync(tmp,{force:true});
  assert.equal(r.status,0,`Inline module syntax failed: ${r.stderr || r.stdout}`);
}

function makeReceipt({text,template,core,prefix,suffix}) {
  return {
    format:'gloopipelago-m1-2-build-receipt', schema:1,
    generator:'tools/m12.mjs',
    template:'archive/v1/gloopipelago_single.html',
    maintainedCore:'src/core/v1-mirror.mjs',
    output:'dist/gloopipelago.html',
    templateSha256:sha256(Buffer.from(template)),
    maintainedCoreSha256:sha256(Buffer.from(fs.readFileSync(CORE))),
    prefixSha256:sha256(Buffer.from(prefix)), suffixSha256:sha256(Buffer.from(suffix)),
    outputSha256:sha256(Buffer.from(text)), outputBytes:Buffer.byteLength(text),
    exactCoreInjection:extractGeneratedCore(text)===core,
    exactFrozenPrefix:true, exactFrozenSuffix:true,
    standaloneNoExternalScript:!text.includes('src="'),
    syntaxCheck:'PASS'
  };
}


async function domContractSmoke() {
  assert(fs.existsSync(OUT),'Generated artifact missing; run build first');
  const html=fs.readFileSync(OUT,'utf8');
  const open=html.indexOf('<script type="module">');
  const start=open+'<script type="module">'.length;
  const end=html.indexOf('</script>',start);
  const js=html.slice(start,end);

  const ids=['world','overlay','pause','burst','catastrophe','reset','newSeed','pop','gen','food','age','seed','births','speed','speedLabel','avgSpeed','avgSense','avgSize','avgEff','avgDiet'];
  const elements={};
  const listeners={};
  const ctx={
    setTransform(){},clearRect(){},beginPath(){},arc(){},fill(){},stroke(){},moveTo(){},lineTo(){},
    createRadialGradient(){return{addColorStop(){}}}
  };
  for(const id of ids) elements[id]={id,textContent:'',innerHTML:'',value:id==='speed'?'1':'',onclick:null,oninput:null,addEventListener(type,fn){listeners[id+':'+type]=fn;}};
  const canvas=elements.world;
  canvas.width=0;canvas.height=0;
  canvas.getContext=()=>ctx;
  canvas.getBoundingClientRect=()=>({width:900,height:700,left:0,top:0});

  globalThis.document={getElementById:id=>elements[id],querySelectorAll:sel=>sel==='[id]'?Object.values(elements):[]};
  globalThis.devicePixelRatio=1;
  globalThis.addEventListener=(type,fn)=>{listeners['global:'+type]=fn};
  const raf=[];
  globalThis.requestAnimationFrame=fn=>{raf.push(fn);return raf.length};

  const originalRandom=Math.random;
  Math.random=()=>0.123456789;
  const url='data:text/javascript;base64,'+Buffer.from(js).toString('base64');
  await import(url);
  assert.equal(typeof elements.pause.onclick,'function');
  assert.equal(typeof elements.speed.oninput,'function');
  assert.equal(typeof listeners['world:pointerdown'],'function');
  assert(raf.length>=1,'Animation frame was not scheduled');

  const t0=performance.now();
  raf.shift()(t0+20);
  const initialPop=Number(elements.pop.textContent);
  const initialFood=Number(elements.food.textContent);
  assert(initialPop>0,'World did not boot with population');
  assert(initialFood>0,'World did not boot with food');

  elements.speed.oninput({target:{value:'4'}});
  assert.equal(elements.speedLabel.textContent,'4×');
  elements.pause.onclick();
  assert.equal(elements.pause.textContent,'Wznów');
  elements.pause.onclick();
  assert.equal(elements.pause.textContent,'Pauza');
  elements.burst.onclick();
  const next=raf.shift(); assert.equal(typeof next,'function'); next(t0+40);
  assert(Number(elements.food.textContent)>initialFood,'Food burst not reflected in product UI');
  listeners['world:pointerdown']({clientX:120,clientY:140});
  elements.catastrophe.onclick();
  elements.reset.onclick();
  elements.newSeed.onclick();
  Math.random=originalRandom;
  const receipt={format:'gloopipelago-m1-2-node-dom-contract-smoke',schema:1,status:'PASS',bootPopulation:initialPop,bootFood:initialFood,speedControl:'4×',pauseControl:'PASS',foodBurst:'PASS',pointerFood:'PASS',catastrophe:'PASS',reset:'PASS',newSeed:'PASS',claim:'Node DOM/canvas contract smoke only; this is not browser evidence.'};
  fs.writeFileSync(DOM_SMOKE_RECEIPT,JSON.stringify(receipt,null,2)+'\n');
  return receipt;
}

function build() {
  const parts=buildText();
  verifyStatic(parts.text,parts.core,parts.prefix,parts.suffix);
  syntaxCheck(parts.text);
  fs.mkdirSync(path.dirname(OUT),{recursive:true});
  fs.writeFileSync(OUT,parts.text);
  const second=buildText().text;
  assert.equal(second,parts.text,'Build is not deterministic');
  const receipt=makeReceipt(parts);
  fs.writeFileSync(RECEIPT,JSON.stringify(receipt,null,2)+'\n');
  return receipt;
}

function verify() {
  assert(fs.existsSync(OUT),'Generated artifact missing; run build first');
  const parts=buildText();
  const disk=fs.readFileSync(OUT,'utf8');
  assert.equal(disk,parts.text,'dist artifact is stale or hand-edited');
  verifyStatic(disk,parts.core,parts.prefix,parts.suffix);
  syntaxCheck(disk);
  const receipt=makeReceipt(parts);
  assert.deepEqual(JSON.parse(fs.readFileSync(RECEIPT,'utf8')),receipt,'Build receipt stale');
  return receipt;
}

const cmd=process.argv[2]??'help';
if(cmd==='build') console.log(JSON.stringify(build(),null,2));
else if(cmd==='verify') console.log(JSON.stringify(verify(),null,2));
else if(cmd==='dom-smoke') console.log(JSON.stringify(await domContractSmoke(),null,2));
else console.log('Usage: node tools/m12.mjs <build|verify|dom-smoke>');
