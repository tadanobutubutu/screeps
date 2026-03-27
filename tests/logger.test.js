/**
 * src/utils/logger.js のユニットテスト
 */

// グローバル設定
global.Game = { time: 100 };
global.Memory = { logs: [] };

jest.mock('../src/constants', () => ({
  LOG_LEVEL: {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4,
  },
  DEFAULT_LOG_LEVEL: 1,
}), { virtual: true });

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
});
