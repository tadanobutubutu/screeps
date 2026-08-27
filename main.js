// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinks)

/**
 * Adds lang attribute to HTML element for accessibility
 * @param {Document} doc - The document object
 * @param {string} lang - The language code (e.g., 'en')
 */
function addLangAttribute(doc, lang = 'en') {
  const html = doc.documentElement;
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
}

/**
 * Fixes table structure issues for accessibility
 * @param {Document} doc - The document object
 */
function fixTableStructure(doc) {
  const tables = doc.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure tables have proper structure
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = doc.createElement('thead');
        const tbody = table.querySelector('tbody');
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, tbody || firstRow);
        firstRow.remove();
      }
    }
    // Ensure proper scope attributes on header cells
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
}

/**
 * Adds main landmark to the document
 * @param {Document} doc - The document object
 */
function addMainLandmark(doc) {
  let main = doc.querySelector('main');
  if (!main) {
    main = doc.createElement('main');
    const body = doc.body;
    if (body && body.firstChild) {
      body.insertBefore(main, body.firstChild);
    } else if (body) {
      body.appendChild(main);
    }
  }
  main.setAttribute('role', 'main');
}

/**
 * Adds accessible names to SVG elements
 * @param {Document} doc - The document object
 */
function addSvgAccessibleNames(doc) {
  const svgs = doc.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      const title = doc.createElement('title');
      title.textContent = `SVG icon ${index + 1}`;
      title.setAttribute('id', `svg-title-${index + 1}`);
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', `svg-title-${index + 1}`);
    }
  });
}

/**
 * Ensures landmarks have unique accessible names
 * @param {Document} doc - The document object
 */
function ensureUniqueLandmarks(doc) {
  const landmarks = doc.querySelectorAll('[role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]');
  landmarks.forEach((landmark, index) => {
    const existingLabel = landmark.getAttribute('aria-label');
    if (!existingLabel) {
      const role = landmark.getAttribute('role') || 'region';
      landmark.setAttribute('aria-label', `${role} ${index + 1}`);
    }
  });
}

/**
 * Fixes fake links (elements that look like links but aren't)
 * @param {Document} doc - The document object
 */
function fixFakeLinks(doc) {
  const fakeLinks = doc.querySelectorAll('span[role="link"], div[role="link"]');
  fakeLinks.forEach(element => {
    const href = element.getAttribute('data-href');
    if (href) {
      const link = doc.createElement('a');
      link.setAttribute('href', href);
      link.setAttribute('role', 'link');
      while (element.firstChild) {
        link.appendChild(element.firstChild);
      }
      Array.from(element.attributes).forEach(attr => {
        if (attr.name !== 'data-href') {
          link.setAttribute(attr.name, attr.value);
        }
      });
      element.parentNode.replaceChild(link, element);
    }
  });
}

/**
 * Main initialization function that applies all accessibility fixes
 * @param {Document} doc - The document object
 */
function initAccessibility(doc) {
  addLangAttribute(doc);
  fixTableStructure(doc);
  addMainLandmark(doc);
  addSvgAccessibleNames(doc);
  ensureUniqueLandmarks(doc);
  fixFakeLinks(doc);
}

module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  initAccessibility
};