// main.js

// Function to get accessible name from SVG element
function getSvgAccessibleName(svgElement) {
  if (!svgElement) {
    return '';
  }

  // Check aria-label attribute first
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel.trim();
  }

  // Check aria-labelledby attribute
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelId = ariaLabelledby.trim();
    if (labelId) {
      const labelElement = document.getElementById(labelId);
      if (labelElement && labelElement.textContent) {
        return labelElement.textContent.trim();
      }
    }
  }

  // Check for title element within SVG
  const title = svgElement.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }

  // No accessible name found
  return '';
}

module.exports = { getSvgAccessibleName };