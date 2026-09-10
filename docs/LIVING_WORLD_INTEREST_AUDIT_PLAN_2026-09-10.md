# Gloopipelago — Living World Interest Audit Plan

**Date:** 2026-09-10  
**Status:** PREDECLARED AUDIT / NO PRODUCT IMPLEMENTATION AUTHORIZED

## Trigger

Owner feedback on the exact M3+x40 candidate is that the world is too small, sparsely populated, visually and behaviorally homogeneous, environmentally thin, simple and raw.

The purpose of this audit is not to optimize a subjective score or to justify a predetermined M4 implementation. It is to identify which parts of the complaint are structural properties of the current model and which can be materially improved using existing parameters.

## Current structural facts to challenge

The maintained model currently has:

- 34 founders on reset;
- a hard population ceiling of 260;
- one universal food-seeking/wander controller;
- two ordinary food kinds;
- two food patch centers per seasonal phase;
- one diet axis connecting organisms to those two resource kinds;
- seven inherited genome values (`hue`, `speed`, `sense`, `size`, `eff`, `wander`, `diet`);
- only a subset of those dimensions strongly visible in the browser;
- no terrain, obstacles, hazards, shelter, climate field, predation, social behavior, construction, territoriality or other environmental agency.

These facts make a binary ecological attractor plausible, but the audit must measure rather than merely narrate it.

## Metrics

No single `interestingness` scalar will be treated as authority. Each run records a vector of interpretable measurements.

### Population / persistence

- final population;
- time-series population min/mean/max;
- births/deaths/extinctions;
- final food count.

### Spatial use

- occupied cells in a fixed 12x9 logical grid;
- occupied-grid fraction;
- normalized spatial entropy;
- coarse connected occupied-region count.

These are proxies for how much of the world is inhabited, not claims about ecological richness by themselves.

### Phenotypic spread

For behaviorally relevant inherited traits (`speed`, `sense`, `size`, `eff`, `wander`, `diet`):

- mean;
- standard deviation;
- normalized standard deviation relative to the legal trait range;
- min/max.

Also record average pairwise normalized genome distance.

### Strategy-shape proxies

- specialist-A / generalist / specialist-B counts;
- fraction with `abs(diet) >= 0.8`;
- coarse multi-trait strategy-bin richness;
- strategy-bin Shannon effective count.

The bin metric is a descriptive proxy only. It does not create distinct behavior policies where none exist.

### Lineage survival

Use the already-qualified passive M2a lifecycle witness to reconstruct founder ancestry downstream of `Simulation` and record:

- active founder-root count;
- top surviving lineage share;
- lineage Shannon effective count.

This asks whether many births/generations actually preserve multiple evolutionary histories or collapse into a few founder lineages.

## Experiment matrix

All profiles run the same deterministic seed set and fixed `1/60` stepping to a common long horizon. The baseline reproduces the browser model parameters.

1. **baseline** — current browser ecology.
2. **mutation-2x** — mutationScale only.
3. **more-resources** — higher food production/lifetime only.
4. **sense-cost** — stronger energetic trade-off against near-maximal sense.
5. **moving-niches** — current non-stable seasonal patch topology.
6. **softer-diet** — weaker binary digestion specialization pressure.
7. **mixed-existing-knobs** — deliberately stronger combination of existing trade-offs/variation; diagnostic only.
8. **double-founders-resources** — audit-only initialization with additional founders and food; tests density vs diversity.
9. **larger-world-same-budget** — larger logical world without resource/population scaling; expected to test whether 'make map bigger' alone worsens emptiness.
10. **larger-world-scaled-start** — larger world with more founders/resources and higher food rate, still under the current hard 260 cap; tests how quickly existing structural ceilings appear.

## Predeclared hypotheses

### H1 — baseline convergence

Long baseline runs will show substantial birth/generation activity but strong convergence toward two diet-specialist families and high values of a few rewarded traits. If false, the visual layer may be masking more actual strategy diversity than expected.

### H2 — mutation alone is insufficient

Increasing mutation may raise phenotypic variance but cannot create additional behavior policies or environment dimensions. A result with more trait spread but similar spatial/diet/lineage structure supports this hypothesis.

### H3 — population count alone is insufficient

More resources or more founders may make the screen busier while leaving strategy and lineage diversity largely unchanged. If they strongly increase persistent strategy richness, this hypothesis is falsified.

### H4 — current trade-offs are weak along some axes

The Owner recording suggests sense and speed approach their upper legal bounds. Raising sense cost should test whether an underpriced trait is causing convergence rather than adaptive diversity.

### H5 — larger world alone is likely harmful

Because founder count, food budget and population cap are not geometry-scaled, a larger rectangle without other changes should reduce occupancy and increase emptiness.

### H6 — parameter tuning has a ceiling

Even the best existing-knob profile cannot create qualitatively different behavioral roles because all organisms share the same controller and environment interaction vocabulary. If an existing-knob profile nevertheless produces robustly different, legible long-lived strategies, this hypothesis is weakened.

## Decision rules

After the matrix:

- do not choose a future world size from aesthetics alone;
- do not increase organism count merely because occupancy is low;
- do not add mutation merely because trait variance is low;
- do not introduce new biology unless the audit identifies a structural bottleneck that existing parameters cannot address;
- do not optimize x40/core performance for hypothetical future densities before a target ecology is selected;
- preserve M3 logical-world authority as an explicit model-semantic boundary: any new geometry is a deliberate new epoch, not a resize behavior regression.

## Expected output

The audit must end with:

1. a baseline diagnosis tied to measurements;
2. comparison of existing-knob interventions;
3. a list of structural bottlenecks that tuning cannot solve;
4. a bounded next-milestone recommendation;
5. explicit non-goals and protected invariants;
6. no product runtime changes on this audit branch.
