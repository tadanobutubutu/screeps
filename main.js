// tests/utils.logging.test.js

describe('Logging Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logInfo', () => {
    test('should log info message', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const { logInfo } = require('../../src/utils/logging');
      
      logInfo('Test message');
      
      expect(consoleSpy).toHaveBeenCalledWith('Test message');
      consoleSpy.mockRestore();
    });
  });

  describe('logError', () => {
    test('should log error message', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const { logError } = require('../../src/utils/logging');
      
      logError('Error occurred');
      
      expect(consoleSpy).toHaveBeenCalledWith('Error occurred');
      consoleSpy.mockRestore();
    });
  });

  describe('logDebug', () => {
    test('should log debug message when debug is enabled', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const { logDebug } = require('../../src/utils/logging');
      
      logDebug('Debug info');
      
      expect(consoleSpy).toHaveBeenCalledWith('Debug info');
      consoleSpy.mockRestore();
    });
  });
});