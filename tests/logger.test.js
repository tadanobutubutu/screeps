/**
 * src/utils/logger.js のユニットテスト
 */

// グローバル設定
global.Game = { time: 100 };
global.Memory = { logs: [] };

jest.mock(
    '../src/constants',
    () => ({
        LOG_LEVEL: {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3,
            NONE: 4,
        },
        DEFAULT_LOG_LEVEL: 1,
    }),
    { virtual: true }
);

// logger モジュールを読み込む前にモックを設定
const logger = require('../src/utils/logger');

describe('logger', () => {
    beforeEach(() => {
        global.Memory = { logs: [] };
        global.Game.time = 100;
        console.log = jest.fn();
        logger.setLevel(0);
    });

    describe('debug', () => {
        test('デバッグメッセージをログに記録する', () => {
            logger.debug('Test debug message');
            // エラーが発生しないことを確認
            expect(console.log).toHaveBeenCalled();
        });
    });

    describe('info', () => {
        test('情報メッセージをログに記録する', () => {
            logger.info('Test info message');
            expect(console.log).toHaveBeenCalled();
        });
    });

    describe('warn', () => {
        test('警告メッセージをログに記録する', () => {
            logger.warn('Test warning message');
            expect(console.log).toHaveBeenCalled();
        });
    });

    describe('error', () => {
        test('エラーメッセージをログに記録する', () => {
            logger.error('Test error message');
            expect(console.log).toHaveBeenCalled();
        });

        test('エラーオブジェクトをログに記録する', () => {
            const error = new Error('Test error');
            logger.error('Error occurred', error);
            expect(console.log).toHaveBeenCalled();
        });
    });

    describe('getStats', () => {
        test('ログ統計を返す', () => {
            logger.info('Test message 1');
            logger.warn('Test message 2');
            logger.error('Test message 3');

            const stats = logger.getStats();

            expect(stats).toBeDefined();
            expect(typeof stats).toBe('object');
        });
    });

    describe('clear', () => {
        test('ログをクリアする', () => {
            logger.info('Test message');
            logger.clear();

            expect(global.Memory.logs).toBeDefined();
        });
    });

    describe('getSafeStack', () => {
        test('絶対パスをスタックトレースから削除する', () => {
            const stack =
                'Error: something went wrong\n' +
                '    at Object.run (/home/user/project/main.js:10:5)\n' +
                '    at /usr/local/lib/node_modules/screeps/index.js:100:20';

            const safeStack = logger.getSafeStack(stack);

            expect(safeStack).not.toContain('/home/user/project/');
            expect(safeStack).not.toContain('/usr/local/lib/node_modules/screeps/');
            expect(safeStack).toContain('main.js:10:5');
            expect(safeStack).toContain('index.js:100:20');
            expect(safeStack.split('\n').length).toBeLessThanOrEqual(5);
        });

        test('空のスタックトレースに対して空文字列を返す', () => {
            expect(logger.getSafeStack('')).toBe('');
            expect(logger.getSafeStack(null)).toBe('');
        });
    });

    describe('_redactPaths', () => {
        test('文字列以外の入力はそのまま返す', () => {
            expect(logger._redactPaths(null)).toBeNull();
            expect(logger._redactPaths(undefined)).toBeUndefined();
            expect(logger._redactPaths(123)).toBe(123);
            const obj = { key: 'value' };
            expect(logger._redactPaths(obj)).toBe(obj);
        });

        test('パスや秘密情報が含まれない通常の文字列はそのまま返す', () => {
            const normalStr = 'これは通常のメッセージです。';
            expect(logger._redactPaths(normalStr)).toBe(normalStr);
            const singleWord = 'word';
            expect(logger._redactPaths(singleWord)).toBe(singleWord);
        });

        test('Unixスタイルの絶対パスをサニタイズする', () => {
            const str1 = 'エラー: /var/log/app.log で問題が発生しました';
            expect(logger._redactPaths(str1)).toBe('エラー: [REDACTED] で問題が発生しました');
            const str2 = '/usr/local/bin/node の実行に失敗しました';
            expect(logger._redactPaths(str2)).toBe('[REDACTED] の実行に失敗しました');
        });

        test('Windowsスタイルの絶対パスをサニタイズする', () => {
            const str1 = 'C:\\Users\\Admin\\config.json が見つかりません';
            expect(logger._redactPaths(str1)).toBe('[REDACTED] が見つかりません');
            const str2 = 'エラー: D:\\Project\\src\\main.js';
            expect(logger._redactPaths(str2)).toBe('エラー: [REDACTED]');
        });

        test('秘密情報（token, passwordなど）をサニタイズする', () => {
            const str1 = 'token: dummy_token_123';
            expect(logger._redactPaths(str1)).toBe('token: [REDACTED]');
            const str2 = 'PASSWORD = "super_secret_password"';
            expect(logger._redactPaths(str2)).toBe('PASSWORD = "[REDACTED]"');
            const str3 = 'apiKey  12345-67890';
            expect(logger._redactPaths(str3)).toBe('apiKey  [REDACTED]');
            const str4 = '{"secret": "my-secret-key"}';
            expect(logger._redactPaths(str4)).toBe('{"secret": "[REDACTED]"}');
        });

        test('複数のパスや秘密情報が含まれる文字列をサニタイズする', () => {
            const mixedStr =
                'ユーザー設定を /home/user/.config に保存しました。password: 12345, token=abcd';
            const expectedStr =
                'ユーザー設定を [REDACTED] に保存しました。password: [REDACTED] token=[REDACTED]';
            expect(logger._redactPaths(mixedStr)).toBe(expectedStr);
        });
    });
});
