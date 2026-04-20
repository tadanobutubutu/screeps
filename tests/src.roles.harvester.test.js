/**
 * src/roles/harvester.js のユニットテスト
 */

global.Game = { creeps: {} }
global.Memory = {}
global.RESOURCE_ENERGY = 'energy'
global.WORK = 'work'
global.CARRY = 'carry'
global.MOVE = 'move'
global.ATTACK = 'attack'
global.RANGED_ATTACK = 'ranged_attack'
global.HEAL = 'heal'
global.CLAIM = 'claim'
global.TOUGH = 'tough'
global.ERR_NOT_IN_RANGE = -9
global.ERR_FULL = -8
global.ERR_NOT_ENOUGH_ENERGY = -6
global.STRUCTURE_SPAWN = 'spawn'
global.STRUCTURE_EXTENSION = 'extension'
global.STRUCTURE_TOWER = 'tower'
global.FIND_MY_STRUCTURES = 11

const mockCache = {
  getDroppedResources: jest.fn(),
  getContainers: jest.fn(),
  getStorage: jest.fn(),
  assignSource: jest.fn(),
  invalidate: jest.fn()
}

jest.mock('../src/utils/cache', () => mockCache, { virtual: true })
jest.mock(
  '../src/utils/pathfinder',
  () => ({
    moveTo: jest.fn(),
    closest: jest.fn()
  }),
  { virtual: true }
)
jest.mock('../src/utils/logger', () => ({ warn: jest.fn() }), { virtual: true })
jest.mock(
  '../src/constants',
  () => ({
    MEMORY_KEYS: { WORKING: 'working', SOURCE_ID: 'sourceId' },
    ROLES: { HARVESTER: 'harvester' }
  }),
  { virtual: true }
)

const pathfinder = require('../src/utils/pathfinder')
const harvester = require('../src/roles/harvester')

describe('src/roles/harvester', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('落下エネルギーを拾いに移動する', () => {
    const drop = { id: 'drop', resourceType: global.RESOURCE_ENERGY, amount: 100 }
    mockCache.getDroppedResources.mockReturnValue([drop])
    pathfinder.closest.mockReturnValue(drop)

    const creep = {
      name: 'h1',
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      pickup: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: {}
    }

    harvester.run(creep)

    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, drop, { range: 1 })
  })

  test('納品先があるとき移動してエネルギーを渡す', () => {
    mockCache.getDroppedResources.mockReturnValue([])
    const target = {
      id: 'spawn1',
      store: { getFreeCapacity: jest.fn().mockReturnValue(10) },
      structureType: global.STRUCTURE_SPAWN
    }
    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      transfer: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: {
        find: jest.fn().mockReturnValue([target])
      },
      pos: { x: 0, y: 0 }
    }
    pathfinder.closest.mockReturnValue(target)

    harvester.run(creep)

    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, target, { range: 1 })
  })

  test('getBodyで適切な構成を返す', () => {
    expect(harvester.getBody(800)).toEqual([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE])
    expect(harvester.getBody(200)).toEqual([WORK, CARRY, MOVE])
  })

  test('エネルギー切れで採掘モードに戻る', () => {
    mockCache.getDroppedResources.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    mockCache.getStorage.mockReturnValue(null)
    const source = { id: 's1' }
    mockCache.assignSource.mockReturnValue(source)

    const creep = {
      memory: { working: true, sourceId: 'old' },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      harvest: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: {},
      pos: {}
    }

    harvester.run(creep)

    expect(creep.memory.working).toBe(false)
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, source, { range: 1 })
  })

  test('納品先がなくコントローラーをアップグレードする', () => {
    mockCache.getDroppedResources.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    mockCache.getStorage.mockReturnValue(null)
    const controller = {}
    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      transfer: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: {
        controller,
        find: jest.fn().mockReturnValue([])
      },
      pos: {}
    }

    harvester.run(creep)

    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, controller, { range: 3 })
  })
})

