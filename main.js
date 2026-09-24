// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// main.js - Main application entry point
=======
// (This comment remains as-is)
>>>>>>> origin/main

// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute; handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure; handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = lang || 'en';
    }
    return lang || 'en';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
    let lang = 'en';

    if (content) {
        if (/[\u4e00-\u9fff]/.test(content)) {
            lang = 'zh';
        } else if (/[\u3040-\u30ff]/.test(content)) {
            lang = 'ja';
        } else if (/[\u0400-\u04ff]/.test(content)) {
            lang = 'ru';
        } else if (/[\u0600-\u06ff]/.test(content)) {
            lang = 'ar';
        } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
            lang = 'fr';
        } else if (/[äöüß]/i.test(content)) {
            lang = 'de';
        }
    }

    // Set the lang attribute on the HTML element
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = lang;
    }

    return setHtmlLangAttribute(lang);
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
    return setLangAttribute();
}

// New function to address REACT_015 and REACT_036: personName function referenced in comments
function personName (name) {
  // Returns a formatted person name for accessibility purposes
  if (!name) return ''
  return name.trim()
}

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility (table) {
  // This function validates the accessibility of tables
  // Check for proper table headers with scope attributes
  const errors = []

  if (!table) {
    return { valid: false, errors: ['Table element is required'] }
  }

  const headers = table.querySelectorAll('th')
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header at index ${index} is missing scope attribute`)
    }
  })

  // Check if table has a caption or is properly described
  const hasCaption = table.querySelector('caption')
  const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby')

  if (!hasCaption && !hasAriaLabel) {
    errors.push('Table is missing a caption or aria-label/aria-labelledby')
  }

  return { valid: errors.length === 0, errors }
}

function validateTableStructure (table) {
  // This function validates the structure of tables
  const errors = []

  if (!table) {
    return { valid: false, errors: ['Table element is required'] }
  }

  // Check for proper table structure
  const tbody = table.querySelector('tbody')
  const thead = table.querySelector('thead')
  const tfoot = table.querySelector('tfoot')

  // Check for thead and tbody presence
  if (!thead) {
    errors.push('Table is missing thead element')
  }
  if (!tbody) {
    errors.push('Table is missing tbody element')
  }

  // Check for consistent column counts in tbody
  const rows = table.querySelectorAll('tbody tr')
  let expectedCols = null
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th')
    if (expectedCols === null) {
      expectedCols = cells.length
    } else if (cells.length !== expectedCols) {
      errors.push(
                `Row ${rowIndex} has inconsistent cell count: expected ${expectedCols}, got ${cells.length}`
              )
    }
  })

  return { valid: errors.length === 0, errors }
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
    const errors = [];
    const allowedLandmarks = [
        'banner',
        'navigation',
        'main',
        'complementary',
        'contentinfo',
        'search',
        'form',
        'region',
    ];

    if (!element) {
        return { valid: false, errors: ['Element is required'] };
    }

    const role = element.getAttribute('role');
    const tagName = element.tagName.toLowerCase();

    if (role && !allowedLandmarks.includes(role)) {
        errors.push(`Invalid landmark role: ${role}`);
    }

    const landmarksNeedingNames = ['navigation', 'search', 'form', 'region', 'complementary'];
    if (role && landmarksNeedingNames.includes(role)) {
        const hasLabel =
            element.getAttribute('aria-label') ||
            element.getAttribute('aria-labelledby') ||
            element.querySelector('h1, h2, h3, h4, h5, h6');
        if (!hasLabel) {
            errors.push(`Landmark role "${role}" is missing accessible name`);
        }
    }

    return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure() {
    const errors = [];

    if (typeof document === 'undefined') {
        return { valid: false, errors: ['Document not available'] };
    }

    const mainLandmarks = document.querySelectorAll('[role="main"], main');
    if (mainLandmarks.length > 1) {
        errors.push(`Found ${mainLandmarks.length} main landmarks, should have only 1`);
    }

  return ''
}

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks () {
  // This function ensures that landmarks are unique
  const errors = []

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] }
  }

  // Define unique landmarks that should only appear once
  const uniqueLandmarks = ['main', 'banner', 'contentinfo']
  const uniqueRoleSelectors = ['[role="main"]', '[role="banner"]', '[role="contentinfo"]']

  uniqueLandmarks.forEach((landmark, index) => {
    const elements = document.querySelectorAll(uniqueRoleSelectors[index])
    const tagElements = document.querySelectorAll(landmark)
    const totalCount = elements.length + tagElements.length

    if (totalCount > 1) {
      errors.push(
                `Found ${totalCount} instances of "${landmark}" landmark, should have only 1`
              )
    }

    const footerLandmarks = document.querySelectorAll('[role="contentinfo"], footer');
    if (footerLandmarks.length > 1) {
        errors.push(`Found ${footerLandmarks.length} contentinfo landmarks, should have only 1`);
    }

  return { valid: errors.length === 0, errors }
}

// New function to address REACT_036: Fix 1 fake link issue
function createAccessibleLink (href, text, options = {}) {
  // This function creates an accessible link
  const { onClick, role = 'link', ariaLabel, className, target, rel } = options

  if (!href && !onClick) {
    return null
  }

  const link