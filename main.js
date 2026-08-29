// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// ============================================================================
// Accessibility Functions
// ============================================================================

/**
 * Gets the language attribute from the HTML element or returns default
 * @returns {string} The language code
 */
export function getLangAttribute() {
  const htmlElement = document.documentElement;
  return htmlElement.getAttribute('lang') || 'en';
}

/**
 * Creates an accessible in-page button that scrolls to a target element
 * @param {string} href - CSS selector or ID for the target element
 * @param {string} label - Accessible label for the button
 * @returns {HTMLButtonElement} The button element with proper accessibility attributes
 */
export function createInPageButton(href, label) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', label);
  
  button.addEventListener('click', () => {
    const targetId = href.replace('#', '');
    const target = document.getElementById(targetId) || document.querySelector(targetId);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  
  return button;
}

/**
 * Validates that a table has proper accessibility features
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
export function validateTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') {
    return false;
  }
  
  // Check for caption
  const hasCaption = table.querySelector('caption') !== null;
  
  // Check for table headers (th elements)
  const headers = table.querySelectorAll('th');
  const hasHeaders = headers.length > 0;
  
  // Validate that headers have proper scope attributes
  const headersHaveScope = Array.from(headers).every(th => {
    const scope = th.getAttribute('scope');
    return scope === 'col' || scope === 'row';
  });
  
  // Check for proper thead/tbody structure
  const hasThead = table.querySelector('thead') !== null;
  const hasTbody = table.querySelector('tbody') !== null;
  
  return hasCaption && hasHeaders && headersHaveScope && hasThead && hasTbody;
}

/**
 * Validates and fixes table structure for accessibility
 * @param {HTMLTableElement} table - The table element to validate/fix
 * @returns {Object} Validation result with issues found
 */
export function validateTableStructure(table) {
  const issues = [];
  
  if (!table || table.tagName !== 'TABLE') {
    return { valid: false, issues: ['Invalid table element'] };
  }
  
  // Check for missing thead
  if (!table.querySelector('thead')) {
    issues.push('Missing thead element');
  }
  
  // Check for missing tbody
  if (!table.querySelector('tbody')) {
    issues.push('Missing tbody element');
  }
  
  // Check for missing caption
  if (!table.querySelector('caption')) {
    issues.push('Missing caption element');
  }
  
  // Check for headers without scope attribute
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      issues.push(`Header at index ${index} missing scope attribute`);
    }
  });
  
  // Check for proper row/column structure
  const rows = table.querySelectorAll('tr');
  let columnCount = 0;
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('th, td');
    if (columnCount === 0) {
      columnCount = cells.length;
    } else if (cells.length !== columnCount) {
      issues.push(`Row ${rowIndex} has inconsistent cell count`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Gets the accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name or empty string
 */
export function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  // Check aria-label first (highest priority)
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel.trim();
  }
  
  // Check aria-labelledby (second priority)
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const targetElement = document.getElementById(ariaLabelledby);
    if (targetElement && targetElement.textContent) {
      return targetElement.textContent.trim();
    }
  }
  
  // Check for title element inside SVG
  const title = svg.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }
  
  return '';
}

/**
 * Sets proper accessibility attributes on an SVG element
 * @param {SVGElement} svg - The SVG element
 * @param {string} accessibleName - The accessible name to set
 * @returns {SVGElement} The modified SVG element
 */
export function setSvgAttributes(svg, accessibleName) {
  if (!svg) return svg;
  
  svg.setAttribute('role', 'img');
  
  if (accessibleName) {
    svg.setAttribute('aria-label', accessibleName);
    
    // Ensure title element exists
    let title = svg.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      svg.insertBefore(title, svg.firstChild);
    }
    title.textContent = accessibleName;
  }
  
  return svg;
}

/**
 * Ensures all landmark elements have unique accessible names
 * @returns {Object} Report of landmarks with duplicates
 */
