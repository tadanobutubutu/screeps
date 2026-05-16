## 2026-05-16 - FIFO Cache Eviction
**Vulnerability:** Cache Exhaustion DoS.
**Learning:** Bypassing cache when full protects memory but can overwhelm the underlying data source (resource exhaustion) because all subsequent requests result in expensive 'fetcher' calls.
**Prevention:** Implement FIFO eviction to maintain cache availability under load while respecting memory limits, ensuring new data can always be cached.
