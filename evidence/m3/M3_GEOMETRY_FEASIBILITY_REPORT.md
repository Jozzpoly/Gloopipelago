# Gloopipelago — M3 Geometry Feasibility Report

**Date:** 2026-09-10  
**Status:** **PASS FOR CONTRACT PURPOSE / GEOMETRY SENSITIVITY DEMONSTRATED**

## Question

Before M3 can make browser view geometry non-causal, the project needs an explicit logical world rectangle. Current V1/M2a semantics make world dimensions ecological: area and aspect ratio change founder/resource density, travel distance, niche spacing, boundary interactions and therefore future RNG topology and lineage history.

This probe does **not** ask which geometry produces the most attractive ecology. It asks whether the candidate geometries are materially different, whether any candidate shows an immediate disqualifying failure in the bounded horizon, and which candidate has the strongest existing project authority if geometry cannot be treated as neutral.

## Exact-source execution receipt

Reproducible probe: `tools/m3-geometry.mjs`.

Exact GitHub Actions execution:

- workflow run: `34421980063` — **completed / success**;
- branch: `m3-logical-world-view-contract`;
- execution head: `5698bc866cc63ba28e1d79178ea7585280ddc960`;
- artifact: `m3-geometry-feasibility`, artifact id `10131234964`;
- GitHub artifact archive digest: `sha256:6d268714be5a70c6c2e3579851a4509de071f8fd64b87a264d6de890b0b49a62`;
- extracted `geometry-feasibility.json` SHA-256: `7b59981c4190789b2ff77a0e3b664e276bd3e461d99fcbe422e1098ae6dbb2b5`;
- exact promoted M2a core SHA-256 asserted by the probe: `18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`;
- Node runtime selected by workflow: `22.16.0`, matching the M0 qualification Node version.

The temporary Actions workflow was removed after successful receipt capture. The probe tool remains repo-native and reproducible.

## Oracle / RNG validation before novel measurements

The exact-source run first re-executes four existing reference cases and aborts on any mismatch:

- `P-NOMINAL-S1` — seed `1`, 900x700;
- `P-NOMINAL-S12345678` — seed `0x12345678`, 900x700;
- `P-COMPACT` — seed `0x12345678`, 390x600;
- `P-WIDE` — seed `0x9E3779B9`, 1400x800.

All four reproduced their existing exact full-causal-state SHA-256, RNG call count and final explicit RNG state: **4/4 PASS**.

An earlier local semantic reconstruction was also compared against the exact-source Actions artifact after completion. Every common field across all 63 geometry rows matched exactly: **0 mismatches / 63 rows**. The Actions artifact is the authoritative execution receipt.

## Probe matrix

Each run uses:

- current M2a-promoted `Simulation`;
- browser model config (`digestExponent=3`, `minDigestion=.4`, `foodRate=10`, `foodLifetime=75`, `dietJumpRate=.02`, `stableNiches=true`);
- fixed `dt=1/60`;
- 12,000 ticks = 200 simulated seconds;
- passive M2a lifecycle collector;
- exact Float64-aware causal fingerprint;
- explicit RNG state/call accounting.

Candidate geometries:

- 390x600 — compact historical anchor;
- 900x700 — nominal/default historical anchor;
- 1400x800 — wide historical anchor.

Seed set: 21 unique seeds = 12 deterministic/boundary seeds plus 9 seeds preserved from M1.2 Owner long-run / rapid seed-scouting evidence.

Total novel matrix: **21 x 3 = 63 runs**.

Lifecycle conservation held for every row:

- `birthEvents == births`;
- `deathEvents == deaths`;
- founder count matches initial/reseed accounting;
- no run reached an extinction in the 200-second horizon.

## Why geometry cannot be considered neutral

Before any evolved behavior, the fixed counts/rates already imply very different spatial densities:

| Geometry | Area | Founders / 1M area | Initial food / 1M area | Food-rate / 1M area / s |
|---|---:|---:|---:|---:|
| 390x600 | 234,000 | 145.30 | 619.66 | 42.74 |
| 900x700 | 630,000 | 53.97 | 230.16 | 15.87 |
| 1400x800 | 1,120,000 | 30.36 | 129.46 | 8.93 |

