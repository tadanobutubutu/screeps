# Bolt Learnings

## Date: 2024-05-18 (Current Date Example)

**Title:** Unit Test Writing for Edge Cases in `cache.js`
**Learning:** `getStructuresNeedingEnergy` implements layered caching where `room.find` filtering logic is short-circuited if the `room._deliveryTargets` is present from the tick iteration logic (`main.js`). This avoids a prototype search.
**Action:** Created dedicated mock tests to target `room.find` with `FIND_STRUCTURES` and `opts.filter` for `getStructuresNeedingEnergy`, alongside a fallback test verifying no `find` logic is triggered when `_deliveryTargets` provides a cache hit.

## 2024-05-20 - [Cache Size Tracking Regression]
**Learning:** Attempting to synchronize a module-level counter (_cacheSize) with an external object (global.cache) using Object.keys().length on every access creates an O(N) bottleneck in what should be an O(1) hot path. Even if the intent is O(1) capacity checking, the synchronization cost can exceed the benefit.
**Action:** Use an object reference check (_lastCacheRef !== global.cache) to detect resets and only recalculate size when the reference changes.
