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

## 2026-08-25 - Short-Circuiting Priority Evaluation in Repair Target Selection
**Learning:** In Screeps target selection loops with prioritized structures (e.g. `_findBestRepairTarget` in `src/roles/repairer.js`), checking `if (priority > minPriority) continue;` before computing `hits / hitsMax` and `creep.pos.getRangeTo(s)` short-circuits evaluation for all lower-priority structures.
**Action:** Always short-circuit lower priority candidates immediately after fetching priority in target selection search loops.
## 2024-09-04 - Fix N+1 room sources query in auto evolution
Replaced redundant loop source counting in auto.evolution.js with centralized O(1) cache.getSources(room) lookups.

## 2026-08-25 - Localized Creep Iteration in Room Management
**Learning:** Iterating global `Game.creeps` via `for...in` or `Object.values(Game.creeps)` in room manager routines scans creeps globally across all rooms and allocates global arrays on every tick. Replacing with `cache.getMyCreeps(room)` reduces loop complexity to O(RoomCreeps) and eliminates array allocation overhead.
**Action:** Always use localized `cache.getMyCreeps(room)` instead of scanning global `Game.creeps` in room-specific manager functions.

## 2026-08-25 - Single-Pass Link Network Categorization in Room Manager
**Learning:** In high-frequency room management routines (like `_manageLinkNetwork`), calling `Array.prototype.filter` multiple times over links creates redundant closure and array allocations every tick. Combining link categorization into a single indexed `for` loop eliminates callback overhead and array passes.
**Action:** Always categorize room structures in a single indexed `for` loop pass instead of chaining multiple `filter()` operations in tick-level management routines.

## 2026-08-25 - Hoisting Cache Lookups and Short-Circuiting Tile Searches in Road Planning
**Learning:** In room construction planning, executing `.filter()` queries over room structure caches for every tile on every path creates O(PathLength * Structures) closure allocations. Hoisting structure cache lookups outside path loops and replacing `.filter()` with indexed short-circuit loops eliminates closure allocations and quadratic scan overhead.
**Action:** Always hoist room-level structure cache fetches outside position iteration loops and use indexed `for` loops that break early on the first matching structure.

## 2026-09-08 - Deferring Distance Evaluation in Harvester Primary Target Search
**Learning:** In target evaluation loops (such as `_findPrimaryTarget` in `src/roles/harvester.js`), calculating `creep.pos.getRangeTo(s)` before checking structure types or capacity thresholds executes unnecessary distance calculations on irrelevant candidates. Deferring distance calls inside matching branch blocks eliminates CPU waste on non-qualifying structures.
**Action:** Always place `getRangeTo` calls inside conditional blocks after confirming the target structure type and capacity requirements.

## 2026-09-08 - Inlining Threshold Checks and Target Comparison in Repair Loop
**Learning:** In target search loops that scan all room structures on every tick (such as `_findBestRepairTarget` in `src/roles/repairer.js`), delegating condition checks to helper functions creates call stack frame overhead per candidate structure. Inlining threshold checks directly into the loop eliminates call stack overhead across hundreds of structure checks per tick.
**Action:** Inline damage threshold and priority comparisons directly inside structure iteration loops in high-frequency target search routines.
