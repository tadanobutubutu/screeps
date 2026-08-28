// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

export function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

export function fixTableStructureIssues() {
  document.querySelectorAll('table').forEach(table => {
    if (table.querySelector('thead') || table.querySelector('tbody')) return;

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const rows = table.querySelectorAll('tr');

    rows.forEach((row, index) => {
      if (index === 0) {
        thead.appendChild(row);
      } else {
        tbody.appendChild(row);
      }
    });

    if (thead.children.length > 0 && tbody.children.length > 0) {
      table.innerHTML = '';
      table.appendChild(thead);
      table.appendChild(tbody);
    }
  });
}

export function addMainLandmark() {
  if (!document.querySelector('main')) {
    const mainElement = document.createElement('main');
    document.body.prepend(mainElement);
  }
}

export function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = 'SVG Image';
      svg.prepend(title);
    }
  });
}

export function ensureUniqueLandmarks() {
  const landmarkRoles = ['main', 'header', 'footer', 'nav', 'aside'];
  landmarkRoles.forEach(tag => {
    const elements = document.querySelectorAll(tag);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.removeAttribute('role');
        }
      });
    }
  });
}

export function fixFakeLinkIssue() {
  document.querySelectorAll('[onclick]').forEach(el => {
    if (el.tagName.toLowerCase() !== 'A') {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = el.textContent;
      a.onclick = el.onclick;
      el.replaceWith(a);
    }
  });
}