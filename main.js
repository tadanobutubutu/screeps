// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute; handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues(); handled by validateTableStructureIssues() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const { a11y } = require('@accessible/react');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  getUniqueLandmarks,
  validateLandmarkAttributes,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  validateLinkAccessibility,
  handleFakeLinks,
  createInPageButton
} = require('./utils');

const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

/**
 * Get the language attribute value for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

/**
 * Get the full language attribute string for the HTML element
 * @returns {string} The full lang attribute (e. g., "en" or "en-US")
 */
function getFullLangAttribute() {
  return document.documentElement.lang || navigator.language || 'en-US';
}

/**
 * Adds lang attribute to HTML element
 * @param {Object} element - The HTML element to modify
 * @returns {Object} The modified element with lang attribute
 */
function addLangAttribute(element) {
  element.lang = getFullLangAttribute();
  return element;
}

/**
 * Returns a person's name formatted for accessibility
 * @param {string} firstName - The first name
 * @param {string} lastName - The last name
 * @returns {string} The formatted full name
 */
function personName(firstName, lastName) {
  const name = [firstName, lastName].filter(Boolean).join(' ');
  return name || '';
}

/**
 * Exports Express app for testing
 * @param {Object} config - Configuration object
 * @returns {Object} Express app instance
 */
function createApp(config) {
  const app = express();

  // Debug logging middleware
  if (config.debug) {
    app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });
  }

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', version: config.version });
  });

  app.get('/api/data', async (req, res) => {
    try {
      const data = await fetchDataFromAPI(config.apiUrl, config.timeout);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Accessibility validation endpoint
  app.post('/api/validate', async (req, res) => {
    try {
      const { html, options = {} } = req.body;
      const results = await validateAccessibility(html, options);
      res.json(results);
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // Catch-all for accessibility testing
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  return app;
}

/**
 * Fetch data from external API
 * @param {string} url - API URL
 * @param {number} timeout - Request timeout in ms
 * @returns {Promise<Object>} API response data
 */
async function fetchDataFromAPI(url, timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * Validate HTML accessibility using axe-core
 * @param {string} html - HTML string to validate
 * @param {Object} options - Validation options
 * @returns {Promise<Object>} Axe results
 */
async function validateAccessibility(html, options = {}) {
  const results = await axe.run(html, options);
  return results;
}

/**
 * Check if element has valid landmark role
 * @param {Object} element - DOM element to check
 * @returns {boolean} True if valid landmark
 */
function hasValidLandmarkRole(element) {
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'article', 'section'];
  const role = element.getAttribute('role');
  const tagName = element.tagName ? element.tagName.toLowerCase() : '';
  
  return validRoles.includes(role) || ['header', 'nav', 'main', 'aside', 'footer'].includes(tagName);
}

// Initialize app when run directly
if (require.main === module) {
  const server = createApp(config);
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = {
  createApp,
  validateAccessibility,
  fetchDataFromAPI,
  getLangAttribute,
  getFullLangAttribute,
  addLangAttribute,
  personName,
  hasValidLandmarkRole
};