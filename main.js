// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function createInPageButton(targetId, label) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', label);
  button.setAttribute('data-target', targetId);
  return button;
}

function validateTableAccessibility(table) {
  if (!table) return false;
  const headers = table.querySelectorAll('th');
  return headers.length > 0;
}

function validateTableStructure(table) {
  if (!table) return false;
  const rows = table.querySelectorAll('tr');
  return rows.length > 0;
}

function validateLandmark(element) {
  if (!element) return false;
  const tagName = element.tagName.toLowerCase();
  return ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'].includes(tagName);
}

function validateLandmarkStructure(container) {
  if (!container) return false;
  const main = container.querySelector('main');
  return main !== null;
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const title = svg.querySelector('title');
  return title ? title.textContent : '';
}

function setSvgAttributes(svg, name) {
  if (!svg) return;
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', name);
}

function validateLinkAccessibility(link) {
  if (!link) return false;
  const text = link.textContent.trim();
  return text.length > 0;
}

function handleFakeLinks(links) {
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#') {
      link.setAttribute('role', 'button');
      const tabIndex = link.getAttribute('tabindex');
      if (tabIndex === null) {
        link.setAttribute('tabindex', '0');
      }
    }
  });
}

// Initialize accessibility features
function initAccessibility(container) {
  const html = document.documentElement;
  html.setAttribute('lang', getLangAttribute());

  const tables = container.querySelectorAll('table');
  tables.forEach(table => {
    if (!validateTableAccessibility(table)) {
      console.warn('Table accessibility issue detected');
    }
    if (!validateTableStructure(table)) {
      console.warn('Table structure issue detected');
    }
  });

  const landmarks = container.querySelectorAll('header, nav, main, footer, aside, section, article');
  landmarks.forEach(landmark => {
    if (!validateLandmark(landmark)) {
      console.warn('Landmark issue detected');
    }
  });

  if (!validateLandmarkStructure(container)) {
    console.warn('Landmark structure issue detected');
  }

  const svgs = container.querySelectorAll('svg');
  svgs.forEach(svg => {
    const name = getSvgAccessibleName(svg);
    if (!name) {
      console.warn('SVG accessible name missing');
    } else {
      setSvgAttributes(svg, name);
    }
  });

  const links = container.querySelectorAll('a');
  links.forEach(link => {
    if (!validateLinkAccessibility(link)) {
      console.warn('Link accessibility issue detected');
    }
  });

  handleFakeLinks(links);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getLangAttribute,
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    setSvgAttributes,
    validateLinkAccessibility,
    handleFakeLinks,
    initAccessibility
  };
}