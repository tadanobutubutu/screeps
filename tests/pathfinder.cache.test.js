/**
 * src/utils/pathfinder.js の追加ユニットテスト
 */

global.TERRAIN_MASK_WALL = 1;
global.OK = 0;
global.FIND_STRUCTURES = 1;
global.FIND_MY_CONSTRUCTION_SITES = 2;
global.FIND_CREEPS = 3;
global.STRUCTURE_ROAD = 'road';
global.STRUCTURE_WALL = 'wall';
global.STRUCTURE_RAMPART = 'rampart';
global.STRUCTURE_CONTAINER = 'container';
global.STRUCTURE_LINK = 'link';
global.STRUCTURE_SPAWN = 'spawn';

class MockCostMatrix {
  constructor() {
    this.data = new Map();
  }
  set(x, y, val) {
    this.data.set(`${x},${y}`, val);
  }
  get(x, y) {
    return this.data.get(`${x},${y}`) || 0;
  }
}

jest.mock('../src/constants', () => ({
  PATHFINDER_DEFAULTS: {
    REUSE_PATH: 10,
    PLAIN_COST: 2,
    SWAMP_COST: 10,
    ROAD_COST: 1,
    MAX_ROOMS: 2,
  },
  CACHE_TTL: { PATH: 5 },
}), { virtual: true });

global.PathFinder = {
  search: jest.fn().mockReturnValue({ incomplete: false, path: [{ x: 1, y: 1 }, { x: 2, y: 2 }] }),
  CostMatrix: MockCostMatrix,
};

const pathfinder = require('../src/utils/pathfinder');

describe('pathfinder cache & movement', () => {
  beforeEach(() => {
    global.cache = {};
    jest.clearAllMocks();
    global.Game = {
      time: 1,
      rooms: {},
    };
  });

  test('buildCostMatrixがキャッシュを利用し、障害物コストを設定する', () => {
    const room = {
      getTerrain: jest.fn().mockReturnValue({ get: jest.fn().mockReturnValue(0) }),
      find: jest.fn((type) => {
        if (type === FIND_STRUCTURES) {
          return [
            { structureType: STRUCTURE_ROAD, pos: { x: 2, y: 2 } },
            { structureType: STRUCTURE_WALL, pos: { x: 3, y: 3 } },
            { structureType: STRUCTURE_RAMPART, pos: { x: 4, y: 4 }, my: false, isPublic: false },
            { structureType: STRUCTURE_CONTAINER, pos: { x: 5, y: 5 }, my: true },
          ];
        }
        if (type === FIND_MY_CONSTRUCTION_SITES) {
          return [{ structureType: STRUCTURE_SPAWN, pos: { x: 7, y: 7 } }];
        }
        if (type === FIND_CREEPS) {
          return [{ pos: { x: 6, y: 6 } }];
        }
        return [];
      }),
    };
    Game.rooms = { W0N0: room };

    const first = pathfinder.buildCostMatrix('W0N0', { avoidCreeps: true });
    Game.time = 3;
    const second = pathfinder.buildCostMatrix('W0N0', { avoidCreeps: true });

    expect(first).toBe(second);
    expect(first.get(2, 2)).toBe(1);
    expect(first.get(3, 3)).toBe(255);
    expect(first.get(6, 6)).toBe(255);
  });

  test('moveToがオプションを渡して移動する', () => {
    const creep = { moveTo: jest.fn().mockReturnValue(OK) };
    const target = { x: 5, y: 5 };

    const result = pathfinder.moveTo(creep, target, { avoidCreeps: true, range: 0 });

    expect(result).toBe(OK);
    expect(creep.moveTo).toHaveBeenCalledWith(target, expect.objectContaining({
      reusePath: expect.any(Number),
      maxRooms: 1,
      visualizePathStyle: expect.any(Object),
    }));
  });

  test('estimateDistanceがパス結果をキャッシュする', () => {
    const origin = { x: 1, y: 1, roomName: 'W0N0' };
    const goal = { x: 4, y: 4, roomName: 'W0N0' };

    Game.time = 20;
    const first = pathfinder.estimateDistance(origin, goal);
    Game.time = 21;
    const second = pathfinder.estimateDistance(origin, goal);

    expect(first).toBe(2);
    expect(second).toBe(2);
    expect(PathFinder.search).toHaveBeenCalledTimes(1);
  });
});
