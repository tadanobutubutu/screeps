## 2025-05-15 - Hoisting configuration maps in hot-path functions
**Learning:** Defining large objects (like configuration maps or feature toggles) inside functions that are called many times per tick (e.g., in every creep loop) causes significant CPU overhead due to repeated allocations and increases garbage collection pressure.
**Action:** Always hoist static configuration maps, role definitions, or body part templates to the module level or a shared constant to ensure they are only allocated once when the module is loaded.
