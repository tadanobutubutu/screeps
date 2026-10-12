global.FIND_MY_CREEPS = 102
/**
 * src/managers/roomManager.js のユニットテスト
 */
global.FIND_MY_STRUCTURES = 11
global.FIND_SOURCES = 222
global.FIND_STRUCTURES = 5
global.STRUCTURE_CONTAINER = 'container'
global.STRUCTURE_LINK = 'link'
global.RESOURCE_ENERGY = 'energy'

// グローバル設定
global.Game = { time: 100, creeps: {}, flags: {} }
global.Memory = { creeps: {} }
global.FIND_SOURCES = 5
global.FIND_STRUCTURES = 10
global.FIND_MY_STRUCTURES = 11
global.FIND_CONSTRUCTION_SITES = 14
global.FIND_HOSTILE_CREEPS = 6
global.FIND_MY_SPAWNS = 8
global.STRUCTURE_SPAWN = 'spawn'
global.STRUCTURE_EXTENSION = 'extension'
global.STRUCTURE_TOWER = 'tower'
global.STRUCTURE_CONTAINER = 'container'
global.STRUCTURE_LINK = 'link'
global.STRUCTURE_ROAD = 'road'
global.RESOURCE_ENERGY = 'energy'
global.CONTROLLER_STRUCTURES = {
  extension: { 1: 0, 2: 5, 3: 10, 4: 20, 5: 30, 6: 40, 7: 50, 8: 60 }
}
global.TERRAIN_MASK_WALL = 1
global.LOOK_STRUCTURES = 'structure'
global.LOOK_CONSTRUCTION_SITES = 'constructionSite'
global.LOOK_AT = 'lookAt'
global.OK = 0
global.ATTACK = 'attack'
global.RANGED_ATTACK = 'ranged_attack'
global.WORK = 'work'

jest.mock(
  '../src/utils/cache',
  () => ({
    getSources: jest.fn().mockReturnValue([]),
    getContainers: jest.fn().mockReturnValue([]),
    getSpawns: jest.fn().mockReturnValue([]),
    getMyCreeps: jest.fn().mockReturnValue([]),
    getStructures: jest.fn().mockReturnValue([]),
    getConstructionSites: jest.fn().mockReturnValue([]),
    getEnemies: jest.fn().mockReturnValue([]),
    getLinks: jest.fn().mockReturnValue([]),
    getStorage: jest.fn().mockReturnValue(null),
    getMyStructures: jest.fn().mockReturnValue([]),
    invalidate: jest.fn(),
    cleanup: jest.fn(),
    isSafeKey: jest.fn().mockImplementation((key) => {
      return (
        typeof key === 'string' && !['__proto__', 'constructor', 'prototype'].includes(key)
      )
    })
  }),
  { virtual: true }
)

jest.mock(
  '../src/utils/pathfinder',
  () => ({
    findNearestOpenTile: jest.fn(),
    findPath: jest.fn().mockReturnValue({ incomplete: true, path: [] }),
    closest: jest.fn()
  }),
  { virtual: true }
)

jest.mock(
  '../src/utils/logger',
  () => ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }),
  { virtual: true }
)

jest.mock(
  '../src/constants',
  () => ({
    ROLES: {
      HARVESTER: 'harvester',
      UPGRADER: 'upgrader',
      BUILDER: 'builder'
    },
    CACHE_TTL: {},
    MEMORY_CLEANUP_INTERVAL: 100,
    STATS_DISPLAY_INTERVAL: 100,
    SAFE_MODE_TRIGGER_HOSTILES: 3
  }),
  { virtual: true }
)

const cache = require('../src/utils/cache')
const pathfinder = require('../src/utils/pathfinder')
const roomManager = require('../src/managers/roomManager')

