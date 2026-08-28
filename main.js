// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and wrapPrimaryContentInMain())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and addAriaLabel())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

/**
 * Get the language attribute value for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
    return document.documentElement.lang || 'en';
}

/**
 * Get the full lang attribute including region
 * @param { Document } doc - The document object to operate on
 * @returns { string } The full language code
 */
function getFullLangAttribute(doc) {
  return doc.documentElement.lang || 'en-US';
}

/**
 * Create an accessible in-page navigation button
 * @param {string} targetId - The ID of the target element
 * @param {string} label - The accessible label for the button
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(targetId, label) {
    const button = document.createElement('button');
    button.setAttribute('aria-label', label);
    button.setAttribute('type', 'button');
    button.onclick = () => {
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            target.setAttribute('tabindex', '-1');
            target.focus();
        }
    };
    return button;
}

/**
 * Create an accessible link element
 * @param { string } href - The href attribute
 * @param { string } text - The link text
 * @param { Document } doc - The document object
 * @returns { HTMLAnchorElement } The created link
 */
function createAccessibleLink(href, text, doc) {
  const link = doc.createElement('a');
  link.href = href;
  link.textContent = text;
  return link;
}

/**
 * Create an accessible in-page button
 * @param { string } text - The button text
 * @param { Document } doc - The document object
 * @returns { HTMLButtonElement } The created button
 */
function createInPageButton(text, doc) {
  const button = doc.createElement('button');
  button.textContent = text;
  button.id = button.id || `button-${Date.now()}`;
  return button;
}

/**
 * Validate table accessibility
 * @param {HTMLTableElement} table - The table to validate
 * @returns {boolean} True if the table is accessible
 */
function validateTableAccessibility(table) {
    const hasCaption = table.querySelector('caption') !== null;
    const hasHeaders = table.querySelector('th') !== null;
    return hasCaption && hasHeaders;
}

/**
 * Validate table structure for accessibility
 * @param {HTMLTableElement} table - The table to validate
 * @returns {Object} Validation result with issues
 */
function validateTableStructure(table) {
    const issues = [];
    const rows = table.querySelectorAll('tr');
    const firstRowCells = rows[0] ? rows[0].querySelectorAll('th, td') : [];
    const hasHeaderCells = firstRowCells.length > 0 && Array.from(firstRowCells).some(cell => cell.tagName === 'TH');
    
    if (!table.querySelector('caption')) {
        issues.push('Missing caption element');
    }
    
    if (!hasHeaderCells && table.querySelector('th')) {
        issues.push('Header cells should be in first row');
    }
    
    return { valid: issues.length === 0, issues };
}

/**
 * Get SVG accessible name
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
    const title = svg.querySelector('title');
    const ariaLabel = svg.getAttribute('aria-label');
    const describedBy = svg.getAttribute('aria-describedby');
    
    if (ariaLabel) {
        return ariaLabel;
    }
    
    if (title) {
        return title.textContent;
    }
    
    if (describedBy) {
        const describedElement = svg.ownerDocument
          ? svg.ownerDocument.getElementById(describedBy)
          : null;
        return describedElement ? describedElement.textContent : '';
    }
    
    return '';
}

/**
 * Set SVG accessibility attributes
 * @param {SVGElement} svg - The SVG element
 * @param {string} name - The accessible name to set
 */
function setSvgAttributes(svg, name) {
    if (!svg.getAttribute('role')) {
        svg.setAttribute('role', 'img');
    }
    if (!svg.querySelector('title')) {
        const title = document.createElement('title');
        title.textContent = name;
        svg.insertBefore(title, svg.firstChild);
    }
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
        svg.setAttribute('aria-label', name);
    }
}

/**
 * Ensure landmarks are unique in the document
 * @param { NodeList | Array } landmarks - The landmarks to check
 * @returns {Object} Information about landmark issues
 */
function ensureUniqueLandmarks(landmarks) {
  const seen = new Map();
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (role && seen.has(role)) {
      landmark.removeAttribute('role');
    } else if (role) {
      seen.set(role, landmark);
    }
  });
}

/**
 * Create an accessible link element
 * @param { string } href - The href attribute
 * @param { string } text - The link text
 * @param { Document } doc - The document object
 * @returns { HTMLAnchorElement } The created link
 */
function createAccessibleLink(href, text, doc) {
  const link = doc.createElement('a');
  link.href = href;
  link.textContent = text;
  return link;
}

/**
 * Create an in-page button element
 * @param { string } text - The button text
 * @param { Document } doc - The document object
 * @returns { HTMLButtonElement } The created button
 */
function createInPageButton(text, doc) {
  const button = doc.createElement('button');
  button.textContent = text;
  button.id = button.id || `button-${Date.now()}`;
  return button;
}

// ... (The rest of the existing functions and exports remain unchanged)

// ADD THE NEW FUNCTION TO THE EXPORTS
const { addressAccessibilityIssuesFromInsightReport,
  addProperLandmarkRegions,
  addAriaToFormControls,
  replaceMyButtonId,
  getLangAttribute,
  getFullLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  wrapPrimaryContentInMain,
  ensureUniqueLandmarks,
  createInPageButton,
  createAccessibleLink,
  getSvgAccessibleName,
  addFixLandmarkIssues,
  fixFakeLinkIssues,
  findIndex,
  filterLandmarks: originalFilterLandmarks,
  sortLandmarksByName: originalSortLandmarksByName,
  addRequiredLandmarks: originalAddRequiredLandmarks,
  addressAccessibilityIssues,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  resolveConflicts
};

module.exports = {
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions
};