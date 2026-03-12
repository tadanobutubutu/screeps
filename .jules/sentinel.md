## 2026-02-27 - Error Stack Trace Sanitization

**Vulnerability:** Information Leakage via Stack Traces.
**Learning:** Full error stack traces in Screeps logs can expose absolute internal file paths of the environment, which might reveal sensitive information about the server or local development environment.
**Prevention:** Implement a sanitization utility like `getSafeStack` that uses regex to strip absolute paths while preserving filenames and line/column information. Use this utility in all error logging paths.
