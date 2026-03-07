## 2026-02-25 - [Hoisting for Per-Tick Optimization]
**Learning:** High-frequency functions and objects defined within the Screeps `loop` or within frequently called methods (like `isEnabled`) incur significant per-tick memory allocation and GC pressure.
**Action:** Always hoist static configuration maps and logic functions to the module level. Use parameter passing or anonymous function wrappers (for utilities like `logger.tryCatch`) to maintain access to loop-specific variables without re-creating the logic itself.
