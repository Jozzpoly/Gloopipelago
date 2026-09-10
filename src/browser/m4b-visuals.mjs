const clamp01 = v => Math.max(0, Math.min(1, v));
const lerp = (a,b,t) => a + (b-a)*t;
const trait01 = (v,lo,hi) => clamp01((v-lo)/(hi-lo));

function m4bPhenotypeVisual(genome) {
  const speed01 = trait01(genome.speed,.35,1.9);
  const sense01 = trait01(genome.sense,20,150);
  const size01 = trait01(genome.size,2.4,9);
  const diet01 = clamp01(((genome.diet ?? 0)+1)/2);
  const inheritedHue = ((genome.hue ?? 0)%360+360)%360;

  return {
    speed01,
    sense01,
    size01,
    diet01,
    bodyRadius:genome.size,
    bodyLength:genome.size*lerp(1.03,1.30,speed01),
    bodyWidth:genome.size*lerp(.98,.82,speed01),
    tailLength:lerp(4,18,speed01),
    senseLength:lerp(8,28,sense01),
    senseHalfAngle:lerp(.25,.43,sense01),
    dietHue:lerp(190,40,diet01),
    accentHue:inheritedHue,
    accentRadius:lerp(1.05,2.15,size01),
  };
}

function m4bHabitatVisual(habitat, worldWidth, worldHeight) {
  const minWorld=Math.min(worldWidth,worldHeight);
  const radius=minWorld*habitat.spread;
  const dense=habitat.regime==='dense';
  return {
    x:habitat.x*worldWidth,
    y:habitat.y*worldHeight,
    radius,
    dense,
    kind:habitat.kind,
    coreAlpha:dense?.095:.032,
    midAlpha:dense?.045:.022,
    edgeAlpha:dense?.004:.002,
  };
}

function m4bHabitatRgb(kind) {
  return kind===0 ? [85,185,225] : [242,172,76];
}

function drawM4bHabitat(ctx, habitat, worldWidth, worldHeight) {
  const v=m4bHabitatVisual(habitat,worldWidth,worldHeight);
  const [r,g,b]=m4bHabitatRgb(v.kind);
  const grad=ctx.createRadialGradient(v.x,v.y,0,v.x,v.y,v.radius);
  grad.addColorStop(0,`rgba(${r},${g},${b},${v.coreAlpha})`);
  grad.addColorStop(.46,`rgba(${r},${g},${b},${v.midAlpha})`);
  grad.addColorStop(1,`rgba(${r},${g},${b},${v.edgeAlpha})`);
  ctx.fillStyle=grad;
  ctx.beginPath();
  ctx.arc(v.x,v.y,v.radius,0,Math.PI*2);
  ctx.fill();

  const inner=v.radius*(v.dense?.34:.58);
  const innerGrad=ctx.createRadialGradient(v.x,v.y,0,v.x,v.y,inner);
  innerGrad.addColorStop(0,`rgba(${r},${g},${b},${v.dense?.055:.010})`);
  innerGrad.addColorStop(1,`rgba(${r},${g},${b},0)`);
  ctx.fillStyle=innerGrad;
  ctx.beginPath();
  ctx.arc(v.x,v.y,inner,0,Math.PI*2);
  ctx.fill();
}

function drawM4bBlob(ctx, blob) {
  const g=blob.g;
  const v=m4bPhenotypeVisual(g);
  const velocity=Math.hypot(blob.vx,blob.vy);
  const angle=velocity>.08?Math.atan2(blob.vy,blob.vx):blob.a;
  const ca=Math.cos(angle),sa=Math.sin(angle);

  const rearX=blob.x-ca*v.bodyLength*.72;
  const rearY=blob.y-sa*v.bodyLength*.72;
  const tailX=rearX-ca*v.tailLength;
  const tailY=rearY-sa*v.tailLength;
  ctx.strokeStyle=`hsla(${v.dietHue},76%,60%,${.13+.20*v.speed01})`;
  ctx.lineWidth=Math.max(.7,v.bodyWidth*.32);
  ctx.lineCap='round';
  ctx.beginPath();
  ctx.moveTo(rearX,rearY);
  ctx.lineTo(tailX,tailY);
  ctx.stroke();

  const noseX=blob.x+ca*v.bodyLength*.72;
  const noseY=blob.y+sa*v.bodyLength*.72;
  ctx.strokeStyle=`hsla(${v.dietHue},70%,72%,.16)`;
  ctx.fillStyle=`hsla(${v.dietHue},78%,74%,.34)`;
  ctx.lineWidth=.8;
  for(const side of [-1,1]){
    const a=angle+side*v.senseHalfAngle;
    const tx=noseX+Math.cos(a)*v.senseLength;
    const ty=noseY+Math.sin(a)*v.senseLength;
    ctx.beginPath();
    ctx.moveTo(noseX,noseY);
    ctx.lineTo(tx,ty);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(tx,ty,1.05,0,Math.PI*2);
    ctx.fill();
  }

  ctx.save();
  ctx.translate(blob.x,blob.y);
  ctx.rotate(angle);
  ctx.fillStyle=`hsl(${v.dietHue},72%,56%)`;
  ctx.beginPath();
  ctx.ellipse(0,0,v.bodyLength,v.bodyWidth,0,0,Math.PI*2);
  ctx.fill();

  ctx.fillStyle=`hsla(${v.dietHue},70%,38%,.32)`;
  ctx.beginPath();
  ctx.ellipse(-v.bodyLength*.38,0,v.bodyLength*.36,v.bodyWidth*.72,0,0,Math.PI*2);
  ctx.fill();

  ctx.fillStyle=`hsl(${v.accentHue},78%,68%)`;
  ctx.beginPath();
  ctx.arc(v.bodyLength*.14,-v.bodyWidth*.28,v.accentRadius,0,Math.PI*2);
  ctx.fill();

  const energy=clamp01(blob.energy/140);
  ctx.fillStyle=`rgba(255,255,255,${.20+.62*energy})`;
  ctx.beginPath();
  ctx.arc(v.bodyLength*.30,v.bodyWidth*.05,Math.max(.9,v.bodyWidth*.18),0,Math.PI*2);
  ctx.fill();
  ctx.restore();
}

export {
  clamp01,
  trait01,
  m4bPhenotypeVisual,
  m4bHabitatVisual,
  drawM4bHabitat,
  drawM4bBlob,
};
