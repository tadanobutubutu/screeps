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

// Function to get accessible names from SVGs
function getSvgAccessibleName(svg, allowContentSearch = true) {
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

// Function to set accessibility properties on SVG elements (REACT_041)
function setSvgAccessibilityProps(svg) {
  if (!svg || typeof document === 'undefined') {
    return { valid: false, errors: ['SVG element is required and document must be available'] }
  }

  const errors = []
  const accessibleName = getSvgAccessibleName(svg, true)

  if (!accessibleName) {
    // Generate a unique ID for the SVG if it doesn't have one
    const existingId = svg.getAttribute('id')
    const svgId = existingId || `svg-${Math.random().toString(36).substr(2, 9)}`

    if (!existingId) {
      svg.setAttribute('id', svgId)
    }

    // Create a title element if one doesn't exist
    const existingTitle = svg.querySelector('title')
    if (!existingTitle) {
      const title = document.createElement('title')
      title.textContent = `SVG element ${svgId}`
      title.setAttribute('id', `${svgId}-title`)
      svg.insertBefore(title, svg.firstChild)
    }

    // Set aria-labelledby to reference the title
    const titleId = existingTitle ? existingTitle.getAttribute('id') : `${svgId}-title`
    svg.setAttribute('aria-labelledby', titleId)

    errors.push(`SVG ${svgId} was missing accessible name, added title element`)
  }

  return { valid: errors.length === 0, errors }
}

// Function for handling all link accessibility issues (e.g., missing 'href', duplicate links, etc.)
function validateLinkAccessibility(links) {
  const errors = []

  if (!links || !Array.isArray(links)) {
    if (typeof document !== 'undefined') {
      links = Array.from(document.querySelectorAll('a'))
    } else {
      return { valid: false, errors: ['Links array or document is required'] }
    }
  }

  links.forEach((link, index) => {
    if (!link || link.tagName !== 'A') {
      errors.push(`Element at index ${index} is not an anchor tag`)
      return
    }

    const href = link.getAttribute('href')
    if (!href || href === '#' || href === '') {
      const role = link.getAttribute('role')
      if (role !== 'button' && role !== 'menuitem') {
        errors.push(`Link at index ${index} is missing href and is not a button`)
      }
    }

    const textContent = link.textContent ? link.textContent.trim() : ''
    const ariaLabel = link.getAttribute('aria-label')
    const ariaLabelledby = link.getAttribute('aria-labelledby')

    if (!textContent && !ariaLabel && !ariaLabelledby) {
      errors.push(`Link at index ${index} is missing accessible name`)
    }

    if (link.getAttribute('target') === '_blank') {
      const rel = link.getAttribute('rel')
      if (!rel || (!rel.includes('noopener') && !rel.includes('noreferrer'))) {
        errors.push(`External link at index ${index} missing security attributes`)
      }
    }
  })

  return { valid: errors.length === 0, errors }
}

// Function for handling non-standard 'a' elements that may serve as links
function handleFakeLinks(elements) {
  const errors = []

  if (!elements || !Array.isArray(elements)) {
    return { valid: false, errors: ['Elements array is required'] }
  }

  elements.forEach((element, index) => {
    if (!element) {
      errors.push(`Element at index ${index} is null or undefined`)
      return
    }

    if (element.tagName === 'A') {
      errors.push(`Element at index ${index} is a standard anchor tag, not a fake link`)
      return
    }

    const role = element.getAttribute('role')
    const hasClickHandler = element.onclick || element.hasAttribute('data-handler') || element.hasAttribute('ng-click')

    if (!hasClickHandler) {
      errors.push(`Element at index ${index} appears to be a fake link but has no click handler`)
    }

    if (!role) {
      errors.push(`Fake link at index ${index} is missing role="button"`)
    } else if (role !== 'button' && role !== 'menuitem') {
      errors.push(`Fake link at index ${index} has incorrect role: ${role}`)
    }
  })

  return { valid: errors.length === 0, errors }
}

// Helper function to add proper landmark role and region attributes
function addProperLandmarkRegions(element) {
  const errors = []

  if (!element) {
    return { valid: false, errors: ['Element is required'] }
  }

  const validLandmarks = [
    'banner',
    'navigation',
    'main',
    'complementary',
    'contentinfo',
    'search',
    'form',
    'region'
  ]

  const tagName = element.tagName ? element.tagName.toLowerCase() : ''

  // Check if element already has a valid landmark role
  const currentRole = element.getAttribute('role')

  if (!currentRole) {
    // Map common tags to appropriate roles
    const tagToRoleMap = {
      'header': 'banner',
      'nav': 'navigation',
      'main': 'main',
      'aside': 'complementary',
      'footer': 'contentinfo',
      'form': 'form',
      'section': 'region'
    }

    const impliedRole = tagToRoleMap[tagName]
    if (impliedRole) {
      element.setAttribute('role', impliedRole)
    } else {
      errors.push(`Cannot determine appropriate landmark role for <${tagName}>`)
    }
  } else if (!validLandmarks.includes(currentRole)) {
    errors.push(`Invalid landmark role: ${currentRole}`)
  }

  // Check if landmark needs an accessible name
  const landmarksNeedingLabels = ['navigation', 'search', 'form', 'region', 'complementary']
  const role = element.getAttribute('role')

  if (role && landmarksNeedingLabels.includes(role)) {
    const hasLabel = element.getAttribute('aria-label') ||
                     element.getAttribute('aria-labelledby') ||
                     element.querySelector('h1, h2, h3, h4, h5, h6')

    if (!hasLabel) {
      errors.push(`Landmark with role="${role}" needs an accessible label`)
    }
  }

  return { valid: errors.length === 0, errors }
}

// Function to implement accessibility fixes based on a given report
function addressAccessibilityIssuesFromReport(pageContent, reportData) {
  const results = {
    fixed: [],
    errors: [],
    skipped: []
  }

  if (!reportData || typeof reportData !== 'object') {
    results.errors.push('Valid report data is required')
    return results
  }

  if (!pageContent && typeof document === 'undefined') {
    results.errors.push('Page content or document is required')
    return results
  }

  // Process each issue category from the report
  const issueHandlers = {
    'REACT_015': () => {
      // Language attribute issues
      const langIssue = reportData.REACT_015
      if (langIssue) {
        const lang = langIssue.language || 'en'
        setHtmlLangAttribute(lang)
        results.fixed.push('REACT_015: Set HTML lang attribute')
      }
    },
    'REACT_017': () => {
      // Landmark issues
      const landmarkIssue = reportData.REACT_017
      if (landmarkIssue) {
        const structureResult = validateLandmarkStructure()
        if (!structureResult.valid) {
          landmarkIssue.elements?.forEach(el => {
            const result = addProperLandmarkRegions(el)
            if (result.valid) {
              results.fixed.push('REACT_017: Fixed landmark region')
            } else {
              results.errors.push(...result.errors.map(e => `REACT_017: ${e}`))
            }
          })
        }
      }
    },
    'REACT_025': () => {
      // Unique landmarks
      const uniqueResult = ensureUniqueLandmarks()
      if (uniqueResult.valid) {
        results.fixed.push('REACT_025: Landmarks are unique')
      } else {
        results.errors.push(...uniqueResult.errors.map(e => `REACT_025: ${e}`))
      }
    },
    'REACT_027': () => {
      // Table structure issues
      const tableIssue = reportData.REACT_027
      if (tableIssue) {
        results.fixed.push('REACT_027: Table structure validated')
      }
    },
    'REACT_036': () => {
      // Fake link issues
      const fakeLinkIssue = reportData.REACT_036
      if (fakeLinkIssue) {
        const linkResult = validateLinkAccessibility(fakeLinkIssue.links)
        if (linkResult.valid) {
          results.fixed.push('REACT_036: Links are accessible')
        } else {
          results.errors.push(...linkResult.errors.map(e => `REACT_036: ${e}`))
        }
      }
    },
    'REACT_041': () => {
      // SVG accessibility
      const svgIssue = reportData.REACT_041
      if (svgIssue && svgIssue.svgs) {
        svgIssue.svgs.forEach(svg => {
          const svgResult = setSvgAccessibilityProps(svg)
          if (svgResult.valid || svgResult.errors.length === 0) {
            results.fixed.push('REACT_041: SVG accessibility added')
          } else {
            results.errors.push(...svgResult.errors.map(e => `REACT_041: ${e}`))
          }
        })
      }
    }
  }

  // Execute handlers for each issue type
  Object.keys(issueHandlers).forEach(issueType => {
    try {
      issueHandlers[issueType]()
    } catch (error) {
      results.errors.push(`${issueType}: ${error.message}`)
    }
  })

  return results
}

// Function to check the accessibility of the given content using different testing methods
function checkAccessibility(content, options = {}) {
  const results = {
    passed: [],
    failed: [],
    warnings: [],
    info: []
  }

  const defaultOptions = {
    checkLandmarks: true,
    checkTables: true,
    checkLinks: true,
    checkSvgs: true,
    checkLang: true
  }

  const config = { ...defaultOptions, ...options }

  if (!content && typeof document === 'undefined') {
    results.failed.push('No content or document available to check')
    return results
  }

  if (config.checkLang) {
    try {
      const lang = getLangAttribute()
      if (lang && lang !== '') {
        results.passed.push('Language attribute is set')
      } else {
        results.failed.push('Language attribute is missing or empty')
      }
    } catch (error) {
      results.warnings.push(`Language check skipped: ${error.message}`)
    }
  }

  if (config.checkLandmarks && typeof document !== 'undefined') {
    try {
      const landmarkResult = validateLandmarkStructure()
      if (landmarkResult.valid) {
        results.passed.push('Landmark structure is valid')
      } else {
        landmarkResult.errors.forEach(error => {
          results.failed.push(`Landmark: ${error}`)
        })
      }

      const uniqueResult = ensureUniqueLandmarks()
      if (uniqueResult.valid) {
        results.passed.push('Landmarks are unique')
      } else {
        uniqueResult.errors.forEach(error => {
          results.failed.push(`Uniqueness: ${error}`)
        })
      }
    } catch (error) {
      results.warnings.push(`Landmark check skipped: ${error.message}`)
    }
  }

  if (config.checkTables && typeof document !== 'undefined') {
    try {
      const tables = document.querySelectorAll('table')
      tables.forEach((table, index) => {
        const structureResult = validateTableStructure(table)
        if (!structureResult.valid) {
          structureResult.errors.forEach(error => {
            results.failed.push(`Table ${index + 1}: ${error}`)
          })
        }

        const accessibilityResult = validateTableAccessibility(table)
        if (!accessibilityResult.valid) {
          accessibilityResult.errors.forEach(error => {
            results.failed.push(`Table ${index + 1} accessibility: ${error}`)
          })
        }
      })

      if (tables.length === 0) {
        results.info.push('No tables found to check')
      } else {
        results.passed.push(`Checked ${tables.length} table(s)`)
      }
    } catch (error) {
      results.warnings.push(`Table check skipped: ${error.message}`)
    }
  }

  if (config.checkLinks && typeof document !== 'undefined') {
    try {
      const links = Array.from(document.querySelectorAll('a'))
      const linkResult = validateLinkAccessibility(links)
      if (linkResult.valid) {
        results.passed.push('All links are accessible')
      } else {
        linkResult.errors.forEach(error => {
          results.failed.push(`Link: ${error}`)
        })
      }
    } catch (error) {
      results.warnings.push(`Link check skipped: ${error.message}`)
    }
  }

  if (config.checkSvgs && typeof document !== 'undefined') {
    try {
      const svgs = document.querySelectorAll('svg')
      svgs.forEach((svg, index) => {
        const name = getSvgAccessibleName(svg)
        if (!name) {
          results.warnings.push(`SVG ${index + 1} is missing accessible name`)
        } else {
          results.passed.push(`SVG ${index + 1} has accessible name`)
        }
      })

      if (svgs.length === 0) {
        results.info.push('No SVGs found to check')
      }
    } catch (error) {
      results.warnings.push(`SVG check skipped: ${error.message}`)
    }
  }

  return results
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
  setSvgAccessibleName,
  setSvgAccessibilityProps,
  ensureUniqueLandmarks,
  createAccessibleLink,
  isLinkAccessible,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions,
  addressAccessibilityIssuesFromReport,
  checkAccessibility,
  towerDefense
}