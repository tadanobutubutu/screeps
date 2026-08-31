// main.js - Main application logic with accessibility features and dependency graph rendering

const fs = require('fs');
const path = require('path');

// Import dependency graph content module
const dependencyGraphContent = require('./dependencyGraphContent');
// Import index content module
const indexContent = require('./indexContent');

// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
const dependencyGraph = document.getElementById('dependencyGraph');

if (dependencyGraph) {
  // Set appropriate ARIA role for the dependency graph container
  // Using 'region' role for a contained section of content
  if (!dependencyGraph.getAttribute('role')) {
    dependencyGraph.setAttribute('role', 'region');
  }
}

// Ensure element has an ID for graph references
const ensureElementHasId = (element, prefix = 'element') => {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (element.id) {
    return element.id;
  }
  
  const id = `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
  element.id = id;
  return id;
};

// Add accessibility label to element
const addAriaLabel = (element, label) => {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (!label) {
    throw new Error('Label is required');
  }
  
  if (element.hasAttribute('aria-label')) {
    return element;
  }
  
  element.setAttribute('aria-label', label);
  return element;
};

// Render dependency graph with content from module
const renderDependencyGraph = (container, data) => {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  if (!data) {
    throw new Error('Data is required');
  }
  
  const containerId = ensureElementHasId(container, 'graph-container');
  
  // Use imported dependencyGraphContent module
  const content = dependencyGraphContent.generateGraphContent(data);
  
  addAriaLabel(container, `Dependency graph: ${containerId}`);
  
  const graphContainer = document.createElement('div');
  graphContainer.id = containerId;
  graphContainer.innerHTML = content;
  container.appendChild(graphContainer);
  
  return graphContainer;
};

// Render multiple dependency graphs
const renderDependencyGraphs = (container, dependencies, options = {}) => {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  if (!dependencies) {
    throw new Error('Dependencies data is required');
  }
  
  const containerId = ensureElementHasId(container, 'graph-container');
  
  addAriaLabel(container, `Dependency graph: ${containerId}`);
  
  const graphContainer = document.createElement('div');
  graphContainer.id = containerId;
  
  // Use imported dependencyGraphContent module for multiple graphs
  const content = dependencyGraphContent.generateMultipleGraphs(dependencies, options);
  graphContainer.innerHTML = content;
  
  container.appendChild(graphContainer);
  
  // Initialize focus trap for accessibility
  focusTrap(graphContainer);
  
  return graphContainer;
};

// Render index view with content from module
const renderIndexView = (container, data) => {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  if (!data) {
    throw new Error('Data is required');
  }
  
  const containerId = ensureElementHasId(container, 'index-container');
  
  // Use imported indexContent module
  const content = indexContent.generateIndexContent(data);
  
  addAriaLabel(container, `Index view: ${containerId}`);
  
  const indexContainer = document.createElement('div');
  indexContainer.id = containerId;
  indexContainer.innerHTML = content;
  container.appendChild(indexContainer);
  
  return indexContainer;
};

// Focus trap for keyboard navigation
const focusTrap = (element) => {
  if (!element) return;
  
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleTabKey = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  element.addEventListener('keydown', handleTabKey);
  
  // Set initial focus to first element
  if (firstElement) {
    firstElement.focus();
  }
  
  return {
    destroy: () => {
      element.removeEventListener('keydown', handleTabKey);
    }
  };
};

// Skip link initialization
const initSkipLink = () => {
  const skipLink = document.querySelector('.skip-link');
  
  if (!skipLink) return;
  
  skipLink.addEventListener('click', (e) => {
    const href = skipLink.getAttribute('href');
    if (href && href.startsWith('#')) {
      const targetId = href.substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    }
  });
};

// Initialize accessibility features
const initAccessibility = () => {
  // Add keyboard support for all interactive elements
  const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
  
  interactiveElements.forEach(element => {
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (element.tagName !== 'A' && element.tagName !== 'BUTTON') {
          e.preventDefault();
          element.click();
        }
      }
    });
  });
  
  // Add accessibility attributes to data-accessible elements
  const accessibleElements = document.querySelectorAll('[data-accessible]');
  
  accessibleElements.forEach(element => {
    if (!element.hasAttribute('role')) {
      element.setAttribute('role', 'button');
    }
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
};

// Export data functionality
const exportData = (data, filename = 'export.json') => {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Announce export completion
    announceToScreenReader(`Export of ${filename} completed`);
    
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    announceToScreenReader('Export failed');
    return false;
  }
};

// Announce message to screen reader
const announceToScreenReader = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Address accessibility issues
const addressAccessibilityIssues = () => {
  const issues = [];
  
  // Check for images without alt text
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.hasAttribute('alt')) {
      issues.push(`Image at index ${index} missing alt attribute`);
      img.setAttribute('alt', 'Image description not provided');
    }
  });
  
  // Check for form inputs without labels
  const inputs = document.querySelectorAll('input:not([type="hidden"])');
  inputs.forEach((input, index) => {
    const id = input.id;
    const hasLabel = id && document.querySelector(`label[for="${id}"]`);
    const hasAriaLabel = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');
    
    if (!hasLabel && !hasAriaLabel) {
      issues.push(`Input at index ${index} missing associated label`);
    }
  });
  
  // Log identified issues
  if (issues.length > 0) {
    console.log('Accessibility issues found:', issues);
  } else {
    console.log('No accessibility issues found');
  }
  
  return issues;
};

// Initialize application
const init = () => {
  initSkipLink();
  initAccessibility();
  addressAccessibilityIssues();
};

// Export all functions and utilities
module.exports = {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  renderDependencyGraphs,
  renderIndexView,
  focusTrap,
  initSkipLink,
  initAccessibility,
  exportData,
  announceToScreenReader,
  addressAccessibilityIssues,
  init
};

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}