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
    dailyChallenge.updateProgress('moves', 10);
    const challenge = dailyChallenge.getChallenge();
    expect(challenge.progress).toBe(10);
  });

  test('updateProgress ignores wrong metric', () => {
    dailyChallenge.updateProgress('moves', 10);
    dailyChallenge.updateProgress('harvested', 20);
    const challenge = dailyChallenge.getChallenge();
    expect(challenge.progress).toBe(10);
  });

  test('updateProgress completes challenge when target reached', () => {
    dailyChallenge.updateProgress('moves', 500);
    const challenge = dailyChallenge.getChallenge();
    expect(challenge.completed).toBe(true);
  });

  test('displayChallenge does not throw', () => {
    expect(() => dailyChallenge.displayChallenge()).not.toThrow();
  });
});
