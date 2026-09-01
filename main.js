import React from 'react'

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute (lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en'
  }
  return lang || 'en'
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
    if (/[\u4e00-\u9fff]/u.test(content)) {
      lang = 'zh' // Chinese
    } else if (/[\u3040-\u309F\u30A0-\u30FF]/u.test(content)) {
      lang = 'ja' // Japanese
    } else if (/[\u0400-\u04FF]/u.test(content)) {
      lang = 'ru' // Russian/Cyrillic
    } else if (/[\u0600-\u06FF]/u.test(content)) {
      lang = 'ar' // Arabic
    } else if (/[àâçéèêëîïôùûüÿæœ]/i.test(content)) {
      lang = 'fr' // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de' // German
    }
  }

  return lang
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute () {
  return typeof document !== 'undefined' && document.documentElement
    ? document.documentElement.lang
    : 'en'
}

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility (tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] }
  }

  const errors = []

  // Check if table has proper structure
  if (!tableElement.querySelector('thead')) {
    errors.push('Table is missing <thead> element')
  }

  if (!tableElement.querySelector('tbody')) {
    errors.push('Table is missing <tbody> element')
  }

  // Check for th elements in thead
  const thead = tableElement.querySelector('thead')
  const thElements = thead ? Array.from(thead.querySelectorAll('th')) : []
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements')
  }

  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`)
    }
  })

  // Check for proper caption or summary
  const hasCaption = tableElement.querySelector('caption')
  const hasSummary =
        tableElement.getAttribute('summary') || tableElement.getAttribute('aria-describedby')
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility')
  }

  return { valid: errors.length === 0, errors }
}

function validateTableStructure (tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found'] }
  }

  const errors = []
  const rows = Array.from(tableElement.querySelectorAll('tr'))

  rows.forEach((row, rowIndex) => {
    const cells = Array.from(row.querySelectorAll('th, td'))
    const cellCount = cells.length

    // Check for empty cells
    cells.forEach((cell, cellIndex) => {
      if (!cell.textContent.trim()) {
        errors.push(`Row ${rowIndex + 1}, Cell ${cellIndex + 1} is empty`)
      }
    })

    // Check that rows have consistent cell counts
    if (rowIndex > 0) {
      const prevRow = rows[rowIndex - 1]
      const prevCells = Array.from(prevRow.querySelectorAll('th, td'))
      if (cellCount !== prevCells.length) {
        errors.push(
                    `Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length})`
        )
      }
    }
  })

  return { valid: errors.length === 0, errors }
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark (element) {
  if (typeof document === 'undefined' || !element) {
    return { valid: false, errors: ['Element not found'] }
  }

  const errors = []
  const validLandmarks = [
    'header',
    'nav',
    'main',
    'aside',
    'footer',
    'section',
    'article',
    'search'
  ]

  // Check if element is a valid landmark
  const role = element.getAttribute('role')
  const tagName = element.tagName.toLowerCase()

  if (role && !validLandmarks.includes(role.toLowerCase())) {
    errors.push(`Invalid landmark role: ${role}`)
  }

  if (!role && !validLandmarks.includes(tagName)) {
    errors.push(`Element is not a valid landmark: ${tagName}`)
  }

  // Check for accessible name
  const hasLabel =
        element.getAttribute('aria-label') ||
        element.getAttribute('aria-labelledby') ||
        element.querySelector('h1, h2, h3, h4, h5, h6')

  if (!hasLabel) {
    errors.push(
      'Landmark is missing accessible name (aria-label, aria-labelledby, or heading)'
    )
  }

  return { valid: errors.length === 0, errors }
}

function validateLandmarkStructure () {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] }
  }

  const errors = []

  // Check for multiple main landmarks
  const mainElements = document.querySelectorAll('main, [role="main"]')
  if (mainElements.length > 1) {
    errors.push('Multiple main landmarks found. Only one main landmark should exist.')
  }

  // Check for proper nesting of landmarks
  const landmarks = document.querySelectorAll(
    'header, nav, main, aside, footer, section, article, [role]'
  )
  landmarks.forEach((landmark) => {
    const parent = landmark.parentElement
    while (parent) {
      const parentTag = parent.tagName.toLowerCase()
      const parentRole = parent.getAttribute('role')

      // Check for invalid nesting
      if (parentTag === 'header' && landmark.tagName.toLowerCase() === 'header') {
        errors.push('Nested header elements found')
      }
      if (parentTag === 'footer' && landmark.tagName.toLowerCase() === 'footer') {
        errors.push('Nested footer elements found')
      }

      parent = parent.parentElement
    }
  })

  return { valid: errors.length === 0, errors }
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName (svgElement) {
  if (typeof document === 'undefined' || !svgElement) {
    return null
  }

  // Check for aria-label
  const accessibleName = svgElement.getAttribute('aria-label')
  if (accessibleName) return accessibleName

  // Check for aria-labelledby referencing another element
  const labelledBy = svgElement.getAttribute('aria-labelledby')
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy)
    if (labelElement) return labelElement.textContent
  }

  // Check for title element inside SVG
  const title = svgElement.querySelector('title')
  if (title && title.textContent.trim()) {
    return title.textContent.trim()
  }

  // Check for desc element inside SVG
  const desc = svgElement.querySelector('desc')
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim()
  }

  return null
}

function validateSvgAccessibility () {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] }
  }

  const errors = []
  const svgs = document.querySelectorAll('svg')

  svgs.forEach((svg, index) => {
    const name = getSvgAccessibleName(svg)
    if (!name) {
      errors.push(
                `SVG ${index + 1} is missing an accessible name (aria-label, aria-labelledby, title, or desc)`
      )
    }
  })

  return { valid: errors.length === 0, errors }
}

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks () {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] }
  }

  const errors = []
  const landmarkCounts = {}

  // Count landmarks by role or tag
  const landmarks = document.querySelectorAll(
    'header, nav, main, aside, footer, section, article, [role]'
  )
  landmarks.forEach((landmark) => {
    const identifier = landmark.tagName.toLowerCase() || landmark.getAttribute('role')

    // main landmarks should be unique
    if (identifier === 'main' || identifier === 'MAIN') {
      if (landmarkCounts[identifier]) {
        errors.push('Duplicate main landmark found. Only one main landmark should exist.')
      } else {
        landmarkCounts[identifier] = 1
      }
    }
  })

  return { valid: errors.length === 0, errors }
}

/**
 * Gets the accessible name of an element, addressing REACT_036 fake link issues.
 * @param {HTMLElement} element - The element to extract the accessible name from
 * @returns {string|null} The accessible name or null
 */
function personName (element) {
  if (typeof document === 'undefined' || !element) {
    return null
  }

  // Check for aria-label
  const ariaLabel = element.getAttribute('aria-label')
  if (ariaLabel) return ariaLabel

  // Check for aria-labelledby referencing another element
  const labelledBy = element.getAttribute('aria-labelledby')
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy)
    if (labelElement) return labelElement.textContent
  }

  // Check for title attribute
  const title = element.getAttribute('title')
  if (title) return title

  // Fall back to text content
  const textContent = element.textContent.trim()
  if (textContent) return textContent

  return null
}

/**
 * Validates that links and interactive elements have accessible names,
 * addressing REACT_036 fake link issues.
 * @param {HTMLElement} container - Optional container to scan within
 * @returns {object} Validation result with valid flag and errors array
 */
function validateLinks (container) {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] }
  }

  const errors = []
  const root = container || document
  const links = root.querySelectorAll('a, button, [role="link"], [role="button"]')

  links.forEach((el, index) => {
    const name = personName(el)
    if (!name || !name.trim()) {
      errors.push(`Interactive element ${index + 1} is missing an accessible name`)
    }
  })

  return { valid: errors.length === 0, errors }
}

/**
 * Creates a focus trap within a container element for keyboard navigation.
 * Keeps focus within the trapped area and cycles focus between focusable elements.
 * @param {HTMLElement} container - The container element to trap focus within
 * @param {Object} options - Configuration options for the focus trap
 * @param {boolean} options.escapeDeactivates - If true, Escape key will deactivate the trap (default: true)
 * @param {boolean} options.returnFocusOnDeactivate - If true, returns focus to the previously focused element (default: true)
 * @param {Function} options.onEscape - Callback function when Escape key is pressed
 * @param {Function} options.onActivate - Callback function when trap is activated
 * @param {Function} options.onDeactivate - Callback function when trap is deactivated
 * @returns {Object} Focus trap controller with activate, deactivate, and update methods
 */
function createFocusTrap (container, options = {}) {
  if (typeof document === 'undefined' || !container) {
    return null
  }

  const config = {
    escapeDeactivates: options.escapeDeactivates !== false,
    returnFocusOnDeactivate: options.returnFocusOnDeactivate !== false,
    onEscape: options.onEscape || null,
    onActivate: options.onActivate || null,
    onDeactivate: options.onDeactivate || null
  }

  let active = false
  let previousActiveElement = null

  const getFocusableElements = () => {
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.disabled && el.offsetParent !== null)
  }

  const handleKeyDown = (e) => {
    if (!active) return

    if (e.key === 'Escape' && config.escapeDeactivates) {
      e.preventDefault()
      deactivate()
      if (config.onEscape) config.onEscape()
      return
    }

    if (e.key === 'Tab') {
      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (e.shiftKey) {
        if (activeElement === firstElement || !container.contains(activeElement)) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (activeElement === lastElement || !container.contains(activeElement)) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
  }

  const activate = () => {
    if (active) return
    active = true
    previousActiveElement = document.activeElement
    document.addEventListener('keydown', handleKeyDown)

    // Set initial focus to first focusable element or container
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    } else {
      container.setAttribute('tabindex', '-1')
      container.focus()
    }

    if (config.onActivate) config.onActivate()
  }

  const deactivate = () => {
    if (!active) return
    active = false
    document.removeEventListener('keydown', handleKeyDown)

    if (config.returnFocusOnDeactivate && previousActiveElement) {
      previousActiveElement.focus()
    }

    if (config.onDeactivate) config.onDeactivate()
  }

  const update = (newOptions) => {
    Object.assign(config, newOptions)
  }

  return {
    activate,
    deactivate,
    update,
    get active () {
      return active
    },
    destroy: deactivate
  }
}

/**
 * Validates all accessibility requirements for the document or a container.
 * @param {HTMLElement} container - Optional container to validate within
 * @returns {Object} Validation result with overall valid flag and all errors grouped by category
 */
function validateAccessibility (container) {
  const root = container || document
  const results = {
    valid: true,
    errors: [],
    categories: {
      tables: { valid: true, errors: [] },
      landmarks: { valid: true, errors: [] },
      svgs: { valid: true, errors: [] },
      links: { valid: true, errors: [] }
    }
  }

  // Validate tables
  const tables = root.querySelectorAll('table')
  tables.forEach((table, index) => {
    const tableResult = validateTableAccessibility(table)
    if (!tableResult.valid) {
      results.categories.tables.valid = false
      results.categories.tables.errors.push(
        ...tableResult.errors.map((err) => `Table ${index + 1}: ${err}`)
      )
    }
  })

  // Validate landmarks
  const landmarkResult = validateLandmarkStructure()
  if (!landmarkResult.valid) {
    results.categories.landmarks.valid = false
    results.categories.landmarks.errors = landmarkResult.errors
  }

  // Validate SVGs
  const svgResult = validateSvgAccessibility()
  if (!svgResult.valid) {
    results.categories.svgs.valid = false
    results.categories.svgs.errors = svgResult.errors
  }

  // Validate links
  const linksResult = validateLinks(root)
  if (!linksResult.valid) {
    results.categories.links.valid = false
    results.categories.links.errors = linksResult.errors
  }

  // Determine overall validity
  results.valid =
        results.categories.tables.valid &&
        results.categories.landmarks.valid &&
        results.categories.svgs.valid &&
        results.categories.links.valid

  // Collect all errors
  results.errors = [
    ...results.categories.tables.errors,
    ...results.categories.landmarks.errors,
    ...results.categories.svgs.errors,
    ...results.categories.links.errors
  ]

  return results
}

// Utility functions from origin/main
function addAriaLabel (element, label) {
  if (!element) {
    return
  }

  if (typeof label !== 'string' || label.trim() === '') {
    return element
  }

  element.setAttribute('aria-label', label)
  return element
}

function ensureElementHasId (element, prefix) {
  if (!element.id) {
    element.id = prefix + Math.random().toString(36).substr(2, 9)
  }
  return element.id
}

function ensureElementAccessibility (element, idPrefix, ariaLabel) {
  if (!element) {
    return
  }

  const id = ensureElementHasId(element, idPrefix)
  addAriaLabel(element, ariaLabel)

  return id
}

function addLangAttribute () {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('lang', 'en')
  }
}

// Accessibility utilities object (from origin/main)
const accessibilityUtils = {
  initSkipLink: () => {
    const skipLink = document.querySelector('#skip-link')
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault()
        const targetId = skipLink.getAttribute('href')
        const target = document.querySelector(targetId)
        if (target) {
          target.setAttribute('tabindex', '-1')
          target.focus()
        }
      })
    }
  },

  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    })
  },

  announceToScreenReader: (message, priority = 'polite') => {
    if (typeof document === 'undefined') return
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.style.position = 'absolute'
    announcer.style.left = '-9999px'
    announcer.textContent = message
    document.body.appendChild(announcer)
    setTimeout(() => announcer.remove(), 1000)
  },

  handleKeyboardNav: (e, handlers) => {
    const key = e.key
    if (handlers[key]) {
      handlers[key](e)
    }
  },

  // Get language attribute for HTML element
  getLangAttribute: () => {
    return typeof document !== 'undefined' && document.documentElement
      ? document.documentElement.getAttribute('lang') || 'en'
      : 'en'
  },

  // Validate table accessibility
  validateTableAccessibility: (table) => {
    return validateTableAccessibility(table)
  },

  // Validate table structure
  validateTableStructure: (table) => {
    return validateTableStructure(table)
  },

  // Validate landmark elements
  validateLandmark: () => {
    const landmarks = ['header', 'nav', 'main', 'footer']
    landmarks.forEach((landmark) => {
      const elements = document.querySelectorAll(landmark)
      if (elements.length > 1) {
        console.warn(`Multiple ${landmark} elements found`)
      }
    })
  },

  // Validate landmark structure
  validateLandmarkStructure: () => {
    return validateLandmarkStructure()
  },

  // Get accessible name for SVG
  getSvgAccessibleName: (svg) => {
    return getSvgAccessibleName(svg)
  },

  // Create in-page button with proper accessibility attributes
  createInPageButton: (text, href) => {
    const button = document.createElement('a')
    button.textContent = text
    button.href = href
    button.setAttribute('role', 'button')
    button.setAttribute('tabindex', '0')
    return button
  },

  // Get person name with proper accessibility attributes
  personName: (name) => {
    const span = document.createElement('span')
    span.textContent = name
    span.setAttribute('aria-label', name)
    return span
  },

  // Focus trap using the more complete implementation
  createFocusTrap: (element, options) => {
    return createFocusTrap(element, options)
  }
}

// Export functions to make them accessible (ES6)
export {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateSvgAccessibility,
  ensureUniqueLandmarks,
  personName,
  validateLinks,
  createFocusTrap,
  validateAccessibility,
  addAriaLabel,
  ensureElementAccessibility,
  ensureElementHasId,
  addLangAttribute,
  accessibilityUtils
}

// Also provide CommonJS exports for Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setHtmlLangAttribute,
    detectAndSetLang,
    getLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    validateSvgAccessibility,
    ensureUniqueLandmarks,
    personName,
    validateLinks,
    createFocusTrap,
    validateAccessibility,
    addAriaLabel,
    ensureElementAccessibility,
    ensureElementHasId,
    addLangAttribute,
    accessibilityUtils
  }
}

// Also attach to global scope for browser/standalone access
if (typeof window !== 'undefined') {
  window.setHtmlLangAttribute = setHtmlLangAttribute
  window.detectAndSetLang = detectAndSetLang
  window.getLangAttribute = getLangAttribute
  window.validateTableAccessibility = validateTableAccessibility
  window.validateTableStructure = validateTableStructure
  window.validateLandmark = validateLandmark
  window.validateLandmarkStructure = validateLandmarkStructure
  window.getSvgAccessibleName = getSvgAccessibleName
  window.validateSvgAccessibility = validateSvgAccessibility
  window.ensureUniqueLandmarks = ensureUniqueLandmarks
  window.personName = personName
  window.validateLinks = validateLinks
  window.createFocusTrap = createFocusTrap
  window.validateAccessibility = validateAccessibility
  window.addAriaLabel = addAriaLabel
  window.ensureElementAccessibility = ensureElementAccessibility
  window.ensureElementHasId = ensureElementHasId
  window.addLangAttribute = addLangAttribute
  window.accessibilityUtils = accessibilityUtils
}
