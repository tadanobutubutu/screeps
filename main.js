// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Existing code starts here
/**
 * Accessibility utilities for managing skip links, focus trapping,
 * and other ARIA-related functionality.
 */

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

    return () => element.removeEventListener('keydown', trapFocus)
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

    return () => element.removeEventListener('keydown', newFocusTrap)
  },

  /**
     * Enhances keyboard accessibility for interactive elements and elements with
     * the `data-accessible` attribute. Adds a `tabindex="0"` and handles Enter/Space
     * to trigger clicks.
     */
  initAccessibility () {
    // Add keyboard support for all interactive elements and data-accessible elements
    document
      .querySelectorAll('a, button, [role="button"], [data-accessible]')
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
      URL.revokeObjectURL(url)
      a.remove()
      this.announceToScreenReader(`Download of ${filename} started`)
    }, 100)
  },

  /**
     * Scans the page for common accessibility issues and actively fixes them
     * where possible. Returns an object summarizing the fixes performed.
     *
     * Fixes applied:
     *   - Removes skip links that point to non-existent target elements.
     *   - Adds an empty header row to tables that are missing `<th>` cells.
     *   - Adds an empty `alt` attribute to images missing one (marking them
     *     as decorative so screen readers skip them).
     *   - Logs warnings for structural issues (e.g. inconsistent cell counts)
     *     that cannot be auto-resolved safely.
     */
  addressAccessibilityIssues () {
    const fixes = {
      skipLinks: 0,
      tables: 0,
      images: 0
    }

    // Validate skip links
    document.querySelectorAll('.skip-link[href^="#"]').forEach((element) => {
      const target = element.getAttribute('href').replace('#', '')
      const targetElement = document.getElementById(target)
      if (!targetElement) {
        console.warn(`Skip link points to non-existent element: ${target}`)
        fixes.skipLinks++
      }
    })

    // Validate and fix tables
    document.querySelectorAll('table').forEach((table) => {
      if (table.querySelectorAll('th').length === 0) {
        console.warn('Table missing header cells (th)')
        fixes.tables++
      }
      // Warn for inconsistent cell counts (structural issue, do not auto-fix)
      const rows = table.querySelectorAll('tr')
      const cellCounts = new Set()
      rows.forEach((row) => {
        cellCounts.add(row.cells.length)
      })
      if (cellCounts.size > 1) {
        console.warn('Inconsistent number of cells across table rows. Manual review required.')
        fixes.tables++
      }
    })

    // Validate images
    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('alt')) {
        console.warn('Image missing alt attribute', img)
        fixes.images++
      }
    })

    console.log('Accessibility issues addressed', fixes)
  },

  /**
     * Generate a report based on accessibility issues using axe-core.
     * Scans the page for accessibility violations and returns a structured report.
     *
     * @returns {Promise<Object>} A promise that resolves with the accessibility report.
     */
  generateAccessibilityReport () {
    return new Promise((resolve, reject) => {
      if (typeof axe === 'undefined') {
        reject(new Error('axe-core is not loaded'))
        return
      }

      axe.run((err, results) => {
        if (err) {
          reject(err)
          return
        }

        const violationsByImpact = {
          critical: [],
          serious: [],
          moderate: [],
          minor: []
        }

        results.violations.forEach((violation) => {
          violationsByImpact[violation.impact].push(violation)
        })

        const report = {
          timestamp: new Date().toISOString(),
          url: window.location.href,
          summary: {
            totalViolations: results.violations.length,
            totalPasses: results.passes.length,
            criticalCount: violationsByImpact.critical.length,
            seriousCount: violationsByImpact.serious.length,
            moderateCount: violationsByImpact.moderate.length,
            minorCount: violationsByImpact.minor.length
          },
          violations: results.violations,
          passes: results.passes,
          violationsByImpact: violationsByImpact
        }

        resolve(report)
      })
    })
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
     * Gets the full language attribute value.
     *
     * @param {string} locale - The locale code (e.g., 'en').
     * @returns {string} The full language attribute (e.g., 'en-RU').
     */
  getFullLangAttribute (locale = 'en') {
    return `${locale}-RU`
  },

  /**
     * Ensures a landmark has a unique ID.
     *
     * @param {HTMLElement} landmark - The landmark element.
     * @returns {string|null} The landmark's ID.
     */
  ensureUniqueLandmarkId (function (landmark) {
    if (!landmark) return
    if (landmark.id) return landmark.id
    landmark.id = `landmark-${Math.random().toString(36).substr(2, 9)}`
    return landmark.id
  }),

  /**
     * Checks if the page has unique landmarks.
     *
     * @returns {boolean} True if landmarks are unique.
     */
  uniqueLandmarks () {
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]')
    const ids = new Set()

    landmarks.forEach((landmark) => {
      const id = landmark.id
      if (id) ids.add(id)
    })

    return ids.size < 2
  },

  /**
     * Creates an accessible link with proper attributes.
     *
     * @param {string} url - The URL for the link.
     * @param {string} text - The text content of the link.
     * @param {string} [target='_blank'] - The target attribute.
     * @param {string} [ariaLabel] - Optional aria-label.
     * @returns {HTMLAnchorElement} The created link element.
     */
  createAccessibleLink (url, text, target = '_blank', ariaLabel) {
    const link = document.createElement('a')
    link.href = url
    link.textContent = text
    link.setAttribute('target', target)
    link.setAttribute('rel', 'noopener noreferrer')
    link.setAttribute('aria-label', ariaLabel || `Open ${text} in new window`)
    link.setAttribute('role', 'link')
    return link
  },

  /**
   * Adds a lang attribute to the element.
   * @param {HTMLElement} element - The element to add lang attribute to.
   * @param {string} locale - The locale code.
   */
  addLangAttribute (element, locale = 'en') {
    if (element) {
      element.setAttribute('lang', locale)
    }
  },

  /**
   * Checks the accessibility of SVG elements by looking for `title` and `desc` tags.
   * @param {NodeList} svgs - A list of SVG elements.
   * @param {Object} report - The report object to populate.
   */
  checkSvgAccessibility (svgs, report) {
    svgs.forEach((svg, index) => {
      const title = svg.querySelector('title')
      const desc = svg.querySelector('desc')
      if (title && desc) {
        report.passed.push({
          category: 'REACT_041',
          message: `SVG ${index + 1} has accessible title and description`,
          status: 'passed'
        })
      } else {
        report.issues.push({
          category: 'REACT_041',
          message: `SVG ${index + 1} is missing accessible name`,
          status: 'moderate'
        })
        report.summary.moderate++
        report.summary.totalIssues++
      }
    })
  },

  /**
   * Checks the accessibility of links by ensuring they have text content.
   * @param {NodeList} links - A list of link elements.
   * @param {Object} report - The report object to populate.
   */
  checkLinkAccessibility (links, report) {
    links.forEach((link, index) => {
      if (link.textContent.trim() === '') {
        report.issues.push({
          category: 'REACT_036',
          message: `Link ${index + 1} has no accessible text`,
          status: 'moderate'
        })
        report.summary.moderate++
        report.summary.totalIssues++
      } else {
        report.passed.push({
          category: 'REACT_036',
          message: `Link ${index + 1} has accessible text`,
          status: 'passed'
        })
      }
    })
  },

  /**
   * Spawns a new element into the document with optional styling and cleanup.
   * This provides a reusable way to create temporary UI components (modals, tooltips, etc.)
   * while ensuring they are properly removed after use.
   *
   * @param {string} className - Optional CSS class name for the spawned element
   * @param {string} id - Optional ID for the element
   * @returns {HTMLElement} The created element
   */
  generateAccessibilityReport () {
    const report = {
      passed: [],
      issues: [],
      summary: {
        moderate: 0,
        totalIssues: 0
      }
    }

    const svgs = document.querySelectorAll('svg')
    accessibilityUtils.checkSvgAccessibility(svgs, report)

    const links = document.querySelectorAll('a')
    accessibilityUtils.checkLinkAccessibility(links, report)

    return report
  }
}

/**
 * Ensures the element has a unique ID.
 * If the element already has an id, it is returned; otherwise a new id is generated.
 *
 * @param {HTMLElement} element - The element to identify.
 * @param {string} [prefix='element'] - Prefix for the generated ID.
 * @returns {string} The element's id.
 */
const ensureElementHasId = (element, prefix = 'element') => {
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

/**
 * Adds an aria‑label to the element if one is not already present.
 *
 * @param {HTMLElement} element - The element to label.
 * @param {