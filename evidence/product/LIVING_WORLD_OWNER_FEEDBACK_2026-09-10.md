# Gloopipelago — Owner living-world interest feedback

**Date:** 2026-09-10  
**Status:** PRODUCT GAP EVIDENCE / DOES NOT INVALIDATE M3 OR X40 MACHINE QUALIFICATION

## Exact candidate under review

Composite M3 + honest-x40 Owner candidate:

- runtime head `2081e4a1462a52fe20b4c3f8a60ef54a968977ed`
- standalone SHA-256 `21bb4518c3cdf2557ebeb008d9cb9bbfee1ff3e45ca06734d535106db6438b46`

Owner supplied an approximately 112 s desktop recording and direct product feedback after interacting with this candidate.

## Owner verdict

The world is currently too boring / thin as a living evolution observatory. The concrete complaints are:

- world feels too small;
- too few organisms;
- organisms are visually too similar;
- organism behavior and traits do not diverge strongly enough;
- environment is almost absent;
- the overall experience is too simple, mild and raw.

This is treated as blocking product-direction evidence, not as a cosmetic request.

## Recording observations

The recording supports the complaint rather than contradicting it.

Representative late-run frames show substantial evolutionary time and many generations without corresponding growth in immediately legible ecological novelty:

- around world time ~1432 s: population ~59, max generation ~53, births ~1324, average diet specialization ~0.91;
- around world time ~2411 s: population ~77, max generation ~78, births ~2165, average diet specialization ~0.92.

Despite that evolutionary activity, the visible world is dominated by two spatial/resource-associated color families and large empty regions. This indicates that the problem is not simply insufficient runtime duration.

## Initial causal diagnosis

The maintained core exposes only one behavioral controller for every organism:

1. search visible food;
2. reject insufficiently digestible food;
3. move toward the best acceptable target;
4. otherwise wander;
5. eat on contact;
6. reproduce when energy threshold permits.

The current ecology has two ordinary food kinds and two corresponding patch centers. Browser rendering derives organism color from the one-dimensional diet trait, so evolution is visually encouraged to read primarily as a binary specialist-A / specialist-B split.

Several genome dimensions are weakly or not directly legible in the current renderer:

- `size` affects body radius;
- `speed` affects tail length indirectly through velocity;
- `sense` is shown as a very faint ring;
- `diet` controls body hue;
- `eff` and `wander` have no direct visual encoding;
- inherited genome `hue` is not used for organism body color in the maintained browser renderer.

Therefore the present product can contain genetic change while still looking monotonous.

## Decision

Do **not** respond by merely increasing mutation, founder count, world dimensions or graphical polish without evidence.

The next work begins with a dedicated living-world-interest audit measuring:

- spatial occupancy / emptiness;
- population scale and stability;
- phenotypic spread;
- coarse strategy richness;
- surviving founder-lineage richness;
- convergence toward the current two-specialist attractor;
- which existing parameter changes improve or worsen those quantities.

Only after this audit should a new model-semantic milestone be contracted.

## Important boundary

M3 and x40 remain technically valuable infrastructure. This feedback says the world built on that infrastructure is not yet rich enough to justify broad Owner play, not that the qualified presentation/scheduler semantics are false.
