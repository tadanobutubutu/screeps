## 2026-08-11 - Target ID Caching for Upgraders
**Learning:** In Screeps, running complex multi-pass or single-pass search and filtering operations (such as finding storage, links, containers, dropped energy, or sources) inside high-frequency role ticks incurs high CPU overhead. Caching the target ID directly in `creep.memory` and validating it across ticks avoids O(N) lookup and distance scanning per tick.
**Action:** Implement target ID caching patterns for all energy harvesting/delivery role paths to reuse computed target results across ticks.

## 2026-08-14 - Persistent Source-to-Container Cache for Miner Role
**Learning:** Scanning for nearby containers near static energy sources on every single tick in miner role loops consumes redundant CPU. Since source-to-container spatial associations are entirely static, caching the mapped container ID directly in a persistent module-level dictionary avoids repeated room-wide scans and distance calculations.
**Action:** Cache static structure mappings (e.g., container or source assignments) in persistent module-level lookups using Game.getObjectById to resolve references tick-by-tick.
