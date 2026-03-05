## 2026-03-01 - Stack Trace Sanitization
**Vulnerability:** Information leakage through full error stack traces.
**Learning:** Screeps environments often log full error stacks which include absolute file paths. This reveals internal server directory structures.
**Prevention:** Use a regex-based sanitizer like `getSafeStack` to strip absolute paths, keeping only filenames and line numbers for debugging without exposing sensitive infrastructure details.
