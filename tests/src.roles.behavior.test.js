global.FIND_SOURCES = 105
/**
 * src/roles/*.js のユニットテスト
 */

global.Game = { time: 1, creeps: {}, rooms: {}, getObjectById: jest.fn() }
global.Memory = { creeps: {} }
global.RESOURCE_ENERGY = 'energy'
global.OK = 0
global.ERR_NOT_IN_RANGE = -9
global.ERR_INVALID_TARGET = -7
global.ERR_FULL = -8
global.ERR_NOT_ENOUGH_ENERGY = -6
global.FIND_STRUCTURES = 1
global.FIND_MY_STRUCTURES = 2
global.FIND_CONSTRUCTION_SITES = 3
global.FIND_MY_CONSTRUCTION_SITES = 4
global.FIND_CREEPS = 5
global.STRUCTURE_CONTAINER = 'container'
global.STRUCTURE_EXTENSION = 'extension'
global.STRUCTURE_SPAWN = 'spawn'
global.STRUCTURE_TOWER = 'tower'
global.STRUCTURE_STORAGE = 'storage'
global.STRUCTURE_LINK = 'link'
global.STRUCTURE_ROAD = 'road'
global.STRUCTURE_RAMPART = 'rampart'
global.STRUCTURE_WALL = 'wall'
global.TERRAIN_MASK_WALL = 1
global.WORK = 'work'
global.CARRY = 'carry'
global.MOVE = 'move'
global.ATTACK = 'attack'
global.RANGED_ATTACK = 'ranged_attack'
global.HEAL = 'heal'
global.CLAIM = 'claim'
global.TOUGH = 'tough'

global.RoomPosition = function (x, y, roomName) {
  this.x = x
  this.y = y
  this.roomName = roomName
  this.getRangeTo = () => 0
}

jest.mock(
  '../src/utils/cache',
  () => ({
    getConstructionSites: jest.fn().mockReturnValue([]),
    getDroppedResources: jest.fn().mockReturnValue([]),
    getContainers: jest.fn().mockReturnValue([]),
    getStorage: jest.fn().mockReturnValue(null),
    getSources: jest.fn().mockReturnValue([]),
    getSpawns: jest.fn().mockReturnValue([]),
    getEnemies: jest.fn().mockReturnValue([]),
    getLinks: jest.fn().mockReturnValue([]),
    getMyStructures: jest.fn().mockReturnValue([]),
    assignSource: jest.fn().mockReturnValue(null),
    invalidate: jest.fn()
  }),
  { virtual: true }
)

