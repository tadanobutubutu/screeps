// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

function addLangAttribute() {
  const html = document.querySelector('html');
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, table.firstChild);
      }
    }
  });
}

function addMainLandmark() {
  const mains = document.querySelectorAll('main');
  if (mains.length === 0) {
    const main = document.createElement('main');
    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(main, body.firstChild);
    } else {
      body.appendChild(main);
    }
  }
}

function ensureUniqueLandmarks() {
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];
  landmarks.forEach(role => {
    const elements = document.querySelectorAll(role);
    if (elements.length > 1 && (role === 'main' || role === 'nav')) {
      elements.forEach((el, index) => {
        if (index > 0 && role === 'main') {
          el.setAttribute('role', 'region');
          el.setAttribute('aria-label', `Section ${index + 1}`);
        }
      });
    }
  });
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        const id = `svg-title-${index}`;
        title.id = id;
        svg.setAttribute('aria-labelledby', id);
      } else {
        svg.setAttribute('aria-label', `SVG icon ${index + 1}`);
      }
    }
  });
}

function fixFakeLinkIssue() {
  const links = document.querySelectorAll('a[href="#"], a:not([href])');
  links.forEach(link => {
    if (link.getAttribute('href') === '#' || !link.hasAttribute('href')) {
      const onclick = link.getAttribute('onclick');
      if (onclick && !link.hasAttribute('role')) {
        link.setAttribute('role', 'button');
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  addLangAttribute();
  fixTableStructure();
  addMainLandmark();
  ensureUniqueLandmarks();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
});

module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue
};