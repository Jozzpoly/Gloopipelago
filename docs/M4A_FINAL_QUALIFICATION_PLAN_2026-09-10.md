# Gloopipelago — M4a final qualification execution plan

**Date:** 2026-09-10  
**Status:** **PREDECLARED BEFORE FINAL-CANDIDATE RESULTS**

## Exact candidate under test

- logical world: `1200x900`;
- founders: `66`;
- initial food: `275`;
- food rate: `18.5/s`;
- food lifetime: `75s`;
- population cap: historical `260`, unchanged;
- eight stable habitat centres;
- food kinds A/B each represented in four habitats;
- each food kind has two dense (`spread=.035`) and two diffuse (`spread=.12`) habitats;
- fixed `Simulation.step(1/60)` semantics;
- no new organism controller, trait, predation or direct organism-organism interaction.

The candidate was selected from the bounded 900s/1800s budget sweep recorded in `evidence/m4a/M4A_BUDGET_SELECTION_2026-09-10.md`.

## Qualification seeds

The final 1,800s campaign uses exactly eight deterministic seeds:

`1, 0x12345678, 956866913, 0x9e3779b9, 42424242, 0xdeadbeef, 0xcafebabe, 20260910`

The first three are extended continuously to 3,600 simulated seconds:

`1, 0x12345678, 956866913`

These are declared before the final-candidate runs.

## Metric semantics

Metrics preserve the definitions used by the living-world audit:

- occupied fraction: occupied cells in a normalized `12x9` world grid;
- effective strategy count: entropy-effective count of coarse 3-bin signatures across `speed/sense/size/eff/wander/diet`;
- founder roots: lifecycle-witness ancestry;
- effective lineage count: entropy-effective current-population distribution across founder roots.

For lineage gates, **only roots descending from the initial M4a founders count**. Auto-reseed founders are tracked separately and may not rescue an extinction/collapse into a passing lineage metric.

Strategy retention is calculated per seed as:

`effectiveStrategies@1800 / effectiveStrategies@600`

and the campaign metric is the median of those eight per-seed ratios.

## Hard 1,800s gates

The candidate must satisfy all predeclared M4 contract thresholds:

- median occupied fraction `>= .25`;
- median effective strategies at 1,800s `>= 10`;
- median 600->1800 strategy-retention ratio `>= .65`;
- median active original founder roots `>= 3`;
- median effective original lineage count `>= 2.2`;
- no more than `2/8` seeds with `<=1` active original founder root.

Population is characterization, not a pass criterion.

## 3,600s red-team rule

The three extended seeds are primarily long-horizon characterization because the M4 contract did not predeclare a separate 3,600s numeric diversity threshold.

To prevent an obviously collapsing candidate from passing on a transient 1,800s window, one additional predeclared hard-stop rule is used:

**Reject the candidate if at least 2 of the 3 extended seeds either undergo total extinction before 3,600s or end with <=1 active original founder root.**

Other 3,600s metrics remain characterization and must be reported without moving thresholds after results.

## Extinction / auto-reseed accounting

Every run reports:

- extinction count;
- whether auto-reseed occurred;
- active original founder roots;
- active auto-reseed roots.

An extinction cannot silently create a fresh set of founders and thereby inflate the founder-persistence metric.

## Population-cap characterization

Every ecology run records:

- maximum population reached;
- fraction of fixed ticks at the existing cap 260.

The cap remains unchanged for this M4a candidate. Frequent cap contact is evidence for a later bounded cap/performance investigation, not permission to raise it during this qualification.

## Paired local-adaptation control

The same eight seeds are run through:

1. the exact heterogeneous dense/diffuse M4a candidate;
2. a paired uniform-spread control using the exact same eight habitat positions, kinds and regime labels but `spread=.075` for every habitat.

The candidate must satisfy the existing M4 contract:

- median diffuse-minus-dense speed `>= +.20`;
- median diffuse-minus-dense sense `>= +5`;
- median diffuse-minus-dense size `<= -.60`;
- at least `6/8` seeds show the expected sign simultaneously for speed, sense and size.

To make "materially larger than spatial sorting in the control" falsifiable before results, this plan additionally predeclares a conservative control-subtracted gate based on the earlier exploratory effect size:

`heterogeneous local delta - uniform local delta`

must have median:

- speed `>= +.10`;
- sense `>= +2.5`;
- size `<= -.30`;

with at least `5/8` seeds showing those three control-subtracted signs simultaneously.

These thresholds are intentionally below the exploratory three-seed effects, leaving room for wider seed variance while still requiring a real habitat-regime contribution.

## Construction / determinism gate

Before ecological outcome gates, qualification must prove:

- exactly 66 initial lifecycle founder events and no witness-visible transient base-construction founders;
- exactly 275 initial food items;
- dimensions exactly 1200x900;
- same-seed construction is full-state + RNG exact;
- same-seed reset returns to the same full initial state + RNG;
- the historical `src/core/v1-mirror.mjs` SHA-256 remains `18e7ed7dea643008eeaa7e0c037708a23e9fcdf0c78d1dcb825aa5bc9a497c56`;
- protected M0/M1.1/M2a process regressions remain green on the historical path.

## Browser / x40 gate after headless ecology PASS

Do not integrate M4a into the browser merely because the module exists. Browser integration begins only after the above headless candidate passes.

The eventual exact browser candidate must then prove:

- view transform uses the new 1200x900 logical authority without restoring viewport authority;
- DPR-only, resize and pointer semantics remain correct;
- habitat presentation corresponds to the actual eight habitats rather than the old two-patch drawing;
- fixed `1/60` x40 scheduler/debt/visibility semantics remain intact;
- eight natural M4a browser specimens target median achieved `>=35x`, none below `30x` on the qualification runner;
- performance underachievement is reported honestly;
- standalone build is deterministic.

No Owner build is produced until headless ecology, browser integration and later M4b phenotype-legibility qualification are all complete or a focused diagnostic genuinely requires Owner judgement.