Sense, speed, body size and most other distances are absolute rather than normalized by world size. A geometry change therefore changes more than drawing scale.

## 21-seed aggregate results at 200 s

| Geometry | Median population | Median births | Median deaths | Median food | Median max living generation | Median RNG calls |
|---|---:|---:|---:|---:|---:|---:|
| 390x600 | 67 | 182 | 158 | 9 | 11 | 372,389 |
| 900x700 | 70 | 200 | 152 | 16 | 13 | 451,324 |
| 1400x800 | 67 | 207 | 162 | 32 | 13 | 475,371 |

Ranges / stress indicators:

- 390x600: population 47–97, food 3–16; 0/21 runs with food >100; 0/21 with population <30;
- 900x700: population 12–118, food 6–429; 2/21 runs with food >100 and 2/21 with population <30;
- 1400x800: population 34–96, food 11–462; 5/21 runs with food >100; 0/21 with population <30.

No extinction occurred in any candidate. These stress indicators are **not** quality scores. They show that each rectangle samples a different resource/encounter regime and that seed-specific branch history can dominate simple aggregate expectations.

## Owner-evidence seed subset

Across the nine seeds previously visible in the Owner smoke / scouting workflow:

| Geometry | Median population | Median births | Median food |
|---|---:|---:|---:|
| 390x600 | 67 | 170 | 9 |
| 900x700 | 58 | 149 | 17 |
| 1400x800 | 68 | 207 | 25 |

Again, no geometry dominates across biologically meaningful outputs. The result argues against choosing a canonical rectangle by whichever seed history looks most lively.

The prior long-run Owner seed `956866913`, for example, ends after the bounded 200-second probe at:

- 390x600: population 47, births 120, deaths 107, food 13, max living generation 7;
- 900x700: population 58, births 139, deaths 115, food 14, max living generation 11;
- 1400x800: population 70, births 186, deaths 150, food 33, max living generation 13.

Same seed, same biology/config, materially different history.

## Interpretation

### Compact 390x600

The bounded sample is consistently food-tight and has the highest initial/resource density per unit area. It is useful as a historical compact/mobile stress anchor, but selecting it as canonical would intentionally place the maintained product in a much denser encounter regime than the nominal model geometry.

### Wide 1400x800

The bounded sample is more prone to large unused-food accumulation. Five of 21 runs finish above 100 food, including several above 300. This is consistent with a sparser encounter geometry, but it is not evidence of a bug. Selecting it as canonical would intentionally privilege the wide historical regime.

### Nominal 900x700

It is not uniquely stable: two seeds produce low-population/high-food states in the bounded horizon. The probe therefore provides no basis to call 900x700 biologically superior.

Its advantage is **authority/provenance rather than outcome**:

- it is the `Simulation` default logical geometry;
- browser/controller source also carries 900x700 as its bootstrap W/H reference before live viewport replacement;
- six of the eight M0 historical profiles start at 900x700, including both nominal profiles, explicit-intervention and both low-productivity profiles;
- it sits between the qualified compact and wide anchors in both area and aspect ratio;
- it lets M3 make the browser product converge on the already best-qualified nominal model apparatus rather than inventing a fourth rectangle.

The M1.2 Owner receipt does **not** preserve exact CSS canvas dimensions, so video/capture resolution must not be reverse-engineered into a new canonical world size.

## Geometry decision supported by this probe

**Select 900x700 as the canonical logical world geometry for the first M3 browser epoch.**

This is explicitly **not** a claim that 900x700 is optimal ecology. It is a conservative authority decision under demonstrated geometry sensitivity: when all choices change the experiment, prefer the existing nominal model anchor with the deepest qualification lineage and make the change visible in provenance.

Future explicit world-size experiments remain legitimate. `Simulation.setSize()` remains world-semantic apparatus. M3 only removes browser viewport geometry from implicit authority.

## Remaining gate

Geometry evidence alone does not authorize M3 runtime implementation. The M3 contract still must finalize:

- canonical 900x700 authority;
- uniform aspect-preserving contain transform;
- letterbox behavior;
- pointer view->world mapping;
- exact viewport-invariance qualification;
- intentional-divergence receipt requirements;
- real-browser Owner smoke requirement.

Only a promoted contract may authorize a fresh implementation branch.
