describe('Security - CRLF Header Sanitization in auto-pr-generator.js', () => {
  let originalEnv
  let githubRequest, _fetchClaudeAnalysis, sanitizeHeader

  beforeEach(() => {
    originalEnv = { ...process.env }
    process.env.GITHUB_TOKEN = 'mock_token\r\nX-Injected: evil'
    process.env.ANTHROPIC_API_KEY = 'mock_key\r\nX-Injected: evil'

    jest.isolateModules(() => {
      const module = require('../scripts/auto-pr-generator.js')
      githubRequest = module.githubRequest
      _fetchClaudeAnalysis = module._fetchClaudeAnalysis
      sanitizeHeader = module.sanitizeHeader
    })

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, content: [{ text: '{"rootCause":"none"}' }] })
    })
  })

  afterEach(() => {
    process.env = originalEnv
    delete global.fetch
  })

  test('sanitizeHeader strips CR and LF characters', () => {
    expect(sanitizeHeader('foo\r\nbar')).toBe('foobar')
  })

  test('githubRequest sanitizes CRLF characters from Authorization and custom headers', async () => {
    await githubRequest('/test', { headers: { 'X-Custom\r\nHeader': 'value\r\n' } })
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.github.com/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'token mock_tokenX-Injected: evil',
          'X-CustomHeader': 'value'
        })
      })
    )
  })

  test('_fetchClaudeAnalysis sanitizes CRLF characters from x-api-key header', async () => {
    await _fetchClaudeAnalysis('test prompt')
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-api-key': 'mock_keyX-Injected: evil'
        })
      })
    )
  })
})
