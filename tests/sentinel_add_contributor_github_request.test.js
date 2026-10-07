const { githubRequest } = require('../scripts/add-contributor')

describe('Security - githubRequest endpoint path validation in add-contributor.js', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv, GITHUB_TOKEN: 'mock_token' }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  test('should throw error when endpoint does not start with a slash', async () => {
    await expect(githubRequest('users/octocat')).rejects.toThrow(
      'Invalid GitHub API endpoint path: users/octocat'
    )
  })

  test('should throw error when endpoint is not a string', async () => {
    await expect(githubRequest(123)).rejects.toThrow(
      'Invalid GitHub API endpoint path: 123'
    )
    await expect(githubRequest(null)).rejects.toThrow(
      'Invalid GitHub API endpoint path: null'
    )
  })

  test('should accept valid endpoint starting with slash', async () => {
    // Should pass endpoint validation and fail on mock network/HTTP rather than endpoint validation
    await expect(githubRequest('/users/octocat')).rejects.toThrow(/GitHub API error|fetch|ENOTFOUND|ECONNREFUSED/)
  })
})
