# Gloopipelago — M3 / Fast-Forward Readiness Audit

**Date:** 2026-09-10  
**Audit branch:** `audit/m3-fast-forward-readiness-2026-09-10`  
**Source M3 branch checkpoint:** `3d868290a151dfc047089e6275d429f39238d53a`  
**Exact M3 runtime under audit:** `31b86e80fc8a1602f351da9d6427db34cd6414d2`  
**Exact standalone under audit:** SHA-256 `d768b046f205b0c1f5067558829f4ddca7cde102fb1ce3df072c8d199c278394`  
**Status:** **AUDIT COMPLETE / REAL GAPS FOUND / DO NOT PROMOTE M3 YET / REPAIR CAMPAIGN JUSTIFIED**

## 1. Purpose and scope

This was a deliberately skeptical readiness audit before a separate repair/polish/cleanup campaign. It did not authorize production repair and did not modify the M3 runtime candidate.

The audit asked two coupled but distinct questions:

1. Is the current M3 implementation and evidence chain actually as complete as its promoted contract requires?
2. What must be true before the next Owner-tested product can support a meaningful ~40x evolution-observation workflow without lying about speed or changing protected biology?

The Owner has explicitly set a practical product condition: the next version worth another broad real-browser test must include a useful ~40x capability. This audit therefore treats fast-forward as a now-mature workflow requirement, while preserving the M3 contract's rule that fast-forward is a separate implementation lane.

## 2. Final audit receipt

Final comprehensive audit run:

- GitHub Actions run `34429002070` — **completed / success**;
- audit head `82c4519f6639b39c808d26bd7757de6eea484929`;
- Chrome `152.0.7977.64`;
- artifact id `10133764805`;
- artifact archive digest `sha256:f152431d32c861109fa3f3f4d99c2443143dcf9c4becd7a3228f7f674e3a1ae0`;
- 8 artifact files uploaded.

Extracted artifact SHA-256 receipts:

- `fast-forward-readiness.json`: `21f8c98baf6740ddded1cf05f594395827edaef3d2bd33760a4b6c195045b087`;
- `core-load-surface.json`: `853b4fb5df4a59c7252441fa993f8f3aedb374c077383c291a01f97e4e979ccd`;
- `browser-readiness.json`: `7d71281f80ae3cdcd160d6e899933f41530a46a5f31159827f302e182ebf3119`;
- `fast-forward-browser-probe.json`: `16d66744d73243b481c99aa71546c6f97babe54e512a42cf74fa6eeec07aa744`;
- `wide.png`: `ae7afece24ff9088f76bdd758a3de10e5c9e2b2df7bdbca671256488e074ea55`;
- `narrow.png`: `7dee21d78f5d6e9011585f77b72e90e2eb9e4f6a9ca735c6fb45159f2200a857`.

The run also passed the protected M0 Oracle before the audit probes.

## 3. Executive findings

### A. M3 architecture is directionally sound

The central M3 decision survives the audit:

- logical browser world remains fixed at 900x700;
- ordinary CSS viewport resize does not mutate authoritative world state;
- inverse pointer mapping works in wide and narrow real Chromium;
- letterbox/pillarbox space remains non-causal;
- the promoted M2a core remains byte-identical;
- full-world `contain` mechanics work across wide and 390x600 layouts.

The audit found no reason to restore viewport-driven world geometry.

### B. M3 is not currently promotable

A real contract gap exists in DPR-only presentation changes, and the original M3 machine qualification omitted the exact predeclared DPR-only history that would have exposed it.

This means the prior label **M3 IMPLEMENTATION MACHINE PASS** was too broad. Its individual passed tests remain valid evidence, but the implementation did not satisfy the full promoted M3 contract.

### C. The current RAF scheduler cannot honestly provide 40x

Simply extending the speed slider is invalid. The fixed `guard < 20` makes achieved speed dependent on display refresh rate and creates unbounded catch-up debt under overload.

