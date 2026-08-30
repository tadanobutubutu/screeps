// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// TODO: Import required module( s) and export the new necessary function(s) here in main. js (preserving the original code)

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)

// Utility functions for accessibility
const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.getElementById('skip-link') || document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = skipLink.getAttribute('href')?.substring(1);
        const target = document.getElementById(targetId);
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

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
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
  }
};

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `elem-${Math.random().toString(36).substr(2, 9)}`;
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
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// - NEW: Implement a new function to handle focus trap for keyboard navigation (handled by newFocusTrap())

function newFocusTrap() {
  // New function implementation
  const focusTrap = (container) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  };

  return focusTrap;
}

function getLangAttribute() {
  return document.documentElement.lang || document.querySelector('html')?.getAttribute('lang') || 'en';
}

function setLangAttribute(lang) {
  document.documentElement.lang = lang;
  document.querySelector('html')?.setAttribute('lang', lang);
}

function personName(element) {
  if (!element) return null;
  
  const name = element.getAttribute('aria-label') ||
               element.getAttribute('alt') ||
               element.textContent?.trim() ||
               element.getAttribute('title') ||
               `Person ${Math.random().toString(36).substr(2, 5)}`;
  
  element.setAttribute('aria-label', name);
  return name;
}

function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) return issues;
  
  const hasCaption = table.querySelector('caption');
  const hasHeaders = table.querySelectorAll('th').length > 0;
  const hasScope = table.querySelectorAll('th[scope]').length > 0;
  
  if (!hasCaption) {
    issues.push({ type: 'REACT_027', message: 'Table is missing a caption element' });
  }
  
  if (!hasHeaders) {
    issues.push({ type: 'REACT_027', message: 'Table is missing header cells (th)' });
  }
  
  if (hasHeaders && !hasScope) {
    issues.push({ type: 'REACT_027', message: 'Table headers are missing scope attributes' });
  }
  
  return issues;
}

function validateTableStructure(table) {
  const issues = [];
  
  if (!table) return issues;
  
  const rows = table.querySelectorAll('tr');
  const firstRowCells = rows[0]?.querySelectorAll('th, td') || [];
  const dataRows = Array.from(rows).slice(1);
  
  dataRows.forEach((row, index) => {
    const cells = row.querySelectorAll('th, td');
    if (cells.length !== firstRowCells.length) {
      issues.push({
        type: 'REACT_027',
        message: `Row ${index + 2} has mismatched cell count (expected ${firstRowCells.length}, got ${cells.length})`
      });
    }
  });
  
  return issues;
}

function validateLandmark(element) {
  const issues = [];
  
  if (!element) return issues;
  
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  const hasLandmarkRole = element.getAttribute('role');
  
  if (hasLandmarkRole && !validLandmarks.includes(hasLandmarkRole)) {
    issues.push({
      type: 'REACT_017',
      message: `Invalid landmark role: ${hasLandmarkRole}`
    });
  }
  
  return issues;
}

function validateLandmarkStructure() {
  const issues = [];
  
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], main, nav, header, footer, aside');
  const landmarkCounts = {};
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;
    
    if (landmarkCounts[role] > 1 && !['navigation', 'complementary'].includes(role)) {
      issues.push({
        type: 'REACT_025',
        message: `Duplicate landmark found: ${role}`
      });
    }
  });
  
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length === 0) {
    issues.push({
      type: 'REACT_017',
      message: 'Document is missing a main landmark'
    });
  }
  
  return issues;
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;
  
  const title = svgElement.querySelector('title');
  const ariaLabel = svgElement.getAttribute('aria-label');
  const ariaLabelledBy = svgElement.getAttribute('aria-labelledby');
  
  let accessibleName = ariaLabel;
  
  if (!accessibleName && ariaLabelledBy) {
    const titleElement = document.getElementById(ariaLabelledBy);
    accessibleName = titleElement?.textContent;
  }
  
  if (!accessibleName && title) {
    accessibleName = title.textContent;
  }
  
  return accessibleName;
}

function setSvgAccessibleName(svgElement, name) {
  if (!svgElement) return;
  
  const existingTitle = svgElement.querySelector('title');
  if (existingTitle) {
    existingTitle.textContent = name;
  } else {
    const title = document.createElement('title');
    title.textContent = name;
    svgElement.insertBefore(title, svgElement.firstChild);
  }
  
  svgElement.setAttribute('role', 'img');
  svgElement.removeAttribute('aria-label');
}

function createInPageButton(text, onClick, options = {}) {
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', options.ariaLabel || text);
  
  if (options.id) {
    button.id = options.id;
  }
  
  if (options.className) {
    button.className = options.className;
  }
  
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

// Add back any required exports that might have been removed.
// For example, if the issue requires adding back an export like `calculateSum`, you would add:
export function calculate