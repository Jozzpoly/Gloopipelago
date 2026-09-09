import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const V1_PATH = path.join(ROOT, 'archive/v1/gloopipelago_single.html');
export const EXPECTED_V1_SHA256 = 'ededf979b857f795a93f8d019ab3fc6364df0156885f381050641ab30ffff1d8';
export const EXPECTED_ORACLE_SHA256 = '10ff185a4c8500f0c84b61f26f120918b362158bdf32bd766bdbe4c3f5f8eea6';
export const FIXED_DT = 1/60;
export const BROWSER_CONFIG = Object.freeze({
  digestExponent: 3,
  minDigestion: 0.4,
  foodRate: 10,
  foodLifetime: 75,
  dietJumpRate: 0.02,
  stableNiches: true,
});

export function sha256(data) { return crypto.createHash('sha256').update(data).digest('hex'); }
export function readFrozenSource() {
  const bytes = fs.readFileSync(V1_PATH);
  const hash = sha256(bytes);
  if (hash !== EXPECTED_V1_SHA256) throw new Error(`Frozen V1 SHA mismatch: ${hash}`);
  return { bytes, text: bytes.toString('utf8'), hash };
}

export function extractOracle() {
  const { text, hash: sourceSha256, bytes } = readFrozenSource();
  const startMarker = 'function mulberry32(seed) {';
  const endMarker = '\n\n\nconst canvas = document.getElementById(\'world\');';
  const start = text.indexOf(startMarker);
  const secondStart = text.indexOf(startMarker, start + 1);
  const end = text.indexOf(endMarker, start);
  if (start < 0 || end < 0 || secondStart >= 0) throw new Error(`Ambiguous oracle anchors start=${start}, second=${secondStart}, end=${end}`);
  const core = text.slice(start, end).trimEnd() + '\n';
  const oracleSha256 = sha256(Buffer.from(core));
  if (oracleSha256 !== EXPECTED_ORACLE_SHA256) throw new Error(`Oracle SHA mismatch: ${oracleSha256}`);
  const before = text.slice(0, start);
  const startLine = before.split('\n').length;
  const lineCount = core.split('\n').length - 1;
  return {
    core,
    receipt: {
      format: 'gloopipelago-m0-source-receipt', schema: 1,
      sourcePath: 'archive/v1/gloopipelago_single.html',
      sourceSha256, sourceBytes: bytes.length, sourceLines: text.split('\n').length - (text.endsWith('\n') ? 1 : 0),
      oracleStartLine: startLine, oracleEndLine: startLine + lineCount - 1,
      oracleSha256, oracleBytes: Buffer.byteLength(core), oracleLines: lineCount,
      runtime: { node: process.version, v8: process.versions.v8, platform: process.platform, arch: process.arch },
    }
  };
}

export function loadOracle() {
  const { core, receipt } = extractOracle();
  const context = vm.createContext({ Math, Number, Object, Array, Infinity, console });
  const wrapped = `${core}\nglobalThis.__gloopOracle = { Simulation, mulberry32 };`;
  new vm.Script(wrapped, { filename: 'gloop-v1-oracle.js' }).runInContext(context);
  return { ...context.__gloopOracle, receipt };
}

function hostSnapshot(s) {
  return {
    seed:s.seed,time:s.time,season:s.season,population:s.population,food:s.food,maxGeneration:s.maxGeneration,
    births:s.births,deaths:s.deaths,extinctions:s.extinctions,speed:s.speed,sense:s.sense,size:s.size,eff:s.eff,wander:s.wander,diet:s.diet,dietAbs:s.dietAbs
  };
}

export function causalState(sim) {
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
      id:b.id,x:b.x,y:b.y,vx:b.vx,vy:b.vy,a:b.a,energy:b.energy,age:b.age,generation:b.generation,reproCooldown:b.reproCooldown,
      g:{hue:b.g.hue,speed:b.g.speed,sense:b.g.sense,size:b.g.size,eff:b.g.eff,wander:b.g.wander,diet:b.g.diet}
    })),
    foods: sim.foods.map(f => ({x:f.x,y:f.y,e:f.e,rich:f.rich,kind:f.kind,expiresAt:f.expiresAt})),
  };
}

