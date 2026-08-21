// main.js - Fixed with SVG accessibility compliance (REACT_041)

/**
 * Returns accessibility attributes for SVG elements
 * Use this for decorative SVGs that don't need to be announced
 * @param {boolean} isDecorative - Whether the SVG is purely decorative
 * @param {string} [ariaLabel] - Optional accessible name
 * @returns {Object} Accessibility props to spread onto <svg>
 */
export function getSVGAriaProps(isDecorative = false, ariaLabel) {
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
export function validateSVGAccessibility(svgProps) {
  const issues = [];
  
  const hasAriaHidden = svgProps['aria-hidden'] === 'true';
  const hasAriaLabel = svgProps['aria-label'];
  const hasRole = svgProps.role === 'img';
  const hasTitleChild = svgProps.children && 
    (Array.isArray(svgProps.children) 
      ? svgProps.children.some(c => c && c.type === 'title')
      : svgProps.children === 'title');
  
  const isCompliant = hasAriaHidden || hasAriaLabel || hasTitleChild || hasRole;
  
  if (!isCompliant) {
    issues.push('SVG has no accessible name and is not hidden');
  }
  
  return { compliant: isCompliant, issues };
}

/**
 * Returns accessibility attributes for the <main> landmark element (REACT_017)
 * @param {Object} options - Configuration options
 * @param {string} [options.id] - Optional id for the main element
 * @param {string} [options.label] - Optional accessible label if multiple main elements
 * @returns {Object} Accessibility props to spread onto <main>
 */
export function getMainLandmarkProps(options = {}) {
  const props = {};
  
  if (options.id) {
    props.id = options.id;
  }
  
  if (options.label) {
    props['aria-label'] = options.label;
    props.id = options.id || `main-${options.label.toLowerCase().replace(/\s+/g, '-')}`;
  }
  
  return props;
}

/**
 * Validates that a page has proper landmark elements for accessibility (REACT_017)
 * @param {Object} pageStructure - Object describing the page structure
 * @param {boolean} pageStructure.hasMain - Whether the page has a <main> landmark
 * @param {boolean} [pageStructure.hasHeader] - Whether the page has a <header> landmark
 * @param {boolean} [pageStructure.hasNav] - Whether the page has a <nav> landmark
 * @param {boolean} [pageStructure.hasFooter] - Whether the page has a <footer> landmark
 * @returns {{compliant: boolean, issues: string[]}}
 */
export function validateLandmarkCompliance(pageStructure) {
  const issues = [];
  
  if (!pageStructure.hasMain) {
    issues.push('Page has no <main> landmark - wrap primary content in <main> for keyboard and screen reader users');
  }
  
  if (pageStructure.hasMain && !pageStructure.hasHeader) {
    issues.push('Consider adding a <header> landmark for site identification');
  }
  
  if (pageStructure.hasMain && !pageStructure.hasNav) {
    issues.push('Consider adding a <nav> landmark for navigation links');
  }
  
  if (pageStructure.hasMain && !pageStructure.hasFooter) {
    issues.push('Consider adding a <footer> landmark for supplementary information');
  }
  
  return {
    compliant: pageStructure.hasMain,
    issues
  };
}

/**
 * Generates a properly structured main element template
 * @param {string} content - The inner content HTML/JSX
 * @param {Object} options - Configuration options
 * @returns {string} Template string for the main element
 */
export function generateMainTemplate(content, options = {}) {
  const id = options.id || 'main-content';
  const label = options.label || null;
  
  let mainOpen = `<main id="${id}"`;
  if (label) {
    mainOpen += ` aria-label="${label}"`;
  }
  mainOpen += '>';
  
  return `${mainOpen}
        ${content}
    </main>`;
}

export default {
  getSVGAriaProps,
  validateSVGAccessibility,
  getMainLandmarkProps,
  validateLandmarkCompliance,
  generateMainTemplate
};