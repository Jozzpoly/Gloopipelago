# Gloopipelago

**Gloopipelago** is a living evolution observatory: a small spatial world where simple organisms and their environment can create legible evolutionary histories, while the same underlying world remains experimentally inspectable enough that surprising outcomes can be investigated rather than merely narrated.

## Current authority state

- **M0 — Freeze / Executable Oracle: PROMOTED.**
- **M1 — Maintained core + explicit RNG state + standalone browser delivery: PROMOTED.**
- **B0 — Browser Surface Ownership Mirror: PROMOTED.**
- **M2a — Passive Lifecycle Witness: PROMOTED.**
- **M3 — Logical World / View Separation: contract promoted; repaired implementation machine-qualified; final Owner smoke pending.**
- **Honest x40 fast-forward: machine-qualified on top of repaired M3; final composite Owner smoke pending.**
- **M2b retained lifecycle history: DEFERRED.**

`main` remains promoted implementation authority. Qualified branch state is not live authority until its Owner gate and promotion are complete.

The frozen historical V1 artifact remains preserved exactly at:

`archive/v1/gloopipelago_single.html`

Current product build command:

`node tools/build-standalone.mjs build`

The maintained build uses `src/browser/*` + `src/core/v1-mirror.mjs`; the frozen archive is qualification/provenance, not the active product template.

## Current candidate

The current unpromoted composite candidate contains:

- fixed logical browser world `900x700` with presentation-only viewport/DPR;
- repaired pure-DPR handling;
- exact fixed-step fast-forward with targets through `40x`;
- separate target (`cel`) and achieved (`realnie`) speed reporting;
- no hidden catch-up debt;
- truthful underachievement when a world is too expensive to sustain the requested target.

Machine-qualified standalone SHA-256:

`21bb4518c3cdf2557ebeb008d9cb9bbfee1ff3e45ca06734d535106db6438b46`

This candidate is **not yet promoted**. One composite Owner browser smoke remains.

## Start here

- `docs/CURRENT_STATE.md`
- `docs/X40_HONEST_FAST_FORWARD_CONTRACT_2026-09-10.md`
- `evidence/x40/X40_MACHINE_QUALIFICATION_REPORT_2026-09-10.md`
- `evidence/x40/X40_COMPOSITE_OWNER_SMOKE_PROTOCOL_2026-09-10.md`
- `evidence/m3/M3_DPR_REPAIR_MACHINE_QUALIFICATION_2026-09-10.md`
- `evidence/m2a/M2A_QUALIFICATION_REPORT.md`
- `evidence/m0/PROCESS_SEMANTICS_V1.md`

The living world is primary. Causal apparatus is enabling infrastructure; it must not become the product identity.
