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
  newFocusTrap: newFocusTrap,

  // Accessibility functions to address new issues
  setHtmlLangAttribute: (lang = 'en') => {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', lang);
    }
  },

  // Function to fix table structure issues
  fixTableStructure: (table) => {
    if (!table) return;

    // Ensure table has proper structure
    const caption = table.querySelector('caption');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    if (!caption) {
      const newCaption = document.createElement('caption');
      newCaption.textContent = 'Table caption';
      table.insertBefore(newCaption, table.firstChild);
    }

    if (!thead) {
      const newThead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        newThead.appendChild(firstRow);
        table.insertBefore(newThead, table.firstChild.nextSibling);
      }
    }

    if (!tbody) {
      const newTbody = document.createElement('tbody');
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        if (!row.parentElement.matches('thead, tfoot')) {
          newTbody.appendChild(row);
        }
      });
      table.appendChild(newTbody);
    }
  },

  // Function to add landmark roles
  addLandmarkRoles: () => {
    const main = document.querySelector('main');
    if (main && !main.hasAttribute('role')) {
      main.setAttribute('role', 'main');
    }

    const nav = document.querySelector('nav');
    if (nav && !nav.hasAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }

    const header = document.querySelector('header');
    if (header && !header.hasAttribute('role')) {
      header.setAttribute('role', 'banner');
    }

    const footer = document.querySelector('footer');
    if (footer && !footer.hasAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }
  },

  // Function to add accessible names to SVGs
  addSvgAccessibleNames: (svg, name) => {
    if (svg && !svg.hasAttribute('aria-label') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = name;
      svg.insertBefore(title, svg.firstChild);
    }
  },

  // Function to ensure unique landmarks
  ensureUniqueLandmarks: () => {
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');
    const landmarkTypes = new Set();

    landmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (landmarkTypes.has(role)) {
        landmark.removeAttribute('role');
      } else {
        landmarkTypes.add(role);
      }
    });
  },

  // Function to fix fake links
  fixFakeLinks: (element) => {
    if (element && element.tagName === 'A' && !element.hasAttribute('href')) {
      element.setAttribute('role', 'button');
      element.setAttribute('tabindex', '0');
    }
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
function newFocusTrap(element) {
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