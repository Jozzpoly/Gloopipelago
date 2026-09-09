# Gloopipelago — Current State

**Date:** 2026-09-09  
**State:** **M0 PROMOTED / M1.0 PROMOTED / M1.1 PROMOTED / M1.2 PROMOTED / POST-M1 BOUNDARY REVIEW REQUIRED.**

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

**PASS / PROMOTED.** Eight reference profiles, exact Float64-aware causal fingerprints, state-diff, process/Accidental-Biology specimens, and historical source receipts are canonical under `evidence/m0/`.

## M1.0

**PASS / PROMOTED.** The first maintained DOM-free core reproduced the M0 Oracle exactly across all reference profiles and protected process semantics, including dense per-tick nominal/resize/intervention checks.

See `evidence/m1/M1_0_QUALIFICATION_REPORT.md`.

## M1.1

**PASS / PROMOTED.** Mulberry32 has explicit resumable uint32 state without changing stochastic semantics. Sequence, call-count, dense causal parity and test-only restore continuation are qualified.

M1.1 does **not** define a stable save format and does not split RNG streams.

See `evidence/m1/M1_1_QUALIFICATION_REPORT.md`.

## M1.2

**PASS / PROMOTED.**

`tools/m12.mjs` deterministically generates untracked local `dist/gloopipelago.html` from the frozen V1 shell plus maintained core. The exact Owner-tested artifact is SHA-256 `9750e602ae61d712c64b046f130dac4c743e718d45c638ff423d5484aed9a5b0` (18271 bytes).

Automated build/static/syntax/Node DOM-contract checks pass. M1.1 and M0 regressions remain exact. The previously missing real-browser gate is now cleared by Owner smoke: a ~142.8 s desktop-browser recording showed the living world running recognizably as V1 with no blocking visible regression, and requested 4× was measured at 4.00× over a 90 s real interval.

See:

- `evidence/m1/M1_2_QUALIFICATION_REPORT.md`
- `evidence/m1/M1_2_OWNER_SMOKE_VIDEO_ANALYSIS.md`
- `evidence/m1/m1_2_owner_smoke_receipt.json`

## Newly demonstrated post-M1 needs / debts

Owner smoke exposed several valuable later requirements without making them M1.2 blockers: full/copyable seed provenance for seed scouting; clearer highest-living-vs-historical generation semantics; separation of UI diet classes from functional generalism; optional sense-ring visibility; and a true x10/x20+ fast-forward/stress workflow with achieved-speed reporting rather than a simple slider extension.

## Next authorized action

**Perform a short post-M1 integration/boundary review.**

That review must decide the next bounded slice from current evidence. M2 implementation is **not yet authorized merely because M1 completed**.

## Important negative decisions

Do not clean up Accidental Biology by inertia. Do not introduce split RNG streams, lineage, logical-world semantics, ECS, generic genome/development frameworks, spatial indexes, event sourcing, new ecology, or other future substrate work until explicitly authorized by the next boundary review.
