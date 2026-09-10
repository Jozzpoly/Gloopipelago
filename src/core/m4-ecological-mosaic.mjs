const M4_WORLD_WIDTH = 1200;
const M4_WORLD_HEIGHT = 900;
const M4_FOUNDER_COUNT = 66;
const M4_INITIAL_FOOD_COUNT = 275;

const M4_HABITATS = Object.freeze([
  Object.freeze({ id:'A-dense-1', kind:0, regime:'dense', x:.14, y:.22, spread:.035 }),
  Object.freeze({ id:'A-diffuse-1', kind:0, regime:'diffuse', x:.42, y:.20, spread:.12 }),
  Object.freeze({ id:'A-dense-2', kind:0, regime:'dense', x:.18, y:.72, spread:.035 }),
  Object.freeze({ id:'A-diffuse-2', kind:0, regime:'diffuse', x:.44, y:.76, spread:.12 }),
  Object.freeze({ id:'B-dense-1', kind:1, regime:'dense', x:.84, y:.20, spread:.035 }),
  Object.freeze({ id:'B-diffuse-1', kind:1, regime:'diffuse', x:.62, y:.27, spread:.12 }),
  Object.freeze({ id:'B-dense-2', kind:1, regime:'dense', x:.86, y:.74, spread:.035 }),
  Object.freeze({ id:'B-diffuse-2', kind:1, regime:'diffuse', x:.62, y:.78, spread:.12 }),
]);

const M4_PRODUCT_OPTIONS = Object.freeze({
  width:M4_WORLD_WIDTH,
  height:M4_WORLD_HEIGHT,
  mutationScale:1,
  senseCost:.0026,
  digestExponent:3,
  minDigestion:.4,
  autoReseed:true,
  foodRate:18.5,
  foodEnergyScale:1,
  foodLifetime:75,
  dietJumpRate:.02,
  stableNiches:true,
});

const m4Clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function createM4Simulation(BaseSimulation) {
  if (typeof BaseSimulation !== 'function') throw new TypeError('BaseSimulation must be a constructor');

  return class M4Simulation extends BaseSimulation {
    constructor(options = {}, apparatus = {}) {
      const seed = (options.seed ?? 1) >>> 0;
      const config = { ...M4_PRODUCT_OPTIONS, ...options, seed };
      const lifecycleWitness = typeof apparatus.lifecycleWitness === 'function' ? apparatus.lifecycleWitness : null;

      // Super construction is intentionally witness-silent. M4 then resets the same seed
      // into its explicit ecological initial condition, so transient construction consumes
      // no authoritative RNG state and emits no lifecycle records.
      super(config, { lifecycleWitness:null });

      this.m4FounderCount = Number.isInteger(options.founderCount) ? options.founderCount : M4_FOUNDER_COUNT;
      this.m4InitialFoodCount = Number.isInteger(options.initialFoodCount) ? options.initialFoodCount : M4_INITIAL_FOOD_COUNT;
      this.m4Habitats = Array.isArray(options.habitats) && options.habitats.length ? options.habitats : M4_HABITATS;
      this._lifecycleWitness = lifecycleWitness;
      this._resetM4(seed, 'initial');
    }

    reset(seed = this.seed) {
      return this._resetM4(seed, 'reset');
    }

    _resetM4(seed, founderOrigin) {
      this.seed = seed >>> 0;
      const Stream = this.rngStream.constructor;
      this.rngStream = new Stream(this.seed);
      this.rng = () => this.rngStream.next();
      this.simTime = 0;
      this.season = 0;
      this.nextId = 1;
      this.blobs = [];
      this.foods = [];
      this.births = 0;
      this.deaths = 0;
      this.extinctions = 0;
      for (let i = 0; i < this.m4FounderCount; i++) {
        const b = this.spawnBlob();
        if (this._lifecycleWitness) this._emitFounder(b, founderOrigin);
      }
      this.addFood(this.m4InitialFoodCount);
      this.initial = this.snapshot();
      return this.initial;
    }

    foodPatch(kind = null) {
      const k = kind ?? (this.rng() < .5 ? 0 : 1);
      const habitats = this.m4Habitats ?? M4_HABITATS;
      const eligible = habitats.filter(h => h.kind === k);
      if (!eligible.length) return super.foodPatch(k);
      const habitat = eligible[Math.floor(this.rng() * eligible.length)];
      const spread = Math.min(this.width, this.height) * habitat.spread;
      return {
        x:m4Clamp(habitat.x * this.width + this.rand(-spread, spread), 8, this.width - 8),
        y:m4Clamp(habitat.y * this.height + this.rand(-spread, spread), 8, this.height - 8),
        kind:k,
      };
    }
  };
}

export {
  M4_WORLD_WIDTH,
  M4_WORLD_HEIGHT,
  M4_FOUNDER_COUNT,
  M4_INITIAL_FOOD_COUNT,
  M4_HABITATS,
  M4_PRODUCT_OPTIONS,
  createM4Simulation,
};
