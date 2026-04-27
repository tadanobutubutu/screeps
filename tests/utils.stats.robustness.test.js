/**
 * utils.stats.js Robustness Tests
 */

global.Game = {
  time: 100,
  creeps: {},
  rooms: {},
  cpu: { getUsed: jest.fn().mockReturnValue(10) },
};
global.Memory = {};

const StatsManager = require('../utils.stats');

describe('utils.stats robustness', () => {
  beforeEach(() => {
    global.Memory = {};
  });

  test('recordHarvest correctly initializes and increments if Memory.stats is an empty object', () => {
    // Simulate external system or manual mistake initializing Memory.stats as {}
    global.Memory.stats = {};

    // StatsManager.initMemory() should now populate defaults even for {}
    StatsManager.recordHarvest(100);

    expect(global.Memory.stats.totalEnergyProcessed).toBe(100);
  });

  test('recordRoomStat correctly initializes and records if Memory.stats is an empty object', () => {
    global.Memory.stats = {};

    // This should no longer throw and should correctly initialize roomStats
    expect(() => {
      StatsManager.recordRoomStat('W1N1', 'energy', 100);
    }).not.toThrow();

    expect(global.Memory.stats.roomStats['W1N1'].energy).toBe(100);
  });
});
