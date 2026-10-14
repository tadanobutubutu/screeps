## 2026-10-06 - Direct Structure Type Filtering in Tower Manager Urgent Rampart Search

**Learning:** Calling `cache.getMyStructures(room)` without a structure type parameter fetches all owned room structures (spawns, extensions, towers, links, storage, etc.), requiring manual structure type comparisons (`s.structureType === STRUCTURE_RAMPART`) on every candidate. Passing `STRUCTURE_RAMPART` directly to `cache.getMyStructures(room, STRUCTURE_RAMPART)` leverages pre-warmed structure type caches or filtered engine queries, reducing loop iterations from $O(N_{myStructures})$ to $O(N_{ramparts})$.
**Action:** Pass specific structure type constants to `cache.getMyStructures(room, type)` when searching for specific structure categories.

## 2026-10-04 - Deferring Low Priority Target Scans and Early Exit on Adjacent Targets in Harvester Role

**Learning:** In harvester delivery target selection (`_findPrimaryTarget`), calculating tower distance during spawn/extension iteration evaluates range math on lower-priority towers even when a spawn or extension target is selected. Separating priority passes defers tower evaluation until needed and adding an early exit (`if (dist <= 1) break`) skips distance math for remaining candidates when an adjacent target is found.
**Action:** Defer distance math for lower-priority targets and exit search loops early when an adjacent target (range <= 1) is identified.

## 2026-10-04 - Controller Target ID Caching in Upgrader Role

**Learning:** In upgrader creeps during upgrade mode, accessing `creep.room.controller` on every tick performs repeated room structure lookups. Caching `controller.id` in `creep.memory[TARGET_KEY]` allows O(1) direct retrieval via `Game.getObjectById(targetId)` while upgrading.
**Action:** Cache controller and static structure references in creep memory during persistent actions to avoid repeated room property queries.

## 2026-10-04 - Short-Circuiting Lower Priority Structures in Repairer Target Selection

**Learning:** In repairer structure scanning (`_findBestRepairTarget` in `src/roles/repairer.js`), evaluating floating-point hit ratios (`s.hits / s.hitsMax`) and distance calculations (`creep.pos.getRangeTo(s)`) for lower-priority structures after a higher-priority damaged structure (e.g. container) is already selected wastes CPU cycles. Adding `if (priority > minPriority) continue;` right after priority lookup skips division, range evaluation, and sub-function comparison logic for lower-priority candidates.
**Action:** Always short-circuit lower-priority items prior to arithmetic operations and distance evaluations in priority-ordered target search loops.

## 2026-10-03 - Short-Circuiting Full-Health Structures in Backup Repair and Deferring Distance Math in Target Selection

**Learning:** In builder backup repair loops (`_repairAsBackup`), iterating over all room structures without checking `s.hits >= s.hitsMax` forces floating point arithmetic (`s.hitsMax * 0.8`) and structure type comparisons for ~90-95% undamaged structures. Furthermore, in harvester target selection (`_findPrimaryTarget`), calculating distance (`creep.pos.getRangeTo(s)`) before checking structure type evaluates range math on non-target structures. Adding `if (s.hits >= s.hitsMax) continue;` in structure scans and deferring distance evaluation inside structure type conditionals skips redundant arithmetic and distance operations.
**Action:** Always short-circuit undamaged structures before arithmetic evaluations in repair routines, and defer range calculations until after structure type matching.

## 2026-10-02 - Hoisting Controller Position in Upgrader Container Search

**Learning:** In `_getEnergyFromContainer` (`src/roles/upgrader.js`), accessing `controller.pos` inside the container iteration loop (`container.pos.getRangeTo(controller) <= 5`) forces redundant property resolution of `controller.pos` for every container in the room. Hoisting `const ctrlPos = controller.pos` outside the search loop eliminates repeated property evaluation calls per candidate container per tick.
**Action:** Always hoist target position references (like `controller.pos`) to a local variable outside search loops before evaluating distance checks.

## 2026-10-01 - Room-Level Per-Tick Target Caching for Tower Operations

**Learning:** In rooms with multiple towers, each tower executing `_selectAttackTarget` or `_selectHealTarget` independently evaluates multi-pass target priority loops. Since target state (enemy positions/HP and injured creeps) remains constant during a single tick execution, caching the selected target on `_attackTargetCache` and `_healTargetCache` with `Game.time` and `room.name` validation allows second and subsequent towers in the same room to acquire targets in $O(1)$ time.
**Action:** When multiple static structures (like towers) execute target selection logic within the same room and tick, cache selected targets at the room-tick level to bypass redundant search loops.

## 2026-09-30 - Short-Circuiting Lower Priority Sites in Builder Target Selection

