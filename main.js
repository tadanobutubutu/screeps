// main.js
export function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svgElement - The SVG element to get the accessible name for
 * @returns {string} The accessible name for the SVG
 */
export function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';
  
  // Check for existing aria-label
  const existingLabel = svgElement.getAttribute('aria-label');
  if (existingLabel) return existingLabel;
  
  // Check for title element inside SVG
  const title = svgElement.querySelector('title');
  if (title) return title.textContent;
  
  // Fallback based on class or id
  const className = svgElement.getAttribute('class') || '';
  const id = svgElement.getAttribute('id') || '';
  
  return className || id || '';
}

/**
 * Sets accessibility attributes on an SVG element.
 * @param {SVGElement} svgElement - The SVG element to set attributes on
 * @param {string} name - The accessible name to set
 */
export function setSvgAttributes(svgElement, name) {
  if (!svgElement) return;
  
  svgElement.setAttribute('role', 'img');
  svgElement.setAttribute('aria-label', name);
}

// ... rest of the code ...