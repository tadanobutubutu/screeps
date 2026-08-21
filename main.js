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
  const hasAriaLabel = Boolean(svgProps['aria-label']);
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
 * Checks for multiple <main> landmark violations in React component structure
 * @param {React.ReactNode} componentTree - The rendered component tree or JSX children
 * @returns {{valid: boolean, issues: string[], mainCount: number}}
 */
export function validateLandmarks(componentTree) {
  const issues = [];
  let mainCount = 0;
  
  function countLandmarks(node) {
    if (!node) return;
    
    // Handle React elements
    if (node && typeof node === 'object') {
      // Count main elements
      if (node.type === 'main') {
        mainCount++;
      }
      
      // Check children recursively
      if (node.props && node.props.children) {
        const children = node.props.children;
        if (Array.isArray(children)) {
          children.forEach(countLandmarks);
        } else {
          countLandmarks(children);
        }
      }
    }
    
    // Handle arrays of nodes
    if (Array.isArray(node)) {
      node.forEach(countLandmarks);
    }
  }
  
  countLandmarks(componentTree);
  
  if (mainCount > 1) {
    issues.push(`Found ${mainCount} <main> landmarks. Only one <main> landmark should exist per page.`);
    issues.push('Consider using <section> or <article> for additional regions.');
  }
  
  return {
    valid: mainCount <= 1,
    issues,
    mainCount
  };
}

/**
 * Helper to replace additional <main> elements with <section> for landmark compliance
 * Use this when a component has conditional rendering paths with multiple mains
 * @param {React.ReactNode} componentTree - The rendered component tree
 * @returns {React.ReactNode} - Component tree with extra <main> replaced to <section>
 */
export function normalizeLandmarks(componentTree) {
  let mainFound = false;
  
  function processNode(node) {
    if (!node || typeof node !== 'object') return node;
    
    if (node.type === 'main') {
      if (mainFound) {
        // Replace second main with section
        return { ...node, type: 'section' };
      }
      mainFound = true;
    }
    
    if (node.props && node.props.children) {
      const children = node.props.children;
      if (Array.isArray(children)) {
        const processed = children.map(processNode);
        return { ...node, props: { ...node.props, children: processed } };
      } else {
        return { 
          ...node, 
          props: { 
            ...node.props, 
            children: processNode(children) 
          } 
        };
      }
    }
    
    return node;
  }
  
  return processNode(componentTree);
}

export default {
  getSVGAriaProps,
  validateSVGAccessibility,
  validateLandmarks,
  normalizeLandmarks
};