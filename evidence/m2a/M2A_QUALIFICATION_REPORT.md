# M2a Passive Lifecycle Witness — Qualification Report

**Date:** 2026-09-10  
**Status:** **PASS / READY FOR PROMOTION**

## Purpose

M2a adds the smallest downstream lifecycle-observation seam authorized by `docs/M2A_PASSIVE_LIFECYCLE_WITNESS_CONTRACT_2026-09-09.md`.

The implementation observes `founder`, `birth` and `death` transitions. It does not add lineage storage, a generic event system, UI/history, save/replay semantics, split RNG, world/view changes, scheduler cleanup or new biology.

## Production delta

Only `src/core/v1-mirror.mjs` changes in the product runtime.

The constructor accepts an optional second apparatus argument containing `lifecycleWitness`. Existing one-argument browser construction is unchanged and therefore witness-OFF.

`spawnBlob()` now returns the blob it already appended. Tiny internal lifecycle helpers construct detached scalar records only when a sink exists. The simulation itself retains no event collection.

Current M2a candidate core SHA-256:

`18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`

Pre-M2a/B0 core SHA-256:

`77c5736b56a2c85799df8caaa221d85cb583c1ef63c1533b74102f73f86efd7b`

## Causal / RNG qualification

All existing qualified profiles remain exact against historical truth.

Full 8-profile runs PASS in every M2a mode:

- witness OFF via the existing M1.1 harness;
- ON with caller-owned collector;
- ON with non-retaining sink;
- ON with a sink that throws on every record;
- ON with a sink that deliberately mutates every supplied record/genome copy.

The M2a parity runner asserts exact causal-state equality to the M0 Oracle and exact candidate/Oracle RNG call counts for every profile.

Dense tick-by-tick differential PASS:

- collector: nominal 12,000 ticks; resize 2,400; intervention 1,500;
- mutating sink: nominal 12,000; resize 2,400; intervention 1,500;
- historical M1.1 dense regression remains PASS on the same three cases.

Existing M1.1 RNG state/call arithmetic remains exact. M0 8/8 Oracle regression and state-diff self-test remain PASS. Protected Accidental-Biology/process specimens remain PASS.

## Lifecycle semantic qualification

`evidence/m2a/lifecycle-specimens.json` records nine qualified specimen groups.

Demonstrated properties include:

- construction emits 34 `initial` founders, IDs 1..34, generation 0, time 0, in spawn order;
- direct `reset()` emits 34 `reset` founders;
- direct low-level `spawnBlob()` remains outside the witness contract;
- the protected same-tick reproduction cascade is observed as `1→2`, `2→3`, `3→4` without changing it;
- natural removal can report `energyDepleted=true` and `ageExceeded=true` simultaneously;
- catastrophe removals are observed in the actual reverse loop order, use `mechanism:'catastrophe'`, and create no corpse food;
- forced auto-reseed emits exactly 12 `auto-reseed` founders after the extinction transition;
- mutating a retained record/genome copy cannot alter live blob state;
- birth/death delivery occurs after the existing counter/population transition;
- authoritative blobs contain no `parentId` field;
- witness-OFF structural specimen confirms the only Simulation-owned arrays remain `blobs` and `foods`, and lifecycle helpers are not entered on OFF transition sites.

Birth-record accounting equals the existing `births` counter and death-record accounting equals existing `deaths` on the qualified collector profiles.

## Exception and reverse-authority qualification

A sink that throws for every lifecycle record cannot stop or perturb construction, reset, stepping, reproduction, natural death, catastrophe or auto-reseed behavior in the qualified runs.

A sink that overwrites record fields and nested genome-copy fields likewise cannot perturb the world. Core passes no blob, live genome, food, RNG, Simulation or mutable authoritative collection through the witness payload.

The contract remains explicit that JavaScript callbacks are not security sandboxes: a caller that already owns a Simulation reference and deliberately mutates it reentrantly is performing an external intervention, not exercising payload authority.

## Throughput / GC sentinel

The first paired/interleaved performance run was noisy. Its nominal OFF/Baseline median entered the predeclared 5–10% investigation band (~6.5% slower), while compact and active-witness modes showed inconsistent apparent speedups.

Per the predeclared rule, this did **not** pass automatically. A direct native pre-M2a vs M2a-OFF investigation was run with longer 12,000-tick A/B pairs and alternating order:

- nominal: 15 pairs, median candidate/baseline `0.98546` (~1.45% slower);
- compact: 10 pairs, median `0.97602` (~2.40% slower).

Both are below the 5% investigation threshold. No material OFF-path regression is detected.

The primary paired run also found no guardrail breach for ON-no-retain (>10% slowdown) or simple caller-owned collector (>20% slowdown). Single-run heap deltas were too noisy for a quantitative memory claim; no such claim is made. Structural qualification confirms Simulation retains zero lifecycle-record collections and event count grows only with actual lifecycle transitions retained by the caller.

See `evidence/m2a/throughput.json`.

## Browser / product regression

Maintained browser source is unchanged from B0:

- app/controller SHA-256 `43cbabfb908919364df844290241364768cda7a95992382f63d9df1f78f1adb4`
- prefix SHA-256 `8508c182073f9a21be43d4b9e0f470891306a49688cc81ba0e9e04a0e56771b3`
- tail SHA-256 `fc837380d9f5351ff0a5776c8e1f523bb2107106f2ac860e0e76535377ec5b78`

Current maintained-source standalone build PASS:

- SHA-256 `4c60670e4b6c0a4824de170eb3d8a52db3d96bdb49210f398148ac89dc9b611d`
- 20,279 bytes
- deterministic build/verify PASS
- Node DOM/canvas contract smoke PASS

The artifact bytes differ from M1/B0 because the maintained core now contains the witness implementation. Browser behavior remains witness-OFF and the browser/controller source is unchanged.

Under the promoted contract, a repeated Owner smoke is not required: there is no UI/controller change, no causal divergence, and no material throughput concern.

## Negative result / non-authority

M2a does not establish a lineage database, timeline, causal explanation, stable serialized lifecycle schema, save format, tick/session ontology or retention policy.

The record vocabulary is the bounded M2a observation interface only. Any M2b history/retention work requires a new boundary decision.

## Promotion verdict

**M2a PASS / READY FOR PROMOTION.**

Promotion should authorize a post-M2a integration review only. It must not automatically start M2b, M3, fast-forward product work, RNG splitting, scheduler revision or new evolutionary substrate.
