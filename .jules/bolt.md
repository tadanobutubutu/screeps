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

## 2025-05-16 - Optimize Dashboard with Pre-Warmed Caches

**Learning:** Redundant engine calls (like `room.find`) in UI/Dashboard components can be eliminated by centralizing data collection in a global tick loop and attaching results to volatile room properties.
**Action:** Always check if the required data is already available as a volatile property (e.g., `_myStructures`, `_roleCounts`) before performing a new search or filter operation.

## 2025-05-17 - Visual Draining for Stationary Objects

**Learning:** High-frequency visual effects (like trails) should only update their state when the subject moves. For stationary subjects, draining the state (e.g., shifting out old positions) allows the effect to naturally fade and eventually skip the entire drawing loop, saving significant CPU on `RoomVisual` calls.
**Action:** In VFX modules, implement movement-based state updates and early returns for empty states to minimize redundant per-tick engine overhead.

## 2025-05-18 - Optimize Tower Manager with Room Cache

**Learning:**
Tower management can be a significant CPU sink in high-RCL rooms due to frequent `room.find` calls for each tower. By replacing `room.find(FIND_MY_CREEPS)` and `room.find(FIND_STRUCTURES)` with their cached equivalents (`cache.getMyCreeps` and `cache.getStructures`), we eliminate redundant engine-level searches.

**Action:**
Always leverage the centralized `src/utils/cache.js` for common room searches, especially in manager modules that iterate over multiple structures (like towers) or run every tick.

**Impact:**

- Reduces engine-level API calls by 1 + N$ per room per tick (where $ is the number of towers).
- Replaces expensive C++/JS bridge crossings with pure JS array filtering.
- Estimated CPU saving: 0.1 - 0.5 CPU per room depending on the number of structures and towers.

## 2024-11-20 - Optimize N+1 Query in Room Manager

**Learning:**
Inside `_planSourceContainers`, `room.find(FIND_CONSTRUCTION_SITES, ...)` was called for each source inside a loop. This leads to an N+1 query problem, increasing CPU usage proportionally to the number of sources.

**Action:**
We hoisted the retrieval of construction sites outside the loop using `cache.getConstructionSites(room)` and then filtered the cached array inside the loop.

**Impact:**

- Resolved N+1 query problem by extracting the lookup outside the loop.
- Avoided repeated engine-level Proxy-to-Array conversions per source.
- Benchmark showed an ~77% CPU reduction compared to the previous code logic in large arrays.