**Learning:** In builder target selection routines (`_getTargetSite`), evaluating distance calculations (`creep.pos.getRangeTo(site)`) before checking priority causes redundant range computations for lower-priority construction sites. Adding an early integer priority check (`if (priority > minPriority) continue;`) skips distance math for lower-priority sites.
**Action:** Always short-circuit priority comparisons before distance evaluations in target selection routines.

## 2026-08-25 - Hoisting Filter Predicates in Cache Utilities

**Learning:** Defining inline anonymous functions inside Screeps `room.find()` calls causes unnecessary closure allocations every cache fetch. Hoisting static predicate functions to module scope eliminates callback allocation overhead.
**Action:** Always hoist invariant predicate functions used in high-frequency cache fetchers to module scope.

## 2026-08-25 - Standardizing Loop Control in High-Frequency Miner Routines

**Learning:** In Screeps high-frequency miner source assignment routines, replacing `for...of` loops with indexed `for` loops eliminates iterator allocation overhead per tick.
**Action:** Always prefer indexed `for` loops over `for...of` in hot path target search functions.

## 2026-08-25 - Throttling Visual Intent Calls and Hoisting Memory Keys in Creep Roles

**Learning:** Calling creep.say() on every tick during high-frequency routines (e.g. RCL8 upgrader operations) adds unnecessary Screeps engine intent overhead. Throttling visual intents and hoisting invariant memory keys to module scope reduces tick CPU cost.
**Action:** Throttle non-critical visual intents like creep.say() with tick modulo checks and hoist static memory keys to module scope.

## 2026-08-05 - Property Access Hoisting in Cost Matrix Calculations

**Learning:** In high-frequency Screeps room cost matrix calculation loops (`_applyStructureCosts`, `_applyConstructionSiteCosts`), accessing nested object properties (`struct.pos`, `struct.structureType`, `site.pos`, `site.structureType`) repeatedly inside loop conditions and switch statements adds unnecessary property lookup overhead for every structure and construction site in the room. Hoisting these references into local variables (`const pos = struct.pos; const type = struct.structureType;`) eliminates redundant property resolution calls per iteration during pathfinding.
**Action:** Always hoist nested object properties (like `.pos` and `.structureType`) to local variables before switch statements or repeated conditional checks in structure scanning loops.

## 2026-08-06 - Short-Circuit Full-Health Structures in Repair Scans

**Learning:** In room-wide structure repair target scanning (`_findDamagedStructure`), over 95% of room structures are typically at 100% full health (`s.hits === s.hitsMax`). Computing threshold lookups (`REPAIR_THRESHOLD[type]`) and floating-point divisions (`s.hits / s.hitsMax`) for full-health structures on every tick wastes CPU. Adding a fast integer short-circuit check (`if (s.hits >= s.hitsMax) continue;`) before dictionary lookups and division operations bypasses redundant evaluations for undamaged structures.
**Action:** Always check `s.hits >= s.hitsMax` early in structure health scanning loops before performing property lookups, threshold comparisons, or division operations.

## 2026-09-24 - Utilizing Pre-warmed Caches for room.find

**Learning:** In Screeps roles that frequently call `room.find` (like `role.scout`), directly invoking `creep.room.find(FIND_DROPPED_RESOURCES)` on every tick evaluates an O(N) array search inside the game engine, causing high CPU load across many creeps. Replacing this with the pre-warmed `cache` module (`cache.getDroppedResources(creep.room)`) implements TTL-based caching. This reduces the native engine calls by drastically dropping the frequency of native `room.find` calls per tick.
**Action:** When working with frequently queried collections in creep tick routines (e.g. dropped resources, structures), check if an equivalent helper function in `src/utils/cache.js` exists and use it instead of `room.find()`.

## 2026-08-06 - Eliminating Dead-Code and Reversing Preset Search in Body Selection

**Learning:** In Screeps spawn managers, calculating unused `bestBody` and iterating forward through cost-ascending presets forces unnecessary iterations on every tick. Reversing loop direction for backward indexed search enables early-exit on the highest affordable preset while eliminating dead-code calculations and object allocations.
**Action:** Always search sorted preset arrays in reverse to exit early on the optimal choice and ensure calculated values are strictly required by return paths.

## 2026-09-26 - Short-Circuiting Tower Repair Scans for Full-Health Structures

**Learning:** In tower structure repair scans (`towerManager._findDamagedStructure`), evaluating dictionary property lookups (`REPAIR_THRESHOLD[type]`) and floating-point ratio calculations (`s.hits / s.hitsMax`) for full-health structures on every tick wastes CPU across all rooms. Adding `if (s.hits >= s.hitsMax) continue;` short-circuits ~90-95% of undamaged room structures prior to threshold lookups and division operations.
**Action:** Fast integer short-circuits (`if (s.hits >= s.hitsMax) continue;`) should always precede structure type threshold lookups and arithmetic operations in tower and creep repair routines.

