# Gloopipelago — Honest x40 Machine Qualification

**Date:** 2026-09-10  
**Status:** **MACHINE PASS / COMPOSITE OWNER SMOKE REQUIRED / NOT PROMOTED**

## Qualified layer

Stacked branch:

`x40-honest-fast-forward-2026-09-10`

Repaired M3 dependency boundary:

`ccf1186ab65b3623fa6ef6ce4abf90a483b2e2d0`

Exact machine-qualified x40 runtime head:

`2081e4a1462a52fe20b4c3f8a60ef54a968977ed`

Exact standalone:

- SHA-256 `21bb4518c3cdf2557ebeb008d9cb9bbfee1ff3e45ca06734d535106db6438b46`;
- 26,912 bytes;
- app SHA-256 `ade461fee63fe5a48aecb6eb967e75b437a136a09728f0036cbf1ff9e14b4d4b`;
- promoted M2a core SHA-256 `18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`;
- deterministic standalone build/verify PASS;
- no external scripts.

## Contract

The execution contract was written before implementation results:

`docs/X40_HONEST_FAST_FORWARD_CONTRACT_2026-09-10.md`

The product keeps exact sequential `Simulation.step(1/60)` semantics. Fast-forward is an execution scheduler, not a larger timestep or biology change.

Key policy:

- simulation stepping decoupled from display refresh;
- requested target and achieved speed are separate;
- bounded main-thread CPU slices: 6 ms;
- retained simulation backlog bounded to 0.25 s;
- no historical debt survives speed/pause/reset/visibility transitions;
- hidden tabs do not evolve and create no return-time catch-up debt;
- full rendering above 4x is decoupled to approximately 10 Hz;
- 40x is a target, not a universal guarantee;
- underachievement is reported rather than hidden;
- no Worker or core optimization is introduced without evidence.

## Final machine run

GitHub Actions run:

`34431028119` — **completed / success**

Exact head:

`2081e4a1462a52fe20b4c3f8a60ef54a968977ed`

Artifact:

- id `10134550393`;
- archive digest `sha256:08560d219fc82be71305ff85233ab94025212a6ef2d747b08a101e0bd3daef55`;
- 16 evidence files.

Extracted receipt SHA-256:

- `x40-qualification.json`: `3cb357104c2aa08c5b3aaeee0f977a897293295f202332fad557925d595ed79c`;
- `x40-browser-qualification.json`: `90301f8b13cfa8e2465bef03a1cb7825813508d39992c16de75a78b97fad0b68`;
- composite `m3-qualification.json`: `5b52ba1afa3293dff38fb6f172dc03a60d01273a336151289aa505cb6bcedece`;
- composite `m3-browser-qualification.json`: `062ed494516421185085b6e6de06733e56f07e0a9c328f8551499a80d6919fe8`;
- standalone: `21bb4518c3cdf2557ebeb008d9cb9bbfee1ff3e45ca06734d535106db6438b46`.

Chrome used by the final x40 real-browser gate:

`Chrome/152.0.7977.64`

## Exact causal batching

Machine causal qualification compared batch sizes:

`1 / 7 / 20 / 40 / 120`

across seeds:

- `1`;
- `0x12345678`;
- `956866913`.

Each run used 3,600 exact fixed ticks. A stronger trace also committed interventions immediately before fixed steps:

`240 / 777 / 1200 / 1601 / 2357 / 3000`

For every seed and batch size, both plain and intervention runs produced exact equality of:

- authoritative full-state fingerprint;
- RNG state.

Result: **PASS**.

This demonstrates that sequential batching itself does not change protected causal semantics when intervention boundaries are preserved.

## Real-browser normal-world speed

Target 4x:

- achieved `3.9883877325x`;
- displayed achieved speed `4.00x`;
- draw cadence `59.93 Hz`;
- backlog `0.01427 s`;
- timer lateness `4.1 ms`.

Target 40x, three natural worlds:

| seed | achieved | displayed | draw Hz | backlog | timer lateness |
| --- | ---: | ---: | ---: | ---: | ---: |
| `1` | `39.4388x` | `39.7x` | `9.66` | `0.01067 s` | `0.7 ms` |
| `0x12345678` | `39.6543x` | `39.8x` | `9.99` | `0.01000 s` | `3.9 ms` |
| `956866913` | `39.7444x` | `39.9x` | `9.65` | `0.00733 s` | `2.2 ms` |

All exceed the predeclared ordinary-world gate of **38x**.

