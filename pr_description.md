🎯 **What:** Extracted the room caching and creep data collection logic out of the overly long `processCreeps` function in `main.js`.

💡 **Why:** The `processCreeps` function was handling too many concerns directly, making it hard to read and maintain. By extracting the core data gathering logic into dedicated `warmRoomCache` and `collectCreepData` helper functions, the logic is easier to follow and test in isolation.

✅ **Verification:** Verified by running the syntax validation (`node -c main.js`) and test suite (`npx jest --reporters default`) with all tests successfully passing.

✨ **Result:** Improved maintainability by reducing complexity within `processCreeps` while keeping the performance optimizations intact.
