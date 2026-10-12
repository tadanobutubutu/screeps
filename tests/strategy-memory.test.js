jest.mock('../src/utils/logger', () => ({ info: jest.fn() }))
/**
 * strategy-memory.js のユニットテスト
 */

global.Memory = {}

const strategyMemory = require('../strategy-memory')

describe('strategy-memory', () => {
  beforeEach(() => {
    global.Memory = {}
    jest.clearAllMocks()
  })

  test('モジュールが正しく読み込める', () => {
    expect(strategyMemory).toBeDefined()
    expect(typeof strategyMemory.loadStrategy).toBe('function')
    expect(typeof strategyMemory.displayBriefing).toBe('function')
  })

  test('loadStrategyがMemory.strategyを初期化する', () => {
    strategyMemory.loadStrategy()
    expect(Memory.strategy).toBeDefined()
  })

  test('displayBriefingがエラーなく実行される', () => {
    Memory.strategy = {
      timestamp: '2026-01-01',
      focus: 'growth',
      objective: 'upgrade',
      tactics: { harvester: 'default' },
      priority: 'high'
    }
    expect(() => strategyMemory.displayBriefing()).not.toThrow()
  })

  test('displayBriefingがMemory.strategyがないときエラーなく終了する', () => {
    expect(() => strategyMemory.displayBriefing()).not.toThrow()
  })

  describe('getOffsets', () => {
    test('正の座標のオフセットを正しく計算する', () => {
      const base = { x: 10, y: 20 }
      const result = strategyMemory.getOffsets(base)
      expect(result).toEqual({ x: 15, y: 18 })
    })

    test('負の座標のオフセットを正しく計算する', () => {
      const base = { x: -10, y: -20 }
      const result = strategyMemory.getOffsets(base)
      expect(result).toEqual({ x: -5, y: -22 })
    })

    test('ゼロ座標のオフセットを正しく計算する', () => {
      const base = { x: 0, y: 0 }
      const result = strategyMemory.getOffsets(base)
      expect(result).toEqual({ x: 5, y: -2 })
    })
  })
})
