// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----

const accessibilityUtils = {
  initSkipLink: function() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', function(e) {
        const targetId = skipLink.getAttribute('href').replace('#', '');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus();
        }
      });
    }
  },

  trapFocus: function(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  },

  newFocusTrap: function() {
    // Wrapper for focusTrap
  },

  addAriaLabel: function(element, label) {
    if (!element) {
      throw new Error('Element is required for aria-label');
    }
    if (!label) {
      throw new Error('Label is required for aria-label');
    }
    element.setAttribute('aria-label', label);
    return element;
  },

  announceToScreenReader: function(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  ensureElementHasId: function(element, prefix = 'element') {
    if (!element) {
      throw new Error('Element is required');
    }
    
    if (element.id) {
      return element.id;
    }
    
    const id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    element.id = id;
    return id;
  },

  ensureElementId: function(element) {
    if (element && !element.id) {
      element.id = 'element-' + Math.random().toString(36).substr(2, 9);
    }
    return element;
  },

  initAccessibility: function() {
    // Add keyboard support for all interactive elements
    document.querySelectorAll('button, a, [role="button"]').forEach(item => {
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });
    
    // Add accessibility for elements with data-accessible attribute
    document.querySelectorAll('[data-accessible]').forEach(item => {
      item.setAttribute('role', 'region');
      const label = item.getAttribute('data-accessible');
      if (label) {
        item.setAttribute('aria-label', label);
      }
    });
  },

  focusTrap: function(element) {
    if (!element) return;
    
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
    
    firstElement.focus();
  }
};

function renderDependencyGraphs(container, dependencies, options = {}) {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  if (!dependencies) {
    throw new Error('Dependencies data is required');
  }
  
  // Ensure container has an id for graph references
  const containerId = accessibilityUtils.ensureElementHasId(container, 'graph-container');
  
  // Add accessibility label if not present
  accessibilityUtils.addAriaLabel(container, `Dependency graph: ${containerId}`);
  
  const canvas = document.createElement('canvas');
  canvas.id = `${containerId}-canvas`;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Dependency visualization graph');
  canvas.width = options.width || 800;
  canvas.height = options.height || 600;
  container.appendChild(canvas);
  
  return containerId;
}

function initDependencyGraph(container, data) {
  try {
    const containerId = renderDependencyGraphs(container, data);
    accessibilityUtils.announceToScreenReader(`Dependency graph loaded with ${data.length} items`);
    return containerId;
  } catch (error) {
    accessibilityUtils.announceToScreenReader(`Error loading dependency graph: ${error.message}`);
    throw error;
  }
}

function addressAccessibilityIssues(element, fixes = {}) {
  if (!element) {
    console.warn('Address accessibility issues: No element provided');
    return;
  }
  
  if (fixes.ariaHidden) {
    element.setAttribute('aria-hidden', 'true');
  }
  
  if (fixes.focusable !== undefined) {
    element.setAttribute('tabindex', fixes.focusable ? '0' : '-1');
  }
  
  if (fixes.role) {
    element.setAttribute('role', fixes.role);
  }
  
  if (fixes.label) {
    accessibilityUtils.addAriaLabel(element, fixes.label);
  }
  
  console.log('Applied accessibility fixes:', fixes);
}

function exportData(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  accessibilityUtils.announceToScreenReader(`Download of ${filename} started`);
}

module.exports = {
  accessibilityUtils,
  renderDependencyGraphs,
  initDependencyGraph,
  addressAccessibilityIssues,
  exportData
};