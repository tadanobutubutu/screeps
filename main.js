// main.js - Fixed with SVG accessibility compliance (REACT_041)

/**
 * Returns accessibility attributes for SVG elements
 * Use this for decorative SVGs that don't need to be announced
 * @param {boolean} isDecorative - Whether the SVG is purely decorative
 * @param {string} [ariaLabel] - Optional accessible name
 * @returns {Object} Accessibility props to spread onto <svg>
 */
export function ... = false, ariaLabel) {
  if (isDecorative) {
    return { 'aria-hidden': 'true' };
  }
  
  if (ariaLabel) {
    return { 'aria-label': ariaLabel, role: 'img' };
  }
  
  // Fallback: add role for better screen reader support
  return { role: 'img' };
}

// Example usage in layout files:
// 
// BEFORE (accessibility warning):
// <svg viewBox="0 0 32 32" width="32" height="32">
//   <path d="..." />
// </svg>
//
// AFTER (fixed - decorative SVG):
// <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
//   <path d="..." />
// </svg>
//
// AFTER (fixed - with accessible name):
// <svg viewBox="0 0 32 32" width="32" height="32" aria-label="Application logo">
//   <title>Application logo</title>
//   <path d="..." />
// </svg>

/**
 * Validates SVG accessibility compliance
 * @param {Object} svgProps - Props from an SVG element
 * @returns {{compliant: boolean, issues: string[]}}
 */
export function ... {
  const issues = [];
  
  const hasAriaHidden = ... === 'true';
  const hasAriaLabel = ...
  const hasRole = svgProps.role === 'img';
  const hasTitleChild = svgProps.children && 
    ... 
      ? ... => c && c.type === 'title')
      : ... === 'title');
  
  const isCompliant = hasAriaHidden || hasAriaLabel || hasTitleChild || hasRole;
  
  if (!isCompliant) {
    issues.push('SVG has no accessible name and is not hidden');
  }
  
  return { compliant: isCompliant, issues };
}

/**
 * Returns the appropriate scope attribute for a table header cell
 * @param {Object} options - Options for determining scope
 * @param {boolean} options.isRowHeader - Whether this is a row header (first cell in a row)
 * @param {boolean} options.isColumnHeader - Whether this is a column header (first cell in a column/header row)
 * @returns {string} The scope attribute value ('col', 'row', 'colgroup', or 'rowgroup')
 */
export function getThScope({ isRowHeader = false, isColumnHeader = false }) {
  if (isRowHeader && isColumnHeader) {
    return ''; // Corner cell - no scope needed
  }
  if (isRowHeader) {
    return 'row';
  }
  if (isColumnHeader) {
    return 'col';
  }
  return ''; // No scope specified
}

/**
 * Validates table header accessibility compliance
 * @param {Array} thElements - Array of th element props or DOM elements
 * @returns {{compliant: boolean, issues: string[]}}
 */
export function validateTableAccessibility(thElements) {
  const issues = [];
  
  if (!thElements || thElements.length === 0) {
    return { compliant: true, issues: [] };
  }
  
  thElements.forEach((th, index) => {
    // Handle both props objects and DOM elements
    const scope = typeof th.getAttribute === 'function' 
      ? th.getAttribute('scope') 
      : th.scope;
    
    if (!scope) {
      issues.push(`Header at index ${index} has no scope attribute`);
    } else if (scope !== 'col' && scope !== 'row' && scope !== 'colgroup' && scope !== 'rowgroup') {
      issues.push(`Header at index ${index} has invalid scope value: ${scope}`);
    }
  });
  
  return { compliant: issues.length === 0, issues };
}

export default {
  getSVGAriaProps,
  validateSVGAccessibility,
  getThScope,
  validateTableAccessibility
};