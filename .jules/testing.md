# Testing Learnings
- When adding tests for existing module exports in cache.js, it is crucial to mock the `Game` and `Room` structures (such as `mockRoom.find()`) correctly to simulate the environment, and assert they are called with proper global constants (e.g. `global.FIND_MY_SPAWNS`).
- Added robust assertions for game objects like drops, spawns, containers, and links, ensuring filtering branches and cache lookups execute as intended.
- Screeps tests typically rely on mocking global objects (`Memory`, `Game`) for each scenario.
- When creating tests for cleanup tasks, test both positive (data kept) and negative (data removed) scenarios.
- Make sure test titles align exactly with the assertions written inside them to avoid confusion for future developers reading the test file.
