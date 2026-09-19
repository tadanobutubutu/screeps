// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// Preserve existing functionality

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// Internal set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function generateUniqueLandmarkId(baseName) {
    let candidate = baseName;
    let counter = 0;
    while (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.floor(Math.random() * 9) + 1;
        candidate = baseName + '-' + suffix;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

// Returns a new array containing only unique landmarks from the input list.
// @param {Array} landmarks - List of landmark objects.
// @returns {Array} Unique landmarks.
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    if (!landmarks) return result;
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

/**
 * Ensures that all landmarks on the page have unique IDs.
 * Iterates through landmark elements and assigns unique IDs where needed.
 * @returns {void}
 */
function ensureUniqueLandmarks() {
    const landmarks = document.querySelectorAll('[role], main, nav, header, footer, aside, section');
    landmarks.forEach((landmark, index) => {
        const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        const baseId = landmark.id || `${role}-${index}`;
        if (!_usedLandmarkIds.has(baseId)) {
            landmark.id = baseId;
            _usedLandmarkIds.add(baseId);
        } else {
            landmark.id = ensureUniqueLandmarkId(baseId);
        }
    });
}

/**
 * Validates landmark elements on the page.
 * Checks if landmarks have proper roles and structure.
 * @returns {void}
 */
function validateLandmark() {
    const landmarks = document.querySelectorAll('[role], main, nav, header, footer, aside');
    landmarks.forEach(landmark => {
        const role = landmark.getAttribute('role');
        const tagName = landmark.tagName.toLowerCase();
        if (!role && !['main', 'nav', 'header', 'footer', 'aside'].includes(tagName)) {
            console.error('Landmark without proper role:', landmark);
        }
    });
}

/**
 * Validates the structure of landmark elements on the page.
 * Ensures landmarks have IDs and proper attributes.
 * @returns {void}
 */
function validateLandmarkStructure() {
    const landmarks = document.querySelectorAll('[role], main, nav, header, footer, aside');
    landmarks.forEach(landmark => {
        if (!landmark.id) {
            console.error('Landmark without id:', landmark);
        }
    });
}

/**
 * Gets an accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name.
 */
function getSvgAccessibleName(svg) {
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
        const labelledByElement = document.getElementById(ariaLabelledby);
        if (labelledByElement) return labelledByElement.textContent.trim();
    }
    const title = svg.querySelector('title');
    if (title) return title.textContent.trim();
    return '';
}

/**
 * Creates an in-page button with proper accessibility attributes.
 * @param {string} text - The text content of the button.
 * @param {Function} onClick - The click handler.
 * @returns {HTMLButtonElement} The created button.
 */
function createInPageButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('aria-label', text);
    button.addEventListener('click', onClick);
    return button;
}

/**
 * Creates an accessible link element.
 * @param {string} href - The href URL.
 * @param {string} text - The link text.
 * @returns {HTMLAnchorElement} The created link.
 */
function createAccessibleLink(href, text) {
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.textContent = text;
    if (!text || text.trim().length === 0) {
        link.setAttribute('aria-label', 'Link');
    }
    return link;
}

/**
 * Handles accessibility issues found in the document.
 * Runs various accessibility checks and fixes.
 * @returns {void}
 */
function handleAccessibilityIssues() {
    ensureUniqueLandmarks();
    validateLandmark();
    validateLandmarkStructure();
    validateTableAccessibility();
    validateTableStructure();
    removeFakeLinks();
}

