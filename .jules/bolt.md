## 2024-05-23 - Use cached structures and sites in _planExtensions
Replaced direct `room.find` calls for `STRUCTURE_EXTENSION` in `_planExtensions` with `cache.getMyStructures` and `cache.getConstructionSites`. Direct `room.find` queries bypass the cache and run every time `_planExtensions` is evaluated, consuming CPU. This optimization leverages the existing cache module.
