# 🛡️ Sentinel's Security Journal

## 2026-03-01 - [Screeps AI Security Baseline]
**Vulnerability:** Initial security review of the Screeps AI bot.
**Learning:** Found that full error stack traces are being logged to `Memory.logs` and the Screeps console. This can leak absolute file paths and internal code structure to anyone with access to the Screeps account or by reading the game's memory.
**Prevention:** Implement stack trace sanitization to strip absolute paths while preserving line numbers and function names for debugging.
