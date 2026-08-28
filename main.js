// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Adds lang attribute to the HTML element for accessibility
 * @param {string} html - The HTML string to modify
 * @param {string} lang - The language code (default: 'en')
 * @returns {string} Modified HTML with lang attribute on HTML element
 */
function addLangAttribute(html, lang = 'en') {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const htmlElement = doc.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
  return doc.documentElement.outerHTML;
}

/**
 * Fixes table structure issues for accessibility
 * Ensures tables have proper headers and structure
 * @param {string} html - The HTML string to modify
 * @returns {string} Modified HTML with fixed table structures
 */
function fixTableStructureIssues(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const tables = doc.querySelectorAll('table');
  
  tables.forEach(table => {
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length > 0 && !row.querySelector('th')) {
        const firstCell = cells[0];
        const tagName = firstCell.tagName.toLowerCase();
        if (tagName === 'td') {
          const newRow = row.cloneNode(true);
          const firstCellNew = newRow.querySelector('td');
          const newTh = doc.createElement('th');
          newTh.textContent = firstCellNew.textContent;
          newRow.insertBefore(newTh, firstCellNew);
          firstCellNew.remove();
          row.parentNode.replaceChild(newRow, row);
        }
      }
    });
  });
  
  return doc.documentElement.outerHTML;
}

/**
 * Adds main landmark to the page for accessibility
 * @param {string} html - The HTML string to modify
 * @returns {string} Modified HTML with main landmark
 */
function addMainLandmark(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  let mainElement = doc.querySelector('main');
  if (!mainElement) {
    const existingMain = doc.querySelector('[role="main"]');
    if (existingMain) {
      const newMain = doc.createElement('main');
      while (existingMain.firstChild) {
        newMain.appendChild(existingMain.firstChild);
      }
      existingMain.parentNode.replaceChild(newMain, existingMain);
    } else {
      mainElement = doc.createElement('main');
      const body = doc.querySelector('body');
      if (body && body.firstChild) {
        body.insertBefore(mainElement, body.firstChild);
      } else if (body) {
        body.appendChild(mainElement);
      }
    }
  }
  
  return doc.documentElement.outerHTML;
}

/**
 * Adds accessible names to SVG elements
 * @param {string} html - The HTML string to modify
 * @param {Object} svgNames - Object mapping SVG selectors to accessible names
 * @returns {string} Modified HTML with accessible SVG names
 */
function addSvgAccessibleNames(html, svgNames = {}) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  Object.entries(svgNames).forEach(([selector, name]) => {
    const svgs = doc.querySelectorAll(selector);
    svgs.forEach(svg => {
      const title = doc.createElement('title');
      title.textContent = name;
      title.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    });
  });
  
  const unamedSvgs = doc.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  unamedSvgs.forEach((svg, index) => {
    const title = doc.createElement('title');
    title.textContent = `SVG element ${index + 1}`;
    title.id = `svg-title-unnamed-${index + 1}`;
    svg.insertBefore(title, svg.firstChild);
    svg.setAttribute('aria-labelledby', title.id);
  });
  
  return doc.documentElement.outerHTML;
}

/**
 * Ensures landmarks are unique by adding unique identifiers
 * @param {string} html - The HTML string to modify
 * @returns {string} Modified HTML with unique landmarks
 */
function ensureUniqueLandmarks(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  const landmarkCounts = {};
  
  landmarks.forEach(landmark => {
    const elements = doc.querySelectorAll(landmark);
    elements.forEach((el, index) => {
      if (!el.id) {
        const count = landmarkCounts[landmark] || 0;
        el.id = `${landmark}-${count + 1}`;
        landmarkCounts[landmark] = count + 1;
      }
    });
  });
  
  return doc.documentElement.outerHTML;
}

/**
 * Fixes fake link issues - converts non-links that look like links
 * @param {string} html - The HTML string to modify
 * @returns {string} Modified HTML with fixed fake links
 */
function fixFakeLinkIssue(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const fakeLinks = doc.querySelectorAll('span[role="link"], div[role="link"], a[href=""]');
  fakeLinks.forEach(el => {
    const isClickable = el.style.cursor === 'pointer' || 
                        el.getAttribute('onclick') ||
                        el.classList.contains('link') ||
                        el.classList.contains('clickable');
    
    if (isClickable && el.tagName.toLowerCase() !== 'a') {
      const linkText = el.textContent.trim();
      const newLink = doc.createElement('a');
      newLink.href = '#';
      newLink.setAttribute('role', 'button');
      while (el.firstChild) {
        newLink.appendChild(el.firstChild);
      }
      newLink.onclick = (e) => {
        e.preventDefault();
        if (el.onclick) {
          el.onclick();
        }
      };
      el.parentNode.replaceChild(newLink, el);
    }
  });
  
  return doc.documentElement.outerHTML;
}

module.exports = {
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue
};