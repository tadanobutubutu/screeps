// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] Add skip link functionality for keyboard navigation

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_025: Ensure unique landmarks

// Internal set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
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

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
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
    elementToModify.lang = 'en'; // Example: English
  }
}

/**
 * Gets the language attribute from the HTML element.
 * @returns {string} The language attribute value.
 */
function getLangAttribute() {
  return document.documentElement.getAttribute('lang') || '';
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (!element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Gets the language attribute of the HTML document.
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
 * Gets the lang attribute from the HTML element.
 * @returns {string} - the lang attribute value.
 */
function getLangAttribute() {
    return document.documentElement.getAttribute('lang') || '';
}

/**
 * Validates a landmark element to ensure it has a valid role.
 * @param {HTMLElement} element - The landmark element to validate.
 * @returns {boolean} True if the landmark is valid, false otherwise.
 */
function validateLandmark(element) {
    if (!element) return false;
    const validRoles = ['main', 'navigation', 'banner', 'contentinfo', 'complementary', 'form', 'search', 'region'];
    const role = element.getAttribute('role') || element.tagName.toLowerCase();
    return validRoles.includes(role.toLowerCase());
}

/**
 * Validates the structure of landmarks in the document.
 * @returns {Array} Array of issues found.
 */
function validateLandmarkStructure() {
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="form"], [role="search"], [role="region"], header, nav, main, footer, aside');
    const issues = [];
    landmarks.forEach(landmark => {
        if (!landmark.id) {
            issues.push(`Landmark ${landmark.tagName} is missing an ID.`);
        }
    });
    return issues;
}

/**
 * Ensures all landmarks have unique IDs.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Landmarks with unique IDs.
 */
function ensureUniqueLandmarks(landmarks) {
    const seen = new Set();
    return landmarks.map(landmark => {
        let id = landmark.id;
        if (!id || seen.has(id)) {
            id = ensureUniqueLandmarkId(landmark.id || 'landmark');
        }
        seen.add(id);
        return { ...landmark, id };
    });
}

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGSVGElement} svg - The SVG element.
 * @returns {string} The accessible name.
 */
function getSvgAccessibleName(svg) {
    return svg.getAttribute('aria-label') || 
           svg.getAttribute('title') || 
           (svg.querySelector('title') ? svg.querySelector('title').textContent : '') || 
           '';
}

/**
 * Creates an in-page button for skipping to main content.
 * @returns {HTMLButtonElement} The created button element.
 */
function createInPageButton() {
    const button = document.createElement('button');
    button.setAttribute('aria-label', 'Skip to main content');
    button.id = 'skip-to-main-content';
    button.textContent = 'Skip to main content';
    return button;
}

/**
 * Creates an accessible link element.
 * @param {string} href - The link URL.
 * @param {string} text - The link text.
 * @returns {HTMLAnchorElement} The created link element.
 */
function createAccessibleLink(href, text) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    return link;
}

/**
 * Handles all accessibility issues in the document.
 * @returns {void}
 */
