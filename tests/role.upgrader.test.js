/**
 * role.upgrader.js のユニットテスト
 */

global.Game = {
  time: 10,
  getObjectById: jest.fn().mockImplementation((id) => {
    if (id === 'source1') return { id: 'source1', energy: 100 }
    return null
  })
}
global.Memory = {}
global.RESOURCE_ENERGY = 'energy'
global.OK = 0
global.ERR_NOT_IN_RANGE = -9
global.FIND_SOURCES_ACTIVE = 5

jest.mock(
  '../gamification',
  () => ({
    trackAction: jest.fn(),
    addXP: jest.fn()
  }),
  { virtual: true }
)

jest.mock(
  '../visual.effects',
  () => ({
    rainbowTrail: jest.fn(),
    particles: jest.fn(),
    scorePopup: jest.fn(),
    stars: jest.fn()
  }),
  { virtual: true }
)

const roleUpgrader = require('../role.upgrader')

describe('role.upgrader', () => {
  test('モジュールが正しく読み込める', () => {
    expect(roleUpgrader).toBeDefined()
    expect(typeof roleUpgrader.run).toBe('function')
  })

  test('コントローラが存在するとき upgradeController を呼ぶ', () => {
    const creep = {
      memory: { upgrading: true },
      store: {
        getFreeCapacity: jest.fn().mockReturnValue(0),
        [global.RESOURCE_ENERGY]: 50
      },
      say: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.OK),
      harvest: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      room: {
        controller: { pos: { x: 5, y: 5 }, level: 2 },
        find: jest.fn().mockReturnValue([])
      },
      pos: { x: 1, y: 1 }
    }

    roleUpgrader.run(creep)

    expect(creep.upgradeController).toHaveBeenCalledWith(creep.room.controller)
  })

  test('エネルギー0のとき harvesting に切り替わる', () => {
    const creep = {
      memory: { upgrading: true },
      store: {
        getFreeCapacity: jest.fn().mockReturnValue(50),
        [global.RESOURCE_ENERGY]: 0
      },
      say: jest.fn(),
      upgradeController: jest.fn(),
      harvest: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      room: {
        controller: { pos: { x: 5, y: 5 } },
        find: jest.fn().mockReturnValue([]),
        _activeSourcesTick: 10,
        _activeSources: []
      },
      pos: {
        x: 1,
        y: 1,
        findClosestByRange: jest.fn().mockReturnValue(null)
      }
    }

    expect(() => roleUpgrader.run(creep)).not.toThrow()
  })

  test('アップグレード中に範囲外なら移動する', () => {
    const creep = {
      memory: { upgrading: true },
      store: { [global.RESOURCE_ENERGY]: 20, getFreeCapacity: jest.fn().mockReturnValue(0) },
      say: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      harvest: jest.fn(),
      moveTo: jest.fn(),
      room: { controller: { id: 'controller1' } }
    }

    roleUpgrader.run(creep)
    expect(creep.moveTo).toHaveBeenCalledWith(creep.room.controller, expect.any(Object))
  })

  test('採掘ターゲットをキャッシュして移動する', () => {
    const source = { id: 'source2', energy: 100 }
    const creep = {
      memory: { upgrading: false, harvestTargetId: 'old' },
      store: { [global.RESOURCE_ENERGY]: 0, getFreeCapacity: jest.fn().mockReturnValue(10) },
      say: jest.fn(),
      harvest: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      moveTo: jest.fn(),
      pos: {
        findClosestByRange: jest.fn().mockReturnValue(source)
      },
      room: {
        _activeSourcesTick: 0,
        _activeSources: [source],
        find: jest.fn().mockReturnValue([source])
      }
    }

    global.Game.time = 20
    roleUpgrader.run(creep)

    expect(creep.memory.harvestTargetId).toBe('source2')
    expect(creep.moveTo).toHaveBeenCalledWith(source, expect.any(Object))
  })
})
