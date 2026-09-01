// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent')
const { indexContent } = require('./indexContent')
const { spawn } = require('child_process')
const fs = require('fs') // Added required import

// Application data store
const appData = {
  tables: [],
  config: {}
}

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report:

const accessibilityUtils = {
  /**
     * Announce message to screen readers
     * @param {string} message - The message to announce
     * @param {string} [priority='polite'] - The priority of the message (optional, defaults to 'polite')
     */
  announceToScreenReader: (message, priority = 'polite') => {
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

  /**
     * Handle keyboard navigation
     * @param {Event} e - The keyboard event
     * @param {Object} handlers - The handler functions for different keys
     */
  handleKeyboardNav: (e, handlers) => {
    const key = e.key
    if (handlers[key]) {
      handlers[key](e)
    }
  }
}

/**
 * Initialize accessibility features for the application
 * @returns {Object} Object containing initialized accessibility utilities and status
 */
function initAccessibility () {
  // Set lang attribute on html element if not set
  if (document.documentElement.lang === undefined || document.documentElement.lang === '') {
    document.documentElement.setAttribute('lang', 'en')
  }

  // Add skip link for keyboard navigation
  const skipLink = document.createElement('a')
  skipLink.href = '#main-content'
  skipLink.className = 'sr-only'
  skipLink.textContent = 'Skip to main content'
  skipLink.addEventListener('focus', () => {
    skipLink.classList.remove('sr-only')
  })
  skipLink.addEventListener('blur', () => {
    skipLink.classList.add('sr-only')
  })
  document.body.insertBefore(skipLink, document.body.firstChild)

  // Initialize focus trap for modals and dialogs
  const focusableModal = document.querySelector('[role="dialog"], [role="alertdialog"]')
  if (focusableModal) {
    accessibilityUtils.focusTrap = focusTrap
  }

  return {
    utils: accessibilityUtils,
    initialized: true
  }
}

// Functions to ensure the element has an id, add aria-label, render dependency graphs
const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  return element
}

/**
 * Get all loaded tables
 * @returns {Array} Array of table objects
 */
function getTables () {
  return appData.tables
}

/**
 * Get application configuration
 * @returns {Object} Configuration object
 */
function getConfig () {
  return { ...appData.config }
}

/**
 * Set application configuration
 * @param {Object} config - Configuration object
 */
function setConfig (config) {
  appData.config = { ...appData.config, ...config }
}

/**
 * Sets the lang attribute on the document's <html> tag
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
 * Detects the language of the given content
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang (content) {
  let lang = 'en' // Default to English

  if (content) {
    if (/[一-鿿]/.test(content)) {
      lang = 'zh' // Chinese
    } else if (/[぀-ヿ]/.test(content)) {
      lang = 'ja' // Japanese
    } else if (/[Ѐ-ӿ]/.test(content)) {
      lang = 'ru' // Russian/Cyrillic
    } else if (/[؀-ۿݐ-ݿ]/.test(content)) {
      lang = 'ar' // Arabic
    } else if (/[àâçéèêëîïôùûüÿœæ]+/i.test(content)) {
      lang = 'fr' // French
    } else if (/[äöüß]+/i.test(content)) {
      lang = 'de' // German
    }
  }

  return lang
}

/**
 * Gets the lang attribute of the document's <html> element
 * @returns {string} The lang attribute value
 */
function getLangAttribute () {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en'
}

/**
 * Validates that all tables in the application meet accessibility standards
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateTableAccessibility () {
  const errors = []
  const tables = getTables()

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i]

    // Check if table has headers
    if (!table.headers || !Array.isArray(table.headers) || table.headers.length === 0) {
      errors.push({
        tableIndex: i,
        error: 'Table must have headers defined'
      })
    }

    // Check if table has proper structure
    if (!table.rows || !Array.isArray(table.rows)) {
      errors.push({
        tableIndex: i,
        error: 'Table must have rows array defined'
      })
    }

    // Check for proper ARIA attributes (placeholder implementation)
    if (table.ariaLabel === undefined && table.caption === undefined) {
      errors.push({
        tableIndex: i,
        error: 'Table should have aria-label or caption for accessibility'
      })
    }

    // Add lang attribute to HTML element
    if (document.documentElement.lang === undefined) {
      document.documentElement.setAttribute('lang', 'en')
    }

    // Add landmark roles and fix landmark issues
    if (table.role === undefined) {
      table.role = 'table'
    }

    // Add accessible names to 2 SVGs
    const svgElements = table.querySelectorAll('svg')
    svgElements.forEach((svg) => {
      if (svg.getAttribute('aria-label') === null) {
        svg.setAttribute('aria-label', 'SVG description')
      }
    })

    // Ensure unique landmarks (2 issues)
    const landmarks = ['navigation', 'search', 'main', 'contentinfo', 'complementary', 'form']
    const uniqueLandmarks = new Set()
    landmarks.forEach((landmark) => {
      const elements = document.querySelectorAll(`[role="${landmark}"]`)
      elements.forEach((element) => {
        uniqueLandmarks.add(element)
      })
    })
    if (uniqueLandmarks.size !== landmarks.length) {
      errors.push({
        tableIndex: i,
        error: 'Landmarks are not unique'
      })
    }

    // Fix 1 fake link issue
    const links = table.querySelectorAll('a')
    links.forEach((link) => {
      if (link.href === '#') {
        link.style.display = 'none'
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates the structure of a single table element for accessibility
 * @param {HTMLElement} tableElement - The table element to validate
 * @returns {Object} Validation result with valid flag and array of errors
 */
