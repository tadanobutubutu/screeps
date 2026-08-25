// TODO: Address accessibility issues from insight report: add ARIA attributes

/**
 * Accessibility utility functions to address insight report findings
 * Addressing: REACT_015, REACT_017, REACT_025, REACT_027, REACT_036, REACT_041
 */

/**
 * Set the language attribute on the HTML element
 * Addresses: REACT_015 React Language Attribute
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 */
export function setLanguageAttribute(lang = 'en') {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
}

/**
 * Generate proper ARIA landmark attributes for main content
 * Addresses: REACT_017 React Landmarks, REACT_025 React Unique Landmarks
 * @param {Object} options - Landmark options
 * @returns {Object} ARIA attributes for the landmark
 */
export function getMainLandmarkAttributes(options = {}) {
  return {
    role: 'main',
    'aria-label': options.label || 'Main content',
    id: options.id || 'main-content',
  };
}

/**
 * Generate navigation landmark attributes
 * Addresses: REACT_017 React Landmarks, REACT_025 React Unique Landmarks
 * @param {Object} options - Navigation options
 * @returns {Object} ARIA attributes for navigation
 */
export function getNavigationAttributes(options = {}) {
  return {
    role: 'navigation',
    'aria-label': options.label || 'Main navigation',
    id: options.id || `nav-${options.label?.toLowerCase().replace(/\s+/g, '-') || 'main'}`,
  };
}

/**
 * Generate proper table attributes ensuring semantic structure
 * Addresses: REACT_027 React Table Structure
 * @param {Object} options - Table options
 * @returns {Object} ARIA attributes for table
 */
export function getTableAttributes(options = {}) {
  return {
    role: 'table',
    ...(options.caption && { 'aria_caption': options.caption }),
  };
}

/**
 * Generate header cell attributes with proper scope
 * Addresses: REACT_027 React Table Structure
 * @param {Object} options - Header options
 * @returns {Object} ARIA attributes for th element
 */
export function getTableHeaderAttributes(options = {}) {
  return {
    scope: options.scope || 'col',
    id: options.id,
    'aria-sort': options.sortable ? (options.sortDirection || 'none') : undefined,
  };
}

/**
 * Generate data cell attributes with proper headers reference
 * Addresses: REACT_027 React Table Structure
 * @param {string[]} headerIds - Array of header IDs this cell relates to
 * @returns {Object} ARIA attributes for td element
 */
export function getTableCellAttributes(headerIds = []) {
  return {
    headers: headerIds.length > 0 ? headerIds.join(' ') : undefined,
  };
}

/**
 * Generate accessible SVG attributes
 * Addresses: REACT_041 React SVG Accessible Name
 * @param {Object} options - SVG accessibility options
 * @returns {Object} ARIA attributes for SVG
 */
export function getSvgAttributes(options = {}) {
  return {
    role: 'img',
    'aria-label': options.label || undefined,
    'aria-hidden': options.label ? undefined : true,
  };
}

/**
 * Determine if an element should be a link or button
 * Addresses: REACT_036 React Fake Link
 * @param {Object} options - Element options
 * @returns {string} - 'link' if should navigate, 'button' if triggers action
 */
export function getSemanticLinkType(options = {}) {
  const { href, onClick, action = 'navigate' } = options;
  
  if (href && !onClick) {
    return 'link';
  }
  if (onClick || action === 'action') {
    return 'button';
  }
  if (href && onClick) {
    console.warn('Element has both href and onClick. Use href for navigation, onClick only for JavaScript enhancements.');
    return 'link';
  }
  return 'button';
}

/**
 * Get proper attributes for a semantic link/button element
 * Addresses: REACT_036 React Fake Link
 * @param {Object} options - Link/button options
 * @returns {Object} - Proper attributes based on semantic type
 */
export function getSemanticLinkAttributes(options = {}) {
  const type = getSemanticLinkType(options);
  
  if (type === 'link') {
    return {
      href: options.href,
      target: options.external ? '_blank' : undefined,
      rel: options.external ? 'noopener noreferrer' : undefined,
    };
  }
  
  return {
    type: 'button',
    onClick: options.onClick,
    disabled: options.disabled,
    'aria-disabled': options.disabled || undefined,
  };
}

/**
 * Generate complementary landmark attributes for sidebars/asides
 * Addresses: REACT_017 React Landmarks, REACT_025 React Unique Landmarks
 * @param {Object} options - Aside options
 * @returns {Object} ARIA attributes for aside element
 */
export function getAsideAttributes(options = {}) {
  return {
    role: 'complementary',
    'aria-label': options.label || 'Complementary content',
    id: options.id || `aside-${options.label?.toLowerCase().replace(/\s+/g, '-') || 'sidebar'}`,
  };
}

/**
 * Generate banner/header landmark attributes
 * Addresses: REACT_017 React Landmarks, REACT_025 React Unique Landmarks
 * @param {Object} options - Header options
 * @returns {Object} ARIA attributes for header element
 */
export function getBannerAttributes(options = {}) {
  return {
    role: 'banner',
    id: options.id || 'site-header',
  };
}

/**
 * Generate contentinfo/footer landmark attributes
 * Addresses: REACT_017 React Landmarks, REACT_025 React Unique Landmarks
 * @param {Object} options - Footer options
 * @returns {Object} ARIA attributes for footer element
 */
export function getContentInfoAttributes(options = {}) {
  return {
    role: 'contentinfo',
    id: options.id || 'site-footer',
  };
}

/**
 * Generate search landmark attributes
 * Addresses: REACT_017 React Landmarks, REACT_025 React Unique Landmarks
 * @param {Object} options - Search options
 * @returns {Object} ARIA attributes for search element
 */
export function getSearchAttributes(options = {}) {
  return {
    role: 'search',
    'aria-label': options.label || 'Search',
    id: options.id || 'search-region',
  };
}

/**
 * Validate landmark uniqueness and return unique ID
 * Addresses: REACT_025 React Unique Landmarks
 * @param {string} role - The landmark role
 * @param {string} customId - Optional custom ID
 * @returns {string} - Unique ID for the landmark
 */
export function getUniqueLandmarkId(role, customId) {
  if (customId) {
    return customId;
  }
  const timestamp = Date.now();
  return `${role}-${timestamp}`;
}

/**
 * Ensure proper table caption element
 * Addresses: REACT_027 React Table Structure
 * @param {string} captionText - The caption text
 * @param {Object} options - Additional options
 * @returns {Object} - Props for caption element
 */
export function getTableCaptionAttributes(captionText, options = {}) {
  return {
    children: captionText,
    id: options.id,
  };
}