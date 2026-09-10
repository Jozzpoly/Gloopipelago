# Gloopipelago — M3 Implementation Machine Qualification Report

**Date:** 2026-09-10  
**Status:** **MACHINE PASS / REAL-BROWSER OWNER SMOKE REQUIRED / M3 NOT YET PROMOTED**

## Scope qualified

This campaign qualifies the bounded M3 Logical World / View Separation implementation against the promoted M3 contract.

Runtime changes are limited to browser/view ownership:

- maintained browser worlds are constructed at canonical logical `900x700`;
- browser resize updates canvas/DPR/view transform only;
- browser resize no longer calls `Simulation.setSize()`;
- rendering uses a centered uniform aspect-preserving contain transform;
- letterbox/pillarbox space has no world authority;
- pointer interventions map view coordinates back into logical world coordinates;
- pointer coordinates are canonicalized to a `1e-9` logical-world grid so equivalent logical interventions do not diverge through viewport-dependent Float64 round-trip noise;
- near-edge inverse-mapping error is tolerated only within half that quantum before clamping to the exact logical boundary;
- the standalone builder now owns `src/browser/view-transform.mjs` as a maintained source input.

`src/core/v1-mirror.mjs` is unchanged byte-for-byte.

## Exact candidate boundary

Final performance-inclusive qualification head:

`31b86e80fc8a1602f351da9d6427db34cd6414d2`

Exact promoted M2a core SHA-256:

`18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`

Candidate standalone:

- SHA-256 `d768b046f205b0c1f5067558829f4ddca7cde102fb1ce3df072c8d199c278394`;
- 22,718 bytes;
- syntax check PASS;
- deterministic maintained-source standalone build;
- no external script dependency.

Exact `m3-qualification.json` SHA-256:

`c2fd08abbf216709fa45f481d61ab227c07329c62abf20bdb42bf0db374e0fc5`

Exact `m3-performance.json` SHA-256:

`768de22d63b110c0f2b9cadbb5a47ff06179f1fd7d419f75b496921004bbbcf1`

## Final GitHub Actions receipt

Final workflow run:

- run `34423384532`;
- head `31b86e80fc8a1602f351da9d6427db34cd6414d2`;
- conclusion **completed / success**;
- artifact `m3-implementation-qualification`;
- artifact id `10131785214`;
- artifact archive digest `sha256:cc6a5001d1719165201bfa22fbff0134a054c67785f76fbb56cd069129cc3c98`.

Node runtime: `22.16.0`, matching the M0 qualification runtime family used throughout the current authority chain.

## M3-specific causal/view qualification

`tools/m3.mjs` verifies the new authority boundary directly.

### Source ownership

PASS:

- exact promoted M2a core hash required;
- canonical world constants exactly `900x700`;
- browser controller contains no `sim.setSize(` call;
- world construction uses canonical logical constants;
- resize recomputes view transform only;
- pointer path uses `viewToWorld`;
- letterbox/pillarbox pointer path is a no-op;
- standalone builder includes maintained view-transform source.

### Transform specimens

Five materially different view geometries:

- 900x700;
- 1400x800;
- 390x600;
- 1920x600;
- 600x1200.

Five logical points per view, including exact corners and high-precision near-edge/interior coordinates.

Result: **25/25 canonical world -> view -> world round-trips PASS**.

Explicit outside-view specimens also PASS:

- wide left/right pillarbox -> no world coordinate;
- compact top/bottom letterbox -> no world coordinate;
- zero-area view -> no world coordinate.

### Exact viewport-history invariance

Four seeds:

- `1`;
- `0x12345678`;
- `0x9E3779B9`;
- Owner-evidence seed `956866913`.

Five view histories per seed:

- stable wide;
- stable compact;
- wide -> compact -> wide;
- compact -> wide -> compact;
- desktop -> portrait -> desktop.

Each run executes 2,400 fixed ticks and the same four logical pointer-food interventions, mapped through the currently active view transform.

Total: **20 paired-history runs**.

For every seed, every history matches the reference history exactly on:

- full authoritative causal-state fingerprint;
- explicit RNG state;
- RNG call count;
- exact M2a lifecycle-event fingerprint.

At every pure view-resize boundary, full causal state before/after transform recomputation is exactly identical.

Result: **viewport history has no demonstrated causal authority under the qualified M3 paths.**

### DOM/canvas/controller smoke

The generated standalone is executed through a deterministic Node DOM/canvas contract harness.

PASS:

- world boots;
- pause wiring works;
- compact resize at DPR 2 creates the expected backing buffer and contain transform;
- compact letterbox click performs zero world intervention;
- compact logical-center click adds exactly 18 food;
- wide resize at DPR 1.5 creates the expected backing buffer and contain transform;
- wide pillarbox click performs zero world intervention;
- wide logical-center click adds exactly 18 food;
- Reset preserves seed and restores canonical initial state;
- New Seed changes seed and restores the 34-founder initial population.

