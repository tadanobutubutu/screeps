// main.js

// ... existing code ...

// Add new function to fix the React SVG accessible name issue
function addAccessibleNameToSVG(svgString) {
  // Check if the SVG has a <title> or an <aria-label>
  const hasTitle = svgString.includes('<title>');
  const hasAriaLabel = svgString.includes('aria-label="');

  // If it doesn't have an accessible name, we will add an <title> element
  if (!hasTitle && !hasAriaLabel) {
    // Extract the SVG XML, except for the closing </svg> tag
    const svgXML = svgString.split('</svg>')[0];

    // Add a <title> element with the default name
    const titleContent = 'SVG Content';
    const newSVGXML = `${svgXML}</title>`;

    // Replace the original SVG XML with the updated one
    svgString = svgString.replace('</svg>', `</title>${newSVGXML}</svg>`);
  }

  return svgString;
}

// ... existing code ...

// Example of usage in a component where the SVG string is defined
const icons = {
  icon: addAccessibleNameToSVG('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>'),
  apple: addAccessibleNameToSVG('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>'),
};

// ... existing code ...

// Output the complete updated main.js content