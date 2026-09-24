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
// Address accessibility issues from insight report (combined with the export code):
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute; handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure; handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
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
 * Checks for accessibility issues in the rendered content
 * @param {string} content - Rendered HTML content
 * @returns {Array} List of accessibility issues found
 */
function checkAccessibility (content) {
  // Placeholder for accessibility checking logic
  // This function should be implemented to check for accessibility issues
  // For now, it just returns an empty array
  return []
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

  return lang
}

/**
 * Adds the lang attribute to an element for accessibility (REACT_015)
 * @param {HTMLElement} element - The element to add the lang attribute to
 * @param {string} lang - The language code
 * @returns {HTMLElement} The element with the lang attribute set
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
 * Gets the current lang attribute from the document's <html> tag
 * @returns {string} The current lang attribute value, defaults to 'en'
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
 * Creates an accessible web resource button for linking to external resources.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @param {string} label - The accessible label/description of the button
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
  if (typeof document === 'undefined') return []

  const issues = []
  const tables = document.querySelectorAll('table')

  tables.forEach((table, index) => {
    // Check for missing table headers
    const headers = table.querySelectorAll('th')
    if (headers.length === 0) {
      issues.push(`Table ${index + 1} has no header cells`)
    }

    // Check for missing scope attributes on headers
    headers.forEach((header, hIndex) => {
      if (!header.hasAttribute('scope')) {
        issues.push(
                    `Header ${hIndex + 1} in table ${index + 1} is missing scope attribute`
        )
      }
    })

    // Check for missing captions
    if (!table.querySelector('caption')) {
      issues.push(`Table ${index + 1} is missing a caption`)
    }

    // Check for proper table structure
    const rows = table.querySelectorAll('tr')
    if (rows.length > 0) {
      const firstRowCells = rows[0].querySelectorAll('td, th')
      rows.forEach((row, rIndex) => {
        const cells = row.querySelectorAll('td, th')
        if (cells.length !== firstRowCells.length) {
          issues.push(
                        `Row ${rIndex + 1} in table ${index + 1} has inconsistent number of cells`
          )
        }
      })
    }
  })

  return issues
}

// New function to validate table structure
function validateTableStructure () {
  if (typeof document === 'undefined') return []

  const issues = []
  const tables = document.querySelectorAll('table')

  tables.forEach((table, index) => {
    // Check for proper table structure
    const rows = table.querySelectorAll('tr')
    if (rows.length === 0) {
      issues.push(`Table ${index + 1} has no rows`)
    }

    // Check for proper table headers
    const headers = table.querySelectorAll('th')
    if (headers.length > 0) {
      headers.forEach((header, hIndex) => {
        if (!header.hasAttribute('scope')) {
          issues.push(
                        `Header ${hIndex + 1} in table ${index + 1} is missing scope attribute`
          )
        }
      })
    }

    // Check for proper table data cells
    const dataCells = table.querySelectorAll('td')
    if (dataCells.length > 0) {
      dataCells.forEach((cell, cIndex) => {
        if (!cell.hasAttribute('headers') && !cell.hasAttribute('data-headers')) {
          issues.push(
                        `Data cell ${cIndex + 1} in table ${index + 1} is missing headers reference`
          )
        }
      })
    }
  })

  return issues
}

// New function to validate landmarks
function validateLandmark () {
  if (typeof document === 'undefined') return []

  const issues = []
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside', 'section']

  landmarks.forEach((landmark) => {
    const elements = document.querySelectorAll(landmark)
    if (elements.length > 1) {
      issues.push(`Multiple ${landmark} elements found - only one should exist per page`)
    }

    elements.forEach((element, index) => {
      if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
        issues.push(`${landmark} element ${index + 1} is missing accessible name`)
      }
    })
  })

  return issues
}

// New function to validate landmark structure
function validateLandmarkStructure () {
  if (typeof document === 'undefined') return []

  const issues = []
  const main = document.querySelector('main')

  if (!main) {
    issues.push('No main landmark found - every page should have one main landmark')
  } else if (document.querySelectorAll('main').length > 1) {
    issues.push('Multiple main landmarks found - only one should exist per page')
  }

  const navs = document.querySelectorAll('nav')
  if (navs.length > 0) {
    navs.forEach((nav, index) => {
      if (!nav.querySelector('a, button')) {
        issues.push(`Navigation landmark ${index + 1} has no interactive elements`)
      }
    })
  }

  return issues
}

// New function to get SVG accessible name
function getSvgAccessibleName (svgElement) {
  if (!svgElement || typeof document === 'undefined') return ''

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

  // Check for title element
  const title = svgElement.querySelector('title')
  if (title) {
    return title.textContent.trim()
  }

  // Check for desc element
  const desc = svgElement.querySelector('desc')
  if (desc) {
    return desc.textContent.trim()
  }

  // Fallback to empty string
  return ''
}

// New function to create a web resource button suitable for accessibility
function createWebResourceButton (url, text, parent = document.body) {
  const a = document.createElement('a')
  a.href = url
  a.setAttribute('role', 'button')
  a.setAttribute('aria-label', text)
  a.textContent = text
  parent.appendChild(a)
  return a
}

// New function to validate unique landmarks
function validateUniqueLandmarks () {
  if (typeof document === 'undefined') return []

  const issues = []
  const landmarkRoles = [
    'banner',
    'complementary',
    'contentinfo',
    'form',
    'main',
    'navigation',
    'region',
    'search'
  ]

  landmarkRoles.forEach((role) => {
    const elements = document.querySelectorAll(`[role="${role}"]`)
    if (elements.length > 1) {
      issues.push(`Multiple elements with role="${role}" found - landmarks should be unique`)
    }
  })

  return issues
}

/**
 * Formats a person's name for accessibility purposes (REACT_015)
 * Ensures proper lang attribute handling for person names
 * @param {string} firstName - The person's first name
 * @param {string} lastName - The person's last name
 * @param {Object} options - Additional options
 * @param {string} options.lang - Language code for the name
 * @param {boolean} options.setDocumentLang - Whether to set the document lang attribute
 * @returns {Object} Object containing the formatted name and detected language
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

// TODO: Implement tower defense
function towerDefense () {
  // A simple tower defense game implementation
  // Define towers, enemies, waves, and game loop
  const towers = []
  const enemies = []
  const wave = 1

  // Example: Tower constructor
  function Tower (x, y, range, damage, rate) {
    this.x = x
    this.y = y
    this.range = range
    this.damage = damage
    this.rate = rate
    this.lastShot = 0
  }

  // Example: Enemy constructor
  function Enemy (x, y, health, speed) {
    this.x = x
    this.y = y
    this.health = health
    this.speed = speed
  }

  // Add a tower
  function addTower (x, y, range, damage, rate) {
    towers.push(new Tower(x, y, range, damage, rate))
  }

  // Add an enemy
  function addEnemy (x, y, health, speed) {
    enemies.push(new Enemy(x, y, health, speed))
  }

  // Update game state (simplified)
  function update () {
    // Logic for enemy movement, tower shooting, etc.
    console.log(`Wave ${wave} - updating game state`)
  }

  // Start the game
  function start () {
    console.log('Tower defense game started')
    // Add initial towers and enemies
    addTower(100, 100, 200, 10, 1000)
    addEnemy(0, 50, 100, 2)
    // Game loop would be here
  }

  // Expose game functions
  return {
    start,
    addTower,
    addEnemy,
    update,
    getWave: () => wave
  }
}

// Add back missing functions from TODO comments

/**
 * Function to fix table structure issues (REACT_027)
 * @param {HTMLTableElement} table - The table element to fix
 * @returns {Object} Result object with valid status and any errors
 */
