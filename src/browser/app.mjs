const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
const ui = Object.fromEntries([...document.querySelectorAll('[id]')].map(e=>[e.id,e]));

const FIXED_DT_BROWSER=1/60;
const SCHEDULER_CPU_BUDGET_MS=6;
const MAX_WALL_DELTA_SECONDS=.05;
const MAX_SIM_BACKLOG_SECONDS=.25;
const MAX_PUMP_DELAY_MS=50;
const IDLE_PUMP_DELAY_MS=100;
const FAST_RENDER_THRESHOLD=4;
const FAST_RENDER_INTERVAL_MS=100;
const ACHIEVED_SAMPLE_MS=500;

let W=900,H=700,DPR=1,view=computeViewTransform(W,H),paused=false,speedMul=1,acc=0;
let schedulerLast=performance.now();
let achievedWall=schedulerLast,achievedSim=0,achievedSpeed=0;
let lastFullDraw=-Infinity,forceNextDraw=true;
let seed = Math.floor(Math.random()*0xffffffff) >>> 0;
let sim;

const currentDpr=()=>Math.min(2,globalThis.devicePixelRatio||1);
const isHidden=()=>document.hidden===true;

function resetAchievedMeasurement(now=performance.now()){
  achievedWall=now;
  achievedSim=sim?.simTime??0;
  achievedSpeed=0;
  if(ui.achievedSpeed) ui.achievedSpeed.textContent=paused||isHidden()?'0×':'—';
}

function resetSchedulerTiming(now=performance.now()){
  schedulerLast=now;
  acc=0;
  resetAchievedMeasurement(now);
}

function resize(){
  DPR=currentDpr();
  const r=canvas.getBoundingClientRect();
  W=r.width; H=r.height;
  canvas.width=Math.max(1,Math.floor(W*DPR));
  canvas.height=Math.max(1,Math.floor(H*DPR));
  view=computeViewTransform(W,H);
  ctx.setTransform(DPR,0,0,DPR,0,0);
  forceNextDraw=true;
}

function syncPresentationDpr(){
  if(currentDpr()!==DPR) resize();
}

function startWorld(nextSeed=seed){
  seed=nextSeed>>>0;
  sim=new Simulation({seed,width:LOGICAL_WORLD_WIDTH,height:LOGICAL_WORLD_HEIGHT,digestExponent:3,minDigestion:.4,foodRate:10,foodLifetime:75,dietJumpRate:.02,stableNiches:true});
  resetSchedulerTiming();
  forceNextDraw=true;
}

function setSpeedMultiplier(value){
  const n=Number(value);
  speedMul=Number.isFinite(n)?Math.max(.25,Math.min(40,n)):1;
  ui.speed.value=String(speedMul);
  ui.speedLabel.textContent=speedMul+'×';
  resetSchedulerTiming();
  forceNextDraw=true;
}

function setPaused(next){
  paused=Boolean(next);
  ui.pause.textContent=paused?'Wznów':'Pauza';
  resetSchedulerTiming();
  forceNextDraw=true;
}

addEventListener('resize',resize);
document.addEventListener?.('visibilitychange',()=>{
  resetSchedulerTiming();
  forceNextDraw=true;
});
resize();
startWorld(seed);

function deltaText(value, initial, digits=2){
  const d=value-initial;
  const sign=d>0?'+':'';
  return `${value.toFixed(digits)} (${sign}${d.toFixed(digits)})`;
}

