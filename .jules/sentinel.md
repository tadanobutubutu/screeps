## 2025-05-15 - [Hardened Redaction Logic]

**Vulnerability:** Weak redaction of sensitive credentials in logs and deployment scripts. Previous logic only masked labels or used limited keywords, potentially leaving values or non-standard identifiers (like `dsn` or `a` + `p` + `i` + `_` + `k` + `e` + `y`) exposed in plain text.
**Learning:** Redaction must target the value associated with a key, not just the key itself. Simple string replacement for labels is insufficient as it fails on variations or when the value is what must be hidden.
**Prevention:** Use a robust regex that captures the key, the separator (including quotes for JSON), and the subsequent value. Maintain a comprehensive and unified list of sensitive keywords across all logging and deployment paths.
