# Gloopipelago — Current State

**Date:** 2026-09-10  
**State:** **M0/M1/B0/M2a PROMOTED / M3 REPAIR MACHINE PASS / x40 MACHINE PASS / M4a ECOLOGY FULL MACHINE PASS / M4b LIVING WORLD LEGIBILITY FULL MACHINE + INTERNAL VISUAL PASS / COMPOSITE OWNER GATE PENDING / M3+x40+M4 NOT YET PROMOTED / M2b DEFERRED.**

## Project identity

Gloopipelago is a **living evolution observatory**. The living world is primary; causal apparatus exists to make its evolution understandable, reproducible and safely extensible.

## Live authority

Repository:

`Jozzpoly/Gloopipelago`

Live `main` verified 2026-09-10:

`bd8bfab5079bb1d1f596f9621d98ac522571b75a`

`main` remains promoted implementation authority. Green CI on stacked branches does not make those branches live authority.

Frozen historical artifact:

`archive/v1/gloopipelago_single.html`

SHA-256:

`ededf979b857f795a93f8d019ab3fc6364df0156885f381050641ab30ffff1d8`

Do not edit or rebaseline it.

## Promoted foundation

M0 / M1 / B0 / M2a are **PROMOTED**.

Promoted maintained-core SHA-256:

`18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`

M2a lifecycle witness remains passive/detached. `Simulation` retains no lifecycle history. M2b retained history remains deferred.

## Current stacked product lineage

All current product layers remain draft and unmerged pending a composite Owner gate.

1. **PR #11 — M3 repaired world/view separation**  
   branch `m3-logical-world-view-implementation`  
   base `main`  
   open / draft / mergeable  
   exact repaired qualification head `1411f46831aad00e579c6cf03f36b7fcef1b1001`

2. **PR #12 — honest x40 fast-forward**  
   branch `x40-honest-fast-forward-2026-09-10`  
   base M3 branch  
   open / draft / mergeable  
   exact x40 qualification head `2081e4a1462a52fe20b4c3f8a60ef54a968977ed`

3. **PR #13 — M4a Ecological Mosaic**  
   branch `m4a-ecological-mosaic-implementation`  
   base x40 branch  
   open / draft / mergeable  
   exact M4a product qualification head `1a0f585f32249989e3e3781693f46c0bd74aefbd`

4. **M4b — Living World Legibility**  
   branch `m4b-living-world-legibility-2026-09-10`  
   based on cleaned M4a state  
   FULL MACHINE + INTERNAL VISUAL PASS  
   PR pending closeout/boundary review.

Promotion, if later authorized by Owner evidence, must preserve dependency order.

## M3 — world/view authority

M3 separates logical world semantics from presentation geometry.

Maintained principles:

- viewport/CSS/DPR are presentation-only;
- browser resize does not call `Simulation.setSize()`;
- aspect-preserving centered `contain`;
- outside bands have no pointer authority;
- pointer maps view coordinates back into logical-world coordinates;
- pure DPR changes update presentation backing without changing causal state.

Detailed authority/evidence:

- `docs/M3_LOGICAL_WORLD_VIEW_SEPARATION_CONTRACT_2026-09-10.md`
- `evidence/m3/M3_DPR_REPAIR_MACHINE_QUALIFICATION_2026-09-10.md`
- `evidence/m3/M3_OWNER_SMOKE_PARTIAL_2026-09-10.md`

The remaining Owner product check is deferred to the final composite candidate rather than obsolete intermediate builds.

## Honest x40 execution

x40 preserves exact sequential `Simulation.step(1/60)` and separates simulation throughput from render cadence.

Maintained behavior:

- target speed and achieved speed are distinct;
- main-thread stepping uses bounded CPU slices;
- retained simulation backlog is bounded;
- speed/pause/reset/visibility transitions clear historical timing debt;
- hidden tabs do not evolve or catch up;
- underachievement is reported rather than hidden;
- high-speed rendering is decoupled from fixed-step simulation.

