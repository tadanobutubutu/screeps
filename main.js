// TODO: Add back any required exports that might have been?

function main() {
  return "Hello, World!";
}

const version = "1.0.0";

const config = {
  port: 3000,
  debug: false
};

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(doc, lang = 'en') {
  if (doc && doc.documentElement) {
    doc.documentElement.setAttribute('lang', lang);
  }
}

// REACT_027: Fix 26 table structure issues
function fixTableStructureIssues(doc) {
  const tables = doc.querySelectorAll('table');
  tables.forEach(table => {
    const hasThead = table.querySelector('thead');
    const hasTbody = table.querySelector('tbody');
    if (!hasThead) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = doc.createElement('thead');
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    if (!hasTbody) {
      const rows = table.querySelectorAll('tr');
      const tbody = doc.createElement('tbody');
      rows.forEach(row => tbody.appendChild(row));
      table.appendChild(tbody);
    }
  });
}

// REACT_017: Add/fix 2 landmark issues
function addMainLandmark(doc) {
  const mains = doc.querySelectorAll('main');
  if (mains.length === 0) {
    const main = doc.createElement('main');
    while (doc.body.firstChild) {
      main.appendChild(doc.body.firstChild);
    }
    doc.body.appendChild(main);
  }
}

// REACT_041: Add accessible names to 2 SVGs
function addSvgAccessibleName(doc) {
  const svgs = doc.querySelectorAll('svg');
  let counter = 0;
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      const title = doc.createElement('title');
      counter++;
      title.textContent = `SVG ${counter}`;
      title.id = `svg-title-${counter}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(doc) {
  const mains = doc.querySelectorAll('main');
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      mains[i].remove();
    }
  }
}

// REACT_036: Fix 1 fake link issue
function fixFakeLinkIssue(doc) {
  const clickableDivs = doc.querySelectorAll('div[onclick], div[role="link"]');
  clickableDivs.forEach(div => {
    const anchor = doc.createElement('a');
    anchor.setAttribute('href', '#');
    while (div.firstChild) {
      anchor.appendChild(div.firstChild);
    }
    ['onclick', 'role', 'tabindex'].forEach(attr => {
      if (div.hasAttribute(attr)) {
        anchor.setAttribute(attr, div.getAttribute(attr));
      }
    });
    div.parentNode.replaceChild(anchor, div);
  });
}

export default main;
export { version, config };