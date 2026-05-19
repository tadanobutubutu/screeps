# Bolt Journal

## Performance Learnings

* **Avoid Uncached Structure Queries:** `room.find(FIND_STRUCTURES)` runs $O(N)$ engine-level logic and allocates a new Proxy-to-Array array for each call. We should prefer using cached wrappers like `cache.getStructures(room).filter(...)` where `cache` retains the `room.find()` result per tick to save CPU, particularly in tight loops or idle ticks.
* **Use Dedicated Mocks for Tests:** When porting a module to `cache.getStructures`, ensure any tests (e.g., `tests/src.roles.builder.test.js`) are updated to use `mockCache.getStructures.mockReturnValue(...)` instead of `room.find.mockReturnValue(...)`.
* **Measure Before You Optimize:** Writing a quick `benchmark.js` script mimicking the environment (like Screeps) allows for quick validations and proving performance speedups (e.g. from 247ms -> 111ms for 10,000 iterations).

