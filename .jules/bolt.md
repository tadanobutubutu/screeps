## 2025-05-15 - Hoisting for performance in Screeps
**Learning:** Hoisting function definitions and configuration objects outside of high-frequency loops (like the Screeps main loop) prevents unnecessary per-tick memory allocations and reduces garbage collection pressure. This is especially critical in Screeps where CPU time is a limited resource.
**Action:** Always check if objects or functions defined inside the loop can be moved to the module level. Ensure utility functions like `tryCatch` support passing arguments to avoid closure creation.
