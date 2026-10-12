/**
 * src/roles/harvester.js のユニットテスト
 */

global.Game = { creeps: {} }
global.Memory = {}
global.RESOURCE_ENERGY = 'energy'
global.OK = 0
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
  invalidate: jest.fn(),
  getStructuresNeedingEnergy: jest.fn()
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
jest.mock('../src/utils/logger', () => ({ warn: jest.fn(), info: jest.fn(), error: jest.fn() }), {
  virtual: true
})
jest.mock(
  '../src/constants',
  () => ({
    MEMORY_KEYS: { WORKING: 'working', SOURCE_ID: 'sourceId', TARGET_ID: 'targetId' },
    ROLES: { HARVESTER: 'harvester' }
  }),
  { virtual: true }
)

const { MEMORY_KEYS } = require('../src/constants')
const pathfinder = require('../src/utils/pathfinder')
const harvester = require('../src/roles/harvester')

describe('src/roles/harvester', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('落下エネルギーを拾いに移動する', () => {
    const drop = { id: 'drop', resourceType: global.RESOURCE_ENERGY, amount: 100 }
    mockCache.getDroppedResources.mockReturnValue([drop])

    const creep = {
      name: 'h1',
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      pickup: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: {},
      pos: { getRangeTo: jest.fn().mockReturnValue(5) }
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
    mockCache.getStructuresNeedingEnergy.mockReturnValue([target])
    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      transfer: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: {},
      pos: { x: 0, y: 0, getRangeTo: jest.fn().mockReturnValue(5) }
    }
    pathfinder.closest.mockReturnValue(target)

    harvester.run(creep)

    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, target, { range: 1 })
    expect(creep.memory.targetId).toBe('spawn1')
  })

  test('キャッシュされた納品先を再利用する', () => {
    mockCache.getDroppedResources.mockReturnValue([])
    const target = {
      id: 'spawn1',
      store: { getFreeCapacity: jest.fn().mockReturnValue(10) },
      structureType: global.STRUCTURE_SPAWN
    }
    global.Game.getObjectById = jest.fn().mockReturnValue(target)

    const creep = {
      memory: { working: true, targetId: 'spawn1' },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      transfer: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: {},
      pos: { x: 0, y: 0 }
    }

    harvester.run(creep)

    expect(global.Game.getObjectById).toHaveBeenCalledWith('spawn1')
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, target, { range: 1 })
    expect(mockCache.getStructuresNeedingEnergy).not.toHaveBeenCalled()
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
    mockCache.getStructuresNeedingEnergy.mockReturnValue([])
    const controller = {}
    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      transfer: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: {
        controller
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
    const energyDrop1 = { resourceType: global.RESOURCE_ENERGY, amount: 10 }
    const energyDrop2 = { resourceType: global.RESOURCE_ENERGY, amount: 20 }
    const creep = {
      room: 'room1',
      pos: {
        getRangeTo: jest.fn().mockImplementation((target) => {
          if (target === energyDrop1) return 5
          if (target === energyDrop2) return 10
          return 99
        })
      }
    }

    mockCache.getDroppedResources.mockReturnValue([energyDrop1, energyDrop2])

    const result = harvester._findDroppedEnergy(creep)

    expect(mockCache.getDroppedResources).toHaveBeenCalledWith(creep.room)
    expect(result).toBe(energyDrop1)
  })

  test('Filters out non-energy drops', () => {
    const nonEnergyDrop = { resourceType: 'minerals', amount: 10 }
    const energyDrop = { resourceType: global.RESOURCE_ENERGY, amount: 20 }
    const creep = {
      room: 'room1',
      pos: {
        getRangeTo: jest.fn().mockImplementation((target) => {
          if (target === energyDrop) return 5
          return 99
        })
      }
    }

    mockCache.getDroppedResources.mockReturnValue([nonEnergyDrop, energyDrop])

    const result = harvester._findDroppedEnergy(creep)

    expect(mockCache.getDroppedResources).toHaveBeenCalledWith(creep.room)
    expect(result).toBe(energyDrop)
  })

  test('Returns null if no energy drops exist', () => {
    const creep = { room: 'room1', pos: { getRangeTo: jest.fn().mockReturnValue(5) } }
    const nonEnergyDrop = { resourceType: 'minerals', amount: 10 }

    mockCache.getDroppedResources.mockReturnValue([nonEnergyDrop])

    const result = harvester._findDroppedEnergy(creep)

    expect(mockCache.getDroppedResources).toHaveBeenCalledWith(creep.room)
    expect(result).toBeNull()
  })

  test('Returns null if getDroppedResources returns empty array', () => {
    const creep = { room: 'room1', pos: { getRangeTo: jest.fn().mockReturnValue(5) } }

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
    const creep = { room: {}, pos: { getRangeTo: jest.fn().mockReturnValue(5) } }
    // エネルギーが100未満のコンテナのみを用意する
    const containers = [
      { store: { [global.RESOURCE_ENERGY]: 0 } },
      { store: { [global.RESOURCE_ENERGY]: 99 } }
    ]
    mockCache.getContainers.mockReturnValue(containers)

    const result = harvester._findAvailableContainer(creep)

    expect(result).toBeNull()
  })

  test('エネルギーが100以上のコンテナがある場合、最も近いコンテナを選択する', () => {
    const validContainer1 = { store: { [global.RESOURCE_ENERGY]: 100 } }
    const validContainer2 = { store: { [global.RESOURCE_ENERGY]: 200 } }
    const invalidContainer = { store: { [global.RESOURCE_ENERGY]: 50 } }
    const creep = {
      room: {},
      pos: {
        getRangeTo: jest.fn().mockImplementation((target) => {
          if (target === validContainer1) return 10
          if (target === validContainer2) return 5
          return 99
        })
      }
    }

    mockCache.getContainers.mockReturnValue([
      validContainer1,
      invalidContainer,
      validContainer2
    ])

    const result = harvester._findAvailableContainer(creep)

    expect(result).toBe(validContainer2)
  })
})

