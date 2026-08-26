// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (addLangAttribute)
// - REACT_027: Fix 26 table structure issues (fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (addLandmarkRole)
// - REACT_041: Add accessible names to 2 SVGs (addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (fixFakeLinks)

function addLangAttribute() {
  document.documentElement.setAttribute('lang', 'en');
}

function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
    }
    const ths = table.querySelectorAll('th');
    ths.forEach(th => {
      if (!th.getAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
}

function addLandmarkRole() {
  const mainEl = document.querySelector('main');
  if (mainEl && !mainEl.getAttribute('role')) {
    mainEl.setAttribute('role', 'main');
  }
  const navEl = document.querySelector('nav');
  if (navEl && !navEl.getAttribute('role')) {
    navEl.setAttribute('role', 'navigation');
  }
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = `Accessible SVG ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id || `svg-title-${index}`);
    }
  });
}

function ensureUniqueLandmarks() {
  const roles = ['main', 'navigation', 'banner', 'contentinfo', 'search', 'form'];
  roles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      for (let i = 1; i < elements.length; i++) {
        elements[i].removeAttribute('role');
      }
    }
  });
}

function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"], a:not([href])');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    if (!link.hasAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }
  });
}

export {
  addLangAttribute,
  fixTableStructure,
  addLandmarkRole,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks
};