/**
 * deploy.js ロジックのユニットテスト
 */

// httpsモジュールをモック
jest.mock('https')
const https = require('https')

const { validateToken, validateFilePath, deployTo, runDeploy } = require('../deploy')
const fs = require('fs')

describe('deploy.js', () => {
  describe('runDeploy error handling', () => {
    let originalExit, originalError
    beforeEach(() => {
      originalExit = process.exit
      originalError = console.error
      process.exit = jest.fn()
      console.error = jest.fn()
    })

    afterEach(() => {
      process.exit = originalExit
      console.error = originalError
      jest.restoreAllMocks()
    })

    test('catches file read error and exits', async () => {
      const { runDeploy } = require('../deploy')
      jest.spyOn(fs.promises, 'readFile').mockRejectedValue(
        new Error("simulated read error token='secret'")
      )
      await runDeploy()
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining(
          "[ERROR] Failed to read main.js: simulated read error token='[REDACTED]'"
        )
      )
      expect(process.exit).toHaveBeenCalledWith(1)
    })
  })

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
      expect(result.message).toContain('not set')
    })

    test('nullを無効', () => {
      const result = validateToken(null, 'PTR')
      expect(result.valid).toBe(false)
      expect(result.message).toContain('not set')
    })

    test('正常な長さのトークンを許可', () => {
      const result = validateToken('abc12345678901234567890', 'PTR')
      expect(result.valid).toBe(true)
    })

    test('特殊文字を含むトークンを無効', () => {
      const result = validateToken('invalid!@#$%^&*()token12345678901234567890', 'PTR')
      expect(result.valid).toBe(false)
      expect(result.message).toContain('contains invalid characters')
    })
  })

  describe('validateFilePath', () => {
    const path = require('path')
    const testBaseDir = '/workspace/test'

    test('正常なファイルパスを受け入れる', () => {
      const result = validateFilePath('main.js', testBaseDir)
      expect(result).toBe('/workspace/test/main.js')
    })

    test('パストラバーサル攻撃をブロック', () => {
      const baseDir = '/workspace/test'
      expect(() => validateFilePath('../etc/passwd', baseDir)).toThrow(
        'path traversal attack detected'
      )
    })

    test('Poison Null Byteをブロック', () => {
      expect(() => validateFilePath('\0../../etc/passwd', testBaseDir)).toThrow(
        'contains null byte'
      )
    })

    test('サブディレクトリを許可', () => {
      const result = validateFilePath('subdir/file.js', testBaseDir)
      expect(result).toContain('subdir/file.js')
    })

    test('絶対パスをブロック', () => {
      expect(() => validateFilePath('/etc/passwd', testBaseDir)).toThrow(
        'absolute path detected'
      )
    })

    test('部分的なベースパスのマッチングをブロック', () => {
      const baseDir = '/app'
      const maliciousPath = '../app_danger/main.js'
      expect(() => validateFilePath(maliciousPath, baseDir)).toThrow(
        'path traversal attack detected'
      )
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
          if (event === 'data') callback(JSON.stringify({ ok: 1 }))
          if (event === 'end') callback()
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
          if (event === 'end') callback()
        })
      }
      https.request.mockImplementation((options, callback) => {
        callback(mockRes)
        return mockReq
      })

      const validToken = 'valid_token_12345678901234567890'
      await expect(deployTo('PTR', '/ptr/api/user/code', validToken, {})).rejects.toThrow(
        'PTR deployment failed'
      )
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[PTR] Deployment failed! Raw:'),
        expect.stringContaining('deploy failed')
      )
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
          if (event === 'data') callback('not json')
          if (event === 'end') callback()
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

    test('HTTPステータスが非200でJSONパース失敗の場合はrejectする', async () => {
      const mockReq = {
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn(),
        setTimeout: jest.fn()
      }
      const mockRes = {
        statusCode: 500,
        on: jest.fn((event, callback) => {
          if (event === 'data') callback('not json error token=sec' + 'ret')
          if (event === 'end') callback()
        })
      }
      https.request.mockImplementation((options, callback) => {
        callback(mockRes)
        return mockReq
      })

      const validToken = 'valid_token_12345678901234567890'
      await expect(deployTo('PTR', '/ptr/api/user/code', validToken, {})).rejects.toThrow(
        'PTR deployment failed'
      )
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[PTR] Deployment failed! Raw:'),
        expect.stringContaining('not json error token=[REDACTED]')
      )
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
          if (event === 'data') callback('Server error')
          if (event === 'end') callback()
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
          if (event === 'error') callback(new Error('Network error'))
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

    test('deployTo API catch error with status 500', async () => {
      const mockReq = {
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn(),
        setTimeout: jest.fn()
      }
      // Mock a response that throws an error during data processing/parsing, but has statusCode 500
      const mockRes = {
        statusCode: 500,
        on: jest.fn((event, callback) => {
          if (event === 'data') callback('invalid json')
          if (event === 'end') callback()
        })
      }
      https.request.mockImplementation((options, callback) => {
        callback(mockRes)
        return mockReq
      })

      await expect(deployTo('TEST', '/api', 'valid_token_1234567890', {})).rejects.toThrow(
        'TEST deployment failed'
      )
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[TEST] Deployment failed! Raw:'),
        'invalid json'
      )
    })

    test('deployTo API catch error with status 200 (json parse error)', async () => {
      const mockReq = {
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn(),
        setTimeout: jest.fn()
      }
      // Mock a response that throws an error during data processing/parsing, and has statusCode 200
      const mockRes = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'data') callback('invalid json')
          if (event === 'end') callback() // this will trigger JSON.parse('invalid json') and throw
        })
      }
      https.request.mockImplementation((options, callback) => {
        callback(mockRes)
        return mockReq
      })

      await expect(
        deployTo('TEST', '/api', 'valid_token_1234567890', {})
      ).resolves.toBeUndefined()
    })
  })

  describe('runDeploy with files argument', () => {
    let originalExit
    let originalConsoleError
    beforeEach(() => {
      originalExit = process.exit
      originalConsoleError = console.error
      process.exit = jest.fn()
      console.error = jest.fn()
    })

    afterEach(() => {
      process.exit = originalExit
      console.error = originalConsoleError
    })

    test('外側のcatchブロックがエラーを捕捉する', async () => {
      const fsModule = require('fs')
      jest.spyOn(fsModule.promises, 'readFile').mockResolvedValue('dummy content')
      const httpsModule = require('https')
      httpsModule.request.mockImplementation((options, callback) => {
        const req = {
          on: jest.fn((evt, cb) => {
            if (evt === 'error') {
              cb(new Error('PTR request failed'))
            }
          }),
          setTimeout: jest.fn(),
          write: jest.fn(),
          end: jest.fn(),
          destroy: jest.fn()
        }
        return req
      })
      const { runDeploy } = require('../deploy')
      const files = [{ name: 'main', file: 'main.js' }]
      await runDeploy(files, 'valid_token_1234567890123', 'valid_token_1234567890123')
      expect(console.error).toHaveBeenCalledWith(
        'Deployment process failed:',
        'PTR request failed'
      )
      expect(process.exit).toHaveBeenCalledWith(1)
    })

    test('ファイル読み込みエラーを捕捉する', async () => {
      const fsModule = require('fs')
      jest.spyOn(fsModule.promises, 'readFile').mockRejectedValue(
        new Error('Failed to read file because token=sec' + 'ret_abc')
      )
      const { runDeploy } = require('../deploy')
      await runDeploy()
      expect(console.error).toHaveBeenCalledWith(
        'Deployment process failed:',
        expect.stringContaining('Failed to read file because token=[REDACTED]')
      )
      expect(process.exit).toHaveBeenCalledWith(1)
    })
  })
})
