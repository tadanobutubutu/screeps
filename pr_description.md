🎯 **What:** The testing gap addressed is the lack of test coverage for `scripts/update-main.js`. This script modifies `main.js` based on the content of `last-role-creation.json`, determining program flow via simple file existence checks and manipulating text. It was previously untested.

📊 **Coverage:** The new tests cover:
- Early exit when `last-role-creation.json` does not exist.
- Early exit when the JSON file exists but contains no role name.
- Successful prevention of duplicate imports if the role is already imported in `main.js`.
- Correct insertion of a new role require statement after existing role require statements.
- Correct insertion of a new role require statement at the top of the file when no existing roles are found.

✨ **Result:** The script was slightly refactored to export its execution logic for testability (without breaking its CLI usage). Test coverage for `scripts/update-main.js` has been increased to 100%, ensuring its file modification logic is reliable and regressions can be caught automatically.
