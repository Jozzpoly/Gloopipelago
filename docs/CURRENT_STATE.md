# Gloopipelago — Current State

**Date:** 2026-09-09  
**State:** **M0 PROMOTED / M1.0 PROMOTED / M1.1 READY.**

## Project identity

Gloopipelago is a **living evolution observatory**: the living world is primary; causal apparatus is enabling infrastructure.

## Canonical repository

`Jozzpoly/Gloopipelago`

`main` is the canonical authority for the qualified M0 historical baseline. The original qualification branch/PR remains provenance; new implementation work must branch from live `main`.

## Frozen historical authority

`archive/v1/gloopipelago_single.html`  
SHA-256 `ededf979b857f795a93f8d019ab3fc6364df0156885f381050641ab30ffff1d8`

M0 mechanically extracts the exact historical `mulberry32 + Simulation` block and qualifies it as an executable oracle in Node `v22.16.0` / V8 `12.4.254.21-node.26`.

## M0 result

**PASS in qualified Node runtime.**

- 8/8 reference profiles reproduce exact full-causal-state fingerprints.
- synthetic scheduler/Accidental Biology specimens reproduce byte-identically, including explicit empty-state extinction/no-reseed and extinction/auto-reseed branches.
- state-diff diagnostic is qualified.
- throughput is characterized, not treated as a fake absolute threshold.
- installed headless Chromium is unusable even for a minimal unrelated page, so browser-realm exactness is not claimed; M1 retains browser/Owner smoke.

See `evidence/m0/M0_QUALIFICATION_REPORT.md`.

## M1.0 result

**PASS in qualified Node runtime.**

- maintained `src/core/v1-mirror.mjs` exists;
- its 8608-byte V1 model body is byte-identical to the M0 Oracle body;
- 8/8 Oracle↔Mirror reference profiles match exact causal state at all M0 checkpoints;
- nominal, resize and intervention profiles additionally pass dense tick-by-tick differential checks;
- M0 process specimens reproduce byte-identically;
- full M0 regression gate remains PASS.

See `evidence/m1/M1_0_QUALIFICATION_REPORT.md`.

## Next authorized slice

**M1.1 — explicit-state V1-compatible RNG only.**

M1.1 may change RNG representation but not random sequence or call topology. It must prove direct sequence equivalence, exact profile parity after the replacement, and snapshot/restore continuation equivalence. RNG stream splitting remains M4 work and is not authorized.

After M1.1 qualification, M1.2 may generate the standalone browser delivery and perform browser/Owner product smoke. M2+ remains unauthorized.

## Important negative decisions

Do not clean up Accidental Biology during M1. Do not introduce ECS, generic genome/development frameworks, spatial indexes, split RNG streams, logical-world semantics, event sourcing, or new biology. Those belong to later evidence-driven epochs.
