# Gloopipelago — M4b Living World Legibility qualification and visual review

**Date:** 2026-09-10  
**Status:** **FULL MACHINE PASS / INTERNAL VISUAL PASS / OWNER GATE NOT YET CLAIMED**

## Purpose

M4b is presentation-only. It exists to make the already-qualified M4a ecological structure materially easier to see without changing causal state, RNG topology, lifecycle sequence, world geometry, ecology or scheduler semantics.

The exact M4a ecology remains frozen beneath this layer.

## Iteration history

M4b iteration 1 is intentionally preserved as a useful failure:

- run `34476912597` — machine PASS;
- head `935f6fcd158fc595945376fa3da24d3667a0c983`;
- standalone SHA-256 `9b8d14b94cc9b70f7ca73f376bed6c4a532f434953ab0eafcc54496091adf223`;
- rejected by internal visual review because habitat fields became nearly invisible, forward-facing sensor lines implied directional perception, and phenotype separation remained too weak at world/narrow scale.

See `evidence/m4b/M4B_VISUAL_ITERATION_1_REJECTION_2026-09-10.md`.

The gates were not weakened after that rejection.

## Exact accepted M4b v2 candidate

Final qualification run:

`34477849280` — **completed / success**

Exact product qualification head:

`0b1e53a1e82a1bbf046d1fcc4eec4a2adf41ac52`

Exact standalone:

- SHA-256 `656ede3b409d9d2f3f4a5445b3e1a526c7c6c799be83d6245d42c1272799af6f`;
- size `33,989` bytes;
- core SHA-256 `18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`;
- M4 ecology SHA-256 `b4539d91f31c8aa7b2a966244ad8e7b5c851698a7000ba3c3799c70611340c0e`;
- M4b visuals SHA-256 `13428dc9673803129020d4945cf3b394a9cde3073236d8f24c52bbe1f3b479d8`;
- browser app SHA-256 `be60d8aedf81287ceace1f54ee10091973c36590ebf2617c4ccba7fc6c1b54cc`.

Browser artifact:

- id `10152330579`;
- digest `sha256:eae5c16c79dbc3742c51033a3f074fb3953621f9e54e889d4b8b53a4174611e3`.

Semantic artifact:

- id `10152289323`;
- digest `sha256:a51a3561f4485cfe396cabc9fe735560d35a8a3a58b11eb6f6d5c0d3e114685e`.

Chrome: `152.0.7977.64`.

## Protected causal boundary

Exact protected source hashes remained unchanged:

- maintained historical core: `18e7ed7...a497c56`;
- qualified M4a ecology layer: `b4539d91...1340c0e`.

M4b changes only browser presentation code/copy plus qualification apparatus.

### Draw-cadence neutrality

Three deterministic seeds were executed for 3,600 fixed ticks with M4b rendering at cadences:

- every tick;
- every 7 ticks;
- every 60 ticks;

and compared against an equivalent no-draw control.

For every seed/cadence pair:

- exact serialized full simulation state matched;
- exact RNG state matched;
- exact lifecycle-witness sequence matched.

Lifecycle event counts were also identical across cadence variants:

- seed `1`: `182` events;
- seed `0x12345678`: `174` events;
- seed `956866913`: `195` events.

A separate real-browser stress called the complete M4b `draw()` 250 times while paused and produced exact zero simulation/RNG delta.

## Visual mapping qualification

Synthetic trait-extreme tests establish monotonic mappings rather than aesthetic claims.

### Size

At fixed other traits, low→high genome size increases:

- visual radius;
- body length;
- body width.

### Speed

At fixed size, low→high speed produces:

- longer tail/flow cue;
- longer body;
- narrower body.

This deliberately amplifies a speed phenotype while preserving monotonicity.

### Sense

The original full physical sense-radius circles are no longer the default display.

Low→high sense increases a compact, four-direction segmented halo radius and segment span. The cue is visually omnidirectional and explicitly described in the UI as a compressed indicator rather than the literal sensing radius.

### Diet and inherited hue

Diet retains ownership of the main body color family:

- diet `-1` maps to cyan-family hue `190`;
- diet `0` maps near hue `115`;
- diet `+1` maps to amber-family hue `40`;
- interpolation is continuous and monotonic.

