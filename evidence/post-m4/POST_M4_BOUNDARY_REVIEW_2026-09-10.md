# Gloopipelago — Post-M4 boundary review and Dynamic Habitat Memory probe result

**Date:** 2026-09-10  
**Status:** **BOUNDARY REVIEW COMPLETE / M5a MEMORY MODEL NO-GO / RETURN TO M4 COMPOSITE OWNER GATE**

## Decision

Do **not** implement the tested Dynamic Habitat Memory model as M5a before the next Owner test.

The qualified M4a + M4b product already addresses the strongest demonstrated problems from the Owner's boredom/shallowness complaint. A final high-value concern remained — static habitats have geography but no local resource memory — so a bounded audit-only probe was authorized before spending Owner attention.

That probe failed its predeclared go/no-go screen. Per the predeclared stop rule, the correct next move is to stop tuning the idea and prepare the existing M3 + honest-x40 + M4a + M4b composite Owner artifact.

## Frozen product boundary

No M5 product runtime was created.

Audit branch:

`m5a-dynamic-habitat-memory-audit-2026-09-10`

Starting product boundary:

`m4b-living-world-legibility-2026-09-10`

Qualified M4b product head remains:

`0b1e53a1e82a1bbf046d1fcc4eec4a2adf41ac52`

Cleaned M4b branch head at audit start:

`23a273968ff9b471e7099eb8af57928d7e330634`

Historical maintained-core SHA-256:

`18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`

Qualified M4 ecology SHA-256:

`b4539d91f31c8aa7b2a966244ad8e7b5c851698a7000ba3c3799c70611340c0e`

## Predeclared probe

Plan:

`evidence/post-m4/POST_M4_DYNAMIC_HABITAT_MEMORY_PROBE_PLAN_2026-09-10.md`

Question:

> Does minimal local renewable-productivity memory create useful temporal ecology beyond static M4 while preserving the already-qualified ecological quality?

The probe deliberately kept the ordinary global food-rate parameter unchanged. Memory only redistributed placement among same-kind habitats according to recent local exploitation and recovery.

Profiles were declared before results:

- control — exact M4 behavior;
- gentle — floor 0.45, decrement 0.010, recovery tau 45 s, exponent 1.0;
- medium — floor 0.30, decrement 0.018, tau 70 s, exponent 1.35;
- strong — floor 0.18, decrement 0.030, tau 100 s, exponent 1.7.

Five declared seeds were run for 1,800 simulated seconds per profile.

## Run and artifacts

GitHub Actions run:

`34482766108` — **completed / success as experiment execution**.

A green workflow status means the probe executed correctly; it does **not** mean the ecological hypothesis passed.

Structural artifact:

- id `10154311306`;
- digest `sha256:d96b9807ec2faf23498ae8cc09dc35a0327b578b43d41750d84708249ebcbef7`.

Matrix artifact:

- id `10154441184`;
- digest `sha256:ce0b01f08dbf63318fdf32e66514d069b4c19ea7606606ac3d0151a5942ac083`.

Exact run head:

`6edd0d90161b367326f47061e09d309c03011ed2`

## Structural control PASS

The memory-disabled probe path was compared against exact M4 on three seeds for 36,000 fixed 1/60 ticks (600 simulated seconds).

For every seed:

- exact serialized causal state matched;
- exact RNG state matched;
- qualified M4 construction remained PASS;
- protected M0 remained PASS.

Representative final fingerprints:

- seed 1: `63fa4770634cd8b0591d59927e183577abc5e39fedc6b2818d323261104a7116`;
- seed `0x12345678`: `87e07df97e3bb88974f826a48709d624f8430f944e2bacbf813367cca4725d95`;
- seed `956866913`: `d3833fa97e309d3aa8edf92e6aad5dd9bfc973558851c59819bacbf17d41fb44`.

Therefore the negative result is not explained by the audit instrumentation perturbing control biology.

## Predeclared go/no-go result

**No tested memory profile passed.**

### Gentle

Paired median relative to control:

