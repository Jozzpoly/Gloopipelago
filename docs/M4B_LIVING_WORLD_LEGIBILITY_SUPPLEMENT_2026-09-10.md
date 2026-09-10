# Gloopipelago — M4b Living World Legibility supplement

**Date:** 2026-09-10  
**Status:** **PREDECLARED PRESENTATION CONTRACT / M4b IMPLEMENTATION NOT YET STARTED**

## Why this supplement exists

The original M4 contract defined M4b as phenotype legibility. After M4a became machine-qualified, the exact standalone was visually reviewed at 0 / 600 / 1,800 simulated seconds before any M4b implementation.

That review found two additional presentation-only problems that materially obstruct the same Owner goal:

- the eight habitats are biologically meaningful but currently read as translucent debug rectangles;
- full sensor circles become dominant visual clutter in evolved populations.

Therefore M4b is explicitly broadened **before implementation** from only phenotype legibility to **Living World Legibility**. The causal boundary does not broaden: M4b remains presentation-only.

## Starting authority

M4b must begin from the cleaned, full-machine-qualified M4a branch.

Exact M4a product qualification head:

`1a0f585f32249989e3e3781693f46c0bd74aefbd`

Exact qualified M4a standalone:

`3fb5638006137ecfb7e2d115c38ef981244ac4bd20b4b3b22e42ccdef4ac59ae`

Historical maintained core must remain byte-identical:

`18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`

M4a ecology itself is frozen for M4b:

- world 1200x900;
- 66 founders;
- 275 initial food;
- 18.5 food/s;
- eight A/B × dense/diffuse habitats;
- cap 260;
- fixed 1/60 stepping;
- existing genome/controller;
- honest x40 scheduler.

## Falsifiable M4b question

> Can the exact M4a biological differences become materially easier to perceive and follow without changing any causal state, RNG topology, lifecycle sequence or scheduler semantics?

M4b does not pass merely because the screenshot is prettier.

## Scope

M4b may change only presentation/browser rendering and explanatory copy needed to truthfully describe that rendering.

It may improve:

- organism silhouette and glyph design;
- mapping of existing inherited traits to visual properties;
- habitat field rendering;
- sensor visualization;
- layer ordering, opacity and local contrast;
- presentation-only selection/highlight affordances if later justified and causally inert;
- legends/copy describing real model semantics.

M4b must not change:

- Simulation or M4 ecology state;
- any genome value, mutation rule or behavior controller;
- food placement or habitat semantics;
- births, deaths, reproduction or metabolism;
- RNG calls/state;
- lifecycle-witness events;
- world geometry;
- x40 stepping/debt/visibility policy;
- interventions or their causal meaning.

## Visual-information hierarchy

Avoid a seven-channel feature dump. The display should have a hierarchy.

### Primary ecological channel — diet

Diet keeps ownership of the main body color family because it is nominal/ecological and already maps clearly to the two food kinds.

Do not let inherited hue overwrite the diet family and make ecological role harder to read.

### Strong quantitative geometry

Use geometry/motion for traits where ordinal magnitude matters:

- **size** — materially visible body/silhouette scale;
- **speed** — motion-linked elongation/tail/flow cue whose magnitude increases monotonically with speed;
- **sense** — readable range cue that increases monotonically with sense but does not fill the entire world with complete circles.

### Secondary identity/accent

Inherited **hue** may appear as a small secondary accent, rim, nucleus/spot or comparable cue. It should support continuity/individual-lineage identity without competing with diet as the primary ecological color.

### Efficiency / wander

Do not force both into the main glyph merely to satisfy completeness.

At least one of `eff` or `wander` may receive a secondary cue only if internal visual review shows it remains readable without clutter or false interpretation. Otherwise the honest decision is to leave that trait primarily in statistics for this M4b epoch and record the limitation.

## Organism design principles

The organism should stop reading as a generic circle with decorations.

Preferred properties:

- organic but computationally cheap silhouette;
- orientation follows actual velocity where meaningful;
- size difference is visible at normal world scale;
- speed difference is visible in motion and/or a compact trailing cue;
- sense is comparable without giant persistent full-radius rings;
- energy may remain a transient internal brightness/nucleus cue only if it does not masquerade as an inherited phenotype;
- no labels such as scout, grazer, predator or species unless model semantics actually justify them.

M4b reveals phenotype; it does not invent taxonomy.

## Habitat/environment design principles

The qualified habitat geometry remains exact. Rendering should make it feel like a spatial resource field rather than a debug rectangle.

