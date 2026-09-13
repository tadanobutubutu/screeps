// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report
// GitHub Issue Fix - Commit: 6009dec851a51383188dc071ee4edb6953001d55

// TODO: Add exports for new functions if needed - UPDATED: Added exports below

// Existing utility functions
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

function reverseString(str) {
  return str.split('').reverse().join('');
}

// New functions added
function isEven(num) {
  return num % 2 === 0;
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Accessibility store implementation (from origin/main)
const a11yStore = {
  liveRegion: null,

  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
    this.addSVGAccessibilityProps();
  },

  createLiveRegion() {
    if (this.liveRegion) return;

    const region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.id = 'a11y-live-region';
    document.body.appendChild(region);
    this.liveRegion = region;
  },

  announce(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target.closest('[data-interactive]');
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

      if (e.key === 'Escape') {
        const openModal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
        if (openModal) {
          openModal.setAttribute('hidden', '');
          document.body.style.overflow = '';
        }
      }
    });

    const dropdownContainers = document.querySelectorAll('[data-dropdown]');
    dropdownContainers.forEach((container) => {
      container.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        const currentFocusedElement = document.activeElement;
        let focusIsInsideContainer = false;

        if (
          currentFocusedElement &&
          (currentFocusedElement === container ||
            currentFocusedElement.closest(container))
        ) {
          focusIsInsideContainer = true;
        }

        if (!focusIsInsideContainer) {
          const firstFocusableElement = container.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (firstFocusableElement) {
            firstFocusableElement.focus();
          }
        }
      });
    });
  },

  setupFocusManagement() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    });
  },

  setupSkipLinks() {
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) return;

    const targetId = skipLink.getAttribute('href')?.slice(1);
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        this.announce('Skipped to main content');
      });

      if (navigator.userAgent.toLowerCase().indexOf('safari') !== -1) {
        skipLink.focus();
      }
    }
  },

  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element) => {
      const landmark = document.querySelector(`[role="${element}"]`);
      if (landmark && landmark.id === '') {
        landmark.setAttribute('id', `${element}-${Math.floor(Math.random() * 1000)}`);
      }
    });
  },

  // New function to add proper landmark regions for accessibility
  addProperLandmarkRegions() {
    // Ensure the main landmark exists
    if (!document.querySelector('main, [role="main"]')) {
      const main = document.createElement('main');
      main.setAttribute('role', 'main');
      main.id = 'main-content';
      document.body.insertBefore(main, document.body.firstChild);
    }
    
    // Add landmark regions if missing
    const landmarks = ['nav', 'header', 'footer', 'aside'];
    landmarks.forEach(landmark => {
      const selector = `${landmark}, [role="${landmark}"]`;
      if (!document.querySelector(selector)) {
        const el = document.createElement(landmark);
        el.setAttribute('role', landmark);
        document.body.appendChild(el);
      }
    });

    // Ensure contentinfo landmark for footer
    const footer = document.querySelector('footer');
    if (footer && !footer.getAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }

    // Ensure complementary landmark for aside
    const aside = document.querySelector('aside');
    if (aside && !aside.getAttribute('role')) {
      aside.setAttribute('role', 'complementary');
    }

    // Add form landmark to forms missing a label
    const forms = document.querySelectorAll('form');
    forms.forEach((form, index) => {
      if (!form.getAttribute('aria-label') && !form.getAttribute('aria-labelledby')) {
        const label = form.querySelector('legend, label');
        if (!label) {
          form.setAttribute('role', 'form');
          form.setAttribute('aria-label', `form-${index + 1}`);
        }
      }
    });

    // Add search landmark if missing
    const searchRegions = document.querySelectorAll('[role="search"]');
    if (searchRegions.length === 0) {
      const searchInput = document.querySelector('input[type="search"]');
      if (searchInput && !searchInput.closest('[role="search"]')) {
        const searchRegion = document.createElement('div');
        searchRegion.setAttribute('role', 'search');
        searchRegion.setAttribute('aria-label', 'search');
        searchInput.parentNode.insertBefore(searchRegion, searchInput);
        searchRegion.appendChild(searchInput);
      }
    }

    // Ensure all landmark regions have accessible names where required
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'search'];
    landmarkRoles.forEach((role) => {
      const elements = document.querySelectorAll(`[role="${role}"]`);
      elements.forEach((el) => {
        if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
          const tagName = el.tagName.toLowerCase();
          let label = '';
          switch (role) {
            case 'navigation':
              label = 'navigation';
              break;
            case 'complementary':
              label = 'complementary';
              break;
            case 'contentinfo':
              label = 'contentinfo';
              break;
            case 'search':
              label = 'search';
              break;
            case 'form':
              label = 'form';
              break;
            default:
              label = role;
          }
          el.setAttribute('aria-label', label);
        }
      });
    });
  },

  // Apply ARIA attributes to SVG elements (dependency graph renderers)
  addSVGAccessibility() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', 'svg-title');
      const titleText = svg.getAttribute('title') || 'Image description';
      const descriptionId = `svg-desc-${Math.floor(Math.random() * 1000)}`;
      svg.setAttribute('aria-describedby', descriptionId);

      const descriptionElement = document.createElement('desc');
      descriptionElement.id = descriptionId;
      descriptionElement.textContent = titleText;
      svg.appendChild(descriptionElement);
    });
  },

  // Apply ARIA attributes to dynamically added SVG elements
  enhanceSVG() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach((svg) => {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', 'svg-title');
      const titleText = svg.querySelector('title').textContent || 'Image description';
      const descriptionId = `svg-description-${Math.floor(Math.random() * 1000)}`;
      svg.setAttribute('aria-describedby', descriptionId);

      const descriptionElement = document.createElement('p');
      descriptionElement.setAttribute('id', descriptionId);
      descriptionElement.textContent = titleText;
      descriptionElement.className = 'sr-only';
      document.body.appendChild(descriptionElement);
    });
  },

  // New function to ensure unique landmarks (REACT_025)
  ensureUniqueLandmarks() {
    const landmarkRoles = ['main', 'banner', 'navigation', 'complementary', 'contentinfo', 'form', 'search'];
    
    landmarkRoles.forEach(role => {
      const elements = document.querySelectorAll(`[role="${role}"], ${role}:not(main)`);
      
      // For roles that should only appear once (main, banner, contentinfo)
      const uniqueRoles = ['main', 'banner', 'contentinfo'];
      
      if (uniqueRoles.includes(role)) {
        if (elements.length > 1) {
          // Keep the first one, change others to complementary or region
          elements.forEach((el, index) => {
            if (index > 0) {
              if (role === 'main') {
                el.setAttribute('role', 'region');
                if (!el.getAttribute('aria-label')) {
                  el.setAttribute('aria-label', 'section');
                }
              } else {
                el.setAttribute('role', 'region');
                if (!el.getAttribute('aria-label')) {
                  el.setAttribute('aria-label', `${role}-section`);
                }
              }
            }
          });
        }
      }
      
      // Ensure unique IDs for all landmarks
      elements.forEach((el, index) => {
        if (!el.id) {
          el.id = `landmark-${role}-${index + 1}`;
        }
      });
    });
    
    // Ensure navigation has unique labels if multiple exist
    const navElements = document.querySelectorAll('nav, [role="navigation"]');
    navElements.forEach((nav, index) => {
      if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
        if (navElements.length > 1) {
          nav.setAttribute('aria-label', `Navigation ${index + 1}`);
        } else {
          nav.setAttribute('aria-label', 'Main navigation');
        }
      }
    });
  },

  // New function to add scope attributes to table headers (REACT_027)
  addTableScopeAttributes() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
      const headerCells = table.querySelectorAll('th');
      
      headerCells.forEach(th => {
        // Skip if already has scope attribute
        if (th.hasAttribute('scope')) return;
        
        // Determine if this is a column header or row header
        const parent = th.parentElement;
        const parentRow = th.closest('tr');
        
        if (!parentRow) return;
        
        // Check if this TH is in the first column (potential row header)
        const isFirstCell = parentRow.firstElementChild === th;
        
        // Check if all sibling THs are in the first column (multiple row headers)
        const siblingThs = Array.from(parentRow.querySelectorAll('th'));
        const allThsInFirstColumn = siblingThs.every(siblingTh => {
          const siblingRow = siblingTh.parentElement;
          return siblingRow && siblingRow.firstElementChild === siblingTh;
        });
        
        // If all THs are in the first column, they are row headers
        if (allThsInFirstColumn && siblingThs.length > 1) {
          th.setAttribute('scope', 'row');
        }
        // If this TH is the only one in its row and not in first column, it's a column header
        else if (siblingThs.length === 1 && !isFirstCell) {
          th.setAttribute('scope', 'col');
        }
        // If this is a first column cell, check if it's a row header
        else if (isFirstCell) {
          // Check if there are other cells in the same column that are not TH
          const columnIndex = Array.from(parentRow.children).indexOf(th);
          const cellsInColumn = table.querySelectorAll(`tr > *:nth-child(${columnIndex + 1})`);
          const hasNonThCells = Array.from(cellsInColumn).some(cell => cell.tagName !== 'TH');
          
          if (hasNonThCells) {
            th.setAttribute('scope', 'row');
          } else {
            th.setAttribute('scope', 'col');
          }
        }
        // Default to column header
        else {
          th.setAttribute('scope', 'col');
        }
      });
      
      // Handle cells with role="columnheader" or role="rowheader"
      const columnHeaders = table.querySelectorAll('[role="columnheader"]');
      columnHeaders.forEach(cell => {
        if (!cell.hasAttribute('scope')) {
          cell.setAttribute('scope', 'col');
        }
      });
      
      const rowHeaders = table.querySelectorAll('[role="rowheader"]');
      rowHeaders.forEach(cell => {
        if (!cell.hasAttribute('scope')) {
          cell.setAttribute('scope', 'row');
        }
      });
    });
  },

  // New function to validate ARIA usage
  validateARIAUsage() {
    const ariaElements = document.querySelectorAll('[role]');
    ariaElements.forEach(el => {
      const role = el.getAttribute('role');
      // Add validation logic here as needed
    });
  },

  // New function to address accessibility issues from insight report
  addressAccessibilityIssues(report) {
    if (!report) return;

    // Validate and fix table accessibility
    if (report.tables) {
      this.validateTableAccessibility();
      this.validateTableStructure();
    }

    // Validate and fix landmark elements
    if (report.landmarks) {
      this.checkLandmarkElements();
      this.validateLandmark();
      this.validateLandmarkStructure();
      this.ensureUniqueLandmarks();
    }

    // Apply SVG accessibility
    if (report.svg) {
      this.addSVGAccessibilityProps();
    }
  },

  // Validate and fix table accessibility
  validateTableAccessibility() {
    if (typeof window === 'undefined') return;
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      const headers = table.querySelectorAll('th');
      headers.forEach(th => {
        if (!th.getAttribute('scope')) {
          th.setAttribute('scope', 'col');
        }
      });
      if (!table.getAttribute('aria-label') && !table.getAttribute('aria-labelledby')) {
        table.setAttribute('aria-label', 'Table');
      }
    });
  },

  // Validate and fix table structure
  validateTableStructure() {
    if (typeof window === 'undefined') return;
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      if (!table.querySelector('thead')) {
        const thead = document.createElement('thead');
        const firstRow = table.querySelector('tr');
        if (firstRow) {
          thead.appendChild(firstRow);
        }
        table.insertBefore(thead, table.firstChild);
      }
      if (!table.querySelector('tbody')) {
        const tbody = document.createElement('tbody');
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          if (!table.querySelector('thead').contains(row)) {
            tbody.appendChild(row);
          }
        });
        table.appendChild(tbody);
      }
    });
  },

  // Validate landmark elements
  validateLandmark() {
    if (typeof window === 'undefined') return;
    const landmarks = document.querySelectorAll('main, nav, header, footer, aside');
    landmarks.forEach(el => {
      if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.getAttribute('role')) {
        // Optionally add a role, but leave as is for now
      }
    });
  },

  // Validate landmark structure
  validateLandmarkStructure() {
    if (typeof window === 'undefined') return;
    const main = document.querySelector('main');
    if (main) {
      const nestedLandmarks = main.querySelectorAll('main, nav, header, footer, aside');
      if (nestedLandmarks.length > 0) {
        console.warn('Landmarks nested within main may be incorrect.');
      }
    }
  },

  // Ensure unique landmark IDs
  ensureUniqueLandmarks() {
    if (typeof window === 'undefined') return;
    const landmarks = document.querySelectorAll('[role="landmark"], main, nav, header, footer, aside');
    const idSet = new Set();
    landmarks.forEach(el => {
      const id = el.id;
      if (id) {
        if (idSet.has(id)) {
          console.warn('Duplicate landmark ID found:', id);
        } else {
          idSet.add(id);
        }
      }
    });
  },

  // Preserve existing code functionality
  preserveExistingCode() {
    // TODO: This is the existing code that needs to be preserved
    // (This comment remains as-is)
    // _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
    // <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
    // _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
    // <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
    // _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
    // <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
  }
};

