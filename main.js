const fs = require('fs')

// Accessibility utilities and functions
const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.querySelector('.skip-link, [href="#main-content"]')
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault()
        const target = document.querySelector(skipLink.getAttribute('href'))
        if (target) {
          target.setAttribute('tabindex', '-1')
          target.focus()
        }
      })
    }
  },

  // Trap focus within an element (for modals, dialogs)
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
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
  },

  // Announce message to screen readers
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

  // Handle keyboard navigation
  handleKeyboardNav: (e, handlers) => {
    const key = e.key
    if (handlers[key]) {
      handlers[key](e)
    }
  },

  // New focus trap function for keyboard navigation
  newFocusTrap: () => {
    const focusableSelector =
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const focusableElements = document.querySelectorAll(focusableSelector)

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
  }
}

// Functions to ensure the element has an id, add aria-label, render dependency graphs
const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = 'element-' + Date.now() + '-' + Math.random().toString(36).slice(2, 11)
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
  return {
    nodes: data.nodes || [],
    edges: data.edges || []
  }
}

// Get language attribute from an element or document
function getLangAttribute (element = document.documentElement) {
  if (!element) {
    throw new Error('Element is required')
  }

  const lang = element.getAttribute('lang')
  if (!lang) {
    // Default to 'en' if no lang attribute is found
    element.setAttribute('lang', 'en')
    return 'en'
  }

  return lang
}

// Get formatted person name
function personName (personData) {
  if (!personData) {
    return ''
  }

  const { firstName, lastName, prefix, suffix } = personData

  const nameParts = []
  if (prefix) nameParts.push(prefix)
  if (firstName) nameParts.push(firstName)
  if (lastName) nameParts.push(lastName)
  if (suffix) nameParts.push(suffix)

  const fullName = nameParts.join(' ')

  // Set aria-label for the element if not present
  if (typeof document !== 'undefined') {
    const activeElement = document.activeElement
    if (
      activeElement &&
            activeElement.textContent === fullName &&
            !activeElement.getAttribute('aria-label')
    ) {
      activeElement.setAttribute('aria-label', fullName)
    }
  }

  return fullName
}

// Validate table structure accessibility
function validateTableStructure (tableElement) {
  const issues = []

  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    issues.push('Element is not a TABLE element')
    return issues
  }

  // Check for header consistency
  const headerRows = tableElement.querySelectorAll('tr th')
  if (headerRows.length === 0) {
    issues.push('TABLE lacks header cells (TH) for proper structure')
  }

  // Check for proper caption
  const caption = tableElement.querySelector('caption')
  if (!caption || !caption.textContent.trim()) {
    issues.push('TABLE requires a descriptive caption')
  }

  // Check row consistency
  const rows = Array.from(tableElement.querySelectorAll('tr'))
  const cellCounts = []

  rows.forEach((row, index) => {
    const cells = Array.from(row.querySelectorAll('td, th'))
    cellCounts.push(cells.length)

    if (cells.length === 0 && index > 0) {
      issues.push(`Row ${index + 1} has no accessible cells`)
    }
  })

  // Check for consistent cell counts across rows
  if (cellCounts.length > 1) {
    const firstCount = cellCounts[0]
    cellCounts.forEach((count, index) => {
      if (count !== firstCount && index > 0) {
        issues.push(
                    `Row ${index + 1} has ${count} cells, expected ${firstCount} for structure consistency`
        )
      }
    })
  }

  return issues
}

// Validate landmark accessibility
function validateLandmark (element) {
  if (!element) {
    return ['Element is required']
  }

  const issues = []
  const tagName = element.tagName.toLowerCase()
  const role = element.getAttribute('role')

  // Check for proper landmark roles
  const validLandmarks = [
    'main',
    'nav',
    'aside',
    'header',
    'footer',
    'section',
    'article',
    'form'
  ]
  const elementRole = role || tagName

  if (validLandmarks.includes(elementRole)) {
    // Check for unique landmarks
    const sameLandmarks = document.querySelectorAll(
            `[role="${elementRole}"], ${tagName}[role="${elementRole}"]`
    )
    if (sameLandmarks.length > 1 && sameLandmarks[0] !== element) {
      issues.push(`Multiple ${elementRole} landmarks found - should be unique`)
    }
  }

  // Check for landmark structure
  if (elementRole === 'section' || elementRole === 'article') {
    const hasHeading = element.querySelector('h1, h2, h3, h4, h5, h6')
    if (!hasHeading) {
      issues.push(`${elementRole} landmark should have a heading for structure`)
    }
  }

  return issues
}

