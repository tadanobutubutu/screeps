// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

/**
 * Wrap primary content in main div
 * @param { Document } doc - The document object to operate on
 */
function wrapPrimaryContentInMain(doc) {
  const primaryContent = doc.querySelector('main, [role="main"], #content, #main');
  if (!primaryContent) {
    return;
  }

  const main = doc.createElement('div');
  main.className = 'main';
  main.setAttribute('role', 'main');

  if (primaryContent.parentNode) {
    primaryContent.parentNode.replaceChild(main, primaryContent);
    main.appendChild(primaryContent);
  }
}

/**
 * Ensure unique landmarks by adding unique IDs to duplicate landmarks
 * @param { Element[] } landmarks - Array of landmark elements
 * @returns { Element[] } - Array of landmarks with unique IDs
 */
function ensureUniqueLandmarks(landmarks) {
  const landmarkCounts = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || 'main';
    landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;

    if (landmarkCounts[role] > 1 && !landmark.id) {
      landmark.id = `${role}-${landmarkCounts[role]}`;
    }
  });

  return landmarks;
}

/**
 * Add proper landmark regions to the document
 * @param { Document } doc - The document object to operate on
 */
function addProperLandmarkRegions(doc) {
  const landmarks = doc.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"], [role="search"]');
  return ensureUniqueLandmarks(Array.from(landmarks));
}

/**
 * Add aria-label or aria-labelledby to form controls that are missing labels
 * @param { Document } doc - The document object to operate on
 */
function addAriaToFormControls(doc) {
  const inputs = doc.querySelectorAll('input:not([aria-label]):not([aria-labelledby]), select:not([aria-label]):not([aria-labelledby]), textarea:not([aria-label]):not([aria-labelledby])');

  inputs.forEach((input, index) => {
    const existingLabel = input.closest('label');
    if (!existingLabel && !input.id) {
      input.setAttribute('aria-label', `form-input-${index + 1}`);
    }
  });
}

/**
 * Replace generic button IDs with descriptive ones
 * @param { Document } doc - The document object to operate on
 */
function replaceMyButtonId(doc) {
  const buttons = doc.querySelectorAll('.myButton, #myButton');

  buttons.forEach((button, index) => {
    button.id = `action-button-${index + 1}`;
  });
}

/**
 * Get the lang attribute from the HTML element
 * @param { Document } doc - The document object to operate on
 * @returns { string | null } - The lang attribute value
 */
function getLangAttribute(doc) {
  const html = doc.querySelector('html');
  return html ? html.getAttribute('lang') : null;
}

/**
 * Get the full lang attribute including region
 * @param { Document } doc - The document object to operate on
 * @returns { string | null } - The full lang attribute value
 */
function getFullLangAttribute(doc) {
  const html = doc.querySelector('html');
  if (!html) return null;

  let lang = html.getAttribute('lang');
  if (lang && lang.includes('-')) {
    return lang;
  }

  return lang;
}

/**
 * Validate landmark structure
 * @param { Document } doc - The document object to operate on
 * @returns { boolean } - Whether the landmark structure is valid
 */
function validateLandmark(doc) {
  const landmarks = doc.querySelectorAll('[role]');
  const landmarkRoles = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    landmarkRoles[role] = (landmarkRoles[role] || 0) + 1;
  });

  return Object.values(landmarkRoles).every(count => count === 1);
}

/**
 * Validate landmark structure with details
 * @param { Document } doc - The document object to operate on
 * @returns { Object } - Validation result with details
 */
function validateLandmarkStructure(doc) {
  const landmarks = doc.querySelectorAll('[role]');
  const landmarkRoles = {};
  const duplicates = [];

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (!landmarkRoles[role]) {
      landmarkRoles[role] = [];
    }
    landmarkRoles[role].push(landmark);
  });

  Object.entries(landmarkRoles).forEach(([role, elements]) => {
    if (elements.length > 1) {
      duplicates.push({ role, count: elements.length });
    }
  });

  return {
    valid: duplicates.length === 0,
    duplicates
  };
}

/**
 * Validate table accessibility
 * @param { Document } doc - The document object to operate on
 * @returns { Object } - Validation result
 */
function validateTableAccessibility(doc) {
  const tables = doc.querySelectorAll('table');
  const results = [];

  tables.forEach((table, index) => {
    const headers = table.querySelectorAll('th');
    const headersWithScope = table.querySelectorAll('th[scope]');

    results.push({
      tableIndex: index,
      totalHeaders: headers.length,
      headersWithScope: headersWithScope.length,
      hasCaption: !!table.querySelector('caption')
    });
  });

  return results;
}

/**
 * Validate table structure
 * @param { Document } doc - The document object to operate on
 * @returns { boolean } - Whether the table structure is valid
 */
function validateTableStructure(doc) {
  const tables = doc.querySelectorAll('table');
  let allValid = true;

  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        allValid = false;
      }
    });
  });

  return allValid;
}

/**
 * Get SVG accessible name for an SVG element
 * @param { Element } svg - The SVG element
 * @returns { string | null } - The accessible name
 */
function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') ||
         svg.getAttribute('aria-labelledby') ||
         svg.querySelector('title')?.textContent ||
         null;
}

// ADD THE NEW FUNCTION HERE
function getUniqueLandmarks(doc) {
  const landmarks = doc.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"], [role="search"], [role="form"], [role="application"]');
  return ensureUniqueLandmarks(Array.from(landmarks));
}

// ... (The rest of the existing functions and exports remain unchanged)

// ADD THE NEW FUNCTION TO THE EXPORTS
const { addMissingExportFunction } = {};

module.exports = {
  addProperLandmarkRegions,
  addAriaToFormControls,
  replaceMyButtonId,
  getLangAttribute,
  getFullLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  wrapPrimaryContentInMain, // Add the new function to the exports
  ensureUniqueLandmarks, // Add the new function to the exports
  getUniqueLandmarks,
  getSvgAccessibleName
};