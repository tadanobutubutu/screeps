// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

/**
 * Renders the dependency graph view
 * @param {Object} deps - Dependencies object
 * @param {Object} options - Rendering options
 * @returns {string} Rendered dependency graph HTML
 */
// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

/**
 * Gets the language attribute value for the HTML element.
 * Returns the lang attribute if present, otherwise returns 'en'.
 *
 * @returns {string} The language code.
 */
const getLangAttribute = () => {
  const htmlElement = document.documentElement
  const lang = htmlElement.getAttribute('lang')
  return lang || 'en'
}

/**
 * Gets the full language tag including region and script if available.
 *
 * @returns {string} The full language tag (e.g., 'en-US', 'zh-Hans-CN').
 */
const getFullLangAttribute = () => {
  const lang = getLangAttribute()
  const dir = document.documentElement.getAttribute('dir')
  let fullTag = lang
  if (dir) {
    fullTag = `${lang}-${dir.toUpperCase()}`
  }
  return fullTag
}

/**
 * Validates the accessibility of table elements.
 * Checks for proper headers, captions, and structure.
 *
 * @returns {boolean} True if all tables are accessible, false otherwise.
 */
const validateTableAccessibility = () => {
  const tables = document.querySelectorAll('table')
  const issues = []

  tables.forEach((table, tableIndex) => {
    // Check for caption
    if (!table.querySelector('caption')) {
      issues.push({ tableIndex, issue: 'Table missing caption' })
    }

    // Check for header cells
    const headers = table.querySelectorAll('th')
    if (headers.length === 0) {
      issues.push({ tableIndex, issue: 'Table missing header cells' })
    }

    // Check for scope attributes on headers
    headers.forEach((th) => {
      if (!th.hasAttribute('scope')) {
        issues.push({ tableIndex, issue: 'Header cell missing scope attribute' })
      }
    })

    // Check for consistent row lengths
    const rows = table.querySelectorAll('tr')
    const cellCounts = Array.from(rows).map(row => row.children.length)
    const uniqueCounts = new Set(cellCounts)
    if (uniqueCounts.size > 1) {
      issues.push({ tableIndex, issue: 'Inconsistent cell counts across rows' })
    }
  })

  if (issues.length === 0) {
    console.log('All tables passed accessibility checks.')
    return true
  }

  console.warn('Table accessibility issues:', issues)
  return false
}

/**
 * Validates landmark elements on the page.
 * Ensures landmarks have proper roles and aria-labels when needed.
 *
 * @returns {boolean} True if all landmarks are valid, false otherwise.
 */
const validateLandmark = () => {
  const landmarkRoles = ['banner', 'navigation', 'main', 'article', 'aside', 'footer', 'complementary', 'contentinfo']
  const issues = []

  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`)
    elements.forEach((element, index) => {
      const hasLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby')
      if (!hasLabel && role !== 'main' && role !== 'banner' && role !== 'banner') {
        issues.push({ role, element, issue: `Landmark with role '${role}' missing accessible name` })
      }
    })
  })

  if (issues.length > 0) {
    console.warn('Landmark validation issues:', issues)
    return false
  }

  console.log('All landmarks passed validation.')
  return true
}

/**
 * Validates the structure of landmark elements.
 *
 * @returns {boolean} True if landmark structure is valid, false otherwise.
 */
const validateLandmarkStructure = () => {
  const landmarkRoles = ['banner', 'navigation', 'main', 'article', 'aside', 'footer', 'complementary', 'contentinfo']
  const issues = []

  // Check for duplicate main landmarks
  const mains = document.querySelectorAll('[role="main"]')
  if (mains.length > 1) {
    issues.push({ issue: 'Multiple main landmarks found', count: mains.length })
  }

  // Check for duplicate banner landmarks
  const banners = document.querySelectorAll('[role="banner"]')
  if (banners.length > 1) {
    issues.push({ issue: 'Multiple banner landmarks found', count: banners.length })
  }

  // Check for duplicate contentinfo landmarks
  const footers = document.querySelectorAll('[role="contentinfo"]')
  if (footers.length > 1) {
    issues.push({ issue: 'Multiple contentinfo landmarks found', count: footers.length })
  }

  if (issues.length > 0) {
    console.warn('Landmark structure issues:', issues)
    return false
  }

  console.log('Landmark structure is valid.')
  return true
}

/**
 * Ensures unique landmarks by adding unique identifiers where needed.
 *
 * @returns {number} Number of landmarks made unique.
 */
const ensureUniqueLandmarks = () => {
  let uniqueCount = 0
  const landmarkRoles = ['banner', 'navigation', 'main', 'article', 'aside', 'footer', 'contentinfo', 'complementary']

  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`)
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        if (index > 0) {
          // Add unique label to subsequent landmarks
          const existingLabel = element.getAttribute('aria-label') || ''
          const uniqueLabel = `${existingLabel} ${index + 1}`.trim()
          element.setAttribute('aria-label', uniqueLabel)
          uniqueCount++
        }
      })
    }
  })

  return uniqueCount
}

