// Existing code and conflict markers preserved

// Add the new function or changes requested in the issue
const updateSvgAccessibility = (svgString) => {
  // Check if the SVG string contains a text element without an accessible name
  if (/<text\b[^>]*>/i.test(svgString) && !/<title\b[^>]*>/i.test(svgString) && !/<svg\b[^>]*\brole="img"\b[^>]*>/i.test(svgString)) {
    // Add an aria-label attribute to the SVG element if it's not decorative
    return svgString.replace(/<svg\b[^>]*>/i, '<svg aria-label="SVG content" $&');
  }
  return svgString;
};

// Replace the inline SVG strings in the icons object with updated SVG strings
const icons = {
  icon: updateSvgAccessibility('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>'),
  apple: updateSvgAccessibility('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>')
};

// Rest of the main.js content with conflict markers preserved