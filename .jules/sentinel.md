## 2026-02-28 - GitHub Actions Command Injection
**Vulnerability:** User-controlled data (issue titles, console logs) was directly interpolated into shell commands within GitHub Actions workflows.
**Learning:** Developers often use `${TITLE}` or `$(cat file.txt)` directly in `run` steps, assuming the shell will handle it safely, but this allows an attacker to break out of the quotes and execute arbitrary commands.
**Prevention:** Always use environment variables to pass user-controlled data to shell commands in GitHub Actions. For example, `env: TITLE: ${{ github.event.issue.title }}` followed by `run: gh pr create --title "$TITLE"`.
