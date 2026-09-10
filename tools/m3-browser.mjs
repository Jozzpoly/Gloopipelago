import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const OUT=path.join(ROOT,'m3-browser-results');
fs.mkdirSync(OUT,{recursive:true});

const build=spawnSync(process.execPath,['tools/build-standalone.mjs','build'],{cwd:ROOT,encoding:'utf8'});
assert.equal(build.status,0,build.stderr||build.stdout);
const buildReceipt=JSON.parse(build.stdout);
let html=fs.readFileSync(path.join(ROOT,'dist/gloopipelago.html'),'utf8');
assert(html.includes('let sim;'),'simulation seam missing');
html=html.replace('let sim;','let sim; globalThis.__m3Sim=()=>sim; globalThis.__m3Controller=()=>({acc,speedMul,paused,W,H,DPR,view});');
const instrumented=path.join(OUT,'instrumented.html');
fs.writeFileSync(instrumented,html);

const candidates=[process.env.CHROME_BIN,'/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].filter(Boolean);
const executablePath=candidates.find(p=>fs.existsSync(p));
assert(executablePath,`Chrome/Chromium executable not found: ${candidates.join(', ')}`);

const browser=await puppeteer.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage();
const pageErrors=[];
page.on('pageerror',e=>pageErrors.push(String(e?.stack||e)));

async function state(){
  return page.evaluate(()=>{
    const s=globalThis.__m3Sim();
    const c=globalThis.__m3Controller();
    const canvas=document.getElementById('world');
    const r=canvas.getBoundingClientRect();
    return {
      serial:JSON.stringify({
        seed:s.seed,simTime:s.simTime,season:s.season,nextId:s.nextId,births:s.births,deaths:s.deaths,extinctions:s.extinctions,
        width:s.width,height:s.height,rngState:s.rngStream.snapshot(),blobs:s.blobs,foods:s.foods
      }),
      simTime:s.simTime,population:s.blobs.length,food:s.foods.length,rngState:s.rngStream.snapshot(),
      controller:c,dpr:devicePixelRatio,
      canvas:{width:canvas.width,height:canvas.height,rect:{left:r.left,top:r.top,width:r.width,height:r.height}},
      speedLabel:document.getElementById('speedLabel').textContent,
    };
  });
}

async function pauseAndReset(){
  await page.evaluate(()=>{
    if(!globalThis.__m3Controller().paused) document.getElementById('pause').onclick();
    document.getElementById('reset').onclick();
  });
  await new Promise(r=>setTimeout(r,50));
}

async function measureFourX(ms=2500){
  await pauseAndReset();
  await page.evaluate(()=>document.getElementById('speed').oninput({target:{value:'4'}}));
  const before=await state();
  const t0=performance.now();
  await page.evaluate(()=>document.getElementById('pause').onclick());
  await new Promise(r=>setTimeout(r,ms));
  await page.evaluate(()=>{if(!globalThis.__m3Controller().paused) document.getElementById('pause').onclick();});
  const wallSeconds=(performance.now()-t0)/1000;
  const after=await state();
  return {wallSeconds,simulatedSeconds:after.simTime-before.simTime,achievedMultiplier:(after.simTime-before.simTime)/wallSeconds,backlogSeconds:after.controller.acc,label:after.speedLabel};
}

await page.setViewport({width:1400,height:800,deviceScaleFactor:1});
await page.goto(pathToFileURL(instrumented).href,{waitUntil:'load'});
await page.waitForFunction(()=>globalThis.__m3Sim&&globalThis.__m3Controller&&globalThis.__m3Sim());
await pauseAndReset();
const wide=await state();

await page.setViewport({width:390,height:600,deviceScaleFactor:1});
await new Promise(r=>setTimeout(r,80));
const narrow1=await state();
assert.equal(narrow1.serial,wide.serial,'wide -> narrow changed authoritative state');

await page.setViewport({width:390,height:600,deviceScaleFactor:2});
await page.waitForFunction(()=>{
  const c=globalThis.__m3Controller();
  const canvas=document.getElementById('world');
  return devicePixelRatio===2&&c.DPR===2&&canvas.width===780&&canvas.height===816;
},{timeout:1500});
const narrow2=await state();
assert.equal(narrow2.serial,narrow1.serial,'DPR-only presentation change altered authoritative state');
assert.equal(narrow2.canvas.rect.width,narrow1.canvas.rect.width,'DPR-only changed CSS canvas width');
assert.equal(narrow2.canvas.rect.height,narrow1.canvas.rect.height,'DPR-only changed CSS canvas height');
assert.equal(narrow2.controller.DPR,2,'application did not ingest DPR-only change');
assert.equal(narrow2.canvas.width,780,'DPR-only backing width incorrect');
assert.equal(narrow2.canvas.height,816,'DPR-only backing height incorrect');

const bandX=narrow2.canvas.rect.left+narrow2.canvas.rect.width/2;
const bandY=narrow2.canvas.rect.top+Math.max(2,narrow2.controller.view.offsetY/2);
const beforeBand=await state();
await page.mouse.click(bandX,bandY);
await new Promise(r=>setTimeout(r,30));
const afterBand=await state();
assert.equal(afterBand.food,beforeBand.food,'letterbox click changed food');
assert.equal(afterBand.rngState,beforeBand.rngState,'letterbox click consumed RNG');

const worldX=narrow2.canvas.rect.left+narrow2.controller.view.offsetX+narrow2.controller.view.displayWidth/2;
const worldY=narrow2.canvas.rect.top+narrow2.controller.view.offsetY+narrow2.controller.view.displayHeight/2;
await page.mouse.click(worldX,worldY);
await new Promise(r=>setTimeout(r,30));
const afterWorld=await state();
assert.equal(afterWorld.food,beforeBand.food+18,'in-world pointer did not add exactly 18 food');

await pauseAndReset();
const beforeWideReturn=await state();
await page.setViewport({width:1400,height:800,deviceScaleFactor:1});
await new Promise(r=>setTimeout(r,80));
const wideReturn=await state();
assert.equal(wideReturn.serial,beforeWideReturn.serial,'narrow -> wide changed authoritative state');

const fourX=await measureFourX();
assert(fourX.achievedMultiplier>=3.8&&fourX.achievedMultiplier<=4.2,`4x achieved speed out of range: ${fourX.achievedMultiplier}`);
assert(fourX.backlogSeconds<0.1,`4x accumulated unexpected backlog: ${fourX.backlogSeconds}`);
assert.equal(pageErrors.length,0,`browser page errors: ${pageErrors.join('\n')}`);

const receipt={
  format:'gloopipelago-m3-real-browser-qualification',schema:1,status:'PASS',
  browser:{executablePath,version:await browser.version()},buildReceipt,
  wide:{viewport:[1400,800],dpr:wide.dpr,canvas:wide.canvas,view:wide.controller.view},
  narrow:{viewport:[390,600],dpr:narrow1.dpr,canvas:narrow1.canvas,view:narrow1.controller.view,stateEqualToWide:narrow1.serial===wide.serial},
  dprOnly:{browserDpr:narrow2.dpr,controllerDpr:narrow2.controller.DPR,canvas:narrow2.canvas,stateEqualToDpr1:narrow2.serial===narrow1.serial,detectedByApplication:true},
  pointer:{letterboxNoop:afterBand.food===beforeBand.food&&afterBand.rngState===beforeBand.rngState,worldFoodDelta:afterWorld.food-beforeBand.food},
  wideReturn:{stateEqualBeforeResize:wideReturn.serial===beforeWideReturn.serial},
  fourX,pageErrors,
  claim:'Automated real-Chromium M3 mechanics/performance gate; not Owner product-feel evidence.'
};
fs.writeFileSync(path.join(OUT,'m3-browser-qualification.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify(receipt,null,2));
await browser.close();
