// Maintained V1-compatible core. M1.0 established exact Oracle parity.
// M1.1 makes Mulberry32 state explicit while preserving sequence and call topology.
// M2a adds a passive lifecycle witness seam only; scheduler/time/world semantics and RNG topology remain unchanged.

class Mulberry32Stream {
  constructor(seed = 0) { this.state = seed >>> 0; }

  next() {
    let a = this.state | 0;
    a = (a + 0x6D2B79F5) | 0;
    this.state = a >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  snapshot() { return this.state >>> 0; }
  restore(state) { this.state = state >>> 0; }
}

function mulberry32(seed) {
  const stream = new Mulberry32Stream(seed);
  return () => stream.next();
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const wrapHue = h => (h % 360 + 360) % 360;

class Simulation {
  constructor({ seed = 1, width = 900, height = 700, mutationScale = 1, senseCost = 0.0026, digestExponent = 1.5, minDigestion = 0.55, autoReseed = true, foodRate = 4.2, foodEnergyScale = 1, foodLifetime = 75, dietJumpRate = 0, stableNiches = false } = {}, { lifecycleWitness = null } = {}) {
    this.width = width;
    this.mutationScale = mutationScale;
    this.senseCost = senseCost;
    this.digestExponent = digestExponent;
    this.minDigestion = minDigestion;
    this.autoReseed = autoReseed;
    this.foodRate = foodRate;
    this.foodEnergyScale = foodEnergyScale;
    this.foodLifetime = foodLifetime;
    this.dietJumpRate = dietJumpRate;
    this.stableNiches = stableNiches;
    this.height = height;
    this.seed = seed >>> 0;
    this._lifecycleWitness = typeof lifecycleWitness === 'function' ? lifecycleWitness : null;
    this.rngStream = new Mulberry32Stream(this.seed);
    this.rng = () => this.rngStream.next();
    this._reset(this.seed, 'initial');
  }

  rand(a = 1, b = 0) { return b + this.rng() * (a - b); }

  reset(seed = this.seed) {
    return this._reset(seed, 'reset');
  }

  _reset(seed, founderOrigin) {
    this.seed = seed >>> 0;
    this.rngStream = new Mulberry32Stream(this.seed);
    this.rng = () => this.rngStream.next();
    this.simTime = 0;
    this.season = 0;
    this.nextId = 1;
    this.blobs = [];
    this.foods = [];
    this.births = 0;
    this.deaths = 0;
    this.extinctions = 0;
    for (let i = 0; i < 34; i++) {
      const b = this.spawnBlob();
      if (this._lifecycleWitness) this._emitFounder(b, founderOrigin);
    }
    this.addFood(145);
    this.initial = this.snapshot();
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
  }

  foodPatch(kind = null) {
    const phase = this.season % 3;
    const centers = this.stableNiches ?
      (phase === 0 ? [[.24,.30],[.76,.70]] :
       phase === 1 ? [[.30,.66],[.70,.34]] :
                     [[.22,.50],[.78,.50]]) :
      (phase === 0 ? [[.25,.30],[.75,.70]] :
       phase === 1 ? [[.72,.26],[.30,.74]] :
                     [[.30,.68],[.70,.32]]);
    const k = kind ?? (this.rng() < .5 ? 0 : 1);
    const c = centers[k];
    const spread = Math.min(this.width, this.height) * .12;
    return {
      x: clamp(c[0] * this.width + this.rand(-spread, spread), 8, this.width - 8),
      y: clamp(c[1] * this.height + this.rand(-spread, spread), 8, this.height - 8),
      kind:k
    };
  }

  addFood(n = 1, rich = false, around = null) {
    for (let i = 0; i < n; i++) {
      const p = around ? {
        x: clamp(around.x + this.rand(34, -34), 0, this.width),
        y: clamp(around.y + this.rand(34, -34), 0, this.height),
        kind:this.rng() < .5 ? 0 : 1
      } : this.foodPatch();
      this.foods.push({ x:p.x, y:p.y, e:(rich ? this.rand(18,12) : this.rand(11,6)) * this.foodEnergyScale, rich, kind:rich ? -1 : p.kind, expiresAt:this.simTime + this.foodLifetime });
    }
  }

  digestion(g, kind) {
    if (kind === -1) return 1;
    const alignment = kind === 0 ? (1-g.diet)/2 : (1+g.diet)/2;
    return .25 + 1.75*Math.pow(alignment,this.digestExponent);
  }

  makeGenome(parent) {
    if (!parent) {
      return {
        hue: this.rand(360,0),
        speed: this.rand(1.15,.65),
        sense: this.rand(95,42),
        size: this.rand(6.5,3.5),
        eff: this.rand(1.15,.78),
        wander: this.rand(1.1,.35),
        diet: this.rand(1,-1)
      };
    }
    const ms = this.mutationScale;
    const m = (v,s,a,b) => clamp(v + this.rand(s*ms,-s*ms), a, b);
    const dietStep = (ms > 0 && this.rng() < this.dietJumpRate) ? .9 : .16;
    return {
      hue: wrapHue(parent.hue + this.rand(20*ms,-20*ms)),
      speed: m(parent.speed,.12,.35,1.9),
      sense: m(parent.sense,10,20,150),
      size: m(parent.size,.6,2.4,9),
      eff: m(parent.eff,.08,.55,1.45),
      wander: m(parent.wander,.12,.15,1.5),
      diet: m(parent.diet ?? 0,dietStep,-1,1)
    };
  }

  spawnBlob(x = this.rand(this.width,0), y = this.rand(this.height,0), genome = null, generation = 0, energy = 70, countBirth = false) {
    const g = genome || this.makeGenome();
    const b = {
      id:this.nextId++, x, y, vx:this.rand(1,-1), vy:this.rand(1,-1), a:this.rand(Math.PI*2,0),
      g, energy, age:0, generation, reproCooldown:0
    };
    this.blobs.push(b);
    if (countBirth) this.births++;
    return b;
  }

  _genomeRecord(g) {
    return {
      hue:g.hue, speed:g.speed, sense:g.sense, size:g.size,
      eff:g.eff, wander:g.wander, diet:g.diet
    };
  }

  _deliverLifecycle(record) {
    const sink = this._lifecycleWitness;
    if (!sink) return;
    try { sink(record); } catch {}
  }

  _emitFounder(b, origin) {
    if (!this._lifecycleWitness) return;
    this._deliverLifecycle({
      kind:'founder', origin, time:this.simTime, id:b.id, generation:b.generation,
      x:b.x, y:b.y, energy:b.energy, genome:this._genomeRecord(b.g)
    });
  }

  _emitBirth(b, parentId) {
    if (!this._lifecycleWitness) return;
    this._deliverLifecycle({
      kind:'birth', time:this.simTime, id:b.id, parentId, generation:b.generation,
      x:b.x, y:b.y, energy:b.energy, genome:this._genomeRecord(b.g)
    });
  }

  _emitDeath(b, mechanism, energyDepleted, ageExceeded) {
    if (!this._lifecycleWitness) return;
    this._deliverLifecycle({
      kind:'death', mechanism, time:this.simTime, id:b.id, generation:b.generation,
      x:b.x, y:b.y, energy:b.energy, age:b.age, energyDepleted, ageExceeded
    });
  }

  updateBlob(b, dt) {
    b.age += dt;
    b.reproCooldown = Math.max(0, b.reproCooldown - dt);
    let target = null;
    let best = Infinity;
    const sense2 = b.g.sense * b.g.sense;
    for (const f of this.foods) {
      const dx = f.x - b.x, dy = f.y - b.y;
      const d = dx*dx + dy*dy;
      if (d > sense2) continue;
      const digestion = this.digestion(b.g,f.kind);
      if (digestion < this.minDigestion) continue;
      const score = d / Math.max(.12,digestion*digestion);
      if (score < best) { best = score; target = f; }
    }

    let ax = 0, ay = 0;
    if (target) {
      const dx = target.x-b.x, dy = target.y-b.y, len = Math.hypot(dx,dy) || 1;
      ax = dx/len; ay = dy/len;
    } else {
      b.a += this.rand(.8,-.8) * b.g.wander * dt;
      ax = Math.cos(b.a); ay = Math.sin(b.a);
    }

    const sp = 38*b.g.speed/(0.65+0.055*b.g.size);
    b.vx += ax*sp*dt*1.7;
    b.vy += ay*sp*dt*1.7;
    const vlen = Math.hypot(b.vx,b.vy) || 1;
    if (vlen > sp) { b.vx = b.vx/vlen*sp; b.vy = b.vy/vlen*sp; }
    b.vx *= Math.pow(.18,dt); b.vy *= Math.pow(.18,dt);
    b.x += b.vx*dt; b.y += b.vy*dt;

    if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx); }
    if (b.y < 0) { b.y = 0; b.vy = Math.abs(b.vy); }
    if (b.x > this.width) { b.x = this.width; b.vx = -Math.abs(b.vx); }
    if (b.y > this.height) { b.y = this.height; b.vy = -Math.abs(b.vy); }

    const metabolic = (.62 + .34*b.g.speed*b.g.speed + this.senseCost*b.g.sense + .035*b.g.size*b.g.size) / b.g.eff;
    b.energy -= metabolic * dt;

    for (let i = this.foods.length - 1; i >= 0; i--) {
      const f = this.foods[i], rr = b.g.size + 3.3;
      const dx = f.x - b.x, dy = f.y - b.y;
      if (dx*dx + dy*dy < rr*rr) {
        const digestion = this.digestion(b.g,f.kind);
        if (digestion < this.minDigestion) continue;
        b.energy += f.e * digestion;
        this.foods.splice(i,1);
        break;
      }
    }

    const threshold = 118 + b.g.size*3.4;
    if (b.energy > threshold && b.reproCooldown <= 0 && this.blobs.length < 260) {
      b.energy *= .52;
      b.reproCooldown = 3.5;
      const child = this.makeGenome(b.g);
      const ang = this.rand(Math.PI*2,0);
      const born = this.spawnBlob(
        clamp(b.x + Math.cos(ang)*10,0,this.width),
        clamp(b.y + Math.sin(ang)*10,0,this.height),
        child, b.generation+1, b.energy*.92, true
      );
      if (this._lifecycleWitness) this._emitBirth(born, b.id);
    }
  }

