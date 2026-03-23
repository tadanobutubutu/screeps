## 2026-02-26 - Robust Stack Trace Sanitization
**Vulnerability:** Internal directory structure leakage via unsanitized stack traces.
**Learning:** Simple regex patterns like `/(\/|\\)([\w.-]+\.js:)/g` often fail to remove the entire absolute path, instead only removing individual separators. Cross-platform path formats (Unix vs. Windows) and characters like spaces must be explicitly handled.
**Prevention:** Use a more robust pattern like `/(?:[a-zA-Z]:)?(\/|\\)(?:.*[\/\\\\])?([^\/\\?%*:|"<>]+:\d+:\d+)/g` to capture and remove the entire absolute path from the root down to the filename.

## 2026-02-27 - Prototype Pollution in Memory Utilities
**Vulnerability:** Prototype Pollution via unsanitized room names and cache keys.
**Learning:** Using user-controlled strings (like room names or external cache keys) directly as object keys in the global `Memory` object can allow attackers to overwrite `Object.prototype` properties (e.g., via `__proto__`). This is especially dangerous in Screeps where `Memory` is persistent and globally accessible.
**Prevention:** Always validate object keys against a blocklist of dangerous properties (`__proto__`, `constructor`, `prototype`). Implement validation helpers as local constants to ensure they remain safe even when functions are destructured from their modules.

## 2026-03-04 - Global Object Hijacking via Object.assign
**Vulnerability:** Prototype Pollution via `Object.assign` on global `Memory`.
**Learning:** Using `Object.assign(Memory, data)` is dangerous if `data` is from an external source (like a backup or user input). It bypasses simple property assignment and can lead to prototype pollution if the source object contains a `__proto__` key.
**Prevention:** Replace `Object.assign` on global or sensitive objects with a safe iteration that validates every key using a hardened `isSafeKey` helper.

## 2026-03-04 - Memory Denial of Service in Screeps
**Vulnerability:** Denial of Service (DoS) via log-driven memory exhaustion.
**Learning:** In environments with tight memory limits (like Screeps' 2MB limit), unbounded logging or data accumulation can be used to crash the system. Attackers can intentionally trigger verbose logs with large payloads.
**Prevention:** Implement strict length limits (truncation) and volume limits (rotation/sampling) for all persistent data structures, especially logs and telemetry.

## 2026-03-05 - Recursive Backup Memory DoS
**Vulnerability:** Exponential memory growth via recursive serialization of the global `Memory` object.
**Learning:** Storing a JSON-serialized snapshot of the entire `Memory` object *inside* a property of that same `Memory` object (e.g., `Memory.backups`) causes the serialized size to double with every backup. This quickly exceeds the environment's memory limit (2MB in Screeps) and crashes the process.
**Prevention:** Always exclude the backup storage property (e.g., `backups`) from the object before serialization. Use a shallow clone and `delete` the recursive key before calling `JSON.stringify`.

## 2026-03-05 - Comprehensive Memory DoS Mitigation
**Vulnerability:** Denial of Service (DoS) via accumulation of non-essential metadata across multiple systems.
**Learning:** In memory-constrained environments, simply clearing one or two large structures may not be enough if many small but cumulative data points (diaries, emotion history, visual trails) are scattered across the `Memory` object. A centralized emergency cleanup must be comprehensive and target all known "heavy" or "volatile" properties.
**Prevention:** Implement a centralized `emergencyCleanup` that not only deletes large root-level structures but also performs a deep pass to prune non-essential metadata from persistent entities like creeps and rooms.

## 2026-03-20 - Hardening Gamification Combo System
**Vulnerability:** Prototype Pollution and Memory Denial of Service (DoS) via unsanitized combo types.
**Learning:** Even internal-looking systems like gamification tracking can be vulnerable if they use external or dynamic strings as object keys. In Screeps, where Memory is limited to 2MB, unbounded object growth is a viable DoS vector.
**Prevention:** Always validate keys with `isSafeKey`, truncate string lengths, and enforce a strict cap on the number of unique keys allowed in a collection.

## 2026-03-21 - Memory DoS Protection for Evolution System
**Vulnerability:** Memory Denial of Service (DoS) via unbounded arrays in the Evolution system (`history`, `suggestions`, `queue`).
**Learning:** Systems that accumulate data over time, especially those storing large payloads like code suggestions, can quickly exceed environment memory limits (2MB in Screeps) if not capped. This leads to persistent script crashes and loss of state.
**Prevention:** Implement strict `MAX_` length constants for all arrays in the global `Memory` object. Use immediate rotation (`shift()`) for historical logs and early returns (caps) for processing queues.

## 2026-03-22 - Hardening Memory Map and Diary Systems
**Vulnerability:** Prototype Pollution and Memory DoS in `memory.visualizer.js` via room and creep names and unbounded data structures.
**Learning:** Even diagnostic or visualization tools like a "Memory Map" can become attack vectors if they store user-controlled or environment-controlled strings (room names, creep names) without validation. Furthermore, simple history arrays (`explored`) or key-value stores (`rooms`) can grow indefinitely, leading to a "Slow DoS" as the bot's memory reaches its limit.
**Prevention:** Always validate room/creep names with `isSafeKey`. Enforce strict caps on both arrays and objects. For object-based storage, implement an eviction policy (e.g., deleting the entry with the oldest `lastVisit`) when the size limit is reached.

## 2026-03-24 - Memory DoS Protection for Emotion Achievements
**Vulnerability:** Memory Denial of Service (DoS) via unbounded achievement tracking in `EmotionSystem.celebrate`.
**Learning:** Even positive "gamification" features like tracking creep achievements can become a DoS vector if they allow unbounded array growth or store unsanitized, potentially large strings in the global `Memory` object. In environments like Screeps (2MB limit), every byte counts.
**Prevention:** Always enforce strict length limits on string inputs and maximum size caps on arrays stored in persistent memory. Use `shift()` or `slice()` to implement a "rolling window" for historical data to ensure memory consumption remains constant regardless of the number of events.
