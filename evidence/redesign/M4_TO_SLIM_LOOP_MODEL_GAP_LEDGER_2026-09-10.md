# Gloopipelago — M4 -> Slim-Loop Model Gap Ledger

**Date:** 2026-09-10  
**Branch:** `genome-embodiment-redesign-audit-2026-09-10`  
**Status:** ANALYSIS / NO PRODUCT IMPLEMENTATION

## Executive finding

M4 improved the ecology around the organism but left the organism's **space of possible lives** narrow.

The central failure is not that seven genes are too few. It is that almost every gene is a **direct scalar modifier inside one shared behavioral algorithm**. The genotype-to-life mapping has low expressive rank.

A compact genome remains desirable, but compactness must mean **compressed generative/regulatory information relative to expressed complexity**, not merely a short list of independent sliders.

## Owner evidence

The exact M4 composite received PRODUCT FAIL after ~6m38s of varied real-browser testing.

Cross-sectional video review shows changes in abundance, clustering, local phenotype proportions and resource use, but not the appearance of qualitatively new classes of action or organism-environment relationship.

Canonical receipt:

`evidence/owner/M4_COMPOSITE_OWNER_FAIL_2026-09-10.md`

## Current M4 life loop

The maintained core provides one universal policy:

1. scan all food entities within circular `sense` radius;
2. discard insufficiently digestible food;
3. select the best distance/digestion target;
4. accelerate toward it;
5. if no target exists, execute correlated random wander;
6. consume automatically on overlap;
7. lose energy through a scalar metabolic equation;
8. reproduce automatically above an energy threshold;
9. die from energy depletion or age;
10. sometimes leave a rich food item on death.

M4 changes the initial condition and spatial food generator, not this organism policy.

## Missing-link ledger

| Intended layer | M4 status | Severity | Why it matters |
|---|---|---:|---|
| compact inherited genotype | PRESENT but direct | HIGH | genes mostly equal independent knobs |
| genotype -> developmental expression | ABSENT | CRITICAL | no reuse, regulation, pleiotropic development or ontogeny |
| functional body / affordances | VERY WEAK | CRITICAL | body size affects formulas; organisms do not possess different functional effectors |
| local perception | WEAK / ORACLE-LIKE | HIGH | food list is globally scanned inside radius; no environmental gradients/traces/organism sensing |
| action repertoire | NEAR-ABSENT | CRITICAL | policy controls movement direction; feeding/reproduction are automatic |
| lifetime-acquired state | ABSENT except generic physiology | CRITICAL | no learned preference, habituation, recent-reward memory or plastic state |
| inherited learning/plasticity capacity | ABSENT | HIGH | no separation between evolved capacity and acquired experience because experience is absent |
| organism-organism interaction | INDIRECT ONLY | CRITICAL | competition occurs only through removal of food |
| organism-driven environment modification | NEAR-ABSENT | CRITICAL | living organisms do not construct persistent local state; corpse-food is passive and stochastic |
| ecological inheritance | ABSENT | CRITICAL | later organisms do not experience persistent constructed legacies |
| reciprocal eco-evolutionary feedback | VERY WEAK | CRITICAL | environment selects for foraging parameters but evolved organisms do not systematically reshape future selection |
| behavioral evolution | WEAK | CRITICAL | evolution changes capacities inside one fixed policy rather than producing different policies/strategies |
| morphology-controller coupling | WEAK | HIGH | controller is largely independent of actual body organization |
| explicit fitness function | ABSENT (GOOD) | POSITIVE | reproduction/survival remain ecological rather than externally scored |
| deterministic stepping/provenance | STRONG | DONOR | retain wherever possible |
| fast-forward observation | STRONG | DONOR | x40 is valuable for long-horizon redesign experiments |

## Why 'more genes' is not the answer

Adding `aggression`, `sociality`, `memory`, `toxin`, `armor`, `trail`, `vision`, etc. as independent sliders could produce a larger settings panel while preserving the same structural failure.

A useful slim genome should exhibit at least three properties:

### 1. Pleiotropy / coupling

One inherited change should be able to alter several expressed consequences because the same developmental resource/regulatory signal is reused.

### 2. Affordance consequences

Expressed phenotype must change **what interactions are possible or economical**, not only make the same action 12% faster.

### 3. Environment closure