  step(dt = 1/60) {
    this.simTime += dt;
    const newSeason = Math.floor(this.simTime/34);
    if (newSeason !== this.season) { this.season = newSeason; this.addFood(38); }

    const expected = this.foodRate * dt;
    if (this.rng() < expected) this.addFood(1);

    for (let i=this.foods.length-1;i>=0;i--) {
      if ((this.foods[i].expiresAt ?? Infinity) <= this.simTime) this.foods.splice(i,1);
    }

    for (const b of this.blobs) this.updateBlob(b,dt);

    for (let i = this.blobs.length - 1; i >= 0; i--) {
      const b = this.blobs[i];
      const energyDepleted = b.energy <= 0;
      const ageExceeded = b.age > 170;
      if (energyDepleted || ageExceeded) {
        if (this.rng() < .55) this.foods.push({x:b.x,y:b.y,e:this.rand(19,12)*this.foodEnergyScale,rich:true,kind:-1,expiresAt:this.simTime + this.foodLifetime});
        this.blobs.splice(i,1);
        this.deaths++;
        if (this._lifecycleWitness) this._emitDeath(b, 'natural-sweep', energyDepleted, ageExceeded);
      }
    }

    if (this.blobs.length === 0) {
      this.extinctions++;
      if (this.autoReseed) for (let i = 0; i < 12; i++) {
        const b = this.spawnBlob();
        if (this._lifecycleWitness) this._emitFounder(b, 'auto-reseed');
      }
    }
  }

