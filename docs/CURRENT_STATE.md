# Gloopipelago — Current State

**Date:** 2026-09-10  
**State:** **M0 PROMOTED / M1 PROMOTED / B0 PROMOTED / M2a PROMOTED / M3 CONTRACT PROMOTED / M3 IMPLEMENTATION MACHINE PASS / REAL-BROWSER OWNER SMOKE REQUIRED / M3 NOT YET PROMOTED / M2b DEFERRED.**

## Project identity

Gloopipelago is a **living evolution observatory**: the living world is primary; causal apparatus is enabling infrastructure.

## Canonical repository

`Jozzpoly/Gloopipelago`

`main` is implementation authority. Every bounded implementation slice branches from live `main` after the previous authority boundary is reconciled.

## Frozen historical authority

`archive/v1/gloopipelago_single.html`  
SHA-256 `ededf979b857f795a93f8d019ab3fc6364df0156885f381050641ab30ffff1d8`

The frozen artifact is immutable provenance.

## M0 / M1 / B0

**PROMOTED.**

M0 established executable historical truth. M1 established the maintained causal core, explicit V1-compatible RNG state, deterministic standalone delivery and positive Owner real-browser evidence. B0 moved the live browser surface into maintained source without changing the already-qualified M1.2 product.

Historical M1.2 Owner-tested standalone:

- SHA-256 `9750e602ae61d712c64b046f130dac4c743e718d45c638ff423d5484aed9a5b0`;
- 18,271 bytes.

## M2a — Passive Lifecycle Witness

**PASS / PROMOTED.**

Detached downstream-only founder/birth/death witness records remain qualified without changing RNG, scheduler, world or biological semantics. `Simulation` retains no lifecycle history.

Promoted maintained-core SHA-256:

`18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`

M2b retained history remains deferred.

## Post-M2a / M3 contract

**PROMOTED.**

The post-M2a review identified browser viewport authority as a real causal/reproducibility confound. The subsequent geometry campaign demonstrated that world dimensions are ecological semantics rather than neutral rendering coordinates.

The promoted M3 contract selects:

- canonical browser logical world: **900x700**;
- browser viewport/CSS/DPR: presentation-only state;
- uniform aspect-preserving contain;
- letterbox/pillarbox: no world authority;
- inverse pointer mapping into logical coordinates;
- explicit `Simulation.setSize()` retained as intentional world-semantic apparatus.

See:

- `docs/POST_M2A_BOUNDARY_REVIEW_2026-09-10.md`;
- `docs/M3_LOGICAL_WORLD_VIEW_SEPARATION_CONTRACT_2026-09-10.md`;
- `docs/M3_GEOMETRY_AUTHORITY_RECEIPT_2026-09-10.md`;
- `evidence/m3/M3_GEOMETRY_FEASIBILITY_REPORT.md`.

## M3 implementation

**MACHINE PASS / OWNER BROWSER GATE OPEN / NOT PROMOTED.**

Branch:

`m3-logical-world-view-implementation`

PR:

`#11`

Exact runtime candidate was machine-qualified at:

`31b86e80fc8a1602f351da9d6427db34cd6414d2`

Runtime behavior:

- browser worlds are always constructed at logical 900x700;
- browser resize changes canvas/DPR/view transform only and never calls `sim.setSize()`;
- the complete logical world is rendered through centered uniform contain;
- pointer coordinates map back through the inverse transform;
- letterbox/pillarbox clicks do nothing;
- pointer coordinates are canonicalized to `1e-9` logical-world units to remove viewport-dependent Float64 round-trip drift;
- exact-edge inverse-mapping noise is tolerated only within half that quantum before clamping;
- maintained core remains byte-identical to promoted M2a.

### Exact machine candidate

Standalone:

- SHA-256 `d768b046f205b0c1f5067558829f4ddca7cde102fb1ce3df072c8d199c278394`;
- 22,718 bytes.

Final performance-inclusive Actions receipt:

- run `34423384532`: **completed / success**;
- head `31b86e80fc8a1602f351da9d6427db34cd6414d2`;
- artifact id `10131785214`;
- artifact digest `sha256:cc6a5001d1719165201bfa22fbff0134a054c67785f76fbb56cd069129cc3c98`;
- `m3-qualification.json` SHA-256 `c2fd08abbf216709fa45f481d61ab227c07329c62abf20bdb42bf0db374e0fc5`;
- `m3-performance.json` SHA-256 `768de22d63b110c0f2b9cadbb5a47ff06179f1fd7d419f75b496921004bbbcf1`.

Machine gates PASS:

- 25/25 transform round-trips across five view shapes;
- explicit letterbox/pillarbox outside-space semantics;
- 20 viewport-history runs across four seeds and five resize histories with exact full causal state, RNG state/call count and lifecycle fingerprint equivalence;
- view-resize causal delta = zero at qualified boundaries;
- Node DOM/canvas/controller smoke for compact/wide/DPR/pointer/reset/new-seed behavior;
- M0 Oracle regression;
- M1.1 maintained-core regression and RNG accounting;
- M2a OFF/collector/throwing/mutating/adversarial/semantic witness gates;
- deterministic standalone build;
- render-controller performance sentinel.

Performance sentinel:

- exact PR-base baseline standalone SHA-256 `4c60670e4b6c0a4824de170eb3d8a52db3d96bdb49210f398148ac89dc9b611d`;
- predeclared investigate ratio `1.25`;
- paired median candidate/baseline frame-time ratio `1.0001810668670243` (~+0.0181%);
- status **PASS**.

The machine campaign also correctly rejected the pre-fix candidate at run `34423148264` because exact compact mapping of logical `(900,700)` could be rejected by Float64 edge drift. The edge-tolerance repair was then fully requalified.

See `evidence/m3/M3_IMPLEMENTATION_MACHINE_QUALIFICATION_REPORT.md`.

## Current blocking gate

**Real-browser Owner smoke of the exact candidate is required before M3 promotion.**

Protocol: `evidence/m3/M3_OWNER_SMOKE_PROTOCOL.md`.

Primary unresolved product risk is presentation rather than demonstrated causality: full-world contain may create substantial pillarbox/letterbox space on strongly mismatched desktop/mobile aspect ratios. Stretching/cropping must not be introduced silently to hide that risk.

Owner smoke must check wide/narrow/resized presentation, pointer behavior inside/outside the logical world, Reset/New Seed, ordinary controls and the existing 4x workflow.

## Next bounded action

**Owner tests exact candidate `d768b046...8394` in a normal browser.**

If the real-browser gate is positive, record an Owner receipt, verify subsequent changes are evidence-only relative to the exact runtime candidate, then prepare final M3 promotion/merge.

If presentation or interaction is materially poor, reopen only the relevant M3 view/product boundary. Do not restore viewport causal authority by convenience.

## Later evidence-backed needs

Still outside M3:

- full/copyable seed and later recent/bookmark workflow;
- precise living-vs-historical generation labels;
- functional-vs-UI diet classification;
- optional sense-ring visibility;
- true x10/x20+ fast-forward/stress mode with achieved-speed reporting;
- retained lineage/history only if a concrete workflow demonstrates the need.

## Negative decisions

Do not edit frozen V1. Do not clean up Accidental Biology by inertia. Do not reintroduce viewport-driven world sizing. Do not infer logical geometry from recording resolution. Do not normalize biology to area inside M3. Do not delete explicit `Simulation.setSize()` merely because browser resize lost authority. Do not bundle M2b, fast-forward, seed UX, classifier wording, scheduler cleanup, RNG splitting or new biology into M3.