Some organism outputs should become persistent future inputs for itself or other organisms. Without that closure, the world remains a stage rather than a participant in evolution.

## Research signals

### Generative / developmental encodings

Indirect/generative encodings are specifically motivated by the ability to reuse compact genetic information to generate larger regular phenotypes. CPPNs are one example, not a project commitment. Artificial gene-regulatory-network research likewise treats regulation as a mediator between genotype and structural/behavioral phenotype and can integrate environmental signals.

Relevant references:

- Stanley, *Compositional Pattern Producing Networks: A Novel Abstraction of Development* (2007).
- Cussat-Blanc, Harrington & Banzhaf, *Artificial Gene Regulatory Networks — A Review*, Artificial Life 24(4), 2018.
- Miras et al., *Constrained by Design: Influence of Genetic Encodings on Evolved Traits of Robots*, Frontiers in Robotics and AI, 2021.

### Morphology-controller co-evolution

Karl Sims' evolved virtual creatures demonstrated a genetic language whose directed graph encoded both morphology and neural circuitry, yielding qualitatively different locomotion strategies. The transferable lesson is not to copy a 3D creature system, but that **body and controller can belong to the same evolvable generative description** rather than being a fixed controller plus body sliders.

### Externalized slime memory

Reid et al. demonstrated that *Physarum polycephalum* deposits extracellular slime and can avoid previously explored slime-covered regions; the trace functions as externalized spatial memory and the avoidance can be overridden when stronger food cues exist.

This is directly relevant because it creates history-dependent navigation from a reactive organism **without inheriting map coordinates or requiring a brain-sized controller**.

Reference: Reid et al., *Slime mold uses an externalized spatial 'memory' to navigate in complex environments*, PNAS 2012.

### Niche construction and ecological inheritance

Niche-construction work distinguishes organism modification of the environment from the later evolutionary response to the modified selective environment. Persistent environmental legacies can feed back into selection and alter polymorphism/co-evolution dynamics.

Relevant references:

- Odling-Smee et al., *Niche Construction Theory: A Practical Guide for Ecologists*, Q Rev Biol 2013.
- Laland et al., *An introduction to niche construction theory*, Evol Ecol 2016.

### Cross-feeding

Microbial ecology supplies a particularly compact model of organism->environment->organism closure: one organism's metabolic byproduct becomes another organism's resource. Empirical and theoretical work shows that byproduct cross-feeding can support functional diversification and coexistence.

Relevant references:

- Pacheco et al., *Ecology and evolution of metabolic cross-feeding interactions in bacteria*, Nat Prod Rep 2019.
- Harcombe et al./reviewed work summarized in *The microbial exometabolome: ecological resource and architect of microbial communities*, Phil Trans R Soc B 2020.

### Plasticity / lifetime learning

Baldwin-effect literature reinforces the distinction between inherited predisposition/capacity and phenotype modified by lifetime learning. Learning can alter relative fitness and thereby alter evolution, but its evolutionary effect is not automatically beneficial and depends on costs and environment.

Reference: Sznajder et al., *How Adaptive Learning Affects Evolution: Reviewing Theory on the Baldwin Effect*, Evol Biol 2012.

## Design principles emerging from the gap analysis

### D1 — Universal interpreter, no species labels

All organisms should run the same basic biological rules/interpreter. Genomes may express different bodies, sensors, effectors and policies, but there should not be hidden `species = predator` classes.

### D2 — Affordance-first genes

Prefer genes/regulatory parameters that change the organism-world coupling: what it can sense, transform, secrete, store, exploit or avoid.

### D3 — Shared budgets instead of free independent upgrades

Movement, sensing, digestion, storage, secretion and plasticity should compete for development/metabolic resources where plausible. This creates coupled trade-offs and removes the current 'maximize every stat' tendency.

### D4 — Local information

Replace or constrain oracle-style list scanning with local cues/gradients/contact where feasible. Rich behavior should come from interaction, not privileged world access.

### D5 — Internal and external memory are different

Lifetime internal state can encode recent experience. External traces can encode environmental history. Neither should be silently written into inherited genome as acquired facts.

### D6 — Outputs become future inputs

At least one early redesign mechanism should close the loop by making an organism-produced output persist and affect later behavior/fitness.

### D7 — Explainable before intelligent-looking