Historical x40 qualification:

`evidence/x40/X40_MACHINE_QUALIFICATION_REPORT_2026-09-10.md`

M4a/M4b independently requalified x40 on richer evolved worlds and still measured near-full target throughput.

## Owner boredom/shallowness finding

The Owner rejected the earlier technically healthy product as too small, sparse, visually homogeneous, behaviorally homogeneous and environmentally shallow.

The subsequent skeptical audit established that the complaint corresponded to measurable structural limitations:

- baseline normalized occupancy ~14.8%;
- effective coarse strategies fell to ~5.86 by 1,800 s;
- typically only ~2/34 founder lineages remained;
- simple tuning could add population or mutation spread without reliably maintaining richer ecology;
- heterogeneous resource geography could elicit repeatable local phenotype differences using the existing genome/controller.

Canonical audit:

`evidence/living-world/LIVING_WORLD_INTEREST_AUDIT_2026-09-10.md`

## M4a — Ecological Mosaic

**FULL MACHINE PASS / NOT PROMOTED.**

Qualified ecological epoch:

- logical world `1200x900`;
- 66 founders;
- 275 initial food;
- 18.5 food/s;
- cap 260 unchanged;
- eight stable habitats;
- A/B resource kinds crossed with dense vs diffuse resource geometry;
- existing inherited genome and organism controller retained;
- fixed `1/60` stepping retained;
- historical maintained core remains byte-identical.

M4 ecology source SHA-256:

`b4539d91f31c8aa7b2a966244ad8e7b5c851698a7000ba3c3799c70611340c0e`

Final M4a Actions run:

`34473583712` — completed / success

Exact M4a standalone:

`3fb5638006137ecfb7e2d115c38ef981244ac4bd20b4b3b22e42ccdef4ac59ae`

Key 1,800 s result across eight predeclared seeds:

- median occupancy `31.02%`;
- effective strategies `19.31`;
- strategy retention 600→1800 `0.839`;
- active original founder roots median `3.5`;
- effective original lineages `2.865`;
- <=1-lineage collapse `0/8`;
- extinction `0/8`;
- population median `125`;
- cap hit fraction `0`.

Three seeds extended to 3,600 s retained `4 / 4 / 3` original founder roots with zero extinctions.

Paired local-adaptation control supports repeatable dense-vs-diffuse phenotype differentiation. After subtracting ordinary spatial sorting, median diffuse-minus-dense effects were approximately:

- speed `+0.671`;
- sense `+16.61`;
- size `-1.04`;
- expected sign on all three dimensions `8/8` seeds.

M4a evolved-world x40:

- 600 s, 8 seeds: median `39.77x`, min `39.66x`;
- 1,800 s, 3 seeds: median `39.71x`, min `39.70x`.

Detailed evidence:

- `docs/M4_LIVING_WORLD_AMPLIFICATION_CONTRACT_2026-09-10.md`
- `evidence/m4a/M4A_MACHINE_QUALIFICATION_REPORT_2026-09-10.md`
- `evidence/m4a/M4A_LAYER_CLOSEOUT_2026-09-10.md`

## M4b — Living World Legibility

**FULL MACHINE PASS / INTERNAL VISUAL PASS / NOT PROMOTED.**

M4b is presentation-only. It does not change M4a causal state, ecology, RNG, lifecycle sequence, world geometry or scheduler semantics.

Predeclared supplement:

`docs/M4B_LIVING_WORLD_LEGIBILITY_SUPPLEMENT_2026-09-10.md`

### Rejected iteration 1

Run `34476912597` passed machine tests but failed internal visual review. It is preserved rather than relabeled as success.

Problems:

- habitat fields were almost invisible;
- forward sensor marks implied directional perception absent from the model;
- phenotype separation remained too weak at normal/narrow world scale.

Receipt:

