🧪 [Testing Improvement] Add test for adaptive system logModeChange

🎯 **What:** The testing gap addressed
The `logModeChange` helper function in `system.adaptive.js` was completely untested. This function is responsible for formatting and outputting logs regarding system mode changes. We've added a test to spy on `console.log` to verify its outputs.

📊 **Coverage:** What scenarios are now tested
- Ensuring the exact console string formatting when the system transitions from one mode to another (e.g., from EMERGENCY to FULL).
- Verifying the stats properties (CPU usage percentage, CPU bucket size, and memory usage percentage) are correctly formatted and logged.

✨ **Result:** The improvement in test coverage
We've plugged a testing gap for `system.adaptive.js`. It increases unit test coverage and confidence when making refactorings regarding system adaptive console output. The total test suite ran successfully (568 tests passed).
