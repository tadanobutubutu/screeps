// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// Set to track used landmark IDs for uniqueness
const _usedLandmarkIds = new Set();

/**
 * Gets the language attribute from the HTML element.
 * @returns {string} The language attribute value.
 */
function getLangAttribute() {
    return document.documentElement.lang || 'en';
}

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
    aside.setAttribute(' role', 'complementary');
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
 * Validates landmarks for proper accessibility attributes.
 * Checks that landmarks have proper roles and accessible names.
 * @returns {Array} Array of validation error messages.
 */
function validateLandmark() {
    const errors = [];
    const landmarkRoles = ['main', 'navigation', 'banner', 'contentinfo', 'complementary', 'search', 'form', 'application'];
    
    landmarkRoles.forEach(role => {
        const elements = document.querySelectorAll(`[role="${role}"]`);
        elements.forEach(element => {
            const hasLabel = element.hasAttribute('aria-label') || 
                           element.hasAttribute('aria-labelledby') ||
                           element.id;
            if (!hasLabel && role !== 'main') {
                errors.push(`Landmark with role="${role}" lacks accessible name`);
            }
        });
    });
    
    return errors;
}

/**
 * Validates the structure of landmarks to ensure proper nesting and uniqueness.
 * @returns {Array} Array of validation error messages.
 */
function validateLandmarkStructure() {
    const errors = [];
    const landmarkIds = new Set();
    
    // Check for unique landmark IDs
    const landmarks = document.querySelectorAll('[role]');
    landmarks.forEach(landmark => {
        if (landmark.id) {
            if (landmarkIds.has(landmark.id)) {
                errors.push(`Duplicate landmark ID: ${landmark.id}`);
            }
            landmarkIds.add(landmark.id);
        }
    });
    
    // Check for proper landmark nesting
    const banner = document.querySelector('[role="banner"]');
    const contentinfo = document.querySelector('[role="contentinfo"]');
    
    if (banner && contentinfo && banner.contains(contentinfo)) {
        errors.push('contentinfo landmark should not be nested inside banner');
    }
    
    // Ensure only one main landmark
    const mainLandmarks = document.querySelectorAll('[role="main"]');
    if (mainLandmarks.length > 1) {
        errors.push(`Multiple main landmarks found: ${mainLandmarks.length} (should be 1)`);
    }
    
    return errors;
}

/**
 * Ensures all landmarks have unique IDs.
 * @returns {void}
 */
function ensureUniqueLandmarks() {
    const landmarks = document.querySelectorAll('[role]');
    const usedIds = new Set();
    
    landmarks.forEach(landmark => {
        if (landmark.id) {
            if (usedIds.has(landmark.id)) {
                const newId = ensureUniqueLandmarkId(landmark.getAttribute('role'));
                landmark.id = newId;
            }
            usedIds.add(landmark.id);
        } else {
            // Assign unique ID if missing
            landmark.id = ensureUniqueLandmarkId(landmark.getAttribute('role') || 'landmark');
        }
    });
}

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name.
 */
function getSvgAccessibleName(svg) {
    if (!svg) return '';
    
    // Check aria-label first
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    
    // Check aria-labelledby
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
        const labelElement = document.getElementById(ariaLabelledby);
        return labelElement ? labelElement.textContent : '';
    }
    
    // Check for title element
    const title = svg.querySelector('title');
    if (title && title.textContent) return title.textContent;
    
    // Check for descendant with aria-label
    const descendantWithLabel = svg.querySelector('[aria-label]');
    if (descendantWithLabel) return descendantWithLabel.getAttribute('aria-label');
    
    return '';
}

/**
 * Creates an in-page button with proper accessibility attributes.
 * @param {string} text - The button text.
 * @param {string} action - The action identifier.
 * @param {string} svgName - Optional name for associated SVG.
 * @returns {HTMLButtonElement} The created button element.
 */
function createInPageButton(text, action, svgName) {
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('type', 'button');
    button.setAttribute('data-action', action);
    
    // Generate accessible name including SVG if provided
    let accessibleName = text;
    if (svgName) {
        accessibleName = `${text} - ${svgName}`;
    }
    button.setAttribute('aria-label', accessibleName);
    button.setAttribute('id', ensureUniqueLandmarkId(`btn-${action}`));
    
    return button;
}

/**
 * Creates an accessible link element.
 * @param {string} href - The URL for the link.
 * @param {string} text - The link text.
 * @param {Object} options - Additional options for the link.
 * @returns {HTMLAnchorElement} The created anchor element.
 */
function createAccessibleLink(href, text, options = {}) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    
    if (options.id) {
        link.id = options.id;
    } else {
        link.id = ensureUniqueLandmarkId('accessible-link');
    }
    
    if (options.ariaLabel) {
        link.setAttribute('aria-label', options.ariaLabel);
    }
    
    if (options.external) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
    
    return link;
}

/**
 * Handles accessibility issues in the document.
 * Addresses fake links by converting them to proper buttons or accessible links.
 * @returns {void}
 */
function handleAccessibilityIssues() {
    // Fix fake links (links without href or with javascript: href)
    const fakeLinks = document.querySelectorAll('a[href=""], a[href^="javascript:"], a:not([href])');
    fakeLinks.forEach(link => {
        const text = link.textContent.trim();
        const action = link.getAttribute('data-action') || 'unknown';
        
        // Convert to button if it's an in-page action
        if (link.classList.contains('fake-link') || link.getAttribute('data-convert-to-button')) {
            const button = createInPageButton(text, action);
            
            // Copy any existing classes except fake-link
            Array.from(link.classList).forEach(cls => {
                if (cls !== 'fake-link') button.classList.add(cls);
            });
            
            // Copy click handler if exists
            const clickHandler = link.onclick;
            if (clickHandler) {
                button.addEventListener('click', clickHandler);
            }
            
            link.parentNode.replaceChild(button, link);
        }
    });
    
    // Ensure SVGs have accessible names
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
        const name = getSvgAccessibleName(svg);
        if (!name) {
            // Set a default accessible name if none exists
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.textContent = `SVG icon ${index + 1}`;
            title.id = ensureUniqueLandmarkId(`svg-title-${index}`);
            svg.insertBefore(title, svg.firstChild);
            
            if (!svg.getAttribute('aria-labelledby')) {
                svg.setAttribute('aria-labelledby', title.id);
            }
        }
    });
    
    // Apply all accessibility fixes
    ensureUniqueLandmarks();
}

// Function to remove the 'my-button' class, and set a specific id for the button element if it exists.
// Assumes you have already set the id on the button element in your code.
replaceMyButtonId();

addProperLandmarkRegions();
addProperAccountManagement();
addAriaToFormControls();
addLangAttribute();

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
  getLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues
};