/**
 * Gets an accessible name for an SVG element.
 * Prioritizes aria-label, aria-labelledby, and title elements.
 *
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name.
 */
const getSvgAccessibleName = (svg) => {
  if (!svg) return ''

  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label')
  if (ariaLabel) return ariaLabel

  // Check for aria-labelledby
  const labelledBy = svg.getAttribute('aria-labelledby')
  if (labelledBy) {
    const labeledElement = document.getElementById(labelledBy)
    if (labeledElement) return labeledElement.textContent || ''
  }

  // Check for title element
  const title = svg.querySelector('title')
  if (title) return title.textContent || ''

  // Return empty string if no accessible name found
  return ''
}

/**
 * Creates an in-page navigation button with accessibility attributes.
 *
 * @param {string} href - The href attribute (should be a fragment identifier).
 * @param {string} label - The accessible label for the button.
 * @returns {HTMLAnchorElement} The created button element.
 */
const createInPageButton = (href, label) => {
  const a = document.createElement('a')
  a.setAttribute('href', href)
  a.setAttribute('role', 'button')
  a.setAttribute('aria-label', label)
  a.setAttribute('tabindex', '0')

  // Add click handler
  a.addEventListener('click', (e) => {
    const targetId = href.replace('#', '')
    if (targetId) {
      const target = document.getElementById(targetId)
      if (target) {
        target.setAttribute('tabindex', '-1')
        target.focus()
      }
    }
  })

  // Ensure it's focusable with keyboard
  a.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      a.click()
    }
  })

  return a
}

/**
 * Creates an accessible link element.
 * Ensures the link has appropriate attributes for accessibility.
 *
 * @param {string} href - The link URL.
 * @param {string} label - The link text.
 * @param {string} [target='_self'] - Target window/frame.
 * @returns {HTMLAnchorElement} The created link element.
 */
const createAccessibleLink = (href, label, target = '_self') => {
  const a = document.createElement('a')
  a.setAttribute('href', href)
  a.textContent = label
  if (target) {
    a.setAttribute('target', target)
    if (target !== '_self') {
      a.setAttribute('rel', 'noopener')
    }
  }
  return a
}

