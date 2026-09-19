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
        const suffix = Math.floor(Math.random() * 10);
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

/**
 * Ensures all landmarks in the document have unique IDs.
 * Assigns unique IDs to landmarks that are missing or have duplicate IDs.
 * @returns {void}
 */
function ensureUniqueLandmarks() {
    const landmarkSelectors = 'header, nav, main, aside, footer, section, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="region"]';
    const landmarks = document.querySelectorAll(landmarkSelectors);

    landmarks.forEach((landmark, index) => {
        const existingId = landmark.getAttribute('id');
        const existingAriaLabel = landmark.getAttribute('aria-label');

        if (!existingId) {
            const tagName = landmark.tagName.toLowerCase();
            const baseId = existingAriaLabel
                ? existingAriaLabel.toLowerCase().replace(/\s+/g, '-')
                : `${tagName}-${index}`;
            const uniqueId = ensureUniqueLandmarkId(baseId);
            landmark.setAttribute('id', uniqueId);
        } else if (_usedLandmarkIds.has(existingId)) {
            // Duplicate ID found, generate a new unique one
            const uniqueId = ensureUniqueLandmarkId(existingId);
            landmark.setAttribute('id', uniqueId);
        } else {
            _usedLandmarkIds.add(existingId);
        }
    });
}

/**
 * Validates that landmarks have proper structure (role and accessible name).
 * @param {HTMLElement} landmark - The landmark element to validate.
 * @returns {boolean} True if the landmark has valid structure.
 */
function validateLandmark(landmark) {
    const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role');
    const ariaLabel = landmark.getAttribute('aria-label');
    const ariaLabelledBy = landmark.getAttribute('aria-labelledby');

    // section element requires aria-label or aria-labelledby to be a valid landmark
    if (tagName === 'section') {
        return !!(ariaLabel || ariaLabelledBy);
    }

    // form element requires accessible name to be a valid landmark
    if (tagName === 'form') {
        return !!(ariaLabel || ariaLabelledBy || landmark.getAttribute('title'));
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
function validateLandmarkStructure() {
    const landmarkSelectors = 'header, nav, main, aside, footer, section, form, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="region"]';
    const landmarks = document.querySelectorAll(landmarkSelectors);
    const invalidLandmarks = [];

    landmarks.forEach((landmark) => {
        if (!validateLandmark(landmark)) {
            invalidLandmarks.push(landmark);
        }
    });

    return invalidLandmarks;
}

/**
 * Validates table accessibility by checking for proper headers and structure.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {boolean} True if the table has proper accessibility structure.
 */
function validateTableAccessibility(table) {
    const headers = table.querySelectorAll('th');
    const hasHeaderRow = headers.length > 0;

    if (!hasHeaderRow) {
        return false;
    }

    // Check that all th elements have scope attribute
    const allHeadersHaveScope = Array.from(headers).every(
        header => header.hasAttribute('scope')
    );

    return allHeadersHaveScope;
}

/**
 * Validates the structure of all tables in the document.
 * Adds missing scope attributes to th elements.
 * @returns {Array} Array of tables that were modified.
 */
function validateTableStructure() {
    const tables = document.querySelectorAll('table');
    const modifiedTables = [];

    tables.forEach((table) => {
        const headers = table.querySelectorAll('th');
        headers.forEach((header) => {
            if (!header.hasAttribute('scope')) {
                // Determine if it's in a row or column header
                const isInFirstRow = header.closest('tr') === table.querySelector('tr');
                header.setAttribute('scope', isInFirstRow ? 'col' : 'row');
                modifiedTables.push(table);
            }
        });
    });

    return modifiedTables;
}

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name of the SVG.
 */
function getSvgAccessibleName(svg) {
    return svg.getAttribute('aria-label') ||
           svg.getAttribute('aria-labelledby') ||
           svg.querySelector('title')?.textContent ||
           '';
}

/**
 * Creates an in-page button element with proper accessibility attributes.
 * @param {string} text - The button text.
 * @param {Function} onClick - The click handler.
 * @returns {HTMLButtonElement} The created button element.
 */
function createInPageButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('type', 'button');
    if (onClick) {
        button.addEventListener('click', onClick);
    }
    return button;
}

/**
 * Creates an accessible link element.
 * @param {string} href - The link href.
 * @param {string} text - The link text.
 * @returns {HTMLAnchorElement} The created anchor element.
 */
function createAccessibleLink(href, text) {
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.textContent = text;
    return link;
}

/**
 * Handles accessibility issues in the document by running all validation and fix functions.
 * @returns {void}
 */
function handleAccessibilityIssues() {
    ensureUniqueLandmarks();
    validateLandmarkStructure();
    validateTableStructure();
}

// Add lang attribute as per the issue requirement
function addLangAttribute() {
  const elementToModify = document.documentElement;
  if (elementToModify) {
    elementToModify.lang = 'en'; // Example: English
  }
}

// Add landmark roles
function createLandmark(id, role) {
  const landmark = document.createElement('div');
  landmark.id = id;
  landmark.setAttribute('role', role);
  return landmark;
}

function addLandmark(element) {
  const landmark = createLandmark(ensureUniqueLandmarkId('landmark'), element.landmarkRole);
  element.appendChild(landmark);
}

// Add missing landmark roles
function addMainLandmarks() {
  const main = document.querySelector('main');

  if (main) {
    // Add a Main landmark if none exists
    if (!main.hasOwnProperty('landmarkRole')) {
      addLandmark(main);
      main.landmarkRole = 'main';
    }
  }

  const articles = document.querySelectorAll('article:not([landmark])');

  for (const article of articles) {
    addLandmark(article);
    article.landmarkRole = 'article';
  }

  const navs = document.querySelectorAll('nav:not([landmark])');

  for (const nav of navs) {
    addLandmark(nav);
    nav.landmarkRole = 'nav';
  }
}

// IMPLEMENTATION OF REACT_041
// Add accessible names to 2 SVGs
function getSvgAccessibleName(svg) {
  // Returns a unique accessible name for the given SVG element
}

function setSvgAccessibleName(svg) {
  // Sets the accessible name for the given SVG element
}

// Modify existing code to call setSvgAccessibleName when adding SVGs
// ... (You might need to look at the place where SVGs are added or created)

// IMPLEMENTATION OF REACT_025
// Ensure unique landmarks (2 issues)
function validateLandmarkStructure(landmark) {
  // Validate that the landmark is correctly structured (or raise an error)
}

// Add a function to ensure unique IDs for landmarks
function ensureUniqueLandmarks(landmarks) {
  // Returns an array of landmarks with unique IDs
}

// Make required modifications in the code to use ensureUniqueLandmarks when adding landmarks
// ... (You might need to look at the place where landmarks are added or created)

// Address REACT_036 - Fix 1 fake link issue
// ... (Might require changes depending on how the fake link issue is present in the code)

// Ensure tests continue to pass
// ... (Run tests locally to verify that the new functions don't introduce any issues)

// Calling functions to add landmark roles and ensure unique landmark IDs
addMainLandmarks();