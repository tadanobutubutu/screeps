# 2026-08-20

**Vulnerability:** Uncaught TypeError when JSON.stringify encounters a BigInt.
**Fix:** Modified `_createCircularReplacer` in `src/utils/logger.js` to stringify BigInt values (by appending 'n') before attempting to serialize them, avoiding crashes.
**Impact:** Prevents DoS conditions mid-tick.
**Verification:** Added unit tests ensuring `logger.info()` does not throw on BigInts and properly stringifies them.
