import { Simulation } from '../src/core/v1-mirror.mjs';

const DT = 1 / 60;
const TRAITS = {
  speed: [.35, 1.9],
  sense: [20, 150],
  size: [2.4, 9],
  eff: [.55, 1.45],
  wander: [.15, 1.5],
  diet: [-1, 1]
};

const BASE = {
  width: 900,
  height: 700,
  mutationScale: 1,
  senseCost: .0026,
  digestExponent: 3,
  minDigestion: .4,
  autoReseed: true,
  foodRate: 10,
  foodEnergyScale: 1,
  foodLifetime: 75,
  dietJumpRate: .02,
  stableNiches: true
};

const PROFILES = [
  { name: 'baseline', config: {} },
  { name: 'mutation-2x', config: { mutationScale: 2 } },
  { name: 'more-resources', config: { foodRate: 16, foodLifetime: 95 } },
  { name: 'sense-cost', config: { senseCost: .006 } },
  { name: 'moving-niches', config: { stableNiches: false } },
  { name: 'softer-diet', config: { digestExponent: 1.8, minDigestion: .3, dietJumpRate: .05 } },
  { name: 'mixed-existing-knobs', config: { mutationScale: 1.7, senseCost: .005, digestExponent: 2.1, minDigestion: .32, foodRate: 14, foodLifetime: 90, dietJumpRate: .06, stableNiches: false } },
  { name: 'double-founders-resources', config: {}, extraFounders: 34, extraFood: 145 },
  { name: 'larger-world-same-budget', config: { width: 1200, height: 900 } },
  { name: 'larger-world-scaled-start', config: { width: 1200, height: 900, foodRate: 16, foodLifetime: 95 }, extraFounders: 34, extraFood: 145 }
];

const BASELINE_SEEDS = [1, 0x12345678, 956866913, 0x9e3779b9, 42424242];
const MATRIX_SEEDS = [1, 0x12345678, 956866913];

const mean = xs => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
const median = xs => {
  if (!xs.length) return 0;
  const a = [...xs].sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
};
const sd = xs => {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(mean(xs.map(x => (x - m) ** 2)));
};
const entropyEffective = counts => {
  const total = counts.reduce((a, b) => a + b, 0);
  if (!total) return 0;
  let h = 0;
  for (const c of counts) if (c) {
    const p = c / total;
    h -= p * Math.log(p);
  }
  return Math.exp(h);
};

function traitStats(blobs) {
  const out = {};
  for (const [key, [lo, hi]] of Object.entries(TRAITS)) {
    const xs = blobs.map(b => b.g[key]);
    out[key] = {
      mean: mean(xs),
      sd: sd(xs),
      normalizedSd: sd(xs) / (hi - lo),
      min: xs.length ? Math.min(...xs) : 0,
      max: xs.length ? Math.max(...xs) : 0
    };
  }
  return out;
}

function normalizedTrait(g, key) {
  const [lo, hi] = TRAITS[key];
  return Math.max(0, Math.min(1, (g[key] - lo) / (hi - lo)));
}

function pairwiseGenomeDistance(blobs) {
  if (blobs.length < 2) return 0;
  const keys = Object.keys(TRAITS);
  let total = 0, pairs = 0;
  for (let i = 0; i < blobs.length; i++) {
    for (let j = i + 1; j < blobs.length; j++) {
      let d2 = 0;
      for (const key of keys) {
        const d = normalizedTrait(blobs[i].g, key) - normalizedTrait(blobs[j].g, key);
        d2 += d * d;
      }
      total += Math.sqrt(d2 / keys.length);
      pairs++;
    }
  }
  return total / pairs;
}