## 2026-09-27 - Pre-Computing Distances in sortByDistance Routine

**Learning:** Invoking `origin.getRangeTo()` inside `Array.prototype.sort()` comparison callbacks executes distance calculations $O(N \log N)$ times. Pre-mapping distances into an intermediate structure reduces engine calls to $O(N)$.
**Action:** Always pre-calculate expensive metrics or position calculations in single-pass array maps before sorting arrays.

## 2026-09-28 - Fast Short-Circuiting in Repairer Structure Scanning

**Learning:** Over 90% of structures scanned by repairers during `_findBestRepairTarget` are at 100% full health. Consolidating duplicate `_needsRepair` implementations and adding `if (structure.hits >= structure.hitsMax && type !== STRUCTURE_WALL && type !== STRUCTURE_RAMPART) return false;` short-circuits full-health non-wall/rampart structures before threshold dictionary lookups and arithmetic operations.
**Action:** Always place integer short-circuit checks prior to structure type threshold lookups and arithmetic calculations in structure health evaluation loops.

## 2026-09-29 - Cached Room Creep Access in getStats

**Learning:** Iterating over global `Game.creeps` and filtering by room name scales with total account creep count ($O(N_{total})$) and allocates temporary arrays on every invocation. Utilizing `cache.getMyCreeps(room)` reduces complexity to $O(N_{room})$ and reuses pre-cached room arrays.
**Action:** Always prefer `cache.getMyCreeps(room)` over iterating global `Game.creeps` when querying room creep counts or roles.

## 2026-10-05 - Avoid Global Game.creeps Iteration in RoomManager Safe Mode Check

**Learning:** In `_checkSafeMode` (`src/managers/roomManager.js`), using `Object.values(Game.creeps).filter(...)` scans all global creeps across all rooms and allocates temporary arrays on every check. Utilizing `cache.getMyCreeps(room)` with an indexed `for` loop reduces complexity from O(N_global) to O(N_room) and avoids array allocations.
**Action:** Use `cache.getMyCreeps(room)` instead of `Object.values(Game.creeps)` when counting room-specific creeps.

## 2026-10-06 - Hoisting Fallback Patrol Points and Short-Circuiting Self-Heal in Defender Role

**Learning:** In `src/roles/defender.js`, `_getPatrolPoints` re-allocated a 5-element array of point objects on every patrol tick when no ramparts were present. Additionally, `run()` evaluated `creep.getActiveBodyparts(HEAL)` before checking `creep.hits < creep.hitsMax * 0.9`, forcing body part array scanning on full-health creeps. Hoisting fallback patrol points to module scope and reordering the health condition eliminates per-tick object allocations and skips body scanning for healthy defenders.
**Action:** Hoist fallback position arrays to module scope and evaluate simple scalar checks (`hits < hitsMax`) before body part inspection routines (`getActiveBodyparts`).

## 2026-10-06 - Hoisting Priority Check Before Health Evaluation in Repairer Target Search

**Learning:** In structure search loops sorted by priority, placing priority short-circuit checks (`if (priority > minPriority) continue;`) before structure health checks (`_needsRepair(s, room, wallTarget)`) prevents executing function calls, dictionary threshold lookups, and scalar health comparisons on lower-priority candidates when a higher-priority damaged target is already found.
**Action:** Always check structure priority against `minPriority` before evaluating complex health checks or `_needsRepair` sub-functions in structure scan loops.

## 2026-10-07 - Single-Pass Target Range Evaluation in Transporter Search

