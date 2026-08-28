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

// TODO: Implement a function to count dependencies
function countDependencies() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
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

/**
 * Checks if a table has the expected structure
 * @param {string} tableName - The name of the table to check
 * @param {Array<string>} expectedColumns - Array of expected column names
 * @returns {boolean} - True if table structure matches expected columns, false otherwise
 */
function checkTableStructure(tableName, expectedColumns) {
  if (!tableName || typeof tableName !== 'string') {
    return false;
  }
  
  if (!Array.isArray(expectedColumns)) {
    return false;
  }
  
  // Validate that expectedColumns is not empty
  if (expectedColumns.length === 0) {
    return false;
  }
  
  // Validate that all expectedColumns are non-empty strings
  for (const column of expectedColumns) {
    if (typeof column !== 'string' || column.trim() === '') {
      return false;
    }
  }
  
  // This function checks the structure of a table
  // In a real implementation, this would query the database schema
  // and validate that the table has the expected columns
  return true;
}

function main() {
  return 'Hello World';
}

function SomeClass() {}

function someUtility() {
  return true;
}

const config = {
  enabled: true
};

// Start the game loop
Module.onInit = function() {
  setInterval(run, 1000);
};

// Export for testing
module.exports = { 
  checkLandmarkElements, 
  countDependencies, 
  run, 
  checkTableStructure,
  main,
  SomeClass,
  someUtility,
  config
};