const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const os = require('os');

jest.mock('fs');
jest.mock('child_process', () => ({
    execSync: jest.fn()
}));
jest.mock('os', () => ({
    tmpdir: jest.fn(() => '/tmp')
}));
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(process, 'exit').mockImplementation(() => {});

describe('check_repo_health', () => {
    let check_repo_health;
    let originalEnv;
    let pathJoinSpy;

    beforeEach(() => {
        originalEnv = { ...process.env };
        process.env.COVERAGE_THRESHOLD = '100';

        // Mock path.join to ensure we don't hit path.join(undefined)
        pathJoinSpy = jest.spyOn(path, 'join').mockImplementation((...args) => {
            return args.filter(Boolean).join('/');
        });

        fs.existsSync.mockReturnValue(false);
        fs.mkdtempSync.mockReturnValue('/tmp/repo-health-123');
        fs.readFileSync.mockReturnValue('{"key": "value"}');
        fs.rmSync.mockImplementation(() => {});
        fs.writeFileSync.mockImplementation(() => {});
        child_process.execSync.mockReturnValue(Buffer.from('success'));

        jest.isolateModules(() => {
            check_repo_health = require('../scripts/check_repo_health.js');
        });
        check_repo_health.report.issues = [];
        check_repo_health.report.status = 'healthy';
    });

    afterEach(() => {
        process.env = originalEnv;
        pathJoinSpy.mockRestore();
    });

    describe('addIssue', () => {
        it('should add an issue and set status to unhealthy', () => {
            check_repo_health.addIssue({ type: 'test' });
            expect(check_repo_health.report.status).toBe('unhealthy');
            expect(check_repo_health.report.issues).toHaveLength(1);
            expect(check_repo_health.report.issues[0]).toEqual({ type: 'test' });
        });
    });

    describe('runCommand', () => {
        it('should return ok: true when command succeeds', () => {
            child_process.execSync.mockReturnValueOnce(Buffer.from('success'));
            const result = check_repo_health.runCommand('echo "success"');
            expect(result).toEqual({ ok: true });
        });

        it('should return ok: false and error details when command fails', () => {
            const error = new Error('Command failed');
            error.stdout = 'stdout out';
            error.stderr = 'stderr out';
            child_process.execSync.mockImplementationOnce(() => { throw error; });

            const result = check_repo_health.runCommand('badcommand');
            expect(result).toEqual({
                ok: false,
                stdout: 'stdout out',
                stderr: 'stderr out',
                message: 'Command failed'
            });
        });
    });

    describe('readJsonFile', () => {
        it('should return null if file does not exist', () => {
            fs.existsSync.mockReturnValueOnce(false);
            const result = check_repo_health.readJsonFile('file.json');
            expect(result).toBeNull();
        });

        it('should return parsed JSON if file exists', () => {
            fs.existsSync.mockReturnValueOnce(true);
            fs.readFileSync.mockReturnValueOnce('{"key": "value"}');
            const result = check_repo_health.readJsonFile('file.json');
            expect(result).toEqual({ key: 'value' });
        });

        it('should return null if JSON parsing fails', () => {
            fs.existsSync.mockReturnValueOnce(true);
            fs.readFileSync.mockReturnValueOnce('invalid json');
            const result = check_repo_health.readJsonFile('file.json');
            expect(result).toBeNull();
        });
    });

    describe('main', () => {
        it('should run successfully with no issues', () => {
            child_process.execSync.mockReturnValue(Buffer.from('success'));
            fs.existsSync.mockImplementation((file) => {
                if (!file) return false;
                if (file.endsWith('eslint.json')) return true;
                if (file.endsWith('jest.json')) return true;
                if (file.endsWith('coverage-summary.json')) return true;
                return false;
            });

            fs.readFileSync.mockImplementation((file) => {
                if (file.endsWith('eslint.json')) return '[]';
                if (file.endsWith('jest.json')) return '{"testResults": []}';
                if (file.endsWith('coverage-summary.json')) return JSON.stringify({
                    "total": {},
                    "src/file.js": {
                        "lines": { "pct": 100 },
                        "statements": { "pct": 100 },
                        "functions": { "pct": 100 },
                        "branches": { "pct": 100 }
                    }
                });
                return '';
            });

            check_repo_health.main();

            expect(check_repo_health.report.status).toBe('healthy');
            expect(check_repo_health.report.issues).toHaveLength(0);
            expect(process.exit).toHaveBeenCalledWith(0);
        });

        it('should report eslint issues', () => {
            child_process.execSync.mockReturnValue(Buffer.from('success'));
            fs.existsSync.mockImplementation((file) => {
                if (!file) return false;
                if (file.endsWith('eslint.json')) return true;
                return false;
            });

            fs.readFileSync.mockImplementation((file) => {
                if (file.endsWith('eslint.json')) return JSON.stringify([
                    {
                        filePath: '/path/to/file.js',
                        messages: [
                            { line: 10, ruleId: 'no-console', severity: 2, message: 'Console not allowed' },
                            { line: 11, ruleId: 'no-unused-vars', severity: 1, message: 'Unused var' }
                        ]
                    }
                ]);
                return '';
            });

            check_repo_health.main();

            expect(check_repo_health.report.status).toBe('unhealthy');
            expect(check_repo_health.report.issues).toEqual(expect.arrayContaining([
                expect.objectContaining({ type: 'lint', severity: 'error', ruleId: 'no-console' }),
                expect.objectContaining({ type: 'lint', severity: 'warning', ruleId: 'no-unused-vars' })
            ]));
            expect(process.exit).toHaveBeenCalledWith(1);
        });

        it('should report jest failures', () => {
            child_process.execSync.mockReturnValue(Buffer.from('success'));
            fs.existsSync.mockImplementation((file) => {
                if (!file) return false;
                if (file.endsWith('jest.json')) return true;
                return false;
            });

            fs.readFileSync.mockImplementation((file) => {
                if (file.endsWith('jest.json')) return JSON.stringify({
                    testResults: [
                        {
                            name: '/path/to/test.js',
                            assertionResults: [
                                { status: 'failed', title: 'should do X', failureMessages: ['Error: Expected X'] },
                                { status: 'passed', title: 'should do Y' }
                            ]
                        }
                    ]
                });
                return '';
            });

            check_repo_health.main();

            expect(check_repo_health.report.status).toBe('unhealthy');
            expect(check_repo_health.report.issues).toEqual(expect.arrayContaining([
                expect.objectContaining({ type: 'test_failure', severity: 'error', title: 'should do X' })
            ]));
            expect(process.exit).toHaveBeenCalledWith(1);
        });

        it('should handle command execution failure for eslint', () => {
            child_process.execSync.mockImplementationOnce(() => {
                const error = new Error('Execution failed');
                error.stderr = 'eslint crashed';
                throw error;
            });

            check_repo_health.main();

            expect(check_repo_health.report.status).toBe('unhealthy');
            expect(check_repo_health.report.issues).toEqual(expect.arrayContaining([
                expect.objectContaining({ type: 'config_error', message: expect.stringContaining('eslint crashed') })
            ]));
        });

        it('should handle command execution failure for jest', () => {
            // first call is eslint (succeeds)
            child_process.execSync.mockImplementationOnce(() => Buffer.from('eslint ok'));
            // second call is jest (fails)
            child_process.execSync.mockImplementationOnce(() => {
                const error = new Error('Execution failed');
                error.stderr = 'jest crashed';
                throw error;
            });

            check_repo_health.main();

            expect(check_repo_health.report.status).toBe('unhealthy');
            expect(check_repo_health.report.issues).toEqual(expect.arrayContaining([
                expect.objectContaining({ type: 'test_failure', message: expect.stringContaining('jest crashed') })
            ]));
        });

        it('should report coverage gaps', () => {
            child_process.execSync.mockReturnValue(Buffer.from('success'));
            process.env.COVERAGE_THRESHOLD = '90';

            fs.existsSync.mockImplementation((file) => {
                if (!file) return false;
                if (file.endsWith('coverage-summary.json')) return true;
                return false;
            });

            fs.readFileSync.mockImplementation((file) => {
                if (file.endsWith('coverage-summary.json')) return JSON.stringify({
                    "total": {},
                    "src/file.js": {
                        "lines": { "pct": 80 },
                        "statements": { "pct": 100 },
                        "functions": { "pct": 100 },
                        "branches": { "pct": 100 }
                    }
                });
                return '';
            });

            check_repo_health.main();

            expect(check_repo_health.report.status).toBe('unhealthy');
            expect(check_repo_health.report.issues).toEqual(expect.arrayContaining([
                expect.objectContaining({ type: 'coverage_gap', pct: 80, aspect: 'lines' })
            ]));
        });

        it('should handle missing aspect pct in coverage summary', () => {
            child_process.execSync.mockReturnValue(Buffer.from('success'));
            process.env.COVERAGE_THRESHOLD = '90';

            fs.existsSync.mockImplementation((file) => {
                if (!file) return false;
                if (file.endsWith('coverage-summary.json')) return true;
                return false;
            });

            fs.readFileSync.mockImplementation((file) => {
                if (file.endsWith('coverage-summary.json')) return JSON.stringify({
                    "total": {},
                    "src/file.js": {
                        "lines": { },
                        "statements": { "pct": 100 },
                        "functions": { "pct": 100 },
                        "branches": { "pct": 100 }
                    }
                });
                return '';
            });

            check_repo_health.main();

            // lines has no pct, should default to 100
            expect(check_repo_health.report.status).toBe('healthy');
        });

        it('should handle coverage parsing errors', () => {
            child_process.execSync.mockReturnValue(Buffer.from('success'));
            fs.existsSync.mockImplementation((file) => {
                if (!file) return false;
                if (file.endsWith('coverage-summary.json')) return true;
                return false;
            });

            fs.readFileSync.mockImplementation((file) => {
                if (file.endsWith('coverage-summary.json')) return 'invalid json';
                return '';
            });

            check_repo_health.main();

            expect(check_repo_health.report.status).toBe('unhealthy');
            expect(check_repo_health.report.issues).toEqual(expect.arrayContaining([
                expect.objectContaining({ type: 'coverage_parse_error' })
            ]));
        });

        it('should handle fs write errors', () => {
            child_process.execSync.mockReturnValue(Buffer.from('success'));
            fs.writeFileSync.mockImplementation(() => {
                throw new Error('Write failed');
            });

            check_repo_health.main();

            expect(console.error).toHaveBeenCalledWith('健全性レポートの書き込みに失敗:', 'Write failed');
            expect(process.exit).toHaveBeenCalledWith(1);
        });

        it('should handle fs rmSync errors gracefully', () => {
            child_process.execSync.mockReturnValue(Buffer.from('success'));
            fs.rmSync.mockImplementation(() => {
                throw new Error('Remove failed');
            });

            check_repo_health.main();

            expect(process.exit).toHaveBeenCalledWith(0);
        });
    });
});
