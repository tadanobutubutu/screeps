🎯 **What:** The `MissionSystem.createMission` function in `utils.missions.js` was too long and complex, violating the "Long Function" code health metric. This PR extracts input sanitization, memory eviction, and reward hardening logic into three smaller helper functions (`sanitizeInput`, `evictOldMissions`, `hardenReward`).

💡 **Why:** By extracting these cohesive blocks of logic into standalone helper functions, `MissionSystem.createMission` becomes much shorter, easier to read, and simpler to maintain. The intent of each security operation is now clearly encapsulated in its own function.

✅ **Verification:** I ran the isolated test suite (`tests/utils.missions.test.js`) and the full test suite to confirm that no existing functionality or security checks were broken by this refactoring. The code reviewer also verified the safety of the extraction.

✨ **Result:** The `utils.missions.js` codebase is now cleaner, easier to parse visually, and the `createMission` function is significantly shorter while retaining identical behavior.
