## 2026-03-04 - [Hoisting for GC Reduction]
**Learning:** In a high-frequency loop environment like Screeps (1 tick per ~2-5s), recreating large configuration objects or function closures on every tick or for every creep introduces significant Garbage Collection (GC) pressure and unnecessary CPU overhead.
**Action:** Hoist all static configuration maps and logic functions outside of the main loop and iteration blocks. Pass necessary state (like the 'creep' object) as arguments rather than relying on closures.