function spatialMetrics(sim, cols = 12, rows = 9) {
  const counts = Array(cols * rows).fill(0);
  for (const b of sim.blobs) {
    const x = Math.min(cols - 1, Math.max(0, Math.floor((b.x / sim.width) * cols)));
    const y = Math.min(rows - 1, Math.max(0, Math.floor((b.y / sim.height) * rows)));
    counts[y * cols + x]++;
  }
  const occupied = counts.map(c => c > 0);
  const occupiedCells = occupied.filter(Boolean).length;
  let regions = 0;
  const seen = new Set();
  for (let idx = 0; idx < occupied.length; idx++) {
    if (!occupied[idx] || seen.has(idx)) continue;
    regions++;
    const q = [idx];
    seen.add(idx);
    while (q.length) {
      const cur = q.pop();
      const cx = cur % cols, cy = Math.floor(cur / cols);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
        const ni = ny * cols + nx;
        if (occupied[ni] && !seen.has(ni)) { seen.add(ni); q.push(ni); }
      }
    }
  }
  const eff = entropyEffective(counts);
  const maxEff = Math.max(1, Math.min(sim.blobs.length, cols * rows));
  return {
    occupiedCells,
    occupiedFraction: occupiedCells / (cols * rows),
    effectiveOccupiedCells: eff,
    normalizedSpatialEntropy: maxEff > 1 ? Math.log(Math.max(1, eff)) / Math.log(maxEff) : 0,
    occupiedRegions: regions
  };
}

function strategyMetrics(blobs) {
  const diet = { A: 0, generalist: 0, B: 0 };
  let extremeDiet = 0;
  const bins = new Map();
  for (const b of blobs) {
    if (b.g.diet < -.5) diet.A++;
    else if (b.g.diet > .5) diet.B++;
    else diet.generalist++;
    if (Math.abs(b.g.diet) >= .8) extremeDiet++;
    const signature = Object.keys(TRAITS).map(key => Math.min(2, Math.floor(normalizedTrait(b.g, key) * 3))).join('');
    bins.set(signature, (bins.get(signature) || 0) + 1);
  }
  const counts = [...bins.values()];
  return {
    diet,
    extremeDietFraction: blobs.length ? extremeDiet / blobs.length : 0,
    strategyBinCount: bins.size,
    strategyEffectiveCount: entropyEffective(counts)
  };
}

function targetableFraction(sim) {
  if (!sim.blobs.length) return 0;
  let targetable = 0;
  for (const b of sim.blobs) {
    const s2 = b.g.sense * b.g.sense;
    let found = false;
    for (const f of sim.foods) {
      const dx = f.x - b.x, dy = f.y - b.y;
      if (dx * dx + dy * dy > s2) continue;
      if (sim.digestion(b.g, f.kind) < sim.minDigestion) continue;
      found = true;
      break;
    }
    if (found) targetable++;
  }
  return targetable / sim.blobs.length;
}

function lineageMetrics(sim, rootById) {
  const counts = new Map();
  for (const b of sim.blobs) {
    const root = rootById.get(b.id) ?? b.id;
    counts.set(root, (counts.get(root) || 0) + 1);
  }
  const xs = [...counts.values()];
  return {
    activeFounderRoots: counts.size,
    topLineageShare: sim.blobs.length ? Math.max(0, ...xs) / sim.blobs.length : 0,
    lineageEffectiveCount: entropyEffective(xs)
  };
}

