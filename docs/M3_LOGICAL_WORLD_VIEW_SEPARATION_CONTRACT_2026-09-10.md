# Gloopipelago — M3 Logical World / View Separation Contract

**Date:** 2026-09-10  
**Status:** **DRAFT / RED-TEAMED CONTRACT / GEOMETRY AUTHORITY NOT YET SELECTED / IMPLEMENTATION NOT AUTHORIZED**

## 1. Purpose

M3 removes browser viewport geometry as hidden causal authority over the simulated world.

The target is not a cosmetic resize refactor. The target is an explicit separation between:

- **logical world geometry** — model/apparatus state that may affect causal history; and
- **view geometry** — canvas/CSS/DPR state that determines only how the world is presented and how pointer coordinates are mapped.

After M3, changing browser viewport size alone must not change the authoritative history of a running world.

M3 begins the first intentionally non-V1-exact browser world-geometry epoch. Historical V1 viewport-coupled behavior remains preserved as qualified provenance, not silently rewritten as though it never existed.

## 2. Current authority problem

The maintained browser currently derives `W/H` from `canvas.getBoundingClientRect()` and then:

- constructs `Simulation({ width: W, height: H, ... })`; and
- calls `sim.setSize(W, H)` on every browser resize.

Viewport therefore has causal authority twice:

1. **initial viewport authority** — initial CSS canvas geometry chooses the logical world dimensions;
2. **resize-time authority** — later browser resize mutates the logical world dimensions during the run.

Core `width/height` affect founder/spawn coordinates, food-patch centers and spread, movement boundaries, reproduction-position clamping and other future causal decisions.

M3 must remove both browser authorities. Removing only the resize-time call is an incomplete result.

## 3. Geometry is ecological semantics

World dimensions are not neutral coordinates in current V1 biology/apparatus.

Founder count, initial food count and configured food production are not automatically scaled by world area. Sense radius, speed, body size and most other distances are absolute. Changing logical area/aspect ratio therefore changes density, encounter rates, travel distances and boundary interactions.

Existing M0 evidence already demonstrates material sensitivity. For the same seed `0x12345678`, same browser model config and 200 simulated seconds:

- `390x600` (`P-COMPACT`): 178 births, 124 deaths, population 88, food 16;
- `900x700` (`P-NOMINAL-S12345678`): 197 births, 130 deaths, population 101, food 15.

This is not a controlled claim that either geometry is biologically better. It is sufficient evidence that selecting a canonical geometry changes the experiment and must be explicit.

## 4. Authority model after M3

The intended authority split is:

### Logical world

An explicit logical width/height pair is chosen before `Simulation` construction and remains unchanged by browser viewport resize.

Browser Reset / New Seed reuse the currently selected logical geometry unless a future explicit world-geometry control intentionally changes it.

### View

CSS canvas size and device-pixel ratio are presentation state only.

View resize may update:

- canvas backing-buffer dimensions;
- DPR;
- scale;
- presentation offset / letterbox region;
- other rendering-only transform state.

It must not call `Simulation.setSize()` or mutate any other authoritative simulation state.

### Explicit world resize

`Simulation.setSize(width,height)` is not deleted merely because browser resize stops owning it.

It remains a legitimate explicit world-semantic intervention for headless tests and future experiments unless a later model decision removes/replaces it. Historical `P-RESIZE` remains preserved as a V1 provenance specimen.

Browser viewport resize and explicit logical-world resize must become distinct operations.

## 5. Canonical logical geometry is intentionally unresolved in this draft

No exact browser logical size is authorized yet.

`900x700` is the leading provenance-backed candidate because it is the core default and is used by the nominal/intervention/low-productivity M0 specimens. That is a reason to test it, not sufficient authority to promote it.

`390x600` and `1400x800` are already qualified historical viewport geometries and provide useful sensitivity anchors.

The final contract must include a **Geometry Authority Receipt** before implementation is authorized. That receipt must record:

- candidate dimensions considered;
- why the selected geometry is canonical for the maintained browser product;
- sensitivity evidence across multiple fixed seeds;
- which differences are expected consequences of geometry rather than regressions;
- any rejected alternative and why.

M3 does not attempt to normalize ecology across arbitrary world sizes by scaling food, founder count, speed, sense or other biology. That would be a separate model change.

## 6. Bounded geometry-feasibility probe required before promotion

Before this contract can become implementation authority, run a deterministic headless geometry probe using the current M2a-promoted core.

Minimum candidate geometries:

- 390x600;
- 900x700;
- 1400x800.

Minimum seed set must contain the existing representative seeds:

- `1`;
- `0x12345678`;
- `0x9E3779B9`.

Prefer a larger deterministic seed set if cheap, but do not turn geometry selection into an open-ended ecology study.

