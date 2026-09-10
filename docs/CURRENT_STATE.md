# Gloopipelago — Current State

**Date:** 2026-09-10  
**State:** **M0/M1/B0/M2a PROMOTED / M3 REPAIR MACHINE PASS / x40 MACHINE PASS / M4a ECOLOGICAL MOSAIC FULL MACHINE PASS / M4b LIVING WORLD LEGIBILITY FULL MACHINE + INTERNAL VISUAL PASS / POST-M4 M5a PROBE NO-GO / COMPOSITE OWNER PRODUCT GATE NEXT / M3+x40+M4 NOT YET PROMOTED / M2b DEFERRED.**

## Live authority

Repository: `Jozzpoly/Gloopipelago`

Live `main` remains:

`bd8bfab5079bb1d1f596f9621d98ac522571b75a`

Green stacked branches are qualified candidates, not live authority.

Frozen V1:

`archive/v1/gloopipelago_single.html`  
SHA-256 `ededf979b857f795a93f8d019ab3fc6364df0156885f381050641ab30ffff1d8`

Promoted maintained-core SHA-256:

`18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`

M2b retained history remains deferred.

## Qualified stacked product lineage

All four implementation layers remain **open / draft / unmerged** pending one broad Owner product gate.

1. **PR #11 — repaired M3 world/view separation**  
   branch `m3-logical-world-view-implementation`  
   exact qualified runtime `1411f46831aad00e579c6cf03f36b7fcef1b1001`

2. **PR #12 — honest x40 fast-forward**  
   branch `x40-honest-fast-forward-2026-09-10`  
   exact qualified runtime `2081e4a1462a52fe20b4c3f8a60ef54a968977ed`

3. **PR #13 — M4a Ecological Mosaic**  
   branch `m4a-ecological-mosaic-implementation`  
   exact qualified product `1a0f585f32249989e3e3781693f46c0bd74aefbd`

4. **PR #14 — M4b Living World Legibility**  
   branch `m4b-living-world-legibility-2026-09-10`  
   exact qualified product `0b1e53a1e82a1bbf046d1fcc4eec4a2adf41ac52`

Live verification after PR creation showed #11/#12/#13/#14 mergeable; do not merge yet.

## Exact next Owner candidate

Use the standalone produced by accepted M4b v2 run `34477849280`.

SHA-256:

`656ede3b409d9d2f3f4a5445b3e1a526c7c6c799be83d6245d42c1272799af6f`

Size: `33,989 bytes`.

This exact artifact contains the qualified dependency stack M3 -> x40 -> M4a -> M4b.

Owner protocol:

`evidence/owner/M4_COMPOSITE_OWNER_TEST_PROTOCOL_2026-09-10.md`

The Owner gate is principally a living-world/product judgement. Machine correctness is already strongly covered; a negative Owner judgement overrides green CI.

## What changed since the rejected boring build

The Owner rejected the earlier product as too small, sparse, homogeneous and environmentally shallow. Skeptical audit confirmed measurable convergence rather than merely presentation taste.

M4a then introduced a separately qualified ecological epoch while keeping historical maintained core bytes unchanged:

- world `1200x900`;
- 66 founders;
- 275 initial food;
- 18.5 food/s;
- cap 260 unchanged;
- 8 stable A/B × dense/diffuse habitats;
- existing genome/controller;
- fixed `1/60` stepping;
- honest x40 retained.

Across 8 predeclared seeds at 1,800 s:

- median normalized occupancy `31.02%` vs rejected baseline ~14.8%;
- effective coarse strategies `19.31` vs baseline ~5.86;
- 600→1800 strategy retention `0.839`;
- active original founder roots median `3.5`;
- effective original lineages `2.865`;
- <=1-lineage collapse `0/8`;
- extinction `0/8`;
- population median `125`;
- cap hit fraction `0`.

Three seeds extended to 3,600 s retained `4 / 4 / 3` original founder roots with zero extinctions.

Paired local-adaptation control found diffuse-vs-dense effects after subtracting ordinary spatial sorting:

- speed `+0.671`;
- sense `+16.61`;
- size `-1.04`;
- expected direction on all three traits `8/8` seeds.

