# B0 Browser Surface Ownership Mirror — Qualification Report

**Date:** 2026-09-09  
**Status:** **PASS / READY FOR PROMOTION**

## Purpose

B0 removes the immutable frozen V1 artifact from the active browser-build dependency while preserving the exact Owner-tested M1.2 product.

This is a source-ownership migration only. It does not change UI, controls, simulation biology, world/view semantics, scheduler semantics or RNG topology.

## Maintained browser source

B0 establishes:

- `src/browser/shell-prefix.html`
- `src/browser/app.mjs`
- `src/browser/shell-tail.html`
- existing `src/core/v1-mirror.mjs`

The current build entrypoint is `tools/build-standalone.mjs`.

The historical `tools/m12.mjs` remains as M1.2 provenance/qualification machinery. The live build no longer reads `archive/v1/gloopipelago_single.html`.

## Exact surface provenance

At B0 qualification time, the maintained browser pieces are exact byte-preserving extractions of the qualified V1 browser surface.

- prefix SHA-256: `8508c182073f9a21be43d4b9e0f470891306a49688cc81ba0e9e04a0e56771b3`
- app/controller SHA-256: `43cbabfb908919364df844290241364768cda7a95992382f63d9df1f78f1adb4`
- tail SHA-256: `fc837380d9f5351ff0a5776c8e1f523bb2107106f2ac860e0e76535377ec5b78`
- maintained core SHA-256: `77c5736b56a2c85799df8caaa221d85cb583c1ef63c1533b74102f73f86efd7b`

`tools/b0.mjs verify` mechanically compares the three maintained browser pieces against their historical segments and rejects drift during B0 qualification.

## Product identity gate

Current maintained-source assembly produces:

SHA-256 `9750e602ae61d712c64b046f130dac4c743e718d45c638ff423d5484aed9a5b0`  
Bytes `18271`

This is byte-for-byte identical to the exact M1.2 artifact already tested by the Owner in a real desktop browser.

Therefore B0 requires no repeated Owner smoke: there is no new browser artifact to test.

## Automated qualification

PASS:

- `tools/build-standalone.mjs build`
- `tools/build-standalone.mjs verify`
- `tools/b0.mjs verify`
- historical M1.2 Node DOM/canvas contract smoke on the identical output
- M1.1 full 8-profile causal regression + protected process specimens
- M0 full 8-profile Oracle regression + state-diff self-test

The build is deterministic and has no external script dependency.

## Ownership result

Before B0:

`maintained core + frozen historical browser shell → product`

After B0:

`maintained browser source + maintained core → product`

The frozen V1 artifact remains available only as immutable provenance / qualification reference.

This is the intended long-term authority boundary.

## Explicit non-goals

B0 does not:

- change any visible UI;
- fix truncated seed display;
- add fast-forward;
- change metric labels;
- hide sense rings;
- change resize/world authority;
- add witness/lineage;
- change scheduler/Accidental Biology;
- split RNG streams.

## Promotion verdict

**B0 PASS.**

After B0 promotion, M2a Passive Lifecycle Witness planning is authorized. M2a implementation should begin only after a bounded witness contract/qualification plan is written and checked against the post-M1 boundary constraints.
