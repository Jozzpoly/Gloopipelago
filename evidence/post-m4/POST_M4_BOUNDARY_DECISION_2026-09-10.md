# Gloopipelago — Post-M4 boundary decision

**Date:** 2026-09-10  
**Status:** **BOUNDARY REVIEW COMPLETE / DYNAMIC HABITAT MEMORY PROBE REJECTED / COMPOSITE OWNER TEST NEXT**

## Decision

Do not delay the next Owner test for a Dynamic Habitat Memory implementation.

After M4a Ecological Mosaic and M4b Living World Legibility reached separate machine qualification, one remaining high-value concern was tested: habitats have meaningful geography but no local memory of recent exploitation.

A separately isolated audit branch tested a minimal memory family before any M5 product code was authorized:

`m5a-dynamic-habitat-memory-audit-2026-09-10`

Predeclared plan commit:

`6c0ee2f13f79737ef1f52d499d5749e8754bb18c`

Probe execution head:

`6edd0d90161b367326f47061e09d309c03011ed2`

Actions run:

`34482766108` — completed / success as experiment execution.

Artifacts:

- structural id `10154311306`, digest `sha256:d96b9807ec2faf23498ae8cc09dc35a0327b578b43d41750d84708249ebcbef7`;
- matrix id `10154441184`, digest `sha256:ce0b01f08dbf63318fdf32e66514d069b4c19ea7606606ac3d0151a5942ac083`.

The audit branch final report is:

`evidence/post-m4/POST_M4_BOUNDARY_REVIEW_2026-09-10.md`

on that audit branch.

## Structural validity

Memory-disabled probe instrumentation reproduced exact M4 serialized causal state and RNG state for three seeds across 36,000 fixed ticks. Protected M0 and M4 construction checks also passed.

Thus the negative result is not attributable to probe instrumentation perturbing the control.

## Why the tested memory family was rejected

No tested profile passed the predeclared go/no-go.

Paired medians versus static M4 control:

| profile | habitat occupancy turnover | habitat food turnover | strategy diversity | founder-root delta |
|---|---:|---:|---:|---:|
| gentle | `1.109x` | `0.942x` | `1.053x` | `+1` |
| medium | `0.988x` | `1.074x` | `1.033x` | `0` |
| strong | `1.071x` | `0.991x` | `0.746x` | `-1` |

Required screens were at least `1.15x` occupancy turnover and `1.20x` food turnover while preserving ecological quality.

The more important mechanistic result is saturation:

- gentle: ~96.7% of sampled habitat productivity values sit within 0.02 of the 0.45 floor;
- medium: ~99.5% sit within 0.02 of the 0.30 floor;
- strong: ~88.8% sit within 0.02 of the 0.18 floor and one seed becomes pathological.

The tested scalar model therefore tends to push most habitats down together. Once comparable habitats sit at a common floor, weighted future placement becomes nearly uniform again, so the new state variable adds little durable temporal geography.

The strong profile also produced one seed with population 67, one surviving original founder root and maximum standing food 853. That is a clear rejection signal rather than useful dynamics.

## Scope of the negative result

This does **not** prove that places with ecological memory are a bad direction.

It rejects only this tested family:

> recent consumption lowers a scalar habitat productivity value, which then only reweights future same-kind food placement while the global event budget remains fixed.

A future epoch may revisit truly local resource stocks, capacity-normalized depletion, explicit renewal or other consumer-resource feedback, but that requires a new hypothesis and contract. It must not be smuggled into M4 as tuning.

## Current-best product decision

M4 now has sufficient evidence to justify spending Owner attention:

- larger 1200x900 living world;
- 8 meaningful habitats;
- materially higher spatial occupation;
- stronger long-horizon strategy and lineage persistence;
- repeatable local speed/sense/size differentiation;
- honest ~40x on evolved worlds;
- visual treatment that exposes phenotype and geography without altering biology.

Therefore:

> **The next broad action is the exact qualified M3 + x40 + M4a + M4b composite Owner test.**

No M5 biology, M2b, predation, sociality, mating, weather, terrain physics or new genes should be inserted before that test.
