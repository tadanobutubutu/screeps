// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs

/**
 * Gets the accessible name for SVG elements
 * @param {NodeList|Array} svgElements - SVG elements to get accessible name from
 * @returns {string|null} The accessible name or null if not found
 */
function getSvgAccessibleName(svgElements) {
  const elements = Array.from(svgElements);
  
  for (const element of elements) {
    // Check for aria-label
    if (element.hasAttribute('aria-label')) {
      return element.getAttribute('aria-label');
    }
    
    // Check for aria-labelledby
    if (element.hasAttribute('aria-labelledby')) {
      const labelledById = element.getAttribute('aria-labelledby');
      const labelElement = document.getElementById(labelledById);
      if (labelElement) {
        return labelElement.textContent.trim();
      }
    }
    
    // Check for <title> child element
    const titleElement = element.querySelector('title');
    if (titleElement && titleElement.textContent.trim()) {
      return titleElement.textContent.trim();
    }
    
    // Check for <desc> child element
    const descElement = element.querySelector('desc');
    if (descElement && descElement.textContent.trim()) {
      return descElement.textContent.trim();
    }
  }
  
  return null;
}

/**
 * Sets accessibility attributes on SVG elements
 * @param {NodeList|Array} svgElements - SVG elements to set attributes on
 */
function setSvgAttributes(svgElements) {
  const elements = Array.from(svgElements);
  
  elements.forEach((element, index) => {
    // Ensure element has an ID
    if (!element.id) {
      element.id = `svg-element-${index}-${Date.now()}`;
    }
    
    // Set role="img" if not already set
    if (!element.hasAttribute('role')) {
      element.setAttribute('role', 'img');
    }
    
    // Ensure focusable is set appropriately
    if (!element.hasAttribute('focusable')) {
      element.setAttribute('focusable', 'false');
    }
  });
}

/**
 * Main application entry point with accessibility features
 */
function renderDependencyGraphs(svgElements) {
  const accessibleName = getSvgAccessibleName(svgElements);
  if (accessibleName) {
    // Use accessibleName
  }

  setSvgAttributes(svgElements);
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

      if (!landmarkRoles.includes(landmarkRole)) {
        console.warn(`Invalid landmark role: ${landmarkRole} for ${tagName}`);
      }
    });
  };

  checkLandmarkElement('[role="main"], main', 'main', {
    'main': 'main',
    'header': 'banner',
    'nav': 'navigation',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'form': 'form',
    'section': 'region'
  });

  checkLandmarkElement('[role="banner"], header', 'banner');
  checkLandmarkElement('[role="navigation"], nav', 'navigation');
  checkLandmarkElement('[role="contentinfo"], footer', 'contentinfo');
  checkLandmarkElement('[role="complementary"], aside', 'complementary');
  checkLandmarkElement('[role="search"], [role="form"], form', 'form');
}

// Export the new function and sampleInsightReport (both versions agreed to do this)
export { checkLandmarkElements, sampleInsightReport };

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
  const packageJsonPath = require('path').join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  return {
    dependencies: Object.keys(dependencies).length,
    devDependencies: Object.keys(devDependencies).length,
    total: Object.keys(dependencies).length + Object.keys(devDependencies).length
  };
}

// Rest of the code remains the same