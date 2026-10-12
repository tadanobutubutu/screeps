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

describe('roleUtils.getEnergyFromStorage', () => {
    let creep, room;

    beforeEach(() => {
        global.ERR_NOT_IN_RANGE = -9;
        global.RESOURCE_ENERGY = 'energy';
        global.STRUCTURE_STORAGE = 'storage';
        global.Game = {
            getObjectById: jest.fn()
        };

        creep = {
            memory: {},
            withdraw: jest.fn(),
            moveTo: jest.fn()
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

    it('should use cached target if valid', () => {
        creep.memory[MEMORY_KEYS.TARGET_ID] = 'cached_storage';
        const cachedStorage = {
            id: 'cached_storage',
            structureType: 'storage',
            store: { energy: 1000 }
        };
        global.Game.getObjectById.mockReturnValue(cachedStorage);
        creep.withdraw.mockReturnValue(0);

        expect(roleUtils.getEnergyFromStorage(creep, room)).toBe(true);
        expect(global.Game.getObjectById).toHaveBeenCalledWith('cached_storage');
        expect(creep.withdraw).toHaveBeenCalledWith(cachedStorage, 'energy');
        expect(cache.getStorage).not.toHaveBeenCalled();
    });

    it('should move to cached target if not in range', () => {
        creep.memory[MEMORY_KEYS.TARGET_ID] = 'cached_storage';
        const cachedStorage = {
            id: 'cached_storage',
            structureType: 'storage',
            store: { energy: 1000 }
        };
        global.Game.getObjectById.mockReturnValue(cachedStorage);
        creep.withdraw.mockReturnValue(-9); // ERR_NOT_IN_RANGE

        expect(roleUtils.getEnergyFromStorage(creep, room)).toBe(true);
        expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, cachedStorage, { range: 1 });
    });

    it('should fallback to cache lookup if cached target is invalid structure type', () => {
        creep.memory[MEMORY_KEYS.TARGET_ID] = 'invalid_storage';
        const invalidStorage = {
            id: 'invalid_storage',
            structureType: 'container', // not storage
            store: { energy: 1000 }
        };
        global.Game.getObjectById.mockReturnValue(invalidStorage);
        cache.getStorage.mockReturnValue(null);

        expect(roleUtils.getEnergyFromStorage(creep, room)).toBe(false);
        expect(cache.getStorage).toHaveBeenCalledWith(room);
    });

    it('should fallback to cache lookup if cached target lacks minimum energy', () => {
        creep.memory[MEMORY_KEYS.TARGET_ID] = 'empty_storage';
        const emptyStorage = {
            id: 'empty_storage',
            structureType: 'storage',
            store: { energy: 100 } // less than default 500
        };
        global.Game.getObjectById.mockReturnValue(emptyStorage);
        cache.getStorage.mockReturnValue(null);

        expect(roleUtils.getEnergyFromStorage(creep, room)).toBe(false);
        expect(cache.getStorage).toHaveBeenCalledWith(room);
    });

    it('should fallback to cache lookup if cached target does not exist', () => {
        creep.memory[MEMORY_KEYS.TARGET_ID] = 'missing_storage';
        global.Game.getObjectById.mockReturnValue(null);
        cache.getStorage.mockReturnValue(null);

        expect(roleUtils.getEnergyFromStorage(creep, room)).toBe(false);
        expect(cache.getStorage).toHaveBeenCalledWith(room);
    });

    it('should use custom minEnergy parameter', () => {
        const storage = {
            id: 'storage1',
            store: { energy: 200 } // less than default 500 but >= custom minEnergy
        };
        cache.getStorage.mockReturnValue(storage);
        creep.withdraw.mockReturnValue(0);

        expect(roleUtils.getEnergyFromStorage(creep, room, 150)).toBe(true);
        expect(creep.withdraw).toHaveBeenCalledWith(storage, 'energy');
    });

    it('should use custom targetKey parameter', () => {
        const customKey = 'customTarget';
        const storage = {
            id: 'storage1',
            store: { energy: 600 }
        };
        cache.getStorage.mockReturnValue(storage);
        creep.withdraw.mockReturnValue(0);

        expect(roleUtils.getEnergyFromStorage(creep, room, 500, customKey)).toBe(true);
        expect(creep.memory[customKey]).toBe('storage1');
        // Ensure default key was not set
        expect(creep.memory[MEMORY_KEYS.TARGET_ID]).toBeUndefined();
    });
});
