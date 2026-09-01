/**
 * role.explorer.js のユニットテスト
 */

global.Game = {
  time: 10,
  map: {
    describeExits: jest.fn().mockReturnValue({})
  }
}
global.Memory = { rooms: {} }
global.OK = 0
global.ERR_NOT_IN_RANGE = -9
global.RESOURCE_ENERGY = 'energy'
global.FIND_EXIT = 10
global.RoomPosition = class {
  constructor (x, y, roomName) {
    this.x = x
    this.y = y
    this.roomName = roomName
  }
}

jest.mock(
  '../gamification',
  () => ({
    trackAction: jest.fn(),
    addXP: jest.fn()
  }),
  { virtual: true }
)

jest.mock(
  '../visual.effects',
  () => ({
    particles: jest.fn(),
    rainbowTrail: jest.fn(),
    scorePopup: jest.fn()
  }),
  { virtual: true }
)

global.ERR_NO_PATH = -2
global.ERR_INVALID_ARGS = -10

const roleExplorer = require('../role.explorer')

describe('role.explorer', () => {
  test('モジュールが正しく読み込める', () => {
    expect(roleExplorer).toBeDefined()
    expect(typeof roleExplorer.run).toBe('function')
  })

  test('run関数が例外を投げない', () => {
    const creep = {
      memory: { exploring: true },
      say: jest.fn(),
      moveTo: jest.fn(),
      room: {
        name: 'W1N1',
        find: jest.fn().mockReturnValue([])
      },
      pos: { x: 5, y: 5 },
      store: {
        [global.RESOURCE_ENERGY]: 0,
        getFreeCapacity: jest.fn().mockReturnValue(50)
      }
    }
    expect(() => roleExplorer.run(creep)).not.toThrow()
  })

  test('creepがexitがない房间stay in current room', () => {
    global.Game.map.describeExits.mockReturnValue(null)
    const creep = {
      memory: {},
      say: jest.fn(),
      moveTo: jest.fn(),
      room: { name: 'W1N1' },
      pos: { x: 5, y: 5 },
      store: { getFreeCapacity: jest.fn().mockReturnValue(50) }
    }
    expect(() => roleExplorer.run(creep)).not.toThrow()
    expect(creep.say).toHaveBeenCalledWith('🤔 No exits')
  })

  test('creepがcannot find exit的时候reset target', () => {
    global.Game.map.describeExits.mockReturnValue({ top: 'W0N1' })
    const creep = {
      memory: { targetRoom: 'W0N1' },
      say: jest.fn(),
      moveTo: jest.fn().mockReturnValue(global.ERR_NO_PATH),
      room: {
        name: 'W1N1'
      },
      pos: { x: 5, y: 5 },
      store: { getFreeCapacity: jest.fn().mockReturnValue(50) }
    }
    expect(() => roleExplorer.run(creep)).not.toThrow()
    expect(creep.say).toHaveBeenCalledWith('❌ No path')
    expect(creep.moveTo).toHaveBeenCalledWith(
      expect.objectContaining({ x: 25, y: 25, roomName: 'W0N1' }),
      expect.any(Object)
    )
  })

  test('picks a random exit securely when arriving at target', () => {
    global.Game.map.describeExits.mockReturnValue({ 1: 'W1N2', 3: 'W2N1' })

    // Mock Math.random to verify fallback doesn't throw and coverage hits
    const originalRandom = Math.random
    Math.random = jest.fn().mockReturnValue(0.9)

    const creep = {
      memory: { targetRoom: 'W1N1' }, // we are already here
      say: jest.fn(),
      moveTo: jest.fn(),
      room: { name: 'W1N1' },
      pos: { x: 25, y: 25 } // at center
    }

    expect(() => roleExplorer.run(creep)).not.toThrow()
    expect(creep.say).toHaveBeenCalledWith('👀 scouting')
    expect(creep.memory.targetRoom).toBeDefined()
    expect(['W1N2', 'W2N1']).toContain(creep.memory.targetRoom)

    Math.random = originalRandom
  })

  test('falls back to Math.random when crypto.randomBytes throws an error', () => {
    global.Game.map.describeExits.mockReturnValue({ 1: 'W1N2', 3: 'W2N1' })

    // Mock crypto to throw an error
    const crypto = require('crypto')
    const originalRandomBytes = crypto.randomBytes
    crypto.randomBytes = jest.fn().mockImplementation(() => {
      throw new Error('Simulated crypto error')
    })

    const originalRandom = Math.random
    Math.random = jest.fn().mockReturnValue(0.9)

    const creep = {
      memory: { targetRoom: 'W1N1' }, // we are already here
      say: jest.fn(),
      moveTo: jest.fn(),
      room: { name: 'W1N1' },
      pos: { x: 25, y: 25 } // at center
    }

    expect(() => roleExplorer.run(creep)).not.toThrow()
    expect(creep.say).toHaveBeenCalledWith('👀 scouting')
    expect(creep.memory.targetRoom).toBeDefined()
    expect(['W1N2', 'W2N1']).toContain(creep.memory.targetRoom)
    expect(Math.random).toHaveBeenCalled() // Verify fallback was reached

    Math.random = originalRandom
    crypto.randomBytes = originalRandomBytes
  })

  test('falls back to Math.random when require("crypto") throws an error', () => {
    global.Game.map.describeExits.mockReturnValue({ 1: 'W1N2', 3: 'W2N1' })

    // Force require('crypto') to throw by using jest.doMock
    jest.resetModules()
    jest.doMock('crypto', () => {
      throw new Error('Simulated module not found')
    })

    // Re-require the module under test so it uses the mocked crypto
    const roleExplorerMocked = require('../role.explorer')

    const originalRandom = Math.random
    Math.random = jest.fn().mockReturnValue(0.9)

    const creep = {
      memory: { targetRoom: 'W1N1' }, // we are already here
      say: jest.fn(),
      moveTo: jest.fn(),
      room: { name: 'W1N1' },
      pos: { x: 25, y: 25 } // at center
    }

    expect(() => roleExplorerMocked.run(creep)).not.toThrow()
    expect(creep.say).toHaveBeenCalledWith('👀 scouting')
    expect(creep.memory.targetRoom).toBeDefined()
    expect(['W1N2', 'W2N1']).toContain(creep.memory.targetRoom)
    expect(Math.random).toHaveBeenCalled() // Verify fallback was reached

    Math.random = originalRandom

    // Cleanup
    jest.dontMock('crypto')
    jest.resetModules()
  })
})
