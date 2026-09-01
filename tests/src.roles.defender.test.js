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
global.FIND_HOSTILE_CREEPS = 103
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

  test('run() catches and logs errors', () => {
    const creep = {
      name: 'error_creep',
      room: roomMock,
      getActiveBodyparts: jest.fn().mockImplementation(() => {
        throw new Error('Test Error')
      })
    }
    const logger = require('../src/utils/logger')

    defender.run(creep)
    expect(logger.error).toHaveBeenCalled()
  })

  test('_attack returns early if no target is selected', () => {
    const enemyWithNoScore = {
      id: 'enemy_zero',
      hits: 100,
      hitsMax: 100,
      pos: new RoomPosition(10, 10, 'W0N0'),
      getActiveBodyparts: jest.fn().mockReturnValue(0),
      room: roomMock
    }
    // Mock _calcThreatScore indirectly or pass empty enemies
    cache.getEnemies.mockReturnValue([])
    const creep = {
      name: 'def_notarget',
      memory: {},
      room: roomMock,
      pos: new RoomPosition(11, 11, 'W0N0'),
      getActiveBodyparts: jest.fn().mockReturnValue(1),
      rangedAttack: jest.fn(),
      attack: jest.fn()
    }

    defender.run(creep)
    expect(creep.attack).not.toHaveBeenCalled()
    expect(creep.rangedAttack).not.toHaveBeenCalled()
  })

  test('_executeMeleeCombat branches appropriately', () => {
    const target = {
      id: 'enemy2',
      hits: 50,
      hitsMax: 100,
      pos: new RoomPosition(15, 15, 'W0N0'),
      getActiveBodyparts: jest.fn().mockReturnValue(1),
      room: roomMock
    }
    cache.getEnemies.mockReturnValue([target])

    const creep = {
      name: 'def_melee',
      hits: 100,
      hitsMax: 100,
      memory: {},
      room: roomMock,
      pos: new RoomPosition(11, 11, 'W0N0'),
      getActiveBodyparts: jest.fn((part) => (part === global.ATTACK ? 1 : 0)),
      attack: jest.fn()
    }

    // Dist > 1 (e.g. pos 11,11 to 15,15 dist is 4)
    defender.run(creep)
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, target, { range: 1 })
    expect(creep.attack).not.toHaveBeenCalled()

    // Dist <= 1
    creep.pos = new RoomPosition(14, 15, 'W0N0')
    pathfinder.moveTo.mockClear()
    defender.run(creep)
    expect(creep.attack).toHaveBeenCalledWith(target)
    expect(pathfinder.moveTo).not.toHaveBeenCalled()
  })

  test('_executeRangedCombat branches when dist > RANGED_RANGE', () => {
    const target = {
      id: 'enemy_ranged',
      hits: 50,
      hitsMax: 100,
      pos: new RoomPosition(20, 20, 'W0N0'),
      getActiveBodyparts: jest.fn().mockReturnValue(1),
      room: roomMock
    }
    cache.getEnemies.mockReturnValue([target])

    const creep = {
      name: 'def_ranged',
      hits: 100,
      hitsMax: 100,
      memory: {},
      room: roomMock,
      pos: new RoomPosition(10, 10, 'W0N0'), // dist 10
      getActiveBodyparts: jest.fn((part) => (part === global.RANGED_ATTACK ? 1 : 0)),
      rangedAttack: jest.fn()
    }

    defender.run(creep)
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, target, { range: 3 })
    expect(creep.rangedAttack).not.toHaveBeenCalled()
  })

  test('_patrol generates fallback patrol points if no ramparts', () => {
    cache.getEnemies.mockReturnValue([])
    cache.getMyStructures.mockReturnValue([]) // No ramparts

    const creep = {
      name: 'def_patrol_fallback',
      memory: { patrolIndex: 0 },
      room: roomMock,
      pos: new RoomPosition(25, 25, 'W0N0'),
      getActiveBodyparts: jest.fn().mockReturnValue(0)
    }

    defender.run(creep)
    // The mock room doesn't move but we can verify pathfinder was called with one of the fallback points (e.g. 5, 5 or 25, 25).
    // For patrolIndex 0, it should target the first fallback point {x: 5, y: 5}.
    expect(pathfinder.moveTo).toHaveBeenCalled()
    const callArgs = pathfinder.moveTo.mock.calls[0]
    expect(callArgs[1].x).toBe(5)
    expect(callArgs[1].y).toBe(5)
  })

  test('_patrol handles moving to next point', () => {
    cache.getEnemies.mockReturnValue([])
    const rampart1 = { pos: new RoomPosition(5, 5, 'W0N0') }
    const rampart2 = { pos: new RoomPosition(10, 10, 'W0N0') }
    cache.getMyStructures.mockReturnValue([rampart1, rampart2])

    const posMock = {
      x: 5,
      y: 5,
      roomName: 'W0N0',
      getRangeTo: jest.fn().mockReturnValue(1) // Force distance <= 2
    }

    const creep = {
      name: 'def_patrol_next',
      memory: { patrolIndex: 0 },
      room: roomMock,
      pos: posMock,
      getActiveBodyparts: jest.fn().mockReturnValue(0)
    }

    defender.run(creep)
    expect(creep.memory.patrolIndex).toBe(1) // Should advance index
  })

  test('getBody handles various energy levels', () => {
    // Ranged
    expect(defender.getBody(450, true)).toEqual([
      global.TOUGH,
      global.RANGED_ATTACK,
      global.RANGED_ATTACK,
      global.MOVE,
      global.MOVE,
      global.MOVE
    ])
    expect(defender.getBody(300, true)).toEqual([global.RANGED_ATTACK, global.MOVE])

    // Melee
    expect(defender.getBody(800, false)).toEqual([
      global.TOUGH,
      global.TOUGH,
      global.TOUGH,
      global.ATTACK,
      global.ATTACK,
      global.ATTACK,
      global.MOVE,
      global.MOVE,
      global.MOVE,
      global.MOVE
    ])
    expect(defender.getBody(400, false)).toEqual([
      global.TOUGH,
      global.TOUGH,
      global.ATTACK,
      global.ATTACK,
      global.MOVE,
      global.MOVE,
      global.MOVE
    ])
    expect(defender.getBody(100, false)).toEqual([global.ATTACK, global.MOVE])
  })

  test('shouldActivateSafeMode early returns false conditions', () => {
    // No controller
    let room = { controller: null }
    expect(defender.shouldActivateSafeMode(room)).toBe(false)

    // Controller not mine
    room = { controller: { my: false } }
    expect(defender.shouldActivateSafeMode(room)).toBe(false)

    // Safe mode already active
    room = { controller: { my: true, safeMode: 1000, safeModeAvailable: 1 } }
    expect(defender.shouldActivateSafeMode(room)).toBe(false)

    // No safe mode available
    room = { controller: { my: true, safeMode: null, safeModeAvailable: 0 } }
    expect(defender.shouldActivateSafeMode(room)).toBe(false)

    // No invasion
    room = { controller: { my: true, safeMode: null, safeModeAvailable: 1 } }
    cache.getEnemies.mockReturnValue([])
    expect(defender.shouldActivateSafeMode(room)).toBe(false)
  })

  test('shouldActivateSafeMode correctly factors in defenderCount', () => {
    const hostile = { getActiveBodyparts: jest.fn().mockReturnValue(1), hitsMax: 100 }
    cache.getEnemies.mockReturnValue([hostile, hostile, hostile]) // 3 enemies

    // 3 defenders => false
    cache.getMyCreeps.mockReturnValue([
      { memory: { role: 'defender' }, getActiveBodyparts: jest.fn().mockReturnValue(1) },
      { memory: { role: 'defender' }, getActiveBodyparts: jest.fn().mockReturnValue(1) },
      { memory: { role: 'defender' }, getActiveBodyparts: jest.fn().mockReturnValue(1) }
    ])
    expect(defender.shouldActivateSafeMode(roomMock)).toBe(false)

    // 2 defenders => true
    cache.getMyCreeps.mockReturnValue([
      { memory: { role: 'defender' }, getActiveBodyparts: jest.fn().mockReturnValue(1) },
      { memory: { role: 'defender' }, getActiveBodyparts: jest.fn().mockReturnValue(1) }
    ])
    expect(defender.shouldActivateSafeMode(roomMock)).toBe(true)
  })

  test('_executeRangedCombat kiting when dist <= 1 and hasMelee=false', () => {
    const target = {
      id: 'enemy_kite',
      hits: 50,
      hitsMax: 100,
      pos: new RoomPosition(10, 10, 'W0N0'),
      getActiveBodyparts: jest.fn().mockReturnValue(1),
      room: roomMock
    }
    cache.getEnemies.mockReturnValue([target])

    const creep = {
      name: 'def_kite',
      hits: 100,
      hitsMax: 100,
      memory: {},
      room: roomMock,
      pos: new RoomPosition(10, 11, 'W0N0'), // dist 1
      getActiveBodyparts: jest.fn((part) => (part === global.RANGED_ATTACK ? 1 : 0)),
      rangedAttack: jest.fn(),
      attack: jest.fn()
    }

    defender.run(creep)
    expect(creep.rangedAttack).toHaveBeenCalledWith(target)
    expect(pathfinder.moveTo).toHaveBeenCalled() // _fleeFrom uses moveTo with range: 0
  })
})
