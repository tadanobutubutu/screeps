const fs = require('fs');
const path = require('path');

// Function to update the <th> elements with the scope attribute
function updateTableHeaders(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<th>(?!.*scope="col")/g, '<th scope="col">');
  fs.writeFileSync(filePath, updatedContent, 'utf8');
}

// List of files that need to be updated
const filesToUpdate = [
  // Add other file paths here if needed
  // Example: path.join(__dirname, 'src/components/ErrorComponent.jsx'),
  // Example: path.join(__dirname, 'src/components/SuccessComponent.jsx'),
];

// Update each file
filesToUpdate.forEach((file) => {
  updateTableHeaders(file);
});

/**
 * Fixes multiple <main> landmark issues by replacing subsequent <main> elements
 * with <section role="main"> to ensure only one <main> landmark exists per page.
 * 
 * @param {string} filePath - Path to the file to process
 * @param {number} maxMainElements - Maximum number of <main> elements allowed (default: 1)
 */
function fixMultipleMainLandmarks(filePath, maxMainElements = 1) {
  const content = fs.readFileSync(filePath, 'utf8');
  let mainCount = 0;
  
  const updatedContent = content.replace(/<main(\s|>)/gi, (match, suffix) => {
    mainCount++;
    if (mainCount > maxMainElements) {
      return `<section role="main"${suffix}`;
    }
    return match;
  }).replace(/<\/main>/gi, () => {
    if (mainCount > maxMainElements) {
      return '</section>';
    }
    return '</main>';
  });

  fs.writeFileSync(filePath, updatedContent, 'utf8');
}

/**
 * Processes multiple files to fix <main> landmark issues
 * 
 * @param {string[]} filePaths - Array of file paths to process
 * @param {number} maxMainElements - Maximum number of <main> elements allowed
 */
function fixMultipleMainLandmarksBatch(filePaths, maxMainElements = 1) {
  filePaths.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      fixMultipleMainLandmarks(filePath, maxMainElements);
      console.log(`Fixed main landmarks in: ${filePath}`);
    } else {
      console.warn(`File not found: ${filePath}`);
    }
  });
}

/**
 * Finds files containing multiple <main> elements
 * 
 * @param {string} directory - Directory to search
 * @param {string[]} extensions - File extensions to search (e.g., ['.jsx', '.tsx', '.js'])
 * @returns {string[]} - Array of file paths with multiple <main> elements
 */
function findFilesWithMultipleMainLandmarks(directory, extensions = ['.jsx', '.tsx', '.js']) {
  const results = [];
  
  function searchDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        searchDir(filePath);
      } else if (extensions.some((ext) => file.endsWith(ext))) {
        const content = fs.readFileSync(filePath, 'utf8');
        const mainMatches = content.match(/<main[\s|>]/gi);
        const mainCount = mainMatches ? mainMatches.length : 0;
        
        if (mainCount > 1) {
          results.push({ filePath, mainCount });
        }
      }
    });
  }
  
  searchDir(directory);
  return results;
}

// Export functions for use in other modules
module.exports = {
  updateTableHeaders,
  fixMultipleMainLandmarks,
  fixMultipleMainLandmarksBatch,
  findFilesWithMultipleMainLandmarks,
  filesToUpdate,
};