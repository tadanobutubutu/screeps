/**
 * src/roles/builder.js のユニットテスト
 */

global.Game = {
  getObjectById: jest.fn(),
  rooms: {},
  time: 0
}
global.Memory = {}
global.RESOURCE_ENERGY = 'energy'
global.WORK = 'work'
global.CARRY = 'carry'
global.MOVE = 'move'
global.FIND_STRUCTURES = 5
global.STRUCTURE_CONTAINER = 'container'
global.STRUCTURE_EXTENSION = 'extension'
global.STRUCTURE_SPAWN = 'spawn'
global.STRUCTURE_TOWER = 'tower'
global.STRUCTURE_STORAGE = 'storage'
global.STRUCTURE_LINK = 'link'
global.STRUCTURE_ROAD = 'road'
global.STRUCTURE_RAMPART = 'rampart'
global.STRUCTURE_WALL = 'wall'
global.ERR_NOT_IN_RANGE = -9
global.ERR_INVALID_TARGET = -7
global.OK = 0

const mockCache = {
  getStructures: jest.fn(),
  getConstructionSites: jest.fn(),
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
jest.mock(
  '../src/utils/logger',
  () => ({
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }),
  { virtual: true }
)
jest.mock(
  '../src/constants',
  () => ({
    MEMORY_KEYS: { WORKING: 'working', TARGET_ID: 'targetId' }
  }),
  { virtual: true }
)

const pathfinder = require('../src/utils/pathfinder')
const builder = require('../src/roles/builder')

describe('src/roles/builder', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.Game.getObjectById.mockReturnValue(null)
  })

  test('建設サイトの優先度が既存のものより低い場合は無視される', () => {
    const nearHighPrioritySite = {
      id: 'high_priority',
      structureType: global.STRUCTURE_CONTAINER, // priority 1
      progress: 0,
      progressTotal: 100,
      pos: { x: 5, y: 5, getRangeTo: jest.fn().mockReturnValue(5) }
    }
    const farLowPrioritySite = {
      id: 'low_priority',
      structureType: global.STRUCTURE_ROAD, // priority 7
      progress: 0,
      progressTotal: 100,
      pos: { x: 10, y: 10, getRangeTo: jest.fn().mockReturnValue(10) }
    }
    // 優先度が高いものを先に評価させ、後から低いものを評価させる
    mockCache.getConstructionSites.mockReturnValue([nearHighPrioritySite, farLowPrioritySite])

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.OK),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: (s) => (s.id === 'high_priority' ? 5 : 10) }
    }

    builder.run(creep)

    expect(creep.memory.targetId).toBe('high_priority')
  })

  test('建設サイトの優先度が既存のものより高い場合は距離に関わらず優先される', () => {
    const farHighPrioritySite = {
      id: 'high_priority',
      structureType: global.STRUCTURE_CONTAINER, // priority 1
      progress: 0,
      progressTotal: 100,
      pos: { x: 10, y: 10, getRangeTo: jest.fn().mockReturnValue(10) }
    }
    const nearLowPrioritySite = {
      id: 'low_priority',
      structureType: global.STRUCTURE_ROAD, // priority 7
      progress: 0,
      progressTotal: 100,
      pos: { x: 5, y: 5, getRangeTo: jest.fn().mockReturnValue(5) }
    }
    // 優先度が低いものを先に評価させ、後から高いものを評価させる
    mockCache.getConstructionSites.mockReturnValue([nearLowPrioritySite, farHighPrioritySite])

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.OK),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: (s) => (s.id === 'high_priority' ? 10 : 5) }
    }

    builder.run(creep)

    expect(creep.memory.targetId).toBe('high_priority')
  })

  test('建設サイトの優先度が同じで、より遠い場合は更新しない', () => {
    const site1 = {
      id: 's1',
      structureType: global.STRUCTURE_EXTENSION,
      progress: 0,
      progressTotal: 100,
      pos: { x: 5, y: 5, getRangeTo: jest.fn().mockReturnValue(5) }
    }
    const site2 = {
      id: 's2',
      structureType: global.STRUCTURE_EXTENSION,
      progress: 0,
      progressTotal: 100,
      pos: { x: 10, y: 10, getRangeTo: jest.fn().mockReturnValue(10) } // より遠い
    }
    mockCache.getConstructionSites.mockReturnValue([site1, site2])

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.OK),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: (s) => (s.id === 's1' ? 5 : 10) }
    }

    builder.run(creep)

    expect(creep.memory.targetId).toBe('s1')
  })

  test('建設サイトの優先度と距離が同じ場合は既存のものを優先する', () => {
    const site1 = {
      id: 's1',
      structureType: global.STRUCTURE_EXTENSION,
      progress: 0,
      progressTotal: 100,
      pos: { x: 5, y: 5, getRangeTo: jest.fn().mockReturnValue(5) }
    }
    const site2 = {
      id: 's2',
      structureType: global.STRUCTURE_EXTENSION,
      progress: 0,
      progressTotal: 100,
      pos: { x: 5, y: 5, getRangeTo: jest.fn().mockReturnValue(5) }
    }
    mockCache.getConstructionSites.mockReturnValue([site1, site2])

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.OK),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: () => 5 }
    }

    builder.run(creep)

    expect(creep.memory.targetId).toBe('s1')
  })

  test('コントローラーが範囲内の場合は移動しない', () => {
    mockCache.getConstructionSites.mockReturnValue([])
    mockCache.getStructures.mockReturnValue([])
    const room = {
      find: jest.fn().mockReturnValue([]),
      visual: { text: jest.fn() },
      name: 'W0N0',
      controller: { id: 'ctrl1' }
    }

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn(),
      repair: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.OK),
      room,
      pos: { getRangeTo: jest.fn().mockReturnValue(1) }
    }

    builder.run(creep)

    expect(creep.upgradeController).toHaveBeenCalledWith(room.controller)
    expect(pathfinder.moveTo).not.toHaveBeenCalledWith(
      creep,
      room.controller,
      expect.any(Object)
    )
  })

  test('コンテナの距離が既存のものと同じ場合は既存のものを優先する', () => {
    mockCache.getDroppedResources.mockReturnValue([])
    const c1 = { store: { [global.RESOURCE_ENERGY]: 200 }, id: 'c1' }
    const c2 = { store: { [global.RESOURCE_ENERGY]: 200 }, id: 'c2' }
    mockCache.getContainers.mockReturnValue([c1, c2])

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.OK),
      room: { name: 'W0N0' },
      pos: { getRangeTo: () => 5 } // 距離同じ
    }

    builder.run(creep)

    expect(creep.withdraw).toHaveBeenCalledWith(c1, global.RESOURCE_ENERGY)
  })

  test('ソースが範囲内の場合は移動しない', () => {
    mockCache.getDroppedResources.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    mockCache.getStorage.mockReturnValue(null)
    const source = { id: 'src1' }
    mockCache.assignSource.mockReturnValue(source)

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      harvest: jest.fn().mockReturnValue(global.OK),
      withdraw: jest.fn(),
      pickup: jest.fn(),
      room: { name: 'W0N0' },
      pos: { getRangeTo: jest.fn().mockReturnValue(1) }
    }

    builder.run(creep)

    expect(creep.harvest).toHaveBeenCalledWith(source)
    expect(pathfinder.moveTo).not.toHaveBeenCalledWith(creep, source, expect.any(Object))
  })

  test('建設ターゲットを選択して移動する', () => {
    const containerSite = {
      id: 's1',
      structureType: global.STRUCTURE_CONTAINER,
      progress: 0,
      progressTotal: 100,
      pos: { x: 10, y: 10, getRangeTo: jest.fn().mockReturnValue(2) }
    }
    const roadSite = {
      id: 's2',
      structureType: global.STRUCTURE_ROAD,
      progress: 0,
      progressTotal: 100,
      pos: { x: 12, y: 12, getRangeTo: jest.fn().mockReturnValue(3) }
    }
    mockCache.getConstructionSites.mockReturnValue([roadSite, containerSite])

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: jest.fn().mockReturnValue(1) }
    }

    builder.run(creep)

    expect(creep.memory.targetId).toBe('s1')
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, containerSite, expect.any(Object))
    expect(creep.room.visual.text).toHaveBeenCalled()
  })

  test('同じ優先度の建設サイトがある場合、近い方を選ぶ（より近い距離）', () => {
    const farSite = {
      id: 'far',
      structureType: global.STRUCTURE_EXTENSION,
      progress: 0,
      progressTotal: 100,
      pos: { x: 10, y: 10, getRangeTo: jest.fn().mockReturnValue(10) }
    }
    const nearSite = {
      id: 'near',
      structureType: global.STRUCTURE_EXTENSION,
      progress: 0,
      progressTotal: 100,
      pos: { x: 5, y: 5, getRangeTo: jest.fn().mockReturnValue(5) }
    }
    // 逆順で返すことで、すでに同じ優先度が見つかっている状態での距離比較をテストする
    mockCache.getConstructionSites.mockReturnValue([farSite, nearSite])

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.OK),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: (site) => (site.id === 'far' ? 10 : 5) }
    }

    builder.run(creep)

    expect(creep.memory.targetId).toBe('near')
  })

  test('同じ優先度の建設サイトがある場合、既存のものより遠い場合は選ばない', () => {
    const nearSite = {
      id: 'near',
      structureType: global.STRUCTURE_EXTENSION,
      progress: 0,
      progressTotal: 100,
      pos: { x: 5, y: 5, getRangeTo: jest.fn().mockReturnValue(5) }
    }
    const farSite = {
      id: 'far',
      structureType: global.STRUCTURE_EXTENSION,
      progress: 0,
      progressTotal: 100,
      pos: { x: 10, y: 10, getRangeTo: jest.fn().mockReturnValue(10) }
    }
    mockCache.getConstructionSites.mockReturnValue([nearSite, farSite])

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.OK),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: (site) => (site.id === 'near' ? 5 : 10) }
    }

    builder.run(creep)

    expect(creep.memory.targetId).toBe('near')
  })

  test('修復対象との距離が既存のものより短い場合、更新する', () => {
    const farDamaged = {
      id: 'd1',
      hits: 100,
      hitsMax: 500,
      structureType: global.STRUCTURE_ROAD,
      pos: { x: 10, y: 10 }
    }
    const nearDamaged = {
      id: 'd2',
      hits: 100,
      hitsMax: 500,
      structureType: global.STRUCTURE_ROAD,
      pos: { x: 5, y: 5 }
    }
    mockCache.getConstructionSites.mockReturnValue([])
    mockCache.getStructures.mockReturnValue([farDamaged, nearDamaged])

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn(),
      repair: jest.fn().mockReturnValue(global.OK),
      room: { name: 'W0N0' },
      pos: { getRangeTo: (s) => (s.id === 'd1' ? 10 : 5) }
    }

    builder.run(creep)

    expect(creep.repair).toHaveBeenCalledWith(nearDamaged)
  })

  test('同じ優先度の建設サイトがある場合、近い方を選ぶ', () => {
    const farSite = {
      id: 'far',
      structureType: global.STRUCTURE_EXTENSION,
      progress: 0,
      progressTotal: 100,
      pos: { x: 10, y: 10, getRangeTo: jest.fn().mockReturnValue(10) }
    }
    const nearSite = {
      id: 'near',
      structureType: global.STRUCTURE_EXTENSION,
      progress: 0,
      progressTotal: 100,
      pos: { x: 5, y: 5, getRangeTo: jest.fn().mockReturnValue(5) }
    }
    mockCache.getConstructionSites.mockReturnValue([farSite, nearSite])

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.OK),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: (site) => (site.id === 'far' ? 10 : 5) }
    }

    builder.run(creep)

    expect(creep.memory.targetId).toBe('near')
    expect(creep.build).toHaveBeenCalledWith(nearSite)
  })

  test('メモリのターゲットが無効な場合、メモリから削除して再検索する', () => {
    global.Game.getObjectById.mockReturnValue(null)
    const site = {
      id: 'new_site',
      structureType: global.STRUCTURE_EXTENSION,
      progress: 0,
      progressTotal: 100,
      pos: { x: 5, y: 5, getRangeTo: jest.fn().mockReturnValue(1) }
    }
    mockCache.getConstructionSites.mockReturnValue([site])

    const creep = {
      memory: { working: true, targetId: 'invalid_id' },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.OK),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: jest.fn().mockReturnValue(1) }
    }

    builder.run(creep)

    // delete はプロパティを消すのでtoBeUndefinedで確認
    expect(creep.memory.targetId).toBe('new_site')
    expect(creep.build).toHaveBeenCalledWith(site)
  })

  test('建設サイトの優先度が設定されていない場合はデフォルトの優先度10とする', () => {
    const unknownSite = {
      id: 'unknown',
      structureType: 'some_unknown_structure',
      progress: 0,
      progressTotal: 100,
      pos: { x: 5, y: 5, getRangeTo: jest.fn().mockReturnValue(1) }
    }
    mockCache.getConstructionSites.mockReturnValue([unknownSite])

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.OK),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: jest.fn().mockReturnValue(1) }
    }

    builder.run(creep)

    expect(creep.memory.targetId).toBe('unknown')
  })

  test('無効な建設サイトを検知してキャッシュを削除する', () => {
    const site = {
      id: 's3',
      structureType: global.STRUCTURE_EXTENSION,
      progress: 5,
      progressTotal: 10,
      pos: { x: 3, y: 3, getRangeTo: jest.fn().mockReturnValue(1) }
    }
    mockCache.getConstructionSites.mockReturnValue([site])
    global.Game.getObjectById.mockReturnValue(site)

    const creep = {
      memory: { working: true, targetId: 's3' },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.ERR_INVALID_TARGET),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: jest.fn().mockReturnValue(2) }
    }

    builder.run(creep)

    expect(creep.memory.targetId).toBeUndefined()
    expect(mockCache.invalidate).toHaveBeenCalledWith('construction_sites_W0N0')
  })

  test('距離比較で等しい距離の場合は既存のものを優先する', () => {
    const farDrop = {
      id: 'd2',
      resourceType: global.RESOURCE_ENERGY,
      amount: 80,
      pos: { x: 10, y: 10 }
    }
    const nearDrop = {
      id: 'd1',
      resourceType: global.RESOURCE_ENERGY,
      amount: 80,
      pos: { x: 5, y: 5 }
    }
    mockCache.getDroppedResources.mockReturnValue([nearDrop, farDrop]) // 近い方が先

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      pickup: jest.fn().mockReturnValue(global.OK),
      room: { name: 'W0N0' },
      pos: { getRangeTo: (r) => (r.id === 'd2' ? 5 : 5) } // 距離同じ
    }

    builder.run(creep)

    expect(creep.pickup).toHaveBeenCalledWith(nearDrop)
  })

  test('修復対象の距離が既存のものと同じ場合は既存のものを優先する', () => {
    const d1 = { id: 'd1', hits: 100, hitsMax: 500, structureType: global.STRUCTURE_ROAD }
    const d2 = { id: 'd2', hits: 100, hitsMax: 500, structureType: global.STRUCTURE_ROAD }
    mockCache.getConstructionSites.mockReturnValue([])
    mockCache.getStructures.mockReturnValue([d1, d2])

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn(),
      repair: jest.fn().mockReturnValue(global.OK),
      room: { name: 'W0N0' },
      pos: { getRangeTo: () => 5 } // 距離同じ
    }

    builder.run(creep)

    expect(creep.repair).toHaveBeenCalledWith(d1)
  })

  test('同じエネルギーの落下リソースがある場合、近い方を優先する', () => {
    const farDrop = {
      id: 'd2',
      resourceType: global.RESOURCE_ENERGY,
      amount: 80,
      pos: { x: 10, y: 10 }
    }
    const nearDrop = {
      id: 'd1',
      resourceType: global.RESOURCE_ENERGY,
      amount: 80,
      pos: { x: 5, y: 5 }
    }
    mockCache.getDroppedResources.mockReturnValue([farDrop, nearDrop])

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      pickup: jest.fn().mockReturnValue(global.OK),
      room: { name: 'W0N0' },
      pos: { getRangeTo: (r) => (r.id === 'd2' ? 10 : 5) }
    }

    builder.run(creep)

    expect(creep.pickup).toHaveBeenCalledWith(nearDrop)
  })

  test('十分な量の落下リソースがない場合はコンテナを検索する', () => {
    const smallDrop = { id: 'd1', resourceType: global.RESOURCE_ENERGY, amount: 40 }
    mockCache.getDroppedResources.mockReturnValue([smallDrop])

    const container = { store: { [global.RESOURCE_ENERGY]: 200 }, id: 'c1' }
    mockCache.getContainers.mockReturnValue([container])

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      pickup: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.OK),
      room: { name: 'W0N0' },
      pos: { getRangeTo: jest.fn().mockReturnValue(1) }
    }

    builder.run(creep)

    expect(creep.pickup).not.toHaveBeenCalled()
    expect(creep.withdraw).toHaveBeenCalledWith(container, global.RESOURCE_ENERGY)
  })

  test('エネルギー取得で落下リソースを拾う', () => {
    const drop = { id: 'd1', resourceType: global.RESOURCE_ENERGY, amount: 80 }
    mockCache.getDroppedResources.mockReturnValue([drop])
    pathfinder.closest.mockReturnValue(drop)

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      pickup: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { name: 'W0N0' }
    }

    builder.run(creep)

    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, drop, { range: 1 })
  })

  test('getBodyで最適なパーツを返す', () => {
    expect(builder.getBody(900)).toEqual([
      WORK,
      WORK,
      WORK,
      CARRY,
      CARRY,
      CARRY,
      MOVE,
      MOVE,
      MOVE,
      MOVE
    ])
    expect(builder.getBody(360)).toEqual([WORK, CARRY, CARRY, MOVE, MOVE])
  })

  test('getBodyで500エネルギーボディを返す', () => {
    expect(builder.getBody(500)).toEqual([WORK, WORK, CARRY, CARRY, MOVE, MOVE])
  })

  test('getBodyで350エネルギーボディを返す', () => {
    expect(builder.getBody(350)).toEqual([WORK, CARRY, CARRY, MOVE, MOVE])
  })

  test('getBodyで最小エネルギーボディを返す', () => {
    expect(builder.getBody(200)).toEqual([WORK, CARRY, MOVE])
  })

  test('エネルギーが0のときworkingを解除して採掘メッセージを表示する', () => {
    mockCache.getConstructionSites.mockReturnValue([])
    mockCache.getDroppedResources.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    mockCache.getStorage.mockReturnValue(null)
    mockCache.assignSource.mockReturnValue(null)

    const creep = {
      memory: { working: true, targetId: 'old' },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn(),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: jest.fn().mockReturnValue(1) },
      pickup: jest.fn(),
      withdraw: jest.fn(),
      harvest: jest.fn()
    }

    builder.run(creep)

    expect(creep.memory.working).toBe(false)
    expect(creep.memory.targetId).toBeUndefined()
    expect(creep.say).toHaveBeenCalledWith('🔄 採掘')
  })

  test('エネルギー満タンのときworkingを設定して建設メッセージを表示する', () => {
    const site = {
      id: 's4',
      structureType: global.STRUCTURE_ROAD,
      progress: 0,
      progressTotal: 100,
      pos: { x: 5, y: 5, getRangeTo: jest.fn().mockReturnValue(1) }
    }
    mockCache.getConstructionSites.mockReturnValue([site])

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: jest.fn().mockReturnValue(1) }
    }

    builder.run(creep)

    expect(creep.memory.working).toBe(true)
    expect(creep.say).toHaveBeenCalledWith('🔨 建設')
  })

  test('建設成功時にビジュアル表示される', () => {
    const site = {
      id: 's5',
      structureType: global.STRUCTURE_ROAD,
      progress: 50,
      progressTotal: 100,
      pos: { x: 5, y: 5, getRangeTo: jest.fn().mockReturnValue(1) }
    }
    mockCache.getConstructionSites.mockReturnValue([site])

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.OK),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: jest.fn().mockReturnValue(1) }
    }

    builder.run(creep)

    expect(creep.build).toHaveBeenCalledWith(site)
  })

  test('修復対象が範囲外の場合、移動する', () => {
    const damaged = {
      id: 'd3',
      hits: 100,
      hitsMax: 500,
      structureType: global.STRUCTURE_ROAD,
      pos: { x: 3, y: 3 }
    }
    mockCache.getConstructionSites.mockReturnValue([])
    mockCache.getStructures.mockReturnValue([damaged])

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn(),
      repair: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { name: 'W0N0' },
      pos: { getRangeTo: jest.fn().mockReturnValue(10) }
    }

    builder.run(creep)

    expect(creep.repair).toHaveBeenCalledWith(damaged)
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, damaged, { range: 3 })
    expect(creep.say).toHaveBeenCalledWith('🔧 修復')
  })

  test('修復バックアップで損傷構造物を修復する', () => {
    const damaged = {
      id: 'd2',
      hits: 100,
      hitsMax: 500,
      structureType: global.STRUCTURE_ROAD,
      pos: { x: 3, y: 3 }
    }
    mockCache.getConstructionSites.mockReturnValue([])
    mockCache.getStructures.mockReturnValue([damaged])
    const room = {
      find: jest.fn().mockReturnValue([damaged]),
      visual: { text: jest.fn() },
      name: 'W0N0',
      controller: {}
    }
    pathfinder.closest.mockReturnValue(damaged)

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn(),
      repair: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      upgradeController: jest.fn(),
      room,
      pos: { getRangeTo: jest.fn().mockReturnValue(1) }
    }

    builder.run(creep)

    expect(creep.repair).toHaveBeenCalledWith(damaged)
    expect(creep.say).toHaveBeenCalledWith('🔧 修復')
  })

  test('修復バックアップで壁や防壁は対象外とする', () => {
    const wall = {
      id: 'wall1',
      hits: 100,
      hitsMax: 500,
      structureType: global.STRUCTURE_WALL,
      pos: { x: 3, y: 3 }
    }
    const rampart = {
      id: 'rampart1',
      hits: 100,
      hitsMax: 500,
      structureType: global.STRUCTURE_RAMPART,
      pos: { x: 4, y: 4 }
    }
    const healthyRoad = {
      id: 'hroad',
      hits: 500,
      hitsMax: 500,
      structureType: global.STRUCTURE_ROAD,
      pos: { x: 5, y: 5 }
    }
    mockCache.getConstructionSites.mockReturnValue([])
    mockCache.getStructures.mockReturnValue([wall, rampart, healthyRoad])
    const room = {
      find: jest.fn().mockReturnValue([]),
      visual: { text: jest.fn() },
      name: 'W0N0',
      controller: { id: 'ctrl1' }
    }

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn(),
      repair: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room,
      pos: { getRangeTo: jest.fn().mockReturnValue(1) }
    }

    builder.run(creep)

    // 壁・防壁・健康な道は修復されないため、フォールバックのアップグレードが実行されるはず
    expect(creep.repair).not.toHaveBeenCalled()
    expect(creep.upgradeController).toHaveBeenCalled()
  })

  test('コントローラーが範囲外の場合、移動する', () => {
    mockCache.getConstructionSites.mockReturnValue([])
    mockCache.getStructures.mockReturnValue([])
    const room = {
      find: jest.fn().mockReturnValue([]),
      visual: { text: jest.fn() },
      name: 'W0N0',
      controller: { id: 'ctrl1' }
    }

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn(),
      repair: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room,
      pos: { getRangeTo: jest.fn().mockReturnValue(1) }
    }

    builder.run(creep)

    expect(creep.upgradeController).toHaveBeenCalledWith(room.controller)
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, room.controller, { range: 3 })
    expect(creep.say).toHaveBeenCalledWith('⬆️ 強化')
  })

  test('コントローラーがない場合は何もしない', () => {
    mockCache.getConstructionSites.mockReturnValue([])
    mockCache.getStructures.mockReturnValue([])
    const room = {
      find: jest.fn().mockReturnValue([]),
      visual: { text: jest.fn() },
      name: 'W0N0',
      controller: null
    }

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn(),
      repair: jest.fn(),
      upgradeController: jest.fn(),
      room,
      pos: { getRangeTo: jest.fn().mockReturnValue(1) }
    }

    builder.run(creep)

    expect(creep.upgradeController).not.toHaveBeenCalled()
    expect(creep.say).not.toHaveBeenCalledWith('⬆️ 強化')
  })

  test('修復対象も建設サイトもないときコントローラーをアップグレードする', () => {
    mockCache.getConstructionSites.mockReturnValue([])
    mockCache.getStructures.mockReturnValue([])
    const room = {
      find: jest.fn().mockReturnValue([]),
      visual: { text: jest.fn() },
      name: 'W0N0',
      controller: { id: 'ctrl1' }
    }

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn(),
      repair: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room,
      pos: { getRangeTo: jest.fn().mockReturnValue(1) }
    }

    builder.run(creep)

    expect(creep.upgradeController).toHaveBeenCalledWith(room.controller)
    expect(creep.say).toHaveBeenCalledWith('⬆️ 強化')
  })

  test('複数のコンテナがある場合、近い方を選ぶ', () => {
    mockCache.getDroppedResources.mockReturnValue([])
    const farContainer = {
      store: { [global.RESOURCE_ENERGY]: 200 },
      id: 'c2',
      pos: { x: 10, y: 10 }
    }
    const nearContainer = {
      store: { [global.RESOURCE_ENERGY]: 200 },
      id: 'c1',
      pos: { x: 5, y: 5 }
    }
    mockCache.getContainers.mockReturnValue([farContainer, nearContainer])

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.OK),
      room: { name: 'W0N0' },
      pos: { getRangeTo: (c) => (c.id === 'c2' ? 10 : 5) }
    }

    builder.run(creep)

    expect(creep.withdraw).toHaveBeenCalledWith(nearContainer, global.RESOURCE_ENERGY)
  })

  test('十分なエネルギーを持つコンテナがない場合はストレージを検索する', () => {
    mockCache.getDroppedResources.mockReturnValue([])
    const emptyContainer = { store: { [global.RESOURCE_ENERGY]: 50 }, id: 'c1' }
    mockCache.getContainers.mockReturnValue([emptyContainer])

    const storage = { store: { [global.RESOURCE_ENERGY]: 1000 }, id: 'st1' }
    mockCache.getStorage.mockReturnValue(storage)

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.OK),
      room: { name: 'W0N0' },
      pos: { getRangeTo: jest.fn().mockReturnValue(1) }
    }

    builder.run(creep)

    expect(creep.withdraw).toHaveBeenCalledWith(storage, global.RESOURCE_ENERGY)
  })

  test('コンテナからエネルギーを取得する', () => {
    mockCache.getDroppedResources.mockReturnValue([])
    const container = { store: { [global.RESOURCE_ENERGY]: 200 } }
    mockCache.getContainers.mockReturnValue([container])
    mockCache.getStorage.mockReturnValue(null)
    mockCache.assignSource.mockReturnValue(null)
    pathfinder.closest.mockReturnValue(container)

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      pickup: jest.fn(),
      harvest: jest.fn(),
      room: { name: 'W0N0' }
    }

    builder.run(creep)

    expect(creep.withdraw).toHaveBeenCalledWith(container, global.RESOURCE_ENERGY)
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, container, { range: 1 })
  })

  test('ストレージから取得する際、範囲外の場合は移動する', () => {
    mockCache.getDroppedResources.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    const storage = { store: { [global.RESOURCE_ENERGY]: 1000 }, id: 'st1' }
    mockCache.getStorage.mockReturnValue(storage)

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { name: 'W0N0' },
      pos: { getRangeTo: jest.fn().mockReturnValue(10) }
    }

    builder.run(creep)

    expect(creep.withdraw).toHaveBeenCalledWith(storage, global.RESOURCE_ENERGY)
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, storage, { range: 1 })
  })

  test('ストレージからエネルギーを取得する', () => {
    mockCache.getDroppedResources.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    const storage = { store: { [global.RESOURCE_ENERGY]: 1000 } }
    mockCache.getStorage.mockReturnValue(storage)
    mockCache.assignSource.mockReturnValue(null)

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      pickup: jest.fn(),
      harvest: jest.fn(),
      room: { name: 'W0N0' }
    }

    builder.run(creep)

    expect(creep.withdraw).toHaveBeenCalledWith(storage, global.RESOURCE_ENERGY)
  })

  test('ソースから直接採掘する', () => {
    mockCache.getDroppedResources.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    mockCache.getStorage.mockReturnValue(null)
    const source = { id: 'src1' }
    mockCache.assignSource.mockReturnValue(source)

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      harvest: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      withdraw: jest.fn(),
      pickup: jest.fn(),
      room: { name: 'W0N0' }
    }

    builder.run(creep)

    expect(creep.harvest).toHaveBeenCalledWith(source)
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, source, { range: 1 })
  })

  test('hasBuildSitesで建設サイトの有無を返す', () => {
    const room = { name: 'W0N0' }
    mockCache.getConstructionSites.mockReturnValue([{ id: 's1' }])
    expect(builder.hasBuildSites(room)).toBe(true)

    mockCache.getConstructionSites.mockReturnValue([])
    expect(builder.hasBuildSites(room)).toBe(false)
  })

  test('getTotalBuildProgressで残り建設量を集計する', () => {
    const room = { name: 'W0N0' }
    mockCache.getConstructionSites.mockReturnValue([
      { progress: 30, progressTotal: 100 },
      { progress: 50, progressTotal: 200 }
    ])

    expect(builder.getTotalBuildProgress(room)).toBe(220)
  })

  test('BUILD_PRIORITYでコンテナが最高優先度を持つ', () => {
    expect(builder.BUILD_PRIORITY[global.STRUCTURE_CONTAINER]).toBe(1)
    expect(builder.BUILD_PRIORITY[global.STRUCTURE_EXTENSION]).toBe(2)
    expect(builder.BUILD_PRIORITY[global.STRUCTURE_SPAWN]).toBe(3)
  })
  describe('ターゲットキャッシュの最適化 (Bolt Target Caching)', () => {
    test('有効なキャッシュターゲットをそのまま使用して withdraw を呼び出す', () => {
      const cachedContainer = {
        id: 'c_cached',
        structureType: global.STRUCTURE_CONTAINER,
        store: { [global.RESOURCE_ENERGY]: 300 }
      }
      global.Game.getObjectById.mockReturnValue(cachedContainer)

      const creep = {
        memory: { working: false, targetId: 'c_cached' },
        store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
        say: jest.fn(),
        withdraw: jest.fn().mockReturnValue(global.OK),
        room: { name: 'W0N0' }
      }

      builder.run(creep)

      expect(creep.withdraw).toHaveBeenCalledWith(cachedContainer, global.RESOURCE_ENERGY)
      expect(mockCache.getContainers).not.toHaveBeenCalled()
    })

    test('キャッシュターゲットが無効(エネルギー不足)な場合は削除して新規にターゲットを取得する', () => {
      const emptyContainer = {
        id: 'c_empty',
        structureType: global.STRUCTURE_CONTAINER,
        store: { [global.RESOURCE_ENERGY]: 0 }
      }
      const validContainer = {
        id: 'c_valid',
        structureType: global.STRUCTURE_CONTAINER,
        store: { [global.RESOURCE_ENERGY]: 200 }
      }
      global.Game.getObjectById.mockReturnValue(emptyContainer)
      mockCache.getDroppedResources.mockReturnValue([])
      mockCache.getContainers.mockReturnValue([validContainer])

      const creep = {
        memory: { working: false, targetId: 'c_empty' },
        store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
        say: jest.fn(),
        withdraw: jest.fn().mockReturnValue(global.OK),
        room: { name: 'W0N0' },
        pos: { getRangeTo: jest.fn().mockReturnValue(1) }
      }

      builder.run(creep)

      expect(creep.memory.targetId).toBe('c_valid')
      expect(creep.withdraw).toHaveBeenCalledWith(validContainer, global.RESOURCE_ENERGY)
    })

    test('採掘から建設状態遷移時にターゲットキャッシュが削除される', () => {
      const site = {
        id: 's_build',
        structureType: global.STRUCTURE_ROAD,
        progress: 0,
        progressTotal: 100,
        pos: { x: 5, y: 5, getRangeTo: jest.fn().mockReturnValue(1) }
      }
      mockCache.getConstructionSites.mockReturnValue([site])

      const creep = {
        memory: { working: false, targetId: 'c_old_energy' },
        store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
        say: jest.fn(),
        build: jest.fn().mockReturnValue(global.OK),
        room: { visual: { text: jest.fn() }, name: 'W0N0' },
        pos: { getRangeTo: jest.fn().mockReturnValue(1) }
      }

      builder.run(creep)

      expect(creep.memory.working).toBe(true)
      expect(creep.memory.targetId).toBe('s_build')
    })
  })
})
