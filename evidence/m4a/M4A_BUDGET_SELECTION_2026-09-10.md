# Gloopipelago — M4a ecological budget selection

**Date:** 2026-09-10  
**Status:** **PRE-QUALIFICATION CANDIDATE SELECTED / NOT YET M4a PASS**

## Purpose

The M4 contract requires the larger 1200x900 ecological world to receive an explicit biological/resource budget rather than an arbitrary doubling of the old 900x700 values.

Three bounded hypotheses were tested on the same eight-habitat dense/diffuse mosaic:

- `lean`: 54 founders / 225 initial food / 15.5 food/s;
- `area`: 60 founders / 250 initial food / 17 food/s;
- `rich`: 66 founders / 275 initial food / 18.5 food/s.

Population alone was not a selection criterion.

## 900 s sweep

Run `34470206646` — **success**  
Artifact `10149232765`  
Digest `sha256:03d64705963eb01f1936b64cb935582e1997e9b8af988a599deabbc0d617cf56`

Five deterministic seeds.

Median results:

| profile | pop | occupied | effective strategies | founder roots | effective lineages | top lineage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| lean | 130 | 37.96% | 17.62 | 3 | 2.44 | 50.98% |
| area | 112 | 34.26% | **27.74** | 4 | 3.00 | 49.09% |
| rich | 134 | 34.26% | 22.90 | **5** | **4.26** | **36.30%** |

The three profiles exposed different trade-offs, so no candidate was selected from the 900 s result alone.

## 1,800 s falsification

Run `34470505232` — **success**  
Artifact `10149385406`  
Digest `sha256:72514a47e38babbfb422c2b85b8a1d76ad56af0a63894381a151bcb8e0b65f98`

Five deterministic seeds.

Median results:

| profile | pop | occupied | effective strategies | founder roots | effective lineages | top lineage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| lean | 121 | **34.26%** | **20.26** | 2 | 2.00 | 52.31% |
| area | 113 | 29.63% | 17.29 | 2 | 2.00 | 53.39% |
| rich | **128** | 29.63% | 19.60 | **4** | **2.90** | **48.85%** |

Per-seed `rich` founder roots at 1,800 s were:

`5 / 4 / 3 / 3 / 5`

No tested `rich` seed collapsed to a single founder lineage.

## Decision

Select **`rich`** as the exact candidate budget for full M4a qualification:

- founders: **66**;
- initial food: **275**;
- ongoing food rate: **18.5/s**;
- logical world: **1200x900**;
- eight stable habitats;
- paired dense/diffuse resource regimes;
- existing population cap 260 unchanged.

This is not a claim that more resource supply is intrinsically better. The earlier living-world audit already showed that simply adding resources to the old ecology can increase population while reducing or failing to preserve ecological structure.

`rich` is selected because, among the bounded M4 mosaic budgets, it preserved substantially more independent founder history through 1,800 s while retaining adequate spatial occupation and effective strategy diversity.

## What remains unproven

The selected budget must still pass the predeclared M4a qualification:

- 8 seeds through 1,800 s;
- 3 of those through 3,600 s;
- 600 -> 1,800 strategy-retention gate;
- lineage gate;
- spatial-occupation gate;
- paired dense/diffuse local-adaptation control;
- extinction/reseed characterization;
- protected process regressions;
- browser integration and x40 performance.

Failure of those gates reopens the candidate rather than weakening the contract.
