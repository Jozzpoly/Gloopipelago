# Gloopipelago — M1.2 Owner Smoke Video Analysis

Date: 2026-09-09
Recording: `187a0c17-124c-4d7c-b37d-0eef8c7d48f3.mp4`
Duration: ~142.8 s, 1918×906, 30 fps. Audio track is effectively silent.
Candidate: M1.2 generated standalone HTML, SHA-256 `9750e602ae61d712c64b046f130dac4c743e718d45c638ff423d5484aed9a5b0`.

## Executive verdict

The recording provides real-browser Owner evidence that the M1.2 candidate runs as a recognizable V1 living world. No blocking visual freeze/crash/regression is visible in the recording. The UI is intentionally raw, but usable enough for active Owner exploration.

This analysis is qualitative product/natural-history evidence, not a controlled ecological experiment. Manual interactions may occur during the session, so causal biological claims must remain bounded.

## Product / throughput evidence

The most important quantitative product result is that requested 4× simulation speed is actually sustained on the Owner machine. At ~20 s of recording the world clock reads 68 s; at ~110 s it reads 428 s. That is +360 simulated seconds across +90 real seconds = exactly 4.00× over that interval.

The run remains active during high load, including population near 193 and large food-count swings. No sustained visual freeze is apparent.

The Owner moves from 1× to the top of the current slider early in the recording and then spends nearly the whole session at 4×. This makes faster-than-4× execution a demonstrated Owner workflow need rather than speculative QoL.

## Long-run natural-history observation

Long observed seed: full seed `956866913` (the sidebar shows only the last six digits, `866913`).

Selected coarse niche counts (A / UI-generalist / B):

- world 68 s: 29 / 27 / 1
- 148 s: 42 / 18 / 2
- 228 s: 56 / 11 / 22
- 308 s: 49 / 3 / 50
- 340 s: 43 / 3 / 104
- 356 s: 87 / 3 / 103
- 372 s: 68 / 0 / 45
- 404 s: 66 / 0 / 36
- 420 s: 54 / 0 / 35
- 428 s: 56 / 0 / 35

This is not a monotonic single-strategy climb. One specialist branch approaches near-loss early, later recovers strongly and becomes dominant, while the other subsequently rebounds. The coarse middle class eventually disappears. This is qualitatively consistent with strong context/season/spatial dependence and the prior headless evidence for two-sided specialization, but the recording alone cannot distinguish seasonal effects, density dependence, founder history, frequency dependence, or Owner intervention.

Selected mean-trait movement from the fresh run to ~428 s shows strong live evolutionary change: speed rises from roughly 0.93 to 1.49, sense from ~72 to 94, size falls from ~5.0 to 4.1, efficiency rises from ~0.96 to 1.15, and diet-specialization metric rises from ~0.51 to 0.89. This visually confirms that the selection pressure previously measured headlessly is present in the actual browser product.

## Population/resource pulse

The recording shows a large pulse around world time 340–372 s:

- 340 s: population 150, food 573, births 417
- 356 s: population 193, food 65, births 485
- 372 s: population 113, food 9, births 544

Between 356 and 372 s there are +59 births but net population -80, implying roughly 139 deaths over that interval if no hidden population reset occurred. This is a very strong mortality/resource-depletion pulse. It is valuable natural-history evidence, but not yet a controlled claim about its cause.

## Rapid seed-sweep workflow

The last ~30 s demonstrate a distinct Owner workflow: rapid New Seed scouting at persistent 4× speed. At least eight distinct full seeds are visible:

- `3667069675`
- `4081577095`
- `2929087554`
- `2006780008`
- `1335852448`
- `1615210584`
- `2147113243`
- `4081330723`

Fresh coarse A/G/B mixes vary substantially (for example 5–13 A specialists, 12–20 UI-generalists, 7–13 B specialists in sampled fresh starts), confirming appreciable standing founder variation. Several worlds produce generation 1–2 within only ~2–3 simulated seconds, which reinforces that current life-history/reproduction semantics allow extremely rapid generational turnover.

The speed multiplier persists across New Seed resets, which is good for this workflow.

## Newly exposed interpretive/provenance debts

### 1. Sidebar seed is truncated

The sidebar deliberately renders `String(seed).slice(-6)`. Example: full seed `956866913` appears as `866913`.

For casual play this is harmless. For Owner seed scouting it is a real reproducibility defect: noting the sidebar value is insufficient to reconstruct the same 32-bit seed. The tiny top-left overlay does show the full seed, but that is poor provenance ergonomics.

Future need: show/copy the full seed, and likely support recent-seed/bookmark history once the naturalist workflow is expanded.

### 2. `max generacja` is not historical maximum

The UI value drops from 25 to 24 and later returns to 25. Code confirms it is the maximum generation among currently living blobs, not all-time maximum.

The current label can therefore be misread as evolutionary progress regressing. Future wording should distinguish `highest living generation` from historical maximum if both are useful.

### 3. UI `generalista` is an interpretive classifier, not functional generalism

The overlay calls `|diet| <= 0.5` generalist. Earlier digestion analysis established that, under the current exponent/gate, consuming both ordinary food kinds is only possible in roughly `|diet| <= 0.118`.

Therefore the overlay's middle class must not be used as direct biological evidence of functional generalism. The recording makes this debt prominent because the A/G/B counts are highly visible during seed scouting.

### 4. Sense-ring clutter grows with evolved sense/population

Large overlapping sense rings become visually dominant in mature/high-population states. This is not a M1.2 blocker, but it is a concrete reason the current interface feels raw and may later deserve a visibility/opacity toggle rather than a redesign of the world.

## Faster-than-4× implication

The Owner request for 10×/20× (or more) is strongly supported by observed behavior: the session uses 4× almost continuously, both for long-horizon observation and rapid seed scouting.

However the current browser loop has a hard `guard < 20` simulation-step cap per render frame. With a 1/60 fixed step:

- at 60 render fps, 20× requires the full 20-step budget every frame and has no timing slack;
- at 30 render fps, 10× already requires the full 20-step budget;
- speeds materially above 20× cannot be honestly sustained by the current loop regardless of CPU without changing the stepping/render strategy.

Therefore the later feature should not be implemented as merely extending the slider. A better direction is a dedicated fast-forward/stress mode that decouples simulation stepping from render cadence, renders less frequently, and reports achieved/effective simulation speed rather than only requested speed. Auto-pause at a target world time and recent-seed/bookmark support would fit the observed Owner workflow especially well.

## Scope / caveats

The recording is strong evidence for real-browser execution and Owner usability, but it does not by itself provide:

- controlled causal ecological evidence;
- console-error evidence;
- a meaningful resize stress test (recorded viewport is effectively constant);
- proof that every UI control was manually exercised during this recording.

Node contract smoke already covers the wiring of pause, speed, food burst, pointer food, catastrophe, reset and new seed; this video adds the missing real-browser/living-world evidence.

## Recommended M1.2 interpretation

Treat the real-browser blocker as cleared: the candidate visibly runs and remains recognizably V1. No blocking regression is apparent. Preserve the recording findings as Owner evidence and keep the new UX/provenance issues as later debt rather than broadening M1.2.

Do not use this recording to justify new biology or architecture. In particular, do not implement x10/x20, seed history, lineage, world semantics, or classifier changes inside M1.2.
