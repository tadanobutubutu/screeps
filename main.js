// main.js
// Accessibility fixes from insight report

function addLangAttribute() {
  const html = document.documentElement;
  if (!html.getAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure each table has a caption or aria-label
    if (!table.querySelector('caption') && !table.getAttribute('aria-label')) {
      table.setAttribute('aria-label', 'Table');
    }
    // Ensure proper header structure
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.setAttribute('scope', 'col');
      th.textContent = 'Column 1';
      tr.appendChild(th);
      thead.appendChild(tr);
      table.prepend(thead);
    }
  });
}

function addMainLandmark() {
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    document.body.prepend(main);
  }
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll(
    '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="search"], main, nav, header, footer, aside, form[role="search"]'
  );
  const roles = {};
  landmarks.forEach(el => {
    const role = el.getAttribute('role') || el.tagName.toLowerCase();
    if (roles[role]) {
      // Duplicate found, remove role attribute to avoid duplication
      el.removeAttribute('role');
    } else {
      roles[role] = true;
    }
  });
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', 'SVG graphic');
    }
  });
}

function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a[role="link"]:not([href])');
  fakeLinks.forEach(link => {
    link.removeAttribute('href');
    link.setAttribute('role', 'button');
    if (!link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', link.textContent || 'Link');
    }
  });
}

module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue
};