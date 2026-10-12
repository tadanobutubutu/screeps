jest.mock('utils.logging', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}))
/**
 * tutorial.auto.js のユニットテスト
 */

global.Game = {
  time: 100,
  tutorial: undefined,
  creeps: {},
  spawns: {},
  rooms: {},
  structures: {}
}
global.Memory = {}
global._ = {
  filter: jest.fn((arr) => arr)
}
global.WORK = 'work'
global.CARRY = 'carry'
global.MOVE = 'move'
global.ATTACK = 'attack'
global.TOUGH = 'tough'
global.HEAL = 'heal'
global.STRUCTURE_TOWER = 'tower'
global.RESOURCE_ENERGY = 'energy'
global.FIND_SOURCES = 5
global.FIND_SOURCES_ACTIVE = 103
global.FIND_MY_CREEPS = 101
global.FIND_CONSTRUCTION_SITES = 'findConstructionSites'
global.FIND_HOSTILE_CREEPS = 'findHostileCreeps'
global.FIND_STRUCTURES = 'findStructures'
global.FIND_MY_STRUCTURES = 101
global.ERR_NOT_IN_RANGE = -9
global.ERR_NOT_ENOUGH_ENERGY = -6
global.FIND_SOURCES = 5
global.FIND_SOURCES_ACTIVE = 103
global.ERR_NOT_ENOUGH_ENERGY = -6
global.FIND_MY_CREEPS = 101

const autoTutorial = require('../tutorial.auto')