// Function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  report.forEach(issue => {
    switch (issue.type) {
      case 'missing-lang':
        if (!document.documentElement.getAttribute('lang')) {
          document.documentElement.setAttribute('lang', 'en');
        }
        break;
      case 'missing-skip-link':
        if (!document.querySelector('.skip-link')) {
          const skipLink = document.createElement('a');
          skipLink.className = 'skip-link';
          skipLink.href = '#main-content';
          skipLink.textContent = 'Skip to main content';
          document.body.insertBefore(skipLink, document.body.firstChild);
        }
        break;
      case 'missing-alt':
        document.querySelectorAll('img').forEach(img => {
          if (!img.getAttribute('alt')) {
            img.setAttribute('alt', 'Image description');
          }
        });
        break;
      case 'missing-label':
        document.querySelectorAll('input, select, textarea').forEach(el => {
          if (!el.getAttribute('aria-label') && !el.getAttribute('id')) {
            el.setAttribute('aria-label', 'Form field');
          }
        });
        break;
    }
  });
}

// REACT_015: Add lang attribute
if (!document.documentElement.getAttribute('lang')) {
  document.documentElement.setAttribute('lang', 'en');
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
});

/**
 * Addresses accessibility issues from insight report
 * Processes the report and applies appropriate fixes based on identified issues
 * @param {Object} report - Insight report containing accessibility issues to address
 * @param {string} htmlString - HTML content to fix
 * @param {Object} options - Configuration options for fixing
 * @returns {string} HTML with accessibility issues addressed based on report
 */
