# 🛡️ Sentinel Learnings

## 2024-08-20 (Example)
- **Vulnerability:** Potential Command Injection via `execSync`
- **Context:** In `scripts/add-contributor.js`, `execSync('npx all-contributors-cli generate', { stdio: 'inherit' });` was used to run an external command. While hardcoded and currently not exploitable, using `execSync` is a poor security hygiene practice as it invokes a shell and can lead to command injection if inputs are ever incorporated.
- **Fix:** Switched to `execFileSync` to bypass shell execution completely. Replaced the single string command with an executable string and an array of arguments: `execFileSync(cmd, ['all-contributors-cli', 'generate'], { stdio: 'inherit' });`, taking care to handle the `.cmd` extension correctly on Windows platforms (`process.platform === 'win32' ? 'npx.cmd' : 'npx'`).
