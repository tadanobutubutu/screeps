/**
 * src/roles/defender.js のユニットテスト
 */

global.Game = { time: 10 }
global.Memory = {}
global.OK = 0
global.ERR_NOT_IN_RANGE = -9
global.FIND_HOSTILE_CREEPS = 6
global.FIND_MY_STRUCTURES = 8
global.ATTACK = 'attack'
global.RANGED_ATTACK = 'ranged_attack'
global.HEAL = 'heal'

global.MOVE = 'move'
global.TOUGH = 'tough'
global.CLAIM = 'claim'
global.ROOM_BOUNDS = { MIN: 0, MAX: 49 }

global.STRUCTURE_RAMPART = 'rampart'
global.STRUCTURE_CONTROLLER = 'controller'
global.RoomPosition = class {
  constructor (x, y, roomName) {
    this.x = x
    this.y = y
    this.roomName = roomName
  }

  getRangeTo (target) {
    if (target instanceof RoomPosition) {
      return Math.abs(this.x - target.x) + Math.abs(this.y - target.y)
    }
    return Math.abs(this.x - target.x) + Math.abs(this.y - target.y)
  }
}

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
  '../src/utils/cache',
  () => ({
    getEnemies: jest.fn(),
    getMyCreeps: jest.fn(),
    getMyStructures: jest.fn()
  }),
  { virtual: true }
)

const cache = require('../src/utils/cache')
const roleDefender = require('../src/roles/defender')

describe('role.defender', () => {
  let mockCreep

  beforeEach(() => {
    mockCreep = {
      memory: {},
      say: jest.fn(),
      attack: jest.fn().mockReturnValue(OK),
      rangedAttack: jest.fn().mockReturnValue(OK),
      moveTo: jest.fn().mockReturnValue(OK),
      pos: { x: 25, y: 25, getRangeTo: jest.fn().mockReturnValue(5) },
      room: {
        name: 'W1N1',
        controller: {
          pos: { x: 30, y: 30 }
        },
        find: jest.fn().mockReturnValue([])
      },
      getActiveBodyparts: jest.fn((part) => {
        if (part === ATTACK) return 2
        if (part === RANGED_ATTACK) return 1
        return 0
      })
    }
  })

  test('モジュールが正しく読み込める', () => {
    expect(roleDefender).toBeDefined()
    expect(typeof roleDefender.run).toBe('function')
  })

  test('敵がいない場合はパトロールする', () => {
    mockCreep.room.find.mockReturnValue([])

    roleDefender.run(mockCreep)

    // パトロール動作が実行される（エラーが発生しない）
    expect(() => roleDefender.run(mockCreep)).not.toThrow()
  })

  test('敵がいる場合はエラーなく実行される', () => {
    const mockEnemy = {
      id: 'enemy1',
      pos: { x: 27, y: 27, getRangeTo: jest.fn().mockReturnValue(5) },
      owner: { username: 'Invader' },
      hits: 100,
      hitsMax: 100,
      getActiveBodyparts: jest.fn().mockReturnValue(0)
    }
    cache.getEnemies.mockReturnValue([mockEnemy])
    mockCreep.getActiveBodyparts = jest.fn((part) => {
      if (part === ATTACK) return 2
      if (part === RANGED_ATTACK) return 0
      return 0
    })

    expect(() => roleDefender.run(mockCreep)).not.toThrow()
  })

  test('遠距離攻撃可能な場合もエラーなく実行される', () => {
    const mockEnemy = {
      id: 'enemy1',
      pos: { x: 27, y: 27, getRangeTo: jest.fn().mockReturnValue(5) },
      owner: { username: 'Invader' },
      hits: 100,
      hitsMax: 100,
      getActiveBodyparts: jest.fn().mockReturnValue(0)
    }
    cache.getEnemies.mockReturnValue([mockEnemy])
    mockCreep.getActiveBodyparts = jest.fn((part) => {
      if (part === ATTACK) return 0
      if (part === RANGED_ATTACK) return 1
      return 0
    })

    expect(() => roleDefender.run(mockCreep)).not.toThrow()
  })
})

describe('getBody', () => {
  test('ranged = true の場合、エネルギー量に応じた遠距離ボディを返す', () => {
    expect(roleDefender.getBody(900, true)).toContain(global.RANGED_ATTACK)
    expect(roleDefender.getBody(450, true)).toContain(global.RANGED_ATTACK)
    expect(roleDefender.getBody(200, true)).toContain(global.RANGED_ATTACK)
  })

  test('ranged = false の場合、エネルギー量に応じた近接ボディを返す', () => {
    expect(roleDefender.getBody(800, false)).toContain(global.ATTACK)
    expect(roleDefender.getBody(400, false)).toContain(global.ATTACK)
    expect(roleDefender.getBody(200, false)).toContain(global.ATTACK)
    expect(roleDefender.getBody(100, false)).toContain(global.ATTACK)
  })
})

