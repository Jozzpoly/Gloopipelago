# M1.0 Qualification Report — Literal Maintained Mirror

**Date:** 2026-09-09  
**Verdict:** **M1.0 PASS — literal maintained DOM-free Mirror reproduces the qualified M0 Oracle exactly in the qualified Node/V8 runtime.**

## Qualified claim

`src/core/v1-mirror.mjs` is now a maintained source module rather than a runtime-extracted HTML fragment. Its V1 model body is byte-for-byte identical to the M0 oracle body, and native ESM execution reproduces the Oracle's qualified causal trajectories exactly.

This is a historical-fidelity qualification only. M1.0 deliberately preserves V1 Accidental Biology, shared RNG topology, Float64 time accumulation, viewport/world semantics and update ordering. It does not endorse those semantics as future model law.

## Source-body identity

- maintained source: `src/core/v1-mirror.mjs`
- full maintained-source SHA-256: `d6cadbe747cfb48d5bdbc1f53821a6481228ce8ea7f3b86420810e0926d2ce89`
- full maintained-source bytes: `8855`
- mirror V1 body bytes: `8608`
- mirror V1 body SHA-256: `10ff185a4c8500f0c84b61f26f120918b362158bdf32bd766bdbe4c3f5f8eea6`
- M0 Oracle body SHA-256: `10ff185a4c8500f0c84b61f26f120918b362158bdf32bd766bdbe4c3f5f8eea6`
- exact literal body match: **PASS**

The maintained file differs only by explanatory comments and the module export needed to expose `Simulation` / `mulberry32`.

## Differential profile qualification

Mirror and live M0 Oracle were run from the same profile seed/config/intervention schedule. At every M0 checkpoint:

1. Oracle still matched the frozen M0 golden full-causal-state fingerprint;
2. Mirror matched Oracle's full-causal-state fingerprint exactly;
3. exact Float64 representation remained part of the fingerprint.

Result: **8/8 profiles PASS**, repeated independently twice during the qualification run.

Qualified profiles:

- `P-NOMINAL-S1`
- `P-NOMINAL-S12345678`
- `P-COMPACT`
- `P-WIDE`
- `P-RESIZE`
- `P-INTERVENTION`
- `P-LOWPRODUCTIVITY-NORESEED`
- `P-LOWPRODUCTIVITY-AUTORESEED`

## Dense tick-by-tick differential

To test for transient divergence that could theoretically reconverge before a sparse checkpoint, three representative profiles were compared after **every tick**:

- `P-NOMINAL-S1`: 12,000 consecutive ticks — **PASS**;
- `P-RESIZE`: 2,400 consecutive ticks including both historical `setSize()` interventions — **PASS**;
- `P-INTERVENTION`: 1,500 consecutive ticks including point-food, burst-food and catastrophe interventions — **PASS**.

No semantic difference path was observed.

## Process / scheduler semantics

The Mirror reproduces the complete M0 process-specimen object byte-identically.

Expected/reproduced specimen SHA-256:

`4961663963da2fce1639059894bdb3936a4fdc0dba85053920d102ae920af13b`

This includes live-array descendant cascades, contested-resource array priority, population-cap priority, same-tick reproduction/death, reverse food consumption, corpse timing, catastrophe ordering, Float64 season timing, and empty-state extinction/reseed semantics.

## M0 regression protection

After the M1.0 source and harness were added, the complete M0 verification suite was run again and remained **8/8 PASS + state-diff PASS**.

M1.0 therefore did not mutate or weaken the historical Oracle baseline.

## Throughput characterization

Paired/interleaved Oracle↔Mirror measurements were performed in one process/runtime. In this sample the native maintained Mirror ran approximately `3.88×` the VM Oracle throughput at the median ratio.

This is expected apparatus overhead reduction and is **not** a browser/product performance claim or an absolute future threshold. See `evidence/m1/paired-throughput.json`.

## Browser/product caveat

M1.0 is a DOM-free core qualification. Browser standalone delivery is M1.2, not this substep. The M0 container Chromium limitation remains unresolved and does not become a hidden PASS here.

## Gate reconciliation

- literal maintained source exists: **PASS**
- V1 model body byte-identical to Oracle body: **PASS**
- Oracle still matches M0 goldens: **PASS 8/8**
- Mirror matches Oracle at M0 checkpoints: **PASS 8/8**
- repeated independent differential run: **PASS 8/8**
- dense per-tick nominal differential: **PASS 12,000 ticks**
- dense per-tick resize differential: **PASS 2,400 ticks**
- dense per-tick intervention differential: **PASS 1,500 ticks**
- complete process-specimen parity: **PASS**
- M0 regression recheck after M1 additions: **PASS**
- paired throughput characterized: **PASS**
- M1.1 explicit-state RNG started before M1.0 close: **NO**
- M2+ work started: **NO**

## Promotion decision

**M1.0 is qualified for promotion. After promotion, the only next authorized substep is M1.1: introduce an explicit-state Mulberry32 wrapper that preserves the exact V1 random sequence and prove snapshot/restore continuation equivalence. No RNG stream splitting or model-semantic cleanup is authorized.**
