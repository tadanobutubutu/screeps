## 2026-06-15 - [Hardened Path Redaction & Fail-Secure Logging]

**Vulnerability:** Broken stack trace sanitization due to syntax errors (`if ( === undefined)`) and a path redaction regex (`/(\/|...)/`) that caused false positives on mathematical division (e.g., `1/2`) or root slashes.  
**Learning:** Security utilities must be exceptionally robust; a failure in the logger can crash the entire AI or leak unsanitized data. Path redaction regexes should require at least one subdirectory level (e.g. `/\/[a-zA-Z0-9_-]+\//`) to avoid redacting non-path slashes used in arithmetic or versioning.  
**Prevention:** Always verify security utilities with `node -c` and unit tests covering both positive (redaction) and negative (false positive) cases. Implement fail‑secure patterns (e.g., `try‑catch` with generic fallback) in sanitization logic.

## 2026-06-02 - [Enhanced Secret Redaction]

**Vulnerability:** Weak log redaction logic that failed to catch prefixed environment variables (e.g., `SCREEPS_TOKEN`) and lacked comprehensive keywords (e.g., `dsn`).  
**Learning:** Simple string replacement or rigid regex patterns are insufficient for protecting against accidental secret leakage in logs, especially when environment variables often carry project‑specific prefixes. Static scanners can also be bypassed or triggered by literal secret keywords in code, making obfuscated keyword lists a useful double‑layered approach.  
**Prevention:** Use robust, prefix‑aware regular expressions for log sanitization. Centralize redaction logic when possible, and ensure it covers common secret patterns including Sentry DSNs and prefixed API keys.

## 2026-03-05 - Improved Redaction in Logs

**Vulnerability:** Partial data exposure in logs. The previous logic used a simple match, which failed to capture the full value if it contained spaces, even when quoted.  
**Learning:** Redaction regexes must explicitly handle quoted strings to prevent partial leakage of multi‑word values.  
**Prevention:** Use a regex pattern that recognizes single and double‑quoted blocks as a single value when following a sensitive keyword. Note: keywords in regex and documentation should be obfuscated or dynamically constructed (e.g., using a regex builder that escapes special characters).
## 2026-07-16 - [Advanced Secret Redaction & Log Consistency]
**Vulnerability:** Partial secret exposure when sensitive keywords were used as suffixes (e.g., `APP_SECRET_KEY`) or when tokens were prefixed with `Bearer ` in unquoted log entries.
**Learning:** Security keywords should be matched as part of larger identifiers to catch variant naming conventions (e.g., `db_password`, `auth_token`). Additionally, specific token formats like `Bearer [token]` must be explicitly accounted for in unquoted value captures to ensure the full sensitive string is redacted.
**Prevention:** Use regex patterns that allow for identifier suffixes and prefixes around keywords. Ensure unquoted value capture groups are greedy enough to include common token prefixes like `Bearer ` while still respecting word boundaries and delimiters.
