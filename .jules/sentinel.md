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

## 2026-09-27 - [HTTP Header Injection Prevention in deploy.js Requests]

**Vulnerability:** In `deploy.js`, `buildRequestOptions` and `validateToken` constructed HTTPS request headers (`X-Token`) and request paths without stripping CRLF characters (`\r` and `\n`), exposing request options to potential HTTP Header Injection and Response Splitting.
**Learning:** Dynamic tokens or path parameters read from external environments or configurations can contain carriage returns or line feeds that manipulate HTTP request headers when constructing request options.
**Prevention:** Always strip carriage return and line feed characters (`/[\r\n]/g`) from dynamic tokens and path strings before injecting them into HTTP request options and headers.

## 2026-09-28 - [Credential Exposure via URL Query Parameters in Gemini API Requests]

**Vulnerability:** `scripts/ai_repo_intel.py` and `scripts/ai_update_readme.py` transmitted Gemini API keys in URL query parameters (`params={"key": key}`).
**Learning:** Transmitting sensitive credentials via URL query parameters exposes secrets to proxy logs, server logs, referrer headers, and process listings.
**Prevention:** Always transmit API credentials securely via HTTP headers (e.g., `x-goog-api-key`) and strip query string parameters containing secret tokens.

## 2026-09-29 - [Cryptographically Secure PRNG in Screeps Role Scouting]

**Vulnerability:** `role.scout.js` contained duplicated syntax corruption that crashed the Jest parser and used non-cryptographic `Math.random()` for target room selection.
**Learning:** Partial code edits or merge artifacts can duplicate module exports and object methods, creating strict-mode syntax errors that break test suites and module loading while leaving insecure PRNG calls in place.
**Prevention:** Always run parser validation or isolated unit tests after refactoring role modules, and ensure random decisions use cryptographically secure `crypto.randomInt` or `secureRandomInt` helpers.

## 2026-09-30 - [Cryptographically Secure PRNG in Screeps Role Explorer]

**Vulnerability:** `role.explorer.js` used non-standard `crypto.randomBytes` modulo arithmetic in `secureRandomInt`, which lacked uniform integer distribution and risked falling back to `Math.random()`.
**Learning:** Using `crypto.randomBytes(4).readUInt32LE(0) % max` introduces modulo bias for non-power-of-two bounds; using `crypto.randomInt(max)` ensures unbiased cryptographically secure uniform random integers in Node.js.
**Prevention:** Always use `crypto.randomInt(max)` for discrete uniform random integer generation in JavaScript/Node.js environments.

## 2026-10-01 - [Cryptographically Secure PRNG in Mission Utility System]

**Vulnerability:** `utils.missions.js` used `crypto.randomBytes(4).readUInt32LE(0) % max` in `secureRandomInt`, which suffered from modulo bias and failed to check for Node.js `crypto.randomInt`.
**Learning:** Performing modulo arithmetic on raw random byte integers introduces biased integer sampling for non-power-of-two upper bounds. Node's native `crypto.randomInt(max)` eliminates modulo bias and avoids potential fallback bugs.
**Prevention:** Always check for and utilize `crypto.randomInt(max)` when generating bounded random integers in Node.js modules.

## 2026-10-02 - [Direct PRNG Feature Detection in role.scout.js]

**Vulnerability:** `role.scout.js` checked for `crypto.randomBytes` before invoking `crypto.randomInt(max)`, creating a potential runtime mismatch and forcing unnecessary fallbacks.
**Learning:** Checking a different API method (`randomBytes`) than the one actually invoked (`randomInt`) risks runtime exceptions or improper fallback paths if an environment supports one method but not the other.
**Prevention:** Always check feature availability for the exact function being called (`crypto && crypto.randomInt`).

## 2026-10-03 - [Validate issueNumber in auto-pr-generator against Endpoint Path Traversal]

**Vulnerability:** `scripts/auto-pr-generator.js` interpolated unsanitized `issueNumber` parameters directly into GitHub REST API endpoint paths (`/repos/${repo}/issues/${issueNumber}`), allowing path traversal and endpoint manipulation.
**Learning:** External parameters or environment variables parsed as issue IDs must be validated before interpolating into URL path structures.
**Prevention:** Always validate numeric issue parameters against `/^\d+$/` before constructing GitHub API endpoint URLs.

## 2026-10-04 - [Command Injection Prevention in check_repo_health.js Execution]

**Vulnerability:** `scripts/check_repo_health.js` interpolated unsanitized `PKG_MANAGER` environment variables into shell command strings via `execSync(command)` and executed immediately at module level upon import.
**Learning:** Interpolating environment variables directly into `child_process.execSync` string commands allows arbitrary command injection if variables contain shell metacharacters, and executing script logic top-level on require interferes with test module isolation.
**Prevention:** Validate package manager inputs against strict allowlists (`['npm', 'pnpm', 'yarn', 'bun']`), pass arguments as discrete arrays using `execFileSync`, and guard top-level script execution with `if (require.main === module)`.


## 2026-10-05 - [Command Injection Prevention in add-contributor.js Execution]

**Vulnerability:** scripts/add-contributor.js used execSync with a shell command string to execute all-contributors-cli generate.
**Learning:** Executing CLI tools via execSync with shell string commands introduces shell command injection risks if arguments or shell environments are untrusted.
**Prevention:** Always use execFileSync with explicit binary and argument array parameters (e.g. execFileSync('npx', ['all-contributors-cli', 'generate'])) to bypass shell interpretation.
