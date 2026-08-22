// Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

/**
 * REACT_015: Add lang attribute to HTML element
 */
function addLangAttribute(lang = 'en') {
  const htmlEl = document.documentElement;
  if (htmlEl && !htmlEl.getAttribute('lang')) {
    htmlEl.setAttribute('lang', lang);
  }
}

/**
 * REACT_017 & REACT_025: Add/fix 4 landmark issues and ensure unique landmarks (2 issues)
 */
function fixLandmarkIssues() {
  // Ensure header landmark has an accessible label
  const header = document.querySelector('header');
  if (header && !header.getAttribute('aria-label') && !header.getAttribute('aria-labelledby')) {
    header.setAttribute('aria-label', 'Banner');
  }

  // Ensure nav landmark has a unique accessible label
  const nav = document.querySelector('nav');
  if (nav && !nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
    nav.setAttribute('aria-label', 'Main navigation');
  }

  // Ensure main landmark has an accessible label
  const main = document.querySelector('main');
  if (main && !main.getAttribute('role')) {
    main.setAttribute('role', 'main');
  }

  // Ensure footer landmark has an accessible label
  const footer = document.querySelector('footer');
  if (footer && !footer.getAttribute('aria-label') && !footer.getAttribute('aria-labelledby')) {
    footer.setAttribute('aria-label', 'Content information');
  }

  // REACT_025: Ensure unique landmarks - if there are multiple nav elements, give each a unique label
  const navs = document.querySelectorAll('nav');
  if (navs.length > 1) {
    navs.forEach((navEl, index) => {
      if (!navEl.getAttribute('aria-label') && !navEl.getAttribute('aria-labelledby')) {
        navEl.setAttribute('aria-label', index === 0 ? 'Primary navigation' : `Secondary navigation ${index}`);
      }
    });
  }
}

/**
 * REACT_041: Add accessible names to 2 SVGs
 */
function addAccessibleNamesToSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    // If SVG already has an accessible name, skip it
    if (svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.querySelector('title')) {
      return;
    }
    svg.setAttribute('role', 'img');
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `Graphic ${index + 1}`;
    svg.appendChild(title);
    svg.setAttribute('aria-label', `Graphic ${index + 1}`);
  });
}

/**
 * REACT_036: Fix 1 fake link issue
 * Converts elements that behave like links but aren't anchors into proper anchor elements
 */
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a)');
  fakeLinks.forEach((el) => {
    const anchor = document.createElement('a');
    // Move children
    while (el.firstChild) {
      anchor.appendChild(el.firstChild);
    }
    // Copy relevant attributes
    for (const attr of el.attributes) {
      if (attr.name !== 'role' && attr.name !== 'tabindex') {
        anchor.setAttribute(attr.name, attr.value);
      }
    }
    // Set href from data-href or existing href, default to '#'
    const href = el.getAttribute('data-href') || el.getAttribute('href') || '#';
    anchor.setAttribute('href', href);
    if (el.hasAttribute('tabindex')) {
      anchor.setAttribute('tabindex', el.getAttribute('tabindex'));
    }
    el.parentNode.replaceChild(anchor, el);
  });
}

/**
 * Address all accessibility issues from insight report
 */
function fixAccessibilityIssues() {
  addLangAttribute();
  fixLandmarkIssues();
  addAccessibleNamesToSVGs();
  fixFakeLinks();
}

// Run fixes if in a browser environment
if (typeof document !== 'undefined') {
  fixAccessibilityIssues();
}

module.exports = {
  fixAccessibilityIssues,
  addLangAttribute,
  fixLandmarkIssues,
  addAccessibleNamesToSVGs,
  fixFakeLinks
};