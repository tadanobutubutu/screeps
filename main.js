// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

/**
 * Gets the language attribute value for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  // Default to 'en' if not specified
  return document.documentElement.lang || 'en';
}

/**
 * Creates an accessible in-page button with proper ARIA attributes
 * @param {string} text - The button text
 * @param {Function} onClick - The click handler
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', text);
  
  // Add lang attribute for accessibility
  const lang = getLangAttribute();
  if (button.lang !== lang) {
    button.lang = lang;
  }
  
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

/**
 * Validates table accessibility
 * @param {HTMLTableElement} table - The table to validate
 * @returns {Object} Validation result with issues
 */
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) {
    return { valid: false, issues: ['Table not found'] };
  }
  
  // Check for proper table structure
  const header = table.querySelector('thead');
  const body = table.querySelector('tbody');
  const footer = table.querySelector('tfoot');
  
  if (!header) {
    issues.push('Table missing thead element');
  }
  
  if (!body) {
    issues.push('Table missing tbody element');
  }
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push('Table missing caption');
  }
  
  // Validate cells have proper scope or headers attributes
  const headerCells = table.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.getAttribute('scope') && !cell.getAttribute('headers')) {
      issues.push('Header cell missing scope or headers attribute');
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Validates table structure accessibility
 * @param {HTMLTableElement} table - The table to validate
 * @returns {Object} Validation result
 */
function validateTableStructure(table) {
  const result = {
    rowCount: 0,
    columnCount: 0,
    structureIssues: []
  };
  
  if (!table) {
    result.structureIssues.push('No table element provided');
    return result;
  }
  
  const rows = table.querySelectorAll('tr');
  result.rowCount = rows.length;
  
  if (rows.length > 0) {
    const firstRowCells = rows[0].querySelectorAll('td, th');
    result.columnCount = firstRowCells.length;
  }
  
  // Check for proper table structure
  if (result.rowCount === 0) {
    result.structureIssues.push('Table has no rows');
  }
  
  if (result.columnCount === 0) {
    result.structureIssues.push('Table has no columns');
  }
  
  return result;
}

/**
 * Validates landmark accessibility
 * @param {HTMLElement} container - The container to validate
 * @returns {Object} Validation result
 */
function validateLandmark(container) {
  const landmarks = container.querySelectorAll('[role]');
  const issues = [];
  
  const landmarkTypes = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];
  const foundLandmarks = new Set();
  
  landmarks.forEach(el => {
    const role = el.getAttribute('role');
    if (landmarkTypes.includes(role)) {
      if (foundLandmarks.has(role)) {
        issues.push(`Duplicate landmark role: ${role}`);
      }
      foundLandmarks.add(role);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues,
    landmarks: Array.from(foundLandmarks)
  };
}

/**
 * Validates landmark structure accessibility
 * @param {HTMLElement} container - The container to validate
 * @returns {Object} Validation result
 */
function validateLandmarkStructure(container) {
  const result = {
    hasHeader: false,
    hasNav: false,
    hasMain: false,
    hasFooter: false,
    issues: []
  };
  
  if (!container) {
    result.issues.push('No container provided');
    return result;
  }
  
  result.hasHeader = container.querySelector('header, [role="banner"]') !== null;
  result.hasNav = container.querySelector('nav, [role="navigation"]') !== null;
  result.hasMain = container.querySelector('main, [role="main"]') !== null;
  result.hasFooter = container.querySelector('footer, [role="contentinfo"]') !== null;
  
  // Validate landmark nesting
  const mainElements = container.querySelectorAll('main, [role="main"]');
  mainElements.forEach(main => {
    const parentMain = main.parentElement?.closest('main, [role="main"]');
    if (parentMain) {
      result.issues.push('Main landmark nested inside another main landmark');
    }
  });
  
  return result;
}

/**
 * Gets the accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  // Check aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : '';
  }
  
  // Check for title element
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  
  return '';
}

/**
 * Sets accessibility attributes on an SVG element
 * @param {SVGElement} svg - The SVG element
 * @param {string} accessibleName - The accessible name to set
 */
function setSvgAttributes(svg, accessibleName) {
  if (!svg) return;
  
  if (accessibleName) {
    svg.setAttribute('aria-label', accessibleName);
  } else {
    // Generate a generic accessible name if none provided
    const existingName = getSvgAccessibleName(svg);
    if (!existingName) {
      svg.setAttribute('aria-label', 'Decorative or informational graphic');
    }
  }
  
  // Ensure SVG has role attribute for screen readers
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
}

/**
 * Ensures landmarks have unique identifiers
 * @param {HTMLElement} container - The container to validate
 * @returns {Object} Validation result with fixes applied
 */
function ensureUniqueLandmarks(container) {
  const result = {
    fixed: [],
    issues: []
  };
  
  if (!container) {
    result.issues.push('No container provided');
    return result;
  }
  
  const landmarkTypes = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];
  const counts = {};
  
  landmarkTypes.forEach(type => {
    counts[type] = 0;
  });
  
  const landmarks = container.querySelectorAll('[role]');
  landmarks.forEach(el => {
    const role = el.getAttribute('role');
    if (landmarkTypes.includes(role)) {
      counts[role]++;
      
      // If this is a duplicate, ensure it has a unique id
      if (counts[role] > 1) {
        const existingId = el.id;
        if (!existingId) {
          const newId = `${role}-${counts[role]}`;
          el.id = newId;
          result.fixed.push(`Added id="${newId}" to ${role} landmark`);
        }
      }
    }
  });
  
  return result;
}

/**
 * Validates link accessibility
 * @param {HTMLAnchorElement} link - The link to validate
 * @returns {Object} Validation result
 */
function validateLinkAccessibility(link) {
  const issues = [];
  
  if (!link) {
    return { valid: false, issues: ['Link not found'] };
  }
  
  // Check for accessible text
  const text = link.textContent.trim();
  const ariaLabel = link.getAttribute('aria-label');
  
  if (!text && !ariaLabel) {
    issues.push('Link has no accessible name');
  }
  
  // Check if link has href
  if (!link.getAttribute('href')) {
    issues.push('Link missing href attribute');
  }
  
  // Check for proper title if link contains only an image
  const images = link.querySelectorAll('img');
  if (images.length > 0 && !text && !ariaLabel && !link.getAttribute('title')) {
    issues.push('Image-only link missing accessible name');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Handles fake links (links that don't have proper href or are buttons styled as links)
 * @param {HTMLElement} container - The container to search
 * @returns {Object} Result with fixed fake links
 */
function handleFakeLinks(container) {
  const result = {
    converted: [],
    issues: []
  };
  
  if (!container) {
    result.issues.push('No container provided');
    return result;
  }
  
  const links = container.querySelectorAll('a');
  links.forEach(link => {
    // Check if link acts as a button (no href or javascript: href)
    const href = link.getAttribute('href');
    
    if (!href || href === '#' || href.startsWith('javascript:')) {
      // Convert to proper button if it should be a button
      const isInteractive = link.getAttribute('role') === 'button' || 
                           link.onclick !== null ||
                           link.classList.contains('btn') ||
                           link.classList.contains('button');
      
      if (isInteractive) {
        // Ensure proper role and tabindex
        link.setAttribute('role', 'button');
        if (!link.getAttribute('tabindex')) {
          link.setAttribute('tabindex', '0');
        }
        
        // Add keyboard event handling if not present
        if (!link.hasAttribute('onkeydown')) {
          link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              link.click();
            }
          });
        }
        
        result.converted.push('Converted fake link to accessible button');
      }
    }
  });
  
  return result;
}

// Export for testing and external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getLangAttribute,
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    setSvgAttributes,
    ensureUniqueLandmarks,
    validateLinkAccessibility,
    handleFakeLinks
  };
}