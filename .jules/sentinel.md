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

## 2026-05-19 - Log-Level Bypass via Memory Injection

**Vulnerability:** Log-Level Bypass (Information Leakage / DoS).
**Learning:** Directly assigning user-controlled values from `Memory` to internal state variables (like `_level`) without validation can bypass security logic if the values are malformed (e.g., negative values, strings, or `null`). In JavaScript, unvalidated values can satisfy or break logic gates (e.g., a negative log level satisfying `val > LOG_LEVEL.DEBUG`, or `undefined > 0` evaluating to `false`), causing the logger to fail open or behave unexpectedly.
**Prevention:** Always use validated setters (like `setLevel()`) when initializing state from `Memory` or other persistent storage. Ensure setters perform strict type checking and range validation, falling back to safe defaults for any invalid input.

## 2026-05-25 - Object Key Lookup with Screeps Constants

**Vulnerability:** Incorrect Key Lookup / Prototype Pollution / Missing Features.
**Learning:** Using Screeps constants like `STRUCTURE_CONTAINER` directly as keys in object literals (e.g., `CONTAINER: 100`) creates a key named literally "CONTAINER", not the value of the constant (`"container"`). This leads to runtime failures during property lookups (e.g., `ENERGY_WITHDRAW_THRESHOLD[structureType]`) because the actual structure type strings from the game engine don't match the hardcoded strings in the object. This is an application logic flaw. Using computed property names (`[STRUCTURE_CONTAINER]: 100`) evaluates the constant correctly.
**Prevention:** Use computed property names `[CONSTANT_NAME]: value` when defining lookup maps that are intended to be indexed by dynamic engine values or constants to guarantee accurate property resolution.