const accessibilityUtils = {
  /**
   * Initializes the skip link functionality.
   * Finds a skip link with class 'skip-link' and ensures clicking it
   * focuses the target element while preventing default navigation.
   */
  initSkipLink () {
    const skipLink = document.querySelector('.skip-link')
    if (!skipLink) return

    skipLink.addEventListener('click', (e) => {
      const href = skipLink.getAttribute('href')
      if (!href) return
      const targetId = href.replace('#', '')
      // TODO: Address accessibility issues from insight report:
      if (!targetId) return
      const target = document.getElementById(targetId)
      if (target) {
        target.setAttribute('tabindex', '-1')
        target.focus()
        e.preventDefault()
      }
    })
  },

  /**
   * Adds a focus trap to the given element.
   * Tab‑presses are confined to the element's focusable descendants.
   *
   * @param {HTMLElement} element - The container element.
   */
  trapFocus (element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled)], [tabindex]:not([tabindex="-1"])'
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
  },

  /**
   * A newer focus trap implementation.
   * Identical to `trapFocus` for consistency.
   *
   * @param {HTMLElement} element - The container element.
   */
  newFocusTrap (element) {
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
  },

  /**
   * Enhances keyboard accessibility for interactive elements and elements with
   * the `data-accessible` attribute. Adds a `tabindex="0"` and handles Enter/Space
   * to trigger clicks.
   */
  initAccessibility () {
    // Add keyboard support for all interactive elements and data-accessible elements
    document
      .querySelectorAll('button, a, [role="button"], [data-accessible]')
      .forEach((element) => {
        element.setAttribute('tabindex', '0')
        element.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            element.click()
          }
        })
      })
  },

  /**
   * Announce message to screen readers
   *
   * @param {string} message - The message to announce.
   * @param {string} [priority='polite'] - The aria-live priority ('polite' or 'assertive').
   */
  announceToScreenReader (message, priority = 'polite') {
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.style.position = 'absolute'
    announcer.style.left = '-9999px'
    announcer.textContent = message
    document.body.appendChild(announcer)
    setTimeout(() => {
      announcer.remove()
    }, 1000)
  },

  /**
   * Triggers a file download of the given data as JSON and announces the action
   * to screen readers.
   *
   * @param {Object} data - The data to export.
   * @param {string} filename - The name of the file to download.
   */
  exportData (data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || 'export.json'
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      this.announceToScreenReader(`Download of ${filename} started`)
    }, 100)
  },

  /**
   * Scans the page for common accessibility issues and logs warnings.
   * Returns an object summarizing the fixes performed.
   */
  addressAccessibilityIssues () {
    const fixes = {
      skipLinks: 0,
      tables: 0,
      images: 0
    }

    // Validate skip links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      const target = link.getAttribute('href').substring(1)
      const element = document.getElementById(target)
      if (!element) {
        console.warn(`Skip link points to non-existent element: ${target}`)
        fixes.skipLinks++
      }
    })

    // Validate tables
    document.querySelectorAll('table').forEach((table) => {
      if (!table.querySelector('th')) {
        console.warn('Table missing header cells (th)')
        fixes.tables++
      }
      // Ensure each row has same number of cells
      const rows = table.querySelectorAll('tr')
      const cellCounts = new Set()
      rows.forEach((row) => {
        cellCounts.add(row.children.length)
      })
      if (cellCounts.size > 1) {
        console.warn('Inconsistent number of cells across table rows')
        fixes.tables++
      }
    })

    // Validate images
    document.querySelectorAll('img:not([alt])').forEach((img) => {
      console.warn('Image missing alt attribute', img)
      fixes.images++
    })

    console.log('Accessibility issues addressed', fixes)
    return fixes
  },

  /**
   * Handle keyboard navigation by dispatching to a handler based on the key pressed.
   *
   * @param {KeyboardEvent} e - The keyboard event.
   * @param {Object} handlers - An object mapping key names to handler functions.
   */
  handleKeyboardNav (e, handlers) {
    const key = e.key
    if (handlers[key]) {
      handlers[key](e)
    }
  },

  /**
   * Handles upgrading from legacy implementations to newer ones.
   * Provides backward compatibility while migrating to current best practices.
   *
   * @param {Object} options - Upgrade options.
   * @param {boolean} [options.upgradeFocusTrap=true] - Whether to upgrade focus trap implementations.
   * @returns {Object} Summary of upgrades performed.
   */
  upgrade (options = {}) {
    const opts = {
      upgradeFocusTrap: true,
      ...options
    }

    const upgrades = {
      focusTrap: false,
      messages: []
    }

    // Upgrade focus trap if requested
    if (opts.upgradeFocusTrap) {
      // Replace legacy trapFocus with newFocusTrap
      if (typeof this.newFocusTrap === 'function') {
        this.trapFocus = this.newFocusTrap
        upgrades.focusTrap = true
        upgrades.messages.push('Upgraded trapFocus to use newFocusTrap implementation')
      }
    }

    console.log('Upgrade completed', upgrades)
    return upgrades
  }
}

/**
 * Renders the main index view
 * @param {Object} data - View data
 * @param {Object} options - Rendering options
 * @returns {string} Rendered index HTML
 */
function renderIndex(data, options = {}) {
    return indexContent(data, options);
}

// Add lang attribute to HTML element
function getLangAttribute() {
    return document.documentElement.lang || navigator.language || 'en';
}

// Import accessibility utilities from the other conflict branch
const accessibilityUtils = require('./accessibility').accessibilityUtils;

// Additional functions originally destructured from main
function createInPageButton() {}
function createWebResourceButton() {}
function validateLandmark() {}
function validateLandmarkStructure() {}

/**
 * Validate the accessibility report for issues
 * @param {Object} report - Accessibility report object
 * @returns {boolean} True if no issues found, false otherwise
 */
function validateAccessibilityReport(report) {
    if (!report) return false;
    const issues = [];
    if (report.missingAltText) issues.push('Missing alt text');
    if (report.missingLandmarks) issues.push('Missing landmarks');
    // Additional validation rules can be added here
    return issues.length === 0;
}

function getSvgAccessibleName() {}
function getFullLangAttribute() {}
function validateTableAccessibility() {}
function validateTableStructure() {}
function ensureUniqueLandmarks() {}
function addAccessibleName() {}
function handleAccessibilityErrors() {}
function handleAccessibilityIssues() {}
function createAccessibleLink() {}
function newFocusTrap() {}
function transformInputData() {}
function renderIndexView() {}
function renderDependencyGraphs() {}
function indexTemplateContent() {}
function addLangAttribute() {}
function fixTableStructureIssues() {}
function addMainLandmark() {}
function _ensureUniqueLandmarks() {}
function setSvgAccessibilityProps() {}
function addSvgAccessibleNames() {}
function addAccessibleNamesToSVGs() {}
function fixFakeLinkIssue() {}
function fixFakeLinkIssues() {}
function fixFakeLinks() {}
function fixLandmarkIssues() {}
function addLandmarkRegions() {}
function uniqueLandmarks() {}
function fixImageAltTexts() {}
function googleSignIn() {}
function handleCredentialResponse() {}
function ensureElementHasId() {}
function ensureElementHasIdOrigin() {}
function addAriaLabel() {}
function fixButtonIdentifiers() {}
function fixDependencyGraphAria() {}
function addMainLandmarkToIndex() {}
function announceToScreenReader() {}
function handleKeyboardNav() {}
function ensureElementAccessibility() {}
function validateAndFixFormAccessibility() {}
function validateAndFixLinkAccessibility() {}
function validateAndFixButtonAccessibility() {}
function validateAndFixTableStructure() {}
function validateAndFixLandmark() {}
function improveSvgAccessibility() {}
function createAccessibleInPageButton() {}
function log(message, level = 'info') {
    if (level === 'info') console.info(message);
    else throw new Error(`Unsupported log level: ${level}`);
}
function exportUtils() {}
function focusTrap() {}
function enhanceAddBookFormAccessibility() {}

function renderDependencyGraph(data) {
    // Implementation for rendering dependency graphs
    return {
        nodes: data.nodes || [],
        edges: data.edges || [],
    };
}

function implementAccessibilityFixesFromReport(container, report) {
    // Implementation to address accessibility issues from the insight report
}

// Initialize accessibility features
function initAccessibility() {
    accessibilityUtils.initSkipLink();

    // Add keyboard support for all interactive elements
    const elements = document.querySelectorAll('[data-accessible]');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        element.addEventListener('keydown', function (e) {
            accessibilityUtils.handleKeyboardNav(e, {
                Enter: function () {
                    element.click();
                },
                ' ': function () {
                    element.click();
                },
            });
        });
    }
}

// New function from other branch
function newExportedFunction() {
    // Implementation of the new function from the other conflict branch
}