describe('_updateWorkingState', () => {
  test('working状態のとき、エネルギーが0なら採掘モード(working=false)に遷移する', () => {
    const creep = {
      memory: { [MEMORY_KEYS.WORKING]: true, [MEMORY_KEYS.SOURCE_ID]: 'source1' },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn()
    }

    harvester._updateWorkingState(creep)

    expect(creep.memory[MEMORY_KEYS.WORKING]).toBe(false)
    expect(creep.say).toHaveBeenCalledWith('🔄 採掘')
    expect(creep.memory[MEMORY_KEYS.SOURCE_ID]).toBeUndefined()
  })

  test('working状態ではないとき、エネルギーが満杯なら納品モード(working=true)に遷移する', () => {
    const creep = {
      memory: { [MEMORY_KEYS.WORKING]: false },
      store: { [global.RESOURCE_ENERGY]: 100, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn()
    }

    harvester._updateWorkingState(creep)

    expect(creep.memory[MEMORY_KEYS.WORKING]).toBe(true)
    expect(creep.say).toHaveBeenCalledWith('🚚 納品')
  })

  test('その他の状態では何もしない', () => {
    const creep = {
      memory: { [MEMORY_KEYS.WORKING]: true, [MEMORY_KEYS.SOURCE_ID]: 'source1' },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn()
    }

    harvester._updateWorkingState(creep)

    expect(creep.memory[MEMORY_KEYS.WORKING]).toBe(true)
    expect(creep.say).not.toHaveBeenCalled()
    expect(creep.memory[MEMORY_KEYS.SOURCE_ID]).toBe('source1')
  })
})

describe('_harvest', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('落下エネルギーがある場合、それを拾う', () => {
    const dropped = { amount: 50, resourceType: global.RESOURCE_ENERGY }
    mockCache.getDroppedResources.mockReturnValue([dropped])
    pathfinder.closest.mockReturnValue(dropped)

    const creep = {
      pos: {},
      room: {},
      pickup: jest.fn().mockReturnValue(global.OK)
    }

    harvester._harvest(creep)

    expect(creep.pickup).toHaveBeenCalledWith(dropped)
    expect(pathfinder.moveTo).not.toHaveBeenCalled()
  })

  test('落下エネルギーがある場合、距離が遠ければ移動する', () => {
    const dropped = { amount: 50, resourceType: global.RESOURCE_ENERGY }
    mockCache.getDroppedResources.mockReturnValue([dropped])
    pathfinder.closest.mockReturnValue(dropped)

    const creep = {
      pos: {},
      room: {},
      pickup: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE)
    }

    harvester._harvest(creep)

    expect(creep.pickup).toHaveBeenCalledWith(dropped)
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, dropped, { range: 1 })
  })

  test('コンテナにエネルギーがある場合、引き出す', () => {
    mockCache.getDroppedResources.mockReturnValue([])
    const container = { store: { [global.RESOURCE_ENERGY]: 200 } }
    mockCache.getContainers.mockReturnValue([container])

    const creep = {
      pos: { getRangeTo: jest.fn().mockReturnValue(5) },
      room: {},
      withdraw: jest.fn().mockReturnValue(global.OK)
    }

    harvester._harvest(creep)

    expect(creep.withdraw).toHaveBeenCalledWith(container, global.RESOURCE_ENERGY)
    expect(pathfinder.moveTo).not.toHaveBeenCalled()
  })

  test('コンテナにエネルギーがある場合、距離が遠ければ移動する', () => {
    mockCache.getDroppedResources.mockReturnValue([])
    const container = { store: { [global.RESOURCE_ENERGY]: 200 } }
    mockCache.getContainers.mockReturnValue([container])

    const creep = {
      pos: { getRangeTo: jest.fn().mockReturnValue(5) },
      room: {},
      withdraw: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE)
    }

    harvester._harvest(creep)

    expect(creep.withdraw).toHaveBeenCalledWith(container, global.RESOURCE_ENERGY)
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, container, { range: 1 })
  })

  test('ソースから採掘する', () => {
    mockCache.getDroppedResources.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    const source = { id: 'source1' }
    mockCache.assignSource.mockReturnValue(source)

    const creep = {
      pos: {},
      room: {},
      harvest: jest.fn().mockReturnValue(global.OK),
      name: 'creep1'
    }

    harvester._harvest(creep)

    expect(mockCache.assignSource).toHaveBeenCalledWith(creep, creep.room)
    expect(creep.harvest).toHaveBeenCalledWith(source)
  })

  test('ソースから採掘し、ソースが空の場合メモリをクリアする', () => {
    mockCache.getDroppedResources.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    const source = { id: 'source1' }
    mockCache.assignSource.mockReturnValue(source)

    const creep = {
      pos: {},
      room: {},
      harvest: jest.fn().mockReturnValue(global.ERR_NOT_ENOUGH_ENERGY),
      memory: { [MEMORY_KEYS.SOURCE_ID]: 'source1' },
      name: 'creep1'
    }

    harvester._harvest(creep)

    expect(creep.harvest).toHaveBeenCalledWith(source)
    expect(creep.memory[MEMORY_KEYS.SOURCE_ID]).toBeUndefined()
  })

  test('ソースが見つからない場合は警告を出す', () => {
    mockCache.getDroppedResources.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    const logger = require('../src/utils/logger')
    mockCache.assignSource.mockReturnValue(null)

    const creep = {
      pos: {},
      room: {},
      name: 'creep1'
    }

    harvester._harvest(creep)

    expect(logger.warn).toHaveBeenCalledWith('[creep1] ソースが見つかりません')
  })
})

