## 2025-05-15 - [Adaptive system optimization]
**Learning:** Hoisting configuration objects and removing redundant initialization in high-frequency functions (hot paths) provides a measurable CPU win in Screeps environments.
**Action:** Always check functions called multiple times per tick for object literals that can be moved to a module-level constant.
