# Gloopipelago — Post-M4 Dynamic Habitat Memory probe plan

**Date:** 2026-09-10  
**Status:** PREDECLARED AUDIT / NO PRODUCT M5 AUTHORIZATION YET

## Decision context

M4a materially improved spatial occupation, strategy persistence and founder-lineage persistence. M4b materially improved visual legibility without causal changes. The remaining high-value concern from the Owner's original boredom/shallowness complaint is that habitats still have geography but essentially no local ecological memory: food production does not depend on recent exploitation of a place.

This probe asks whether a minimal local renewable-productivity memory creates useful temporal ecology beyond static M4, without adding new organism behavior, genes, predation, sociality, weather or terrain.

A positive probe may justify a separately contracted M5a. A weak/negative probe means stop and deliver the existing M4 composite for Owner testing.

## Frozen control

Control is exact M4 ecology beneath accepted M4b presentation:

- 1200x900 world;
- 66 founders;
- 275 initial food;
- 18.5 food/s global ongoing budget;
- 8 A/B x dense/diffuse habitats;
- cap 260;
- existing genome/controller;
- fixed 1/60 stepping;
- no retained M2b history.

M4b is presentation-only and is irrelevant to headless causal results.

## Minimal memory hypothesis

Each habitat receives a scalar renewable productivity state `p in [floor, 1]`, initially 1.

Recent consumption of ordinary habitat food lowers that habitat's productivity. Productivity then recovers continuously toward 1 with a declared time constant.

The global ordinary-food event rate remains unchanged. Memory only redistributes where a same-kind food event is placed: among the four habitats of the selected food kind, selection remains one RNG draw but is weighted by current productivity.

This intentionally isolates **spatiotemporal redistribution** from global carrying-capacity changes.

The probe must not:

- alter blob genome/controller/metabolism/reproduction;
- alter world geometry, founder count, initial food count or population cap;
- add new food kinds;
- change ordinary global food event rate;
- modify historical `v1-mirror.mjs` or qualified M4 source;
- enter browser/product runtime.

## Consumption observation

Probe food receives audit-only identity and habitat metadata. At a fixed one-simulated-second observation cadence, missing habitat foods whose expiry time is still in the future are counted as consumed. Ordinary expiry is not counted as exploitation. Catastrophe is absent from the probe.

This instrumentation is probe apparatus, not a proposed canonical data model.

## Candidate profiles

All profiles keep the global food budget fixed.

- `control`: exact M4, no memory.
- `gentle`: productivity floor 0.45, consumption decrement 0.010, recovery time constant 45 s, habitat-selection exponent 1.0.
- `medium`: floor 0.30, decrement 0.018, recovery time constant 70 s, exponent 1.35.
- `strong`: floor 0.18, decrement 0.030, recovery time constant 100 s, exponent 1.7.

These values are characterization candidates, not product settings.

## Probe campaign

Use five predeclared seeds:

`1`, `0x12345678`, `956866913`, `0x9e3779b9`, `20260910`.

Run each profile continuously for 1,800 simulated seconds.

Sample from 300 s onward every 60 s.

Report per seed/profile:

- population, births, deaths, extinctions;
- occupied world fraction;
- effective coarse strategies;
- active original founder roots and effective original lineages;
- per-habitat food counts;
- per-habitat nearest-blob occupancy shares;
- productivity state range/variance;
- consumption counts by habitat;
- temporal total-variation turnover of habitat occupancy shares;
- temporal total-variation turnover of habitat food shares;
- number of changes in the dominant occupied habitat;
- number of changes in the dominant food habitat;
- ordinary-food total / global food budget sanity.

## Structural control

A memory-disabled probe path must reproduce exact M4 full causal state and RNG state for the same seed/time. If it does not, the harness is invalid.

## Go / no-go screen

Memory is worth a product milestone only if a bounded candidate demonstrates all of the following relative to paired M4 control:

1. **Temporal ecology:** habitat occupancy turnover is materially higher, not merely one transient pulse. Current go screen: paired median increase >=15%, with >=4/5 seeds positive.
2. **Resource dynamics:** habitat food-share turnover is materially higher: paired median increase >=20%, with >=4/5 seeds positive.
3. **Persistent ecological quality:** at 1,800 s median effective strategies remain >=80% of paired M4 control and median active original founder roots are no more than 1 lower than control.
4. **No collapse purchase:** no more than one of five seeds may experience extinction; the mechanism must not obtain dynamics by repeatedly destroying the ecosystem.
5. **Not just noise:** productivity range must repeatedly contract and recover over the run, and dominant-habitat changes must occur across multiple separated windows rather than only at initialization.

These thresholds are intentionally modest. Passing them would justify only a deeper M5a qualification/visual probe, not promotion.

## Stop conditions

Stop before product implementation if:

- all memory profiles mostly reduce population/diversity without spatial-temporal structure;
- temporal turnover barely exceeds M4;
- the effect requires the strongest profile and behaves as violent forced oscillation;
- the probe reveals prohibitive performance cost from consumption accounting;
- the result is explainable by changed global resource quantity rather than local memory.

## What a positive result would mean

Only this bounded claim:

> Recent local exploitation can alter future local resource placement enough to create additional temporal spatial structure while preserving the qualified M4 ecology.

It would not yet establish niche construction, ecological inheritance in a strong evolutionary sense, stable cycles, species formation or improved Owner fun.

## Next action after probe

- Negative/weak: stop M5a and prepare the already-qualified M3+x40+M4a+M4b composite Owner artifact.
- Positive: run a second, narrower 8-seed/long-horizon falsification and visual probe before writing any M5a product contract.
