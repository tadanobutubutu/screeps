## 2026-08-25 - Hoisting Filter Predicates in Cache Utilities
**Learning:** Defining inline anonymous functions inside Screeps `room.find()` calls causes unnecessary closure allocations every cache fetch. Hoisting static predicate functions to module scope eliminates callback allocation overhead.
**Action:** Always hoist invariant predicate functions used in high-frequency cache fetchers to module scope.

## 2026-08-25 - Standardizing Loop Control in High-Frequency Miner Routines
**Learning:** In Screeps high-frequency miner source assignment routines, replacing `for...of` loops with indexed `for` loops eliminates iterator allocation overhead per tick.
**Action:** Always prefer indexed `for` loops over `for...of` in hot path target search functions.

## 2026-08-25 - Throttling Visual Intent Calls and Hoisting Memory Keys in Creep Roles
**Learning:** Calling creep.say() on every tick during high-frequency routines (e.g. RCL8 upgrader operations) adds unnecessary Screeps engine intent overhead. Throttling visual intents and hoisting invariant memory keys to module scope reduces tick CPU cost.
**Action:** Throttle non-critical visual intents like creep.say() with tick modulo checks and hoist static memory keys to module scope.

## 2026-08-25 - Caching Target Memory in Common Storage Retrieval Utility
**Learning:** In shared energy retrieval routines (e.g., `getEnergyFromStorage`), checking if `creep.memory[targetKey]` points to a valid storage object with sufficient energy before performing global cache fetches bypasses redundant object lookups and room scans.
**Action:** Always validate existing target memory keys before executing cache queries in common helper utilities.

## 2026-08-25 - Reverse Iteration and Dead Code Removal in Body Selection
**Learning:** Screeps body presets are sorted by energy cost ascending. Iterating backwards with indexed for loops enables immediate O(1) early exits for affordable body selection, while hoisting static emergency lookup objects eliminates per-call allocations.
**Action:** Always iterate presets in reverse for early exit and hoist static fallback dictionaries to module scope in spawn evaluation routines.
