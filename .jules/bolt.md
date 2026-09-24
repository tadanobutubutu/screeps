## Performance Optimization Insights

In room construction planning routines (`_planRoads`), iterating through a long path and repeatedly looping through cached arrays of structures and sites for every tile coordinates caused high CPU overhead (O(PathLength * Structures/Sites)).

**The Fix:**
By hoisting the iteration of the caches outside the path traversal loop and populating a `Set` composed of string representations of the grid coordinates (`x,y`), we change the inner check from an O(N) array iteration for each tile to an O(1) set lookup (`structSet.has(posKey)`).

Additionally, combining these checks before calling `room.lookForAt` short-circuits expensive native lookup calls. In benchmark testing (simulating a room with 500 structures and 500 sites across a 50-step path executed 1000 times), this optimization reduced the execution time from ~364ms down to ~223ms, yielding approximately a ~38% execution speedup.

## 2026-08-03 - Bitpacked Integer Set Encoding for Screeps Grid Coordinates
**Learning:** In 50x50 Screeps grid coordinate lookups (e.g. `findNearestOpenTile`), formatting string keys (`${x},${y}`) for `Set` lookups inside loops creates string object allocations on every evaluated tile and structure/creep result. Replacing string formatting with bitpacked integer formulas (`x * 50 + y`) stores fast primitive integers in the `Set`, providing O(1) lookups while completely eliminating heap string allocation and GC pressure.
**Action:** Use `x * 50 + y` integer encoding instead of string template formatting (`${x},${y}`) when building coordinate sets in Screeps room/pathfinding utility functions.

## 2026-08-04 - Pre-calculating Distance Map in Array Sorting
**Learning:** In Screeps position array sorting routines (`sortByDistance`), invoking method calls (`origin.getRangeTo(item)`) directly inside `Array.prototype.sort()` comparator callback evaluates distances O(N log N) times (2 calls per comparison). Pre-mapping distance values into a temporary decorated array before sorting reduces distance method evaluations to O(N) (exactly 1 call per object).
**Action:** When sorting Screeps entities by distance or property calculations, map objects to `{ obj, dist }` first, sort by `dist`, and unmap to eliminate redundant method/property evaluations.

## 2026-08-05 - Property Access Hoisting in Cost Matrix Calculations
**Learning:** In high-frequency Screeps room cost matrix calculation loops (`_applyStructureCosts`, `_applyConstructionSiteCosts`), accessing nested object properties (`struct.pos`, `struct.structureType`, `site.pos`, `site.structureType`) repeatedly inside loop conditions and switch statements adds unnecessary property lookup overhead for every structure and construction site in the room. Hoisting these references into local variables (`const pos = struct.pos; const type = struct.structureType;`) eliminates redundant property resolution calls per iteration during pathfinding.
**Action:** Always hoist nested object properties (like `.pos` and `.structureType`) to local variables before switch statements or repeated conditional checks in structure scanning loops.

## 2026-08-06 - Short-Circuit Full-Health Structures in Repair Scans
**Learning:** In room-wide structure repair target scanning (`_findDamagedStructure`), over 95% of room structures are typically at 100% full health (`s.hits === s.hitsMax`). Computing threshold lookups (`REPAIR_THRESHOLD[type]`) and floating-point divisions (`s.hits / s.hitsMax`) for full-health structures on every tick wastes CPU. Adding a fast integer short-circuit check (`if (s.hits >= s.hitsMax) continue;`) before dictionary lookups and division operations bypasses redundant evaluations for undamaged structures.
**Action:** Always check `s.hits >= s.hitsMax` early in structure health scanning loops before performing property lookups, threshold comparisons, or division operations.

## 2026-09-24 - Pre-warmed Caches and Indexed Loops for Role Discovery
**Learning:** In creep behavior scripts (e.g., `role.healer`), identifying nearby companion creeps often involves calling `room.find(FIND_MY_CREEPS, { filter: ... })`. This operation is computationally expensive because it evaluates all creeps in the room and incurs the closure allocation overhead of the filter callback function every tick. Utilizing a pre-warmed room cache system (`cache.getMyCreeps(room)`) combined with a traditional indexed `for` loop eliminates both the expensive `room.find()` native call and the closure allocation overhead.
**Action:** Replace `room.find()` and `.filter()` operations used for intra-role companion discovery with indexed traversals over cached creep arrays from `src/utils/cache.js`.
