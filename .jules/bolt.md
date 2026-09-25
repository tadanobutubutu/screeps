## 2026-08-25 - Hoisting Filter Predicates in Cache Utilities

**Learning:** Defining inline anonymous functions inside Screeps `room.find()` calls causes unnecessary closure allocations every cache fetch. Hoisting static predicate functions to module scope eliminates callback allocation overhead.
**Action:** Always hoist invariant predicate functions used in high-frequency cache fetchers to module scope.

## 2026-08-25 - Standardizing Loop Control in High-Frequency Miner Routines

**Learning:** In Screeps high-frequency miner source assignment routines, replacing `for...of` loops with indexed `for` loops eliminates iterator allocation overhead per tick.
**Action:** Always prefer indexed `for` loops over `for...of` in hot path target search functions.

## 2026-08-25 - Throttling Visual Intent Calls and Hoisting Memory Keys in Creep Roles

**Learning:** Calling creep.say() on every tick during high-frequency routines (e.g. RCL8 upgrader operations) adds unnecessary Screeps engine intent overhead. Throttling visual intents and hoisting invariant memory keys to module scope reduces tick CPU cost.
**Action:** Throttle non-critical visual intents like creep.say() with tick modulo checks and hoist static memory keys to module scope.

## 2026-08-05 - Property Access Hoisting in Cost Matrix Calculations
**Learning:** In high-frequency Screeps room cost matrix calculation loops (`_applyStructureCosts`, `_applyConstructionSiteCosts`), accessing nested object properties (`struct.pos`, `struct.structureType`, `site.pos`, `site.structureType`) repeatedly inside loop conditions and switch statements adds unnecessary property lookup overhead for every structure and construction site in the room. Hoisting these references into local variables (`const pos = struct.pos; const type = struct.structureType;`) eliminates redundant property resolution calls per iteration during pathfinding.
**Action:** Always hoist nested object properties (like `.pos` and `.structureType`) to local variables before switch statements or repeated conditional checks in structure scanning loops.

## 2026-08-06 - Short-Circuit Full-Health Structures in Repair Scans
**Learning:** In room-wide structure repair target scanning (`_findDamagedStructure`), over 95% of room structures are typically at 100% full health (`s.hits === s.hitsMax`). Computing threshold lookups (`REPAIR_THRESHOLD[type]`) and floating-point divisions (`s.hits / s.hitsMax`) for full-health structures on every tick wastes CPU. Adding a fast integer short-circuit check (`if (s.hits >= s.hitsMax) continue;`) before dictionary lookups and division operations bypasses redundant evaluations for undamaged structures.
**Action:** Always check `s.hits >= s.hitsMax` early in structure health scanning loops before performing property lookups, threshold comparisons, or division operations.

## 2026-09-24 - Utilizing Pre-warmed Caches for room.find
**Learning:** In Screeps roles that frequently call `room.find` (like `role.scout`), directly invoking `creep.room.find(FIND_DROPPED_RESOURCES)` on every tick evaluates an O(N) array search inside the game engine, causing high CPU load across many creeps. Replacing this with the pre-warmed `cache` module (`cache.getDroppedResources(creep.room)`) implements TTL-based caching. This reduces the native engine calls by drastically dropping the frequency of native `room.find` calls per tick.
**Action:** When working with frequently queried collections in creep tick routines (e.g. dropped resources, structures), check if an equivalent helper function in `src/utils/cache.js` exists and use it instead of `room.find()`.

## 2026-08-06 - Eliminating Dead-Code and Reversing Preset Search in Body Selection
**Learning:** In Screeps spawn managers, calculating unused `bestBody` and iterating forward through cost-ascending presets forces unnecessary iterations on every tick. Reversing loop direction for backward indexed search enables early-exit on the highest affordable preset while eliminating dead-code calculations and object allocations.
**Action:** Always search sorted preset arrays in reverse to exit early on the optimal choice and ensure calculated values are strictly required by return paths.
