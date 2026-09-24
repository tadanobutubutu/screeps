/**
 * src/roles/upgrader.js のユニットテスト
 */

global.Game = { creeps: {} }
global.Memory = {}
global.RESOURCE_ENERGY = 'energy'
global.WORK = 'work'
global.CARRY = 'carry'
global.MOVE = 'move'
global.ERR_NOT_IN_RANGE = -9
global.OK = 0
global.STRUCTURE_STORAGE = 'storage'
global.STRUCTURE_LINK = 'link'
global.STRUCTURE_CONTAINER = 'container'

const mockCache = {
  getStorage: jest.fn(),
  getLinks: jest.fn(),
  getContainers: jest.fn(),
  getDroppedResources: jest.fn(),
  assignSource: jest.fn()
}

jest.mock('../src/utils/cache', () => mockCache, { virtual: true })
jest.mock(
  '../src/utils/pathfinder',
  () => ({
    moveTo: jest.fn(),
    closest: jest.fn()
  }),
  { virtual: true }
)
jest.mock('../src/utils/logger', () => ({ warn: jest.fn() }), { virtual: true })
jest.mock(
  '../src/constants',
  () => ({
    MEMORY_KEYS: { WORKING: 'working', SOURCE_ID: 'sourceId', TARGET_ID: 'targetId' }
  }),
  { virtual: true }
)

const pathfinder = require('../src/utils/pathfinder')
const upgrader = require('../src/roles/upgrader')

