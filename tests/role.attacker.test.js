/**
 * role.attacker.js のユニットテスト
 */

global.Game = {
  flags: {}
}
global.Memory = {}
global.OK = 0
global.ERR_NOT_IN_RANGE = -9
global.FIND_MY_CREEPS = 1
global.FIND_HOSTILE_CREEPS = 2
global.FIND_HOSTILE_STRUCTURES = 3
global.FIND_STRUCTURES = 104
global.HEAL = 'heal'
global.STRUCTURE_INVADER_CORE = 'invaderCore'
global.STRUCTURE_TOWER = 'tower'
global.STRUCTURE_SPAWN = 'spawn'

const roleAttacker = require('../role.attacker')

describe('role.attacker', () => {
  let mockCreep

  beforeEach(() => {
    global.Game.flags = {}
    global.Game.getObjectById = jest.fn()
    mockCreep = {
      hits: 100,
      hitsMax: 100,
      memory: {},
      attack: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn().mockReturnValue(global.OK),
      pos: {
        findClosestByRange: jest.fn()
      },
      room: {
        controller: { id: 'controller1' },
        find: jest.fn().mockReturnValue([])
      }
    }
  })

  test('モジュールが正しく読み込める', () => {
    expect(roleAttacker).toBeDefined()
    expect(typeof roleAttacker.run).toBe('function')
  })

  test('hits < 50% && HEAL available -> moveTo HEAL', () => {
    mockCreep.hits = 40
    const healTarget = {
      getActiveBodyparts: jest.fn().mockReturnValue(1),
      pos: { x: 10, y: 10 }
    }
    mockCreep.pos.x = 5
    mockCreep.pos.y = 5
    mockCreep.room._myCreeps = [healTarget]

    roleAttacker.run(mockCreep)

    expect(mockCreep.moveTo).toHaveBeenCalledWith(healTarget, expect.any(Object))
    expect(mockCreep.attack).not.toHaveBeenCalled()
  })

  test('Priority 1: Attack hostile creeps in range', () => {
    const hostileCreep = { id: 'enemy', room: { name: 'W1N1' } }
    mockCreep.room.name = 'W1N1'
    mockCreep.room.find.mockReturnValue([hostileCreep])
    mockCreep.pos.findClosestByRange.mockImplementation((type) => {
      if (type === global.FIND_HOSTILE_CREEPS || Array.isArray(type)) return hostileCreep
      return null
    })

    roleAttacker.run(mockCreep)

    expect(mockCreep.attack).toHaveBeenCalledWith(hostileCreep)
    expect(mockCreep.moveTo).not.toHaveBeenCalled()
  })

  test('Priority 1: Move to hostile creeps out of range', () => {
    const hostileCreep = { id: 'enemy', room: { name: 'W1N1' } }
    mockCreep.room.name = 'W1N1'
    mockCreep.room.find.mockReturnValue([hostileCreep])
    mockCreep.attack.mockReturnValue(global.ERR_NOT_IN_RANGE)
    mockCreep.pos.findClosestByRange.mockImplementation((type) => {
      if (type === global.FIND_HOSTILE_CREEPS || Array.isArray(type)) return hostileCreep
      return null
    })

    roleAttacker.run(mockCreep)

    expect(mockCreep.attack).toHaveBeenCalledWith(hostileCreep)
    expect(mockCreep.moveTo).toHaveBeenCalledWith(hostileCreep, expect.any(Object))
  })

  test('Priority 2: Attack hostile structures in range', () => {
    const hostileStructure = { structureType: global.STRUCTURE_TOWER }
    mockCreep.room.find.mockReturnValue([hostileStructure])

    // mock cache.getStructures to return array and filter it
    const cache = require('../src/utils/cache')
    jest.spyOn(cache, 'getStructures').mockReturnValue([hostileStructure])

    mockCreep.pos.findClosestByRange.mockImplementation((type, opts) => {
      if (Array.isArray(type) && type.includes(hostileStructure)) return hostileStructure
      return null
    })

    roleAttacker.run(mockCreep)

    expect(mockCreep.attack).toHaveBeenCalledWith(hostileStructure)
    expect(mockCreep.moveTo).not.toHaveBeenCalled()
  })

  test('Priority 2: Move to hostile structures out of range', () => {
    const hostileStructure = { structureType: global.STRUCTURE_SPAWN }
    mockCreep.room.find.mockReturnValue([hostileStructure])
    mockCreep.attack.mockReturnValue(global.ERR_NOT_IN_RANGE)

    // mock cache.getStructures to return array and filter it
    const cache = require('../src/utils/cache')
    jest.spyOn(cache, 'getStructures').mockReturnValue([hostileStructure])

    mockCreep.pos.findClosestByRange.mockImplementation((type, opts) => {
      if (Array.isArray(type) && type.includes(hostileStructure)) return hostileStructure
      return null
    })

    roleAttacker.run(mockCreep)

    expect(mockCreep.attack).toHaveBeenCalledWith(hostileStructure)
    expect(mockCreep.moveTo).toHaveBeenCalledWith(hostileStructure, expect.any(Object))
  })

  test('Priority 3: Patrol flag', () => {
    const flag = { name: 'Attack' }
    global.Game.flags.Attack = flag
    mockCreep.pos.findClosestByRange.mockReturnValue(null)

    roleAttacker.run(mockCreep)

    expect(mockCreep.moveTo).toHaveBeenCalledWith(flag, expect.any(Object))
    expect(mockCreep.attack).not.toHaveBeenCalled()
  })

  test('Priority 3: Patrol to room controller when idle and no flag', () => {
    mockCreep.pos.findClosestByRange.mockReturnValue(null)

    roleAttacker.run(mockCreep)

    expect(mockCreep.moveTo).toHaveBeenCalledWith(
      mockCreep.room.controller,
      expect.any(Object)
    )
    expect(mockCreep.attack).not.toHaveBeenCalled()
  })

  describe('_findClosestTarget optimization', () => {
    test('returns null for empty or null target lists', () => {
      expect(roleAttacker._findClosestTarget(mockCreep, null)).toBeNull()
      expect(roleAttacker._findClosestTarget(mockCreep, [])).toBeNull()
    })

    test('uses getRangeTo and finds closest target with early exit on dist <= 1', () => {
      const getRangeToMock = jest.fn()
      const creepWithRange = {
        pos: {
          getRangeTo: getRangeToMock
        }
      }
      const target1 = { id: 't1' }
      const target2 = { id: 't2' }
      const target3 = { id: 't3' }

      // target1 is at distance 1 (adjacent), so loop should early-exit before evaluating target2 or target3
      getRangeToMock.mockReturnValueOnce(1)

      const result = roleAttacker._findClosestTarget(creepWithRange, [
        target1,
        target2,
        target3
      ])
      expect(result).toBe(target1)
      expect(getRangeToMock).toHaveBeenCalledTimes(1)
      expect(getRangeToMock).toHaveBeenCalledWith(target1)
    })

    test('correctly picks closest target when multiple targets are farther than 1', () => {
      const getRangeToMock = jest.fn()
      const creepWithRange = {
        pos: {
          getRangeTo: getRangeToMock
        }
      }
      const target1 = { id: 't1' }
      const target2 = { id: 't2' }

      getRangeToMock.mockReturnValueOnce(5)
      getRangeToMock.mockReturnValueOnce(2)

      const result = roleAttacker._findClosestTarget(creepWithRange, [target1, target2])
      expect(result).toBe(target2)
      expect(getRangeToMock).toHaveBeenCalledTimes(2)
    })

    test('falls back to findClosestByRange when getRangeTo is not a function', () => {
      const target1 = { id: 't1' }
      const findClosestMock = jest.fn().mockReturnValue(target1)
      const creepFallback = {
        pos: {
          findClosestByRange: findClosestMock
        }
      }

      const result = roleAttacker._findClosestTarget(creepFallback, [target1])
      expect(result).toBe(target1)
      expect(findClosestMock).toHaveBeenCalledWith([target1])
    })
  })
})
