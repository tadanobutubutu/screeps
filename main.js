// main.js - React Landmarks Rule Implementation (REACT_017)

const fs = require('fs');
const path = require('path');

// Pattern to match <main> tag in JSX/HTML
const MAIN_TAG_PATTERN = /<main[\s\S]*?>[\s\S]*?<\/main>/gi;

/**
 * Check if content contains a main landmark
 * @param {string} content - The file content to check
 * @returns {boolean} - True if main landmark exists
 */
function hasMainLandmark(content) {
  return MAIN_TAG_PATTERN.test(content);
}

/**
 * Get all main landmarks from content
 * @param {string} content - The file content
 * @returns {Array} - Array of main landmark matches
 */
function getMainLandmarks(content) {
  return content.match(MAIN_TAG_PATTERN) || [];
}

/**
 * Validate main landmark in content
 * @param {string} content - The file content to validate
 * @param {string} filePath - The file path (for reporting)
 * @returns {Object} - Validation result with issues if any
 */
function validateMainLandmark(content, filePath = 'unknown') {
  const issues = [];
  
  if (!hasMainLandmark(content)) {
    issues.push({
      rule: 'REACT_017',
      severity: 'warning',
      message: 'Page has no <main> landmark',
      suggestion: 'Wrap the primary content in <main> so it can be skipped to',
      file: filePath
    });
  }
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Wrap a section in a main landmark
 * @param {string} content - The content to wrap
 * @returns {string} - Content wrapped in main landmark
 */
function wrapInMainLandmark(content) {
  return `<main>\n        ${content.trim()}\n    </main>`;
}

/**
 * Extract all landmark elements from content
 * @param {string} content - The file content
 * @returns {Object} - Object with various landmarks
 */
function extractLandmarks(content) {
  return {
    main: content.match(/<main[\s\S]*?>[\s\S]*?<\/main>/gi) || [],
    nav: content.match(/<nav[\s\S]*?>[\s\S]*?<\/nav>/gi) || [],
    header: content.match(/<header[\s\S]*?>[\s\S]*?<\/header>/gi) || [],
    footer: content.match(/<footer[\s\S]*?>[\s\S]*?<\/footer>/gi) || [],
    aside: content.match(/<aside[\s\S]*?>[\s\S]*?<\/aside>/gi) || []
  };
}

/**
 * Check a file for main landmark compliance
 * @param {string} filePath - Path to the file to check
 * @returns {Promise<Object>} - Promise resolving to validation result
 */
async function checkFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(validateMainLandmark(content, filePath));
    });
  });
}

/**
 * Check multiple files for main landmark compliance
 * @param {Array<string>} filePaths - Array of file paths to check
 * @returns {Promise<Array<Object>>} - Promise resolving to array of validation results
 */
async function checkFiles(filePaths) {
  return Promise.all(filePaths.map(file => checkFile(file)));
}

// Export existing functionality
module.exports = {
  // Existing exports
  hasMainLandmark,
  getMainLandmarks,
  validateMainLandmark,
  wrapInMainLandmark,
  extractLandmarks,
  checkFile,
  checkFiles,
  MAIN_TAG_PATTERN
};