# Gloopipelago — M4a headless qualification

**Date:** 2026-09-10  
**Status:** **HEADLESS M4a PASS / BROWSER + x40 QUALIFICATION STILL REQUIRED**

## Exact campaign

Final headless workflow run:

`34471288594` — **completed / success**

Head:

`1eeffa5860709c747b7e6949b6a6e9c783451752`

The run was executed after the exact candidate budget and final qualification plan were recorded.

## Exact candidate

- logical world: `1200x900`;
- founders: `66`;
- initial food: `275`;
- ongoing food rate: `18.5/s`;
- eight stable habitats;
- A/B food kinds crossed with dense/diffuse spatial regimes;
- historical population cap `260` unchanged;
- organism genome/controller unchanged;
- fixed simulation step remains `1/60`;
- historical `src/core/v1-mirror.mjs` remains byte-identical.

Budget-selection evidence:

`evidence/m4a/M4A_BUDGET_SELECTION_2026-09-10.md`

Predeclared final plan:

`docs/M4A_FINAL_QUALIFICATION_PLAN_2026-09-10.md`

## Protected/process artifact

Artifact `10149681022`  
Digest `sha256:8d5510df6e1a6ebe8e98ccb985425e73e7ecdb3061aea2da54874f66c5e34d9b`

Passed:

- historical core SHA-256 exactly `18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`;
- M4 construction/determinism gate;
- exactly 66 witness-visible initial founders with no transient base-construction witness leak;
- exactly 275 initial food;
- exact same-seed construction;
- exact same-seed reset;
- exact stepped same-seed state/RNG;
- M0 Oracle;
- M1.1 maintained-core verify, RNG counts and restore;
- M2a witness OFF / collector / no-retain / throwing / mutating parity;
- M2a semantic specimens;
- M2a adversarial detached-witness checks.

## Ecology artifact

Artifact `10149658539`  
Digest `sha256:1dd613b1a02cb64bf3ae1a482466f5ac62e445e9a779a2e42069a2354a9fa33d`

Eight predeclared deterministic seeds through 1,800 simulated seconds, with the first three continuously extended to 3,600 seconds.

### Predeclared 1,800 s gates

| metric | threshold | result |
| --- | ---: | ---: |
| median occupied fraction | >= .25 | **.3102 PASS** |
| median effective strategies | >= 10 | **19.31 PASS** |
| median 600->1800 strategy retention | >= .65 | **.8393 PASS** |
| median active original founder roots | >= 3 | **3.5 PASS** |
| median effective original lineages | >= 2.2 | **2.8649 PASS** |
| seeds with <=1 original founder root | <= 2/8 | **0/8 PASS** |

Additional characterization:

- median population: `125`;
- extinction seeds by 1,800 s: `0/8`;
- maximum population observed across all runs: `169`;
- maximum fraction of ticks at cap 260: `0`.

The current cap therefore has no evidence of constraining this candidate and is not raised.

### Per-seed 1,800 s founder roots

`5 / 4 / 3 / 3 / 5 / 2 / 4 / 3`

No seed collapsed to one original founder lineage.

### 3,600 s red-team extension

Predeclared hard stop: reject if at least 2/3 extended seeds become extinct or end with <=1 active original founder root.

Result: **0/3 hard-stop collapses**.

- seed `1`: population 136, occupied .3333, strategies 10.95, original roots 4, effective lineages 3.53, zero extinctions;
- seed `0x12345678`: population 125, occupied .3241, strategies 22.51, original roots 4, effective lineages 3.54, zero extinctions;
- seed `956866913`: population 122, occupied .3426, strategies 12.43, original roots 3, effective lineages 2.84, zero extinctions.

All three remain descendants of the initial M4 founders; auto-reseed contributes zero active roots.

## Paired local-adaptation artifact

Artifact `10149681941`  
Digest `sha256:9f5eee72f114fa54c56a976e50f03979fae82c4e4e868fbd00772e133b71d2f2`

Eight predeclared seeds. Each exact heterogeneous candidate is paired with a control using the same eight habitat locations/kinds/regime labels but uniform `.075` spread.

### Heterogeneous candidate local phenotype

Diffuse minus dense median:

- speed: **+0.6049** (threshold >= +.20);
- sense: **+18.9238** (threshold >= +5);
- size: **-1.0064** (threshold <= -.60);
- simultaneous expected signs: **7/8** (threshold >= 6/8).

### Control-subtracted effect

`heterogeneous local delta - uniform-control local delta` median:

- speed: **+0.6712** (threshold >= +.10);
- sense: **+16.6117** (threshold >= +2.5);
- size: **-1.0429** (threshold <= -.30);
- simultaneous expected signs: **8/8** (threshold >= 5/8).

Median population remains similar between treatments:

- heterogeneous: `125`;
- uniform: `128.5`.

This strongly argues that the observed phenotype separation is associated with resource-regime heterogeneity rather than merely a higher total population or ordinary spatial sorting.

One heterogeneous seed (`956866913`) did not have the expected sense sign in the raw local delta, but the campaign was predeclared to require 6/8 simultaneous signs and achieved 7/8. The exception is preserved rather than hidden.

## Interpretation boundary

This evidence supports a causal claim about **local foraging phenotype differentiation under the M4 habitat mosaic**. It does not establish discrete species, cognition, social roles, predation or ecological interactions absent from the model.

M4a remains a deliberately small ecological expansion: richer resource geography eliciting different strategies from the existing inherited trait space.

## What is not yet PASS

This is **not yet a browser/product M4a PASS**.

Still required before M4a can be frozen for the M4b layer:

1. integrate the exact M4 ecology into the browser and standalone builder;
2. make view authority explicitly 1200x900 while preserving M3 world/view separation principles;
3. render the actual eight habitats rather than the historical two-patch background;
4. requalify DPR / resize / pointer mapping on the new geometry;
5. qualify honest x40 on eight natural M4a browser specimens with median >=35x and none below 30x;
6. preserve pause/debt/visibility/achieved-speed semantics;
7. deterministic standalone build and exact provenance receipt.

No Owner broad test is requested at this stage.