A tiny recurrent/regulatory controller is a candidate, but not the default answer. We should prefer the smallest controller whose behavior can be causally inspected.

## Minimal competing micro-assays

These assays are intentionally smaller than a new full ecosystem.

### Probe A — Developmental allocation map

Question: can a compact latent genome generate coupled, interpretable phenotypes without direct one-gene-one-stat mapping?

Candidate mechanism:

- a few inherited allocation/regulatory values;
- normalization/shared developmental budget across motility, sensing, digestion, storage and secretion;
- nonlinear expression into several capacities/costs.

Positive evidence:

- local mutation usually changes phenotype smoothly enough for inheritance;
- changes are pleiotropic rather than one-slider;
- the accessible phenotype set includes materially different resource allocations;
- no single direction can maximize all expressed capacities.

Failure evidence:

- phenotype collapses to a narrow manifold with no useful alternatives;
- tiny mutation catastrophically randomizes phenotype;
- the map is merely a disguised static lookup table.

### Probe B — Externalized slime-memory navigation

Question: can a simple reactive organism gain history-dependent behavior through a persistent self-produced environmental trace?

Candidate mechanism:

- organism deposits a decaying local trail at energetic cost;
- local trail concentration/gradient is sensed;
- inherited response can range from avoidance through neutrality to attraction;
- no internal map is provided.

Positive evidence:

- in a deterministic revisit/trap/search assay, trace-enabled organisms change coverage/revisit/navigation behavior relative to a trace-disabled paired control;
- the causal effect disappears if the field is erased;
- the trace persists beyond the organism's immediate presence.

Failure evidence:

- trail merely draws pretty lines with negligible behavioral effect;
- all useful evolution drives secretion to zero or response to one trivial extreme;
- field cost destroys x40 feasibility.

### Probe C — Metabolic byproduct cross-feeding

Question: can one organism's metabolism create a new resource opportunity for another without hard-coded cooperation/species?

Candidate mechanism:

- consuming primary resource produces a persistent/expiring byproduct determined by metabolic phenotype;
- byproduct has an energetic cost/inefficiency for producer rather than being a free gift;
- receiver digestion phenotype determines whether it can exploit it.

Positive evidence:

- measurable fraction of energy/reproduction in some lineage comes from organism-created byproducts;
- producer->consumer dependency edges appear in a causal resource-flow ledger;
- paired removal of the byproduct pathway specifically harms the exploiting strategy;
- coexistence/diversification is possible without labels.

Failure evidence:

- byproduct becomes universally free food;
- all lineages converge to identical omnivory;
- producer/consumer structure exists only because of hand-authored classes.

### Probe D — Lifetime plasticity under environmental change

Question: can inherited learning/plasticity capacity create within-life behavioral adaptation while acquired state remains non-heritable?

Candidate mechanism:

- small recent-reward/preference state updated from actual feeding outcomes;
- inherited learning rate / exploration tendency carries a metabolic or opportunity cost;
- offspring begin without parent's acquired preference state.

Positive evidence:

- the same genotype changes choices after experience;
- after an environment switch, learners recover faster than nonlearners in some regimes but pay a cost in stable regimes;
- newborns are naive while inheriting capacity parameters;
- selection on plasticity differs between stable and changing environments.

Failure evidence:

- learning is always better and costless;
- acquired state accidentally leaks into heredity;
- behavior remains visually indistinguishable despite metric gains.

## Current prioritization

Do **not** start with a large neural controller.

Current-best order for isolated probes:

1. **A — developmental allocation**, because it directly tests whether the slim genome can stop being a stat list;
2. **B — slime external memory**, because it creates history-dependent behavior with minimal internal cognition and strongly matches the project identity;
3. **C — metabolic cross-feeding**, because it is the strongest minimal candidate for reciprocal organism->environment->other-organism ecology;
4. **D — lifetime plasticity**, because it restores the inherited-capacity vs acquired-state distinction but should be tested only after the environment supplies meaningful choices.

A controller redesign should then be evaluated against the affordances proven useful by B/C/D, rather than invented in an empty sensory/action space.

## What this ledger changes

The next biological epoch should **not** be 'M5 = more ecology'.

The next phase is architectural research into a **Slim Loop**: a compact inherited description whose phenotype, state, actions and environmental outputs form a closed causal loop. The exact model is intentionally not frozen yet.
