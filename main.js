// TODO: Address accessibility issues from insight report — FIXED

/**
 * Accessibility utilities for the application
 */
const AccessibilityUtils = {
  /**
   * Manages focus trapping within a container element
   * @param {HTMLElement} container - The container element to trap focus within
   * @returns {Function} - Cleanup function to remove the focus trap
   */
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    // Ensure focus is set to the first focusable element
    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },

  /**
   * Announces a message to screen readers using ARIA live regions
   * @param {string} message - The message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  announceToScreenReader(message, priority = 'polite') {
    let announcer = document.getElementById('aria-announcer');
    
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'aria-announcer';
      announcer.setAttribute('aria-live', priority);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
      document.body.appendChild(announcer);
    }

    // Clear and set message (ensures announcement even for repeated messages)
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);
  },

  /**
   * Handles escape key to close modals/dropdowns
   * @param {Function} closeCallback - Function to call when Escape is pressed
   * @param {HTMLElement} element - Element to attach the listener to
   */
  handleEscapeKey(closeCallback, element = document) {
    const handler = (e) => {
      if (e.key === 'Escape' && typeof closeCallback === 'function') {
        closeCallback();
      }
    };
    
    element.addEventListener('keydown', handler);
    
    return () => {
      element.removeEventListener('keydown', handler);
    };
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AccessibilityUtils };
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure skip link functionality if present
    const skipLink = document.querySelector('.skip-link, [href="#main-content"]');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href') || '#main-content');
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  });

  // Add role="region" to sections that have an accessible name (aria-label or aria-labelledby)
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    if (!section.getAttribute('role')) {
      const hasAccessibleName =
        section.getAttribute('aria-label') ||
        section.getAttribute('aria-labelledby');
      if (hasAccessibleName) {
        section.setAttribute('role', 'region');
      }
    }
  });
}

function renderDependencyGraph() {
  // Find the dependencyGraph container element
  const dependencyGraph = document.getElementById('dependencyGraph') ||
                          document.querySelector('[data-testid="dependency-graph"]') ||
                          document.querySelector('.dependency-graph');

  if (dependencyGraph) {
    // Ensure it has a proper ARIA role
    if (!dependencyGraph.getAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }

    // Add accessible name if not present
    if (!dependencyGraph.getAttribute('aria-label') &&
        !dependencyGraph.getAttribute('aria-labelledby')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
    }
  }
}

function checkTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.getAttribute('role') || table.getAttribute('role') !== 'table') {
      table.setAttribute('role', 'table');
    }
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      if (!row.getAttribute('role') || row.getAttribute('role') !== 'row') {
        row.setAttribute('role', 'row');
      }
    });
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      if (!header.getAttribute('role') || header.getAttribute('role') !== 'columnheader') {
        header.setAttribute('role', 'columnheader');
      }
    });
    const dataCells = table.querySelectorAll('td');
    dataCells.forEach(cell => {
      if (!cell.getAttribute('role') || cell.getAttribute('role') !== 'cell') {
        cell.setAttribute('role', 'cell');
      }
    });
  });
}

// TODO: Implement this function for checking landmark elements
function checkLandmarkElements() {
  const results = [];
  const landmarkRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  
  // Mapping of semantic HTML tags to their landmark roles
  const semanticToLandmark = {
    'main': 'main',
    'nav': 'navigation',
    'search': 'search',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'form': 'form',
    'section': 'region'
  };

  return results;
}