### D. 40x is feasible without changing biology for normal observed worlds

Sequential batching of the existing exact `1/60` step is causally safe when step order and intervention boundaries are preserved. An audit-only decoupled main-thread browser probe achieved approximately 39.87-39.99x on three natural worlds while the existing RAF rendering continued.

No current evidence requires a Worker for the first implementation.

### E. 40x cannot be presented as a universal guarantee

Heavy population×food states can physically underachieve. The product must report **target speed and achieved speed separately** and must never build hidden backlog that later makes a lower selected speed run faster than shown.

## 4. M3 findings

### M3-01 — Pure DPR changes are not observed by the product

**Severity:** BLOCKING M3 CONTRACT GAP  
**Evidence:** real Chrome 152, exact M3 standalone.

At CSS viewport 390x600:

- initial browser DPR = 1;
- canvas CSS size = 390x408;
- backing buffer = 390x408.

Changing only device scale factor to DPR 2 produced:

- browser `devicePixelRatio` = 2;
- application/controller DPR remained 1;
- backing buffer remained 390x408;
- authoritative simulation state remained exact.

After explicitly dispatching the existing `resize` handler:

- controller ingested DPR 2;
- backing buffer became 780x816;
- CSS size remained 390x408;
- authoritative state remained exact.

Therefore the transform/resize handler is correct when invoked. The missing behavior is **DPR-change detection**.

This matters for real presentation because `devicePixelRatio` can change without a CSS viewport resize, for example when browser/OS display scaling context changes. The repair must observe presentation-state changes without giving DPR any causal authority.

### M3-02 — Original qualification omitted a predeclared contract history

**Severity:** BLOCKING EVIDENCE/QUALIFICATION GAP

The promoted M3 contract explicitly required five minimum view histories including:

> DPR-only backing-buffer change without changing CSS logical view size.

`tools/m3.mjs` instead used a fifth geometry history (`desktop -> portrait -> desktop`). The Node DOM smoke also changed DPR together with geometry and manually invoked the resize handler.

Thus the original machine campaign tested handler correctness but not real DPR-only change detection.

The new Chromium audit demonstrates that the omitted case is not redundant: it finds a real product gap.

Repair requirement:

- add a true DPR-only test to the maintained M3 qualification;
- require backing-buffer refresh;
- require zero authoritative state/RNG/lifecycle delta;
- keep CSS/logical view geometry fixed.

### M3-03 — Performance evidence wording was broader than the measured sentinel

**Severity:** EVIDENCE CORRECTION REQUIRED, not a newly demonstrated 4x runtime failure

The M3 contract required both:

- render/frame overhead characterization;
- achieved simulation speed reported separately from render FPS.

`tools/m3-performance.mjs` intentionally paused simulation and measured controller/render traversal. It therefore established render-path regression behavior, not achieved simulation speed.

The missing achieved-speed evidence has subsequently been obtained independently:

- Owner recording: approximately 4.00x over a clean ~60 s wall-time segment;
- Chrome audit: target 4x, wall `3.01179 s`, simulated `12.05 s`, achieved **4.00094x**.

So 4x is now supported, but the historical report should later be corrected to distinguish what the original machine sentinel did and did not prove.

### M3-04 — Owner smoke protocol weakened a promoted contract requirement

**Severity:** GOVERNANCE / GATE DEFINITION DEFECT

The promoted M3 contract requires Owner smoke covering a narrow/mobile-like viewport. The later protocol described that check as optional/“if convenient”. That post-hoc weakening is invalid.

Current Owner recording is strongly positive for:

- wide presentation;
- ordinary controls;
- same/new seed;
- catastrophe;
- +50 food;
- sustained 4x;
- real-browser pointer band/world behavior.

It does not establish the required live wide→narrow→wide Owner product-feel path or reset/new-seed after resize.

Because the next Owner-tested candidate is now expected to include ~40x, the missing Owner M3 presentation smoke should be completed on that composite candidate rather than asking the Owner to test another obsolete pre-fast-forward build.

