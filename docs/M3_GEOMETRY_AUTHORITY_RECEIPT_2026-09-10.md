# Gloopipelago — M3 Geometry Authority Receipt

**Date:** 2026-09-10  
**Decision:** **Canonical M3 browser logical world = 900x700.**

## Authority

This receipt resolves the geometry question left open by the post-M2a boundary review and the first M3 contract draft.

The decision is based on:

1. the promoted M0/M1/M2a authority chain;
2. exact-source geometry sensitivity evidence in `evidence/m3/M3_GEOMETRY_FEASIBILITY_REPORT.md`;
3. a 21-seed x 3-geometry x 12,000-tick deterministic probe;
4. four exact M0 full-causal-state + RNG validation cases before novel measurements;
5. the requirement not to optimize canonical geometry after observing whichever ecology looks most attractive.

## Selected geometry

`width = 900`  
`height = 700`

This pair becomes the explicit logical-world geometry for the first M3 maintained browser epoch.

Browser viewport dimensions, CSS canvas dimensions and DPR are presentation state and must no longer select or mutate these values implicitly.

## Why 900x700

The geometry probe demonstrates that 390x600, 900x700 and 1400x800 produce materially different histories under the same biology. None can therefore be called a neutral rendering coordinate system.

No candidate suffered extinction in the bounded 200-second / 21-seed campaign, and none emerged as a biologically universal winner. That makes **existing authority/provenance** the appropriate tie-breaker.

900x700 has the deepest nominal project authority:

- it is the current `Simulation` default;
- it appears as the browser controller's bootstrap W/H reference before live viewport replacement;
- six of eight M0 historical profiles begin at 900x700;
- both nominal M0 profiles use it;
- explicit-intervention and low-productivity qualification use it;
- it lies between the compact and wide historical anchors rather than introducing a new fourth geometry.

Selecting 900x700 therefore minimizes conceptual novelty: M3 makes the browser use the already best-qualified nominal logical apparatus instead of allowing whichever display happens to be attached to define the experiment.

## What this decision does not claim

It does **not** claim:

- 900x700 is optimal ecology;
- 900x700 is the exact geometry seen in the M1.2 Owner browser recording;
- all seeds are more stable at 900x700;
- compact or wide worlds are invalid;
- future world-size experiments should be prohibited;
- biology should be normalized to world area.

The M1.2 Owner receipt did not preserve exact CSS canvas dimensions. Capture/video resolution is therefore not promoted as a proxy for historical logical world geometry.

The exact-source probe also found seed-specific low-population/high-food states at 900x700. Those results are retained rather than hidden. They are part of the evidence that geometry changes ecology and that this is an authority decision, not a quality-ranking exercise.

## Historical compatibility boundary

Historical V1/M2a browser worlds remain viewport-coupled provenance. A historical run whose canvas dimensions were not 900x700 is **not expected** to reproduce the same trajectory when replayed in the M3 browser default world.

Headless `Simulation({width,height})` semantics remain explicit. `Simulation.setSize()` remains a legitimate intentional world-size intervention. Existing `P-COMPACT`, `P-WIDE` and `P-RESIZE` evidence must remain exact unless a later explicit model revision says otherwise.

## Product consequence

A 900x700 logical rectangle shown inside arbitrary browser viewports requires an explicit view transform. The current M3 contract selects uniform aspect-preserving contain as the default rule, with letterbox/pillarbox space carrying no world authority.

This may change presentation feel relative to the viewport-filling V1 browser. That is intentional and requires real-browser Owner smoke before M3 implementation can be promoted.

If Owner smoke reveals a blocking presentation problem, the implementation does not get promoted merely because causal qualification passes. The authority decision must then be revisited explicitly rather than silently restoring viewport coupling.

## Evidence receipt

Exact-source GitHub Actions geometry run:

- run `34421980063`: completed / success;
- head `5698bc866cc63ba28e1d79178ea7585280ddc960`;
- artifact id `10131234964`;
- artifact archive digest `sha256:6d268714be5a70c6c2e3579851a4509de071f8fd64b87a264d6de890b0b49a62`;
- extracted JSON SHA-256 `7b59981c4190789b2ff77a0e3b664e276bd3e461d99fcbe422e1098ae6dbb2b5`;
- exact M2a core SHA-256 `18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`.

Reproduction tool: `tools/m3-geometry.mjs`.

## Scope boundary

This receipt resolves logical geometry only. It does **not** authorize runtime implementation by itself.

M3 implementation may begin only after the complete M3 Logical World / View Separation contract is finalized, red-teamed and promoted as project authority.
