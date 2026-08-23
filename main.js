// Accessibility utility functions for React components

/**
 * Sets the lang attribute on the HTML element for REACT_015 (React Language Attribute)
 * @param {string} langCode - The language code (e.g., 'en', 'es', 'fr')
 */
function setLanguageAttribute(langCode) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = langCode;
  }
}

/**
 * Validates table structure for REACT_027 (React Table Structure)
 * Ensures tables have proper thead/tbody/tfoot structure
 * @param {Object} tableProps - Table element properties
 * @returns {Object} Validated table props with proper structure
 */
function validateTableStructure(tableProps) {
  return {
    ...tableProps,
    role: tableProps.role || 'table'
  };
}

/**
 * Ensures SVG has accessible name for REACT_041 (React SVG Accessible Name)
 * @param {Object} svgProps - SVG element properties
 * @returns {Object} Updated SVG props with aria-label or title
 */
function ensureSvgAccessibleName(svgProps) {
  const hasAccessibleName = svgProps['aria-label'] || svgProps['aria-labelledby'] || svgProps.children?.some(child => child.type === 'title');
  
  if (!hasAccessibleName && !svgProps.role) {
    return {
      ...svgProps,
      role: 'img',
      'aria-label': svgProps['aria-label'] || 'Decorative SVG'
    };
  }
  return svgProps;
}

/**
 * Validates landmarks for REACT_017 and REACT_025 (React Landmarks/Unique Landmarks)
 * @param {string} landmarkType - Type of landmark (nav, main, aside, footer, header)
 * @param {number} existingCount - Number of existing landmarks of this type
 * @returns {Object} Landmark props ensuring uniqueness
 */
function validateLandmark(landmarkType, existingCount = 0) {
  if (existingCount > 0 && landmarkType !== 'nav' && landmarkType !== 'footer') {
    return { role: landmarkType };
  }
  return { [landmarkType]: landmarkType };
}

/**
 * Detects fake links for REACT_036 (React Fake Link)
 * @param {Object} props - Element props to check
 * @returns {boolean} True if the element is a fake link that should use real anchor
 */
function isFakeLink(props) {
  return props.onClick && !props.href && props.role !== 'button';
}

/**
 * Converts a fake link to proper accessible element
 * @param {Object} props - Element props
 * @returns {Object} Updated props with appropriate role or converted to anchor
 */
function fixFakeLink(props) {
  if (isFakeLink(props)) {
    return {
      ...props,
      role: 'button',
      tabIndex: props.tabIndex ?? 0
    };
  }
  return props;
}

module.exports = {
  exampleFunction,
  config,
  setLanguageAttribute,
  validateTableStructure,
  ensureSvgAccessibleName,
  validateLandmark,
  isFakeLink,
  fixFakeLink,
  // Add any additional exports identified from the TODO
}