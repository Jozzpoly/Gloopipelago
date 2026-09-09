# Gloopipelago — M2a Passive Lifecycle Witness Contract

**Date:** 2026-09-09  
**Status:** **BOUNDED PLAN / RED-TEAMED / READY FOR AUTHORITY PROMOTION / IMPLEMENTATION NOT YET AUTHORIZED**

## 1. Purpose

M2a adds the smallest causal-observation seam that can answer a new class of questions exposed by Owner gameplay: which organisms founded a history, which parent produced which child, and when/how organisms left the living population.

M2a is **not** a lineage system, event framework, history database, replay format, dashboard, save schema or causal explanation engine.

The required invariant is stronger than “the same averages”: attaching the witness must not alter the authoritative world trajectory, RNG call topology, protected V1 scheduler/process semantics, or browser behavior when no witness is attached.

## 2. Authority model

The simulation remains authoritative. The witness is downstream by data ownership and decision flow; JavaScript callback code is not treated as a security sandbox.

The initial apparatus seam is an optional second constructor argument, conceptually:

`new Simulation(modelConfig, { lifecycleWitness })`

This deliberately keeps model configuration separate from observation apparatus. Existing one-argument construction remains valid and is the browser default.

The witness must be installed before the constructor calls `reset()`, because initial founders are created during construction. The witness persists across a direct `reset()` of the same Simulation unless the caller creates a new Simulation instead.

No lifecycle record may be consulted by movement, metabolism, targeting, mutation, reproduction, death, RNG, scheduler, world size or any other biological/world decision.

## 3. Initial record vocabulary

Only three record kinds are authorized in M2a:

### `founder`

Detached scalar record describing a founder after it has been appended to the living population.

Required fields:

- `kind: 'founder'`
- `origin: 'initial' | 'reset' | 'auto-reseed'`
- `time` — exact current historical `simTime`
- `id`
- `generation`
- `x`, `y`
- `energy`
- `genome` — fresh value-copy of the seven current genome scalars: `hue`, `speed`, `sense`, `size`, `eff`, `wander`, `diet`

Initial construction emits 34 founders in actual spawn order. Auto-reseed emits 12 founders after the existing extinction counter increment, preserving current execution order.

### `birth`

Detached scalar record emitted after the child has actually been appended and the existing birth counter has been updated.

Required fields:

- `kind: 'birth'`
- `time`
- `id` — child ID
- `parentId`
- `generation`
- `x`, `y`
- `energy`
- `genome` — fresh value-copy of the resulting child genome

No mutation delta or genome hash is computed in core. A downstream consumer that retained the parent record can derive a delta. Avoiding hashing/serialization in Simulation keeps M2a observational rather than turning provenance machinery into biological runtime work.

### `death`

Detached scalar record emitted after the actual removal/death-counter transition has committed.

Required fields:

- `kind: 'death'`
- `mechanism: 'natural-sweep' | 'catastrophe'`
- `time`
- `id`
- `generation`
- `x`, `y`
- `energy`
- `age`
- `energyDepleted` — exact boolean `energy <= 0` at removal decision
- `ageExceeded` — exact boolean `age > 170` at removal decision

The two booleans are preserved separately; M2a must not fabricate one exclusive natural death cause when both are true. Catastrophe records use `mechanism:'catastrophe'`; their natural-threshold flags remain factual booleans rather than being relabeled as the catastrophe cause.

Catastrophe removals are lifecycle deaths and must be witnessed. Catastrophe remains historically distinct from the natural death sweep and still creates no corpse food.

## 4. What is deliberately absent

M2a does **not** add:

- an authoritative integer tick counter;
- `parentId` or lineage arrays to blob state;
- event sequence numbers in Simulation;
- session IDs / epoch IDs;
- stable serialized event schemas;
- mutation hashes/deltas in core;
- persistent event storage in Simulation;
- a generic EventBus, listener registry or topic system;
- a lineage graph, dashboard, timeline or UI wiring;
- save/checkpoint/replay semantics;
- RNG stream splitting;
- world/view changes;
- scheduler cleanup;
- new biology.

### Why no core tick counter

V1 time is historically Float64 accumulation and has known boundary behavior. M2a must not add a new authoritative clock merely for evidence ergonomics. Lifecycle records carry exact current `simTime`. A headless runner may wrap the sink and attach its own external `stepIndex` because the runner already owns the stepping loop.

