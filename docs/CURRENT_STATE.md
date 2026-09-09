# Gloopipelago — Current State

**Date:** 2026-09-09  
**State:** **M0 PROMOTED / M1.0 PROMOTED / M1.1 PROMOTED / M1.2 READY.**

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

## Next authorized slice

**M1.2 — standalone browser delivery + real-browser / Owner product smoke only.**

M1.2 must generate a playable one-file browser artifact from maintained source rather than creating a second hand-maintained source. It must preserve recognizable V1 behavior/UI, retain usable speed controls, and verify that the living-world experience has not regressed. Browser evidence is mandatory because container Chromium was unavailable during M0.

M2+ remains unauthorized.

## Important negative decisions

Do not clean up Accidental Biology during M1. Do not introduce split RNG streams, lineage, logical-world semantics, ECS, generic genome/development frameworks, spatial indexes, event sourcing, new ecology, or other future substrate work.
