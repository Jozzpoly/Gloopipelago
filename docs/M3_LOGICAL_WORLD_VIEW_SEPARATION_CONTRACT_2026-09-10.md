# Gloopipelago — M3 Logical World / View Separation Contract

**Date:** 2026-09-10  
**Status:** **RED-TEAMED / GEOMETRY AUTHORITY SELECTED / READY FOR AUTHORITY PROMOTION / IMPLEMENTATION NOT YET AUTHORIZED**

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

The dedicated M3 feasibility campaign later expanded this to 21 seeds x 3 geometries and confirmed that the effect is broad rather than a single-seed artifact. See `evidence/m3/M3_GEOMETRY_FEASIBILITY_REPORT.md`.

This evidence does not rank one geometry as biologically “best”. It proves that selecting canonical geometry defines the experiment and therefore requires explicit authority.

## 4. Authority model after M3

### Logical world

The first M3 browser epoch uses the explicit canonical logical geometry:

- `width = 900`;
- `height = 700`.

These values are selected by `docs/M3_GEOMETRY_AUTHORITY_RECEIPT_2026-09-10.md` and remain unchanged by browser viewport resize.

Browser Reset / New Seed reuse 900x700. A future explicit world-geometry control may intentionally select another logical geometry, but that would be a model/apparatus intervention rather than a presentation resize.

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

Browser viewport resize and explicit logical-world resize become distinct operations.

## 5. Canonical logical geometry: 900x700

The bounded geometry-feasibility campaign is complete and the Geometry Authority Receipt selects 900x700.

Selection evidence:

- exact-source GitHub Actions run `34421980063`: **completed / success**;
- exact promoted M2a core SHA-256 `18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`;
- 4/4 existing M0 exact full-state + RNG reference validations PASS before novel measurements;
- 21 unique seeds, including nine Owner-evidence seeds;
- 390x600 / 900x700 / 1400x800;
- 12,000 ticks per run;
- 63/63 lifecycle accounting checks PASS;
- no extinction in the bounded horizon;
- materially different population/resource/RNG histories across geometries.

900x700 is selected by **provenance and qualification depth**, not by optimizing observed ecological outcomes:

- it is the `Simulation` default;
- it is the browser controller's bootstrap W/H reference before viewport replacement;
- six of eight M0 profiles start at 900x700, including both nominal profiles, explicit intervention and both low-productivity profiles;
- it sits between the compact and wide historical anchors and avoids inventing a fourth rectangle;
- no candidate demonstrated a universal biological advantage that would justify overriding the existing nominal authority.

The M1.2 Owner receipt does not preserve exact CSS canvas dimensions, so capture resolution is not reverse-engineered into logical-world authority.

M3 does not normalize ecology across arbitrary world sizes by scaling food, founder count, speed, sense or other biology. That would be a separate model change.

## 6. Geometry-feasibility evidence

Reproducible tool: `tools/m3-geometry.mjs`.

Authoritative report: `evidence/m3/M3_GEOMETRY_FEASIBILITY_REPORT.md`.

Exact-source execution receipt:

- run `34421980063` — completed / success;
- head `5698bc866cc63ba28e1d79178ea7585280ddc960`;
- artifact id `10131234964`;
- artifact archive digest `sha256:6d268714be5a70c6c2e3579851a4509de071f8fd64b87a264d6de890b0b49a62`;
- extracted JSON SHA-256 `7b59981c4190789b2ff77a0e3b664e276bd3e461d99fcbe422e1098ae6dbb2b5`.

The campaign's purpose was sensitivity/authority selection, not ecology tuning. Its result is sufficient to close geometry selection for the first M3 epoch.

## 7. View transform

M3 presentation uses **uniform aspect-preserving contain**.

Rationale:

- stretching distorts circles, sense radii, body shapes and spatial relations;
- cropping hides authoritative world regions and makes the visible world viewport-dependent;
- contain preserves the full logical world and its geometric proportions.

Define:

- `scale = min(viewWidth / 900, viewHeight / 700)`;
- displayed world size = `900*scale` by `700*scale`;
- centered offsets fill the remaining view area.

Letterbox/pillarbox regions are presentation-only and do not create world space.

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

Any proposed core change must justify itself independently and re-open the protected core gate. Convenience refactoring is not sufficient.

M2a lifecycle witness semantics remain unchanged.

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

If the core is untouched, these remain strict regressions rather than being rebaselined.

