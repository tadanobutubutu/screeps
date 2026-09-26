/**
 * tests/sentinel_trycatch_robustness.test.js
 * Verification of safe exception handling in tryCatch wrappers
 */

const srcLogger = require('../src/utils/logger')
const utilsLogging = require('../utils.logging')

describe('Sentinel: Safe tryCatch exception handling', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('src/utils/logger.js tryCatch handles primitive and null/undefined errors', () => {
    expect(() => {
      srcLogger.tryCatch(() => {
        throw null
      }, 'testContext')
    }).not.toThrow()

    expect(() => {
      srcLogger.tryCatch(() => {
        throw undefined
      }, 'testContext')
    }).not.toThrow()

    expect(() => {
      srcLogger.tryCatch(() => {
        throw 'string error'
      }, 'testContext')
    }).not.toThrow()
  })

  test('utils.logging.js tryCatch handles primitive and null/undefined errors', () => {
    expect(() => {
      utilsLogging.tryCatch(() => {
        throw null
      }, 'testContext')
    }).not.toThrow()

    expect(() => {
      utilsLogging.tryCatch(() => {
        throw undefined
      }, 'testContext')
    }).not.toThrow()

    expect(() => {
      utilsLogging.tryCatch(() => {
        throw 'string error'
      }, 'testContext')
    }).not.toThrow()
  })
})