// Validate landmark structure
function validateLandmarkStructure (landmarkElement) {
  const issues = []

  if (!landmarkElement) {
    return ['Landmark element is required']
  }

  const role = landmarkElement.getAttribute('role')
  const tagName = landmarkElement.tagName.toLowerCase()
  const landmarkRole = role || tagName

  // Check landmark hierarchy
  const parentLandmark = landmarkElement.parentElement?.closest(
    '[role], [role="main"], [role="nav"], [role="aside"], [role="header"], [role="footer"], [role="section"], [role="article"], [role="form"]'
  )

  if (parentLandmark && parentLandmark !== landmarkElement) {
    const parentRole =
            parentLandmark.getAttribute('role') || parentLandmark.tagName.toLowerCase()
    const currentRole = landmarkRole

    // Semantic landmark hierarchy rules
    const hierarchyRules = {
      header: ['header', 'section', 'article'],
      footer: ['footer', 'section', 'article'],
      nav: ['nav', 'section', 'article', 'main'],
      aside: ['aside', 'section', 'article', 'main'],
      main: ['main', 'section', 'article'],
      section: ['section', 'article'],
      article: ['article'],
      form: ['form', 'section', 'article']
    }

    const allowedParents = hierarchyRules[currentRole] || []
    if (!allowedParents.includes(parentRole)) {
      issues.push(
                `Invalid landmark hierarchy: ${currentRole} cannot be nested within ${parentRole}`
      )
    }
  }

  // Check for proper content structure
  if (landmarkRole === 'main') {
    const hasInteractiveElements = landmarkElement.querySelector(
      'button, input, select, textarea, a[href], [tabindex]'
    )
    if (!hasInteractiveElements && !landmarkElement.textContent.trim()) {
      issues.push('Main landmark should contain interactive elements or meaningful content')
    }
  }

  return issues
}

// Get accessible name for SVG element
function getSvgAccessibleName (svgElement) {
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
    throw new Error('Element must be an SVG element')
  }

  // Try to find aria-label or aria-labelledby
  let accessibleName =
        svgElement.getAttribute('aria-label') || svgElement.getAttribute('aria-labelledby')

  if (!accessibleName) {
    // Try to get title element as fallback
    const titleElement = svgElement.querySelector('title')
    if (titleElement) {
      accessibleName = titleElement.textContent
    }
  }

  if (!accessibleName) {
    // Generate a simple description based on SVG content
    const paths = svgElement.querySelectorAll('path')
    const rects = svgElement.querySelectorAll('rect')
    const circles = svgElement.querySelectorAll('circle')

    let description = 'SVG graphic'
    if (paths.length > 0) description += ' containing ' + paths.length + ' path elements'
    if (rects.length > 0) description += ' with ' + rects.length + ' rectangle elements'
    if (circles.length > 0) description += ' and ' + circles.length + ' circle elements'

    accessibleName = description

    // Set aria-label on the SVG
    svgElement.setAttribute('aria-label', accessibleName)
  }

  return accessibleName
}

// Create in-page navigation button
function createInPageButton (text, targetId, options = {}) {
  const { isSkipLink = false, ariaLabel = text, onClick = null } = options

  const button = document.createElement('button')
  button.textContent = text
  button.setAttribute('type', 'button')
  button.className = isSkipLink ? 'skip-link' : 'in-page-button'

  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel)
  }

  if (targetId) {
    button.setAttribute('href', `#${targetId}`)
    button.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.getElementById(targetId)
      if (target) {
        target.setAttribute('tabindex', '-1')
        target.focus()
      }
    })
  }

  if (onClick) {
    button.addEventListener('click', onClick)
  }

  return button
}

function calculateSum (a, b) {
  return a + b
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

// Existing utility functions
function log (message, level = 'info') {
  const timestamp = new Date().toISOString()
  console.log(timestamp + ' [' + level.toUpperCase() + ']: ' + message)
}

// Export functionality with accessibility support
const exportUtils = {
  exportData: (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.setAttribute('aria-label', 'Download ' + filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    accessibilityUtils.announceToScreenReader('Download of ' + filename + ' started')
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
        return '"' + escaped + '"'
      })
      csvRows.push(values.join(','))
    }

    const csvString = csvRows.join('\n')
    exportUtils.exportData(csvString, filename || 'export.csv', 'text/csv')
  }
}

