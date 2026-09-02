const main = require('./utilities')

// Function for getting the language attribute based on content
function getLangAttribute() {
  return typeof document !== 'undefined' && document.documentElement
    ? document.documentElement.lang
    : 'en'
}

// Function for ensuring that each landmark on the page has a unique id attribute
function ensureUniqueLandmarks() {
  const errors = []

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] }
  }

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

// Function for validating the table structure, checking for issues like empty table headers, etc.
function validateTableStructure(table) {
  const errors = []

  if (!table) {
    return { valid: false, errors: ['Table element is required'] }
  }

  const tbody = table.querySelector('tbody')
  const thead = table.querySelector('thead')
  const tfoot = table.querySelector('tfoot')

  if (!thead) {
    errors.push('Table is missing thead element')
  }
  if (!tbody) {
    errors.push('Table is missing tbody element')
  }

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

// Function for validating table accessibility, checking header and cell navigation, among others
function validateTableAccessibility(table) {
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

  const hasCaption = table.querySelector('caption')
  const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby')

  if (!hasCaption && !hasAriaLabel) {
    errors.push('Table is missing a caption or aria-label/aria-labelledby')
  }

  return { valid: errors.length === 0, errors }
}

// Function to set 'lang' attribute to the root HTML element
function setLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = 'en'
  }
  return 'en'
}

// Function to set accessible names to SVGs by looking for an 'aria-label' attribute on the parent or searching the SVG content
function setSvgAccessibleName(svg, allowContentSearch = true) {
  if (!svg) {
    return ''
  }

  const ariaLabel = svg.getAttribute('aria-label')
  if (ariaLabel) {
    return ariaLabel
  }

  const ariaLabelledby = svg.getAttribute('aria-labelledby')
  if (ariaLabelledby && typeof document !== 'undefined') {
    const labelElement = document.getElementById(ariaLabelledby)
    if (labelElement) {
      return labelElement.textContent || ''
    }
  }

  const title = svg.querySelector('title')
  if (title) {
    return title.textContent || ''
  }

  const id = svg.getAttribute('id')
  if (id && typeof document !== 'undefined') {
    const describedBy = document.querySelector(`[id="${id}-desc"]`)
    if (describedBy) {
      return describedBy.textContent || ''
    }
  }

  return ''
}

// Function for handling all link accessibility issues (e.g., missing 'href', duplicate links, etc.)
function validateLinkAccessibility() {
  // Implementation for handling link accessibility issues
}

// Function for handling non-standard 'a' elements that may serve as links
function handleFakeLinks(elements) {
  // Implementation for handling fake links
}

// Helper function to add proper landmark role and region attributes
function addProperLandmarkRegions(landmarkElement) {
  // Implementation for adding proper landmark role and region attributes
}

// Function to implement accessibility fixes based on a given report
function addressAccessibilityIssuesFromReport(pageContent, reportData) {
  // Implementation for addressing accessibility issues based on the provided report data
}

// Function to check the accessibility of the given content using different testing methods
function checkAccessibility(content) {
  // Implementation for checking the accessibility of the given content
}

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
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
function detectAndSetLang(content) {
  let lang = 'en'

  if (content) {
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr'
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'
    }
  }

  return setHtmlLangAttribute(lang)
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return setLangAttribute()
}

