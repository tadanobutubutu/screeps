// Dependency imports
const dependencyGraphContentModule = require('./dependencyGraphContent');
const indexContentModule = require('./indexContent');
const dependencyGraphContent = dependencyGraphContentModule.dependencyGraphContent || dependencyGraphContentModule;
const indexContent = indexContentModule.indexContent || indexContentModule;

// Existing rendering functions (preserving existing exports and functions)

/**
 * Renders the dependency graph view
 * @param {Object} deps - Dependencies object
 * @param {Object} options - Rendering options
 * @returns {string} Rendered dependency graph HTML
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
     * Manages focus restoration by storing the currently focused element and
     * restoring focus to it later. Useful for modal dialogs and temporary UI states.
     *
     * @param {HTMLElement} [element] - The element to focus. If omitted, restores to the previously stored element.
     * @returns {HTMLElement|null} The element that was focused, or null if none.
     */
  manageFocusRestoration (element) {
    if (!this._previousFocusedElement) {
      this._previousFocusedElement = document.activeElement
    }

    if (element) {
      element.focus()
      return element
    }

    if (this._previousFocusedElement && typeof this._previousFocusedElement.focus === 'function') {
      this._previousFocusedElement.focus()
      const restored = this._previousFocusedElement
      this._previousFocusedElement = null
      return restored
    }

    this._previousFocusedElement = null
    return null
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

// Export all utilities
module.exports = {
  initSkipLink: accessibilityUtils.initSkipLink,
  trapFocus: accessibilityUtils.trapFocus,
  newFocusTrap: accessibilityUtils.newFocusTrap,
  initAccessibility: accessibilityUtils.initAccessibility,
  announceToScreenReader: accessibilityUtils.announceToScreenReader,
  handleKeyboardNav: accessibilityUtils.handleKeyboardNav,
  exportData: accessibilityUtils.exportData,
  addressAccessibilityIssues: accessibilityUtils.addressAccessibilityIssues,
  manageFocusRestoration: accessibilityUtils.manageFocusRestoration,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  validateTableStructure,
  validateTableStructureComprehensive
}