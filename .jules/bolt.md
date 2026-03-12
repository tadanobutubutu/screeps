## 2026-02-25 - Hoisting configuration objects in hot functions
**Learning:** Defining large object literals (like feature flag maps) inside frequently called functions (e.g., `isEnabled` in a Screeps loop) causes significant overhead due to per-call memory allocation and garbage collection pressure.
**Action:** Always hoist static configuration maps and enumerations to the module level. In this case, hoisting `FEATURES` and `MODES` in `system.adaptive.js` resulted in a ~117x performance improvement (983ns to 8.35ns per call).