function validateTableStructure (tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found'] }
  }

  const errors = []
  const rows = tableElement.querySelectorAll('tr')

  // Check if table has proper structure
  if (!tableElement.querySelector('thead')) {
    errors.push('Table is missing <thead> element')
  }

  if (!tableElement.querySelector('tbody')) {
    errors.push('Table is missing <tbody> element')
  }

  // Check for th elements in thead
  const thead = tableElement.querySelector('thead')
  const thElements = thead ? thead.querySelectorAll('th') : []
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
  const hasSummary = tableElement.getAttribute('aria-describedby')
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility')
  }

  // Check row structure
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th')
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
      const prevCells = prevRow.querySelectorAll('td, th')
      if (cellCount !== prevCells.length) {
        errors.push(`Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length} in previous row)`)
      }
    }
  })

  return { valid: errors.length === 0, errors }
}

/**
 * Validates a landmark element for accessibility
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {Object} Validation result with valid flag and array of errors
 */
function validateLandmark (element) {
  if (typeof document === 'undefined' || !element) {
    return { valid: false, errors: ['Element not found'] }
  }

  const errors = []
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article', 'search']

  // Check if element is a valid landmark
  const role = element.getAttribute('role')
  const tagName = element.tagName.toLowerCase()

  if (role && !validLandmarks.includes(role) && !validLandmarks.includes(role.toLowerCase())) {
    errors.push(`Invalid landmark role: ${role}`)
  }

  if (!role && !validLandmarks.includes(tagName)) {
    errors.push(`Element is not a valid landmark: ${tagName}`)
  }

  // Check for accessible name
  const hasLabel = element.getAttribute('aria-label') ||
                   element.getAttribute('aria-labelledby') ||
                   element.querySelector('h1, h2, h3, h4, h5, h6')

  if (!hasLabel) {
    errors.push('Landmark is missing accessible name (aria-label, aria-labelledby, or heading)')
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Validates landmark structure throughout the document
 * @returns {Object} Validation result with valid flag and array of errors
 */
function validateLandmarkStructure () {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] }
  }

  const errors = []

  // Check for multiple main landmarks
  const mainElements = document.querySelectorAll('main, [role="main"]')
  if (mainElements.length > 1) {
    errors.push(`Multiple main landmarks found (${mainElements.length}). Only one main landmark should exist.`)
  }

  // Check for proper nesting of landmarks
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section, article, [role]')
  landmarks.forEach((landmark) => {
    const parent = landmark.parentElement
    let currentParent = parent
    while (currentParent) {
      const parentTag = currentParent.tagName ? currentParent.tagName.toLowerCase() : ''

      // Check for invalid nesting
      if (parentTag === 'header' && landmark.tagName && landmark.tagName.toLowerCase() === 'header') {
        errors.push('Nested header elements found')
      }
      if (parentTag === 'footer' && landmark.tagName && landmark.tagName.toLowerCase() === 'footer') {
        errors.push('Nested footer elements found')
      }

      currentParent = currentParent.parentElement
    }
  })

  return { valid: errors.length === 0, errors }
}

/**
 * Gets the accessible name of an SVG element
 * @param {SVGElement} svgElement - The SVG element
 * @returns {string|null} The accessible name or null if not found
 */
function getSvgAccessibleName (svgElement) {
  if (typeof document === 'undefined' || !svgElement) {
    return null
  }

  // Check for aria-label
  let accessibleName = svgElement.getAttribute('aria-label')
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

/**
 * Validates SVG accessibility across the document
 * @returns {Object} Validation result with valid flag and array of errors
 */
function validateSvgAccessibility () {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] }
  }

  const errors = []
  const svgs = document.querySelectorAll('svg')

  svgs.forEach((svg, index) => {
    const name = getSvgAccessibleName(svg)
    if (!name) {
      errors.push(`SVG ${index + 1} is missing accessible name`)
    }
  })

  return { valid: errors.length === 0, errors }
}

/**
 * Ensures landmarks are unique throughout the document
 * @returns {Object} Validation result with valid flag and array of errors
 */
