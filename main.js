/**
 * Main entry point for the application.
 * Handles initialization, configuration, and core utilities.
 */

const emotions = require('./utils/emotions');
const logger = require('./utils/logger');

/**
 * Initialize the application with the given configuration.
 * @param {Object} config - Application configuration object.
 * @returns {Object} Initialized application instance.
 */
function initializeApp(config) {
  logger.info('Initializing application...');
  const app = {
    config,
    emotions,
    status: 'initialized',
  };
  logger.info('Application initialized successfully.');
  return app;
}

/**
 * Process an emotion input and return the analyzed result.
 * @param {string} input - The emotion input string.
 * @returns {Object} Analysis result with emotion type and confidence.
 */
function processEmotion(input) {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }
  const result = emotions.analyze(input);
  logger.debug(`Emotion processed: ${result.type} with confidence ${result.confidence}`);
  return result;
}

/**
 * Get the list of supported emotions.
 * @returns {string[]} Array of supported emotion names.
 */
function getSupportedEmotions() {
  return emotions.getSupported();
}

/**
 * Format an emotion result for display.
 * @param {Object} result - The emotion analysis result.
 * @returns {string} Formatted string representation.
 */
function formatEmotionResult(result) {
  return `[${result.type}] Confidence: ${(result.confidence * 100).toFixed(2)}%`;
}

module.exports = {
  initializeApp,
  processEmotion,
  getSupportedEmotions,
  formatEmotionResult,
};