function sanitizeFilename (filename) {
  return filename.replace(/[^a-z0-9_.-]/gi, '_')
}

function readFileSafe (filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch (error) {
    log('Error reading file ' + filePath + ': ' + error.message, 'error')
    return null
  }
}

// Existing data processing functions
function processData (items) {
  if (!Array.isArray(items)) {
    return []
  }
  return items.map((item) => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }))
}

function filterValidItems (items, validator) {
  return items.filter((item) => {
    try {
      return validator(item)
    } catch {
      return false
    }
  })
}

// Initialize accessibility features
const initAccessibility = () => {
  accessibilityUtils.initSkipLink()

  // Add keyboard support for all interactive elements
  document.querySelectorAll('[data-accessible]').forEach((element) => {
    element.addEventListener('keydown', (e) => {
      accessibilityUtils.handleKeyboardNav(e, {
        Enter: () => element.click(),
        ' ': () => element.click()
      })
    })
  })
}

function groupByCategory (items, getCategory) {
  return items.reduce((groups, item) => {
    const category = getCategory(item)
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(item)
    return groups
  }, {})
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

// _Commit: b8888a21083c89f599fb68eef1dc4d5df1051e52_
// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

// TODO: Implement the new function as per the issue requirements
function transformInputData (inputData, options = {}) {
  const {
    preserveKeys = true,
    uppercase = false,
    trimWhitespace = true,
    maxLength = null
  } = options

  if (!inputData) {
    return null
  }

  const processValue = (value) => {
    if (typeof value === 'string') {
      let processed = value
      if (trimWhitespace) {
        processed = processed.trim()
      }
      if (uppercase) {
        processed = processed.toUpperCase()
      }
      if (maxLength !== null && processed.length > maxLength) {
        processed = processed.substring(0, maxLength)
      }
      return processed
    }
    return value
  }

  if (typeof inputData === 'object' && !Array.isArray(inputData) && inputData !== null) {
    const result = {}
    const originalKeys = Object.keys(inputData)
    const keys = preserveKeys
      ? originalKeys
      : originalKeys.map(() => Math.random().toString(36).substring(2, 11))

    let i = 0
    for (const key of originalKeys) {
      const value = inputData[key]
      if (typeof value === 'object' && value !== null) {
        result[keys[i]] = transformInputData(value, options)
      } else {
        result[keys[i]] = processValue(value)
      }
      i++
    }
    return result
  }

  if (Array.isArray(inputData)) {
    return inputData.map((item) => {
      if (typeof item === 'object' && item !== null) {
        return transformInputData(item, options)
      }
      return processValue(item)
    })
  }

  return processValue(inputData)
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility)
  } else {
    initAccessibility()
  }
}

// New function: validateTableAccessibility
function validateTableAccessibility (tableElement) {
  const issues = []

  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    issues.push('Element is not a TABLE element')
    return issues
  }

  // Check for presence of <caption> (accessibility best practice for table description)
  const caption = tableElement.querySelector('caption')
  if (!caption || !caption.textContent.trim()) {
    issues.push('TABLE is missing a descriptive caption')
  }

  // Check that all rows have consistent number of cells
  const rows = Array.from(tableElement.querySelectorAll('tr'))
  let expectedCellCount = null

  rows.forEach((row, rowIndex) => {
    const cells = Array.from(row.children).filter((child) =>
      ['TH', 'TD'].includes(child.tagName.toUpperCase())
    )

    if (expectedCellCount === null && cells.length > 0) {
      expectedCellCount = cells.length
    }

    if (expectedCellCount !== null && cells.length !== expectedCellCount) {
      issues.push(`Row ${rowIndex + 1} has inconsistent number of cells`)
    }
  })

  // Check that TH elements exist (header row/column should be marked)
  const thCells = tableElement.querySelectorAll('th')
  if (thCells.length === 0) {
    issues.push('TABLE has no header cells (TH) defined')
  }

  return issues
}

