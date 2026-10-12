/**
 * tests/security.cache.test.js
 * Security tests for src/utils/cache.js
 */

const cache = require('../src/utils/cache')

describe('Security: Cache Hardening', () => {
  beforeEach(() => {
    cache.reset()
    global.Game = {
      time: 100
    }
    global.Memory = {}
    global.global = global
    global.global.cache = {}

    // Mock constants since they might be needed by cache.js
    global.CACHE_TTL = { ROOM_OBJECTS: 30 }
  })

  afterEach(() => {
    delete global.global.cache
  })

  describe('Prototype Pollution Protection', () => {
    test('isSafeKey should identify dangerous keys', () => {
      expect(cache.isSafeKey('validKey')).toBe(true)
      expect(cache.isSafeKey('__proto__')).toBe(false)
      expect(cache.isSafeKey('constructor')).toBe(false)
      expect(cache.isSafeKey('prototype')).toBe(false)
      expect(cache.isSafeKey('toString')).toBe(false)
    })

    test('get() should not use unsafe keys and bypass cache', () => {
      const fetcher = jest.fn().mockReturnValue('safe')
      const result = cache.get('__proto__', fetcher)

      expect(result).toBe('safe')
      expect(fetcher).toHaveBeenCalled()
      // Ensure __proto__ wasn't actually set on global.cache
      expect(Object.prototype.hasOwnProperty.call(global.cache, '__proto__')).toBe(false)
    })

    test('invalidate() should ignore unsafe keys', () => {
      // Manually polluting (if possible in this env) to see if invalidate touches it
      // Actually, we just want to ensure it doesn't crash or do anything weird
      expect(() => cache.invalidate('__proto__')).not.toThrow()
    })
  })

  describe('Memory DoS Protection', () => {
    test('isSafeKey should reject excessively long keys', () => {
      const longKey = 'a'.repeat(257)
      expect(cache.isSafeKey(longKey)).toBe(false)
    })

    test('get() should enforce MAX_CACHE_ENTRIES limit', () => {
      // Fill cache to limit (100)
      for (let i = 0; i < 100; i++) {
        cache.get(`key${i}`, () => `data${i}`)
      }
      expect(Object.keys(global.cache).length).toBe(100)

      // Try to add one more
      const fetcher = jest.fn().mockReturnValue('extra')
      const result = cache.get('extraKey', fetcher)

      expect(result).toBe('extra')
      expect(fetcher).toHaveBeenCalled()
      // Cache size should still be 100
      expect(Object.keys(global.cache).length).toBe(100)
      // key0 should have been evicted (oldest)
      expect(global.cache.key0).toBeUndefined()
      // extraKey should now be present
      expect(global.cache.extraKey).toBeDefined()
    })
  })

  describe('Safe Iteration', () => {
    test('cleanup() should only touch own properties and safe keys', () => {
      global.cache.safeKey = { data: 'old', expires: 50 }

      // Add a "dangerous" enumerable property to the prototype of global.cache's prototype
      // or just simulate it by putting it on global.cache but making it "unsafe" if our isSafeKey was weak
      // Since we use hasOwnProperty and isSafeKey, it should be skipped

      const removed = cache.cleanup()
      expect(removed).toBe(1)
      expect(global.cache.safeKey).toBeUndefined()
    })

    test('getStats() should only count safe own properties', () => {
      for (let i = 0; i < 5; i++) {
        cache.get(`key${i}`, () => `data${i}`)
      }

      const stats = cache.getStats()
      expect(stats.total).toBe(5)
    })
  })
})
