/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

// TODO: Implement the new function as per the issue requirements
function countDependencies() {
    const fs = require('fs');
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

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888

/**
 * Main application entry point with accessibility features
 */

function getSvgAccessibleName(svg) {
  // Try to get accessible name from various attributes
  return svg.getAttribute('aria-label') || 
         svg.getAttribute('title') || 
         svg.getAttribute('alt') || 
         svg.getAttribute('data-name') || null;
}

function setSvgAttributes(svg) {
  // Set default SVG attributes for accessibility
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  if (!svg.hasAttribute('focusable')) {
    svg.setAttribute('focusable', 'true');
  }
}

function addAccessibleNamesToSVGs() {
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

const checkTableStructure = function() {
  // Check and fix table structure issues
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has proper headers
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

/**
 * Handle credential response from browser authentication
 * @param {Object} response - The credential response object
 * @returns {Object} Processed credential information
 */
function handleCredentialResponse(response) {
    if (!response) {
        return { success: false, error: 'No credential response provided' };
    }

    // Check if response contains expected credential data
    const hasCredential = response.credential || response.token || response.id;
    
    if (!hasCredential) {
        return { success: false, error: 'Invalid credential response format' };
    }

    // Process credential information
    const processedCredential = {
        id: response.id || null,
        token: response.token || response.credential || null,
        name: response.name || 'Anonymous User',
        email: response.email || null,
        success: true
    };

    // Handle different types of credential responses
    if (response.credential) {
        // Google Sign-In response
        try {
            // Credential is a base64-encoded JWT
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            processedCredential.id = payload.sub || processedCredential.id;
            processedCredential.email = payload.email || processedCredential.email;
            processedCredential.name = payload.name || processedCredential.name;
        } catch (error) {
            console.warn('Failed to parse credential response:', error);
        }
    }

    // Announce success to screen readers
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
    setupAriaLiveRegions,
    setupFocusManagement,
    enhanceSemanticMarkup,
    trapFocus,
    handleKeyNavigation,
    closeOpenDialogs,
    announceToScreenReader,
    calculateDifference,
    calculateProduct,
    isNumber,
    clamp,
    hello,
    getVersion,
    getConfig,
    addressAccessibilityIssues,
    generateAccessibilityReport,
    calculateAccessibilityScore,
    validateLandmark,
    spawnSomeCommand,
    addLangAttribute,
    fixTableStructure,
    fixLandmarkIssues,
    addMainLandmark,
    addLandmarkRegions,
    ensureUniqueLandmarks,
    uniqueLandmarks,
    addAccessibleNamesToSVGs,
    fixFakeLinkIssues,
    googleSignIn,
    fixButtonIdentifiers,
    ensureDependencyGraphAriaRole,
    getSvgAccessibleName,
    setSvgAttributes,
    sampleInsightReport,
    createInPageButton,
    handleFakeLinks
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
  addAccessibleNamesToSVGs();
  fixFakeLinkIssues();
  fixButtonIdentifiers();
  ensureDependencyGraphAriaRole();
  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();
}

function addLangAttribute() {
  // Add lang attribute to HTML element if missing
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
}

function fixTableStructure() {
  // Fix table structure issues
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure proper role
    if (!table.hasAttribute('role')) {
      table.setAttribute('role', 'table');
    }
    
    // Ensure caption if missing
    if (!table.querySelector('caption') && table.hasAttribute('aria-label')) {
      const caption = document.createElement('caption');
      caption.textContent = table.getAttribute('aria-label');
      table.insertBefore(caption, table.firstChild);
    }
    
    // Check for proper header structure
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
  // Ensure main content has proper landmark
  const main = document.querySelector('main');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }
  
  // If no main element exists, create one or use div with role
  if (!main) {
    const mainContent = document.querySelector('#main-content, .main-content, [contentmain]');
    if (mainContent && !mainContent.hasAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }
  }
}

function addLandmarkRegions() {
  // Add landmark roles to common regions
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
  // Ensure landmarks have unique accessible names if duplicates exist
  const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"]');
  const landmarkCounts = {};
  
  landmarks.forEach(landmark => {
    const type = landmark.getAttribute('role');
    const name = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby') || landmark.textContent.trim() || `${type} ${landmarkCounts[type] ? landmarkCounts[type] + 1 : 1}`;
    
    if (landmarkCounts[type]) {
      landmarkCounts[type]++;
    } else {
      landmarkCounts[type] = 1;
    }
    
    if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
      landmark.setAttribute('aria-label', name);
    }
  });
}

function uniqueLandmarks() {
  // Ensure each landmark type has a unique identifier if needed
  const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"]');
  const seen = new Set();
  
  landmarks.forEach(landmark => {
    const type = landmark.getAttribute('role');
    const id = landmark.id || `landmark-${type}-${Math.floor(Math.random() * 10000)}`;
    
    if (seen.has(id)) {
      const newId = `${id}-${Date.now()}`;
      landmark.setAttribute('id', newId);
      seen.add(newId);
    } else {
      landmark.setAttribute('id', id);
      seen.add(id);
    }
  });
}

function fixFakeLinkIssues() {
  // Fix issues with fake links (elements that look like links but aren't)
  const fakeLinks = document.querySelectorAll('div[role="link"], span[role="link"]');
  fakeLinks.forEach(link => {
    // Ensure proper focusability
    if (!link.hasAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }
    
    // Add keyboard support
    link.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        link.click();
      }
    });
  });
}

