// @ts-check

const fs = require('fs');
const path = require('path');

/**
 * Add main landmark to HTML content
 * @param {string} html - The HTML content
 * @returns {string} - HTML with main landmark
 */
function addMainLandmark(html) {
  // Check if main tag already exists
  if (/<main[\s>]/.test(html)) {
    return html;
  }

  // Pattern 1: Content starting with rotated table
  if (html.includes('id="table-rotated"')) {
    return html.replace(
      /(<div[^>]*id="table-rotated"[^>]*>)/,
      '</main>$1'
    );
  }

  // Pattern 2: Container with Quality & Metrics Reports
  if (html.includes('Quality &amp; Metrics Reports')) {
    return html.replace(
      /(<div[^>]*class="container"[^>]*>)/,
      '</main>$1'
    );
  }

  return html;
}

/**
 * Wrap content in main landmark
 * @param {string} html - The HTML content
 * @param {string} startMarker - Where to start the main tag
 * @param {string} endMarker - Where to end the main tag
 * @returns {string}
 */
function wrapInMainLandmark(html, startMarker, endMarker) {
  const mainOpen = '<main>';
  const mainClose = '</main>';

  return html
    .replace(startMarker, mainClose + startMarker)
    .replace(endMarker, endMarker + mainOpen);
}

module.exports = {
  addMainLandmark,
  wrapInMainLandmark
};