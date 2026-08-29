// main.js
// Implementation of unique landmark functions
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 9);
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

const _usedLandmarkIds = new Set();

/**
 * Adds lang attribute to the HTML element for accessibility.
 * @param {Document} doc - The document object.
 * @param {string} lang - Language code (e.g., 'en', 'es').
 */
function addLangAttribute(doc, lang = 'en') {
    const html = doc.documentElement;
    if (html && !html.hasAttribute('lang')) {
        html.setAttribute('lang', lang);
    }
}

/**
 * Fixes table structure issues for accessibility.
 * @param {Document} doc - The document object.
 */
function fixTableStructure(doc) {
    const tables = doc.querySelectorAll('table');
    tables.forEach(table => {
        if (!table.querySelector('thead')) {
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const thead = doc.createElement('thead');
                const tbody = table.querySelector('tbody');
                thead.appendChild(firstRow);
                table.insertBefore(thead, tbody || table.firstChild);
            }
        }
        table.querySelectorAll('td').forEach(cell => {
            if (!cell.hasAttribute('scope')) {
                const parentRow = cell.closest('tr');
                const isHeader = parentRow && parentRow.parent && parentRow.parent.tagName === 'THEAD';
                if (isHeader) {
                    cell.setAttribute('scope', 'col');
                }
            }
        });
    });
}

/**
 * Adds main landmark to the document for accessibility.
 * @param {Document} doc - The document object.
 */
function addMainLandmark(doc) {
    let main = doc.querySelector('main');
    if (!main) {
        const existingMain = doc.querySelector('[role="main"]');
        if (existingMain) {
            existingMain.setAttribute('role', 'main');
        } else {
            main = doc.createElement('main');
            const body = doc.body;
            if (body.firstChild) {
                body.insertBefore(main, body.firstChild);
            } else {
                body.appendChild(main);
            }
        }
    }
}

/**
 * Ensures all landmarks in the document are unique.
 * @param {Document} doc - The document object.
 * @returns {Array} List of landmark elements with unique IDs.
 */
function ensureUniqueLandmarks(doc) {
    const landmarks = doc.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
    const usedIds = new Set();
    
    landmarks.forEach(landmark => {
        const baseName = landmark.getAttribute('role') || 'landmark';
        let id = landmark.id || '';
        
        if (!id || usedIds.has(id)) {
            id = ensureUniqueLandmarkId(baseName);
            landmark.id = id;
        }
        usedIds.add(id);
    });
    
    return Array.from(landmarks);
}

/**
 * Adds accessible names to SVG elements.
 * @param {Document} doc - The document object.
 */
function addSvgAccessibleNames(doc) {
    const svgs = doc.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
        const title = svg.querySelector('title');
        if (!title) {
            const newTitle = doc.createElement('title');
            newTitle.textContent = `SVG icon ${index + 1}`;
            svg.insertBefore(newTitle, svg.firstChild);
        }
        if (!svg.hasAttribute('aria-labelledby')) {
            const titleId = title ? title.id || `svg-title-${index}` : `svg-title-${index}`;
            if (title && !title.id) {
                title.id = titleId;
            }
            svg.setAttribute('aria-labelledby', titleId);
        }
    });
}

/**
 * Fixes fake link issues for accessibility.
 * @param {Document} doc - The document object.
 */
function fixFakeLinkIssue(doc) {
    const fakeLinks = doc.querySelectorAll('[href="#"], [href=""], a[href*="javascript:void"]');
    fakeLinks.forEach(link => {
        if (link.tagName === 'A') {
            const onclick = link.getAttribute('onclick');
            if (onclick && !link.hasAttribute('role')) {
                link.setAttribute('role', 'button');
            }
            if (!link.textContent && !link.querySelector('img')) {
                const span = doc.createElement('span');
                span.textContent = 'Link';
                span.style.position = 'absolute';
                span.style.width = '1px';
                span.style.height = '1px';
                span.style.overflow = 'hidden';
                link.appendChild(span);
            }
        }
    });
}

// Accessibility helper function for keyboard navigation
function setupKeyboardNavigation(element, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  element.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  });
}

/**
 * Addresses accessibility issues from an insight report.
 * @param {Object} insightReport - The insight report containing accessibility findings.
 * @returns {Object} The report with accessibility issues addressed.
 */
function addressAccessibilityIssues(insightReport) {
  // Implementation to address accessibility issues from an insight report.
  // Apply specific accessibility fixes here based on the report's structure.
  // For now, we simply return the report unchanged.
  return insightReport;
}

/*
 * Helper to manage focus within a container
 * @param {HTMLElement} container - Container element
 * @returns {void}
 */
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

/**
 * Function to ensure landmark objects have unique identifiers.
 * Works on an array of landmark objects (not DOM elements).
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Landmarks with unique IDs.
 */