For each seed/geometry, run the browser model config with fixed `1/60` stepping through at least 12,000 ticks (200 simulated seconds) and record:

- exact final causal fingerprint;
- RNG call count/state;
- births;
- deaths;
- population;
- food;
- maximum living generation;
- lifecycle witness counts;
- extinction count;
- optional coarse trait summaries already available from `snapshot()`.

Purpose of the probe:

- demonstrate sensitivity magnitude and pathologies;
- establish that the chosen canonical geometry is deliberate;
- avoid pretending different geometries should converge biologically;
- provide an evidence-backed selection, not optimize a biological objective after observing whichever outcome looks nicest.

No new biology or density normalization may be introduced in this probe.

## 7. View transform

The default M3 presentation rule should be **uniform aspect-preserving contain** unless product evidence falsifies it.

Rationale:

- stretching distorts circles, sense radii, body shapes and spatial relations;
- cropping hides authoritative world regions and makes the visible world viewport-dependent;
- contain preserves the full logical world and its geometric proportions.

Define:

- `scale = min(viewWidth / worldWidth, viewHeight / worldHeight)`;
- displayed world size = `worldWidth*scale` by `worldHeight*scale`;
- centered offsets fill the remaining view area.

Letterbox/pillarbox regions are presentation-only and must not create world space.

DPR affects the backing buffer and rendering sharpness only; it must not enter logical coordinate calculations.

A later presentation-only zoom/pan system may be considered separately if full-world contain becomes ergonomically poor, but it is not part of M3.

## 8. Rendering contract

All world-space drawing must be transformed consistently from logical coordinates into view coordinates.

At minimum:

- food positions;
- blob positions;
- blob radii;
- sense radii;
- velocity-tail lengths;
- niche background centers/radii.

Rendering may implement the transform through canvas context transforms or explicit coordinate conversion. The qualification target is semantic, not stylistic.

No authoritative `Simulation` coordinate is rewritten for rendering convenience.

## 9. Pointer intervention mapping

Pointer food is an intervention and must be mapped explicitly from view space to logical world space.

For a pointer at canvas-local view coordinate `(vx,vy)`:

- subtract the presentation offsets;
- divide by uniform scale;
- obtain logical `(wx,wy)`;
- if the pointer is outside the displayed logical-world rectangle / in letterbox space, perform **no world intervention**.

Do not clamp letterbox clicks to the nearest world edge. That would turn presentation-only space into a hidden causal action.

The resulting logical coordinate is then passed to the existing `sim.addFood(... around:{x,y})` intervention path.

## 10. Core scope

Default implementation presumption: **no production change to `src/core/v1-mirror.mjs` is required for M3**.

The core already accepts explicit world dimensions and already exposes explicit `setSize()` world semantics. The coupling lives primarily in browser ownership.

Any proposed core change must therefore justify itself independently and re-open the protected core gate. Convenience refactoring is not sufficient.

M2a lifecycle witness semantics must remain unchanged.

## 11. Protected semantics

Unless separately and explicitly authorized, M3 must not change:

- Mulberry32 implementation or random sequence;
- RNG call topology for equivalent logical-world runs;
- scheduler/live-array iteration semantics;
- reproduction-before-death behavior;
- food-consumption ordering;
- catastrophe semantics;
- auto-reseed semantics;
- mutation equations;
- digestion equations;
- food rates/lifetimes;
- founder count;
- lifecycle witness vocabulary/passivity;
- Float64 accumulated time behavior;
- population cap;
- other Accidental Biology recorded by M0.

M3 changes browser world/view authority only.

## 12. Qualification matrix

### A. Historical core regression

Because explicit `Simulation(width,height)` and explicit `setSize()` remain model semantics, the protected M2a/M1.1/M0 headless campaigns must remain exact on their historical profiles, including `P-COMPACT`, `P-WIDE` and `P-RESIZE`.

If the core is untouched, these should remain strict regressions rather than being rebaselined.

### B. Browser viewport invariance — non-negotiable

Construct paired browser/controller harness runs with:

- same seed;
- same canonical logical geometry;
- same logical interventions;
- different initial viewport dimensions;
- materially different resize histories.

At deterministic checkpoints require exact equality of:

- full authoritative causal state;
- RNG state and call count;
- snapshot values;
- M2a lifecycle observation sequence when a test harness attaches a witness.

Minimum view histories should include:

1. stable wide view;
2. stable compact/tall view;
3. wide -> compact -> wide resize sequence;
4. compact -> wide -> compact resize sequence;
5. DPR-only backing-buffer change where the harness can model it without changing CSS logical view size.

A view resize must produce zero authoritative-state delta at the resize boundary.

### C. Initial viewport independence

Two worlds with the same seed and canonical logical geometry but different initial canvas sizes must begin with exact identical authoritative state and RNG state.

This distinguishes full M3 from a partial freeze-on-start implementation.

