// Example of the fix pattern for React Table Structure accessibility:
// Before:
// <th>Column Name</th>

// After:
// <th scope="col">Column Name</th>

// For row headers:
// <th>Row Label</th>  →  <th scope="row">Row Label</th>

/**
 * Check if JSX/TSX code contains a <main> landmark (REACT_017)
 * @param {string} code - The JSX/TSX code to check
 * @returns {Object} - { hasMain: boolean, suggestion: string }
 */
function checkMainLandmark(code) {
  const hasMain = /<main[\s>]/.test(code);
  
  return {
    hasMain,
    suggestion: hasMain ? null : 'Wrap primary content in a <main> landmark for accessibility (REACT_017)'
  };
}

/**
 * Fix REACT_017: Add main landmark to wrap children
 * @param {string} code - The JSX/TSX code to fix
 * @returns {string} - Fixed code with main landmark
 */
function fixMainLandmark(code) {
  if (/<main[\s>]/.test(code)) {
    return code;
  }
  
  let fixed = code;
  
  // Pattern: <body>{children}</body> -> <body><main>{children}</main></body>
  fixed = fixed.replace(
    /<body>(\s*){children}(\s*)<\/body>/,
    '<body><main>$1{children}$2</main></body>'
  );
  
  // Pattern: <> children </> -> <main> children </main>
  // Be careful not to match if already has main
  if (!/<main[\s>]/.test(fixed)) {
    fixed = fixed.replace(
      /<>(\s*)({children})(\s*)<\/>/,
      '<main>$1$2$3</main>'
    );
  }
  
  return fixed;
}

/**
 * Detect all locations that need main landmark fix
 * @param {string} code - The code to analyze
 * @param {string} filename - The filename for context
 * @returns {Array} - Array of issues found
 */
function detectMissingMainLandmarks(code, filename) {
  const issues = [];
  const hasMain = /<main[\s>]/.test(code);
  
  if (!hasMain) {
    // Check for common patterns that indicate need for main landmark
    const hasBody = /<body>/.test(code);
    const hasFragment = /<>/.test(code);
    
    if (hasBody || hasFragment || /<html[^>]*>/.test(code)) {
      issues.push({
        rule: 'REACT_017',
        severity: 'warning',
        message: 'Page has no <main> landmark',
        fix: 'Wrap the primary content in <main> so it can be skipped',
        filename
      });
    }
  }
  
  return issues;
}