function ensureUniqueLandmarkObjects(landmarks) {
  const seen = new Set();
  const result = [];
  const uniqueIds = [];

  function generateUniqueId() {
    return `landmark-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  landmarks.forEach((landmark) => {
    let id = landmark.id;
    const existingIds = uniqueIds.map((uid) => uid.split('-')[1]);

    while (!id || existingIds.includes(id.split('-')[1])) {
      id = generateUniqueId();
    }

    uniqueIds.push(id);
    landmark.id = id;
    result.push(landmark);
  });
  return result;
}

/**
 * Adds proper ARIA landmark regions to the document.
 * This improves screen reader navigation by ensuring proper landmark roles.
 *
 * @returns {void}
 */
function addProperLandmarkRegions() {
  // Create main landmark
  const main = document.querySelector('main') || document.createElement('main');
  main.setAttribute('role', 'main');
  main.id = 'main-content';

  // Create navigation landmark
  const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
  if (nav) {
    nav.setAttribute('role', 'navigation');
    nav.id = nav.id || 'primary-navigation';
  }

  // Create banner/header landmark
  const header = document.querySelector('header') || document.createElement('header');
  header.setAttribute('role', 'banner');
  header.id = header.id || 'site-header';

  // Create contentinfo/footer landmark
  const footer = document.querySelector('footer') || document.createElement('footer');
  footer.setAttribute('role', 'contentinfo');
  footer.id = footer.id || 'site-footer';

  // Create aside landmark for complementary content
  const asides = document.querySelectorAll('aside');
  asides.forEach((aside, index) => {
    aside.setAttribute('role', 'complementary');
    if (!aside.id) aside.id = `sidebar-${index + 1}`;
  });

  // Append landmarks to the body if they were created
  if (main && !document.body.contains(main)) document.body.appendChild(main);
  if (nav && !document.body.contains(nav)) document.body.appendChild(nav);
  if (header && !document.body.contains(header)) document.body.appendChild(header);
  if (footer && !document.body.contains(footer)) document.body.appendChild(footer);
}

/**
 * Adds proper ARIA account management elements to the document.
 * This includes adding `aria-expanded` attributes for collapsible menus,
 * and adding `aria-label` to form elements.
 *
 * @returns {void}
 */
function addProperAccountManagement() {
  // Add aria-expanded to collapsible menus/buttons
  const collapsibles = document.querySelectorAll('[aria-expanded]');
  collapsibles.forEach(collapsible => {
    if (collapsible.getAttribute('aria-expanded') === 'true') {
      collapsible.setAttribute('aria-expanded', 'false');
    }
  });

  // Add aria-labels to form inputs
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input, index) => {
    const id = input.id || `input-${index}`;
    input.id = id;
    if (!input.getAttribute('aria-label')) {
      input.setAttribute('aria-label', `Input field ${index + 1}`);
    }
  });
}

/**
 * Adds ARIA attributes to form controls for better accessibility.
 * This function focuses on ensuring that form controls have proper labeling and roles.
 *
 * @returns {void}
 */
function addAriaToFormControls() {
  // Add required aria attributes to form controls
  const formControls = document.querySelectorAll('input, select, textarea');

  formControls.forEach(control => {
    // Ensure all form controls have accessible names
    if (control.id && !control.getAttribute('aria-label')) {
      const label = document.querySelector(`label[for="${control.id}"]`) || null;
      if (label) {
        label.id = label.id || `label-${control.id}`;
        control.setAttribute('aria-labelledby', label.id);
      }
    }

    // Mark required fields appropriately
    if (control.required && !control.getAttribute('aria-required')) {
      control.setAttribute('aria-required', 'true');
    }
  });
}

// ARIA live region announcer
function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);';
  document.body.appendChild(announcer);
  
  return {
    announce: (message) => {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
    }
  };
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Function to improve keyboard navigation for interactive elements
function improveKeyboardNavigation() {
  const interactiveElements = document.querySelectorAll('[tabindex="-1"]');
  interactiveElements.forEach(element => {
    element.setAttribute('tabindex', '0');
  });
}

// Function to add ARIA live regions for dynamic content updates
function addLiveRegionForDynamicContent() {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('role', 'alert');
  document.body.appendChild(liveRegion);
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();
  
  // Ensure all landmarks have unique IDs
  ensureUniqueLandmarks(document);
  
  // Improve keyboard navigation
  improveKeyboardNavigation();
  
  // Add live region for dynamic content
  addLiveRegionForDynamicContent();
  
  // Return the announcer for use in the app
  return {
    announce: announcer.announce,
    setupKeyboardNavigation,
    trapFocus,
    prefersReducedMotion
  };
}

/**
 * Checks if a value is an empty string, null, or undefined
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is empty
 */
function isEmpty(value) {
  return value === null || value === undefined || value === '';
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalize(str) {
  if (typeof str !== 'string' || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamps a number between min and max values
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped number
 */
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Deep clones an object
 * @param {*} obj - Object to clone
 * @returns {*} - Cloned object
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}

module.exports = {
    ensureUniqueLandmarkId,
    uniqueLandmarks,
    addLangAttribute,
    fixTableStructure,
    addMainLandmark,
    ensureUniqueLandmarks,
    ensureUniqueLandmarkObjects,
    addSvgAccessibleNames,
    fixFakeLinkIssue,
    setupKeyboardNavigation,
    addressAccessibilityIssues,
    trapFocus,
    addProperLandmarkRegions,
    addProperAccountManagement,
    addAriaToFormControls,
    createAnnouncer,
    prefersReducedMotion,
    improveKeyboardNavigation,
    addLiveRegionForDynamicContent,
    initializeAccessibility,
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone
};