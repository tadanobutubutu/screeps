// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs

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

// Functions to address accessibility issues
function getLangAttribute() {
  return document.documentElement.lang || '';
}

function getFullLangAttribute() {
  const lang = document.documentElement.getAttribute('lang');
  return lang || 'en';
}

function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure tables have proper headers and structure
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      table.setAttribute('role', 'presentation');
    }
  });
}

function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length === 0) {
        row.setAttribute('role', 'presentation');
      }
    });
  });
}

function validateLandmark() {
  const elements = document.querySelectorAll('[role]');
  elements.forEach(el => {
    const role = el.getAttribute('role');
    if (!['banner', 'main', 'navigation', 'search', 'contentinfo', 'complementary', 'region', 'form'].includes(role)) {
      el.removeAttribute('role');
    }
  });
}

function validateLandmarkStructure() {
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    mainElements[1].removeAttribute('role');
  }
}

function ensureUniqueLandmarks() {
  const landmarkMap = {};
  ['banner', 'main', 'navigation', 'search', 'contentinfo', 'complementary', 'region', 'form'].forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      Array.from(elements).slice(1).forEach(el => el.removeAttribute('role'));
    }
  });
}

function getSvgAccessibleName(svgElements) {
  let name = '';
  svgElements.forEach(svg => {
    const title = svg.querySelector('title');
    if (title) {
      name = title.textContent || '';
    }
  });
  return name || 'SVG Icon';
}

function setSvgAttributes(svgElements) {
  svgElements.forEach(svg => {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', getSvgAccessibleName(svg));
  });
}

function createInPageButton() {
  const button = document.createElement('button');
  button.setAttribute('aria-label', 'Return to top');
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  return button;
}

function createAccessibleLink(href) {
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('aria-label', 'Navigation link');
  return link;
}

function handleAccessibilityIssues() {
  validateTableAccessibility();
  validateTableStructure();
  validateLandmark();
  validateLandmarkStructure();
  ensureUniqueLandmarks();
}