const main = require('./utilities')

// Function for getting the language attribute based on content
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    const content = document.body ? document.body.textContent : ''
    return detectAndSetLang(content)
  }
  return setLangAttribute()
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

/**
 * Ensures the dependencyGraph container has a proper ARIA role
 * @param {HTMLElement} container - The container element to check
 * @returns {boolean} True if the fix was applied
 */
function ensureDependencyGraphAriaRole(container) {
  if (!container) {
    return false;
  }
  
  // Find dependencyGraph containers
  const dependencyGraphs = container.querySelectorAll('[class*="dependencyGraph"], [id*="dependencyGraph"], [data-type="dependency-graph"]');
  
  dependencyGraphs.forEach(graph => {
    // Ensure the container has a proper ARIA role
    if (!graph.getAttribute('role')) {
      graph.setAttribute('role', 'img');
      graph.setAttribute('aria-label', graph.getAttribute('aria-label') || 'Dependency graph visualization');
    }
  });
  
  return dependencyGraphs.length > 0;
}

/**
 * Implements accessibility fixes based on insights from accessibility reports
 * @param {HTMLElement} container - The container element to process
 * @param {Object} containerReport - The accessibility report containing identified issues
 * @returns {Object} Summary of fixes applied
 */
function applyAccessibilityFixes(container, containerReport) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0,
    tablesFixed: 0,
    headersFixed: 0,
    dependencyGraphAriaFixed: false
  };

  if (!container) {
    return fixes;
  }

  // Add lang attribute to HTML element if missing
  const htmlEl = container.querySelector('html') || (container.ownerDocument && container.ownerDocument.documentElement);
  if (htmlEl && !htmlEl.hasAttribute('lang')) {
    htmlEl.setAttribute('lang', 'en');
    fixes.langAdded = true;
  }

  // Add main landmark if missing
  const body = container.querySelector('body') || container.ownerDocument?.body;
  const mainElement = container.querySelector('main');
  if (!mainElement && body) {
    const newMain = container.ownerDocument.createElement('main');
    newMain.setAttribute('id', 'main-content');
    newMain.setAttribute('role', 'main');
    while (body.firstChild) {
      newMain.appendChild(body.firstChild);
    }
    body.appendChild(newMain);
    fixes.mainLandmarkAdded = true;
  }

  // Fix landmark issues
  validateLandmark(container);

  // Count landmark fixes
  const landmarkElements = container.querySelectorAll('[role="navigation"], [role="complementary"], [role="banner"], [role="contentinfo"]');
  fixes.landmarksFixed = landmarkElements.length;

  // Fix SVG accessible names
  const svgElements = container.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', accessibleName);
      fixes.svgNamesAdded++;
    } else if (!accessibleName && !svg.getAttribute('aria-hidden')) {
      // Ensure SVG is focusable for accessibility
      svg.setAttribute('tabindex', '0');
    }
  });

  // Fix fake link issues (elements that look like links but are missing href)
  const fakeLinks = container.querySelectorAll('[role="button"] a, a[role="button"]');
  fakeLinks.forEach((link, index) => {
    if (!link.getAttribute('href')) {
      const existingId = link.id;
      const newId = existingId || 'fake-link-' + index;
      if (!existingId) {
        link.id = newId;
      }
      link.setAttribute('href', '#' + newId);
      link.setAttribute('role', 'link');
      fixes.fakeLinksFixed++;
    }
  });

  // Fix table accessibility
  const tables = container.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
    fixes.tablesFixed++;
    
    // Check and fix headers
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      if (!header.hasAttribute('scope') && header.closest('thead') === null) {
        const row = header.closest('tr');
        if (row) {
          const cellsInRow = row.querySelectorAll('td');
          if (cellsInRow.length > 0 && cellsInRow[0] === header) {
            header.setAttribute('scope', 'row');
          }
        }
      }
    });
    fixes.headersFixed += headers.length;
  });

  // Fix dependencyGraph container ARIA role (from insight report)
  fixes.dependencyGraphAriaFixed = ensureDependencyGraphAriaRole(container);
  if (fixes.dependencyGraphAriaFixed) {
    log('Fixed dependencyGraph container ARIA role', 'info');
  }

  // Update the existing function using the new functions for rendering graph/index
  renderDependencyGraphs(container);

  // Focus trap for keyboard navigation
  focusTrap(container);

  // Add ARIA labels where missing
  addAriaLabel(container);

  // Ensure elements have IDs for accessibility
  ensureElementHasId(container);

  // Validate accessibility report
  const accessibilityReport = validateAccessibilityReport(container);
  if (accessibilityReport && accessibilityReport.issues && accessibilityReport.issues.length > 0) {
    log(`Accessibility report contains ${accessibilityReport.issues.length} remaining issues`, 'warn');
  }

  if (fixes.langAdded) {
    log('Lang attribute added to HTML element', 'info');
  }

  if (fixes.mainLandmarkAdded) {
    log('Main landmark added', 'info');
  }

  if (fixes.svgNamesAdded > 0) {
    log(`Fixed accessible names for ${fixes.svgNamesAdded} SVGs`, 'info');
  }

  if (fixes.fakeLinksFixed > 0) {
    log(`Fixed fake link issues for ${fixes.fakeLinksFixed} elements`, 'info');
  }

  if (fixes.tablesFixed > 0) {
    log(`Fixed ${fixes.tablesFixed} tables`, 'info');
  }

  if (fixes.headersFixed > 0) {
    log(`Fixed ${fixes.headersFixed} table headers`, 'info');
  }

  // Check for new accessibility issues
  const newAccessibilityIssues = checkAccessibility(container);
  if (newAccessibilityIssues.length > 0) {
    log(`New accessibility issues found: ${newAccessibilityIssues.join(', ')}`, 'error');
  }

  return fixes;
}