function draw(){
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.clearRect(0,0,W,H);
  ctx.setTransform(DPR*view.scale,0,0,DPR*view.scale,DPR*view.offsetX,DPR*view.offsetY);

  const phase=sim.season%3;
  const centers = phase===0 ? [[.24,.30],[.76,.70]] : phase===1 ? [[.30,.66],[.70,.34]] : [[.22,.50],[.78,.50]];
  for(const [cx,cy] of centers){
    const r=Math.min(LOGICAL_WORLD_WIDTH,LOGICAL_WORLD_HEIGHT)*.19;
    const grad=ctx.createRadialGradient(cx*LOGICAL_WORLD_WIDTH,cy*LOGICAL_WORLD_HEIGHT,0,cx*LOGICAL_WORLD_WIDTH,cy*LOGICAL_WORLD_HEIGHT,r);
    grad.addColorStop(0,'rgba(78,160,118,.07)'); grad.addColorStop(1,'rgba(78,160,118,0)');
    ctx.fillStyle=grad; ctx.beginPath();ctx.arc(cx*LOGICAL_WORLD_WIDTH,cy*LOGICAL_WORLD_HEIGHT,r,0,Math.PI*2);ctx.fill();
  }

  for(const f of sim.foods){
    ctx.fillStyle=f.rich?'rgba(180,240,210,.95)':(f.kind===0?'rgba(85,185,225,.88)':'rgba(242,172,76,.9)');
    ctx.beginPath();ctx.arc(f.x,f.y,f.rich?3.5:2.3,0,Math.PI*2);ctx.fill();
  }

  for(const b of sim.blobs){
    const g=b.g,v=Math.hypot(b.vx,b.vy),ang=Math.atan2(b.vy,b.vx);
    const dietHue=115-75*g.diet;
    ctx.strokeStyle=`hsla(${dietHue},75%,62%,.30)`; ctx.lineWidth=Math.max(1,g.size*.35);
    ctx.beginPath();ctx.moveTo(b.x-Math.cos(ang)*g.size*.6,b.y-Math.sin(ang)*g.size*.6);
    ctx.lineTo(b.x-Math.cos(ang)*(g.size+v*.12),b.y-Math.sin(ang)*(g.size+v*.12));ctx.stroke();
    ctx.strokeStyle=`hsla(${dietHue},65%,68%,.055)`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(b.x,b.y,g.sense,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle=`hsl(${dietHue},72%,58%)`;ctx.beginPath();ctx.arc(b.x,b.y,g.size,0,Math.PI*2);ctx.fill();
    const e=Math.max(0,Math.min(1,b.energy/140));ctx.fillStyle=`rgba(255,255,255,${.18+.65*e})`;
    ctx.beginPath();ctx.arc(b.x+g.size*.25,b.y-g.size*.2,Math.max(1.1,g.size*.2),0,Math.PI*2);ctx.fill();
  }

  const snap=sim.snapshot(), init=sim.initial;
  ui.pop.textContent=snap.population; ui.gen.textContent=snap.maxGeneration; ui.food.textContent=snap.food;
  ui.age.textContent=Math.floor(snap.time)+'s'; ui.seed.textContent=String(seed).slice(-6); ui.births.textContent=snap.births;
  ui.avgSpeed.textContent=deltaText(snap.speed,init.speed,2);
  ui.avgSense.textContent=deltaText(snap.sense,init.sense,0);
  ui.avgSize.textContent=deltaText(snap.size,init.size,1);
  ui.avgEff.textContent=deltaText(snap.eff,init.eff,2);
  ui.avgDiet.textContent=deltaText(snap.dietAbs,init.dietAbs,2);
  const nicheA=sim.blobs.filter(b=>b.g.diet<-.5).length, nicheB=sim.blobs.filter(b=>b.g.diet>.5).length, generalists=sim.blobs.length-nicheA-nicheB;
  ui.overlay.innerHTML=`seed <b>${seed}</b> · sezon <b>${snap.season+1}</b> · nisze <b>${nicheA}/${generalists}/${nicheB}</b><br><span style="color:#8f9aa5">specjalista A / generalista / specjalista B</span>`;
}

function updateAchievedSpeed(now){
  if(paused||isHidden()){
    achievedWall=now;
    achievedSim=sim.simTime;
    achievedSpeed=0;
    if(ui.achievedSpeed) ui.achievedSpeed.textContent='0×';
    return;
  }
  const elapsedMs=now-achievedWall;
  if(elapsedMs<ACHIEVED_SAMPLE_MS) return;
  achievedSpeed=(sim.simTime-achievedSim)/(elapsedMs/1000);
  achievedWall=now;
  achievedSim=sim.simTime;
  if(ui.achievedSpeed){
    const digits=achievedSpeed>=10?1:2;
    ui.achievedSpeed.textContent=achievedSpeed.toFixed(digits)+'×';
  }
}

function schedulePump(delayMs){
  const handle=setTimeout(simulationPump,delayMs);
  handle?.unref?.();
}

function simulationPump(){
  const now=performance.now();
  const raw=Math.min(MAX_WALL_DELTA_SECONDS,Math.max(0,(now-schedulerLast)/1000));
  schedulerLast=now;

  if(!paused&&!isHidden()){
    acc=Math.min(MAX_SIM_BACKLOG_SECONDS,acc+raw*speedMul);
    const deadline=performance.now()+SCHEDULER_CPU_BUDGET_MS;
    while(acc>=FIXED_DT_BROWSER){
      sim.step(FIXED_DT_BROWSER);
      acc-=FIXED_DT_BROWSER;
      if(performance.now()>=deadline) break;
    }
  }else{
    acc=0;
  }

  if(paused||isHidden()){
    schedulePump(IDLE_PUMP_DELAY_MS);
    return;
  }

  if(acc>=FIXED_DT_BROWSER){
    schedulePump(0);
    return;
  }

  const untilNext=((FIXED_DT_BROWSER-acc)/speedMul)*1000;
  schedulePump(Math.max(0,Math.min(MAX_PUMP_DELAY_MS,untilNext)));
}

function frame(now){
  syncPresentationDpr();
  updateAchievedSpeed(now);
  const highSpeed=!paused&&!isHidden()&&speedMul>FAST_RENDER_THRESHOLD;
  if(forceNextDraw||!highSpeed||now-lastFullDraw>=FAST_RENDER_INTERVAL_MS){
    draw();
    lastFullDraw=now;
    forceNextDraw=false;
  }
  requestAnimationFrame(frame);
}

schedulePump(0);
requestAnimationFrame(frame);

ui.pause.onclick=()=>setPaused(!paused);
ui.reset.onclick=()=>startWorld(seed);
ui.newSeed.onclick=()=>startWorld((Math.random()*0xffffffff)>>>0);
ui.burst.onclick=()=>{sim.addFood(50);forceNextDraw=true;};
ui.catastrophe.onclick=()=>{sim.catastrophe();forceNextDraw=true;};
ui.speed.oninput=e=>setSpeedMultiplier(e.target.value);
for(const button of document.querySelectorAll('[data-speed]')) button.onclick=()=>setSpeedMultiplier(button.dataset.speed);
canvas.addEventListener('pointerdown',e=>{
  const r=canvas.getBoundingClientRect();
  const worldPoint=viewToWorld(e.clientX-r.left,e.clientY-r.top,view);
  if(worldPoint){sim.addFood(18,false,worldPoint);forceNextDraw=true;}
});
