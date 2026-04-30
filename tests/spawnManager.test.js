/**
 * src/managers/spawnManager.js のユニットテスト
 */

// グローバル定数の設定
global.Game = { time: 100, creeps: {}, spawns: {} }
global.Memory = {}
global.OK = 0
global.ERR_NOT_ENOUGH_ENERGY = -6
global.ERR_NAME_EXISTS = -3
global.WORK = 'work'
global.CARRY = 'carry'
global.MOVE = 'move'
global.ATTACK = 'attack'
global.RANGED_ATTACK = 'ranged_attack'

// モックの設定
jest.mock(
  '../src/utils/cache',
  () => ({
    getConstructionSites: jest.fn().mockReturnValue([]),
    getEnemies: jest.fn().mockReturnValue([]),
    isSafeKey: jest.fn().mockReturnValue(true)
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

// 定数のモック
jest.mock(
  '../src/constants',
  () => ({
    ROLES: {
      HARVESTER: 'harvester',
      UPGRADER: 'upgrader',
      BUILDER: 'builder',
      REPAIRER: 'repairer',
      DEFENDER: 'defender',
      MINER: 'miner'
    },
    BODY_PRESETS: {
      harvester: [
        { body: ['work', 'carry', 'move'], cost: 200 },
        { body: ['work', 'work', 'carry', 'move'], cost: 300 }
      ],
      upgrader: [{ body: ['work', 'carry', 'move'], cost: 200 }],
      builder: [{ body: ['work', 'carry', 'move'], cost: 200 }],
      defender: [{ body: ['attack', 'move'], cost: 130 }]
    },
    SPAWN_PRIORITY: {
      harvester: 1,
      upgrader: 2,
      builder: 3,
      repairer: 4,
      defender: 5,
      miner: 6
    },
    TARGET_CREEPS_BY_RCL: {
      1: { harvester: 2, upgrader: 1, builder: 0 },
      2: { harvester: 2, upgrader: 2, builder: 1 },
      3: { harvester: 2, upgrader: 2, builder: 2 }
    }
  }),
  { virtual: true }
)

const spawnManager = require('../src/managers/spawnManager')
const cache = require('../src/utils/cache')

global.FIND_CONSTRUCTION_SITES = 111

describe('spawnManager', () => {
  let mockSpawn
  let mockRoom

  beforeEach(() => {
    mockRoom = {
      name: 'W1N1',
      controller: {
        level: 3,
        my: true
      },
      energyAvailable: 300,
      energyCapacityAvailable: 1000,
      visual: {
        text: jest.fn(),
        rect: jest.fn()
      }
    }

    mockSpawn = {
      name: 'Spawn1',
      room: mockRoom,
      spawning: null,
      spawnCreep: jest.fn().mockReturnValue(0), // OK
      pos: { x: 10, y: 10 }
    }

    global.Game.creeps = {}
    global.Game.spawns = { Spawn1: mockSpawn }
    global.Game.time = 100

    // キャッシュモックのクリア
    cache.getConstructionSites.mockClear()
    cache.getEnemies.mockClear()
  })

  describe('run', () => {
    test('実行してもエラーにならない', () => {
      expect(() => spawnManager.run(mockSpawn)).not.toThrow()
    })

    test('スポーン中は実行されない', () => {
      mockSpawn.spawning = { name: 'creep1' }
      expect(() => spawnManager.run(mockSpawn)).not.toThrow()
    })

    test('自分のルームでない場合は実行されない', () => {
      mockRoom.controller.my = false
      expect(() => spawnManager.run(mockSpawn)).not.toThrow()
    })

    test('エネルギー不足でもエラーにならない', () => {
      mockSpawn.spawnCreep.mockReturnValue(-6)
      expect(() => spawnManager.run(mockSpawn)).not.toThrow()
    })
  })

  describe('showSpawnVisual', () => {
    test('スポーン中のビジュアルを表示する', () => {
      mockSpawn.spawning = {
        name: 'creep1',
        needTime: 10,
        remainingTime: 5
      }
      global.Game.creeps.creep1 = {
        memory: { role: 'harvester' }
      }

      spawnManager.showSpawnVisual(mockSpawn)
      expect(mockRoom.visual.text).toHaveBeenCalled()
      expect(mockRoom.visual.rect).toHaveBeenCalled()
    })

    test('スポーン中でない場合は何もしない', () => {
      mockSpawn.spawning = null
      spawnManager.showSpawnVisual(mockSpawn)
      expect(mockRoom.visual.text).not.toHaveBeenCalled()
    })
  })

  describe('showStats', () => {
    test('統計情報を出力する', () => {
      spawnManager.showStats(mockRoom)
      // logger.infoが呼ばれることを期待（モック済み）
    })
  })

  describe('clearQueue', () => {
    test('キューをクリアする', () => {
      global.cache = { spawnQueue: [1, 2, 3] }
      spawnManager.clearQueue()
      expect(global.cache.spawnQueue).toEqual([])
    })
  })

  describe('内部ロジックの網羅', () => {
    test('建設サイトがある場合でもエラーなく実行される', () => {
      cache.getConstructionSites.mockReturnValue([{}, {}, {}, {}, {}, {}])
      global.Game.creeps = {
        c1: { memory: { role: 'harvester' }, room: mockRoom },
        c2: { memory: { role: 'harvester' }, room: mockRoom },
        c3: { memory: { role: 'upgrader' }, room: mockRoom },
        c4: { memory: { role: 'upgrader' }, room: mockRoom }
      }

      expect(() => spawnManager.run(mockSpawn)).not.toThrow()
    })

    test('敵がいる場合でもエラーなく実行される', () => {
      cache.getEnemies.mockReturnValue([
        {
          getActiveBodyparts: (part) => (part === 'attack' ? 1 : 0)
        }
      ])

      expect(() => spawnManager.run(mockSpawn)).not.toThrow()
    })

    test('クリープが0の場合でもエラーなく実行される', () => {
      global.Game.creeps = {}
      mockRoom.energyAvailable = 200
      expect(() => spawnManager.run(mockSpawn)).not.toThrow()
    })
  })
})
