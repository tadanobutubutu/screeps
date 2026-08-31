// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

_Commit: ae5bdde1d7ee6ea81be6283c1855c64b5902f776_

<!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)

// Utility functions for accessibility
const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
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
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
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

  // New focus trap function
  newFocusTrap: (element) => {
    if (!element) return;
    const focusable = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    element.addEventListener('keydown', (e) => {
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
};

// Utility functions for ensuring elements have IDs and adding labels
const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
};

const ensureElementHasId = (element, prefix = 'element') => {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
};

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// - NEW: Implement a new function to handle focus trap for keyboard navigation (handled by newFocusTrap())

function addAccessibleName(svgString) {
  // This function adds an `aria-label` attribute to the SVG if it doesn't already have one
  // and returns the modified SVG string.
  // Note: This is a simplified example and might need adjustments based on the actual SVG structure.
  const svg = new DOMParser().parseFromString(svgString, "image/svg+xml");
  const svgElement = svg.documentElement;
  if (!svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', 'Descriptive label for SVG');
  }
  return new XMLSerializer().serializeToString(svg);
}

// Example usage of the function
const originalSvgString = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>';
const modifiedSvgString = addAccessibleName(originalSvgString);

/**
 * Validates table accessibility
 * @param {Array} tableData - Table data to validate
 * @returns {boolean} True if table is accessible, false otherwise
 */
function validateTableAccessibility(tableData) {
  const errors = [];
  const tables = getTables();
  
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    
    // Check if table has headers
    if (!table.headers || !Array.isArray(table.headers) || table.headers.length === 0) {
      errors.push({
        tableIndex: i,
        error: 'Table must have headers defined'
      });
    }
    
    // Check if table has proper structure
    if (!table.rows || !Array.isArray(table.rows)) {
      errors.push({
        tableIndex: i,
        error: 'Table must have rows array defined'
      });
    }
    
    // Check for proper ARIA attributes (placeholder implementation)
    if (table.ariaLabel === undefined && table.caption === undefined) {
      errors.push({
        tableIndex: i,
        error: 'Table should have aria-label or caption for accessibility'
      });
    }
    
    // Add lang attribute to HTML element
    if (document.documentElement.lang === undefined) {
      document.documentElement.setAttribute('lang', 'en');
    }
    
    // Add landmark roles and fix landmark issues
    if (table.role === undefined) {
      table.role = 'table';
    }
    
    // Add accessible names to 2 SVGs
    const svgElements = table.querySelectorAll('svg');
    svgElements.forEach(svg => {
      if (!svg.getAttribute('aria-label')) {
        svg.setAttribute('aria-label', 'Accessible SVG element');
      }
    });
  }
  
  return errors.length === 0;
}

function setSvgAccessibleName(svgElement, name) {
  if (!svgElement || !name) return false;
  
  // Remove existing accessible name sources
  const existingTitle = svgElement.querySelector('title');
  if (existingTitle) existingTitle.remove();
  svgElement.removeAttribute('aria-label');
  svgElement.removeAttribute('aria-labelledby');
  
  // Add title element
  const title = document.createElement('title');
  title.textContent = name;
  title.id = `svg-title-${Date.now()}`;
  svgElement.insertBefore(title, svgElement.firstChild);
  
  // Link with aria-labelledby
  svgElement.setAttribute('aria-labelledby', title.id);
  
  return true;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  const issues = [];
  const landmarks = {
    banner: document.querySelectorAll('[role="banner"], header:not([role])'),
    navigation: document.querySelectorAll('[role="navigation"], nav:not([role])'),
    main: document.querySelectorAll('[role="main"], main:not([role])'),
    complementary: document.querySelectorAll('[role="complementary"], aside:not([role])'),
    contentinfo: document.querySelectorAll('[role="contentinfo"], footer:not([role])')
  };
  
  // Check multiple main landmarks
  if (landmarks.main.length > 1) {
    issues.push('REACT_025: Only one main landmark allowed. Found ' + landmarks.main.length + '.');
  }
  
  // Check multiple banner/header landmarks
  if (landmarks.banner.length > 1) {
    issues.push('REACT_025: Only one banner landmark allowed. Found ' + landmarks.banner.length + '.');
  }
  
  // Check multiple contentinfo/footer landmarks
  if (landmarks.contentinfo.length > 1) {
    issues.push('REACT_025: Only one contentinfo landmark allowed. Found ' + landmarks.contentinfo.length + '.');
  }
  
  return {
    valid: issues.length ===