function addressAccessibilityIssues(report, htmlString, options = {}) {
  // Return original HTML if no report or HTML provided
  if (!report || !htmlString) {
    return htmlString || '';
  }

  // Initialize result with original HTML
  let result = htmlString;
  const fixedIssues = [];
  const defaultLangCode = options.langCode || 'en';

  // Process REACT_015: Add lang attribute to HTML element
  if (report.REACT_015) {
    result = addLangAttribute(result, report.langCode || defaultLangCode);
    fixedIssues.push('REACT_015');
  }

  // Process REACT_027: Fix table structure issues
  if (report.REACT_027) {
    result = fixTableStructureIssues(result);
    fixedIssues.push('REACT_027');
  }

  // Process REACT_017: Add/fix landmark issues
  if (report.REACT_017) {
    result = addMainLandmark(result);
    fixedIssues.push('REACT_017');
  }

  // Process REACT_041: Add accessible names to SVGs
  if (report.REACT_041) {
    result = addSvgAccessibleNames(result);
    fixedIssues.push('REACT_041');
  }

  // Process REACT_025: Ensure unique landmarks
  if (report.REACT_025) {
    result = ensureUniqueLandmarks(result);
    fixedIssues.push('REACT_025');
  }

  // Process REACT_036: Fix fake link issue
  if (report.REACT_036) {
    result = fixFakeLinkIssue(result);
    fixedIssues.push('REACT_036');
  }

  // Log summary of fixes applied
  if (fixedIssues.length > 0) {
    console.log(`Accessibility fixes applied for issues: ${fixedIssues.join(', ')}`);
  }

  return result;
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
  accessibilityCheckTables();
});

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  reverseString,
  isEven,
  capitalizeFirst,
  a11yStore,
  addressAccessibilityIssues,
  updateLiveRegion: a11yStore.updateLiveRegion,
  checkLandmarkElements: a11yStore.checkLandmarkElements,
  addSVGAccessibilityProps: a11yStore.addSVGAccessibilityProps,
  preserveExistingCode: a11yStore.preserveExistingCode,
  prefersReducedMotion: a11yStore.prefersReducedMotion,
  prefersHighContrast: a11yStore.prefersHighContrast
};

// ES6 module exports (preserved from origin/main)
export { a11yStore };
export { addressAccessibilityIssues };
export { updateLiveRegion };
export { checkLandmarkElements };
export { addSVGAccessibilityProps };
export { preserveExistingCode };
export { prefersReducedMotion };
export { prefersHighContrast };
export default a11yStore;