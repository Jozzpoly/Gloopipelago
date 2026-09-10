import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const OUT=path.join(ROOT,'audit-results');
fs.mkdirSync(OUT,{recursive:true});
const build=spawnSync(process.execPath,['tools/build-standalone.mjs','build'],{cwd:ROOT,encoding:'utf8'});
assert.equal(build.status,0,build.stderr||build.stdout);
const buildReceipt=JSON.parse(build.stdout);
let html=fs.readFileSync(path.join(ROOT,'dist/gloopipelago.html'),'utf8');
assert(html.includes('let sim;'),'simulation seam missing');
html=html.replace('let sim;','let sim; globalThis.__probeSim=()=>sim; globalThis.__probePaused=()=>paused;');
const instrumented=path.join(OUT,'fast-forward-probe.html');
fs.writeFileSync(instrumented,html);

const candidates=[process.env.CHROME_BIN,'/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].filter(Boolean);
const executablePath=candidates.find(p=>fs.existsSync(p));
assert(executablePath,'Chrome/Chromium executable not found');
const browser=await puppeteer.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage();
await page.setViewport({width:1400,height:800,deviceScaleFactor:1});
await page.goto(pathToFileURL(instrumented).href,{waitUntil:'load'});
await page.waitForFunction(()=>globalThis.__probeSim&&globalThis.__probeSim());
await page.evaluate(()=>{ if(!globalThis.__probePaused()) document.getElementById('pause').onclick(); });

async function runProbe({label,target=40,durationMs=3000,seed=1,synthetic=null}){
  return page.evaluate(async ({label,target,durationMs,seed,synthetic})=>{
    const dt=1/60;
    const sim=globalThis.__probeSim();
    sim.reset(seed);
    if(synthetic){
      const {population,food}=synthetic;
      sim.foodRate=0; sim.foodLifetime=1e12; sim.simTime=0; sim.season=0;
      sim.births=Math.max(0,population-34); sim.deaths=0; sim.extinctions=0; sim.nextId=population+1;
      sim.blobs=Array.from({length:population},(_,i)=>({id:i+1,x:(37*i+23)%900,y:(53*i+31)%700,vx:0,vy:0,a:(i%31)/31*Math.PI*2,energy:1e12,age:0,generation:i%14,reproCooldown:1e12,g:{hue:(i*29)%360,speed:.45+(i%23)/20,sense:30+(i%121),size:2.5+(i%13)*.5,eff:.6+(i%17)*.04,wander:.2+(i%12)*.1,diet:-1+2*(i%41)/40}}));
      sim.foods=Array.from({length:food},(_,i)=>({x:1000000+i*3,y:1000000+i*5,e:8,rich:false,kind:i%2,expiresAt:1e12}));
      // Freeze synthetic load shape: no stochastic/seasonal additions, no consumption for off-world food.
      sim.addFood=()=>{};
    } else {
      // Warm natural state to avoid measuring only founder initialization.
      for(let i=0;i<1200;i++) sim.step(dt);
    }

    const startSim=sim.simTime;
    const startWall=performance.now();
    let completed=0,tasks=0,maxTaskMs=0;
    const taskDurations=[];
    const rafTimes=[];
    let rafActive=true;
    const raf=ts=>{ if(rafActive){rafTimes.push(ts); requestAnimationFrame(raf);} };
    requestAnimationFrame(raf);
    const timerIntervals=[];
    let lastTimer=performance.now();
    const timer=setInterval(()=>{const n=performance.now();timerIntervals.push(n-lastTimer);lastTimer=n;},50);
    let oneSecondTimerLateness=null;
    setTimeout(()=>{oneSecondTimerLateness=performance.now()-(startWall+1000);},1000);

    await new Promise(resolve=>{
      const channel=new MessageChannel();
      channel.port1.onmessage=()=>{
        const taskStart=performance.now();
        const elapsed=taskStart-startWall;
        if(elapsed>=durationMs){resolve();return;}
        const desired=Math.floor((elapsed/1000)*target/dt);
        const deadline=taskStart+6;
        while(completed<desired && performance.now()<deadline){sim.step(dt);completed++;}
        const taskMs=performance.now()-taskStart;
        taskDurations.push(taskMs); maxTaskMs=Math.max(maxTaskMs,taskMs); tasks++;
        channel.port2.postMessage(0);
      };
      channel.port2.postMessage(0);
    });

    const endWall=performance.now();
    rafActive=false; clearInterval(timer);
    const wallSeconds=(endWall-startWall)/1000;
    const simulatedSeconds=sim.simTime-startSim;
    const sortedTasks=[...taskDurations].sort((a,b)=>a-b);
    const sortedTimers=[...timerIntervals].sort((a,b)=>a-b);
    const rafIntervals=rafTimes.slice(1).map((t,i)=>t-rafTimes[i]).sort((a,b)=>a-b);
    const pct=(a,p)=>a.length?a[Math.min(a.length-1,Math.floor((a.length-1)*p))]:null;
    return {
      label,target,durationMs,seed,synthetic,
      wallSeconds,simulatedSeconds,achievedMultiplier:simulatedSeconds/wallSeconds,
      final:{time:sim.simTime,population:sim.blobs.length,food:sim.foods.length},
      scheduler:{tasks,completedSteps:completed,maxTaskMs,p50TaskMs:pct(sortedTasks,.5),p95TaskMs:pct(sortedTasks,.95),p99TaskMs:pct(sortedTasks,.99)},
      responsiveness:{oneSecondTimerLatenessMs:oneSecondTimerLateness,timerCallbacks:timerIntervals.length,p95TimerIntervalMs:pct(sortedTimers,.95),maxTimerIntervalMs:sortedTimers.at(-1)??null,rafCallbacks:rafTimes.length,p50RafIntervalMs:pct(rafIntervals,.5),p95RafIntervalMs:pct(rafIntervals,.95),maxRafIntervalMs:rafIntervals.at(-1)??null}
    };
  },{label,target,durationMs,seed,synthetic});
}

const natural=[];
for(const seed of [1,0x12345678,956866913]) natural.push(await runProbe({label:`natural-${seed}`,seed,target:40,durationMs:3000}));
const synthetic=[];
for(const load of [{population:160,food:300},{population:260,food:300},{population:260,food:500}]) synthetic.push(await runProbe({label:`synthetic-${load.population}x${load.food}`,seed:0xC0FFEE,target:40,durationMs:2000,synthetic:load}));

const receipt={format:'gloopipelago-decoupled-fast-forward-browser-probe',schema:1,browser:{executablePath,version:await browser.version()},buildReceipt,prototype:{fixedDt:1/60,targetMultiplier:40,taskCpuBudgetMs:6,yieldMechanism:'MessageChannel',rendering:'existing paused RAF loop continues drawing latest state',note:'audit-only feasibility probe; not product implementation'},natural,synthetic,interpretation:{naturalAllAtLeast38x:natural.every(r=>r.achievedMultiplier>=38),workerRequiredByThisProbe:!natural.every(r=>r.achievedMultiplier>=38)?'POSSIBLY':'NO',heavyLoadsMayUnderachieve:synthetic.some(r=>r.achievedMultiplier<38)},status:'PASS'};
fs.writeFileSync(path.join(OUT,'fast-forward-browser-probe.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify(receipt,null,2));
await browser.close();
