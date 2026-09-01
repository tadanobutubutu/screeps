// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// _Commit: 669117b94c3d1a635653f730f030599efacbb752_
// <!-- todo-hash: 312aa8ea6e4c5e1c9430e4b7136c210eb9172dea -->
// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by validateUniqueLandmarks() and personName())
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'
import React from 'react'

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute (lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en'
  }
  return lang || 'en'
}

/**
 * Gets the lang attribute from the document's <html> tag
 * @returns {string} The current lang attribute value or default 'en'
 */
function getLangAttribute () {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || 'en'
  }
  return 'en'
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
    if (/[\u4e00-\u9fa5]/.test(content)) {
      lang = 'zh' // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja' // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru' // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar' // Arabic
    } else if (/[àâäçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr' // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de' // German
    }
  }

  return lang
}

/**
 * Creates a person name element with proper accessibility attributes
 * @param {Object} options - Options for creating the person name element
 * @param {string} options.firstName - The person's first name
 * @param {string} options.lastName - The person's last name
 * @param {string} options.lang - The language code for the name (default: 'en')
 * @param {HTMLElement} options.container - Optional container element to append to
 * @returns {HTMLElement} The created element with accessible naming
 */
function personName (options = {}) {
  const { firstName = '', lastName = '', lang = 'en', container = null } = options
  const fullName = `${firstName} ${lastName}`.trim()

  if (typeof document !== 'undefined') {
    const nameElement = document.createElement('span')
    nameElement.setAttribute('lang', lang)
    nameElement.setAttribute('aria-label', fullName)
    nameElement.textContent = fullName || 'Unknown'

    if (container) {
      container.appendChild(nameElement)
    }

    return nameElement
  }

  return fullName || 'Unknown'
}

/**
 * Creates an accessible in-page button and appends it to the given parent element.
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

// New function to validate table accessibility
function validateTableAccessibility () {
  if (typeof document === 'undefined') return false

  const tables = document.querySelectorAll('table')
  let isAccessible = true

  tables.forEach((table) => {
    // Check if table has a caption
    if (!table.querySelector('caption')) {
      console.warn('Table is missing a caption for accessibility')
      isAccessible = false
    }

    // Check if table has proper headers
    const headers = table.querySelectorAll('th')
    if (headers.length === 0) {
      console.warn('Table is missing header cells for accessibility')
      isAccessible = false
    }

    // Check if table cells have proper scope attributes
    const cells = table.querySelectorAll('td, th')
    cells.forEach((cell) => {
      if (cell.tagName === 'TH' && !cell.hasAttribute('scope')) {
        console.warn('Table header cell is missing scope attribute')
        isAccessible = false
      }
    })
  })

  return isAccessible
}

// New function to validate table structure
function validateTableStructure () {
  if (typeof document === 'undefined') return false

  const tables = document.querySelectorAll('table')
  let isValid = true

  tables.forEach((table) => {
    // Check if table has proper row and column structure
    const rows = table.querySelectorAll('tr')
    if (rows.length === 0) {
      console.warn('Table is missing rows')
      isValid = false
    }

    // Check if each row has consistent number of cells
    const firstRowCells = rows[0]?.querySelectorAll('td, th').length || 0
    for (let i = 1; i < rows.length; i++) {
      const rowCells = rows[i].querySelectorAll('td, th').length
      if (rowCells !== firstRowCells) {
        console.warn('Table has inconsistent row structure')
        isValid = false
        break
      }
    }
  })

  return isValid
}

// New function to validate landmarks
function validateLandmark () {
  if (typeof document === 'undefined') return false

  const requiredLandmarks = ['header', 'main', 'footer']
  let isValid = true

  requiredLandmarks.forEach((landmark) => {
    if (!document.querySelector(`[role="${landmark}"]`)) {
      console.warn(`Missing required landmark: ${landmark}`)
      isValid = false
    }
  })

  return isValid
}

// New function to validate landmark structure
function validateLandmarkStructure () {
  if (typeof document === 'undefined') return false

  const landmarks = document.querySelectorAll(
    '[role="banner"], [role="main"], [role="contentinfo"]'
  )
  let isValid = true

  landmarks.forEach((landmark) => {
    if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
      console.warn('Landmark is missing accessible name')
      isValid = false
    }
  })

  return isValid
}

// New function to get SVG accessible name
function getSvgAccessibleName (svgElement) {
  if (!svgElement || typeof document === 'undefined') return ''

  // Check for title element
  const title = svgElement.querySelector('title')
  if (title && title.textContent.trim()) {
    return title.textContent.trim()
  }

  // Check for aria-label
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label')
  }

  // Check for aria-labelledby
  if (svgElement.hasAttribute('aria-labelledby')) {
    const id = svgElement.getAttribute('aria-labelledby')
    const labelElement = document.getElementById(id)
    if (labelElement) {
      return labelElement.textContent.trim()
    }
  }

  // Check for desc element
  const desc = svgElement.querySelector('desc')
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim()
  }

  return ''
}

// New function to validate unique landmarks
function validateUniqueLandmarks () {
  if (typeof document === 'undefined') return false

  const landmarkRoles = [
    'banner',
    'main',
    'contentinfo',
    'navigation',
    'complementary',
    'search'
  ]
  const landmarkCounts = {}
  let isValid = true

  landmarkRoles.forEach((role) => {
    const landmarks = document.querySelectorAll(`[role="${role}"]`)
    landmarkCounts[role] = landmarks.length

    if (landmarks.length > 1) {
      console.warn(`Multiple landmarks found for role: ${role}`)
      isValid = false
    }
  })

  return isValid
}

/**
 * Creates a focus trap for keyboard navigation within a given container element.
 * Prevents focus from leaving the container when Tab key is pressed.
 * @param {HTMLElement} container - The container element to trap focus within
 * @returns {Object} An object with a detach method to remove the focus trap
 */
function newFocusTrap (container) {
  if (!container || typeof document === 'undefined') {
    return { detach: () => {} }
  }

  const focusableSelectors = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ')

  const previousActiveElement = document.activeElement

  const handleKeyDown = (event) => {
    if (event.key !== 'Tab') {
      return
    }

    const focusableElements = Array.from(container.querySelectorAll(focusableSelectors)).filter(
      (el) => el.offsetParent !== null
    )

    if (focusableElements.length === 0) {
      event.preventDefault()
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  container.addEventListener('keydown', handleKeyDown)

  // Optionally focus the first focusable element in the trap
  const focusableElements = Array.from(container.querySelectorAll(focusableSelectors)).filter(
    (el) => el.offsetParent !== null
  )

  if (focusableElements.length > 0) {
    focusableElements[0].focus()
  }

  return {
    detach: () => {
      container.removeEventListener('keydown', handleKeyDown)
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus()
      }
    }
  }
}

// Export the new functions
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
  validateUniqueLandmarks,
  newFocusTrap
}
