// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - ADD_FOCUS: Make an HTML element focusable (NEW)
// - REACT_017: Wrap the primary content in <main> so it can be skipped to (NEW)

/**
 * Adds a lang attribute to the HTML element for accessibility
 * @param {Document} document - The document object
 * @param {string} lang - The language code (default: 'en')
 * @returns {HTMLElement} The HTML element with lang attribute
 */
export function addLangAttribute(document, lang = 'en') {
  const html = document.documentElement;
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
  return html;
}

/**
 * Makes an HTML element focusable by adding tabindex if needed
 * @param {HTMLElement} element - The element to make focusable
 * @param {number} tabindexValue - The tabindex value (default: 0)
 * @returns {HTMLElement} The element made focusable
 */
export function makeFocusable(element, tabindexValue = 0) {
  if (!element) {
    return null;
  }
  
  // Elements that are naturally focusable don't need tabindex
  const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
  const isNaturallyFocusable = focusableTags.includes(element.tagName) && !element.disabled;
  
  if (!isNaturallyFocusable && !element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', tabindexValue.toString());
  }
  
  // Ensure element is not display:none or visibility:hidden
  if (getComputedStyle(element).display === 'none' || getComputedStyle(element).visibility === 'hidden') {
    console.warn('Element is not visible and may not be focusable');
  }
  
  return element;
}

/**
 * Wraps primary content in a <main> element so it can be skipped to
 * @param {HTMLElement} container - The container element to wrap
 * @param {Object} options - Configuration options
 * @param {string} options.id - The id for the main element (default: 'main-content')
 * @param {string} options.className - Additional class name for the main element
 * @returns {HTMLElement} The created or existing main element
 */
export function wrapPrimaryContent(container, options = {}) {
  const { id = 'main-content', className = '' } = options;
  
  if (!container) {
    throw new Error('Container element is required');
  }
  
  // Check if main element already exists
  let mainElement = container.querySelector('main');
  
  if (!mainElement) {
    // Create main element
    mainElement = document.createElement('main');
    mainElement.id = id;
    
    if (className) {
      mainElement.className = className;
    }
    
    // Make the main element focusable for skip navigation
    makeFocusable(mainElement, -1);
    
    // Move all children into the main element
    const children = Array.from(container.childNodes);
    children.forEach(child => {
      mainElement.appendChild(child);
    });
    
    // Append main element to container
    container.appendChild(mainElement);
  }
  
  return mainElement;
}

/**
 * Creates a skip link for accessibility to bypass navigation
 * @param {HTMLElement} targetElement - The element to skip to
 * @param {string} linkText - Text content of the skip link
 * @returns {HTMLAnchorElement} The skip link element
 */
export function createSkipLink(targetElement, linkText = 'Skip to main content') {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetElement.id}`;
  skipLink.textContent = linkText;
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #000;
    color: #fff;
    padding: 8px 16px;
    z-index: 10000;
    text-decoration: none;
    transition: top 0.3s ease;
  `;
  
  // Make skip link focusable
  makeFocusable(skipLink);
  
  // Show link when focused
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  
  return skipLink;
}

/**
 * Initializes all accessibility features for the page
 * @param {Object} options - Configuration options
 */
export function initializeAccessibility(options = {}) {
  const {
    lang = 'en',
    wrapContent = true,
    createSkip = true
  } = options;
  
  // Add lang attribute to HTML
  addLangAttribute(document, lang);
  
  // Wrap primary content if requested
  if (wrapContent && document.body) {
    const mainElement = wrapPrimaryContent(document.body);
    
    // Create skip link if requested
    if (createSkip && document.body.firstChild) {
      const skipLink = createSkipLink(mainElement);
      document.body.insertBefore(skipLink, document.body.firstChild);
    }
  }
}

// Default export for convenience
export default {
  addLangAttribute,
  makeFocusable,
  wrapPrimaryContent,
  createSkipLink,
  initializeAccessibility
};