function googleSignIn() {
  // Handle Google Sign-In
  console.log('Google Sign-In initiated');
  // Implementation would depend on Google Identity Services library
}

function fixButtonIdentifiers() {
  // Ensure buttons have proper identifiers
  const buttons = document.querySelectorAll('button, [role="button"]');
  buttons.forEach((button, index) => {
    if (!button.id) {
      button.id = `button-${index}`;
    }
    
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', `Button ${index + 1}`);
    }
  });
}

function ensureDependencyGraphAriaRole() {
  // Ensure dependency graph has proper ARIA role
  const graph = document.getElementById('dependencyGraph');
  if (graph && !graph.hasAttribute('role')) {
    graph.setAttribute('role', 'region');
    graph.setAttribute('aria-label', 'Dependency Graph');
  }
}

function setupAriaLiveRegions() {
  // Setup ARIA live regions for dynamic content
  let liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.padding = '0';
    liveRegion.style.margin = '-1px';
    liveRegion.style.overflow = 'hidden';
    liveRegion.style.clip = 'rect(0, 0, 0, 0)';
    liveRegion.style.whiteSpace = 'nowrap';
    liveRegion.style.border = '0';
    document.body.appendChild(liveRegion);
  }
}

function setupFocusManagement() {
  // Setup focus management for accessibility
  const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  
  // Trap focus in modals if they exist
  const modals = document.querySelectorAll('[role="dialog"], [role="alertdialog"]');
  modals.forEach(modal => {
    trapFocus(modal);
  });
}

function trapFocus(container) {
  // Trap focus within a container
  const focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length === 0) return;
  
  const firstFocusable = focusable[0];
  const lastFocusable = focusable[focusable.length - 1];
  
  container.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });
}

function handleKeyNavigation(e) {
  // Handle keyboard navigation
  if (e.key === 'Tab') {
    // Ensure focus is visible
    document.body.classList.add('keyboard-navigation');
  }
}

function closeOpenDialogs() {
  // Close any open dialogs
  const openDialogs = document.querySelectorAll('[role="dialog"][aria-modal="true"]');
  openDialogs.forEach(dialog => {
    dialog.setAttribute('aria-hidden', 'true');
  });
}

function announceToScreenReader(message) {
  // Announce message to screen readers
  const liveRegion = document.getElementById('aria-live-region');
  if (liveRegion) {
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }
}

function enhanceSemanticMarkup() {
  // Enhance semantic markup for better accessibility
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    if (!heading.hasAttribute('role')) {
      heading.setAttribute('role', 'heading');
    }
  });
}

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
  return 'Hello, World!';
}

function getVersion() {
  return '1.0.0';
}

function getConfig() {
  return config;
}

function addressAccessibilityIssues() {
  // Address accessibility issues from insight report
  addLangAttribute();
  fixTableStructure();
  fixLandmarkIssues();
  ensureUniqueLandmarks();
  addAccessibleNamesToSVGs();
  fixFakeLinkIssues();
  fixButtonIdentifiers();
  ensureDependencyGraphAriaRole();
  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();
}

function generateAccessibilityReport() {
  // Generate accessibility report
  const report = {
    timestamp: new Date().toISOString(),
    issues: [],
    score: 100
  };
  
  // Check for common issues
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  if (imagesWithoutAlt.length > 0) {
    report.issues.push({
      type: 'missing-alt',
      count: imagesWithoutAlt.length,
      description: 'Images missing alt attributes'
    });
    report.score -= imagesWithoutAlt.length * 5;
  }
  
  const buttonsWithoutLabels = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby]):not([textContent])');
  if (buttonsWithoutLabels.length > 0) {
    report.issues.push({
      type: 'missing-button-label',
      count: buttonsWithoutLabels.length,
      description: 'Buttons missing accessible labels'
    });
    report.score -= buttonsWithoutLabels.length * 10;
  }
  
  return report;
}

function calculateAccessibilityScore() {
  // Calculate accessibility score
  const report = generateAccessibilityReport();
  return Math.max(0, report.score);
}

function validateLandmark() {
  // Validate landmark structure
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="region"]');
  const issues = [];
  
  if (landmarks.length === 0) {
    issues.push('No landmarks found');
  }
  
  const mainLandmarks = document.querySelectorAll('[role="main"]');
  if (mainLandmarks.length === 0) {
    issues.push('No main landmark found');
  } else if (mainLandmarks.length > 1) {
    issues.push('Multiple main landmarks found');
  }
  
  return issues;
}

function spawnSomeCommand(command) {
  // Spawn a command
  console.log(`Spawning command: ${command}`);
  return { success: true, command };
}

function createInPageButton(config) {
  // Create an in-page button
  const button = document.createElement('button');
  button.textContent = config.text || 'Click me';
  button.addEventListener('click', config.onClick || (() => {}));
  return button;
}

function handleFakeLinks() {
  // Handle fake links
  const fakeLinks = document.querySelectorAll('div[role="link"], span[role="link"]');
  fakeLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (!link.hasAttribute('href')) {
        e.preventDefault();
      }
    });
  });
}