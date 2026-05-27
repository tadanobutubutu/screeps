# Bolt Journal

## Performance Learnings

- **Avoid Uncached Structure Queries:** `room.find(FIND_STRUCTURES)` runs $O(N)$ engine-level logic and allocates a new Proxy-to-Array array for each call. We should prefer using cached wrappers like `cache.getStructures(room).filter(...)` where `cache` retains the `room.find()` result per tick to save CPU, particularly in tight loops or idle ticks.
- **Use Dedicated Mocks for Tests:** When porting a module to `cache.getStructures`, ensure any tests (e.g., `tests/src.roles.builder.test.js`) are updated to use `mockCache.getStructures.mockReturnValue(...)` instead of `room.find.mockReturnValue(...)`.
- **Measure Before You Optimize:** Writing a quick `benchmark.js` script mimicking the environment (like Screeps) allows for quick validations and proving performance speedups (e.g. from 247ms -> 111ms for 10,000 iterations).

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

- Reduces engine-level API calls by 1 + N per room per tick (where N is the number of towers).
- Replaces expensive C++/JS bridge crossings with pure JS array filtering.
- Estimated CPU saving: 0.1 - 0.5 CPU per room depending on the number of structures and towers.

### Uncached Container Search Near Source Optimization

**Date:** 2025-02-14
**File:** `src/roles/miner.js`

**What:**
Replaced `room.find(FIND_STRUCTURES, ...)` with `cache.getContainers(room)` in `_findSourceContainer`.

**Why:**
`room.find(FIND_STRUCTURES)` performs a redundant engine-level Proxy-to-Array conversion and WASM boundary array allocation per tick. Utilizing the pre-filtered container cache avoids this overhead.

**Measured Improvement:**
A quick benchmark using 10,000 iterations against an array of 100 mock structures showed the baseline taking 20ms and the optimized version taking 10ms. A 50.00% performance improvement.

## 2024-11-20 - Optimize N+1 Query in Room Manager

**Learning:**
Inside `_planSourceContainers`, `room.find(FIND_CONSTRUCTION_SITES, ...)` was called for each source inside a loop. This leads to an N+1 query problem, increasing CPU usage proportionally to the number of sources.

**Action:**
We hoisted the retrieval of construction sites outside the loop using `cache.getConstructionSites(room)` and then filtered the cached array inside the loop.

**Impact:**

- Resolved N+1 query problem by extracting the lookup outside the loop.
- Avoided repeated engine-level Proxy-to-Array conversions per source.
- Benchmark showed an ~77% CPU reduction compared to the previous code logic in large arrays.

## Defender Patrol Points Optimization

- Replaced `room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_RAMPART } })` with `cache.getMyStructures(room, STRUCTURE_RAMPART)` in `_getPatrolPoints` within `src/roles/defender.js`.
- Impact: Reduces unnecessary engine queries and filter iterations on every defender tick.
- Benchmark: 232ms -> 18ms per 10k iterations (~92% improvement).

## 2026-05-23 - [Screeps Object Caching Anti-pattern]

**Learning:** Screeps engine re-instantiates all game objects (Creeps, Structures, etc.) every tick. Storing these objects in a persistent global or Memory cache across ticks leads to stale references and `ERR_INVALID_TARGET` errors.
**Action:** Only cache primitive IDs or use volatile per-tick caches for calculations involving game objects. For cross-tick persistence, store only the `id` string and resolve it using `Game.getObjectById(id)`.

## 2026-05-23 - Optimize Source Assignments with Volatile Cache

**Learning:** In rooms with many harvesters or during logic resets, `assignSource` can become a bottleneck if it re-calculates assignment counts per room on every call (N * M).
**Action:** Implement a volatile per-tick cache for source assignments. Calculate counts once per room per tick (N) and update the cache in-place for subsequent calls (1). This reduces complexity to (N + M) for M calls.
**Impact:** Significantly reduces CPU spikes during high-frequency assignment events.

## 2026-05-24 - Optimize Pathfinder Creep Costs with Centralized Cache

**Learning:**
In Screeps, pathfinding with `avoidCreeps: true` often triggers redundant `room.find(FIND_CREEPS)` calls across multiple pathfinding requests in the same tick. While caching `room.find(FIND_CREEPS)` centrally in `main.js` and reusing it in `src/utils/pathfinder.js` saves CPU, it is critical to use the full `FIND_CREEPS` result rather than just `FIND_MY_CREEPS` and `FIND_HOSTILE_CREEPS`. Omitting neutral or allied creeps leads to collisions, which trigger even more expensive engine-level path recalculations.

**Action:**
Centralize the `room.find(FIND_CREEPS)` call in the room-warming phase in `main.js` and store the result in a volatile property (e.g., `room._allCreeps`). In the pathfinder logic, prioritize this cached array to avoid multiple bridge crossings per tick.

**Impact:**
Reduces engine API calls from M (where M is the number of pathfinding calls with creep avoidance) to 1 per room per tick. Standard `for` loops also provide a micro-optimization over `for...of` in the Screeps V8 environment.

- Performance Optimization: Replaced expensive room.find() calls with cached equivalents (cache.getSources, cache.getEnemies) in memory.visualizer.js to reduce redundant engine queries and execution time.

- **Memory Iteration Optimization**: Replacing `for...in` loops with `Object.keys()` for object iteration (like in `utils.memory.js`) yields significant performance improvements. This is because `for...in` traverses the prototype chain and often necessitates a `hasOwnProperty` check, whereas `Object.keys()` returns only the object's own enumerable properties directly, enabling faster and simpler iteration, which is particularly beneficial for high-frequency operations.

## Role Counting Loop Optimization

Replaced a `for...in` loop with `Object.entries(targetCreeps)` in `main.js` (`handleSpawning`).

**Why:** `for...in` traverses the prototype chain and checks enumerable properties, which adds minor overhead per tick. `Object.entries` is faster and safer as it strictly operates on the object's own enumerable properties.

**Performance Impact:** Based on micro-benchmarks, destructuring via `Object.entries` avoids the prototype lookup and direct property access overhead within the loop, leading to a small but measurable reduction in execution time for role counting operations, especially when called frequently during spawning checks.
