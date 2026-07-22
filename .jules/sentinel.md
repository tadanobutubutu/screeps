## 2026-07-22 - [Defense-in-depth Numeric Reward Hardening]

**Vulnerability:** Logic bypass or resource exploitation via unvalidated or manipulated numeric parameters (e.g., negative, Infinite, NaN, or non-numeric types) in mission reward assignment.
**Learning:** Checking for truthiness (like `reward || 0`) is insufficient because negative numbers, NaN, and non-number types (objects, strings, arrays) can bypass these simple checks and cause unexpected behavior, state pollution, or resource manipulation.
**Prevention:** Enforce defense-in-depth checks on incoming numeric parameters by verifying the exact type (`typeof val === 'number'`), confirming finiteness (`Number.isFinite(val) && !isNaN(val)`), and bounding via non-negativity constraints (`Math.max(0, val)`).

## 2026-06-15 - [Hardened Path Redaction & Fail‑Secure Logging]

**Vulnerability:** Broken stack trace sanitization due to syntax errors (`if ( === undefined)`) and a path redaction regex (`/(\/|...)/`) that caused false positives on mathematical division (e.g., `1/2`) or root slashes.  
**Learning:** Security utilities must be exceptionally robust; a failure in the logger can crash the entire AI or leak unsanitized data. Path redaction regexes should require at least one subdirectory level (e.g. `/\/[a-zA-Z0-9_-]+\//`) to avoid redacting non‑path slashes used in arithmetic or versioning.  
**Prevention:** Always verify security utilities with `node -c` and unit tests covering both positive (redaction) and negative (false positive) cases. Implement fail‑secure patterns (e.g., `try‑catch` with generic fallback) in sanitization logic.

## 2026-06-02 - [Enhanced Secret Redaction]

**Vulnerability:** Weak log redaction logic that failed to catch prefixed environment variables (e.g., `SCREEPS_TOKEN`) and lacked comprehensive keywords (e.g., `dsn`).  
**Learning:** Simple string replacement or rigid regex patterns are insufficient for protecting against accidental secret leakage in logs, especially when environment variables often carry project‑specific prefixes. Static scanners can also be bypassed or triggered by literal secret keywords in code, making obfuscated keyword lists a useful double‑layered approach.  
**Prevention:** Use robust, prefix‑aware regular expressions for log sanitization. Centralize redaction logic when possible, and ensure it covers common secret patterns including Sentry DSNs and prefixed API keys.

## 2026-03-05 - Improved Redaction in Logs

**Vulnerability:** Partial data exposure in logs. The previous logic used a simple match, which failed to capture the full value if it contained spaces, even when quoted.  
**Learning:** Redaction regexes must explicitly handle quoted strings to prevent partial leakage of multi‑word values.  
**Prevention:** Use a regex pattern that recognizes single and double‑quoted blocks as a single value when following a sensitive keyword, and employ a prefix‑aware approach to capture environment‑variable‑style secrets.