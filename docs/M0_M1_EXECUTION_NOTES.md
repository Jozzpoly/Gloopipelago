# M0/M1 Execution Notes

This is the compact repo-native execution contract. Deep pre-implementation reasoning remains in the external research/4D-review archive; live Git + executable evidence becomes implementation authority.

## M0 — Freeze / Executable Oracle

**Status: PASS** in Node `v22.16.0` / V8 `12.4.254.21-node.26`.

M0 authority:
- exact frozen V1 source in `archive/v1/gloopipelago_single.html`;
- source/extraction receipt in `evidence/m0/source-receipt.json`;
- exact checkpoint fingerprints in `evidence/m0/golden-fingerprints.json`;
- scheduler semantics and Accidental Biology in `evidence/m0/PROCESS_SEMANTICS_V1.md`;
- qualification verdict in `evidence/m0/M0_QUALIFICATION_REPORT.md`.

The oracle must always be re-extracted mechanically from frozen V1. Do not maintain a second hand-edited oracle copy.

## M1 — Pure Mirror

M1 is the only next authorized production slice.

### M1.0 Literal maintained source mirror

Create a small DOM-free maintained source core by transcribing the frozen V1 oracle literally enough that exact causal trajectories remain unchanged.

Do **not** fix or redesign:
- live-array update scheduling;
- population-cap priority;
- target/eating iteration order;
- Float64 time accumulation;
- extinction level-trigger behavior;
- viewport-coupled `setSize()` semantics;
- shared RNG topology;
- any current genome/ecology equations.

These are historical parity requirements, not endorsements of future biology.

### Differential qualification

For every M0 profile, run Oracle and Mirror from identical seed/config/intervention schedules and compare the explicit causal state at each M0 boundary.

Required diagnostics:
- exact Float64-aware state fingerprint;
- first semantic difference path using `state-diff`;
- dense short differential windows around any failure before changing code.

M1.0 PASS requires exact parity across all M0 profiles and process specimens in the qualified runtime.

### M1.1 Explicit-state V1-compatible RNG

Only after M1.0 parity, replace the closure-only Mulberry32 representation with an explicit-state wrapper that emits the **same sequence** as frozen V1.

This is a separately qualified substep. It must not yet split RNG streams or change call topology.

Required evidence:
- direct RNG sequence equivalence over large sample windows and boundary seeds;
- full Oracle↔Mirror profile parity remains exact after the wrapper;
- explicit RNG state can be snapshotted/restored and continuation reproduces uninterrupted execution.

Do not call this a V1 historical checkpoint; it is a new M1 apparatus capability layered onto a V1-compatible sequence.

### M1.2 Standalone browser delivery

Generate a one-file playable HTML from the maintained core without making the generated artifact the source of truth.

Required product checks:
- opens and runs as a standalone browser artifact;
- world/UI behavior remains recognizably V1;
- 1× and 4× controls remain usable;
- no permanent research-dashboard wall;
- browser/Owner smoke is required because the M0 container Chromium sanity check was unavailable.

## Throughput

Do not use one absolute ticks/s threshold. Compare Oracle↔Mirror with interleaved paired runs in one process/runtime; track median ratio and spread. Browser throughput/product feel is a separate gate.

## Stop conditions

Stop and reconcile before promotion if:
- any exact causal profile diverges;
- a process specimen changes;
- RNG wrapper sequence differs from V1;
- Mirror needs a new abstraction that is not required for literal parity;
- generated browser delivery becomes a second hand-maintained source;
- product smoke shows the living-world experience regressed materially.

## Explicit non-goals

M1 does not introduce M2 lineage, M3 logical-world semantics, split RNG streams, new heredity, new ecology, spatial indexing, ECS, event sourcing, generic genome/development frameworks, or scheduler cleanup.