`evidence/m4b/M4B_VISUAL_ITERATION_1_REJECTION_2026-09-10.md`

### Accepted iteration 2

Final v2 Actions run:

`34477849280` — **completed / success**

Exact M4b product qualification head:

`0b1e53a1e82a1bbf046d1fcc4eec4a2adf41ac52`

Exact standalone:

- SHA-256 `656ede3b409d9d2f3f4a5445b3e1a526c7c6c799be83d6245d42c1272799af6f`;
- 33,989 bytes;
- M4b visuals SHA-256 `13428dc9673803129020d4945cf3b394a9cde3073236d8f24c52bbe1f3b479d8`;
- M4 ecology SHA remains exact `b4539d91...1340c0e`;
- maintained core SHA remains exact `18e7ed7...a497c56`.

Machine PASS includes:

- monotonic size/speed/sense visual mapping;
- diet remains primary body color; inherited hue is secondary accent;
- 3 seeds × draw cadences 1/7/60 vs no-draw: exact full-state/RNG/lifecycle equality;
- 250 repeated real-browser draws: exact zero state/RNG delta;
- exact M4a construction;
- protected M0/M1.1/M2a smoke;
- wide/narrow/DPR/pointer/reset/new-seed browser mechanics;
- deterministic standalone;
- no page errors.

M4b evolved-world x40:

- 600 s, 8 seeds: median **39.06x**, minimum **38.02x**;
- 1,800 s, 3 seeds: median **39.35x**, minimum **38.87x**;
- 40x→1x approximately `0.983x`;
- hidden interval exact zero advance.

Internal visual PASS:

- giant full sense circles no longer dominate the world;
- compact segmented sense cue is omnidirectional and explicitly non-literal;
- habitat fields remain visible without debug borders and reflect the true square support of resource placement;
- size/speed morphology is materially visible in evolved local populations;
- inherited hue adds secondary identity without obscuring diet;
- narrow/mobile-like presentation remains readable;
- exact M4a→M4b comparisons show presentation improvement rather than biological change.

Detailed receipt:

`evidence/m4b/M4B_QUALIFICATION_AND_VISUAL_REVIEW_2026-09-10.md`

## What M4 still does not solve

The current world is substantially richer than the rejected baseline, but M4 remains intentionally bounded.

Still absent:

- dynamic depletion/regrowth state for habitats;
- organism-driven environmental modification / ecological inheritance;
- predation, social behavior or mating;
- explicit negative-frequency-dependent fitness rules;
- retained ancestry/history UI;
- species classifier/taxonomy;
- terrain physics or richer material environment.

Static habitat geography is now ecologically meaningful and visually legible, but the environment itself does not yet have a persistent evolving history.

## Immediate next step — post-M4 boundary review

Before asking the Owner to spend attention on another broad test:

1. freeze/close M4b provenance and open it as a stacked draft layer;
2. review the original boredom/shallowness complaint against M4a+M4b evidence and exact screenshots;
3. decide whether the highest-value next action is:
   - one composite Owner test of M3+x40+M4a+M4b, or
   - one more **bounded, separately contracted** living-world milestone before Owner testing;
4. do not add new biology to M4b itself.

## Promotion rule

No M3/x40/M4 implementation layer is promoted yet.

If a later composite Owner gate is positive, reconcile and promote layers in provenance/dependency order. If the Owner finds a material problem, reopen only the relevant layer and requalify any changed runtime.

## Negative decisions

Do not edit frozen V1. Do not rewrite `v1-mirror.mjs` to absorb M4. Do not restore viewport-driven world sizing. Do not raise population cap merely to make the screen busier. Do not replace fixed `1/60` with a large fast-forward timestep. Do not claim universal 40x. Do not add a Worker without evidence. Do not smuggle predation/sociality/mating/weather/terrain/niche construction into M4b. Do not promote M2b by inertia. Do not merge draft layers before the composite Owner gate is positive.