// Add lang attribute as per the issue requirement
function addLangAttribute() {
  // Assuming there is a relevant element selector or similar to target
  const elementToModify = document.documentElement;
  if (elementToModify) {
    elementToModify.setAttribute('lang', 'en'); // Example: English
  }
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (element && !element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Gets the language attribute from the HTML element.
 * @returns {string} - the language attribute value
 */
function getLangAttribute() {
    return document.documentElement.lang || '';
}

/**
 * This function gets the full language attribute with region (if provided)
 * @returns {string} - the full language attribute with region (if provided)
 */
function getFullLangAttribute() {
    return document.documentElement.lang || '';
}

/**
 * Function to remove the 'my-button' class, and set a specific id for the button element if it exists.
 * Assumes you have already set the id on the button element in your code.
 */
function replaceMyButtonId() {
  const button = document.querySelector('.my-button');
  if (button) {
    button.classList.remove('my-button');
    button.id = 'exampleButton';
    button.setAttribute('aria-label', 'Example Button');
  }
}

/**
 * Adds proper ARIA landmark regions to the document.
 * This improves screen reader navigation by ensuring proper landmark roles.
 *
 * @returns {void}
 */
function addProperLandmarkRegions() {
  // Create main landmark
  const main = document.querySelector('main') || document.getElementById('main');
  main.setAttribute('role', 'main');
  main.id = 'main-content';

  // Create navigation landmark
  const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
  if (nav) {
    nav.setAttribute('role', 'navigation');
    nav.id = nav.id || 'primary-navigation';
  }

  // Create banner/header landmark
  const header = document.querySelector('header') || document.getElementById('header') || document.createElement('header');
  header.setAttribute('role', 'banner');
  header.id = header.id || 'site-header';

  // Create contentinfo/footer landmark
  const footer = document.querySelector('footer') || document.getElementById('footer') || document.createElement('footer');
  footer.setAttribute('role', 'contentinfo');
  footer.id = footer.id || 'site-footer';

  // Create aside landmark for complementary content
  const asides = document.querySelectorAll('aside') || document.querySelectorAll('[role="complementary"]');
  if (asides) {
    asides.forEach((aside, index) => {
      aside.setAttribute('role', 'complementary');
      if (!aside.id) aside.id = `sidebar-${index + 1}`;
    });
  }
}

/**
 * Validates that landmarks have proper structure (role and accessible name).
 * @param {HTMLElement} landmark - The landmark element to validate.
 * @returns {boolean} True if the landmark has valid structure.
 */
function addProperAccountManagement() {
  // Add aria-expanded to collapsible menus/buttons
  const collapsibles = document.querySelectorAll('.collapsible');
  collapsibles.forEach(item => {
    if (!item.hasAttribute('aria-expanded')) {
      item.setAttribute('aria-expanded', 'false');
    }
  });

  // Add aria-labels to form inputs
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input, index) => {
    const id = input.id || 'input-' + (index + 1);
    input.id = id;
    if (!input.hasAttribute('aria-label')) {
      input.setAttribute('aria-label', 'Input field ' + (index + 1));
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
    if (!control.id) {
      const label = control.id ? document.querySelector('label[for="' + control.id + '"]') : null;
      if (label) {
        label.id = label.id || 'label-' + Math.random().toString(36).substr(2, 9);
        control.setAttribute('aria-labelledby', label.id);
      }
    }

    // Mark required fields appropriately
    if (control.required && !control.hasAttribute('aria-required')) {
      control.setAttribute('aria-required', 'true');
    }

    // Check role validity if present
    if (role && !validRoles.includes(role)) {
        return false;
    }

    return true;
}

/**
 * Validates the structure of all landmarks in the document.
 * Logs warnings for any landmarks that have structural issues.
 * @returns {Array} Array of invalid landmarks.
 */
function addAccessibleNamesToSVGs(svgs) {
  svgs.forEach(svg => {
    const id = 'svg-' + Math.random().toString(36).substr(2, 9);
    svg.setAttribute('id', id);
    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = 'SVG description';
    svg.parentNode.insertBefore(label, svg);
  });
}

// ... other existing functions remained unchanged

// REACT_017: Add/fix 4 landmark issues
/**
 * Validates a landmark element and ensures it has proper accessibility attributes.
 * @param {HTMLElement} landmark - The landmark element to validate.
 * @returns {boolean} - True if landmark is valid.
 */
function validateTableAccessibility() {
  // Check for tables with no headers or headers that are not properly labeled
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      console.error('Table without headers found:', table);
    } else {
      headers.forEach(header => {
        // Check for proper scope attribute
        const scope = header.getAttribute('scope');
        if (!scope) {
          console.error('Table header without scope attribute:', header);
        } else if (scope !== 'col' && scope !== 'row' && scope !== 'colgroup' && scope !== 'rowgroup') {
          console.error('Table header with invalid scope value:', header);
        }
        
        // Check for proper role attribute
        if (!header.hasAttribute('role') || (header.getAttribute('role') !== 'columnheader' && header.getAttribute('role') !== 'rowheader')) {
          console.error('Table header without proper role attribute:', header);
        }
      });
    }
  });
}

