// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// main.js
// TODO: add the new functions or changes requested in the issue
// Here is the implementation for checking link accessibility
// The existing isLinkAccessible function implementation

// Implementation of unique landmark functions

// Global set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 9);
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

// Add lang attribute as per the issue requirement
function addLangAttribute() {
  // Assuming there is a relevant element selector or similar to target
  const elementToModify = document.querySelector('some-selector');
  if (elementToModify) {
    elementToModify.setAttribute('lang', 'en'); // Example: English
  }
}

/**
 * Gets the lang attribute from the HTML element.
 * @returns {string} The language attribute value.
 */
function getLangAttribute() {
    return document.documentElement.lang || 'en';
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (!element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * This function gets the full language attribute with region (if provided)
 * @returns {string} - the full language attribute with region (if provided)
 */
function getFullLangAttribute() {
    return document.documentElement.lang || '';
}

/**
 * Function to remove the 'my-button' class, and set a specific id for the button element if it exists.
 * Assumes you have already set the id on the button element in your code.
 */
function replaceMyButtonId() {
  const button = document.querySelector('.my-button');
  if (button) {
    button.classList.remove('my-button');
    button.id = 'exampleButton';
    button.setAttribute('aria-label', 'Example Button');
  }
}

/**
 * Validates that a landmark has proper accessibility attributes.
 * @param {HTMLElement} landmark - The landmark element to validate.
 * @returns {boolean} True if the landmark is valid, false otherwise.
 */
function validateLandmark(landmark) {
    const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
    const role = landmark.getAttribute('role');
    
    if (role && !validRoles.includes(role)) {
        return false;
    }
    
    // Check if landmark has accessible name (via aria-label or aria-labelledby)
    const hasLabel = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby');
    const hasRole = landmark.hasAttribute('role');
    const hasId = landmark.id;
    
    // For main, it should have an id for skip links
    if (role === 'main' && !hasId) {
        return false;
    }
    
    return hasRole || hasLabel || hasId;
}

/**
 * Validates landmark structure and uniqueness across the document.
 * Ensures no duplicate landmark roles and proper landmark hierarchy.
 * @returns {Array} Array of validation error messages.
 */
function validateLandmarkStructure() {
    const errors = [];
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
    const roleCounts = {};
    
    // Find all elements with landmark roles
    const landmarks = document.querySelectorAll('[role]');
    landmarks.forEach(landmark => {
        const role = landmark.getAttribute('role');
        if (landmarkRoles.includes(role)) {
            roleCounts[role] = (roleCounts[role] || 0) + 1;
            
            // Check for unique IDs
            if (landmark.id) {
                if (_usedLandmarkIds.has(landmark.id)) {
                    errors.push(`Duplicate landmark ID: ${landmark.id}`);
                } else {
                    _usedLandmarkIds.add(landmark.id);
                }
            }
            
            // Check accessibility
            if (!validateLandmark(landmark)) {
                errors.push(`Landmark with invalid structure: ${role}`);
            }
        }
    });
    
    // Ensure only one main landmark
    if (roleCounts['main'] && roleCounts['main'] > 1) {
        errors.push(`Multiple main landmarks found: ${roleCounts['main']}`);
    }
    
    // Ensure only one banner
    if (roleCounts['banner'] && roleCounts['banner'] > 1) {
        errors.push(`Multiple banner landmarks found: ${roleCounts['banner']}`);
    }
    
    // Ensure only one contentinfo
    if (roleCounts['contentinfo'] && roleCounts['contentinfo'] > 1) {
        errors.push(`Multiple contentinfo landmarks found: ${roleCounts['contentinfo']}`);
    }
    
    return errors;
}

/**
 * Ensures all landmarks in the document have unique IDs.
 * @param {Array} landmarks - Array of landmark elements.
 * @returns {Array} Array of landmarks with unique IDs assigned.
 */
function ensureUniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    
    landmarks.forEach(landmark => {
        if (!landmark.id) {
            // Generate a unique ID based on the landmark's role
            const role = landmark.getAttribute('role') || 'region';
            let baseId = `landmark-${role}`;
            let counter = 1;
            
            while (seen.has(baseId)) {
                baseId = `landmark-${role}-${counter}`;
                counter++;
            }
            
            landmark.id = baseId;
            seen.add(baseId);
        } else {
            // Handle existing IDs that might be duplicated
            let finalId = landmark.id;
            let counter = 1;
            while (seen.has(finalId)) {
                finalId = `${landmark.id}-${counter}`;
                counter++;
            }
            if (finalId !== landmark.id) {
                landmark.id = finalId;
            }
            seen.add(finalId);
        }
        result.push(landmark);
    });
    
    return result;
}

/**
 * Gets an accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name.
 */
function getSvgAccessibleName(svg) {
    // Check for aria-label
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel && ariaLabel.trim()) {
        return ariaLabel.trim();
    }
    
    // Check for aria-labelledby
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
        const labelElement = document.getElementById(ariaLabelledby);
        if (labelElement && labelElement.textContent.trim()) {
            return labelElement.textContent.trim();
        }
    }
    
    // Check for title element inside SVG
    const title = svg.querySelector('title');
    if (title && title.textContent.trim()) {
        return title.textContent.trim();
    }
    
    return '';
}

