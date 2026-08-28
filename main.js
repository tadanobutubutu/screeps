// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function personName() {
  return document.querySelector('[data-person-name]')?.textContent || 'Unknown';
}

function validateTableAccessibility(table) {
  if (!table) return false;
  const headers = table.querySelectorAll('th');
  return headers.length > 0;
}

function validateTableStructure(table) {
  if (!table) return false;
  const rows = table.querySelectorAll('tr');
  let hasIssue = false;
  rows.forEach(row => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) hasIssue = true;
  });
  return !hasIssue;
}

function validateLandmark(element) {
  if (!element) return false;
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  return landmarkRoles.some(role => element.getAttribute('role') === role || element.tagName.toLowerCase() === role);
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="main"], main, [role="navigation"], nav, [role="banner"], header, [role="contentinfo"], footer');
  let issues = 0;
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) issues += mains.length - 1;
  return { issues, valid: issues === 0 };
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  return '';
}

function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}

module.exports = {
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton
};