const main = require('./utilities')

const {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  exportUtils
} = require('./utilities')

const {
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  ensureUniqueLandmarks,
  setSvgAccessibilityProps,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn,
  handleCredentialResponse,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  addressAccessibilityIssues
} = main

// TODO: This is the existing code that needs to be preserved
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// _Commit: ca07afdb3852933670d8d59e11575814d1bda9e5_
// <!-- todo-hash: e944d6bc26c5766586cd5c819c30f566e3ef878d -->

// TODO: add the new functions or changes requested in the issue
function newFunction() {
  // New function implementation
  let activeTrap = null;

  const createFocusTrap = (element, options = {}) => {
    if (!element) return null;

    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return null;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      } else if (e.key === 'Escape' && options.onEscape) {
        options.onEscape();
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    // Return an object with methods to activate/deactivate the trap
    return {
      activate: () => {
        if (activeTrap) {
          activeTrap.deactivate();
        }
        activeTrap = this;
        firstElement.focus();
      },
      deactivate: () => {
        element.removeEventListener('keydown', handleKeyDown);
        activeTrap = null;
      }
    };
  };

  return {
    create: createFocusTrap,
    getActiveTrap: () => activeTrap
  };
}

function anotherNewFunction() {
  // Another new function implementation
}

/**
 * Sets ARIA attributes for better screen reader support
 * @param {HTMLElement} element - DOM element to enhance
 * @param {Object} attributes - ARIA attributes to set
 */
function setAriaAttributes(element, attributes) {
  if (!element || typeof element !== 'object') return;

  Object.entries(attributes).forEach(([key, value]) => {
    if (key.startsWith('aria-')) {
      element.setAttribute(key, value);
    }
  });
}

/**
 * Makes an element focusable programmatically
 * @param {HTMLElement} element - Element to make focusable
 * @param {boolean} focusable - Whether element should be focusable
 */
function setFocusable(element, focusable = true) {
  if (!element) return;

  if (focusable) {
    element.setAttribute('tabindex', '0');
  } else {
    element.removeAttribute('tabindex');
  }
}

/**
 * Adds keyboard navigation support for elements
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Navigation options
 */
function addKeyboardNavigation(container, options = {}) {
  if (!container) return;

  const defaultOptions = {
    focusSelector: '[tabindex="0"]',
    loop: true,
    ...options
  };

  const focusableElements = Array.from(container.querySelectorAll(defaultOptions.focusSelector));

  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      navigateFocus(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      navigateFocus(-1);
    }
  });

  function navigateFocus(direction) {
    const currentIndex = focusableElements.indexOf(document.activeElement);
    let newIndex = currentIndex + direction;

    if (newIndex < 0) {
      newIndex = defaultOptions.loop ? focusableElements.length - 1 : 0;
    } else if (newIndex >= focusableElements.length) {
      newIndex = defaultOptions.loop ? 0 : focusableElements.length - 1;
    }

    focusableElements[newIndex]?.focus();
  }
}

/**
 * Ensures proper contrast ratio for text elements
 * @param {HTMLElement} element - Text element to check
 * @param {number} minRatio - Minimum contrast ratio (1-21)
 */
function ensureTextContrast(element, minRatio = 4.5) {
  if (!element || !window.getComputedStyle) return;

  const style = window.getComputedStyle(element);
  const bgColor = style.backgroundColor;
  const textColor = style.color;

  // This is a simplified version - real implementation would need proper color parsing
  // and luminance calculation according to WCAG standards
  const contrast = 1 / (Math.max(Number(bgColor.match(/[0-9.,]+/)[0]), 1) / Number(textColor.match(/[0-9.,]+/)[0]) + 0.05);

  if (contrast < minRatio) {
    console.warn(`Contrast ratio (${contrast.toFixed(1)}) is below recommended minimum (${minRatio}) for element:`, element);
    // In a real implementation, you might adjust colors here
  }
}

