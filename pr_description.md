🎯 **What:** Extracted the room caching and creep data collection logic out of the overly long `processCreeps` function in `main.js`.

💡 **Why:** The `processCreeps` function was handling too many concerns directly, making it hard to read and maintain. By extracting the core data gathering logic into dedicated `warmRoomCache` and `collectCreepData` helper functions, the logic is easier to follow and test in isolation.

✅ **Verification:** Verified by running the syntax validation (`node -c main.js`) and test suite (`npx jest --reporters default`) with all tests successfully passing.

✨ **Result:** Improved maintainability by reducing complexity within `processCreeps` while keeping the performance optimizations intact.

---
(Previous merge info below)

💡 **What:** Replaced direct `room.find()` calls in `buildCostMatrix` and `getRoadPositions` within `src/utils/pathfinder.js` with `cacheUtils.getStructures()` and `cacheUtils.getConstructionSites()`.

🎯 **Why:** `room.find()` has heavy engine overhead. Since `buildCostMatrix` is called frequently (especially when regenerating paths for many creeps), avoiding raw `room.find` loops reduces CPU usage per tick by leveraging the robust, already existing `cache.js` caching layer.

📊 **Measured Improvement:** A simple benchmark of `buildCostMatrix` called 10,000 times showed the execution time dropping from ~36ms to ~29ms. More importantly, it reduces the `find()` call count per path calculation from 3 raw calls to 0 when caches are warm.

---

💡 **What:**
Optimized `_planRoads` in `src/managers/roomManager.js` by replacing the expensive `room.lookForAt` engine API calls inside the path calculation loop with a pre-computed `Set` of occupied tiles.
