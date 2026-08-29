// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svgElement - The SVG element to get the accessible name for
 * @returns {string|null} The accessible name or null if not found
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;
  
  const title = svgElement.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }
  
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }
  
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const label = document.getElementById(labelledBy);
    if (label) {
      return label.textContent.trim();
    }
  }
  
  return null;
}

/**
 * Sets accessibility properties on SVG elements.
 * @param {SVGElement} svgElement - The SVG element to modify
 */
function setSvgAccessibilityProps(svgElement) {
  // (code for setSvgAccessibilityProps remains the same)
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkAccessibility(container = document) {
  // (code for checkAccessibility remains the same)
}

/**
 * Checks landmark element has appropriate accessibility attributes.
 * @param {string} role - The landmark role to check
 * @param {HTMLElement} element - The element to check
 */
function checkLandmarkElement(role, element) {
  if (!element) return false;

  // Determine the effective role: explicit role attribute or implicit from tag name
  const explicitRole = element.getAttribute('role');
  let actualRole = explicitRole ? explicitRole.toLowerCase() : role.toLowerCase();

  // Map common HTML5 landmark elements to their implicit ARIA roles
  const implicitLandmarkRoles = {
    nav: 'navigation',
    main: 'main',
    header: 'banner',
    footer: 'contentinfo',
    section: 'region',
    article: 'region',
    aside: 'region',
    form: 'form',
    // Add more as needed
  };

  // If no explicit role, infer from the element's tag name
  if (!explicitRole) {
    const tag = element.tagName.toLowerCase();
    actualRole = implicitLandmarkRoles[tag] || null;
  }

  // If no role can be determined, it's not a landmark element
  if (!actualRole) return false;

  // The element's role must match the expected role (case‑insensitive)
  if (actualRole !== role.toLowerCase()) return false;

  // Verify that the landmark has an accessible name
  const hasAccessibleName = (function () {
    // Check for a <title> element inside the landmark
    const title = element.querySelector('title');
    if (title && title.textContent.trim()) return true;

    // Check for an aria-label attribute
    if (element.hasAttribute('aria-label') && element.getAttribute('aria-label').trim()) return true;

    // Check for aria-labelledby referencing another element
    const labelledBy = element.getAttribute('aria-labelledby');
    if (labelledBy) {
      const lbl = document.getElementById(labelledBy);
      if (lbl && lbl.textContent.trim()) return true;
    }

    // Check for visible text content (non‑empty and not hidden)
    const style = window.getComputedStyle(element);
    const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    if (isVisible && element.textContent.trim()) return true;

    return false;
  })();

  return hasAccessibleName;
}

/**
 * Wraps the primary content of the page in a <main> element.
 * This improves accessibility by ensuring a proper main landmark exists.
 * @returns {HTMLElement|null} The main element created or existing, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  // (code for wrapPrimaryContentInMain remains the same)
}

/**
 * Checks landmark elements and sets appropriate aria-labels, also reporting any inaccessible elements.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object
 */
function checkLandmarks(container = document) {
  // (code for checkLandmarks remains the same)
}

function makeAccessible(element) {
  // Implement the function logic to address accessibility issues
  // ...
}

exports.someFunction = function() {
  // Existing code
};

exports.anotherFunction = function() {
  // Existing code
};

exports.addressAccessibilityIssue038 = addressAccessibilityIssue038;
exports.renderDependencyGraph = renderDependencyGraph;

// The function rotateBack() should be defined somewhere in your code to handle the action of rotating back.

// Here's an example of how the rotateBack function might be defined:
function rotateBack() {
  // Logic to rotate back
  // For example, if you're manipulating the DOM or a state:
  // ...
  // ...
}

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAccessibilityProps())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// ... (existing code remains the same)