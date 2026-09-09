# M1.1 Qualification Report — Explicit-state V1-compatible RNG

**Date:** 2026-09-09  
**Verdict:** **M1.1 PASS — Mulberry32 state is explicit and resumable while the V1 random sequence, draw topology, causal trajectories, and protected process semantics remain unchanged in the qualified Node/V8 runtime.**

## Qualified claim

M1.1 changes RNG **representation**, not stochastic semantics.

`src/core/v1-mirror.mjs` now exposes `Mulberry32Stream` with an explicit uint32 `state`, `next()`, `snapshot()`, and `restore(state)`. `Simulation` owns `rngStream`; existing simulation call sites continue to invoke `this.rng()` through a callable adapter. No RNG streams were split and no random call site was moved or added intentionally.

This is **not** a save-system qualification and does not define a stable checkpoint file format.

## Direct sequence equivalence

The actual maintained `Mulberry32Stream` and the compatibility `mulberry32(seed)` export were compared against the frozen M0 Oracle generator.

Seeds:

`0`, `1`, `0x12345678`, `0x7fffffff`, `0x80000000`, `0xffffffff`, `0x9e3779b9`, `0xdeadbeef`.

For every seed, 250,000 consecutive draws matched exactly: **2,000,000 Oracle↔stream positions PASS**, with the compatibility function checked at the same positions.

Explicit stream snapshot/restore was also tested at 8 offsets for every seed. All **64 cases** reproduced the following 4,096 draws exactly after restore.

See `evidence/m1/m1_1_rng_sequence.json`.

## Random-call topology

For every M0 profile, both Oracle and M1.1 candidate had `this.rng()` wrapped by passive counters after construction. Counts matched exactly through the entire run.

The explicit stream's end state was independently checked using the Mulberry32 recurrence:

`endState = startState + calls × 0x6D2B79F5 (mod 2^32)`.

All 8 profiles satisfy the invariant exactly. Representative counts include 451,324 and 457,687 draws for the two nominal 12k-tick profiles, and 666,400 draws for each 38k low-productivity profile.

See `evidence/m1/m1_1_rng_call_counts.json`.

## Full causal trajectory parity

M1.1 was run against the live M0 Oracle using the same seeds, configurations, viewport histories, and intervention schedules.

Result: **8/8 reference profiles PASS exact full-causal-state parity** at every qualified M0 checkpoint. The Oracle simultaneously remained pinned to the frozen M0 goldens.

The complete M0 process/Accidental-Biology specimen set also remains exact PASS.

## Dense tick-by-tick differential

Representative trajectories were compared after every single tick:

- `P-NOMINAL-S1`: 12,000 / 12,000 ticks PASS;
- `P-RESIZE`: 2,400 / 2,400 ticks PASS;
- `P-INTERVENTION`: 1,500 / 1,500 ticks PASS.

No transient causal divergence was observed.

## Simulation-level snapshot / restore continuation

A **test-only** checkpoint helper captured the full currently-authoritative world state plus `rngStream.snapshot()`, reconstructed a fresh `Simulation`, restored the world fields and RNG state, and continued both uninterrupted and restored worlds in lockstep.

Four cases passed exact causal-state and RNG-state comparison after every continuation tick:

- nominal checkpoint at tick 777, then 3,000 ticks;
- second nominal profile after first season transition, tick 2,100, then 2,500 ticks;
- resize profile after first resize, tick 800, then 1,200 ticks;
- intervention profile after catastrophe, tick 1,000, then 500 ticks.

See `evidence/m1/m1_1_restore_receipt.json`.

This proves resumable stochastic state. It **does not** promote the helper's ad-hoc object shape into a product save/checkpoint schema.

## Regression protection

After the stateful RNG implementation and M1.1 harness/receipts were finalized:

- M1.1 full differential: **8/8 PASS + process specimens PASS**;
- M1.1 dense differential: **PASS** for all three dense profiles;
- complete M0 Oracle regression: **8/8 PASS + state-diff self-test PASS**.

## Source change scope

M1.0's literal-source-body identity is a historical qualification of commit/PR #2 and is intentionally no longer a current invariant after M1.1. The maintained core changed only to introduce explicit Mulberry32 state and route the existing `this.rng()` adapter through it, plus stage comments/exports.

No scheduler, time, world, genome, metabolism, reproduction, food, death, catastrophe, or intervention equations were intentionally changed.

## Explicit non-claims

M1.1 does **not** qualify:

- multiple or named RNG streams;
- per-organism/keyed randomness;
- cross-engine bit-exact replay;
- a stable save/checkpoint format;
- lineage/history storage;
- logical-world/viewport separation;
- scheduler cleanup;
- new biology.

## Gate reconciliation

- explicit RNG state exists: **PASS**
- direct sequence equivalence: **PASS**
- compatibility `mulberry32(seed)` sequence preserved: **PASS**
- stream snapshot/restore: **PASS**
- Oracle↔candidate RNG call counts: **PASS 8/8**
- explicit state arithmetic invariant: **PASS 8/8**
- full profile causal parity: **PASS 8/8**
- protected process specimens: **PASS**
- dense nominal/resize/intervention parity: **PASS**
- simulation-level restore continuation: **PASS 4/4**
- M0 historical regression: **PASS**
- RNG stream splitting introduced: **NO**
- save-system schema introduced: **NO**
- M2+ work started: **NO**

## Promotion decision

**M1.1 is qualified for promotion. After promotion, the only next authorized substep is M1.2: generate standalone browser delivery from the maintained core and perform real-browser / Owner product smoke.**