describe('_findDroppedEnergy', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Returns the closest energy drop if energy drops are found', () => {
    const creep = { room: 'room1', pos: { x: 5, y: 5 } }
    const energyDrop1 = { resourceType: global.RESOURCE_ENERGY, amount: 10 }
    const energyDrop2 = { resourceType: global.RESOURCE_ENERGY, amount: 20 }

    mockCache.getDroppedResources.mockReturnValue([energyDrop1, energyDrop2])
    pathfinder.closest.mockReturnValue(energyDrop1)

    const result = harvester._findDroppedEnergy(creep)

    expect(mockCache.getDroppedResources).toHaveBeenCalledWith(creep.room)
    expect(pathfinder.closest).toHaveBeenCalledWith(creep.pos, [energyDrop1, energyDrop2])
    expect(result).toBe(energyDrop1)
  })

  test('Filters out non-energy drops', () => {
    const creep = { room: 'room1', pos: { x: 5, y: 5 } }
    const nonEnergyDrop = { resourceType: 'minerals', amount: 10 }
    const energyDrop = { resourceType: global.RESOURCE_ENERGY, amount: 20 }

    mockCache.getDroppedResources.mockReturnValue([nonEnergyDrop, energyDrop])
    pathfinder.closest.mockReturnValue(energyDrop)

    const result = harvester._findDroppedEnergy(creep)

    expect(mockCache.getDroppedResources).toHaveBeenCalledWith(creep.room)
    expect(pathfinder.closest).toHaveBeenCalledWith(creep.pos, [energyDrop])
    expect(result).toBe(energyDrop)
  })

  test('Returns null if no energy drops exist', () => {
    const creep = { room: 'room1', pos: { x: 5, y: 5 } }
    const nonEnergyDrop = { resourceType: 'minerals', amount: 10 }

    mockCache.getDroppedResources.mockReturnValue([nonEnergyDrop])

    const result = harvester._findDroppedEnergy(creep)

    expect(mockCache.getDroppedResources).toHaveBeenCalledWith(creep.room)
    expect(result).toBeNull()
  })

  test('Returns null if getDroppedResources returns empty array', () => {
    const creep = { room: 'room1', pos: { x: 5, y: 5 } }

    mockCache.getDroppedResources.mockReturnValue([])

    const result = harvester._findDroppedEnergy(creep)

    expect(mockCache.getDroppedResources).toHaveBeenCalledWith(creep.room)
    expect(result).toBeNull()
  })
})

describe('_findAvailableContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('エネルギーが100未満のコンテナは無視し、条件を満たさない場合はnullを返す', () => {
    const creep = { room: {}, pos: {} }
    // エネルギーが100未満のコンテナのみを用意する
    const containers = [
      { store: { [global.RESOURCE_ENERGY]: 0 } },
      { store: { [global.RESOURCE_ENERGY]: 99 } }
    ]
    mockCache.getContainers.mockReturnValue(containers)

    const result = harvester._findAvailableContainer(creep)

    expect(result).toBeNull()
    expect(pathfinder.closest).not.toHaveBeenCalled()
  })

  test('エネルギーが100以上のコンテナがある場合、pathfinder.closestにフィルタリングされた配列を渡す', () => {
    const creep = { room: {}, pos: { x: 1, y: 1 } }
    const validContainer1 = { store: { [global.RESOURCE_ENERGY]: 100 } }
    const validContainer2 = { store: { [global.RESOURCE_ENERGY]: 200 } }
    const invalidContainer = { store: { [global.RESOURCE_ENERGY]: 50 } }

    mockCache.getContainers.mockReturnValue([validContainer1, invalidContainer, validContainer2])
    pathfinder.closest.mockReturnValue(validContainer2)

    const result = harvester._findAvailableContainer(creep)

    // closestに渡される配列が、エネルギー100以上のコンテナのみであるかを確認
    expect(pathfinder.closest).toHaveBeenCalledWith(creep.pos, [validContainer1, validContainer2])
    expect(result).toBe(validContainer2)
  })
})
