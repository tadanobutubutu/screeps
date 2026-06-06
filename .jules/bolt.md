# Bolt Learnings

## Date: 2024-05-18 (Current Date Example)

**Title:** Unit Test Writing for Edge Cases in `cache.js`
**Learning:** `getStructuresNeedingEnergy` implements layered caching where `room.find` filtering logic is short-circuited if the `room._deliveryTargets` is present from the tick iteration logic (`main.js`). This avoids a prototype search.
**Action:** Created dedicated mock tests to target `room.find` with `FIND_STRUCTURES` and `opts.filter` for `getStructuresNeedingEnergy`, alongside a fallback test verifying no `find` logic is triggered when `_deliveryTargets` provides a cache hit.

## 2024-05-20 - [Cache Size Tracking Regression]

**Learning:** Attempting to synchronize a module-level counter (\_cacheSize) with an external object (global.cache) using Object.keys().length on every access creates an O(N) bottleneck in what should be an O(1) hot path. Even if the intent is O(1) capacity checking, the synchronization cost can exceed the benefit.
**Action:** Use an object reference check (\_lastCacheRef !== global.cache) to detect resets and only recalculate size when the reference changes.

## ⚡ Bolt Learning: `Array.prototype.filter` inside loops

**Date:** 2024-06-02
**Title:** Optimizing Array.filter calls inside frequent Screeps loops
**Learning:** Using `Array.prototype.filter` inside a high-frequency loop creates significant overhead in the Screeps/V8 environment due to closure allocation and full array traversal, even when only a boolean check (`length > 0`) is needed.
**Action:** Replaced `.filter` calls inside the `_planSourceContainers` source loop with traditional `for` loops utilizing early return (`break`) for a measurable ~60% improvement in execution time for this specific path.

## 2025-02-18

**Title:** Optimizing Creep Pair Distance Checking in main loop
**Learning:** `pos.findInRange` calls inside nested loops (`O(N^2)`) over `rooms` create massive overhead. Because the full list of creeps is already fetched for the room (`_myCreeps`), iterating over unique pairs locally (`k = j + 1`) and computing Chebyshev distance (`Math.max(Math.abs(dx), Math.abs(dy)) <= 1`) completely avoids engine-level calls, `Set` allocations, and string operations.
**Action:** Replaced `findInRange` and `processedPairs` Set with an optimized `j`/`k` nested array loop in `handleSocialInteractions`.
