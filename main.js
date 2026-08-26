// Existing code from main.js
// ... (preserved code)

// Add the new function or changes requested in the issue
function fixSVGAccessibility(svgString) {
  // Check if the SVG has a <title> or <desc> element
  const hasTitleOrDesc = /<title\b[^>]*>(.*?)<\/title>|<desc\b[^>]*>(.*?)<\/desc>/gi.test(svgString);
  if (!hasTitleOrDesc) {
    // Add a <title> element with an aria-label attribute
    const title = 'Accessible SVG Content';
    const updatedSVGString = svgString.replace(/<svg\b[^>]*>/, `<svg aria-label="${title}" xmlns="http://www.w3.org/2000/svg">`);
    return updatedSVGString;
  }
  return svgString;
}

// Example usage of the function
const originalSVGString = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>';
const fixedSVGString = fixSVGAccessibility(originalSVGString);
console.log(fixedSVGString);

// ... (rest of the preserved code)