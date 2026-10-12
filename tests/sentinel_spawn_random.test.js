const spawnManager = require('../src/managers/spawnManager')

describe('Sentinel: spawnManager randomness', () => {
  test('does not use Math.random for creep naming', () => {
    const fs = require('fs')
    const content = fs.readFileSync('src/managers/spawnManager.js', 'utf8')
    expect(content).not.toMatch(/Math\.random\(\)/)
  })
})
