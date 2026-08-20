## 2026-08-11 - Target ID Caching for Upgraders
**Learning:** In Screeps, running complex multi-pass or single-pass search and filtering operations (such as finding storage, links, containers, dropped energy, or sources) inside high-frequency role ticks incurs high CPU overhead. Caching the target ID directly in `creep.memory` and validating it across ticks avoids O(N) lookup and distance scanning per tick.
**Action:** Implement target ID caching patterns for all energy harvesting/delivery role paths to reuse computed target results across ticks.

## 2026-08-14 - Persistent Source-to-Container Cache for Miner Role
**Learning:** Scanning for nearby containers near static energy sources on every single tick in miner role loops consumes redundant CPU. Since source-to-container spatial associations are entirely static, caching the mapped container ID directly in a persistent module-level dictionary avoids repeated room-wide scans and distance calculations.
**Action:** Cache static structure mappings (e.g., container or source assignments) in persistent module-level lookups using Game.getObjectById to resolve references tick-by-tick.

## 2026-08-15 - Single-Pass Loop Optimization for Structure Counting
**Learning:** Using `Array.prototype.filter` to count matching objects (e.g., damaged structures in `countDamagedStructures`) allocates intermediate arrays and callback closures on every invocation. Replacing `.filter(...).length` with a standard single-pass `for` loop eliminates array allocation overhead and closure creation in tick routines.
**Action:** Use single-pass `for` loops instead of `.filter().length` when only the count or aggregate total of matching elements is required.

## 2026-08-16 - Lazy Target Evaluation for Tower Defense Logic
**Learning:** In tower defense routines, unconditionally iterating through all room structures to build arrays of repair candidates before checking for hostile creeps wastes CPU cycles when hostile creeps are present. Evaluating hostile presence first and lazily scanning structures in a single pass with early termination prevents unneeded room-wide iterations and array allocations.
**Action:** Always place hostile checks before structure scans in tower loops, and lazily break early when single repair targets are needed.
## 2023-10-25
* **Optimization**: Throttle `cleanMemory` execution to every 100 ticks.
* **Why**: Iterating over `Memory.creeps` every tick is computationally expensive.
* **Impact**: Significant CPU savings by avoiding unnecessary checks in 99% of ticks.
