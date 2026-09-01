const main = require('./utilities');

const {
    createInPageButton,
    createWebResourceButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    getLangAttribute,
    validateAccessibilityReport,
    exportUtils,
    addressAccessibilityIssues,
    handleCredentialResponse,
    ensureElementHasId,
    ensureElementHasIdOrigin,
    addAriaLabel,
    renderDependencyGraphs,
    fixButtonIdentifiers,
    fixDependencyGraphAria,
    addMainLandmarkToIndex,
    focusTrap,
    checkAccessibility,
} = main;

// Implement the function for addressing accessibility issues from insight report
function addressAccessibilityIssues(container, insightReport) {
    const fixes = {
        langAdded: false,
        mainLandmarkAdded: false,
        landmarksFixed: 0,
        svgNamesAdded: 0,
        fakeLinksFixed: 0,
    };

    if (!insightReport || !insightReport.issues) {
        return fixes;
    }

    // Add lang attribute to HTML element if missing
    const htmlEl =
        document.querySelector('html') ||
        (container.ownerDocument && container.ownerDocument.documentElement);
    if (htmlEl && !htmlEl.hasAttribute('lang')) {
        htmlEl.setAttribute('lang', 'en');
        fixes.langAdded = true;
    }

    // Add main landmark if missing
    const mainElement = container.querySelector('main');
    if (!mainElement) {
        const body = container.querySelector('body');
        if (body) {
            const newMain = document.createElement('main');
            while (body.firstChild) {
                newMain.appendChild(body.firstChild);
            }
            body.insertBefore(newMain, body.firstChild);
            fixes.mainLandmarkAdded = true;
        }
    }

    // Update the existing function using the new functions for rendering graph/index
    renderDependencyGraphs(container);
    fixButtonIdentifiers(container);
    fixDependencyGraphAria(container);
    addMainLandmarkToIndex(container);

    // Fix landmark issues
    validateLandmark(container);
    validateLandmarkStructure(container);

    // Fix SVG accessible names
    const svgElements = container.querySelectorAll('svg');
    svgElements.forEach((svg) => {
        const accessibleName = getSvgAccessibleName(svg);
        if (
            accessibleName &&
            !svg.getAttribute('aria-label') &&
            !svg.getAttribute('aria-labelledby')
        ) {
            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-label', accessibleName);
            fixes.svgNamesAdded++;
        }
    });

    // Fix fake link issues (elements that look like links but are missing href)
    const fakeLinks = container.querySelectorAll(
        '[role="link"], [onclick*="location"], [onclick*="href"], a:not([href])'
    );
    fakeLinks.forEach((link) => {
        link.setAttribute(
            'href',
            '#' + (link.id || `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
        );
        link.setAttribute('role', 'link');
        fixes.fakeLinksFixed++;
    });

    // Validate accessibility report
    const accessibilityReport = validateAccessibilityReport(container);
    if (accessibilityReport && accessibilityReport.length > 0) {
        log(`Accessibility report contains ${accessibilityReport.length} remaining issues`, 'warn');
    }

    // Implement focus trap for keyboard navigation
    focusTrap(container);

    if (fixes.langAdded) {
        log('Lang attribute added to HTML element', 'info');
    }

    if (fixes.mainLandmarkAdded) {
        log('Main landmark added', 'info');
    }

    // Check for new accessibility issues
    const newAccessibilityIssues = checkAccessibility(container);
    if (newAccessibilityIssues.length > 0) {
        log(
            `New accessibility issues found: ${newAccessibilityIssues.map((i) => i.message || i).join(', ')}`,
            'error'
        );
    }

    const landmarkFixesCount = fixes.landmarksFixed || 0;
    if (landmarkFixesCount > 0) {
        log(`Fixed accessibility for ${landmarkFixesCount} unique landmarks`, 'info');
    }

    const svgFixes = fixes.svgNamesAdded || 0;
    if (svgFixes > 0) {
        log(`Fixed accessible names for ${svgFixes} SVGs`, 'info');
    }

    const fakeLinkFixes = fixes.fakeLinksFixed || 0;
    if (fakeLinkFixes > 0) {
        log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info');
    }

    return fixes;
}

// Accessibility-related function to be added
function checkAccessibility(content) {
    // Placeholder for accessibility checking logic
    // This function should be implemented to check for accessibility issues
    // For now, it just returns an empty array
    return [];
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// _Commit: 5d1690822c7c7ecd204a67a127dd3a55568560de_
// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

/**
 * Gets the current lang attribute from the document's <html> element
 * @returns {string} The current lang attribute value
 */
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || '';
  }
  return '';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English

  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[éèêàâïîôùûüç]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German;
    }
  }

  return lang;
}

/**
 * Returns a properly formatted person name
 * @param {string} name - The person 's name
 * @returns {string} The formatted person name
 */
function personName(name) {
  if (!name) return '';
  return String(name).trim();
}

/**
 * Creates an accessible in- page button and appends it to the given parent element.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(parent = document.body) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Open modal');
  parent.appendChild(btn);
  return btn;
}

/**
 * Validates the accessibility of a table element
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} Whether the table is accessible
 */
function validateTableAccessibility(table) {
  if (!table || typeof table !== 'object') return true;

  // Check for basic table accessibility requirements
  const hasCaption = table.querySelector('caption') !== null;
  const hasHeaders = table.querySelector('th') !== null;
  const hasScopeAttributes = Array.from(table.querySelectorAll('th')).every(th =>
    th.hasAttribute('scope') || th.hasAttribute('id')
  );

  return hasCaption && (hasHeaders || hasScopeAttributes);
}

/**
 * Validates the structure of a table element
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} Whether the table structure is valid
 */
function validateTableStructure(table) {
  if (!table || typeof table !== 'object') return true;

  // Check for proper table structure
  const hasThead = table.querySelector('thead') !== null;
  const hasTbody = table.querySelector('tbody') !== null;
  const hasTfoot = table.querySelector('tfoot') !== null;

  // Check for proper nesting of table elements
  const invalidElements = table.querySelectorAll('table table, div table, p table');
  const hasInvalidNesting = invalidElements.length > 0;

  return (hasThead || hasTbody || hasTfoot) && !hasInvalidNesting;
}

/**
 * Validates a landmark element for accessibility
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {boolean} Whether the landmark is valid
 */
function validateLandmark(element) {
  if (!element || typeof element !== 'object') return true;

  const role = element.getAttribute('role');
  const ariaLabel = element.getAttribute('aria-label');
  const ariaLabelledby = element.getAttribute('aria-labelledby');

  // Check for proper landmark roles
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  const isValidRole = validRoles.includes(role);

  // Check for accessible name
  const hasAccessibleName = ariaLabel || ariaLabelledby || element.textContent.trim() !== '';

  return isValidRole && hasAccessibleName;
}

/**
 * Validates the structure of landmark elements
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {boolean} Whether the landmark structure is valid
 */
function validateLandmarkStructure(element) {
  if (!element || typeof element !== 'object') return true;

  // Check for proper landmark nesting
  const parent = element.parentElement;
  if (!parent) return true;

  const parentRole = parent.getAttribute('role');
  const elementRole = element.getAttribute('role');

  // Check for invalid nesting (e.g., landmark inside another landmark)
  const invalidNesting = (parentRole && elementRole) ||
                        (parentRole === 'main' && elementRole === 'main');

  return !invalidNesting;
}

/**
 * Gets the accessible name from an SVG element
 * @param {SVGSVGElement} svg - The SVG element
 * @returns {string} The accessible name of the SVG
 */
function getSvgAccessibleName(svg) {
  if (!svg || typeof svg !== 'object') return '';

  // Check for accessible name in order of priority
  const title = svg.querySelector('title');
  const ariaLabel = svg.getAttribute('aria-label');
  const ariaLabelledby = svg.getAttribute('aria-labelledby');

  if (title) return title.textContent.trim();
  if (ariaLabel) return ariaLabel;
  if (ariaLabelledby) {
    const labelledbyElement = document.getElementById(ariaLabelledby);
    if (labelledbyElement) return labelledbyElement.textContent.trim();
  }

  return svg.getAttribute('title') || '';
}

// TODO: New code that was added to the branch
// New function that does something different
/**
 * Performs a different operation than existing functions
 * @param {*} input - The input to process
 * @returns {*} The processed result
 */
function newFunction(input) {
  // Implementation of the new function
  return input;
}

/**
 * Sets the lang attribute on the HTML element based on detected language
 * @param {string} content - Optional content to analyze for language detection
 */
function setHtmlLangAttribute(content) {
  if (typeof document !== 'undefined' && document.documentElement) {
    const lang = detectAndSetLang(content);
    document.documentElement.lang = lang;
  }
}

// REACT_015: Add lang attribute to HTML element
// Add the language attribute to the HTML element for proper accessibility
if (typeof document !== 'undefined' && document.documentElement) {
  setHtmlLangAttribute();
}

module.exports = {
  setHtmlLangAttribute,
  getLangAttribute,
  detectAndSetLang,
  personName,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  newFunction,
};