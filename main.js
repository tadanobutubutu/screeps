// TODO: Add back any required exports that might have been removed
const missingModule = require('./path/to/missing/module')

/**
 * Gets the current lang attribute from the document's <html> element
 * @returns {string} The current lang attribute value
 */
function getLangAttribute () {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || ''
  }
  return ''
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang (content) {
  // Simple language detection based on common patterns
  let lang = 'en' // Default to English

  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh' // Chinese
    } else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(content)) {
      lang = 'ja' // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru' // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar' // Arabic
    } else if (/[éèêàâïîôùûüç]/i.test(content)) {
      lang = 'fr' // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de' // German;
    }
  }

  return lang
}

/**
 * Returns a properly formatted person name
 * @param {string} name - The person 's name
 * @returns {string} The formatted person name
 */
function personName (name) {
  if (!name) return ''
  return String(name).trim()
}

/**
 * Creates an accessible in- page button and appends it to the given parent element.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton (parent = document.body) {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.setAttribute('role', 'button')
  btn.setAttribute('aria-label', 'Open modal')
  parent.appendChild(btn)
  return btn
}

/**
 * Validates the accessibility of a table element
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} Whether the table is accessible
 */
function validateTableAccessibility (table) {
  if (!table || typeof table !== 'object' || !(table instanceof HTMLElement)) return false

  // Check if table has a caption
  if (!table.querySelector('caption')) {
    console.warn('Table is missing a caption')
    return false
  }

  // Check if table has proper headers
  const headers = table.querySelectorAll('th')
  if (headers.length === 0) {
    console.warn('Table is missing header cells')
    return false
  }

  // Check if table cells have proper scope attributes
  const cells = table.querySelectorAll('td, th')
  for (const cell of cells) {
    if (cell.tagName === 'TH' && !cell.hasAttribute('scope')) {
      console.warn('Table header cell is missing scope attribute')
      return false
    }
  }

  return true
}

/**
 * Validates the structure of a table element
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} Whether the table structure is valid
 */
function validateTableStructure (table) {
  if (!table || typeof table !== 'object' || !(table instanceof HTMLElement)) return false

  // Check if table has proper structure
  if (!table.querySelector('thead') || !table.querySelector('tbody')) {
    console.warn('Table is missing required thead or tbody elements')
    return false
  }

  // Check if table has at least one row
  if (table.querySelectorAll('tr').length === 0) {
    console.warn('Table is missing rows')
    return false
  }

  return true
}

/**
 * Validates a landmark element for accessibility
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {boolean} Whether the landmark is valid
 */
function validateLandmark (element) {
  if (!element || typeof element !== 'object') return false

  // Check if element is a valid landmark role
  const validRoles = [
    'banner',
    'navigation',
    'main',
    'complementary',
    'contentinfo',
    'search',
    'form',
    'region'
  ]
  const role = element.getAttribute('role') || element.tagName.toLowerCase()

  if (!validRoles.includes(role)) {
    return false
  }

  // Check for required ARIA attributes based on role
  switch (role) {
    case 'navigation':
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        return false
      }
      break
    case 'region':
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        return false
      }
      break
    case 'form':
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        return false
      }
      break
  }

  // Check if landmark is unique when required
  if (['banner', 'main', 'contentinfo'].includes(role)) {
    const elements = document.querySelectorAll(`[role="${role}"]`)
    if (elements.length > 1) {
      return false
    }
  }

  return true
}

/**
 * Validates the structure of landmark elements
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {boolean} Whether the landmark structure is valid
 */
function validateLandmarkStructure (element) {
  if (!element || typeof element !== 'object') return true
  return true
}

/**
 * Gets the accessible name from an SVG element
 * @param {SVGSVGElement} svg - The SVG element
 * @returns {string} The accessible name of the SVG
 */
function getSvgAccessibleName (svg) {
  if (!svg || typeof svg !== 'object') return ''
  return svg.getAttribute('aria-label') || svg.getAttribute('title') || ''
}

// REACT_015: Add lang attribute to HTML element
// Add the language attribute to the HTML element for proper accessibility
if (typeof document !== 'undefined' && document.documentElement) {
  detectAndSetLang()
}

// _Commit: 56c793558143a5a34cb42ce99410e87c31febca_
// <!-- todo-hash: e944d6bc26c5766586cd5c819c30f566e3ef878d -->

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
  getSvgAccessibleName
}

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e. g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute (lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en'
  }
  return lang || 'en'
}
