// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements
// (Added functions for REACT_015, REACT_017, REACT_041, REACT_025, REACT_036, and REACT_027)

// main.js
// Implementation of unique landmark functions

// Global set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    const candidate = `${baseName}-${Date.now()}`;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 7);
        candidate = `${candidate}-${suffix}`;
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
    button.id = 'exampleButton';
    button.classList.remove('my-button');
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
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  main.id = 'main-content';

  // Create navigation landmark
  const nav = document.querySelector('nav') || document.createElement('nav');
  nav.setAttribute('role', 'navigation');
  nav.id = nav.id || 'primary-navigation';

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
  const collapsibles = document.querySelectorAll('[aria-controls]');
  collapsibles.forEach(element => {
    if (!element.hasAttribute('aria-expanded')) {
      element.setAttribute('aria-expanded', 'false');
    }
  });

  // Add aria-labels to form inputs
  const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
  inputs.forEach((input, index) => {
    const id = input.id || `input-${index}`;
    input.id = id;
    if (!document.querySelector(`label[for="${id}"]`)) {
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
  const formControls = document.querySelectorAll('button, input, select, textarea');

  formControls.forEach(control => {
    // Ensure all form controls have accessible names
    if (!control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby')) {
      const label = control.id ? document.querySelector(`label[for="${control.id}"]`) : null;
      if (label) {
        label.id = label.id || `label-${control.id}`;
        control.setAttribute('aria-labelledby', label.id);
      }
    }

    // Mark required fields appropriately
    if (control.hasAttribute('required') && !control.getAttribute('aria-required')) {
      control.setAttribute('aria-required', 'true');
    }
  });
}

/**
 * Implement validateTableAccessibility() function to check for accessibility issues in tables.
 * This function should check for proper table headers, roles, and other relevant ARIA attributes.
 *
 * @returns {void}
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
        if (!header.hasAttribute('role') || header.getAttribute('role') !== 'columnheader') {
          console.error('Table header without proper role attribute:', header);
        }
      });
    }
  });
}

/**
 * REACT_015: Adds a lang attribute to the HTML element to specify the language
 * of the document. This helps screen readers pronounce content correctly and
 * assists search engines and translation tools.
 *
 * @returns {void}
 */
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * REACT_041: Adds accessible names to SVG elements that lack a title or
 * aria-label. This ensures that assistive technologies can describe the
 * purpose of the SVGs to users.
 *
 * @returns {void}
 */
function addAccessibleNamesToSvgs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const hasAccessibleName =
      svg.getAttribute('aria-label') ||
      svg.getAttribute('aria-labelledby') ||
      svg.querySelector('title');

    if (!hasAccessibleName) {
      svg.setAttribute('aria-label', `Decorative icon ${index + 1}`);
      svg.setAttribute('role', 'img');
    }
  });
}

/**
 * REACT_025: Ensures landmarks are unique by adding aria-label to
 * duplicate landmarks so screen readers can distinguish between them.
 *
 * @returns {void}
 */
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section[role="region"]');
  const seen = {};

  landmarks.forEach((landmark) => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (seen[role]) {
      seen[role] += 1;
      landmark.setAttribute('aria-label', `${role} ${seen[role]}`);
    } else {
      seen[role] = 1;
    }
  });
}

/**
 * REACT_036: Fixes fake link issues by converting non-semantic clickable
 * elements (e.g., divs or spans styled as links) into proper anchor tags
 * with href attributes, or by adding appropriate roles and tabindex.
 *
 * @returns {void}
 */
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('[data-fake-link], .fake-link');
  fakeLinks.forEach((el) => {
    el.setAttribute('role', 'link');
    el.setAttribute('tabindex', '0');
    if (!el.hasAttribute('href')) {
      el.setAttribute('href', '#');
    }
  });
}

/**
 * REACT_027: Adds scope="col" or scope="row" to <th> elements that are missing
 * the attribute. This helps assistive technologies associate header cells with
 * their corresponding data cells in tables.
 *
 * @returns {void}
 */
function addScopeToThElements() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach((th) => {
    if (!th.hasAttribute('scope')) {
      // Determine if it's likely a row or column header based on its position
      const isInThead = th.closest('thead') !== null;
      const isInFirstRow = th.parentElement && th.parentElement.parentElement &&
        (th.parentElement.parentElement.tagName === 'TBODY' || th.parentElement.parentElement.tagName === 'TABLE') &&
        th.parentElement === th.parentElement.parentElement.querySelector('tr');

      if (isInThead || isInFirstRow) {
        th.setAttribute('scope', 'col');
      } else {
        th.setAttribute('scope', 'row');
      }
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
  });
}

addProperLandmarkRegions();
addProperAccountManagement();
addAriaToFormControls();
addLangAttribute();
addAccessibleNamesToSvgs();
ensureUniqueLandmarks();
fixFakeLinks();
addScopeToThElements();
replaceMyButtonId();

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addAriaToFormControls,
  addLangAttribute,
  addAccessibleNamesToSvgs,
  ensureUniqueLandmarks,
  fixFakeLinks,
  addScopeToThElements,
  replaceMyButtonId,
  getFullLangAttribute,
  ensureUniqueLandmarkId,
  uniqueLandmarks,
  validateTableAccessibility,
  validateTableStructure
};