function handleAccessibilityIssues() {
    removeFakeLinks();
    addProperLandmarkRegions();
    addAriaToFormControls();
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
  const main = document.querySelector('main') || document.querySelector('[role="main"]');
  main.setAttribute('role', 'main');
  main.id = 'main-content';

  // Create navigation landmark
  const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
  if (nav) {
    nav.setAttribute('role', 'navigation');
    nav.id = nav.id || 'primary-navigation';
  }

    // Create banner/header landmark
    const header = document.querySelector('header') || document.querySelector('[role="banner"]') || document.createElement('header');
    header.setAttribute('role', 'banner');
    header.id = header.id || 'site-header';

    // Create contentinfo/footer landmark
    const footer = document.querySelector('footer') || document.querySelector('[role="contentinfo"]') || document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    footer.id = footer.id || 'site-footer';

    // Create aside landmark for complementary content
    const asides = document.querySelectorAll('aside') || [];
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
  const collapsibles = document.querySelectorAll('.collapsible');
  collapsibles.forEach(collapsible => {
    if (!collapsible.getAttribute('aria-expanded')) {
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
 * Addresses accessibility issues from an insight report.
 * @param {Object} insightReport - The insight report containing accessibility findings.
 * @returns {Object} The report with accessibility issues addressed.
 */
function addressAccessibilityIssues(insightReport) {
  // Handle REACT_025: Ensure unique landmarks
  if (insightReport.landmarks && Array.isArray(insightReport.landmarks)) {
    insightReport.landmarks = uniqueLandmarks(insightReport.landmarks);
  }
  
  // Return the modified report with accessibility issues addressed
  return insightReport;
}

/*
 * Helper to manage focus within a container
 * @param {HTMLElement} container - Container element
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
    if (control.required && !control.getAttribute('aria-required')) {
      control.setAttribute('aria-required', 'true');
    }
  });
}

/**
 * Adds accessible names to SVGs.
 * @param {Array} svgs - Array of SVG elements.
 * @returns {void}
 */
function addAccessibleNamesToSVGs(svgs) {
  svgs.forEach(svg => {
    const id = `svg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    svg.setAttribute('id', id);
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = 'SVG description';
    svg.insertBefore(title, svg.firstChild);
  });
}

/**
 * Gets accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name.
 */
function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelledBy = document.getElementById(ariaLabelledby);
    if (labelledBy) {
      return labelledBy.textContent.trim();
    }
  }
  return '';
}

/**
 * Validates landmark accessibility.
 * @param {HTMLElement} landmark - The landmark element to validate.
 * @returns {Object} Validation result with issues array.
 */
function validateLandmark(landmark) {
  const issues = [];
  if (!landmark.hasAttribute('role') && !['main', 'nav', 'header', 'footer', 'aside', 'section'].includes(landmark.tagName.toLowerCase())) {
    issues.push('Landmark missing role attribute');
  }
  if (!landmark.id) {
    issues.push('Landmark missing unique ID');
  }
  return { valid: issues.length === 0, issues };
}

/**
 * Validates landmark structure.
 * @returns {Array} Array of validation results for all landmarks.
 */
function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"], main, nav, header, footer, aside, section');
  const results = [];
  landmarks.forEach(landmark => {
    results.push({ element: landmark, ...validateLandmark(landmark) });
  });
  return results;
}

/**
 * Ensures all landmarks have unique IDs.
 * @returns {void}
 */
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"], main, nav, header, footer, aside, section');
  landmarks.forEach(landmark => {
    if (!landmark.id) {
      const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
      landmark.id = ensureUniqueLandmarkId(role);
    }
  });
}

/**
 * Creates an accessible in-page button.
 * @param {string} text - Button text.
 * @param {Function} onClick - Click handler.
 * @returns {HTMLButtonElement} The created button.
 */
function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  return button;
}

/**
 * Creates an accessible link.
 * @param {string} text - Link text.
 * @param {string} href - Link href.
 * @returns {HTMLAnchorElement} The created link.
 */
function createAccessibleLink(text, href) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  return link;
}

/**
 * Handles accessibility issues by running all validation and fix functions.
 * @returns {Object} Summary of issues found and fixed.
 */
function handleAccessibilityIssues() {
  const summary = {
    landmarks: validateLandmarkStructure(),
    tables: [],
    svgs: [],
    links: []
  };

  // Validate tables
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      summary.tables.push({ element: table, issue: 'Table without headers' });
    }
  });

  // Check SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!getSvgAccessibleName(svg)) {
      summary.svgs.push({ element: svg, issue: 'SVG missing accessible name' });
    }
  });

  // Check links
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (!isLinkAccessible(link)) {
      summary.links.push({ element: link, issue: 'Link missing accessible name' });
    }
  });

  return summary;
}

/**
 * Removes fake links from the document.
 * @returns {void}
 */
function removeFakeLinks() {
  const fakeLinks = document.querySelectorAll('.fake-link');
  fakeLinks.forEach(link => {
    link.style.display = 'none';
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
        // Check for proper scope attribute
        const scope = header.getAttribute('scope');
        if (!scope) {
          console.error('Table header without scope attribute:', header);
        } else if (scope !== 'col' && scope !== 'row' && scope !== 'colgroup' && scope !== 'rowgroup') {
          console.error('Table header with invalid scope value:', header);
        }
        
        // Check for proper role attribute
        if (!header.getAttribute('role') || (header.getAttribute('role') !== 'columnheader' && header.getAttribute('role') !== 'rowheader')) {
          console.error('Table header without proper role attribute:', header);
        }
      });
    }
  });
}

        // Mark required fields appropriately
        if (control.hasAttribute('required') && !control.hasAttribute('aria-required')) {
            control.setAttribute('aria-required', 'true');
        }
    });
  });
}

// ARIA live region announcer
function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
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
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
  interactiveElements.forEach(element => {
    element.setAttribute('tabindex', '0');
  });
}

// Function to add ARIA live regions for dynamic content updates
function addLiveRegion() {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'alert');
  document.body.appendChild(liveRegion);
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();
  
  // Ensure all landmarks have unique IDs
  ensureUniqueLandmarks();
  
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
 * Retrieves all accessible links from the document.
 * Uses the isLinkAccessible function to determine accessibility.
 * @returns {Array} Array of accessible link elements.
 */
function function3() {
  const links = document.querySelectorAll('a');
  const accessibleLinks = [];
  links.forEach(link => {
    if (isLinkAccessible(link)) {
      accessibleLinks.push(link);
    }
  });
  return accessibleLinks;
}

addProperLandmarkRegions();
addProperAccountManagement();
addAriaToFormControls();

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
  addAccessibleNamesToSVGs,
  removeFakeLinks,
  initializeAccessibility,
  createAnnouncer,
  prefersReducedMotion,
  improveKeyboardNavigation,
  addLiveRegionForDynamicContent,
  isLinkAccessible,
  function3,
  addAriaLabel,
  addLangAttribute,
  getLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues
};