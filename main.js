import React from 'react';
import PropTypes from 'prop-types';

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

const Root = ({ children }) => (
  <html lang="en">
    <head>
      {/* Add appropriate meta tags and styles for your app here */}
    </head>
    <body>
      <header role="banner">
        {/* Add your header markup here */}
      </header>
      <main role="main">
        {children}
      </main>
      <footer role="contentinfo">
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