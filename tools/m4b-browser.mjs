import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const OUT=path.join(ROOT,'m4b-browser-results');
fs.mkdirSync(OUT,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const median=xs=>{const a=[...xs].sort((x,y)=>x-y),m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2};
const SEEDS=[1,0x12345678,956866913,0x9e3779b9,42424242,0xdeadbeef,0xcafebabe,20260910].map(x=>x>>>0);
const EXTENDED=SEEDS.slice(0,3);

const build=spawnSync(process.execPath,['tools/build-standalone.mjs','build'],{cwd:ROOT,encoding:'utf8'});
assert.equal(build.status,0,build.stderr||build.stdout);
const buildReceipt=JSON.parse(build.stdout);
assert.equal(buildReceipt.schema,4,'M4b standalone receipt schema');
assert(buildReceipt.m4Sha256&&buildReceipt.m4bVisualsSha256,'M4/M4b hashes missing from standalone receipt');

let html=fs.readFileSync(path.join(ROOT,'dist/gloopipelago.html'),'utf8');
assert(html.includes('let sim;'),'simulation seam missing');
html=html.replace('let sim;',`let sim;
globalThis.__m4bSim=()=>sim;
globalThis.__m4bSeed=()=>seed;
globalThis.__m4bController=()=>({acc,speedMul,paused,W,H,DPR,view,achievedSpeed,lastFullDraw,schedulerLast});
globalThis.__m4bStartWorld=s=>startWorld(s);
globalThis.__m4bSetSpeed=v=>setSpeedMultiplier(v);
globalThis.__m4bSetPaused=v=>setPaused(v);
globalThis.__m4bWorld=()=>[LOGICAL_WORLD_WIDTH,LOGICAL_WORLD_HEIGHT];
globalThis.__m4bHabitats=()=>M4_HABITATS.map(h=>({...h}));`);
const hook='requestAnimationFrame(frame);\n\nui.pause.onclick';
assert(html.includes(hook),'draw export seam missing');
html=html.replace(hook,'requestAnimationFrame(frame);\nglobalThis.__m4bDraw=draw;\nglobalThis.__m4bPhenotypeVisual=m4bPhenotypeVisual;\n\nui.pause.onclick');
const instrumented=path.join(OUT,'instrumented.html');
fs.writeFileSync(instrumented,html);

const candidates=[process.env.CHROME_BIN,'/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].filter(Boolean);
const executablePath=candidates.find(p=>fs.existsSync(p));
assert(executablePath,`Chrome/Chromium executable not found: ${candidates.join(', ')}`);
const browser=await puppeteer.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage();
page.setDefaultTimeout(20000);
const pageErrors=[];
page.on('pageerror',e=>pageErrors.push(String(e?.stack||e)));

async function state(){
  return page.evaluate(()=>{
    const s=globalThis.__m4bSim(),c=globalThis.__m4bController(),canvas=document.getElementById('world'),r=canvas.getBoundingClientRect();
    return {
      serial:JSON.stringify({seed:s.seed,simTime:s.simTime,season:s.season,nextId:s.nextId,births:s.births,deaths:s.deaths,extinctions:s.extinctions,width:s.width,height:s.height,rngState:s.rngStream.snapshot(),blobs:s.blobs,foods:s.foods}),
      seed:s.seed,simTime:s.simTime,population:s.blobs.length,food:s.foods.length,rngState:s.rngStream.snapshot(),width:s.width,height:s.height,
      controller:c,dpr:devicePixelRatio,
      canvas:{width:canvas.width,height:canvas.height,rect:{left:r.left,top:r.top,width:r.width,height:r.height}},
      targetText:document.getElementById('speedLabel').textContent,achievedText:document.getElementById('achievedSpeed').textContent,
      overlay:document.getElementById('overlay').textContent,
    };
  });
}
async function ensurePaused(){await page.evaluate(()=>{if(!globalThis.__m4bController().paused)globalThis.__m4bSetPaused(true);});await sleep(20);}
async function startPaused(seed){await page.evaluate(seed=>{globalThis.__m4bSetPaused(true);globalThis.__m4bStartWorld(seed);},seed);await sleep(30);return state();}
async function evolvePaused(seconds){await page.evaluate(seconds=>{const s=globalThis.__m4bSim(),ticks=Math.round(seconds*60);for(let i=0;i<ticks;i++)s.step(1/60);},seconds);}
async function forceDraw(){await page.evaluate(()=>globalThis.__m4bDraw());await sleep(20);}

await page.setViewport({width:1400,height:800,deviceScaleFactor:1});
await page.goto(pathToFileURL(instrumented).href,{waitUntil:'load'});
await page.waitForFunction(()=>globalThis.__m4bSim&&globalThis.__m4bController&&globalThis.__m4bDraw&&globalThis.__m4bSim());
await ensurePaused();
await page.evaluate(()=>globalThis.__m4bStartWorld(0x12345678));await sleep(30);
const initial=await state();
assert.deepEqual(await page.evaluate(()=>globalThis.__m4bWorld()),[1200,900]);
assert.equal(initial.width,1200);assert.equal(initial.height,900);
assert.equal(initial.population,66);assert.equal(initial.food,275);
assert.equal((await page.evaluate(()=>globalThis.__m4bHabitats())).length,8);
assert(initial.overlay.includes('habitaty 8'));

const initialSeed=initial.seed;
await page.click('#reset');await sleep(30);
const sameSeed=await state();
assert.equal(sameSeed.serial,initial.serial,'same-seed reset not exact');
await page.click('#newSeed');await sleep(30);
const newSeed=await state();
assert.notEqual(newSeed.seed,initialSeed,'new-seed control did not change seed');
assert.equal(newSeed.population,66);assert.equal(newSeed.food,275);

await page.evaluate(()=>globalThis.__m4bStartWorld(0x12345678));await sleep(30);
const wide=await state();
await page.setViewport({width:390,height:600,deviceScaleFactor:1});await sleep(100);
const narrow1=await state();
assert.equal(narrow1.serial,wide.serial,'wide -> narrow changed authoritative state');
assert.equal(narrow1.controller.view.worldWidth,1200);assert.equal(narrow1.controller.view.worldHeight,900);
assert(narrow1.controller.view.offsetY>0||narrow1.controller.view.offsetX>0,'narrow contain band missing');

await page.setViewport({width:390,height:600,deviceScaleFactor:2});
await page.waitForFunction(()=>{const c=globalThis.__m4bController(),canvas=document.getElementById('world');return devicePixelRatio===2&&c.DPR===2&&canvas.width===780&&canvas.height===816;});
const narrow2=await state();
assert.equal(narrow2.serial,narrow1.serial,'DPR-only change altered state');

const bandX=narrow2.canvas.rect.left+narrow2.canvas.rect.width/2;
const bandY=narrow2.canvas.rect.top+Math.max(2,narrow2.controller.view.offsetY/2);
const beforeBand=await state();await page.mouse.click(bandX,bandY);await sleep(30);const afterBand=await state();
assert.equal(afterBand.food,beforeBand.food);assert.equal(afterBand.rngState,beforeBand.rngState);
const worldX=narrow2.canvas.rect.left+narrow2.controller.view.offsetX+narrow2.controller.view.displayWidth/2;
const worldY=narrow2.canvas.rect.top+narrow2.controller.view.offsetY+narrow2.controller.view.displayHeight/2;
await page.mouse.click(worldX,worldY);await sleep(30);const afterWorld=await state();
assert.equal(afterWorld.food,beforeBand.food+18);

await page.evaluate(()=>globalThis.__m4bStartWorld(0x12345678));await sleep(30);const beforeWideReturn=await state();
await page.setViewport({width:1400,height:800,deviceScaleFactor:1});await sleep(100);const wideReturn=await state();
assert.equal(wideReturn.serial,beforeWideReturn.serial,'narrow -> wide changed authoritative state');

await startPaused(0x12345678);await evolvePaused(600);const beforeRepeatedDraw=await state();
await page.evaluate(()=>{for(let i=0;i<250;i++)globalThis.__m4bDraw();});
const afterRepeatedDraw=await state();
assert.equal(afterRepeatedDraw.serial,beforeRepeatedDraw.serial,'250 repeated M4b draws changed causal state');
assert.equal(afterRepeatedDraw.rngState,beforeRepeatedDraw.rngState,'250 repeated M4b draws consumed RNG');

async function measureAtAge(seed,ageSeconds,durationMs=2500){
  await startPaused(seed);await evolvePaused(ageSeconds);await page.evaluate(()=>globalThis.__m4bSetSpeed(40));
  const before=await state();const start=await page.evaluate(()=>{globalThis.__m4bSetPaused(false);return performance.now();});
  await sleep(durationMs);const after=await state();await page.evaluate(()=>globalThis.__m4bSetPaused(true));
  const elapsed=(await page.evaluate(start=>performance.now()-start,start))/1000;
  const simulated=after.simTime-before.simTime,achieved=simulated/elapsed,displayed=parseFloat(after.achievedText);
  assert(after.controller.acc<=.25+1e-12,`M4b ${seed} backlog cap ${after.controller.acc}`);
  assert(Number.isFinite(displayed),`M4b ${seed} achieved UI missing`);
  assert(Math.abs(displayed-achieved)<=Math.max(2,achieved*.25),`M4b ${seed} achieved UI dishonest: actual ${achieved}, UI ${displayed}`);
  return {seed:seed>>>0,ageSeconds,durationMs,elapsedWallSeconds:elapsed,simulatedSeconds:simulated,achievedMultiplier:achieved,displayedAchieved:displayed,targetText:after.targetText,backlogSeconds:after.controller.acc,populationStart:before.population,populationEnd:after.population,foodStart:before.food,foodEnd:after.food};
}

const evolved600=[];for(const seed of SEEDS)evolved600.push(await measureAtAge(seed,600));
const achieved600=evolved600.map(r=>r.achievedMultiplier),median600=median(achieved600),min600=Math.min(...achieved600);
assert(median600>=38,`M4b 600s x40 median ${median600}`);assert(min600>=35,`M4b 600s x40 minimum ${min600}`);
const evolved1800=[];for(const seed of EXTENDED)evolved1800.push(await measureAtAge(seed,1800));
const achieved1800=evolved1800.map(r=>r.achievedMultiplier),median1800=median(achieved1800),min1800=Math.min(...achieved1800);
assert(median1800>=38,`M4b 1800s x40 median ${median1800}`);assert(min1800>=35,`M4b 1800s x40 minimum ${min1800}`);

await startPaused(SEEDS[0]);await evolvePaused(600);await page.evaluate(()=>globalThis.__m4bSetSpeed(40));await page.evaluate(()=>globalThis.__m4bSetPaused(false));await sleep(900);
const transitionStart=await page.evaluate(()=>{globalThis.__m4bSetSpeed(1);const s=globalThis.__m4bSim(),c=globalThis.__m4bController();return{now:performance.now(),simTime:s.simTime,acc:c.acc};});
assert.equal(transitionStart.acc,0);await sleep(1600);const transitionEnd=await state();const transitionNow=await page.evaluate(()=>performance.now());
const oneXAfter40=(transitionEnd.simTime-transitionStart.simTime)/((transitionNow-transitionStart.now)/1000);
assert(oneXAfter40>=.8&&oneXAfter40<=1.2,`M4b 40x -> 1x retained debt ${oneXAfter40}`);await ensurePaused();

await startPaused(SEEDS[1]);await evolvePaused(600);await page.evaluate(()=>globalThis.__m4bSetSpeed(40));await page.evaluate(()=>globalThis.__m4bSetPaused(false));await sleep(500);
const hiddenStart=await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));return{simTime:globalThis.__m4bSim().simTime,acc:globalThis.__m4bController().acc};});
assert.equal(hiddenStart.acc,0);await sleep(700);const hiddenEnd=await state();assert.equal(hiddenEnd.simTime,hiddenStart.simTime);
await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});await sleep(30);await ensurePaused();