  catastrophe() {
    this.foods.splice(0, Math.floor(this.foods.length*.72));
    for (let i=this.blobs.length-1;i>=0;i--) {
      if (this.rng() < .48) {
        const b = this.blobs[i];
        this.blobs.splice(i,1);
        this.deaths++;
        if (this._lifecycleWitness) this._emitDeath(b, 'catastrophe', b.energy <= 0, b.age > 170);
      }
    }
  }

  avg(key) {
    return this.blobs.length ? this.blobs.reduce((s,b)=>s+b.g[key],0)/this.blobs.length : 0;
  }

  snapshot() {
    return {
      seed:this.seed,
      time:this.simTime,
      season:this.season,
      population:this.blobs.length,
      food:this.foods.length,
      maxGeneration:this.blobs.reduce((m,b)=>Math.max(m,b.generation),0),
      births:this.births,
      deaths:this.deaths,
      extinctions:this.extinctions,
      speed:this.avg('speed'),
      sense:this.avg('sense'),
      size:this.avg('size'),
      eff:this.avg('eff'),
      wander:this.avg('wander'),
      diet:this.avg('diet'),
      dietAbs:this.blobs.length ? this.blobs.reduce((s,b)=>s+Math.abs(b.g.diet),0)/this.blobs.length : 0
    };
  }
}

export { Simulation, Mulberry32Stream, mulberry32 };
