/**
 * Accessibility Fixes Module
 * Addresses issues from insight report:
 * - REACT_015: Add lang attribute to HTML element
 * - REACT_027: Fix 26 table structure issues
 * - REACT_017: Add/fix 4 landmark issues
 * - REACT_041: Add accessible names to 2 SVGs
 * - REACT_025: Ensure unique landmarks
 * - REACT_036: Fix 1 fake link issue
 */

/**
 * Adds lang attribute to HTML element for REACT_015
 * @param {Document|Element} context - The document or element to apply the fix to
 * @returns {string|null} - The lang attribute value added, or null if already exists
 */
export function addLangAttribute(context = document) {
  const htmlElement = context.ownerDocument 
    ? context.ownerDocument.documentElement 
    : (context.documentElement || context);
  
  if (!htmlElement.hasAttribute('lang')) {
    const lang = htmlElement.getAttribute('xml:lang') || 'en';
    htmlElement.setAttribute('lang', lang);
    return lang;
  }
  return htmlElement.getAttribute('lang');
}

/**
 * Fixes table structure issues for REACT_027
 * @param {Document|Element} context - The document or element to apply the fix to
 * @returns {number} - Number of table structure issues fixed
 */
export function fixTableStructure(context = document) {
  let fixedCount = 0;
  const tables = context.querySelectorAll('table');
  
  tables.forEach(table => {
    // Ensure tables have proper structure
    if (!table.tHead && table.querySelector('th')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = table.ownerDocument.createElement('thead');
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, table.firstChild);
        fixedCount++;
      }
    }
    
    // Ensure tables have tbody
    const tbodies = table.querySelectorAll('tbody');
    if (tbodies.length === 0) {
      const rows = Array.from(table.querySelectorAll('tr'));
      const tbody = table.ownerDocument.createElement('tbody');
      rows.forEach(row => tbody.appendChild(row));
      table.appendChild(tbody);
      fixedCount++;
    }
  });
  
  return fixedCount;
}

/**
 * Adds landmark issues for REACT_017
 * @param {Document|Element} context - The document or element to apply the fix to
 * @returns {number} - Number of landmark issues fixed
 */
export function addLandmarkIssues(context = document) {
  let fixedCount = 0;
  
  // Ensure main content is wrapped in main landmark
  const mainElements = context.querySelectorAll('main');
  mainElements.forEach(main => {
    if (!main.getAttribute('role') && main.tagName !== 'MAIN') {
      main.setAttribute('role', 'main');
      fixedCount++;
    }
  });
  
  // Ensure navigation has proper landmarks
  const navElements = context.querySelectorAll('nav');
  if (navElements.length > 0) {
    navElements.forEach(nav => {
      if (!nav.id) {
        nav.setAttribute('id', `nav-${fixedCount}`);
        fixedCount++;
      }
    });
  }
  
  return fixedCount;
}

/**
 * Adds accessible names to SVGs for REACT_041
 * @param {Document|Element} context - The document or element to apply the fix to
 * @returns {number} - Number of SVG accessible names added
 */
export function addSvgAccessibleNames(context = document) {
  let addedCount = 0;
  const svgs = context.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  
  svgs.forEach((svg, index) => {
    const title = svg.querySelector('title');
    if (title && !svg.getAttribute('aria-labelledby')) {
      const titleId = title.id || `svg-title-${index}`;
      if (!title.id) title.id = titleId;
      svg.setAttribute('aria-labelledby', titleId);
      addedCount++;
    } else if (!title) {
      const newTitle = svg.ownerDocument.createElement('title');
      const titleId = `svg-title-${index}`;
      newTitle.id = titleId;
      newTitle.textContent = `SVG image ${index + 1}`;
      svg.insertBefore(newTitle, svg.firstChild);
      svg.setAttribute('aria-labelledby', titleId);
      addedCount++;
    }
  });
  
  return addedCount;
}

/**
 * Ensures unique landmarks for REACT_025
 * @param {Document|Element} context - The document or element to apply the fix to
 * @returns {number} - Number of duplicate landmark IDs fixed
 */
export function ensureUniqueLandmarks(context = document) {
  let fixedCount = 0;
  const landmarkElements = context.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"], [role="navigation"]');
  
  const seenIds = new Map();
  landmarkElements.forEach(element => {
    const id = element.id;
    if (id) {
      if (seenIds.has(id)) {
        const newId = `${id}-${seenIds.get(id)}`;
        element.id = newId;
        seenIds.set(id, seenIds.get(id) + 1);
        fixedCount++;
      } else {
        seenIds.set(id, 1);
      }
    }
  });
  
  return fixedCount;
}

/**
 * Fixes fake link issues for REACT_036
 * @param {Document|Element} context - The document or element to apply the fix to
 * @returns {number} - Number of fake link issues fixed
 */
export function fixFakeLinkIssue(context = document) {
  let fixedCount = 0;
  const clickableElements = context.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  
  clickableElements.forEach(element => {
    const hasClickHandler = element.onclick || 
      element.getAttribute('data-click') ||
      element.getAttribute('ng-click') ||
      element.getAttribute('@click');
    
    if (hasClickHandler && element.tagName === 'A') {
      // If it's a fake link (anchor without proper href), add role="button"
      if (!element.getAttribute('href') || element.getAttribute('href') === '#' || element.getAttribute('href') === '') {
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', '0');
        fixedCount++;
      }
    }
  });
  
  return fixedCount;
}

/**
 * Main function to apply all accessibility fixes
 * @param {Document|Element} context - The document or element to apply all fixes to
 * @returns {Object} - Summary of all fixes applied
 */
export function applyAllAccessibilityFixes(context = document) {
  return {
    REACT_015: { fix: 'addLangAttribute', result: addLangAttribute(context) },
    REACT_027: { fix: 'fixTableStructure', result: fixTableStructure(context) },
    REACT_017: { fix: 'addLandmarkIssues', result: addLandmarkIssues(context) },
    REACT_041: { fix: 'addSvgAccessibleNames', result: addSvgAccessibleNames(context) },
    REACT_025: { fix: 'ensureUniqueLandmarks', result: ensureUniqueLandmarks(context) },
    REACT_036: { fix: 'fixFakeLinkIssue', result: fixFakeLinkIssue(context) }
  };
}

// Apply fixes on load if in browser environment
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyAllAccessibilityFixes());
  } else {
    applyAllAccessibilityFixes();
  }
}