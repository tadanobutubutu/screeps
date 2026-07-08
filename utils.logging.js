// utils.logging.js

const util = require('util');

// Define log levels and their numeric values
const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4
};

// Current log level (default to 'info')
let currentLevel = LEVELS.info;

// Helper to get current timestamp
const timestamp = () => new Date().toISOString();

// Helper to format a message
const format = (label, msg, meta) => {
  const metaPart = meta && typeof meta === 'object' ? ` ${JSON.stringify(meta)}` : '';
  return `[${label.toUpperCase()}] ${timestamp()} ${msg}${metaPart}`;
};

// Public logger API
const logger = {
  // Set the current log level
  setLevel(level) {
    if (typeof level === 'string' && LEVELS.hasOwnProperty(level)) {
      currentLevel = LEVELS[level];
    }
  },

  // Logging methods
  error(msg, meta) {
    if (currentLevel >= LEVELS.error) {
      console.error(format('error', msg, meta));
    }
  },

  warn(msg, meta) {
    if (currentLevel >= LEVELS.warn) {
      console.warn(format('warn', msg, meta));
    }
  },

  info(msg, meta) {
    if (currentLevel >= LEVELS.info) {
      console.info(format('info', msg, meta));
    }
  },

  debug(msg, meta) {
    if (currentLevel >= LEVELS.debug) {
      console.debug(format('debug', msg, meta));
    }
  },

  trace(msg, meta) {
    if (currentLevel >= LEVELS.trace) {
      console.trace(format('trace', msg, meta));
    }
  }
};

module.exports = logger;
