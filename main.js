/**
 * Main JavaScript module for landmark element validation
 * @module main
 */

/**
 * Configuration for landmark checks
 */
const config = {
  requiredLandmarks: ['main', 'header', 'footer'],
  optionalLandmarks: ['nav', 'aside', 'section'],
  skipElements: ['script', 'style', 'meta', 'link']
};

/**
 * Checks if an element is a landmark element
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - True if the element is a landmark
 */
function isLandmark(element) {
  // TODO: Implement this function for checking landmark elements
  const landmarkTags = ['header', 'main', 'nav', 'aside', 'section', 'article', 'footer'];
  return landmarkTags.includes(element.tagName.toLowerCase());
}

/**
 * Validates landmark elements in a document
 * @param {Document} doc - The document to validate
 * @returns {Object} - Validation results
 */
function validateLandmarks(doc) {
  const results = {
    valid: true,
    landmarks: [],
    errors: []
  };

  if (!doc || !doc.body) {
    results.valid = false;
    results.errors.push('Document body not found');
    return results;
  }

  const landmarks = doc.body.querySelectorAll('header, main, nav, aside, section, article, footer');
  
  landmarks.forEach(landmark => {
    results.landmarks.push({
      tag: landmark.tagName.toLowerCase(),
      id: landmark.id || null,
      className: landmark.className || null
    });
  });

  const hasMain = results.landmarks.some(l => l.tag === 'main');
  if (!hasMain) {
    results.valid = false;
    results.errors.push('Document must contain at least one <main> landmark');
  }

  return results;
}

/**
 * Gets all landmark elements from a container
 * @param {HTMLElement} container - The container element
 * @returns {HTMLElement[]} - Array of landmark elements
 */
function getLandmarkElements(container) {
  if (!container) return [];
  
  const landmarkElements = [];
  const selector = 'header, main, nav, aside, section, article, footer';
  const elements = container.querySelectorAll(selector);
  
  elements.forEach(el => {
    if (isLandmark(el)) {
      landmarkElements.push(el);
    }
  });

  return landmarkElements;
}

module.exports = {
  config,
  isLandmark,
  validateLandmarks,
  getLandmarkElements
};