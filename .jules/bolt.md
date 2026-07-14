# Bolt Learnings

## 2026-06-05 - $O(1)$ Cache Size Tracking and FIFO Eviction

**Learning:** Using `Object.keys(cache).length` and `Object.keys(cache)[0]` for capacity management and FIFO eviction leads to $O(N)$ CPU overhead on every cache miss or insertion. In high‑frequency environments like Screeps, this scales poorly as the cache grows toward `MAX_CACHE_ENTRIES`.  
**Action:** Implemented module‑level volatile state (`_cacheSize`, `_cacheOrder` Map) to track cache metrics in $O(1)$. Map iteration order provides the “oldest” key for eviction in $O(1)$ via `keys().next().value`.

## 2026-06-05 - Lazy Cache Synchronization

**Learning:** Local tracking variables (`_cacheSize`) can drift if the global object (`global.cache`) is modified externally or if the script environment resets.  
**Action:** Implemented `_syncCacheState` to lazily re‑initialize local tracking whenever `global.cache` reference changes, ensuring consistency with the persistent global object.

## Date: 2024-05-18 (Current Date Example)

**Title:** Unit Test Writing for Edge Cases in `cache.js`  
**Learning:** `getStructuresNeedingEnergy` implements layered caching where `room.find` filtering logic is short‑circuited if the `room._deliveryTargets` is present from the tick iteration logic (`main.js`). This avoids a prototype search.  
**Action:** Created dedicated mock tests to target `room.find` with `FIND_STRUCTURES` and `opts.filter` for `getStructuresNeedingEnergy`, alongside a fallback test verifying no `find` logic is triggered when `_deliveryTargets` provides a cache hit.

## 2024-05-20 - [Cache Size Tracking Regression]

**Learning:** Attempting to synchronize a module‑level counter (_cacheSize) with an external object (global.cache) using `Object.keys().length` on every access creates an O(N) bottleneck in what should be an O(1) hot path. Even if the intent is O(1) capacity checking, the synchronization cost can exceed the benefit.  
**Action:** Use an object reference check (_lastCacheRef !== global.cache) to detect resets and only recalculate size when the reference changes.

## ⚡ Bolt Learning: `Array.prototype.filter` inside loops

**Date:** 2024-06-02
**Title:** Optimizing