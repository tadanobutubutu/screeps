// Accessible Insight Report Interface
// Address accessibility issues from insight report

const { helperFunction } = require('./helpers');
const { formatData, validateInput } = require('./utils');

/**
 * Gets the language attribute value from the document
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
    if (typeof document !== 'undefined') {
        return document.documentElement.lang || 'en';
    }
    return 'en';
}

/**
 * Gets the full language attribute with region (e.g., 'en-US')
 * @returns {string} The full language attribute value
 */
function getFullLangAttribute() {
    const lang = getLangAttribute();
    // Could be enhanced to parse region from document or configuration
    return lang;
}

/**
 * Validates table accessibility compliance
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with issues array
 */
function validateTableAccessibility(table) {
    const issues = [];
    
    if (!table) {
        return { valid: false, issues: ['No table element provided'] };
    }
    
    // Check for proper table headers
    const headers = table.querySelectorAll('th');
    const cells = table.querySelectorAll('td, th');
    
    if (headers.length === 0 && cells.length > 0) {
        issues.push('Table should have header cells (th) for accessibility');
    }
    
    // Check for caption if table is complex
    const caption = table.querySelector('caption');
    if (!caption && cells.length > 4) {
        issues.push('Complex table should have a caption for accessibility');
    }
    
    return {
        valid: issues.length === 0,
        issues
    };
}

/**
 * Validates table structure for accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Structure validation result
 */
function validateTableStructure(table) {
    const issues = [];
    
    if (!table) {
        return { valid: false, issues: ['No table element provided'] };
    }
    
    // Check for thead, tbody, tfoot structure
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    
    if (!thead) {
        issues.push('Table should have a thead section for header rows');
    }
    
    if (!tbody) {
        issues.push('Table should have a tbody section for data rows');
    }
    
    // Check for proper scope attributes on headers
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
        if (!header.getAttribute('scope')) {
            issues.push(`Header at index ${index} missing scope attribute`);
        }
    });
    
    return {
        valid: issues.length === 0,
        issues
    };
}

/**
 * Validates landmark elements for accessibility
 * @param {Document} doc - The document to validate
 * @returns {Object} Validation result with landmark issues
 */
function validateLandmark(doc) {
    const issues = [];
    const landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
    
    if (!doc) {
        return { valid: false, issues: ['No document provided'] };
    }
    
    landmarks.forEach(landmark => {
        const elements = doc.querySelectorAll(landmark);
        if (elements.length === 0 && landmark !== 'aside') {
            // aside is optional, others are recommended
            if (landmark === 'main') {
                issues.push(`Missing recommended <main> landmark`);
            }
        }
    });
    
    return {
        valid: issues.length === 0,
        issues
    };
}

/**
 * Validates landmark structure for proper nesting and usage
 * @param {Document} doc - The document to validate
 * @returns {Object} Structure validation result
 */
function validateLandmarkStructure(doc) {
    const issues = [];
    
    if (!doc) {
        return { valid: false, issues: ['No document provided'] };
    }
    
    // Check for proper landmark usage
    const headers = doc.querySelectorAll('header:not([role])');
    const mains = doc.querySelectorAll('main:not([role])');
    
    // Ensure only one main landmark
    if (mains.length > 1) {
        issues.push(`Multiple <main> landmarks found (${mains.length}). Only one is recommended.`);
    }
    
    // Check header landmarks
    headers.forEach((header, index) => {
        const parent = header.parentElement;
        if (parent && (parent.tagName === 'ARTICLE' || parent.tagName === 'SECTION')) {
            // Header inside article/section is acceptable
        } else if (index > 0) {
            issues.push(`Additional <header> landmark found. Consider using <div> for non-landmark headers.`);
        }
    });
    
    return {
        valid: issues.length === 0,
        issues
    };
}

/**
 * Ensures all landmarks have unique identifiers when needed (validation)
 * @param {Document} doc - The document to check
 * @returns {Object} Result with duplicate landmarks
 */
function validateUniqueLandmarks(doc) {
    const issues = [];
    
    if (!doc) {
        return { valid: false, issues: ['No document provided'] };
    }
    
    const landmarks = ['banner', 'navigation', 'main', 'contentinfo', 'complementary'];
    landmarks.forEach(role => {
        const elements = doc.querySelectorAll(`[role="${role}"]`);
        if (elements.length > 1) {
            issues.push(`Multiple landmarks with role="${role}" found (${elements.length}). Each should be unique.`);
        }
    });
    
    return {
        valid: issues.length === 0,
        issues
    };
}

