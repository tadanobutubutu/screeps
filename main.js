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
  newFocusTrap: (element) => {
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
  },

  // Accessibility functions to address new issues
  addLangAttribute: () => {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
    }
  },

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
        if (row.parentNode !== thead) {
          newTbody.appendChild(row);
        }
      });
      table.appendChild(newTbody);
    }
  },

  addLandmarks: () => {
    const main = document.querySelector('main');
    if (!main) {
      const newMain = document.createElement('main');
      const content = document.querySelector('body > *:not(script):not(style)');
      if (content) {
        newMain.appendChild(content);
        document.body.insertBefore(newMain, document.body.firstChild);
      }
    }

    const header = document.querySelector('header');
    if (!header) {
      const newHeader = document.createElement('header');
      const firstContent = document.querySelector('main > *:first-child');
      if (firstContent) {
        newHeader.appendChild(firstContent);
        document.querySelector('main').insertBefore(newHeader, document.querySelector('main').firstChild);
      }
    }

    const footer = document.querySelector('footer');
    if (!footer) {
      const newFooter = document.createElement('footer');
      const lastContent = document.querySelector('main > *:last-child');
      if (lastContent) {
        newFooter.appendChild(lastContent);
        document.querySelector('main').appendChild(newFooter);
      }
    }
  },

  addSvgAccessibleNames: (svgElements) => {
    svgElements.forEach(svg => {
      if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
        const title = svg.querySelector('title');
        if (title) {
          svg.setAttribute('aria-labelledby', title.id || `svg-title-${Math.random().toString(36).substr(2, 9)}`);
        } else {
          svg.setAttribute('aria-label', 'Graphic');
        }
      }
    });
  },

  ensureUniqueLandmarks: () => {
    const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
    landmarks.forEach(landmark => {
      const elements = document.querySelectorAll(landmark);
      if (elements.length > 1) {
        elements.forEach((el, index) => {
          if (index > 0) {
            el.setAttribute('role', landmark);
          }
        });
      }
    });
  },

  fixFakeLinks: (links) => {
    links.forEach(link => {
      if (!link.hasAttribute('href') || link.getAttribute('href') === '#') {
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
        link.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            link.click();
          }
        });
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