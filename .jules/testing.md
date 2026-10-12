# Testing Learnings

- Screeps tests typically rely on mocking global objects (`Memory`, `Game`) for each scenario.
- When creating tests for cleanup tasks, test both positive (data kept) and negative (data removed) scenarios.
- Make sure test titles align exactly with the assertions written inside them to avoid confusion for future developers reading the test file.
