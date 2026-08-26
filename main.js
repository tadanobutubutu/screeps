// main.js - Accessibility Landmark Validation and HTML Generation

const fs = require('fs');
const path = require('path');

// Configuration for accessibility rules
const ACCESSIBILITY_RULES = {
  REACT_017: {
    rule: 'main-landmark',
    description: 'Page must have a <main> landmark',
    severity: 'warning',
    required: true
  }
};

/**
 * Validates HTML content for accessibility landmarks
 * @param {string} htmlContent - The HTML content to validate
 * @returns {Object} Validation results with found issues
 */
function validateAccessibilityLandmarks(htmlContent) {
  const issues = [];
  
  // Check for <main> landmark
  const hasMainTag = /<main[\s>]/i.test(htmlContent);
  
  if (!hasMainTag) {
    issues.push({
      rule: 'REACT_017',
      message: 'Page has no <main> landmark',
      severity: 'warning',
      suggestion: 'Wrap the primary content in <main> so it can be skipped to'
    });
  }
  
  return {
    passed: issues.length === 0,
    issues: issues
  };
}

/**
 * Adds <main> landmark to HTML content if missing
 * @param {string} htmlContent - The HTML content to modify
 * @returns {string} Modified HTML content with <main> landmark
 */
function addMainLandmark(htmlContent) {
  // Check if main tag already exists
  if (/<main[\s>]/i.test(htmlContent)) {
    return htmlContent;
  }
  
  // Common patterns where main content typically starts
  // This looks for body content that should be wrapped in main
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)/i);
  
  if (bodyMatch) {
    // Wrap content after <body> with <main> tag
    const bodyContent = bodyMatch[1];
    const modifiedContent = htmlContent.replace(
      /<body[^>]*>([\s\S]*)/i,
      (match, content) => `<body>${wrapInMain(content)}`
    );
    return modifiedContent;
  }
  
  return htmlContent;
}

/**
 * Wraps content in <main> tags, trying to intelligently identify primary content
 * @param {string} content - HTML content to wrap
 * @returns {string} Content wrapped in <main> tags
 */
function wrapInMain(content) {
  // Try to find the main content container (table, div.container, etc.)
  // and wrap only that portion
  
  // Look for common main content patterns
  const tableMatch = content.match(/(<table[\s\S]*<\/table>)/i);
  const containerMatch = content.match(/(<div class=["']?container["']?[\s\S]*?<\/div>)/i);
  
  if (containerMatch) {
    // Wrap the container div with main
    return `\n    <main>\n        ${containerMatch[1].trim()}\n    </main>`;
  }
  
  if (tableMatch) {
    // Wrap the table with main
    return `\n    <main>\n        ${tableMatch[1].trim()}\n    </main>`;
  }
  
  // Fallback: wrap everything in body with main
  return `\n    <main>\n        ${content.trim()}\n    </main>`;
}

/**
 * Process all HTML files in a directory for accessibility
 * @param {string} directoryPath - Path to directory containing HTML files
 * @returns {Object} Summary of processed files and issues
 */
function processDirectoryForAccessibility(directoryPath) {
  const results = {
    processed: 0,
    issues: [],
    fixed: 0
  };
  
  if (!fs.existsSync(directoryPath)) {
    console.warn(`Directory not found: ${directoryPath}`);
    return results;
  }
  
  const files = fs.readdirSync(directoryPath);
  
  files.forEach(file => {
    if (file.endsWith('.html')) {
      const filePath = path.join(directoryPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const validation = validateAccessibilityLandmarks(content);
      
      if (!validation.passed) {
        results.issues.push({
          file: filePath,
          issues: validation.issues
        });
        
        // Auto-fix: add main landmark
        const fixedContent = addMainLandmark(content);
        fs.writeFileSync(filePath, fixedContent);
        results.fixed++;
      }
      
      results.processed++;
    }
  });
  
  return results;
}

// Export functions for external use
module.exports = {
  validateAccessibilityLandmarks,
  addMainLandmark,
  wrapInMain,
  processDirectoryForAccessibility,
  ACCESSIBILITY_RULES
};

// CLI support
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--fix')) {
    // Auto-fix mode
    const docsPath = path.join(__dirname, 'docs');
    const results = processDirectoryForAccessibility(docsPath);
    console.log('Accessibility scan complete:');
    console.log(`  Processed: ${results.processed} files`);
    console.log(`  Fixed: ${results.fixed} files`);
    console.log(`  Issues remaining: ${results.issues.length} files`);
  } else {
    // Validation mode
    console.log('Accessibility Landmark Validator');
    console.log('Usage: node main.js --fix');
  }
}