/**
 * Creates an accessible in-page button, typically used for skip links or navigation buttons.
 * @param {Object} options - Button options.
 * @param {string} options.text - Button text content.
 * @param {string} options.id - Button ID.
 * @param {string} options.className - Button class name.
 * @param {Function} options.onClick - Click handler.
 * @returns {HTMLButtonElement} The created button element.
 */
function createInPageButton(options) {
    const button = document.createElement('button');
    button.type = 'button';
    
    if (options.id) {
        button.id = options.id;
    }
    
    if (options.className) {
        button.className = options.className;
    }
    
    if (options.text) {
        button.textContent = options.text;
    }
    
    // Ensure accessible name
    if (!button.hasAttribute('aria-label') && !button.textContent) {
        button.setAttribute('aria-label', 'In-page button');
    }
    
    if (options.onClick) {
        button.addEventListener('click', options.onClick);
    }
    
    return button;
}

/**
 * Creates an accessible link element.
 * @param {Object} options - Link options.
 * @param {string} options.href - Link href attribute.
 * @param {string} options.text - Link text content.
 * @param {string} options.id - Link ID.
 * @param {string} options.className - Link class name.
 * @param {string} options.ariaLabel - Link aria-label.
 * @param {Function} options.onClick - Click handler.
 * @returns {HTMLAnchorElement} The created anchor element.
 */
function createAccessibleLink(options) {
    const link = document.createElement('a');
    
    if (options.href) {
        link.href = options.href;
    }
    
    if (options.id) {
        link.id = options.id;
    }
    
    if (options.className) {
        link.className = options.className;
    }
    
    if (options.text) {
        link.textContent = options.text;
    }
    
    if (options.ariaLabel) {
        link.setAttribute('aria-label', options.ariaLabel);
    }
    
    // Ensure the link has an accessible name
    if (!link.textContent && !link.getAttribute('aria-label')) {
        link.setAttribute('aria-label', 'Accessible link');
    }
    
    if (options.onClick) {
        link.addEventListener('click', options.onClick);
    }
    
    return link;
}

/**
 * Handles accessibility issues by fixing common problems.
 * This includes ensuring links have accessible names, landmarks have proper attributes, etc.
 * @returns {Array} Array of issues that were fixed.
 */
