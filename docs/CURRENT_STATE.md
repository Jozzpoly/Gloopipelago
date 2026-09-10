# Gloopipelago — Current State

**Date:** 2026-09-10  
**State:** **M0 PROMOTED / M1 PROMOTED / B0 PROMOTED / M2a PROMOTED / M3 CONTRACT PROMOTED / M3 DPR REPAIR MACHINE PASS / FINAL OWNER M3 SMOKE DEFERRED TO COMPOSITE x40 CANDIDATE / M3 NOT YET PROMOTED / M2b DEFERRED.**

## Project identity

Gloopipelago is a **living evolution observatory**: the living world is primary; causal apparatus is enabling infrastructure.

## Canonical repository

`Jozzpoly/Gloopipelago`

`main` remains promoted implementation authority. Bounded implementation layers may be qualified on branches before promotion, but branch state must not be described as live authority merely because CI is green.

## Frozen historical authority

`archive/v1/gloopipelago_single.html`  
SHA-256 `ededf979b857f795a93f8d019ab3fc6364df0156885f381050641ab30ffff1d8`

The frozen artifact is immutable provenance.

## Promoted foundation

### M0 / M1 / B0

**PROMOTED.**

M0 established executable historical truth. M1 established the maintained causal core, explicit V1-compatible RNG state, deterministic standalone delivery and positive Owner real-browser evidence. B0 moved the live browser surface into maintained source without changing the already-qualified product.

Historical M1.2 Owner-tested standalone:

- SHA-256 `9750e602ae61d712c64b046f130dac4c743e718d45c638ff423d5484aed9a5b0`;
- 18,271 bytes.

### M2a — Passive Lifecycle Witness

**PROMOTED.**

Detached downstream-only founder/birth/death witness records remain qualified without changing RNG, scheduler, world or biological semantics. `Simulation` retains no lifecycle history.

Promoted maintained-core SHA-256:

`18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`

M2b retained history remains deferred.

## M3 contract / geometry authority

**PROMOTED CONTRACT; IMPLEMENTATION NOT YET PROMOTED.**

The post-M2a review identified browser viewport authority as a causal/reproducibility confound. A dedicated geometry campaign demonstrated that world dimensions are ecological semantics rather than neutral rendering coordinates.

M3 therefore defines:

- canonical browser logical world: **900x700**;
- browser viewport/CSS/DPR: presentation-only state;
- centered uniform aspect-preserving `contain`;
- letterbox/pillarbox: no world authority;
- inverse pointer mapping into logical coordinates;
- explicit `Simulation.setSize()` retained as intentional world-semantic apparatus;
- no biology/RNG/scheduler semantic changes inside M3.

Canonical contract/evidence:

- `docs/POST_M2A_BOUNDARY_REVIEW_2026-09-10.md`;
- `docs/M3_LOGICAL_WORLD_VIEW_SEPARATION_CONTRACT_2026-09-10.md`;
- `docs/M3_GEOMETRY_AUTHORITY_RECEIPT_2026-09-10.md`;
- `evidence/m3/M3_GEOMETRY_FEASIBILITY_REPORT.md`.

## M3 implementation history and skeptical audit

Initial M3 implementation branch/PR:

- branch `m3-logical-world-view-implementation`;
- PR `#11`;
- original exact runtime qualification head `31b86e80fc8a1602f351da9d6427db34cd6414d2`;
- original standalone SHA-256 `d768b046f205b0c1f5067558829f4ddca7cde102fb1ce3df072c8d199c278394`.

That original campaign produced valid evidence for its exercised paths, including transform geometry, viewport-history causal invariance, pointer boundaries, lower-level regressions and render-controller overhead.

However, the later skeptical readiness audit found a material qualification gap: the promoted M3 contract explicitly required a **pure DPR-only** presentation change, while the original campaign changed DPR together with geometry/manual resize. Real Chrome then demonstrated that the product did not naturally update its backing buffer when DPR changed without a CSS resize.

Therefore the historical blanket label **“M3 IMPLEMENTATION MACHINE PASS” is superseded**. The old results remain evidence for what they actually tested, but they are not the current complete M3 qualification authority.

The same audit also found:

- the original performance sentinel measured paused render/controller traversal, not achieved simulation speed;
- achieved 4x was later established independently in Owner/browser evidence;
- a later Owner protocol incorrectly weakened the promoted narrow/mobile-like smoke requirement;
- future qualification plumbing must not allow `tee` pipelines to mask test failures;
- the current RAF scheduler cannot honestly provide ~40x and accumulates catch-up debt.

The audit itself changed no production runtime.

## M3 DPR repair — current machine authority

**REPAIRED MACHINE PASS / NOT YET OWNER-PROMOTED.**

Repair branch:

`repair/m3-dpr-x40-polish-2026-09-10`

Final repaired M3 runtime head:

`1411f46831aad00e579c6cf03f36b7fcef1b1001`

The repair is intentionally small:

- every active presentation frame checks current `devicePixelRatio`;
- a DPR mismatch invokes the existing presentation-only canvas/view resize path;
- no logical-world geometry or authoritative simulation state is changed;
- core remains byte-identical to promoted M2a.

Exact repaired standalone:

- SHA-256 `fb568d1b4fb5f4ed3e584bbab4662ad19339851efc78756c97e242283600e43f`;
- 22,860 bytes;
- app SHA-256 `426ceafc5e7cf1c287a08e62dabef361e8d527c768aae22e768511bfd5637f5a`;
- core SHA-256 `18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`.

