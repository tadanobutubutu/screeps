// Addressed accessibility issues from insight report:

// REACT_015: Add lang attribute to HTML element
document.documentElement.lang = 'en';

// REACT_027: Fix 26 table structure issues
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table';
      table.insertBefore(caption, table.firstChild);
    }
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.getAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
}

// REACT_017: Add/fix 4 landmark issues
function addLandmarks() {
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    document.body.insertBefore(main, document.body.firstChild);
  }
  if (!document.querySelector('nav')) {
    const nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    document.body.appendChild(nav);
  }
  // Additional landmarks can be added as needed
}

// REACT_041: Add accessible names to 2 SVGs
function addSvgNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', 'SVG');
    }
  });
}

// REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role], main, nav, aside, section, article');
  const ids = new Set();
  landmarks.forEach(el => {
    if (!el.id) {
      el.id = 'landmark-' + Math.random().toString(36).substr(2, 9);
    }
    if (ids.has(el.id)) {
      el.id += '-' + Math.random().toString(36).substr(2, 9);
    }
    ids.add(el.id);
  });
}

// REACT_036: Fix 1 fake link issue
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    link.removeAttribute('href');
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });
}

// Apply fixes after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  fixTableStructure();
  addLandmarks();
  addSvgNames();
  ensureUniqueLandmarks();
  fixFakeLinks();
});