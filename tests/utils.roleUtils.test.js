const roleUtils = require('../src/utils/roleUtils');
const cache = require('../src/utils/cache');
const pathfinder = require('../src/utils/pathfinder');
const { MEMORY_KEYS } = require('../src/constants');

jest.mock('../src/utils/cache', () => ({
    getStorage: jest.fn()
}));

jest.mock('../src/utils/pathfinder', () => ({
    moveTo: jest.fn()
}));

describe('roleUtils', () => {
    let creep, room;

    beforeEach(() => {
        global.ERR_NOT_IN_RANGE = -9;
        global.RESOURCE_ENERGY = 'energy';
        global.STRUCTURE_STORAGE = 'storage';
        global.Game = {
            getObjectById: jest.fn(),
            time: 1
        };

        creep = {
            memory: {},
            withdraw: jest.fn(),
            moveTo: jest.fn(),
            pos: {
                findClosestByRange: jest.fn()
            }
        };
        room = { name: 'W1N1' };

        jest.clearAllMocks();
    });

    afterEach(() => {
        delete global.ERR_NOT_IN_RANGE;
        delete global.RESOURCE_ENERGY;
        delete global.STRUCTURE_STORAGE;
        delete global.Game;
    });

    describe('getEnergyFromStorage', () => {
        it('should return false if no cached target and no storage in room', () => {
            cache.getStorage.mockReturnValue(null);
            expect(roleUtils.getEnergyFromStorage(creep, room)).toBe(false);
            expect(cache.getStorage).toHaveBeenCalledWith(room);
        });

        it('should return false if storage does not have minimum energy', () => {
            cache.getStorage.mockReturnValue({
                id: 'storage1',
                store: { energy: 400 } // less than default 500
            });
            expect(roleUtils.getEnergyFromStorage(creep, room)).toBe(false);
        });

        it('should withdraw from valid storage and set memory', () => {
            const storage = {
                id: 'storage1',
                store: { energy: 600 }
            };
            cache.getStorage.mockReturnValue(storage);
            creep.withdraw.mockReturnValue(0); // OK

            expect(roleUtils.getEnergyFromStorage(creep, room)).toBe(true);
            expect(creep.memory[MEMORY_KEYS.TARGET_ID]).toBe('storage1');
            expect(creep.withdraw).toHaveBeenCalledWith(storage, 'energy');
            expect(pathfinder.moveTo).not.toHaveBeenCalled();
        });

        it('should move to valid storage if not in range', () => {
            const storage = {
                id: 'storage1',
                store: { energy: 600 }
            };
            cache.getStorage.mockReturnValue(storage);
            creep.withdraw.mockReturnValue(-9); // ERR_NOT_IN_RANGE

            expect(roleUtils.getEnergyFromStorage(creep, room)).toBe(true);
            expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, storage, { range: 1 });
        });
    });

    describe('getHarvestTarget', () => {
        it('should return cached source if valid and has energy', () => {
            const source = { id: 's1', energy: 100 };
            creep.memory.harvestTargetId = 's1';
            global.Game.getObjectById.mockReturnValue(source);

            const result = roleUtils.getHarvestTarget(creep, [source]);

            expect(result).toBe(source);
            expect(creep.pos.findClosestByRange).not.toHaveBeenCalled();
            expect(creep.memory.harvestTargetId).toBe('s1');
        });

        it('should find closest source if no cached source', () => {
            const source = { id: 's2', energy: 100 };
            creep.pos.findClosestByRange.mockReturnValue(source);
            global.Game.getObjectById.mockReturnValue(null);

            const result = roleUtils.getHarvestTarget(creep, [source]);

            expect(result).toBe(source);
            expect(creep.pos.findClosestByRange).toHaveBeenCalledWith([source]);
            expect(creep.memory.harvestTargetId).toBe('s2');
        });

        it('should find closest source if cached source has no energy', () => {
            const emptySource = { id: 's1', energy: 0 };
            const fullSource = { id: 's2', energy: 100 };
            creep.memory.harvestTargetId = 's1';
            global.Game.getObjectById.mockReturnValue(emptySource);
            creep.pos.findClosestByRange.mockReturnValue(fullSource);

            const result = roleUtils.getHarvestTarget(creep, [emptySource, fullSource]);

            expect(result).toBe(fullSource);
            expect(creep.pos.findClosestByRange).toHaveBeenCalledWith([emptySource, fullSource]);
            expect(creep.memory.harvestTargetId).toBe('s2');
        });

        it('should clear memory and return null if no sources available', () => {
            creep.memory.harvestTargetId = 's1';
            global.Game.getObjectById.mockReturnValue(null);
            creep.pos.findClosestByRange.mockReturnValue(null);

            const result = roleUtils.getHarvestTarget(creep, []);

            expect(result).toBeNull();
            expect(creep.pos.findClosestByRange).toHaveBeenCalledWith([]);
            expect(creep.memory.harvestTargetId).toBeUndefined();
        });
    });
});