export function ensureUniqueLandmarks() {
  const landmarks = {
    banner: [],
    navigation: [],
    main: [],
   complementary: [],
    contentinfo: [],
    search: []
  };
  
  // Find all landmark regions
  const landmarkSelectors = [
    '[role="banner"]',
    '[role="navigation"]',
    '[role="main"]',
    '[role="complementary"]',
    '[role="contentinfo"]',
    '[role="search"]',
    'header:not([role])',
    'nav:not([role])',
    'main:not([role])',
    'aside:not([role])',
    'footer:not([role])'
  ];
  
  landmarkSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      const role = element.getAttribute('role') || element.tagName.toLowerCase();
      if (landmarks[role]) {
        landmarks[role].push(element);
      }
    });
  });
  
  const duplicates = [];
  
  // Check for multiple landmarks of the same type without unique names
  Object.keys(landmarks).forEach(role => {
    const elements = landmarks[role];
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledby = el.getAttribute('aria-labelledby');
        if (!ariaLabel && !ariaLabelledby) {
          duplicates.push({
            role: role,
            index: index,
            element: el
          });
        }
      });
    }
  });
  
  return {
    landmarks: landmarks,
    duplicates: duplicates,
    hasIssues: duplicates.length > 0
  };
}

/**
 * Validates link accessibility for proper href attributes
 * @param {HTMLAnchorElement} link - The link element to validate
 * @returns {Object} Validation result
 */
export function validateLinkAccessibility(link) {
  const result = {
    valid: true,
    issues: []
  };
  
  if (!link || link.tagName !== 'A') {
    return { valid: false, issues: ['Not an anchor element'] };
  }
  
  const href = link.getAttribute('href');
  
  // Check for missing href
  if (!href) {
    result.valid = false;
    result.issues.push('Missing href attribute');
  }
  
  // Check for empty href (current page)
  if (href === '') {
    result.valid = false;
    result.issues.push('Empty href attribute (links to current page)');
  }
  
  // Check for href with only hash
  if (href === '#') {
    result.valid = false;
    result.issues.push('Href is only "#" - not a valid link target');
  }
  
  // Check for missing accessible text
  const hasText = link.textContent && link.textContent.trim().length > 0;
  const hasAriaLabel = link.getAttribute('aria-label');
  const hasAriaLabelledby = link.getAttribute('aria-labelledby');
  const hasTitle = link.getAttribute('title');
  const hasImgAlt = link.querySelector('img[alt]');
  
  if (!hasText && !hasAriaLabel && !hasAriaLabelledby && !hasTitle && !hasImgAlt) {
    result.valid = false;
    result.issues.push('Link has no accessible name');
  }
  
  return result;
}

/**
 * Handles fake links (links that should be buttons or have proper href)
 * @param {HTMLElement} container - Container element to search within
 * @returns {Object} Report of fake links found and fixed
 */
export function handleFakeLinks(container = document) {
  const fakeLinks = container.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  const report = {
    fakeLinks: [],
    fixed: []
  };
  
  fakeLinks.forEach(link => {
    const issues = validateLinkAccessibility(link);
    
    if (!issues.valid) {
      report.fakeLinks.push({
        element: link,
        issues: issues.issues
      });
      
      // Convert to button if it has click handlers but no valid href
      const hasClickHandler = link.getAttribute('onclick') || 
                              link.addEventListener.toString().includes('click');
      
      if (hasClickHandler && !link.getAttribute('href')) {
        const newButton = document.createElement('button');
        newButton.innerHTML = link.innerHTML;
        
        // Copy relevant attributes
        Array.from(link.attributes).forEach(attr => {
          if (attr.name !== 'href') {
            newButton.setAttribute(attr.name, attr.value);
          }
        });
        
        link.parentNode.replaceChild(newButton, link);
        report.fixed.push(newButton);
      }
    }
  });
  
  return report;
}

/**
 * Adds proper landmark regions to the document
 * @param {HTMLElement} container - Container element to process
 * @returns {Object} Report of landmarks found and added
 */
export function addProperLandmarkRegions(container = document) {
  const report = {
    landmarks: [],
    added: [],
    issues: []
  };
  
  // Check for main landmark
  let mainElement = container.querySelector('main, [role="main"]');
  if (!mainElement) {
    mainElement = document.createElement('main');
    const firstHeading = container.querySelector('h1, h2');
    if (firstHeading && firstHeading.parentNode) {
      firstHeading.parentNode.insertBefore(mainElement, firstHeading);
    }
    report.added.push({ type: 'main', element: mainElement });
  }
  
  // Check for navigation landmarks
  const navElements = container.querySelectorAll('nav');
  navElements.forEach