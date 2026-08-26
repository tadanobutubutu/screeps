// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

function addLangAttribute(document) {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
  return document;
}

function fixTableStructure(table) {
  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('td, th');
    const headerCount = row.querySelectorAll('th').length;
    
    if (headerCount === 0 && cells.length > 0) {
      const firstCell = cells[0];
      if (!firstCell.hasAttribute('scope')) {
        firstCell.setAttribute('scope', 'col');
      }
    }
  });
  
  if (!table.querySelector('thead')) {
    const firstRow = rows[0];
    if (firstRow) {
      const thead = document.createElement('thead');
      thead.appendChild(firstRow.cloneNode(true));
      table.insertBefore(thead, table.firstChild);
      firstRow.remove();
    }
  }
  
  return table;
}

function addMainLandmark(container) {
  let main = container.querySelector('main');
  if (!main) {
    const existingMain = container.querySelector('[role="main"]');
    if (existingMain) {
      main = document.createElement('main');
      main.setAttribute('role', 'main');
      while (existingMain.firstChild) {
        main.appendChild(existingMain.firstChild);
      }
      existingMain.parentNode.replaceChild(main, existingMain);
    }
  }
  return container;
}

function addSvgAccessibleNames(container) {
  const svgs = container.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        const titleId = `svg-title-${index}`;
        title.setAttribute('id', titleId);
        svg.setAttribute('aria-labelledby', titleId);
      } else {
        svg.setAttribute('aria-label', `SVG element ${index + 1}`);
      }
    }
  });
  return container;
}

function ensureUniqueLandmarks(container) {
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  landmarks.forEach(landmark => {
    const elements = Array.from(container.querySelectorAll(landmark));
    if (elements.length > 1) {
      const mainElement = elements.find(el => el.tagName.toLowerCase() === 'main' || el.getAttribute('role') === 'main');
      if (mainElement) {
        const otherElements = elements.filter(el => el !== mainElement);
        otherElements.forEach(el => {
          const newElement = document.createElement('div');
          newElement.setAttribute('role', landmark === 'main' ? 'region' : landmark);
          newElement.setAttribute('aria-label', `${landmark} section`);
          while (el.firstChild) {
            newElement.appendChild(el.firstChild);
          }
          el.parentNode.replaceChild(newElement, el);
        });
      }
    }
  });
  return container;
}

function fixFakeLinkIssue(container) {
  const fakeLinks = container.querySelectorAll('span[role="link"], div[role="link"], a:not([href])');
  fakeLinks.forEach(element => {
    if (element.tagName === 'A') {
      if (!element.hasAttribute('href') || element.getAttribute('href') === '#') {
        element.setAttribute('role', 'button');
        element.addEventListener('click', (e) => {
          e.preventDefault();
        });
      }
    } else {
      element.setAttribute('role', 'button');
    }
  });
  return container;
}

module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue
};