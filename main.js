const fs = require('fs');
const path = require('path');

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];

/**
 * Checks landmark elements in HTML content for accessibility compliance.
 * @param {string} htmlContent - The HTML content to check
 * @returns {Object} - Object containing landmark element information and any warnings
 */
function checkLandmarkElements(htmlContent) {
  const warnings = [];
  const foundElements = [];
  
  LANDMARK_ELEMENTS.forEach(element => {
    const regex = new RegExp(`<${element}[\\s\\S]*?</${element}>`, 'gi');
    const matches = htmlContent.match(regex);
    if (matches) {
      foundElements.push({ element, count: matches.length });
    }
  });
  
  // Check for multiple main elements (accessibility violation)
  const mainMatches = htmlContent.match(/<main[\s\S]*?<\/main>/gi);
  if (mainMatches && mainMatches.length > 1) {
    warnings.push('Warning: Multiple <main> elements found. Only one <main> element should be present per page for accessibility.');
  }
  
  return {
    foundElements,
    warnings,
    hasProperLandmarks: foundElements.some(e => e.element === 'main')
  };
}

/**
 * Counts the number of dependencies by analyzing import statements
 * @returns {number} - The number of import statements found
 */
function countDependencies() {
  try {
    const mainFilePath = path.join(__dirname, 'main.js');
    const document = { body: { textContent: '' } };
    
    // Read the main.js file to count dependencies
    const content = fs.readFileSync(mainFilePath, 'utf8');
    document.body.textContent = content;
    
    const importCommentRegExp = /require\s*\(|import\s+.*\s+from\s+/g;
    const matches = content.match(importCommentRegExp);
    const importCount = matches ? matches.length : 0;
    
    return importCount;
  } catch (error) {
    console.error('Error counting dependencies:', error);
    return 0;
  }
}

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  announcements: [],
  
  announce(message, priority = 'polite') {
    this.announcements.push({ message, priority, timestamp: Date.now() });
    return this.announcements.length;
  },
  
  clear() {
    this.announcements = [];
  },
  
  getRecent(count = 10) {
    return this.announcements.slice(-count);
  },
  
  // Property to count dependencies
  countDependencies
};

/**
 * Handles adding landmark regions to content for accessibility
 * @param {string} content - The content to process
 * @returns {string} - Content with landmark regions added
 */
function addLandmarkRegions(content) {
  // Ensure at least one main landmark exists
  if (!content.includes('<main') && !content.includes('<main ')) {
    // Insert a basic main landmark if none exists
    content = `<main role="main">\n${content}\n</main>`;
  }
  
  // Update th scope attributes using the test helper
  if (typeof updateThScopeAttribute === 'function') {
    content = updateThScopeAttribute(content);
  }
  
  return content;
}

/**
 * Main loop function for Screeps bot
 */
function loop() {
  // Existing bot logic placeholder
}

/**
 * Exports for testing and external use
 */
module.exports = {
  checkLandmarkElements,
  countDependencies,
  a11yStore,
  addLandmarkRegions,
  LANDMARK_ELEMENTS,
  loop,
  // Ensure testHelper exports are available
  updateThScopeAttribute
};