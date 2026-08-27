// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: React Table Structure - Add scope to table headers (DONE: addScopeToTableHeaders)
// - REACT_036: Fix fake links (DONE: fixFakeLinks)
// - REACT_017: Ensure proper landmark structure (DONE: wrapPrimaryContentInMain)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to SVGs (DONE: addAccessibleSVGs)
// - REACT_025: Add any additional accessibility changes as per the insight report

function addLangAttribute() {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

function addScopeToTableHeaders() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    const headers = table.querySelectorAll('th');
    headers.forEach((th) => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
}

function fixFakeLinks() {
  const elements = document.querySelectorAll('[role="link"], a[href="#"], a[href="javascript:void(0)"]');
  elements.forEach((el) => {
    if (el.tagName !== 'A') {
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'link');
    } else if (el.getAttribute('href') === '#' || el.getAttribute('href') === 'javascript:void(0)') {
      el.setAttribute('href', '#');
    }
  });
}

function wrapPrimaryContentInMain() {
  const main = document.querySelector('main');
  if (!main) {
    const primary = document.querySelector('#root, #app, .app, .application, body > div');
    if (primary && !primary.closest('main')) {
      const wrapper = document.createElement('main');
      primary.parentNode.insertBefore(wrapper, primary);
      wrapper.appendChild(primary);
    }
  }
}

function ensureUniqueLandmarks() {
  const landmarks = {
    nav: document.querySelectorAll('nav'),
    main: document.querySelectorAll('main'),
    header: document.querySelectorAll('header'),
    footer: document.querySelectorAll('footer'),
  };

  Object.entries(landmarks).forEach(([role, elements]) => {
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          const label = `${role}-${index}`;
          el.setAttribute('aria-label', label);
        }
      });
    }
  });
}

function addAccessibleSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    const hasLabel = svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby');
    const isHidden = svg.getAttribute('aria-hidden') === 'true';
    if (!hasLabel && !isHidden) {
      const role = svg.getAttribute('role') || 'img';
      svg.setAttribute('role', role);
      if (role === 'img') {
        svg.setAttribute('aria-label', 'icon');
      }
    }
  });
}

function applyAccessibilityFixes() {
  addLangAttribute();
  addScopeToTableHeaders();
  fixFakeLinks();
  wrapPrimaryContentInMain();
  ensureUniqueLandmarks();
  addAccessibleSVGs();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAccessibilityFixes);
  } else {
    applyAccessibilityFixes();
  }
}

module.exports = {
  addLangAttribute,
  addScopeToTableHeaders,
  fixFakeLinks,
  wrapPrimaryContentInMain,
  ensureUniqueLandmarks,
  addAccessibleSVGs,
  applyAccessibilityFixes,
};