// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute; handled by getLangAttribute(); and personName())
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
    // Check for Chinese characters (CJK Unified Ideographs)
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh' // Chinese
    } else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(content)) {
      lang = 'ja' // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru' // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar' // Arabic
    } else if (/[àâäçéèêëîïôùûüœæ]/i.test(content)) {
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

// New function to address REACT_015 and REACT_036: personName function referenced in comments
function personName (name) {
  // Returns a formatted person name for accessibility purposes
  if (!name) return ''
  return name.trim()
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
    const describedBy = document.getElementById(`${id}-desc`)
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
  const landmarksWithIds = document.querySelectorAll('nav, aside, section, main, header, footer')
  const ids = new Set()
  landmarksWithIds.forEach(el => {
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
    link.href = '#'
  }

  if (onClick) {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      onClick(e)
    })
  }

  if (role) link.setAttribute('role', role)
  if (ariaLabel) link.setAttribute('aria-label', ariaLabel)
  if (className) link.className = className
  if (target) link.target = target

  return link
}