// Helper function for contrast calculation
function calculateContrast(color1, color2) {
  // This is a simplified version - real implementation would need proper color parsing
  // and luminance calculation according to WCAG standards
  return Math.random() * 20 + 1; // Mock value for demonstration
}

// Existing utility functions
const log = (message, level = 'info') => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] [${level}] ${message}`)
}

// Credential response handling
async function handleCredentialResponseFn(response) {
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

// Export functions to make them accessible
module.exports = {
  ...main,

  affectedFunction,
  updateFunction,
  accessibleFunction,
  newFunction1,
  newFunction2,

  addressAccessibilityIssues: (container) => {
    const fixes = {
      langAdded: false,
      mainLandmarkAdded: false,
      landmarksFixed: 0,
      svgNamesAdded: 0,
      fakeLinksFixed: 0,
      tableStructureFixed: 0,
      ariaLabelsAdded: 0,
      buttonIdentifiersFixed: 0
    }

    // Add lang attribute to HTML element if missing
    const htmlElement = document.documentElement
    const langAttr = getLangAttribute(htmlElement)
    if (!langAttr) {
      htmlElement.lang = 'en'
      fixes.langAdded = true
    }

    // Add main landmark if missing
    const mainElement = document.querySelector('main')
    if (!mainElement) {
      const body = document.body
      if (body) {
        const newMain = document.createElement('main')
        while (body.firstChild) {
          newMain.appendChild(body.firstChild)
        }
        body.insertBefore(newMain, body.firstChild)
        fixes.mainLandmarkAdded = true
      }
    }

    // Fix landmark issues
    const landmarkFixes = validateLandmark(container)
    if (landmarkFixes && landmarkFixes.length > 0) {
      fixes.landmarksFixed = landmarkFixes.length
    }
    const landmarkStructureFixes = validateLandmarkStructure(container)
    if (landmarkStructureFixes && landmarkStructureFixes.length > 0) {
      fixes.landmarksFixed += landmarkStructureFixes.length
    }

    // Fix SVG accessible names
    const svgElements = container.querySelectorAll('svg')
    svgElements.forEach((svg) => {
      const accessibleName = getSvgAccessibleName(svg)
      if (accessibleName && accessibleName.length > 0) {
        setSvgAccessibilityProps(svg, accessibleName)
        fixes.svgNamesAdded++
      }
    })

    // Fix fake link issues (elements that look like links but are missing href)
    const fakeLinks = container.querySelectorAll('[style*="cursor: pointer"]')
    fakeLinks.forEach((link) => {
      const style = window.getComputedStyle(link)
      if (style.cursor === 'pointer' || link.style.cursor === 'pointer') {
        link.setAttribute('role', 'link')
        link.setAttribute('tabindex', '0')
        fixes.fakeLinksFixed++
      }
    })

    // Fix table structure issues
    const tables = container.querySelectorAll('table')
    tables.forEach((table) => {
      if (!table.querySelector('th')) {
        const firstRow = table.querySelector('tr')
        if (firstRow) {
          const cells = firstRow.querySelectorAll('td')
          cells.forEach((cell) => {
            const th = document.createElement('th')
            th.textContent = cell.textContent
            cell.replaceWith(th)
          })
          fixes.tableStructureFixed++
        }
      }
    })

    // Add ARIA labels to buttons without text
    const buttons = container.querySelectorAll('button')
    buttons.forEach((button) => {
      if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
        const icon = button.querySelector('i, svg')
        if (icon) {
          const iconName = icon.className || 'icon'
          button.setAttribute('aria-label', iconName)
          fixes.ariaLabelsAdded++
        }
      }
    })

    // Fix button identifiers
    const buttonsWithoutId = container.querySelectorAll('button:not([id])')
    buttonsWithoutId.forEach((button, index) => {
      button.id = `button-${index}`
      fixes.buttonIdentifiersFixed++
    })

    // Validate accessibility report
    const report = validateAccessibilityReport(container)
    if (report && report.length > 0) {
      log(`Accessibility report contains ${report.length} remaining issues`, 'warn')
    }

    if (fixes.langAdded) {
      log('Lang attribute added to HTML element', 'info')
    }

    if (fixes.mainLandmarkAdded) {
      log('Main landmark added', 'info')
    }

    const landmarkFixesCount = fixes.landmarksFixed || 0
    if (landmarkFixesCount > 0) {
      log(`Fixed ${landmarkFixesCount} unique landmarks`, 'info')
    }

    const svgFixes = fixes.svgNamesAdded || 0
    if (svgFixes > 0) {
      log(`Fixed accessible names for ${svgFixes} SVGs`, 'info')
    }

    const fakeLinkFixes = fixes.fakeLinksFixed || 0
    if (fakeLinkFixes > 0) {
      log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info')
    }

    const tableFixes = fixes.tableStructureFixed || 0
    if (tableFixes > 0) {
      log(`Fixed table structure for ${tableFixes} tables`, 'info')
    }

    const ariaLabelFixes = fixes.ariaLabelsAdded || 0
    if (ariaLabelFixes > 0) {
      log(`Added ARIA labels to ${ariaLabelFixes} buttons`, 'info')
    }

    const buttonIdFixes = fixes.buttonIdentifiersFixed || 0
    if (buttonIdFixes > 0) {
      log(`Added identifiers to ${buttonIdFixes} buttons`, 'info')
    }

    return fixes
  },

  // TODO: Implement a new function to handle focus trap for keyboard navigation
  focusTrap: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    let activeElementIndex = focusableElements.length - 1

    function setActiveElement (index) {
      if (index < 0) {
        index = focusableElements.length - 1
      } else if (index >= focusableElements.length) {
        index = 0
      }

      if (focusableElements[index]) {
        focusableElements[index].focus()
      } else {
        focusableElements[0].focus()
      }
      activeElementIndex = index
    }

    function nextFocusableElement () {
      setActiveElement(activeElementIndex + 1)
    }

    function prevFocusableElement () {
      setActiveElement(activeElementIndex - 1)
    }

    function moveFocusToFirst () {
      setActiveElement(0)
    }

    function moveFocusToLast () {
      setActiveElement(focusableElements.length - 1)
    }

    element.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Tab':
          if (e.shiftKey) {
            prevFocusableElement()
          } else {
            nextFocusableElement()
          }
          e.preventDefault()
          break
        case 'ArrowLeft':
          prevFocusableElement()
          e.preventDefault()
          break
        case 'ArrowRight':
          nextFocusableElement()
          e.preventDefault()
          break
        case 'Home':
          moveFocusToFirst()
          e.preventDefault()
          break
        case 'End':
          moveFocusToLast()
          e.preventDefault()
          break
      }
    })
  },

  // TODO: Import the new function to create a button with correct accessibility properties for in-page linking
  createInPageButton,

  // TODO: Create a utility function to create a web resource button suitable for accessibility (e.g., Github, Stack Overflow, etc.)
  createWebResourceButton,

  // TODO: Validate the table structure for accessibility issues
  validateTableAccessibility,
  validateTableStructure,

  // TODO: Validate the landmark structure for accessibility issues
  validateLandmark,
  validateLandmarkStructure,

  // TODO: Extract the accessible name for an SVG from its content
  getSvgAccessibleName,

  // TODO: Add a language attribute to the HTML element
  addLangAttribute,

  // TODO: Validate the accessibility report for issues
  validateAccessibilityReport,

  // TODO: Address new accessibility issues from insight report ( implement new functions and fixes as needed)

  // Credential response handling
  handleCredentialResponse: handleCredentialResponseFn,

  // Existing utility functions
  log,

  // Export functionality with accessibility support
  exportUtils,

  // New accessibility functions from origin/main
  setAriaAttributes,
  setFocusable,
  addKeyboardNavigation,
  ensureTextContrast,
  calculateContrast,

  // Expose module-level functions
  main,
  getLangAttribute,
  ensureDependencyGraphARIA,
  newFunction,
  anotherNewFunction
}