# Gloopipelago

**Gloopipelago** is a living evolution observatory: a small spatial world where simple organisms and their environment can create legible evolutionary histories, while the same underlying world remains experimentally inspectable enough that surprising outcomes can be investigated rather than merely narrated.

## Current authority state

- **M0 — Freeze / Executable Oracle: PROMOTED.**
- **M1 — Maintained core + explicit RNG state + standalone browser delivery: COMPLETE / PROMOTED.**
- **B0 — Browser Surface Ownership Mirror: PASS / promotion pending.**
- **M2a — Passive Lifecycle Witness: planning is next after B0 promotion.**

The frozen historical V1 artifact is preserved exactly at `archive/v1/gloopipelago_single.html`.

Current live product build:

`node tools/build-standalone.mjs build`

The live build uses maintained `src/browser/*` + `src/core/v1-mirror.mjs`; the frozen archive is qualification/provenance, not the active product template.

Start with:

- `docs/CURRENT_STATE.md`
- `docs/POST_M1_BOUNDARY_REVIEW_2026-09-09.md`
- `evidence/b0/B0_QUALIFICATION_REPORT.md`
- `evidence/m0/PROCESS_SEMANTICS_V1.md`

The living world is primary. Causal apparatus is enabling infrastructure; it must not become the product identity.
