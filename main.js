// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

/**
 * @fileoverview Main module entry point for dependency visualization and accessibility utilities.
 * @license MIT
 */

// Dependency imports
const { dependencyGraphContent } = require('./dependency-graph')
const { indexContent } = require('./index')
const { spawn } = require('child_process')

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report:
// - Add keyboard navigation support for all interactive elements
// - Ensure proper ARIA labels on dynamic content
// - Maintain focus management for modal dialogs

const accessibilityUtils = {
  // ... existing methods from both branches ...

  /**
     * Announce message to screen readers (from origin/head)
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
     * Handle keyboard navigation (from origin/head)
     * @param {Event} e - The keyboard event
     * @param {Object} handlers - The handler functions for different keys
     */
  handleKeyboardNav: (e, handlers) => {
    const key = e.key
    if (handlers[key]) {
      handlers[key](e)
    }
  },

  /**
     * Add lang attribute to HTML element
     */
  addLangAttribute: () => {
    if (typeof document !== 'undefined') {
      const htmlElement = document.querySelector('html')
      if (htmlElement && !htmlElement.hasAttribute('lang')) {
        htmlElement.setAttribute('lang', 'en')
      }
    }
  },

  /**
     * Fix table structure issues
     * @param {HTMLElement} table - The table element to fix
     */
  fixTableStructure: (table) => {
    if (!table || table.tagName !== 'TABLE') return

    // Ensure table has a caption
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption')
      caption.textContent = 'Table data'
      table.insertBefore(caption, table.firstChild)
    }

    // Ensure table has proper headers
    const headers = table.querySelectorAll('th')
    headers.forEach((header, index) => {
      if (!header.id) {
        header.id = `table-header-${index}`
      }
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', 'col')
      }
    })

    // Associate data cells with headers
    const rows = table.querySelectorAll('tr')
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td')
      cells.forEach((cell, cellIndex) => {
        if (!cell.hasAttribute('headers') && headers[cellIndex]) {
          cell.setAttribute('headers', headers[cellIndex].id)
        }
      })
    })
  },

  /**
     * Add/fix landmark issues
     * @param {HTMLElement} container - The container element to add landmarks to
     */
  addLandmarkIssues: (container) => {
    if (!container) return

    // Add main landmark if missing
    if (!container.querySelector('main')) {
      const main = document.createElement('main')
      main.setAttribute('role', 'main')
      container.appendChild(main)
    }

    // Add navigation landmark if missing
    if (!container.querySelector('nav')) {
      const nav = document.createElement('nav')
      nav.setAttribute('aria-label', 'Main navigation')
      container.appendChild(nav)
    }
  },

  /**
     * Add accessible names to SVGs
     * @param {HTMLElement} svg - The SVG element to add accessible names to
     * @param {string} name - The accessible name for the SVG
     */
  addSvgAccessibleNames: (svg, name) => {
    if (!svg || svg.tagName !== 'svg') return

    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', name)
    }

    // Ensure SVG has a title element for screen readers
    if (!svg.querySelector('title')) {
      const title = document.createElement('title')
      title.textContent = name
      svg.insertBefore(title, svg.firstChild)
    }
  },

  /**
     * Ensure unique landmarks
     * @param {HTMLElement} container - The container element to check for unique landmarks
     */
  ensureUniqueLandmarks: (container) => {
    if (!container) return

    const landmarks = ['main', 'nav', 'header', 'footer', 'aside']
    landmarks.forEach((landmark) => {
      const elements = container.querySelectorAll(landmark)
      if (elements.length > 1) {
        elements.forEach((el, index) => {
          if (index > 0) {
            el.setAttribute('aria-label', `${landmark} section ${index + 1}`)
          }
        })
      }
    })
  },

  /**
     * Fix fake link issues
     * @param {HTMLElement} element - The element to check for fake link issues
     */
  fixFakeLinkIssue: (element) => {
    if (!element) return

    if (element.tagName === 'A' && !element.hasAttribute('href')) {
      element.setAttribute('role', 'button')
      element.setAttribute('tabindex', '0')
    }
  }
}

/**
 * Initialize accessibility features for the application.
 */
function initAccessibility () {
  // Set up accessibility utilities
  if (typeof window !== 'undefined') {
    // Ensure screen reader support is available
    document.body.setAttribute('role', 'application')

    // Add lang attribute to HTML element
    accessibilityUtils.addLangAttribute()

    // Add landmark issues
    accessibilityUtils.addLandmarkIssues(document.body)
  }
  return accessibilityUtils
}

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `auto-id-${Math.random().toString(36).substr(2, 9)}`
  }
  return element
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

  // Fix table structure if present
  const tables = container.querySelectorAll('table')
  tables.forEach((table) => accessibilityUtils.fixTableStructure(table))

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

  return element
}

function newFocusTrap () {
  // New function implementation
}

/**
 * Spawn a child process with the given command and arguments.
 * @param {string} command - The command to execute
 * @param {string[]} args - Arguments to pass to the command
 * @param {Object} options - Options for the spawn function
 * @returns {ChildProcess} The spawned process
 */
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
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(url)
    link.remove()

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
 * Sanitize a filename to remove invalid characters.
 * @param {string} filename - The filename to sanitize
 * @returns {string} The sanitized filename
 */
function sanitizeFilename (filename) {
  return filename.replace(/[^a-z0-9.-]/gi, '_')
}

/**
 * Safely read a file, returning null on error.
 * @param {string} filePath - The path to the file to read
 * @returns {string|null} The file contents or null if an error occurred
 */
function readFileSafe (filePath) {
  try {
    return require('fs').readFileSync(filePath, 'utf8')
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error')
    return null
  }
}

// Existing utility functions
function log (message, level = 'info') {
  const timestamp = new Date().toISOString()
  console[level === 'error' ? 'error' : 'log'](`[${timestamp}] [${level}] ${message}`)
}

module.exports = {
  accessibilityUtils,
  exportUtils,
  initAccessibility,
  handleCredentialResponse,
  ensureElementId,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  renderDependencyGraphs,
  spawnProcess,
  focusTrap,
  newFocusTrap
}
