import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const OUT=path.join(ROOT,'x40-browser-results');
fs.mkdirSync(OUT,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

const build=spawnSync(process.execPath,['tools/build-standalone.mjs','build'],{cwd:ROOT,encoding:'utf8'});
assert.equal(build.status,0,build.stderr||build.stdout);
const buildReceipt=JSON.parse(build.stdout);
let html=fs.readFileSync(path.join(ROOT,'dist/gloopipelago.html'),'utf8');
assert(html.includes('let sim;'),'simulation seam missing');
html=html.replace('let sim;',`let sim;
globalThis.__x40Sim=()=>sim;
globalThis.__x40Controller=()=>({acc,speedMul,paused,W,H,DPR,view,achievedSpeed,lastFullDraw,schedulerLast});
globalThis.__x40StartWorld=s=>startWorld(s);
globalThis.__x40SetSpeed=v=>setSpeedMultiplier(v);
globalThis.__x40SetPaused=v=>setPaused(v);`);
assert(html.includes('function draw(){'),'draw seam missing');
html=html.replace('function draw(){','function draw(){globalThis.__x40DrawCount=(globalThis.__x40DrawCount||0)+1;');
const instrumented=path.join(OUT,'instrumented.html');
fs.writeFileSync(instrumented,html);

const candidates=[process.env.CHROME_BIN,'/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].filter(Boolean);
const executablePath=candidates.find(p=>fs.existsSync(p));
assert(executablePath,`Chrome/Chromium executable not found: ${candidates.join(', ')}`);

const browser=await puppeteer.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage();
await page.setViewport({width:1400,height:800,deviceScaleFactor:1});
const pageErrors=[];
page.on('pageerror',e=>pageErrors.push(String(e?.stack||e)));
await page.goto(pathToFileURL(instrumented).href,{waitUntil:'load'});
await page.waitForFunction(()=>globalThis.__x40Sim&&globalThis.__x40Controller&&globalThis.__x40Sim());

async function state(){
  return page.evaluate(()=>{
    const s=globalThis.__x40Sim();
    const c=globalThis.__x40Controller();
    return {
      now:performance.now(),simTime:s.simTime,population:s.blobs.length,food:s.foods.length,
      rngState:s.rngStream.snapshot(),drawCount:globalThis.__x40DrawCount||0,
      targetText:document.getElementById('speedLabel').textContent,
      achievedText:document.getElementById('achievedSpeed').textContent,
      controller:c,
    };
  });
}

async function prepareNatural(seed,target){
  await page.evaluate(({seed,target})=>{
    globalThis.__x40SetPaused(true);
    globalThis.__x40StartWorld(seed);
    globalThis.__x40SetSpeed(target);
  },{seed,target});
  await sleep(80);
  return state();
}

async function runNatural({seed,target,durationMs}){
  const before=await prepareNatural(seed,target);
  const start=await page.evaluate(()=>{
    globalThis.__x40TimerProbe={expected:performance.now()+1000,fired:null};
    setTimeout(()=>{globalThis.__x40TimerProbe.fired=performance.now();},1000);
    const now=performance.now();
    globalThis.__x40SetPaused(false);
    return now;
  });
  await sleep(durationMs);
  const after=await state();
  const timerProbe=await page.evaluate(()=>globalThis.__x40TimerProbe);
  await page.evaluate(()=>globalThis.__x40SetPaused(true));
  const wallSeconds=(after.now-start)/1000;
  const simulatedSeconds=after.simTime-before.simTime;
  const achievedMultiplier=simulatedSeconds/wallSeconds;
  const draws=after.drawCount-before.drawCount;
  const drawHz=draws/wallSeconds;
  const displayed=parseFloat(after.achievedText);
  return {
    seed:seed>>>0,target,durationMs,wallSeconds,simulatedSeconds,achievedMultiplier,
    targetText:after.targetText,achievedText:after.achievedText,displayedAchieved:Number.isFinite(displayed)?displayed:null,
    backlogSeconds:after.controller.acc,draws,drawHz,
    timerLatenessMs:timerProbe.fired===null?null:timerProbe.fired-timerProbe.expected,
    final:{population:after.population,food:after.food,rngState:after.rngState},
  };
}

const fourX=await runNatural({seed:1,target:4,durationMs:2500});
assert(fourX.achievedMultiplier>=3.8&&fourX.achievedMultiplier<=4.2,`4x achieved ${fourX.achievedMultiplier}`);
assert(fourX.backlogSeconds<.1,`4x backlog ${fourX.backlogSeconds}`);
assert(fourX.displayedAchieved!==null&&fourX.displayedAchieved>=3.5&&fourX.displayedAchieved<=4.5,`4x UI achieved ${fourX.achievedText}`);

const natural40=[];
for(const seed of [1,0x12345678,956866913]){
  const row=await runNatural({seed,target:40,durationMs:3000});
  assert(row.achievedMultiplier>=38&&row.achievedMultiplier<=42,`40x natural ${seed} achieved ${row.achievedMultiplier}`);
  assert(row.backlogSeconds<=.25+1e-12,`40x backlog cap exceeded ${row.backlogSeconds}`);
  assert(row.timerLatenessMs!==null&&row.timerLatenessMs<100,`40x timer lateness ${row.timerLatenessMs}`);
  assert(row.drawHz>=5&&row.drawHz<=15,`40x full draw cadence ${row.drawHz}`);
  assert(row.displayedAchieved!==null&&row.displayedAchieved>=35&&row.displayedAchieved<=45,`40x UI achieved ${row.achievedText}`);
  natural40.push(row);
}

await prepareNatural(1,40);
await page.evaluate(()=>globalThis.__x40SetPaused(false));
await sleep(1400);
const transitionStart=await page.evaluate(()=>{
  globalThis.__x40SetSpeed(1);
  const s=globalThis.__x40Sim(),c=globalThis.__x40Controller();
  return {now:performance.now(),simTime:s.simTime,acc:c.acc};
});
assert.equal(transitionStart.acc,0,'speed change did not clear historical debt');
await sleep(1800);
const transitionEnd=await state();
const oneXAfter40=(transitionEnd.simTime-transitionStart.simTime)/((transitionEnd.now-transitionStart.now)/1000);
assert(oneXAfter40>=.8&&oneXAfter40<=1.2,`40x -> 1x retained debt: ${oneXAfter40}`);
assert(transitionEnd.controller.acc<.1,`40x -> 1x backlog ${transitionEnd.controller.acc}`);
await page.evaluate(()=>globalThis.__x40SetPaused(true));

await prepareNatural(1,40);
await page.evaluate(()=>globalThis.__x40SetPaused(false));
await sleep(600);
const pauseStart=await page.evaluate(()=>{globalThis.__x40SetPaused(true);return globalThis.__x40Sim().simTime;});
await sleep(600);
const pauseEnd=(await state()).simTime;
assert.equal(pauseEnd,pauseStart,'paused simulation advanced');

await prepareNatural(1,40);
await page.evaluate(()=>globalThis.__x40SetPaused(false));
await sleep(500);
const hiddenStart=await page.evaluate(()=>{
  Object.defineProperty(document,'hidden',{configurable:true,value:true});
  document.dispatchEvent(new Event('visibilitychange'));
  return {now:performance.now(),simTime:globalThis.__x40Sim().simTime,acc:globalThis.__x40Controller().acc};
});
assert.equal(hiddenStart.acc,0,'visibility hide did not clear debt');
await sleep(800);
const hiddenEnd=await state();
assert.equal(hiddenEnd.simTime,hiddenStart.simTime,'hidden interval advanced simulation');
const visibleStart=await page.evaluate(()=>{
  Object.defineProperty(document,'hidden',{configurable:true,value:false});
  document.dispatchEvent(new Event('visibilitychange'));
  return {now:performance.now(),simTime:globalThis.__x40Sim().simTime,acc:globalThis.__x40Controller().acc};
});
assert.equal(visibleStart.acc,0,'visibility return did not clear debt');
await sleep(1200);
const visibleEnd=await state();
const visibleResume=(visibleEnd.simTime-visibleStart.simTime)/((visibleEnd.now-visibleStart.now)/1000);
assert(visibleResume>=38&&visibleResume<=42,`visible resume included hidden debt or underachieved: ${visibleResume}`);
await page.evaluate(()=>globalThis.__x40SetPaused(true));

await prepareNatural(956866913,40);
const controlProbe=await page.evaluate(async()=>{
  globalThis.__x40SetPaused(false);
  const expected=performance.now()+500;
  return new Promise(resolve=>setTimeout(()=>{
    const fired=performance.now();
    document.getElementById('pause').onclick();
    resolve({latenessMs:fired-expected,paused:globalThis.__x40Controller().paused,simTime:globalThis.__x40Sim().simTime});
  },500));
});
assert(controlProbe.paused,'scheduled direct control did not pause world');
assert(controlProbe.latenessMs<100,`direct control latency investigation boundary exceeded: ${controlProbe.latenessMs}`);

async function prepareSynthetic(population,food){
  await page.evaluate(({population,food})=>{
    globalThis.__x40SetPaused(true);
    globalThis.__x40StartWorld(0xC0FFEE);
    const sim=globalThis.__x40Sim();
    sim.foodRate=0;sim.foodLifetime=1e12;sim.simTime=0;sim.season=0;
    sim.births=Math.max(0,population-34);sim.deaths=0;sim.extinctions=0;sim.nextId=population+1;
    sim.blobs=Array.from({length:population},(_,i)=>({
      id:i+1,x:(37*i+23)%900,y:(53*i+31)%700,vx:0,vy:0,a:(i%31)/31*Math.PI*2,
      energy:1e12,age:0,generation:i%14,reproCooldown:1e12,
      g:{hue:(i*29)%360,speed:.45+(i%23)/20,sense:30+(i%121),size:2.5+(i%13)*.5,eff:.6+(i%17)*.04,wander:.2+(i%12)*.1,diet:-1+2*(i%41)/40}
    }));
    sim.foods=Array.from({length:food},(_,i)=>({x:1000000+i*3,y:1000000+i*5,e:8,rich:false,kind:i%2,expiresAt:1e12}));
    sim.addFood=()=>{};
    globalThis.__x40SetSpeed(40);
  },{population,food});
  await sleep(80);
  return state();
}

async function runSynthetic(population,food,durationMs=1800){
  const before=await prepareSynthetic(population,food);
  const start=await page.evaluate(()=>{
    globalThis.__heavyTimer={expected:performance.now()+700,fired:null};
    setTimeout(()=>{globalThis.__heavyTimer.fired=performance.now();},700);
    const now=performance.now();globalThis.__x40SetPaused(false);return now;
  });
  await sleep(durationMs);
  const after=await state();
  const timer=await page.evaluate(()=>globalThis.__heavyTimer);
  await page.evaluate(()=>globalThis.__x40SetPaused(true));
  const wallSeconds=(after.now-start)/1000;
  const achievedMultiplier=(after.simTime-before.simTime)/wallSeconds;
  const displayed=parseFloat(after.achievedText);
  assert(achievedMultiplier>0,`${population}x${food} made no progress`);
  assert(timer.fired!==null&&timer.fired-timer.expected<500,`${population}x${food} event loop starved`);
  assert(after.controller.acc<=.25+1e-12,`${population}x${food} backlog cap exceeded`);
  if(Number.isFinite(displayed)){
    const tolerance=Math.max(2,achievedMultiplier*.5);
    assert(Math.abs(displayed-achievedMultiplier)<=tolerance,`${population}x${food} achieved UI materially dishonest: actual ${achievedMultiplier}, UI ${displayed}`);
  }
  return {population,food,durationMs,wallSeconds,achievedMultiplier,achievedText:after.achievedText,displayedAchieved:Number.isFinite(displayed)?displayed:null,backlogSeconds:after.controller.acc,timerLatenessMs:timer.fired-timer.expected,drawHz:(after.drawCount-before.drawCount)/wallSeconds};
}

const heavy=[];
for(const [population,food] of [[160,300],[260,300],[260,500]]) heavy.push(await runSynthetic(population,food));

assert.equal(pageErrors.length,0,`browser page errors:\n${pageErrors.join('\n')}`);
const receipt={
  format:'gloopipelago-x40-real-browser-qualification',schema:1,status:'PASS',
  browser:{executablePath,version:await browser.version()},buildReceipt,
  policy:{fixedDt:1/60,cpuBudgetMs:6,maxWallDeltaSeconds:.05,maxSimBacklogSeconds:.25,fastRenderThreshold:4,fastRenderIntervalMs:100},
  fourX,natural40,
  transition40To1:{start:transitionStart,end:{now:transitionEnd.now,simTime:transitionEnd.simTime,acc:transitionEnd.controller.acc,achievedText:transitionEnd.achievedText},achievedMultiplier:oneXAfter40},
  pause:{start:pauseStart,end:pauseEnd,exactNoAdvance:pauseEnd===pauseStart},
  visibility:{hiddenStart,hiddenEnd:{now:hiddenEnd.now,simTime:hiddenEnd.simTime,acc:hiddenEnd.controller.acc},visibleStart,visibleEnd:{now:visibleEnd.now,simTime:visibleEnd.simTime,acc:visibleEnd.controller.acc},visibleResumeMultiplier:visibleResume},
  controlProbe,heavy,pageErrors,
  claim:'Real-Chromium product scheduler qualification. 40x is a target; heavy-load rows characterize truthful underachievement rather than guarantee 40x.'
};
fs.writeFileSync(path.join(OUT,'x40-browser-qualification.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify(receipt,null,2));
await browser.close();
