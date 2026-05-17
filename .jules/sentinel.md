## 2026-05-16 - FIFO Cache Eviction
**Vulnerability:** Cache Exhaustion DoS.
**Learning:** Bypassing cache when full protects memory but can overwhelm the underlying data source (resource exhaustion) because all subsequent requests result in expensive 'fetcher' calls.
**Prevention:** Implement FIFO eviction to maintain cache availability under load while respecting memory limits, ensuring new data can always be cached.

## 2026-05-17 - Partial Path Match Bypass
**Vulnerability:** Path Traversal (Partial Match).
**Learning:** Using `startsWith(baseDir)` for path validation can be bypassed if the base directory name is a prefix of a malicious sibling directory (e.g., `/app` matching `/app_danger`).
**Prevention:** Ensure the base directory path ends with a path separator (e.g., `path.sep`) before performing the `startsWith` check to enforce strict directory boundary validation.
