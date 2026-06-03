## 2026-03-05 - Improved Sensitive Data Redaction in Logs

**Vulnerability:** Partial credential exposure in logs. The previous redaction logic used a simple space-delimited match (`[^ \n\t"']+`), which failed to capture the full value of sensitive data if it contained spaces, even when quoted (e.g., `password="my secret"` would only redact `my`).
**Learning:** Redaction regexes must explicitly handle quoted strings to prevent partial leakage of multi-word secrets or tokens.
**Prevention:** Use a regex pattern that recognizes single and double-quoted blocks as a single value when following a sensitive keyword.
