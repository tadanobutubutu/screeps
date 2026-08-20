// @ts-check
const { Environment } = require('./src/environment');

/**
 * @typedef {Object} SourceLoc
 * @property {number} start
 * @property {number} end
 */

/**
 * Returns the source location of the given path.
 * @param {string} fileName
 * @returns {Promise<SourceLoc>}
 */
async function getSourceLoc(fileName) {
  const { readFile } = require('fs').promises;
  const content = await readFile(fileName, 'utf-8');
  return {
    start: 0,
    end: content.length
  };
}

module.exports = {
  getSourceLoc
};