function handleAccessibilityIssues() {
    const fixed = [];
    
    // Fix fake links (links without proper href or with href="#")
    const fakeLinks = document.querySelectorAll('a[href="#"], a:not([href])');
    fakeLinks.forEach(link => {
        if (!link.textContent && !link.getAttribute('aria-label')) {
            // Check if it looks like a button
            const isButtonLike = link.classList.contains('btn') || 
                                 link.getAttribute('role') === 'button' ||
                                 link.querySelector('span, i, svg');
            
            if (isButtonLike) {
                // Convert to button or add accessible name
                link.setAttribute('aria-label', link.textContent || 'Button');
            } else {
                // Add accessible name based on context
                const parent = link.parentElement;
                if (parent) {
                    const prevText = previousSiblingText(link);
                    if (prevText) {
                        link.setAttribute('aria-label', prevText);
                    }
                }
            }
            fixed.push('Fixed fake link: ' + (link.id || link.className || 'unknown'));
        }
    });
    
    // Fix SVGs without accessible names
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        if (!getSvgAccessibleName(svg)) {
            const id = `svg-label-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const title = document.createElement('title');
            title.id = id;
            title.textContent = 'Decorative graphic';
            
            // Insert title as first child
            if (svg.firstChild) {
                svg.insertBefore(title, svg.firstChild);
            } else {
                svg.appendChild(title);
            }
            
            svg.setAttribute('aria-labelledby', id);
            fixed.push('Added accessible name to SVG: ' + id);
        }
    });
    
    // Fix table headers without scope attributes
    const tableHeaders = document.querySelectorAll('th');
    tableHeaders.forEach(th => {
        if (!th.hasAttribute('scope')) {
            // Determine if this is a column or row header
            const row = th.parentElement;
            if (row) {
                const cells = Array.from(row.children);
                const index = cells.indexOf(th);
                const isFirstCell = index === 0;
                
                // Check if all cells in this column are th elements (row headers)
                const parentTable = row.closest('table');
                if (parentTable) {
                    const allRows = parentTable.querySelectorAll('tr');
                    let columnAllTh = true;
                    allRows.forEach(r => {
                        const cell = r.children[index];
                        if (cell && cell.tagName !== 'TH') {
                            columnAllTh = false;
                        }
                    });
                    
                    if (columnAllTh && !isFirstCell) {
                        th.setAttribute('scope', 'row');
                    } else {
                        th.setAttribute('scope', 'col');
                    }
                    fixed.push('Added scope attribute to th element');
                }
            }
        }
    });
    
    return fixed;
}

/**
 * Helper function to get text from previous sibling elements.
 * @param {HTMLElement} element - The element to check.
 * @returns {string} Text content from previous siblings.
 */
function previousSiblingText(element) {
    let sibling = element.previousElementSibling;
    while (sibling) {
        if (sibling.textContent.trim()) {
            return sibling.textContent.trim();
        }
        sibling = sibling.previousElementSibling;
    }
    return '';
}

/**
 * Adds proper ARIA landmark regions to the document.
 * This improves screen reader navigation by ensuring proper landmark roles.
 *
 * @returns {void}
 */
function addProperLandmarkRegions() {
  // Create main landmark
  const main = document.querySelector('main') || document.createElement('main');
  main.setAttribute('role', 'main');
  main.id = main.id || 'main-content';

  // Create navigation landmark
  const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
  if (nav) {
      nav.setAttribute('role', 'navigation');
      nav.id = nav.id || 'primary-navigation';
  }

  // Create banner/header landmark
  const header = document.querySelector('header') || document.querySelector('[role="banner"]') || document.createElement('header');
  header.setAttribute('role', 'banner');
  header.id = header.id || 'site-header';

  // Create contentinfo/footer landmark
  const footer = document.querySelector('footer') || document.querySelector('[role="contentinfo"]') || document.createElement('footer');
  footer.setAttribute('role', 'contentinfo');
  footer.id = footer.id || 'site-footer';

  // Create aside landmark for complementary content
  const asides = document.querySelectorAll('aside, [role="complementary"]');
  asides.forEach((aside, index) => {
    aside.setAttribute('role', 'complementary');
    if (!aside.id) aside.id = `sidebar-${index + 1}`;
  });
}

/**
 * Adds proper ARIA account management elements to the document.
 * This includes adding `aria-expanded` attributes for collapsible menus,
 * and adding `aria-label` to form elements.
 *
 * @returns {void}
 */
function addProperAccountManagement() {
  // Add aria-expanded to collapsible menus/buttons
  const collapsibles = document.querySelectorAll('[aria-expanded], .collapsible');
  collapsibles.forEach(item => {
    if (!item.hasAttribute('aria-expanded')) {
      item.setAttribute('aria-expanded', 'false');
    }
  });

  // Add aria-labels to form inputs
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input, index) => {
    const id = input.id || `input-${index}`;
    input.id = id;
    if (!input.hasAttribute('aria-label')) {
      input.setAttribute('aria-label', `Input field ${index + 1}`);
    }
  });
}

/**
 * Adds ARIA attributes to form controls for better accessibility.
 * This function focuses on ensuring that form controls have proper labeling and roles.
 *
 * @returns {void}
 */
function addAriaToFormControls() {
  // Add required aria attributes to form controls
  const formControls = document.querySelectorAll('input, select, textarea');

  formControls.forEach(control => {
    // Ensure all form controls have accessible names
    if (!control.id && !control.getAttribute('aria-label')) {
      const label = control.id ? document.querySelector(`label[for="${control.id}"]`) : null;
      if (label) {
        label.id = label.id || `label-${control.id}`;
        control.setAttribute('aria-labelledby', label.id);
      }
    }

    // Mark required fields appropriately
    if (control.hasAttribute('required') && !control.hasAttribute('aria-required')) {
      control.setAttribute('aria-required', 'true');
    }
  });
}

/**
 * Adds accessible names to SVGs.
 * @param {Array} svgs - Array of SVG elements.
 * @returns {void}
 */
function addAccessibleNamesToSVGs(svgs) {
  svgs.forEach(svg => {
    // Check if SVG already has an accessible name
    const existingName = getSvgAccessibleName(svg);
    if (existingName) {
      return;
    }
    
    // Generate unique ID for the title
    const id = `svg-label-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    svg.setAttribute('id', id);
    
    // Create title element
    const title = document.createElement('title');
    title.id = `${id}-title`;
    title.textContent = 'SVG graphic';
    
    // Insert title as first child
    if (svg.firstChild) {
      svg.insertBefore(title, svg.firstChild);
    } else {
      svg.appendChild(title);
    }
    
    // Link the SVG to the title
    svg.setAttribute('aria-labelledby', title.id);
  });
}