### B. Browser viewport invariance — non-negotiable

Construct paired browser/controller harness runs with:

- same seed;
- same canonical 900x700 logical geometry;
- same logical interventions;
- different initial viewport dimensions;
- materially different resize histories.

At deterministic checkpoints require exact equality of:

- full authoritative causal state;
- RNG state and call count;
- snapshot values;
- M2a lifecycle observation sequence when a test harness attaches a witness.

Minimum view histories:

1. stable wide view;
2. stable compact/tall view;
3. wide -> compact -> wide resize sequence;
4. compact -> wide -> compact resize sequence;
5. DPR-only backing-buffer change where the harness can model it without changing CSS logical view size.

A view resize must produce zero authoritative-state delta at the resize boundary.

### C. Initial viewport independence

Two worlds with the same seed and 900x700 logical geometry but different initial canvas sizes must begin with exact identical authoritative state and RNG state.

This distinguishes full M3 from a partial freeze-on-start implementation.

### D. Pointer mapping

For multiple view sizes/aspect ratios, pointer events targeting the same logical coordinate must create exact identical `addFood` interventions and subsequent causal histories.

Test at least:

- logical center;
- near each logical edge;
- one interior off-center point;
- pointer in letterbox/pillarbox space -> zero intervention.

### E. Rendering geometry

Non-causal rendering tests verify that known logical points map to expected canvas coordinates and that circles/radii remain isotropic under the uniform transform.

Prefer a small deterministic transform helper contract over brittle screenshot-pixel equality when it provides stronger evidence.

### F. Product regression

Build determinism and Node DOM/canvas contract smoke must pass.

A real-browser Owner smoke is required before M3 promotion because M3 intentionally changes browser resize/view behavior and may introduce letterboxing/pillarboxing even when biology is correct.

Owner smoke must include at least:

- desktop wide;
- narrow/mobile-like viewport;
- live resize during an existing world;
- Reset / New Seed after resize;
- pointer food before and after resize;
- pause/speed/catastrophe controls;
- visual confirmation that the whole logical world remains legible.

If presentation is materially poor, causal PASS alone does not authorize promotion. Revisit the explicit M3 view/geometry decision rather than silently restoring viewport coupling.

### G. Intentional-divergence receipt

The final M3 qualification must state clearly:

- historical browser V1/M2a was viewport-coupled;
- M3 browser product is not expected to reproduce historical browser causal trajectories when historical viewport geometry differs from 900x700;
- headless historical profiles remain preserved and exact because explicit geometry remains part of model apparatus;
- within M3, viewport size alone no longer has causal authority.

Do not call M3 “V1-exact” without this scope qualifier.

## 13. Implementation staging

A test-only freeze-on-start experiment may still be used to isolate view-transform mechanics, but it is not a milestone and is not promotable as M3.

The implementation target from the start remains full separation:

- browser constructs the world at canonical 900x700;
- view resize never mutates world geometry;
- render uses an explicit contain transform;
- pointer interventions map through its inverse.

Do not let a successful partial probe silently redefine the milestone.

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

This removes resize-time authority but leaves initial viewport authority. Incomplete as M3.

### Rejected: choose 900x700 merely because it is the default

The default alone was insufficient. The dedicated exact-source 21-seed x 3-geometry campaign first demonstrated sensitivity and ruled out treating any candidate as neutral. 900x700 is selected only after that campaign, using provenance/qualification depth as the tie-breaker rather than observed biological attractiveness.

### Rejected: infer canonical world geometry from Owner recording resolution

The Owner smoke receipt does not preserve exact CSS canvas dimensions. Recording resolution is not an authority receipt for logical geometry.

### Rejected: preserve viewport fill by stretching logical coordinates

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

All predeclared contract prerequisites are now satisfied:

1. bounded geometry-feasibility probe — **PASS**;
2. Geometry Authority Receipt — **900x700 selected**;
3. transform/pointer/qualification red-team — **complete at contract level**;
4. scope check — **no runtime/biology feature implementation in this contract slice**.

This contract is therefore **ready for authority promotion**.

Merging the contract authorizes only a fresh bounded **M3 implementation branch** from the resulting live `main`.

The implementation must then satisfy the full qualification matrix above before M3 can be promoted. M3 implementation promotion later authorizes another integration/boundary review only.

This contract does not authorize M2b, RNG stream splitting, scheduler revision, x10/x20 fast-forward, seed UX, new heredity/ecology or broader simulation architecture.
