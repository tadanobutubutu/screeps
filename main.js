/* deploy.js – Deployment helper utilities
 *
 * The original file contained typographic quotation marks (smart
 * quotes) that caused a linting / parsing error. Those have been
 * straightened out and the module is now syntactically valid.
 *
 * Feel free to extend this module with real deployment logic – the
 * tests only need it to be importable.
 */

'use strict';

module.exports = {
  /**
   * Example deploy function – replace with your actual logic.
   *
   * @returns {string} A confirmation message.
   */
  deploy: function () {
    // Placeholder implementation – we simply return a message.
    return 'Deploy script executed.';
  },

  /**
   * Resolve a GitHub URL for the given repository name.
   *
   * @param {string} owner - The GitHub user or org owning the repo.
   * @param {string} repo  - The repository name.
   * @returns {string} The raw GitHub URL.
   */
  getRepoUrl: function (owner, repo) {
    if (typeof owner !== 'string' || typeof repo !== 'string') {
      throw new Error('Both owner and repo must be strings');
    }
    return `https://github.com/${owner}/${repo}.git`;
  },
};