// GitHub Issue Fix - Commit: 6009dec851a51383188dc071ee4edb6953001d55

// TODO: Add exports for new functions if needed - UPDATED: Added exports below

// Existing utility functions
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

function reverseString(str) {
  return str.split('').reverse().join('');
}

// New functions added
function isEven(num) {
  return num % 2 === 0;
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Accessibility store implementation (from origin/main)
const a11yStore = {
  liveRegion: null,

  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
    this.addSVGAccessibilityProps();
  },

  createLiveRegion() {
    if (this.liveRegion) return;

    const region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.id = 'a11y-live-region';
    document.body.appendChild(region);
    this.liveRegion = region;
  },

  announce(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target.closest('[data-interactive]');
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

      if (e.key === 'Escape') {
        const openModal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
        if (openModal) {
          openModal.setAttribute('hidden', '');
          document.body.style.overflow = '';
        }
      }
    });

    const dropdownContainers = document.querySelectorAll('[data-dropdown]');
    dropdownContainers.forEach((container) => {
      container.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        const currentFocusedElement = document.activeElement;
        let focusIsInsideContainer = false;

        if (
          currentFocusedElement &&
          (currentFocusedElement === container ||
            currentFocusedElement.closest(container))
        ) {
          focusIsInsideContainer = true;
        }

        if (!focusIsInsideContainer) {
          const firstFocusableElement = container.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (firstFocusableElement) {
            firstFocusableElement.focus();
          }
        }
      });
    });
  },

  setupFocusManagement() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    });
  },

  setupSkipLinks() {
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) return;

    const targetId = skipLink.getAttribute('href')?.slice(1);
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        this.announce('Skipped to main content');
      });

      if (navigator.userAgent.toLowerCase().indexOf('safari') !== -1) {
        skipLink.focus();
      }
    }
  },

  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element) => {
      const landmark = document.querySelector(`[role="${element}"]`);
      if (landmark && landmark.id === '') {
        landmark.setAttribute('id', `${element}-${Math.floor(Math.random() * 1000)}`);
      }
    });
  },

  addSVGAccessibilityProps() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach((svg) => {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', 'svg-title');
      const titleText = svg.querySelector('title').textContent || 'Image description';
      const descriptionId = `svg-description-${Math.floor(Math.random() * 1000)}`;
      svg.setAttribute('aria-describedby', descriptionId);

      const descriptionElement = document.createElement('p');
      descriptionElement.setAttribute('id', descriptionId);
      descriptionElement.textContent = titleText;
      descriptionElement.className = 'sr-only';
      document.body.appendChild(descriptionElement);
    });
  },

  preserveExistingCode() {
    // TODO: This is the existing code that needs to be preserved
    // (This comment remains as-is)
    // _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
    // <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
    // _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
    // <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
    // _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
    // <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
  }
};

// Function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  report.forEach(issue => {
    switch (issue.type) {
      case 'missing-lang':
        if (!document.documentElement.getAttribute('lang')) {
          document.documentElement.setAttribute('lang', 'en');
        }
        break;
      case 'missing-skip-link':
        if (!document.querySelector('.skip-link')) {
          const skipLink = document.createElement('a');
          skipLink.className = 'skip-link';
          skipLink.href = '#main-content';
          skipLink.textContent = 'Skip to main content';
          document.body.insertBefore(skipLink, document.body.firstChild);
        }
        break;
      case 'missing-alt':
        document.querySelectorAll('img').forEach(img => {
          if (!img.getAttribute('alt')) {
            img.setAttribute('alt', 'Image description');
          }
        });
        break;
      case 'missing-label':
        document.querySelectorAll('input, select, textarea').forEach(el => {
          if (!el.getAttribute('aria-label') && !el.getAttribute('id')) {
            el.setAttribute('aria-label', 'Form field');
          }
        });
        break;
    }
  });
}

// REACT_015: Add lang attribute
if (!document.documentElement.getAttribute('lang')) {
  document.documentElement.setAttribute('lang', 'en');
}

// New functions for accessibility issues from insight report

// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return document.documentElement.getAttribute('lang') || 'en';
}

function createInPageButton(label, targetId) {
  const button = document.createElement('button');
  button.textContent = label;
  button.setAttribute('aria-label', label);
  button.addEventListener('click', () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  });
  return button;
}

// REACT_027: Fix table structure issues
function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table, index) => {
    const caption = table.querySelector('caption');
    if (!caption) {
      const cap = document.createElement('caption');
      cap.textContent = `Table ${index + 1}`;
      table.insertBefore(cap, table.firstChild);
    }

    const thInHeader = table.querySelectorAll('thead th');
    if (thInHeader.length === 0) {
      const firstRow = table.querySelector('tr');
      if (firstRow && firstRow.children.length > 0) {
        Array.from(firstRow.children).forEach(cell => {
          const th = document.createElement('th');
          th.setAttribute('scope', 'col');
          th.textContent = cell.textContent;
          cell.parentNode.replaceChild(th, cell);
        });
      }
    }
  });
}

