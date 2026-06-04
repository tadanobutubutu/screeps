# Bolt Learnings

## Date: 2024-05-18 (Current Date Example)

**Title:** Unit Test Writing for Edge Cases in `cache.js`
**Learning:** `getStructuresNeedingEnergy` implements layered caching where `room.find` filtering logic is short-circuited if the `room._deliveryTargets` is present from the tick iteration logic (`main.js`). This avoids a prototype search.
**Action:** Created dedicated mock tests to target `room.find` with `FIND_STRUCTURES` and `opts.filter` for `getStructuresNeedingEnergy`, alongside a fallback test verifying no `find` logic is triggered when `_deliveryTargets` provides a cache hit.

## 2024-06-04 - [O(1) Cache Size Tracking & Redundant Check Removal]
**Learning:** Tracking cache size in a module-level variable avoids expensive $O(N)$ `Object.keys().length` calls. However, to prevent counter drift, it is critical to verify if a key is truly new (e.g., `cache[key] === undefined`) before incrementing the size during a cache refresh or update. Additionally, if all entry points are validated via `isSafeKey`, redundant checks inside internal loops (`cleanup`, `getStats`) can be safely removed for further gains.
**Action:** Implemented `_cacheSize` with existence checks and removed redundant `isSafeKey` calls in `src/utils/cache.js`.
