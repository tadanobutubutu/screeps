/**
 * main.js のユニットテスト
 */

global.Game = {
  time: 100,
  cpu: { getUsed: jest.fn().mockReturnValue(10), limit: 100, bucket: 10000 },
  gcl: { level: 1, progress: 0, progressTotal: 100000 },
  rooms: {},
  creeps: {},
  spawns: {}
}
global.Memory = { helpShown: true }
global.RawMemory = {
  get: jest.fn().mockReturnValue('{}')
}
global.OK = 0
global.ERR_NOT_ENOUGH_ENERGY = -6
global.ERR_NOT_IN_RANGE = -9
global.WORK = 'work'
global.CARRY = 'carry'
global.MOVE = 'move'
global.HEAL = 'heal'
global.STRUCTURE_TOWER = 'tower'
global.RESOURCE_ENERGY = 'energy'
global.FIND_HOSTILE_CREEPS = 'findHostileCreeps'
global.FIND_STRUCTURES = 'findStructures'
global.FIND_MY_CREEPS = 'findMyCreeps'
global.FIND_CREEPS = 'findCreeps'
global.STRUCTURE_EXTENSION = 'extension'
global.STRUCTURE_CONTAINER = 'container'
global.STRUCTURE_SPAWN = 'spawn'
global.STRUCTURE_LAB = 'lab'
global.STRUCTURE_WALL = 'wall'
global.STRUCTURE_RAMPART = 'rampart'
global.STRUCTURE_ROAD = 'road'
global.FIND_SOURCES_ACTIVE = 'findSourcesActive'
global.RoomVisual = class {
  text () {}
  circle () {}
  line () {}
  rect () {}
  poly () {}
}

jest.mock(
  'posthog-js',
  () => ({
    init: jest.fn(),
    get_session_id: jest.fn().mockReturnValue('test-session')
  }),
  { virtual: true }
)

jest.mock(
  '@sentry/browser',
  () => ({
    init: jest.fn(),
    browserTracingIntegration: jest.fn(),
    replayIntegration: jest.fn(),
    getCurrentScope: jest.fn().mockReturnValue({
      setTag: jest.fn()
    }),
    captureException: jest.fn()
  }),
  { virtual: true }
)

jest.mock('role.harvester', () => ({ run: jest.fn() }), { virtual: true })
jest.mock('role.upgrader', () => ({ run: jest.fn() }), { virtual: true })
jest.mock('role.builder', () => ({ run: jest.fn() }), { virtual: true })
jest.mock('role.repairer', () => ({ run: jest.fn() }), { virtual: true })
jest.mock('role.explorer', () => ({ run: jest.fn() }), { virtual: true })
jest.mock('role.medic', () => ({ run: jest.fn() }), { virtual: true })
jest.mock('role.transporter', () => ({ run: jest.fn() }), { virtual: true })
jest.mock('role.scout', () => ({ run: jest.fn() }), { virtual: true })
jest.mock('defense.manager', () => ({ run: jest.fn() }), { virtual: true })
jest.mock(
  'utils.memory',
  () => ({
    cleanMemory: jest.fn().mockReturnValue(0),
    isSafeKey: jest.fn().mockReturnValue(true)
  }),
  { virtual: true }
)
jest.mock(
  'utils.logging',
  () => ({
    init: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    tryCatch: jest.fn((fn, context, ...args) => fn(...args)),
    getStats: jest.fn().mockReturnValue({ errors: 0 }),
    getSafeStack: jest.fn((s) => s),
    _escapeHTML: jest.fn((s) => s),
    escapeHTML: jest.fn((s) => s)
  }),
  { virtual: true }
)
jest.mock(
  'utils.emotions',
  () => ({
    display: jest.fn(),
    getStats: jest.fn().mockReturnValue({ veryHappy: 0, happy: 0, neutral: 0 }),
    interact: jest.fn(),
    checkCreep: jest.fn()
  }),
  { virtual: true }
)
jest.mock(
  'memory.visualizer',
  () => ({
    recordSnapshot: jest.fn(),
    cleanup: jest.fn(),
    backup: jest.fn(),
    restore: jest.fn(),
    showStats: jest.fn(),
    showHistory: jest.fn(),
    showLeaderboard: jest.fn(),
    readDiary: jest.fn(),
    showMap: jest.fn()
  }),
  { virtual: true }
)
jest.mock(
  'tutorial.auto',
  () => ({
    isTutorial: jest.fn().mockReturnValue(false),
    run: jest.fn(),
    showProgress: jest.fn(),
    skipIfPossible: jest.fn()
  }),
  { virtual: true }
)
jest.mock(
  'gamification',
  () => ({
    init: jest.fn(),
    updateStreak: jest.fn(),
    checkMilestones: jest.fn(),
    renderDashboard: jest.fn(),
    addXP: jest.fn(),
    showDashboard: jest.fn(),
    reset: jest.fn()
  }),
  { virtual: true }
)
jest.mock(
  'visual.effects',
  () => ({
    progressBar: jest.fn(),
    stars: jest.fn(),
    successExplosion: jest.fn()
  }),
  { virtual: true }
)
jest.mock(
  'auto.evolution',
  () => ({
    run: jest.fn(),
    showDashboard: jest.fn(),
    reset: jest.fn()
  }),
  { virtual: true }
)
jest.mock(
  'system.adaptive',
  () => ({
    evaluate: jest.fn().mockReturnValue(2),
    isEnabled: jest.fn().mockReturnValue(true),
    emergencyCleanup: jest.fn(),
    showDashboard: jest.fn(),
    setMode: jest.fn(),
    MODE: { EMERGENCY: 0, MINIMAL: 1, NORMAL: 2, FULL: 3 }
  }),
  { virtual: true }
)
jest.mock('utils.dashboard', () => ({ displayVisuals: jest.fn() }), { virtual: true })

