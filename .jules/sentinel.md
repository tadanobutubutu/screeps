## Security Issue
Use of deprecated and predictable Math.random() for security-sensitive logic in `role.explorer.js`.

**Vulnerability:** The console logger was missing the actual output execution line (`console.log`), resulting in silent failure where sanitized, redacted, and HTML-escaped logs were not printed. This crippled security logging visibility, making it impossible to audit potential console injection attacks or log-based information disclosure.
**Learning:** Over-reliance on regex redaction and sanitization blocks can occasionally result in developers or automated tools accidentally stripping or omitting final output sinks during refactoring.
**Prevention:** Always cover core logging behaviors with regression tests that explicitly assert console output is printed with correct arguments (including safe emoji and escaped strings), and prevent prototype pollution by creating the lookup maps using `Object.create(null)` to bypass standard object inheritance.

## 2026-08-24 - [Path Traversal Prevention in AI PR Auto-Generation Script]

**Vulnerability:** `scripts/auto-pr-generator.js` constructed file paths directly using `path.join(process.cwd(), change.file)` when processing AI-suggested code changes. Unvalidated paths starting with `..` or containing absolute paths allowed arbitrary file writes outside the working directory.
**Learning:** Automated scripts processing file path strings generated from external APIs or LLMs can introduce path traversal vulnerabilities if paths are joined without strict canonicalization and root containment checks.
**Prevention:** Always resolve target paths using `path.resolve(process.cwd(), target)` and verify `path.relative(process.cwd(), safePath)` does not start with `..`, is not absolute, and is not empty before creating directories or writing files.

## 2026-08-31 - [Validate ISSUE_NUMBER against Path Traversal in GitHub REST API Requests]

**Vulnerability:** Unsanitized ISSUE_NUMBER environment variables interpolated directly into GitHub API endpoints allowed endpoint manipulation.
**Learning:** Environment variables containing issue identifiers from workflow inputs must be validated with strict digit regexes before interpolating into API endpoint paths.
**Prevention:** Always validate numeric issue identifiers against /^\d+$/ before sending API requests.

## 2026-09-25 - [Command Injection Prevention in main.js Process Spawning]

**Vulnerability:** `main.js` configured `shell: true` by default in `spawnProcess`, passing spawn arguments through shell interpretation and risking shell command injection vulnerabilities.
**Learning:** Using `shell: true` with `child_process.spawn()` invokes process commands through a system shell interpreter, making argument parsing vulnerable to shell command injection if any parameters contain untrusted input.
**Prevention:** Always default `shell: false` when spawning subprocesses using `child_process.spawn()` so executable files are called directly via system calls (`execve`) without shell expansion.

## 2026-09-26 - [Safe Exception Message Extraction in tryCatch Wrappers]

**Vulnerability:** In exception handling wrappers (`tryCatch` in `src/utils/logger.js` and `utils.logging.js`), direct property access on caught errors (`e.message`) caused secondary `TypeError: Cannot read properties of null` exceptions when non-Error primitives, strings, `null`, or `undefined` were thrown.
**Learning:** In JavaScript, any value can be thrown (`throw null`, `throw "string"`, `throw undefined`). Assuming caught exception objects always possess a `.message` property causes secondary runtime crashes inside catch blocks.
**Prevention:** Always extract error messages defensively using `const errMsg = e && e.message ? e.message : String(e)` before referencing error properties in exception handling and logging logic.