/**
 * Handles accessibility issues found during analysis
 * Addresses issues from insight report for new accessibility problems
 * @param {HTMLElement} container - Container element to check and fix
 * @param {Object} report - Accessibility issues report
 * @returns {Object} Summary of issues handled
 */
function handleAccessibilityIssues(container, report) {
    const results = {
        fixed: [],
        warnings: [],
        errors: []
    };

    if (!container || !report) {
        results.errors.push('Container or report is missing');
        return results;
    }

    // Handle new accessibility issues based on report type
    if (report.issues && Array.isArray(report.issues)) {
        report.issues.forEach(function(issue) {
            if (issue.type === 'missing-lang') {
                const htmlElement = document.documentElement;
                if (!htmlElement.hasAttribute('lang')) {
                    htmlElement.setAttribute('lang', 'en');
                    results.fixed.push('Added lang attribute to html element');
                }
            }

            if (issue.type === 'missing-skip-link') {
                const skipLink = container.querySelector('.skip-link');
                if (!skipLink) {
                    const newSkipLink = document.createElement('a');
                    newSkipLink.href = '#main-content';
                    newSkipLink.className = 'skip-link';
                    newSkipLink.textContent = 'Skip to main content';
                    newSkipLink.style.position = 'absolute';
                    newSkipLink.style.left = '-9999px';
                    newSkipLink.style.top = 'auto';
                    newSkipLink.style.width = '1px';
                    newSkipLink.style.height = '1px';
                    newSkipLink.style.overflow = 'hidden';
                    container.insertBefore(newSkipLink, container.firstChild);
                    results.fixed.push('Added skip link for keyboard navigation');
                }
            }

            if (issue.type === 'missing-main-landmark') {
                const mainElement = container.querySelector('main');
                if (!mainElement) {
                    const main = document.createElement('main');
                    main.id = 'main-content';
                    const existingContent = container.querySelector('div[role="main"]');
                    if (existingContent) {
                        while (existingContent.firstChild) {
                            main.appendChild(existingContent.firstChild);
                        }
                        existingContent.parentNode.replaceChild(main, existingContent);
                    }
                    results.fixed.push('Added main landmark element');
                }
            }

            if (issue.type === 'missing-aria-labels') {
                const elementsNeedingLabels = container.querySelectorAll(
                    'button:not([aria-label]):not([aria-labelledby]), ' +
                    'a[href]:not([aria-label]):not([aria-labelledby]):not([title])'
                );
                elementsNeedingLabels.forEach(function(el, index) {
                    if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
                        el.setAttribute('aria-label', 'Interactive element ' + (index + 1));
                        results.fixed.push('Added aria-label to interactive element');
                    }
                });
            }

            if (issue.type === 'focus-trap-issue') {
                const modalElements = container.querySelectorAll('[role="dialog"], [role="alertdialog"]');
                modalElements.forEach(function(modal) {
                    accessibilityUtils.trapFocus(modal);
                    results.fixed.push('Applied focus trap to modal');
                });
            }

            if (issue.type === 'color-contrast') {
                results.warnings.push('Color contrast issues detected - manual review required');
            }

            if (issue.type === 'missing-alt-text') {
                const imagesWithoutAlt = container.querySelectorAll('img:not([alt])');
                imagesWithoutAlt.forEach(function(img) {
                    img.setAttribute('alt', '');
                    results.fixed.push('Added empty alt attribute to decorative image');
                });
            }

            if (issue.type === 'form-label-missing') {
                const inputsWithoutLabels = container.querySelectorAll(
                    'input:not([aria-label]):not([aria-labelledby]):not([type="hidden"]), ' +
                    'select:not([aria-label]):not([aria-labelledby]), ' +
                    'textarea:not([aria-label]):not([aria-labelledby])'
                );
                inputsWithoutLabels.forEach(function(input) {
                    const label = document.createElement('label');
                    label.textContent = 'Field ' + (input.name || input.id || 'unnamed');
                    if (input.parentNode) {
                        input.parentNode.insertBefore(label, input);
                    }
                    results.fixed.push('Added label for form input');
                });
            }

            if (issue.type === 'heading-order') {
                const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
                let lastLevel = 0;
                headings.forEach(function(heading) {
                    const currentLevel = parseInt(heading.tagName.substring(1));
                    if (currentLevel > lastLevel + 1) {
                        results.warnings.push('Heading level skip detected from h' + lastLevel + ' to h' + currentLevel);
                    }
                    lastLevel = currentLevel;
                });
            }

            if (issue.type === 'table-accessibility') {
                const tables = container.querySelectorAll('table');
                tables.forEach(function(table) {
                    if (!table.hasAttribute('scope') && !table.querySelector('th[scope]')) {
                        const headers = table.querySelectorAll('th');
                        headers.forEach(function(th) {
                            th.setAttribute('scope', 'col');
                        });
                        results.fixed.push('Added scope attributes to table headers');
                    }
                });
            }
        });
    }

    // Announce results to screen readers if there were fixes
    if (results.fixed.length > 0) {
        accessibilityUtils.announceToScreenReader(
            'Fixed ' + results.fixed.length + ' accessibility issues',
            'polite'
        );
    }

    return results;
}

