import React from 'react';
import ReactDOM from 'react-dom';

// Example component (assuming this is where the <html> tag is being used)
const App = () => {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body>
        <div className="app-container">
          {/* App content */}
        </div>
      </body>
    </html>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

// main.js - Fixed with SVG accessibility compliance (REACT_041)

/**
 * Returns accessibility attributes for SVG elements
 * Use this for decorative SVGs that don't need to be announced
 * @param {boolean} isDecorative - Whether the SVG is purely decorative
 * @param {string} [ariaLabel] - Optional accessible name
 * @param {Object} [svgProps] - Props to check for title child
 * @returns {Object} Accessibility props to spread onto <svg>
 */
export function getSVGAriaProps(isDecorative = false, ariaLabel, svgProps = {}) {
  if (isDecorative) {
    return { 'aria-hidden': 'true' };
  }

  if (ariaLabel) {
    return { 'aria-label': ariaLabel, role: 'img' };
  }

  // Incorporate check for 'title' child element from the other change
  const hasTitleChild = svgProps && svgProps.children &&
    (Array.isArray(svgProps.children)
      ? svgProps.children.some(c => c && c.type === 'title')
      : svgProps.children === 'title');

  if (!hasTitleChild && !ariaLabel) {
    // Fallback: add role for better screen reader support
    return { role: 'img' };
  }

  return {};
}

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

// Rest of the file remains unchanged
// The resolution incorporates both changes by adding an additional check for the `title` child element, which was introduced in one of the changes. This way, the function handles both options: when there is an accessible name provided or when it is derived from the `title` child element.