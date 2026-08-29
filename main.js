// TODO: This is the existing code that needs to be preserved; add new functions to ensure elements have an id, add aria-label, and render dependency graphs

const config = {};
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {};

let uniqueLandmarks = {};

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// Function for calculating distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Function for checking landmark elements
function checkLandmarkElements(landmarks) {
  if (!Array.isArray(landmarks)) {
    return false;
  }
  
  if (landmarks.length === 0) {
    return false;
  }
  
  return landmarks.every(landmark => {
    if (!landmark) return false;
    return landmark.id || landmark.name;
  });
}

// Function for ensuring unique landmarks
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!landmark) return false;
    
    const identifier = landmark.id || landmark.name;
    
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
}

// Address accessibility issues
function addressAccessibilityIssues() {
  // Ensure the dependencyGraph container has a proper ARIA role
  // Support both class and data attribute selectors for compatibility
  const dependencyGraph = document.querySelector('.dependency-graph, [data-dependency-graph]') ||
    document.querySelector('.dependencyGraph') ||
    document.querySelector('[data-testid="dependency-graph"]') ||
    document.querySelector('div[data-testid=dependency-graph]');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'tree');
    dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
  }

  <<<<<<< HEAD
  // Render dependency graph content
  function renderDependencyGraphContent(data) {
    // Replace the existing content within the dependencyGraph div using the provided data.
    // Support both class and data attribute selectors for compatibility
    const container = document.querySelector('.dependency-graph-container, [data-dependency-graph-container]');
    if (container) {
      container.innerHTML = data;
  =======
  // Improve Accessibility
  function improveAccessibility() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      if (!button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', button.textContent || 'Button');
      }
    });

    const focusable = document.querySelectorAll('[role="link"]');
    focusable.forEach(el => {
      if (el.tabIndex < 0) el.tabIndex = 0;
    });
  }

  const landmarks = [...new Set(insightReport.issues.flatMap(issue => issue.ariaRole))];

  <<<<<<< origin/main
  // Ensure all clickable elements are focusable
  const focusable = document.querySelectorAll('[role="button"], [role="link"]');
  focusable.forEach(el => {
    if (el.tabIndex < 0) el.tabIndex = 0;
  });
}

function addressInsightReportIssues(insightReport) {
  const issues = insightReport.issues || [];
  issues.forEach(issue => {
    const element = document.querySelector(issue.selector);
    if (element) {
      // Add lang attribute to HTML element
      if (issue.code === 'REACT_015') {
        document.documentElement.lang = 'en';
      }
      // Add landmark roles and fix landmark issues
      if (issue.code === 'REACT_017') {
        if (issue.ariaRole) {
          element.setAttribute('role', issue.ariaRole);
        }
      }
      // Add accessible names to 2 SVGs
      if (issue.code === 'REACT_041') {
        if (issue.ariaLabel) {
          element.setAttribute('aria-label', issue.ariaLabel);
        }
      }
      // Ensure unique landmarks (2 issues)
      if (issue.code === 'REACT_025') {
        // Implement logic to ensure unique landmarks if needed
      }
      // Fix 1 fake link issue
      if (issue.code === 'REACT_036') {
        // Implement logic to fix fake link issues if needed
      }
      // Add scope="col" or scope="row" to <th> elements (already implemented)
      if (issue.code === 'REACT_027') {
        // This issue is already implemented, so no action is needed here
      }
    }
  });
}

// New function to address accessibility issues from insight report
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!landmark) return false;
    
    const identifier = landmark.id || landmark.name;
    
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
}

// New function to add landmark roles and fix issues
function addLandmarkRoles(insightReport) {
  const issues = insightReport.issues || [];
  issues.forEach(issue => {
    if (issue.code === 'REACT_017') {
      const element = document.querySelector(issue.selector);
      if (element && issue.ariaRole) {
        element.setAttribute('role', issue.ariaRole);
      }
    }
  });
}

function fixLandmarkIssues(insightReport) {
  // Implementation for adding landmark roles and fixing landmark issues
  // This is a placeholder that would need to be implemented based on specific requirements
  const issues = insightReport.issues || [];
  issues.forEach(issue => {
    if (issue.code === 'REACT_017') {
      const element = document.querySelector(issue.selector);
      if (element && issue.ariaRole) {
        element.setAttribute('role', issue.ariaRole);
      }
    }
  });
}

// Placeholder implementation for rendering a dependency graph
function renderDependencyGraph(dependencyData) {
  console.log('Rendering dependency graph with data:', dependencyData);
}

// Placeholder function for index view rendering (to be replaced with actual implementation)
function renderIndexView(indexData) {
  console.log('Rendering index view with data:', indexData);
}

// Function to calculate sum (unchanged)
function calculateSum(a, b) {
  return a + b;
}

// Fix fake link issue
function fixFakeLinks() {
  // Implementation for fixing fake link issues goes here.
  // Handle both anchor tags with href="#" and div elements with role="link"
  const fakeLinkAnchors = document.querySelectorAll('a[href="#"]');
  const fakeLinkDivs = document.querySelectorAll('[role="link"]');
  
  [...fakeLinkAnchors, ...fakeLinkDivs].forEach(link => {
    link.setAttribute('role', 'button');
    link.tabIndex = 0;
    if (!link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', 'Button');
    }
  });
}

// Add lang attribute to HTML element
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Fix table structure issues
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure tables have proper structure
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const tbody = table.querySelector('tbody');
        thead.appendChild(firstRow);
        table.insertBefore(thead, tbody || firstRow);
      }
    }
  });
}

// Fix table header cell scope
function fixTable