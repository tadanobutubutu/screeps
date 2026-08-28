// main.js

// Function to get accessible name for an SVG element
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';
  
  // Check for title element within SVG
  const title = svgElement.querySelector('title');
  if (title && title.textContent) return title.textContent.trim();
  
  // Check for aria-label attribute
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check for id that references a title
  const id = svgElement.getAttribute('id');
  if (id) {
    const referencedTitle = document.getElementById(id);
    if (referencedTitle && referencedTitle.textContent) {
      return referencedTitle.textContent.trim();
    }
  }
  
  return '';
}

// Function to set accessibility attributes on SVG elements
function setSvgAttributes(svgElements) {
  if (!svgElements || !Array.isArray(svgElements)) return;
  
  svgElements.forEach((svg, index) => {
    if (!svg) return;
    
    // Get or create a title element for accessibility
    let title = svg.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      svg.insertBefore(title, svg.firstChild);
    }
    
    // Set a default accessible name if none exists
    const accessibleName = getSvgAccessibleName(svg);
    if (!accessibleName) {
      title.textContent = `SVG ${index + 1}`;
    }
    
    // Ensure the SVG has proper ARIA attributes
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
    
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      svg.setAttribute('aria-label', `SVG ${index + 1}`);
    }
  });
}

export { getSvgAccessibleName, setSvgAttributes };