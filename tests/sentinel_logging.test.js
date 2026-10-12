const logger = require('../utils.logging')

describe('Sentinel: Logging Security Hardening', () => {
  beforeEach(() => {
    global.Memory = { logs: [] }
    global.Game = { time: 100 }
    // Mock console.log
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('getSafeStack should truncate very long stacks', () => {
    const longStack = 'a'.repeat(3000)
    const safeStack = logger.getSafeStack(longStack)
    // Should be at most 2000 chars
    expect(safeStack.length).toBeLessThanOrEqual(2000)
  })

  test('log should handle corrupted Memory.logs', () => {
    global.Memory.logs = { not: 'an array' }
    logger.info('test message')
    expect(Array.isArray(global.Memory.logs)).toBe(true)
    expect(global.Memory.logs.length).toBe(1)
  })

  test('log should use safe emoji lookup and prevent prototype pollution', () => {
    // Attempt prototype pollution
    const maliciousLevel = 'toString'
    logger.log(maliciousLevel, 'test message')

    // Should use default emoji '\ud83d\udcac' (💬)
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('\ud83d\udcac [toString]')
    )
  })

  test('log should work correctly with standard levels', () => {
    logger.error('error message')
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('\u274c [error] error message')
    )

    logger.warn('warn message')
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('\u26a0\ufe0f [warn] warn message')
    )
  })
})
