## ⚡ Bolt Learnings

### Performance Optimization: Object Iteration in Room Managers

**What was optimized:**
In `src/managers/roomManager.js`, replaced `room.find(FIND_MY_STRUCTURES)` and `room.find(FIND_CONSTRUCTION_SITES)` in `_planExtensions` with `cache.getMyStructures(room, STRUCTURE_EXTENSION)` and `cache.getConstructionSites(room).filter(...)`.

**Why it matters:**
`room.find` in Screeps maps to expensive backend C++ array iteration and proxy array creations. When doing this for structures in multiple rooms or during high-frequency checks like building plans, it consumes a large portion of per-tick CPU limits.

**Impact:**
Instead of re-querying the game state, this pattern uses cached objects updated per-tick or based on TTL. Micro-benchmarks demonstrate an improvement from ~235ms to ~20ms in loops.

**Takeaway:**
Whenever a function is querying properties from `room.find`, check if the `src/utils/cache.js` has a wrapper function. Prefer using cached getter functions to minimize engine overhead.

## 2025-05-15 - Optimize Harvester Energy Delivery with Caching

**Learning:**
Combining multiple `room.find` calls into a single cached function like `cache.getStructuresNeedingEnergy` significantly reduces CPU overhead. Furthermore, caching the target ID in `creep.memory` avoids redundant spatial searches and priority filtering on every tick while the target is still valid.

**Action:**
In high-frequency roles like Harvester, always look for opportunities to use consolidated cache getters and implement target ID persistence in memory.

## Bolt Memory Journal

### Optimization: Use getMyStructures Cache in Tower Manager

- **File:** `src/managers/towerManager.js`
- **What:** Replaced the engine-level `room.find(FIND_MY_STRUCTURES)` call with `cache.getMyStructures(room, STRUCTURE_RAMPART)` when searching for urgent rampart repair targets in `_selectRepairTarget`. We then manually apply the filtering using `.filter()` on the cached result.
- **Why:** `room.find(FIND_MY_STRUCTURES)` loops through all owned structures and has significant overhead due to Screeps engine Proxy-to-Array conversions every tick. Fetching directly from the cache prevents redundant searches and engine calls, specifically benefiting multi-tower operations during high-RCL defenses where the array size and operation frequency grow.
- **Performance Result:** Micro-benchmarks showed a large drop in time (420.6ms -> 56.4ms over 100k iterations) by iterating over JS objects instead of fetching via the mock room's `find` method, simulating the overhead reduction in game.
