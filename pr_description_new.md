🎯 **What:**
- Added tests for the previously untested exported function `getEnergyFromStorage` in `src/utils/roleUtils.js` to ensure it operates correctly in different scenarios.
- Fixed GitHub Actions workflows (`jaipilot-generate.yml` and `release-drafter.yml`) that were failing due to invalid action tags or missing configuration parameters, respectively.

📊 **Coverage:** Covered edge cases such as missing minimum energy, cache lookup fallback, cache invalidation, moving out of range, custom target key parameter and custom minimum energy parameter.

✨ **Result:** Reached 100% statement and branch coverage in `src/utils/roleUtils.js` and resolved CI failures.