Final repair Actions receipt:

- run `34429956481`: **completed / success**;
- runtime head `1411f46831aad00e579c6cf03f36b7fcef1b1001`;
- Chrome `152.0.7977.82`;
- artifact id `10134150422`;
- artifact digest `sha256:9adc833e465f0254f834de0e0a8a6c5a1490fd856414258b37cdc6a48784aef5`.

Real-browser repaired M3 evidence:

- wide -> narrow -> wide presentation transitions: zero authoritative-state delta while paused;
- pure DPR 1 -> 2 at fixed CSS canvas `390x408`: controller updates to DPR2, backing buffer becomes `780x816`, full authoritative state remains exactly equal;
- narrow letterbox pointer: no food change and no RNG consumption;
- in-world pointer: exactly +18 food;
- no page errors;
- achieved 4x: **3.9937423026x** with effectively zero accumulator backlog.

Render-controller regression sentinel vs the original M3 candidate:

- paired median frame-time ratio **1.0012246264x** (~+0.12%);
- predeclared investigate boundary `1.25`;
- status **PASS**.

The first attempted DPR repair using a `matchMedia` resolution-change listener is preserved as a failed qualification:

- run `34429727210` — **failure**;
- protected M0/M1.1/M2a gates passed;
- real-browser DPR-only gate timed out;
- the failure was not relaxed or hidden; the implementation strategy was changed and the full campaign rerun.

See:

`evidence/m3/M3_DPR_REPAIR_MACHINE_QUALIFICATION_2026-09-10.md`

## Owner browser evidence

The earlier ~4m47s Owner recording remains useful **partial positive evidence** for the original M3 semantics:

- stable multi-minute live runtime;
- strongly wide contain presentation remains legible;
- Pause/Wznów;
- +50 food;
- Katastrofa;
- Ten sam seed;
- Nowy seed;
- sustained 4x;
- real-browser pillarbox no-op versus in-world pointer-food behavior.

It did not include the promoted contract's required materially narrow/mobile-like product check and substantial wide -> narrow/tall -> wide continuity sequence, nor the reset/new-seed checks after that resize.

Those requirements remain open. They are **not optional**.

Because Owner has also established that the next product worth another broad test must include useful ~40x execution, the remaining M3 Owner checks are deliberately deferred to the next composite candidate rather than spending Owner attention on another pre-fast-forward build.

This is scheduling of evidence, not weakening of the M3 gate.

## Fast-forward readiness — established constraints

The skeptical audit established that the existing RAF-coupled `guard < 20` scheduler must not simply be extended to 40x.

At requested 40x it is refresh-rate dependent and accumulates historical debt; real Chrome demonstrated roughly 20x achieved at 60 Hz and continued ~20x execution even after selecting 1x because old accumulator debt was being repaid.

The next fast-forward layer must therefore:

- preserve exact sequential `Simulation.step(1/60)` semantics;
- decouple stepping from display refresh rate;
- keep requested and achieved speed separate;
- avoid unbounded catch-up debt;
- clear old timing debt across speed/pause/visibility/reset transitions;
- define hidden-tab behavior explicitly;
- preserve intervention ordering at fixed-step boundaries;
- bound main-thread work and yield to browser input/rendering;
- allow reduced render cadence at high speed;
- report underachievement rather than lie about 40x;
- keep Worker architecture as a fallback unless evidence requires it;
- avoid biology/RNG changes merely to satisfy a speed label.

Audit-only real-Chromium feasibility probes reached approximately **39.87-39.99x** on ordinary natural worlds using exact fixed steps and bounded yielding, so a first main-thread implementation is justified.

Heavy population×food states can physically underachieve; 40x is a target, not a universal guarantee.

## Current blocking sequence

1. **M3 repaired machine layer:** complete and qualified, but not promoted.
2. **Honest ~40x execution layer:** next bounded implementation, stacked on the repaired M3 exact boundary.
3. Machine-qualify the x40 layer independently, while rerunning repaired M3 and protected causal gates on the composite candidate.
4. Produce **one** Owner candidate containing repaired M3 + qualified x40.
5. Owner test must include:
   - materially narrow/mobile-like presentation;
   - live wide/narrow/wide continuity;
   - same-seed and new-seed after resize;
   - ordinary controls/pointer behavior if anything appears suspicious;
   - useful ~40x target/achieved behavior and responsiveness.
6. Only after positive Owner evidence may M3 and the dependent fast-forward layer be promoted in provenance order.

## Known cleanup debt before final Owner candidate

- `README.md` still understates current authority/state and must be updated;
- `evidence/m3/M3_OWNER_SMOKE_PARTIAL_2026-09-10.md` contains an obsolete statement that narrow/mobile-like was optional and must be explicitly corrected/superseded;
- historical M3 reports must remain preserved rather than rewritten to pretend they tested the DPR-only path;
- temporary qualification workflows should be removed after their evidence is captured;
- qualification pipelines using output pipes must preserve the tested process exit status.

## Negative decisions

Do not edit frozen V1. Do not clean up Accidental Biology by inertia. Do not restore viewport-driven world sizing. Do not infer logical geometry from recording resolution. Do not normalize biology to area. Do not delete explicit `Simulation.setSize()`. Do not replace fixed `1/60` with a large fast-forward timestep. Do not move to a Worker without evidence. Do not optimize core merely to make a 40x label true. Do not promote M2b. Do not merge PR #11 until the final required Owner product evidence exists.