### D. Pointer mapping

For multiple view sizes/aspect ratios, pointer events targeting the same logical coordinate must create exact identical `addFood` interventions and subsequent causal histories.

Test at least:

- logical center;
- near each logical edge;
- one interior off-center point;
- pointer in letterbox/pillarbox space -> zero intervention.

### E. Rendering geometry

Non-causal rendering tests should verify that known logical points map to expected canvas coordinates and that circles/radii remain isotropic under the uniform transform.

This may use a small deterministic transform helper rather than screenshot pixel tests if that gives a stronger, simpler contract.

### F. Product regression

Build determinism and Node DOM/canvas contract smoke must pass.

A real-browser Owner smoke is required before M3 promotion because M3 intentionally changes browser resize/view behavior and may introduce letterboxing/pillarboxing even when biology is correct.

Owner smoke should include at least:

- desktop wide;
- narrow/mobile-like viewport;
- live resize during an existing world;
- Reset / New Seed after resize;
- pointer food before and after resize;
- pause/speed/catastrophe controls;
- visual confirmation that the whole logical world remains legible.

### G. Intentional-divergence receipt

The final M3 qualification must state clearly:

- historical browser V1/M2a was viewport-coupled;
- M3 browser product is not expected to reproduce historical browser causal trajectories when historical viewport geometry differs from the new canonical logical geometry;
- headless historical profiles remain preserved and exact because explicit geometry remains part of model apparatus;
- within M3, viewport size alone no longer has causal authority.

Do not call M3 “V1-exact” without this scope qualifier.

## 13. Feasibility staging

A disposable or test-only **freeze-on-start** probe may be used during contract work:

- capture initial viewport dimensions once as logical geometry;
- stop propagating later resize into `sim.setSize()`;
- add a view transform around that frozen logical rectangle.

This can validate rendering/pointer mechanics while preserving each run's initial historical geometry.

However it is **not promotable as the full M3 result**, because initial viewport authority remains. Do not let a successful partial probe silently redefine the milestone.

## 14. M2a role in M3

M2a is evidence apparatus, not a dependency that gains new authority.

Use caller-owned lifecycle collection in qualification to prove viewport-invariant founder/birth/death sequences for paired M3 runs.

Do not add retention/history to `Simulation`, a lineage UI, session IDs, stable event serialization or event sourcing merely because M3 now consumes lifecycle evidence.

## 15. Performance guardrail

M3 view transforms should be cheap, but performance must still be characterized because drawing is continuous and Owner already uses 4x heavily.

Required product sentinel:

- compare frame/render overhead before vs after M3 under representative population and sense-ring load;
- report achieved simulation speed separately from render frame rate;
- any material regression that prevents the already demonstrated 4.00x Owner workflow blocks promotion or requires investigation.

Do not use M3 to implement x10/x20+ fast-forward. That remains a separate feature lane.

## 16. Red-team findings / rejected shortcuts

### Rejected: just remove `sim.setSize()` from `resize()`

This removes resize-time authority but leaves initial viewport authority. Useful as a probe, incomplete as M3.

### Rejected: use `Simulation` default 900x700 because it already exists

The default is provenance for a candidate, not proof of correct browser ecology. Existing goldens already show geometry-dependent outcomes.

### Rejected: preserve viewport aspect by stretching logical coordinates

Non-uniform scaling distorts spatial interpretation and visualizes circles/radii as ellipses.

### Rejected: crop to fill

Cropping makes parts of the authoritative world invisible depending on viewport shape and weakens observability.

### Rejected: scale biology with viewport/world area inside M3

Scaling founder count, food rate, sense, speed or other biological parameters would mix world/view decoupling with a new ecology model.

### Rejected: delete `Simulation.setSize()`

Browser resize ownership is the defect. Explicit world-resize interventions remain legitimate historical/model apparatus and existing evidence depends on them.

### Rejected: wire lifecycle history into the product before M3

The passive witness already gives enough evidence for this boundary. M2b remains unsupported.

### Rejected: bundle seed UI / labels / sense-ring toggle / fast-forward

These are real Owner needs but would expand the blast radius of the first intentional world/view semantic epoch and obscure qualification.

## 17. Promotion boundary

This draft does **not** authorize M3 implementation yet.

Contract promotion requires:

1. completion of the bounded geometry-feasibility probe;
2. a Geometry Authority Receipt selecting the canonical logical geometry with explicit rationale;
3. final red-team of the qualification matrix and transform/pointer rules;
4. exact confirmation that no unrelated feature/biology work entered the contract.

Only after those conditions are committed and the contract is promoted may a fresh M3 implementation branch begin.

M3 implementation promotion later authorizes another integration/boundary review only. It does not automatically authorize M2b, RNG stream splitting, scheduler revision, fast-forward, new heredity/ecology or broader simulation architecture.
