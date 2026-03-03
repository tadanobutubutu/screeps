# Sentinel Security Journal

## 2026-02-25 - [Stack Trace Sanitization]
**Vulnerability:** Internal path leakage in error stack traces.
**Learning:** Error stack traces in the Screeps environment (and during local development/deployment) can expose internal file structures and absolute paths. This information leakage can be used by an attacker to map the system's internals.
**Prevention:** Implement a `getSafeStack` utility that uses regex to strip absolute paths from stack traces while preserving essential filenames, line numbers, and column numbers for debugging. Always apply this sanitization before logging stack traces to `Memory.logs` or the console.
