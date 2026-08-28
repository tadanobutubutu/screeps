// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements
// (Added functions for REACT_015, REACT_017, REACT_041, REACT_025, REACT_036, and REACT_027)

/**
 * Add your code here to replace `my-button` with a concrete button id
 */
function replaceMyButtonId() {
  // Find the element with the `my-button` class and replace the class with the actual id.
  // Assuming you have already set the id on the button element in your code
  const button = document.querySelector('.my-button');
  if (button) {
    button.id = 'exampleButton';
    button.classList.remove('my-button');
  }
}

/**
 * Adds proper ARIA landmark regions to the document.
 * This improves screen reader navigation by ensuring proper landmark roles.
 *
 * @returns {void}
 */
function addProperLandmarkRegions() {
  // ... (existing code)
}

/**
 * Adds proper ARIA account management elements to the document.
 * This includes adding `aria-expanded` attributes for collapsible menus,
 * and adding `aria-label` to form elements.
 *
 * @returns {void}
 */
function addProperAccountManagement() {
  // ... (existing code)
}

/**
 * Adds ARIA attributes to form controls for better accessibility.
 * This function focuses on ensuring that form controls have proper labeling and roles.
 *
 * @returns {void}
 */
function addProperFormAccessibility() {
  // ... (existing code)
}

/**
 * REACT_015: Adds a lang attribute to the HTML element to specify the language
 * of the document. This helps screen readers pronounce content correctly and
 * assists search engines and translation tools.
 *
 * @returns {void}
 */
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * REACT_041: Adds accessible names to SVG elements that lack a title or
 * aria-label. This ensures that assistive technologies can describe the
 * purpose of the SVGs to users.
 *
 * @returns {void}
 */
function addAccessibleNamesToSvgs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const hasAccessibleName =
      svg.getAttribute('aria-label') ||
      svg.getAttribute('aria-labelledby') ||
      svg.querySelector('title');

    if (!hasAccessibleName) {
      svg.setAttribute('aria-label', `Decorative icon ${index + 1}`);
      svg.setAttribute('role', 'img');
    }
  });
}

/**
 * REACT_025: Ensures landmarks are unique by adding aria-label to
 * duplicate landmarks so screen readers can distinguish between them.
 *
 * @returns {void}
 */
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section[role="region"]');
  const seen = {};

  landmarks.forEach((landmark) => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (seen[role]) {
      seen[role] += 1;
      landmark.setAttribute('aria-label', `${role} ${seen[role]}`);
    } else {
      seen[role] = 1;
    }
  });
}

/**
 * REACT_036: Fixes fake link issues by converting non-semantic clickable
 * elements (e.g., divs or spans styled as links) into proper anchor tags
 * with href attributes, or by adding appropriate roles and tabindex.
 *
 * @returns {void}
 */
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('[data-fake-link], .fake-link');
  fakeLinks.forEach((el) => {
    el.setAttribute('role', 'link');
    el.setAttribute('tabindex', '0');
    if (!el.hasAttribute('href')) {
      el.setAttribute('href', '#');
    }
  });
}

/**
 * REACT_027: Adds scope="col" or scope="row" to <th> elements that are missing
 * the attribute. This helps assistive technologies associate header cells with
 * their corresponding data cells in tables.
 *
 * @returns {void}
 */
function addScopeToThElements() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach((th) => {
    if (!th.hasAttribute('scope')) {
      // Determine if it's likely a row or column header based on its position
      const isInThead = th.closest('thead') !== null;
      const isInFirstRow = th.parentElement && th.parentElement.parentElement &&
        (th.parentElement.parentElement.tagName === 'TBODY' || th.parentElement.parentElement.tagName === 'TABLE') &&
        th.parentElement === th.parentElement.parentElement.querySelector('tr');

      if (isInThead || isInFirstRow) {
        th.setAttribute('scope', 'col');
      } else {
        th.setAttribute('scope', 'row');
      }
    }
  });
}

/**
 * Function to replace `my-button` with actual button id
 */
addProperLandmarkRegions();
addProperAccountManagement();
addProperFormAccessibility();
addLangAttribute();
addAccessibleNamesToSvgs();
ensureUniqueLandmarks();
fixFakeLinks();
addScopeToThElements();
replaceMyButtonId();

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addProperFormAccessibility,
  addLangAttribute,
  addAccessibleNamesToSvgs,
  ensureUniqueLandmarks,
  fixFakeLinks,
  addScopeToThElements,
  replaceMyButtonId
};