This does not permit M3 to be promoted before the repaired M3 layer is independently machine-qualified.

### M3-05 — README is stale

**Severity:** NONBLOCKING DOCUMENTATION DEBT

`README.md` authority/state material stops around M2a and does not reflect the promoted M3 contract or current M3 implementation/audit state.

Fix during the planned cleanup/documentation campaign, not as an isolated audit-time edit.

## 5. Evidence-system findings

### EV-01 — Pipeline failure could be masked by `tee`

**Severity:** HIGH PROCESS RELIABILITY

The first real-Chromium audit correctly threw an assertion on DPR-only backing-buffer behavior, but the workflow step appeared successful because it used:

`node ... | tee ...`

without `pipefail`. `tee` returned zero and masked the Node exit status.

The audit workflow was immediately hardened with `set -o pipefail` and subsequent assertions fail the job correctly.

Lesson for the repair/cleanup campaign:

- audit all qualification workflows/scripts that pipe a test process through `tee` or another command;
- a green GitHub job is evidence only if the failure path itself is trustworthy.

Do not rewrite historical receipts; record this as a provenance qualification and harden future gates.

### EV-02 — The audit itself caught and rejected a flawed benchmark

The first synthetic core-load benchmark unintentionally crossed a season boundary, allowing normal seasonal food injection and changing the nominal fixed food counts.

The result was not used for precise thresholds. The harness was repaired to:

- remain within one season;
- use `foodRate=0`;
- keep synthetic food off-world;
- assert exact population and food-count invariance before accepting a measurement.

This is positive evidence that the audit was falsification-oriented rather than merely accumulating green outputs.

## 6. Current scheduler failure at high speed

### FF-01 — Refresh-rate-dependent ceiling

Current browser stepping is tied to `requestAnimationFrame` and capped at 20 fixed steps per rendered frame.

Deterministic scheduler model for requested 40x:

- 30 Hz -> about **10x achieved**;
- 60 Hz -> about **20x**;
- 90 Hz -> about **30x**;
- 120 Hz -> about **40x**;
- 144 Hz -> can sustain the requested 40x in this model.

A speed control with this behavior would make two machines run the same selected “40x” at materially different evolution rates.

### FF-02 — Unbounded catch-up debt

At modeled 60 Hz, requesting 40x for 10 wall seconds:

- simulation advances ~200 s = **20x achieved**;
- accumulator backlog grows to ~200 s.

After switching the UI to 1x for the next 20 wall seconds:

- simulation advances ~220 s;
- effective speed is ~**11x** while old debt is drained.

Real Chrome independently reproduced the same failure mode:

- forced target 40x: **19.96996x achieved**, ~59.992 s backlog after ~3 s;
- then target 1x: **19.96418x achieved** over the next ~2 s, backlog still ~21.992 s.

This is unacceptable requested-speed semantics for an observatory.

### FF-03 — Current wall-delta clamp is an implicit overload policy

The current RAF path clamps raw frame delta to 50 ms before generating simulation time. This silently discards wall time after longer stalls and interacts poorly with hidden-tab/browser throttling semantics.

The fast-forward contract must explicitly decide:

- active-tab target semantics;
- what happens when physical throughput cannot meet target;
- visibility/background behavior;
- whether missed wall time is dropped or caught up;
- how speed changes reset scheduler anchors;
- whether any backlog is permitted at all.

Default recommendation from this audit: **no unbounded catch-up debt and no hidden-tab debt repayment on return**. Background evolution, if ever wanted, should be a separate explicit capability.

## 7. Fixed-step causality evidence

### FF-04 — Sequential fixed-step batching is exact

Across four seeds and 4,800 ticks per run, grouping sequential `step(1/60)` calls into batch sizes:

`1 / 4 / 20 / 40 / 120`

produced exact equality of:

- authoritative causal state fingerprint;
- RNG state.

