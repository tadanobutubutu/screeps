import { parseAudit } from '../scripts/security-autofix.mjs'

describe('security-autofix.mjs parseAudit', () => {
  test('parses json stdout on non-zero exit code when res.ok is false', () => {
    const mockRunner = () => ({
      ok: false,
      out: JSON.stringify({
        vulnerabilities: {
          lodash: { severity: 'high', fixAvailable: true }
        }
      }),
      err: 'Error: Command failed: npm audit --json'
    })

    const audit = parseAudit(mockRunner)
    expect(audit).toHaveProperty('vulnerabilities')
    expect(audit.vulnerabilities.lodash.severity).toBe('high')
  })

  test('returns default error object when res.out is missing or empty', () => {
    const mockRunner = () => ({
      ok: false,
      out: '',
      err: 'npm audit failed'
    })

    const audit = parseAudit(mockRunner)
    expect(audit).toEqual({ error: 'npm audit failed', vulnerabilities: {} })
  })
})
