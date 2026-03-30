## 2026-02-13 - Supporting arguments in tryCatch for hoisting
**Learning:** Hoisting logic functions to the module level in Screeps avoids per-tick function re-definition, but often these functions need access to loop-specific context (like the current creep). Extending the `tryCatch` wrapper to support `...args` allows passing this context without using anonymous function closures, further reducing garbage collection pressure.
**Action:** Always ensure logging/error wrappers support argument passing to facilitate hoisting of high-frequency loop logic.

## 2026-02-26 - Adaptive Guarding of Visual Effects
**Learning:** Frequent calls to visual effects (RoomVisual) deep in role logic or gamification systems can cause significant CPU spikes and memory serialization overhead, even if the visuals aren't strictly necessary for gameplay. Guarding these at the entry point of the VFX library using an adaptive system and per-tick caching provides a massive global speedup.
**Action:** Implement per-tick cached guards in high-frequency utility libraries (VFX, Logging, Stats) to respect the system's adaptive load management state.

## 2026-03-17 - O(N) Target Selection in High-Frequency Roles
**Learning:** Using Array.sort() to find a single optimal target (e.g., most damaged structure) in Screeps roles is an O(N log N) operation that wastes CPU, especially in rooms with many structures. A single-pass O(N) loop is significantly more efficient and avoids the memory overhead of sorting.
**Action:** Replace sort() with linear scans when only the best target is needed, and combine with per-tick caching on the room object to further minimize room.find calls.

## 2026-03-24 - Cross-Role Per-Tick Room Caching
**Learning:** Attaching search results (like FIND_SOURCES_ACTIVE) to the volatile Room object using a `_cacheKey` and `_cacheKeyTick` pattern allows multiple creeps of different roles to share the same expensive find operation within a single tick. This is significantly faster than per-creep caching in memory.
**Action:** Implement unified room-level caching for shared search targets (sources, construction sites) to provide global CPU savings across all active roles.

## 2026-03-31 - Dashboard as a Cache Warmer for Global Systems
**Learning:** The room dashboard often performs comprehensive  calls to gather stats for the UI. By attaching these results to the volatile Room object (e.g., `room._myCreeps`), subsequent heavy systems like Defense or AI can skip their own expensive searches and use simple JS filters on the cached arrays. This turn-based caching provides a massive reduction in per-tick `room.find` calls.
**Action:** When implementing dashboards or global status checks, always cache the raw search results on the room object to "warm" the cache for downstream logic.

## 2026-04-07 - Unique Cache Tick Keys for Modular Systems
**Learning:** Using a generic `_cacheTick` property to guard multiple different cached results on the Room object leads to brittle logic and potential runtime errors. If one system (e.g., Dashboard) updates the generic tick but not all cached properties, other systems (e.g., Medic) might skip their required `room.find` calls, resulting in undefined access.
**Action:** Always use specific, unique tick keys (e.g., `_myCreepsTick`, `_injuredCreepsTick`) for each cached dataset to ensure modular safety and prevent cross-system cache collisions.

## 2026-04-14 - Heuristic Target Selection and ID Caching
**Learning:** Repeatedly calling `findClosestByPath` in high-frequency creep roles is extremely expensive ($O(N \cdot \text{Pathfinding})$). Replacing it with `findClosestByRange` ($O(N)$) and caching the resulting target ID in `creep.memory` allows the creep to reuse the target until it is completed or invalid, reducing the search frequency from every tick to once per target lifecycle.
**Action:** Always prefer `findClosestByRange` for heuristic target selection and implement ID caching in `creep.memory` to minimize spatial search overhead in role logic.

## 2026-05-12 - Standardized Tick-Gated Caching and Sticky Repair Targets
**Learning:** Shared per-tick caching (like FIND_MY_CREEPS) only works reliably across modular systems if every consumer uses unique, standardized tick keys (e.g., `_myCreepsTick`). Using a generic key or failing to check the tick leads to redundant searches or stale data. Furthermore, implementing target ID caching for Repairers significantly reduces per-tick O(N) scans.
**Action:** Standardize per-tick cache keys on the Room object across all modules and implement sticky target ID caching for all repair and build-heavy roles.

## 2026-05-19 - Transporter Target ID and Withdrawal Cache
**Learning:** For logistics roles like Transporters, caching both delivery and withdrawal target IDs in memory prevents redundant spatial searches during their back-and-forth cycles. Additionally, combining Storage and Containers into a single room-level withdrawal cache (`_withdrawalSources`) eliminates redundant array filtering and construction for every transporter in the room.
**Action:** Implement memory-based target ID caching for all logistics roles and use room-level caching for shared multi-structure withdrawal sources.

## 2026-06-02 - Harvester Efficiency and FIND_MY_STRUCTURES
**Learning:** Harvesters, being the most numerous role, cause the most CPU pressure. Upgrading their delivery search to `FIND_MY_STRUCTURES` is faster than `FIND_STRUCTURES` as it offloads filtering to the engine. Furthermore, implementing `harvestTargetId` and `deliverTargetId` caching with `findClosestByRange` prevents the "crowding" effect where all creeps rush the first item in a result array, significantly improving resource throughput.
**Action:** Always use `FIND_MY_STRUCTURES` for own structure searches and implement sticky target caching for high-density roles to ensure better load balancing across sources and structures.

## 2026-06-16 - O(1) Cache Validation vs O(N) Array Scans
**Learning:** Using `targets.some(t => t.id === target.id)` to validate a cached ID every tick is an O(N) operation that scales poorly as colonies grow. Replacing this with O(1) property checks (e.g., `target.energy > 0` or `target.store.getFreeCapacity() > 0`) on the object retrieved via `Game.getObjectById` drastically reduces per-tick CPU overhead, especially in rooms with many structures.
**Action:** Avoid using `Array.some` or `Array.find` for per-tick cache validation; instead, use `Game.getObjectById` and verify state directly via object properties.

## 2026-06-30 - Scout Efficiency and Redundant Pathing
**Learning:** Redundant pathfinding calls like `Game.map.findExit` and `creep.room.findExitTo` are unnecessary when using `creep.moveTo(targetRoomName)` as the engine handles inter-room routing internally. Additionally, implementing standardized per-tick room caching for scanning roles like Scouts prevents redundant O(N) searches when multiple creeps are present in the same room.
**Action:** Always prefer direct room-name-based `moveTo` for inter-room travel and use standardized tick-gated room caching for all search-heavy operations to reduce global CPU usage.

## 2026-07-14 - Explorer Pathfinding and Engine-Level Routing
**Learning:** For roles like Explorers that frequently cross room boundaries, manual exit tile selection via `findClosestByRange(findExitTo(...))` is an unnecessary CPU expense. Passing a `RoomPosition` in the target room directly to `moveTo` allows the Screeps engine to utilize its internal optimized pathing and cache, significantly reducing the per-tick cost of inter-room navigation.
**Action:** Replace multi-step manual exit tile finding with direct `RoomPosition` targeting in `moveTo` for all inter-room movement logic.

## 2026-07-28 - O(N²) Social Interaction and findInRange Optimization
**Learning:** A global nested loop comparing every creep pair for proximity is an O(N²) bottleneck that fails as the colony grows. Refactoring this to a room-based loop using `creep.pos.findInRange(FIND_MY_CREEPS, 1)` leverages the engine's internal spatial indexing, reducing complexity to O(N). Furthermore, passing the FIND constant instead of a pre-filtered array to `findInRange` ensures maximum engine-level optimization.
**Action:** Always replace global creep-pair comparisons with localized room-based spatial searches using `findInRange` and FIND constants.
