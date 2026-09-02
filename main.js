// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs

/**
 * Main application entry point with accessibility features
 */
function initializeAccessibility() {
  const accessibleName = getAccessibleName(document.body);
  if (accessibleName) {
    // Use accessibleName for screen readers
    console.log('Accessible name found:', accessibleName);
  }

  const svgElements = document.querySelectorAll('svg');
  setSvgAttributes(svgElements);
  
  checkLandmarkElements();
}

/**
 * Gets the accessible name for an element
 * @param {Element} element - The element to get accessible name for
 * @returns {string|null} The accessible name or null
 */
function getAccessibleName(element) {
  if (!element) return null;
  
  // Check for aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check for aria-labelledby
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelledElement = document.getElementById(ariaLabelledBy);
    if (labelledElement) return labelledElement.textContent;
  }
  
  // Check for title attribute
  const title = element.getAttribute('title');
  if (title) return title;
  
  return null;
}

/**
 * Sets accessibility attributes on SVG elements
 * @param {NodeList} svgElements - Collection of SVG elements
 */
function setSvgAttributes(svgElements) {
  svgElements.forEach((svg, index) => {
    if (!svg.id) {
      svg.id = `svg-accessible-${index}`;
    }
    svg.setAttribute('role', 'img');
    
    const title = svg.querySelector('title');
    if (title && !svg.getAttribute('aria-labelledby')) {
      const titleId = `svg-title-${index}`;
      title.id = titleId;
      svg.setAttribute('aria-labelledby', titleId);
    }
  });
}

function checkLandmarkElements() {
  const landmarkRoles = [
    'banner',
    'main',
    'navigation',
    'search',
    'contentinfo',
    'complementary',
    'region',
    'form'
  ];

  const checkLandmarkElement = (selector, role, implicitRole) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      const tagName = element.tagName ? element.tagName.toLowerCase() : '';
      const landmarkRole = role || implicitRole[tagName];

      if (!landmarkRole) {
        console.warn(`Missing landmark role for ${tagName}`);
        return;
      }

      const explicitRole = element.getAttribute('role');
      if (explicitRole && explicitRole !== landmarkRole) {
        console.warn(`Invalid landmark role: ${landmarkRole} for ${tagName}`);
      }
    });
  };

  checkLandmarkElement('main', 'main', {
    'main': 'main',
    'header': 'banner',
    'nav': 'navigation',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'form': 'form',
    'section': 'region'
  });

  checkLandmarkElement('header[role="banner"]', 'banner');
  checkLandmarkElement('nav[role="navigation"]', 'navigation');
  checkLandmarkElement('footer[role="contentinfo"]', 'contentinfo');
  checkLandmarkElement('aside[role="complementary"]', 'complementary');
  checkLandmarkElement('[role="form"]', 'form', 'form');
}

// Export the new function and sampleInsightReport (both versions agreed to do this)
export { checkLandmarkElements, sampleInsightReport, initializeAccessibility, getAccessibleName, setSvgAttributes };

const sampleInsightReport = {
  title: 'Quarterly Performance Report',
  sections: [
    {
      heading: 'Sales Overview',
      content: 'Total sales increased by 15% compared to last quarter.'
    },
    {
      heading: 'Customer Satisfaction',
      content: 'Average satisfaction score: 4.2 out of 5.'
    }
  ]
};

function countDependencies() {
  const fs = require('fs');
  const packageJsonPath = __dirname + '/package.json';
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  return {
    dependencies: Object.keys(dependencies),
    devDependencies: Object.keys(devDependencies),
    total: Object.keys(dependencies).length + Object.keys(devDependencies).length
  };
}

// Rest of the code remains the same