A preferred first approach is a soft deterministic field derived only from the existing habitat center, spread, food kind and dense/diffuse regime, for example layered radial/elliptical gradients, sparse contour/ring structure or deterministic non-RNG texture.

Requirements:

- no new randomness in draw code;
- no presentation-generated RNG calls;
- dense vs diffuse should be distinguishable without labels occupying the map;
- A vs B should remain coherently related to food colors;
- habitat visualization must not imply walls, collision or bonuses absent from the model;
- background must not overpower organisms/food.

## Sensor-clutter rule

The current full sense-radius circle for every organism is rejected as the default M4b representation because evolved populations create severe overlapping clutter.

The replacement must retain ordinal sense information while using substantially less persistent ink. Candidate forms include:

- partial forward-facing arc;
- sparse radial ticks/antennae;
- short translucent fan/halo;
- local pulse visible only intermittently or under interaction, provided ordinary comparative sense remains possible.

The first implementation should prefer deterministic always-readable compact geometry over animation that could obscure comparisons.

## Presentation-only exactness gate

For fixed M4 states and inputs, rendering activity must have exact zero effect on:

- authoritative full simulation state;
- RNG state;
- RNG call count/topology;
- lifecycle witness sequence.

Qualification must explicitly stress repeated drawing at different cadences and compare against an equivalent no-draw execution path.

## Mapping monotonicity gate

Machine tests must exercise synthetic trait extremes and verify at least:

- larger `size` never produces a smaller primary silhouette;
- higher `speed` never produces a weaker/shorter speed magnitude cue;
- higher `sense` never produces a smaller sense magnitude cue;
- diet endpoints map to distinct primary color families and interpolate continuously;
- inherited hue accent responds to hue but does not replace diet ownership of the primary body family.

This is a semantic mapping check, not a claim that machine tests can judge beauty.

## Browser and performance gate

M4b must preserve the existing M4a browser mechanics:

- 1200x900 logical world;
- aspect-preserving contain;
- wide/narrow/DPR-only state invariance;
- pointer band no-op and in-world mapping;
- same/new seed behavior;
- x40 debt/pause/visibility semantics;
- no browser errors.

Because M4b adds drawing work, x40 is remeasured on evolved natural M4 worlds.

Predeclared delivery gate:

- eight 600 s evolved seeds: median achieved target-40 speed **>= 38x**;
- no seed below **35x**;
- three 1,800 s evolved seeds: median **>= 38x** and no seed below **35x**.

If this fails, first reduce presentation cost or render cadence. Do not simplify ecology or falsify achieved-speed reporting.

## Internal visual-review gate

Before the Owner receives a build, generate exact-browser screenshots at minimum:

- two deterministic seeds;
- 0 s / 600 s / 1,800 s for at least one seed;
- wide desktop presentation;
- materially narrow/mobile-like presentation;
- at least one evolved close inspection or controlled trait-extreme specimen.

Internal review asks:

- do multiple habitats/local populations read without explanation?
- are organism size/speed/sense differences actually visible?
- does diet remain easy to read?
- is inherited hue useful rather than noisy?
- has sensor clutter materially decreased?
- does the environment look like a world rather than debugging apparatus?
- does the display remain legible at x40 render cadence?

A technically exact but visibly poor result should be iterated before Owner delivery.

## Comparison requirement

Where practical, preserve screenshots of exact M4a and M4b at the same seed/time/view so visual improvement can be compared directly.

The comparison is presentation evidence only. It must not be used to claim biological improvement beyond the already-qualified M4a evidence.

## Owner gate

Do not ask for broad Owner testing of an intermediate M4b attempt.

The intended next broad Owner artifact combines:

- repaired M3 semantics;
- honest x40;
- machine-qualified M4a ecology;
- machine-qualified and internally reviewed M4b Living World Legibility.

Owner success criteria remain:

- world materially more alive, not merely busier;
- multiple local habitats/populations are apparent;
- organisms visibly differ enough to become worth following;
- x40 reveals meaningful ecological/evolutionary change;
- presentation and controls remain usable across wide/narrow layouts.

## Explicitly deferred

M4b does not add predation, social behavior, mating, neural policy genomes, weather, terrain physics, niche construction, ecological inheritance, negative-frequency-dependent fitness rules, retained M2b history or a species classifier.

Those remain future hypotheses. In particular, speculative horizon ideas discovered during this run must not enter M4b causally without a new explicit contract.