/**
 * Gets or generates an accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
    if (!svg) {
        return '';
    }
    
    // Check for aria-label
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) {
        return ariaLabel;
    }
    
    // Check for aria-labelledby reference
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
        const labelElement = document.getElementById(ariaLabelledby);
        if (labelElement) {
            return labelElement.textContent || '';
        }
    }
    
    // Check for title element inside SVG
    const title = svg.querySelector('title');
    if (title) {
        return title.textContent || '';
    }
    
    // Return empty string if no accessible name found
    return '';
}

/**
 * Creates an accessible in-page button with proper semantics
 * @param {Object} options - Button options
 * @returns {HTMLButtonElement} The accessible button element
 */
function createInPageButton(options = {}) {
    const button = document.createElement('button');
    
    button.textContent = options.text || 'Button';
    button.setAttribute('type', 'button');
    
    // Ensure accessible name
    if (options.ariaLabel) {
        button.setAttribute('aria-label', options.ariaLabel);
    }
    
    // Handle click if provided
    if (typeof options.onClick === 'function') {
        button.addEventListener('click', options.onClick);
    }
    
    // Add disabled state if needed
    if (options.disabled) {
        button.disabled = true;
        button.setAttribute('aria-disabled', 'true');
    }
    
    return button;
}

/**
 * Creates an accessible link with proper semantics
 * @param {Object} options - Link options
 * @returns {HTMLAnchorElement} The accessible anchor element
 */
function createAccessibleLink(options = {}) {
    const link = document.createElement('a');
    
    link.textContent = options.text || 'Link';
    link.href = options.href || '#';
    
    // Ensure accessible name
    if (options.ariaLabel) {
        link.setAttribute('aria-label', options.ariaLabel);
    }
    
    // Handle click if provided
    if (typeof options.onClick === 'function') {
        link.addEventListener('click', (e) => {
            if (!link.href || link.href === '#') {
                e.preventDefault();
                options.onClick(e);
            }
        });
    }
    
    // Add role="button" if it's actually a link styled as button
    if (options.role === 'button') {
        link.setAttribute('role', 'button');
    }
    
    return link;
}

/**
 * Handles and reports accessibility issues
 * @param {Array} issues - Array of accessibility issues
 * @returns {Object} Summary of handled issues
 */
function handleAccessibilityIssues(issues) {
    const summary = {
        total: issues.length,
        critical: [],
        moderate: [],
        minor: []
    };
    
    issues.forEach(issue => {
        if (issue.severity === 'critical') {
            summary.critical.push(issue);
        } else if (issue.severity === 'moderate') {
            summary.moderate.push(issue);
        } else {
            summary.minor.push(issue);
        }
    });
    
    // Log issues for visibility
    if (summary.critical.length > 0) {
        console.error('Critical accessibility issues found:', summary.critical);
    }
    
    return summary;
}

// Accessibility helper function to announce dynamic content changes to screen readers
function announceToScreenReader(message, priority = 'polite') {
  const announcer = document.getElementById('sr-announcer') || createAnnouncer();
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = message;
  
  // Clear after announcement to allow re-announcement of same message
  setTimeout(() => {
    announcer.textContent = '';
  }, 1000);
}

function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.id = 'sr-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
  document.body.appendChild(announcer);
  return announcer;
}

// Trap focus within modal dialogs for accessibility
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleTabKey(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
    // Close on Escape key
    if (e.key === 'Escape') {
      element.setAttribute('aria-hidden', 'true');
      element.style.display = 'none';
      document.removeEventListener('keydown', handleTabKey);
    }
  }

  document.addEventListener('keydown', handleTabKey);
  firstFocusable && firstFocusable.focus();
}

// Update ARIA expanded state for collapsible sections
function toggleAriaExpanded(element) {
  const isExpanded = element.getAttribute('aria-expanded') === 'true';
  element.setAttribute('aria-expanded', !isExpanded);
  
  const controlsId = element.getAttribute('aria-controls');
  if (controlsId) {
    const controlledElement = document.getElementById(controlsId);
    if (controlledElement) {
      controlledElement.setAttribute('aria-hidden', isExpanded);
    }
  }
}

