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
      : svgProps.children.type === 'title');
  
  const isCompliant = hasAriaHidden || hasAriaLabel || hasTitleChild || hasRole;
  
  if (!isCompliant) {
    issues.push('SVG has no accessible name and is not hidden');
  }
  
  return { compliant: isCompliant, issues };
}

/**
 * Validates anchor link accessibility (REACT_036)
 * Detects hash-only href links that don't navigate anywhere
 * @param {Object} anchorProps - Props from an anchor element
 * @returns {{compliant: boolean, issues: string[], suggestion: string}}
 */
export function validateAnchorAccessibility(anchorProps) {
  const issues = [];
  const { href, onClick, role, 'aria-label': ariaLabel } = anchorProps;
  
  // Check if it's a hash-only link
  const isHashLink = href === '#' || (href && href.startsWith('#') && href.length === 1);
  
  if (isHashLink) {
    // Check if proper accessibility measures are in place
    const hasClickHandler = typeof onClick === 'function';
    const hasRole = role !== undefined;
    const hasAriaLabel = ariaLabel !== undefined;
    
    // A hash link without proper accessibility is a "fake link"
    if (!hasClickHandler && !hasRole && !hasAriaLabel) {
      issues.push('Hash-only href="#" does not navigate - use <button> for in-page actions');
    }
    
    if (hasClickHandler && !onClick._isSyntheticEvent) {
      // Plain function without preventing default - common issue
      issues.push('onClick should call event.preventDefault() for hash links');
    }
    
    if (!hasRole && !hasAriaLabel) {
      issues.push('Hash link lacks role or aria-label for screen reader support');
    }
  }
  
  const isCompliant = issues.length === 0;
  
  const suggestion = isHashLink 
    ? 'Use <button> element instead of <a href="#"> for in-page actions to ensure proper keyboard and screen reader behavior'
    : '';
  
  return { compliant: isCompliant, issues, suggestion };
}

/**
 * Returns appropriate element type recommendation based on href
 * @param {string} href - The href attribute value
 * @returns {{element: string, reason: string}}
 */
export function getLinkRecommendation(href) {
  if (href === '#' || (href && href.startsWith('#') && href.length === 1)) {
    return {
      element: 'button',
      reason: 'In-page actions should use <button> for proper accessibility'
    };
  }
  
  return {
    element: 'a',
    reason: 'External or page navigation should use <a> with proper href'
  };
}

export default {
  getSVGAriaProps,
  validateSVGAccessibility,
  validateAnchorAccessibility,
  getLinkRecommendation
};