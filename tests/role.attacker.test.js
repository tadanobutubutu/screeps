/**
 * role.attacker.js のユニットテスト
 */

global.Game = {
    flags: {},
};
global.Memory = {};
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.FIND_MY_CREEPS = 1;
global.FIND_HOSTILE_CREEPS = 2;
global.FIND_HOSTILE_STRUCTURES = 3;
global.HEAL = 'heal';
global.STRUCTURE_INVADER_CORE = 'invaderCore';
global.STRUCTURE_TOWER = 'tower';
global.STRUCTURE_SPAWN = 'spawn';

const roleAttacker = require('../role.attacker');

describe('role.attacker', () => {
    let mockCreep;

    beforeEach(() => {
        global.Game.flags = {};
        global.Game.getObjectById = jest.fn();
        mockCreep = {
            hits: 100,
            hitsMax: 100,
            memory: {},
            attack: jest.fn().mockReturnValue(global.OK),
            moveTo: jest.fn().mockReturnValue(global.OK),
            pos: {
                findClosestByRange: jest.fn(),
            },
            room: {
                controller: { id: 'controller1' },
                find: jest.fn().mockReturnValue([]),
            },
        };
    });

    test('モジュールが正しく読み込める', () => {
        expect(roleAttacker).toBeDefined();
        expect(typeof roleAttacker.run).toBe('function');
    });

    test('hits < 50% && HEAL available -> moveTo HEAL', () => {
        mockCreep.hits = 40;
        const healTarget = { getActiveBodyparts: jest.fn().mockReturnValue(1) };
        mockCreep.pos.findClosestByRange.mockImplementation((type, opts) => {
            if (type === global.FIND_MY_CREEPS) {
                if (opts && opts.filter(healTarget)) {
                    return healTarget;
                }
            }
            return null;
        });

        roleAttacker.run(mockCreep);

        expect(mockCreep.moveTo).toHaveBeenCalledWith(healTarget, expect.any(Object));
        expect(mockCreep.attack).not.toHaveBeenCalled();
    });

    test('Priority 1: Attack hostile creeps in range', () => {
        const hostileCreep = { id: 'enemy', room: { name: 'W1N1' } };
        mockCreep.room.name = 'W1N1';
        mockCreep.room.find.mockReturnValue([hostileCreep]);
        mockCreep.pos.findClosestByRange.mockImplementation((type) => {
            if (type === global.FIND_HOSTILE_CREEPS || Array.isArray(type)) return hostileCreep;
            return null;
        });

        roleAttacker.run(mockCreep);

        expect(mockCreep.attack).toHaveBeenCalledWith(hostileCreep);
        expect(mockCreep.moveTo).not.toHaveBeenCalled();
    });

    test('Priority 1: Move to hostile creeps out of range', () => {
        const hostileCreep = { id: 'enemy', room: { name: 'W1N1' } };
        mockCreep.room.name = 'W1N1';
        mockCreep.room.find.mockReturnValue([hostileCreep]);
        mockCreep.attack.mockReturnValue(global.ERR_NOT_IN_RANGE);
        mockCreep.pos.findClosestByRange.mockImplementation((type) => {
            if (type === global.FIND_HOSTILE_CREEPS || Array.isArray(type)) return hostileCreep;
            return null;
        });

        roleAttacker.run(mockCreep);

        expect(mockCreep.attack).toHaveBeenCalledWith(hostileCreep);
        expect(mockCreep.moveTo).toHaveBeenCalledWith(hostileCreep, expect.any(Object));
    });

    test('Priority 2: Attack hostile structures in range', () => {
        const hostileStructure = { structureType: global.STRUCTURE_TOWER };
        mockCreep.pos.findClosestByRange.mockImplementation((type, opts) => {
            if (type === global.FIND_HOSTILE_STRUCTURES && opts.filter(hostileStructure))
                return hostileStructure;
            return null;
        });

        roleAttacker.run(mockCreep);

        expect(mockCreep.attack).toHaveBeenCalledWith(hostileStructure);
        expect(mockCreep.moveTo).not.toHaveBeenCalled();
    });

    test('Priority 2: Move to hostile structures out of range', () => {
        const hostileStructure = { structureType: global.STRUCTURE_SPAWN };
        mockCreep.attack.mockReturnValue(global.ERR_NOT_IN_RANGE);
        mockCreep.pos.findClosestByRange.mockImplementation((type, opts) => {
            if (type === global.FIND_HOSTILE_STRUCTURES && opts.filter(hostileStructure))
                return hostileStructure;
            return null;
        });

        roleAttacker.run(mockCreep);

        expect(mockCreep.attack).toHaveBeenCalledWith(hostileStructure);
        expect(mockCreep.moveTo).toHaveBeenCalledWith(hostileStructure, expect.any(Object));
    });

    test('Priority 3: Patrol flag', () => {
        const flag = { name: 'Attack' };
        global.Game.flags['Attack'] = flag;
        mockCreep.pos.findClosestByRange.mockReturnValue(null);

        roleAttacker.run(mockCreep);

        expect(mockCreep.moveTo).toHaveBeenCalledWith(flag, expect.any(Object));
        expect(mockCreep.attack).not.toHaveBeenCalled();
    });

    test('Priority 3: Patrol to room controller when idle and no flag', () => {
        mockCreep.pos.findClosestByRange.mockReturnValue(null);

        roleAttacker.run(mockCreep);

        expect(mockCreep.moveTo).toHaveBeenCalledWith(
            mockCreep.room.controller,
            expect.any(Object)
        );
        expect(mockCreep.attack).not.toHaveBeenCalled();
    });
});
