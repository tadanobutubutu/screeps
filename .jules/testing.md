# Testing Learnings
- When adding tests for existing module exports in cache.js, it is crucial to mock the `Game` and `Room` structures (such as `mockRoom.find()`) correctly to simulate the environment, and assert they are called with proper global constants (e.g. `global.FIND_MY_SPAWNS`).
- Added robust assertions for game objects like drops, spawns, containers, and links, ensuring filtering branches and cache lookups execute as intended.