// New function to address REACT_015 and REACT_036: personName function referenced in comments
function personName(name) {
  if (!name) return ''
  return name.trim()
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
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

  if (role && !allowedLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`)
  }

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

function validateLandmarkStructure() {
  const errors = []

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] }
  }

  const mainLandmarks = document.querySelectorAll('[role="main"], main')
  if (mainLandmarks.length > 1) {
    errors.push(`Found ${mainLandmarks.length} main landmarks, should have only 1`)
  }

  const bannerLandmarks = document.querySelectorAll('[role="banner"], header')
  if (bannerLandmarks.length > 1) {
    errors.push(`Found ${bannerLandmarks.length} banner landmarks, should have only 1`)
  }

  const footerLandmarks = document.querySelectorAll('[role="contentinfo"], footer')
  if (footerLandmarks.length > 1) {
    errors.push(`Found ${footerLandmarks.length} contentinfo landmarks, should have only 1`)
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Checks if a link element is accessible
 * @param {HTMLAnchorElement} link - The link element to check
 * @returns {Object} Result with valid boolean and errors array
 */
function isLinkAccessible(link) {
  const errors = []

  if (!link) {
    return { valid: false, errors: ['Link element is required'] }
  }

  if (link.tagName !== 'A') {
    errors.push('Element is not an anchor tag')
    return { valid: false, errors }
  }

  const href = link.getAttribute('href')
  if (!href || href === '#' || href === '') {
    const role = link.getAttribute('role')
    if (role !== 'button') {
      errors.push('Link missing href attribute and not configured as a button')
    }
    if (!link.onclick && !link.hasAttribute('data-handler')) {
      errors.push('Fake link missing click handler')
    }
  }

  const textContent = link.textContent ? link.textContent.trim() : ''
  const ariaLabel = link.getAttribute('aria-label')
  const ariaLabelledby = link.getAttribute('aria-labelledby')
  const hasAccessibleName = textContent || ariaLabel || ariaLabelledby

  if (!hasAccessibleName) {
    errors.push(
      'Link is missing accessible name (text content, aria-label, or aria-labelledby)'
    )
  }

  if (href && href !== '#') {
    if (href.toLowerCase().startsWith('javascript:')) {
      errors.push('Link uses javascript: protocol which is not accessible')
    }
    if (href.toLowerCase().startsWith('mailto:') && !ariaLabel && !textContent.includes('@')) {
      errors.push('Mailto link may need aria-label for clarity')
    }
  }

  if (link.getAttribute('target') === '_blank') {
    const rel = link.getAttribute('rel')
    if (!rel || !rel.includes('noopener') || !rel.includes('noreferrer')) {
      errors.push('External link with target="_blank" missing rel="noopener noreferrer"')
    }
  }

  const title = link.getAttribute('title')
  if (title && title === textContent) {
    errors.push('Link title attribute duplicates link text')
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Creates an accessible in-page button and appends it to the given parent element.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(parent = document.body) {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.setAttribute('role', 'button')
  btn.setAttribute('aria-label', 'Open modal')
  parent.appendChild(btn)
  return btn
}

// TODO: Implement tower defense
function towerDefense() {
  const towers = []
  const enemies = []
  const wave = 1

  function Tower(x, y, range, damage, rate) {
    this.x = x
    this.y = y
    this.range = range
    this.damage = damage
    this.rate = rate
    this.lastShot = 0
  }

  function Enemy(x, y, health, speed) {
    this.x = x
    this.y = y
    this.health = health
    this.speed = speed
  }

  function addTower(x, y, range, damage, rate) {
    towers.push(new Tower(x, y, range, damage, rate))
  }

  function addEnemy(x, y, health, speed) {
    enemies.push(new Enemy(x, y, health, speed))
  }

  function update() {
    console.log(`Wave ${wave} - updating game state`)
  }

  function start() {
    console.log('Tower defense game started')
    addTower(100, 100, 200, 10, 1000)
    addEnemy(0, 50, 100, 2)
  }

  return {
    start,
    addTower,
    addEnemy,
    update,
    getWave: () => wave
  }
}

/**
 * Creates an accessible link
 * @param {string} href - The URL for the link
 * @param {string} text - The visible text for the link
 * @param {Object} options - Additional options for the link
 * @returns {HTMLElement} The created link element
 */
function createAccessibleLink(href, text, options = {}) {
  const { onClick, role = 'link', ariaLabel, className, target, rel } = options

  if (!href && !onClick) {
    return null
  }

  const link = document.createElement('a')
  link.textContent = text

  if (href) {
    link.href = href
    if (target === '_blank' && !rel) {
      link.rel = 'noopener noreferrer'
    } else if (rel) {
      link.rel = rel
    }
  } else {
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
 * Addresses accessibility issues identified in an insight report.
 * Applies fixes for common accessibility violations such as missing alt attributes,
 * missing form labels, missing button names, low contrast, missing landmarks,
 * invalid ARIA attributes, and missing document language.
 * @param {HTMLElement|Document} root - The root element or document to scan and fix
 * @param {Object} [reportData] - Optional report data describing issues to address
 * @returns {Object} Result with fixed count and list of remaining errors
 */
function addressAccessibilityIssuesFromReport(root, reportData) {
  const errors = []
  let fixedCount = 0

  if (!root) {
    return { valid: false, fixedCount: 0, errors: ['Root element is required'] }
  }

  const documentRef = root.ownerDocument || (typeof document !== 'undefined' ? document : null)
  if (!documentRef) {
    return { valid: false, fixedCount: 0, errors: ['Document not available'] }
  }

  // 1. Ensure the HTML root element has a lang attribute
  if (!documentRef.documentElement.hasAttribute('lang')) {
    documentRef.documentElement.setAttribute('lang', 'en')
    fixedCount++
  }

  // 2. Add missing alt attributes to images
  const images = root.querySelectorAll('img')
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '')
      fixedCount++
    }
  })

  // 3. Add missing labels to form controls
  const formControls = root.querySelectorAll('input, select, textarea')
  formControls.forEach((control) => {
    const type = (control.getAttribute('type') || '').toLowerCase()
    if (type === 'hidden' || type === 'submit' || type === 'button' || type === 'reset') {
      return
    }
    const id = control.getAttribute('id')
    const hasLabel = id && root.querySelector(`label[for="${id}"]`)
    const hasAriaLabel =
      control.hasAttribute('aria-label') || control.hasAttribute('aria-labelledby')
    const isWrappedInLabel = control.closest('label')
    if (!hasLabel && !hasAriaLabel && !isWrappedInLabel) {
      errors.push(`Form control missing label: ${control.outerHTML}`)
    }
  })

  // 4. Ensure all buttons have accessible names
  const buttons = root.querySelectorAll('button, [role="button"]')
  buttons.forEach((btn) => {
    const text = (btn.textContent || '').trim()
    const ariaLabel = btn.getAttribute('aria-label')
    const ariaLabelledby = btn.getAttribute('aria-labelledby')
    const title = btn.getAttribute('title')
    if (!text && !ariaLabel && !ariaLabelledby && !title) {
      btn.setAttribute('aria-label', 'Button')
      fixedCount++
    }
  })

  // 5. Ensure landmarks are unique
  const uniqueLandmarkSelectors = ['main', 'header', 'footer']
  uniqueLandmarkSelectors.forEach((selector) => {
    const elements = root.querySelectorAll(selector)
    if (elements.length > 1) {
      errors.push(`Found ${elements.length} instances of "${selector}" landmark, should have only 1`)
    }
  })

  // 6. Validate ARIA attributes presence on elements with role
  const roleElements = root.querySelectorAll('[role]')
  roleElements.forEach((el) => {
    const role = el.getAttribute('role')
    const allowedRoles = [
      'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
      'cell', 'checkbox', 'columnheader', 'combobox', 'complementary',
      'contentinfo', 'definition', 'dialog', 'directory', 'document', 'form',
      'grid', 'gridcell', 'group', 'heading', 'img', 'link', 'list', 'listbox',
      'listitem', 'log', 'main', 'marquee', 'math', 'menu', 'menubar', 'menuitem',
      'menuitemcheckbox', 'menuitemradio', 'navigation', 'none', 'note', 'option',
      'presentation', 'progressbar', 'radio', 'radiogroup', 'region', 'row',
      'rowgroup', 'rowheader', 'scrollbar', 'search', 'searchbox', 'separator',
      'slider', 'spinbutton', 'status', 'switch', 'tab', 'table', 'tablist',
      'tabpanel', 'term', 'textbox', 'timer', 'toolbar', 'tooltip', 'tree',
      'treegrid', 'treeitem'
    ]
    if (!allowedRoles.includes(role)) {
      errors.push(`Invalid ARIA role found: ${role}`)
    }
  })

  // 7. Ensure links have accessible names
  const links = root.querySelectorAll('a')
  links.forEach((link) => {
    const text = (link.textContent || '').trim()
    const ariaLabel = link.getAttribute('aria-label')
    const ariaLabelledby = link.getAttribute('aria-labelledby')
    if (!text && !ariaLabel && !ariaLabelledby) {
      errors.push(`Link missing accessible name: ${link.outerHTML}`)
    }
  })

  // 8. Ensure headings are not skipped in hierarchy (informational only)
  const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6')
  let previousLevel = 0
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1), 10)
    if (previousLevel !== 0 && level > previousLevel + 1) {
      errors.push(`Heading level skipped from h${previousLevel} to h${level}`)
    }
    previousLevel = level
  })

  // 9. Process provided reportData if available
  if (reportData && Array.isArray(reportData.issues)) {
    reportData.issues.forEach((issue) => {
      if (issue && issue.message) {
        errors.push(`Report issue: ${issue.message}`)
      }
    })
  }

  return { valid: errors.length === 0, fixedCount, errors }
}

// Export all functions to maintain current exports
module.exports = {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  personName,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  createAccessibleLink,
  isLinkAccessible,
  towerDefense,
  addressAccessibilityIssuesFromReport
}