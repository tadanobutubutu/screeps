/**
 * utils.defense.js のユニットテスト
 */

global.Memory = {};
global.FIND_MY_STRUCTURES = 20;
global.FIND_HOSTILE_CREEPS = 10;
global.FIND_STRUCTURES = 21; // changed from 20 to 21
global.STRUCTURE_TOWER = 'tower';
global.STRUCTURE_WALL = 'wall';
global.STRUCTURE_RAMPART = 'rampart';

global.Game = { time: 0 };
jest.mock('../src/utils/cache', () => ({
    getEnemies: jest.fn((room) => {
        return room.find(global.FIND_HOSTILE_CREEPS) || [];
    }),
    getMyStructures: jest.fn((room, type) => {
        const structures = room.find(global.FIND_MY_STRUCTURES) || [];
        return structures.filter((s) => s.structureType === type);
    }),
    getStructures: jest.fn((room) => {
        return room.find(global.FIND_STRUCTURES) || [];
    }),
}));

const DefenseManager = require('../utils.defense');

describe('utils.defense', () => {
    test('モジュールが正しく読み込める', () => {
        expect(DefenseManager).toBeDefined();
        expect(typeof DefenseManager.findTowerTargets).toBe('function');
        expect(typeof DefenseManager.getDefenseStatus).toBe('function');
    });

    test('findTowerTargetsがhostilesがいるときattackを呼ぶ', () => {
        const mockTower = { structureType: STRUCTURE_TOWER, attack: jest.fn() };
        const mockHostile = { id: 'hostile1' };
        const room = {
            find: jest.fn().mockImplementation((type) => {
                if (type === FIND_MY_STRUCTURES) {
                    return [mockTower];
                }
                if (type === FIND_HOSTILE_CREEPS) {
                    return [mockHostile];
                }
                if (type === FIND_STRUCTURES) {
                    return [];
                }
                return [];
            }),
        };

        DefenseManager.findTowerTargets(room);
        expect(mockTower.attack).toHaveBeenCalledWith(mockHostile);
    });

    test('findTowerTargetsがdamagedStructuresがあるときrepairを呼ぶ', () => {
        const mockTower = {
            structureType: STRUCTURE_TOWER,
            attack: jest.fn(),
            repair: jest.fn(),
        };
        const mockDamaged = { id: 'damaged1', hits: 50, hitsMax: 100, structureType: 'extension' };
        const room = {
            find: jest.fn().mockImplementation((type) => {
                if (type === FIND_MY_STRUCTURES) {
                    return [mockTower];
                }
                if (type === FIND_HOSTILE_CREEPS) {
                    return [];
                }
                if (type === FIND_STRUCTURES) {
                    return [mockDamaged];
                }
                return [];
            }),
        };

        DefenseManager.findTowerTargets(room);
        expect(mockTower.repair).toHaveBeenCalled();
    });

    test('getDefenseStatusがステータスを返す', () => {
        const mockTower = { structureType: 'tower' };
        const mockRampart = { structureType: 'rampart' };
        const room = {
            find: jest.fn().mockImplementation((type, options) => {
                if (type === FIND_MY_STRUCTURES) {
                    return [mockTower, mockRampart];
                }
                if (type === FIND_HOSTILE_CREEPS) {
                    return [];
                }
                return [];
            }),
        };

        const status = DefenseManager.getDefenseStatus(room);
        expect(status).toBeDefined();
        expect(status.towers).toBe(1);
        expect(status.hostiles).toBe(0);
        expect(status.ramparts).toBe(1);
        expect(status.underAttack).toBe(false);
    });

    test('findTowerTargetsが空配列を返されたときにエラーを投げない', () => {
        const room = {
            find: jest.fn().mockReturnValue([]),
        };

        expect(() => {
            DefenseManager.findTowerTargets(room);
        }).not.toThrow();
    });

    test('findTowerTargetsがtowerはあるがターゲットがないときに何もしない', () => {
        const mockTower = { structureType: STRUCTURE_TOWER, attack: jest.fn(), repair: jest.fn() };
        const room = {
            find: jest.fn().mockImplementation((type, options) => {
                if (type === FIND_MY_STRUCTURES) {
                    // Note: FIND_STRUCTURES is also 20 in this file
                    let items = [mockTower];
                    if (options && options.filter) {
                        return items.filter(options.filter);
                    }
                    return items;
                }
                return [];
            }),
        };

        DefenseManager.findTowerTargets(room);
        expect(mockTower.attack).not.toHaveBeenCalled();
        expect(mockTower.repair).not.toHaveBeenCalled();
    });
});