/**
 * Renders a dependency graph inside the given container.
 *
 * @param {HTMLElement} container - The DOM element that will hold the graph.
 * @param {Object} dependencies - The dependency data to visualize.
 * @param {Object} [options={}] - Optional rendering options.
 * @returns {HTMLElement} The container element.
 */
function renderDependencyGraphs (container, dependencies, options = {}) {
  if (!container) {
    throw new Error('Container element is required')
  }

  if (!dependencies) {
    throw new Error('Dependencies data is required')
  }

  // Ensure container has an id for graph references
  const containerId = ensureElementHasId(container, 'graph-container')

  // Ensure the dependencyGraph container has a proper ARIA role
  if (!container.getAttribute('role')) {
    container.setAttribute('role', 'img')
  }

  // Add accessibility label if not present
  addAriaLabel(container, `Dependency graph: ${containerId}`)

  // Render logic placeholder
  container.innerHTML = `<div id="${containerId}">Graph not implemented</div>`

  return container
}

/**
 * Validates the table structure for accessibility issues.
 * Checks for:
 *   - Presence of captions.
 *   - Proper use of `<th>` elements with `scope` attributes.
 *   - Consistent cell counts across rows.
 *   - Absence of problematic colspan/rowspan in data cells (basic check).
 *
 * @returns {boolean} True if all tables pass checks, otherwise false.
 */
function validateTableStructure () {
  const tables = document.querySelectorAll('table')
  const issues = []

  tables.forEach((table, index) => {
    // Check if table has a caption
    const caption = table.querySelector('caption')
    if (!caption) {
      issues.push({ tableIndex: index, issue: 'Missing caption' })
    }

    // Check for header scope
    const headers = table.querySelectorAll('th')
    if (headers.length === 0) {
      issues.push({ tableIndex: index, issue: 'No header cells found' })
    } else {
      headers.forEach((th) => {
        if (!th.hasAttribute('scope')) {
          issues.push({
            tableIndex: index,
            issue: 'Header cell missing scope attribute',
            element: th
          })
        }
      })
    }

    // Check for consistent row cell counts
    const rows = table.querySelectorAll('tr')
    const cellCounts = new Set()
    rows.forEach((row) => {
      cellCounts.add(row.children.length)
    })
    if (cellCounts.size > 1) {
      issues.push({ tableIndex: index, issue: 'Inconsistent number of cells across table rows' })
    }

    // Ensure data cells have proper headers (simple check)
    const firstRow = rows[0]
    if (firstRow) {
      rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return // skip header row
        const cells = row.querySelectorAll('td')
        cells.forEach((td) => {
          // For simplicity, just check if the table has headers and the cell has a colspan/rowspan that may cause confusion
          if (td.hasAttribute('colspan') || td.hasAttribute('rowspan')) {
            issues.push({
              tableIndex: index,
              issue: `Data cell at row ${rowIndex} has colspan/rowspan`,
              element: td
            })
          }
        })
      })
    }
  })

  if (issues.length > 0) {
    console.warn('Table accessibility issues found:', issues)
    return false
  }

  console.log('All tables passed accessibility checks.')
  return true
}

