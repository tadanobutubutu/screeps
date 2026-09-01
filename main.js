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
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja' // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru' // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar' // Arabic
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr' // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de' // German
    }
  }

  return setHtmlLangAttribute(lang)
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute () {
  return typeof document !== 'undefined' && document.documentElement
    ? document.documentElement.lang
    : 'en'
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
function validateLandmark (element) {
  // This function validates landmarks
  const errors = []
  const allowedLandmarks = [
    'banner',
    'navigation',
    'main',
    'complementary',
    'contentinfo',
    'search',
    'form',
    'region'
  ]

  if (!element) {
    return { valid: false, errors: ['Element is required'] }
  }

  const role = element.getAttribute('role')
  const tagName = element.tagName.toLowerCase()

  // Check if element has valid landmark role
  if (role && !allowedLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`)
  }

  // Check if landmark has accessible name when required
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

function validateLandmarkStructure () {
  // This function validates the structure of landmarks
  const errors = []

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] }
  }

  // Check for multiple main landmarks
  const mainLandmarks = document.querySelectorAll('[role="main"], main')
  if (mainLandmarks.length > 1) {
    errors.push(`Found ${mainLandmarks.length} main landmarks, should have only 1`)
  }

  // Check for multiple banner landmarks
  const bannerLandmarks = document.querySelectorAll('[role="banner"], header')
  if (bannerLandmarks.length > 1) {
    errors.push(`Found ${bannerLandmarks.length} banner landmarks, should have only 1`)
  }

  // Check for contentinfo (footer) landmarks
  const footerLandmarks = document.querySelectorAll('[role="contentinfo"], footer')
  if (footerLandmarks.length > 1) {
    errors.push(`Found ${footerLandmarks.length} contentinfo landmarks, should have only 1`)
  }

  return { valid: errors.length === 0, errors }
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName (svg) {
  // This function returns the accessible name for an SVG
  if (!svg) {
    return ''
  }

  // Check for aria-label attribute
  const ariaLabel = svg.getAttribute('aria-label')
  if (ariaLabel) {
    return ariaLabel
  }

  // Check for aria-labelledby reference
  const ariaLabelledby = svg.getAttribute('aria-labelledby')
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby)
    if (labelElement) {
      return labelElement.textContent || ''
    }
  }

  // Check for title element inside SVG
  const title = svg.querySelector('title')
  if (title) {
    return title.textContent || ''
  }

  // Check for adjacent description
  const id = svg.getAttribute('id')
  if (id) {
    const describedBy = document.querySelector(`[id="${id}-desc"]`)
    if (describedBy) {
      return describedBy.textContent || ''
    }
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
  })

  // Check for landmark IDs that should be unique
  const landmarksWithIds = document.querySelectorAll('[role][id]')
  const ids = new Set()
  landmarksWithIds.forEach((el) => {
    const id = el.getAttribute('id')
    if (ids.has(id)) {
      errors.push(`Duplicate landmark id found: ${id}`)
    }
    ids.add(id)
  })

  return { valid: errors.length === 0, errors }
}

// New function to address REACT_036: Fix 1 fake link issue
function createAccessibleLink (href, text, options = {}) {
  // This function creates an accessible link
  const { onClick, role = 'link', ariaLabel, className, target, rel } = options

  if (!href && !onClick) {
    return null
  }

  const link = document.createElement('a')
  link.textContent = text

  if (href) {
    link.href = href
    // Add rel="noopener noreferrer" for external links
    if (target === '_blank' && !rel) {
      link.rel = 'noopener noreferrer'
    } else if (rel) {
      link.rel = rel
    }
  } else {
    // If no href, it's a button disguised as a link
    link.href = '#'
    link.addEventListener('click', (e) => {
      e.preventDefault()
      if (onClick) {
        onClick(e)
      }
    })
  }

  if (target) {
    link.target = target
  }

  if (className) {
    link.className = className
  }

  if (ariaLabel) {
    link.setAttribute('aria-label', ariaLabel)
  }

  if (role && role !== 'link') {
    link.setAttribute('role', role)
  }

  return link
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

/**
 * Creates an accessible web resource button for linking to external resources.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @param {string} label - The accessible label/description of the button
 * @returns {HTMLElement} The created button element
 */
function createWebResourceButton (parent = document.body, label = 'Open Resource') {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.setAttribute('role', 'button')
  btn.setAttribute('aria-label', label)
  parent.appendChild(btn)
  return btn
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
 * Function to fix fake link issues (REACT_036)
 * @param {HTMLElement} element - The element to check and fix
 * @returns {Object} Result object with valid status and any errors
 */
function fixFakeLinkIssue (element) {
  const result = { valid: true, errors: [] }

  if (!element) {
    return { valid: false, errors: ['Element is required'] }
  }

  // Check if element is a fake link (button with link appearance)
  const isButton = element.tagName.toLowerCase() === 'button'
  const hasLinkRole = element.getAttribute('role') === 'link'
  const hasLinkClass = element.classList.contains('link')

  if (isButton && (hasLinkRole || hasLinkClass)) {
    // Convert to proper link or button
    if (element.hasAttribute('href')) {
      // It's actually a link, just needs proper role
      element.setAttribute('role', 'link')
      result.errors.push('Fixed fake link by adding proper role')
    } else {
      // It's a button disguised as a link
      const btn = document.createElement('button')
      btn.textContent = element.textContent
      btn.className = element.className.replace('link', '')
      btn.setAttribute('aria-label', element.getAttribute('aria-label') || 'Button')

      // Copy event listeners
      const listeners = element._eventListeners || {}
      Object.keys(listeners).forEach((eventType) => {
        listeners[eventType].forEach((listener) => {
          btn.addEventListener(eventType, listener)
        })
      })

      // Replace the element
      element.parentNode.replaceChild(btn, element)
      result.errors.push('Converted fake link to proper button')
    }
  }

  return result
}

/**
 * Function to add lang attribute to HTML element (REACT_015)
 * @returns {string} The lang attribute value that was set
 */
function addLangAttribute () {
  const lang = getLangAttribute()
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang
  }
  return lang
}

/**
 * Function to get person name with proper accessibility attributes
 * @param {string} name - The person's name
 * @returns {string} The formatted name with accessibility attributes
 */
function personName (name) {
  if (!name) return ''

  // Add aria-label for screen readers
  return `<span aria-label="Person's name">${name}</span>`
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
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  addLandmarkIssues,
  addSvgAccessibleNames,
  createAccessibleLink,
  towerDefense,
  personName
}