**Learning:** In `role.transporter.js`, invoking native `creep.pos.findClosestByRange(targets)` invokes C++ engine wrapper allocations and callback overhead per search call. Implementing a manual single-pass indexed `for` loop with early-exit on adjacent targets (`dist <= 1`) bypasses engine marshalling overhead and cuts CPU processing time during target search.
**Action:** Replace native `findClosestByRange` calls in high-frequency role modules with single-pass indexed `for` loops and `dist <= 1` short-circuits.
## $(date +%Y-%m-%d) - Replace redundant room source find with cache.getSources in auto.evolution.js
- Implemented a performance optimization by using a centralized cache (`cache.getSources(room)`) for counting sources in rooms, replacing a redundant inline caching loop over `FIND_SOURCES`.
## 2024-05-23 - Use cached structures and sites in _planExtensions
Replaced direct `room.find` calls for `STRUCTURE_EXTENSION` in `_planExtensions` with `cache.getMyStructures` and `cache.getConstructionSites`. Direct `room.find` queries bypass the cache and run every time `_planExtensions` is evaluated, consuming CPU. This optimization leverages the existing cache module.
## 2026-09-24 - Pre-warmed Caches and Indexed Loops for Role Discovery
**Learning:** In creep behavior scripts (e.g., `role.healer`), identifying nearby companion creeps often involves calling `room.find(FIND_MY_CREEPS, { filter: ... })`. This operation is computationally expensive because it evaluates all creeps in the room and incurs the closure allocation overhead of the filter callback function every tick. Utilizing a pre-warmed room cache system (`cache.getMyCreeps(room)`) combined with a traditional indexed `for` loop eliminates both the expensive `room.find()` native call and the closure allocation overhead.
**Action:** Replace `room.find()` and `.filter()` operations used for intra-role companion discovery with indexed traversals over cached creep arrays from `src/utils/cache.js`.
Learned that replacing Array.prototype.filter with a traditional for loop significantly reduces CPU time in high-frequency functions, but we must also avoid allocating new arrays entirely by caching results or maintaining clean data structures.
## 2026-08-07 - Loop Iteration over `forEach`
**Learning:** In high-frequency array iteration (such as source or path loops in Screeps, or visualizer routines), replacing `Array.prototype.forEach()` with traditional indexed `for` loops eliminates the overhead of closure function allocations. This is particularly useful where performance and GC pressure are important considerations.
**Action:** Replace `Array.prototype.forEach()` with traditional indexed `for` loops in high-frequency arrays.
## Performance Optimization: Healer creep injured array
- Replaced `room.find` with `cache.getMyCreeps()` when checking for injured creeps to utilize existing array caches.
- Replaced `.filter()` method with standard indexed `for` loops to reduce closure allocations during high frequency checks.
- Baseline `~92ms`, Improved to `~15.5ms` (~83% performance gain in a benchmark of 10,000 iterations).
## 2026-09-24 - Single-Pass Hostile Structure Selection in Attacker Role
**Learning:** Building a filtered array with `Array.prototype.filter` and then calling `findClosestByRange` allocates a new array every tick for each attacker creep, adding GC pressure. A single indexed `for` loop that filters and tracks the minimum range in one pass removes the intermediate allocation.
**Action:** Replace `filter()` + `findClosestByRange()` pairs in hot role loops with a single-pass indexed `for` loop that tracks the closest candidate.
- In high-frequency Screeps distance calculation routines (such as selecting targets for medics), replacing `Array.prototype.findClosestByRange()` with traditional indexed `for` loops and inlined `Math.abs` distance calculations dramatically reduces per-tick overhead. In benchmarks, the manual loop runs 5x faster (23ms vs 110ms for 10000 iterations finding the closest among 1000 items).

## 2026-10-07 - Direct Rampart Structure Type Querying in Tower Urgent Rampart Scan

**Learning:** In `towerManager._findUrgentRampart`, calling `cache.getMyStructures(room)` without specifying `STRUCTURE_RAMPART` retrieves all owned structures (extensions, spawns, towers, links) and iterates through each to filter by structure type. Calling `cache.getMyStructures(room, STRUCTURE_RAMPART)` utilizes the structure-type cached array directly, reducing iteration complexity from $O(N_{myStructures})$ to $O(N_{ramparts})$ and eliminating type checks for non-rampart structures.
**Action:** Pass `STRUCTURE_RAMPART` directly to `cache.getMyStructures` when searching exclusively for rampart targets.

## 2026-10-07 - Deferring Distance Math in Construction Site Selection and Reordering Structure Type Checks in Backup Repair

**Learning:** In `_getTargetSite` (`src/roles/builder.js`), computing `creep.pos.getRangeTo(site)` before comparing priority evaluates distance math for initial higher-priority candidates that are later superseded by lower-priority-number (higher priority) candidates. Deferring distance calculations inside `priority < minPriority` and `priority === minPriority` branches eliminates redundant distance math. Additionally, reordering structure type comparisons (`s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART`) before floating-point hit calculations (`s.hits < s.hitsMax * 0.8`) in `_repairAsBackup` skips floating-point arithmetic for wall and rampart structures.
**Action:** Defer distance math until priority conditions require range comparison, and place fast scalar/type equality checks before floating-point arithmetic.

## 2026-10-08 - Fast Indexed Loops and Pre-Cached Getters in Container Planning

**Learning:** In `_planSourceContainers` (`src/managers/roomManager.js`), calling `room.find(FIND_CONSTRUCTION_SITES)` and using `Array.prototype.filter()` allocated new arrays and closure functions on every plan cycle. Utilizing `cache.getConstructionSites(room)` combined with short-circuiting indexed `for` loops avoids native C++ engine binding calls and eliminates array/closure allocations.
**Action:** Replace direct `room.find` and `Array.prototype.filter` calls in periodic planning functions with cached getters (`cache.getConstructionSites(room)`) and short-circuiting indexed `for` loops.