// Ensure the element has an id. If the element doesn't have an id,
// generates one and assigns it to the element.
function ensureElementHasId (element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required')
  }

  if (element.id) {
    return element.id
  }

  const id = `${prefix}-${Math.random().toString(36).substring(2, 11)}`
  element.id = id
  return id
}

// Export the newFocusTrap function as a standalone utility
const newFocusTrap = accessibilityUtils.newFocusTrap

// Generate a report based on accessibility issues
function generateAccessibilityReport (issues, options = {}) {
  const { format = 'json', groupBySeverity = true, includeSummary = true } = options

  // Handle empty issues array
  if (!issues || !Array.isArray(issues) || issues.length === 0) {
    return {
      summary: {
        totalIssues: 0,
        timestamp: new Date().toISOString()
      },
      issues: [],
      message:
                format === 'json'
                  ? JSON.stringify({
                    summary: { totalIssues: 0, timestamp: new Date().toISOString() },
                    issues: [],
                    message: 'No accessibility issues found'
                  })
                  : 'No accessibility issues found'
    }
  }

  const processedIssues = [...issues]
  let groups = {}
  const summary = {
    totalIssues: issues.length,
    timestamp: new Date().toISOString()
  }

  // Group issues by severity if requested
  if (groupBySeverity) {
    groups = processedIssues.reduce((acc, issue) => {
      // Determine severity - default to 'unknown' if not specified
      let severity = 'unknown'

      if (typeof issue === 'string') {
        // Try to infer severity from issue text
        const lowerIssue = issue.toLowerCase()
        if (lowerIssue.includes('critical') || lowerIssue.includes('error')) {
          severity = 'critical'
        } else if (lowerIssue.includes('warning') || lowerIssue.includes('serious')) {
          severity = 'serious'
        } else {
          severity = 'moderate'
        }
      } else if (issue.severity) {
        severity = issue.severity
      } else if (issue.level) {
        severity = issue.level
      }

      if (!acc[severity]) {
        acc[severity] = []
      }
      acc[severity].push(issue)
      return acc
    }, {})

    // Add group counts to summary
    if (includeSummary) {
      summary.groups = Object.keys(groups).reduce((acc, key) => {
        acc[key] = groups[key].length
        return acc
      }, {})
    }
  }

  // Create report based on format
  const report = {
    summary: includeSummary ? summary : undefined,
    groups: groupBySeverity ? groups : undefined,
    issues: processedIssues
  }

  // Remove undefined properties
  Object.keys(report).forEach((key) => {
    if (report[key] === undefined) {
      delete report[key]
    }
  })

  // Return formatted output
  if (format === 'json') {
    return JSON.stringify(report, null, 2)
  }

  if (format === 'text') {
    let textReport = ''
    if (includeSummary) {
      textReport += 'Accessibility Issues Report\n'
      textReport += '========================\n'
      textReport += `Total Issues: ${summary.totalIssues}\n`
      textReport += `Generated: ${summary.timestamp}\n\n`

      if (groupBySeverity && summary.groups) {
        textReport += 'By Severity:\n'
        Object.entries(summary.groups).forEach(([severity, count]) => {
          textReport += `  ${severity}: ${count}\n`
        })
        textReport += '\n'
      }
    }

    textReport += 'Issues:\n'
    if (groupBySeverity) {
      Object.entries(groups).forEach(([severity, severityIssues]) => {
        textReport += `\n${severity.toUpperCase()} (${severityIssues.length}):\n`
        severityIssues.forEach((issue, index) => {
          textReport += `  ${index + 1}. ${typeof issue === 'string' ? issue : issue.message || JSON.stringify(issue)}\n`
        })
      })
    } else {
      processedIssues.forEach((issue, index) => {
        textReport += `${index + 1}. ${typeof issue === 'string' ? issue : issue.message || JSON.stringify(issue)}\n`
      })
    }

    return textReport
  }

  return report
}

// Export all utilities
module.exports = {
  accessibilityUtils,
  exportUtils,
  initAccessibility,
  handleCredentialResponse,
  ensureElementId,
  addAriaLabel,
  renderDependencyGraph,
  calculateSum,
  newFocusTrap,
  log,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  initAccessibility,
  groupByCategory,
  transformInputData,
  validateTableAccessibility,
  ensureElementHasId,
  getLangAttribute,
  personName,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  generateAccessibilityReport
}
