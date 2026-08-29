// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

/**
 * Adds a `lang` attribute to the HTML element to specify the language of the document.
 *
 * @returns {void}
 */
function addLangAttribute() {
  const html = document.documentElement;
  if (html) {
    html.setAttribute('lang', getFullLangAttribute());
  }
}

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
        const uniqueCandidate = `${candidate}-${suffix}`;
        _usedLandmarkIds.add(uniqueCandidate);
        return uniqueCandidate;
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
  // Initialize landmark elements
  const main = document.createElement('main');
  const nav = document.querySelector('nav') || document.createElement('nav');
  const header = document.querySelector('header') || document.createElement('header');
  const footer = document.querySelector('footer') || document.createElement('footer');
  const asides = document.querySelectorAll('aside');

  // Set landmark roles and IDs
  main.setAttribute('role', 'main');
  main.id = 'main-content';

  // Create navigation landmark
  nav.setAttribute('role', 'navigation');
  nav.id = nav.id || 'primary-navigation';

  // Create banner/header landmark
  header.setAttribute('role', 'banner');
  header.id = header.id || 'site-header';

  // Create contentinfo/footer landmark
  footer.setAttribute('role', 'contentinfo');
  footer.id = footer.id || 'site-footer';

  // Add other landmark roles as needed

  asides.forEach((aside, index) => {
    aside.setAttribute('role', 'complementary');
    if (!aside.id) aside.id = `sidebar-${index + 1}`;
  });

  // Add landmark elements to the document
  document.body.appendChild(main);
  document.body.appendChild(nav);
  document.body.insertBefore(header, main);
  document.body.appendChild(footer);
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
 * Adds accessible names to SVG elements that lack them.
 * This addresses REACT_041: Add accessible names to 2 SVGs.
 *
 * @returns {void}
 */
function addAccessibleNamesToSvgs() {
  // Find all SVG elements without accessible names
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby]):not([role="img"][aria-label]):not(:has(title))');
  
  svgs.forEach((svg, index) => {
    // Check if SVG already has a title element (which provides accessible name)
    const hasTitle = svg.querySelector('title');
    const hasAriaLabel = svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby');
    
    if (!hasTitle && !hasAriaLabel) {
      // Try to get context from parent or use a generic name
      const parentLabel = svg.closest('[aria-label]')?.getAttribute('aria-label');
      const parentText = svg.closest('button, a, [role="button"], [role="link"]')?.textContent?.trim();
      
      if (parentLabel) {
        svg.setAttribute('aria-label', parentLabel);
      } else if (parentText) {
        svg.setAttribute('aria-label', parentText);
      } else {
        // Add a descriptive title element as fallback
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.id = `svg-title-${index}`;
        title.textContent = `Icon ${index + 1}`;
        svg.insertBefore(title, svg.firstChild);
        svg.setAttribute('aria-labelledby', title.id);
        svg.setAttribute('role', 'img');
      }
    } else if (hasTitle && !svg.hasAttribute('role')) {
      // Ensure SVG with title has proper role
      svg.setAttribute('role', 'img');
      const titleId = svg.querySelector('title')?.id || `svg-title-${index}`;
      if (!svg.querySelector('title').id) {
        svg.querySelector('title').id = titleId;
      }
      svg.setAttribute('aria-labelledby', titleId);
    }
  });
}

/**
 * Fixes fake link issues by ensuring elements that act as links have proper ARIA roles and keyboard support.
 * This addresses REACT_036: Fix 1 fake link issue.
 *
 * @returns {void}
 */
function fixFakeLinkIssues() {
  // Find elements that look like links but aren't <a> tags
  // These are elements with click handlers or href-like behavior but missing link semantics
  const fakeLinks = document.querySelectorAll(
    '[onclick]:not(a):not(button):not([role]), ' +
    '[href]:not(a):not(link):not(area), ' +
    '[role="link"]:not(a), ' +
    '.fake-link, .link-button, [data-link]'
  );
  
  fakeLinks.forEach((element, index) => {
    // If it has an onclick but no role, add role="link" or role="button" based on behavior
    if (element.hasAttribute('onclick') && !element.hasAttribute('role')) {
      const onclick = element.getAttribute('onclick');
      // Heuristic: if it navigates, it's a link; if it performs action, it's a button
      if (onclick.includes('location.href') || onclick.includes('window.open') || onclick.includes('navigate')) {
        element.setAttribute('role', 'link');
      } else {
        element.setAttribute('role', 'button');
      }
    }
    
    // If it has href but isn't an anchor, add role="link"
    if (element.hasAttribute('href') && element.tagName !== 'A') {
      element.setAttribute('role', 'link');
    }
    
    // Ensure keyboard accessibility for fake links
    if (element.getAttribute('role') === 'link' && !element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
    
    // Add keydown handler for Enter/Space activation if it's a fake link/button
    if ((element.getAttribute('role') === 'link' || element.getAttribute('role') === 'button') && 
        element.tagName !== 'A' && element.tagName !== 'BUTTON') {
      if (!element.hasAttribute('data-keyboard-handler')) {
        element.setAttribute('data-keyboard-handler', 'true');
        element.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (e.key === ' ') e.preventDefault(); // Prevent scrolling on space
            element.click();
          }
        });
      }
    }
    
    // Ensure accessible name for fake links
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby') && !element.textContent.trim()) {
      element.setAttribute('aria-label', `Link ${index + 1}`);
    }
  });
}

// Function to remove the 'my-button' class, and set a specific id for the button element if it exists.
// Assumes you have already set the id on the button element in your code.
replaceMyButtonId();

addProperLandmarkRegions();
addProperAccountManagement();
addAriaToFormControls();
addLangAttribute();
addAccessibleNamesToSvgs();
fixFakeLinkIssues();

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
        // Check for scope attribute (REACT_027)
        if (!header.hasAttribute('scope')) {
          console.warn('Table header missing scope attribute:', header);
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
  });
}

// Initialize the set of used landmark IDs
const _usedLandmarkIds = new Set();

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addAriaToFormControls,
  replaceMyButtonId,
  getFullLangAttribute,
  ensureUniqueLandmarkId,
  uniqueLandmarks,
  validateTableAccessibility,
  validateTableStructure,
  addAccessibleNamesToSvgs,
  fixFakeLinkIssues
};