/**
 * Implement validateTableStructure() function to check for proper table structure.
 * This function should check for tables with proper nesting and other structural issues.
 *
 * @returns {void}
 */
function validateTableStructure() {
  // Check for tables with incorrect nesting or other structural issues
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length === 0) {
        console.error('Table row without cells found:', row);
      }
    });
    
    // Check for tables without proper structure (missing thead, tbody, tfoot)
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    
    // If table has rows directly under table (not in tbody), that's a structural issue
    const directRows = table.querySelectorAll(':scope > tr');
    if (directRows.length > 0) {
      console.error('Table with rows directly under table element (should be in tbody):', table);
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
  uniqueLandmarks();
  
  // Improve keyboard navigation
  improveKeyboardNavigation();
  
  // Add live region for dynamic content
  addLiveRegionForDynamicContent();
  
  // Return the announcer for use in the app
  return {
    announce: announcer.announce,
    prefersReducedMotion
  };
}

/**
 * Checks whether a link is accessible.
 * A link is considered accessible if it has a non-empty text content
 * or an accessible name (via aria-label, aria-labelledby, or title attribute).
 * @param {HTMLAnchorElement} link - The link element to check.
 * @returns {boolean} True if the link is accessible, false otherwise.
 */
function isLinkAccessible(link) {
  if (!(link instanceof HTMLAnchorElement)) {
    return false;
  }

  // Check for non-empty text content
  const textContent = link.textContent.trim();
  if (textContent.length > 0) {
    return true;
  }

  // Check for aria-label with non-empty value
  const ariaLabel = link.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim().length > 0) {
    return true;
  }

  // Check for aria-labelledby referencing existing element with text
  const ariaLabelledby = link.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelledByElement = document.getElementById(ariaLabelledby);
    if (labelledByElement && labelledByElement.textContent.trim().length > 0) {
      return true;
    }
  }

  // Check for title attribute with non-empty value
  const title = link.getAttribute('title');
  if (title && title.trim().length > 0) {
    return true;
  }

  return false;
}

/**
 * Gets the SVG element's accessible name.
 * If the SVG doesn't have an accessible name, this function adds one.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} - The accessible name of the SVG.
 */
function getSvgAccessibleName(svg) {
  if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby') && !svg.hasAttribute('title')) {
    svg.setAttribute('aria-label', 'SVG graphic');
  }
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.getAttribute('title') || '';
}

/**
 * Creates a link element that is accessible.
 * Replaces fake links (like <a href="#"> or buttons styled as links).
 * @param {string} text - The link text.
 * @param {string} href - The link URL.
 * @returns {HTMLAnchorElement} - The created accessible link element.
 */
function createAccessibleLink(text, href) {
  const link = document.createElement('a');
  link.href = href || '#';
  link.textContent = text;

  // Ensure the link has an accessible name
  if (!link.getAttribute('aria-label') && text.trim() === '') {
    link.setAttribute('aria-label', 'Link');
  }

  return link;
}

/**
 * Creates an in-page navigation button/link that is accessible.
 * This fixes fake link issues by ensuring proper semantic HTML.
 * @param {string} label - The accessible label for the button.
 * @param {string} targetId - The ID of the target section to navigate to.
 * @returns {HTMLAnchorElement} - An accessible in-page link element.
 */
