## 2026-03-03 - [Hoisting for Performance]
**Learning:** Hoisting function definitions and static configuration maps (like role targets or feature flags) outside of frequently called loops (like the main loop or creep iteration) significantly reduces per-tick memory allocation and garbage collection pressure in Screeps AI.
**Action:** Always look for objects or functions defined inside loops or the main tick loop that can be moved to the global scope or a module-level constant.
