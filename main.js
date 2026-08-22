/**
 * Main Entry Point
 * Handles React accessibility rules including REACT_017
 */

// Rule definitions
const rules = {
  REACT_017: {
    id: 'REACT_017',
    name: 'React Landmarks',
    description: 'Page should have a <main> landmark for accessibility',
    severity: 'warning',
    
    // Check if HTML content has a main landmark
    check: function(htmlContent) {
      const hasMainTag = /<main[\s>]/.test(htmlContent);
      return {
        passed: hasMainTag,
        message: hasMainTag 
          ? 'Page has proper <main> landmark' 
          : 'Page has no <main> landmark'
      };
    }
  }
};

// HTML file validator
function validateHTMLFile(filePath, content) {
  const results = [];
  
  // Check REACT_017 - React Landmarks
  const react017 = rules.REACT_017.check(content);
  results.push({
    ruleId: 'REACT_017',
    passed: react017.passed,
    message: react017.message,
    file: filePath
  });
  
  return results;
}

// Add main landmark to HTML content if missing
function addMainLandmark(htmlContent) {
  // Check if main tag already exists
  if (/<main[\s>]/.test(htmlContent)) {
    return htmlContent;
  }
  
  // Find the body tag and wrap content in main
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    const bodyContent = bodyMatch[1];
    const wrappedContent = bodyContent.replace(
      /(<body[^>]*>)([\s\S]*)/i,
      '$1\n    <main>\n        $2\n    </main>'
    );
    return htmlContent.replace(bodyMatch[0], wrappedContent);
  }
  
  return htmlContent;
}

// Export for testing
module.exports = {
  rules,
  validateHTMLFile,
  addMainLandmark
};