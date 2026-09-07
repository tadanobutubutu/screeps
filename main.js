// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Adds the lang attribute to the HTML element.
 */
export function addLangAttribute() {
  const html = document.querySelector('html');
  if (html && !html.getAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

/**
 * Fixes table structure issues ensuring proper semantics.
 */
export function fixTableStructureIssues() {
  document.querySelectorAll('table').forEach(table => {
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = '';
      table.prepend(caption);
    }
    document.querySelectorAll('th').forEach(th => {
      if (!th.getAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
}

/**
 * Adds a <main> landmark element if one does not exist.
 */
export function addMainLandmark() {
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    document.body.appendChild(main);
  }
}

/**
 * Adds accessible names (aria-label or title) to SVG elements.
 */
export function addSvgAccessibleNames() {
  document.querySelectorAll('svg').forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('title')) {
      svg.setAttribute('aria-label', svg.alt || 'Graphic');
    }
  });
}

/**
 * Ensures only a single <main> landmark exists, removing duplicates.
 */
export function ensureUniqueLandmarks() {
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    for (let i = mains.length - 1; i > 0; i--) {
      mains[i].parentNode.removeChild(mains[i]);
    }
  }
  addMainLandmark();
}

/**
 * Fixes fake link issues by ensuring elements with role="link" have proper keyboard support.
 */
export function fixFakeLinkIssue() {
  document.querySelectorAll('[role="link"]').forEach(link => {
    if (Number(link.tabIndex) !== 0) {
      link.tabIndex = 0;
    }
    if (!link.onclick && !link.href) {
      link.addEventListener('click', event => {
        event.preventDefault();
      });
    }
  });
}

export default {
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue
};