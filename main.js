// existing code preserved...

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

document.documentElement.lang = 'en';

reportWebVitals();

const VERSION = '1.0.0';

const CONFIG = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development'
};

function initialize() {
  console.log('Application initialized');
  return true;
}

function getConfig() {
  return CONFIG;
}

function getVersion() {
  return VERSION;
}

function addressAccessibilityIssues() {
  // Ensure the root container has an accessible name
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  // Create a hidden live region for dynamic announcements
  const announcementId = 'accessibility-announcement';
  let announcement = document.getElementById(announcementId);
  if (!announcement) {
    announcement = document.createElement('div');
    announcement.id = announcementId;
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    // Hide off-screen
    announcement.style.position = 'absolute';
    announcement.style.left = '-9999px';
    announcement.style.top = '-9999px';
    document.body.appendChild(announcement);
  }
}

function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  const results = [];
  
  tables.forEach((table, index) => {
    const hasCaption = table.querySelector('caption') !== null;
    const hasHeaders = table.querySelector('th') !== null;
    const hasScope = Array.from(table.querySelectorAll('th')).every(
      th => th.hasAttribute('scope')
    );
    
    results.push({
      tableIndex: index,
      hasCaption,
      hasHeaders,
      hasScope,
      isAccessible: hasCaption && hasHeaders && hasScope
    });
  });
  
  return results;
}

function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  const results = [];
  
  tables.forEach((table, index) => {
    const rows = table.querySelectorAll('tr');
    let isValid = true;
    let error = null;
    
    if (rows.length === 0) {
      isValid = false;
      error = 'Table has no rows';
    } else {
      const cellCounts = Array.from(rows).map(row => row.querySelectorAll('td').length);
      const allSame = cellCounts.every(count => count === cellCounts[0]);
      
      if (!allSame) {
        isValid = false;
        error = 'Table has inconsistent cell counts across rows';
      }
    }
    
    results.push({
      tableIndex: index,
      rowCount: rows.length,
      isValid,
      error
    });
  });
  
  return results;
}

function generateAccessibilityReport() {
  const timestamp = new Date().toISOString();
  const tableAccessibilityResults = validateTableAccessibility();
  const tableStructureResults = validateTableStructure();
  const landmarkResults = validateLandmark();
  
  const totalTables = tableAccessibilityResults.length;
  const accessibleTables = tableAccessibilityResults.filter(r => r.isAccessible).length;
  const validStructures = tableStructureResults.filter(r => r.isValid).length;
  
  const issues = [];
  
  tableAccessibilityResults.forEach((result, index) => {
    if (!result.isAccessible) {
      const issue = { tableIndex: index, type: 'accessibility' };
      if (!result.hasCaption) issue.reason = 'Missing caption';
      else if (!result.hasHeaders) issue.reason = 'Missing header cells';
      else if (!result.hasScope) issue.reason = 'Headers missing scope attribute';
      issues.push(issue);
    }
  });
  
  tableStructureResults.forEach((result, index) => {
    if (!result.isValid && result.error) {
      issues.push({ tableIndex: index, type: 'structure', reason: result.error });
    }
  });
  
  landmarkResults.forEach((result, index) => {
    if (!result.isValid && result.error) {
      issues.push({ elementIndex: index, type: 'landmark', reason: result.error });
    }
  });
  
  return {
    timestamp,
    summary: {
      totalTables,
      accessibleTables,
      validStructures,
      accessibilityScore: totalTables > 0 ? (accessibleTables / totalTables) * 100 : 100,
      structureScore: totalTables > 0 ? (validStructures / totalTables) * 100 : 100
    },
    issues,
    tableAccessibility: tableAccessibilityResults,
    tableStructure: tableStructureResults,
    landmarkResults
  };
}

// Example usage for SVGs:
// const svg1 = document.querySelector('.svg-1');
// const svg2 = document.querySelector('.svg-2');
// svg1.setAttribute('aria-label', 'Description of first icon');
// svg2.setAttribute('aria-label', 'Description of second icon');

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// Ensure all <th> elements have scope attribute
function ensureThScope() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      // Determine if it's a column header or row header based on context
      const parent = th.parentElement;
      const parentTagName = parent ? parent.tagName.toLowerCase() : '';
      const isFirstCell = parent && Array.from(parent.children).indexOf(th) === 0;

      if (isFirstCell && parentTagName === 'tr') {
        th.setAttribute('scope', 'row');
      } else if (parentTagName === 'thead' || !isFirstCell) {
        th.setAttribute('scope', 'col');
      }
    }
  });
}

/**
 * Setup skip link functionality for keyboard navigation
 */
function setupSkipLinks() {
  const skipLink = document.querySelector('.skip-link') || document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href') || '');
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/**
 * Ensure buttons have proper accessibility attributes
 */
function setupButtonAccessibility() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', 'Action button');
    }
  });
}

/**
 * Perform a task with the given parameters
 * @param {string} task - The task to perform
 */
function performTask(task) {
  console.log(`Performing task: ${task}`);
  // Task implementation details would go here
}

/**
 * Handle an event with the given parameters
 * @param {string} event - The event to handle
 */
function handleEvent(event) {
  console.log(`Handling event: ${event}`);
  // Event handling logic would go here
}

function add(a, b) {
  return a + b;
}

/**
 * Count the number of dependencies in package.json
 * @param {Object} packageJson - The package.json object
 * @returns {number} The count of dependencies
 */
export function countDependencies(packageJson) {
  if (!packageJson || typeof packageJson !== 'object') {
    return 0;
  }
  
  // Return the report for further use
  return report;
}

// Export the new function
export {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues,
  root,
  validateTableAccessibility,
  validateTableStructure,
  generateAccessibilityReport,
  renderGraphIndex
};

export default {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues,
  root,
  validateTableAccessibility,
  validateTableStructure,
  generateAccessibilityReport,
  renderGraphIndex
};