The results also demonstrate that high-speed full rendering is materially decoupled from the simulation pump rather than forcing the product to render every fixed step.

## No historical catch-up debt

After a 40x segment, target was changed to 1x.

Measured subsequent speed:

`0.9982807387x`

Final backlog:

`0.00010 s`

Result: **PASS**.

The old RAF scheduler's failure mode — selecting 1x while old 40x debt continues to run at approximately 20x — is absent.

## Pause and visibility semantics

Pause specimen:

- start sim time = end sim time exactly;
- status **PASS**.

Hidden-tab specimen:

- hidden start sim time = `19.800000000000157`;
- hidden end sim time = identical;
- hidden backlog = `0`;
- after returning visible, achieved resume speed = `39.2891x` rather than debt repayment.

Result: **PASS**.

Background evolution remains an explicitly separate future capability, not an accidental side effect.

## Responsiveness

Control-probe event-loop lateness at 40x:

`0.9 ms`

The control transition successfully paused the simulation.

Result: **PASS** against the predeclared bounded-latency gate.

## Heavy-load characterization

Heavy synthetic states intentionally do **not** have a 40x pass requirement. They test whether the product remains honest under physical throughput limits.

Measured:

| population | food | achieved | displayed | backlog | timer lateness | draw Hz |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 160 | 300 | `21.58x` | `21.7x` | `0.0167 s` | `6.2 ms` | `9.96` |
| 260 | 300 | `13.05x` | `13.3x` | `0.1167 s` | `5.2 ms` | `9.42` |
| 260 | 500 | `8.10x` | `7.9x` | `0.1667 s` | `8.6 ms` | `9.97` |

The important result is not that these states reach 40x; they do not. The important result is that:

- backlog remains bounded below the declared 0.25 s cap;
- the UI reports actual underachievement;
- event-loop responsiveness remains bounded in these specimens;
- no biology or RNG rule is changed merely to make the target label true.

This remains a profiling signal. If real long-running Owner worlds repeatedly enter such regimes, semantics-preserving core query optimization can become evidence-backed later work.

## Repaired M3 requalification on the composite candidate

The x40 runtime also reran both maintained and real-browser repaired M3 gates rather than assuming the scheduler layer could not affect presentation.

Composite M3 real-browser result:

- wide -> narrow -> wide paused authoritative state exact;
- pure DPR 1 -> 2 at fixed CSS geometry detected by application;
- backing buffer `390x408 -> 780x816` while CSS remains `390x408`;
- DPR transition authoritative state exact;
- letterbox pointer no-op;
- in-world pointer exactly +18 food;
- achieved 4x `3.9893838338x`;
- no page errors.

Result: **PASS**.

## Protected regression chain

The final run also passed:

- M0 Oracle;
- M1.1 maintained-core regression;
- M1.1 RNG accounting;
- M2a witness OFF parity;
- M2a collector parity;
- M2a throwing/mutating/adversarial witness tests;
- M2a semantic specimens.

The maintained core remains byte-identical to promoted M2a.

## Failed first x40 qualification

The first x40 workflow run:

`34430905494` — **failure**

The new x40 causal/source gate passed, but the old maintained M3 qualifier rejected a brittle literal source shape for the pointer seam after an otherwise semantic-preserving brace/redraw edit.

The historical M3 qualifier was not weakened. The runtime was adjusted to preserve its existing source seam. During that review a separate UX issue was also removed: old sleeping pump timeouts could have delayed `Wznów`/speed transitions by up to roughly 100 ms. The scheduler now cancels the old timeout and wakes immediately on control transitions.

The complete qualification campaign was then rerun from the new exact head and passed.

## Claim boundary

This report supports:

**Honest x40 MACHINE PASS for ordinary representative worlds on the tested real-Chromium environment, with truthful degradation under heavier states.**

It does **not** support:

- universal guaranteed 40x on every machine or ecological state;
- promoted product status;
- final Owner product-feel acceptance;
- a claim that heavy states no longer need future performance work;
- background evolution;
- Worker architecture;
- any new biological semantics.

## Remaining gate

One composite Owner smoke remains before promotion of the dependent layers.

It must complete the still-open M3 product-feel requirements and test the new x40 workflow on the exact standalone SHA-256:

`21bb4518c3cdf2557ebeb008d9cb9bbfee1ff3e45ca06734d535106db6438b46`

Until that evidence is positive:

**M3 remains unpromoted and x40 remains machine-qualified but unpromoted.**
