/* deploy.js
 *
 * This helper simply re‑exports the functions from `main.js`.
 * The previous version contained a stray typographic quote
 * and some unrelated stray characters that caused a parsing error.
 */

const main = require('./main.js');

module.exports = main;