describe('detectInvasion', () => {
  test('敵がいない場合は detected: false を返す', () => {
    cache.getEnemies.mockReturnValue([])
    const result = roleDefender.detectInvasion({})
    expect(result.detected).toBe(false)
    expect(result.count).toBe(0)
  })

  test('攻撃パーツを持つ敵がいる場合は detected: true を返す', () => {
    const mockEnemy = {
      getActiveBodyparts: jest.fn((part) => (part === global.ATTACK ? 1 : 0)),
      hitsMax: 100
    }
    cache.getEnemies.mockReturnValue([mockEnemy])
    const result = roleDefender.detectInvasion({})
    expect(result.detected).toBe(true)
    expect(result.count).toBe(1)
    expect(result.strongestHp).toBe(100)
  })
})

describe('shouldActivateSafeMode', () => {
  let room

  beforeEach(() => {
    room = {
      controller: {
        my: true,
        safeMode: undefined,
        safeModeAvailable: 1
      }
    }
    // Ensure getMyCreeps is mockable
    if (!cache.getMyCreeps) {
      cache.getMyCreeps = jest.fn()
    }
  })

  test('コントローラーがない場合は false を返す', () => {
    expect(roleDefender.shouldActivateSafeMode({})).toBe(false)
  })

  test('コントローラーが自分のものじゃない場合は false を返す', () => {
    room.controller.my = false
    expect(roleDefender.shouldActivateSafeMode(room)).toBe(false)
  })

  test('すでにセーフモードが発動している場合は false を返す', () => {
    room.controller.safeMode = 1000
    expect(roleDefender.shouldActivateSafeMode(room)).toBe(false)
  })

  test('セーフモードのストックがない場合は false を返す', () => {
    room.controller.safeModeAvailable = 0
    expect(roleDefender.shouldActivateSafeMode(room)).toBe(false)
  })

  test('敵が3体以上いて、ディフェンダーが足りない場合は true を返す', () => {
    const mockEnemy = {
      getActiveBodyparts: jest.fn((part) => (part === global.ATTACK ? 1 : 0)),
      hitsMax: 100
    }
    cache.getEnemies.mockReturnValue([mockEnemy, mockEnemy, mockEnemy])

    cache.getMyCreeps.mockReturnValue([])

    expect(roleDefender.shouldActivateSafeMode(room)).toBe(true)
  })

  test('敵が3体以上いても、ディフェンダーが十分な場合は false を返す', () => {
    const mockEnemy = {
      getActiveBodyparts: jest.fn((part) => (part === global.ATTACK ? 1 : 0)),
      hitsMax: 100
    }
    cache.getEnemies.mockReturnValue([mockEnemy, mockEnemy, mockEnemy])

    const mockDefender = {
      memory: { role: 'defender' },
      getActiveBodyparts: jest.fn((part) => (part === global.ATTACK ? 1 : 0))
    }
    cache.getMyCreeps.mockReturnValue([mockDefender, mockDefender, mockDefender])

    expect(roleDefender.shouldActivateSafeMode(room)).toBe(false)
  })
})

describe('Patrol & Combat Logics', () => {
  let mockCreep
  beforeEach(() => {
    mockCreep = {
      memory: {},
      say: jest.fn(),
      attack: jest.fn().mockReturnValue(OK),
      rangedAttack: jest.fn().mockReturnValue(OK),
      moveTo: jest.fn().mockReturnValue(OK),
      pos: { x: 25, y: 25, getRangeTo: jest.fn().mockReturnValue(5) },
      room: {
        name: 'W1N1',
        controller: {
          pos: { x: 30, y: 30 }
        },
        visual: { line: jest.fn() }
      },
      getActiveBodyparts: jest.fn((part) => {
        if (part === ATTACK) return 2
        if (part === RANGED_ATTACK) return 1
        return 0
      }),
      hits: 100,
      hitsMax: 100,
      heal: jest.fn()
    }
  })

  test('敵がいない、かつランパートがある場合はランパートを巡回する', () => {
    cache.getEnemies.mockReturnValue([])
    cache.getMyStructures.mockReturnValue([
      { pos: { x: 10, y: 10 } },
      { pos: { x: 20, y: 20 } }
    ])

    roleDefender.run(mockCreep)

    expect(mockCreep.memory.patrolIndex).toBeDefined()
  })

  test('自己修復', () => {
    cache.getEnemies.mockReturnValue([])
    mockCreep.hits = 50
    mockCreep.getActiveBodyparts = jest.fn((part) => (part === HEAL ? 1 : 0))

    roleDefender.run(mockCreep)

    expect(mockCreep.heal).toHaveBeenCalledWith(mockCreep)
  })
})
