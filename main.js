Here is the resolved file content:

```javascript
// main.js

// The tests/utils.logging.test.js file was merged with the main.js file accidentally
// I'm moving it to the correct location at the end of this file

const roleHarvester = require('./role_harvester');

module.exports = {
  loop: () => {
    roleHarvester.run();
  },
  // The log functions are added for better logging capabilities
  logInfo: (message) => {
    console.log(`[INFO]: ${message}`);
  },
  logError: (message) => {
    console.error(`[ERROR]: ${message}`);
  },
  logDebug: (message, enabled) => {
    if (enabled) {
      console.log(`[DEBUG]: ${message}`);
    }
  },
};

// The moved tests/utils.logging.test.js file
function testLoggingFunctions() {
  describe('Logging Utils', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('logInfo', () => {
      test('should log info message', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const { logInfo } = require('./logging');

        logInfo('Test message');

        expect(consoleSpy).toHaveBeenCalledWith('[INFO]: Test message');
        consoleSpy.mockRestore();
      });
    });

    describe('logError', () => {
      test('should log error message', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const { logError } = require('./logging');

        logError('Error occurred');

        expect(consoleSpy).toHaveBeenCalledWith('[ERROR]: Error occurred');
        consoleSpy.mockRestore();
      });
    });

    describe('logDebug', () => {
      test('should log debug message when debug is enabled', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const { logDebug } = require('./logging');

        logDebug('Debug info', true);

        expect(consoleSpy).toHaveBeenCalledWith('[DEBUG]: Debug info');
        consoleSpy.mockRestore();
      });
    });
  });
}

module.exports = {
  ...module.exports,
  testLoggingFunctions,
};
```