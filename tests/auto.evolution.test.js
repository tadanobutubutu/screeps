/* global describe, test, expect, beforeEach, jest */

/**
 * auto.evolution.js のユニットテスト
 */

global.Game = {
  time: 100,
  cpu: { getUsed: jest.fn().mockReturnValue(10), limit: 100 },
  gcl: { level: 1 },
  rooms: {},
  creeps: {},
  spawns: {}
}
global.Memory = {}
global.STRUCTURE_TOWER = 'tower'
global.STRUCTURE_LINK = 'link'
global.STRUCTURE_LAB = 'lab'
global.RESOURCE_ENERGY = 'energy'
global.FIND_MY_STRUCTURES = 'findMyStructures'
global.FIND_SOURCES = 'findSources'

const autoEvolution = require('../auto.evolution')

describe('auto.evolution', () => {
  beforeEach(() => {
    delete Memory.evolution
  })

  test('モジュールが正しく読み込める', () => {
    expect(autoEvolution).toBeDefined()
    expect(typeof autoEvolution.init).toBe('function')
    expect(typeof autoEvolution.run).toBe('function')
  })

  test('initでMemory.evolutionが初期化される', () => {
    autoEvolution.init()
    expect(Memory.evolution).toBeDefined()
    expect(Memory.evolution.history).toEqual([])
    expect(Memory.evolution.queue).toEqual([])
  })

  test('run関数が例外を投げない', () => {
    global.Game.cpu.getUsed = jest.fn().mockReturnValue(10)
    global.Game.cpu.limit = 100
    expect(() => autoEvolution.run()).not.toThrow()
  })

  test('needsEvolutionが配列を返す', () => {
    autoEvolution.init()
    const state = { rcl: 1, roomCount: 1, structures: { towers: 0 } }
    const needs = autoEvolution.needsEvolution(state)
    expect(Array.isArray(needs)).toBe(true)
  })

  test('addToQueueがキューに追加する', () => {
    autoEvolution.init()
    const need = { type: 'test', priority: 5, action: 'test_action' }
    autoEvolution.addToQueue(need)
    expect(Memory.evolution.queue.length).toBe(1)
  })

  test('addToQueueが重複を追加しない', () => {
    autoEvolution.init()
    const need = { type: 'test', priority: 5, action: 'test_action' }
    autoEvolution.addToQueue(need)
    autoEvolution.addToQueue(need)
    expect(Memory.evolution.queue.length).toBe(1)
  })

  test('addToQueueがMAX_QUEUEを超えると追加しない', () => {
    autoEvolution.init()
    for (let i = 0; i < 15; i++) {
      autoEvolution.addToQueue({ type: `test${i}`, priority: i, action: `action${i}` })
    }
    expect(Memory.evolution.queue.length).toBeLessThanOrEqual(10)
  })

  test('getFilenameが正しいファイル名を返す', () => {
    expect(autoEvolution.getFilename('create_tower_logic')).toBe('structure.tower.js')
    expect(autoEvolution.getFilename('unknown')).toBe('evolution.code.js')
  })

  test('generateRCLFeaturesがコードを生成する', () => {
    const code = autoEvolution.generateRCLFeatures({ newRCL: 3 })
    expect(code).toContain('Tower')
  })

  test('generateTowerLogicが実行可能なコードを生成する', () => {
    const code = autoEvolution.generateTowerLogic()
    expect(code).toContain('module.exports')

    const fakeModule = { exports: {} }
    const evaluateFn = new Function('module', code)
    expect(() => evaluateFn(fakeModule)).not.toThrow()

    expect(fakeModule.exports).toBeDefined()
    expect(typeof fakeModule.exports.run).toBe('function')
  })

  test('resetがMemory.evolutionを削除する', () => {
    autoEvolution.init()
    autoEvolution.reset()
    expect(Memory.evolution).toBeUndefined()
  })

  test('analyzeBasicStateが状態を返す', () => {
    global.Game.rooms = {
      W1N1: {
        controller: { my: true, level: 2 },
        find: jest.fn().mockReturnValue([])
      }
    }
    const state = autoEvolution.analyzeBasicState()
    expect(state).toBeDefined()
    expect(state.rcl).toBe(2)
    expect(state.roomCount).toBe(1)
  })

  test('analyzeResourcesLightがリソース情報を返す', () => {
    const rooms = [{ energyAvailable: 300, energyCapacityAvailable: 500, storage: null }]
    const result = autoEvolution.analyzeResourcesLight(rooms)
    expect(result.energy).toBe(300)
    expect(result.capacity).toBe(500)
  })
})
