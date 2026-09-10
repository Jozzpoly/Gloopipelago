# Gloopipelago — Honest ~40x Fast-Forward Contract

**Date:** 2026-09-10  
**Status:** **PREDECLARED IMPLEMENTATION / QUALIFICATION CONTRACT — NOT YET IMPLEMENTED OR PROMOTED**

## 1. Purpose

The Owner has established a practical requirement: the next broad real-browser product test is not worth spending attention on unless it includes a useful ~40x evolution-observation capability.

The prior skeptical readiness audit demonstrated that the existing RAF-coupled scheduler cannot honestly satisfy that need. This contract therefore defines a separate execution layer stacked on the repaired M3 world/view separation. It must accelerate the same simulation semantics rather than create a different fast biology.

## 2. Authority boundary

Base branch/head for this layer:

`m3-logical-world-view-implementation` at `ccf1186ab65b3623fa6ef6ce4abf90a483b2e2d0`

Repaired M3 runtime authority inside that base:

`1411f46831aad00e579c6cf03f36b7fcef1b1001`

Promoted protected core SHA-256:

`18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`

The x40 layer may change browser scheduling, render cadence and speed UI. It must not change core biological equations, RNG topology, logical world geometry, M2a lifecycle semantics or M3 pointer/view authority.

## 3. Fixed-step invariant

All accelerated execution must use the existing sequential:

`Simulation.step(1/60)`

No larger fast-forward timestep is allowed.

Batching means only that multiple ordinary fixed steps may execute during one browser task. Step order must remain identical.

Owner interventions occur between browser tasks and therefore commit before the next fixed step after the event is handled. A batch must never reorder an already-handled intervention behind simulation steps that occur later in the same event-loop chronology.

## 4. Scheduler ownership

Simulation stepping must be decoupled from display refresh / `requestAnimationFrame` frequency.

`requestAnimationFrame` owns presentation opportunity only. It must not determine how many fixed simulation steps are physically permitted per second.

The first implementation should remain on the main thread unless qualification demonstrates that bounded main-thread slices cannot meet the ordinary-world throughput/responsiveness gate. A Worker is a fallback architecture, not a default requirement.

## 5. Predeclared timing policy

Initial implementation constants:

- fixed timestep: `1/60 s`;
- per-task simulation CPU budget: **6 ms**;
- maximum wall-time delta admitted in one scheduler accounting update: **50 ms**;
- maximum retained simulated-time backlog: **0.25 s**;
- high-speed presentation threshold: **>4x**;
- high-speed full draw cadence target: **10 Hz / 100 ms**.

The 0.25 s backlog cap is deliberately small. If the machine cannot physically sustain the requested target, old debt must be dropped rather than accumulated for later repayment. The UI must report underachievement.

The scheduler should sleep/wait when ahead of target instead of continuously reposting empty tasks.

## 6. Debt-reset boundaries

Old timing debt must be cleared and the wall-clock anchor reset on:

- speed multiplier change;
- pause;
- resume;
- same-seed reset;
- new-seed reset;
- visibility transition between hidden and visible.

Selecting 1x after 40x must therefore behave as approximately 1x, not continue paying historical 40x debt.

## 7. Background / hidden-tab semantics

A hidden browser tab does **not** continue authoritative evolution in this first fast-forward layer.

While hidden:

- do not advance simulation because of elapsed hidden wall time;
- do not accumulate debt;
- do not later catch up that hidden duration.

When visible again, reset timing anchors and resume from the state at which active execution stopped, unless the user had explicitly paused the world.

Background evolution, if later desired, requires a separate explicit contract.

## 8. Requested vs achieved speed

The selected multiplier is a **target**, not a guarantee.

The product must expose both:

- target/requested speed;
- achieved simulation speed measured from actual simulation-time progress versus active wall time.

The UI must not display “40x” in a way that implies the machine is achieving 40x when it is physically running at 25x, 10x or another value.

Achieved-speed measurement may be smoothed for legibility, but transitions must reset the meter so historical speed does not contaminate the new target.

## 9. Speed controls

The existing continuous speed control remains compatible with current semantics but may extend through 40x.

