## 2026-08-11 - [Harden Console Logging Output and Prototype Pollution Protection]

**Vulnerability:** The console logger was missing the actual output execution line (`console.log`), resulting in silent failure where sanitized, redacted, and HTML-escaped logs were not printed. This crippled security logging visibility, making it impossible to audit potential console injection attacks or log-based information disclosure.
**Learning:** Over-reliance on regex redaction and sanitization blocks can occasionally result in developers or automated tools accidentally stripping or omitting final output sinks during refactoring.
**Prevention:** Always cover core logging behaviors with regression tests that explicitly assert console output is printed with correct arguments (including safe emoji and escaped strings), and prevent prototype pollution by creating the lookup maps using `Object.create(null)` to bypass standard object inheritance.