describe('src/roles/upgrader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('ストレージからエネルギーを取得する', () => {
    const storage = {
      id: 'store',
      store: { [global.RESOURCE_ENERGY]: 2000 },
      pos: { x: 1, y: 1 }
    }
    mockCache.getStorage.mockReturnValue(storage)

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { controller: { id: 'c1' } }
    }

    upgrader.run(creep)

    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, storage, { range: 1 })
  })

  test('コントローラーを強化する際に移動する', () => {
    mockCache.getStorage.mockReturnValue(null)
    mockCache.getLinks.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    mockCache.getDroppedResources.mockReturnValue([])
    mockCache.assignSource.mockReturnValue(null)

    const controller = { id: 'c2', level: 2 }
    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { controller }
    }

    upgrader.run(creep)

    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, controller, { range: 3 })
  })

  test('リンクからエネルギーを取得する', () => {
    mockCache.getStorage.mockReturnValue(null)
    const link = { store: { [global.RESOURCE_ENERGY]: 300 }, pos: { x: 3, y: 3 } }
    mockCache.getLinks.mockReturnValue([link])
    mockCache.getContainers.mockReturnValue([])
    mockCache.getDroppedResources.mockReturnValue([])
    mockCache.assignSource.mockReturnValue(null)
    pathfinder.closest.mockReturnValue(link)

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { controller: {} }
    }

    upgrader.run(creep)

    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, link, { range: 1 })
  })

  test('コントローラー近くのコンテナから取得する', () => {
    mockCache.getStorage.mockReturnValue(null)
    mockCache.getLinks.mockReturnValue([])
    mockCache.getDroppedResources.mockReturnValue([])
    const container = {
      store: { [global.RESOURCE_ENERGY]: 150 },
      pos: { getRangeTo: jest.fn().mockReturnValue(2) }
    }
    mockCache.getContainers.mockReturnValue([container])
    mockCache.assignSource.mockReturnValue(null)
    pathfinder.closest.mockReturnValue(container)

    const controller = {}
    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { controller }
    }

    upgrader.run(creep)

    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, container, { range: 1 })
  })

  test('レベル8のアップグレードでメッセージを表示する', () => {
    const controller = { id: 'c3', level: 8 }
    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 20, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.OK),
      room: { controller }
    }

    upgrader.run(creep)

    expect(creep.say).toHaveBeenCalled()
  })

  test('エネルギーが空のときworkingを解除する', () => {
    mockCache.getStorage.mockReturnValue(null)
    mockCache.getLinks.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    mockCache.getDroppedResources.mockReturnValue([])
    mockCache.assignSource.mockReturnValue(null)
    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      room: { controller: {} },
      upgradeController: jest.fn(),
      withdraw: jest.fn(),
      harvest: jest.fn()
    }

    upgrader.run(creep)

    expect(creep.memory.working).toBe(false)
  })

  test('showVisualsでビジュアルを描画する', () => {
    const controller = { level: 3, progress: 50, progressTotal: 100, pos: { x: 10, y: 10 } }
    const room = { controller, visual: { text: jest.fn() } }
    const creep = { room }

    upgrader.showVisuals(creep)

    expect(room.visual.text).toHaveBeenCalled()
  })

  test('getBodyでエネルギーに応じた構成を返す', () => {
    expect(upgrader.getBody(1400)).toContain(WORK)
    expect(upgrader.getBody(250)).toEqual([WORK, CARRY, MOVE])
  })

  test('getBodyで800エネルギーボディを返す', () => {
    expect(upgrader.getBody(800)).toEqual([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE])
  })

  test('getBodyで550エネルギーボディを返す', () => {
    expect(upgrader.getBody(550)).toEqual([WORK, WORK, WORK, CARRY, MOVE, MOVE])
  })

  test('getBodyで350エネルギーボディを返す', () => {
    expect(upgrader.getBody(350)).toEqual([WORK, WORK, CARRY, MOVE])
  })

  test('エネルギーが0のとき補充メッセージを表示する', () => {
    mockCache.getStorage.mockReturnValue(null)
    mockCache.getLinks.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    mockCache.getDroppedResources.mockReturnValue([])
    mockCache.assignSource.mockReturnValue(null)
    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      room: { controller: {} },
      upgradeController: jest.fn(),
      withdraw: jest.fn(),
      harvest: jest.fn(),
      pickup: jest.fn()
    }

    upgrader.run(creep)

    expect(creep.say).toHaveBeenCalledWith('⚡ 補充')
    expect(creep.memory.working).toBe(false)
  })

  test('エネルギー満タンのとき強化メッセージを表示する', () => {
    const controller = { id: 'c4', level: 3 }
    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 100, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.OK),
      room: { controller }
    }

    upgrader.run(creep)

    expect(creep.say).toHaveBeenCalledWith('🔋 強化')
    expect(creep.memory.working).toBe(true)
  })

  test('ソースから直接採掘する', () => {
    mockCache.getStorage.mockReturnValue(null)
    mockCache.getLinks.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    mockCache.getDroppedResources.mockReturnValue([])
    const source = { id: 's1' }
    mockCache.assignSource.mockReturnValue(source)
    pathfinder.closest.mockReturnValue(source)

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      harvest: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      withdraw: jest.fn(),
      pickup: jest.fn(),
      harvest: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { controller: {} }
    }

    upgrader.run(creep)

    expect(creep.harvest).toHaveBeenCalledWith(source)
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, source, { range: 1 })
  })

  test('落下リソースを回収する', () => {
    mockCache.getStorage.mockReturnValue(null)
    mockCache.getLinks.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    const drop = { resourceType: global.RESOURCE_ENERGY, amount: 80 }
    mockCache.getDroppedResources.mockReturnValue([drop])
    mockCache.assignSource.mockReturnValue(null)
    pathfinder.closest.mockReturnValue(drop)

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      pickup: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      withdraw: jest.fn(),
      harvest: jest.fn(),
      room: { controller: {} }
    }

    upgrader.run(creep)

    expect(creep.pickup).toHaveBeenCalledWith(drop)
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, drop, { range: 1 })
  })

  test('コントローラーがないときにwarnログを出力する', () => {
    const logger = require('../src/utils/logger')
    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 20, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      upgradeController: jest.fn(),
      room: {},
      name: 'testCreep'
    }

    upgrader.run(creep)

    expect(logger.warn).toHaveBeenCalledWith('[testCreep] コントローラーが見つかりません')
  })

  test('showVisualsでコントローラーがないとき何もしない', () => {
    const creep = { room: { controller: null } }
    expect(() => upgrader.showVisuals(creep)).not.toThrow()
  })

  test('showVisualsでprogressTotalが0のとき何もしない', () => {
    const controller = { level: 1, progress: 0, progressTotal: 0, pos: { x: 5, y: 5 } }
    const room = { controller, visual: { text: jest.fn() } }
    const creep = { room }

    upgrader.showVisuals(creep)

    expect(room.visual.text).not.toHaveBeenCalled()
  })

  test('TASK定数が正しい値を持つ', () => {
    expect(upgrader.TASK.GET_ENERGY).toBe('getEnergy')
    expect(upgrader.TASK.UPGRADE).toBe('upgrade')
  })

  test('ストレージがエネルギー不足のとき次のソースに進む', () => {
    const storage = { store: { [global.RESOURCE_ENERGY]: 500 } }
    mockCache.getStorage.mockReturnValue(storage)
    mockCache.getLinks.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    mockCache.getDroppedResources.mockReturnValue([])
    const source = { id: 's2' }
    mockCache.assignSource.mockReturnValue(source)

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      harvest: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      withdraw: jest.fn(),
      pickup: jest.fn(),
      harvest: jest.fn(),
      room: { controller: {} }
    }

    upgrader.run(creep)

    expect(creep.harvest).toHaveBeenCalledWith(source)
  })

  test('コンテナがcontroller範囲外のときスキップする', () => {
    mockCache.getStorage.mockReturnValue(null)
    mockCache.getLinks.mockReturnValue([])
    mockCache.getDroppedResources.mockReturnValue([])
    const farContainer = {
      store: { [global.RESOURCE_ENERGY]: 150 },
      pos: { getRangeTo: jest.fn().mockReturnValue(10) }
    }
    mockCache.getContainers.mockReturnValue([farContainer])
    const source = { id: 's3' }
    mockCache.assignSource.mockReturnValue(source)

    const controller = {}
    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      harvest: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      withdraw: jest.fn(),
      pickup: jest.fn(),
      room: { controller }
    }

    upgrader.run(creep)

    expect(creep.harvest).toHaveBeenCalledWith(source)
  })

  test('コントローラーがないときgetEnergyでコンテナをスキップする', () => {
    mockCache.getStorage.mockReturnValue(null)
    mockCache.getLinks.mockReturnValue([])
    mockCache.getDroppedResources.mockReturnValue([])
    const container = { store: { [global.RESOURCE_ENERGY]: 150 } }
    mockCache.getContainers.mockReturnValue([container])
    const source = { id: 's4' }
    mockCache.assignSource.mockReturnValue(source)

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      harvest: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      withdraw: jest.fn(),
      pickup: jest.fn(),
      room: {}
    }

    upgrader.run(creep)

    expect(creep.harvest).toHaveBeenCalledWith(source)
  })

  test('ストレージからエネルギーをwithdrawできるときmoveToを呼ばない', () => {
    const storage = { store: { [global.RESOURCE_ENERGY]: 1500 } }
    mockCache.getStorage.mockReturnValue(storage)

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.OK), // ERR_NOT_IN_RANGE以外
      room: { controller: {} }
    }

    upgrader.run(creep)

    expect(creep.withdraw).toHaveBeenCalledWith(storage, global.RESOURCE_ENERGY)
    expect(pathfinder.moveTo).not.toHaveBeenCalled()
  })

  test('リンクからエネルギーをwithdrawできるときmoveToを呼ばない', () => {
    mockCache.getStorage.mockReturnValue(null)
    const link = { store: { [global.RESOURCE_ENERGY]: 500 } }
    mockCache.getLinks.mockReturnValue([link])

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.OK), // ERR_NOT_IN_RANGE以外
      room: { controller: {} },
      pos: { getRangeTo: jest.fn().mockReturnValue(1) }
    }

    upgrader.run(creep)

    expect(creep.withdraw).toHaveBeenCalledWith(link, global.RESOURCE_ENERGY)
    expect(pathfinder.moveTo).not.toHaveBeenCalled()
  })

  test('リンクからの取得で距離比較とcreep.posがない場合のフォールバック', () => {
    mockCache.getStorage.mockReturnValue(null)
    const link1 = { id: 'l1', store: { [global.RESOURCE_ENERGY]: 500 } }
    const link2 = { id: 'l2', store: { [global.RESOURCE_ENERGY]: 500 } }
    mockCache.getLinks.mockReturnValue([link1, link2])

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { controller: {} },
      pos: null // creep.posがnullの場合
    }

    upgrader.run(creep)

    expect(creep.withdraw).toHaveBeenCalledWith(link1, global.RESOURCE_ENERGY) // Infinity -> 0になって l1がセットされ、以後の要素も0になるが < ではないためl1のまま
  })

  test('コンテナからエネルギーをwithdrawできるときmoveToを呼ばない', () => {
    mockCache.getStorage.mockReturnValue(null)
    mockCache.getLinks.mockReturnValue([])
    const controller = { pos: { x: 5, y: 5 } }
    const container = {
      store: { [global.RESOURCE_ENERGY]: 200 },
      pos: { getRangeTo: jest.fn().mockReturnValue(3) }
    }
    mockCache.getContainers.mockReturnValue([container])

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.OK), // ERR_NOT_IN_RANGE以外
      room: { controller },
      pos: { getRangeTo: jest.fn().mockReturnValue(1) }
    }

    upgrader.run(creep)

    expect(creep.withdraw).toHaveBeenCalledWith(container, global.RESOURCE_ENERGY)
    expect(pathfinder.moveTo).not.toHaveBeenCalled()
  })

  test('コンテナからの取得でcreep.posがない場合のフォールバック', () => {
    mockCache.getStorage.mockReturnValue(null)
    mockCache.getLinks.mockReturnValue([])
    const controller = { pos: { x: 5, y: 5 } }
    const container1 = {
      id: 'c1',
      store: { [global.RESOURCE_ENERGY]: 200 },
      pos: { getRangeTo: jest.fn().mockReturnValue(3) }
    }
    const container2 = {
      id: 'c2',
      store: { [global.RESOURCE_ENERGY]: 300 },
      pos: { getRangeTo: jest.fn().mockReturnValue(2) }
    }
    mockCache.getContainers.mockReturnValue([container1, container2])

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { controller },
      pos: null // creep.posがnullの場合
    }

    upgrader.run(creep)

    expect(creep.withdraw).toHaveBeenCalledWith(container1, global.RESOURCE_ENERGY) // 最初に見つかったものが選ばれる
  })

  test('落下リソースをpickupできるときmoveToを呼ばない', () => {
    mockCache.getStorage.mockReturnValue(null)
    mockCache.getLinks.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    const drop = { resourceType: global.RESOURCE_ENERGY, amount: 80 }
    mockCache.getDroppedResources.mockReturnValue([drop])

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      pickup: jest.fn().mockReturnValue(global.OK), // ERR_NOT_IN_RANGE以外
      room: { controller: {} },
      pos: { getRangeTo: jest.fn().mockReturnValue(2) }
    }

    upgrader.run(creep)

    expect(creep.pickup).toHaveBeenCalledWith(drop)
    expect(pathfinder.moveTo).not.toHaveBeenCalled()
  })

  test('落下リソースで複数ある場合の距離判定とcreep.posのフォールバック', () => {
    mockCache.getStorage.mockReturnValue(null)
    mockCache.getLinks.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    const drop1 = { id: 'd1', resourceType: global.RESOURCE_ENERGY, amount: 80 }
    const drop2 = { id: 'd2', resourceType: global.RESOURCE_ENERGY, amount: 100 }
    mockCache.getDroppedResources.mockReturnValue([drop1, drop2])

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      pickup: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { controller: {} },
      pos: null // creep.posがnull
    }

    upgrader.run(creep)

    expect(creep.pickup).toHaveBeenCalledWith(drop1)
  })

  test('ソースから直接採掘でharvestできるときmoveToを呼ばない', () => {
    mockCache.getStorage.mockReturnValue(null)
    mockCache.getLinks.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    mockCache.getDroppedResources.mockReturnValue([])
    const source = { id: 's1' }
    mockCache.assignSource.mockReturnValue(source)

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      harvest: jest.fn().mockReturnValue(global.OK), // ERR_NOT_IN_RANGE以外
      withdraw: jest.fn(),
      pickup: jest.fn(),
      harvest: jest.fn(),
      room: { controller: {} }
    }

    upgrader.run(creep)

    expect(creep.harvest).toHaveBeenCalledWith(source)
    expect(pathfinder.moveTo).not.toHaveBeenCalled()
  })

  test('アップグレードでOKが返るがレベル8未満の場合はsayしない', () => {
    const controller = { id: 'c3', level: 7 } // レベル8未満
    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 20, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.OK),
      room: { controller }
    }

    upgrader.run(creep)

    expect(creep.say).not.toHaveBeenCalled() // 呼ばれないはず
  })

  test('リンクのエネルギーが200未満の場合スキップされる', () => {
    mockCache.getStorage.mockReturnValue(null)
    const link = { id: 'l_low', store: { [global.RESOURCE_ENERGY]: 199 } }
    mockCache.getLinks.mockReturnValue([link])

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      withdraw: jest.fn(),
      harvest: jest.fn(),
      room: { controller: {} },
      pos: { getRangeTo: jest.fn().mockReturnValue(1) }
    }

    upgrader.run(creep)

    expect(creep.withdraw).not.toHaveBeenCalledWith(link, global.RESOURCE_ENERGY)
  })

  test('落下リソースがエネルギーでない、または50未満の場合スキップされる', () => {
    mockCache.getStorage.mockReturnValue(null)
    mockCache.getLinks.mockReturnValue([])
    mockCache.getContainers.mockReturnValue([])
    const drop1 = { id: 'd_other', resourceType: 'mineral', amount: 100 }
    const drop2 = { id: 'd_low', resourceType: global.RESOURCE_ENERGY, amount: 49 }
    mockCache.getDroppedResources.mockReturnValue([drop1, drop2])

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      pickup: jest.fn(),
      harvest: jest.fn(),
      room: { controller: {} },
      pos: { getRangeTo: jest.fn().mockReturnValue(1) }
    }

    upgrader.run(creep)

    expect(creep.pickup).not.toHaveBeenCalled()
  })

  test('アップグレードでOK以外の値(ERR_NOT_ENOUGH_RESOURCES等)が返った場合はsayもmoveToもしない', () => {
    const controller = { id: 'c3', level: 8 }
    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 20, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(-6), // ERR_NOT_ENOUGH_RESOURCES
      room: { controller }
    }

    upgrader.run(creep)

    expect(creep.say).not.toHaveBeenCalledWith('✨ MAX')
    expect(pathfinder.moveTo).not.toHaveBeenCalled()
  })

  describe('ターゲットキャッシュの最適化 (Bolt Target Caching)', () => {
    beforeEach(() => {
      global.Game.getObjectById = jest.fn()
    })

    test('有効なキャッシュターゲットをそのまま使用して withdraw を呼び出す', () => {
      const cachedStorage = {
        id: 'storage_cached',
        structureType: 'storage',
        store: { [global.RESOURCE_ENERGY]: 5000 }
      }
      global.Game.getObjectById.mockReturnValue(cachedStorage)

      const creep = {
        memory: { working: false, targetId: 'storage_cached' },
        store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
        say: jest.fn(),
        withdraw: jest.fn().mockReturnValue(global.OK),
        room: { controller: {} }
      }

      upgrader.run(creep)

      expect(global.Game.getObjectById).toHaveBeenCalledWith('storage_cached')
      expect(creep.withdraw).toHaveBeenCalledWith(cachedStorage, global.RESOURCE_ENERGY)
      expect(creep.memory.targetId).toBe('storage_cached')
    })

    test('キャッシュターゲットが無効(エネルギー不足)な場合は削除して新規にターゲットを取得する', () => {
      const emptyStorage = {
        id: 'storage_cached',
        structureType: 'storage',
        store: { [global.RESOURCE_ENERGY]: 100 } // 1000未満
      }
      global.Game.getObjectById.mockReturnValue(emptyStorage)

      const freshStorage = {
        id: 'storage_fresh',
        structureType: 'storage',
        store: { [global.RESOURCE_ENERGY]: 2000 },
        pos: { x: 5, y: 5 }
      }
      mockCache.getStorage.mockReturnValue(freshStorage)

      const creep = {
        memory: { working: false, targetId: 'storage_cached' },
        store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
        say: jest.fn(),
        withdraw: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
        room: { controller: {} }
      }

      upgrader.run(creep)

      expect(global.Game.getObjectById).toHaveBeenCalledWith('storage_cached')
      expect(creep.memory.targetId).toBe('storage_fresh')
      expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, freshStorage, { range: 1 })
    })

    test('状態遷移時にターゲットキャッシュが削除される', () => {
      const controller = { id: 'c_trans', level: 3 }
      const creep = {
        memory: { working: false, targetId: 'storage_some' },
        store: {
          [global.RESOURCE_ENERGY]: 100,
          getCapacity: jest.fn().mockReturnValue(100)
        }, // 満タン
        say: jest.fn(),
        upgradeController: jest.fn().mockReturnValue(global.OK),
        room: { controller }
      }

      upgrader.run(creep)

      expect(creep.memory.working).toBe(true)
      expect(creep.memory.targetId).toBeUndefined() // 削除される
    })
  })
})
