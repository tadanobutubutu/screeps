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
  const hasAriaLabel = !!svgProps['aria-label'];
  const hasRole = svgProps.role === 'img';
  
  // Helper function to check if a child element is a title
  const isTitleElement = (child) => {
    if (!child || typeof child !== 'object') return false;
    const childType = child.type;
    return childType === 'title' || childType === 'Title';
  };
  
  // Check for title child element
  const children = svgProps.children;
  let hasTitleChild = false;
  
  if (children) {
    if (Array.isArray(children)) {
      hasTitleChild = children.some(isTitleElement);
    } else if (typeof children === 'object') {
      hasTitleChild = isTitleElement(children);
    } else if (typeof children === 'string') {
      hasTitleChild = children.includes('<title');
    }
  }
  
  const isCompliant = hasAriaHidden || hasAriaLabel || hasTitleChild || hasRole;
  
  if (!isCompliant) {
    issues.push('SVG has no accessible name and is not hidden');
  }
  
  return { compliant: isCompliant, issues };
}

export default {
  getSVGAriaProps,
  validateSVGAccessibility
};