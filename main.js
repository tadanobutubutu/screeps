// main.js - Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_025: Ensure unique landmarks
// - REACT_029: Improve keyboard navigation, added elements and focus management
// - REACT_033: Mark required form inputs and add helpful ARIA labels
// - REACT_034: Announce changes in the UI through a live region for screen reader users
// - REACT_038: Swap internal landmark IDs for unique IDs
// - REACT_040: Add proper landmark regions to the document

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 9);
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        let id = lm.id || `${lm.name}-${lm.latitude}-${lm.longitude}`;
        if (!seen.has(id)) {
            seen.add(id);
            result.push(lm);
        }
    }
    return result;
}

/**
 * Calculates a discounted price given a price and a discount percentage.
 * @param {number} price - The original price before discount.
 * @param {number} discountPercentage - The percentage to be subtracted from the original price.
 * @returns {number} The discounted price.
 */
function calculateDiscount(price, discountPercentage) {
    if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
        throw new Error('Invalid price provided');
    }

    if (typeof discountPercentage !== 'number' || !Number.isFinite(discountPercentage) || discountPercentage < 0 || discountPercentage > 100) {
        throw new Error('Invalid discount percentage provided');
    }

    return price * (1 - discountPercentage / 100);
}

/**
 * Wraps primary content in the main processing pipeline.
 * Ensures that primary content is correctly identified and passed to the main handler.
 * @returns {Object} Status object containing status and message properties.
 */
function wrapPrimaryContentInMain() {
    // Implementation: Wraps primary content in the main container.
    const primaryContent = document.querySelector('*[data-primary-content]');
    if (!primaryContent) {
        return { status: 'error', message: 'Primary content not found in the DOM' };
    }

    // Add necessary roles, properties, and organizational structure to the content.
    setupARIAOnPrimaryContent(primaryContent);

    console.log('Wrapping primary content in main container');
    return { status: 'processed', message: 'Primary content handled successfully' };
}

/**
 * Implementation details for ARIA roles and properties to properly structure the primary content.
 * @param {HTMLElement} primaryElement - The primary content element.
 * @returns {void}
 */
function setupARIAOnPrimaryContent(primaryElement) {
    // Ensure the primary content is contained within a region outside the normal flow of the document.
    const offscreenRegion = document.createElement('div');
    offscreenRegion.setAttribute('aria-hidden', true);
    offscreenRegion.appendChild(primaryElement);
    document.body.appendChild(offscreenRegion);

    // Move the element back in-flow and apply the correct ARIA roles.
    primaryElement.removeAttribute('aria-hidden');
    primaryElement.setAttribute('role', 'region');
    primaryElement.setAttribute('aria-labelledby', 'primary-content-label');
}

/**
 * Adds proper ARIA attributes to the primary content element for improved accessibility.
 * @param {HTMLElement} primaryElement - The primary content element.
 * @returns {void}
 */
function setupKeyboardNavigation(primaryElement) {
    // Ensure all focusable children have proper roles.
    const focusableChildren = primaryElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusableChildren.forEach((child) => {
        if (!child.hasAttribute('aria-labelledby')) {
            const label = child.querySelector('[for]');
            if (label) label.setAttribute('id', label.id || 'aria-label');
        }
    });

    // Improve keyboard navigation within the primary content.
    primaryElement.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'Enter':
                primaryElement.dispatchEvent(new CustomEvent('primary-content-enter'));
                break;
            case 'Escape':
                primaryElement.dispatchEvent(new CustomEvent('primary-content-escape'));
                break;
        }
    });
}

// Address accessibility issues by iterating through the insight report and applying fixes as necessary.
function addressAccessibilityIssues(insightReport) {
  for (const issue of insightReport.issues) {
    switch (issue.issueType) {
      case 'unique-landmarks':
        const existingLandmarks = uniqueLandmarks(issue.affectedElements);
        issue.affectedElements = existingLandmarks;
        break;

      case 'redundant-landmarks':
        issue.affectedElements.forEach((lm) => lm.remove());
        break;

      default:
        // Unknown issue type - log error and continue.
        console.error(`Unknown issue type encountered: ${issue.issueType}`);
    }
  }

  // Return the modified insight report.
  return insightReport;
}

// Export the main functions for use in other modules.
module.exports = {
  ensureUniqueLandmarkId,
  uniqueLandmarks,
  calculateDiscount,
  wrapPrimaryContentInMain,
  addressAccessibilityIssues,
  setupKeyboardNavigation
};