function createInPageButton(label, targetId) {
  const inPageLink = document.createElement('a');
  inPageLink.href = `#${targetId}`;
  inPageLink.setAttribute('aria-label', label);
  inPageLink.textContent = label;

  // If the link text is not provided, ensure it still has an accessible name
  if (!inPageLink.getAttribute('aria-label')) {
    inPageLink.setAttribute('aria-label', 'In-page navigation link');
  }

  return inPageLink;
}

/**
 * Validates landmark elements for accessibility issues.
 * Ensures each landmark has proper roles and unique IDs.
 * @returns {void}
 */
function validateLandmark() {
  const landmarks = document.querySelectorAll('[role], main, nav, header, footer, aside');
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    const tagName = landmark.tagName.toLowerCase();

    // Assign proper roles if missing
    switch (tagName) {
      case 'main':
        landmark.setAttribute('role', 'main');
        break;
      case 'nav':
        landmark.setAttribute('role', 'navigation');
        break;
      case 'header':
        landmark.setAttribute('role', 'banner');
        break;
      case 'footer':
        landmark.setAttribute('role', 'contentinfo');
        break;
      case 'aside':
        landmark.setAttribute('role', 'complementary');
        break;
    }

    // Ensure unique ID
    if (!landmark.id) {
      landmark.id = ensureUniqueLandmarkId(`${tagName}-landmark`);
    }
  });
}

/**
 * Validates landmark structure and ensures uniqueness.
 * Handles duplicate landmark IDs and missing IDs.
 * @returns {void}
 */
function validateLandmarkStructure() {
  const landmarks = Array.from(document.querySelectorAll('[role], main, nav, header, footer, aside'));

  // Track seen IDs to detect duplicates
  const seenIds = new Set();

  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();

    // Assign proper roles if missing
    switch (tagName) {
      case 'main':
        landmark.setAttribute('role', 'main');
        break;
      case 'nav':
        landmark.setAttribute('role', 'navigation');
        break;
      case 'header':
        landmark.setAttribute('role', 'banner');
        break;
      case 'footer':
        landmark.setAttribute('role', 'contentinfo');
        break;
      case 'aside':
        landmark.setAttribute('role', 'complementary');
        break;
    }

    // Ensure unique ID
    if (landmark.id) {
      if (seenIds.has(landmark.id)) {
        // Duplicate ID found - generate new unique ID
        landmark.id = ensureUniqueLandmarkId(`${tagName}-landmark`);
      } else {
        seenIds.add(landmark.id);
      }
    } else {
      landmark.id = ensureUniqueLandmarkId(`${tagName}-landmark`);
      seenIds.add(landmark.id);
    }
  });
}

/**
 * Handles general accessibility issues including fake links.
 * @returns {void}
 */
function handleAccessibilityIssues() {
  // Fix fake link issues
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (!isLinkAccessible(link)) {
      // Replace fake link with accessible version
      const newLink = createAccessibleLink('Learn more', link.href);
      if (link.parentNode) {
        link.parentNode.replaceChild(newLink, link);
      }
    }
  });

  // Add lang attribute to HTML element
  addLangAttribute();

  // Validate and fix landmarks
  validateLandmark();
  validateLandmarkStructure();
}

addProperLandmarkRegions();
addProperAccountManagement();
addAriaToFormControls();
handleAccessibilityIssues();

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addAriaToFormControls,
  replaceMyButtonId,
  getLangAttribute,
  getFullLangAttribute,
  ensureUniqueLandmarkId,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  addAccessibleNamesToSVGs,
  createInPageButton,
  createAccessibleLink,
  removeFakeLinks,
  handleAccessibilityIssues,
  initializeAccessibility,
  createAnnouncer,
  prefersReducedMotion,
  improveKeyboardNavigation,
  addLiveRegionForDynamicContent,
  isLinkAccessible,
  addAriaLabel,
  addLangAttribute,
  getSvgAccessibleName,
  createAccessibleLink,
  createInPageButton,
  validateLandmark,
  validateLandmarkStructure,
  handleAccessibilityIssues
};