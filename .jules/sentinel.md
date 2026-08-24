## 2026-08-11 - [Harden Console Logging Output and Prototype Pollution Protection]

**Vulnerability:** The console logger was missing the actual output execution line (`console.log`), resulting in silent failure where sanitized, redacted, and HTML-escaped logs were not printed. This crippled security logging visibility, making it impossible to audit potential console injection attacks or log-based information disclosure.
**Learning:** Over-reliance on regex redaction and sanitization blocks can occasionally result in developers or automated tools accidentally stripping or omitting final output sinks during refactoring.
**Prevention:** Always cover core logging behaviors with regression tests that explicitly assert console output is printed with correct arguments (including safe emoji and escaped strings), and prevent prototype pollution by creating the lookup maps using `Object.create(null)` to bypass standard object inheritance.

## 2026-08-24 - [Path Traversal Prevention in AI PR Auto-Generation Script]

**Vulnerability:** `scripts/auto-pr-generator.js` constructed file paths directly using `path.join(process.cwd(), change.file)` when processing AI-suggested code changes. Unvalidated paths starting with `..` or containing absolute paths allowed arbitrary file writes outside the working directory.
**Learning:** Automated scripts processing file path strings generated from external APIs or LLMs can introduce path traversal vulnerabilities if paths are joined without strict canonicalization and root containment checks.
**Prevention:** Always resolve target paths using `path.resolve(process.cwd(), target)` and verify `path.relative(process.cwd(), safePath)` does not start with `..`, is not absolute, and is not empty before creating directories or writing files.
