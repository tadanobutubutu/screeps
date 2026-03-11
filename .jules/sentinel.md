## 2026-02-26 - Stack Trace Information Leakage
**Vulnerability:** Absolute internal file paths leaked in error stack traces (CWE-209).
**Learning:** Error logs often contain full filesystem paths where the code is executed (e.g., `/home/runner/work/...`), which can expose internal directory structures to potential attackers or unintended observers.
**Prevention:** Sanitize stack traces using a robust regex that strips absolute paths but preserves essential debugging information (filename, line, column). In Screeps, this should be done in both the main loop and centralized logging utilities.
