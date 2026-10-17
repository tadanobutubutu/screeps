const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')

describe('security-autofix.mjs script', () => {
  const reportPath = path.join(process.cwd(), 'security-autofix-report.json')

  afterEach(() => {
    if (fs.existsSync(reportPath)) {
      try {
        fs.unlinkSync(reportPath)
      } catch (e) {
        // ignore
      }
    }
  })

  test('parses npm audit json even on non-zero exit codes when vulnerabilities exist', () => {
    let exitCode = 0
    try {
      execFileSync('node', ['scripts/security-autofix.mjs'], {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      })
    } catch (err) {
      exitCode = err.status
    }

    expect(fs.existsSync(reportPath)).toBe(true)
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))

    expect(report).toHaveProperty('before')
    expect(report).toHaveProperty('after')
    expect(report).toHaveProperty('steps')
    expect(typeof report.needsIssue).toBe('boolean')

    // Verify that before and after contain numeric vulnerability fields
    expect(typeof report.before.total).toBe('number')
    expect(typeof report.after.total).toBe('number')
  })
})
