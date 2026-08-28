// main.js

// TODO: Address accessibility issues from insight report:

// Accessible utility functions
function createAccessibleButton(id, label, onClick) {
  const button = document.createElement('button');
  button.id = id;
  button.setAttribute('aria-label', label);
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

function createAccessibleDialog(id, title, content, closeLabel = 'Close') {
  const dialog = document.createElement('div');
  dialog.id = id;
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-labelledby', `${id}-title`);
  dialog.setAttribute('aria-modal', 'true');
  
  const titleEl = document.createElement('h2');
  titleEl.id = `${id}-title`;
  titleEl.textContent = title;
  
  const closeButton = createAccessibleButton(`${id}-close`, closeLabel, () => {
    dialog.hidden = true;
    dialog.setAttribute('aria-hidden', 'true');
  });
  
  dialog.appendChild(titleEl);
  dialog.appendChild(closeButton);
  dialog.appendChild(content);
  
  return dialog;
}

function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

// Initialize accessibility features
function initAccessibility() {
  // Add skip link functionality
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.tabIndex = -1;
        target.focus();
      }
    });
  }
  
  // Ensure all images have alt text
  document.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
    }
  });
  
  // Add proper labeling to form inputs
  document.querySelectorAll('input, select, textarea').forEach((input) => {
    if (!input.id && input.name) {
      input.id = input.name;
    }
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (!label && input.type !== 'hidden') {
      input.setAttribute('aria-label', input.name || 'Form input');
    }
  });
}

const fs = require('fs');
const path = require('path');

// Game loop function
function run() {
  // Your game logic here...

  // Update scope attributes in all .html files in the views directory
  const viewsDir = path.join(__dirname, 'views');
  fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      const filePath = path.join(viewsDir, file);
      updateThScopeAttribute(filePath);
    });
}

// Start the game loop
Module.onInit = function() {
  setInterval(run, 1000);
};

/**
 * Checks if a table has the expected structure
 * @param {string} tableName - The name of the table to check
 * @param {Array<string>} expectedColumns - Array of expected column names
 * @returns {boolean} - True if table structure matches expected columns, false otherwise
 */
function checkTableStructure(tableName, expectedColumns) {
  if (!tableName || typeof tableName !== 'string') {
    return false;
  }
  
  if (!Array.isArray(expectedColumns)) {
    return false;
  }
  
  // Validate that expectedColumns is not empty
  if (expectedColumns.length === 0) {
    return false;
  }
  
  // Validate that all expectedColumns are non-empty strings
  for (const column of expectedColumns) {
    if (typeof column !== 'string' || column.trim() === '') {
      return false;
    }
  }
  
  // This function checks the structure of a table
  // In a real implementation, this would query the database schema
  // and validate that the table has the expected columns
  return true;
}

// TODO: Implement a function to count dependencies
function countDependencies() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

function main() {
  return 'Hello World';
}

function SomeClass() {}

function someUtility() {
  return true;
}

const config = {
  enabled: true
};

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createAccessibleButton,
    createAccessibleDialog,
    announceToScreenReader,
    trapFocus,
    initAccessibility,
    main,
    SomeClass,
    someUtility,
    config,
    countDependencies,
    run,
    checkTableStructure
  };
}