// deploy.js
/*  Deployment helpers
 *
 * This module re‑exports the version‑query functions defined in main.js
 * so test files (or other modules) can import them straight from
 * `deploy.js`.  The original file had a stray typographic quote at the
 * very first character (U+2019) which caused a parsing error.  It’s
 * been removed and the file is now a simple, clean wrapper.
 */

'use strict';

const {
  getLodashVersion,
  getPostHogVersion,
  getSupabaseVersion,
  getCircleCINodeVersion,
  getDevContainerPythonVersion,
  getDevContainerNodeVersion,
  getTravisNodeVersion,
} = require('./main');

module.exports = {
  getLodashVersion,
  getPostHogVersion,
  getSupabaseVersion,
  getCircleCINodeVersion,
  getDevContainerPythonVersion,
  getDevContainerNodeVersion,
  getTravisNodeVersion,
};