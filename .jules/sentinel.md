## 2026-06-15 - [Hardened Path Redaction & Fail‑Secure Logging]

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
**Prevention:** Use a regex pattern that recognizes single and double‑quoted blocks as a single value when following a sensitive keyword, and employ a prefix‑aware approach to capture environment‑variable‑style secrets.

## 2026-07-23 - [Robust Logging Execution & Recovery]

**Vulnerability:** A truncated core utility file (`utils.logging.js`) with an unterminated string constant causing full compilation/runtime failure in Jest test suites and production execution. When a core logging script fails to parse, security-critical log filtering and redaction are bypassed entirely, risking data leaks.  
**Learning:** Critical security controllers must fail securely. If a script is truncated or corrupted, the runtime environment should not default to executing un-redacted fallback paths or crashing. Robust and complete module implementations, proper unit testing of every log-level boundary, and safe prototype pollution prevention are essential.  
**Prevention:** Ensure all logging modules are fully complete and feature-hardened. Implement polymorphic parameter parsing (`log(level, msg)` or `log(msg, level)`) to avoid misuse, enforce strict type checks, and re-initialize corrupted runtime logging stores safely. Use robust pre-commit checks to verify syntax validity before deployment.

- Math.random() relies on a predictable PRNG and should not be used as a fallback for secure random number generation, as it can allow attackers to predict future numbers leading to exploitation.

## 2026-07-26 - [Insecure Math.random Usage Fix]

**Vulnerability:** A script `scripts/random-experiment.js` used the insecure `Math.random()` function to select experiments, which could be predictable.  
**Learning:** For predictable random values (like random selection in security sensitive contexts), cryptographically secure pseudorandom number generators (CSPRNG) must be used. Node.js provides the `crypto` module, specifically `crypto.randomInt()`, as a drop-in secure replacement for integer generation.  
**Prevention:** Use `crypto.randomInt()` instead of `Math.random()` when cryptographic security or unpredictability is required. Avoid artifacts from file modification by thoroughly cleaning up scratchpad files before submitting PRs.

* **Failing Securely (Fail Closed):** When a function is explicitly designed to return cryptographically secure values (e.g., `secureRandomInt`), and the primary secure mechanism (`crypto` module) is unavailable, it must **throw an error** rather than falling back to an insecure, predictable generator like `Math.random()` or a simple Linear Congruential Generator (LCG). Providing a guessable number silently creates a false sense of security and opens up exploitation vectors.