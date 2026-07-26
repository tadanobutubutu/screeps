const { validateToken, validateFilePath, deployTo, runDeploy } = require('../deploy');
const fs = require('fs');

describe('deploy.js', () => {
    describe('runDeploy error handling', () => {
        let originalExit, originalError;
        beforeEach(() => {
            originalExit = process.exit;
            originalError = console.error;
            process.exit = jest.fn();
            console.error = jest.fn();
        });

        afterEach(() => {
            process.exit = originalExit;
            console.error = originalError;
            jest.restoreAllMocks();
        });

        test('catches file read error and exits', async () => {
            const { runDeploy } = require('../deploy');
            jest.spyOn(fs.promises, 'readFile').mockRejectedValue(new Error('simulated read error token=\'[REDACTED]\''));
            await runDeploy();
            expect(console.error).toHaveBeenCalledWith(
                expect.stringContaining('[ERROR] Failed to read main.js: simulated read error token=\'[REDACTED]\'')
            );
            expect(process.exit).toHaveBeenCalledWith(1);
        });
    });

    describe('validateToken', () => {
        test('have valid token', () => {
            const result = validateToken('valid_token_1234567890', 'PTR');
            expect(result.valid).toBe(true);
        });

        test('token not set', () => {
            const result = validateToken(undefined, 'PTR');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('not set');
        });

        test('token too short', () => {
            const result = validateToken('short', 'PTR');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('format is invalid');
        });

        test('empty string', () => {
            const result = validateToken('', 'PTR');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('not set');
        });

        test('null value', () => {
            const result = validateToken(null, 'PTR');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('not set');
        });

        test('long token', () => {
            const result = validateToken('abc12345678901234567890', 'PTR');
            expect(result.valid).toBe(true);
        });

        test('special characters', () => {
            const result = validateToken('invalid!@#$%^&*()token123456789', 'PTR');
            expect(result.valid).toBe(false);
        });
    });

    describe('validateFilePath', () => {
        const path = require('path');
        const testBaseDir = '/workspace/test';

        test('valid file path', () => {
            const result = validateFilePath('main.js', testBaseDir);
            expect(result).toBe('/workspace/test/main.js');
        });

        test('path traversal attack blocked', () => {
            expect(() => {
                validateFilePath('../etc/passwd', testBaseDir);
            }).toThrow('path traversal attack detected');
        });

        test('Poison Null Byte blocked', () => {
            expect(() => validateFilePath('\0../../etc/passwd', testBaseDir)).toThrow('contains null byte');
        });

        test('accept subdirectories', () => {
            const result = validateFilePath('subdir/file.js', testBaseDir);
            expect(result).toContain('subdir/file.js');
        });

        test('disallow absolute path', () => {
            expect(() => validateFilePath('/etc/passwd', testBaseDir)).toThrow('absolute path detected');
        });

        test('block partial base path match (starts-with bypass)', () => {
            const baseDir = '/app';
            const malicousPath = '../app_danger/main.js';
            expect(() => validateFilePath(malicousPath, baseDir)).toThrow('path traversal attack detected');
        });
    });

    describe('deployTo', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(console, 'log').mockImplementation(() => {});
            jest.spyOn(console, 'error').mockImplementation(() => {});
        });

        afterEach(() => {
            console.log.mockRestore();
            console.error.mockRestore();
        });

        test('skip if token not set', async () => {
            await expect(deployTo('PTR', '/ptr/api/user/code', null, {})).resolves.toBeUndefined();
        });

        test('skip if invalid token format', async () => {
            await expect(deployTo('PTR', '/ptr/api/user/code', 'short', {})).resolves.toBeUndefined();
        });

        test('resolve on success', async () => {
            const mockReq = {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn((event, callback) => {
                    if (event === 'data') callback(JSON.stringify({ ok: 1 }));
                    if (event === 'end') callback();
                }),
            };
            const mockRes = {
                statusCode: 200,
            };
            https.request.mockImplementation((options, callback) => {
                callback(mockRes, mockReq);
            });

            const validToken = 'valid_token_12345678901234567890';
            await expect(deployTo('PTR', '/ptr/api/user/code', validToken, {})).resolves.toBeUndefined();
        });

        test('reject on failure (ok !== 1)', async () => {
            const mockReq = {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn((event, callback) => {
                    if (event === 'data') callback(JSON.stringify({ ok: 0, error: 'deploy failed' }));
                    if (event === 'end') callback();
                }),
            };
            const mockRes = {
                statusCode: 200,
            };
            https.request.mockImplementation((options, callback) => {
                callback(mockRes, mockReq);
            });

            const validToken = 'valid_token_12345678901234567890';
            await expect(deployTo('PTR', '/ptr/api/user/code', validToken, {})).rejects.toThrow('PTR deployment failed');
            expect(console.error).toHaveBeenCalledWith(
                expect.stringContaining('[PTR] Deployment failed! Raw:'),
                expect.stringContaining('deploy failed')
            );
        });

        test('resolve on success (JSON parse failure)', async () => {
            const mockReq = {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn((event, callback) => {
                    if (event === 'data') callback('not json');
                    if (event === 'end') callback();
                }),
            };
            const mockRes = {
                statusCode: 200,
            };
            https.request.mockImplementation((options, callback) => {
                callback(mockRes, mockReq);
            });

            const validToken = 'valid_token_12345678901234567890';
            await expect(deployTo('PTR', '/ptr/api/user/code', validToken, {})).resolves.toBeUndefined();
        });

        test('reject on failure (non-200 status and JSON parsing failure)', async () => {
            const mockReq = {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn((event, callback) => {
                    if (event === 'data') callback('Server error');
                    if (event === 'end') callback();
                }),
            };
            const mockRes = {
                statusCode: 500,
            };
            https.request.mockImplementation((options, callback) => {
                callback(mockRes, mockReq);
            });

            const validToken = 'valid_token_12345678901234567890';
            await expect(deployTo('PTR', '/ptr/api/user/code', validToken, {})).rejects.toThrow();
        });

        test('reject on network error', async () => {
            const mockReq = {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn((event, callback) => {
                    if (event === 'error') callback(new Error('Network error'));
                }),
                setTimeout: jest.fn(),
            };
            https.request.mockImplementation((options, callback) => {
                callback(mockReq);
            });

            const validToken = 'valid_token_12345678901234567890';
            await expect(deployTo('PTR', '/ptr/api/user/code', validToken, {})).rejects.toThrow();
        });

        test('reject on timeout', async () => {
            const mockReq = {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn((event, callback) => {
                    if (event === 'timeout') callback();
                }),
                setTimeout: jest.fn((ms, callback) => callback()),
                destroy: jest.fn(),
            };
            https.request.mockImplementation((options, callback) => {
                callback(mockReq);
            });

            const validToken = 'valid_token_12345678901234567890';
            await expect(deployTo('PTR', '/ptr/api/user/code', validToken, {})).rejects.toThrow('TIMEOUT');
        });
    });
});