# Gloopipelago — M3 Owner Browser Smoke (Partial)

**Date:** 2026-09-10  
**Status:** **PARTIAL POSITIVE OWNER EVIDENCE / POINTER BOUNDARY POSITIVE / RESIZE COMPLETION STILL REQUIRED / PROMOTION GATE OPEN**

## Candidate under test

Machine-qualified standalone candidate:

- SHA-256 `d768b046f205b0c1f5067558829f4ddca7cde102fb1ce3df072c8d199c278394`
- 22,718 bytes
- machine qualification runtime head `31b86e80fc8a1602f351da9d6427db34cd6414d2`

## Evidence supplied by Owner

Owner supplied a desktop screen recording approximately 4m47s long at 1918x906 capture resolution.

The recording is strongly positive evidence for the exact M3 candidate, but it does not visibly demonstrate the required substantial live-resize sequence. It therefore must not yet be interpreted as a full Owner PASS.

## Positive observations visible in the recording

- The product remains responsive and visually stable through a multi-minute live run.
- The test uses a strongly wide desktop presentation, so the fixed 900x700 logical world is exercised under a materially mismatched real viewport shape rather than only at native aspect ratio.
- Full-world `contain` presentation remains legible and does not visibly break under that wide shape.
- Pause/Wznów is exercised.
- `+50 jedzenia` is exercised; the food field visibly rises substantially.
- `Katastrofa` is exercised and produces the expected abrupt population/death response.
- `Nowy seed` is exercised repeatedly; seed changes and worlds restart from a complete framed state.
- `Ten sam seed` is exercised repeatedly; the same-seed restart path visibly resets the world while preserving the seed.
- Simulation speed is moved from 1x to 4x and a substantial later portion of the recording runs at 4x without an obvious responsiveness or stability regression.
- No visible crash, controller lock-up, malformed frame, or obvious presentation discontinuity is observed in the supplied recording.

## Deeper pointer-boundary review

A second, denser review of the recording was performed rather than relying only on sparse contact frames.

For the recorded wide layout, the canvas/UI boundary is approximately x=1602. With the M3 900x700 contain transform, the visible logical world occupies approximately x=218..1384, leaving substantial real pillarbox bands on both sides.

The recording contains a sustained cursor dwell clearly in the left pillarbox at approximately x=211, followed by motion back into the logical world. No local food burst appears in the pillarbox. In contrast, multiple cursor-stationary interactions clearly inside the logical world are followed by immediate local food clusters, consistent with pointer-food insertion.

This comparative behavior is accepted as **positive real-browser evidence for the M3 pointer boundary contract**:

- pillarbox interaction produces no visible pointer-food insertion;
- in-world pointer interaction produces visible food insertion.

The machine qualification already establishes this same boundary exactly at the controller/causal level; the recording now supplies complementary real-browser product evidence.

## Remaining minimum-smoke requirement

The recording does **not** demonstrate a substantial live browser resize from wide to materially narrower/taller and back while preserving the same running world/history.

Dense layout inspection confirms that the recorded page remains at essentially the same wide geometry through the run; there is no hidden material resize sequence that should be credited after the fact.

Because this resize sequence is missing, the protocol-specific check of `Ten sam seed` / `Nowy seed` **after resize** is also still unestablished.

The optional narrow/mobile-like presentation check remains optional and is not independently blocking.

## Decision

**Do not promote M3 yet.**

Owner evidence is now positive for wide-aspect presentation, controls, seed workflows, sustained 4x behavior and real-browser inside/outside pointer behavior. The only remaining Owner completion gate is the live-resize path plus one reset/new-seed check after that resize.

A sufficient final follow-up can be very short:

1. keep the same candidate/world running;
2. resize the browser substantially narrow/tall and then wide again;
3. confirm the world continues rather than resetting/compressing causally;
4. after the resize, trigger `Ten sam seed` once and `Nowy seed` once and confirm both worlds are completely and correctly framed.

If these behave normally and Owner reports no blocking presentation issue, the M3 Owner smoke can be closed as PASS for this exact candidate.