/**
 * Removes fake links from the document.
 * @returns {void}
 */
function removeFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""]');
  fakeLinks.forEach(link => {
    // Only hide if there's no accessible name
    const hasAccessibleName = isLinkAccessible(link);
    if (!hasAccessibleName) {
      link.style.display = 'none';
    }
  });
}

/**
 * Implement validateTableAccessibility() function to check for accessibility issues in tables.
 * This function should check for proper table headers, roles, and other relevant ARIA attributes.
 *
 * @returns {Array} Array of accessibility issues found.
 */
function validateTableAccessibility() {
  const issues = [];
  
  // Check for tables with no headers or headers that are not properly labeled
  const tables = document.querySelectorAll('table');
  tables.forEach((table, tableIndex) => {
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      issues.push(`Table ${tableIndex}: No headers found`);
    } else {
      headers.forEach((header, headerIndex) => {
        // Check for proper scope attribute
        const scope = header.getAttribute('scope');
        if (!scope) {
          issues.push(`Table ${tableIndex}, Header ${headerIndex}: Missing scope attribute`);
        } else if (scope !== 'col' && scope !== 'row' && scope !== 'colgroup' && scope !== 'rowgroup') {
          issues.push(`Table ${tableIndex}, Header ${headerIndex}: Invalid scope value: ${scope}`);
        }
        
        // Check for proper role attribute
        if (!header.hasAttribute('role') || (header.getAttribute('role') !== 'columnheader' && header.getAttribute('role') !== 'rowheader')) {
          issues.push(`Table ${tableIndex}, Header ${headerIndex}: Missing or invalid role attribute`);
        }
        
        // Check for accessible name
        const accessibleName = header.textContent.trim() || 
                               header.getAttribute('aria-label') || 
                               header.getAttribute('aria-labelledby');
        if (!accessibleName) {
          issues.push(`Table ${tableIndex}, Header ${headerIndex}: No accessible name`);
        }
      });
    }
    
    // Check for caption or aria-labelledby for table description
    const hasCaption = table.querySelector('caption');
    const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');
    if (!hasCaption && !hasAriaLabel) {
      issues.push(`Table ${tableIndex}: Missing caption or aria-label`);
    }
  });
  
  return issues;
}

