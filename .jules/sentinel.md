## 2026-05-16 - FIFO Cache Eviction
**Vulnerability:** Cache Exhaustion DoS.
**Learning:** Bypassing cache when full protects memory but can overwhelm the underlying data source (resource exhaustion) because all subsequent requests result in expensive 'fetcher' calls.
**Prevention:** Implement FIFO eviction to maintain cache availability under load while respecting memory limits, ensuring new data can always be cached.

## 2026-05-17 - Partial Path Match Bypass
**Vulnerability:** Path Traversal (Partial Match).
**Learning:** Using `startsWith(baseDir)` for path validation can be bypassed if the base directory name is a prefix of a malicious sibling directory (e.g., `/app` matching `/app_danger`).
**Prevention:** Ensure the base directory path ends with a path separator (e.g., `path.sep`) before performing the `startsWith` check to enforce strict directory boundary validation.

## 2026-05-18 - Pathfinder Cache Starvation DoS
**Vulnerability:** Cache Starvation and CPU Exhaustion DoS.
**Learning:** If a cache simply stops accepting new entries when full, it can enter a permanent state of cache misses for any new operations. In a resource-constrained environment like Screeps, this leads to repeated expensive re-computations (CPU exhaustion).
**Prevention:** Implement a unified eviction policy (like FIFO) across all caching modules. Always attempt to cleanup expired entries before evicting. Ensure cache retrieval is robust against corrupted or non-numeric expiration values.

## 2026-05-19 - Log-Level Logic Bypass
**Vulnerability:** Unvalidated Input / Logic Bypass.
**Learning:** Directly assigning state from persistent memory (e.g., `Memory.logLevel`) without validation can allow invalid values to bypass logic gates. For example, a negative log level could satisfy `val > LOG_LEVEL.DEBUG`, causing the logger to always output debug info regardless of the intended level.
**Prevention:** Always use setter functions with validation logic (like `setLevel`) when initializing state from persistent storage or user-controlled input, rather than direct property assignment.
