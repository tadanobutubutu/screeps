global._ = { sample: jest.fn((arr) => arr[0]) };
/**
 * role.scout.js のユニットテスト
 */

global.Game = {
    time: 10,
    map: {
        describeExits: jest.fn(),
        findExit: jest.fn(),
    },
};
global.Memory = {};
global.ERR_NO_PATH = -2;
global.ERR_INVALID_ARGS = -10;
global.FIND_HOSTILE_CREEPS = 10;
global.FIND_DROPPED_RESOURCES = 11;
global.FIND_STRUCTURES = 20;
global.RoomPosition = class {
    constructor(x, y, roomName) {
        this.x = x;
        this.y = y;
        this.roomName = roomName;
    }
};

jest.mock(
    '../gamification',
    () => ({
        trackAction: jest.fn(),
        addXP: jest.fn(),
    }),
    { virtual: true }
);

jest.mock(
    '../visual.effects',
    () => ({
        rainbowTrail: jest.fn(),
        particles: jest.fn(),
        scorePopup: jest.fn(),
        stars: jest.fn(),
    }),
    { virtual: true }
);

const roleScout = require('../role.scout');

describe('role.scout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('モジュールが正しく読み込める', () => {
        expect(roleScout).toBeDefined();
        expect(typeof roleScout.run).toBe('function');
    });

    test('出口がないとき何もしない', () => {
        global.Game.map.describeExits.mockReturnValue(null);
        const creep = {
            memory: {},
            room: { name: 'W0N0', findExitTo: jest.fn() },
            say: jest.fn(),
        };

        roleScout.run(creep);
        expect(creep.say).toHaveBeenCalledWith('⚠️');
    });

    test('出口があるときtargetRoomを設定する', () => {
        global.Game.map.describeExits.mockReturnValue({ TOP: 'W0N1', RIGHT: 'W0N2' });
        const creep = {
            memory: {},
            room: { name: 'W0N0', findExitTo: jest.fn() },
            say: jest.fn(),
            moveTo: jest.fn(),
        };

        roleScout.run(creep);
        expect(creep.memory.targetRoom).toBeDefined();
    });

    test('別の部屋のとき移動する', () => {
        global.Game.map.describeExits.mockReturnValue({ TOP: 'W0N1' });
        global.Game.map.findExit.mockReturnValue(1);
        const creep = {
            memory: { targetRoom: 'W0N1' },
            room: { name: 'W0N0', findExitTo: jest.fn().mockReturnValue(1) },
            say: jest.fn(),
            moveTo: jest.fn(),
        };

        roleScout.run(creep);
        expect(creep.moveTo).toHaveBeenCalled();
    });

    test('同じ部屋のときvisitedを記録する', () => {
        global.Game.map.describeExits.mockReturnValue({ TOP: 'W0N1' });
        global.Game.map.findExit.mockReturnValue(1);
        const creep = {
            memory: { targetRoom: 'W0N0', visited: {} },
            room: {
                name: 'W0N0',
                findExitTo: jest.fn(),
                find: jest.fn().mockReturnValue([]),
            },
            say: jest.fn(),
            moveTo: jest.fn(),
        };

        roleScout.run(creep);
        expect(creep.say).toHaveBeenCalledWith('🔍');
        expect(creep.memory.visited['W0N0']).toBeDefined();
    });

    test('picks a random exit securely when choosing target room', () => {
        global.Game.map.describeExits.mockReturnValue({ 1: 'W1N2', 3: 'W2N1' });

        // Mock Math.random to verify fallback doesn't throw and coverage hits
        const originalRandom = Math.random;
        Math.random = jest.fn().mockReturnValue(0.9);

        const creep = {
            memory: {},
            say: jest.fn(),
            moveTo: jest.fn(),
            room: { name: 'W1N1' },
            pos: { x: 25, y: 25 },
        };

        expect(() => roleScout.run(creep)).not.toThrow();
        expect(creep.memory.targetRoom).toBeDefined();
        expect(['W1N2', 'W2N1']).toContain(creep.memory.targetRoom);

        Math.random = originalRandom;
    });

    test('falls back to Math.random when crypto.randomBytes throws an error', () => {
        global.Game.map.describeExits.mockReturnValue({ 1: 'W1N2', 3: 'W2N1' });

        // Mock crypto to throw an error
        const crypto = require('crypto');
        const originalRandomBytes = crypto.randomBytes;
        const originalRandomInt = crypto.randomInt;
        crypto.randomInt = jest.fn().mockImplementation(() => {
            throw new Error('Simulated crypto error');
        });
        crypto.randomBytes = jest.fn().mockImplementation(() => {
            throw new Error('Simulated crypto error');
        });

        const originalRandom = Math.random;
        Math.random = jest.fn().mockReturnValue(0.9);

        const creep = {
            memory: {},
            say: jest.fn(),
            moveTo: jest.fn(),
            room: { name: 'W1N1' },
            pos: { x: 25, y: 25 },
        };

        expect(() => roleScout.run(creep)).not.toThrow();
        expect(creep.memory.targetRoom).toBeDefined();
        expect(['W1N2', 'W2N1']).toContain(creep.memory.targetRoom);
        expect(Math.random).toHaveBeenCalled(); // Verify fallback was reached

        Math.random = originalRandom;
        crypto.randomBytes = originalRandomBytes;
        crypto.randomInt = originalRandomInt;
    });

    test('falls back to Math.random when require("crypto") throws an error', () => {
        global.Game.map.describeExits.mockReturnValue({ 1: 'W1N2', 3: 'W2N1' });

        // Force require('crypto') to throw by using jest.doMock
        jest.resetModules();
        jest.doMock('crypto', () => {
            throw new Error('Simulated module not found');
        });

        // Re-require the module under test so it uses the mocked crypto
        const roleScoutMocked = require('../role.scout');

        const originalRandom = Math.random;
        Math.random = jest.fn().mockReturnValue(0.9);

        const creep = {
            memory: {},
            say: jest.fn(),
            moveTo: jest.fn(),
            room: { name: 'W1N1' },
            pos: { x: 25, y: 25 },
        };

        expect(() => roleScoutMocked.run(creep)).not.toThrow();
        expect(creep.memory.targetRoom).toBeDefined();
        expect(['W1N2', 'W2N1']).toContain(creep.memory.targetRoom);
        expect(Math.random).toHaveBeenCalled(); // Verify fallback was reached

        Math.random = originalRandom;

        // Cleanup
        jest.dontMock('crypto');
        jest.resetModules();
    });
});
