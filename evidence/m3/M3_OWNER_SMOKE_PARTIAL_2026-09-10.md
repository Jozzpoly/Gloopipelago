# Gloopipelago — M3 Owner Browser Smoke (Partial)

**Date:** 2026-09-10  
**Status:** **PARTIAL POSITIVE OWNER EVIDENCE / POINTER BOUNDARY POSITIVE / NARROW + RESIZE COMPLETION STILL REQUIRED / PROMOTION GATE OPEN**

## Correction after skeptical contract audit

This partial receipt was originally written with an incorrect statement that the narrow/mobile-like presentation check was optional. The promoted M3 contract actually requires that product-smoke dimension. The later skeptical M3 / fast-forward readiness audit identified the discrepancy.

The historical Owner observations below remain valid evidence. The corrected current interpretation is:

- narrow/mobile-like presentation remains required;
- substantial live wide -> narrow/tall -> wide continuity remains required;
- same-seed/new-seed behavior after resize remains required;
- these remaining checks will be performed on the next composite repaired-M3 + ~40x candidate, rather than asking Owner to test another obsolete pre-fast-forward build.

This correction does not retroactively claim evidence that was not present in the recording.

## Candidate under test

Original M3 standalone candidate used in the recording:

- SHA-256 `d768b046f205b0c1f5067558829f4ddca7cde102fb1ce3df072c8d199c278394`;
- 22,718 bytes;
- original machine qualification runtime head `31b86e80fc8a1602f351da9d6427db34cd6414d2`.

A later skeptical audit found that this candidate lacked natural DPR-only presentation synchronization. That defect is separate from the Owner-visible observations captured here and has since been repaired/machine-qualified on the M3 repair layer. This receipt therefore remains **partial historical Owner evidence**, not current complete M3 qualification authority.

## Evidence supplied by Owner

Owner supplied a desktop screen recording approximately 4m47s long at 1918x906 capture resolution.

The recording is strongly positive evidence for the exercised paths, but it does not visibly demonstrate the required substantial live-resize sequence or a materially narrow/mobile-like product presentation. It therefore must not be interpreted as a full Owner PASS.

## Positive observations visible in the recording

- The product remains responsive and visually stable through a multi-minute live run.
- The test uses a strongly wide desktop presentation, exercising the fixed 900x700 logical world under a materially mismatched real viewport shape.
- Full-world `contain` presentation remains legible and does not visibly break under that wide shape.
- Pause/Wznów is exercised.
- `+50 jedzenia` is exercised; the food field visibly rises substantially.
- `Katastrofa` is exercised and produces the expected abrupt population/death response.
- `Nowy seed` is exercised repeatedly; seed changes and worlds restart from a complete framed state.
- `Ten sam seed` is exercised repeatedly; the same-seed restart path visibly resets the world while preserving the seed.
- Simulation speed is moved from 1x to 4x and a substantial later portion of the recording runs at 4x without an obvious responsiveness or stability regression.
- No visible crash, controller lock-up, malformed frame, or obvious presentation discontinuity is observed in the supplied recording.

## Deeper pointer-boundary review

A denser review of the recording was performed rather than relying only on sparse contact frames.

For the recorded wide layout, the canvas/UI boundary is approximately x=1602. With the M3 900x700 contain transform, the visible logical world occupies approximately x=218..1384, leaving substantial real pillarbox bands on both sides.

The recording contains a sustained cursor dwell clearly in the left pillarbox at approximately x=211, followed by motion back into the logical world. No local food burst appears in the pillarbox. In contrast, multiple cursor-stationary interactions clearly inside the logical world are followed by immediate local food clusters, consistent with pointer-food insertion.

This comparative behavior is accepted as positive real-browser evidence for the exercised M3 pointer boundary:

- pillarbox interaction produces no visible pointer-food insertion;
- in-world pointer interaction produces visible food insertion.

Machine qualification independently establishes the causal boundary exactly; the recording supplies complementary product evidence.

## Still-unestablished Owner product checks

The recording does **not** establish:

1. a materially narrow/mobile-like presentation;
2. a substantial live browser resize from wide to narrow/tall and back while preserving the same running world/history;
3. `Ten sam seed` and `Nowy seed` after such a resize.

Dense layout inspection confirms that the recorded page remains at essentially the same wide geometry through the run; there is no hidden material resize sequence that should be credited after the fact.

## Current decision

**Do not promote M3 yet.**

The later DPR repair now has independent machine PASS, but the missing Owner product-feel requirements above remain open. They will be tested once on the next composite candidate that also contains an independently qualified useful ~40x execution mode, minimizing Owner attention cost without weakening the M3 contract.
