# Gloopipelago — M3 DPR Repair Machine Qualification

**Date:** 2026-09-10  
**Status:** **M3 REPAIRED MACHINE PASS / OWNER COMPOSITE SMOKE STILL REQUIRED / NOT PROMOTED**

## Why this receipt exists

The skeptical M3 / fast-forward readiness audit found that the earlier M3 machine qualification was too broad in one material respect. The promoted M3 contract required a pure DPR-only presentation transition, but the original campaign exercised DPR together with geometry/manual resize rather than the browser's actual DPR-only observation path.

Real Chrome then demonstrated a product gap: changing device pixel ratio while keeping CSS viewport geometry fixed left the application's backing buffer at the old DPR until the existing resize handler was invoked manually.

The earlier individual M3 test results remain valid evidence for the paths they actually exercised. This receipt does **not** rewrite that history. It supersedes the earlier overall machine-PASS claim for current M3 authority by adding the missing real-browser DPR path and recording the repair.

## Repair boundary

Source M3 branch checkpoint:

`3d868290a151dfc047089e6275d429f39238d53a`

Protected promoted M2a core SHA-256:

`18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`

The final repair changes only browser presentation ownership in `src/browser/app.mjs`:

- DPR is sampled from `devicePixelRatio` with the existing cap of 2;
- every active animation frame checks whether presentation DPR differs from the controller DPR;
- on a mismatch, the existing presentation-only `resize()` path rebuilds canvas backing dimensions and the view transform;
- logical world dimensions, authoritative simulation state, RNG topology and biology are untouched;
- ordinary browser resize remains presentation-only and never calls `Simulation.setSize()`.

A hidden/inactive page does not need an invisible backing-buffer update; the first active rendering frame after return synchronizes current DPR before drawing.

## Failed first repair is preserved

The first repair attempted to depend on a `matchMedia('(resolution: ...dppx)')` change listener.

GitHub Actions run:

- run `34429727210`;
- head `9113127449cddc0f1a41ba6207919db34ac51e21`;
- conclusion **failure**.

The protected M0/M1.1/M2a chain passed, but the new real-Chromium DPR-only gate timed out because the application did not observe the emulated DPR-only transition. The failure was treated as a product repair failure, not relaxed as flaky evidence.

The implementation was changed to active-frame DPR synchronization and the full campaign was rerun.

## Final qualification receipt

Final repair runtime head:

`1411f46831aad00e579c6cf03f36b7fcef1b1001`

GitHub Actions:

- run `34429956481`;
- conclusion **completed / success**;
- Chrome `152.0.7977.82`;
- artifact `m3-repair-qualification`;
- artifact id `10134150422`;
- artifact archive digest `sha256:9adc833e465f0254f834de0e0a8a6c5a1490fd856414258b37cdc6a48784aef5`.

Exact repaired standalone:

- SHA-256 `fb568d1b4fb5f4ed3e584bbab4662ad19339851efc78756c97e242283600e43f`;
- 22,860 bytes;
- app SHA-256 `426ceafc5e7cf1c287a08e62dabef361e8d527c768aae22e768511bfd5637f5a`;
- core SHA-256 remains `18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`;
- view-transform SHA-256 remains `866325b16ccb309b302296ec74627fc72bf56be05147c47c891e8aeecffc32fd`.

Extracted evidence SHA-256:

- `m3-qualification.json`: `01f668ec8c15011bf92b37fcd55153a4df5821229f7be24a23fc0de6f0c41ff4`;
- `m3-browser-qualification.json`: `3f8945cd4af1e2112e3efec303372566119d7c40c870d03a606db044638912ce`;
- `m3-performance.json`: `8311e230a5dd8cf19bdf19d9851514d3c609b63417fbc840cda2344874e1eca7`;
- `candidate-build.json`: `2a08bb1e615af1300995da853b1da4234c7b589674aab2102538881cb024d5c3`.

## Real-browser DPR-only result

At fixed CSS canvas geometry `390x408`:

- initial browser/controller DPR: 1;
- initial backing buffer: `390x408`;
- browser DPR changed to 2 with CSS viewport dimensions unchanged;
- application independently detected the DPR mismatch on the active render path;
- controller DPR became 2;
- backing buffer became `780x816`;
- CSS canvas remained `390x408`;
- full authoritative serialized state before/after was exactly equal.

Result: **PASS**.

This closes the concrete M3-01/M3-02 gap found by the skeptical audit: DPR-only presentation state is now observed without acquiring causal authority.

## Other real-browser M3 gates

PASS:

- wide `1400x800` -> narrow `390x600` while paused: exact authoritative state;
- narrow -> wide return: exact authoritative state;
- narrow letterbox pointer: no food change and no RNG consumption;
- in-world pointer: exactly +18 food;
- no page errors;
- complete 900x700 logical world remains governed by the existing contain transform.

Real Chrome 4x sentinel:

- wall time `2.503917189 s`;
- simulated time `10.000000000000076 s`;
- achieved multiplier **3.9937423026x**;
- accumulator backlog approximately `1.0e-15 s`.

This is achieved-speed evidence separate from the render-controller sentinel.

## Render-controller regression sentinel

Exact pre-repair M3 baseline standalone:

`d768b046f205b0c1f5067558829f4ddca7cde102fb1ce3df072c8d199c278394`

Final repaired candidate paired median frame-time ratio:

**1.0012246264x** (~+0.12%).

Predeclared investigate threshold remained `1.25`.

Result: **PASS**.

## Protected chain

The final successful run re-executed and passed:

- maintained M3 qualification;
- M0 Oracle regression;
- M1.1 maintained-core regression;
- M1.1 RNG accounting;
- M2a witness OFF parity;
- M2a collector parity;
- M2a throwing/mutating/adversarial parity;
- M2a semantic specimens;
- deterministic standalone build;
- real-Chromium M3 gate;
- render-controller performance sentinel.

No core change was made.

## Remaining Owner gate

M3 is now machine-qualified after the discovered DPR defect, but it is still **not promoted**.

The promoted M3 product contract still requires Owner real-browser confirmation of the presentation behavior that the earlier recording did not cover, including a materially narrow/mobile-like view and live wide/narrow resize continuity. The earlier partial Owner recording remains valuable positive evidence for wide presentation, controls, pointer boundary behavior and sustained 4x.

To minimize Owner attention cost, the missing M3 product-feel checks are intentionally deferred to the next composite candidate, which will stack an independently qualified honest ~40x execution capability on this repaired M3 layer. This does not weaken the M3 gate; it only changes which exact candidate will carry the final Owner evidence.

## Verdict

**Repaired M3 machine layer: PASS.**

Do not merge/promote M3 yet. First build and independently qualify the fast-forward layer on top, then present one composite Owner candidate for the remaining M3 presentation checks and the new ~40x workflow.
