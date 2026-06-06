## 2026-06-02 - [Enhanced Secret Redaction]
**Vulnerability:** Weak log redaction logic that failed to catch prefixed environment variables (e.g., `SCREEPS_TOKEN`) and lacked comprehensive keywords (e.g., `dsn`).
**Learning:** Simple string replacement or rigid regex patterns are insufficient for protecting against accidental secret leakage in logs, especially when environment variables often carry project-specific prefixes. Static scanners can also be bypassed or triggered by literal secret keywords in code, making obfuscated keyword lists a useful double-layered approach.
**Prevention:** Use robust, prefix-aware regular expressions for log sanitization. Centralize redaction logic when possible, and ensure it covers common secret patterns including Sentry DSNs and prefixed API keys.