describe('roomManager', () => {
  beforeEach(() => {
    global.FIND_MY_STRUCTURES = 114
    global.STRUCTURE_CONTAINER = 'container'
    global.STRUCTURE_ROAD = 'road'
  })
  let mockRoom

  beforeEach(() => {
    jest.clearAllMocks()
    mockRoom = {
      name: 'W1N1',
      controller: {
        my: true,
        level: 3,
        progress: 1000,
        progressTotal: 10000,
        safeMode: null,
        safeModeAvailable: 1,
        activateSafeMode: jest.fn().mockReturnValue(OK),
        pos: { x: 25, y: 25, getRangeTo: jest.fn().mockReturnValue(10) }
      },
      energyAvailable: 300,
      energyCapacityAvailable: 300,
      storage: null,
      find: jest.fn().mockReturnValue([]),
      createConstructionSite: jest.fn().mockReturnValue(OK),
      getTerrain: jest.fn().mockReturnValue({
        get: jest.fn().mockReturnValue(0)
      }),
      lookAt: jest.fn().mockReturnValue([]),
      lookForAt: jest.fn().mockReturnValue([]),
      visual: {
        text: jest.fn()
      }
    }

    global.Game.time = 100
    global.Game.creeps = {}
    global.Game.flags = {}
    global.Memory.creeps = {}

    cache.getSources.mockReturnValue([])
    cache.getContainers.mockReturnValue([])
    cache.getSpawns.mockReturnValue([])
    cache.getConstructionSites.mockReturnValue([])
    cache.getEnemies.mockReturnValue([])
    cache.getLinks.mockReturnValue([])
    cache.getStorage.mockReturnValue(null)
    cache.getMyStructures.mockReturnValue([])
    pathfinder.findPath.mockReturnValue({ incomplete: true, path: [] })
  })

  describe('run', () => {
    test('自分のルームで実行される', () => {
      expect(() => roomManager.run(mockRoom)).not.toThrow()
    })

    test('コントローラーがないルームはスキップされる', () => {
      const room = { ...mockRoom, controller: null }
      expect(() => roomManager.run(room)).not.toThrow()
    })

    test('自分のルームでない場合はスキップされる', () => {
      const room = { ...mockRoom, controller: { my: false } }
      expect(() => roomManager.run(room)).not.toThrow()
    })
  })

  describe('getStats', () => {
    test('ルーム統計を返す', () => {
      global.Game.creeps = {
        creep1: {
          room: mockRoom,
          memory: { role: 'harvester' }
        }
      }

      const stats = roomManager.getStats(mockRoom)

      expect(stats).toBeDefined()
      expect(stats.name).toBe('W1N1')
      expect(stats.rcl).toBe(3)
      expect(stats.energy).toBe(300)
      expect(stats.energyCapacity).toBe(300)
    })

    test('プロパティが欠落しているエッジケースを処理する（コントローラーなし等）', () => {
      const roomWithoutController = {
        name: 'W1N2',
        energyAvailable: 0,
        energyCapacityAvailable: 0,
        find: jest.fn().mockReturnValue([])
      }

      const stats = roomManager.getStats(roomWithoutController)

      expect(stats).toBeDefined()
      expect(stats.name).toBe('W1N2')
      expect(stats.rcl).toBe(0)
      expect(stats.controllerProgress).toBe(0)
      expect(stats.safeMode).toBe(false)
      expect(stats.storageEnergy).toBe(0)
    })

    test('クリープ数をロール別にカウントする', () => {
      const creeps = [
        { room: mockRoom, memory: { role: 'harvester' } },
        { room: mockRoom, memory: { role: 'harvester' } },
        { room: mockRoom, memory: { role: 'upgrader' } }
      ]
      cache.getMyCreeps.mockReturnValue(creeps)

      const stats = roomManager.getStats(mockRoom)

      expect(stats.creepCounts.harvester).toBe(2)
      expect(stats.creepCounts.upgrader).toBe(1)
    })
  })

  describe('showStats', () => {
    test('統計をコンソールに表示する', () => {
      expect(() => roomManager.showStats(mockRoom)).not.toThrow()
    })
  })

  describe('showVisuals', () => {
    test('ビジュアル表示が実行される', () => {
      expect(() => roomManager.showVisuals(mockRoom)).not.toThrow()
      expect(mockRoom.visual.text).toHaveBeenCalled()
    })
  })

  describe('_getNeededExtensionCount', () => {
    beforeEach(() => {
      mockRoom.controller.level = 2 // Default mock RCL
      global.CONTROLLER_STRUCTURES = {
        extension: { 1: 0, 2: 5, 3: 10, 4: 20, 5: 30, 6: 40, 7: 50, 8: 60 }
      }
      global.STRUCTURE_EXTENSION = 'extension'
    })

    test('returns 0 if maxExtensions for current RCL is 0', () => {
      mockRoom.controller.level = 1
      const count = roomManager._getNeededExtensionCount(mockRoom)
      expect(count).toBe(0)
    })

    test('returns remaining needed extensions (capped at 5) if there are none', () => {
      cache.getMyStructures.mockReturnValue([])
      cache.getConstructionSites.mockReturnValue([])
      // At RCL2, max Extensions is 5. So it needs 5.
      const count = roomManager._getNeededExtensionCount(mockRoom)
      expect(count).toBe(5)
    })

    test('returns 0 if existing + sites >= maxExtensions', () => {
      // max Extensions is 5 at RCL2
      cache.getMyStructures.mockReturnValue([{}, {}, {}]) // 3 existing
      cache.getConstructionSites.mockReturnValue([
        { structureType: 'extension' },
        { structureType: 'extension' }
      ]) // 2 sites

      const count = roomManager._getNeededExtensionCount(mockRoom)
      expect(count).toBe(0)
    })

    test('returns correct count when existing + sites < maxExtensions', () => {
      mockRoom.controller.level = 3 // max is 10
      cache.getMyStructures.mockReturnValue([{}, {}]) // 2 existing
      cache.getConstructionSites.mockReturnValue([
        { structureType: 'extension' },
        { structureType: 'container' } // ignore non-extension sites
      ]) // 1 valid site
      // total = 3. needed = 10 - 3 = 7. Capped at 5 -> 5
      const count = roomManager._getNeededExtensionCount(mockRoom)
      expect(count).toBe(5)
    })

    test('returns exact remaining if needed is less than 5', () => {
      mockRoom.controller.level = 3 // max is 10
      cache.getMyStructures.mockReturnValue([{}, {}, {}, {}, {}, {}, {}]) // 7 existing
      cache.getConstructionSites.mockReturnValue([{ structureType: 'extension' }]) // 1 site
      // total = 8. needed = 10 - 8 = 2. Capped at 5 -> 2
      const count = roomManager._getNeededExtensionCount(mockRoom)
      expect(count).toBe(2)
    })

    test('handles missing CONTROLLER_STRUCTURES data gracefully', () => {
      mockRoom.controller.level = 99 // non-existent RCL
      const count = roomManager._getNeededExtensionCount(mockRoom)
      expect(count).toBe(0)
    })
  })

  describe('_planSourceContainers', () => {
    beforeEach(() => {
      global.Game.time = 500
      mockRoom.controller.level = 2 // _planConstruction is called when level >= 2
    })

    test('コンテナが既にある場合はスキップする', () => {
      const source = {
        id: 'src1',
        pos: { x: 10, y: 10, getRangeTo: jest.fn().mockReturnValue(2) }
      }
      const container = { id: 'cont1', pos: { x: 12, y: 10 } }

      cache.getSources.mockReturnValue([source])
      cache.getContainers.mockReturnValue([container])

      roomManager.run(mockRoom)

      expect(source.pos.getRangeTo).toHaveBeenCalledWith(container)
      expect(mockRoom.createConstructionSite).not.toHaveBeenCalled()
    })

    test('コンテナの建設サイトが既にある場合はスキップする', () => {
      const source = {
        id: 'src1',
        pos: { x: 10, y: 10, getRangeTo: jest.fn().mockReturnValue(2) }
      }
      const constructionSite = {
        structureType: global.STRUCTURE_CONTAINER,
        pos: { x: 12, y: 10 }
      }

      cache.getSources.mockReturnValue([source])
      cache.getContainers.mockReturnValue([])

      cache.getConstructionSites.mockReturnValue([constructionSite])

      roomManager.run(mockRoom)

      expect(source.pos.getRangeTo).toHaveBeenCalledWith(constructionSite)
      expect(mockRoom.createConstructionSite).not.toHaveBeenCalled()
    })

    test('配置可能なタイルがない場合はスキップする', () => {
      const source = {
        id: 'src1',
        pos: { x: 10, y: 10, getRangeTo: jest.fn().mockReturnValue(3) }
      }

      cache.getSources.mockReturnValue([source])
      cache.getContainers.mockReturnValue([])
      mockRoom.find.mockReturnValue([])

      pathfinder.findNearestOpenTile.mockReturnValue(null)

      roomManager.run(mockRoom)

      expect(mockRoom.createConstructionSite).not.toHaveBeenCalled()
    })
  })

  describe('planning, links and safety', () => {
    test('建設計画でコンテナや道路を配置しキャッシュを無効化する', () => {
      global.Game.time = 500
      const source = {
        id: 'src1',
        pos: { x: 10, y: 10, getRangeTo: jest.fn().mockReturnValue(1) }
      }
      cache.getSources.mockReturnValue([source])
      cache.getContainers.mockReturnValue([])
      cache.getStructures.mockReturnValue([])
      cache.getConstructionSites.mockReturnValue([])
      cache.getSpawns.mockReturnValue([
        { pos: { x: 5, y: 5, getRangeTo: jest.fn().mockReturnValue(1) } }
      ])
      pathfinder.findNearestOpenTile.mockReturnValue({ x: 11, y: 10 })
      pathfinder.findPath.mockReturnValue({
        incomplete: false,
        path: [
          { x: 6, y: 5 },
          { x: 7, y: 5 }
        ]
      })

      mockRoom.lookAtArea = jest.fn().mockReturnValue([])
      mockRoom.getTerrain = jest.fn().mockReturnValue({ get: () => 0 })

      roomManager.run(mockRoom)

      expect(mockRoom.createConstructionSite).toHaveBeenCalledWith(
        11,
        10,
        global.STRUCTURE_CONTAINER
      )
      expect(mockRoom.createConstructionSite).toHaveBeenCalledWith(
        6,
        5,
        global.STRUCTURE_ROAD
      )
      expect(cache.invalidate).toHaveBeenCalledWith(`construction_sites_${mockRoom.name}`)
    })

    test('リンク転送が行われる', () => {
      global.Game.time = 1
      const sink = {
        pos: { x: 3, y: 3, getRangeTo: jest.fn().mockReturnValue(3) },
        store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(800) },
        cooldown: 0
      }
      const sourceLink = {
        pos: { x: 2, y: 2, getRangeTo: jest.fn().mockReturnValue(4) },
        store: {
          [global.RESOURCE_ENERGY]: 800,
          getCapacity: jest.fn().mockReturnValue(800)
        },
        cooldown: 0,
        transferEnergy: jest.fn().mockReturnValue(global.OK)
      }

      cache.getLinks.mockReturnValue([sourceLink, sink])
      cache.getSpawns.mockReturnValue([
        { pos: { getRangeTo: jest.fn().mockReturnValue(2) } }
      ])
      cache.getEnemies.mockReturnValue([])
      pathfinder.closest.mockReturnValue(sink)

      roomManager.run(mockRoom)

      expect(sourceLink.transferEnergy).toHaveBeenCalledWith(sink)
    })

    test('危険な敵がいるときセーフモードを発動する', () => {
      const hostile = {
        getActiveBodyparts: jest.fn().mockReturnValue(1),
        pos: { x: 20, y: 20 },
        hits: 50,
        hitsMax: 100
      }
      const defender = {
        getActiveBodyparts: jest.fn().mockReturnValue(1)
      }
      cache.getEnemies.mockReturnValue([hostile, hostile, hostile])
      cache.getMyCreeps.mockReturnValue([defender])
      cache.getLinks.mockReturnValue([])

      global.Game.time = 10
      roomManager.run(mockRoom)

      expect(mockRoom.controller.activateSafeMode).toHaveBeenCalled()
    })
  })

  describe('_planRoads', () => {
    beforeEach(() => {
      global.Game.time = 50 // trigger _planConstruction
      mockRoom.controller.level = 1 // triggers _planSourceContainers and _planRoads
      mockRoom.lookAtArea = jest.fn().mockReturnValue([])
      mockRoom.getTerrain = jest.fn().mockReturnValue({ get: () => 0 })
      cache.getContainers.mockReturnValue([])
      cache.getStructures.mockReturnValue([])
      cache.getConstructionSites.mockReturnValue([])
      pathfinder.findNearestOpenTile.mockReturnValue(null) // prevent _planSourceContainers from creating sites for isolation
    })

    test('does nothing if there are no spawns', () => {
      cache.getSpawns.mockReturnValue([])
      roomManager.run(mockRoom)
      expect(mockRoom.createConstructionSite).not.toHaveBeenCalled()
    })

    test('skips if path to target is incomplete', () => {
      const spawn = { pos: { x: 5, y: 5 } }
      const source = { id: 'src1', pos: { x: 10, y: 10 } }
      cache.getSpawns.mockReturnValue([spawn])
      cache.getSources.mockReturnValue([source])
      pathfinder.findPath.mockReturnValue({ incomplete: true })

      roomManager.run(mockRoom)

      expect(mockRoom.createConstructionSite).not.toHaveBeenCalled()
    })

    test('does not place construction site if tile is already occupied', () => {
      const spawn = { pos: { x: 5, y: 5 } }
      const source = { id: 'src1', pos: { x: 10, y: 10 } }
      cache.getSpawns.mockReturnValue([spawn])
      cache.getSources.mockReturnValue([source])

      const existingStructure = { pos: { x: 6, y: 5 } }
      cache.getStructures.mockReturnValue([existingStructure])

      pathfinder.findPath.mockReturnValue({
        incomplete: false,
        path: [{ x: 6, y: 5 }]
      })

      roomManager.run(mockRoom)

      expect(mockRoom.createConstructionSite).not.toHaveBeenCalled()
    })

    test('places construction sites up to MAX_ROADS_PER_CYCLE (5)', () => {
      const spawn = { pos: { x: 5, y: 5 } }
      const source = { id: 'src1', pos: { x: 20, y: 5 } }
      cache.getSpawns.mockReturnValue([spawn])
      cache.getSources.mockReturnValue([source])
      cache.getStructures.mockReturnValue([])

      const longPath = []
      for (let i = 1; i <= 10; i++) {
        longPath.push({ x: 5 + i, y: 5 })
      }

      pathfinder.findPath.mockReturnValue({
        incomplete: false,
        path: longPath
      })

      roomManager.run(mockRoom)

      expect(mockRoom.createConstructionSite).toHaveBeenCalledTimes(10) // 5 for source, 5 for controller
      expect(cache.invalidate).toHaveBeenCalledWith(`construction_sites_${mockRoom.name}`)
    })
  })

  describe('Security: Prototype Pollution & DoS Protection', () => {
    test('getStats should not crash when Object.prototype is polluted', () => {
      // Pollute Object.prototype
      Object.prototype.polluted = 'dangerous'
      cache.getMyCreeps.mockReturnValue([])

      try {
        const stats = roomManager.getStats(mockRoom)
        // Should not have 'polluted' as an own property
        expect(Object.prototype.hasOwnProperty.call(stats.creepCounts, 'polluted')).toBe(
          false
        )
      } finally {
        // Clean up pollution
        delete Object.prototype.polluted
      }
    })

    test('run should not crash when Object.prototype is polluted', () => {
      // Pollute Object.prototype
      Object.prototype.polluted = 'dangerous'

      try {
        global.Game.time = 100 // Trigger _cleanupRoomMemory
        expect(() => roomManager.run(mockRoom)).not.toThrow()
      } finally {
        // Clean up pollution
        delete Object.prototype.polluted
      }
    })

    test('getStats should handle corrupted/missing creep.room gracefully', () => {
      cache.getMyCreeps.mockReturnValue([])
      global.Game.creeps = {
        corruptedCreep: {
          memory: { role: 'harvester' }
          // room is missing
        }
      }

      expect(() => roomManager.getStats(mockRoom)).not.toThrow()
      const stats = roomManager.getStats(mockRoom)
      expect(stats.creepCounts.harvester).toBeUndefined()
    })
  })
})
