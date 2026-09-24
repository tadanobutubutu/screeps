// TODO: This is the existing code that needs to be preserve
const fs = require('fs');
const url = require('url');

const { dependencyGraphContent, indexContent } = require('./dependencyContent');

// Accessibility utilities and functions
const accessibilityUtils = {
  initSkipLink,
  trapFocus,
  newFocusTrap: (element) => {
    if (!element) return;
    const focusable = element.querySelectorAll(
      'a[href], button, textarea, input, select'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handler = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handler);
    return () => element.removeEventListener('keydown', handler);
  },

  exportToJSON: (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2);
    exportUtilities.exportData(jsonString, filename || 'export.json', 'application/json');
  },

  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [];

    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const escaped = (' ' + row[header]).replace(/"/g, '\\"');
        return "\"" + escaped + "\"";
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    exportUtilities.exportData(csvString, filename || 'export.csv', 'text/csv');
  }
};

function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9.-]/gi, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log("Error reading file " + filePath + ": " + error.message, 'error');
    return null;
  }
}

// Existing data processing functions
function processData(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
}

function filterValidItems(items, validator) {
  return items.filter(item => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
}

// Initialize accessibility features
const initAccessibility = () => {
  accessibilityUtils.initSkipLink();

  // Add keyboard support for all interactive elements
  document.querySelectorAll('button, a, input, select, textarea').forEach(element => {
    element.addEventListener('keydown', (e) => {
      const handlers = {
        Enter: () => element.click(),
        ' ': () => element.click()
      };
      if (handlers[e.key]) {
        handlers[e.key]();
      }
    });
  });
};

// TODO: Implement this function for creating in- page buttons
function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    button.setAttribute('aria-label', buttonText);
    button.addEventListener('click', function() {
        // Button click handler can be added here
    });
    return button;
}

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) {
    console.warn('No focusable elements found in container');
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }

    if (e.key === 'Escape') {
      element.dispatchEvent(new KeyboardEvent('escape'));
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

// Credential response handling - uses the imported function from main

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(timestamp + " [" + level.toUpperCase() + "]: " + message);
}

// Export functionality with accessibility support
const exportUtilities = {
  exportData: (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('aria-label', "Download " + filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Announce download completion to screen readers
    announceToScreenReader("Download of " + filename + " started");
  },

  exportToJSON: (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2);
    exportUtilities.exportData(jsonString, filename || 'export.json', 'application/json');
  },

  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [];

    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return "\"" + escaped + "\"";
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    exportUtilities.exportData(csvString, filename || 'export.csv', 'text/csv');
  }
};

function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9.-]/gi, '_');
}

// TODO: Implement wrapPrimaryContentInMain function, including the added logic
/**
 * Wraps primary content in a main landmark element for accessibility compliance.
 * @param {string|HTMLElement} content - The content to wrap (HTML string or DOM element)
 * @param {Object} options - Configuration options for the main element
 * @param {string} [options.id] - Optional ID for the main element
 * @param {string} [options.ariaLabel] - Optional ARIA label for accessibility
 * @param {string} [options.role] - Optional role attribute (defaults to 'main')
 * @returns {HTMLElement} The wrapped content inside a main element
 */
function wrapPrimaryContentInMain(content, options = {}) {
  const mainElement = document.createElement('main');
  
  // Set role if specified and different from default
  if (options.role) {
    mainElement.setAttribute('role', options.role);
  } else {
    mainElement.setAttribute('role', 'main');
  }
  
  // Set ID if provided
  if (options.id) {
    mainElement.id = options.id;
  }
  
  // Set ARIA label if provided
  if (options.ariaLabel) {
    mainElement.setAttribute('aria-label', options.ariaLabel);
  }
  
  // Ensure unique landmark - check existing main elements
  const existingMain = document.querySelector('main, [role="main"]');
  if (existingMain && existingMain !== mainElement) {
    existingMain.setAttribute('role', 'region');
    if (!existingMain.getAttribute('aria-label')) {
      existingMain.setAttribute('aria-label', 'Content section');
    }
  }
  
  // Handle different content types
  if (typeof content === 'string') {
    mainElement.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    mainElement.appendChild(content);
  } else {
    console.warn('wrapPrimaryContentInMain: Unsupported content type');
    mainElement.textContent = 'Error: Unsupported content type';
  }
  
  // Add skip link target ID if not already present
  if (!mainElement.id) {
    mainElement.id = 'main-content';
    if (!mainElement.getAttribute('aria-label')) {
      mainElement.setAttribute('aria-label', 'Main content');
    }
  }
  
  // Add semantic structure class
  mainElement.className = 'main-content';
  
  return mainElement;
}

// REACT_042: Ensure dependencyGraph container has proper ARIA role
function ensureProperARIAroleForDependencyGraph() {
    const dependencyGraph = document.querySelector('#dependencyGraph');
    if (dependencyGraph) {
        // TODO: Implement the actual logic
    }
}