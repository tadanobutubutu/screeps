/**
 * src/managers/towerManager.js のユニットテスト
 */

'use strict'

// Setup Screeps constants and globals
global.Game = { time: 100 }
global.Memory = {}
global.OK = 0
global.ERR_NOT_IN_RANGE = -9
global.STRUCTURE_TOWER = 'tower'
global.STRUCTURE_RAMPART = 'rampart'
global.STRUCTURE_ROAD = 'road'
global.STRUCTURE_WALL = 'constructedWall'
global.RESOURCE_ENERGY = 'energy'
global.CLAIM = 'claim'
global.ATTACK = 'attack'
global.RANGED_ATTACK = 'ranged_attack'
global.HEAL = 'heal'

jest.mock(
  '../src/utils/cache',
  () => ({
    getMyStructures: jest.fn(),
    getEnemies: jest.fn(),
    getMyCreeps: jest.fn(),
    getStructures: jest.fn(),
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

const cache = require('../src/utils/cache')
const towerManager = require('../src/managers/towerManager')

describe('towerManager', () => {
  let mockRoom
  let mockTower

  beforeEach(() => {
    jest.clearAllMocks()
    global.Game.time = 100

    mockTower = {
      structureType: global.STRUCTURE_TOWER,
      pos: {
        getRangeTo: jest.fn().mockReturnValue(5)
      },
      store: {
        energy: 100,
        [global.RESOURCE_ENERGY]: 100,
        getCapacity: jest.fn().mockReturnValue(1000),
        getFreeCapacity: jest.fn().mockReturnValue(900)
      },
      attack: jest.fn().mockReturnValue(global.OK),
      heal: jest.fn().mockReturnValue(global.OK),
      repair: jest.fn().mockReturnValue(global.OK),
      room: {
        visual: {
          line: jest.fn(),
          circle: jest.fn(),
          text: jest.fn()
        }
      }
    }

    mockRoom = {
      name: 'W1N1',
      controller: {
        level: 3
      },
      visual: {
        text: jest.fn(),
        line: jest.fn(),
        circle: jest.fn()
      }
    }

    mockTower.room = mockRoom

    cache.getMyStructures.mockReturnValue([mockTower])
    cache.getEnemies.mockReturnValue([])
    cache.getMyCreeps.mockReturnValue([])
    cache.getStructures.mockReturnValue([])
  })

  describe('run', () => {
    test('タワーがない場合は何もしない', () => {
      cache.getMyStructures.mockReturnValue([])
      expect(() => towerManager.run(mockRoom)).not.toThrow()
    })

    test('エネルギーが10未満のタワーはスキップされる', () => {
      mockTower.store[global.RESOURCE_ENERGY] = 5
      towerManager.run(mockRoom)
      expect(mockTower.attack).not.toHaveBeenCalled()
      expect(mockTower.heal).not.toHaveBeenCalled()
      expect(mockTower.repair).not.toHaveBeenCalled()
    })

    test('敵がいる場合は攻撃する', () => {
      const mockEnemy = {
        id: 'enemy1',
        hits: 100,
        hitsMax: 100,
        pos: { x: 10, y: 10 },
        getActiveBodyparts: jest.fn().mockReturnValue(0)
      }
      cache.getEnemies.mockReturnValue([mockEnemy])

      towerManager.run(mockRoom)

      expect(mockTower.attack).toHaveBeenCalledWith(mockEnemy)
    })

    test('負傷した味方がいる場合はヒールする', () => {
      const mockCreep = {
        hits: 50,
        hitsMax: 100,
        pos: { x: 12, y: 12 }
      }
      cache.getMyCreeps.mockReturnValue([mockCreep])

      towerManager.run(mockRoom)

      expect(mockTower.heal).toHaveBeenCalledWith(mockCreep)
    })

    test('損傷した建造物がある場合はリペアする', () => {
      const mockRoad = {
        structureType: global.STRUCTURE_ROAD,
        hits: 1000,
        hitsMax: 5000,
        pos: { x: 14, y: 14 }
      }
      cache.getStructures.mockReturnValue([mockRoad])

      // タワーのエネルギーが修復閾値(50%より上、ここでは90%にする)を超えている
      mockTower.store[global.RESOURCE_ENERGY] = 900

      towerManager.run(mockRoom)

      expect(mockTower.repair).toHaveBeenCalledWith(mockRoad)
    })
  })

  describe('getTowersNeedingEnergy', () => {
    test('エネルギー補充が必要なタワーを抽出する', () => {
      mockTower.store[global.RESOURCE_ENERGY] = 100 // 10%
      const needing = towerManager.getTowersNeedingEnergy(mockRoom)
      expect(needing).toContain(mockTower)
    })

    test('エネルギー十分なタワーは抽出されない', () => {
      mockTower.store[global.RESOURCE_ENERGY] = 900 // 90%
      const needing = towerManager.getTowersNeedingEnergy(mockRoom)
      expect(needing).not.toContain(mockTower)
    })
  })

  describe('getStats', () => {
    test('タワーの統計情報を返す', () => {
      const stats = towerManager.getStats(mockRoom)
      expect(stats.total).toBe(1)
      expect(stats.active).toBe(1)
    })
  })

  describe('showDashboard', () => {
    test('ダッシュボードビジュアルを描画する', () => {
      towerManager.showDashboard(mockRoom)
      expect(mockRoom.visual.text).toHaveBeenCalled()
    })
  })

  describe('performance optimization', () => {
    test('複数タワーで修復ターゲットを同一ティックに検索する際、O(1)キャッシュが機能し冗長な探索を避ける', () => {
      global.Game.time = 105 // Use a clean tick to avoid cache hits from previous tests
      const mockRoad = {
        structureType: global.STRUCTURE_ROAD,
        hits: 1000,
        hitsMax: 5000,
        pos: { x: 14, y: 14 }
      }
      cache.getStructures.mockReturnValue([mockRoad])

      const tower2 = {
        structureType: global.STRUCTURE_TOWER,
        pos: { getRangeTo: () => 6 },
        store: {
          [global.RESOURCE_ENERGY]: 900,
          getCapacity: () => 1000
        },
        attack: jest.fn(),
        heal: jest.fn(),
        repair: jest.fn(),
        room: mockRoom
      }

      mockTower.store[global.RESOURCE_ENERGY] = 900
      cache.getMyStructures.mockReturnValue([mockTower, tower2])

      // Run first time (same tick)
      towerManager.run(mockRoom)

      // getStructures should be called to find damaged structures
      expect(cache.getStructures).toHaveBeenCalledTimes(1)
      expect(mockTower.repair).toHaveBeenCalledWith(mockRoad)
      expect(tower2.repair).toHaveBeenCalledWith(mockRoad)

      // Run on a new tick, should trigger another search
      global.Game.time = 101
      towerManager.run(mockRoom)
      expect(cache.getStructures).toHaveBeenCalledTimes(2)
    })
  })
})
