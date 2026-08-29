// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Adds lang attribute to the HTML element for accessibility
 * @param {string} langCode - The language code (e.g., 'en', 'es', 'fr')
 */
function addLangAttribute(langCode = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', langCode);
  }
}

/**
 * Fixes 26 table structure issues for accessibility
 * Ensures tables have proper headers, captions, and scope attributes
 */
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // Add caption if missing
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = table.getAttribute('aria-label') || 'Data table';
      caption.classList.add('sr-only');
      table.prepend(caption);
    }

    // Ensure proper header structure with scope attributes
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach((th) => {
      if (!th.hasAttribute('scope')) {
        // Determine scope based on position
        const parent = th.parentElement;
        const isInThead = parent && parent.tagName === 'THEAD';
        th.setAttribute('scope', isInThead ? 'col' : 'row');
      }
    });
  });
}

/**
 * Adds/fixes 2 landmark issues by ensuring a main landmark exists
 */
function addMainLandmark() {
  let mainElement = document.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    const body = document.body;
    if (body) {
      // Wrap content in main element
      const children = Array.from(body.children).filter(
        (child) => !['SCRIPT', 'STYLE', 'NOSCRIPT', 'HEADER', 'FOOTER', 'NAV'].includes(child.tagName)
      );
      if (children.length > 0) {
        const firstChild = children[0];
        body.insertBefore(mainElement, firstChild);
        children.forEach((child) => mainElement.appendChild(child));
      } else {
        body.appendChild(mainElement);
      }
    }
  }
  return mainElement;
}

/**
 * Adds accessible names to SVG elements that lack them
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    const hasAccessibleName =
      svg.hasAttribute('aria-label') ||
      svg.hasAttribute('aria-labelledby') ||
      svg.hasAttribute('role') ||
      svg.querySelector('title');

    if (!hasAccessibleName) {
      // Try to use nearby text or generate one
      const parent = svg.parentElement;
      const nearbyText = parent ? parent.textContent.trim().substring(0, 50) : '';
      const label = nearbyText || 'Decorative icon';
      svg.setAttribute('aria-label', label);
      svg.setAttribute('role', 'img');
    }
  });
}

/**
 * Ensures unique landmarks by removing duplicate main elements
 */
function ensureUniqueLandmarks() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    // Keep the first <main> and convert others to <section> or <div>
    for (let i = 1; i < mainElements.length; i++) {
      const extraMain = mainElements[i];
      const section = document.createElement('section');
      section.setAttribute('role', 'region');
      while (extraMain.firstChild) {
        section.appendChild(extraMain.firstChild);
      }
      extraMain.parentNode.replaceChild(section, extraMain);
    }
  }
}

/**
 * Fixes fake link issues (e.g., divs/buttons styled as links but not using <a>)
 * Replaces fake links with proper anchor elements
 */
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('[role="link"], .fake-link, [data-fake-link]');
  fakeLinks.forEach((fakeLink) => {
    const href = fakeLink.getAttribute('data-href') || fakeLink.getAttribute('href') || '#';
    const text = fakeLink.textContent;
    const anchor = document.createElement('a');
    anchor.setAttribute('href', href);
    anchor.textContent = text;
    // Copy relevant attributes
    const classes = fakeLink.getAttribute('class');
    if (classes) {
      anchor.setAttribute('class', classes);
    }
    const id = fakeLink.getAttribute('id');
    if (id) {
      anchor.setAttribute('id', id);
    }
    fakeLink.parentNode.replaceChild(anchor, fakeLink);
  });
}

/**
 * Sets up basic accessibility features
 */
function setupAccessibility() {
  // Add lang attribute with default English
  addLangAttribute();

  // Ensure skip links work properly
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      const targetId = skipLink.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.tabIndex = -1;
        target.focus();
      }
    });
  }

  // Address all accessibility issues from the insight report
  addMainLandmark();
  ensureUniqueLandmarks();
  fixTableStructureIssues();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupAccessibility);
} else {
  setupAccessibility();
}

// Export for testing
module.exports = {
  addLangAttribute,
  addMainLandmark,
  ensureUniqueLandmarks,
  fixTableStructureIssues,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  setupAccessibility
};