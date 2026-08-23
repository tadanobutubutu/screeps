// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark(), validateLandmark(), validateUniqueLandmarks(), validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames(), getSvgAccessibleName(), createSvgAccessibilityProps())
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue(), validateLinkAccessibility(), createInPageButton(), validateLinkOrButton(), and createAccessibleLink())

// Addresses accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateUniqueLandmarks(), and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createSvgAccessibilityProps())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by validateUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by validateLinkAccessibility(), createInPageButton(), validateLinkOrButton(), and createAccessibleLink())

/**
 * Add lang attribute to the HTML element for accessibility
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 */
function addLangAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('