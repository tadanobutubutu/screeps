# Bolt Learnings

## Date: 2024-05-18 (Current Date Example)

**Title:** Unit Test Writing for Edge Cases in `cache.js`
**Learning:** `getStructuresNeedingEnergy` implements layered caching where `room.find` filtering logic is short-circuited if the `room._deliveryTargets` is present from the tick iteration logic (`main.js`). This avoids a prototype search.
**Action:** Created dedicated mock tests to target `room.find` with `FIND_STRUCTURES` and `opts.filter` for `getStructuresNeedingEnergy`, alongside a fallback test verifying no `find` logic is triggered when `_deliveryTargets` provides a cache hit.
