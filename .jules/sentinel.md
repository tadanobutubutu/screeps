## 2026-02-26 - Robust Stack Trace Sanitization
**Vulnerability:** Internal directory structure leakage via unsanitized stack traces.
**Learning:** Simple regex patterns like `/(\/|\\)([\w.-]+\.js:)/g` often fail to remove the entire absolute path, instead only removing individual separators. Cross-platform path formats (Unix vs. Windows) and characters like spaces must be explicitly handled.
**Prevention:** Use a more robust pattern like `/(?:[a-zA-Z]:)?(\/|\\)(?:.*[\/\\\\])?([^\/\\?%*:|"<>]+:\d+:\d+)/g` to capture and remove the entire absolute path from the root down to the filename.
