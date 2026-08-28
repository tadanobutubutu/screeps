## 2026-08-25 - Hoisting Filter Predicates in Cache Utilities
**Learning:** Defining inline anonymous functions inside Screeps `room.find()` calls causes unnecessary closure allocations every cache fetch. Hoisting static predicate functions to module scope eliminates callback allocation overhead.
**Action:** Always hoist invariant predicate functions used in high-frequency cache fetchers to module scope.

## 2026-08-25 - Standardizing Loop Control in High-Frequency Miner Routines
**Learning:** In Screeps high-frequency miner source assignment routines, replacing `for...of` loops with indexed `for` loops eliminates iterator allocation overhead per tick.
**Action:** Always prefer indexed `for` loops over `for...of` in hot path target search functions.
