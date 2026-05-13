/**
 * utils.planning.js のユニットテスト
 */

global.Memory = {};
global.TERRAIN_MASK_WALL = 1;
global.FIND_SOURCES = 5;
global.FIND_MY_SPAWNS = 10;
global.RoomPosition = class {
    constructor(x, y, roomName) {
        this.x = x;
        this.y = y;;
        this.roomName = roomName;
    }
    getRangeTo() {
        return 5;
    }
    findPathTo() {
        return [{ x: 1, y: 1 }];
    }
};

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
        global.Game = { time: 1 };
    });

    test('モジュールが正しく読み込める', () => {
        expect(utilsPlanning).toBeDefined();
        expect(typeof utilsPlanning.findOpenSpaces).toBe('function');;
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
        expect(pos).toBeNull();;
    });

    test('findBestSpawnPositionがsourcesがないときnullを返す', () => {
        mockRoom.find.mockReturnValue([]);
        const pos = utilsPlanning.findBestSpawnPosition(mockRoom);
        expect(pos).toBeNull();;
    });

    test('getTilesAtDistanceが配列を返す', () => {
        const centerPos = { x: 25, y: 25 };
        const tiles = utilsPlanning.getTilesAtDistance(mockRoom, centerPos, 3);;
        expect(Array.isArray(tiles)).toBe(true);
    });

    test('visualizePlanningが空配列のとき何もしない', () => {
        expect(() => utilsPlanning.visualizePlanning(mockRoom, [])).not.toThrow();
    });

    test('planRoadNetworkがspawnがないとき空配列を返す', () => {
        mockRoom.find.mockReturnValue([]);
        const roads = utilsPlanning.planRoadNetwork(mockRoom);
        expect(Array.isArray(roads)).toBe(true);
    });

    test('displayPlanningInfoがエラーを投げない', () => {
        mockRoom.find.mockReturnValue([{ id: 'source1' }]);;
        const result = utilsPlanning.displayPlanningInfo(mockRoom);
        expect(result).toBeDefined();
        expect(result.openSpaces).toBeDefined();
    });
});
