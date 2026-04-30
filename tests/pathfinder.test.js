/**
 * src/utils/pathfinder.js のユニットテスト
 */

// グローバル設定
global.Game = {
  time: 100,
  map: { getRoomTerrain: jest.fn() },
  rooms: {}
}
global.PathFinder = {
  search: jest.fn().mockReturnValue({
    path: [],
    ops: 100,
    cost: 50,
    incomplete: false
  })
}
global.TERRAIN_MASK_WALL = 1
global.OK = 0
global.RoomPosition = function (x, y, roomName) {
  this.x = x
  this.y = y
  this.roomName = roomName
}

jest.mock(
  '../src/constants',
  () => ({
    PATHFINDER_DEFAULTS: {
      REUSE_PATH: 20,
      PLAIN_COST: 2,
      SWAMP_COST: 10,
      ROAD_COST: 1,
      MAX_ROOMS: 1,
      MAX_SEARCH_RANGE: 10
    },
    CACHE_TTL: {
      PATH: 20
    }
  }),
  { virtual: true }
)

const pathfinder = require('../src/utils/pathfinder')

describe('pathfinder', () => {
  describe('findPath', () => {
    test('2点間のパスを見つける', () => {
      const from = { x: 25, y: 25, roomName: 'W1N1' }
      const to = { x: 30, y: 30, roomName: 'W1N1' }

      const result = pathfinder.findPath(from, to)

      expect(result).toBeDefined()
      expect(result.path).toBeDefined()
      expect(Array.isArray(result.path)).toBe(true)
    })

    test('オプションを指定してパスを見つける', () => {
      const from = { x: 25, y: 25, roomName: 'W1N1' }
      const to = { x: 30, y: 30, roomName: 'W1N1' }
      const options = { plainCost: 2, swampCost: 10 }

      const result = pathfinder.findPath(from, to, options)

      expect(result).toBeDefined()
    })
  })

  describe('findNearestOpenTile', () => {
    let mockRoom
    let pos

    beforeEach(() => {
      mockRoom = {
        name: 'W1N1',
        getTerrain: jest.fn().mockReturnValue({
          get: jest.fn().mockReturnValue(0)
        }),
        lookAtArea: jest.fn().mockReturnValue([])
      }
      global.Game.rooms.W1N1 = mockRoom
      pos = { x: 25, y: 25, roomName: 'W1N1' }
    })

    test('最も近い空きタイルを見つける', () => {
      const result = pathfinder.findNearestOpenTile(pos, 2)

      expect(result).toBeDefined()
      expect(result.x).toBe(23) // (25-2, 25-2) because nested loops start from -r
      expect(result.y).toBe(23)
      expect(mockRoom.lookAtArea).toHaveBeenCalled()
    })

    test('範囲制限 (MAX_SEARCH_RANGE) が適用される', () => {
      pathfinder.findNearestOpenTile(pos, 20)

      // range=20 but capped at 10. lookAtArea should be called with range 10.
      // top = 25 - 10 = 15
      // left = 25 - 10 = 15
      // bottom = 25 + 10 = 35
      // right = 25 + 10 = 35
      expect(mockRoom.lookAtArea).toHaveBeenCalledWith(15, 15, 35, 35, true)
    })

    test('障害物があるタイルは避ける', () => {
      // (23, 23) is blocked
      mockRoom.lookAtArea.mockReturnValue([{ x: 23, y: 23, type: 'creep' }])

      const result = pathfinder.findNearestOpenTile(pos, 2)

      expect(result).toBeDefined()
      // Should find (23, 24) or next available
      expect(result.x === 23 && result.y === 23).toBe(false)
    })
  })

  describe('closest', () => {
    test('最も近いオブジェクトを見つける', () => {
      const pos = { x: 25, y: 25, getRangeTo: jest.fn().mockReturnValue(5) }
      const objects = [
        { id: 'obj1', pos: { x: 30, y: 30 } },
        { id: 'obj2', pos: { x: 26, y: 26 } }
      ]

      pos.getRangeTo.mockImplementation((target) => {
        if (target.x === 26) {
          return 1
        }
        if (target.x === 30) {
          return 7
        }
        return 10
      })

      const result = pathfinder.closest(pos, objects)

      expect(result).toBeDefined()
    })

    test('オブジェクトがない場合はnullを返す', () => {
      const pos = { x: 25, y: 25, getRangeTo: jest.fn() }
      const objects = []

      const result = pathfinder.closest(pos, objects)

      expect(result).toBeNull()
    })
  })
})
