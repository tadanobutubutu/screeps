# 🛡️ Sentinel Security Journal

## 2026-02-26 - [Stack Trace Leakage Prevention]
**Vulnerability:** Internal absolute file paths leaked in error logs and console output via stack traces.
**Learning:** Screeps environments can expose host-system path structures in `Error.stack`, which could be used by an attacker to map the internal environment or identify specific toolchains.
**Prevention:** Sanitize all stack traces using a standard utility to strip absolute path components while retaining the essential file name and line information for debugging.
