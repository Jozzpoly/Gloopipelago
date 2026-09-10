# Gloopipelago — Living World Interest Audit

**Date:** 2026-09-10  
**Branch:** `audit/living-world-interest-2026-09-10`  
**Status:** **AUDIT COMPLETE / PRODUCT PROBLEM CONFIRMED / M4a ECOLOGICAL MOSAIC + M4b PHENOTYPE LEGIBILITY JUSTIFIED**

## Owner finding

The machine-qualified M3+x40 composite is technically healthy, but the Owner found the living world materially too small, sparse, visually homogeneous, behaviorally homogeneous and environmentally shallow to justify another broad product test in its current biological form.

The purpose of this audit was not to manufacture a subjective `fun score`. It asked which parts of that judgement can be grounded in model structure and repeatable long-horizon evidence, and which candidate changes actually increase ecological structure rather than merely add more dots or mutation noise.

## Authority boundary

This audit branches from the frozen M3+x40 candidate lineage. It changes **no production runtime or maintained core**. All model variants below are audit-only apparatus/probes and are not product authority.

The maintained core used by the candidate remains the promoted M2a core SHA-256:

`18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`

PR #11 (M3) and PR #12 (x40) remain draft/unmerged.

## Structural diagnosis from the current model

The current biology has seven inherited genome values: `hue`, `speed`, `sense`, `size`, `eff`, `wander`, `diet`.

However, every organism executes essentially the same controller:

1. find the best digestible food within sensory radius;
2. move toward it;
3. otherwise wander;
4. eat on contact;
5. reproduce above an energy threshold.

Organisms have no direct organism-organism interaction. Competition is mediated almost entirely through food. There is no predation, fleeing, territoriality, grouping, mating choice, parasitism, social memory or behavioral policy genome.

The environment similarly exposes a low-dimensional ecology: two food kinds and a small number of patch centres. This makes strong convergence toward two diet-specialist foraging archetypes unsurprising.

## Baseline long-horizon evidence

Run `34465714334` — **success**  
Artifact `10147448438`  
Digest `sha256:6a8c639a54678d46f2aba838f6aa1431594a8fcf583428e6e964eb524c8287cf`

Five seeds, 1,800 simulated seconds each.

Median final baseline state:

- population: **71**;
- mean population through time: **66.17**;
- occupied 12x9 spatial cells: **14.81%**;
- effective coarse strategies: **5.86**;
- active founder roots: **2** of the original 34;
- effective lineage count: **1.96**;
- largest lineage share: **59.74%**;
- extreme-diet fraction: **88.52%**;
- mean speed: **1.806** on a hard maximum of 1.9;
- mean sense: **127.07** on a hard maximum of 150.

The key pattern is not inactivity. Many births and generations occur, but long-horizon selection compresses the surviving population into very few lineages and a much smaller strategy set.

At 600 s the baseline median effective strategy count was **13.52**; at 1,800 s it was **5.86**. The world therefore loses much of its early phenotypic variety rather than accumulating new legible ways of life.

## Existing-knob falsification

The audit tested existing parameters before authorizing new biology.

### More resources

At 600 s, more resources raised median population from ~69 to **122** and occupied fraction from ~15.7% to **22.2%**, but effective strategies fell from ~13.5 to **11.2** and surviving founder roots remained **2**.

At 1,800 s it retained ~106 organisms but still only **2** founder roots and ~**9.75** effective strategies.

**Conclusion:** more dots are not equivalent to a richer ecology.

### Double founders + start resources

At 600 s median population reached **85**, but surviving founder roots still collapsed to **2**.

**Conclusion:** simply seeding more organisms does not solve lineage collapse.

### Mutation scale 2x

At 1,800 s median effective strategies improved to **11.73** and genome spread increased, but surviving founder roots remained **2**.

**Conclusion:** mutation can preserve more variation inside the surviving ecological basin, but it does not by itself create more ecological roles.

### Mixed aggressive tuning

At 600 s it showed a high effective strategy count (~22.3), but median surviving founder roots had already collapsed to **1**. At 1,800 s it retained ~10 effective strategies but still only one founder lineage.

**Conclusion:** raw trait spread can be misleading; a single successful lineage can contain many coarse phenotypes without creating a richer ecosystem.

### Moving niches

The existing moving-niche mode was destructive in the tested configuration: at 600 s median population ~13, one founder lineage and low genome spread.

**Conclusion:** environmental motion is not automatically ecological richness.

## World-size result

A larger `1200x900` world was tested skeptically because a naive increase could have produced only more empty space.

The hypothesis "larger world necessarily means proportionally emptier world" was falsified in the short matrix. However, long-horizon results separated two cases:

