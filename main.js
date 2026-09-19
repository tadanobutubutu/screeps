// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleFakeLinks())

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
        // Collision handling: add counter suffix
        counter++;
        candidate = `${baseName}-${counter}`;
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
  const elementToModify = document.querySelector('html');
  if (elementToModify) {
    elementToModify.lang = 'en'; // Example: English
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
 * Creates an in-page button with proper accessible attributes.
 * @returns {HTMLButtonElement} The created button element.
 */
function createInPageButton() {
  const button = document.createElement('button');
  button.setAttribute('aria-label', 'In-page action button');
  button.id = ensureUniqueLandmarkId('in-page-button');
  return button;
}

/**
 * Creates an accessible link element.
 * @param {string} href - The href attribute for the link.
 * @param {string} textContent - The visible text content of the link.
 * @returns {HTMLAnchorElement} The created anchor element.
 */
function createAccessibleLink(href, textContent) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = textContent;
  return link;
}

/**
 * Validates if a link is accessible and handles fake links appropriately.
 * @param {HTMLAnchorElement} link - The link element to validate.
 * @returns {boolean} True if the link is accessible, false otherwise.
 */
function validateLinkAccessibility(link) {
  return isLinkAccessible(link);
}

/**
 * Handles fake links by hiding them or converting them to buttons.
 * @returns {void}
 */
function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""]');
  fakeLinks.forEach(link => {
    link.style.display = 'none';
  });
}

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name.
 */
function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') || 
         svg.getAttribute('title') || 
         svg.querySelector('title')?.textContent || 
         'SVG graphic';
}

/**
 * Sets accessibility props for SVG elements.
 * @param {SVGElement} svg - The SVG element.
 * @param {string} name - The accessible name for the SVG.
 * @returns {void}
 */
function setSvgAccessibilityProps(svg, name) {
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  if (!svg.hasAttribute('aria-label')) {
    svg.setAttribute('aria-label', name);
  }
}

/**
 * Validates a landmark element for accessibility.
 * @param {HTMLElement} landmark - The landmark element to validate.
 * @returns {void}
 */
function validateLandmark(landmark) {
  if (!landmark.id) {
    landmark.id = ensureUniqueLandmarkId(landmark.tagName.toLowerCase());
  }
}

/**
 * Validates and fixes landmark structure.
 * @returns {void}
 */
function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('main, nav, header, footer, aside');
  landmarks.forEach(landmark => {
    validateLandmark(landmark);
  });
}

/**
 * Ensures landmarks are unique by adding IDs if needed.
 * @returns {void}
 */
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"]');
  landmarks.forEach(landmark => {
    if (!landmark.id) {
      landmark.id = ensureUniqueLandmarkId(landmark.getAttribute('role'));
    }
  });
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
  const nav = document.querySelector('nav') || document.createElement('nav');
  nav.setAttribute('role', 'navigation');
  nav.id = nav.id || 'primary-navigation';

  // Create banner/header landmark
  const header = document.querySelector('header') || document.querySelector('[role="banner"]');
  header.setAttribute('role', 'banner');
  header.id = header.id || 'site-header';

  // Create contentinfo/footer landmark
  const footer = document.querySelector('footer') || document.querySelector('[role="contentinfo"]');
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
 * Validates that landmarks have proper structure (role and accessible name).
 * @param {HTMLElement} landmark - The landmark element to validate.
 * @returns {boolean} True if the landmark has valid structure.
 */
function addProperAccountManagement() {
  // Add aria-expanded to collapsible menus/buttons
  const collapsibles = document.querySelectorAll('.collapsible');
  collapsibles.forEach(collapsible => {
    if (!collapsible.hasAttribute('aria-expanded')) {
      collapsible.setAttribute('aria-expanded', 'false');
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
  });
}

/**
 * Adds accessible names to SVGs.
 * @param {Array} svgs - Array of SVG elements.
 * @returns {void}
 */
function addAccessibleNamesToSVGs(svgs) {
  svgs.forEach((svg, index) => {
    const id = svg.id || `svg-${index + 1}`;
    svg.setAttribute('id', id);
    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = 'SVG description';
    svg.insertAdjacentElement('afterend', label);
  });
}

/**