The product should also provide quick targets for the high-value Owner workflow, at minimum:

`1x / 4x / 10x / 20x / 40x`

The exact visual arrangement is product polish rather than causal semantics.

## 10. Rendering policy

At ordinary speeds up to 4x, retain the existing normal animation-frame presentation cadence.

Above 4x, full world drawing may be limited to approximately 10 Hz while simulation stepping continues independently. DPR synchronization remains a presentation concern and should still be noticed promptly even if a full world draw is skipped.

This is intentional observatory behavior: at 40x, the priority is to observe long-run evolution honestly and responsively, not to render every intermediate fixed step.

Do not let reduced rendering alter simulation state or RNG consumption.

## 11. Machine qualification — causal

Before product qualification, require exact fixed-step equivalence across multiple seeds and batch sizes, including an intervention trace.

At minimum:

- batch sizes `1 / 7 / 20 / 40 / 120`;
- at least 3 seeds including `1`, `0x12345678`, and Owner-evidence seed `956866913`;
- interventions must include +50 food, pointer-style +18 food at explicit logical coordinates, and catastrophe;
- full authoritative causal fingerprint and RNG state must be exact relative to batch size 1.

No rebaseline is allowed if batching changes the causal result.

## 12. Machine qualification — real browser

Use real Chromium and the generated standalone.

Predeclared ordinary-world gates:

- target 4x: achieved **3.8x–4.2x** over a multi-second window;
- target 40x: achieved **at least 38x** for each of at least three representative natural seeds over a multi-second window;
- 40x -> 1x transition: after meter/reset settling, achieved approximately **0.8x–1.2x** and no inherited large scheduler backlog;
- pause: no material simulation-time advance during a known wall interval;
- no page errors;
- input/control response under ordinary 40x load must remain visibly/automatically bounded rather than starved; use **<100 ms** as the initial investigation boundary for direct control-effect latency where the harness can measure it;
- high-speed full draw cadence must be materially below display refresh and broadly consistent with the 10 Hz target rather than rendering continuously at every RAF.

The repaired M3 real-browser gate must rerun on the composite candidate, including pure DPR-only synchronization and resize/pointer invariance.

## 13. Heavy-load qualification

Heavy synthetic states are characterization, not a requirement that every possible state reaches 40x.

At minimum characterize:

- `160 blobs × 300 food`;
- `260 × 300`;
- `260 × 500`.

Record achieved speed and responsiveness.

A heavy state below 40x does not itself fail qualification if:

- no hidden historical debt accumulates;
- the achieved-speed display tells the truth;
- the browser remains operational/responsive;
- no biological shortcut is introduced.

Repeated underachievement in real, naturally reached worlds may later justify semantics-preserving core optimization such as spatial indexing. It does not justify premature biology changes in this layer.

## 14. Protected regressions

Final composite qualification must rerun:

- repaired M3 maintained tests;
- repaired M3 real-browser gate;
- M0 Oracle;
- M1.1 maintained-core and RNG accounting;
- M2a passive-witness parity/adversarial/specimen gates;
- deterministic standalone build.

Any core hash change reopens the protected core gate and is outside the presumed x40 implementation.

## 15. Owner gate

Do not ask Owner to test an intermediate x40 build merely because it runs.

The next Owner candidate should be one composite build containing:

- repaired machine-qualified M3;
- machine-qualified honest x40 execution;
- cleaned current documentation/README state.

That Owner run will jointly verify:

- materially narrow/mobile-like M3 presentation;
- live wide -> narrow/tall -> wide continuity;
- same-seed/new-seed framing after resize;
- useful target 40x behavior;
- achieved-speed honesty;
- responsiveness/feel while observing long runs.

## 16. Negative decisions

Do not:

- implement 40x by increasing `dt`;
- raise the existing RAF `guard < 20` and call the problem solved;
- accumulate unbounded catch-up debt;
- replay hidden-tab wall time on return;
- make refresh rate part of simulation throughput semantics;
- claim a universal 40x guarantee;
- move to a Worker without evidence;
- optimize or alter biology merely to hit the displayed target;
- modify M2b/history/RNG architecture in this slice;
- merge/promote M3 or x40 before the required Owner product gate.
