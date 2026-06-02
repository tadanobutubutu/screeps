/**
 * src/roles/defender.js のユニットテスト
 */

jest.mock(
  '../src/utils/cache',
  () => ({
    getEnemies: jest.fn(),
    getMyCreeps: jest.fn().mockReturnValue([]),
    getMyStructures: jest.fn().mockReturnValue([]),
    isSafeKey: jest.fn().mockReturnValue(true)
  }),
  { virtual: true }
)

jest.mock(
  '../src/utils/pathfinder',
  () => ({
    moveTo: jest.fn()
  }),
  { virtual: true }
)

jest.mock(
  '../src/utils/logger',
  () => ({
    error: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn()
  }),
  { virtual: true }
)

jest.mock(
  '../src/constants',
  () => ({
    MEMORY_KEYS: { WORKING: 'working' },
    ROOM_BOUNDS: { MIN: 0, MAX: 49 },
    LOG_LEVEL: { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, NONE: 4 },
    DEFAULT_LOG_LEVEL: 1,
    CACHE_TTL: { ENEMIES: 5 },
    PATHFINDER_DEFAULTS: {
      REUSE_PATH: 10,
      MAX_ROOMS: 1,
      PLAIN_COST: 2,
      SWAMP_COST: 10,
      ROAD_COST: 1
    }
  }),
  { virtual: true }
)

// Globals setup
global.Game = { creeps: {}, time: 1, getObjectById: jest.fn() }
global.Memory = {}
global.OK = 0
global.ATTACK = 'attack'
global.RANGED_ATTACK = 'ranged_attack'
global.HEAL = 'heal'
global.CLAIM = 'claim'
global.TOUGH = 'tough'
global.MOVE = 'move'
global.STRUCTURE_RAMPART = 'rampart'
global.TERRAIN_MASK_WALL = 1

global.RoomPosition = function (x, y, roomName) {
  this.x = x
  this.y = y
  this.roomName = roomName
  this.getRangeTo = jest.fn().mockImplementation((t) => {
    const tx = t.x ?? t.pos?.x ?? 0
    const ty = t.y ?? t.pos?.y ?? 0
    const dx = tx - x
    const dy = ty - y
    return Math.max(Math.abs(dx), Math.abs(dy))
  })
}

const cache = require('../src/utils/cache')
const pathfinder = require('../src/utils/pathfinder')
const defender = require('../src/roles/defender')

describe('src/roles/defender', () => {
  let roomMock

  beforeEach(() => {
    jest.clearAllMocks()
    roomMock = {
      name: 'W0N0',
      visual: { line: jest.fn() },
      find: jest.fn().mockReturnValue([]),
      controller: { my: true, safeMode: null, safeModeAvailable: 1 }
    }
  })

  test('敵がいるとき攻撃し回復する', () => {
    const targetNear = {
      id: 'enemy1',
      hits: 50,
      hitsMax: 100,
      pos: new RoomPosition(10, 10, 'W0N0'),
      getActiveBodyparts: jest.fn().mockReturnValue(1),
      room: roomMock
    }
    cache.getEnemies.mockReturnValue([targetNear])

    const creep = {
      name: 'def1',
      hits: 50,
      hitsMax: 100,
      memory: {},
      room: roomMock,
      pos: new RoomPosition(11, 11, 'W0N0'),
      getActiveBodyparts: jest
        .fn()
        .mockImplementation((part) =>
          part === global.RANGED_ATTACK || part === global.ATTACK || part === global.HEAL
            ? 1
            : 0
        ),
      rangedAttack: jest.fn(),
      attack: jest.fn(),
      heal: jest.fn(),
      moveTo: jest.fn().mockReturnValue(global.OK)
    }

    defender.run(creep)

    expect(creep.rangedAttack).toHaveBeenCalled()
    expect(creep.attack).toHaveBeenCalled()
    expect(creep.heal).toHaveBeenCalledWith(creep)
  })

  test('fleeFromでmoveToが例外を投げてもクラッシュしない', () => {
    const target = {
      id: 'enemy_flee',
      hits: 50,
      hitsMax: 100,
      pos: new RoomPosition(10, 10, 'W0N0'),
      getActiveBodyparts: jest.fn().mockReturnValue(1),
      room: roomMock
    }
    cache.getEnemies.mockReturnValue([target])

    const creep = {
      name: 'def_flee',
      hits: 100,
      hitsMax: 100,
      memory: {},
      room: roomMock,
      pos: new RoomPosition(10, 10, 'W0N0'),
      getActiveBodyparts: jest.fn().mockImplementation((part) => {
        return part === global.RANGED_ATTACK ? 1 : 0
      }),
      rangedAttack: jest.fn(),
      attack: jest.fn(),
      heal: jest.fn(),
      moveTo: jest.fn().mockImplementation(() => {
        throw new Error('Position error')
      })
    }

    expect(() => defender.run(creep)).not.toThrow()
  })

  test('敵がいないときパトロールする', () => {
    cache.getEnemies.mockReturnValue([])
    const rampart = { pos: new RoomPosition(5, 5, 'W0N0') }
    cache.getMyStructures.mockReturnValue([rampart])

    const creep = {
      name: 'def_patrol',
      memory: { patrolIndex: 0 },
      room: roomMock,
      pos: new RoomPosition(5, 6, 'W0N0'),
      getActiveBodyparts: jest.fn().mockReturnValue(0),
      moveTo: jest.fn().mockReturnValue(global.OK)
    }

    defender.run(creep)
    expect(creep.memory.patrolIndex).toBe(0)
  })

  test('セーフモード判定が敵数と防衛数でtrueになる', () => {
    cache.getEnemies.mockReturnValue([
      { hitsMax: 100, getActiveBodyparts: jest.fn().mockReturnValue(1), room: roomMock },
      { hitsMax: 80, getActiveBodyparts: jest.fn().mockReturnValue(1), room: roomMock },
      { hitsMax: 60, getActiveBodyparts: jest.fn().mockReturnValue(1), room: roomMock }
    ])
    cache.getMyCreeps.mockReturnValue([
      {
        room: roomMock,
        memory: { role: 'harvester' },
        getActiveBodyparts: jest.fn().mockReturnValue(0)
      }
    ])

    expect(defender.shouldActivateSafeMode(roomMock)).toBe(true)
  })

  test('getBodyは遠距離型の構成を返す', () => {
    expect(defender.getBody(900, true)).toContain(global.RANGED_ATTACK)
    expect(defender.getBody(200, false)).toEqual([
      global.TOUGH,
      global.ATTACK,
      global.MOVE,
      global.MOVE
    ])
  })
})