function f64hex(n) {
  const b = Buffer.allocUnsafe(8); b.writeDoubleBE(n, 0); return b.toString('hex');
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
export function exactFingerprint(state) {
  const exact = JSON.stringify(exactEncode(state));
  return { sha256: sha256(exact), bytes: Buffer.byteLength(exact) };
}
export function observation(sim, tick) {
  const causal = causalState(sim);
  return { tick, fingerprint: exactFingerprint(causal), legacy: hostSnapshot(sim.snapshot()), initial: hostSnapshot(sim.initial), causal };
}

export function formatValue(v) {
  if (typeof v === 'number') return `${String(v)} [f64=${f64hex(v)}]`;
  return JSON.stringify(v);
}
export function firstDiff(a,b,path='') {
  if (typeof a !== typeof b) return {path,a,b};
  if (typeof a === 'number') return f64hex(a) === f64hex(b) ? null : {path,a,b};
  if (a === null || b === null || typeof a !== 'object') return Object.is(a,b) ? null : {path,a,b};
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return {path,a,b};
    if (a.length !== b.length) return {path:`${path}.length`.replace(/^\./,''),a:a.length,b:b.length};
    for(let i=0;i<a.length;i++){ const d=firstDiff(a[i],b[i],`${path}[${i}]`); if(d)return d; }
    return null;
  }
  const ka=Object.keys(a), kb=Object.keys(b);
  if (ka.join('\0')!==kb.join('\0')) return {path:`${path}.__keys__`.replace(/^\./,''),a:ka,b:kb};
  for(const k of ka){ const d=firstDiff(a[k],b[k],path?`${path}.${k}`:k); if(d)return d; }
  return null;
}

export function makeSim({seed,width,height,config={}}) {
  const { Simulation } = loadOracle();
  return new Simulation({seed,width,height,...config});
}

export function runProfile(profile) {
  const { Simulation } = loadOracle();
  const sim = new Simulation({seed:profile.seed,width:profile.width,height:profile.height,...profile.config});
  const checkpoints = new Set(profile.checkpoints);
  const interventions = new Map();
  for (const it of profile.interventions ?? []) {
    if (!interventions.has(it.boundary)) interventions.set(it.boundary, []);
    interventions.get(it.boundary).push(it);
  }
  const observations=[];
  if (checkpoints.has(0)) observations.push(observation(sim,0));
  const maxTick=Math.max(...profile.checkpoints);
  for(let tick=0;tick<maxTick;tick++){
    const boundary=tick;
    if(interventions.has(boundary)) for(const it of interventions.get(boundary)) applyIntervention(sim,it);
    sim.step(FIXED_DT);
    const done=tick+1;
    if(checkpoints.has(done)) observations.push(observation(sim,done));
  }
  return { profile: profileReceipt(profile), observations };
}

function applyIntervention(sim,it){
  if(it.type==='resize') sim.setSize(it.width,it.height);
  else if(it.type==='food-point') sim.addFood(it.count ?? 1, false, {x:it.x,y:it.y});
  else if(it.type==='food-burst') sim.addFood(it.count ?? 1);
  else if(it.type==='catastrophe') sim.catastrophe();
  else throw new Error(`Unknown intervention ${it.type}`);
}
function profileReceipt(p){ return {id:p.id,label:p.label,seed:p.seed,width:p.width,height:p.height,config:p.config,checkpoints:p.checkpoints,interventions:p.interventions??[]}; }

export const PROFILES = [
  {id:'P-NOMINAL-S1',label:'historical parity specimen',seed:1,width:900,height:700,config:{...BROWSER_CONFIG},checkpoints:[0,1,147,148,149,180,181,182,1593,1594,1595,2040,2041,2042,10200,12000]},
  {id:'P-NOMINAL-S12345678',label:'historical parity specimen',seed:0x12345678,width:900,height:700,config:{...BROWSER_CONFIG},checkpoints:[0,1,172,173,174,1373,1374,1375,2040,2041,2042,4582,4583,4584,10200,12000]},
  {id:'P-COMPACT',label:'historical viewport-coupled parity specimen',seed:0x12345678,width:390,height:600,config:{...BROWSER_CONFIG},checkpoints:[0,1,2041,6000,12000]},
  {id:'P-WIDE',label:'historical viewport-coupled parity specimen',seed:0x9E3779B9,width:1400,height:800,config:{...BROWSER_CONFIG},checkpoints:[0,1,2041,6000,12000]},
  {id:'P-RESIZE',label:'historical resize-mutation parity specimen',seed:0x12345678,width:900,height:700,config:{...BROWSER_CONFIG},checkpoints:[0,599,600,601,1199,1200,1201,2400],interventions:[{boundary:600,type:'resize',width:390,height:600},{boundary:1200,type:'resize',width:1400,height:800}]},
  {id:'P-INTERVENTION',label:'historical explicit-call parity specimen',seed:0x9E3779B9,width:900,height:700,config:{...BROWSER_CONFIG},checkpoints:[0,299,300,301,599,600,601,899,900,901,1500],interventions:[{boundary:300,type:'food-point',count:18,x:450,y:350},{boundary:600,type:'food-burst',count:50},{boundary:900,type:'catastrophe'}]},
  {id:'P-LOWPRODUCTIVITY-NORESEED',label:'historical low-productivity stress parity specimen',seed:0x12345678,width:900,height:700,config:{...BROWSER_CONFIG,foodRate:4.2,autoReseed:false},checkpoints:[0,36816,36817,36818,36819,38000]},
  {id:'P-LOWPRODUCTIVITY-AUTORESEED',label:'historical low-productivity stress parity specimen',seed:0x12345678,width:900,height:700,config:{...BROWSER_CONFIG,foodRate:4.2,autoReseed:true},checkpoints:[0,36816,36817,36818,36819,38000]},
];
