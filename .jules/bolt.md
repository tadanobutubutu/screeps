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

**Learning:** The room dashboard often performs comprehensive calls to gather stats for the UI. By attaching these results to the volatile Room object (e.g., `room._myCreeps`), subsequent heavy systems like Defense or AI can skip their own expensive searches and use simple JS filters on the cached arrays. This turn-based caching provides a massive reduction in per-tick `room.find` calls.
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
**Action:** Replace multi-step manual exit tile finding with direct `RoomPosition` targeting in `moveTo` for all inter-room navigation logic.

## 2026-07-28 - O(N²) Social Interaction and findInRange Optimization

**Learning:** A global nested loop comparing every creep pair for proximity is an O(N²) bottleneck that fails as the colony grows. Refactoring this to a room-based loop using `creep.pos.findInRange(FIND_MY_CREEPS, 1)` leverages the engine's internal spatial indexing, reducing complexity to O(N). Furthermore, passing the FIND constant instead of a pre-filtered array to `findInRange` ensures maximum engine-level optimization.
**Action:** Always replace global creep-pair comparisons with localized room-based spatial searches using `findInRange` and FIND constants.

## 2026-08-11 - Leveraging Specialized FIND Constants for Transporters

**Learning:** Using `FIND_STRUCTURES` for energy delivery targets in logistics roles is less efficient than `FIND_MY_STRUCTURES` because it returns all structures in the room (including neutral ones like roads and walls) before applying a JavaScript filter. Switching to `FIND_MY_STRUCTURES` offloads the initial filtering to the engine's internal spatial index, significantly narrowing the search space.
**Action:** Always prefer specialized `FIND` constants (like `FIND_MY_STRUCTURES` or `FIND_MY_CONSTRUCTION_SITES`) over general ones to leverage engine-level optimizations and reduce CPU overhead in high-frequency search logic.

## 2026-04-01 - Per-Tick Cache Isolation in Unit Tests

**Learning:** Module-level variables used for per-tick caching (e.g., `_currentConfig`) persist across test cases in Jest if they aren't explicitly reset. This causes test failures when `Game.time` is mocked to the same value across different tests that expect different `Memory` states.
**Action:** Always implement explicit cache reset logic in `init()` or `reset()` functions and call them during test setup (beforeEach) to ensure clean state isolation.

## 2026-08-25 - Focused Optimization and Syntax Verification

**Learning:** Attempting multiple optimizations and architectural changes simultaneously in a single PR increases the risk of syntax errors (e.g., truncated blocks) and "Partially Correct" ratings. Scope creep undermines the "small, measurable improvement" mission.
**Action:** Strictly adhere to the "ONE small performance improvement" directive. Verify file completeness and syntax after all `replace_with_git_merge_diff` calls, and avoid unrequested architectural changes like Memory structure refactoring.

## 2026-09-08 - Global Cache Warming and Security Utility Regressions

**Learning:** Leveraging the mandatory global loop (e.g., `Game.creeps`) to "warm" per-room caches (like `_myCreeps` and `_roleCounts`) eliminates redundant $O(N)$ searches and counting logic in downstream modules (Dashboard, Defense). However, when optimizing core security utilities like `isSafeKey` via hoisting (e.g., using a `Set`), ensuring parity for all supported types (like numeric keys) is critical to prevent functional regressions and "Partially Correct" ratings.
**Action:** Use global loops for cross-module cache warming to maximize global CPU savings. Always verify type support (e.g., `typeof key === 'number'`) when refactoring high-frequency utility functions.

## 2026-04-04 - Tick-Gated Initialization and Reference Safety

**Learning:** Hoisting default configuration objects to the module level reduces per-tick allocation, but direct assignment to `Memory` creates shared references across ticks and objects. Furthermore, `init()` functions are often called from multiple entry points (e.g., `addXP`, `trackAction`, `renderDashboard`) within a single tick, causing redundant iteration.
**Action:** Always use shallow or deep cloning when applying hoisted defaults to `Memory` and implement a per-tick `_initTick` guard to ensure initialization logic runs exactly once per tick.

## 2026-04-07 - Throttling Periodic O(N) Cleanup Tasks

**Learning:** Performing unoptimized $O(N)$ operations on every tick, such as cleaning up stale `Memory.creeps` entries, is a silent CPU drain. Since creeps live for 1500 ticks, running this cleanup every tick is redundant. Throttling such periodic maintenance tasks to run every 100 ticks (approx. 5 minutes) significantly reduces their cumulative CPU impact without risking Memory overflow.
**Action:** Identify and throttle periodic $O(N)$ maintenance tasks in the main loop to run at appropriate intervals (e.g., every 100 ticks) instead of every tick.

## 2026-05-26 - Producer-Consumer Alignment in Caching

**Learning:** Adding cache population logic (the "producer") to a global loop without refactoring downstream logic (the "consumers") to use it creates a performance regression. The extra comparisons and array operations add per-tick CPU cost without any offsetting savings.
**Action:** When implementing per-tick caching, always ensure all relevant consumers are updated to use the new cache in the same change set to ensure a net performance gain.

## 2026-06-09 - Unified Structure Caching and Logistics Warming

**Learning:** While specialized Screeps `FIND` constants (like `FIND_MY_STRUCTURES`) are engine-optimized, calling multiple related `FIND` constants (e.g., `FIND_STRUCTURES` and `FIND_MY_STRUCTURES`) in the same tick is often slower than a single `FIND_STRUCTURES` call followed by JS-side filtering. Furthermore, pre-calculating state-specific logistics caches (e.g., `fillableContainers`) in the main loop eliminates redundant $O(N \cdot M)$ filtering overhead across all active creeps.
**Action:** Consolidate related engine `FIND` calls into a single pass and "warm" downstream logistics caches globally to maximize per-tick CPU savings.