describe('_deliver', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('キャッシュされたターゲットが存在し、容量がある場合はそれを使用する', () => {
    const target = {
      id: 'spawn1',
      store: { getFreeCapacity: jest.fn().mockReturnValue(10) },
      structureType: global.STRUCTURE_SPAWN
    }
    global.Game.getObjectById = jest.fn().mockReturnValue(target)

    const creep = {
      memory: { targetId: 'spawn1' },
      transfer: jest.fn().mockReturnValue(global.OK),
      room: { name: 'W1N1' }
    }

    harvester._deliver(creep)

    expect(global.Game.getObjectById).toHaveBeenCalledWith('spawn1')
    expect(creep.transfer).toHaveBeenCalledWith(target, global.RESOURCE_ENERGY)
    expect(creep.memory.targetId).toBeUndefined()
  })

  test('キャッシュされたターゲットが無効な場合（存在しない、容量0）、再検索する', () => {
    const invalidTarget = {
      id: 'spawn1',
      store: { getFreeCapacity: jest.fn().mockReturnValue(0) },
      structureType: global.STRUCTURE_SPAWN
    }
    global.Game.getObjectById = jest.fn().mockReturnValue(invalidTarget)

    const newTarget = {
      id: 'ext1',
      store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
      structureType: global.STRUCTURE_EXTENSION
    }
    mockCache.getStructuresNeedingEnergy.mockReturnValue([newTarget])

    const creep = {
      memory: { targetId: 'spawn1' },
      transfer: jest.fn().mockReturnValue(global.OK),
      room: { name: 'W1N1' },
      pos: { getRangeTo: jest.fn().mockReturnValue(5) }
    }

    harvester._deliver(creep)

    expect(creep.memory.targetId).toBeUndefined() // Should be cleared, then might be reassigned to undefined or deleted at the end of successful transfer
  })

  test('ターゲットに納品して ERR_FULL になった場合、キャッシュを無効化する', () => {
    const target = {
      id: 'spawn1',
      store: { getFreeCapacity: jest.fn().mockReturnValue(10) },
      structureType: global.STRUCTURE_SPAWN
    }
    mockCache.getStructuresNeedingEnergy.mockReturnValue([target])
    global.Game.getObjectById = jest.fn().mockReturnValue(null)

    const creep = {
      memory: {},
      transfer: jest.fn().mockReturnValue(global.ERR_FULL),
      room: { name: 'W1N1' },
      pos: { getRangeTo: jest.fn().mockReturnValue(5) }
    }

    harvester._deliver(creep)

    expect(creep.memory.targetId).toBeUndefined()
    expect(mockCache.invalidate).toHaveBeenCalledWith('need_energy_W1N1')
  })

  test('納品先がない場合はアップグレードを補助する', () => {
    mockCache.getStructuresNeedingEnergy.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    mockCache.getStorage.mockReturnValue(null)
    global.Game.getObjectById = jest.fn().mockReturnValue(null)

    const controller = { id: 'controller' }
    const creep = {
      memory: {},
      transfer: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.OK),
      room: { name: 'W1N1', controller },
      pos: {}
    }

    harvester._deliver(creep)

    expect(creep.upgradeController).toHaveBeenCalledWith(controller)
  })
})

