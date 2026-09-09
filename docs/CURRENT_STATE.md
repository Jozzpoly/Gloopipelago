# Gloopipelago — Current State

**Date:** 2026-09-09  
**State:** **M0 PROMOTED / M1.0 PROMOTED / M1.1 PROMOTED / M1.2 CANDIDATE — OWNER SMOKE REQUIRED.**

## Project identity

Gloopipelago is a **living evolution observatory**: the living world is primary; causal apparatus is enabling infrastructure.

## Canonical repository

`Jozzpoly/Gloopipelago`

`main` is implementation authority. Historical PRs/qualification reports remain provenance; each new bounded substep branches from live `main` only after the previous promotion.

## Frozen historical authority

`archive/v1/gloopipelago_single.html`  
SHA-256 `ededf979b857f795a93f8d019ab3fc6364df0156885f381050641ab30ffff1d8`

M0 mechanically extracts the historical `mulberry32 + Simulation` block as executable Oracle in Node `v22.16.0` / V8 `12.4.254.21-node.26`.

## M0

**PASS.** Eight reference profiles, exact Float64-aware causal fingerprints, state-diff, process/Accidental-Biology specimens, and historical source receipts are canonical under `evidence/m0/`.

## M1.0

**PASS.** The first maintained DOM-free core reproduced the M0 Oracle exactly across all reference profiles and protected process semantics, including dense per-tick nominal/resize/intervention checks.

See `evidence/m1/M1_0_QUALIFICATION_REPORT.md`.

## M1.1

**PASS.** Mulberry32 now has explicit resumable uint32 state without changing stochastic semantics.

- 2,000,000 direct Oracle↔stream sequence positions PASS across 8 boundary/representative seeds;
- 64 stream snapshot/restore cases PASS;
- RNG call counts match Oracle on all 8 simulation profiles;
- explicit end-state arithmetic matches draw counts on all profiles;
- 8/8 full causal profiles and all protected process specimens remain exact;
- dense nominal/resize/intervention parity remains exact;
- four simulation-level test-only checkpoint/restore continuations remain exact in both causal world state and RNG state;
- M0 regression remains PASS.

See `evidence/m1/M1_1_QUALIFICATION_REPORT.md`.

M1.1 does **not** define a stable save format and does not split RNG streams.

## M1.2 candidate

**CANDIDATE READY / NOT PROMOTED.**

`tools/m12.mjs` deterministically generates untracked local `dist/gloopipelago.html` by preserving the frozen V1 shell and injecting the maintained core. Build/static/syntax checks, Node DOM/canvas contract smoke, M1.1 causal regression and M0 regression are PASS. The exact candidate SHA-256 is `9750e602ae61d712c64b046f130dac4c743e718d45c638ff423d5484aed9a5b0`.

The container Chromium minimal sanity probe remains unavailable before product load, so no browser PASS is claimed. **Owner smoke in a normal browser is the remaining M1.2 promotion gate.**

See `evidence/m1/M1_2_CANDIDATE_REPORT.md`.

M2+ remains unauthorized until M1.2 is explicitly promoted and the next boundary is reviewed.

## Important negative decisions

Do not clean up Accidental Biology during M1. Do not introduce split RNG streams, lineage, logical-world semantics, ECS, generic genome/development frameworks, spatial indexes, event sourcing, new ecology, or other future substrate work.
