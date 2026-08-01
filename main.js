describe('random utilities', () => {
  describe('randomNumber', () => {
    it('should generate a random number between min and max', () => {
      const min = 1
      const max = 10
      const result = randomNumber(min, max)

      expect(result).toBeGreaterThanOrEqual(min)
      expect(result).toBeLessThanOrEqual(max)
    })

    it('should return an integer', () => {
      const result = randomNumber(1, 100)
      expect(Number.isInteger(result)).toBe(true)
    })
  })

  describe('randomItem', () => {
    it('should return a random item from the array', () => {
      const array = [1, 2, 3, 4, 5]
      const result = randomItem(array)

      expect(array).toContain(result)
    })

    it('should handle empty arrays', () => {
      const result = randomItem([])
      expect(result).toBeUndefined()
    })
  })

  describe('randomBoolean', () => {
    it('should return a boolean value', () => {
      const result = randomBoolean()

      expect(typeof result).toBe('boolean')
    })
  })
})
