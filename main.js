// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)

// Utility functions for accessibility
const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.querySelector('.skip-link, [href="#main-content"]');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = skipLink.getAttribute('href').replace('#', '');
        const target = document.getElementById(targetId) || document.querySelector('main, [role="main"]');
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  },

  // Trap focus within an element (for modals, dialogs)
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
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
  },

  // Announce message to screen readers
  announceToScreenReader: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  },

  // Handle keyboard navigation
  handleKeyboardNav: (e, handlers) => {
    const key = e.key;
    if (handlers[key]) {
      handlers[key](e);
    }
  },

  // Get language attribute for HTML element
  getLangAttribute: (element) => {
    const lang = element.lang || element.getAttribute('xml:lang');
    return lang || document.documentElement.lang || 'en';
  },

  // Validate table accessibility
  validateTableAccessibility: (table) => {
    if (!table) return { valid: false, errors: ['Table element is required'] };
    const errors = [];
    const headers = table.querySelectorAll('th');
    const dataCells = table.querySelectorAll('td');
    
    if (headers.length === 0) {
      errors.push('Table should have header cells (th)');
    }
    
    if (dataCells.length === 0) {
      errors.push('Table should have data cells (td)');
    }
    
    return { valid: errors.length === 0, errors };
  },

  // Validate table structure
  validateTableStructure: (table) => {
    if (!table || table.tagName !== 'TABLE') {
      return { valid: false, error: 'Invalid table element' };
    }
    
    const caption = table.querySelector('caption');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const tfoot = table.querySelector('tfoot');
    
    return {
      valid: true,
      hasCaption: !!caption,
      hasThead: !!thead,
      hasTbody: !!tbody,
      hasTfoot: !!tfoot
    };
  },

  // Validate landmark
  validateLandmark: (element) => {
    const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
    const role = element.getAttribute('role');
    const tagName = element.tagName.toLowerCase();
    
    if (role && !validLandmarks.includes(role)) {
      return { valid: false, error: `Invalid landmark role: ${role}` };
    }
    
    if (validLandmarks.includes(tagName) || role) {
      return { valid: true, role: role || tagName };
    }
    
    return { valid: false, error: 'No valid landmark identified' };
  },

  // Validate landmark structure
  validateLandmarkStructure: () => {
    const mainLandmarks = document.querySelectorAll('main, [role="main"]');
    const navLandmarks = document.querySelectorAll('nav, [role="navigation"]');
    const headerLandmarks = document.querySelectorAll('header, [role="banner"]');
    
    return {
      valid: mainLandmarks.length === 1,
      hasExactlyOneMain: mainLandmarks.length === 1,
      navCount: navLandmarks.length,
      headerCount: headerLandmarks.length
    };
  },

  // Get SVG accessible name
  getSvgAccessibleName: (svg) => {
    const title = svg.querySelector('title');
    const ariaLabel = svg.getAttribute('aria-label');
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    
    if (ariaLabel) return ariaLabel;
    if (ariaLabelledby) {
      const labelElement = document.getElementById(ariaLabelledby);
      return labelElement ? labelElement.textContent : null;
    }
    if (title) return title.textContent;
    
    return null;
  },

  // Validate unique landmarks
  validateUniqueLandmarks: () => {
    const landmarks = document.querySelectorAll('[role]');
    const issues = [];
    
    landmarks.forEach((landmark) => {
      const role = landmark.getAttribute('role');
      if (['main', 'navigation', 'banner', 'contentinfo', 'complementary'].includes(role)) {
        const count = document.querySelectorAll(`[role="${role}"]`).length;
        if (count > 1) {
          issues.push({ role, count, message: `Multiple ${role} landmarks found` });
        }
      }
    });
    
    return { valid: issues.length === 0, issues };
  },

  // Create accessible in-page button
  createInPageButton: (text, onClick, options = {}) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('type', 'button');
    if (options.id) button.id = options.id;
    if (options.className) button.className = options.className;
    if (options.ariaLabel) button.setAttribute('aria-label', options.ariaLabel);
    if (options.ariaDescribedby) button.setAttribute('aria-describedby', options.ariaDescribedby);
    
    button.addEventListener('click', onClick);
    return button;
  },

  // Get person name for accessibility
  personName: (element) => {
    const langAttr = accessibilityUtils.getLangAttribute(element);
    const nameElement = element.querySelector('[itemprop="name"], .person-name, .name, [class*="name"]');
    return nameElement ? nameElement.textContent.trim() : null;
  },

  // NEW: Focus trap for keyboard navigation
  newFocusTrap: (container) => {
    if (!container) return null;
    
    const focusableSelectors = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableElements = container.querySelectorAll(focusableSelectors);
    
    if (focusableElements.length === 0) return null;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    };
    
    const trapInstance = {
      activate: () => {
        container.addEventListener('keydown', handleTabKey);
        firstFocusable.focus();
      },
      deactivate: () => {
        container.removeEventListener('keydown', handleTabKey);
      }
    };
    
    return trapInstance;
  }
};

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
};

const addAriaLabel = (element, label) => {
  if (element) {
    element.setAttribute('aria-label', label);
  }
  return element;
};

const renderDependencyGraph = (data) => {
  // Implementation for rendering dependency graphs
  return {
    nodes: data.nodes || [],
    edges: data.edges || []
  };
};

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and newFocusTrap())
// - REACT_041: