// main.js

// TODO: Implement wrapPrimaryContentInMain function

/**
 * Wraps primary content in a <main> element
 * @param {string} content - The primary content to wrap
 * @returns {string} The content wrapped in a <main> tag
 */
function wrapPrimaryContentInMain(content) {
  return `<main>${content}</main>`;
}

module.exports = {
  wrapPrimaryContentInMain
};