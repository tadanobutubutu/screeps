# 🛡️ Sentinel Security Journal

## 2026-03-06 - [Sanitize stack traces to prevent path leakage]
**Vulnerability:** Information Disclosure via Error Logs. Absolute file paths (including Windows drive letters) in stack traces could reveal internal directory structures or sensitive environment details.
**Learning:** Screeps environments can sometimes expose full filesystem paths in their stack traces depending on how the code is executed or bundled. Simple regex patterns for paths often miss Windows-specific drive letters (e.g., `C:\`).
**Prevention:** Use a robust regex that handles both Unix-style and Windows-style paths, including drive letters. Duplicate critical sanitization logic in the main entry point to ensure protection even if utility modules are not loaded.
