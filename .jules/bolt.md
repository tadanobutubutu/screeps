# ⚡ Bolt Learnings

- `room.find()` calls can be expensive when used inside the main loop for objects like `FIND_STRUCTURES` and `FIND_MY_STRUCTURES`.
- Replacing `room.find` with `cache.getStructures(room)` and `cache.getMyStructures(room, type)` effectively reduces the engine API overhead.
- When doing so, ensure that mock objects used in tests correctly reflect the new function signatures and properly mimic the game engine's filtering behavior (e.g., returning arrays rather than `undefined` when no values match).
