## 2026-02-25 - [Path Leakage in Stack Traces]
**Vulnerability:** Absolute file system paths (e.g., `/home/user/...` or `C:\Users\...`) were leaked in error logs via `e.stack`.
**Learning:** Default Error.stack in Node.js/V8 includes full paths which can reveal server structure or username information to end-users or in logs.
**Prevention:** Always use a sanitization utility like `utils.logging.getSafeStack` before logging or storing stack traces.
