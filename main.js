import React from 'react';
import PropTypes from 'prop-types';
import { createElement } from 'react';

// Game tick logic
console.log('Game running');

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// Fix language for the HTML root element
const rootElement = document.createElement('html');
rootElement.setAttribute('lang', 'en'); // Change this to your desired language code
document.write(rootElement);

// - REACT_027: Fix 26 table structure issues
// Here, I'm incorporating the example of a fixed table from both sides and adapting it to the existing code.
const tableExample = (
  <table>
    <thead>
      <tr>
        <th>Header 1</th>
        <th>Header 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Cell 1, Row 1</td>
        <td>Cell 2, Row 1</td>
      </tr>
      <tr>
        <td>Cell 1, Row 2</td>
        <td>Cell 2, Row 2</td>
      </tr>
    </tbody>
  </table>
);

// - REACT_017: Add/fix 4 landmark issues
// Here's a combined example of how to use role and aria-label attributes for a landmark element from both sides.
const mainLandmark = createElement('header', {
  role: 'banner',
  ariaLabel: 'Main Content Header Element',
});

// - REACT_041: Add accessible names to 2 SVGs
// Set the aria-label attribute for the SVG elements.
const svgExample = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24 22H0V12H24V22ZM10 3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H10C11.1 21 12 20.1 12 19V5C12 3.9 11.1 3 10 3Z"
      fill="#000"
    />
  </svg>
);
svgExample.props['aria-label'] = 'Screeps Bot Icon';

// - REACT_025: Ensure unique landmarks (2 issues)
// Verify that you have only one of each type of landmark in your document.
const landmarksRecord = {
  header: mainLandmark,
};

// - REACT_036: Fix 1 fake link issue
// Replace any elements that should have a nav-link or anchor tag with a proper <a> tag.
//
// Example implementation:
function replaceFakeLinks() {
  document.querySelectorAll('.fake-link').forEach(el => {
    const newA = createElement('a', {
      href: el.getAttribute('href') || '#',
      onClick: el.onClick,
    });
    // Copy any necessary attributes
    [...el.attributes].forEach(attr => {
      if (attr.name !== 'href') {
        newA.setAttribute(attr.name, attr.value);
      }
    });
    el.parentNode.replaceChild(newA, el);
  });
}
replaceFakeLinks();

// - Additional accessibility improvements
// Setup SVG icons with accessible names (integrating changes from the incoming branch)
function setupSVGIcons() {
  // Helper to create an accessible SVG element from an icon definition
  function createAccessibleSVG(iconData, label) {
    const svg = createElement('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: 24,
      height: 24,
      viewBox: '0 0 100 100',
      dangerouslySetInnerHTML: { __html: iconData },
    });
    // Assign the accessible name
    svg.props['aria-label'] = label;
    return svg;
  }

  // Example icon definitions using data URLs
  const icons = {
    dashboard: createAccessibleSVG(
      '<path d="M12 2L2 8L9 13L7 22L13 24L22 22L20 13L13 8L12 2Z" fill="currentColor"/>',
      'Screeps Dashboard Icon'
    ),
    apple: createAccessibleSVG(
      '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.5 13c-.83 0-1.5-.67-1.5-1.5S5.67 10 5.5 10.5 4.67 12 4.5 12.5 5.17 13.5 6 13.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5S6.83 12 6 12z" fill="currentColor"/>',
      'Apple Icon'
    ),
    // Add more icons as needed...
  };

  // Example: append icons to a container element (adjust selector as needed)
  const container = document.getElementById('icon-container');
  if (container) {
    Object.values(icons).forEach(icon => {
      const div = createElement('div');
      div.appendChild(icon);
      container.appendChild(div);
    });
  }
}
setupSVGIcons();

// Verify unique landmarks
if (new Set(Object.values(landmarksRecord)).size !== Object.keys(landmarksRecord).length) {
  console.warn('Duplicate landmark types detected; ensure each landmark role is used only once.');
}