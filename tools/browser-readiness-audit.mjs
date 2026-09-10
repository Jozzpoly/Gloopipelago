import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'audit-results');
fs.mkdirSync(OUT, { recursive:true });

const build = spawnSync(process.execPath, ['tools/build-standalone.mjs','build'], { cwd:ROOT, encoding:'utf8' });
assert.equal(build.status, 0, build.stderr || build.stdout);
const buildReceipt = JSON.parse(build.stdout);
let html = fs.readFileSync(path.join(ROOT,'dist/gloopipelago.html'),'utf8');
assert(html.includes('let sim;'), 'simulation seam missing');
html = html.replace('let sim;', 'let sim; globalThis.__auditSim=()=>sim; globalThis.__auditController=()=>({acc,speedMul,paused,W,H,DPR,view});');
const instrumented = path.join(OUT,'instrumented.html');
fs.writeFileSync(instrumented, html);

const candidates = [process.env.CHROME_BIN, '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'].filter(Boolean);
const executablePath = candidates.find(p => fs.existsSync(p));
assert(executablePath, `Chrome/Chromium executable not found: ${candidates.join(', ')}`);

const browser = await puppeteer.launch({ headless:true, executablePath, args:['--no-sandbox','--disable-dev-shm-usage'] });
const page = await browser.newPage();

async function fullState() {
  return page.evaluate(() => {
    const s = globalThis.__auditSim();
    const c = globalThis.__auditController();
    return {
      serial: JSON.stringify({
        seed:s.seed,simTime:s.simTime,season:s.season,nextId:s.nextId,births:s.births,deaths:s.deaths,extinctions:s.extinctions,
        width:s.width,height:s.height,rngState:s.rngStream.snapshot(),blobs:s.blobs,foods:s.foods
      }),
      seed:s.seed,simTime:s.simTime,population:s.blobs.length,food:s.foods.length,rngState:s.rngStream.snapshot(),
      controller:c,
      canvas:{
        width:document.getElementById('world').width,
        height:document.getElementById('world').height,
        rect:(()=>{const r=document.getElementById('world').getBoundingClientRect();return {left:r.left,top:r.top,width:r.width,height:r.height};})()
      },
      dpr:devicePixelRatio,
      label:document.getElementById('speedLabel').textContent,
    };
  });
}

async function setSpeed(value) {
  await page.evaluate(v => document.getElementById('speed').oninput({target:{value:String(v)}}), value);
}

async function resetAndPause() {
  await page.evaluate(() => {
    const p=document.getElementById('pause');
    const c=globalThis.__auditController();
    if (!c.paused) p.onclick();
    document.getElementById('reset').onclick();
  });
  await new Promise(r=>setTimeout(r,60));
}

async function unpause() {
  await page.evaluate(() => { if (globalThis.__auditController().paused) document.getElementById('pause').onclick(); });
}

async function measureSpeed(target, wallMs) {
  await resetAndPause();
  await setSpeed(target);
  const before = await fullState();
  const t0 = performance.now();
  await unpause();
  await new Promise(r=>setTimeout(r,wallMs));
  await page.evaluate(() => { if (!globalThis.__auditController().paused) document.getElementById('pause').onclick(); });
  const wallSeconds = (performance.now()-t0)/1000;
  const after = await fullState();
  return {target,wallSeconds,simulatedSeconds:after.simTime-before.simTime,achievedMultiplier:(after.simTime-before.simTime)/wallSeconds,backlogSeconds:after.controller.acc,label:after.label};
}

await page.setViewport({width:1400,height:800,deviceScaleFactor:1});
await page.goto(pathToFileURL(instrumented).href, {waitUntil:'load'});
await page.waitForFunction(() => globalThis.__auditSim && globalThis.__auditController && globalThis.__auditSim());
await resetAndPause();
const wide = await fullState();
await page.screenshot({path:path.join(OUT,'wide.png')});

await page.setViewport({width:390,height:600,deviceScaleFactor:1});
await new Promise(r=>setTimeout(r,100));
const narrow1 = await fullState();
assert.equal(narrow1.serial, wide.serial, 'paused wide -> narrow resize changed authoritative state');
await page.screenshot({path:path.join(OUT,'narrow.png')});

// Change only deviceScaleFactor. Preserve whether the application notices this naturally as evidence.
await page.setViewport({width:390,height:600,deviceScaleFactor:2});
await new Promise(r=>setTimeout(r,100));
const narrow2Natural = await fullState();
assert.equal(narrow2Natural.serial, narrow1.serial, 'pure DPR-only change changed authoritative state');
assert.equal(narrow2Natural.canvas.rect.width, narrow1.canvas.rect.width, 'DPR-only changed CSS canvas width');
assert.equal(narrow2Natural.canvas.rect.height, narrow1.canvas.rect.height, 'DPR-only changed CSS canvas height');
const dprDetectedNaturally = narrow2Natural.controller.DPR === 2 && narrow2Natural.canvas.width > narrow1.canvas.width;

