# Error Handling

3-layer error handling system:

## Layer 1: In-Game Detection
Errors logged via `utils.logging.js` to Memory.logs

## Layer 2: Automatic Fix
GitHub Actions detects errors every 15 minutes and applies fixes

## Layer 3: Threshold Monitoring
Monitors error rates and suggests escalation if needed

For details, see [ERROR_HANDLING.md](../ERROR_HANDLING.md).

---

[Home](./Home) | [Previous: Utilities](./Utilities) | [Next: Troubleshooting](./Troubleshooting)
