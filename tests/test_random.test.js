const { secureRandom } = require('../test_random')
const crypto = require('crypto')

describe('secureRandom', () => {
  let originalRandomBytes
  let originalMathRandom

  beforeEach(() => {
    originalRandomBytes = crypto.randomBytes
    originalMathRandom = Math.random
  })

  afterEach(() => {
    crypto.randomBytes = originalRandomBytes
    Math.random = originalMathRandom
    jest.restoreAllMocks()
  })

  it('should return a number between 0 (inclusive) and 1 (exclusive)', () => {
    const val = secureRandom()
    expect(typeof val).toBe('number')
    expect(val).toBeGreaterThanOrEqual(0)
    expect(val).toBeLessThan(1)
  })

  it('should use crypto.randomBytes to generate the random number', () => {
    const mockRandomBytes = jest.fn().mockReturnValue(Buffer.from([0, 0, 0, 0]))
    crypto.randomBytes = mockRandomBytes

    const val = secureRandom()

    expect(mockRandomBytes).toHaveBeenCalledWith(4)
    expect(val).toBe(0)
  })

  it('should calculate the value correctly from buffer', () => {
    const mockRandomBytes = jest.fn().mockReturnValue(Buffer.from([0xff, 0xff, 0xff, 0xff]))
    crypto.randomBytes = mockRandomBytes

    const val = secureRandom()

    expect(val).toBe(0xffffffff / (0xffffffff + 1))
  })

  it('should fallback to Math.random if crypto throws an error', () => {
    crypto.randomBytes = jest.fn().mockImplementation(() => {
      throw new Error('crypto failed')
    })

    const mockMathRandom = jest.fn().mockReturnValue(0.12345)
    Math.random = mockMathRandom

    const val = secureRandom()

    expect(val).toBe(0.12345)
    expect(mockMathRandom).toHaveBeenCalled()
  })

  it('should fallback to Math.random if crypto.randomBytes is not available', () => {
    crypto.randomBytes = undefined

    const mockMathRandom = jest.fn().mockReturnValue(0.54321)
    Math.random = mockMathRandom

    const val = secureRandom()

    expect(val).toBe(0.54321)
    expect(mockMathRandom).toHaveBeenCalled()
  })
})
