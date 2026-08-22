// Existing code from main.js
// ... (preserved code)

// Add the new function or changes requested in the issue
function addAccessibleNameToSVG(svgData) {
  // Check if the SVG data contains a title element
  const hasTitle = svgData.includes('<title>');
  
  // If no title element is found, add a title with aria-label
  if (!hasTitle) {
    return svgData.replace('</svg>', ' aria-label="Accessible SVG Content" />');
  }
  
  // If a title element is found, check if it has an aria-label
  const hasAriaLabel = svgData.includes('aria-label="');
  if (!hasAriaLabel) {
    return svgData.replace('</title>', ' aria-label="Accessible SVG Content" />');
  }
  
  // If aria-label is already present, no changes are needed
  return svgData;
}

// Example usage of the new function
const svgData = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>';
const updatedSVGData = addAccessibleNameToSVG(svgData);

// ... (rest of the preserved code)