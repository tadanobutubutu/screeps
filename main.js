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
  addLangAttribute: () => {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
    }
  },

  fixTableStructure: (tables) => {
    tables.forEach(table => {
      if (!table.querySelector('thead') || !table.querySelector('tbody')) {
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const firstRow = table.querySelector('tr');

        if (firstRow) {
          thead.appendChild(firstRow);
          table.insertBefore(thead, table.firstChild);
          table.appendChild(tbody);
          // Move remaining rows to tbody
          const rows = table.querySelectorAll('tr');
          rows.forEach(row => {
            if (row !== firstRow) {
              tbody.appendChild(row);
            }
          });
        }
      }
    });
  },

  addLandmarks: () => {
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

  addSvgAccessibility: (svgs) => {
    svgs.forEach(svg => {
      if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-hidden')) {
        svg.setAttribute('aria-hidden', 'true');
      }
    });
  },

  ensureUniqueLandmarks: () => {
    const landmarks = ['main', 'nav', 'header', 'footer'];
    landmarks.forEach(landmark => {
      const elements = document.querySelectorAll(`[role="${landmark}"]`);
      if (elements.length > 1) {
        elements.forEach((el, index) => {
          if (index > 0) {
            el.removeAttribute('role');
          }
        });
      }
    });
  },

  fixFakeLinks: (links) => {
    links.forEach(link => {
      if (link.getAttribute('href') === '#' || !link.getAttribute('href')) {
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
      }
    });
  },

  // Function to validate all accessibility fixes
  validateAccessibilityReport: () => {
    // REACT_015: Check lang attribute
    const htmlElement = document.querySelector('html');
    if (!htmlElement || !htmlElement.hasAttribute('lang')) {
      console.warn('REACT_015: Missing lang attribute on HTML element');
    }

    // REACT_027: Check table structure
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      if (!table.querySelector('thead') || !table.querySelector('tbody')) {
        console.warn('REACT_027: Table missing thead or tbody structure');
      }
    });

    // REACT_017: Check landmarks
    const landmarks = ['main', 'nav', 'header', 'footer'];
    landmarks.forEach(landmark => {
      const elements = document.querySelectorAll(`[role="${landmark}"]`);
      if (elements.length === 0) {
        console.warn(`REACT_017: Missing ${landmark} landmark`);
      }
    });

    // REACT_041: Check SVGs
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
      if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-hidden')) {
        console.warn('REACT_041: SVG missing accessibility attributes');
      }
    });

    // REACT_025: Check unique landmarks
    landmarks.forEach(landmark => {
      const elements = document.querySelectorAll(`[role="${landmark}"]`);
      if (elements.length > 1) {
        console.warn(`REACT_025: Multiple ${landmark} landmarks found`);
      }
    });

    // REACT_036: Check fake links
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      if (link.getAttribute('href') === '#' || !link.getAttribute('href')) {
        console.warn('REACT_036: Fake link found');
      }
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