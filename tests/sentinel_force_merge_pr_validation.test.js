const { spawnSync } = require('child_process')

describe('force_merge_pr.py repository name validation', () => {
  test('rejects unsafe repository names starting with hyphen or containing flags', () => {
    const env = {
      ...process.env,
      GITHUB_REPOSITORY: '--repo=malicious/repo'
    }

    const res = spawnSync('python3', ['scripts/force_merge_pr.py', '--dry-run'], {
      env,
      encoding: 'utf8'
    })

    expect(res.status).toBe(1)
    expect(res.stdout).toContain(
      'Error: Invalid or unsafe repository name: --repo=malicious/repo'
    )
  })

  test('rejects repository names with invalid characters or shell metacharacters', () => {
    const env = {
      ...process.env,
      GITHUB_REPOSITORY: 'owner/repo; rm -rf /'
    }

    const res = spawnSync('python3', ['scripts/force_merge_pr.py', '--dry-run'], {
      env,
      encoding: 'utf8'
    })

    expect(res.status).toBe(1)
    expect(res.stdout).toContain(
      'Error: Invalid or unsafe repository name: owner/repo; rm -rf /'
    )
  })

  test('rejects empty repository name string', () => {
    const env = {
      ...process.env,
      GITHUB_REPOSITORY: ''
    }

    const res = spawnSync('python3', ['scripts/force_merge_pr.py', '--dry-run'], {
      env,
      encoding: 'utf8'
    })

    expect(res.status).toBe(1)
  })
})
