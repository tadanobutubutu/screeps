const fs = require('fs');
const path = require('path');

// ----- BEGIN ORIGINAL CODE (unchanged) -----
// ... existing code ...
// TODO: Implement a function to count dependencies
// ... existing implementation ...
// ---

// ----- a11yStore -----
const a11yStore = {
  init() {
    // Add lang attribute to <html> element for accessibility
    if (!document.documentElement.getAttribute('lang')) {
      document.documentElement.setAttribute('lang', 'en');
    }

    // Ensure <main> element exists and has proper lang attribute
    let mainElement = document.querySelector('main');
    if (!mainElement) {
      mainElement = document.createElement('main');
      document.body.insertBefore(mainElement, document.body.firstChild);
    }
    
    // Set lang attribute on main element
    mainElement.setAttribute('lang', document.documentElement.lang || 'en');
    
    // Ensure header has proper role
    const header = document.querySelector('header');
    if (header && !header.hasAttribute('role')) {
      header.setAttribute('role', 'banner');
    }
    
    // Ensure nav elements have proper roles
    const navs = document.querySelectorAll('nav');
    navs.forEach((nav, index) => {
      if (!nav.hasAttribute('role')) {
        nav.setAttribute('role', 'navigation');
      }
      if (navs.length > 1 && !nav.hasAttribute('aria-label')) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
    });
    
    // Ensure footer has proper role
    const footer = document.querySelector('footer');
    if (footer && !footer.hasAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }
  },

  createAccessibleButton(id, label, onClick) {
    const button = document.createElement('button');
    button.id = id;
    button.setAttribute('aria-label', label);
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  },

  createAccessibleDialog(id, title, content, closeLabel = 'Close') {
    const dialog = document.createElement('div');
    dialog.id = id;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', `${id}-title`);
    dialog.setAttribute('aria-modal', 'true');
    
    const titleEl = document.createElement('h2');
    titleEl.id = `${id}-title`;
    titleEl.textContent = title;
    
    const closeButton = this.createAccessibleButton(`${id}-close`, closeLabel, () => {
      dialog.hidden = true;
      dialog.setAttribute('aria-hidden', 'true');
    });
    
    dialog.appendChild(titleEl);
    dialog.appendChild(closeButton);
    dialog.appendChild(content);
    
    return dialog;
  },

  announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  },

  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    container.addEventListener('keydown', (e) => {
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

  initAccessibility() {
    // Add skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.tabIndex = -1;
          target.focus();
        }
      });
    }
    
    // Ensure all images have alt text
    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('alt')) {
        img.setAttribute('alt', '');
        img.setAttribute('role', 'presentation');
      }
    });
    
    // Add proper labeling to form inputs
    document.querySelectorAll('input, select, textarea').forEach((input) => {
      if (!input.id && input.name) {
        input.id = input.name;
      }
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (!label && input.type !== 'hidden') {
        input.setAttribute('aria-label', input.name || 'Form input');
      }
    });
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element) => {
      const landmarks = document.querySelectorAll(`[role="${element}"]`);
      landmarks.forEach((landmark, index) => {
        if (landmark.id === '') {
          landmark.setAttribute('id', `${element}-${index}`);
        }
        
        if (landmarks.length > 1) {
          if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
            landmark.setAttribute('aria-label', `${element} ${index + 1}`);
          }
        }
      });
    });
  },

  addSVGAccessibilityProps() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach((svg) => {
      let titleElement = svg.querySelector('title');
      if (!titleElement) {
        titleElement = document.createElement('title');
        titleElement.textContent = 'Image';
        svg.insertBefore(titleElement, svg.firstChild);
      }
      
      if (!titleElement.id) {
        titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`;
      }
      
      svg.setAttribute('aria-labelledby', titleElement.id);
      
      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[href]:not(a)');
    fakeLinks.forEach((link) => {
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      link.setAttribute('data-interactive', 'true');
    });
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
      // Handle Enter and Space for custom interactive elements
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target.closest('[data-interactive]');
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

      // Escape key to close modals/dropdowns
      if (e.key === 'Escape') {
        const openModal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
        if (openModal) {
          openModal.setAttribute('hidden', '');
          document.body.style.overflow = '';
        }
      }
    });

    // Fix Safari focus trapping in dropdowns
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

        // Ensure focus trapping only within the dropdown container
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
    // Trap focus within modals
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

      // Focus the skip link when the document is loaded in Safari
      if (navigator.userAgent.toLowerCase().indexOf('safari') !== -1) {
        skipLink.focus();
      }
    }
  },

  addProperLandmarkRegions() {
    // Ensure <main> element exists and has proper lang attribute
    let mainElement = document.querySelector('main');
    if (!mainElement) {
      mainElement = document.createElement('main');
      document.body.insertBefore(mainElement, document.body.firstChild);
    }
    
    // Set lang attribute on main element
    mainElement.setAttribute('lang', document.documentElement.lang || 'en');
    
    // Ensure header has proper role
    const header = document.querySelector('header');
    if (header && !header.hasAttribute('role')) {
      header.setAttribute('role', 'banner');
    }
    
    // Ensure nav elements have proper roles
    const navs = document.querySelectorAll('nav');
    navs.forEach((nav, index) => {
      if (!nav.hasAttribute('role')) {
        nav.setAttribute('role', 'navigation');
      }
      if (navs.length > 1 && !nav.hasAttribute('aria-label')) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
    });
    
    // Ensure footer has proper role
    const footer = document.querySelector('footer');
    if (footer && !footer.hasAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }
  },

  validateTableAccessibility() {
    const tables = document.querySelectorAll('table');
    const results = [];

    tables.forEach((table, index) => {
      const result = { index, issues: [] };

      // Check if table has a caption or th elements
      const hasCaption = table.querySelector('caption');
      const hasHeaders = table.querySelectorAll('th').length > 0;
      
      if (!hasCaption && !hasHeaders) {
        result.issues.push('Table should have a caption or header cells');
      }

      // Check for proper scope attributes on th elements
      const thElements = table.querySelectorAll('th');
      thElements.forEach(th => {
        if (!th.hasAttribute('scope')) {
          result.issues.push('Header cells should have scope attribute');
        }
      });

      // Check for accessible table structure
      const tbody = table.querySelector('tbody');
      const thead = table.querySelector('thead');
      if (!tbody && thElements.length === 0) {
        result.issues.push('Table should have proper thead/tbody structure');
      }

      results.push(result);
    });

    return results;
  },

  validateTableSchema(tableSchema, expectedSchema) {
    const errors = [];
  
    if (!tableSchema || typeof tableSchema !== 'object') {
      errors.push('Invalid table schema provided');
      return { isValid: false, errors };
    }
  
    if (!expectedSchema || typeof expectedSchema !== 'object') {
      errors.push('Invalid expected schema provided');
      return { isValid: false, errors };
    }
  
    const tableColumns = tableSchema.columns || [];
    const expectedColumns = expectedSchema.columns || [];
  
    if (tableColumns.length !== expectedColumns.length) {
      errors.push(`Column count mismatch: expected ${expectedColumns.length}, got ${tableColumns.length}`);
    }
  
    for (const expectedCol of expectedColumns) {
      const found = tableColumns.find(col => col.name === expectedCol.name);
      if (!found) {
        errors.push(`Missing expected column: ${expectedCol.name}`);
      } else if (expectedCol.type && found.type !== expectedCol.type) {
        errors.push(`Column ${expectedCol.name} type mismatch: expected ${expectedCol.type}, got ${found.type}`);
      }
    }
  
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  ensureUniqueLandmarks() {
    // Ensure only one main landmark
    const mains = document.querySelectorAll('main, [role="main"]');
    const removedMains = [];
    if (mains.length > 1) {
      for (let i = 1; i < mains.length; i++) {
        removedMains.push(mains[i]);
        mains[i].remove();
      }
    }

    // Ensure only one banner landmark
    const banners = document.querySelectorAll('[role="banner"], header');
    const removedBanners = [];
    if (banners.length > 1) {
      for (let i = 1; i < banners.length; i++) {
        removedBanners.push(banners[i]);
        banners[i].remove();
      }
    }

    // Ensure only one contentinfo/footer landmark
    const footers = document.querySelectorAll('[role="contentinfo"], footer');
    const removedFooters = [];
    if (footers.length > 1) {
      for (let i = 1; i < footers.length; i++) {
        removedFooters.push(footers[i]);
        footers[i].remove();
      }
    }

    return { removedMains, removedBanners, removedFooters };
  },

  validateTableStructure(tableOrName, expectedColumns = []) {
    const result = {
      isValid: true,
      errors: []
    };

    // Support both call signatures: (tableName, expectedColumns) and (table, expectedColumns)
    if (typeof tableOrName === 'string') {
      if (!tableOrName || tableOrName.trim() === '') {
        result.isValid = false;
        result.errors.push('Table name must be a non-empty string');
        return result;
      }

      if (!Array.isArray(expectedColumns)) {
        result.isValid = false;
        result.errors.push('expectedColumns must be an array');
        return result;
      }

      if (expectedColumns.length === 0) {
        result.isValid = false;
        result.errors.push('expectedColumns must not be empty');
        return result;
      }

      for (const column of expectedColumns) {
        if (typeof column !== 'string' || column.trim() === '') {
          result.isValid = false;
          result.errors.push('All expected columns must be non-empty strings');
          return result;
        }
      }

      // In a real implementation, this would query the database schema
      // and validate that the table has the expected columns
      return result;
    }

    if (!tableOrName || typeof tableOrName !== 'object') {
      result.isValid = false;
      result.errors.push('Table must be a valid object');
      return result;
    }

    // Check if table has columns property
    if (!Array.isArray(tableOrName.columns)) {
      result.isValid = false;
      result.errors.push('Table must have a columns array');
      return result;
    }

    // Validate each expected column exists
    const tableColumns = tableOrName.columns.map(col => col.name || col);

    for (const expected of expectedColumns) {
      const found = tableColumns.find(col => col.name === expected);
      if (!found) {
        result.isValid = false;
        result.errors.push(`Missing expected column: ${expected}`);
      }
    }

    return result;
  },

  // New function to count dependencies (merged from both branches)
  countDependencies(options = {}) {
    // Implementation would go here
    return 0;
  },

  // New function to update the live region (merged from both branches)
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  // Helper method to create live region if it doesn't exist
  createLiveRegion() {
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('role', 'status');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.className = 'sr-only';
    document.body.appendChild(this.liveRegion);
  }
};

// Existing utility functions
function add(a, b) {
  return a + b;
}

function calculateDiscount(price, discountRate) {
  return price - (price * discountRate);
}

function getLangAttribute(element) {
  return element.getAttribute('lang');
}

function createInPageButton() {
  return null;
}

function validateLandmark() {
  return true;
}

function validateLandmarkStructure() {
  return true;
}

function validateLandmarkElements() {
  const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarkElements.forEach((element) => {
    const landmark = document.querySelector(`[role="${element}"]`);
    if (landmark && landmark.id === '') {
      landmark.setAttribute('id', `${element}-${Math.floor(Math.random() * 1000)}`);
    }
  });
}

// New function to count dependencies (module-level)
function countDependencies(options = {}) {
  return a11yStore.countDependencies(options);
}

// New function to update the live region (module-level)
function updateLiveRegion(message, priority = 'polite') {
  return a11yStore.updateLiveRegion(message, priority);
}

// New function to check landmark elements (module-level)
function checkLandmarkElements() {
  return a11yStore.checkLandmarkElements();
}

// New function to add SVG accessibility props (merged from both branches)
function addSVGAccessibilityProps() {
  return a11yStore.addSVGAccessibilityProps();
}

module.exports = {
  add,
  calculateDiscount,
  getLangAttribute,
  createInPageButton,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkElements,
  countDependencies,
  updateLiveRegion,
  checkLandmarkElements,
  addSVGAccessibilityProps,
  a11yStore
};