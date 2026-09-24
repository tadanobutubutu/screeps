const main = require('./utilities');
const { requireDir } = require('require-dir');
requireDir(require.resolve('./utilities'));

const { createInPageButton, createWebResourceButton, validateLandmark, validateLandmarkStructure, validateAccessibilityReport, validateTableStructure, getSvgAccessibleName, getLangAttribute, calculateSum } = main;

function addAccessibleName(svgString) {
  const svg = new DOMParser().parseFromString(svgString, "image/svg+xml");
  const svgElement = svg.documentElement;
  if (!svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', 'Descriptive label for SVG');
  }
  return items.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
}

function validateTableAccessibility(tableData) {
  return true;
}

function validateTableStructure(tableData) {
  return true;
}

function handleAccessibilityIssues() {
  getLangAttribute();
  validateTableAccessibility();
  validateTableStructure();
  validateLandmark();
  validateLandmarkStructure();
  ensureUniqueLandmarks();
  getSvgAccessibleName();
  createInPageButton();
}

// Landmark validation and fixing functions
function validateLandmark(container) {
  // Placeholder for actual landmark validation logic
  return [];
}

function validateLandmarkStructure(container) {
  // Placeholder for actual landmark structure validation logic
  return [];
}

// SVG accessible name extraction
function getSvgAccessibleName(svgString) {
  // This function extracts an accessible name from an SVG string
  // It parses the SVG and attempts to extract a descriptive title
  const svg = new DOMParser().parseFromString(svgString, "image/svg+xml");
  const svgElement = svg.documentElement;
  
  // Try to get title attribute first
  if (svgElement.getAttribute('title')) {
    return svgElement.getAttribute('title');
  }
  
  // Fallback to a generic description
  return 'Descriptive label for SVG';
}

// Set accessible name props on SVG elements
function setSvgAccessibilityProps(svgElement, accessibleName) {
  if (accessibleName) {
    svgElement.setAttribute('aria-label', accessibleName);
  }
}

// Fix fake link issues (elements that look like links but are missing href)
function fixFakeLinkIssue(link) {
  link.setAttribute('role', 'link');
  link.setAttribute('tabindex', '0');
}

// Focus trap functionality for keyboard navigation
function focusTrap(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  let activeElementIndex = focusableElements.length - 1;
  
  function setActiveElement(index) {
    if (index < 0) {
      index = focusableElements.length - 1;
    } else if (index >= focusableElements.length) {
      index = 0;
    }
    
    if (focusableElements[index]) {
      focusableElements[index].focus();
    } else {
      focusableElements[0].focus();
    }
    activeElementIndex = index;
  }
  
  function nextFocusableElement() {
    setActiveElement(activeElementIndex + 1);
  }
  
  function prevFocusableElement() {
    setActiveElement(activeElementIndex - 1);
  }
  
  function moveFocusToFirst() {
    setActiveElement(0);
  }
  
  function moveFocusToLast() {
    setActiveElement(focusableElements.length - 1);
  }
  
  element.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'Tab':
        if (e.shiftKey) {
          prevFocusableElement();
        } else {
          nextFocusableElement();
        }
        e.preventDefault();
        break;
      case 'ArrowLeft':
        prevFocusableElement();
        e.preventDefault();
        break;
      case 'ArrowRight':
        nextFocusableElement();
        e.preventDefault();
        break;
      case 'Home':
        moveFocusToFirst();
        e.preventDefault();
        break;
      case 'End':
        moveFocusToLast();
        e.preventDefault();
        break;
    }
  });
  
  return { element, focusableElements };
}

// Main export object containing all accessibility utilities
const exportUtils = {
  exportData: function(data, filename, mimeType, options = {}) {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('aria-label', 'Download ' + filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Announce download completion to screen readers
    accessibilityUtils.announceToScreenReader('Download of ' + filename + ' started');
  },
  
  exportToJSON: function(data, filename) {
    const jsonString = JSON.stringify(data, null, 2);
    exportUtils.exportData(jsonString, filename || 'export.json', 'application/json');
  },
  
  exportToCSV: function(data, filename) {
    if (!data || data.length === 0) {
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const values = headers.map(function(header) {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return '"' + escaped + '"';
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    exportUtils.exportData(csvString, filename || 'export.csv', 'text/csv');
  }
};

// Additional utility functions
function ensureElementId(element, skipUserAgentTest = false) {
  if (!element) return;
  if (element.id) return element;

  while (element && element.tagName !== 'BODY') {
    if (!skipUserAgentTest && /MSIE|Trident/.test(navigator.userAgent)) {
      // Avoid errors in Internet Explorer
      if (!element.id) {
        element.setAttribute('id', 'element-' + Date.now());
      }
      break;
    }
    if (!element.id && element.parentNode) {
      element = element.parentNode;
    } else break;
  }

  if (!element.id) {
    element.id = 'element-' + Date.now() + '-' + Math.random().toString(36).slice(2);
  }

  return element;
}

function addAriaLabel(element, label) {
  if (element) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

function renderDependencyGraph(data, stats) {
  // Implementation for rendering dependency graphs
  return {
    nodes: data.nodes || [],
    edges: data.edges || [],
    stats: stats || {}
  };
}

function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9_.-]/gi, '_');
}

// Handle credential responses
async function handleCredentialResponse(response) {
  if (!response) {
    throw new Error('No response received');
  }

  if (response.error) {
    throw new Error(response.error);
  }

  if (response.token) {
    return {
      success: true,
      token: response.token,
      expiresIn: response.expiresIn || 3600
    };
  }

  throw new Error('Invalid credential response');
}

// Logging utility
function log(message, level = 'info') {
  if (level === undefined) {
    level = 'info';
  }
  const timestamp = new Date().toISOString();
  console.log(timestamp + ' [' + level.toUpperCase() + ']: ' + message);
}

// Export functionality with accessibility support
module.exports = {
  ...module.exports,
  handleCredentialResponse: handleCredentialResponse,
};