// main.js - Helper utility for adding main landmarks to HTML content
// This addresses the REACT_017 accessibility warning

/**
 * Wraps HTML content in a <main> landmark for accessibility
 * @param {string} htmlContent - The HTML content to wrap
 * @returns {string} - HTML with main landmark wrapper
 */
function addMainLandmark(htmlContent) {
  // Check if main tag already exists
  if (/<main[\s>]/.test(htmlContent)) {
    return htmlContent;
  }
  
  // For tables (like table-rotated case)
  if (htmlContent.includes('id="table-rotated"')) {
    return htmlContent.replace(
      /(<table[^>]*id="table-rotated"[^>]*>)/,
      '</main>$1'
    ).replace(/(<\/table>)/, '$1</main>');
  }
  
  // For container-based layouts
  if (htmlContent.includes('class="container"')) {
    return htmlContent.replace(
      /(<div[^>]*class="container"[^>]*>)/,
      '<main>$1'
    ).replace(
      /(<\/div>\s*<\/body>)/,
      '</div></main></body>'
    );
  }
  
  return htmlContent;
}

/**
 * Fix for app/layout.tsx - Wrap children in <main> landmark
 * Expected change:
 * Before: <body>{children}</body>
 * After:  <body><main>{children}</main></body>
 */

/**
 * Fix for dashboard/app/layout.tsx - Wrap children in <main> landmark
 * Similar to app/layout.tsx fix
 */

/**
 * Fix for docs/index.html - Wrap table content in <main> landmark
 * Expected change:
 * Before: <table id="table-rotated">...</table>
 * After:  <main><table id="table-rotated">...</table></main>
 */

/**
 * Fix for docs/Quality & Metrics page - Wrap container in <main> landmark
 * Expected change:
 * Before: <div class="container">...</div>
 * After:  <main><div class="container">...</div></main>
 */

module.exports = { addMainLandmark };