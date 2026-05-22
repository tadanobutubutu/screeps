/**
 * tests/sentinel_log_level_bypass.test.js
 * Reproduction of log-level bypass vulnerability
 */

const logger = require('../src/utils/logger')

describe('src/utils/logger security: log-level bypass', () => {
  let logSpy

  beforeEach(() => {
    global.Game = { time: 100 }
    global.Memory = {}
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    logger.clear()
    logger.resetStats()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('init() should not allow Memory.logLevel to bypass level gating', () => {
    // GIVEN: Memory.logLevel is set to an invalid value that might bypass comparisons
    global.Memory.logLevel = 'invalid'

    // WHEN: Logger is initialized
    logger.init()

    // THEN: It should fallback to a safe level (INFO) and NOT show DEBUG logs
    logger.debug('This should be suppressed')

    const debugLogs = logSpy.mock.calls.filter((call) => call[0].includes('DEBUG'))
    expect(debugLogs.length).toBe(0)
  })

  test('init() should handle null/boolean/empty string from Memory securely', () => {
    const trickyValues = [null, false, '']

    trickyValues.forEach((val) => {
      global.Memory.logLevel = val
      logger.init()

      // Should fallback to INFO and NOT show DEBUG
      logger.debug('This should be suppressed')
      const debugLogs = logSpy.mock.calls.filter((call) => call[0].includes('DEBUG'))
      expect(debugLogs.length).toBe(0)

      // Reset for next iteration
      logSpy.mockClear()
    })
  })

  test('init() should correctly handle numeric strings from Memory', () => {
    global.Memory.logLevel = '2' // WARN
    logger.init()

    logger.info('This should be suppressed')
    logger.warn('This should be shown')

    const infoLogs = logSpy.mock.calls.filter((call) => call[0].includes('INFO'))
    const warnLogs = logSpy.mock.calls.filter((call) => call[0].includes('WARN'))

    expect(infoLogs.length).toBe(0)
    expect(warnLogs.length).toBe(1)
  })
})
