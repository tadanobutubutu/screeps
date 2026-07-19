'use strict';

/**
 * Lightweight deployment helper utilities.
 *
 */

function log(...args) {
  console.log(...args);
}

function noop() {
  // no operation
}

module.exports = {
  log,
  noop,
};