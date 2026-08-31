/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

// TODO: This is the existing code that needs to be preserved

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

/**
 * Creates and starts the HTTP server
 * @returns {http.Server} The created server instance
 */
function createServer() {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', config }));
  });
  return server;
}

/**
 * Checks landmark elements in an HTML document for accessibility compliance.
 * Validates the presence of key landmark elements that define page structure
 * for assistive technologies (e.g., screen readers).
 *
 * @param {Document|string} input - A DOM Document or an HTML string to parse.
 * @returns {Object} A report describing which landmark elements are present
 *                   and any missing required landmarks.
 */
function checkLandmarkElements(input) {
  let doc = input;

  // If a string is passed, parse it into a minimal DOM-like structure
  if (typeof input === 'string') {
    doc = parseHtmlString(input);
  }

  // If no usable document is provided, return a default empty report
  if (!doc || typeof doc !== 'object') {
    return {
      landmarks: {},
      missingRequired: ['main'],
      isAccessible: false
    };
  }

  const landmarkTags = [
    'main',
    'nav',
    'header',
    'footer',
    'aside',
    'section'
  ];

  const requiredLandmarks = ['main', 'nav'];

  const found = {};
  landmarkTags.forEach((tag) => {
    found[tag] = countElementsByTag(doc, tag);
  });

  const missingRequired = requiredLandmarks.filter((tag) => found[tag] === 0);
  const isAccessible = missingRequired.length === 0;

  return {
    landmarks: found,
    missingRequired,
    isAccessible
  };
}

/**
 * Counts the number of elements with the given tag name in a document.
 * Supports both real DOM Documents and the lightweight parsed structure.
 *
 * @param {Document|Object} doc - The document to search.
 * @param {string} tagName - The element tag name (lowercase).
 * @returns {number} The number of matching elements.
 */
function countElementsByTag(doc, tagName) {
  if (!doc) {
    return 0;
  }

  // Real DOM Document
  if (typeof doc.getElementsByTagName === 'function') {
    return doc.getElementsByTagName(tagName).length;
  }

  // Lightweight parsed structure: { tagName: count, ... }
  if (doc.tagCounts && typeof doc.tagCounts[tagName] === 'number') {
    return doc.tagCounts[tagName];
  }

  return 0;
}

/**
 * Minimal HTML parser that produces a simple tag-count map. Used when a raw
 * HTML string is passed to checkLandmarkElements without a DOM environment.
 *
 * @param {string} html - The HTML string to parse.
 * @returns {Object} An object with a `tagCounts` property mapping
 *                   lowercase tag names to occurrence counts.
 */
function parseHtmlString(html) {
  const tagCounts = {};
  if (typeof html !== 'string') {
    return { tagCounts };
  }

  const tagRegex = /<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  let match;
  while ((match = tagRegex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  }

  return { tagCounts };
}

/**
 * Starts the application
 */
function startApp() {
  const server = createServer();
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
  return server;
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  checkLandmarkElements
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}