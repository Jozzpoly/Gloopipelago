# M0 Qualification Report — Freeze / Executable Oracle

**Date:** 2026-09-09  
**Verdict:** **M0 PASS — qualified Node/V8 runtime; browser realm sanity unavailable in this container and explicitly not claimed.**

## Qualified claim

The frozen historical V1 artifact can be mechanically verified, deterministically extracted into a DOM-free executable oracle, and reproduced exactly across the frozen M0 reference profiles inside the qualified runtime. M0 does **not** claim that V1 biology is correct or desirable, and does not yet provide resumable historical checkpoints because the V1 Mulberry32 closure hides continuation state.

## Source authority

- frozen artifact SHA-256: `ededf979b857f795a93f8d019ab3fc6364df0156885f381050641ab30ffff1d8`
- bytes / lines: `17607` / `460`
- oracle extraction: lines `109–363`
- oracle SHA-256: `10ff185a4c8500f0c84b61f26f120918b362158bdf32bd766bdbe4c3f5f8eea6`
- oracle bytes / lines: `8608` / `255`
- qualified runtime: Node `v22.16.0`, V8 `12.4.254.21-node.26`, `linux/x64`

The oracle is not maintained as a second source file. Every test re-reads the frozen HTML, verifies its source hash, mechanically extracts the uniquely anchored core block, verifies the extraction hash, and executes that block in an isolated VM.

## Exact repeatability

All eight frozen reference profiles independently regenerated and replayed with exact full-causal-state fingerprints:

- `P-COMPACT` — 5 observations, final tick 12000, final fingerprint `1946e4bfe4a4b7406ccfe482f416f80d52bcf576813b23b66b3ea9d1866e952a`
- `P-LOWPRODUCTIVITY-AUTORESEED` — 6 observations, final tick 38000, final fingerprint `ccae5afec817b57c083715434c9339ada4c98ee613803c479d631649e46419aa`
- `P-LOWPRODUCTIVITY-NORESEED` — 6 observations, final tick 38000, final fingerprint `0d3e7f5eaa73482728dfb5c49c0c2fdcf3243ba0fcc9815d68a810f3b8660c28`
- `P-INTERVENTION` — 11 observations, final tick 1500, final fingerprint `6fa2daf18b6c887ae75030d622e40cbe8ae2078ab29d1cb0eb49d5476fbea8e6`
- `P-NOMINAL-S1` — 16 observations, final tick 12000, final fingerprint `ff304009fd31b57867fe7294c65c38e9c3fa87354497420490bb798e5b40b6ae`
- `P-NOMINAL-S12345678` — 16 observations, final tick 12000, final fingerprint `65c6731e4594c11bd8402e38626cb92c15c58c34a78a12be9789c027e2305c0b`
- `P-RESIZE` — 8 observations, final tick 2400, final fingerprint `6e25b4137203ca55cac8de2526b612bca1829d3ff98265048944b0ca35a7367e`
- `P-WIDE` — 5 observations, final tick 12000, final fingerprint `ca054fc347fff72c8805e291c9e60e6999f24493052dd20cbbcb05a40b7f36c3`


The two low-productivity profiles do **not** naturally reach extinction by tick 38000 (`population=17`, `extinctions=0`). Their earlier `EXTINCTION-*` labels were rejected during M0 reconciliation as misleading. Extinction/reseed branch semantics are instead qualified directly with bounded synthetic empty-state specimens below.

The verification harness also self-tests semantic diffing by deliberately perturbing `blobs[17].g.diet`; the first-difference path is correctly reported as `blobs[17].g.diet`.

## Process / scheduler specimens

Synthetic oracle specimens were executed and then reproduced byte-identically. Evidence file SHA-256: `4961663963da2fce1639059894bdb3936a4fdc0dba85053920d102ae920af13b`.

Qualified observations include:

- live append / same-tick descendant cascade: `births=3`, generations `[0, 1, 2, 3]`;
- contested-food winner flips from ID `1` to `2` when only blob-array order is reversed;
- population cap: `260` population, one earlier birth, later eligible parent blocked;
- age/reproduction: `1` birth and `1` death in one tick;
- reverse food consumption leaves `[5]`;
- catastrophe leaves ordered energies `[8, 9, 10]`;
- tick 2040 time is `33.99999999999935`, season `0`; season advances at tick 2041;
- empty state with `autoReseed=false` increments extinction count on every empty tick (`1 → 2` in two steps);
- empty state with `autoReseed=true` records one extinction and immediately creates exactly `12` generation-0 founders.

These are logged as **Accidental Biology**, not future design endorsements.

## Throughput characterization

Core-only M0 characterization over four 6000-tick runs produced a median of approximately `4470` ticks/s in this container, with individual runs ranging from approximately `3361` to `4901` ticks/s.

This is **not an absolute M1 performance threshold**. M1 must use paired/interleaved Oracle↔Mirror measurements in the same process/runtime plus browser product smoke.

## Browser-realm sanity caveat

Installed Chromium: `Chromium 144.0.7559.96 built on Debian GNU/Linux 13 (trixie)`.

A minimal unrelated headless `--dump-dom` page timed out in this container, so browser-vs-Node realm sanity is **UNAVAILABLE**, not failed semantically. M0 therefore makes no browser-realm exactness claim from this environment. M1 standalone browser delivery retains an explicit browser/Owner smoke gate.

## Gate reconciliation

- frozen source receipt: **PASS**
- deterministic/unique extraction: **PASS**
- DOM-free oracle execution: **PASS**
- explicit historical reference profiles: **PASS**
- exact same-runtime repeated observations: **PASS 8/8**
- scheduler/process receipt: **PASS**
- synthetic Accidental Biology coverage: **PASS**
- state-diff diagnostic self-test: **PASS**
- throughput characterized without fake precision: **PASS**
- production-core refactor started before M0 close: **NO**
- browser-vs-core sanity: **UNAVAILABLE IN CONTAINER; NOT CLAIMED; deferred to M1 browser smoke**

## Promotion decision

**M0 is qualified for promotion to repository authority. M1 may begin only after this evidence branch is reviewed/merged or otherwise explicitly accepted as the repository's historical V1 baseline.**
