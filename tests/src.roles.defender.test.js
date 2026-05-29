/**
 * src/roles/defender.js のユニットテスト
 */

global.Game = { creeps: {} };
global.Memory = {};
global.OK = 0;
global.ATTACK = 'attack';
global.RANGED_ATTACK = 'ranged_attack';
global.FIND_HOSTILE_CREEPS = 103;
global.HEAL = 'heal';
global.CLAIM = 'claim';
global.TOUGH = 'tough';
global.MOVE = 'move';
global.WORK = 'work';
global.CARRY = 'carry';
global.STRUCTURE_RAMPART = 'rampart';
global.ROOM_BOUNDS = { MIN: 0, MAX: 49 };
global.TERRAIN_MASK_WALL = 1;
global.RoomPosition = function (x, y, roomName) {
    this.x = x;
    this.y = y;
    this.roomName = roomName;
    this.getRangeTo = (t) => {
        const dx = (t.x ?? t.pos?.x ?? 0) - x;
        const dy = (t.y ?? t.pos?.y ?? 0) - y;
        return Math.max(Math.abs(dx), Math.abs(dy));
    };
};

const mockCache = {
    getEnemies: jest.fn(),
    getMyStructures: jest.fn(),
};

jest.mock('../src/utils/cache', () => mockCache);
jest.mock('../src/utils/pathfinder', () => ({
    moveTo: jest.fn(),
}));
jest.mock('../src/utils/logger', () => ({
    error: jest.fn(),
}));
jest.mock('../src/constants', () => ({
    MEMORY_KEYS: { WORKING: 'working' },
    ROOM_BOUNDS: { MIN: 0, MAX: 49 },
    LOG_LEVEL: { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, NONE: 4 },
    DEFAULT_LOG_LEVEL: 1,
    CACHE_TTL: { ENEMIES: 5 },
}));

const pathfinder = require('../src/utils/pathfinder');
const defender = require('../src/roles/defender');

describe('src/roles/defender', () => {
    beforeEach(() => {
        global.LOG_LEVEL = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
        global.FIND_HOSTILE_CREEPS = 103;
        global.ATTACK = 'attack';
        global.RANGED_ATTACK = 'ranged_attack';
        global.CLAIM = 'claim';
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('敵がいるとき攻撃し回復する', () => {
        const targetNear = {
            id: 'enemy1',
            hits: 50,
            hitsMax: 100,
            pos: { x: 10, y: 10 },
            getActiveBodyparts: jest.fn().mockReturnValue(1),
        };
        const targetFar = {
            id: 'enemy2',
            hits: 10,
            hitsMax: 100,
            pos: { x: 20, y: 20 },
            getActiveBodyparts: jest.fn().mockReturnValue(0),
        };
        mockCache.getEnemies.mockReturnValue([targetNear, targetFar]);

        const creep = {
            name: 'def1',
            hits: 50,
            hitsMax: 100,
            memory: {},
            room: { visual: { line: jest.fn() } },
            pos: new RoomPosition(11, 11, 'W0N0'),
            getActiveBodyparts: jest
                .fn()
                .mockImplementation((part) =>
                    part === global.RANGED_ATTACK || part === global.ATTACK || part === global.HEAL
                        ? 1
                        : 0
                ),
            rangedAttack: jest.fn(),
            attack: jest.fn(),
            heal: jest.fn(),
        };

        defender.run(creep);

        expect(creep.rangedAttack).toHaveBeenCalled();
        expect(creep.attack).toHaveBeenCalled();
        expect(creep.heal).toHaveBeenCalledWith(creep);
    });

    test('fleeFromでmoveToが例外を投げてもクラッシュしない', () => {
        // 敵が同じ位置（距離0）にいて、RANGED_ATTACKのみを持つ場合、逃走（_fleeFrom）が呼ばれる
        const target = {
            id: 'enemy_flee',
            hits: 50,
            hitsMax: 100,
            pos: new RoomPosition(10, 10, 'W0N0'),
            getActiveBodyparts: jest.fn().mockReturnValue(1),
        };
        mockCache.getEnemies.mockReturnValue([target]);

        const creep = {
            name: 'def_flee',
            hits: 100,
            hitsMax: 100,
            memory: {},
            room: { name: 'W0N0', visual: { line: jest.fn() } },
            pos: new RoomPosition(10, 10, 'W0N0'),
            getActiveBodyparts: jest.fn().mockImplementation((part) => {
                return part === global.RANGED_ATTACK ? 1 : 0;
            }),
            rangedAttack: jest.fn(),
            attack: jest.fn(),
            heal: jest.fn(),
        };

        // fleeFrom内のmoveToが例外を投げるようにモック化
        pathfinder.moveTo.mockImplementationOnce(() => {
            throw new Error('Position error');
        });

        // 例外がキャッチされ、クラッシュしないことを確認
        expect(() => defender.run(creep)).not.toThrow();
    });

    test('敵がいないときパトロールする', () => {
        mockCache.getEnemies.mockReturnValue([]);
        const rampart = { pos: { x: 5, y: 5 } };
        const creep = {
            memory: { patrolIndex: 0 },
            room: {
                name: 'W0N0',
                find: jest.fn().mockReturnValue([rampart]),
            },
            pos: {
                x: 5,
                y: 6,
                getRangeTo: jest.fn().mockReturnValue(1),
            },
        };
        mockCache.getEnemies.mockReturnValue([]);
        pathfinder.moveTo.mockReturnValue(global.OK);

        expect(() => defender.run(creep)).not.toThrow();
        expect(creep.memory.patrolIndex).toBe(0);
    });

    test('セーフモード判定が敵数と防衛数でtrueになる', () => {
        const room = {
            find: jest.fn().mockReturnValue([{}]),
            name: 'W0N0',
            controller: { my: true, safeMode: null, safeModeAvailable: 1 },
        };
        mockCache.getEnemies.mockReturnValue([
            { hitsMax: 100, getActiveBodyparts: jest.fn().mockReturnValue(1) },
            { hitsMax: 80, getActiveBodyparts: jest.fn().mockReturnValue(1) },
            { hitsMax: 60, getActiveBodyparts: jest.fn().mockReturnValue(1) },
        ]);
        global.Game.creeps = {
            d1: {
                room,
                memory: { role: 'harvester' },
                getActiveBodyparts: jest.fn().mockReturnValue(0),
            },
        };

        expect(defender.shouldActivateSafeMode(room)).toBe(true);
    });

    test('getBodyは遠距離型の構成を返す', () => {
        expect(defender.getBody(900, true)).toContain(global.RANGED_ATTACK);
        expect(defender.getBody(200, false)).toEqual([
            global.TOUGH,
            global.ATTACK,
            global.MOVE,
            global.MOVE,
        ]);
    });
});