describe('_findEnergyTarget', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('スポーン・エクステンションが最も優先される', () => {
    const creep = {
      pos: { getRangeTo: jest.fn().mockReturnValue(5) },
      room: {}
    }
    const spawn = { structureType: global.STRUCTURE_SPAWN }
    const tower = {
      structureType: global.STRUCTURE_TOWER,
      store: { getFreeCapacity: jest.fn().mockReturnValue(300) }
    }

    mockCache.getStructuresNeedingEnergy.mockReturnValue([spawn, tower])

    const result = harvester._findEnergyTarget(creep)

    expect(result).toBe(spawn)
  })

  test('スポーン・エクステンションがない場合、タワー（空き容量>200）が優先される', () => {
    const creep = {
      pos: { getRangeTo: jest.fn().mockReturnValue(5) },
      room: {}
    }
    const tower = {
      structureType: global.STRUCTURE_TOWER,
      store: { getFreeCapacity: jest.fn().mockReturnValue(300) }
    }

    mockCache.getStructuresNeedingEnergy.mockReturnValue([tower])

    const result = harvester._findEnergyTarget(creep)

    expect(result).toBe(tower)
  })

  test('上記のどれもない場合、コンテナ（空き容量>200）が優先される', () => {
    const creep = {
      pos: { getRangeTo: jest.fn().mockReturnValue(5) },
      room: {}
    }
    const container = { store: { getFreeCapacity: jest.fn().mockReturnValue(300) } }

    mockCache.getStructuresNeedingEnergy.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([container])

    const result = harvester._findEnergyTarget(creep)

    expect(result).toBe(container)
  })

  test('コンテナもない場合、ストレージ（空き容量>0）が選ばれる', () => {
    const creep = {
      pos: { getRangeTo: jest.fn().mockReturnValue(5) },
      room: {}
    }
    const storage = { store: { getFreeCapacity: jest.fn().mockReturnValue(100) } }

    mockCache.getStructuresNeedingEnergy.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    mockCache.getStorage.mockReturnValue(storage)

    const result = harvester._findEnergyTarget(creep)

    expect(result).toBe(storage)
  })

  test('候補が何もない場合はnullを返す', () => {
    const creep = {
      pos: { getRangeTo: jest.fn().mockReturnValue(5) },
      room: {}
    }

    mockCache.getStructuresNeedingEnergy.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    mockCache.getStorage.mockReturnValue(null)

    const result = harvester._findEnergyTarget(creep)

    expect(result).toBeNull()
  })
})

describe('_upgradeAsBackup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('コントローラーがない場合は何もしない', () => {
    const creep = {
      room: {}
    }

    harvester._upgradeAsBackup(creep)

    // 呼び出しによるエラーが起きないことを確認
  })

  test('コントローラーが範囲外の場合は移動する', () => {
    const controller = { id: 'controller' }
    const creep = {
      upgradeController: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { controller }
    }

    harvester._upgradeAsBackup(creep)

    expect(creep.upgradeController).toHaveBeenCalledWith(controller)
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, controller, { range: 3 })
  })
})

describe('getBody', () => {
  test('energy >= 750', () => {
    expect(harvester.getBody(750)).toEqual([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE])
    expect(harvester.getBody(800)).toEqual([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE])
  })

  test('energy >= 500', () => {
    expect(harvester.getBody(500)).toEqual([WORK, WORK, CARRY, CARRY, MOVE, MOVE])
    expect(harvester.getBody(749)).toEqual([WORK, WORK, CARRY, CARRY, MOVE, MOVE])
  })

  test('energy >= 300', () => {
    expect(harvester.getBody(300)).toEqual([WORK, WORK, CARRY, MOVE])
    expect(harvester.getBody(499)).toEqual([WORK, WORK, CARRY, MOVE])
  })

  test('energy < 300', () => {
    expect(harvester.getBody(299)).toEqual([WORK, CARRY, MOVE])
    expect(harvester.getBody(0)).toEqual([WORK, CARRY, MOVE])
  })
})
