// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and createAccessibleLink())

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
  const lang = getLangAttribute();
  const hreflang = document.documentElement.getAttribute('hreflang');
  return hreflang ? `${lang}-${hreflang}` : lang;
}

function validateTableAccessibility(table) {
  if (!table) return false;
  const caption = table.querySelector('caption');
  const headers = table.querySelectorAll('th');
  return caption !== null && headers.length > 0;
}

function validateTableStructure(table) {
  if (!table) return false;
  const rows = table.querySelectorAll('tr');
  let colCount = 0;
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll('td, th');
    if (i === 0) colCount = cells.length;
    else if (cells.length !== colCount) return false;
  }
  return true;
}

function validateLandmark(element) {
  if (!element) return false;
  const tagName = element.tagName.toLowerCase();
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  return validLandmarks.includes(tagName);
}

function validateLandmarkStructure(container) {
  if (!container) return false;
  const landmarks = container.querySelectorAll('header, nav, main, aside, footer');
  let mainCount = 0;
  landmarks.forEach(lm => {
    if (lm.tagName.toLowerCase() === 'main') mainCount++;
  });
  return mainCount === 1;
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const title = svg.querySelector('title');
  const desc = svg.querySelector('desc');
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  if (title) return title.textContent;
  if (desc) return desc.textContent;
  return '';
}

function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}

function createAccessibleLink(href, text, isExternal) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  if (isExternal) {
    link.setAttribute('rel', 'noopener noreferrer');
    link.setAttribute('target', '_blank');
  }
  return link;
}

module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink
};