This is controller/integration evidence, not a substitute for a real-browser Owner product gate.

## Protected authority chain

The final run independently re-executed the protected lower-level campaigns after M3 qualification.

PASS:

- M0 Oracle regression;
- M1.1 maintained-core regression;
- M1.1 exact RNG call/state accounting;
- M2a witness OFF causal parity;
- M2a collector causal parity;
- M2a throwing-sink parity;
- M2a mutating-sink parity;
- M2a adversarial detached-witness continuation;
- M2a lifecycle semantic specimens.

The historical explicit world-size profiles, including compact/wide/explicit-resize semantics, remain protected core apparatus. M3 changes browser ownership, not `Simulation.setSize()` semantics.

## Failure found during qualification

The first M3 CI attempt was **correctly rejected**.

Run `34423148264`, pre-fix head `64e8f19f417a3972f86c6fdda258e40dea665704`, failed the compact exact-edge transform specimen:

- logical point `(900,700)`;
- compact view inverse mapping produced a Float64 value just outside the strict boundary;
- `viewToWorld` returned `null` instead of the exact logical corner.

This was a real implementation defect, not an environment failure or a test false positive.

The repair introduced a boundary tolerance of only `POINTER_WORLD_QUANTUM / 2` (`5e-10`) before the existing coordinate canonicalization/clamp. A second full correctness run, `34423204627` at runtime head `44ccae38021d7d6c2ea6069c21d8dfeb22cafb0d`, then passed the complete correctness chain.

From that full-correctness head to the final performance-inclusive head, only the performance tool and temporary workflow changed. Runtime/browser/builder source did not change.

## Performance sentinel

The contract required a machine performance sentinel in addition to correctness.

`tools/m3-performance.mjs` compares the exact PR-base standalone against the M3 candidate in separate child processes using the real controller/draw JavaScript with a no-op canvas backend.

Predeclared investigation boundary, set before observing results:

`candidate paired median frame time / baseline > 1.25` -> INVESTIGATE / block machine qualification.

Workload:

- 200 blobs;
- 500 food items;
- 200 sense rings;
- 900x700 viewport;
- paused simulation so the measurement isolates JS/controller/render traversal rather than simulation stepping;
- 1,200 measured frames after 250 warmup frames;
- 7 paired repetitions with alternating execution order.

Exact baseline product from PR base `bd8bfab5079bb1d1f596f9621d98ac522571b75a`:

- SHA-256 `4c60670e4b6c0a4824de170eb3d8a52db3d96bdb49210f398148ac89dc9b611d`;
- 20,279 bytes.

Performance result:

- baseline median: `106.266203 ms / 1200 frames`;
- candidate median: `106.320258 ms / 1200 frames`;
- paired median frame-time ratio: **`1.0001810668670243`**;
- approximate paired-median overhead: **+0.0181%**;
- predeclared investigation threshold: `1.25`;
- status: **PASS**.

Paired ratios:

`1.09755, 1.00018, 0.99241, 1.02333, 0.99828, 0.98693, 1.00204`

One run is noisier at roughly +9.8%; the paired median and the remaining repetitions cluster near 1.0. There is no machine evidence of a material JS/controller render-path regression.

This sentinel does **not** measure GPU canvas cost, browser compositing, mobile rendering or achieved simulation speed in a real browser. The existing demonstrated Owner 4x workflow therefore remains a separate blocking product gate.

## Intentional compatibility boundary

M3 browser product is intentionally not expected to reproduce historical browser trajectories whose logical world was implicitly chosen by a viewport other than 900x700.

That is the authorized semantic change.

Within the M3 epoch, the qualified claim is narrower and stronger:

> for the same canonical logical world, seed and logical interventions, browser view geometry and resize history do not have demonstrated causal authority.

Do not reinterpret this as changing historical V1/M2a provenance.

## Remaining risk / Owner gate

Machine qualification cannot establish product feel or presentation quality.

The main unresolved risk is the deliberate full-world `contain` presentation:

- strongly wide desktop views can show pillarbox space;
- tall/narrow/mobile-like views can show letterbox space;
- the complete 900x700 logical world remains visible rather than being stretched or cropped.

This is semantically clean but may or may not be the right presentation experience.

A real-browser Owner smoke is therefore **blocking** before M3 promotion. See `evidence/m3/M3_OWNER_SMOKE_PROTOCOL.md`.

## Verdict

**M3 implementation: MACHINE PASS.**

Do not merge/promote yet.

The exact candidate `d768b046f205b0c1f5067558829f4ddca7cde102fb1ce3df072c8d199c278394` now requires real-browser Owner qualification. A positive Owner gate may then authorize final promotion evidence and merge; a material presentation or interaction failure reopens the relevant M3 product boundary without restoring viewport causal authority silently.
