/**
 * role.harvester.js のユニットテスト
 */

global.Game = {
    time: 10,
    getObjectById: jest.fn().mockImplementation((id) => {
        if (id === 'source1') {
return { id: 'source1', pos: { x: 5, y: 5 } };
}
        if (id === 'spawn1') {
return {
                id: 'spawn1',
                structureType: 'spawn',
                store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            };
}
        return null;
    }),
};
global.Memory = { adaptive: { currentMode: 'normal' } };
global.RESOURCE_ENERGY = 'energy';
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.FIND_SOURCES_ACTIVE = 5;
global.FIND_STRUCTURES = 10;
global.FIND_MY_STRUCTURES = 11;
global.STRUCTURE_SPAWN = 'spawn';
global.STRUCTURE_EXTENSION = 'extension';
global.STRUCTURE_TOWER = 'tower';
global.STRUCTURE_LAB = 'lab';
global.STRUCTURE_CONTAINER = 'container';
global.RoomVisual = class {
    circle() {}
    text() {}
    rect() {}
    line() {}
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

const roleHarvester = require('../role.harvester');

describe('role.harvester', () => {
    test('モジュールが正しく読み込める', () => {
        expect(roleHarvester).toBeDefined();
        expect(typeof roleHarvester.run).toBe('function');
    });

    test('storeが満杯のときdeliverモードに切换わる', () => {
        const creep = {
            memory: { harvesting: true },
            store: { [global.RESOURCE_ENERGY]: 50, getFreeCapacity: jest.fn().mockReturnValue(0) },
            say: jest.fn(),
            harvest: jest.fn(),
            transfer: jest.fn(),
            moveTo: jest.fn(),
            upgradeController: jest.fn(),
            pos: {
                x: 1,
                y: 1,
                findClosestByRange: jest.fn().mockReturnValue(null),
            },
            room: {
                _activeSourcesTick: undefined,
                _activeSources: [{ id: 'source1', pos: { x: 5, y: 5 } }],
                _deliveryTargets: [],
                _harvesterDeliveryTargets: [],
                _containers: [],
                _allStructuresTick: undefined,
                _allStructures: [],
                find: jest.fn().mockReturnValue([]),
                controller: { pos: { x: 5, y: 5 } },
            },
        };

        roleHarvester.run(creep);
        expect(creep.memory.harvesting).toBe(false);
    });

    test('energyが0のときharvestingモードに切换わる', () => {
        const creep = {
            memory: { harvesting: false },
            store: { [global.RESOURCE_ENERGY]: 0, getFreeCapacity: jest.fn().mockReturnValue(50) },
            say: jest.fn(),
            harvest: jest.fn(),
            transfer: jest.fn(),
            moveTo: jest.fn(),
            upgradeController: jest.fn(),
            pos: {
                x: 1,
                y: 1,
                findClosestByRange: jest.fn().mockReturnValue(null),
            },
            room: {
                _activeSourcesTick: undefined,
                _activeSources: [{ id: 'source1', pos: { x: 5, y: 5 } }],
                _deliveryTargets: [],
                _harvesterDeliveryTargets: [],
                _containers: [],
                _allStructuresTick: undefined,
                _allStructures: [],
                find: jest.fn().mockReturnValue([]),
                controller: { pos: { x: 5, y: 5 } },
            },
        };

        roleHarvester.run(creep);
        expect(creep.memory.harvesting).toBe(true);
    });

    test('harvestingモードでソースがあるときharvestを呼ぶ', () => {
        const mockSource = { id: 'source1', pos: { x: 5, y: 5 } };
        const creep = {
            memory: { harvesting: true },
            store: { [global.RESOURCE_ENERGY]: 0, getFreeCapacity: jest.fn().mockReturnValue(50) },
            say: jest.fn(),
            harvest: jest.fn().mockReturnValue(global.OK),
            transfer: jest.fn(),
            moveTo: jest.fn(),
            upgradeController: jest.fn(),
            pos: {
                x: 1,
                y: 1,
                findClosestByRange: jest.fn().mockReturnValue(mockSource),
            },
            room: {
                _activeSourcesTick: undefined,
                _activeSources: [mockSource],
                _deliveryTargets: [],
                _harvesterDeliveryTargets: [],
                _containers: [],
                _allStructuresTick: undefined,
                _allStructures: [],
                find: jest.fn().mockReturnValue([mockSource]),
                controller: { pos: { x: 5, y: 5 } },
            },
        };

        roleHarvester.run(creep);
        expect(creep.harvest).toHaveBeenCalled();
    });

    test('deliverモードでターゲットがあるときtransferを呼ぶ', () => {
        const mockTarget = {
            id: 'spawn1',
            structureType: 'spawn',
            store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
        };
        const creep = {
            memory: { harvesting: false },
            store: { [global.RESOURCE_ENERGY]: 50, getFreeCapacity: jest.fn().mockReturnValue(0) },
            say: jest.fn(),
            harvest: jest.fn(),
            transfer: jest.fn().mockReturnValue(global.OK),
            moveTo: jest.fn(),
            upgradeController: jest.fn(),
            pos: {
                x: 1,
                y: 1,
                findClosestByRange: jest.fn().mockReturnValue(mockTarget),
            },
            room: {
                _activeSourcesTick: undefined,
                _activeSources: [],
                _deliveryTargets: [mockTarget],
                _harvesterDeliveryTargets: [mockTarget],
                _containers: [],
                _allStructuresTick: undefined,
                _allStructures: [],
                find: jest.fn().mockReturnValue([mockTarget]),
                controller: { pos: { x: 5, y: 5 } },
            },
        };

        roleHarvester.run(creep);
        expect(creep.transfer).toHaveBeenCalled();
    });
});