### Why no session ID

Browser Reset/New Seed already creates a new Simulation. If another caller invokes `sim.reset()` while retaining lifecycle records, that caller owns the session boundary and should rotate/annotate its collector. M2a does not invent a session ontology to solve a caller-retention problem.

### Why no direct `spawnBlob()` contract

M2a covers lifecycle transitions exercised by normal Simulation control flow: reset/initial founders, auto-reseed founders, reproduction births, natural deaths and catastrophe deaths. Low-level direct external `spawnBlob()` calls remain outside the initial witness contract; future intervention semantics can qualify them if needed.

## 5. Passivity / reverse-authority rules

### No live references

Records must contain detached primitives and a newly allocated genome value-copy. The witness must never receive a blob object, live genome object, food object, Simulation reference, RNG object or mutable array from authoritative state.

A qualification sink will deliberately overwrite every mutable field it receives. The world must remain bit-identical to the witness-OFF control.

### No RNG consumption

Creating/delivering lifecycle records must call neither `this.rng()` nor any Simulation random helper. Existing Oracle↔candidate RNG call-count proofs must remain exact on all qualified profiles.

### Witness-OFF fast path

When no witness is installed, event objects and genome copies must not be allocated. Event-site helpers must return before payload construction.

### Sink exceptions are contained

A thrown lifecycle sink exception must not abort `reset()`, `step()`, reproduction, death sweep or catastrophe and must not alter causal state/RNG topology. Core therefore contains sink exceptions at the witness boundary.

M2a does not add an authoritative witness-error counter. A caller that requires diagnostics should wrap its own sink and report errors outside Simulation.

This cannot make an intentionally malicious closure incapable of mutating a Simulation reference it already owns. The M2a guarantee is narrower and enforceable: core passes no authority-bearing references and accidental payload mutation/throwing cannot perturb the world through the witness seam.

A compliant sink must not call mutating Simulation methods reentrantly. Such a call would be an explicit external intervention by the caller, not an effect of the lifecycle payload. M2a does not add a reentrancy framework merely to police hostile instrumentation code.

## 6. Event timing / ordering semantics

M2a witnesses completed lifecycle transitions and preserves actual execution order rather than inventing a parallel chronology.

- founder: after append/ID assignment;
- birth: after child append and existing `births` counter increment;
- natural death: after corpse decision, removal and existing `deaths` increment;
- catastrophe death: after removal and existing `deaths` increment;
- auto-reseed founder: after current `extinctions` increment, in actual founder spawn order.

Records from same-tick live-array birth cascades therefore appear in the real execution order. Reverse death sweeps/catastrophe loops remain reverse-order observations where historical code is reverse-order.

M2a does not reinterpret these scheduler semantics as desirable future biology; it merely makes them observable.

## 7. Minimal implementation shape

The preferred implementation remains intentionally small:

1. Extend `Simulation` constructor with an optional second apparatus argument containing `lifecycleWitness`.
2. Install the witness before constructor `reset()`.
3. Make `spawnBlob()` return the blob it already appended; return value is apparatus convenience only.
4. Add tiny private lifecycle helpers that first test whether a sink exists, then construct detached records and deliver inside exception containment.
5. Emit from the existing reset/reproduction/reseed/natural-death/catastrophe transition sites.
6. Keep browser construction unchanged, so normal product delivery runs witness-OFF.

Do not introduce a generalized emitter abstraction merely to make the code look extensible.

## 8. Required qualification campaign

### A. Causal parity — non-negotiable

For every existing qualified profile:

- B0/M1.1 baseline vs M2a witness OFF: exact causal state;
- baseline vs M2a witness ON collector: exact causal state;
- baseline vs M2a throwing sink: exact causal state;
- baseline vs M2a payload-mutating sink: exact causal state;
- RNG call counts and end-state arithmetic remain exact;
- protected M0 process/Accidental-Biology specimens remain exact.

Dense nominal / resize / intervention differential checks remain required.

### B. Lifecycle semantic specimens

At minimum qualify:

1. construction emits 34 `initial` founders, IDs 1..34, generation 0, at time 0 in spawn order;
2. same-tick multi-generation reproduction produces parent→child records in actual live-array execution order without changing the cascade;
3. one natural removal can report both `energyDepleted=true` and `ageExceeded=true` when both predicates are true;
4. catastrophe removals emit `mechanism:'catastrophe'` and do not imply corpse creation;
5. forced empty-population auto-reseed emits exactly 12 `auto-reseed` founders after the existing extinction transition;
6. detached payload mutation cannot alter any live genome/state;
7. sink exceptions cannot stop or perturb a run;
8. birth-record count equals the existing reproduction `births` counter over runs without caller reset; death-record count equals existing `deaths` including catastrophe removals;
9. no `parentId` field is introduced into authoritative blob objects.

### C. Browser/product regression

The browser surface is not wired to a witness in M2a. Required checks:

- current maintained-source standalone build succeeds;
- Node DOM/canvas contract smoke remains PASS;
- existing controls and browser controller source are unchanged unless a test-only adaptation is strictly required;
- no new dashboard or lifecycle UI is added.

A repeated Owner smoke is not automatically required for M2a if the browser remains witness-OFF, product/controller surface is unchanged and all product/causal gates pass. Any visible/product regression or material throughput concern reopens that gate.

### D. Throughput / GC sentinel

Performance claims must use paired/interleaved runs in the same runtime rather than a single absolute ticks/s threshold.

Measure three modes:

- `OFF`: no lifecycle witness;
- `ON-no-retain`: sink accepts records without retaining them;
- `ON-collector`: simple caller-owned array retention.

Use representative nominal and long/branch-rich runs. Report median paired throughput ratios and event counts.

Predeclared guardrails:

- witness-OFF candidate regression >10% versus B0/M1.1 baseline blocks promotion; 5–10% requires investigation;
- ON-no-retain slowdown >10% versus candidate OFF triggers redesign/review before promotion;
- ON-collector slowdown >20% versus candidate OFF triggers redesign/review before promotion;
- event growth must be linear in actual lifecycle transitions; Simulation itself must retain zero records.

These are engineering guardrails, not biological claims. If runtime noise makes a threshold ambiguous, repeat interleaved measurements rather than relaxing the threshold post hoc.

## 9. Evidence conservation checks

M2a should be able to verify simple accounting identities without treating them as new biology:

- initial founder count = 34 for standard reset;
- reproduction birth records = existing `births` counter;
- death records = existing `deaths` counter when the collector spans the same session and observes catastrophe too;
- auto-reseed founder increments are groups of 12 under current historical semantics.

These checks make witness loss/duplication visible without storing a history inside Simulation.

## 10. Red-team findings and decisions

### Rejected: add `parentId` to blobs

Genealogy is historical evidence, not required biological runtime state. Keeping it downstream avoids forcing later HGT/sex/multi-parent provenance into a blob field designed around asexual V1.

### Rejected: add a core `tick`

That would introduce a new clock/state variable for observer convenience before the project intentionally revises historical time semantics.

### Rejected: emit references and promise callers not to mutate them

That gives the observer reverse authority by accident. Detached records are required.

### Rejected: let sink exceptions propagate

A broken observer would then become a causal stop condition. Exception containment is required for the passive claim.

### Rejected: generic EventBus

M2a currently has one bounded observer seam. A bus/listener registry would be architecture in advance of demonstrated need.

### Rejected: store records in Simulation

Retention policy is a different problem. Keeping it caller-side prevents M2a from silently becoming history architecture and isolates GC/storage costs.

### Rejected: mutation delta/hash in core

The full child genome is already cheap, exact and sufficient for downstream derivation. Hashing/delta semantics can be chosen later by evidence tooling without becoming biological runtime work.

### Rejected: omit catastrophe deaths

That would make “death history” structurally incomplete and cause accounting mismatches. Catastrophe is an actual removal mechanism and belongs in the lifecycle seam.

## 11. Promotion boundary

M2a implementation may begin only from a fresh branch after this contract is promoted as project authority.

M2a promotion, when eventually qualified, will authorize only a new integration/boundary review. It will **not** automatically authorize M2b retention/history UI, M3 world/view semantics, split RNG, fast-forward product work, or new evolutionary substrate.

The leading post-M2a question remains whether the new witness is sufficient to make the intentional M3 world/view semantic change legible and safely qualifiable.
