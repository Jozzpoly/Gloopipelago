# Gloopipelago — M3 Owner Browser Smoke (Partial)

**Date:** 2026-09-10  
**Status:** **PARTIAL POSITIVE OWNER EVIDENCE / PROMOTION GATE STILL OPEN**

## Candidate under test

Machine-qualified standalone candidate:

- SHA-256 `d768b046f205b0c1f5067558829f4ddca7cde102fb1ce3df072c8d199c278394`
- 22,718 bytes
- machine qualification runtime head `31b86e80fc8a1602f351da9d6427db34cd6414d2`

## Evidence supplied by Owner

Owner supplied a desktop screen recording approximately 4m47s long at 1918x906 capture resolution.

The recording is positive evidence for the exact M3 candidate, but it does not visibly demonstrate every required minimum-smoke step. It therefore must not be interpreted as a full Owner PASS.

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

## Minimum-smoke requirements not established by this recording

The recording does **not** provide sufficiently clear evidence for the following required gates:

1. A substantial live browser resize from wide to materially narrower/taller and back while preserving the running world/history.
2. An unambiguous pointer-boundary test where a click clearly inside visible letterbox/pillarbox space produces zero food and a click clearly inside the logical world produces pointer food.
3. Because (1) is not demonstrated, the protocol-specific check of `Ten sam seed` / `Nowy seed` *after resize* is also not directly established.

The optional narrow/mobile-like presentation check is also not visibly covered, but it is not independently blocking.

## Decision

**Do not promote M3 yet.**

This recording materially reduces product risk and is strongly positive Owner evidence, especially for wide-aspect presentation, controls, seed workflows and sustained 4x behavior. The remaining Owner gate should be completed with a short targeted follow-up rather than repeating the full smoke.

A sufficient follow-up can be brief:

- resize the same running candidate substantially narrow/tall and back wide;
- in the mismatched viewport click once clearly in a band and once clearly inside the world;
- after that resize, trigger `Ten sam seed` and `Nowy seed` once each.

If these behave normally and Owner reports no blocking presentation issue, the M3 Owner smoke can be closed as PASS for this exact candidate.
