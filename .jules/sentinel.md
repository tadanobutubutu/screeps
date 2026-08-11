## 2024-05-27

- **Task:** Fix Command Injection via `execSync` in `scripts/check_repo_health.js`
- **Context:** `scripts/check_repo_health.js` was using `child_process.execSync` to run `eslint` and `jest` commands via `npx` and package manager binaries. The command string was constructed using template literals, which can lead to shell injection if any part of the constructed string is user-controlled.
- **Vulnerability:** Command Injection. An attacker could potentially inject arbitrary shell commands if they can control the inputs that construct the `command` string passed to `execSync`.
- **Severity:** High
- **Impact:** Arbitrary code execution on the host machine running the health check script. This could lead to a full system compromise.
- **Fix:**
    1.  Replaced `execSync` with `execFileSync`.
    2.  Modified the `runCommand` function to accept `command` and an array of `args` instead of a single concatenated string.
    3.  Updated the calls to `runCommand` for both ESLint and Jest to explicitly separate the executable and its arguments.
    4.  Handled cross-platform execution on Windows by appending `.cmd` to `npx` and the package manager executable when running via `execFileSync`.
- **Verification:** Ran `pnpm test` and `git diff` to ensure functionality is retained and the vulnerability is mitigated.