// Now explicitly invoke the existing resize listener to separate handler correctness from DPR-change detection.
await page.evaluate(() => dispatchEvent(new Event('resize')));
await new Promise(r=>setTimeout(r,100));
const narrow2Handled = await fullState();
assert.equal(narrow2Handled.serial, narrow1.serial, 'explicit DPR resize handling changed authoritative state');
assert.equal(narrow2Handled.controller.DPR, 2, 'resize handler did not ingest current DPR');
assert(narrow2Handled.canvas.width > narrow1.canvas.width, 'resize handler did not increase backing width for DPR2');

const bandX = narrow2Handled.canvas.rect.left + narrow2Handled.canvas.rect.width/2;
const bandY = narrow2Handled.canvas.rect.top + Math.max(2, narrow2Handled.controller.view.offsetY/2);
const beforeBand = await fullState();
await page.mouse.click(bandX, bandY);
await new Promise(r=>setTimeout(r,40));
const afterBand = await fullState();
assert.equal(afterBand.food, beforeBand.food, 'narrow letterbox click changed food');
assert.equal(afterBand.rngState, beforeBand.rngState, 'narrow letterbox click consumed RNG');

const worldX = narrow2Handled.canvas.rect.left + narrow2Handled.controller.view.offsetX + narrow2Handled.controller.view.displayWidth/2;
const worldY = narrow2Handled.canvas.rect.top + narrow2Handled.controller.view.offsetY + narrow2Handled.controller.view.displayHeight/2;
await page.mouse.click(worldX, worldY);
await new Promise(r=>setTimeout(r,40));
const afterWorld = await fullState();
assert.equal(afterWorld.food, beforeBand.food+18, 'narrow in-world click did not add 18 food');

await resetAndPause();
const preWideReturn = await fullState();
await page.setViewport({width:1400,height:800,deviceScaleFactor:1});
await new Promise(r=>setTimeout(r,100));
const wideReturn = await fullState();
assert.equal(wideReturn.serial, preWideReturn.serial, 'paused narrow -> wide resize changed authoritative state');

const fourX = await measureSpeed(4,3000);
const forced40X = await measureSpeed(40,3000);
const beforeDebt = await fullState();
await setSpeed(1);
await unpause();
const debtWallStart = performance.now();
await new Promise(r=>setTimeout(r,2000));
await page.evaluate(() => { if (!globalThis.__auditController().paused) document.getElementById('pause').onclick(); });
const debtWallSeconds=(performance.now()-debtWallStart)/1000;
const afterDebt = await fullState();
const after40To1 = {target:1,wallSeconds:debtWallSeconds,simulatedSeconds:afterDebt.simTime-beforeDebt.simTime,achievedMultiplier:(afterDebt.simTime-beforeDebt.simTime)/debtWallSeconds,backlogStartSeconds:beforeDebt.controller.acc,backlogEndSeconds:afterDebt.controller.acc};

const receipt = {
  format:'gloopipelago-real-browser-readiness-audit',schema:2,
  browser:{executablePath,version:await browser.version()},
  buildReceipt,
  resize:{
    wide:{viewport:[1400,800],dpr:wide.dpr,canvas:wide.canvas,view:wide.controller.view},
    narrowDpr1:{viewport:[390,600],dpr:narrow1.dpr,canvas:narrow1.canvas,view:narrow1.controller.view,stateEqualToWide:narrow1.serial===wide.serial},
    dprOnlyNatural:{viewport:[390,600],browserDpr:narrow2Natural.dpr,controllerDpr:narrow2Natural.controller.DPR,canvas:narrow2Natural.canvas,stateEqualToDpr1:narrow2Natural.serial===narrow1.serial,detectedByApplication:dprDetectedNaturally},
    dprOnlyAfterExplicitResize:{viewport:[390,600],browserDpr:narrow2Handled.dpr,controllerDpr:narrow2Handled.controller.DPR,canvas:narrow2Handled.canvas,stateEqualToDpr1:narrow2Handled.serial===narrow1.serial,handlerCorrect:true},
    wideReturn:{viewport:[1400,800],dpr:wideReturn.dpr,canvas:wideReturn.canvas,view:wideReturn.controller.view,stateEqualBeforeResize:wideReturn.serial===preWideReturn.serial},
  },
  pointer:{narrowBandNoop:afterBand.food===beforeBand.food && afterBand.rngState===beforeBand.rngState,narrowWorldFoodDelta:afterWorld.food-beforeBand.food},
  speed:{fourX,forced40X,after40To1},
  findings:[
    ...(dprDetectedNaturally?[]:[{severity:'M3_CONTRACT_GAP',id:'DPR_CHANGE_DETECTION',detail:'Browser DPR changed at fixed CSS viewport without application resize handling; existing resize handler is correct when explicitly invoked.'}]),
  ],
  screenshots:['wide.png','narrow.png'],
  harnessStatus:'PASS',
  productStatus:dprDetectedNaturally?'NO_GAP_FOUND_IN_THIS_SCOPE':'GAP_FOUND',
  claim:'Headless real-Chromium mechanics/readiness evidence; not Owner product-feel evidence.'
};
fs.writeFileSync(path.join(OUT,'browser-readiness.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify(receipt,null,2));
await browser.close();
