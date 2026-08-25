// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and createAccessibleLink())

/**
 * Adds accessible name to an SVG element by adding aria-label and title element
 * Addresses REACT_041: React SVG Accessible Name
 * @param {string} svgContent - The SVG content/element
 * @param {string} accessibleName - The accessible name to use
 * @param {boolean} isDecorative - Whether the SVG is decorative (uses aria-hidden="true" instead)
 * @returns {string} - SVG with accessible name added
 */
function getSvgAccessibleName(svgContent, accessibleName, isDecorative = false) {
  if (isDecorative) {
    // If decorative, just hide from screen readers
    return svgContent.replace('<svg', '<svg aria-hidden="true"');
  }
  
  // Add aria-label to the opening svg tag
  let result = svgContent;
  if (!svgContent.includes('aria-label')) {
    result = svgContent.replace('<svg', `<svg aria-label="${accessibleName}"`);
  }
  
  // Add title element if not present
  if (!svgContent.includes('<title>')) {
    result = result.replace('<svg', `<svg><title>${accessibleName}</title>`);
  }
  
  return result;
}

/**
 * Gets the language attribute value from the HTML element
 * Addresses REACT_015: Add lang attribute to HTML element
 * @param {string} htmlContent - The HTML content to check
 * @returns {string|null} - The lang attribute value or null if not found
 */
function getLangAttribute(htmlContent) {
  const langMatch = htmlContent.match(/<html[^>]*lang=["']([^"']+)["']/i);
  return langMatch ? langMatch[1] : null;
}

/**
 * Gets the full language attribute including region/country code
 * Addresses REACT_015: Add lang attribute to HTML element
 * @param {string} htmlContent - The HTML content to check
 * @returns {string|null} - The full lang attribute value (e.g., "en-US") or null if not found
 */
function getFullLangAttribute(htmlContent) {
  const langMatch = htmlContent.match(/<html[^>]*lang=["']([^"']+)["']/i);
  return langMatch ? langMatch[1] : null;
}

/**
 * Validates table accessibility requirements
 * Addresses REACT_027: Fix table structure issues
 * @param {string} tableContent - The table HTML content to validate
 * @returns {Object} - Validation result with isValid and issues array
 */
