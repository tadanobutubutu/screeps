const logging = require('../utils.logging')

describe('utils.logging', () => {
  beforeEach(() => {
    global.Game = { time: 100 }
    global.Memory = { logs: [] }
    // Reset to most verbose level so all log calls are recorded by default.
    logging.setLevel('trace')
  })

  afterEach(() => {
    delete global.Game
    delete global.Memory
  })

  describe('setLevel / getLevel', () => {
    test('accepts a valid numeric level', () => {
      logging.setLevel(0)
      expect(logging.getLevel()).toBe(0)
    })

    test('accepts a valid string level', () => {
      logging.setLevel('warn')
      expect(logging.getLevel()).toBe(logging.LEVELS.warn)
    })

    test('falls back to info for an invalid level', () => {
      logging.setLevel('not-a-level')
      expect(logging.getLevel()).toBe(logging.LEVELS.info)
    })

    test('falls back to info for an out-of-range numeric level', () => {
      logging.setLevel(99)
      expect(logging.getLevel()).toBe(logging.LEVELS.info)
    })
  })

  describe('log', () => {
    test('records a message into Memory.logs with level and tick', () => {
      logging.log('hello world', 'info')
      expect(Memory.logs).toHaveLength(1)
      expect(Memory.logs[0]).toMatchObject({
        level: 'info',
        message: 'hello world',
        tick: 100
      })
    })

    test('supports (level, message) argument order', () => {
      logging.log('error', 'something broke')
      expect(Memory.logs[0]).toMatchObject({
        level: 'error',
        message: 'something broke'
      })
    })

    test('defaults to info when no recognizable level is provided', () => {
      logging.log('plain message')
      expect(Memory.logs[0].level).toBe('info')
    })

    test('does not record messages below the current level', () => {
      logging.setLevel('error')
      logging.log('debug detail', 'debug')
      expect(Memory.logs).toHaveLength(0)
    })

    test('truncates messages longer than the max length', () => {
      const longMessage = 'a'.repeat(1000)
      logging.log(longMessage, 'info')
      expect(Memory.logs[0].message.length).toBe(500)
    })

    test('caps the log history size', () => {
      for (let i = 0; i < 120; i++) {
        logging.log(`message ${i}`, 'info')
      }
      expect(Memory.logs.length).toBeLessThanOrEqual(50)
    })

    test('coerces non-string messages to strings', () => {
      logging.log(42, 'info')
      expect(Memory.logs[0].message).toBe('42')
    })
  })

  describe('level helper functions', () => {
    test.each([
      ['error', logging.error],
      ['warn', logging.warn],
      ['info', logging.info],
      ['debug', logging.debug],
      ['trace', logging.trace]
    ])('%s() logs at the matching level', (level, fn) => {
      fn('a message')
      expect(Memory.logs[0].level).toBe(level)
    })
  })

  describe('_redactPaths', () => {
    test('redacts absolute unix paths', () => {
      const redacted = logging._redactPaths('failure at /home/user/main.js line 10')
      expect(redacted).toContain('[REDACTED]')
      expect(redacted).not.toContain('/home/user/main.js')
    })

    test('redacts secret-like key/value pairs', () => {
      const redacted = logging._redactPaths('token=supersecretvalue')
      expect(redacted).toContain('[REDACTED]')
      expect(redacted).not.toContain('supersecretvalue')
    })

    test('returns non-string input unchanged', () => {
      expect(logging._redactPaths(123)).toBe(123)
    })
  })

  describe('getSafeStack', () => {
    test('limits output to the requested number of lines', () => {
      const stack = 'l1\nl2\nl3\nl4\nl5\nl6\nl7'
      const safe = logging.getSafeStack(stack)
      expect(safe.split('\n').length).toBeLessThanOrEqual(5)
    })

    test('returns an empty string for null or undefined input', () => {
      expect(logging.getSafeStack(null)).toBe('')
      expect(logging.getSafeStack(undefined)).toBe('')
    })
  })

  describe('getStats', () => {
    test('counts logged entries by level', () => {
      logging.error('boom')
      logging.warn('careful')
      logging.info('fyi')
      const stats = logging.getStats()
      expect(stats.errors).toBe(1)
      expect(stats.warns).toBe(1)
      expect(stats.info).toBe(1)
      expect(stats.total).toBe(3)
    })
  })

  describe('getRecentLogs / getErrors / clear', () => {
    test('getRecentLogs returns the last N entries', () => {
      logging.info('one')
      logging.info('two')
      logging.info('three')
      const recent = logging.getRecentLogs(2)
      expect(recent).toHaveLength(2)
      expect(recent[1].message).toBe('three')
    })

    test('getErrors returns only error-level entries', () => {
      logging.error('bad')
      logging.info('fine')
      const errors = logging.getErrors()
      expect(errors).toHaveLength(1)
      expect(errors[0].level).toBe('error')
    })

    test('clear empties the log history', () => {
      logging.info('one')
      logging.clear()
      expect(Memory.logs).toHaveLength(0)
    })
  })

  describe('tryCatch', () => {
    test('returns the function result when it succeeds with arguments', () => {
      const fn = jest.fn((a, b) => a + b)
      const result = logging.tryCatch(fn, 'successCtx', 20, 22)
      expect(result).toBe(42)
      expect(fn).toHaveBeenCalledWith(20, 22)
    })

    test('logs an error and returns undefined when the function throws', () => {
      logging.clear() // Ensure log history is clean
      const dummyError = new Error('kaboom')
      const fn = jest.fn(() => {
        throw dummyError
      })
      const result = logging.tryCatch(fn, 'errorCtx', 'arg1')

      expect(result).toBeUndefined()
      expect(fn).toHaveBeenCalledWith('arg1')

      const errors = logging.getErrors()
      expect(errors).toHaveLength(1)
      expect(errors[0].level).toBe('error')
      expect(errors[0].message).toBe('[errorCtx] kaboom')
    })
  })
})
