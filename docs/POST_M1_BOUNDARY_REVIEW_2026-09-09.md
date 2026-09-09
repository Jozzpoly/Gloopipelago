# Gloopipelago — Post-M1 Integration / Boundary Review

**Date:** 2026-09-09  
**Verdict:** **M1 COMPLETE. B0 BROWSER SURFACE OWNERSHIP AUTHORIZED. M2 IMPLEMENTATION NOT YET AUTHORIZED.**

## Why this review exists

M1 is the first complete end-to-end implementation cycle after the 4D review:

`frozen historical truth → maintained causal core → explicit RNG state → generated standalone browser product → Owner real-browser evidence`.

The purpose of this boundary is not to continue the old roadmap automatically. It is to ask what the completed M1 actually exposed, which dependency should be resolved next, and which newly demonstrated Owner needs belong on the Integration Spine versus a later/shadow lane.

## What M1 demonstrated

M1 established all of the following without changing protected V1 causal trajectories:

- a maintained DOM-free simulation core can reproduce the frozen Oracle exactly;
- historical scheduler / Accidental Biology semantics are explicitly known rather than accidental hidden assumptions;
- Mulberry32 state can be made explicit and resumable without changing sequence or draw topology;
- standalone one-file browser delivery can be generated reproducibly rather than hand-maintained;
- the generated artifact runs in the Owner desktop browser and remains recognizably V1;
- requested 4× is actually sustained at 4.00× over a measured 90 s real interval;
- rapid seed scouting and long-horizon observation are real Owner workflows, not speculative UX ideas.

M1 did **not** establish logical-world independence from viewport, causal lineage/history, split RNG streams, intentional scheduler semantics, stable save/replay schema, high-speed stress mode, or new evolutionary substrate.

## Newly exposed boundary problem: the browser surface has no live owner yet

`tools/m12.mjs` currently uses `archive/v1/gloopipelago_single.html` as both:

1. immutable historical/browser truth for M1.2 qualification; and
2. the active source of the browser shell, renderer and controller used for new builds.

That dual role was correct for M1.2 fidelity but is not an acceptable long-term ownership boundary.

The frozen archive must remain immutable provenance. It should not become the place future product work implicitly depends on or the template that future UI changes patch around.

This matters immediately because Owner smoke already exposed legitimate browser-surface needs: full/copyable seed provenance, clearer metric labels, optional sense-ring visibility and later stress/fast-forward controls. M3 logical-world/view decoupling will also necessarily modify browser/controller resize authority.

## Disposable feasibility probe

A non-repository probe split the frozen browser surface into three conceptual maintained pieces:

- browser/HTML prefix before the historical simulation core;
- browser controller/render code beginning at `const canvas = document.getElementById('world');`;
- closing script/HTML tail.

Reassembling:

`maintained browser prefix + current maintained core + maintained controller + maintained tail`

reproduced the exact Owner-tested M1.2 artifact byte-for-byte:

SHA-256 `9750e602ae61d712c64b046f130dac4c743e718d45c638ff423d5484aed9a5b0`.

Therefore browser-surface ownership can be established now without a product or causal change. This is a high-leverage, low-risk, time-sensitive migration.

## Candidate comparison

### B0 — Browser Surface Ownership Mirror

**Decision: NEXT.**

Purpose: make live presentation/controller source explicit while preserving the exact M1.2 product.

Properties:
- no biology change;
- no UI change;
- no generated-artifact byte change;
- removes frozen archive from the active build dependency after parity is proven;
- creates the correct seam for later seed UX, visual controls, M3 resize/world decoupling and fast-forward work.

### M2 — Passive Witness

**Decision: NEXT AFTER B0; planning may be refined, implementation waits for B0 promotion.**

Owner smoke increased its value. The long run showed population/resource pulses, branch recoveries and seed-to-seed variation that cannot currently be inspected genealogically.

M2 should begin smaller than the old “lineage system” framing:

**M2a — Passive Lifecycle Witness Seam**
- downstream-only lifecycle observations;
- founder, birth and death relations/events as the initial target;
- no RNG consumption;
- no mutation of biological decisions;
- no `parentId` requirement in authoritative blob state;
- no generic EventBus;
- no lineage dashboard;
- no stable archive/save schema;
- retention/storage policy remains caller-side and separately qualified.

Required gate: witness OFF and ON must produce identical causal world state, identical RNG draw counts and identical protected process specimens. Throughput/GC overhead must be characterized separately because Owner runs 4× almost continuously.

Only demonstrated needs should justify M2b retention/history structures.

### M3 — Logical World / View Split

**Decision: still strategically important, but after passive witness.**

Viewport authority is a demonstrated experimental confound and must eventually be removed intentionally. Unlike B0/M2a, M3 changes model/apparatus semantics and begins a new qualified epoch.

Having passive lifecycle evidence before M3 gives us a much better before/after diagnostic surface for this intentional semantic change.

### Fast-forward / stress mode x10/x20+

**Decision: strong Owner need; not the next Integration-Spine feature.**

The recording demonstrates continuous use of 4× and rapid seed scouting. The need is real.

However the current frame loop's `guard < 20` means merely raising the slider would produce dishonest requested-speed semantics. Fast-forward should later decouple stepping from render cadence and report achieved speed.

Near-term role: **shadow/probe lane**, especially once B0 gives the browser surface a live owner and M2 introduces an observer overhead that should be stress-tested. Do not merge a product fast-forward implementation merely to accelerate the next milestone.

### Seed provenance / metric wording / sense-ring controls

**Decision: real, evidence-backed product debt; not the current foundation gate.**

B0 makes these changes cheap and legitimate later. Do not bundle them into B0, because B0's strongest qualification property is zero product-byte change.

## Integration order after this review

Current bounded order:

`M1 complete → B0 Browser Surface Ownership Mirror → M2a Passive Lifecycle Witness Seam → explicit re-evaluation before M3`

M3 remains the leading next intentional-semantic-change candidate after M2a.

Fast-forward/stress and Owner UX debts remain parallel evidence-backed option lanes, not forgotten backlog and not automatic blockers.

## B0 exact scope

B0 may:

- create maintained browser source under `src/browser/`;
- move/copy the exact qualified V1 presentation/controller bytes into maintained source;
- update the generator to build from maintained browser source + maintained core;
- keep the frozen archive only as historical qualification reference;
- add receipts/tests proving the maintained browser source initially equals the qualified historical surface.

B0 must **not**:

- change rendered UI or controls;
- change simulation core;
- fix seed truncation;
- add x10/x20;
- change resize/world semantics;
- change metric labels/classifiers;
- add witness/lineage;
- clean up scheduler semantics.

## B0 qualification gate

PASS requires:

1. generated output remains byte-for-byte identical to the Owner-tested M1.2 artifact (`9750e602…a5b0`);
2. maintained core hash remains unchanged;
3. initial maintained browser source is mechanically traceable to the M1.2/frozen surface;
4. build determinism and Node DOM/canvas contract smoke remain PASS;
5. M1.1 and M0 regressions remain PASS;
6. no Owner re-smoke is required if and only if the generated artifact is exactly byte-identical.

## Process lesson from M1

The nonlinear project model is working: M1 did not merely execute the planned stages. Owner contact exposed a new workflow (seed scouting), the boundary review exposed a missing ownership seam (browser surface), and the next step changed without discarding the validated foundation.

The important pattern is:

`qualification → real Owner contact → integration boundary → smallest newly justified commitment`.

That remains the preferred operating model.
