const fs = require('fs');
const crypto = require('crypto');

jest.mock('fs');
jest.mock('crypto', () => ({
    randomInt: jest.fn()
}));

describe('random-experiment.js', () => {
    let originalConsoleLog;
    let mockLog;
    let originalProcessExit;
    let mockExit;
    let originalConsoleError;
    let mockError;

    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();

        // Mock Date
        jest.useFakeTimers().setSystemTime(new Date('2023-01-01T00:00:00.000Z'));

        // Mock consoles
        originalConsoleLog = console.log;
        mockLog = jest.fn();
        console.log = mockLog;

        originalConsoleError = console.error;
        mockError = jest.fn();
        console.error = mockError;

        originalProcessExit = process.exit;
        mockExit = jest.fn();
        process.exit = mockExit;

        // Setup default mocks for required modules
        const localFs = require('fs');
        localFs.readFileSync.mockImplementation((path) => {
            if (path === 'main.js') return 'module.exports.loop = function() { }';
            return '';
        });
        localFs.writeFileSync.mockReturnValue();
    });

    afterEach(() => {
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
        process.exit = originalProcessExit;
        jest.useRealTimers();
    });

    test('should apply an experiment successfully if not already applied', () => {
        const localCrypto = require('crypto');
        localCrypto.randomInt.mockReturnValue(0);

        const mod = require('../scripts/random-experiment');
        const result = mod.runRandomExperiment();

        expect(result).toBe(true);
        expect(localCrypto.randomInt).toHaveBeenCalledWith(0, mod.experiments.length);

        const localFs = require('fs');
        expect(localFs.writeFileSync).toHaveBeenCalledTimes(2);

        const lastExperimentCall = localFs.writeFileSync.mock.calls.find(call => call[0] === 'last-experiment.json');
        expect(lastExperimentCall).toBeDefined();
        expect(JSON.parse(lastExperimentCall[1])).toEqual({
            experiment: 'add-performance-monitor',
            description: 'パフォーマンスモニタリングを追加',
            timestamp: '2023-01-01T00:00:00.000Z',
            status: 'applied'
        });

        expect(mockLog).toHaveBeenCalledWith(expect.stringContaining('Experiment applied successfully!'));
    });

    test('should skip if experiment is already applied', () => {
        const localCrypto = require('crypto');
        localCrypto.randomInt.mockReturnValue(0);

        const localFs = require('fs');
        localFs.readFileSync.mockImplementation((path) => {
            if (path === 'main.js') return 'module.exports.loop = function() { }\n// Performance Monitor';
            return '';
        });

        const mod = require('../scripts/random-experiment');
        const result = mod.runRandomExperiment();

        expect(result).toBe(false);
        expect(localFs.writeFileSync).toHaveBeenCalledTimes(1);

        expect(localFs.writeFileSync).toHaveBeenCalledWith('last-experiment.json', expect.any(String));
        const callArgs = localFs.writeFileSync.mock.calls[0];
        expect(JSON.parse(callArgs[1])).toEqual({
            experiment: 'add-performance-monitor',
            description: 'パフォーマンスモニタリングを追加',
            timestamp: '2023-01-01T00:00:00.000Z',
            status: 'skipped'
        });

        expect(mockLog).toHaveBeenCalledWith(expect.stringContaining('Experiment already exists or not applicable'));
    });

    test('should return false if selected experiment is undefined', () => {
        const localCrypto = require('crypto');
        localCrypto.randomInt.mockReturnValue(999);

        const mod = require('../scripts/random-experiment');
        const result = mod.runRandomExperiment();

        expect(result).toBe(false);
        expect(mockLog).toHaveBeenCalledWith(expect.stringContaining("No experiment selected"));
    });

    test('should skip if file read fails and apply throws', () => {
        const localCrypto = require('crypto');
        localCrypto.randomInt.mockReturnValue(0);

        const localFs = require('fs');
        localFs.readFileSync.mockImplementation(() => {
            throw new Error("File read error");
        });

        const mod = require('../scripts/random-experiment');
        const result = mod.runRandomExperiment();

        expect(result).toBe(false);
        expect(mockError).toHaveBeenCalledWith("Error applying experiment:", expect.any(Error));
    });

    describe('experiments application logic', () => {
        const cases = [
            { idx: 0, name: 'add-performance-monitor', checkString: 'Performance Monitor' },
            { idx: 1, name: 'optimize-pathfinding-cache', checkString: 'pathCache' },
            { idx: 2, name: 'improve-spawn-priority', checkString: 'spawnPriority' },
            { idx: 3, name: 'add-tower-optimization', checkString: 'towerTargeting' },
            { idx: 4, name: 'add-energy-efficiency', checkString: 'energyEfficiency' },
        ];

        test.each(cases)('experiment $idx: $name applies successfully', ({idx, name, checkString}) => {
            const mod = require('../scripts/random-experiment');
            const experiment = mod.experiments[idx];
            expect(experiment.name).toBe(name);

            const localFs = require('fs');

            localFs.readFileSync.mockImplementation((path) => {
                if (path === 'main.js') return 'module.exports.loop = function() { }';
                return '';
            });
            expect(experiment.apply()).toBe(true);
            expect(localFs.writeFileSync).toHaveBeenCalledWith('main.js', expect.any(String));

            localFs.readFileSync.mockImplementation((path) => {
                if (path === 'main.js') return `module.exports.loop = function() { }\n// ${checkString}`;
                return '';
            });
            expect(experiment.apply()).toBe(false);
        });
    });
});