// Handle missing alt text for images
function handleMissingAltText(container) {
  const images = container.querySelectorAll('img:not([alt])');
  images.forEach((img, index) => {
    img.setAttribute('alt', `Image ${index + 1} - description unavailable`);
    img.setAttribute('role', 'presentation');
  });
  
  // Add warning for accessibility audit
  if (images.length > 0) {
    console.warn(`Accessibility: ${images.length} image(s) had missing alt text and were assigned default descriptions.`);
  }
}

// Accessibility function to add lang attribute to the HTML element
function addLangAttribute() {
  document.documentElement.lang = 'en';
}

// Accessibility function to fix table structure issues
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const tbody = table.querySelector('tbody');
        thead.appendChild(firstRow);
        table.insertBefore(thead, tbody || table.firstChild);
      }
    }
    table.querySelectorAll('td').forEach(td => {
      if (!td.hasAttribute('headers') && !td.hasAttribute('scope')) {
        td.setAttribute('scope', 'col');
      }
    });
  });
}

// Accessibility function to ensure proper main landmark
function addMainLandmark() {
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length === 0) {
    const mainElement = document.createElement('main');
    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(mainElement, body.firstChild);
    } else {
      body.appendChild(mainElement);
    }
  }
}

// Accessibility function to add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg:not([aria-label])');
  svgs.forEach((svg, index) => {
    const titleId = `svg-title-${index}`;
    let title = svg.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      title.id = titleId;
      title.textContent = `SVG graphic ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
    }
    if (!svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-labelledby', title.id || titleId);
    }
  });
}

// Accessibility function to ensure unique landmarks (fixes duplicates)
function fixUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, footer, nav, aside, section[aria-label], section[aria-labelledby]');
  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    if ((tagName === 'header' || tagName === 'footer') && !landmark.closest('main')) {
      // Keep multiple headers/footers outside main
    } else if (landmark.querySelector('main') || landmark.closest('main')) {
      // Ensure main is not nested incorrectly
      const nestedMain = landmark.querySelector('main');
      if (nestedMain && !landmark.closest('section') && !landmark.closest('article')) {
        const parent = landmark.parentNode;
        if (parent) {
          parent.insertBefore(nestedMain, landmark.nextSibling);
        }
      }
    }
  });
}

// Accessibility function to fix fake link issues
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    const onclick = link.getAttribute('onclick');
    const isButton = link.getAttribute('role') === 'button' || link.tagName === 'BUTTON';
    if ((onclick || isButton) && !link.getAttribute('href')) {
      link.setAttribute('role', 'button');
      if (onclick) {
        link.setAttribute('tabindex', '0');
      }
    }
  });
  const buttonsAsLinks = document.querySelectorAll('button[href], a[onclick]');
  buttonsAsLinks.forEach(element => {
    if (element.tagName === 'BUTTON' && element.hasAttribute('href')) {
      element.removeAttribute('href');
    }
  });
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure all form inputs have associated labels
    const inputs = document.querySelectorAll('input:not([id]), select:not([id]), textarea:not([id])');
    inputs.forEach((input, index) => {
      const id = input.id || `auto-input-${index}`;
      input.id = id;
      
      if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = `Input ${index + 1}`;
        label.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
        input.parentNode.insertBefore(label, input);
      }
    });

    // Ensure buttons are keyboard accessible
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      if (!button.hasAttribute('tabindex') && !button.hasAttribute('aria-label')) {
        // Button is accessible by default
      }
    });

    // Handle missing alt text for images
    handleMissingAltText(document.body);

    // Run origin/main accessibility improvements
    addLangAttribute();
    fixTableStructureIssues();
    addMainLandmark();
    addSvgAccessibleNames();
    fixUniqueLandmarks();
    fixFakeLinkIssue();

    announceToScreenReader('Page loaded and accessibility features initialized', 'assertive');
  });
}

// Main application logic
function main() {
  console.log('Application started');
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getLangAttribute,
        getFullLangAttribute,
        validateTableAccessibility,
        validateTableStructure,
        validateLandmark,
        validateLandmarkStructure,
        validateUniqueLandmarks,
        getSvgAccessibleName,
        createInPageButton,
        createAccessibleLink,
        handleAccessibilityIssues,
        main,
        helperFunction,
        formatData,
        validateInput,
        announceToScreenReader,
        trapFocus,
        toggleAriaExpanded,
        handleMissingAltText,
        addLangAttribute,
        fixTableStructureIssues,
        addMainLandmark,
        addSvgAccessibleNames,
        fixUniqueLandmarks,
        fixFakeLinkIssue
    };
}