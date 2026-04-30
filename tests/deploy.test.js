/**
 * deploy.js ロジックのユニットテスト
 */

// httpsモジュールをモック
jest.mock('https')
const https = require('https')

const { validateToken, validateFilePath, deployTo } = require('../deploy')

describe('deploy.js', () => {
  describe('validateToken', () => {
    test('有効なトークンを許可', () => {
      const result = validateToken('valid_token_1234567890', 'PTR')
      expect(result.valid).toBe(true)
    })

    test('トークンが未設定の場合、無効', () => {
      const result = validateToken(undefined, 'PTR')
      expect(result.valid).toBe(false)
      expect(result.message).toContain('not set')
    })

    test('短いトークンを無効', () => {
      const result = validateToken('short', 'PTR')
      expect(result.valid).toBe(false)
      expect(result.message).toContain('format is invalid')
    })

    test('空文字列を無効', () => {
      const result = validateToken('', 'PTR')
      expect(result.valid).toBe(false)
    })

    test('正常な長さのトークンを許可', () => {
      const result = validateToken('abc12345678901234567890', 'PTR')
      expect(result.valid).toBe(true)
    })

    test('特殊文字を含むトークンを無効', () => {
      const result = validateToken('invalid!@#$%^&*()token123456789', 'PTR')
      expect(result.valid).toBe(false)
    })
  })

  describe('validateFilePath', () => {
    const path = require('path')
    const testBaseDir = '/workspace/test'

    test('正常なファイルパスを受け入れる', () => {
      const result = validateFilePath('main.js', testBaseDir)
      expect(result).toContain('main.js')
    })

    test('path traversal攻撃をブロック', () => {
      expect(() => {
        validateFilePath('../etc/passwd', testBaseDir)
      }).toThrow()
    })

    test('サブディレクトリを許可', () => {
      const result = validateFilePath('subdir/file.js', testBaseDir)
      expect(result).toContain('subdir/file.js')
    })

    test('絶対パスをブロック', () => {
      expect(() => {
        validateFilePath('/etc/passwd', testBaseDir)
      }).toThrow()
    })
  })

  describe('deployTo', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      jest.spyOn(console, 'log').mockImplementation(() => {})
      jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
      console.log.mockRestore()
      console.error.mockRestore()
    })

    test('トークンが未設定の場合はスキップ', async () => {
      await expect(deployTo('PTR', '/ptr/api/user/code', null, {})).resolves.toBeUndefined()
    })

    test('無効なトークン形式の場合はスキップ', async () => {
      await expect(
        deployTo('PTR', '/ptr/api/user/code', 'short', {})
      ).resolves.toBeUndefined()
    })

    test('デプロイ成功時にresolveする', async () => {
      const mockReq = {
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn(),
        setTimeout: jest.fn()
      }
      const mockRes = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(JSON.stringify({ ok: 1 }))
          }
          if (event === 'end') {
            callback()
          }
        })
      }
      https.request.mockImplementation((options, callback) => {
        callback(mockRes)
        return mockReq
      })

      const validToken = 'valid_token_12345678901234567890'
      await expect(
        deployTo('PTR', '/ptr/api/user/code', validToken, {})
      ).resolves.toBeUndefined()
    })

    test('デプロイ失敗時（ok !== 1）にrejectする', async () => {
      const mockReq = {
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn(),
        setTimeout: jest.fn()
      }
      const mockRes = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(JSON.stringify({ ok: 0, error: 'deploy failed' }))
          }
          if (event === 'end') {
            callback()
          }
        })
      }
      https.request.mockImplementation((options, callback) => {
        callback(mockRes)
        return mockReq
      })

      const validToken = 'valid_token_12345678901234567890'
      await expect(deployTo('PTR', '/ptr/api/user/code', validToken, {})).rejects.toThrow()
    })

    test('HTTPステータス200でJSONパース失敗の場合はresolveする', async () => {
      const mockReq = {
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn(),
        setTimeout: jest.fn()
      }
      const mockRes = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback('not json')
          }
          if (event === 'end') {
            callback()
          }
        })
      }
      https.request.mockImplementation((options, callback) => {
        callback(mockRes)
        return mockReq
      })

      const validToken = 'valid_token_12345678901234567890'
      await expect(
        deployTo('PTR', '/ptr/api/user/code', validToken, {})
      ).resolves.toBeUndefined()
    })

    test('HTTPエラー時（非200）にrejectする', async () => {
      const mockReq = {
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn(),
        setTimeout: jest.fn()
      }
      const mockRes = {
        statusCode: 500,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback('Server error')
          }
          if (event === 'end') {
            callback()
          }
        })
      }
      https.request.mockImplementation((options, callback) => {
        callback(mockRes)
        return mockReq
      })

      const validToken = 'valid_token_12345678901234567890'
      await expect(deployTo('PTR', '/ptr/api/user/code', validToken, {})).rejects.toThrow()
    })

    test('リクエストエラー時にrejectする', async () => {
      const mockReq = {
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn((event, callback) => {
          if (event === 'error') {
            callback(new Error('Network error'))
          }
        }),
        setTimeout: jest.fn()
      }
      https.request.mockImplementation(() => mockReq)

      const validToken = 'valid_token_12345678901234567890'
      await expect(deployTo('PTR', '/ptr/api/user/code', validToken, {})).rejects.toThrow()
    })

    test('タイムアウト時にrejectする', async () => {
      const mockReq = {
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn(),
        setTimeout: jest.fn((ms, callback) => callback()),
        destroy: jest.fn()
      }
      https.request.mockImplementation(() => mockReq)

      const validToken = 'valid_token_12345678901234567890'
      await expect(deployTo('PTR', '/ptr/api/user/code', validToken, {})).rejects.toThrow(
        'timeout'
      )
    })
  })
})
