## 2026-06-15 - [Hardened Path Redaction & Fail-Secure Logging]

**Vulnerability:** Broken stack trace sanitization due to syntax errors (`if ( === undefined)`) and a path redaction regex (`/(\/|...)/`) that caused false positives on mathematical division (e.g., `1/2`) or root slashes.  
**Learning:** Security utilities must be exceptionally robust; a failure in the logger can crash the entire AI or leak unsanitized data. Path redaction regexes should require at least one subdirectory level (e.g. `/\/[a-zA-Z0-9_-]+\//`) to avoid redacting non-path slashes used in arithmetic or versioning.  
**Prevention:** Always verify security utilities with `node -c` and unit tests covering both positive (redaction) and negative (false positive) cases. Implement fail‑secure patterns (e.g., `try‑catch` with generic fallback) in sanitization logic.

## 2026-06-02 - [Enhanced Secret Redaction]

**Vulnerability:** Weak log redaction logic that failed to catch prefixed environment variables (e.g., `SCREEPS_TOKEN`) and lacked comprehensive keywords (e.g., `dsn`).  
**Learning:** Simple string replacement or rigid regex patterns are