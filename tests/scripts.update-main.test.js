const fs = require('fs');

describe('scripts/update-main.js', () => {
    let mockExit;
    let mockConsoleLog;
    let mockExistsSync;
    let mockReadFileSync;
    let mockWriteFileSync;

    let { updateMain } = require('../scripts/update-main.js');

    beforeEach(() => {
        mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
            throw new Error(`Process.exit: ${code}`);
        });
        mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
        mockExistsSync = jest.spyOn(fs, 'existsSync');
        mockReadFileSync = jest.spyOn(fs, 'readFileSync');
        mockWriteFileSync = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('exits if last-role-creation.json does not exist', () => {
        mockExistsSync.mockReturnValue(false);
        expect(() => {
            updateMain();
        }).toThrow('Process.exit: 0');
        expect(mockConsoleLog).toHaveBeenCalledWith('No new role created');
        expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('exits if last-role-creation.json exists but no role is defined', () => {
        mockExistsSync.mockReturnValue(true);
        mockReadFileSync.mockImplementation((path) => {
            if (path === 'last-role-creation.json') {
                return JSON.stringify({ someData: 'but no role' });
            }
            return '';
        });

        expect(() => {
            updateMain();
        }).toThrow('Process.exit: 0');

        expect(mockConsoleLog).toHaveBeenCalledWith('No new role generated');
        expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('does not modify main.js if the role is already imported', () => {
        mockExistsSync.mockReturnValue(true);
        mockReadFileSync.mockImplementation((path) => {
            if (path === 'last-role-creation.json') {
                return JSON.stringify({ role: 'miner' });
            }
            if (path === 'main.js') {
                return "const roleMiner = require('role.miner');\n// some other code";
            }
            return '';
        });

        updateMain();

        expect(mockConsoleLog).toHaveBeenCalledWith('Role already imported in main.js');
        expect(mockWriteFileSync).not.toHaveBeenCalled();
    });

    it('inserts role require after the first existing role require (due to findIndex behavior)', () => {
        mockExistsSync.mockReturnValue(true);
        mockReadFileSync.mockImplementation((path) => {
            if (path === 'last-role-creation.json') {
                return JSON.stringify({ role: 'builder' });
            }
            if (path === 'main.js') {
                return "const roleMiner = require('role.miner');\nconst roleUpgrader = require('role.upgrader');\n\nmodule.exports.loop = function () {}";
            }
            return '';
        });

        updateMain();

        expect(mockConsoleLog).toHaveBeenCalledWith('✅ Added builder import to main.js');
        expect(mockWriteFileSync).toHaveBeenCalledWith('main.js', "const roleMiner = require('role.miner');\nconst roleBuilder = require('role.builder');\nconst roleUpgrader = require('role.upgrader');\n\nmodule.exports.loop = function () {}");
    });

    it('inserts role require at the top if no existing role require is found', () => {
        mockExistsSync.mockReturnValue(true);
        mockReadFileSync.mockImplementation((path) => {
            if (path === 'last-role-creation.json') {
                return JSON.stringify({ role: 'builder' });
            }
            if (path === 'main.js') {
                return "module.exports.loop = function () {}";
            }
            return '';
        });

        updateMain();

        expect(mockConsoleLog).toHaveBeenCalledWith('✅ Added builder import to main.js');
        expect(mockWriteFileSync).toHaveBeenCalledWith('main.js', "const roleBuilder = require('role.builder');\nmodule.exports.loop = function () {}");
    });
});
