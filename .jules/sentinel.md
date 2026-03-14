## 2026-02-26 - Robust Stack Trace Sanitization
**Vulnerability:** Internal directory structure leakage via unsanitized stack traces.
**Learning:** Simple regex patterns like `/(\/|\\)([\w.-]+\.js:)/g` often fail to remove the entire absolute path, instead only removing individual separators. Cross-platform path formats (Unix vs. Windows) and characters like spaces must be explicitly handled.
**Prevention:** Use a more robust pattern like `/(?:[a-zA-Z]:)?(\/|\\)(?:.*[\/\\\\])?([^\/\\?%*:|"<>]+:\d+:\d+)/g` to capture and remove the entire absolute path from the root down to the filename.

## 2026-02-27 - Prototype Pollution in Memory Utilities
**Vulnerability:** Prototype Pollution via unsanitized room names and cache keys.
**Learning:** Using user-controlled strings (like room names or external cache keys) directly as object keys in the global `Memory` object can allow attackers to overwrite `Object.prototype` properties (e.g., via `__proto__`). This is especially dangerous in Screeps where `Memory` is persistent and globally accessible.
**Prevention:** Always validate object keys against a blocklist of dangerous properties (`__proto__`, `constructor`, `prototype`). Implement validation helpers as local constants to ensure they remain safe even when functions are destructured from their modules.