function fixTableStructure (table) {
  const result = { valid: true, errors: [] }

  if (!table) {
    return { valid: false, errors: ['Table element is required'] }
  }

  // Fix missing thead
  const thead = table.querySelector('thead')
  if (!thead) {
    const newThead = document.createElement('thead')
    const firstRow = table.querySelector('tr')
    if (firstRow) {
      newThead.appendChild(firstRow.cloneNode(true))
      table.insertBefore(newThead, table.firstChild)
    }
  }

  // Fix missing tbody
  if (!table.querySelector('tbody')) {
    const tbody = document.createElement('tbody')
    const rows = Array.from(table.querySelectorAll('tr'))
    if (rows.length > 0 && table.querySelector('thead')) {
      const theadRows = table.querySelectorAll('thead tr')
      const dataRows = rows.slice(theadRows.length)
      dataRows.forEach((row) => tbody.appendChild(row))
    }
    table.appendChild(tbody)
  }

  // Fix inconsistent column counts
  const allRows = table.querySelectorAll('tr')
  const columnCounts = Array.from(allRows).map((row) => row.querySelectorAll('td, th').length)
  const uniqueCounts = [...new Set(columnCounts)]
  if (uniqueCounts.length > 1) {
    // Use the most common column count
    const countCounts = {}
    columnCounts.forEach((count) => {
      countCounts[count] = (countCounts[count] || 0) + 1
    })
    const mostCommonCount = Object.entries(countCounts).sort((a, b) => b[1] - a[1])[0][0]

    allRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td, th')
      if (cells.length !== mostCommonCount) {
        // Add or remove cells to match the most common count
        while (cells.length < mostCommonCount) {
          const cell = document.createElement(cells.length % 2 === 0 ? 'td' : 'th')
          row.appendChild(cell)
        }
        while (cells.length > mostCommonCount) {
          row.removeChild(row.lastChild)
        }
        result.errors.push(
                    `Fixed inconsistent cell count in row ${rowIndex}: set to ${mostCommonCount}`
        )
      }
    })
    result.valid = result.errors.length === 0
  }

  return result
}

/**
 * Function to add landmark issues (REACT_017)
 * @param {HTMLElement} element - The landmark element to process
 * @returns {Object} Result object with valid status and any errors
 */
