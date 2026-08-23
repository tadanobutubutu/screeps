/**
 * main.js - Main application entry point
 * Handles HTML rendering with proper accessibility attributes
 */

// Main HTML template with proper lang attribute for accessibility (REACT_015)
const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

/**
 * Renders the complete HTML document with proper accessibility attributes
 * @param {Object} options - Configuration options
 * @param {string} options.title - Page title for accessibility
 * @param {string} options.lang - Language code (default: en)
 * @returns {string} Complete HTML document
 */
function renderHTML(options = {}) {
  const { title = 'Application', lang = 'en' } = options;
  
  return `<!DOCTYPE html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
}

module.exports = { html, renderHTML };