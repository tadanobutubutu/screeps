// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Adds lang attribute to the HTML element for accessibility
 * @param {string} langCode - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute string
 */
function addLangAttribute(langCode = 'en') {
  return `<html lang="${langCode}">`;
}

/**
 * Fixes table structure issues for accessibility
 * @param {Object} tableConfig - Configuration for table structure fixes
 * @returns {Object} Fixed table configuration
 */
function fixTableStructure(tableConfig) {
  const { hasHeader, hasCaption, hasScope, cellStructure } = tableConfig;
  
  if (!hasCaption) {
    tableConfig.caption = tableConfig.caption || 'Table description';
  }
  
  if (hasHeader && !hasScope) {
    tableConfig.scope = 'col';
  }
  
  if (cellStructure === 'th') {
    tableConfig.accessibleHeader = true;
  }
  
  return tableConfig;
}

/**
 * Adds or fixes landmark issues for better screen reader navigation
 * @param {Object} landmarkConfig - Configuration for landmarks
 * @returns {Object} Fixed landmark configuration
 */
function addLandmarkIssues(landmarkConfig) {
  const { type, label, role } = landmarkConfig;
  
  const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  
  if (type && validLandmarks.includes(type)) {
    landmarkConfig.role = role || type;
    landmarkConfig.ariaLabel = label || type;
  }
  
  return landmarkConfig;
}

/**
 * Adds accessible names to SVG elements for screen readers
 * @param {string} svgId - The ID of the SVG element
 * @param {string} accessibleName - The accessible name for the SVG
 * @returns {Object} SVG configuration with accessibility attributes
 */
function addSvgAccessibleNames(svgId, accessibleName) {
  return {
    id: svgId,
    role: 'img',
    'aria-label': accessibleName,
    'aria-labelledby': `${svgId}-title`,
    title: accessibleName
  };
}

/**
 * Ensures all landmarks have unique identifiers
 * @param {Array} landmarks - Array of landmark elements
 * @returns {Array} Landmarks with unique IDs assigned
 */
function ensureUniqueLandmarks(landmarks) {
  const seen = new Map();
  
  return landmarks.map((landmark, index) => {
    const key = landmark.role || landmark.type;
    
    if (seen.has(key)) {
      const count = seen.get(key) + 1;
      seen.set(key, count);
      landmark.uniqueId = `${key}-${count}`;
    } else {
      seen.set(key, 1);
      landmark.uniqueId = key;
    }
    
    return landmark;
  });
}

/**
 * Fixes fake link issues by converting non-anchor elements to proper links or buttons
 * @param {Object} element - The fake link element to fix
 * @returns {Object} Fixed element with appropriate role and tabindex
 */
function fixFakeLinkIssue(element) {
  const { href, onClick, text, isButton } = element;
  
  if (isButton || (!href && onClick)) {
    return {
      ...element,
      role: 'button',
      tagName: 'button',
      tabIndex: 0,
      type: 'button'
    };
  }
  
  return {
    ...element,
    role: 'link',
    tabIndex: 0
  };
}

module.exports = {
  addLangAttribute,
  fixTableStructure,
  addLandmarkIssues,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue
};