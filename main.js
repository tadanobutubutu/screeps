// main.js

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
  const result = {
    landmarks: [],
    warnings: [],
    isValid: true
  };

  LANDMARK_ELEMENTS.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>`, 'gi');
    const matches = htmlContent.match(regex);
    const count = matches ? matches.length : 0;

    if (count > 0) {
      result.landmarks.push({
        tag: tag.toLowerCase(),
        count: count
      });
    }
  });

  // Check for multiple <main> elements (should only be one)
  const mainCount = result.landmarks.find(l => l.tag === 'main');
  if (mainCount && mainCount.count > 1) {
    result.warnings.push('Document contains multiple <main> elements. Only one is allowed.');
    result.isValid = false;
  }

  return result;
}

// Game loop function
function run() {
  // Your game logic here...

  // Update scope attributes in all .html files in the views directory
  const viewsDir = path.join(__dirname, 'views');
  
  if (fs.existsSync(viewsDir)) {
    fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      const filePath = path.join(viewsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check landmark elements
      const landmarkCheck = checkLandmarkElements(content);
      
      // Update th scope attributes using the test helper
      const updatedContent = updateThScopeAttribute(content);
      
      fs.writeFileSync(filePath, updatedContent);
    });
  }
}

// Start the game loop
Module.onInit = function() {
  setInterval(run, 1000);
};

// Export for testing
module.exports = { checkLandmarkElements };