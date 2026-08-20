# 2026-08-20

**Vulnerability:** Uncaught TypeError when JSON.stringify encounters a BigInt.
**Fix:** Modified `_createCircularReplacer` in `src/utils/logger.js` to stringify BigInt values (by appending 'n') before attempting to serialize them, avoiding crashes.
**Impact:** Prevents DoS conditions mid-tick.
**Verification:** Added unit tests ensuring `logger.info()` does not throw on BigInts and properly stringifies them.

**Vulnerability:** The console logger was missing the actual output execution line (`console.log`), resulting in silent failure where sanitized, redacted, and HTML-escaped logs were not printed. This crippled security logging visibility, making it impossible to audit potential console injection attacks or log-based information disclosure.
**Learning:** Over-reliance on regex redaction and sanitization blocks can occasionallyresult in developers or automated tools accidentally stripping oromitting final output sinks during refactoring.
**Prevention:** Always cover core logging behaviors with regression tests that explicitlyassert console output is printed with correct arguments (including safe emoji andescaped strings), and prevent prototype pollution by creating the lookup maps using `Object.create(null)` tobypass standard object inheritance.

- Fix `TypeError` DoS in `logger.js` caused by `JSON.stringify` failing on `BigInt` objects. Handled by explicitly casting `bigint` values to strings (`value.toString() + 'n'`) within the internal circular replacer function, ensuring robust data serialization and application stability.

This merge resolves both issues by incorporating the fix for BigInt serialization and the prevention strategies for securing console logging, thus enhancing both functionalities and security.