function runProfile(profile, seed, horizonSeconds) {
  const rootById = new Map();
  const witness = rec => {
    if (rec.kind === 'founder') rootById.set(rec.id, rec.id);
    if (rec.kind === 'birth') rootById.set(rec.id, rootById.get(rec.parentId) ?? rec.parentId);
  };
  const sim = new Simulation({ ...BASE, ...profile.config, seed }, { lifecycleWitness: witness });
  for (let i = 0; i < (profile.extraFounders || 0); i++) {
    const b = sim.spawnBlob();
    rootById.set(b.id, b.id);
  }
  if (profile.extraFood) sim.addFood(profile.extraFood);

  const sampleEvery = 60;
  const sampleTicks = Math.round(sampleEvery / DT);
  const totalTicks = Math.round(horizonSeconds / DT);
  const series = [];
  for (let tick = 1; tick <= totalTicks; tick++) {
    sim.step(DT);
    if (tick % sampleTicks === 0 || tick === totalTicks) {
      const s = sim.snapshot();
      series.push({
        time: s.time,
        population: s.population,
        food: s.food,
        births: s.births,
        deaths: s.deaths,
        dietAbs: s.dietAbs,
        occupiedFraction: spatialMetrics(sim).occupiedFraction
      });
    }
  }

  const snap = sim.snapshot();
  const traits = traitStats(sim.blobs);
  const spatial = spatialMetrics(sim);
  const strategy = strategyMetrics(sim.blobs);
  const lineages = lineageMetrics(sim, rootById);
  return {
    profile: profile.name,
    seed: seed >>> 0,
    horizonSeconds,
    final: snap,
    populationSeries: {
      min: Math.min(...series.map(x => x.population)),
      mean: mean(series.map(x => x.population)),
      max: Math.max(...series.map(x => x.population))
    },
    foodSeries: {
      min: Math.min(...series.map(x => x.food)),
      mean: mean(series.map(x => x.food)),
      max: Math.max(...series.map(x => x.food))
    },
    traits,
    pairwiseGenomeDistance: pairwiseGenomeDistance(sim.blobs),
    spatial,
    strategy,
    lineages,
    targetableFraction: targetableFraction(sim),
    series
  };
}

function aggregateProfile(runs) {
  const pick = fn => runs.map(fn);
  const traitAgg = {};
  for (const key of Object.keys(TRAITS)) {
    traitAgg[key] = {
      medianMean: median(pick(r => r.traits[key].mean)),
      medianNormalizedSd: median(pick(r => r.traits[key].normalizedSd))
    };
  }
  return {
    runs: runs.length,
    finalPopulationMedian: median(pick(r => r.final.population)),
    populationTimeMeanMedian: median(pick(r => r.populationSeries.mean)),
    occupiedFractionMedian: median(pick(r => r.spatial.occupiedFraction)),
    spatialEntropyMedian: median(pick(r => r.spatial.normalizedSpatialEntropy)),
    occupiedRegionsMedian: median(pick(r => r.spatial.occupiedRegions)),
    pairwiseGenomeDistanceMedian: median(pick(r => r.pairwiseGenomeDistance)),
    extremeDietFractionMedian: median(pick(r => r.strategy.extremeDietFraction)),
    strategyBinCountMedian: median(pick(r => r.strategy.strategyBinCount)),
    strategyEffectiveCountMedian: median(pick(r => r.strategy.strategyEffectiveCount)),
    activeFounderRootsMedian: median(pick(r => r.lineages.activeFounderRoots)),
    lineageEffectiveCountMedian: median(pick(r => r.lineages.lineageEffectiveCount)),
    topLineageShareMedian: median(pick(r => r.lineages.topLineageShare)),
    targetableFractionMedian: median(pick(r => r.targetableFraction)),
    traitAgg
  };
}

function execute(mode) {
  let profiles, seeds, horizonSeconds;
  if (mode === 'baseline') {
    profiles = [PROFILES[0]];
    seeds = BASELINE_SEEDS;
    horizonSeconds = 1800;
  } else if (mode === 'matrix') {
    profiles = PROFILES;
    seeds = MATRIX_SEEDS;
    horizonSeconds = 600;
  } else {
    throw new Error('Usage: node tools/living-interest-audit.mjs baseline|matrix');
  }
  const runs = [];
  for (const profile of profiles) for (const seed of seeds) runs.push(runProfile(profile, seed, horizonSeconds));
  const aggregate = {};
  for (const profile of profiles) aggregate[profile.name] = aggregateProfile(runs.filter(r => r.profile === profile.name));
  return {
    mode,
    dt: DT,
    seeds: seeds.map(x => x >>> 0),
    horizonSeconds,
    baselineConfig: BASE,
    profiles: profiles.map(p => ({ name: p.name, config: p.config, extraFounders: p.extraFounders || 0, extraFood: p.extraFood || 0 })),
    aggregate,
    runs
  };
}

const mode = process.argv[2] || 'baseline';
process.stdout.write(JSON.stringify(execute(mode), null, 2) + '\n');
