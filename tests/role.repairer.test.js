/**
 * role.repairer.js のユニットテスト
 */

global.Game = {
  time: 10,
  getObjectById: jest.fn().mockImplementation((id) => {
    if (id === 'source1') return { id: 'source1', energy: 1000 }
    return null
  })
}
global.Memory = {}
global.RESOURCE_ENERGY = 'energy'
global.OK = 0
global.ERR_NOT_IN_RANGE = -9
global.FIND_STRUCTURES = 107
global.FIND_SOURCES_ACTIVE = 5

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
    rainbowTrail: jest.fn(),
    particles: jest.fn(),
    scorePopup: jest.fn()
  }),
  { virtual: true }
)

global.FIND_STRUCTURES = 107
global.FIND_SOURCES_ACTIVE = 103
global.ERR_NOT_ENOUGH_ENERGY = -6
global.STRUCTURE_ROAD = 'road'
global.STRUCTURE_CONTAINER = 'container'
global.STRUCTURE_WALL = 'wall'

const roleRepairer = require('../role.repairer')

describe('role.repairer', () => {
  test('モジュールが正しく読み込める', () => {
    expect(roleRepairer).toBeDefined()
    expect(typeof roleRepairer.run).toBe('function')
  })

  test('修理対象がないとき例外を投げない', () => {
    const creep = {
      memory: { repairing: true },
      store: {
        getFreeCapacity: jest.fn().mockReturnValue(0),
        [global.RESOURCE_ENERGY]: 50
      },
      say: jest.fn(),
      repair: jest.fn().mockReturnValue(global.OK),
      harvest: jest.fn().mockReturnValue(global.OK),
      upgradeController: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      room: {
        _repairTargets: [],
        find: jest.fn().mockReturnValue([]),
        controller: { id: 'controller1' }
      },
      pos: {
        x: 1,
        y: 1,
        findClosestByRange: jest.fn().mockReturnValue(null)
      }
    }
    expect(() => roleRepairer.run(creep)).not.toThrow()
  })

  test('repairer能repair道路', () => {
    const damagedRoad = { id: 'road1', hits: 100, hitsMax: 500, structureType: 'road' }
    const creep = {
      memory: { repairing: false },
      store: {
        getFreeCapacity: jest.fn().mockReturnValue(0),
        [global.RESOURCE_ENERGY]: 50
      },
      say: jest.fn(),
      repair: jest.fn().mockReturnValue(global.OK),
      harvest: jest.fn().mockReturnValue(global.OK),
      upgradeController: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      room: {
        _repairTargets: [damagedRoad],
        find: jest.fn().mockReturnValue([damagedRoad]),
        controller: { id: 'controller1' }
      },
      pos: { x: 10, y: 10 }
    }
    expect(() => roleRepairer.run(creep)).not.toThrow()
  })

  test('修理ターゲットを再選択して移動する', () => {
    const damaged = { id: 'road2', hits: 50, hitsMax: 500, structureType: 'road' }
    const creep = {
      memory: { repairing: true, repairTargetId: 'unknown' },
      store: { getFreeCapacity: jest.fn().mockReturnValue(0), [global.RESOURCE_ENERGY]: 50 },
      say: jest.fn(),
      repair: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      harvest: jest.fn(),
      moveTo: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.OK),
      room: {
        _repairTargets: [damaged],
        _minHitsRepairTarget: damaged,
        find: jest.fn().mockReturnValue([damaged]),
        controller: { id: 'controller1' }
      },
      pos: {
        findClosestByRange: jest.fn().mockReturnValue(damaged)
      }
    }

    expect(() => roleRepairer.run(creep)).not.toThrow()
    expect(creep.memory.repairTargetId).toBe('road2')
    expect(creep.moveTo).toHaveBeenCalledWith(damaged, expect.any(Object))
  })

  test('修理対象がなくコントローラーをアップグレードする', () => {
    const creep = {
      memory: { repairing: true, repairTargetId: 'old' },
      store: { getFreeCapacity: jest.fn().mockReturnValue(0), [global.RESOURCE_ENERGY]: 10 },
      say: jest.fn(),
      repair: jest.fn().mockReturnValue(global.OK),
      harvest: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      moveTo: jest.fn(),
      room: {
        _repairTargets: [],
        find: jest.fn().mockReturnValue([]),
        controller: { id: 'controller1' }
      },
      pos: { findClosestByRange: jest.fn().mockReturnValue(null) }
    }

    roleRepairer.run(creep)
    expect(creep.memory.repairTargetId).toBeUndefined()
    expect(creep.moveTo).toHaveBeenCalledWith(creep.room.controller, expect.any(Object))
  })
})
