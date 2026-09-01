const accessibilityUtils = {
  // Utility functions for accessibility
  initSkipLink: () => {
    const skipLink = document.querySelector('#skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = skipLink.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  },

  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
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

  handleKeyboardNav: (e, handlers) => {
    const key = e.key;
    if (handlers[key]) {
      handlers[key](e);
    }
  },

  // New function for addressing accessibility issues from insight report
  newFocusTrap: newFocusTrap(),

  // Accessibility functions to address new issues
  getLangAttribute: () => {
    const html = document.documentElement;
    if (!html.hasAttribute('lang')) {
      html.setAttribute('lang', 'en');
    }
    return html.getAttribute('lang');
  },

  getFullLangAttribute: () => {
    const lang = accessibilityUtils.getLangAttribute();
    return lang.includes('-') ? lang : `${lang}-US`;
  },

  validateTableAccessibility: (table) => {
    if (!table) return false;

    // Check for proper table structure
    const hasCaption = table.querySelector('caption') !== null;
    const hasThead = table.querySelector('thead') !== null;
    const hasTbody = table.querySelector('tbody') !== null;
    const hasTh = table.querySelector('th') !== null;

    // Check for scope attributes on th elements
    const thElements = table.querySelectorAll('th');
    let hasScope = true;
    thElements.forEach(th => {
      if (!th.hasAttribute('scope')) {
        hasScope = false;
      }
    });

    return hasCaption && hasThead && hasTbody && hasTh && hasScope;
  },

  validateTableStructure: (table) => {
    if (!table) return false;

    // Ensure table has proper structure
    const rows = table.querySelectorAll('tr');
    if (rows.length === 0) return false;

    // Check each row has consistent number of cells
    const cellCount = rows[0].cells.length;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i].cells.length !== cellCount) {
        return false;
      }
    }

    return true;
  },

  validateLandmark: (element, landmarkType) => {
    if (!element) return false;

    const validLandmarks = ['main', 'nav', 'header', 'footer', 'aside', 'section'];
    if (!validLandmarks.includes(landmarkType)) return false;

    // Check if element has proper role
    if (element.getAttribute('role') !== landmarkType) {
      element.setAttribute('role', landmarkType);
    }

    // Ensure landmark has proper label
    if (!element.hasAttribute('aria-label') && !element.querySelector('h1, h2, h3, h4, h5, h6')) {
      element.setAttribute('aria-label', `${landmarkType} content`);
    }

    return true;
  },

  validateLandmarkStructure: () => {
    const landmarks = document.querySelectorAll('[role="main"], [role="nav"], [role="header"], [role="footer"], [role="aside"], [role="section"]');
    let isValid = true;

    landmarks.forEach(landmark => {
      if (!landmark.hasAttribute('aria-label') && !landmark.querySelector('h1, h2, h3, h4, h5, h6')) {
        isValid = false;
      }
    });

    return isValid;
  },

  ensureUniqueLandmarks: () => {
    const landmarks = document.querySelectorAll('[role="main"], [role="nav"], [role="header"], [role="footer"], [role="aside"], [role="section"]');
    const landmarkCounts = {};

    landmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;
    });

    // Ensure only one main landmark exists
    if (landmarkCounts['main'] > 1) {
      const mains = document.querySelectorAll('[role="main"]');
      for (let i = 1; i < mains.length; i++) {
        mains[i].setAttribute('role', 'region');
      }
    }

    // Ensure nav landmarks have proper labels
    if (landmarkCounts['nav'] > 1) {
      const navs = document.querySelectorAll('[role="nav"]');
      navs.forEach((nav, index) => {
        if (!nav.hasAttribute('aria-label')) {
          nav.setAttribute('aria-label', `Navigation ${index + 1}`);
        }
      });
    }
  },

  getSvgAccessibleName: (svg) => {
    if (!svg) return '';

    // Check for title or aria-label
    const title = svg.querySelector('title');
    if (title) return title.textContent;

    if (svg.hasAttribute('aria-label')) {
      return svg.getAttribute('aria-label');
    }

    // Fallback to description if available
    const desc = svg.querySelector('desc');
    if (desc) return desc.textContent;

    return '';
  },

  createInPageButton: (text, onClick) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);

    // Ensure button has proper accessible name
    if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', text);
    }

    return button;
  },

  createAccessibleLink: (text, href, isFakeLink = false) => {
    const link = document.createElement('a');
    link.textContent = text;
    link.href = href;

    // Handle fake links
    if (isFakeLink) {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    }

    return link;
  },

  handleAccessibilityIssues: () => {
    // Handle fake links
    const fakeLinks = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"]');
    fakeLinks.forEach(link => {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    });
  }
};

// Functions already existing in the file to preserve
// ...

const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = 'element-' + Math.random().toString(36).substr(2, 9);
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

// Function for trap focus implementation (merged with newFocusTrap)
function newFunction(element) {
  if (!element) return;
  const focusable = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });
}

// ... (The rest of the file remains unchanged)