## 2026-09-22 - Consolidating Room Passes and Optimizing Structure Categorization

**Learning:** Performing multiple independent loops over `Game.rooms` and `allStructures` adds significant CPU overhead due to redundant iteration and property access. Combining room-level cache initialization with structure scanning into a single pass, and refactoring the categorization loop to use an optimized `if-else if` structure (prioritizing `s.my`), reduces cumulative CPU cost. Additionally, grouping non-essential stats (like emotions) behind feature flags avoids unnecessary memory operations when those features are disabled.
**Action:** Always aim to consolidate related global and room-level iterations into a single pass and use optimized conditional branches to minimize property access on high-volume objects like structures.

## 2026-10-06 - Proxy Iteration Overhead and Closure Hoisting

**Learning:** In the Screeps environment, `Game.rooms`, `Game.creeps`, etc., are engine-backed Proxy objects. Iterating over them with `for...in` triggers a Proxy lookup for every key, which is significantly slower than using `Object.values()` to fetch all values in a single pass. Furthermore, defining anonymous functions inside high-frequency loops (like per-creep processing) creates new closures every tick, leading to increased garbage collection pressure.
**Action:** Always use `Object.values()` and indexed `for` loops for global collections and hoist closure-heavy logic to the module level to minimize tick-to-tick CPU and memory overhead.

## 2026-10-20 - Unified Global Collection Caching

**Learning:** Engine-backed Proxy objects like `Game.rooms`, `Game.creeps`, and `Game.spawns` incur overhead every time `Object.values()` is called. In complex loops where multiple modules need these arrays, calling `Object.values()` repeatedly is wasteful. Fetching them once at the start of the loop and passing them as arguments, combined with tick-gated global caching for common objects like the primary spawn, significantly reduces cumulative CPU cost.
**Action:** Consolidate `Object.values(Game.*)` calls to the entry point of the main loop and use tick-gated global caches for high-frequency shared object lookups.

## 2026-11-03 - Refactoring Execution Logic with Short-Circuiting Returns

**Learning:** Extracting conditionals from large execution functions (like `_runTower`) into smaller, focused helper methods (`_tryAttack`, `_tryHeal`) improves maintainability. By making these helpers return a boolean, the original control flow and prioritization can be cleanly maintained using early returns.
**Action:** Use boolean-returning helper functions to extract complex execution branches while preserving strict short-circuiting logic in priority-based systems.

## 2026-11-17 - Hoisting and Volatile Caching in Defense Logic
**Learning:** Storing tick-specific data like `threatLevel` in `Memory` causes unnecessary serialization overhead and creates bugs in multi-room environments where values are overwritten. Using volatile properties on the `room` object (e.g., `room._threatLevel`) is faster and room-isolated. Furthermore, hoisting $O(N)$ `find` operations out of tower loops avoids redundant per-tower checks even with per-tick caching guards.
**Action:** Always prefer room-isolated volatile caching for tick-specific calculations and hoist $O(N)$ operations outside of nested loops to minimize property access and branch checking.

## 2026-12-01 - Optimizing High-Frequency Structure Scanning
**Learning:** In the Screeps environment, rooms often contain thousands of walls which dominate the `FIND_STRUCTURES` array. Performing even basic Proxy property lookups (like `s.my` or `s.hits`) on these non-essential objects during every tick's scanning loop (`warmRoomCache`) is a massive CPU drain. Implementing an early `continue` for walls and hoisting `hits`/`hitsMax` into local variables for other structures significantly reduces per-tick CPU overhead.
**Action:** Always use early `continue` for high-volume, non-essential objects in scanning loops and hoist frequently accessed engine properties to local variables to minimize Proxy lookup costs.

## 2026-04-28 - Volatile Cache for Visual Effects
**Learning:** Storing high-frequency visual data like trail positions in `Memory` causes significant CPU overhead due to JSON serialization/deserialization every tick. JavaScript `Map` in the module scope provides O(1) access and completely bypasses the `Memory` bottleneck. However, it requires manual cleanup (e.g., every 1500 ticks) to prevent memory leaks from dead creeps.
**Action:** Use module-scoped `Map` for non-persistent, high-frequency data and implement periodic cleanup tied to object lifespans.

## 2026-12-15 - Hostile Target Hoisting and Lazy-Loading Synergy
**Learning:** Combining per-tick hostile target hoisting (for focus fire) with lazy-loading of secondary targets (repair/heal) in defense loops eliminates redundant $O(N)$ engine calls. Reordering the defense loop to ensure `checkThreats` (the producer) runs before `manageTowers` (the consumer) is critical for cache validity without adding extra tick checks.
**Action:** Always reorder room-level management loops to follow a Producer-Consumer sequence and use lazy-loading for O(N) searches that are only required when primary targets are absent.

## Performance Update: tutorial.auto.js N+1
**Date:** 2024-04-30
**What:** Fixed N+1 query problem by caching `room.find(FIND_SOURCES)` and `room.find(FIND_CONSTRUCTION_SITES)` during iterative logic in `tutorial.auto.js`.
**Why:** Prevented redundant and expensive engine array allocations triggered by every single creep lookup in the same room.
**Improvement:** For a simulation of 50 creeps, reduced engine `find` calls from 1,000,000 per 10k ticks to exactly 10,000 for `step4_buildExtension`. Reduced duration from 68ms to 50ms, a ~25% reduction on raw simulated execution cost in standard JS environments.