M4a report:

`evidence/m4a/M4A_MACHINE_QUALIFICATION_REPORT_2026-09-10.md`

## M4b presentation result

M4b is presentation-only and preserves exact M4a causal state/RNG/lifecycle semantics.

Rejected v1 remains preserved as a machine-PASS / visual-FAIL specimen. Accepted v2 passed machine qualification and internal visual review.

Accepted rendering makes existing model differences easier to see:

- diet owns primary body color;
- size changes silhouette scale;
- speed changes elongation/trail cue;
- sense uses a compact omnidirectional, explicitly non-literal cue instead of giant full circles;
- inherited hue is a secondary accent;
- habitats render as soft deterministic fields matching the real square support of resource placement.

M4b exactness includes 3 seeds × draw cadences 1/7/60 versus no-draw with exact full-state/RNG/lifecycle equality plus 250 repeated real-browser draws with zero state/RNG delta.

M4b evolved-world target-40 performance:

- 8 seeds after 600 s: median `39.06x`, minimum `38.02x`;
- 3 seeds after 1,800 s: median `39.35x`, minimum `38.87x`;
- 40x→1x ~`0.983x`;
- hidden interval exact zero advance.

M4b report:

`evidence/m4b/M4B_QUALIFICATION_AND_VISUAL_REVIEW_2026-09-10.md`

## Post-M4 boundary review — M5a stopped

Before spending Owner attention, one further high-value hypothesis was challenged on a separate audit branch: could recent exploitation give habitats useful local resource memory?

Audit branch:

`m5a-dynamic-habitat-memory-audit-2026-09-10`

Actions run `34482766108` executed successfully. Memory-disabled instrumentation reproduced exact M4 causal state/RNG, so the probe itself was valid.

The tested memory family **failed its predeclared product-relevance screen**:

| profile | occupancy-turnover vs M4 | food-turnover vs M4 | strategy diversity vs M4 |
|---|---:|---:|---:|
| gentle | `1.109x` | `0.942x` | `1.053x` |
| medium | `0.988x` | `1.074x` | `1.033x` |
| strong | `1.071x` | `0.991x` | `0.746x` |

The intended screens were at least `1.15x` habitat-occupancy turnover and `1.20x` habitat-food turnover while preserving ecological quality.

More importantly, scalar productivity mostly saturated at its floor instead of producing useful persistent local cycles:

- gentle: ~96.7% of sampled habitat values within 0.02 of floor;
- medium: ~99.5%;
- strong: ~88.8%, with one pathological seed collapsing to population 67, one original founder root and maximum standing food 853.

Decision:

**Do not tune or implement this M5a family before Owner testing.** The broader idea of places carrying ecological history remains a future hypothesis, but requires a genuinely new local-resource model rather than disguised parameter tuning.

Canonical decision:

`evidence/post-m4/POST_M4_BOUNDARY_DECISION_2026-09-10.md`

Full negative audit receipt remains on the audit branch.

## Immediate execution state

**The next move is now Owner-only.**

Do not add another biological milestone before this test. Do not merge the stack yet.

Owner should use the exact M4b v2 standalone and judge primarily:

- whether the world is materially less boring and more worth observing;
- whether multiple local habitats/populations feel distinct;
- whether organism differences are perceptible enough to follow;
- whether x40 reveals meaningful ecological/evolutionary history rather than merely faster noise;
- whether the larger world still feels too empty/static/shallow;
- whether wide/narrow presentation and controls remain pleasant enough for experimentation.

If Owner PASS: verify exact provenance and promote #11 -> #12 -> #13 -> #14 in order, checking live ancestry after each merge.

If Owner negative: do not merge; reopen only the implicated layer and preserve this exact candidate/result as historical evidence.

## Explicit negative decisions

Do not edit frozen V1. Do not absorb M4 into `v1-mirror.mjs`. Do not restore viewport-driven world sizing. Do not raise population cap merely to make the screen busier. Do not replace fixed `1/60` with a large fast-forward timestep. Do not claim universal 40x. Do not add a Worker without evidence. Do not insert M2b, predation, sociality, mating, weather, terrain physics, new genes or another habitat-memory attempt before the composite Owner gate.
