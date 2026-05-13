💡 What: Implemented `getMyCreeps` function in `utils/cache.js` and used it in `towerManager.js` replacing the `room.find(FIND_MY_CREEPS)` call.
🎯 Why: `room.find` calls are an expensive CPU operation. By utilizing the global room cache for this, we avoid allocating and processing arrays repeatedly.
📊 Measured Improvement: Benchmarked a loop running `towerManager` 10k times on a mocked room state with multiple creeps. Original execution time was ~970ms, optimized execution time was ~877ms. This shows an approx. 10% improvement in this specific benchmark.