jest.mock(
  '../src/utils/pathfinder',
  () => ({
    moveTo: jest.fn(),
    closest: jest.fn((_, list) => (list && list.length > 0 ? list[0] : null))
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
const pathfinder = require('../src/utils/pathfinder')
const { MEMORY_KEYS } = require('../src/constants')
const builder = require('../src/roles/builder')
const defender = require('../src/roles/defender')
const harvester = require('../src/roles/harvester')
const miner = require('../src/roles/miner')
const repairer = require('../src/roles/repairer')
const upgrader = require('../src/roles/upgrader')

describe('src roles behaviors', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.Game.time = 1
    global.Game.creeps = {}
    global.Game.rooms = {}
    global.Game.getObjectById = jest.fn()
    global.Memory = { creeps: {} }
  })

  describe('builder', () => {
    test('建設ターゲットを選択してbuildする', () => {
      const siteA = {
        id: 'ext',
        structureType: STRUCTURE_EXTENSION,
        pos: { x: 10, y: 10, getRangeTo: jest.fn().mockReturnValue(2) },
        progress: 10,
        progressTotal: 20
      }
      const siteB = {
        id: 'road',
        structureType: STRUCTURE_ROAD,
        pos: { x: 11, y: 11, getRangeTo: jest.fn().mockReturnValue(3) },
        progress: 5,
        progressTotal: 10
      }
      cache.getConstructionSites.mockReturnValue([siteA, siteB])

      const creep = {
        memory: { [MEMORY_KEYS.WORKING]: true },
        store: { [RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(100) },
        say: jest.fn(),
        build: jest.fn().mockReturnValue(OK),
        upgradeController: jest.fn(),
        repair: jest.fn(),
        room: {
          name: 'W0N0',
          visual: { text: jest.fn() },
          find: jest.fn().mockReturnValue([]),
          controller: { pos: { x: 1, y: 1 } }
        },
        pos: { getRangeTo: jest.fn().mockReturnValue(1) }
      }

      builder.run(creep)

      expect(creep.build).toHaveBeenCalledWith(siteA)
      expect(creep.memory[MEMORY_KEYS.TARGET_ID]).toBe('ext')
    })

    test('エネルギー取得で落下リソースを拾う', () => {
      const drop = { id: 'r1', resourceType: RESOURCE_ENERGY, amount: 100 }
      cache.getDroppedResources.mockReturnValue([drop])

      const creep = {
        memory: { [MEMORY_KEYS.WORKING]: false },
        store: { [RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
        say: jest.fn(),
        pickup: jest.fn(),
        room: { name: 'W0N0' },
        pos: {}
      }

      builder.run(creep)

      expect(creep.pickup).toHaveBeenCalledWith(drop)
    })
  })

  describe('defender', () => {
    test('敵がいるとき遠距離攻撃を実行する', () => {
      const enemy = {
        hits: 50,
        hitsMax: 100,
        getActiveBodyparts: jest.fn().mockReturnValue(0),
        pos: { x: 3, y: 3 }
      }
      cache.getEnemies.mockReturnValue([enemy])

      const creep = {
        name: 'def1',
        getActiveBodyparts: jest.fn((part) => (part === RANGED_ATTACK ? 1 : 0)),
        rangedAttack: jest.fn(),
        attack: jest.fn(),
        heal: jest.fn(),
        room: { visual: { line: jest.fn() } },
        pos: { getRangeTo: jest.fn().mockReturnValue(2) },
        memory: {}
      }

      defender.run(creep)

      expect(creep.rangedAttack).toHaveBeenCalledWith(enemy)
    })

    test('敵数が多いとセーフモード判定がtrueになる', () => {
      const room = {
        name: 'W0N0',
        controller: {
          my: true,
          safeMode: null,
          safeModeAvailable: 1
        }
      }
      const hostile = {
        hits: 100,
        hitsMax: 100,
        getActiveBodyparts: jest.fn().mockReturnValue(1)
      }
      cache.getEnemies.mockReturnValue([hostile, hostile, hostile])
      Game.creeps = {}

      expect(defender.shouldActivateSafeMode(room)).toBe(true)
    })
  })

  describe('harvester', () => {
    test('納品先がある場合にtransferする', () => {
      const target = {
        structureType: STRUCTURE_SPAWN,
        store: { getFreeCapacity: jest.fn().mockReturnValue(50) }
      }
      const creep = {
        memory: { [MEMORY_KEYS.WORKING]: true },
        store: { [RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
        say: jest.fn(),
        transfer: jest.fn().mockReturnValue(OK),
        room: { find: jest.fn().mockReturnValue([target]), controller: {} },
        pos: {}
      }

      harvester.run(creep)

      expect(creep.transfer).toHaveBeenCalledWith(target, RESOURCE_ENERGY)
    })

    test('ボディ構成が閾値に応じて変化する', () => {
      expect(harvester.getBody(800)).toEqual([
        WORK,
        WORK,
        WORK,
        CARRY,
        CARRY,
        MOVE,
        MOVE,
        MOVE
      ])
      expect(harvester.getBody(350)).toEqual([WORK, WORK, CARRY, MOVE])
    })
  })

  describe('miner', () => {
    test('コンテナがある場合は移動して採掘する', () => {
      const room = {
        name: 'W0N0',
        find: jest.fn().mockReturnValue([
          {
            structureType: STRUCTURE_CONTAINER,
            pos: { x: 11, y: 10 },
            hits: 1000,
            hitsMax: 2000
          }
        ]),
        getTerrain: jest.fn().mockReturnValue({ get: jest.fn().mockReturnValue(0) })
      }
      const source = { id: 'src1', room, pos: { x: 10, y: 10 } }
      cache.getSources.mockReturnValue([source])

      const creep = {
        name: 'miner1',
        memory: {},
        room,
        pos: { isEqualTo: jest.fn().mockReturnValue(false) },
        harvest: jest.fn().mockReturnValue(ERR_NOT_IN_RANGE),
        repair: jest.fn(),
        say: jest.fn(),
        store: { getFreeCapacity: jest.fn().mockReturnValue(100), [RESOURCE_ENERGY]: 0 },
        drop: jest.fn()
      }

      miner.run(creep)

      expect(pathfinder.moveTo).toHaveBeenCalled()
    })

    test('コンテナなしで満杯時にドロップする', () => {
      const room = {
        name: 'W0N0',
        find: jest.fn().mockReturnValue([]),
        getTerrain: jest.fn().mockReturnValue({ get: jest.fn().mockReturnValue(0) })
      }
      const source = { id: 'src2', room, pos: { x: 5, y: 5 }, ticksToRegeneration: 5 }
      cache.getSources.mockReturnValue([source])

      const creep = {
        name: 'miner2',
        memory: {},
        room,
        pos: { isEqualTo: jest.fn().mockReturnValue(true) },
        harvest: jest.fn().mockReturnValue(OK),
        say: jest.fn(),
        store: { getFreeCapacity: jest.fn().mockReturnValue(0), [RESOURCE_ENERGY]: 50 },
        drop: jest.fn()
      }

      miner.run(creep)

      expect(creep.drop).toHaveBeenCalledWith(RESOURCE_ENERGY)
    })
  })

  describe('repairer', () => {
    test('損傷構造物を修復する', () => {
      const target = {
        id: 't1',
        structureType: STRUCTURE_ROAD,
        hits: 100,
        hitsMax: 1000,
        pos: { x: 3, y: 3 }
      }
      const room = {
        controller: { level: 2 },
        find: jest.fn().mockReturnValue([target]),
        visual: { text: jest.fn() }
      }

      const creep = {
        memory: { [MEMORY_KEYS.WORKING]: true },
        room,
        store: { [RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
        say: jest.fn(),
        repair: jest.fn().mockReturnValue(OK),
        build: jest.fn(),
        upgradeController: jest.fn(),
        pos: { getRangeTo: jest.fn().mockReturnValue(1) }
      }

      repairer.run(creep)

      expect(creep.repair).toHaveBeenCalledWith(target)
      expect(creep.memory[MEMORY_KEYS.TARGET_ID]).toBe('t1')
    })
  })

  describe('upgrader', () => {
    test('ストレージからエネルギーを取得する', () => {
      const storage = {
        store: { [RESOURCE_ENERGY]: 2000 },
        withdraw: jest.fn().mockReturnValue(OK)
      }
      cache.getStorage.mockReturnValue(storage)

      const creep = {
        memory: { [MEMORY_KEYS.WORKING]: false },
        store: { [RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
        say: jest.fn(),
        room: { controller: { pos: { x: 2, y: 2 } } },
        withdraw: storage.withdraw,
        pickup: jest.fn(),
        harvest: jest.fn(),
        pos: {}
      }

      upgrader.run(creep)

      expect(storage.withdraw).toHaveBeenCalledWith(storage, RESOURCE_ENERGY)
    })

    test('アップグレード時にメッセージを表示する', () => {
      const controller = { pos: { x: 1, y: 1 }, level: 8 }
      const creep = {
        memory: { [MEMORY_KEYS.WORKING]: true },
        store: { [RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
        say: jest.fn(),
        upgradeController: jest.fn().mockReturnValue(OK),
        room: { controller },
        pos: {}
      }

      upgrader.run(creep)

      expect(creep.upgradeController).toHaveBeenCalledWith(controller)
      expect(creep.say).toHaveBeenCalled()
    })
  })
})
