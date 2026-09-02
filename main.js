// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs

/**
 * Renders a dependency graph as an accessible SVG visualization
 * @param {Object} dependencies - Object containing dependency information
 * @returns {string} SVG string representing the dependency graph
 */
function renderDependencyGraph(dependencies) {
  const { dependencies: deps = {}, devDependencies: devDeps = {} } = dependencies;
  
  const allPackages = [...Object.keys(deps), ...Object.keys(devDeps)];
  const nodeCount = allPackages.length;
  const centerX = 400;
  const centerY = 300;
  const radius = Math.min(250, 50 + nodeCount * 15);
  
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="Dependency graph visualization showing ${nodeCount} packages">`;
  svg += `<title>Dependency Graph</title>`;
  svg += `<desc>A visual representation of project dependencies (${Object.keys(deps).length} dependencies) and dev dependencies (${Object.keys(devDeps).length} dev dependencies)</desc>`;
  
  // Draw center node
  svg += `<circle cx="${centerX}" cy="${centerY}" r="30" fill="#4a90d9" aria-label="Current project"></circle>`;
  svg += `<text x="${centerX}" y="${centerY + 5}" text-anchor="middle" fill="white" font-size="12">app</text>`;
  
  // Draw dependency nodes
  const depKeys = Object.keys(deps);
  depKeys.forEach((dep, i) => {
    const angle = (2 * Math.PI * i) / depKeys.length - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    svg += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" stroke="#888" stroke-width="2" aria-hidden="true"></line>`;
    svg += `<circle cx="${x}" cy="${y}" r="20" fill="#27ae60" aria-label="Dependency: ${dep}"></circle>`;
    svg += `<text x="${x}" y="${y + 4}" text-anchor="middle" fill="white" font-size="10">${dep.substring(0, 8)}</text>`;
  });
  
  // Draw dev dependency nodes (inner ring)
  const devDepKeys = Object.keys(devDeps);
  const innerRadius = radius * 0.6;
  devDepKeys.forEach((dep, i) => {
    const angle = (2 * Math.PI * i) / devDepKeys.length + Math.PI / 4;
    const x = centerX + innerRadius * Math.cos(angle);
    const y = centerY + innerRadius * Math.sin(angle);
    
    svg += `<circle cx="${x}" cy="${y}" r="15" fill="#e67e22" aria-label="Dev dependency: ${dep}"></circle>`;
    svg += `<text x="${x}" y="${y + 4}" text-anchor="middle" fill="white" font-size="8">${dep.substring(0, 6)}</text>`;
  });
  
  svg += `</svg>`;
  return svg;
}

/**
 * Renders a dependency graph as HTML with accessibility features
 * @param {Object} dependencies - Object containing dependency information
 * @returns {string} HTML string representing the dependency graph
 */
function renderDependencyGraphHTML(dependencies) {
  const { dependencies: deps = {}, devDependencies: devDeps = {} } = dependencies;
  
  let html = `<div class="dependency-graph" role="img" aria-label="Dependency graph showing ${Object.keys(deps).length} dependencies and ${Object.keys(devDeps).length} dev dependencies">`;
  html += `<h2 class="sr-only">Dependency Graph</h2>`;
  html += `<div class="dependency-list">`;
  
  html += `<section aria-labelledby="deps-heading">`;
  html += `<h3 id="deps-heading">Dependencies (${Object.keys(deps).length})</h3>`;
  html += `<ul role="list">`;
  
  Object.entries(deps).forEach(([name, version]) => {
    html += `<li aria-label="${name} version ${version}"><code>${name}</code>: ${version}</li>`;
  });
  
  html += `</ul></section>`;
  
  html += `<section aria-labelledby="dev-deps-heading">`;
  html += `<h3 id="dev-deps-heading">Dev Dependencies (${Object.keys(devDeps).length})</h3>`;
  html += `<ul role="list">`;
  
  Object.entries(devDeps).forEach(([name, version]) => {
    html += `<li aria-label="${name} version ${version}"><code>${name}</code>: ${version}</li>`;
  });
  
  html += `</ul></section></div></div>`;
  return html;
}

/**
 * Main application entry point with accessibility features
 */
function initializeApp() {
  const accessibleName = 'Dependency Visualizer';
  if (accessibleName) {
    document.title = accessibleName;
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

  const checkLandmarkElement = (selector, role, implicitRole) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      const tagName = element.tagName ? element.tagName.toLowerCase() : '';
      const landmarkRole = role || implicitRole[tagName];

      if (!landmarkRole) {
        console.warn(`Missing landmark role for ${tagName}`);
        return;
      }

      if (element.getAttribute('role') !== landmarkRole) {
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

  checkLandmarkElement('header', 'banner');
  checkLandmarkElement('nav', 'navigation');
  checkLandmarkElement('footer', 'contentinfo');
  checkLandmarkElement('aside', 'complementary');
  checkLandmarkElement('[role="form"]', 'form', 'form');
}

// Export the new function and sampleInsightReport (both versions agreed to do this)
export { checkLandmarkElements, sampleInsightReport, renderDependencyGraph, renderDependencyGraphHTML };

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
  const packageJsonPath = process.cwd() + '/package.json';
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  return {
    dependencies: dependencies,
    devDependencies: devDependencies,
    total: Object.keys(dependencies).length + Object.keys(devDependencies).length
  };
}

/**
 * Helper function to set SVG accessibility attributes
 * @param {NodeList} svgElements - Collection of SVG elements
 */
function setSvgAttributes(svgElements) {
  svgElements.forEach((svg) => {
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      svg.setAttribute('aria-label', 'Visual diagram');
    }
  });
}

// Rest of the code remains the same