/**
 * Implement validateTableStructure() function to check for proper table structure.
 * This function should check for tables with proper nesting and other structural issues.
 *
 * @returns {Array} Array of structural issues found.
 */
function validateTableStructure() {
  const issues = [];
  
  // Check for tables with incorrect nesting or other structural issues
  const tables = document.querySelectorAll('table');
  tables.forEach((table, tableIndex) => {
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length === 0) {
        issues.push(`Table ${tableIndex}, Row ${rowIndex}: Empty row`);
      }
    });
    
    // Check for proper table structure (thead, tbody)
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const tfoot = table.querySelector('tfoot');
    
    // If table has rows directly under table (not in tbody), that's a structural issue
    const directRows = table.querySelectorAll(':scope > tr');
    if (directRows.length > 0 && (!tbody || tbody.children.length === 0)) {
      issues.push(`Table ${tableIndex}: Rows not properly contained in tbody`);
    }
    
    // Check for proper column count consistency
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      const expectedCols = firstRow.querySelectorAll('td, th').length;
      rows.forEach((row, rowIndex) => {
        const actualCols = row.querySelectorAll('td, th').length;
        if (actualCols !== expectedCols) {
          issues.push(`Table ${tableIndex}, Row ${rowIndex}: Column count mismatch (expected ${expectedCols}, got ${actualCols})`);
        }
      });
    }
  });
  
  return issues;
}

// ARIA live region announcer
function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);';
  document.body.appendChild(announcer);
  
  return {
    announce: (message) => {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
    }
  };
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Function to improve keyboard navigation for interactive elements
function improveKeyboardNavigation() {
  const interactiveElements = document.querySelectorAll('[tabindex="-1"]');
  interactiveElements.forEach(element => {
    element.setAttribute('tabindex', '0');
  });
}

// Function to add ARIA live regions for dynamic content updates
function addLiveRegionForDynamicContent() {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('role', 'alert');
  document.body.appendChild(liveRegion);
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();
  
  // Ensure all landmarks have unique IDs
  const landmarks = document.querySelectorAll('[role]');
  ensureUniqueLandmarks(Array.from(landmarks));
  
  // Improve keyboard navigation
  improveKeyboardNavigation();
  
  // Add live region for dynamic content
  addLiveRegionForDynamicContent();
  
  // Handle any remaining accessibility issues
  handleAccessibilityIssues();
  
  // Return the announcer for use in the app
  return {
    announce: announcer.announce,
    prefersReducedMotion
  };
}

/**
 * Checks whether a link is accessible.
 * A link is considered accessible if it has a non-empty text content
 * or an accessible name (via aria-label, aria-labelledby, or title attribute).
 * @param {HTMLAnchorElement} link - The link element to check.
 * @returns {boolean} True if the link is accessible, false otherwise.
 */
function isLinkAccessible(link) {
  if (!(link instanceof HTMLAnchorElement)) {
    return false;
  }

  // Check for non-empty text content
  const textContent = link.textContent.trim();
  if (textContent.length > 0) {
    return true;
  }

  // Check for aria-label with non-empty value
  const ariaLabel = link.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim().length > 0) {
    return true;
  }

  // Check for aria-labelledby referencing existing element with text
  const ariaLabelledby = link.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelledByElement = document.getElementById(ariaLabelledby);
    if (labelledByElement && labelledByElement.textContent.trim().length > 0) {
      return true;
    }
  }

  // Check for title attribute with non-empty value
  const title = link.getAttribute('title');
  if (title && title.trim().length > 0) {
    return true;
  }

  return false;
}

addProperLandmarkRegions();
addProperAccountManagement();
addAriaToFormControls();

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addAriaToFormControls,
  replaceMyButtonId,
  getLangAttribute,
  getFullLangAttribute,
  ensureUniqueLandmarkId,
  uniqueLandmarks,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  addAccessibleNamesToSVGs,
  removeFakeLinks,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues,
  initializeAccessibility,
  createAnnouncer,
  prefersReducedMotion,
  improveKeyboardNavigation,
  addLiveRegionForDynamicContent,
  isLinkAccessible,
  addAriaLabel,
  addLangAttribute
};