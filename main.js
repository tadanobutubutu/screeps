// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

const getAccessibleName = (node) => {
  if (!node) {
    return null;
  }

  if (node.hasAttribute('aria-label')) {
    return node.getAttribute('aria-label');
  }

  if (node.hasAttribute('aria-labelledby')) {
    const labelledById = node.getAttribute('aria-labelledby');
    const labelledElement = node.ownerDocument.getElementById(labelledById);
    return labelledElement ? labelledElement.textContent : null;
  }

  if (node.tagName === 'INPUT' && node.type !== 'submit' && node.type !== 'reset') {
    if (node.labels && node.labels.length > 0) {
      return node.labels[0].textContent;
    }
  }

  const titleEl = node.querySelector('title');
  if (titleEl && titleEl.textContent) {
    return titleEl.textContent;
  }

  if (node.textContent && node.textContent.trim()) {
    return node.textContent.trim();
  }

  return null;
};

const setAccessibleName = (node, accessibleName) => {
  if (!node) {
    return;
  }

  if (typeof node.setAttribute === 'function') {
    node.setAttribute('aria-label', accessibleName);
    return;
  }

  if (node.querySelector) {
    const titleEl = node.querySelector('title');
    if (titleEl) {
      titleEl.textContent = accessibleName;
    }

    const ariaLabelEl = node.querySelector('[aria-label]');
    if (ariaLabelEl && typeof ariaLabelEl.setAttribute === 'function') {
      ariaLabelEl.setAttribute('aria-label', accessibleName);
    }
  }
};

// Adding a new function
const newFunction = function () {
  // Function body of the new function goes here
  // For example:
  console.log('This is the new function!');
};

const addLangAttribute = (document) => {
  const html = document.documentElement;
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
  return document;
};

const fixTableStructure = (document) => {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
      }
    }

    if (table.querySelector('tbody')) {
      const tbodies = table.querySelectorAll('tbody');
      tbodies.forEach((tbody) => {
        const rows = Array.from(tbody.querySelectorAll('tr'));
        if (rows.length > 0) {
          const newTbody = document.createElement('tbody');
          rows.forEach((row) => newTbody.appendChild(row));
          tbody.parentNode.replaceChild(newTbody, tbody);
        }
      });
    }

    const thead = table.querySelector('thead');
    if (thead) {
      thead.querySelectorAll('th').forEach((th) => th.setAttribute('scope', 'col'));
    }

    const tbodies = table.querySelectorAll('tbody');
    tbodies.forEach((tbody) => {
      const firstCells = tbody.querySelectorAll('tr > td:first-child');
      firstCells.forEach((th) => th.setAttribute('scope', 'row'));
    });
  });
  return document;
};

const addMainLandmark = (document) => {
  const mains = document.querySelectorAll('main');
  if (mains.length === 0) {
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    const body = document.body;
    while (body.firstChild) {
      main.appendChild(body.firstChild);
    }
    body.appendChild(main);
  } else {
    mains.forEach((main, index) => {
      if (!main.id) {
        main.id = index === 0 ? 'main-content' : `main-content-${index + 1}`;
      }
    });
  }
  return document;
};

const addSvgAccessibleNames = (document) => {
  const svgs = document.querySelectorAll('svg:not([aria-label])');
  let svgIndex = 0;
  svgs.forEach((svg) => {
    if (!svg.querySelector('title') && !svg.getAttribute('aria-labelledby')) {
      const title = document.createElement('title');
      title.textContent = `SVG ${svgIndex + 1}`;
      title.id = `svg-title-${svgIndex + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
    svgIndex++;
  });
  return document;
};

const ensureUniqueLandmarks = (document) => {
  const landmarkTypes = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  const usedIds = new Set();

  landmarkTypes.forEach((role) => {
    const elements = document.querySelectorAll(`[role="${role}"], ${role}`);
    const seenRoleIds = new Set();

    elements.forEach((element, index) => {
      const id = element.id;

      if (id) {
        if (seenRoleIds.has(id)) {
          const newId = `${role}-${index + 1}`;
          element.id = newId;
          usedIds.add(newId);
          seenRoleIds.add(newId);
        } else {
          seenRoleIds.add(id);
          usedIds.add(id);
        }
      } else {
        let newId = `${role}-${index + 1}`;
        let counter = 1;
        while (usedIds.has(newId)) {
          newId = `${role}-${index + 1}-${counter}`;
          counter++;
        }
        element.id = newId;
        usedIds.add(newId);
      }
    });
  });

  return document;
};

const fixFakeLinkIssue = (document) => {
  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    const hasText = link.textContent.trim();
    if (href && !hasText) {
      // Determine accessible name for the link
      const accessibleName = getAccessibleName(link);
      // Create a button element to replace the fake link
      const btn = document.createElement('button');
      btn.type = 'button'; // ensure it does not submit forms
      if (accessibleName) {
        btn.textContent = accessibleName;
      } else {
        btn.textContent = 'Link';
      }
      // Replace the <a> with the <button>
      link.parentNode.replaceChild(btn, link);
    }
  });
  return document;
};

const addressAccessibilityIssues = (document) => {
  addLangAttribute(document);
  fixTableStructure(document);
  addMainLandmark(document);
  addSvgAccessibleNames(document);
  ensureUniqueLandmarks(document);
  fixFakeLinkIssue(document);
  return document;
};

// Existing exports and functions continue to be preserved
// No changes to exports are allowed

const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.id = 'skip-link';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
document.body.insertBefore(skipLink, document.body.firstChild);

const handleSkipLinkClick = (e) => {
  e.preventDefault();
  const mainContent = document.getElementById('main-content') || document.querySelector('main');
  if (mainContent) {
    mainContent.tabIndex = -1;
    mainContent.focus();
  }
};

skipLink.addEventListener('click', handleSkipLinkClick);

const mainElement = document.querySelector('main') || document.getElementById('content') || document.querySelector('[role="main"]');
if (mainElement) {
  mainElement.id = 'main-content';
  mainElement.setAttribute('role', 'main');
}

const fetchAPI = async (url) => {
  try {
    const response = await fetch(url);
    return response;
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
};

const addCaptionToTable = (table) => {
  const tableHeader = table.querySelector('caption');
  if (tableHeader && tableHeader.length > 0) return;
  const caption = document.createElement('caption');
  caption.textContent = table.id || `Table ${table.dataset.testid}`;
  table.insertBefore(caption, table.firstChild);
};

const addUniqueIdToTable = (table) => {
  table.id = table.id || `table-${table.dataset.testid}`;
};

export { fetchAPI, fetchAPI as default, addressAccessibilityIssues, addCaptionToTable, addUniqueIdToTable, newFunction };