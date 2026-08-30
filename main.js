// TODO: This is the existing code that needs to be preserved

// Accessibility fixes from insight report

/**
 * REACT_015: Add lang attribute to HTML element
 */
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * REACT_017: Add landmark roles and fix landmark issues
 */
function addLandmarkRoles() {
  const header = document.querySelector('header');
  if (header && !header.hasAttribute('role')) {
    header.setAttribute('role', 'banner');
  }

  const nav = document.querySelector('nav');
  if (nav && !nav.hasAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }

  const main = document.querySelector('main');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }

  const footer = document.querySelector('footer');
  if (footer && !footer.hasAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
}

/**
 * REACT_025: Ensure unique landmarks (2 issues)
 * Ensures each landmark has a unique label via aria-label or aria-labelledby
 */
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
  const labelCounts = {};

  landmarks.forEach((landmark) => {
    const tag = landmark.tagName.toLowerCase();
    labelCounts[tag] = (labelCounts[tag] || 0) + 1;

    if (labelCounts[tag] > 1) {
      if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
        landmark.setAttribute('aria-label', tag.charAt(0).toUpperCase() + tag.slice(1) + ' ' + labelCounts[tag]);
      }
    }
  });
}

/**
 * REACT_041: Add accessible names to 2 SVGs
 */
function addAccessibleNamesToSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby') && !svg.hasAttribute('title')) {
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = 'Graphic ' + (index + 1);
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('role', 'img');
    }
  });
}

/**
 * REACT_036: Fix 1 fake link issue
 * Replaces <div> or <span> elements with click handlers that act as links with proper anchor tags
 */
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('[onclick], [data-href]');
  fakeLinks.forEach((element) => {
    if (element.tagName.toLowerCase() !== 'a' && element.tagName.toLowerCase() !== 'button') {
      const href = element.getAttribute('data-href') || '#';
      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.innerHTML = element.innerHTML;
      anchor.setAttribute('role', 'link');
      anchor.className = element.className;
      element.parentNode.replaceChild(anchor, element);
    }
  });
}

/**
 * REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
 */
function addScopeToTableHeaders() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach((th) => {
    if (!th.hasAttribute('scope')) {
      const isInHead = th.closest('thead') || th.parentNode.parentNode.tagName.toLowerCase() === 'thead';
      th.setAttribute('scope', isInHead ? 'col' : 'row');
    }
  });
}

/**
 * Apply all accessibility fixes
 */
function applyAccessibilityFixes() {
  addLangAttribute();
  addLandmarkRoles();
  ensureUniqueLandmarks();
  addAccessibleNamesToSVGs();
  fixFakeLinks();
  addScopeToTableHeaders();
}

module.exports = {
  addLangAttribute,
  addLandmarkRoles,
  ensureUniqueLandmarks,
  addAccessibleNamesToSVGs,
  fixFakeLinks,
  addScopeToTableHeaders,
  applyAccessibilityFixes,
};