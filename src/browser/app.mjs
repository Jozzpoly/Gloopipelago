const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
const ui = Object.fromEntries([...document.querySelectorAll('[id]')].map(e=>[e.id,e]));
let W=900,H=700,DPR=1,view=computeViewTransform(W,H),paused=false,speedMul=1,acc=0;
let dprMediaQuery=null;
let seed = Math.floor(Math.random()*0xffffffff) >>> 0;
let sim;

function onDprChange(){resize();}
function watchDpr(){
  if(typeof globalThis.matchMedia!=='function') return;
  dprMediaQuery?.removeEventListener?.('change',onDprChange);
  const rawDpr=globalThis.devicePixelRatio||1;
  dprMediaQuery=globalThis.matchMedia(`(resolution: ${rawDpr}dppx)`);
  dprMediaQuery.addEventListener?.('change',onDprChange,{once:true});
}

function resize(){
  DPR=Math.min(2,globalThis.devicePixelRatio||1);
  const r=canvas.getBoundingClientRect();
  W=r.width; H=r.height;
  canvas.width=Math.max(1,Math.floor(W*DPR));
  canvas.height=Math.max(1,Math.floor(H*DPR));
  view=computeViewTransform(W,H);
  ctx.setTransform(DPR,0,0,DPR,0,0);
  watchDpr();
}

function startWorld(nextSeed=seed){
  seed=nextSeed>>>0;
  sim=new Simulation({seed,width:LOGICAL_WORLD_WIDTH,height:LOGICAL_WORLD_HEIGHT,digestExponent:3,minDigestion:.4,foodRate:10,foodLifetime:75,dietJumpRate:.02,stableNiches:true});
  acc=0;
}

addEventListener('resize',resize); resize(); startWorld(seed);

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

let last=performance.now();
function frame(now){
  const raw=Math.min(.05,(now-last)/1000);last=now;
  if(!paused){
    acc+=raw*speedMul; const fixed=1/60; let guard=0;
    while(acc>=fixed && guard++<20){sim.step(fixed);acc-=fixed;}
  }
  draw();requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

ui.pause.onclick=()=>{paused=!paused;ui.pause.textContent=paused?'Wznów':'Pauza'};
ui.reset.onclick=()=>startWorld(seed);
ui.newSeed.onclick=()=>startWorld((Math.random()*0xffffffff)>>>0);
ui.burst.onclick=()=>sim.addFood(50);
ui.catastrophe.onclick=()=>sim.catastrophe();
ui.speed.oninput=e=>{speedMul=+e.target.value;ui.speedLabel.textContent=speedMul+'×'};
canvas.addEventListener('pointerdown',e=>{
  const r=canvas.getBoundingClientRect();
  const worldPoint=viewToWorld(e.clientX-r.left,e.clientY-r.top,view);
  if(worldPoint) sim.addFood(18,false,worldPoint);
});
