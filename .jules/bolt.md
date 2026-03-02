
## 2025-05-22 - [Hoisting hot path allocations]
**Learning:** Defining functions or large configuration objects inside loops or frequently called methods (like 'isEnabled' or creep loops) causes significant per-tick GC pressure and CPU overhead in Screeps AI.
**Action:** Always hoist static configuration maps and helper function definitions outside of loops and class/object methods to ensure they are allocated once at module load time rather than every tick.

## 2025-05-22 - [Role Persistence in Hoisted Logic]
**Learning:** When hoisting creep logic into a standalone function, ensuring the persistence of default values (like 'creep.memory.role') is critical for maintainability and to prevent redundant logic in subsequent ticks.
**Action:** Explicitly set default values back to Memory if they are missing during the first execution of a hoisted logic block.
