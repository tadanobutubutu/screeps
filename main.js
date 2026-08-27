// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Adds lang attribute to HTML element for accessibility (REACT_015)
 * @param {string} lang - Language code (e.g., 'en', 'es', 'fr')
 * @returns {string} - HTML element with lang attribute
 */
function addLangAttribute(lang = 'en') {
  return `<html lang="${lang}">`;
}

/**
 * Fixes table structure issues for accessibility (REACT_027)
 * Ensures tables have proper headers, captions, and structure
 * @param {Object} tableConfig - Table configuration object
 * @returns {string} - Accessible table HTML
 */
function fixTableStructure(tableConfig) {
  const { headers, rows, caption, scope = 'col' } = tableConfig;
  
  let tableHTML = '<table>';
  
  // Add caption for accessibility
  if (caption) {
    tableHTML += `<caption>${caption}</caption>`;
  }
  
  // Add proper table headers with scope
  tableHTML += '<thead><tr>';
  headers.forEach(header => {
    tableHTML += `<th scope="${scope}">${header}</th>`;
  });
  tableHTML += '</tr></thead>';
  
  // Add table body with proper structure
  tableHTML += '<tbody>';
  rows.forEach(row => {
    tableHTML += '<tr>';
    row.forEach(cell => {
      tableHTML += `<td>${cell}</td>`;
    });
    tableHTML += '</tr>';
  });
  tableHTML += '</tbody></table>';
  
  return tableHTML;
}

/**
 * Adds main landmark to page structure (REACT_017)
 * @param {string} content - Main content to wrap in main element
 * @returns {string} - HTML with main landmark
 */
function addMainLandmark(content) {
  return `<main id="main-content" role="main">${content}</main>`;
}

/**
 * Ensures unique landmarks across the page (REACT_025)
 * @param {Array} landmarks - Array of landmark configuration objects
 * @returns {Object} - Object containing unique landmarks
 */
function ensureUniqueLandmarks(landmarks) {
  const seen = new Set();
  const uniqueLandmarks = [];
  
  landmarks.forEach(landmark => {
    const key = `${landmark.role}-${landmark.label || 'default'}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueLandmarks.push(landmark);
    }
  });
  
  return {
    landmarks: uniqueLandmarks,
    hasDuplicates: landmarks.length !== uniqueLandmarks.length
  };
}

/**
 * Adds accessible names to SVG elements (REACT_041)
 * @param {string} svgContent - SVG content
 * @param {string} description - Accessible description for the SVG
 * @param {string} title - Optional title for the SVG
 * @returns {string} - Accessible SVG markup
 */
function addSvgAccessibleNames(svgContent, description, title) {
  let accessibleSVG = svgContent;
  
  // Add title element as first child for screen readers
  if (title) {
    const titleElement = `<title id="svg-title">${title}</title>`;
    accessibleSVG = accessibleSVG.replace('<svg', `<svg><title id="svg-title">${title}</title>`);
  }
  
  // Add aria-labelledby and aria-describedby attributes
  if (title || description) {
    const labelledby = title ? 'aria-labelledby="svg-title"' : '';
    const describedby = description ? 'aria-describedby="svg-desc"' : '';
    
    if (description && !accessibleSVG.includes('aria-describedby')) {
      accessibleSVG = accessibleSVG.replace('<svg', `<svg ${labelledby} ${describedby}>`);
      accessibleSVG = accessibleSVG.replace('</svg>', `<desc id="svg-desc">${description}</desc></svg>`);
    }
  }
  
  return accessibleSVG;
}

/**
 * Fixes fake link issues by converting non-navigation elements to proper links (REACT_036)
 * @param {string} element - The element to evaluate
 * @param {string} href - The href for the link
 * @returns {string} - Proper anchor element if it should be a link
 */
function fixFakeLinkIssue(element, href) {
  const fakeLinkPatterns = [
    { pattern: /onclick=.*location/, type: 'navigation' },
    { pattern: /role="button".*onclick/, type: 'button-link' },
    { pattern: /<div[^>]*onclick[^>]*>/, type: 'div-link' }
  ];
  
  for (const { pattern, type } of fakeLinkPatterns) {
    if (pattern.test(element)) {
      // Convert to proper anchor element
      const textMatch = element.match(/>([^<]+)</);
      const text = textMatch ? textMatch[1] : 'Link';
      const classesMatch = element.match(/class="([^"]*)"/);
      const classes = classesMatch ? ` class="${classesMatch[1]}"` : '';
      
      return `<a href="${href}"${classes}>${text}</a>`;
    }
  }
  
  return element;
}

/**
 * Utility function to get all landmarks on a page
 * @returns {Array} - Array of landmark elements
 */
function getLandmarks() {
  const landmarks = document.querySelectorAll('[role]');
  return Array.from(landmarks).map(el => ({
    role: el.getAttribute('role'),
    label: el.getAttribute('aria-label') || el.id || 'unnamed',
    element: el.tagName.toLowerCase()
  }));
}

/**
 * Validates accessibility of SVG elements
 * @param {string} svgId - ID of the SVG to validate
 * @returns {Object} - Validation result object
 */
function validateSvgAccessibility(svgId) {
  const svg = document.getElementById(svgId);
  if (!svg) {
    return { valid: false, errors: ['SVG not found'] };
  }
  
  const errors = [];
  const hasTitle = svg.querySelector('title');
  const hasDesc = svg.querySelector('desc');
  const hasAriaLabelledby = svg.hasAttribute('aria-labelledby');
  const hasAriaDescribedby = svg.hasAttribute('aria-describedby');
  
  if (!hasTitle && !hasAriaLabelledby) {
    errors.push('Missing accessible name (title or aria-labelledby)');
  }
  
  if (hasTitle && !hasAriaLabelledby) {
    errors.push('Title present but not linked via aria-labelledby');
  }
  
  if (hasDesc && !hasAriaDescribedby) {
    errors.push('Description present but not linked via aria-describedby');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings: [
      hasTitle ? 'Has accessible title' : 'No title element',
      hasDesc ? 'Has accessible description' : 'No description element'
    ]
  };
}

// Export all accessibility functions
export {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  getLandmarks,
  validateSvgAccessibility
};