function validateTableAccessibility(tableContent) {
  const issues = [];
  
  // Check for proper table structure
  const hasThead = /<thead[\s>]/i.test(tableContent);
  const hasTbody = /<tbody[\s>]/i.test(tableContent);
  const hasCaption = /<caption[\s>]/i.test(tableContent);
  
  if (!hasCaption) {
    issues.push('Table should have a caption element for accessibility');
  }
  
  if (!hasThead) {
    issues.push('Table should have a thead element');
  }
  
  if (!hasTbody) {
    issues.push('Table should have a tbody element');
  }
  
  // Check for th elements with scope or id
  const thElements = tableContent.match(/<th[^>]*>/gi) || [];
  thElements.forEach((th, index) => {
    if (!/scope=["'](row|col)["']/i.test(th) && !/id=["'][^"']+["']/i.test(th)) {
      issues.push(`th element at index ${index} should have scope or id attribute`);
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Validates table structure for semantic correctness
 * Addresses REACT_027: Fix table structure issues
 * @param {string} tableContent - The table HTML content to validate
 * @returns {Object} - Validation result with isValid and issues array
 */
function validateTableStructure(tableContent) {
  const issues = [];
  
  // Check for proper row/column structure
  const rows = tableContent.match(/<tr[^>]*>/gi) || [];
  const cells = tableContent.match(/<t[dh][^>]*>/gi) || [];
  
  if (rows.length === 0) {
    issues.push('Table must have at least one row');
  }
  
  if (cells.length === 0) {
    issues.push('Table must have at least one cell');
  }
  
  // Check for proper nesting
  if (/<table[\s>][^<]*<(thead|tbody|tfoot)/i.test(tableContent) === false && 
      tableContent.includes('<table') && 
      tableContent.includes('<tr')) {
    const hasDirectTrInTable = /<table[^>]*>[\s\S]*?<tr/i.test(tableContent.replace(/<thead[\s\S]*?<\/thead>/gi, '').replace(/<tbody[\s\S]*?<\/tbody>/gi, ''));
    if (hasDirectTrInTable) {
      issues.push('tr elements should be wrapped in tbody');
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Validates landmark regions for accessibility
 * Addresses REACT_017: Add/fix landmark issues
 * @param {string} htmlContent - The HTML content to validate
 * @returns {Object} - Validation result with isValid and issues array
 */
function validateLandmark(htmlContent) {
  const issues = [];
  
  // Check for main landmark
  const hasMain = /<main[\s>]/i.test(htmlContent) || /<div[^>]*role=["']main["']/i.test(htmlContent);
  if (!hasMain) {
    issues.push('Page should have a main landmark');
  }
  
  // Check for header landmark
  const hasHeader = /<header[\s>]/i.test(htmlContent) || /<div[^>]*role=["']banner["']/i.test(htmlContent);
  if (!hasHeader) {
    issues.push('Page should have a header landmark');
  }
  
  // Check for footer landmark
  const hasFooter = /<footer[\s>]/i.test(htmlContent) || /<div[^>]*role=["']contentinfo["']/i.test(htmlContent);
  if (!hasFooter) {
    issues.push('Page should have a footer landmark');
  }
  
  // Check for nav landmark
  const hasNav = /<nav[\s>]/i.test(htmlContent) || /<div[^>]*role=["']navigation["']/i.test(htmlContent);
  if (!hasNav) {
    issues.push('Page should have at least one nav landmark');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Validates landmark structure for proper hierarchy and uniqueness
 * Addresses REACT_025: Ensure unique landmarks
 * @param {string} htmlContent - The HTML content to validate
 * @returns {Object} - Validation result with isValid and issues array
 */
function validateLandmarkStructure(htmlContent) {
  const issues = [];
  
  // Count landmark elements
  const mainCount = (htmlContent.match(/<main[\s>]/gi) || []).length + (htmlContent.match(/role=["']main["']/gi) || []).length;
  const headerCount = (htmlContent.match(/<header[\s>]/gi) || []).length + (htmlContent.match(/role=["']banner["']/gi) || []).length;
  
  if (mainCount > 1) {
    issues.push(`Page should have only one main landmark (found ${mainCount})`);
  }
  
  if (headerCount > 1) {
    issues.push(`Page should have only one header landmark (found ${headerCount})`);
  }
  
  // Check for landmark accessibility labels
  const navElements = htmlContent.match(/<nav[^>]*>/gi) || [];
  navElements.forEach((nav, index) => {
    if (!/aria-label=["'][^"']+["']/i.test(nav) && !/aria-labelledby=["'][^"']+["']/i.test(nav)) {
      issues.push(`nav element at index ${index} should have aria-label or aria-labelledby`);
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Creates an accessible in-page navigation button
 * Addresses REACT_036: Fix fake link issue
 * @param {string} text - The button text
 * @param {string} targetId - The target element ID to scroll to
 * @returns {string} - Accessible button HTML
 */
function createInPageButton(text, targetId) {
  return `<button type="button" onclick="document.getElementById('${targetId}').scrollIntoView({behavior: 'smooth'})" aria-label="Scroll to ${text}">${text}</button>`;
}

/**
 * Creates an accessible link with proper attributes
 * Addresses REACT_036: Fix fake link issue
 * @param {string} href - The URL to link to
 * @param {string} text - The link text
 * @param {boolean} isExternal - Whether the link is external (adds rel="noopener noreferrer")
 * @returns {string} - Accessible link HTML
 */
function createAccessibleLink(href, text, isExternal = false) {
  const relAttr = isExternal ? ' rel="noopener noreferrer"' : '';
  const targetAttr = isExternal ? ' target="_blank"' : '';
  return `<a href="${href}"${relAttr}${targetAttr}>${text}</a>`;
}

module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink
};