Inherited `hue` changes only the small secondary body accent; changing inherited hue at fixed diet leaves the primary diet hue unchanged.

## Habitat rendering

M4a resource placement samples x and y independently within each habitat's spread, giving square support.

Accepted M4b v2 therefore uses soft layered rounded-square fields derived only from the existing habitat center/spread/kind/regime. It does not introduce renderer randomness or new world state.

Dense habitat fields remain smaller and stronger; diffuse fields remain larger and weaker. The visualization is intentionally subordinate to organisms and food and does not imply walls/collision.

## Maintained browser mechanics

Real Chromium PASS:

- logical world remains `1200x900`;
- 66 founders / 275 initial food / 8 habitats exact;
- same-seed reset exact;
- new-seed changes seed and restores M4 initial condition;
- wide -> narrow authoritative state exact;
- DPR-only change authoritative state exact;
- letterbox/pillarbox click no-op;
- in-world pointer adds exactly 18 food;
- narrow -> wide authoritative state exact;
- no browser page errors.

## x40 delivery result

Predeclared M4b gate:

- eight 600 s evolved seeds: median >= `38x`, no seed below `35x`;
- three 1,800 s evolved seeds: median >= `38x`, no seed below `35x`.

### 600 s evolved worlds

- median: **`39.063x` PASS**;
- minimum: **`38.015x` PASS**.

### 1,800 s evolved worlds

- median: **`39.353x` PASS**;
- minimum: **`38.874x` PASS**.

40x -> 1x transition:

- approximately `0.983x` after transition;
- historical debt clearing maintained.

Hidden interval:

- exact zero simulation advance.

The richer renderer therefore stays comfortably inside the declared delivery gate on the tested evolved M4 worlds.

## Internal visual review

The exact accepted standalone was captured in real Chrome at seed `0x12345678` at:

- `0 s` wide;
- `600 s` wide;
- `1,800 s` wide;
- `600 s` materially narrow/mobile-like.

It was compared directly with the exact M4a screenshot at the same seed and 600 s and with the rejected M4b v1 specimen.

### PASS findings

1. **Sensor clutter materially decreased.** The M4a image was dominated by overlapping full-radius sense circles. M4b v2 removes that apparatus-like visual layer while retaining an ordinal sense cue.
2. **Habitats remain visible.** Unlike rejected v1, M4b v2 does not solve ugly debug rectangles by making the environment disappear. Dense and diffuse square-support fields are apparent but remain subordinate to living organisms.
3. **Phenotype differences are visible in actual evolved populations.** Close inspection shows materially different body sizes, elongations and tail lengths rather than only cyan/yellow color variation.
4. **Local populations read differently.** In the same 1,800 s world, some clusters are dominated by larger/rounder bodies while others contain visibly smaller/slender/long-tail organisms. This presentation is consistent with already-qualified M4a local phenotype differentiation; it is not a new biological claim.
5. **Inherited hue is useful but secondary.** Small accent colors distinguish individuals/descendants without destroying diet readability.
6. **Narrow presentation remains usable.** Habitat structure and local clusters survive the mobile-like scale, although fine phenotype detail is naturally reduced.
7. **The environment no longer reads primarily as debugging apparatus.** Soft support fields communicate ecological geography without strong borders or giant sensing rings.

## Remaining limitations

M4b reveals the current model; it does not make the model deeper than M4a.

Still absent or intentionally deferred:

- dynamic habitat depletion/regrowth state;
- organism-driven environmental modification;
- predation, social behavior or mating;
- explicit negative-frequency-dependent fitness rules;
- retained ancestry/history UI;
- species/class labels;
- richer terrain physics;
- exact literal rendering of physical sense radius at all times.

The habitat mosaic is currently stable/static. The accepted visual field represents where resource patches are generated, not a dynamic stored resource-density layer.

## Decision

**M4b v2 passes machine qualification and internal visual review.**

This closes M4b as a qualified presentation layer, not as promoted live authority and not as Owner product approval.

Before asking the Owner for the next broad test, perform a post-M4 boundary review of the combined response to the original boredom/shallowness complaint. That review should decide whether one composite M3+x40+M4a+M4b Owner artifact is now the highest-value next step or whether a further bounded living-world milestone should precede it.
