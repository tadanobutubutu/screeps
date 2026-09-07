// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// TODO: Address accessibility issues from insight report
// TODO: This is the existing code that needs to be preserved
// ----- END ORIGINAL CODE (unchanged) -----
/**
 * Creates an in-page button element with optional click handler.
 * @param {string} buttonText - The label text for the button
 * @param {Function} onClickHandler - Callback function triggered when the button is clicked
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  if (onClickHandler && typeof onClickHandler === 'function') {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

/**
 * Export the function so it can be imported by other modules
 */
export { createInPageButton };

/**
 * Initialize the application with accessibility improvements
 */
function initialize() {
  // Existing initialization logic preserved
  console.log('Application initialized');

  // Accessibility: Ensure main content is keyboard accessible
  const mainContent = document.querySelector('main') || document.getElementById('main');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.setAttribute('role', 'main');
  }

  // Accessibility: Add skip link functionality
  setupSkipLinks();

  // Accessibility: Ensure buttons have proper labels
  setupButtonAccessibility();
}

/**
 * Get the application configuration
 * @returns {Object} The configuration object with apiUrl and timeout properties
 */
export function getConfig() {
  return {
    apiUrl: process.env.API_URL || '',
    timeout: 5000
  };
}

/**
 * Setup skip link functionality for keyboard navigation
 */
function setupSkipLinks() {
  const skipLink = document.querySelector('.skip-link') || document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(skipLink.getAttribute('href').replace('#', ''));
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

function renderGraphIndex() {
  const container = document.getElementById('graph-index-container');
  if (!container) return;
  
  // Use createInPageButton for accessibility
  const viewButton = createInPageButton('View Graph Index', () => {
    console.log('View graph index clicked');
  });
  
  const exportButton = createInPageButton('Export Graph', () => {
    console.log('Export graph clicked');
  });
  
  container.appendChild(viewButton);
  container.appendChild(exportButton);
}

// Define new render function for dependency graph
function renderDependencyGraph() {
  // Add logic to render the dependency graph
  // ...
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

export function greet(name) {
  return `Hello, ${name}!`;
}

// Implement the function for addressing new accessibility issues
function addressAccessibilityIssues() {
  // Assuming we are adding an ARIA role to the dependencyGraph container
  const dependencyGraph = document.querySelector('.dependencyGraph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'group');
  }

  const issues = [];
  const elements = document.querySelectorAll('img');
  elements.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        type: 'missing-alt',
        element: img,
        message: 'Image is missing alt attribute'
      });
    }
  });

  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach((el) => {
    const hasLabel =
      el.hasAttribute('aria-label') ||
      el.hasAttribute('aria-labelledby') ||
      el.textContent.trim().length > 0 ||
      el.querySelector('[aria-label]') !== null;
    if (!hasLabel) {
      issues.push({
        type: 'missing-accessible-name',
        element: el,
        message: 'Interactive element is missing an accessible name'
      });
    }
  });

  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1), 10);
    if (previousLevel > 0 && level - previousLevel > 1) {
      issues.push({
        type: 'heading-skip',
        element: heading,
        message: `Heading level skipped from h${previousLevel} to h${level}`
      });
    }
    previousLevel = level;
  });

  if (document.documentElement.lang !== 'en' && !document.documentElement.hasAttribute('lang')) {
    issues.push({
      type: 'missing-lang',
      element: document.documentElement,
      message: 'HTML root element is missing lang attribute'
    });
  }

  return {
    total: issues.length,
    issues,
    summary: {
      missingAlt: issues.filter((i) => i.type === 'missing-alt').length,
      missingAccessibleName: issues.filter((i) => i.type === 'missing-accessible-name').length,
      headingSkips: issues.filter((i) => i.type === 'heading-skip').length,
      missingLang: issues.filter((i) => i.type === 'missing-lang').length
    }
  };
}

// New accessibility enhancement: ensure root container has accessible name and create announcement region
const rootContainer = document.getElementById('root').parentElement;
if (rootContainer) {
  rootContainer.setAttribute('role', 'main');
}

const announcementId = 'accessibility-announcement';
const announcement = document.createElement('div');
announcement.id = announcementId;
announcement.setAttribute('aria-live', 'polite');
announcement.setAttribute('aria-atomic', 'true');
// Hide off-screen
announcement.style.position = 'absolute';
announcement.style.left = '-9999px';
announcement.style.top = '-9999px';
document.body.appendChild(announcement);


// Validate that tables in the document are accessible
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

// Validate the structure of tables in the document
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
      const cellCounts = Array.from(rows).map(row => row.querySelectorAll('td, th').length);
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

export function add(a, b) {
  return a + b;
}

// Export existing functionality
module.exports = {
  initialize,
  getConfig,
  setupSkipLinks,
  setupButtonAccessibility,
  createInPageButton,
  performTask,
  handleEvent,
  greet,
  add
};

// Add the new function to the default export
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
  setupButtonAccessibility,
  renderDependencyGraph,
  setupSkipLinks,
  createInPageButton,
  renderGraphIndex
};

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}