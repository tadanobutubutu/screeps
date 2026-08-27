// main.js

// TODO: Implement getSvgAccessibleName functionality
function getSvgAccessibleName(svgElement) {
  if (!svgElement) {
    return null;
  }
  
  // Check for aria-label attribute
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel.trim();
  }
  
  // Check for aria-labelledby attribute
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement && labelElement.textContent) {
      return labelElement.textContent.trim();
    }
  }
  
  // Check for title element within the SVG
  const titleElement = svgElement.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent.trim();
  }
  
  return null;
}

module.exports = { getSvgAccessibleName };