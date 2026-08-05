const assert = require('assert');

function isRandom(value, min, max) {
  return value >= min && value <= max;
}

module.exports = { isRandom };