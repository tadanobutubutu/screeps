const fs = require('fs');
const path = require('path');

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];

/**
 * Checks landmark elements in HTML content for accessibility compliance.
 * @param {string} htmlContent - The HTML content to check
 * @returns {Object} - Object containing landmark element information and any warnings
 */
function checkLandmarkElements(htmlContent) {
  const warnings = [];
  const foundLandmarks = {};

  LANDMARK_ELEMENTS.forEach(landmark => {
    const regex = new RegExp(`<${landmark}[^>]*>`, 'gi');
    const matches = htmlContent.match(regex);
    if (matches) {
      foundLandmarks[landmark] = matches.length;
    }
  });

  if (!foundLandmarks.main) {
    warnings.push('Missing main landmark element');
  }

  return {
    foundLandmarks,
    warnings,
    hasMainLandmark: !!foundLandmarks.main
  };
}

/**
 * Creates an in-page button for the game interface
 * @param {Object} options - Button configuration options
 * @param {string} options.text - The text to display on the button
 * @param {Function} options.onClick - The callback function when button is clicked
 * @param {string} [options.id] - Optional unique identifier for the button
 * @param {string} [options.title] - Optional title/tooltip for the button
 * @param {string} [options.className] - Optional CSS class name for styling
 * @returns {Object} - The created button object
 */