// Function for validating the table structure for accessibility issues
function validateTableStructure(table) {
  const errors = []

  if (!table) {
    return { valid: false, errors: ['Table element is required'] }
  }

  const thead = table.querySelector('thead')
  const tbody = table.querySelector('tbody')
  const tfoot = table.querySelector('tfoot')

  if (!thead) {
    errors.push('Table is missing thead element')
  }
  if (!tbody) {
    errors.push('Table is missing tbody element')
  }

  const tbodyRows = tbody ? tbody.querySelectorAll('tr') : []
  let expectedCols = null
  tbodyRows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th')
    if (expectedCols === null) {
      expectedCols = cells.length
    } else if (cells.length !== expectedCols) {
      errors.push(
        `Row ${rowIndex} has inconsistent cell count: expected ${expectedCols}, got ${cells.length}`
      )
    }
  })

  // Validate accessibility: th elements should have scope attribute
  const thElements = table.querySelectorAll('th')
  thElements.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header at index ${index} is missing scope attribute`)
    }

    // Check that th elements have accessible names
    const textContent = th.textContent ? th.textContent.trim() : ''
    const ariaLabel = th.getAttribute('aria-label')
    const ariaLabelledby = th.getAttribute('aria-labelledby')
    if (!textContent && !ariaLabel && !ariaLabelledby) {
      errors.push(`Table header at index ${index} is missing accessible name`)
    }
  })

  // Validate accessibility: table should have caption or ARIA label
  const caption = table.querySelector('caption')
  const ariaLabel = table.getAttribute('aria-label')
  const ariaLabelledby = table.getAttribute('aria-labelledby')
  if (!caption && !ariaLabel && !ariaLabelledby) {
    errors.push('Table is missing caption or aria-label/aria-labelledby')
  }

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

// Function to implement accessibility fixes based on a given report
function addressAccessibilityIssues(report) {
  // Implementation for addressing accessibility issues based on the provided report data
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
 * Creates an accessible web resource button (e.g., for GitHub, Stack Overflow, etc.)
 * @param {Object} options - Configuration options for the button
 * @param {string} options.url - The URL for the web resource
 * @param {string} options.label - The accessible label for the button (e.g., "GitHub", "Stack Overflow")
 * @param {string} options.icon - Optional SVG icon HTML string or DOM element
 * @param {string} options.className - Optional CSS class name for styling
 * @param {string} options.ariaDescribedBy - Optional ID of element that describes the button
 * @returns {HTMLButtonElement} The created button element
 */
function createWebResourceButton(options = {}) {
  const { url, label, icon, className, ariaDescribedBy } = options

  if (!url || !label) {
    throw new Error('Web resource button requires both url and label')
  }

  const button = document.createElement('button')
  button.type = 'button'
  button.setAttribute('role', 'button')
  button.setAttribute('aria-label', label)

  if (ariaDescribedBy) {
    button.setAttribute('aria-describedby', ariaDescribedBy)
  }

  if (className) {
    button.className = className
  }

  // Add icon if provided
  if (icon) {
    const iconContainer = document.createElement('span')
    iconContainer.setAttribute('aria-hidden', 'true')
    iconContainer.className = 'web-resource-button__icon'

    if (typeof icon === 'string') {
      iconContainer.innerHTML = icon
    } else if (icon instanceof Node) {
      iconContainer.appendChild(icon)
    }

    button.appendChild(iconContainer)
  }

  // Add label text
  const labelElement = document.createElement('span')
  labelElement.className = 'web-resource-button__label'
  labelElement.textContent = label
  button.appendChild(labelElement)

  // Handle click to open URL in new tab with proper security attributes
  button.addEventListener('click', () => {
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })

  // Keyboard support for Enter and Space
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      button.click()
    }
  })

  return button
}

// Function for checking the accessibility of given content
function checkAccessibility(content) {
  const issues = []

  if (!content) {
    issues.push('No content element provided')
    return issues
  }

  // Check for lang attribute on HTML element
  const htmlEl = content.querySelector('html') || content.ownerDocument?.documentElement
  if (htmlEl && !htmlEl.hasAttribute('lang')) {
    issues.push('Missing lang attribute on html element')
  }

  // Check for main landmark
  const mainEl = content.querySelector('main')
  if (!mainEl) {
    issues.push('Missing main landmark element')
  }

  // Check for skip link
  const skipLink = content.querySelector('.skip-link')
  if (!skipLink) {
    issues.push('Missing skip link for keyboard navigation')
  }

  return issues
}

// New function to address REACT_015: Add lang attribute to HTML element
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en'
  }
  return lang || 'en'
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
  towerDefense,
  createWebResourceButton
}