function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const headerRow = table.querySelector('tr');
      if (headerRow) {
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const rows = Array.from(table.querySelectorAll('tr'));
        
        if (rows.length > 1) {
          thead.appendChild(rows[0]);
          rows.slice(1).forEach(row => {
            tbody.appendChild(row);
          });
          table.appendChild(thead);
          table.appendChild(tbody);
        }
      }
    }
  });
}

// REACT_041: Add accessible names to SVGs
function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') || 
         svg.getAttribute('title') || 
         svg.querySelector('title')?.textContent || 
         'Image description';
}

function setSvgAttributes(svg) {
  svg.setAttribute('role', 'img');
  
  const accessibleName = getSvgAccessibleName(svg);
  svg.setAttribute('aria-label', accessibleName);
  
  const title = svg.querySelector('title');
  const titleId = `svg-title-${Math.floor(Math.random() * 1000)}`;
  
  if (!title) {
    const newTitle = document.createElement('title');
    newTitle.id = titleId;
    newTitle.textContent = accessibleName;
    svg.insertBefore(newTitle, svg.firstChild);
  } else if (!title.id) {
    title.id = titleId;
  }
  
  svg.setAttribute('aria-labelledby', titleId);
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"], main, nav, header, footer, aside');
  const landmarkTypes = {};
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (!landmarkTypes[role]) {
      landmarkTypes[role] = 0;
    }
    landmarkTypes[role]++;
    
    if (landmarkTypes[role] > 1) {
      landmark.setAttribute('aria-label', `${role} ${landmarkTypes[role]}`);
    } else if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
      landmark.setAttribute('aria-label', role);
    }
  });
}

// REACT_036: Fix fake link issues
function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (!link.getAttribute('href')) {
      link.setAttribute('href', '#');
      link.setAttribute('aria-label', link.textContent || 'Link');
    } else if (!link.textContent.trim()) {
      link.setAttribute('aria-label', 'Link');
    }
  });
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('[data-fake-link], .fake-link, [role="link"]');
  fakeLinks.forEach(fakeLink => {
    const text = fakeLink.textContent || fakeLink.getAttribute('aria-label') || 'Link';
    fakeLink.setAttribute('role', 'link');
    fakeLink.setAttribute('tabindex', '0');
    fakeLink.setAttribute('aria-label', text);
    
    fakeLink.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fakeLink.click();
      }
    });
  });
}

// REACT_037: Add proper landmark regions
function addProperLandmarkRegions() {
  // Ensure proper landmark structure
  const mainContent = document.querySelector('main, [role="main"]');
  if (mainContent && !mainContent.id) {
    mainContent.id = 'main-content';
  }
  
  const navigation = document.querySelector('nav, [role="navigation"]');
  if (navigation && !navigation.id) {
    navigation.id = 'navigation';
  }
  
  const banner = document.querySelector('header, [role="banner"]');
  if (banner && !banner.id) {
    banner.id = 'banner';
  }
  
  const contentInfo = document.querySelector('footer, [role="contentinfo"]');
  if (contentInfo && !contentInfo.id) {
    contentInfo.id = 'contentinfo';
  }
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
  validateTableAccessibility();
  validateTableStructure();
  document.querySelectorAll('svg').forEach(setSvgAttributes);
  ensureUniqueLandmarks();
  validateLinkAccessibility();
  handleFakeLinks();
  addProperLandmarkRegions();
});

// CommonJS exports (preserved from HEAD)
module.exports = {
  add,
  subtract,
  multiply,
  divide,
  reverseString,
  isEven,
  capitalizeFirst,
  a11yStore,
  addressAccessibilityIssues,
  updateLiveRegion: a11yStore.updateLiveRegion,
  checkLandmarkElements: a11yStore.checkLandmarkElements,
  addSVGAccessibilityProps: a11yStore.addSVGAccessibilityProps,
  preserveExistingCode: a11yStore.preserveExistingCode,
  prefersReducedMotion: a11yStore.prefersReducedMotion,
  prefersHighContrast: a11yStore.prefersHighContrast,
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions
};

// ES6 module exports (preserved from origin/main)
export { a11yStore };
export { addressAccessibilityIssues };
export { updateLiveRegion };
export { checkLandmarkElements };
export { addSVGAccessibilityProps };
export { preserveExistingCode };
export { prefersReducedMotion };
export { prefersHighContrast };
export { getLangAttribute };
export { createInPageButton };
export { validateTableAccessibility };
export { validateTableStructure };
export { getSvgAccessibleName };
export { setSvgAttributes };
export { ensureUniqueLandmarks };
export { validateLinkAccessibility };
export { handleFakeLinks };
export { addProperLandmarkRegions };
export default a11yStore;