/**
 * src/managers/roomManager.js のユニットテスト
 */

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
      global.Game.creeps = {
        creep1: { room: mockRoom, memory: { role: 'harvester' } },
        creep2: { room: mockRoom, memory: { role: 'harvester' } },
        creep3: { room: mockRoom, memory: { role: 'upgrader' } }
      }

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
      cache.getEnemies.mockReturnValue([hostile, hostile, hostile])
      cache.getLinks.mockReturnValue([])

      global.Game.time = 10
      roomManager.run(mockRoom)

      expect(mockRoom.controller.activateSafeMode).toHaveBeenCalled()
    })
  })

  describe('Security: Prototype Pollution & DoS Protection', () => {
    test('getStats should not crash when Object.prototype is polluted', () => {
      // Pollute Object.prototype
      Object.prototype.polluted = 'dangerous'

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
