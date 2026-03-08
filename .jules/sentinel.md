## 2026-02-27 - Stack Trace Sanitization
**Vulnerability:** Information Disclosure via absolute file paths in error stack traces.
**Learning:** Screeps environments or CI/CD logs can expose the internal directory structure of the runner/server when `error.stack` is logged directly. This can aid attackers in reconnaissance.
**Prevention:** Use a sanitization utility like `utils.logging.getSafeStack` to strip absolute paths from stack traces before logging. For critical paths where dependencies should be minimized (like global catch blocks), implement a local regex-based sanitization.
