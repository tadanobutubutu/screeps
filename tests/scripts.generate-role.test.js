const crypto = require('crypto');
const fs = require('fs');

jest.mock('crypto', () => ({
    randomInt: jest.fn(),
}));

describe('generate-role.js', () => {
    let originalExit;
    let readdirSyncSpy;
    let writeFileSyncSpy;

    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();

        // Mock process.exit
        originalExit = process.exit;

        // When process.exit is called, throw an error to stop execution
        // We will catch it in the test
        process.exit = jest.fn().mockImplementation((code) => {
            throw new Error(`process.exit: ${code}`);
        });

        // Spy on fs methods
        readdirSyncSpy = jest.spyOn(fs, 'readdirSync');
        writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

        // Mock console.log to keep test output clean
        jest.spyOn(console, 'log').mockImplementation(() => {});

        // Set fixed date for deterministic tests
        jest.useFakeTimers().setSystemTime(new Date('2023-01-01T00:00:00.000Z'));
    });

    afterEach(() => {
        process.exit = originalExit;
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    test('should exit and write report when all templates already exist', () => {
        // Mock fs.readdirSync to return an array of strings
        readdirSyncSpy.mockReturnValue([
            'role.defender.js',
            'role.miner.js',
            'role.claimer.js',
            'role.remoteHarvester.js',
            'role.healer.js',
            'role.scout.js',
            'role.powerHarvester.js',
            'other.js'
        ]);

        expect(() => {
            require('../scripts/generate-role.js');
        }).toThrow('process.exit: 0');

        expect(readdirSyncSpy).toHaveBeenCalledWith('.');
        expect(console.log).toHaveBeenCalledWith('✅ All role templates already exist!');

        expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
        expect(writeFileSyncSpy).toHaveBeenCalledWith(
            'last-role-creation.json',
            expect.stringContaining('"description": "All templates exist"')
        );
        expect(process.exit).toHaveBeenCalledWith(0);
    });

    test('should create a new role and write report when templates are available', () => {
        readdirSyncSpy.mockReturnValue([
            'role.defender.js',
            'role.claimer.js'
        ]);

        const cryptoMock = require('crypto');
        cryptoMock.randomInt.mockReturnValue(0);

        require('../scripts/generate-role.js');

        expect(readdirSyncSpy).toHaveBeenCalledWith('.');

        expect(cryptoMock.randomInt).toHaveBeenCalled();

        expect(writeFileSyncSpy).toHaveBeenCalledTimes(2);

        expect(writeFileSyncSpy).toHaveBeenCalledWith(
            expect.stringMatching(/^role\..+\.js$/),
            expect.any(String)
        );

        expect(writeFileSyncSpy).toHaveBeenCalledWith(
            'last-role-creation.json',
            expect.stringContaining('"remaining"')
        );

        expect(process.exit).not.toHaveBeenCalled();
    });
});
