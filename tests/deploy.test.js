/**
 * deploy.js ロジックのユニットテスト
 */

// httpsモジュールをモック
jest.mock('https');
const https = require('https');

const { validateToken, validateFilePath, deployTo } = require('../deploy');

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
            jest.spyOn(fs.promises, 'readFile').mockRejectedValue(new Error('simulated read error token=\'secret\''));

            await runDeploy();

            expect(console.error).toHaveBeenCalledWith(
                expect.stringContaining('[ERROR] Failed to read main.js: simulated read error token=\'[REDACTED]\'')
            );
            expect(process.exit).toHaveBeenCalledWith(1);
        });
    });
    describe('validateToken', () => {
        test('有効なトークンを許可', () => {
            const result = validateToken('valid_token_1234567890', 'PTR');
            expect(result.valid).toBe(true);
        });

        test('トークンが未設定の場合、無効', () => {
            const result = validateToken(undefined, 'PTR');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('not set');
        });

        test('短いトークンを無効', () => {
            const result = validateToken('short', 'PTR');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('format is invalid');
        });

        test('空文字列を無効', () => {
            const result = validateToken('', 'PTR');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('not set');
        });

        test('nullを無効', () => {
            const result = validateToken(null, 'PTR');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('not set');
        });

        test('正常な長さのトークンを許可', () => {
            const result = validateToken('abc12345678901234567890', 'PTR');
            expect(result.valid).toBe(true);
        });

        test('特殊文字を含むトークンを無効', () => {
            const result = validateToken('invalid!@#$%^&*()token123456789', 'PTR');
            expect(result.valid).toBe(false);
        });
    });

    describe('validateFilePath', () => {
        const path = require('path');
        const testBaseDir = '/workspace/test';

        test('正常なファイルパスを受け入れる', () => {
            const result = validateFilePath('main.js', testBaseDir);
            expect(result).toContain('main.js');
        });

        test('path traversal攻撃をブロック', () => {
            expect(() => {
                validateFilePath('../etc/passwd', testBaseDir);
            }).toThrow();
        });

        test('Poison Null Byteをブロック', () => {
            expect(() => {
                validateFilePath('\0../../etc/passwd', testBaseDir);
            }).toThrow('contains null byte');
        });

        test('サブディレクトリを許可', () => {
            const result = validateFilePath('subdir/file.js', testBaseDir);
            expect(result).toContain('subdir/file.js');
        });

        test('絶対パスをブロック', () => {
            expect(() => {
                validateFilePath('/etc/passwd', testBaseDir);
            }).toThrow();
        });

        test('should block partial base path match (starts-with bypass)', () => {
            const baseDir = '/app';
            const malicousPath = '../app_danger/main.js';
            expect(() => {
                validateFilePath(malicousPath, baseDir);
            }).toThrow();
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

        test('トークンが未設定の場合はスキップ', async () => {
            await expect(deployTo('PTR', '/ptr/api/user/code', null, {})).resolves.toBeUndefined();
        });

        test('無効なトークン形式の場合はスキップ', async () => {
            await expect(
                deployTo('PTR', '/ptr/api/user/code', 'short', {})
            ).resolves.toBeUndefined();
        });

        test('デプロイ成功時にresolveする', async () => {
            const mockReq = {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn(),
                setTimeout: jest.fn(),
            };
            const mockRes = {
                statusCode: 200,
                on: jest.fn((event, callback) => {
                    if (event === 'data') callback(JSON.stringify({ ok: 1 }));
                    if (event === 'end') callback();
                }),
            };
            https.request.mockImplementation((options, callback) => {
                callback(mockRes);
                return mockReq;
            });

            const validToken = 'valid_token_12345678901234567890';
            await expect(
                deployTo('PTR', '/ptr/api/user/code', validToken, {})
            ).resolves.toBeUndefined();
        });

        test('デプロイ失敗時（ok !== 1）にrejectする', async () => {
            const mockReq = {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn(),
                setTimeout: jest.fn(),
            };
            const mockRes = {
                statusCode: 200,
                on: jest.fn((event, callback) => {
                    if (event === 'data') {
                        callback(JSON.stringify({ ok: 0, error: 'deploy failed' }));
                    }
                    if (event === 'end') callback();
                }),
            };
            https.request.mockImplementation((options, callback) => {
                callback(mockRes);
                return mockReq;
            });

            const validToken = 'valid_token_12345678901234567890';
            await expect(deployTo('PTR', '/ptr/api/user/code', validToken, {})).rejects.toThrow();
        });

        test('HTTPステータス200でJSONパース失敗の場合はresolveする', async () => {
            const mockReq = {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn(),
                setTimeout: jest.fn(),
            };
            const mockRes = {
                statusCode: 200,
                on: jest.fn((event, callback) => {
                    if (event === 'data') callback('not json');
                    if (event === 'end') callback();
                }),
            };
            https.request.mockImplementation((options, callback) => {
                callback(mockRes);
                return mockReq;
            });

            const validToken = 'valid_token_12345678901234567890';
            await expect(
                deployTo('PTR', '/ptr/api/user/code', validToken, {})
            ).resolves.toBeUndefined();
        });

        test('HTTPステータスが非200でJSONパース失敗の場合はrejectする', async () => {
            const mockReq = {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn(),
                setTimeout: jest.fn(),
            };
            const mockRes = {
                statusCode: 500,
                on: jest.fn((event, callback) => {
                    if (event === 'data') callback('not json error token=' + 'sec' + 'ret');
                    if (event === 'end') callback();
                }),
            };
            https.request.mockImplementation((options, callback) => {
                callback(mockRes);
                return mockReq;
            });

            const validToken = 'valid_token_12345678901234567890';
            await expect(deployTo('PTR', '/ptr/api/user/code', validToken, {})).rejects.toThrow(
                'PTR deployment failed'
            );

            // Should redact token
            expect(console.error).toHaveBeenCalledWith(
                expect.stringContaining('[PTR] Deployment failed! Raw:'),
                expect.stringContaining('not json error token=[REDACTED]')
            );
        });

        test('HTTPエラー時（非200）にrejectする', async () => {
            const mockReq = {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn(),
                setTimeout: jest.fn(),
            };
            const mockRes = {
                statusCode: 500,
                on: jest.fn((event, callback) => {
                    if (event === 'data') callback('Server error');
                    if (event === 'end') callback();
                }),
            };
            https.request.mockImplementation((options, callback) => {
                callback(mockRes);
                return mockReq;
            });

            const validToken = 'valid_token_12345678901234567890';
            await expect(deployTo('PTR', '/ptr/api/user/code', validToken, {})).rejects.toThrow();
        });

        test('リクエストエラー時にrejectする', async () => {
            const mockReq = {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn((event, callback) => {
                    if (event === 'error') callback(new Error('Network error'));
                }),
                setTimeout: jest.fn(),
            };
            https.request.mockImplementation(() => mockReq);

            const validToken = 'valid_token_12345678901234567890';
            await expect(deployTo('PTR', '/ptr/api/user/code', validToken, {})).rejects.toThrow();
        });

        test('タイムアウト時にrejectする', async () => {
            const mockReq = {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn(),
                setTimeout: jest.fn((ms, callback) => callback()),
                destroy: jest.fn(),
            };
            https.request.mockImplementation(() => mockReq);

            const validToken = 'valid_token_12345678901234567890';
            await expect(deployTo('PTR', '/ptr/api/user/code', validToken, {})).rejects.toThrow(
                'timeout'
            );
        });
    });

    describe('runDeploy', () => {
        let originalExit;
        let originalConsoleError;

        beforeEach(() => {
            originalExit = process.exit;
            originalConsoleError = console.error;
            process.exit = jest.fn();
            console.error = jest.fn();
            jest.resetModules();
            // Set up environment variables for tokens
            process.env.SCREEPS_TOKEN = 'valid_token_12345678901234567890';
            process.env.SCREEPS_PROD_TOKEN = 'prod_token_12345678901234567890';
        });

        afterEach(() => {
            process.exit = originalExit;
            console.error = originalConsoleError;
            jest.restoreAllMocks();
        });

        test('外側のcatchブロックがエラーを捕捉する', async () => {
            const fsModule = require('fs');
            jest.spyOn(fsModule.promises, 'readFile').mockResolvedValue('dummy content');

            const httpsModule = require('https');

            // First we need to make sure we don't use the mock from the top level
            httpsModule.request.mockImplementation((options, callback) => {
                const req = {
                    on: jest.fn((evt, cb) => {
                        if (evt === 'error') {
                            cb(new Error('PTR request failed'));
                        }
                    }),
                    setTimeout: jest.fn(),
                    write: jest.fn(),
                    end: jest.fn(),
                    destroy: jest.fn(),
                };
                return req;
            });

            const { runDeploy } = require('../deploy.js');

            await runDeploy();

            expect(console.error).toHaveBeenCalledWith(
                'Deployment process failed:',
                'PTR request failed'
            );
            expect(process.exit).toHaveBeenCalledWith(1);
        });
    });

    describe('runDeploy main catch block', () => {
        let originalEnv;

        beforeEach(() => {
            originalEnv = process.env;
            process.env = { ...originalEnv, SCREEPS_TOKEN: 'valid_token_12345678901234567890', SCREEPS_PROD_TOKEN: 'prod_token_12345678901234567890' };
            jest.spyOn(console, 'error').mockImplementation(() => {});
            jest.spyOn(process, 'exit').mockImplementation((code) => {
                const err = new Error(`EXIT_${code}`);
                err.isExit = true;
                throw err;
            });
        });

        afterEach(() => {
            process.env = originalEnv;
            jest.restoreAllMocks();
        });

        test('should catch errors from deployTo and sanitize them', async () => {
            const deployModule = require('../deploy');
            const fs = require('fs');
            jest.spyOn(fs.promises, 'readFile').mockResolvedValue('module.exports = {};');

            const https = require('https');

            // Fix: define mockReq and mockRes
            const mockReq = {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn((event, cb) => {
                    if (event === 'error') {
                        process.nextTick(() => {
                            cb(new Error('Network error with token=sec' + 'ret'));
                        });
                    }
                }),
                setTimeout: jest.fn(),
            };
            const mockRes = {
                statusCode: 200,
                on: jest.fn((event, callback) => {
                    if (event === 'data') callback(JSON.stringify({ ok: 1 }));
                    if (event === 'end') callback();
                }),
            };

            https.request.mockImplementation((options, callback) => {
                callback(mockRes);
                return mockReq;
            });

            try {
                await deployModule.runDeploy();
            } catch (e) {
                expect(e.message).toBe('EXIT_1');
            }

            expect(console.error).toHaveBeenCalledWith(
                'Deployment process failed:',
                expect.stringContaining('PTR request failed')
            );
        });

        test('should catch errors from file reading and sanitize them', async () => {
            const deployModule = require('../deploy');
            const fs = require('fs');
            jest.spyOn(fs.promises, 'readFile').mockRejectedValue(new Error('Failed to read file because token=sec' + 'ret_abc'));

            try {
                await deployModule.runDeploy();
            } catch (e) {
                expect(e.message).toBe('EXIT_1');
            }

            expect(console.error).toHaveBeenNthCalledWith(1,
                expect.stringContaining('  [ERROR] Failed to read main.js: Failed to read file because token=[REDACTED]'),
            );
        });
    });
});