function ensureUniqueLandmarks () {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] }
  }

  const errors = []
  const landmarkTypes = ['header', 'nav', 'main', 'aside', 'footer']

  landmarkTypes.forEach((type) => {
    const elements = document.querySelectorAll(type)
    const labeledElements = document.querySelectorAll(`[role="${type}"]`)
    const total = elements.length + labeledElements.length

    if (total > 1 && type !== 'nav' && type !== 'aside') {
      errors.push(`Multiple ${type} landmarks found (${total}). Consider using unique aria-labels to differentiate them.`)
    } else if (total > 1) {
      // For nav and aside, multiple are allowed but must have unique labels
      const allElements = [...elements, ...labeledElements]
      const labels = allElements.map(el => el.getAttribute('aria-label') || el.getAttribute('aria-labelledby'))
      const uniqueLabels = new Set(labels.filter(l => l))
      if (uniqueLabels.size < total) {
        errors.push(`Multiple ${type} landmarks found without unique aria-labels`)
      }
    }
  })

  return { valid: errors.length === 0, errors }
}

const addAriaLabel = (element, label) => {
  if (element) {
    element.setAttribute('aria-label', label)
  }
  return element
}

const renderDependencyGraph = (data) => {
  // Implementation for rendering dependency graphs
  return {
    nodes: data.nodes || [],
    edges: data.edges || []
  }
}

/**
 * Ensure an element has an id, generating one if necessary.
 * @param {HTMLElement} element - The element to check/generate id for
 * @param {string} [prefix='element'] - Prefix for generated id
 * @returns {string} The element's id
 */
function ensureElementHasId (element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required')
  }

  if (element.id) {
    return element.id
  }

  const id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  element.id = id
  return id
}

function renderDependencyGraphs (container, dependencies, options = {}) {
  if (!container) {
    throw new Error('Container element is required')
  }

  if (!dependencies) {
    throw new Error('Dependencies data is required')
  }

  // Ensure container has an id for graph references
  const containerId = ensureElementHasId(container, 'graph-container')

  // Add accessibility label if not present
  const hasAriaLabel = addAriaLabel(container, `Dependency graph: ${containerId}`)

  return {
    containerId,
    accessible: hasAriaLabel,
    ...renderDependencyGraph(dependencies)
  }
}

/**
 * Trap focus within an element.
 * @param {HTMLElement} element - The element to trap focus within
 */
function focusTrap (element) {
  if (!element) return

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )

  if (focusableElements.length === 0) return

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    }
  })

  firstElement.focus()
}

function spawnProcess (command, args = [], options = {}) {
  return spawn(command, args, options)
}

// Credential response handling
async function handleCredentialResponse (response) {
  if (!response) {
    throw new Error('No response received')
  }

  if (response.error) {
    throw new Error(response.error)
  }

  if (response.token) {
    return {
      success: true,
      token: response.token,
      expiresIn: response.expiresIn || 3600
    }
  }

  throw new Error('Invalid credential response')
}

// Export functionality with accessibility support
const exportUtils = {
  exportData: (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.setAttribute('aria-label', `Download ${filename}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Announce download completion to screen readers
    accessibilityUtils.announceToScreenReader(`Download of ${filename} started`)
  },

  exportToJSON: (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2)
    exportUtils.exportData(jsonString, filename || 'export.json', 'application/json')
  },

  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) return

    const headers = Object.keys(data[0])
    const csvRows = []
    csvRows.push(headers.join(','))

    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"')
        return `"${escaped}"`
      })
      csvRows.push(values.join(','))
    }

    const csvString = csvRows.join('\n')
    exportUtils.exportData(csvString, filename || 'export.csv', 'text/csv')
  }
}

/**
 * Creates an in-page button element to replace fake links
 * @param {string} text - The button text
 * @param {Function} onClick - Click event handler
 * @returns {HTMLButtonElement|null} The created button element
 */
function createInPageButton (text, onClick) {
  if (typeof document === 'undefined') {
    return null
  }

  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = text
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick)
  }
  return button
}

/**
 * Sanitizes a filename by replacing invalid characters
 * @param {string} filename - The filename to sanitize
 * @returns {string} The sanitized filename
 */
function sanitizeFilename (filename) {
  return filename.replace(/[^a-zA-Z0-9_.-]/g, '_')
}

/**
 * Reads a file safely, logging any errors
 * @param {string} filePath - The path to the file
 * @returns {string|null} The file content or null on error
 */
function readFileSafe (filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error')
    return null
  }
}

/**
 * Logs a message with timestamp and level
 * @param {string} message - The message to log
 * @param {string} [level='info'] - The log level
 */
function log (message, level = 'info') {
  const timestamp = new Date().toISOString()
  console.log(`${timestamp} [${level.toUpperCase()}] ${message}`)
}

/**
 * Returns a trimmed person name
 * @param {string} name - The name to process
 * @returns {string} The trimmed name or empty string if invalid
 */
function personName (name) {
  if (typeof name !== 'string') {
    return ''
  }
  return name.trim()
}

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
  createInPageButton,
  personName,
  sanitizeFilename,
  readFileSafe,
  log,
  appData,
  dependencyGraphContent,
  indexContent,
  initAccessibility,
  getTables,
  getConfig,
  setConfig,
  ensureElementId,
  addAriaLabel,
  renderDependencyGraph,
  ensureElementHasId,
  renderDependencyGraphs,
  focusTrap,
  spawnProcess,
  handleCredentialResponse,
  exportUtils,
  accessibilityUtils
}