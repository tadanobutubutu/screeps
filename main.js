import React from 'react';
import ReactDOM from 'react-dom';

// Example component (assuming this is where the <html> tag is being used)
const App = () => {
  return (
    <html>
      <head>
        <title>My App</title>
      </head>
      <body>
        <div>
          {/* App content */}
        </div>
      </body>
    </html>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

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

export default {
  getSVGAriaProps,
  validateSVGAccessibility
};