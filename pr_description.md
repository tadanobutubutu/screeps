💡 **What:** Eliminated an N+1 API bottleneck in `tutorial.auto.js` by hoisting the `tower.room.find(FIND_HOSTILE_CREEPS)` search outside of the loop over `towers`. A function-local `hostilesCache` ensures the engine search runs at most once per room per tick.

🎯 **Why:** To significantly reduce CPU usage and increase efficiency. `room.find()` is an expensive engine API call that was previously being unnecessarily repeated for every tower in the same room.

📊 **Measured Improvement:**
Benchmark Results (1,000 autoStep iterations against 100 mock towers in a room):

- **Baseline:** ~272.61 ms, with 100,000 `find` calls.
- **Optimized:** ~45.46 ms, with only 1,000 `find` calls.
- **Result:** Achieved an ~83.3% decrease in execution time for this code path and a 99% reduction in engine API queries for hostiles.
