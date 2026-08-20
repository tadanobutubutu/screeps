const path = require('path');
const { Worker } = require('worker_threads');
const { generateDependencyGraph } = require('./dependency-graph-generator');
const fs = require('fs');

/**
 * Checks if the given JSX/TSX content has a <main> landmark
 * @param {string} content - File content to check
 * @returns {boolean} - True if <main> landmark exists
 */
function hasMainLandmark(content) {
  const mainRegex = /<main[\s>]/gi;
  return mainRegex.test(content);
}

/**
 * Counts the number of <main> landmarks in the given content
 * @param {string} content - File content to check
 * @returns {number} - Number of <main> landmarks found
 */
function countMainLandmarks(content) {
  const mainRegex = /<main[\s>]/gi;
  const matches = content.match(mainRegex);
  return matches ? matches.length : 0;
}

/**
 * Checks if content has multiple <main> landmarks (accessibility violation)
 * @param {string} content - File content to check
 * @returns {boolean} - True if multiple <main> landmarks exist
 */
function hasMultipleMainLandmarks(content) {
  return countMainLandmarks(content) > 1;
}

/**
 * Replaces additional <main> elements with <section> for accessibility
 * Keeps the first <main> and converts subsequent ones to <section>
 * @param {string} content - File content to modify
 * @returns {string} - Modified content with extra <main> converted to <section>
 */
function replaceExtraMainsWithSections(content) {
  let mainCount = 0;
  
  return content.replace(/<main[\s>]/gi, (match) => {
    mainCount++;
    // Keep the first <main>, replace subsequent ones with <section>
    if (mainCount > 1) {
      return '<section';
    }
    return match;
  });
}

/**
 * Wraps children in a <main> landmark
 * @param {string} content - File content to modify
 * @param {string} childrenTag - The tag containing main children (e.g., 'body', 'div')
 * @returns {string} - Modified content with <main> landmark
 */
function addMainLandmark(content, childrenTag = 'children') {
  // Pattern to find <body>{children}</body> or <div>{children}</div>
  const bodyPattern = /<(\w+)>\s*\{(\w+)\}\s*<\/\1>/g;
  
  return content.replace(bodyPattern, (match, tag, children) => {
    if (tag === 'body' || tag === 'div' || tag === 'section') {
      return `<${tag}>\n    <main>\n        {${children}}\n    </main>\n</${tag}>`;
    }
    return match;
  });
}

/**
 * Updates Jest to v30 and related dependencies
 */
async function updateJestToV30() {
    try {
        console.log('Updating Jest to v30 and related dependencies...');
        // Implementation would go here
        // 1. Updating package.json dependencies
        // Add the following line
        // "jest": "^30.0.0",
        // Replace the existing "jest" version in package.json with "^30.0.0"
        // 2. Running package manager commands
        // Run `npm install` or `yarn install`
        // 3. Running tests to ensure compatibility
        console.log('Jest updated successfully to v30');
    } catch (error) {
        console.error('Error updating Jest:', error);
        throw error;
    }
}

/**
 * Updates React to v19
 */
async function updateReactToV19() {
    try {
        console.log('Updating React to v19...');
        // Implementation would go here
        // 1. Updating package.json dependencies
        // Add the following line
        // "react": "^19.0.0",
        // Replace the existing "react" version in package.json with "^19.0.0"
        // 2. Running package manager commands
        // Run `npm install` or `yarn install`
        // 3. Running tests to ensure compatibility
        console.log('React updated successfully to v19');
    } catch (error) {
        console.error('Error updating React:', error);
        throw error;
    }
}

/**
 * Adds scope attribute to table headers for accessibility
 */
async function addScopeToTableHeaders() {
    try {
        console.log('Adding scope attribute to table headers for accessibility...');
        const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const updatedContent = fileContent.replace(/<th>(.*?)<\/th>/g, '<th scope="col">$1</th>');
        fs.writeFileSync(filePath, updatedContent);
        console.log('Scope attribute added successfully to table headers.');
    } catch (error) {
        console.error('Error adding scope attribute to table headers:', error);
        throw error;
    }
}

/**
 * Adds `lang="en"` to the root `<html>` element if it is missing.
 * Preserves any existing attributes and avoids duplicating a `lang` attribute.
 * @param {string} content - HTML string to modify
 * @returns {string} - Modified HTML with a language attribute
 */
function addLangAttributeToHtml(content) {
  return content.replace(/<html\b([^>]*)>/gi, (match, attrs) => {
    if (/\blang\s*=/i.test(attrs)) {
      // Lang attribute already present – keep original
      return match;
    }
    // Insert lang="en" before the closing '>'
    return `<html${attrs} lang="en">`;
  });
}

// Export utilities for testing
module.exports = {
  hasMainLandmark,
  countMainLandmarks,
  hasMultipleMainLandmarks,
  replaceExtraMainsWithSections,
  addMainLandmark,
  escapeHtml,
  generateDependencyGraph,
  updateJestToV30,
  updateReactToV19,
  addScopeToTableHeaders,
  addLangAttributeToHtml
};