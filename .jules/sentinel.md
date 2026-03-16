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
