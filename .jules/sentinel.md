## 2025-05-15 - [Hardened Secret Redaction]

**Vulnerability:** Weak secret redaction in logs and deployment scripts. The previous logic only redacted labels (like "token") or used a very limited set of keywords, potentially leaving actual secret values or non-standard keys (like `dsn` or `api_key`) exposed in plain text.
**Learning:** Redaction logic needs to target the value associated with a key, not just the key itself, to be effective. Relying on simple string replacement for known labels is insufficient as it fails when the label is slightly different or when the value is what needs to be hidden.
**Prevention:** Use a robust regex that captures the key, the separator (including quotes for JSON), and the subsequent value. Maintain a comprehensive and unified list of sensitive keywords across all logging and deployment paths.
