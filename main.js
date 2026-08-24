// Original code that might have looked like this:
/*
<rootElement> ... </rootElement>
*/

// Updated code with the lang attribute added to the HTML root element
document.documentElement.lang = 'en'; // Replace 'en' with the appropriate language code

/**
 * Utility to ensure SVG elements have proper accessible names
 * This helps fix REACT_041 - React SVG Accessible Name warnings
 */
function ensureSvgAccessible(svgString, accessibleName, isDecorative = false) {
  if (isDecorative) {
    // For decorative SVGs, add aria-hidden="true"
    return svgString.replace('<svg', '<svg aria-hidden="true"');
  }
  
  if (accessibleName) {
    // Add aria-label to the SVG element
    svgString = svgString.replace('<svg', `<svg aria-label="${accessibleName}"`);
    
    // Check if title already exists, if not add one
    if (!svgString.includes('<title>')) {
      svgString = svgString.replace('<svg', '<svg><title>' + accessibleName + '</title>');
    }
  }
  
  return svgString;
}

/**
 * Validates that an SVG has an accessible name
 * Returns true if SVG is accessible (has aria-label, title, or aria-hidden)
 */
function isSvgAccessible(svgString) {
  return (
    svgString.includes('aria-label=') ||
    svgString.includes('aria-labelledby=') ||
    (svgString.includes('<title>') && svgString.includes('</title>')) ||
    svgString.includes('aria-hidden="true"')
  );
}