Therefore fast-forward does not require a larger `dt`. In fact, larger `dt` would alter stochastic and integration semantics and is not allowed.

### FF-05 — Intervention traces remain exact at the same fixed-step boundaries

A stronger test used deterministic intervention traces containing:

- +50 food;
- pointer-style +18 food at fixed logical coordinates;
- catastrophe;
- repeated interventions.

Intervention ticks:

`240, 777, 1200, 1601, 2357, 3000`

Across three seeds and batch sizes:

`1 / 7 / 20 / 40 / 120`

all final full-state fingerprints and RNG states were exact relative to batch size 1.

Qualification:

> batching is causally exact **when an intervention commits immediately before the same numbered fixed step**.

This means the future scheduler needs a well-defined intervention commit boundary and bounded input latency, but batching itself does not need to modify core biology.

## 8. Throughput and load surface

### FF-06 — Natural core has ample headroom

Node/V8 natural-world core-only throughput after warmup in the final audit was approximately:

- seed 1: **392.43x realtime**;
- seed `0x12345678`: **403.99x**;
- seed 956866913: **482.73x**.

These are runner measurements, not browser guarantees. They show that ordinary core stepping is not inherently limited to 4x/20x/40x.

### FF-07 — Cost is dominated by population × food traversal

Core inspection shows every blob traverses the food collection for sensing/target selection and again for consumption checks. The important load surface therefore scales approximately with `population × food`.

A controlled, season-stable Node/V8 matrix measured 20 combinations:

- 19/20 median points were at or above 40x core-only throughput;
- `160 blobs × 500 food`: **41.19x**;
- `260 × 300`: **41.03x**;
- `260 × 500`: **25.33x**.

The two ~41x points have essentially no headroom for rendering/browser overhead. The `260×500` state is physically below 40x before rendering.

Therefore:

- do not promise 40x universally;
- report achieved speed;
- do not optimize the core prematurely merely to make a label true;
- profile real long-running worlds first;
- if heavy real states repeatedly underachieve, spatial indexing or another semantics-preserving food-query optimization becomes evidence-backed work.

## 9. Real-browser decoupled fast-forward feasibility probe

An audit-only prototype paused the existing RAF stepping but left the existing RAF drawing loop active. A separate main-thread scheduler executed the same sequential `step(1/60)` calls in bounded CPU slices and yielded through `MessageChannel`.

This was not a production implementation and must not be promoted as one.

### Natural worlds

Target: 40x.

Achieved:

- seed 1: **39.8963x**;
- seed `0x12345678`: **39.8749x**;
- seed 956866913: **39.9944x**.

RAF p95 interval stayed approximately 16.8 ms. One-second timer lateness was about 0.1-5 ms. This is strong feasibility evidence that first-generation 40x does not currently require a Worker for ordinary worlds.

### Heavy synthetic worlds

With the same continuous render path:

- `160 × 300`: **11.38x**;
- `260 × 300`: **5.07x**;
- `260 × 500`: **3.21x**.

These results are much lower than core-only throughput and therefore show that **render cadence / main-thread rendering cost becomes part of the fast-forward problem under heavy visible states**.

The first product implementation should therefore treat render cadence as an independent budget. At high target speed it may need to draw less frequently while continuing exact fixed-step simulation.

### Prototype defect / non-transferable detail

The audit prototype uses `MessageChannel` to yield. In light natural states it schedules hundreds of thousands of mostly empty tasks because it immediately reposts even when no simulation step is due.

This does not invalidate the feasibility result, but it is a poor product scheduler design. Do not copy it directly.

Production scheduler requirement:

- sleep/wait when ahead of target rather than busy-yield;
- bounded CPU work slices when behind;
- explicit render cadence;
- bounded intervention latency;
- no accumulated historical debt.

## 10. Provisional fast-forward execution contract for repair design

The following requirements are sufficiently evidence-backed to carry into the repair/design phase:

