# Gloopipelago — Post-M2a Integration / Boundary Review

**Date:** 2026-09-10  
**Verdict:** **M2a COMPLETE. M2b DEFERRED. M3 CONTRACT / FEASIBILITY WORK AUTHORIZED. M3 IMPLEMENTATION NOT YET AUTHORIZED.**

## Why this review exists

M2a completed the first passive lifecycle-observation seam after M1/B0. Its promotion deliberately authorized only a new integration/boundary review rather than automatic continuation into lineage retention, UI, world/view changes, fast-forward work or new biology.

This review asks what M2a actually bought us, which unresolved boundary now has the highest leverage, and which apparent next steps are still unsupported.

## What M2a established

M2a now provides detached downstream `founder`, `birth` and `death` observations without demonstrated causal or RNG authority over the world.

The qualified implementation established:

- exact 8-profile causal parity for collector, no-retain, throwing and payload-mutating sinks;
- dense nominal / resize / intervention parity;
- preserved M1.1 and M0 protected regressions and Accidental-Biology specimens;
- nine lifecycle semantic specimen groups;
- caller-owned retention with zero lifecycle history retained by `Simulation`;
- no material witness-OFF performance regression after the predeclared investigation path;
- unchanged browser/controller source and witness-OFF product construction.

The seam is therefore strong enough to support bounded before/after lifecycle evidence without first building a lineage database.

## M2b retention/history — not justified yet

M2a intentionally left retention policy downstream. Nothing in the completed qualification demonstrates that the core or product currently needs a persistent lineage database, event archive, timeline, session ontology or stable serialized lifecycle schema.

A caller-owned collector is sufficient for the next experimental use: comparing lifecycle consequences around an intentional model/apparatus boundary change.

**Decision: defer M2b.**

Reopen it only when a concrete Owner or research workflow requires retained history that cannot be served cleanly by bounded evidence tooling.

## The next demonstrated boundary: viewport currently has causal authority

The maintained browser controller currently does this on every browser resize:

`resize() -> sim.setSize(W, H)`

This is not merely presentation state. `Simulation.width` / `height` affect authoritative dynamics, including:

- founder and low-level spawn coordinates;
- food-patch centers, spread and clamping;
- movement boundary collisions;
- reproduction-position clamping;
- explicit resize interventions already represented in the regression harness.

The browser also constructs each world with the current canvas CSS width/height, so viewport geometry is causal in two distinct ways:

1. **initial viewport authority** — the viewport chooses the world's starting logical dimensions;
2. **resize-time authority** — later browser resizes mutate those logical dimensions during the run.

Therefore viewport size can change the history of a seed. This is a real reproducibility / experimental-control confound, not an architectural-cleanliness argument.

## Critical qualification: world geometry is itself ecological semantics

Decoupling view from world cannot be treated as a zero-semantic renderer refactor.

The current world has fixed founder count, initial-food count and configured food production while encounter distances and available area depend on `width` / `height`. Selecting an arbitrary fixed logical rectangle would therefore alter density, search distances, resource encounter rates and boundary interactions.

For that reason this review does **not** choose `900x700`, the Owner smoke viewport, or any other geometry by convenience.

Likewise, merely stopping `resize()` from calling `sim.setSize()` would remove resize-time authority but would leave initial viewport authority intact. That can be a useful feasibility staging technique, but it is not by itself the full M3 result.

## Why M3 is now the leading Integration-Spine direction

M3 was already identified after M1 as the leading intentional-semantic-change candidate. M2a strengthens that case rather than displacing it:

- the viewport confound is demonstrated in current browser ownership and core semantics;
- future Owner seed comparison and long-horizon observation benefit directly from seed histories that do not depend on window geometry;
- M2a now gives us passive lifecycle evidence for before/after diagnosis;
- M1.1/M0 already provide exact state/RNG/process machinery for proving what remains unchanged;
- postponing M3 while adding more observational/product layers would build on top of an apparatus boundary we already know is causally ambiguous.

**Decision: M3 is the next Integration-Spine subject, but only its contract / feasibility / qualification design is authorized by this review.**

## M3 contract questions that must be resolved before implementation

The next bounded contract/research slice must answer, at minimum:

1. What is the explicit logical-world geometry authority, and how is it chosen without silently changing ecology by convenience?
2. Must the first M3 implementation remove both initial viewport authority and resize-time authority in one qualified epoch, or should a strictly temporary freeze-on-start feasibility specimen be used first?
3. What view transform maps logical coordinates to arbitrary canvas sizes: preserved aspect ratio / letterboxing, cropping, or another explicit rule?
4. How are pointer interventions mapped from view coordinates into logical world coordinates?
5. Does explicit `Simulation.setSize()` remain as a legitimate intentional world intervention for headless experiments even though browser resize stops owning it? The default presumption is yes unless evidence argues otherwise.
6. Which legacy properties remain exact and which divergence is intentionally authorized?
7. How will two different viewport sizes prove identical causal histories for the same logical world, seed and logical interventions?
8. What geometry-sensitivity evidence is required before selecting any canonical logical width/height?

No implementation should start until these are converted into a bounded, falsifiable contract with a qualification matrix.

## Required qualification shape for eventual M3

The eventual M3 gate should preserve at least four evidence classes:

### A. Protected core invariants

M3 must not accidentally change RNG implementation, scheduler order, lifecycle witness passivity, reproduction/death semantics, or unrelated biology.

### B. Viewport-invariance evidence

For the same logical-world configuration, seed and interventions, runs presented through materially different viewport sizes and resize histories must end in identical authoritative causal state and RNG state/call topology.

M2a lifecycle observations should also be exactly concordant for the paired runs when attached by the test harness.

### C. Intentional-divergence accounting

Where M3 deliberately changes browser world geometry relative to the M2a product, evidence must state the precise new authority rather than comparing only screenshots or aggregate outcomes. The new epoch must not be mislabeled as V1-exact under conditions whose semantics were intentionally changed.

### D. Product / interaction mapping

Rendering and pointer-food interventions must be proven to map correctly across aspect ratios and resizes. Visual resize must no longer be a hidden world mutation.

## Other evidence-backed lanes

### Fast-forward / stress mode

Still strongly justified by Owner use of 4x and seed scouting, but not the current foundation gate. M3 should make future performance experiments cleaner by removing viewport geometry as an accidental causal variable.

### Seed provenance / labels / sense-ring controls

Still real product debt. Full seed copyability is especially relevant to experimental workflow, but none of these issues blocks defining the M3 authority boundary.

They should not be bundled into M3 merely because B0 makes browser changes easy.

### Scheduler / Accidental Biology cleanup

Still explicitly out of scope. M3 must not become a pretext to modernize historical scheduler behavior or biology.

## Integration order after this review

Current bounded order becomes:

`M2a promoted -> post-M2a boundary review -> M3 contract / geometry feasibility & qualification design -> fresh authority decision -> only then possible M3 implementation`

M2b remains deferred. Fast-forward and Owner UX remain evidence-backed parallel lanes rather than automatic prerequisites.

## Immediate next bounded action

Prepare and red-team the **M3 Logical World / View Separation contract** from the live M2a-promoted `main` state.

The contract must treat logical geometry selection as a model-semantic decision, not a renderer constant, and must predeclare viewport-invariance, pointer-mapping, protected-core and intentional-divergence gates before runtime code changes.
