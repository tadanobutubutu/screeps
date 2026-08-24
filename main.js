const CONFIG = { debug: true };
const helper = require('./helper');

import { compute } from './math';
import { transform } from './utils';

export function newFunction1() {
  // Example implementation for new functionality
  return compute(42);
}
export function newFunction2() {
  // Example implementation for additional functionality
  return transform('test');
}

function existingFunction() {
  return CONFIG.debug;
}

module.exports = { existingFunction };