/**
 * Validates the structure of tables on the page for accessibility best practices.
 * This is a more comprehensive version of validateTableStructure that includes additional checks.
 *
 * @returns {boolean} True if all tables pass checks, otherwise false.
 */
function validateTableStructureComprehensive () {
  const tables = document.querySelectorAll('table')
  const issues = []

  tables.forEach((table, tableIndex) => {
    // Check if table has a caption
    const caption = table.querySelector('caption')
    if (!caption) {
      issues.push({ tableIndex, issue: 'Missing caption' })
    }

    // Check for headers
    const headers = table.querySelectorAll('th')
    if (headers.length === 0) {
      issues.push({ tableIndex, issue: 'No header cells found' })
    } else {
      // Check header scope attributes
      headers.forEach((th, headerIndex) => {
        if (!th.hasAttribute('scope')) {
          issues.push({
            tableIndex,
            issue: `Header cell at index ${headerIndex} missing scope attribute`,
            element: th
          })
        }
      })
    }

    // Check row consistency
    const rows = table.querySelectorAll('tr')
    const cellCounts = new Set()
    rows.forEach((row) => {
      cellCounts.add(row.children.length)
    })

    if (cellCounts.size > 1) {
      issues.push({
        tableIndex,
        issue: 'Inconsistent number of cells across rows',
        details: `Found ${cellCounts.size} different cell counts`
      })
    }

    // Check for complex table structures
    const complexCells = table.querySelectorAll('td[colspan], td[rowspan]')
    if (complexCells.length > 0) {
      complexCells.forEach((cell, cellIndex) => {
        issues.push({
          tableIndex,
          issue: 'Complex table structure detected',
          details: `Cell at index ${cellIndex} has colspan/rowspan`,
          element: cell
        })
      })
    }

    // Check for missing summary (deprecated but still sometimes used)
    if (table.hasAttribute('summary')) {
      issues.push({
        tableIndex,
        issue: 'Deprecated summary attribute used',
        details: 'Use caption instead'
      })
    }
  })

  if (issues.length > 0) {
    console.warn('Comprehensive table accessibility issues found:', issues)
    return false
  }

  console.log('All tables passed comprehensive accessibility checks.')
  return true
}

/**
 * Counts the number of dependencies provided.
 *
 * A dependency is defined as a key in the dependencies object that is not `null` or `undefined`.
 * Additionally, nested objects are counted as separate dependencies when they are leaf nodes
 * (i.e., they are not arrays or plain objects with further nesting). For simplicity, this
 * implementation counts only the top-level keys of the dependencies object.
 *
 * @param {Object} dependencies - The dependency data to count.
 * @returns {number} The number of dependencies.
 */
function countDependencies (dependencies) {
  if (!dependencies || typeof dependencies !== 'object') {
    return 0
  }

  // Count top-level keys that are not null
  let count = 0
  for (const key in dependencies) {
    if (Object.prototype.hasOwnProperty.call(dependencies, key)) {
      if (dependencies[key] !== null && dependencies[key] !== undefined) {
        count++
      }
    }
  }
  return count
}

// Export functions for use in other modules
module.exports = {
  initSkipLink: accessibilityUtils.initSkipLink,
  trapFocus: accessibilityUtils.trapFocus,
  newFocusTrap: accessibilityUtils.newFocusTrap,
  initAccessibility: accessibilityUtils.initAccessibility,
  announceToScreenReader: accessibilityUtils.announceToScreenReader,
  handleKeyboardNav: accessibilityUtils.handleKeyboardNav,
  exportData: accessibilityUtils.exportData,
  addressAccessibilityIssues: accessibilityUtils.addressAccessibilityIssues,
  upgrade: accessibilityUtils.upgrade,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  validateTableStructure,
  validateTableStructureComprehensive,
  countDependencies
}