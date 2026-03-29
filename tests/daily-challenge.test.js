/**
 * daily-challenge.js のユニットテスト
 */

global.Memory = {};
global.console = { log: jest.fn() };

const dailyChallenge = require('../daily-challenge');

describe('daily-challenge', () => {
  beforeEach(() => {
    global.Memory = {};
    jest.clearAllMocks();
  });

  test('getChallenge returns challenge object', () => {
    const challenge = dailyChallenge.getChallenge();
    expect(challenge).toBeDefined();
    expect(challenge.challenge).toBeDefined();
    expect(challenge.date).toBeDefined();
    expect(typeof challenge.progress).toBe('number');
    expect(typeof challenge.completed).toBe('boolean');
  });

  test('getChallenge returns same challenge for same day', () => {
    const challenge1 = dailyChallenge.getChallenge();
    const challenge2 = dailyChallenge.getChallenge();
    expect(challenge1.date).toBe(challenge2.date);
    expect(challenge1.challenge.name).toBe(challenge2.challenge.name);
  });

  test('updateProgress increases progress', () => {
    const { challenge } = dailyChallenge.getChallenge();
    dailyChallenge.updateProgress(challenge.metric, 10);
    const updated = dailyChallenge.getChallenge();
    expect(updated.progress).toBe(10);
  });

  test('updateProgress ignores wrong metric', () => {
    const { challenge } = dailyChallenge.getChallenge();
    const wrongMetric = challenge.metric === 'moves' ? 'harvested' : 'moves';
    dailyChallenge.updateProgress(challenge.metric, 10);
    dailyChallenge.updateProgress(wrongMetric, 20);
    const updated = dailyChallenge.getChallenge();
    expect(updated.progress).toBe(10);
  });

  test('updateProgress completes challenge when target reached', () => {
    const { challenge } = dailyChallenge.getChallenge();
    dailyChallenge.updateProgress(challenge.metric, challenge.target);
    const updated = dailyChallenge.getChallenge();
    expect(updated.completed).toBe(true);
  });

  test('displayChallenge does not throw', () => {
    expect(() => dailyChallenge.displayChallenge()).not.toThrow();
  });

  test('updateProgress handles invalid amount safely', () => {
    const { challenge } = dailyChallenge.getChallenge();

    // Test NaN
    dailyChallenge.updateProgress(challenge.metric, NaN);
    expect(dailyChallenge.getChallenge().progress).toBe(0);

    // Test Infinity
    dailyChallenge.updateProgress(challenge.metric, Infinity);
    expect(dailyChallenge.getChallenge().progress).toBe(0);

    // Test Negative
    dailyChallenge.updateProgress(challenge.metric, -100);
    expect(dailyChallenge.getChallenge().progress).toBe(0);

    // Test non-numeric
    dailyChallenge.updateProgress(challenge.metric, '100');
    expect(dailyChallenge.getChallenge().progress).toBe(100);

    // Reset and test invalid string
    global.Memory.dailyChallenge.progress = 0;
    dailyChallenge.updateProgress(challenge.metric, 'abc');
    expect(dailyChallenge.getChallenge().progress).toBe(0);
  });
});
