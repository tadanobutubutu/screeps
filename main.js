// TODO: Add back any required exports that might have been removed
// TODO: Identify and update specific functions as needed
// Main module
// Dependency imports
const http = require('http');
const url = require('url');
const { dependencyGraphContent } = require('./utilities');
const { indexContent } = require('./utilities');
const { addLangAttribute, fixTableStructureIssues, addMainLandmark, ensureUniqueLandmarks, setSvgAccessibilityProps, addAccessibleNamesToSVGs, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, fixLandmarkIssues, addLandmarkRegions, uniqueLandmarks, fixImageAltTexts, googleSignIn, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, addressAccessibilityIssues } = require('./utilities');
const { createInPageButton, createWebResourceButton, validateLandmark, validateLandmarkStructure, validateAccessibilityReport } = require('./utilities');

/**
 * Validates and fixes table structure accessibility issues.
 * Handles REACT_027 - Fix 26 table structure issues
 */
function validateTableStructure() {
    const tables = document.querySelectorAll('table');

    tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        const firstRow = rows[0];

        if (!firstRow) return;

        // Get all header cells in the first row to determine column count
        const firstRowThs = firstRow.querySelectorAll('th');
        const firstRowTds = firstRow.querySelectorAll('td');
        const firstRowHeaders = [...firstRowThs, ...firstRowTds];
        const columnCount = firstRowHeaders.length;

        rows.forEach((row, rowIndex) => {
            const ths = row.querySelectorAll('th');
            const tds = row.querySelectorAll('td');
            const allCells = [...ths, ...tds];

            allCells.forEach((cell, cellIndex) => {
                if (cell.tagName === 'TH' && !cell.hasAttribute('scope')) {
                    const isFirstRow = rowIndex === 0;
                    const isFirstCell = cellIndex === 0;

                    // First row cells are column headers
                    if (isFirstRow) {
                        cell.setAttribute('scope', 'col');
                    }
                    // First cell in subsequent rows are row headers
                    else if (isFirstCell) {
                        cell.setAttribute('scope', 'row');
                    }
                }
            });
        });
    });
}

/**
 * Main entry point for table accessibility validation.
 * Calls validateTableStructure() to fix all table scope attribute issues.
 */
function validateTableAccessibility () {
  validateTableStructure()
}

/**
 * Adds lang attribute to HTML element
 * Handles REACT_015
 */
function getLangAttribute() {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
        htmlElement.setAttribute('lang', 'en'); // Default to English
    }
}

/**
 * Validates and fixes landmark issues
 * Handles REACT_017
 */
function validateLandmark() {
    const main = document.querySelector('main');
    if (!main) {
        const body = document.querySelector('body');
        const mainElement = document.createElement('main');
        body.prepend(mainElement);
    }

    const header = document.querySelector('header');
    if (!header) {
        const body = document.querySelector('body');
        const headerElement = document.createElement('header');
        body.prepend(headerElement);
    }
}

/**
 * Validates landmark structure
 * Handles REACT_017
 */
function validateLandmarkStructure() {
    validateLandmark();
}

/**
 * Adds accessible names to SVGs
 * Handles REACT_041
 */
function getSvgAccessibleName() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
        if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
            svg.setAttribute('aria-label', `SVG graphic ${index + 1}`);
        }
    });
}

/**
 * Sets SVG attributes for accessibility
 * Handles REACT_041
 */
function setSvgAttributes() {
    getSvgAccessibleName();
}

/**
 * Creates in-page button with proper accessibility attributes
 * Handles REACT_036
 */
function createInPageButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', text);
    return button;
}

/**
 * Validates link accessibility
 * Handles REACT_036
 */
function validateLinkAccessibility() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        if (!link.hasAttribute('aria-label') && !link.textContent.trim()) {
            link.setAttribute('aria-label', 'Link');
        }
    });
}

/**
 * Handles fake links by converting them to proper buttons
 * Handles REACT_036
 */
function handleFakeLinks() {
    const fakeLinks = document.querySelectorAll('a[href="javascript:void(0)"]');
    fakeLinks.forEach(link => {
        const button = createInPageButton(link.textContent, () => {
            // Maintain any existing click handlers
            if (link.onclick) {
                link.onclick();
            }
        });
        link.replaceWith(button);
    });
}

// TODO: Ensure unique landmarks (DONE: ensureUniqueLandmarks)

