const clamp01 = v => Math.max(0, Math.min(1, v));
const lerp = (a,b,t) => a + (b-a)*t;
const trait01 = (v,lo,hi) => clamp01((v-lo)/(hi-lo));

function m4bPhenotypeVisual(genome) {
  const speed01 = trait01(genome.speed,.35,1.9);
  const sense01 = trait01(genome.sense,20,150);
  const size01 = trait01(genome.size,2.4,9);
  const diet01 = clamp01(((genome.diet ?? 0)+1)/2);
  const inheritedHue = ((genome.hue ?? 0)%360+360)%360;
  const visualRadius = lerp(3.2,9.8,size01);

  return {
    speed01,
    sense01,
    size01,
    diet01,
    visualRadius,
    bodyLength:visualRadius*lerp(1.08,1.72,speed01),
    bodyWidth:visualRadius*lerp(1.00,.72,speed01),
    tailLength:lerp(2.5,22,speed01),
    senseCueRadius:visualRadius+lerp(3,12,sense01),
    senseArcSpan:lerp(.24,.42,sense01),
    dietHue:lerp(190,40,diet01),
    accentHue:inheritedHue,
    accentRadius:visualRadius*lerp(.18,.25,size01),
  };
}

function m4bHabitatVisual(habitat, worldWidth, worldHeight) {
  const minWorld=Math.min(worldWidth,worldHeight);
  const halfExtent=minWorld*habitat.spread;
  const dense=habitat.regime==='dense';
  return {
    x:habitat.x*worldWidth,
    y:habitat.y*worldHeight,
    halfExtent,
    dense,
    kind:habitat.kind,
    innerAlpha:dense?.060:.029,
    midAlpha:dense?.020:.010,
    outerAlpha:dense?.010:.005,
    cornerRadius:Math.max(5,halfExtent*.10),
  };
}

function m4bHabitatRgb(kind) {
  return kind===0 ? [85,185,225] : [242,172,76];
}

function roundedField(ctx,x,y,halfExtent,radius,rgba){
  ctx.fillStyle=rgba;
  ctx.beginPath();
  if(typeof ctx.roundRect==='function') ctx.roundRect(x-halfExtent,y-halfExtent,halfExtent*2,halfExtent*2,radius);
  else ctx.rect(x-halfExtent,y-halfExtent,halfExtent*2,halfExtent*2);
  ctx.fill();
}

function drawM4bHabitat(ctx, habitat, worldWidth, worldHeight) {
  const v=m4bHabitatVisual(habitat,worldWidth,worldHeight);
  const [r,g,b]=m4bHabitatRgb(v.kind);
  roundedField(ctx,v.x,v.y,v.halfExtent*1.08,v.cornerRadius*1.25,`rgba(${r},${g},${b},${v.outerAlpha})`);
  roundedField(ctx,v.x,v.y,v.halfExtent*1.04,v.cornerRadius*1.12,`rgba(${r},${g},${b},${v.midAlpha})`);
  roundedField(ctx,v.x,v.y,v.halfExtent,v.cornerRadius,`rgba(${r},${g},${b},${v.innerAlpha})`);
}

function drawM4bBlob(ctx, blob) {
  const g=blob.g;
  const v=m4bPhenotypeVisual(g);
  const velocity=Math.hypot(blob.vx,blob.vy);
  const angle=velocity>.08?Math.atan2(blob.vy,blob.vx):blob.a;
  const ca=Math.cos(angle),sa=Math.sin(angle);

  const rearX=blob.x-ca*v.bodyLength*.70;
  const rearY=blob.y-sa*v.bodyLength*.70;
  const tailX=rearX-ca*v.tailLength;
  const tailY=rearY-sa*v.tailLength;
  ctx.strokeStyle=`hsla(${v.dietHue},82%,62%,${.14+.24*v.speed01})`;
  ctx.lineWidth=Math.max(.8,v.bodyWidth*.34);
  ctx.lineCap='round';
  ctx.beginPath();
  ctx.moveTo(rearX,rearY);
  ctx.lineTo(tailX,tailY);
  ctx.stroke();

  ctx.strokeStyle=`hsla(${v.dietHue},76%,72%,${.10+.08*v.sense01})`;
  ctx.lineWidth=.8;
  for(const center of [0,Math.PI*.5,Math.PI,Math.PI*1.5]){
    ctx.beginPath();
    ctx.arc(blob.x,blob.y,v.senseCueRadius,center-v.senseArcSpan*.5,center+v.senseArcSpan*.5);
    ctx.stroke();
  }

  ctx.save();
  ctx.translate(blob.x,blob.y);
  ctx.rotate(angle);
  ctx.fillStyle=`hsl(${v.dietHue},74%,56%)`;
  ctx.beginPath();
  ctx.ellipse(0,0,v.bodyLength,v.bodyWidth,0,0,Math.PI*2);
  ctx.fill();

  ctx.fillStyle=`hsla(${v.dietHue},72%,35%,.34)`;
  ctx.beginPath();
  ctx.ellipse(-v.bodyLength*.40,0,v.bodyLength*.34,v.bodyWidth*.70,0,0,Math.PI*2);
  ctx.fill();

  ctx.strokeStyle=`hsla(${v.dietHue},85%,82%,.38)`;
  ctx.lineWidth=.65;
  ctx.beginPath();
  ctx.ellipse(0,0,v.bodyLength,v.bodyWidth,0,0,Math.PI*2);
  ctx.stroke();

  ctx.fillStyle=`hsl(${v.accentHue},80%,68%)`;
  ctx.beginPath();
  ctx.arc(v.bodyLength*.12,-v.bodyWidth*.28,v.accentRadius,0,Math.PI*2);
  ctx.fill();

  const energy=clamp01(blob.energy/140);
  ctx.fillStyle=`rgba(255,255,255,${.18+.64*energy})`;
  ctx.beginPath();
  ctx.arc(v.bodyLength*.31,v.bodyWidth*.04,Math.max(1,v.bodyWidth*.18),0,Math.PI*2);
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
