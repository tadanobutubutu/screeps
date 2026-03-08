# Bolt's Performance Journal ⚡

## 2026-02-26 - Hoisting for performance
**Learning:** Hoisting function definitions and configuration objects outside of the main loop and frequently called functions significantly reduces per-tick memory allocation and GC pressure in Screeps AI. Defining objects like the feature map in `system.adaptive.js` every time `isEnabled` is called is a major bottleneck when called multiple times per tick.
**Action:** Always look for objects or functions defined inside the loop or high-frequency functions and move them to the module scope.
