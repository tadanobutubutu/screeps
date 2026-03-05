# ⚡ Bolt's Performance Journal

This journal tracks critical performance learnings for the Screeps AI.

## 2025-05-15 - Hoisting for Tick Efficiency
**Learning:** In Screeps, `main.js` execution is repeated every tick. Defining functions or large configuration objects inside loops or even at the top level of the `loop` function causes redundant memory allocations and increases Garbage Collection (GC) pressure.
**Action:** Hoist function definitions and static configuration maps to the module level (outside `module.exports.loop`) to ensure they are only allocated once when the script is loaded.
