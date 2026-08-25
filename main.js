/**
 * Adds `aria-labelledby` to elements, if necessary
 * @param {HTMLElement} elem - Element to check aria-labelledby
 * @returns {void}
 */
function addAriaLabelledbyIfNeeded(elem) {
  if (elem) {
    const ids = [];
    const quasiIds = [];

    // Collect defined IDs and quasi-ids from child elements
    const collectIds = (current) => {
      if (!current) {
        return;
      }
      if (current.getAttribute('id')) {
        ids.push(current.getAttribute('id'));
      }
      if (current.hasAttribute('data-quasi-id')) {
        quasiIds.push(current.getAttribute('data-quasi-id'));
      }
      const children = current.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
          collectIds(child);
        }
      }
    };

    collectIds(elem);

    // Compose aria-labelledby from IDs and quasi-ids,
    // if there is at least one child element (avoids empty strings)
    if (ids.length > 0 || quasiIds.length > 0) {
      const ariaLabelbyValue = ids.length > 0 ? ids.join(' ') : quasiIds.join(' ');
      elem.setAttribute('aria-labelledby', ariaLabelbyValue);
    }
  }
}

// Add a new function for adding `aria-labelledby` to elements on initialization
function initAriaLabels() {
  const elements = document.querySelectorAll('[data-aria-init]');
  elements.forEach((elem) => {
    const id = elem.id || 'aria-label-' + Math.random().toString(36).substr(2, 9);
    elem.id = id;
    const labels = elem.querySelectorAll('label');
    labels.forEach((label) => {
      elem.setAttribute('aria-label', label.textContent);
    });
    addAriaLabelledbyIfNeeded(elem);
  });
}

// Add a new function for validating landmark structure
function validateLandmarkStructure(landmark) {
  // Check if landmark structure is valid
  const validRoles = ['landmark', 'banner', 'complementary', 'contentinfo', 'form', 'navigation', 'main', 'search', 'region'];
  const role = landmark.getAttribute('role');
  const isLandmark = role && validRoles.includes(role);

  // Check for proper heading hierarchy within the landmark
  const headings = landmark.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  let hasValidHeadingStructure = true;

  headings.forEach((heading) => {
    const tagName = heading.tagName.toLowerCase();
    const level = parseInt(tagName.replace('h', ''), 10);
    if (previousLevel > 0 && level > previousLevel + 1) {
      hasValidHeadingStructure = false;
    }
    previousLevel = level;
  });

  // Check if there is at least one heading within the landmark
  const hasHeading = headings.length > 0;

  // Incorporate new conditions for a valid landmark
  return isLandmark && hasValidHeadingStructure && hasHeading;
}

// Add a new function for validating landmark structure on elements
function validateLandmarks(landmarks) {
  const validLandmarks = [];
  const invalidLandmarks = [];

  landmarks.forEach((landmark) => {
    const validationResult = validateLandmarkStructure(landmark);
    if (validationResult) {
      validLandmarks.push(landmark);
    } else {
      invalidLandmarks.push(landmark);
    }
  });

  return { validLandmarks, invalidLandmarks };
}

// ... (Pre-existing exported functions and code)