describe('tutorial.auto', () => {
  test('モジュールが正しく読み込める', () => {
    expect(autoTutorial).toBeDefined()
  })

  test('isTutorialがチュートリアル外ではfalseを返す', () => {
    global.Game.tutorial = undefined
    expect(autoTutorial.isTutorial()).toBeFalsy()
  })

  test('isTutorialがチュートリアル中ではtrueを返す', () => {
    global.Game.tutorial = { currentStep: 1 }
    expect(autoTutorial.isTutorial()).toBe(true)
  })

  test('runがチュートリアル外ではfalseを返す', () => {
    global.Game.tutorial = undefined
    expect(autoTutorial.run()).toBe(false)
  })

  test('runがチュートリアル中ではtrueを返す', () => {
    global.Game.tutorial = { currentStep: 1 }
    global.Game.spawns = {}
    expect(autoTutorial.run()).toBe(true)
  })

  test('showProgressがステップを表示', () => {
    global.Game.tutorial = { currentStep: 1 }
    global.Game.creeps = { creep1: {} }
    global.Game.spawns = { Spawn1: { store: { energy: 100 } } }
    expect(() => autoTutorial.showProgress()).not.toThrow()
  })

  test('skipIfPossibleが.skipを呼び出す', () => {
    global.Game.tutorial = { skip: jest.fn() }
    const result = autoTutorial.skipIfPossible()
    expect(result).toBe(true)
  })

  test('skipIfPossibleが.skipがない場合falseを返す', () => {
    global.Game.tutorial = {}
    const result = autoTutorial.skipIfPossible()
    expect(result).toBe(false)
  })

  test('step1_createHarvesterが処理を完了', () => {
    global.Game.spawns = {
      Spawn1: {
        spawning: null,
        spawnCreep: jest.fn().mockReturnValue(0)
      }
    }
    global.Game.creeps = {}
    expect(() => autoTutorial.step1_createHarvester()).not.toThrow()
  })

  test('autoStepが処理を完了', () => {
    global.Game.creeps = {}
    global.Game.spawns = { Spawn1: { spawning: null, spawnCreep: jest.fn() } }
    global.Game.structures = []
    expect(() => autoTutorial.autoStep()).not.toThrow()
  })

  test('tutorial有creep的时候autoStep能正常处理', () => {
    global.Game.tutorial = { currentStep: 1 }
    global.Game.creeps = {
      creep1: {
        body: [{ type: 'work' }],
        memory: {},
        store: { energy: 10, getFreeCapacity: () => 90 },
        harvest: jest.fn(),
        build: jest.fn(),
        upgradeController: jest.fn(),
        moveTo: jest.fn(),
        room: {
          find: jest.fn().mockReturnValue([]),
          findExitTo: jest.fn().mockReturnValue('bottom'),
          controller: { pos: { x: 25, y: 25 } }
        }
      }
    }
    global.Game.spawns = { Spawn1: { spawning: null, spawnCreep: jest.fn() } }
    global.Game.structures = []
    global.Game.rooms = {
      W0N0: {
        find: jest.fn().mockReturnValue([]),
        findExitTo: jest.fn().mockReturnValue('bottom'),
        controller: { pos: { x: 25, y: 25 } }
      }
    }
    expect(() => autoTutorial.autoStep()).not.toThrow()
  })

  test('tutorial有construction sites的时候能处理', () => {
    global.Game.tutorial = { currentStep: 2 }
    global.Game.creeps = {
      creep1: {
        body: [{ type: 'work' }],
        memory: {},
        store: { energy: 10, getFreeCapacity: () => 90 },
        harvest: jest.fn(),
        build: jest.fn().mockReturnValue(0),
        upgradeController: jest.fn(),
        moveTo: jest.fn(),
        room: {
          find: jest.fn().mockReturnValue([]),
          findExitTo: jest.fn().mockReturnValue('bottom'),
          controller: { pos: { x: 25, y: 25 } }
        }
      }
    }
    global.Game.spawns = { Spawn1: { spawning: null, spawnCreep: jest.fn() } }
    global.Game.structures = []
    global.Game.constructionSites = { site1: { progress: 0, progressTotal: 100 } }
    global.Game.rooms = {
      W0N0: {
        find: jest.fn().mockReturnValue([{ id: 'site1' }]),
        findExitTo: jest.fn().mockReturnValue('bottom'),
        controller: { pos: { x: 25, y: 25 } }
      }
    }
    expect(() => autoTutorial.autoStep()).not.toThrow()
  })

  test('showProgress在没有spawn的时候不报错', () => {
    global.Game.tutorial = { currentStep: 1 }
    global.Game.creeps = {}
    global.Game.spawns = {}
    expect(() => autoTutorial.showProgress()).not.toThrow()
  })

  test('step2_harvestEnergyが処理を完了', () => {
    global.Game.tutorial = { currentStep: 2 }
    global.Game.creeps = {
      creep1: {
        body: [{ type: 'work' }],
        memory: { role: 'harvester' },
        store: { energy: 10, getFreeCapacity: () => 90 },
        harvest: jest.fn(),
        room: {
          find: jest.fn().mockReturnValue([{ id: 'source1' }])
        }
      }
    }
    global.Game.spawns = { Spawn1: { spawning: null } }
    global.Game.rooms = {
      W0N0: {
        find: jest.fn().mockReturnValue([{ id: 'source1' }])
      }
    }
    expect(() => autoTutorial.step2_harvestEnergy()).not.toThrow()
  })

  test('step3_upgradeControllerが処理を完了', () => {
    global.Game.tutorial = { currentStep: 3 }
    global.Game.creeps = {
      creep1: {
        body: [{ type: 'work' }],
        memory: { role: 'upgrader' },
        store: { energy: 10 },
        upgradeController: jest.fn(),
        room: {
          controller: { pos: { x: 25, y: 25 } }
        }
      }
    }
    global.Game.rooms = {
      W0N0: {
        controller: { pos: { x: 25, y: 25 } }
      }
    }
    expect(() => autoTutorial.step3_upgradeController()).not.toThrow()
  })

  test('step4_buildExtensionが処理を完了', () => {
    global.Game.tutorial = { currentStep: 4 }
    global.Game.creeps = {
      creep1: {
        body: [{ type: 'work' }],
        memory: { role: 'builder' },
        store: { energy: 10 },
        build: jest.fn(),
        room: {
          find: jest.fn().mockReturnValue([{ id: 'site1' }])
        }
      }
    }
    global.Game.spawns = { Spawn1: { spawning: null } }
    global.Game.constructionSites = { site1: { progress: 0, progressTotal: 100 } }
    global.Game.rooms = {
      W0N0: {
        find: jest.fn().mockReturnValue([{ id: 'site1' }])
      }
    }
    expect(() => autoTutorial.step4_buildExtension()).not.toThrow()
  })

  test('step5_defendRoomが処理を完了', () => {
    global.Game.tutorial = { currentStep: 5 }
    global.Game.creeps = {}
    global.Game.spawns = { Spawn1: { spawning: null } }
    global.Game.rooms = {
      W0N0: {
        find: jest.fn().mockReturnValue([])
      }
    }
    expect(() => autoTutorial.step5_defendRoom()).not.toThrow()
  })

  test('autoStep handles step 0', () => {
    global.Game.tutorial = { currentStep: 0 }
    global.Game.creeps = {}
    global.Game.spawns = {}
    expect(() => autoTutorial.autoStep()).not.toThrow()
  })

  test('autoStep handles high step number', () => {
    global.Game.tutorial = { currentStep: 10 }
    global.Game.creeps = {}
    global.Game.spawns = {}
    expect(() => autoTutorial.autoStep()).not.toThrow()
  })
})
