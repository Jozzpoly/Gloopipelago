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
    edgeAlpha:dense?.010:.004,
    contourAlpha:dense?.115:.045,
    contourRadius:radius*(dense?.72:.82),
  };
}

export { clamp01, trait01, m4bPhenotypeVisual, m4bHabitatVisual };
