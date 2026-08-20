/**
 * REACT_017 - React Landmarks Rule
 * Validates that React components have proper <main> landmarks for accessibility
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse JSX/TSX content to extract element structure
 * @param {string} content - The file content
 * @returns {Array} - Array of found landmark elements
 */
function parseLandmarks(content) {
  const landmarks = [];
  
  // Match self-closing and regular main tags
  const mainTagRegex = /<main[\s\S]*?(?:\/>|<\/main>)/gi;
  const matches = content.match(mainTagRegex);
  
  if (matches) {
    matches.forEach(match => {
      if (match.includes('</main>')) {
        landmarks.push({ type: 'main', hasClosing: true });
      } else {
        landmarks.push({ type: 'main', hasClosing: false });
      }
    });
  }
  
  return landmarks;
}

/**
 * Check if body element exists without main child
 * @param {string} content - The file content
 * @returns {boolean} - True if issue found
 */
function hasBodyWithoutMain(content) {
  // Check for body element
  const bodyRegex = /<body[\s\S]*?>[\s\S]*<\/body>/gi;
  const bodyMatch = content.match(bodyRegex);
  
  if (bodyMatch) {
    const bodyContent = bodyMatch[0];
    const mainRegex = /<main[\s\S]*?(?:\/>|<\/main>)/gi;
    const hasMain = mainRegex.test(bodyContent);
    return !hasMain;
  }
  
  return false;
}

/**
 * Check if html/root element exists without main child
 * @param {string} content - The file content
 * @returns {boolean} - True if issue found
 */
function hasRootWithoutMain(content) {
  // Check for html tag or root element structure
  const rootPatterns = [
    /<html[\s\S]*?>[\s\S]*<\/html>/gi,
    /return\s*\([\s\S]*?<body[\s\S]*?>[\s\S]*<\/body>/gi
  ];
  
  for (const pattern of rootPatterns) {
    const match = content.match(pattern);
    if (match) {
      const rootContent = match[0];
      const mainRegex = /<main[\s\S]*?(?:\/>|<\/main>)/gi;
      const hasMain = mainRegex.test(rootContent);
      if (!hasMain) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Main function to run the REACT_017 rule check
 * @param {string} filePath - Path to the file to check
 * @returns {Object} - Result object with issues
 */
function runREACT017(filePath) {
  const result = {
    rule: 'REACT_017',
    severity: 'warning',
    file: filePath,
    issues: []
  };
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    const landmarks = parseLandmarks(content);
    const hasBodyNoMain = hasBodyWithoutMain(content);
    const hasRootNoMain = hasRootWithoutMain(content);
    
    // Check for JSX/TSX patterns indicating React components
    const isJSX = /\.(tsx?|jsx?)$/.test(filePath);
    const hasJSXReturn = /return\s*\(/.test(content) || /return\s*</.test(content);
    
    if (isJSX || hasJSXReturn) {
      if (hasRootNoMain && landmarks.length === 0) {
        result.issues.push({
          message: 'Page has no <main> landmark',
          suggestion: 'Wrap the primary content in <main> so it can be skipped to'
        });
      }
    }
    
    // Check for HTML files
    if (/\.html?$/.test(filePath)) {
      if (hasBodyNoMain) {
        result.issues.push({
          message: 'Page has no <main> landmark',
          suggestion: 'Wrap the primary content in <main> so it can be skipped to'
        });
      }
    }
    
  } catch (error) {
    result.error = error.message;
  }
  
  return result;
}

/**
 * Add <main> landmark to content
 * @param {string} content - The file content
 * @param {string} filePath - Path to determine transformation type
 * @returns {string} - Transformed content
 */
function addMainLandmark(content, filePath) {
  const isHTML = /\.html?$/.test(filePath);
  const isJSX = /\.(tsx?|jsx?)$/.test(filePath);
  
  if (isHTML) {
    // For HTML files, wrap body content in main
    if (/<\/body>/.test(content) && !/<main[\s\S]*?<\/main>/i.test(content)) {
      return content.replace(/(<body[^>]*>)([\s\S]*)(<\/body>)/i, (match, openTag, bodyContent, closeTag) => {
        return `${openTag}\n    <main>\n        ${bodyContent.trim()}\n    </main>\n  ${closeTag}`;
      });
    }
  }
  
  if (isJSX) {
    // For JSX/TSX files, this is handled by the developer
    // This function provides utilities for detection
  }
  
  return content;
}

// Export functions for testing
module.exports = {
  parseLandmarks,
  hasBodyWithoutMain,
  hasRootWithoutMain,
  runREACT017,
  addMainLandmark
};

// Run if called directly
if (require.main === module) {
  const filePath = process.argv[2];
  if (filePath) {
    const result = runREACT017(filePath);
    console.log(JSON.stringify(result, null, 2));
  }
}