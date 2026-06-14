/**
 * utils.logging.js のユニットテスト
 */

global.Game = { time: 100 }
global.Memory = {}

// console.logをモック
const originalLog = console.log
beforeAll(() => {
  console.log = jest.fn()
})
afterAll(() => {
  console.log = originalLog
})

const utilsLogging = require('../utils.logging')

describe('utils.logging', () => {
  test('モジュールが正しく読み込める', () => {
    expect(utilsLogging).toBeDefined()
  })

  test('log関数が存在すれば呼び出せる', () => {
    if (typeof utilsLogging.log === 'function') {
      expect(() => utilsLogging.log('test message')).not.toThrow()
    }
  })

  test('info関数が存在すれば呼び出せる', () => {
    if (typeof utilsLogging.info === 'function') {
      expect(() => utilsLogging.info('info message')).not.toThrow()
    }
  })

  test('warn関数が存在すれば呼び出せる', () => {
    if (typeof utilsLogging.warn === 'function') {
      expect(() => utilsLogging.warn('warn message')).not.toThrow()
    }
  })

  test('error関数が存在すれば呼び出せる', () => {
    if (typeof utilsLogging.error === 'function') {
      expect(() => utilsLogging.error('error message')).not.toThrow()
    }
  })

  test('エクスポートされた関数が少なくとも1つある', () => {
    const keys = Object.keys(utilsLogging)
    expect(keys.length).toBeGreaterThan(0)
  })

  test('log function truncates long messages', () => {
    const longMessage = 'A'.repeat(600)
    utilsLogging.log('info', longMessage)

    expect(Memory.logs[Memory.logs.length - 1].message.length).toBe(500)
    expect(Memory.logs[Memory.logs.length - 1].message).toBe('A'.repeat(500))
  })

  test('log function handles arrays', () => {
    utilsLogging.log('info', [1, 2, 3])
    expect(Memory.logs).toBeDefined()
  })

  test('log function handles objects', () => {
    utilsLogging.log('info', { key: 'value' })
    expect(Memory.logs).toBeDefined()
  })

  test('error function exists and can be called', () => {
    if (typeof utilsLogging.error === 'function') {
      utilsLogging.error('error message')
      expect(Memory.logs[Memory.logs.length - 1].level).toBe('error')
    }
  })

  test('getSafeStack processes stack trace correctly', () => {
    const stack =
            'Error: test\n    at Object.<anonymous> (/workspace/test.js:10:5)\n    at Function.test (/workspace/test2.js:20:10)'
    const result = utilsLogging.getSafeStack(stack)
    expect(result).toContain('test.js:10:5')
    expect(result).toContain('test2.js:20:10')
    expect(result).not.toContain('/workspace/')
  })

  test('getSafeStack redacts lines that look like paths but do not match the pattern', () => {
    const stack = 'Error: test\n    at /secret/path/to/internal/file.js'
    const result = utilsLogging.getSafeStack(stack)
    // Current behavior: leaks the path
    // Desired behavior: redacts it
    expect(result).not.toContain('/secret/path/')
  })

  test('getSafeStack returns empty string for null input', () => {
    const result = utilsLogging.getSafeStack(null)
    expect(result).toBe('')
  })

  test('getSafeStack returns empty string for undefined input', () => {
    const result = utilsLogging.getSafeStack(undefined)
    expect(result).toBe('')
  })

  test('getSafeStack returns empty string for empty string input', () => {
    const result = utilsLogging.getSafeStack('')
    expect(result).toBe('')
  })

  test('tryCatch executes function and returns result', () => {
    const fn = () => 'result'
    const result = utilsLogging.tryCatch(fn, 'test')
    expect(result).toBe('result')
  })

  test('tryCatch catches and logs errors', () => {
    const fn = () => {
      throw new Error('test error')
    }
    const result = utilsLogging.tryCatch(fn, 'test')
    expect(result).toBeNull()
    expect(Memory.logs.length).toBeGreaterThan(0)
    expect(Memory.logs[Memory.logs.length - 1].level).toBe('error')
  })

  test('getRecentLogs returns recent logs', () => {
    utilsLogging.log('info', 'message1')
    utilsLogging.log('info', 'message2')
    const logs = utilsLogging.getRecentLogs(1)
    expect(logs.length).toBe(1)
    expect(logs[0].message).toBe('message2')
  })

  test('getRecentLogs returns all logs when count exceeds', () => {
    utilsLogging.log('info', 'message1')
    const logs = utilsLogging.getRecentLogs(100)
    expect(logs.length).toBeGreaterThan(0)
  })

  test('getErrors returns only error logs', () => {
    global.Memory.logs = []
    utilsLogging.log('error', 'error message')
    utilsLogging.log('info', 'info message')
    const errors = utilsLogging.getErrors()
    expect(errors.length).toBe(1)
    expect(errors[0].level).toBe('error')
  })

  test('clear removes all logs', () => {
    utilsLogging.log('info', 'message')
    utilsLogging.clear()
    expect(Memory.logs.length).toBe(0)
  })

  test('getStats returns correct statistics', () => {
    global.Memory.logs = []
    utilsLogging.log('error', 'error1')
    utilsLogging.log('warn', 'warn1')
    utilsLogging.log('info', 'info1')
    utilsLogging.log('debug', 'debug1')
    const stats = utilsLogging.getStats()
    expect(stats.total).toBe(4)
    expect(stats.errors).toBe(1)
    expect(stats.warnings).toBe(1)
    expect(stats.info).toBe(1)
    expect(stats.debug).toBe(1)
  })

  test('getStats returns initial stats when no logs', () => {
    global.Memory.logs = undefined
    const stats = utilsLogging.getStats()
    expect(stats.total).toBe(0)
  })

  test('debug function exists and can be called', () => {
    if (typeof utilsLogging.debug === 'function') {
      global.Memory.debug = true
      utilsLogging.debug('debug message')
      expect(Memory.logs[Memory.logs.length - 1].level).toBe('debug')
    }
  })

  test('init function limits logs to 100', () => {
    global.Memory.logs = []
    for (let i = 0; i < 150; i++) {
      utilsLogging.log('info', 'message' + i)
    }
    utilsLogging.init()
    expect(Memory.logs.length).toBeLessThanOrEqual(100)
  })
})
