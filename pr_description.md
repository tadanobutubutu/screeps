🧹 Code Health: Refactor `warmRoomCache` to improve readability and maintainability

🎯 **What:** The `warmRoomCache` function in `main.js` was long and complex, performing multiple distinct operations including basic cache array initialization and looping through structures for categorization. This was split into two functions: `initializeRoomBasicCache` and `categorizeRoomStructures`, with `warmRoomCache` acting as an orchestrator.

💡 **Why:** Breaking down long functions (Extract Method) improves the codebase's readability, cognitive load, and testability. By separating the initial fast array reset operations from the slower loop-based categorizations, future performance optimizations will be easier to profile and apply.

✅ **Verification:** Verified the logic remains identical to the previous implementation and ran the full unit test suite via `pnpm test` and formatting via `npx prettier --write main.js`. All core functionality remains intact.

✨ **Result:** Improved the code health of `main.js` without altering behavior. The codebase is now easier to read and maintain for this critical caching path.