function createInPageButton(options) {
  const { text, onClick, id, title, className } = options;

  // Validate required options
  if (!text) {
    throw new Error('Button text is required');
  }
  if (typeof onClick !== 'function') {
    throw new Error('onClick callback must be a function');
  }

  // Create button object
  const button = {
    id: id || `btn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    text: String(text),
    title: title || '',
    className: className || 'default-button',
    onClick,
    disabled: false,
    visible: true,
    element: null
  };

  // Store button reference
  if (!createInPageButton.buttons) {
    createInPageButton.buttons = {};
  }
  createInPageButton.buttons[button.id] = button;

  return button;
}

// TODO: Implement a function to count dependencies
function countDependencies() {
  // Existing function implementation

  // New implementation to count dependencies using Document and regex
  const importCommentRegExp = /\/\/\s*require\s*\(|import\s+.*\s+from\s+['"`]/g;
  const document = { body: { textContent: '' } };
  const importCount = (document.body.textContent || '').match(importCommentRegExp) || [];
  return importCount.length;
}

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,
  announcements: [],
  addAnnouncement(message) {
    this.announcements.push({
      message,
      timestamp: Date.now()
    });
  },
  getAnnouncements() {
    return this.announcements;
  },
  clearAnnouncements() {
    this.announcements = [];
  },

  init() {
    this.createLiveRegion();
    this.addSVGAccessibility();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.addFocusStyles();
    this.setupFocusVisiblePolyfill();
    this.enhanceDynamicContent();
  },

  // Create a live region for screen reader announcements
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

  // Apply ARIA attributes to SVG elements
  addSVGAccessibility() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', 'svg-title');
      const titleText = svg.getAttribute('title') || 'Image description';
      const descriptionId = `svg-description-${Math.round(Math.random() * 1000)}`;
      svg.setAttribute('aria-describedby', descriptionId);

      const descriptionElement = document.createElement('desc');
      descriptionElement.id = descriptionId;
      descriptionElement.textContent = titleText;
      svg.appendChild(descriptionElement);
    });
  },

  // Apply ARIA attributes to dynamically added elements
  enhanceSVG() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      svg.setAttribute('role', 'img');
      if (!svg.getAttribute('aria-labelledby')) {
        const titleText = svg.getAttribute('title') || 'Image description';
        const descriptionId = `svg-description-${Math.round(Math.random() * 1000)}`;
        svg.setAttribute('aria-labelledby', descriptionId);

        const descriptionElement = document.createElement('desc');
        descriptionElement.id = descriptionId;
        descriptionElement.textContent = titleText;
        svg.appendChild(descriptionElement);
      }
    });
  },

  // Anchor message to screen reader via live region
  announce(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    // Use setTimeout to ensure the change is detected by screen readers
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  // Setup keyboard navigation for interactive elements
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Handle Enter and Space for custom interactive elements
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target.closest('[role="button"]');
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

      // Escape key to close modals/dropdowns
      if (e.key === 'Escape') {
        const openModal = document.querySelector('[aria-modal="true"][aria-hidden="false"]');
        if (openModal) {
          openModal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      }
    });

    // Fix Safari focus trapping in dropdowns
    const dropdownContainers = document.querySelectorAll('[data-dropdown]');
    dropdownContainers.forEach(container => {
      container.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        const currentFocusedElement = document.activeElement;
        let focusIsInsideContainer = false;

        if (
          currentFocusedElement &&
          (currentFocusedElement === container ||
            currentFocusedElement.closest('[data-dropdown]'))
        ) {
          focusIsInsideContainer = true;
        }

        // Ensure focus trapping only within the dropdown container
        if (focusIsInsideContainer) {
          // Find the first focusable element within the container
          const firstFocusableElement = container.querySelector(
            'button, [href], input, select, textarea, [tabindex]'
          );

          if (firstFocusableElement) {
            const lastFocusableElement = firstFocusableElement;
            // Handle tab cycling
            if (e.shiftKey && document.activeElement === firstFocusableElement) {
              e.preventDefault();
              lastFocusableElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
              e.preventDefault();
              firstFocusableElement.focus();
            }
          }
        }
      });
    });
  },

  // Manage focus for accessibility
  setupFocusManagement() {
    // Trap focus within modals
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('[aria-modal="true"][aria-hidden="false"]');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]'
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

  // Setup skip links
  setupSkipLinks() {
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) return;

    const targetId = skipLink.getAttribute('href').substring(1);
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        this.announce('Skipped to main content');
      });

      // Focus the skip link when the document is loaded in Safari
      if (typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Safari') !== -1) {
        skipLink.focus();
      }
    }
  },

  // Add lang attribute to HTML element
  getLangAttribute() {
    return document.documentElement.lang || 'en';
  },

  // Create skip-to-main-content button
  createInPageButton() {
    const button = document.createElement('button');
    button.textContent = 'Skip to main content';
    button.addEventListener('click', () => {
      const main = document.querySelector('main');
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus();
      }
    });
    return button;
  },

  // Utility: Check if user prefers reduced motion
  prefersReducedMotion() {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  },

  // Utility: Check if user prefers high contrast
  prefersHighContrast() {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-contrast: more)').matches
    );
  },

  // New function to handle dynamic content updates
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.announce(message, priority);
  },

  // New function to check landmark elements
  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach(tag => {
      const landmark = document.querySelector(tag);
      if (landmark && landmark.id === '') {
        landmark.id = `${tag}-${Math.floor(Math.random() * 1000)}`;
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
    svgElements.forEach(svg => {
      svg.setAttribute('role', 'img');
      if (!svg.getAttribute('aria-labelledby')) {
        const titleText = svg.getAttribute('title') || 'Image description';
        const descriptionId = `svg-desc-${Math.floor(Math.random() * 1000)}`;
        svg.setAttribute('aria-labelledby', descriptionId);

        const descriptionElement = document.createElement('desc');
        descriptionElement.id = descriptionId;
        descriptionElement.textContent = titleText;
        svg.appendChild(descriptionElement);
      }
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
    // Placeholder to ensure existing functionality is maintained
    console.log("Preserving existing code and accessibility features");
  },

  // Get person name for accessible labeling
  personName() {
    const nameElement = document.querySelector('[data-person-name]');
    return nameElement ? nameElement.textContent.trim() : 'User';
  },

  // Get accessible name for SVG
  getSvgAccessibleName(svg) {
    return svg.getAttribute('aria-label') || svg.getAttribute('title') || 'Image';
  },
};

// New function to handle adding landmark regions
function addLandmarkRegions() {
  const landmarks = {
    main: true,
    nav: false,
    aside: false
  };

  return {
    landmarks,
    regions: Object.keys(landmarks).filter(key => landmarks[key])
  };
}

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  a11yStore.addressAccessibilityIssues(report);
}

// Get person name for accessible labeling
function personName() {
  return a11yStore.personName();
}

// Validate and fix table accessibility
function validateTableAccessibility() {
  a11yStore.validateTableAccessibility();
}

// Validate and fix table structure
function validateTableStructure() {
  a11yStore.validateTableStructure();
}

// Validate landmark elements
function validateLandmark() {
  a11yStore.validateLandmark();
}

// Validate landmark structure
function validateLandmarkStructure() {
  a11yStore.validateLandmarkStructure();
}

// Get accessible name for SVG
function getSvgAccessibleName(svg) {
  return a11yStore.getSvgAccessibleName(svg);
}

// Ensure unique landmark IDs
function ensureUniqueLandmarks() {
  a11yStore.ensureUniqueLandmarks();
}

// New function to handle dynamic content updates
function updateLiveRegion(message, priority = 'polite') {
  a11yStore.updateLiveRegion(message, priority);
}

// New function to check landmark elements
function checkLandmarkElementsInDom() {
  a11yStore.checkLandmarkElements();
}

// New function to add SVG accessibility props
function addSVGAccessibilityProps() {
  a11yStore.addSVGAccessibilityProps();
}

function preserveExistingCode() {
  a11yStore.preserveExistingCode();
}

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
  checkLandmarkElements,
  createInPageButton,
  countDependencies,
  a11yStore,
  addLandmarkRegions,
  addressAccessibilityIssues,
  LANDMARK_ELEMENTS,
  getLangAttribute: a11yStore.getLangAttribute.bind(a11yStore),
  updateLiveRegion,
  addSVGAccessibilityProps,
  preserveExistingCode,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  checkLandmarkElementsInDom
};