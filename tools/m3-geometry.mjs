import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { Simulation } from '../src/core/v1-mirror.mjs';

const CORE_PATH = new URL('../src/core/v1-mirror.mjs', import.meta.url);
const EXPECTED_M2A_CORE_SHA256 = '18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56';
const TICKS = 12000;
const DT = 1 / 60;

const CONFIG = Object.freeze({
  digestExponent: 3,
  minDigestion: 0.4,
  foodRate: 10,
  foodLifetime: 75,
  dietJumpRate: 0.02,
  stableNiches: true,
});

const DIMENSIONS = Object.freeze([
  [390, 600],
  [900, 700],
  [1400, 800],
]);

const BASELINE_SEEDS = Object.freeze([
  1,
  0x12345678,
  0x9E3779B9,
  0xDEADBEEF,
  0xFFFFFFFF,
  0x31415926,
  0xABCDEF01,
  0x13579BDF,
  0x2468ACE0,
  0x10203040,
  0x55667788,
  0xCAFEBABE,
]);

// Seeds preserved from the M1.2 Owner smoke / seed-scouting evidence.
const OWNER_EVIDENCE_SEEDS = Object.freeze([
  956866913,
  3667069675,
  4081577095,
  2929087554,
  2006780008,
  1335852448,
  1615210584,
  2147113243,
  4081330723,
]);

const KNOWN_REFERENCES = Object.freeze([
  {
    id: 'P-NOMINAL-S1', seed: 1, width: 900, height: 700,
    state: 'ff304009fd31b57867fe7294c65c38e9c3fa87354497420490bb798e5b40b6ae',
    calls: 451324, rngState: 134153401,
  },
  {
    id: 'P-NOMINAL-S12345678', seed: 0x12345678, width: 900, height: 700,
    state: '65c6731e4594c11bd8402e38626cb92c15c58c34a78a12be9789c027e2305c0b',
    calls: 457687, rngState: 2446567367,
  },
  {
    id: 'P-COMPACT', seed: 0x12345678, width: 390, height: 600,
    state: '1946e4bfe4a4b7406ccfe482f416f80d52bcf576813b23b66b3ea9d1866e952a',
    calls: 458521, rngState: 964098033,
  },
  {
    id: 'P-WIDE', seed: 0x9E3779B9, width: 1400, height: 800,
    state: 'ca054fc347fff72c8805e291c9e60e6999f24493052dd20cbbcb05a40b7f36c3',
    calls: 431905, rngState: 2236244698,
  },
]);

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function f64hex(n) {
  const b = Buffer.allocUnsafe(8);
  b.writeDoubleBE(n, 0);
  return b.toString('hex');
}

function exactEncode(v) {
  if (typeof v === 'number') return { $f64: f64hex(v) };
  if (Array.isArray(v)) return v.map(exactEncode);
  if (v && typeof v === 'object') {
    const out = {};
    for (const k of Object.keys(v)) out[k] = exactEncode(v[k]);
    return out;
  }
  return v;
}

function exactHash(v) {
  return sha256(JSON.stringify(exactEncode(v)));
}

function causalState(sim) {
  return {
    config: {
      width: sim.width, height: sim.height, mutationScale: sim.mutationScale, senseCost: sim.senseCost,
      digestExponent: sim.digestExponent, minDigestion: sim.minDigestion, autoReseed: sim.autoReseed,
      foodRate: sim.foodRate, foodEnergyScale: sim.foodEnergyScale, foodLifetime: sim.foodLifetime,
      dietJumpRate: sim.dietJumpRate, stableNiches: sim.stableNiches,
    },
    seed: sim.seed, simTime: sim.simTime, season: sim.season, nextId: sim.nextId,
    births: sim.births, deaths: sim.deaths, extinctions: sim.extinctions,
    blobs: sim.blobs.map(b => ({
      id: b.id, x: b.x, y: b.y, vx: b.vx, vy: b.vy, a: b.a,
      energy: b.energy, age: b.age, generation: b.generation, reproCooldown: b.reproCooldown,
      g: {
        hue: b.g.hue, speed: b.g.speed, sense: b.g.sense, size: b.g.size,
        eff: b.g.eff, wander: b.g.wander, diet: b.g.diet,
      },
    })),
    foods: sim.foods.map(f => ({
      x: f.x, y: f.y, e: f.e, rich: f.rich, kind: f.kind, expiresAt: f.expiresAt,
    })),
  };
}

function run(seed, width, height) {
  const events = [];
  const sim = new Simulation(
    { seed, width, height, ...CONFIG },
    { lifecycleWitness: event => events.push(event) },
  );

  const rngStartState = sim.rngStream.snapshot();
  let rngCalls = 0;
  const baseRng = sim.rng;
  sim.rng = () => {
    rngCalls++;
    return baseRng();
  };

  for (let tick = 0; tick < TICKS; tick++) sim.step(DT);

  const snapshot = sim.snapshot();
  const founderEvents = events.filter(e => e.kind === 'founder').length;
  const birthEvents = events.filter(e => e.kind === 'birth').length;
  const deathEvents = events.filter(e => e.kind === 'death').length;

  assert.equal(birthEvents, sim.births);
  assert.equal(deathEvents, sim.deaths);
  assert.equal(founderEvents, 34 + 12 * sim.extinctions);

  return {
    seed: seed >>> 0,
    width,
    height,
    area: width * height,
    causalSha256: exactHash(causalState(sim)),
    rngStartState,
    rngState: sim.rngStream.snapshot(),
    rngCalls,
    lifecycleSha256: exactHash(events),
    founderEvents,
    birthEvents,
    deathEvents,
    ...snapshot,
  };
}

const coreBytes = fs.readFileSync(CORE_PATH);
const coreSha256 = sha256(coreBytes);
assert.equal(coreSha256, EXPECTED_M2A_CORE_SHA256, 'M3 geometry probe must run on exact promoted M2a core');

const validation = KNOWN_REFERENCES.map(ref => {
  const row = run(ref.seed, ref.width, ref.height);
  const pass = row.causalSha256 === ref.state && row.rngCalls === ref.calls && row.rngState === ref.rngState;
  assert.equal(pass, true, `reference validation failed: ${ref.id}`);
  return {
    id: ref.id,
    seed: ref.seed >>> 0,
    width: ref.width,
    height: ref.height,
    expectedState: ref.state,
    gotState: row.causalSha256,
    expectedCalls: ref.calls,
    gotCalls: row.rngCalls,
    expectedRngState: ref.rngState,
    gotRngState: row.rngState,
    pass,
  };
});

const seeds = [...new Set([...BASELINE_SEEDS, ...OWNER_EVIDENCE_SEEDS].map(x => x >>> 0))];
const rows = [];
for (const seed of seeds) {
  for (const [width, height] of DIMENSIONS) rows.push(run(seed, width, height));
}

console.log(JSON.stringify({
  format: 'gloopipelago-m3-geometry-feasibility',
  schema: 1,
  source: {
    corePath: 'src/core/v1-mirror.mjs',
    coreSha256,
  },
  config: CONFIG,
  ticks: TICKS,
  dt: DT,
  dimensions: DIMENSIONS,
  baselineSeeds: BASELINE_SEEDS,
  ownerEvidenceSeeds: OWNER_EVIDENCE_SEEDS,
  seeds,
  validation,
  rows,
}, null, 2));
