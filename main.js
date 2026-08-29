// main.js

// Utility function used elsewhere (kept for compatibility)
const { someFunction } = { someFunction: () => 'someFunction result' };

/**
 * Accessibility improvements based on insight report.
 * Each function addresses a specific REACT_* issue.
 */

// REACT_015: Add lang attribute to HTML element
function addLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('lang', 'en');
  }
}

// REACT_027: Fix table structure issues
function fixTableStructure() {
  // Implement fixes: add proper thead, th, scope attributes, etc.
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      // Example: convert first row cells to th if missing
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const cells = firstRow.querySelectorAll('td');
        cells.forEach((cell) => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          th.scope = 'col';
          cell.replaceWith(th);
        });
      }
    }
  });
}

// REACT_017: Add/fix landmark issues
function addMainLandmark() {
  if (typeof document !== 'undefined') {
    let main = document.querySelector('main');
    if (!main) {
      main = document.createElement('main');
      document.body.appendChild(main);
    }
    main.setAttribute('role', 'main');
  }
}

function fixLandmarkIssues() {
  // Fix orphaned or misused landmarks
  const landmarks = ['main', 'navigation', 'search', 'contentinfo'];
  landmarks.forEach((role) => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    // Ensure each landmark is unique; if duplicates, remove extra ones or add labels
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.removeAttribute('role');
        }
      });
    }
  });
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  // Combined implementation: remove duplicate landmark roles from the DOM
  const landmarkRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  const seen = new Set();
  landmarkRoles.forEach((role) => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    elements.forEach((el) => {
      if (seen.has(role)) {
        el.removeAttribute('role');
      } else {
        seen.add(role);
      }
    });
  });
}

// Alias for compatibility
function uniqueLandmarks() {
  ensureUniqueLandmarks();
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
      const title = svg.querySelector('title');
      const label = title ? title.textContent : 'SVG icon';
      svg.setAttribute('aria-label', label);
    }
  });
}

// Alias for compatibility
function addAccessibleNamesToSVGs() {
  addSvgAccessibleNames();
}

// REACT_036: Fix fake link issue
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('[onclick], [data-fake-link]');
  fakeLinks.forEach((el) => {
    // Replace with real <a> if appropriate, otherwise make it keyboard accessible
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }
    if (el.tagName !== 'A') {
      el.setAttribute('role', 'link');
    }
  });
}

// Alias for compatibility
function fixFakeLinkIssues() {
  fixFakeLinkIssue();
}

// REACT_037: Google sign-in logic
function googleSignIn() {
  // Placeholder for Google OAuth integration
  // In a real implementation, this would handle the authentication flow
  console.log('Google sign-in initiated');
}

// REACT_040: Replace my-button with actual button id
function fixButtonIdentifiers() {
  const buttons = document.querySelectorAll('.my-button');
  buttons.forEach((btn, index) => {
    btn.id = btn.id || `button-${index + 1}`;
  });
}

// Generalized accessibility improvement function
function improveAccessibility() {
  // Make clickable elements focusable
  const clickable = document.querySelectorAll('[onclick], [role="link"], button, a');
  clickable.forEach((el) => {
    if (!el.hasAttribute('tabindex') && el.tagName !== 'BUTTON' && el.tagName !== 'A') {
      el.setAttribute('tabindex', '0');
    }
  });
  // Additional general improvements can be added here
}

// Address insight report issues (generic dispatch)
function addressInsightIssues(insightReport) {
  const issues = insightReport.issues || [];
  issues.forEach((issue) => {
    switch (issue.code) {
      case 'REACT_015': addLangAttribute(); break;
      case 'REACT_027': fixTableStructure(); break;
      case 'REACT_017': fixLandmarkIssues(); break;
      case 'REACT_025': ensureUniqueLandmarks(); break;
      case 'REACT_041': addSvgAccessibleNames(); break;
      case 'REACT_036': fixFakeLinkIssue(); break;
      case 'REACT_037': googleSignIn(); break;
      case 'REACT_040': fixButtonIdentifiers(); break;
      default: break;
    }
  });
}

// Specific handler for REACT_017
function addressREACT017(insightReport) {
  const issues = insightReport.issues || [];
  issues.forEach((issue) => {
    if (issue.code === 'REACT_017') {
      // Ensure proper ARIA labels
      const elements = issue.elements || [];
      elements.forEach((el) => {
        if (!el.getAttribute('aria-label') && !el.getAttribute('label')) {
          el.setAttribute('aria-label', el.id || 'unnamed-element');
        }
      });
      addMainLandmark();
      fixLandmarkIssues();
    }
  });
}

// New function: add landmark roles based on Screeps structures (optional)
function addLandmarkRoles() {
  // Implementation for Screeps structures (if applicable)
  // Example: assign roles to spawn, extension, etc.
}

// Function to ensure landmark uniqueness using a generic elements array
function ensureLandmarkUniqueness(elements) {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  landmarks.forEach((landmark) => {
    const grouped = elements.filter((el) => el.getAttribute && el.getAttribute('role') === landmark);
    grouped.forEach((el, index) => {
      if (index > 0) {
        el.removeAttribute('role');
      }
    });
  });
}

// New function to address accessibility issues comprehensively
function addressAccessibilityIssues() {
  // ARIA role for dependency graph container
  const graphContainer = document.querySelector('.dependency-graph') || document.querySelector('[data-graph-container]');
  if (graphContainer) {
    graphContainer.setAttribute('role', 'tree');
    graphContainer.setAttribute('aria-label', 'Dependency Graph');
  }
  // Add SVG labels
  addSvgAccessibleNames();
  // Make clickable elements focusable
  improveAccessibility();
}

// Placeholder implementations (unchanged)
function renderDependencyGraph(dependencyData) {
  console.log('Rendering dependency graph with data:', dependencyData);
}

function renderIndexView(indexData) {
  console.log('Rendering index view with data:', indexData);
}

function calculateSum(a, b) {
  return a + b;
}

// Module exports
module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  fixLandmarkIssues,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  fixButtonIdentifiers,
  improveAccessibility,
  addressInsightIssues,
  addressREACT017,
  addressAccessibilityIssues,
  addLandmarkRoles,
  ensureLandmarkUniqueness,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  someFunction
};