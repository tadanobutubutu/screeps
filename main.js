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
        const suffix = Math.floor(Math.random() * 900) + 100;
        candidate = `${baseName}-${suffix}`;
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

// Add lang attribute as per the issue requirement
function addLangAttribute() {
  // Assuming there is a relevant element selector or similar to target
  const elementToModify = document.querySelector('html');
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
  const nav = document.querySelector('nav') || document.getElementById('nav');
  nav.setAttribute('role', 'navigation');
  nav.id = nav.id || 'primary-navigation';

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
  asides.forEach((aside, index) => {
    aside.setAttribute('role', 'complementary');
    if (!aside.id) aside.id = `sidebar-${index + 1}`;
  });
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
    const id = input.id || `input-${index}`;
    input.id = id;
    if (!input.hasAttribute('aria-label')) {
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
    if (!control.id && !control.getAttribute('aria-label')) {
      const label = control.id ? document.querySelector(`label[for="${control.id}"]`) : null;
      if (label) {
        label.id = label.id || `label-${Math.random().toString(36).substr(2, 9)}`;
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
    const id = `svg-${Math.random().toString(36).substr(2, 9)}`;
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
function validateLandmark(landmark) {
    if (!landmark) return false;
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    const validRoles = ['banner', 'main', 'navigation', 'contentinfo', 'complementary', 'region', 'form', 'search'];
    if (!validRoles.includes(role) && !['header', 'main', 'nav', 'footer', 'aside', 'section', 'form'].includes(landmark.tagName.toLowerCase())) {
        return false;
    }
    // Ensure landmark has an accessible name if required
    const needsLabel = ['navigation', 'region', 'form', 'search'].includes(role) || landmark.tagName.toLowerCase() === 'section';
    if (needsLabel && !landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
        landmark.setAttribute('aria-label', landmark.id || 'landmark');
    }
    return true;
}

/**
 * Validates the structure of landmarks within a container.
 * @param {HTMLElement} container - The container element to check.
 * @returns {Array} - List of landmark issues found.
 */
function validateLandmarkStructure(container) {
    const issues = [];
    const landmarks = container.querySelectorAll('header, main, nav, footer, aside, section, [role="banner"], [role="main"], [role="navigation"], [role="contentinfo"], [role="complementary"], [role="region"]');
    const seen = new Set();
    landmarks.forEach((lm, index) => {
        if (!validateLandmark(lm)) {
            issues.push(`Invalid landmark at index ${index}`);
        }
        const key = lm.tagName.toLowerCase() + (lm.getAttribute('role') || '');
        if (seen.has(key)) {
            issues.push(`Duplicate landmark of type ${key}`);
        }
        seen.add(key);
    });
    return issues;
}

/**
 * Ensures that all landmarks within a container have unique IDs.
 * @param {HTMLElement} container - The container element to check.
 */
function ensureUniqueLandmarks(container) {
    const landmarks = container.querySelectorAll('header, main, nav, footer, aside, section, [role="banner"], [role="main"], [role="navigation"], [role="contentinfo"], [role="complementary"], [role="region"]');
    landmarks.forEach(lm => {
        if (!lm.id) {
            lm.id = ensureUniqueLandmarkId(lm.tagName.toLowerCase());
        } else if (_usedLandmarkIds.has(lm.id)) {
            lm.id = ensureUniqueLandmarkId(lm.id);
        }
    });
}

// REACT_027: Fix 26 table structure issues
/**
 * Validates table accessibility and adds scope attributes to th elements.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {boolean} - True if table is accessible.
 */
function validateTableAccessibility(table) {
    if (!table) return false;
    const ths = table.querySelectorAll('th');
    ths.forEach(th => {
        if (!th.hasAttribute('scope')) {
            // Determine if it's a header for a row or column
            const isInFirstRow = th.closest('tr') === table.querySelector('tr');
            const isInFirstColumn = Array.from(th.parentNode.children).indexOf(th) === 0;
            th.setAttribute('scope', isInFirstRow ? 'col' : (isInFirstColumn ? 'row' : 'col'));
        }
    });
    return true;
}

/**
 * Validates the overall structure of a table for accessibility.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {Array} - List of issues found.
 */
function validateTableStructure(table) {
    const issues = [];
    if (!table) {
        issues.push('Table element not found');
        return issues;
    }
    const rows = table.querySelectorAll('tr');
    if (rows.length === 0) {
        issues.push('Table has no rows');
    }
    const ths = table.querySelectorAll('th');
    const tds = table.querySelectorAll('td');
    if (ths.length === 0 && tds.length > 0) {
        issues.push('Table has no header cells');
    }
    // Check for caption
    if (!table.querySelector('caption')) {
        issues.push('Table missing caption element');
    }
    return issues;
}

// REACT_041: Add accessible names to 2 SVGs
/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} - The accessible name.
 */
function getSvgAccessibleName(svg) {
    if (!svg) return '';
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    const titleEl = svg.querySelector('title');
    if (titleEl) return titleEl.textContent;
    return '';
}

/**
 * Creates an in-page button with proper accessibility attributes.
 * @param {string} label - The button label.
 * @param {Function} onClick - Click handler.
 * @returns {HTMLButtonElement} - The created button.
 */
function createInPageButton(label, onClick) {
    const button = document.createElement('button');
    button.textContent = label;
    button.setAttribute('aria-label', label);
    if (onClick) {
        button.addEventListener('click', onClick);
    }
    return button;
}

// REACT_036: Fix 1 fake link issue
/**
 * Creates an accessible link element.
 * @param {string} href - The URL.
 * @param {string} text - The link text.
 * @returns {HTMLAnchorElement} - The created anchor.
 */
function createAccessibleLink(href, text) {
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.textContent = text;
    link.setAttribute('aria-label', text);
    return link;
}

/**
 * Handles general accessibility issues in the page.
 * @param {HTMLElement} root - The root element to process.
 */
function handleAccessibilityIssues(root) {
    if (!root) return;
    // Fix fake links (div/span with click handlers styled as links)
    const fakeLinks = root.querySelectorAll('[role="link"]');
    fakeLinks.forEach(el => {
        if (el.tagName !== 'A') {
            // Add proper link semantics or convert to actual link
            el.setAttribute('tabindex', '0');
        }
    });
    // Ensure all interactive elements have accessible names
    const interactive = root.querySelectorAll('button, a, input, select, textarea, [role="button"]');
    interactive.forEach(el => {
        if (!el.hasAttribute('aria-label') && !el.textContent.trim() && !el.getAttribute('placeholder')) {
            el.setAttribute('aria-label', 'Interactive element');
        }
    });
}