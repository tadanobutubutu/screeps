const path = require('path');

// Mock fs BEFORE requiring the file
jest.mock('fs', () => ({
    readdirSync: jest.fn((dir) => {
        if (typeof dir === 'string') {
            if (dir.includes('workflows')) {
                return ['test-workflow.yml', 'invalid-workflow.yml', 'ignore.txt'];
            }
            if (dir.includes('/mock/root')) {
                return ['role.test1.js', 'role.test2.js', 'main.js', 'node_modules_file.js', 'README.md'];
            }
        }
        return [];
    }),
    readFileSync: jest.fn((filePath) => {
        if (typeof filePath === 'string') {
            if (filePath.includes('test-workflow.yml')) {
                return 'name: "Test Workflow"\non:\n  schedule:\n    - cron: "0 0 * * *"';
            }
            if (filePath.includes('invalid-workflow.yml')) {
                throw new Error('Read error');
            }
            if (filePath.includes('role.test1.js')) {
                return 'const a = 1;\nconst b = 2;';
            }
            if (filePath.includes('role.test2.js')) {
                return 'const c = 3;';
            }
            if (filePath.includes('main.js')) {
                return 'console.log("hello");\nconsole.log("world");';
            }
            if (filePath.includes('WORKFLOWS.md')) {
                return '# 🤖 Workflows\nThis is a test file.';
            }
        }
        return '';
    }),
    writeFileSync: jest.fn(),
    existsSync: jest.fn((filePath) => {
        if (typeof filePath === 'string' && filePath.includes('WORKFLOWS.md')) return true;
        return false;
    })
}));

const fs = require('fs');

describe('update-docs.js', () => {
    let originalConsoleLog;
    let originalCwd;

    beforeEach(() => {
        jest.clearAllMocks();

        originalConsoleLog = console.log;
        console.log = jest.fn();

        originalCwd = process.cwd;
        process.cwd = jest.fn().mockReturnValue('/mock/root');
    });

    afterEach(() => {
        console.log = originalConsoleLog;
        process.cwd = originalCwd;
    });

    it('should analyze repository and generate docs correctly', () => {
        // Since the script runs on import, we need to reset modules
        jest.isolateModules(() => {
            // Require the script which will execute it
            require('../scripts/update-docs.js');

            // Check file writes
            expect(fs.writeFileSync).toHaveBeenCalledTimes(3);

            const readmeWrite = fs.writeFileSync.mock.calls.find(call => call[0].includes('README.md'));
            expect(readmeWrite).toBeDefined();
            expect(readmeWrite[1]).toContain('[![Workflows](https://img.shields.io/badge/Workflows-2-green)]');
            expect(readmeWrite[1]).toContain('[![Roles](https://img.shields.io/badge/Roles-2-orange)]');
            expect(readmeWrite[1]).toContain('[![Lines](https://img.shields.io/badge/Lines-5-purple)]');

            const workflowsWrite = fs.writeFileSync.mock.calls.find(call => call[0].includes('WORKFLOWS.md'));
            expect(workflowsWrite).toBeDefined();
            expect(workflowsWrite[1]).toContain('📊 **統計**: 2個 of workflows');

            const statsWrite = fs.writeFileSync.mock.calls.find(call => call[0].includes('repo-stats.json'));
            expect(statsWrite).toBeDefined();
            const stats = JSON.parse(statsWrite[1]);
            expect(stats.workflows).toBe(2);
            expect(stats.roles).toBe(2);
            expect(stats.jsFiles).toBe(3);
            expect(stats.totalLines).toBe(5);
            expect(stats.workflowList).toHaveLength(2);
            expect(stats.workflowList[0].name).toBe('Test Workflow');
            expect(stats.workflowList[0].scheduled).toBe(true);
            expect(stats.workflowList[1].name).toBe('invalid-workflow.yml');
            expect(stats.workflowList[1].scheduled).toBe(false);
            expect(stats.roleList).toEqual(['test1', 'test2']);
        });
    });
});