- larger world with the old biological budget: ~68 population, ~14.8% occupied cells, ~4.0 effective strategies;
- larger world with scaled start/resources: ~116 population, ~17.6% occupied cells, ~7.84 effective strategies.

**Conclusion:** world scale is viable only as an intentional ecological-budget change. Geometry must never be enlarged as a presentation tweak.

## Spatial mosaic probe

Run `34466693839` — **success**  
Artifact `10147828440`  
Digest `sha256:612a411e11e7531873d6a56b8891bfe2579d704cba7eebbebdea1c8211bfbdea`

Three seeds, 1,800 s.

Median results:

| profile | population | occupied fraction | effective strategies | founder roots | effective lineages |
| --- | ---: | ---: | ---: | ---: | ---: |
| four patches / 900x700 | 73 | 14.81% | 11.66 | 3 | 2.38 |
| eight patches / 900x700 | 74 | 25.00% | 10.61 | 3 | 2.20 |
| eight patches / 1200x900 + scaled start | 112 | **32.41%** | **13.15** | **3** | **2.39** |

One seed in the 1200x900 eight-patch specimen retained four founder lineages.

Diet still converged strongly toward extremes (~0.91 absolute specialization), showing that more patch geography creates more local populations but does not by itself add additional ecological dimensions.

**Conclusion:** spatial mosaic is a real lever and should be retained in the next design.

## Heterogeneous resource-regime probe

The strongest finding came from making some patches spatially dense/predictable and others diffuse/search-heavy while leaving the inherited genome unchanged.

Run `34466989551` — **success**  
Artifact `10147932194`  
Digest `sha256:2bc412f83b2eee1a755d902c7d9944d7f290a99dc0887b5da0d6f5aede74517e`

Across all three seeds, organisms associated with diffuse patches were consistently faster, had longer sense and were smaller than organisms associated with dense patches.

A paired uniform-spread control was then run to separate habitat causation from ordinary spatial sorting.

Run `34467199329` — **success**  
Artifact `10148028530`  
Digest `sha256:3988b49ed0399c69c3f55e5bc22bb3dda20b47b29546a4dfdf00d0e27176b1ca`

Heterogeneous-minus-uniform median local contrast:

- diffuse vs dense speed: **+0.3591**;
- sense: **+9.2564**;
- size: **-1.3548**;
- efficiency: **-0.0562**;
- wander: ~neutral (`-0.0087`);
- absolute diet specialization: ~neutral (`-0.0123`).

Population was essentially unchanged: uniform median **117**, heterogeneous median **116**.

The same direction for speed/sense/size appeared across all three tested seeds.

**Conclusion:** environmental heterogeneity can causally expose distinct, repeatable foraging phenotypes from the existing genome. This is stronger evidence than simply adding traits or increasing mutation.

## Audit-harness correction preserved

The first multipatch subclass draft initialized its layout after `super()`, while the core constructor had already created initial food. That would have contaminated the intended eight-patch initial condition. The result was rejected before being used as evidence and the harness was corrected before the recorded multipatch run.

This remains part of the audit history rather than being erased.

## Final diagnosis

The Owner's boredom is supported by three separate mechanisms:

1. **low spatial occupation** — baseline life uses only a small fraction of the visible world;
2. **ecological dimensionality collapse** — two resource niches plus one shared foraging controller strongly compress evolution toward a small number of similar strategies;
3. **phenotype invisibility** — several inherited traits are weakly or not at all communicated by the renderer, so existing biological differences are harder to perceive than they should be.

The project should not answer this with a feature dump.

## Authorized next direction

The evidence supports two bounded layers:

### M4a — Ecological Mosaic

Create a larger, spatially occupied habitat mosaic in which resource geometry itself creates multiple stable foraging problems. Start by reusing the existing genome and controller rather than immediately adding predators, sociality or new behavioral genes.

The leading candidate is a scaled `1200x900` logical world with an eight-patch mosaic and paired dense/diffuse resource regimes, subject to a predeclared long-horizon and x40 qualification contract.

### M4b — Phenotype Legibility

Separately improve visual mapping of inherited traits so that meaningful differences are visible in motion and silhouette rather than hidden in aggregate statistics.

This layer must remain presentation-only and prove zero causal/RNG change.

## Explicit non-decisions

This audit does **not** yet authorize:

- predation;
- organism-organism combat;
- flocking/sociality;
- mating systems;
- behavioral neural networks or policy genomes;
- weather simulation;
- terrain physics;
- M2b retained lineage history;
- arbitrary population-cap increases;
- changing fixed-step or x40 semantics;
- declaring `1200x900` promoted geometry merely because one probe looked better.

Those may become valuable later, but current evidence says the highest-leverage next question is whether a richer spatial/resource ecology plus better phenotype visibility can already transform the living-world experience.
