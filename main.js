// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs

/**
 * Main application entry point with accessibility features
 */
function mainApplication() {
  const accessibleName = 'Accessibility-focused Application';
  if (accessibleName) {
    // Use accessibleName
    console.log('Application started:', accessibleName);
  }

  const svgElements = document.querySelectorAll('svg');
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

  const implicitRole = {
    'main': 'main',
    'header': 'banner',
    'nav': 'navigation',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'form': 'form',
    'section': 'region'
  };

  const checkLandmarkElement = (selector, role, implicitRoleMap) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      const tagName = element.tagName ? element.tagName.toLowerCase() : '';
      const landmarkRole = role || implicitRoleMap[tagName];

      if (!landmarkRole) {
        console.warn(`Missing landmark role for ${tagName}`);
        return;
      }

      if (!landmarkRoles.includes(landmarkRole)) {
        console.warn(`Invalid landmark role: ${landmarkRole} for ${tagName}`);
      }
    });
  };

  checkLandmarkElement('main', 'main', implicitRole);
  checkLandmarkElement('header', 'banner');
  checkLandmarkElement('nav', 'navigation');
  checkLandmarkElement('footer', 'contentinfo');
  checkLandmarkElement('aside', 'complementary');
  checkLandmarkElement('[role="form"]', 'form', 'form');
}

/**
 * Renders a dependency graph visualization
 * @param {Object} dependencyData - Object containing dependencies and devDependencies
 * @returns {string} HTML string representing the dependency graph
 */
function renderDependencyGraph(dependencyData) {
  const { dependencies, devDependencies } = dependencyData;
  
  let graphHTML = `
    <div class="dependency-graph" role="img" aria-label="Dependency graph visualization">
      <h2>Dependency Graph</h2>
      <div class="graph-section">
        <h3>Dependencies</h3>
        <ul class="dependency-list" role="list">
  `;

  Object.keys(dependencies).forEach((dep) => {
    const version = dependencies[dep];
    graphHTML += `
      <li class="dependency-item" role="listitem">
        <span class="dependency-name">${dep}</span>
        <span class="dependency-version">${version}</span>
      </li>
    `;
  });

  graphHTML += `
        </ul>
      </div>
      <div class="graph-section">
        <h3>Dev Dependencies</h3>
        <ul class="dependency-list" role="list">
  `;

  Object.keys(devDependencies).forEach((dep) => {
    const version = devDependencies[dep];
    graphHTML += `
      <li class="dependency-item" role="listitem">
        <span class="dependency-name">${dep}</span>
        <span class="dependency-version">${version}</span>
      </li>
    `;
  });

  graphHTML += `
        </ul>
      </div>
    </div>
  `;

  return graphHTML;
}

/**
 * Renders an index view with all available views and navigation
 * @param {Array} views - Array of view objects with title and route
 * @returns {string} HTML string representing the index view
 */
function renderIndexView(views) {
  let indexHTML = `
    <nav class="index-nav" role="navigation" aria-label="Main navigation">
      <h1>Application Index</h1>
      <ul class="view-list" role="list">
  `;

  views.forEach((view) => {
    indexHTML += `
      <li class="view-item" role="listitem">
        <a href="${view.route}" class="view-link" aria-label="${view.title}">
          ${view.title}
        </a>
      </li>
    `;
  });

  indexHTML += `
      </ul>
    </nav>
  `;

  return indexHTML;
}

/**
 * Sets accessibility attributes on SVG elements
 * @param {NodeList} svgElements - Collection of SVG elements
 */
function setSvgAttributes(svgElements) {
  svgElements.forEach((svg, index) => {
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', `SVG graphic ${index + 1}`);
    }
  });
}

// Export the new functions and existing exports
export { 
  checkLandmarkElements, 
  sampleInsightReport, 
  renderDependencyGraph,
  renderIndexView,
  setSvgAttributes 
};

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
  const packageJsonPath = './package.json';
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  return {
    dependencies: Object.keys(dependencies),
    devDependencies: Object.keys(devDependencies),
    total: Object.keys(dependencies).length + Object.keys(devDependencies).length
  };
}

// Export countDependencies for use with dependency graph rendering
export { countDependencies };

// Rest of the code remains the same