# Bolt Agent Learnings

- Replacing high-frequency `room.find()` calls inside loops with hoisted cache accesses (e.g., `cache.getConstructionSites(room)`) drastically reduces CPU overhead in Screeps.
- Engine Proxy-to-Array conversion costs from `room.find` are expensive, especially inside iteration logic like `_planSourceContainers`.
