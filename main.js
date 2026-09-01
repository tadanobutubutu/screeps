// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs

const AddressabilityIssues = {
  MISSING_ID: 'element-missing-id',
  MISSING_ARIA_LABEL: 'element-missing-aria-label',
  MISSING_ROLE: 'element-missing-role',
  MISSING_TABLE_HEADER: 'table-missing-header',
  MISSING_TABLE_BODY: 'table-missing-body',
  MISSING_TABLE_CAPTION: 'table-missing-caption'
};

/**
 * Main application entry point with accessibility features
 */

function processSvgElements(svgElements) {
  svgElements.forEach(svg => {
    if (svg) {
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
  return svg.getAttribute('aria-label') || svg.getAttribute('id') || '';
}

function setSvgAttributes(svg) {
  if (!svg) return;
  if (!svg.getAttribute('width')) {
    svg.setAttribute('width', '24');
  }
  if (!svg.getAttribute('height')) {
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

// Validate accessibility compliance for a given element
function validateAccessibility(element) {
  if (!element) {
    return { valid: false, error: 'Element is required' };
  }

  const issues = [];
  const tagName = element.tagName ? element.tagName.toLowerCase() : '';

  if (tagName === 'svg') {
    if (!element.id && !element.getAttribute('aria-label')) {
      issues.push(AddressabilityIssues.MISSING_ID);
    }
    if (!element.getAttribute('role')) {
      issues.push(AddressabilityIssues.MISSING_ROLE);
    }
    if (!element.getAttribute('aria-label')) {
      issues.push(AddressabilityIssues.MISSING_ARIA_LABEL);
    }
  }

  if (tagName === 'table') {
    const tableCheck = checkTableStructure(element);
    if (!tableCheck.hasHeader) {
      issues.push(AddressabilityIssues.MISSING_TABLE_HEADER);
    }
    if (!tableCheck.hasBody) {
      issues.push(AddressabilityIssues.MISSING_TABLE_BODY);
    }
    if (!tableCheck.hasCaption) {
      issues.push(AddressabilityIssues.MISSING_TABLE_CAPTION);
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

module.exports = {
  AddressabilityIssues,
  processSvgElements,
  getSvgAccessibleName,
  setSvgAttributes,
  checkTableStructure,
  validateAccessibility
};