1. Preserve exact `Simulation.step(1/60)` semantics; never implement 40x using a giant `dt`.
2. Decouple simulation stepping from display refresh rate.
3. Treat requested multiplier and achieved multiplier as separate values.
4. Do not accumulate unbounded catch-up debt.
5. Changing speed must not leave old high-speed debt that overrides the new selected speed.
6. Hidden/background browser time must not silently create later catch-up debt. Any future background evolution requires an explicit contract.
7. Owner interventions must commit at an explicit fixed-step boundary; batching must not reorder them.
8. Bound main-thread CPU slices and yield to browser input/render work.
9. Fast-forward rendering cadence may be lower than normal render cadence; rendering must not determine simulation time.
10. Worker architecture remains a fallback/next step, not a first requirement, unless the repaired main-thread implementation fails responsiveness/throughput qualification.
11. Do not change protected biology, RNG topology or fixed-step equations merely to hit the requested multiplier.
12. If the machine cannot sustain target 40x, continue at the physically achieved rate and show that truth instead of accumulating hidden debt.

## 11. Repair/polish campaign boundary

The audit supports a two-layer repair sequence.

### Layer A — M3 contract repair

Bounded to M3 presentation/evidence:

- add real DPR-change observation without causal authority;
- add true DPR-only qualification;
- harden browser qualification against the actual event path;
- reconcile M3 machine-PASS wording with the discovered gap;
- restore Owner smoke requirements to the promoted contract rather than the weakened protocol;
- preserve 900x700 world/view separation and current protected core.

### Layer B — honest ~40x execution capability

Separate capability stacked after the repaired M3 layer:

- introduce a decoupled fixed-step scheduler;
- target at least 40x in ordinary representative worlds;
- show achieved speed;
- remove catch-up debt semantics;
- define visibility/stall behavior;
- preserve exact intervention ordering;
- decouple/reduce render cadence at high speed as needed;
- qualify across multiple synthetic refresh cadences and real Chrome;
- profile heavy states without forcing premature core optimization.

### One Owner candidate, two independently qualified layers

To minimize Owner attention cost while preserving provenance:

- machine-qualify repaired M3 independently;
- machine-qualify the fast-forward layer independently on top;
- produce one composite Owner candidate containing both;
- use that one Owner run to finish M3 narrow/resize product-feel evidence and validate the new ~40x workflow;
- integrate/promote in dependency order rather than treating both changes as one opaque milestone.

This respects both constraints:

- M3 does not silently absorb a scheduler feature;
- the Owner is not asked to spend time testing another version that lacks the now-required fast-forward workflow.

## 12. Negative decisions

This audit does **not** justify:

- restoring viewport-driven world sizing;
- stretching or cropping the logical world;
- changing canonical 900x700 geometry;
- changing biological rates or scaling biology to area;
- changing RNG topology;
- replacing fixed `1/60` with a large timestep;
- immediately moving simulation to a Worker;
- prematurely adding a spatial index before real heavy-state profiling;
- promoting M2b;
- rewriting frozen V1;
- merging PR #11 in its present state;
- claiming the current M3 candidate is fully contract-qualified.

## 13. Audit verdict

**The audit succeeded by finding consequential defects.**

The M3 implementation remains fundamentally valuable and directionally correct, but its full contract was not actually satisfied because DPR-only presentation changes were neither detected by the product nor exercised by the original qualification matrix. PR #11 must remain draft/unmerged until that is repaired and requalified.

The fast-forward investigation also establishes that the next Owner-relevant product should not be made by stretching the existing 4x RAF loop. A real ~40x workflow is technically feasible for normal worlds with exact sequential fixed steps and bounded yielding, but it requires an honest scheduler contract, achieved-speed reporting, no historical debt, and explicit render budgeting.

**Next phase:** separate broad repair / polish / cleanup campaign, grounded in this ledger. No additional Owner test should be requested until the candidate includes the repaired M3 behavior and a qualified useful ~40x mode.
