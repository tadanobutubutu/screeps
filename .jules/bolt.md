## 2026-02-13 - Supporting arguments in tryCatch for hoisting
**Learning:** Hoisting logic functions to the module level in Screeps avoids per-tick function re-definition, but often these functions need access to loop-specific context (like the current creep). Extending the `tryCatch` wrapper to support `...args` allows passing this context without using anonymous function closures, further reducing garbage collection pressure.
**Action:** Always ensure logging/error wrappers support argument passing to facilitate hoisting of high-frequency loop logic.

## 2026-02-26 - Adaptive Guarding of Visual Effects
**Learning:** Frequent calls to visual effects (RoomVisual) deep in role logic or gamification systems can cause significant CPU spikes and memory serialization overhead, even if the visuals aren't strictly necessary for gameplay. Guarding these at the entry point of the VFX library using an adaptive system and per-tick caching provides a massive global speedup.
**Action:** Implement per-tick cached guards in high-frequency utility libraries (VFX, Logging, Stats) to respect the system's adaptive load management state.

## 2026-03-17 - O(N) Target Selection in High-Frequency Roles
**Learning:** Using Array.sort() to find a single optimal target (e.g., most damaged structure) in Screeps roles is an O(N log N) operation that wastes CPU, especially in rooms with many structures. A single-pass O(N) loop is significantly more efficient and avoids the memory overhead of sorting.
**Action:** Replace sort() with linear scans when only the best target is needed, and combine with per-tick caching on the room object to further minimize room.find calls.
