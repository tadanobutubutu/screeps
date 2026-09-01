// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// TODO: This is the existing code that needs to be preserved
// ----- END ORIGINAL CODE -----

const AddressabilityIssues = {
  MISSING_ID: 'missing-id',
  MISSING_ARIA_LABEL: 'missing-aria-label',
  MISSING_ROLE: 'missing-role'
};

/**
 * Main application entry point with accessibility features
 */

function initializeAccessibility(svgElements) {
  svgElements.forEach(svg => {
    if (svg && !svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }

    setSvgAttributes(svg);
  });
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || '';
}

function setSvgAttributes(svg) {
  if (!svg) return;
  if (!svg.hasAttribute('width')) {
    svg.setAttribute('width', '24');
  }
  if (!svg.hasAttribute('height')) {
    svg.setAttribute('height', '24');
  }
}

function checkTableStructure(table) {
  if (!table) {
    return { valid: false, error: 'Table element is required' };
  }

  const hasHeader = table.querySelector('thead') !== null || table.querySelector('th') !== null;
  const hasBody = table.querySelector('tbody') !== null;
  const hasCaption = table.querySelector('caption') !== null;

  return {
    valid: true,
    hasHeader,
    hasBody,
    hasCaption
  };
}

module.exports = {
  AddressabilityIssues,
  initializeAccessibility,
  getSvgAccessibleName,
  setSvgAttributes,
  checkTableStructure
};