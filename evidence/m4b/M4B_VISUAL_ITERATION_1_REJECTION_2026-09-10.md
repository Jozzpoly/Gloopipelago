# Gloopipelago — M4b visual iteration 1 rejection

**Date:** 2026-09-10  
**Status:** **MACHINE PASS / INTERNAL VISUAL FAIL / REJECTED BEFORE OWNER DELIVERY**

## Exact candidate

Qualification run:

`34476912597` — **completed / success**

Exact head:

`935f6fcd158fc595945376fa3da24d3667a0c983`

Exact standalone:

`9b8d14b94cc9b70f7ca73f376bed6c4a532f434953ab0eafcc54496091adf223`

Standalone size: `33,854` bytes.

Browser artifact:

- id `10151938643`;
- digest `sha256:40e879a05edf76a2dbb585741d21908c0fca33bee914516d2f91556238f9dba1`.

Semantic artifact:

- id `10151949943`;
- digest `sha256:a3139f99e13a0a60e235d6be60fd420e7330d65a2e269ce4b1663417bd50cf07`.

## What machine qualification passed

- protected maintained-core SHA and exact qualified M4a ecology SHA;
- deterministic visual trait mapping;
- size/speed/sense monotonic magnitude checks;
- diet primary-color ownership and inherited-hue secondary accent separation;
- draw-cadence neutrality versus no-draw for exact full state, RNG and lifecycle sequence;
- exact M4a construction;
- M0, M1.1 and M2a protected smoke;
- wide/narrow/DPR-only state invariance;
- pointer band no-op and in-world +18 food;
- exact same-seed reset and new-seed behavior;
- repeated real-browser drawing with zero causal/RNG delta;
- deterministic standalone build;
- no page errors.

### x40

Eight seeds evolved to 600 s:

- median `38.73x`;
- minimum `38.38x`.

Three seeds evolved to 1,800 s:

- median `38.77x`;
- minimum `38.59x`.

40x -> 1x: approximately `0.982x`.

Hidden interval: exact zero simulation advance.

Therefore performance was not the reason for rejection.

## Internal visual review

The exact browser artifact was captured at seed `0x12345678` at 0 / 600 / 1,800 simulated seconds and at a materially narrow viewport. It was compared against the exact M4a presentation at matching seed/time where available.

### Positive changes

- organisms no longer read only as generic circles;
- body orientation and compact speed tail make movement direction easier to follow;
- inherited hue appears as a small secondary mark without replacing diet color;
- full gigantic sense-radius circles are removed, greatly reducing the old dominant ring clutter;
- evolved local populations are easier to distinguish from loose food points;
- mobile/narrow presentation remains mechanically usable.

### Visual failure 1 — environment became too faint

The first M4b habitat renderer replaced M4a debug rectangles with low-alpha radial fields. In the exact screenshots the fields are almost invisible at normal viewing distance.

This solves the rectangle ugliness by effectively removing the environment from perception. That does not satisfy Living World Legibility and does not answer the Owner complaint that the environment feels nearly absent.

It also changes the visual support shape from the model's actual independent x/y uniform patch sampling (square support) to a radial field. Even though this is presentation-only, the radial graphic can suggest ecological geometry that the model does not actually use.

### Visual failure 2 — sense cue implies directional perception

The two forward-facing sensor lines are compact and performant, but they visually read as antennae / a forward sensing cone.

The actual M4 organism controller still tests food against an omnidirectional scalar radius `g.sense`.

A glyph that implies directional sensing is semantically misleading even if its length is a monotonic function of the real sense trait.

### Visual failure 3 — phenotype separation is still too weak at world scale

On desktop the new silhouettes are clearer, especially in local clusters, but much of the world still reads first as small cyan/yellow points. On the narrow/mobile-like capture, size/speed distinctions compress substantially.

The next iteration should amplify visual differences monotonically without inventing biological categories or changing collision/metabolism semantics.

## Decision

**Reject iteration 1 as an Owner candidate.**

Do not weaken the machine gates. Do not change M4a ecology to make the picture easier to render.

Iteration 2 remains presentation-only and should specifically target:

1. habitat fields that are clearly present while remaining subordinate to organisms and food;
2. support geometry visually compatible with the real square resource-patch sampling;
3. an omnidirectional compact sense cue rather than a forward-direction cue;
4. stronger but monotonic organism silhouette differentiation at desktop and narrow scales;
5. the same causal neutrality and x40 thresholds as the first M4b contract.

The successful machine result is preserved as useful evidence; visual rejection is not rewritten as a technical failure.
