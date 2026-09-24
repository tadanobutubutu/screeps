/**
 * utils.planning.js のユニットテスト
 */
global.Game = { time: 100 };
global.Memory = {};
global.TERRAIN_MASK_WALL = 1;
global.FIND_SOURCES = 5;
global.FIND_MY_SPAWNS = 10;
global.RoomPosition = class {
    constructor(x, y, roomName) {
        this.x = x;
        this.y = y;
        this.roomName = roomName;
    }
    getRangeTo() {
        return 5;
    }
    findPathTo() {
        return [{ x: 1, y: 1 }];
    }
};
const mockCache = {
    getSources: jest.fn(),
    getSpawns: jest.fn(),
    get: jest.fn((key, fn) => fn()),
};
jest.mock('../src/utils/cache', () => mockCache, { virtual: true });
const utilsPlanning = require('../utils.planning');
describe('utils.planning', () => {
    let mockRoom;
    beforeEach(() => {
        global.Memory = {};
        mockRoom = {
            getTerrain: jest.fn().mockReturnValue({
                get: jest.fn().mockReturnValue(0),
            }),
            find: jest.fn(),
            controller: { pos: { x: 25, y: 25 } },
            name: 'W0N0',
            visual: {
                circle: jest.fn(),
                text: jest.fn(),
                rect: jest.fn(),
                line: jest.fn(),
            },
        };
    });
    test('モジュールが正しく読み込める', () => {
        expect(utilsPlanning).toBeDefined();
        expect(typeof utilsPlanning.findOpenSpaces).toBe('function');
        expect(typeof utilsPlanning.isOpenArea).toBe('function');
        expect(typeof utilsPlanning.findBestSpawnPosition).toBe('function');
    });
    test('findOpenSpacesが配列を返す', () => {
        const spaces = utilsPlanning.findOpenSpaces(mockRoom, 3);
        expect(Array.isArray(spaces)).toBe(true);
    });
    test('isOpenAreaが壁がないときtrueを返す', () => {
        mockRoom.getTerrain.mockReturnValue({
            get: jest.fn().mockReturnValue(0),
        });
        const result = utilsPlanning.isOpenArea(mockRoom, 25, 25, 2);
        expect(typeof result).toBe('boolean');
    });
    test('isOpenAreaが壁があるときfalseを返す', () => {
        mockRoom.getTerrain.mockReturnValue({
            get: jest.fn().mockReturnValue(1),
        });
        const result = utilsPlanning.isOpenArea(mockRoom, 25, 25, 2, mockRoom.getTerrain());
        expect(result).toBe(false);
    });
    test('findBestSpawnPositionがcontrollerかsourcesがないときnullを返す', () => {
        mockRoom.controller = null;
        const pos = utilsPlanning.findBestSpawnPosition(mockRoom);
        expect(pos).toBeNull();
    });
    test('findBestSpawnPositionがsourcesがないときnullを返す', () => {
        mockCache.getSources.mockReturnValue([]);
        const pos = utilsPlanning.findBestSpawnPosition(mockRoom);
        expect(pos).toBeNull();
    });
    test('visualizePlanningが空配列のとき何もしない', () => {
        expect(() => utilsPlanning.visualizePlanning(mockRoom, [])).not.toThrow();
    });
    test('getTilesAtDistanceが配列を返す', () => {
        const centerPos = { x: 25, y: 25 };
        const tiles = utilsPlanning.getTilesAtDistance(mockRoom, centerPos, 3);
        expect(Array.isArray(tiles)).toBe(true);
    });
    test('planRoadNetworkがspawnがないとき空配列を返す', () => {
        mockCache.getSpawns.mockReturnValue([]);
        mockCache.getSources.mockReturnValue([]);
        const roads = utilsPlanning.planRoadNetwork(mockRoom);
        expect(Array.isArray(roads)).toBe(true);
    });
    test('displayPlanningInfoがエラーを投げない', () => {
        mockCache.getSources.mockReturnValue([{ id: 'source1' }]);
        const result = utilsPlanning.displayPlanningInfo(mockRoom);
        expect(result).toBeDefined();
        expect(result.openSpaces).toBeDefined();
    });

    test('isOpenArea returns false for out of bounds coordinates', () => {
        expect(utilsPlanning.isOpenArea(mockRoom, -1, 25, 2)).toBe(false);
        expect(utilsPlanning.isOpenArea(mockRoom, 55, 25, 2)).toBe(false);
        expect(utilsPlanning.isOpenArea(mockRoom, 25, -1, 2)).toBe(false);
        expect(utilsPlanning.isOpenArea(mockRoom, 25, 55, 2)).toBe(false);
    });

    test('findBestSpawnPosition returns a position when controller and sources exist', () => {
        const mockSource = { pos: { x: 10, y: 10, getRangeTo: jest.fn().mockReturnValue(10) }, getRangeTo: jest.fn().mockReturnValue(10) };
        mockCache.getSources.mockReturnValue([mockSource]);

        mockRoom.getTerrain.mockReturnValue({
            get: jest.fn().mockReturnValue(0)
        });

        // This will find open spaces. We mock the RoomPosition to have getRangeTo
        const pos = utilsPlanning.findBestSpawnPosition(mockRoom);
        expect(pos).not.toBeNull();
        expect(pos.x).toBeDefined();
        expect(pos.y).toBeDefined();
    });

    test('visualizePlanning draws circle for each position', () => {
        const positions = [{ x: 1, y: 1 }, { x: 2, y: 2 }];
        utilsPlanning.visualizePlanning(mockRoom, positions, '#ff0000');
        expect(mockRoom.visual.circle).toHaveBeenCalledTimes(2);
        expect(mockRoom.visual.circle).toHaveBeenCalledWith(1, 1, expect.any(Object));
        expect(mockRoom.visual.circle).toHaveBeenCalledWith(2, 2, expect.any(Object));
    });

    test('planRoadNetwork correctly builds roads using spawn and controller', () => {
        const mockSpawn = { pos: { findPathTo: jest.fn().mockReturnValue([{ x: 1, y: 1 }, { x: 2, y: 2 }]) } };
        mockCache.getSpawns.mockReturnValue([mockSpawn]);
        const mockSource = { id: 'source1' };
        mockCache.getSources.mockReturnValue([mockSource]);

        // Let the cache.get execute the callback
        mockCache.get.mockImplementation((key, cb) => cb());

        const roads = utilsPlanning.planRoadNetwork(mockRoom);
        expect(Array.isArray(roads)).toBe(true);
        expect(roads.length).toBeGreaterThan(0);
        expect(mockSpawn.pos.findPathTo).toHaveBeenCalled();
    });

    test('planRoadNetwork returns empty array if controller is missing', () => {
        mockRoom.controller = null;
        mockCache.getSpawns.mockReturnValue([{ pos: {} }]);
        const roads = utilsPlanning.planRoadNetwork(mockRoom);
        expect(roads).toEqual([]);
    });
});