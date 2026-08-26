import React from 'react';
import PropTypes from 'prop-types';

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// Function to ensure the element has an id (for accessibility linkage)
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

// Function to add aria-label to the element
function addAriaLabel(element, labelText) {
  element.setAttribute('aria-label', labelText);
  return element;
}

const Root = ({ children }) => (
  <html lang="en">
    <head>
      {/* Add appropriate meta tags and styles for your app here */}
    </head>
    <body>
      <header role="banner" aria-label="Site header">
        {/* Add your header markup here */}
      </header>
      <main role="main">
        {children}
      </main>
      <footer role="contentinfo" aria-label="Site footer">
        {/* Add your footer markup here */}
      </footer>
    </body>
  </html>
);

Root.propTypes = {
  children: PropTypes.node.isRequired,
};

// Your existing components, functions and exports in main.js

// Example of adding accessible names to 2 SVGs
const AccessibleSVG = ({ svgContent, accessibleName }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    aria-labelledby="accessible-name-example"
  >
    <title id="accessible-name-example">{accessibleName}</title>
    {svgContent}
  </svg>
);

export default Root;

// Export for testing purposes
module.exports = {
  ensureElementHasId,
  addAriaLabel
};