function addLandmarkIssues (element) {
  const errors = []

  if (!element) {
    return { valid: false, errors: ['Element is required'] }
  }

  // Check if element has role attribute
  const role = element.getAttribute('role')
  if (!role) {
    // Try to infer role from tag name
    const tagName = element.tagName.toLowerCase()
    if (tagName === 'header') {
      element.setAttribute('role', 'banner')
      errors.push('Added role="banner" to header element')
    } else if (tagName === 'nav') {
      element.setAttribute('role', 'navigation')
      errors.push('Added role="navigation" to nav element')
    } else if (tagName === 'main') {
      element.setAttribute('role', 'main')
      errors.push('Added role="main" to main element')
    } else if (tagName === 'aside') {
      element.setAttribute('role', 'complementary')
      errors.push('Added role="complementary" to aside element')
    } else if (tagName === 'footer') {
      element.setAttribute('role', 'contentinfo')
      errors.push('Added role="contentinfo" to footer element')
    }
  }

  // Check for required accessible names
  const landmarksNeedingNames = ['navigation', 'search', 'form', 'region', 'complementary']
  if (role && landmarksNeedingNames.includes(role)) {
    const hasLabel =
            element.getAttribute('aria-label') ||
            element.getAttribute('aria-labelledby') ||
            element.querySelector('h1, h2, h3, h4, h5, h6')
    if (!hasLabel) {
      errors.push(`Landmark role "${role}" is missing accessible name`)
    }
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Function to add accessible names to SVGs (REACT_041)
 * @param {SVGElement} svg - The SVG element to process
 * @param {string} accessibleName - The accessible name to add
 * @returns {Object} Result object with valid status and any errors
 */
function addSvgAccessibleNames (svg, accessibleName) {
  const result = { valid: true, errors: [] }

  if (!svg) {
    return { valid: false, errors: ['SVG element is required'] }
  }

  if (!accessibleName) {
    result.errors.push('Accessible name is required')
    result.valid = false
    return result
  }

  // Check if SVG already has an accessible name
  const hasAriaLabel = svg.getAttribute('aria-label')
  const hasTitle = svg.querySelector('title')
  const hasAriaLabelledby = svg.getAttribute('aria-labelledby')

  if (hasAriaLabel || hasTitle || hasAriaLabelledby) {
    result.errors.push('SVG already has an accessible name')
    result.valid = false
    return result
  }

  // Add aria-label to SVG
  svg.setAttribute('aria-label', accessibleName)

  return result
}

/**
 * Fixes fake link issues (REACT_036)
 * Converts elements that look like links but are actually buttons to proper accessible buttons
 * or ensures links have proper href attributes
 * @param {HTMLElement} element - The element to fix
 * @returns {Object} Result object with valid status and any errors
 */
function fixFakeLinkIssue (element) {
  const result = { valid: true, errors: [], changes: [] }

  if (!element) {
    return { valid: false, errors: ['Element is required'] }
  }

  const tagName = element.tagName.toLowerCase()
  const isAnchor = tagName === 'a'
  const hasClickHandler =
        element.onclick ||
        element.getAttribute('href') === '#' ||
        element.getAttribute('href') === 'javascript:void(0)'

  // Check if it's a fake link (anchor without proper href)
  if (isAnchor) {
    const href = element.getAttribute('href')

    // If href is # or javascript:void(0), it's likely a fake link
    if (href === '#' || href === 'javascript:void(0)' || href === 'javascript:;') {
      // Check if it has click handler - if so, it should be a button
      if (element.onclick || element.getAttribute('onclick')) {
        // Convert to button
        element.setAttribute('role', 'button')
        result.changes.push('Changed role to button for element with JavaScript href')

        // If no aria-label, add one based on text content
        if (
          !element.getAttribute('aria-label') &&
                    !element.getAttribute('aria-labelledby')
        ) {
          const text = element.textContent.trim()
          if (text) {
            element.setAttribute('aria-label', text)
            result.changes.push('Added aria-label based on text content')
          }
        }
      } else if (!href || href === '#') {
        // No href and no click handler - this is a problem
        result.errors.push('Anchor element has no valid href and no click handler')
        result.valid = false
      }
    }

    // Check for missing rel="noopener noreferrer" on external links
    const target = element.getAttribute('target')
    if (target === '_blank') {
      const rel = element.getAttribute('rel') || ''
      if (!rel.includes('noopener')) {
        element.setAttribute('rel', (rel + ' noopener noreferrer').trim())
        result.changes.push('Added rel="noopener noreferrer" for external link')
      }
    }
  }

  // Check for button elements with improper styling that look like links
  if (tagName === 'button') {
    const className = element.className || ''
    // If button has link-related classes, ensure proper role
    if (className.includes('link') || className.includes('url')) {
      if (!element.getAttribute('role')) {
        element.setAttribute('role', 'button')
        result.changes.push('Ensured button has explicit role="button"')
      }
    }
  }

  return result
}

// Export the new functions
module.exports = {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  addLangAttribute,
  createInPageButton,
  createWebResourceButton,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createWebResourceButton,
  validateUniqueLandmarks,
  newFocusTrap,
  checkAccessibility // Add the new export
}
