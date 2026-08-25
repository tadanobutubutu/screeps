// TODO: Address accessibility issues from insight report:
// Placeholder for accessibility-related code changes

/**
 * Check if the user prefers reduced motion
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Apply accessibility attributes to interactive elements
 */
function applyAccessibilityAttributes() {
  const interactiveElements = document.querySelectorAll('a, input, select, textarea');
  
  interactiveElements.forEach(element => {
    if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
      console.warn('Interactive element missing accessible label:', element);
    }
  });
}

/**
 * Handle keyboard navigation focus management
 */
function handleKeyboardNavigation() {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
}

/**
 * Announce dynamic content changes to screen readers
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1);
}

/**
 * Ensure SVG elements have accessible names
 * @param {SVGElement} svg - The SVG element to enhance
 * @param {string} description - Accessible description for the SVG
 */
function ensureSVGAccessibleName(svg, description) {
  if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
    const title = document.createElement('title');
    title.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
    title.textContent = description;
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-labelledby', title.id);
    svg.insertBefore(title, svg.firstChild);
  }
}

/**
 * Validate and fix landmark uniqueness
 * @param {Document} doc - The document to check (defaults to window.document)
 */
function validateLandmarks(doc = document) {
  const landmarks = doc.querySelectorAll('header, nav, main, footer, aside, [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
  const seenTypes = new Map();
  
  landmarks.forEach(landmark => {
    const tag = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || '';
    const key = role || tag;
    
    if (seenTypes.has(key)) {
      console.warn(`Duplicate landmark found: ${key}. Consider using unique identifiers or limiting to one per page.`);
    } else {
      seenTypes.set(key, landmark);
    }
  });
  
  return Array.from(seenTypes.keys());
}

/**
 * Detect fake links that should be buttons
 * @param {Document} doc - The document to check (defaults to window.document)
 * @returns {NodeList} Elements that may be fake links
 */
function detectFakeLinks(doc = document) {
  return doc.querySelectorAll('a[href="#"], a[href="javascript:void(0)"], a[href=""]');
}

/**
 * Get proper language attribute value from html element
 * @param {Document} doc - The document to check (defaults to window.document)
 * @returns {string|null} The language code
 */
function getDocumentLanguage(doc = document) {
  const html = doc.documentElement;
  return html.getAttribute('lang') || html.getAttribute('xml:lang');
}

/**
 * Validate table structure for accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {object} Validation result with issues array
 */
function validateTableStructure(table) {
  const issues = [];
  const headers = table.querySelectorAll('th');
  const cells = table.querySelectorAll('td, th');
  
  const hasScope = Array.from(headers).some(th => th.hasAttribute('scope'));
  const hasHeaders = Array.from(cells).some(cell => cell.hasAttribute('headers'));
  
  if (headers.length > 0 && !hasScope && !hasHeaders) {
    issues.push({
      type: 'missing-scope',
      message: 'Table headers should have scope attributes or cells should reference header IDs',
      element: table
    });
  }
  
  if (!table.querySelector('caption') && cells.length > 1) {
    issues.push({
      type: 'missing-caption',
      message: 'Tables with multiple cells should have a caption',
      element: table
    });
  }
  
  return { valid: issues.length === 0, issues };
}

module.exports = {
  prefersReducedMotion,
  applyAccessibilityAttributes,
  handleKeyboardNavigation,
  announceToScreenReader,
  ensureSVGAccessibleName,
  validateLandmarks,
  detectFakeLinks,
  getDocumentLanguage,
  validateTableStructure
};