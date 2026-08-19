function getPendingUpdates() {
  return [
    { package: 'eslint', version: '^10.0.0' },
    { package: 'jest', version: '^30.0.0' },
    { package: 'typescript', version: '^7.0.0' },
    { package: 'react', version: '^19.0.0' },
  ];
}

/**
 * Adds language attribute to React components for screen reader support
 * @param {string} lang - Language code (e.g., 'en', 'es')
 * @returns {Object} - Props object with lang attribute
 */
function addLanguageAttribute(lang = 'en') {
  return { lang };
}

/**
 * Creates accessible table structure with proper ARIA attributes
 * @param {Object} props - Table props
 * @returns {Object} - Enhanced table props with accessibility attributes
 */
function createAccessibleTable(props = {}) {
  return {
    ...props,
    role: 'table',
    'aria-describedby': props['aria-describedby'] || 'table-description'
  };
}

/**
 * Adds landmark roles to page sections for better screen reader navigation
 * @param {string} role - Landmark role (e.g., 'main', 'navigation', 'complementary')
 * @returns {Object} - Props object with landmark role
 */
function addLandmark(role) {
  return { role };
}

/**
 * Creates accessible SVG with proper ARIA attributes
 * @param {Object} props - SVG props
 * @param {string} title - Accessible name for the SVG
 * @returns {Object} - Enhanced SVG props with accessibility attributes
 */
function createAccessibleSVG(props = {}, title) {
  return {
    ...props,
    role: 'img',
    'aria-label': title,
    focusable: false
  };
}

/**
 * Creates unique landmarks for better screen reader navigation
 * @param {string} role - Landmark role
 * @param {string} label - Unique label for the landmark
 * @returns {Object} - Props object with unique landmark attributes
 */
function createUniqueLandmark(role, label) {
  return {
    role,
    'aria-label': label
  };
}

/**
 * Creates accessible fake link that behaves like a button
 * @param {Object} props - Link props
 * @param {Function} onClick - Click handler
 * @returns {Object} - Enhanced link props with accessibility attributes
 */
function createAccessibleFakeLink(props = {}, onClick) {
  return {
    ...props,
    role: 'button',
    tabIndex: 0,
    onClick,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(e);
      }
    }
  };
}

module.exports = {
  getPendingUpdates,
  addLanguageAttribute,
  createAccessibleTable,
  addLandmark,
  createAccessibleSVG,
  createUniqueLandmark,
  createAccessibleFakeLink
};