/**
 * Ensures unique landmarks (DONE: ensureUniqueLandmarks)
 * This function addresses REACT_025 from the accessibility insight report
 */
function ensureUniqueLandmarks (landmarksArray) {
  if (!Array.isArray(landmarksArray)) {
    return []
  }

  const seen = new Set()
  const uniqueLandmarks = []

  for (const landmark of landmarksArray) {
    const key = `${landmark.name}-${landmark.location}`
    if (!seen.has(key)) {
      seen.add(key)
      uniqueLandmarks.push(landmark)
    }
  }
  
  return issues;
};

  return uniqueLandmarks
}

/**
 * Validates landmark structure for accessibility.
 * Ensures proper landmark roles and hierarchy.
 */
function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="region"], [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  
  landmarks.forEach(landmark => {
    if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
      landmark.setAttribute('aria-label', landmark.tagName);
    }
  });
}

/**
 * Main entry point for landmark accessibility validation.
 * Calls ensureUniqueLandmarks() and validateLandmarkStructure()
 */
function validateLandmarks() {
  // Ensure unique landmarks data
  const uniqueLandmarkData = ensureUniqueLandmarks(landmarks);
  
  // Validate landmark structure in DOM
  validateLandmarkStructure();
  
  return uniqueLandmarkData;
}

/**
 * Gets the lang attribute for the HTML element
 * Handles REACT_015: Add lang attribute to HTML element
 */
function getLangAttribute() {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
        htmlElement.setAttribute('lang', 'en');
    }
}

/**
 * Wraps primary content in a main element for better landmark structure
 * Handles REACT_017: Add/fix landmark issues
 */
function wrapPrimaryContentInMain() {
    const body = document.querySelector('body');
    if (body) {
        const main = document.createElement('main');
        while (body.firstChild) {
            main.appendChild(body.firstChild);
        }
        body.appendChild(main);
    }
}

/**
 * Validates landmark structure
 * Handles REACT_017: Add/fix landmark issues
 */
function validateLandmark() {
    const main = document.querySelector('main');
    if (!main) {
        wrapPrimaryContentInMain();
    }
}

/**
 * Validates landmark structure
 * Handles REACT_017: Add/fix landmark issues
 */
function validateLandmarkStructure() {
    validateLandmark();
}

/**
 * Gets accessible name for SVG elements
 * Handles REACT_041: Add accessible names to SVGs
 */
function getSvgAccessibleName(svgElement) {
    if (!svgElement) return '';

    // Check for aria-label or aria-labelledby first
    if (svgElement.hasAttribute('aria-label')) {
        return svgElement.getAttribute('aria-label');
    }
    if (svgElement.hasAttribute('aria-labelledby')) {
        const id = svgElement.getAttribute('aria-labelledby');
        const labelElement = document.getElementById(id);
        return labelElement ? labelElement.textContent : '';
    }

    // Fallback to title or description
    const title = svgElement.querySelector('title');
    if (title) return title.textContent;

    const desc = svgElement.querySelector('desc');
    if (desc) return desc.textContent;

    return '';
}

/**
 * Sets SVG attributes for better accessibility
 * Handles REACT_041: Add accessible names to SVGs
 */
function setSvgAttributes() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        const name = getSvgAccessibleName(svg);
        if (!name) {
            // Add a title if none exists
            if (!svg.querySelector('title')) {
                const title = document.createElement('title');
                title.textContent = 'Graphic element';
                svg.prepend(title);
            }
        }
    });
}

/**
 * Creates an accessible in-page button
 * Handles REACT_036: Fix fake link issues
 */
function createInPageButton() {
    const buttons = document.querySelectorAll('a[role="button"]');
    buttons.forEach(button => {
        if (!button.hasAttribute('tabindex')) {
            button.setAttribute('tabindex', '0');
        }
    });
}

/**
 * Validates link accessibility
 * Handles REACT_036: Fix fake link issues
 */
function validateLinkAccessibility() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        if (!link.hasAttribute('href') && !link.hasAttribute('role')) {
            link.setAttribute('role', 'button');
        }
    });
}

/**
 * Handles fake link issues
 * Handles REACT_036: Fix fake link issues
 */
function handleFakeLinks() {
    createInPageButton();
    validateLinkAccessibility();
}

module.exports = {
  ensureUniqueLandmarks,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarks,
  validateLandmarkStructure,
  landmarks,
  uniqueLandmarks,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks
};