- habitat-occupancy turnover: `1.109x` — about +10.9%, below the required +15%;
- seeds with any positive occupancy-turnover effect: 4/5, but only 1/5 reached +15%;
- habitat-food turnover: `0.942x` — lower than control;
- strategy diversity: `1.053x` control;
- founder-root delta: median `+1`;
- extinctions: 0/5.

Gentle preserves ecology well but fails to create the required temporal resource dynamics.

### Medium

Paired median:

- habitat-occupancy turnover: `0.988x` — essentially unchanged;
- habitat-food turnover: `1.074x` — only about +7.4%, below the required +20%;
- strategy diversity: `1.033x` control;
- founder-root delta: median `0`;
- extinctions: 0/5.

Medium also fails the temporal-ecology screen.

### Strong

Paired median:

- habitat-occupancy turnover: `1.071x` — only about +7.1%;
- habitat-food turnover: `0.991x` — essentially unchanged/slightly lower;
- strategy diversity: `0.746x` control — below the required 80%;
- founder-root delta: median `-1`;
- extinctions: 0/5.

One strong-profile seed (`956866913`) degraded to:

- population 67;
- one surviving original founder root;
- effective original lineages 1.0;
- strategy effective ~9.51;
- maximum standing food 853;
- only ~18,294 tagged ordinary foods consumed versus ~35k in ordinary/control-like runs.

This is exactly the kind of pathological dynamics the stop conditions were intended to reject.

## Why the mechanism failed

The most informative finding is not merely that thresholds were missed.

The tested scalar productivity model **saturates**.

Across 60-second samples from 300–1,800 s:

- gentle median productivity is exactly its 0.45 floor;
- ~96.7% of gentle habitat samples lie within 0.02 of that floor;
- medium median productivity is exactly its 0.30 floor;
- ~99.5% of medium habitat samples lie within 0.02 of that floor;
- strong is also mostly floor-bound (~88.8% within 0.02), with occasional pathological asymmetry.

Thus ordinary exploitation pushes most active habitats down together. Once all comparable habitats sit near the same floor, weighted placement becomes nearly uniform again. The model therefore adds an internal state variable without creating the desired durable spatial differentiation.

The many small `recovery` direction changes in gentle are consequently not strong evidence of meaningful habitat cycles; they mostly reflect tiny motion around the common floor. Median between-habitat productivity range is only ~0.024 in gentle and ~0.0084 in medium.

## Global-resource confound check

The result is not primarily explained by silently changing the configured global food supply.

Paired median ordinary-food-created ratios are approximately:

- gentle `0.9998x` control;
- medium `1.0005x`;
- strong `1.0061x`.

The global `foodRate` parameter remained unchanged. The strong pathological standing-food accumulation arises from altered spatial exploitation/consumption, not an intentionally larger input budget.

## Product interpretation

The broad idea that **places should eventually have ecological history remains interesting**. This probe rejects only the tested implementation family:

> scalar habitat productivity reduced per consumed food and used only to redistribute future same-kind spawn placement under a fixed global event budget.

A future revisit might require a more genuinely local resource-stock model, capacity-normalized depletion, explicit local renewal, or a different consumer-resource feedback. Those are new hypotheses and must not be smuggled in as "tuning" of this failed probe.

Research sanity-check also supports caution: local patch renewal and niche-construction feedback can create meaningful spatial ecology, but exploitation feedback can equally destabilize or collapse systems. Our own evidence therefore remains primary.

## Final boundary-review verdict

The remaining environment-memory idea is **not sufficiently mature to justify delaying the Owner test**.

M4 already has:

- materially larger and fuller world;
- multiple stable ecological habitats;
- repeatable local phenotype differentiation;
- substantially improved strategy/lineage persistence;
- honest ~40x execution on evolved worlds;
- presentation that exposes habitat and phenotype structure rather than debug clutter.

Therefore the post-M4 boundary review is closed with this decision:

> **STOP M5a. Freeze the negative probe as research evidence. Prepare the exact qualified M3 + x40 + M4a + M4b composite for the next broad Owner test.**

No M2b, predation, sociality, mating, weather, terrain physics, new genes or habitat-memory product work should be inserted before that test.
