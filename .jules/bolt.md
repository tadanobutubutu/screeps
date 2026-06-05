# Bolt Learnings

## 2026-06-05 - $O(1)$ Cache Size Tracking and FIFO Eviction
**Learning:** Using `Object.keys(cache).length` and `Object.keys(cache)[0]` for capacity management and FIFO eviction leads to $O(N)$ CPU overhead on every cache miss or insertion. In high-frequency environments like Screeps, this scales poorly as the cache grows toward `MAX_CACHE_ENTRIES`.
**Action:** Implemented module-level volatile state (`_cacheSize`, `_cacheOrder` Map) to track cache metrics in $O(1)$. Map iteration order provides the "oldest" key for eviction in $O(1)$ via `keys().next().value`.

## 2026-06-05 - Lazy Cache Synchronization
**Learning:** Local tracking variables (`_cacheSize`) can drift if the global object (`global.cache`) is modified externally or if the script environment resets.
**Action:** Implemented `_syncCacheState` to lazily re-initialize local tracking whenever `global.cache` reference changes, ensuring consistency with the persistent global object.