describe('main.js', () => {
  test('モジュールが正しく読み込める', () => {
    const main = require('../main')
    expect(main).toBeDefined()
    expect(typeof main.loop).toBe('function')
  })

  test('loop関数が例外を投げない', () => {
    global.Game.creeps = {}
    global.Game.spawns = {}
    const main = require('../main')
    expect(() => main.loop()).not.toThrow()
  })

  test('help関数が存在する', () => {
    require('../main')
    expect(typeof global.help).toBe('function')
  })

  test('adaptiveグローバルが存在する', () => {
    require('../main')
    expect(typeof global.adaptive).toBe('function')
  })

  test('modeグローバルが存在する', () => {
    require('../main')
    expect(typeof global.mode).toBe('function')
  })

  test('global help function can be called', () => {
    expect(() => global.help()).not.toThrow()
  })

  test('global e command exists and returns emotion stats', () => {
    const result = global.e()
    expect(result).toBeDefined()
    expect(result.veryHappy).toBe(0)
    expect(result.happy).toBe(0)
    expect(result.neutral).toBe(0)
  })

  test('global t command calls showProgress', () => {
    global.Game.time = 100
    const main = require('../main')
    expect(() => global.t()).not.toThrow()
  })

  test('global ts command exists', () => {
    expect(typeof global.ts).toBe('function')
  })

  test('global g command exists', () => {
    expect(typeof global.g).toBe('function')
  })

  test('global evo command exists', () => {
    expect(typeof global.evo).toBe('function')
  })

  test('mc, mb, mr, mh, ml, md, mm global commands exist', () => {
    expect(typeof global.mc).toBe('function')
    expect(typeof global.mb).toBe('function')
    expect(typeof global.mr).toBe('function')
    expect(typeof global.mh).toBe('function')
    expect(typeof global.ml).toBe('function')
    expect(typeof global.md).toBe('function')
    expect(typeof global.mm).toBe('function')
  })

  test('loop() initializes room cache correctly and categorizes structures', () => {
    const main = require('../main')

    const structure1 = {
      structureType: global.STRUCTURE_EXTENSION,
      store: { getFreeCapacity: () => 10 },
      my: true,
      hits: 100,
      hitsMax: 100
    }
    const structure2 = {
      structureType: global.STRUCTURE_CONTAINER,
      store: { getFreeCapacity: () => 10, [global.RESOURCE_ENERGY]: 50 },
      hits: 100,
      hitsMax: 100
    }
    const structure3 = { structureType: 'wall', hits: 100, hitsMax: 100 } // skipped
    const structure4 = {
      structureType: global.STRUCTURE_TOWER,
      store: { getFreeCapacity: () => 10 },
      my: true,
      hits: 20,
      hitsMax: 100
    } // damaged, critical
    const room = {
      name: 'W1N1',
      find: jest.fn().mockImplementation((type) => {
        if (type === global.FIND_STRUCTURES) {
          return [structure1, structure2, structure3, structure4]
        }
        if (type === 'findHostileCreeps') return []
        if (type === 105) return [] // sources
        if (type === global.FIND_MY_CREEPS) return []
        return []
      }),
      controller: { my: true },
      energyAvailable: 300,
      energyCapacityAvailable: 300,
      visual: { text: jest.fn(), rect: jest.fn() }
    }
    global.Game.rooms = { W1N1: room }
    global.Game.creeps = {}
    global.Game.spawns = {}
    global.Game.constructionSites = {}
    global.Game.time = 100 // triggers some periodic tasks

    main.loop()

    expect(room._myStructures.length).toBe(2)
    expect(room._containers.length).toBe(1)
    expect(room._towers.length).toBe(1)
    expect(room._criticalStructure).toBe(structure4)
  })

  test('loop() handles spawning correctly', () => {
    const main = require('../main')

    const room = {
      name: 'W1N1',
      find: jest.fn().mockReturnValue([]),
      controller: { my: true },
      energyAvailable: 300,
      energyCapacityAvailable: 300,
      visual: { text: jest.fn(), rect: jest.fn() }
    }

    const spawn = {
      id: 'spawn1',
      room,
      spawning: null,
      spawnCreep: jest.fn().mockReturnValue(global.OK),
      pos: { x: 1, y: 1 }
    }

    global.Game.rooms = { W1N1: room }
    global.Game.spawns = { Spawn1: spawn }
    global.Game.creeps = {}

    main.loop()

    // Target is harvester -> 2, none exist, so it should spawn a harvester
    expect(spawn.spawnCreep).toHaveBeenCalledWith(
      expect.arrayContaining([global.WORK, global.CARRY, global.MOVE]),
      expect.stringContaining('harvester_'),
      expect.any(Object)
    )
  })

  test('loop() handles existing creeps logic', () => {
    const main = require('../main')

    const room = {
      name: 'W1N1',
      find: jest.fn().mockReturnValue([]),
      controller: { my: true },
      energyAvailable: 300,
      energyCapacityAvailable: 300,
      visual: { text: jest.fn(), rect: jest.fn() }
    }

    const creep1 = {
      id: 'c1',
      name: 'creep1',
      memory: { role: 'harvester' },
      room,
      hits: 40,
      hitsMax: 100,
      pos: { findInRange: jest.fn().mockReturnValue([]) },
      say: jest.fn()
    }
    const creep2 = {
      id: 'c2',
      name: 'creep2',
      memory: { role: 'unknown' },
      room,
      hits: 100,
      hitsMax: 100,
      pos: { findInRange: jest.fn().mockReturnValue([]) },
      say: jest.fn()
    }

    global.Game.rooms = { W1N1: room }
    global.Game.creeps = { creep1, creep2 }

    main.loop()

    expect(room._myCreeps.length).toBe(2)
    expect(room._injuredCreeps.length).toBe(1)
    expect(room._criticalCreep).toBe(creep1)
    expect(creep2.memory.role).toBe('harvester') // defaults to harvester
  })

  test('loop() handles social interactions', () => {
    const main = require('../main')
    const EmotionSystem = require('utils.emotions')

    const creep1 = {
      id: 'c1',
      name: 'creep1',
      memory: {},
      pos: { x: 10, y: 10, inRangeTo: jest.fn().mockReturnValue(true) },
      hits: 100,
      hitsMax: 100,
      say: jest.fn(),
      upgradeController: jest.fn(),
      store: { getUsedCapacity: () => 0, getFreeCapacity: () => 10, getCapacity: () => 10 }
    }
    const creep2 = {
      id: 'c2',
      name: 'creep2',
      memory: {},
      pos: { x: 11, y: 10, inRangeTo: jest.fn().mockReturnValue(true) },
      hits: 100,
      hitsMax: 100,
      say: jest.fn(),
      upgradeController: jest.fn(),
      store: { getUsedCapacity: () => 0, getFreeCapacity: () => 10, getCapacity: () => 10 }
    }

    const room = {
      name: 'W1N1',
      find: jest.fn().mockReturnValue([creep1, creep2]),
      controller: { my: true },
      energyAvailable: 300,
      energyCapacityAvailable: 300,
      visual: { text: jest.fn(), rect: jest.fn() }
    }
    creep1.room = room
    creep2.room = room

    global.Game.rooms = { W1N1: room }
    global.Game.creeps = { creep1, creep2 }
    global.Game.time = 100 // 100 % 100 === 0 to trigger emotions

    // Math.random -> 0.8 to trigger interaction
    const originalRandom = Math.random
    Math.random = jest.fn().mockReturnValue(0.8)

    main.loop()

    expect(EmotionSystem.interact).toHaveBeenCalled()
    Math.random = originalRandom
  })

  test('global gr and evor commands exist', () => {
    expect(typeof global.gr).toBe('function')
    expect(typeof global.evor).toBe('function')
  })
})
