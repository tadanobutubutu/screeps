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
