// main.js - SVG accessibility tools

const fs = require('fs');
const path = require('path');

/**
 * Extracts the accessible name from SVG content
 * @param {string} svgContent - The raw SVG content
 * @returns {string|null} - The accessible name or null if not found
 */
function extractAccessibleName(svgContent) {
  // Try to extract from <title> element within the SVG
  const titleRegex = /<title[^>]*>([^<]*)<\/title>/i;
  const titleMatch = svgContent.match(titleRegex);
  
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  
  // Try to extract from aria-label attribute on the root <svg> element
  const svgRegex = /<svg[^>]*aria-label=["']([^"']*)["'][^>]*>/i;
  const ariaLabelMatch = svgContent.match(svgRegex);
  
  if (ariaLabelMatch && ariaLabelMatch[1]) {
    return ariaLabelMatch[1].trim();
  }
  
  // Try to extract from title attribute on the root <svg> element
  const titleAttrRegex = /<svg[^>]*title=["']([^"']*)["'][^>]*>/i;
  const titleAttrMatch = svgContent.match(titleAttrRegex);
  
  if (titleAttrMatch && titleAttrMatch[1]) {
    return titleAttrMatch[1].trim();
  }
  
  return null;
}

/**
 * Processes an SVG file and extracts its accessible name
 * @param {string} filePath - Path to the SVG file
 * @returns {string|null} - The accessible name or null if not found
 */
function processSvgFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return extractAccessibleName(content);
  } catch (error) {
    console.error(`Error reading SVG file: ${filePath}`, error.message);
    return null;
  }
}

/**
 * Validates SVG content for accessibility
 * @param {string} svgContent - The SVG content to validate
 * @returns {object} - Validation result with hasAccessibleName boolean
 */
function validateSvgAccessibility(svgContent) {
  const accessibleName = extractAccessibleName(svgContent);
  
  return {
    hasAccessibleName: accessibleName !== null,
    accessibleName: accessibleName,
    message: accessibleName 
      ? `SVG has accessible name: "${accessibleName}"`
      : 'SVG is missing an accessible name (add <title> or aria-label)'
  };
}

// Export functions for testing and external use
module.exports = {
  extractAccessibleName,
  processSvgFile,
  validateSvgAccessibility
};

// Example usage if run directly
if (require.main === module) {
  const testSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>Simple Circle Icon</title>
      <circle cx="50" cy="50" r="40" fill="blue" />
    </svg>
  `;
  
  const name = extractAccessibleName(testSvg);
  console.log('Accessible name:', name);
}