# Gloopipelago — M3 + x40 + M4a + M4b composite Owner test

**Date:** 2026-09-10  
**Status:** **OWNER PRODUCT GATE / EXACT QUALIFIED CANDIDATE REQUIRED**

## Exact candidate

Use only the standalone produced by accepted M4b v2 qualification run `34477849280`.

SHA-256:

`656ede3b409d9d2f3f4a5445b3e1a526c7c6c799be83d6245d42c1272799af6f`

Size:

`33,989 bytes`

This candidate contains the separately qualified dependency stack:

M3 repaired world/view separation -> honest x40 -> M4a Ecological Mosaic -> M4b Living World Legibility.

Do not substitute a rebuilt or later-edited HTML without re-verifying the hash.

## Purpose

This is primarily a **product / living-world judgement**, not another machine test performed manually.

The central question is:

> Does Gloopipelago now feel materially more alive, differentiated and worth observing than the version the Owner rejected as small, sparse, visually homogeneous and environmentally shallow?

A negative answer overrides green CI.

## Recommended use

Play/observe naturally rather than following a rigid checklist.

A useful session is several real minutes with substantial use of 40x so the world reaches hundreds or thousands of simulated seconds.

Suggested things to do naturally during that session:

- let one seed develop at 40x and watch whether different local populations/habitats remain worth following;
- occasionally return to 1x or 4x to inspect organism morphology/movement;
- try another seed rather than judging only one deterministic history;
- use +50 food, pointer food and Catastrophe if they help explore responses;
- pause/resume;
- resize wide -> materially narrow/tall -> wide at least once;
- after a resize, try Ten sam seed and Nowy seed once;
- briefly notice whether target-vs-achieved speed remains believable and whether 40x -> 1x feels immediate rather than continuing to race.

Do not spend Owner attention reproducing every DPR/pointer edge case already covered by real-Chromium qualification unless something looks wrong.

## Product questions that matter most

No formal scoring is required. The highest-value observations are:

### Living-world interest

- Is the world still boring after the novelty of the new rendering wears off?
- Does 40x reveal meaningful changes, or merely faster noise?
- Do different areas begin to feel like places with distinct ecological outcomes?
- Can you notice local population histories, expansions, collapses or replacements without staring only at aggregate numbers?

### Organism differentiation

- Do gluts now look different enough to become individually/locally interesting?
- Can size / speed-like morphology / sense cue differences be noticed at ordinary world scale?
- Does the main diet color remain readable rather than becoming visual soup?
- Is any visual cue annoying, misleading or too noisy?

### Environment

- Do the eight habitat fields help the world read as ecological geography rather than debug graphics?
- Does the environment still feel fundamentally too static/shallow despite the mosaic?
- Are there too many empty/uninteresting regions, or does the larger world feel appropriately populated?

### Interaction and usability

- Does x40 make experimentation materially better?
- Is the world still readable while running fast?
- Does wide/narrow/mobile-like framing feel natural enough?
- Do controls remain responsive and understandable?

## Strong negative signals

Treat any of these as meaningful failure evidence:

- after several thousand simulated seconds the result still feels like only two colored swarms;
- visually different gluts do not correspond to differences you can actually perceive in their movement/ecological context;
- habitat rendering is decorative but habitat structure is not experientially apparent;
- 40x makes the simulation fast but not more informative;
- the larger world merely spreads the same old simplicity over more pixels;
- any presentation or control issue makes observation tedious;
- the Owner simply does not feel motivated to keep watching or experimenting.

## Evidence format

A short textual verdict is enough if the result is clear.

A screen recording is especially valuable if:

- something looks wrong but is hard to describe;
- the world is still boring and the reason emerges gradually;
- an interesting emergent event occurs;
- resize/mobile presentation behaves strangely;
- visual clutter or morphology is difficult to explain in words.

Do not optimize the recording for us. Natural use is better evidence than performing a scripted demo.

## Promotion rule

No dependency PR is merged before this product gate is positive.

If Owner judgement is positive, first reconcile exact provenance and promote dependencies in order:

1. PR #11 — repaired M3;
2. PR #12 — honest x40;
3. PR #13 — M4a Ecological Mosaic;
4. PR #14 — M4b Living World Legibility.

After each promotion, verify live `main`/base/head ancestry before continuing.

If Owner judgement is negative, do not merge the stack. Reopen only the layer implicated by the feedback and preserve this candidate/result as historical evidence.
