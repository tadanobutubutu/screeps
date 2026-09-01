/**
 * tests/sentinel_log_level_bypass.test.js
 * Reproduction and verification of log-level bypass vulnerability fixes.
 */

const logger = require('../src/utils/logger')
const { LOG_LEVEL } = require('../src/constants')

describe('src/utils/logger security: log-level bypass', () => {
  let logSpy

  beforeEach(() => {
    global.Game = { time: 100 }
    global.Memory = {}
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    logger.clear()
    logger.resetStats()
    logger.setLevel(LOG_LEVEL.INFO) // Reset to default safe level
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

  test('init() should default to INFO on invalid numeric Memory.logLevel', () => {
    // Maliciously set Memory.logLevel to -1 to bypass gates
    // A vulnerable implementation would assign -1 to the internal level.
    // debug gate: if (_level > LOG_LEVEL.DEBUG) return;
    // if (-1 > 0) return; -> false, so it logs!
    global.Memory.logLevel = -1 // Invalid negative value

    logger.init()

    // Verify that debug log is NOT shown
    logger.debug('This should be hidden')

    expect(logger.getLevel()).toBe(LOG_LEVEL.INFO)
    const debugLogs = logSpy.mock.calls.filter((call) => call[0].includes('DEBUG'))
    expect(debugLogs.length).toBe(0)
  })

  test('init() should default to INFO on invalid string Memory.logLevel', () => {
    global.Memory.logLevel = 'INVALID_STRING'

    logger.init()

    logger.debug('Debug message')
    const debugLogs = logSpy.mock.calls.filter((call) => call[0].includes('DEBUG'))
    expect(debugLogs.length).toBe(0)
  })
})
