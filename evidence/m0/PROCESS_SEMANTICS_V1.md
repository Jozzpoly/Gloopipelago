# V1 Process / Scheduler Semantics Receipt

**Status:** historical executable semantics preserved by M0/M1 parity. These are not automatically desired future biology.

## Global fixed-step phase order

1. `simTime += dt`.
2. Detect season transition; add seasonal food immediately.
3. Probabilistic continuous food spawn.
4. Remove expired food by reverse array scan.
5. Sequentially update blobs using the live `blobs` array.
6. Death sweep by reverse blob-array scan; optional corpse food is created here.
7. If population is empty, increment `extinctions`; optionally auto-reseed.

## Per-blob phase order

1. Increment age and reduce reproduction cooldown.
2. Target search scans food array forward.
3. Wander RNG is consumed only when no target exists.
4. Apply acceleration, velocity cap/damping, movement, boundary reflection.
5. Pay metabolic cost.
6. Collision/eating scans food array backward and consumes the first acceptable collision.
7. Reproduction test runs last and appends the child immediately to the live blob array.

## Accidental Biology Ledger — qualified V1 observations

These are preserved for M1 historical parity and require a later explicit `retain / revise / experimentalize / V1-only` verdict before becoming intentional model law.

- **Live-array births:** offspring appended during the blob loop are visited in the same tick; extreme energy can cascade through multiple generations inside one `1/60 s` step.
- **Contested resource arbitration:** otherwise identical colocated blobs can receive different outcomes solely because of blob-array order.
- **Population-cap priority:** earlier-updated eligible organisms can fill the global cap and deny reproduction to later organisms in the same tick.
- **Age/reproduction ordering:** an organism can reproduce and then die in the same tick after crossing the lifespan threshold.
- **Food ordering:** targeting scans forward while eating scans backward; colocated equal foods are consumed from the newest/end side first.
- **Corpse phase:** corpse food is created only after all blob updates and therefore cannot be consumed until a later tick.
- **Catastrophe food semantics:** `catastrophe()` removes the oldest prefix (`floor(72%)`) of the food array, not a random 72%.
- **Catastrophe death semantics:** catastrophe deaths do not create corpse food.
- **Extinction counter:** with `autoReseed=false`, empty population increments `extinctions` every subsequent tick (level-triggered, not edge-triggered). This is directly qualified by `S-EMPTY-NORESEED`; `S-EMPTY-AUTORESEED` separately qualifies the immediate 12-founder reseed branch.
- **Floating-time accumulation:** repeated Float64 addition is historical semantics. At tick 2040, `simTime` is `33.99999999999935`, so the first 34-second season transition occurs at tick 2041.
- **Viewport/world coupling:** historical `setSize()` mutates authoritative world dimensions; M1 preserves this, M3 may intentionally remove viewport authority.

## Authority rule

M0/M1 matching this receipt proves **historical fidelity**, not correctness of these rules as future biology. Any later scheduler/time/world semantic change starts a new explicit model/apparatus epoch and requires fresh qualification.
