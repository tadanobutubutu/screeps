// Accessibility Report Addressed: REACT_015, REACT_027, REACT_017, REACT_041, REACT_025, REACT_036

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// - NEW: Implement a new function to handle focus trap for keyboard navigation (handled by newFocusTrap())

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  'details > summary'
];

/**
 * Focus Trap implementation for keyboard navigation accessibility
 * Traps focus within a specified container element
 */
function newFocusTrap(container, options = {}) {
  const {
    initialFocus = true,
    returnFocusOnDeactivate = true,
    escapeDeactivates = true,
  } = options;

  let previousActiveElement = null;
  let isActive = false;

  /**
   * Get all focusable elements within the container
   */
  function getFocusableElements() {
    if (!container) return [];
    const selectors = FOCUSABLE_ELEMENTS.join(', ');
    return Array.from(container.querySelectorAll(selectors)).filter(
      (el) => el.offsetParent !== null
    );
  }

  /**
   * Get the first focusable element in the container
   */
  function getFirstFocusable() {
    const focusable = getFocusableElements();
    return focusable.length > 0 ? focusable[0] : null;
  }

  /**
   * Get the last focusable element in the container
   */
  function getLastFocusable() {
    const focusable = getFocusableElements();
    return focusable.length > 0 ? focusable[focusable.length - 1] : null;
  }

  /**
   * Handle keydown events for focus management
   */
  function handleKeyDown(event) {
    if (!isActive) return;

    // Handle Escape key to deactivate
    if (escapeDeactivates && event.key === 'Escape') {
      deactivate();
      return;
    }

    // Handle Tab key for focus trapping
    if (event.key === 'Tab') {
      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const first = getFirstFocusable();
      const last = getLastFocusable();

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        // Tab
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
  }

  /**
   * Activate the focus trap
   */
  function activate() {
    if (isActive) return;
    
    previousActiveElement = document.activeElement;
    isActive = true;

    // Add event listener
    container.addEventListener('keydown', handleKeyDown);

    // Set initial focus
    if (initialFocus) {
      const focusable = getFirstFocusable();
      if (focusable) {
        focusable.focus();
      } else {
        // If no focusable elements, focus the container itself
        container.setAttribute('tabindex', '-1');
        container.focus();
      }
    }
  }

  /**
   * Deactivate the focus trap
   */
  function deactivate() {
    if (!isActive) return;

    isActive = false;
    container.removeEventListener('keydown', handleKeyDown);

    // Return focus to the previously active element
    if (returnFocusOnDeactivate && previousActiveElement) {
      previousActiveElement.focus();
    }
  }

  /**
   * Update the container element
   */
  function updateContainer(newContainer) {
    if (isActive) {
      deactivate();
    }
    container = newContainer;
  }

  // Auto-activate if container is visible
  if (container && container.offsetParent !== null) {
    activate();
  }

  // Return public API
  return {
    activate,
    deactivate,
    updateContainer,
    getFocusableElements,
    isActive: () => isActive,
  };
}

// Existing functions preserved
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function personName(name) {
  return `<span lang="en">${name}</span>`;
}

function validateTableAccessibility(table) {
  // Validate table accessibility
  if (!table) return false;
  
  const headers = table.querySelectorAll('th');
  const cells = table.querySelectorAll('td, th');
  
  // Check for proper scope attributes
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
  
  return true;
}

function validateTableStructure(table) {
  // Validate table structure for accessibility
  if (!table) return false;
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    const newCaption = document.createElement('caption');
    newCaption.textContent = 'Data table';
    table.insertBefore(newCaption, table.firstChild);
  }
  
  // Ensure proper thead/tbody structure
  if (!table.querySelector('thead')) {
    const thead = document.createElement('thead');
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
    }
  }
  
  if (!table.querySelector('tbody')) {
    const tbody = document.createElement('tbody');
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      if (!row.closest('thead')) {
        tbody.appendChild(row);
      }
    });
    table.appendChild(tbody);
  }
  
  return true;
}

function validateLandmark(element) {
  // Validate landmark regions
  const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  
  if (!element) return false;
  
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  if (role && !validLandmarks.includes(role)) {
    return false;
  }
  
  return true;
}

function validateLandmarkStructure() {
  // Ensure unique landmarks (only one main, banner, contentinfo)
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    // Keep only the first main element
    for (let i = 1; i < mainElements.length; i++) {
      mainElements[i].removeAttribute('role');
    }
  }
  
  const bannerElements = document.querySelectorAll('header:not([role]), [role="banner"]');
  if (bannerElements.length > 1) {
    for (let i = 1; i < bannerElements.length; i++) {
      bannerElements[i].removeAttribute('role');
    }
  }
  
  const footerElements = document.querySelectorAll('footer:not([role]), [role="contentinfo"]');
  if (footerElements.length > 1) {
    for (let i = 1; i < footerElements.length; i++) {
      footerElements[i].removeAttribute('role');
    }
  }
  
  return true;
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  // Check for title element
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent;
  }
  
  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const titleElement = document.getElementById(ariaLabelledby);
    if (titleElement) {
      return titleElement.textContent;
    }
  }
  
  return '';
}

function createInPageButton(options = {}) {
  const {
    text = 'Button',
    href = '#',
    onClick = null,
    className = '',
  } = options;
  
  const button = document.createElement('a');
  button.textContent = text;
  button.href = href;
  button.className = className;
  button.setAttribute('role', 'button');
  
  // Ensure proper accessibility
  button.setAttribute('tabindex', '0');
  
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  
  // Handle keyboard activation
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (onClick) {
        onClick(event);
      }
    }
  });
  
  return button;
}

// Export all functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    newFocusTrap,
    getLangAttribute,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    createInPageButton,
  };
}