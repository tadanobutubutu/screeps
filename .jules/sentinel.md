# Sentinel Security Journal

## 2026-03-01 - Stack Trace Sanitization
**Vulnerability:** Information Exposure (CWE-200) via full error stack traces in logs and console.
**Learning:** Screeps environments often log errors to a shared memory or console that can be seen by other tools or users. Absolute file paths in these traces reveal internal directory structures of the server/runner.
**Prevention:** Always use a sanitization utility like `getSafeStack` before logging `error.stack`. In critical/global error handlers, implement the sanitization locally to avoid dependency failures during a crash.
