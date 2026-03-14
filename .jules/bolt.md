## 2026-02-13 - Supporting arguments in tryCatch for hoisting
**Learning:** Hoisting logic functions to the module level in Screeps avoids per-tick function re-definition, but often these functions need access to loop-specific context (like the current creep). Extending the `tryCatch` wrapper to support `...args` allows passing this context without using anonymous function closures, further reducing garbage collection pressure.
**Action:** Always ensure logging/error wrappers support argument passing to facilitate hoisting of high-frequency loop logic.

## 2026-02-26 - Adaptive Guarding of Visual Effects
**Learning:** Frequent calls to visual effects (RoomVisual) deep in role logic or gamification systems can cause significant CPU spikes and memory serialization overhead, even if the visuals aren't strictly necessary for gameplay. Guarding these at the entry point of the VFX library using an adaptive system and per-tick caching provides a massive global speedup.
**Action:** Implement per-tick cached guards in high-frequency utility libraries (VFX, Logging, Stats) to respect the system's adaptive load management state.
