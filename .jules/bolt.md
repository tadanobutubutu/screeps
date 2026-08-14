## 2026-08-11 - Target ID Caching for Upgraders
**Learning:** In Screeps, running complex multi-pass or single-pass search and filtering operations (such as finding storage, links, containers, dropped energy, or sources) inside high-frequency role ticks incurs high CPU overhead. Caching the target ID directly in `creep.memory` and validating it across ticks avoids O(N) lookup and distance scanning per tick.
**Action:** Implement target ID caching patterns for all energy harvesting/delivery role paths to reuse computed target results across ticks.
