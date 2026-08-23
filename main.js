// main.js - Accessibility utility for SVG elements
// Fixes REACT_041 - React SVG Accessible Name warnings

module.exports = {
  /**
   * Check if an SVG element needs an accessible name
   * @param {Element} svg - The SVG element to check
   * @returns {boolean} - True if the SVG needs an accessible name
   */
  needsAccessibleName(svg) {
    const hasAriaLabel = svg.hasAttribute('aria-label');
    const hasAriaLabelledby = svg.hasAttribute('aria-labelledby');
    const hasTitleChild = svg.querySelector('title') !== null;
    const isHidden = svg.getAttribute('aria-hidden') === 'true';

    return !hasAriaLabel && !hasAriaLabelledby && !hasTitleChild && !isHidden;
  },

  /**
   * Add accessible name to an SVG element
   * @param {Element} svg - The SVG element to modify
   * @param {Object} options - Options for adding accessible name
   * @param {string} [options.type='title'] - Type: 'title', 'aria-label', or 'aria-hidden'
   * @param {string} [options.value] - The accessible name value
   */
  addAccessibleName(svg, options = {}) {
    const { type = 'title', value } = options;

    if (type === 'title' && value) {
      // Add title child element (recommended approach)
      const title = document.createElement('title');
      title.textContent = value;
      svg.insertBefore(title, svg.firstChild);
      
      // Ensure role="img" is set for screen readers
      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    } else if (type === 'aria-label' && value) {
      // Add aria-label attribute
      svg.setAttribute('aria-label', value);
    } else if (type === 'aria-hidden') {
      // Mark as decorative if it's purely visual
      svg.setAttribute('aria-hidden', 'true');
    }
  },

  /**
   * Process layout files to fix SVG accessibility issues
   * @param {string} filePath - Path to the layout file
   * @param {string} svgContent - The SVG markup
   * @param {string} [accessibleName] - Optional name for the SVG
   * @returns {string} - Fixed SVG markup
   */
  processSvgAccessibility(filePath, svgContent, accessibleName) {
    // For decorative favicon SVGs, add aria-hidden="true"
    if (filePath.includes('layout.tsx') && accessibleName) {
      // Check if it's a favicon icon definition
      if (svgContent.includes('icon:') || svgContent.includes('icons:')) {
        // Add aria-label to the SVG
        return svgContent.replace(
          /<svg([^>]*)>/,
          `<svg$1 aria-label="${accessibleName}">`
        );
      }
    }
    return svgContent;
  }
};