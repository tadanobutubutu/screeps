const DashboardRenderer = require('../utils.dashboard');

describe('DashboardRenderer', () => {
    let mockRoom;
    let mockGame;

    beforeEach(() => {
        global.RESOURCE_ENERGY = 'energy';
        global.FIND_MY_CREEPS = 1;
        global.FIND_MY_STRUCTURES = 2;
        global.FIND_HOSTILE_CREEPS = 3;

        mockRoom = {
            find: jest.fn().mockReturnValue([]),
            energyAvailable: 1000,
            energyCapacityAvailable: 2000,
            storage: {
                store: {
                    getCapacity: jest.fn().mockReturnValue(1000000),
                    [RESOURCE_ENERGY]: 500000
                }
            },
            name: 'W1N1',
            controller: {
                level: 5,
                progress: 5000,
                progressTotal: 10000
            },
            visual: {
                rect: jest.fn(),
                text: jest.fn()
            }
        };

        global.Game = {
            time: 12345,
            gcl: {
                level: 3,
                progress: 10000,
                progressTotal: 20000
            },
            cpu: {
                bucket: 9000,
                getUsed: jest.fn().mockReturnValue(1.23)
            }
        };

        global.Memory = {
            adaptive: {
                currentMode: 2
            }
        };
    });

    test('renderRoomDashboard includes enhanced data fields', () => {
        const info = DashboardRenderer.renderRoomDashboard(mockRoom);

        expect(info.storagePercent).toBe(50);
        expect(info.tick).toBe(12345);
        expect(info.energyPercent).toBe(50);
    });

    test('displayVisuals uses correct colors and text', () => {
        DashboardRenderer.displayVisuals(mockRoom);

        // Verify white color for creeps info (called twice for the two lines)
        expect(mockRoom.visual.text).toHaveBeenCalledWith(
            expect.stringContaining('👥'),
            expect.any(Number),
            expect.any(Number),
            expect.objectContaining({ color: '#ffffff' })
        );

        // Verify tick is displayed in CPU line
        expect(mockRoom.visual.text).toHaveBeenCalledWith(
            expect.stringContaining('Tick: 12345'),
            expect.any(Number),
            expect.any(Number),
            expect.objectContaining({ font: 0.4 })
        );

        // Verify GCL color is blue
        expect(mockRoom.visual.text).toHaveBeenCalledWith(
            expect.stringContaining('GCL: 3 (50%)'),
            expect.any(Number),
            expect.any(Number),
            expect.objectContaining({ color: '#00aaff' })
        );

        // Verify storage percent is displayed with warning color (50%)
        expect(mockRoom.visual.text).toHaveBeenCalledWith(
            expect.stringContaining('Storage: 500.0K (50%)'),
            expect.any(Number),
            expect.any(Number),
            expect.objectContaining({ color: '#ffff00' })
        );
    });
});