await page.setViewport({width:1400,height:800,deviceScaleFactor:1});
for(const seconds of [0,600,1800]){
  await startPaused(0x12345678);if(seconds)await evolvePaused(seconds);await forceDraw();
  await page.screenshot({path:path.join(OUT,`m4b-seed305419896-t${seconds}-wide.png`),fullPage:false});
}
await page.setViewport({width:390,height:600,deviceScaleFactor:1});await startPaused(0x12345678);await evolvePaused(600);await forceDraw();
await page.screenshot({path:path.join(OUT,'m4b-seed305419896-t600-narrow.png'),fullPage:false});

assert.equal(pageErrors.length,0,`browser page errors:\n${pageErrors.join('\n')}`);
const receipt={format:'gloopipelago-m4b-real-browser-qualification',schema:1,status:'PASS',browser:{executablePath,version:await browser.version()},buildReceipt,
  initial:{seed:initialSeed,world:[initial.width,initial.height],population:initial.population,food:initial.food,habitats:(await page.evaluate(()=>globalThis.__m4bHabitats())).length},
  controls:{sameSeedExact:sameSeed.serial===initial.serial,newSeedChanged:newSeed.seed!==initialSeed},
  presentation:{wide:{viewport:[1400,800],view:wide.controller.view},narrow:{viewport:[390,600],view:narrow1.controller.view,stateExact:wide.serial===narrow1.serial},dprOnly:{dpr:narrow2.dpr,stateExact:narrow2.serial===narrow1.serial},pointer:{bandNoop:afterBand.food===beforeBand.food&&afterBand.rngState===beforeBand.rngState,worldFoodDelta:afterWorld.food-beforeBand.food},wideReturnExact:wideReturn.serial===beforeWideReturn.serial,repeatedDrawExact:afterRepeatedDraw.serial===beforeRepeatedDraw.serial&&afterRepeatedDraw.rngState===beforeRepeatedDraw.rngState},
  x40:{evolved600:{median:median600,min:min600,runs:evolved600},evolved1800:{median:median1800,min:min1800,runs:evolved1800},transition40To1:{achievedMultiplier:oneXAfter40},hidden:{exactNoAdvance:hiddenEnd.simTime===hiddenStart.simTime}},
  screenshots:['m4b-seed305419896-t0-wide.png','m4b-seed305419896-t600-wide.png','m4b-seed305419896-t1800-wide.png','m4b-seed305419896-t600-narrow.png'],pageErrors,
  claim:'Real-Chromium M4b presentation-neutrality, M4a mechanics preservation, visual capture and evolved-world x40 delivery gate. Owner product-feel remains separate.'};
fs.writeFileSync(path.join(OUT,'m4b-browser-qualification.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify(receipt,null,2));
await browser.close();
