const fs = require('fs');
const path = require('path');

// Import dependency graph and index content modules
const dependencyGraphContent = '';
const indexContent = '';

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form'];

/**
 * Checks landmark elements in HTML content for accessibility compliance.
 * @param {string} htmlContent - The HTML content to check
 * @returns {Object} - Object containing landmark element information and any warnings
 */
function checkLandmarkElements(htmlContent) {
  // Validate input
  if (typeof htmlContent !== 'string') {
    throw new Error('HTML content must be a string');
  }

  const warnings = [];
  const foundLandmarks = {};

  // Check for each landmark element in the HTML content
  LANDMARK_ELEMENTS.forEach((landmark) => {
    // Use case-insensitive regex to find landmark elements
    const regex = new RegExp(`<${landmark}[^>]*>`, 'gi');
    const matches = htmlContent.match(regex);
    if (matches) {
      foundLandmarks[landmark] = matches.length;
    }
  });

  // Check for required main landmark
  if (!foundLandmarks.main) {
    warnings.push('Missing main landmark element');
  }

  // Check for duplicate landmarks (potential issue)
  Object.keys(foundLandmarks).forEach((landmark) => {
    if (foundLandmarks[landmark] > 1) {
      warnings.push(`Duplicate ${landmark} elements found`);
    }
  });

  return {
    foundLandmarks,
    warnings,
    hasMainLandmark: !!foundLandmarks.main
  };
}

/**
 * Validates the landmark structure for accessibility issues
 * @param {Document|Element} context - The document or container to validate
 * @returns {Object} Validation result with issues array
 */
function validateLandmarkStructure(context = document) {
  const issues = [];

  // Check for multiple <main> elements (should be exactly one)
  const mainElements = context.querySelectorAll('main');
  if (mainElements.length === 0) {
    issues.push({
      type: 'error',
      code: 'MISSING_MAIN',
      message: 'Document should contain exactly one <main> landmark for main content'
    });
  } else if (mainElements.length > 1) {
    issues.push({
      type: 'error',
      code: 'MULTIPLE_MAIN',
      message: `Document contains ${mainElements.length} <main> elements. Only one is allowed per page.`
    });
  }

  // Validate sections have accessible names
  const sections = context.querySelectorAll('section');
  sections.forEach((section, index) => {
    const hasLabel = section.getAttribute('aria-label') ||
                     section.getAttribute('aria-labelledby') ||
                     section.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      issues.push({
        type: 'warning',
        code: 'SECTION_WITHOUT_NAME',
        message: `Section element at index ${index} should have an accessible name (aria-label, aria-labelledby, or heading)`
      });
    }
  });

  // Validate forms have accessible names
  const forms = context.querySelectorAll('form');
  forms.forEach((form, index) => {
    const hasLabel = form.getAttribute('aria-label') ||
                     form.getAttribute('aria-labelledby') ||
                     form.getAttribute('title') ||
                     form.querySelector('legend');
    if (!hasLabel && form.querySelectorAll('input, select, textarea').length > 0) {
      issues.push({
        type: 'warning',
        code: 'FORM_WITHOUT_NAME',
        message: `Form at index ${index} should have an accessible name if it contains form controls`
      });
    }
  });

  // Validate navigation elements
  const navElements = context.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    const hasLabel = nav.getAttribute('aria-label') ||
                     nav.getAttribute('aria-labelledby') ||
                     nav.getAttribute('title');
    const isMultipleNav = navElements.length > 1 && !hasLabel;
    if (isMultipleNav) {
      issues.push({
        type: 'warning',
        code: 'NAV_WITHOUT_LABEL',
        message: `Navigation at index ${index} should have an aria-label when multiple nav elements exist`
      });
    }
  });

  // Check for proper header/footer usage
  const headers = context.querySelectorAll('header');
  headers.forEach((header, index) => {
    if (header.closest('main') && !header.closest('article') && !header.getAttribute('aria-label')) {
      issues.push({
        type: 'info',
        code: 'HEADER_NESTING',
        message: `Header at index ${index} is inside main content - consider if this is the intended use`
      });
    }
  });

  return {
    totalIssues: issues.length,
    issues: issues,
    addressedIssues: [], // Not applicable for landmark validation
    isValid: issues.filter(i => i.type === 'error').length === 0,
    summary: `Landmark validation completed with ${issues.length} issues`
  };
}

// New function to check landmark elements in the DOM
function checkLandmarkInDOM() {
  let allLandmarks = document.querySelectorAll(LANDMARK_ELEMENTS.join(', '));
  let missingLandmarks = [];

  allLandmarks.forEach(landmark => {
    if (!landmark.id) {
      missingLandmarks.push(landmark.tagName.toLowerCase());
    }
  });

  // Check if all required landmarks are present in the DOM
  const shouldContain = ['main', 'nav', 'header', 'footer', 'aside'];
  const present = [];
  missingLandmarks = missingLandmarks.filter(landmark => shouldContain.includes(landmark));

  if (missingLandmarks.length > 0) {
    return { missingLandmarks };
  }

  return { allLandmarks };
}

// New function to add SVG accessibility props
function addSvgAccessibilityProps() {
  const svgs = document.querySelectorAll('svg');
  let svgWithoutAccessibilityProps = [];

  Array.from(svgs).forEach((svg) => {
    const accessibleName = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.getAttribute('title');
    if (!accessibleName) {
      svgWithoutAccessibilityProps.push(svg);
    }
  });

  if (svgWithoutAccessibilityProps.length > 0) {
    return { svgs: svgWithoutAccessibilityProps };
  }

  return { svgs };
}

// Preserve existing code functionality
function preserveExistingCode() {
  // ... Existing code ...
}

// New function to address new accessibility issues from insight report
function newFunction() {
  // Placeholder for new accessibility issue fixes
  // Implement specific fixes based on insight report when available
}

module.exports = {
  checkLandmarkElements,
  checkLandmarkInDOM,
  addSvgAccessibilityProps,
  preserveExistingCode,
  newFunction
};