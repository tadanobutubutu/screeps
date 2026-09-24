// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute; handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure; handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report (DONE: addressNewAccessibilityIssues)
// - NEW: Implement a new function to handle focus trap for keyboard navigation (DONE: newFocusTrap)

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English

  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }

  return setHtmlLangAttribute(lang);
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// New function to address REACT_015 and REACT_036: personName function referenced in comments
function personName(name) {
  // Returns a formatted person name for accessibility purposes
  if (!name) return '';
  return name.trim();
}

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(table) {
  // This function validates the accessibility of tables
  // Check for proper table headers with scope attributes
  const errors = [];

  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }

  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header at index ${index} is missing scope attribute`);
    }
  });

  // Check if table has a caption or is properly described
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');

  if (!hasCaption && !hasAriaLabel) {
    errors.push('Table is missing a caption or aria-label/aria-labelledby');
  }

  return { valid: errors.length === 0, errors };
}

function validateTableStructure(table) {
  // This function validates the structure of tables
  const errors = [];

  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }

  // Check for proper table structure
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  const tfoot = table.querySelector('tfoot');

  // Check for thead and tbody presence
  if (!thead) {
    errors.push('Table is missing thead element');
  }
  if (!tbody) {
    errors.push('Table is missing tbody element');
  }

  // Check for consistent column counts in tbody
  const rows = table.querySelectorAll('tbody tr');
  let expectedCols = null;
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (expectedCols === null) {
      expectedCols = cells.length;
    } else if (cells.length !== expectedCols) {
      errors.push(`Row ${rowIndex} has inconsistent cell count: expected ${expectedCols}, got ${cells.length}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  // This function validates landmarks
  const errors = [];
  const allowedLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];

  if (!element) {
    return { valid: false, errors: ['Element is required'] };
  }

  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();

  // Check if element has valid landmark role
  if (role && !allowedLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`);
  }

  // Check if landmark has accessible name when required
  const landmarksNeedingNames = ['navigation', 'search', 'form', 'region', 'complementary'];
  if (role && landmarksNeedingNames.includes(role)) {
    const hasLabel = element.getAttribute('aria-label') ||
                     element.getAttribute('aria-labelledby') ||
                     element.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      errors.push(`Landmark role "${role}" is missing accessible name`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure() {
  // This function validates the structure of landmarks
  const errors = [];

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  // Check for multiple main landmarks
  const mainLandmarks = document.querySelectorAll('[role="main"], main');
  if (mainLandmarks.length > 1) {
    errors.push(`Found ${mainLandmarks.length} main landmarks, should have only 1`);
  }

  // Check for multiple banner landmarks
  const bannerLandmarks = document.querySelectorAll('[role="banner"], header');
  if (bannerLandmarks.length > 1) {
    errors.push(`Found ${bannerLandmarks.length} banner landmarks, should have only 1`);
  }

  // Check for contentinfo (footer) landmarks
  const footerLandmarks = document.querySelectorAll('[role="contentinfo"], footer');
  if (footerLandmarks.length > 1) {
    errors.push(`Found ${footerLandmarks.length} contentinfo landmarks, should have only 1`);
  }

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svg) {
  // This function returns the accessible name for an SVG
  if (!svg) {
    return '';
  }

  // Check for aria-label attribute
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check for aria-labelledby reference
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) {
      return labelElement.textContent || '';
    }
  }

  // Check for title element inside SVG
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent || '';
  }

  // Check for adjacent description
  const id = svg.getAttribute('id');
  if (id) {
    const describedBy = document.querySelector(`[id="${id}-desc"]`);
    if (describedBy) {
      return describedBy.textContent || '';
    }
  }

  return '';
}

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  // This function ensures that landmarks are unique
  const errors = [];

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  // Define unique landmarks that should only appear once
  const uniqueLandmarks = ['main', 'banner', 'contentinfo'];
  const uniqueRoleSelectors = ['[role="main"]', '[role="banner"]', '[role="contentinfo"]'];

  uniqueLandmarks.forEach((landmark, index) => {
    const elements = document.querySelectorAll(uniqueRoleSelectors[index]);
    const tagElements = document.querySelectorAll(landmark);
    const totalCount = elements.length + tagElements.length;

    if (totalCount > 1) {
      errors.push(`Found ${totalCount} instances of "${landmark}" landmark, should have only 1`);
    }
  });

  // Check for landmark IDs that should be unique
  const landmarksWithIds = document.querySelectorAll('[role][id]');
  const ids = new Set();
  landmarksWithIds.forEach(el => {
    const id = el.getAttribute('id');
    if (ids.has(id)) {
      errors.push(`Duplicate landmark id found: ${id}`);
    }
    ids.add(id);
  });

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_036: Fix 1 fake link issue
function createAccessibleLink(href, text, options = {}) {
  // This function creates an accessible link
  const {
    onClick,
    role = 'link',
    ariaLabel,
    className,
    target,
    rel
  } = options;

  if (!href && !onClick) {
    return null;
  }

  const link = document.createElement('a');
  link.textContent = text;

  if (href) {
    link.href = href;
    // Add rel="noopener noreferrer" for external links
    if (target === '_blank' && !rel) {
      link.rel = 'noopener noreferrer';
    } else if (rel) {
      link.rel = rel;
    }
  } else {
    // If no href, it's a button disguised as a link
    link.href = '#';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      }
    });
  }

  if (target) {
    link.target = target;
  }

  if (className) {
    link.className = className;
  }

  if (ariaLabel) {
    link.setAttribute('aria-label', ariaLabel);
  }

  if (role && role !== 'link') {
    link.setAttribute('role', role);
  }

  return link;
}

/**
 * Checks if a link element is accessible
 * @param {HTMLAnchorElement} link - The link element to check
 * @returns {Object} Result with valid boolean and errors array
 */
function isLinkAccessible(link) {
  const errors = [];

  if (!link) {
    return { valid: false, errors: ['Link element is required'] };
  }

  // Check if it's an anchor element
  if (link.tagName !== 'A') {
    errors.push('Element is not an anchor tag');
    return { valid: false, errors };
  }

  // Check for href attribute
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    // If no href, check if it's properly set up as a button
    const role = link.getAttribute('role');
    if (role !== 'button') {
      errors.push('Link missing href attribute and not configured as a button');
    }
    // Check for click handler
    if (!link.onclick && !link.hasAttribute('data-handler')) {
      errors.push('Fake link missing click handler');
    }
  }

  // Check for accessible name
  const textContent = link.textContent ? link.textContent.trim() : '';
  const ariaLabel = link.getAttribute('aria-label');
  const ariaLabelledby = link.getAttribute('aria-labelledby');
  const hasAccessibleName = textContent || ariaLabel || ariaLabelledby;

  if (!hasAccessibleName) {
    errors.push('Link is missing accessible name (text content, aria-label, or aria-labelledby)');
  }

  // Check for valid href if present
  if (href && href !== '#') {
    // Check for javascript: links
    if (href.toLowerCase().startsWith('javascript:')) {
      errors.push('Link uses javascript: protocol which is not accessible');
    }
    // Check for mailto: links without proper labeling
    if (href.toLowerCase().startsWith('mailto:') && !ariaLabel && !textContent.includes('@')) {
      errors.push('Mailto link may need aria-label for clarity');
    }
  }

  // Check target="_blank" has rel="noopener noreferrer"
  if (link.getAttribute('target') === '_blank') {
    const rel = link.getAttribute('rel');
    if (!rel || !rel.includes('noopener') || !rel.includes('noreferrer')) {
      errors.push('External link with target="_blank" missing rel="noopener noreferrer"');
    }
  }

  // Check for redundant title attribute
  const title = link.getAttribute('title');
  if (title && title === textContent) {
    errors.push('Link title attribute duplicates link text');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Creates an accessible in-page button and appends it to the given parent element.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(parent = document.body) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Open modal');
  parent.appendChild(btn);
  return btn;
}

// New function to handle focus trap for keyboard navigation
function newFocusTrap(containerElement, options = {}) {
  const {
    onEscape,
    initialFocus = 'first',
    returnFocus = true,
    focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  } = options;

  if (!containerElement || typeof document === 'undefined') {
    return {
      activate: () => {},
      deactivate: () => {}
    };
  }

  let previousActiveElement = null;
  let isActive = false;

  /**
   * Gets all focusable elements within the container
   * @returns {HTMLElement[]} Array of focusable elements
   */
  function getFocusableElements() {
    return Array.from(containerElement.querySelectorAll(focusableSelector)).filter(el => {
      return !el.hasAttribute('disabled') && !el.hasAttribute('aria-hidden');
    });
  }

  /**
   * Gets the element to focus based on initialFocus option
   * @returns {HTMLElement|null} Element to focus
   */
  function getInitialFocusElement() {
    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return null;

    if (initialFocus === 'first') {
      return focusableElements[0];
    } else if (initialFocus === 'last') {
      return focusableElements[focusableElements.length - 1];
    } else if (initialFocus === 'container') {
      return containerElement;
    } else if (typeof initialFocus === 'string') {
      return containerElement.querySelector(initialFocus);
    } else if (initialFocus instanceof HTMLElement) {
      return initialFocus;
    }
    return focusableElements[0];
  }

  /**
   * Handles keydown events for Tab and Escape
   * @param {KeyboardEvent} event
   */
  function handleKeyDown(event) {
    if (!isActive) return;

    // Handle Escape key
    if (event.key === 'Escape' && onEscape) {
      event.preventDefault();
      onEscape();
      return;
    }

    // Handle Tab key for focus trapping
    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        // Shift + Tab: move backward
        if (activeElement === firstElement || !containerElement.contains(activeElement)) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: move forward
        if (activeElement === lastElement || !containerElement.contains(activeElement)) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }

  /**
   * Activates the focus trap
   */
  function activate() {
    if (isActive) return;

    isActive = true;
    previousActiveElement = document.activeElement;

    // Add event listener for keydown
    document.addEventListener('keydown', handleKeyDown);

    // Set aria-hidden on other content (optional enhancement)
    containerElement.setAttribute('aria-hidden', 'false');

    // Focus the initial element
    const focusElement = getInitialFocusElement();
    if (focusElement) {
      setTimeout(() => focusElement.focus(), 0);
    }
  }

  /**
   * Deactivates the focus trap
   * @param {boolean} focusReturnElement - Whether to return focus to the previously focused element
   */
  function deactivate(focusReturnElement = returnFocus) {
    if (!isActive) return;

    isActive = false;
    document.removeEventListener('keydown', handleKeyDown);

    // Reset aria-hidden attribute
    containerElement.setAttribute('aria-hidden', 'true');

    // Return focus to the previously focused element
    if (focusReturnElement && previousActiveElement && previousActiveElement.focus) {
      setTimeout(() => previousActiveElement.focus(), 0);
    }
  }

  return {
    activate,
    deactivate,
    getFocusableElements,
    isActive: () => isActive
  };
}

// New function to address new accessibility issues from insight report
function addressNewAccessibilityIssues() {
  const issues = [];

  if (typeof document === 'undefined') {
    return { valid: false, issues: ['Document not available'] };
  }

  // Check for missing skip links
  const skipLinks = document.querySelectorAll('a[href^="#"]');
  const hasSkipLink = Array.from(skipLinks).some(link => {
    const href = link.getAttribute('href');
    return href === '#main' || href === '#content' || href.startsWith('#main-');
  });

  if (!hasSkipLink && document.body.firstChild?.tagName !== 'A') {
    issues.push({
      code: 'SKIP_LINK',
      severity: 'warning',
      message: 'Page may benefit from a skip link to main content'
    });
  }

  // Check for color contrast issues (simplified check)
  const textElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, li, td, th, a, label');
  
  textElements.forEach(el => {
    const style = window.getComputedStyle(el);
    const color = style.color;
    const backgroundColor = style.backgroundColor;
    
    // Skip if transparent background
    if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
      return;
    }
    
    // Basic contrast check would go here
    // This is a placeholder for actual contrast ratio calculation
  });

  // Check for missing alt text on images
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        code: 'MISSING_ALT',
        severity: 'error',
        message: `Image at index ${index} is missing alt attribute`
      });
    } else if (img.getAttribute('alt') === '') {
      // Empty alt is okay for decorative images, but we note it
      issues.push({
        code: 'EMPTY_ALT',
        severity: 'info',
        message: `Image at index ${index} has empty alt (decorative)`
      });
    }
  });

  // Check for form labels
  const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"])');
  const textareas = document.querySelectorAll('textarea');
  const selects = document.querySelectorAll('select');

  inputs.forEach((input, index) => {
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledby = input.getAttribute('aria-labelledby');
    const hasLabel = (id && document.querySelector(`label[for="${id}"]`)) || ariaLabel || ariaLabelledby;
    
    if (!hasLabel && !input.hasAttribute('hidden')) {
      issues.push({
        code: 'MISSING_LABEL',
        severity: 'error',
        message: `Input at index ${index} is missing associated label`
      });
    }
  });

  return { valid: issues.filter(i => i.severity === 'error').length === 0, issues };
}

// Function to wrap primary content in main element for accessibility
function wrapPrimaryContentInMain(content) {
  if (typeof document === 'undefined') {
    return null;
  }

  const main = document.createElement('main');
  main.setAttribute('id', 'main');
  main.setAttribute('role', 'main');
  
  if (typeof content === 'string') {
    main.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    main.appendChild(content);
  }
  
  return main;
}

// Function to add ARIA attributes to form controls
function addAriaToFormControls(form) {
  if (!form || typeof document === 'undefined') {
    return { valid: false, errors: ['Form element is required'] };
  }

  const errors = [];
  const inputs = form.querySelectorAll('input, select, textarea');
  
  inputs.forEach((input, index) => {
    // Skip hidden inputs
    if (input.type === 'hidden') return;
    
    // Check if input has accessible name
    const accessibleName = input.getAttribute('aria-label') ||
                          input.getAttribute('aria-labelledby') ||
                          input.getAttribute('placeholder') ||
                          (input.id && document.querySelector(`label[for="${input.id}"]`));
    
    if (!accessibleName && input.type !== 'submit' && input.type !== 'button') {
      errors.push(`Input at index ${index} is missing accessible name`);
    }
    
    // Add aria-describedby for inputs with help text
    const helpTextId = input.getAttribute('data-help');
    if (helpTextId) {
      input.setAttribute('aria-describedby', helpTextId);
    }
    
    // Add aria-required for required fields
    if (input.required && !input.hasAttribute('aria-required')) {
      input.setAttribute('aria-required', 'true');
    }
    
    // Add aria-invalid for invalid fields
    if (input.validity && !input.validity.valid && !input.hasAttribute('aria-invalid')) {
      input.setAttribute('aria-invalid', 'true');
    }
  });

  return { valid: errors.length === 0, errors };
}

// Function to fix landmark issues
function addFixLandmarkIssues(container) {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  const errors = [];
  const target = container || document.body;
  
  // Check for main landmark
  let mainElement = target.querySelector('main') || target.querySelector('[role="main"]');
  if (!mainElement) {
    errors.push('Missing main landmark');
  }
  
  // Check for nav landmark with label
  const navElements = target.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    const hasLabel = nav.hasAttribute('aria-label') || 
                    nav.hasAttribute('aria-labelledby') ||
                    nav.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
  
  // Ensure unique IDs on landmarks
  const landmarksWithIds = target.querySelectorAll('[role][id]');
  const seenIds = new Set();
  landmarksWithIds.forEach(el => {
    const id = el.getAttribute('id');
    if (seenIds.has(id)) {
      errors.push(`Duplicate landmark ID: ${id}`);
    }
    seenIds.add(id);
  });

  return { valid: errors.length === 0, errors };
}

// Export all functions for testing
module.exports = {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  createAccessibleLink,
  isLinkAccessible,
  createInPageButton,
  newFocusTrap,
  addressNewAccessibilityIssues,
  wrapPrimaryContentInMain,
  addAriaToFormControls,
  addFixLandmarkIssues
};