const http = require('http');
const path = require('path');
const fs = require('fs');

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

/**
 * Main application entry point with accessibility features
 */

// Helper function for logging
function log(message, level = 'info') {
  const levels = ['log', 'warn', 'error', 'info'];
  const logLevel = levels.includes(level) ? level : 'log';
  if (console[logLevel]) {
    console[logLevel](message);
  }
}

// Functions to ensure the element has an id, add aria-label, render dependency graphs
function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') || 
         svg.getAttribute('title') || 
         svg.getAttribute('alt') || 
         svg.getAttribute('data-name') || null;
}

function setSvgAttributes(svg) {
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  if (!svg.hasAttribute('focusable')) {
    svg.setAttribute('focusable', 'true');
  }
}

function addSvgAccessibleNames() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    if (svg.getAttribute('role') !== 'presentation') {
      svg.setAttribute('role', 'img');
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }

    setSvgAttributes(svg);
  });
}

// Check and fix table structure issues
const checkTableStructure = function() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const headerRow = document.createElement('tr');
        firstRow.querySelectorAll('td, th').forEach(cell => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          th.setAttribute('scope', 'col');
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.insertBefore(thead, table.firstChild);
      }
    } else {
      // Ensure proper table role
      table.setAttribute('role', 'table');
    }

    // Ensure proper table role
    table.setAttribute('role', 'table');
  });
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

// Implement function for addressing accessibility issues from insight report
function countDependencies() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    const allDeps = Object.keys(dependencies).concat(Object.keys(devDependencies));

    renderDependencyGraph(allDeps);
    renderIndex(allDeps);

    return {
        dependencies: Object.keys(dependencies),
        devDependencies: Object.keys(devDependencies),
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

function renderDependencyGraph(dependencies) {
  if (!Array.isArray(dependencies)) return null;

  const graphContainer = document.createElement('div');
  graphContainer.id = 'dependencyGraph';
  graphContainer.setAttribute('role', 'region');
  graphContainer.setAttribute('aria-label', 'Dependency Graph');
  graphContainer.className = 'dependency-graph';

  dependencies.forEach(dep => {
    const depItem = document.createElement('div');
    depItem.className = 'dependency-item';
    depItem.textContent = dep;
    graphContainer.appendChild(depItem);
  });

  const existing = document.getElementById('dependencyGraph');
  if (existing) {
    existing.parentNode.replaceChild(graphContainer, existing);
  } else {
    document.body.appendChild(graphContainer);
  }

  return graphContainer;
}

function renderIndex(dependencies) {
  if (!Array.isArray(dependencies)) return null;

  const indexContainer = document.createElement('div');
  indexContainer.id = 'dependencyIndex';
  indexContainer.setAttribute('role', 'region');
  indexContainer.setAttribute('aria-label', 'Dependency Index');
  indexContainer.className = 'dependency-index';

  dependencies.forEach((dep, index) => {
    const indexItem = document.createElement('div');
    indexItem.className = 'index-item';
    indexItem.textContent = `${index + 1}. ${dep}`;
    indexContainer.appendChild(indexItem);
  });

  const existing = document.getElementById('dependencyIndex');
  if (existing) {
    existing.parentNode.replaceChild(indexContainer, existing);
  } else {
    document.body.appendChild(indexContainer);
  }

  return indexContainer;
}

// Handle credential response from browser authentication
function handleCredentialResponse(response) {
    if (!response) {
        return { success: false, error: 'No credential response provided' };
    }

    const hasCredential = response.credential || response.token || response.id;
    
    if (!hasCredential) {
        return { success: false, error: 'Invalid credential response format' };
    }

    const processedCredential = {
        id: response.id || null,
        token: response.token || response.credential || null,
        name: response.name || 'Anonymous User',
        email: response.email || null,
        success: true
    };

    if (response.credential) {
        try {
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            processedCredential.id = payload.sub || processedCredential.id;
            processedCredential.email = payload.email || processedCredential.email;
            processedCredential.name = payload.name || processedCredential.name;
        } catch (error) {
            console.warn('Failed to parse credential response:', error);
        }
    }

    if (typeof announceToScreenReader === 'function') {
        announceToScreenReader('User successfully authenticated');
    }

    return processedCredential;
}

// Ensure DOM is fully loaded before executing scripts
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment - setup basic exports
  module.exports = {
    checkTableStructure,
    countDependencies,
    renderDependencyGraph,
    renderIndex,
    init,
    addLangAttribute,
    fixTableStructure,
    fixLandmarkIssues,
    addMainLandmark,
    addLandmarkRegions,
    ensureUniqueLandmarks,
    uniqueLandmarks,
    addSvgAccessibleNames,
    handleCredentialResponse,
    getSvgAccessibleName,
    setSvgAttributes,
    log,
    config
  };
} else {
  // Browser environment - wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

function init() {
  addLangAttribute();
  fixTableStructure();
  fixLandmarkIssues();
  ensureUniqueLandmarks();
  addSvgAccessibleNames();
}

// Add lang attribute to HTML element if missing
function addLangAttribute() {
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
}

function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.hasAttribute('role')) {
      table.setAttribute('role', 'table');
    }
    
    if (!table.querySelector('caption') && table.hasAttribute('aria-label')) {
      const caption = document.createElement('caption');
      caption.textContent = table.getAttribute('aria-label');
      table.insertBefore(caption, table.firstChild);
    }
    
    const rows = table.querySelectorAll('tr');
    if (rows.length > 0) {
      const firstRowCells = rows[0].querySelectorAll('td, th');
      let hasHeader = false;
      firstRowCells.forEach(cell => {
        if (cell.tagName === 'TH') hasHeader = true;
      });
      
      if (!hasHeader) {
        firstRowCells.forEach(cell => {
          const th = document.createElement('th');
          th.setAttribute('scope', 'col');
          th.textContent = cell.textContent;
          th.setAttribute('role', 'columnheader');
          cell.parentNode.replaceChild(th, cell);
        });
      }
    }
  });
}

function fixLandmarkIssues() {
  addMainLandmark();
  addLandmarkRegions();
}

function addMainLandmark() {
  const main = document.querySelector('main');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }
  
  if (!main) {
    const mainContent = document.querySelector('#main-content, .main-content, [contentmain]');
    if (mainContent && !mainContent.hasAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }
  }
}

function addLandmarkRegions() {
  const regions = {
    'header': 'banner',
    'footer': 'contentinfo',
    'nav': 'navigation',
    'aside': 'complementary',
    'section[aria-label]': 'region',
    'section[aria-labelledby]': 'region'
  };
  
  Object.entries(regions).forEach(([selector, role]) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (!el.hasAttribute('role') && !el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
        el.setAttribute('role', role);
      }
    });
  });
}

function ensureUniqueLandmarks() {
  uniqueLandmarks();
}

function uniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"]');
  const landmarkCounts = {};
  
  landmarks.forEach(landmark => {
    const type = landmark.getAttribute('role');
    const name = landmark.getAttribute('aria-label') || landmark.textContent.trim() || `${type} ${Object.keys(landmarkCounts).length + 1}`;
    
    if (landmarkCounts[type]) {
      landmarkCounts[type]++;
      landmark.setAttribute('aria-label', `${name} (${landmarkCounts[type]})`);
    } else {
      landmarkCounts[type] = 1;
    }
  });
}

// Export additional utility functions that might be needed
function calculateDifference(a, b) {
  return Math.abs(a - b);
}

function calculateProduct(a, b) {
  return a * b;
}

function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function hello() {
  return 'Hello from main.js!';
}

function getVersion() {
  return '1.0.0';
}

function getConfig() {
  return config;
}