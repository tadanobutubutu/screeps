// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

const getAccessibleName = (node) => {
  if (!node) {
    return null;
  }

  if (node.hasAttribute && node.hasAttribute('aria-label')) {
    return node.getAttribute('aria-label');
  }

  if (node.hasAttribute && node.hasAttribute('aria-labelledby')) {
    const labelledById = node.getAttribute('aria-labelledby');
    const labelledElement = node.ownerDocument ? node.ownerDocument.getElementById(labelledById) : null;
    return labelledElement ? labelledElement.textContent : null;
  }

  if (node.tagName === 'INPUT' && node.type !== 'submit' && node.type !== 'reset') {
    if (node.labels && node.labels.length > 0) {
      return node.labels[0].textContent;
    }
  }

  const titleEl = node.querySelector ? node.querySelector('title') : null;
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

    if (!table.querySelector('tbody')) {
      const tbodies = table.querySelectorAll('tbody');
      table.querySelectorAll('tr').forEach((row) => {
        const rows = table.querySelectorAll('tr');
        if (rows.length > 0) {
          const newTbody = document.createElement('tbody');
          rows.forEach((row) => newTbody.appendChild(row));
          table.appendChild(newTbody);
        }
      });
    }

    // Add scope attributes to header cells
    const thead = table.querySelector('thead');
    if (thead) {
      thead.querySelectorAll('th').forEach(th => th.setAttribute('scope', 'col'));
    }

    const tbodies = table.querySelectorAll('tbody');
    tbodies.forEach(tbody => {
      tbody.querySelectorAll('th').forEach(th => th.setAttribute('scope', 'row'));
    });
  });
  return document;
};

const addMainLandmark = (document) => {
  const mains = document.querySelectorAll('main');
  if (mains.length === 0) {
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    while (document.body.firstChild) {
      main.appendChild(document.body.firstChild);
    }
    document.body.insertBefore(main, document.body.firstChild);
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

  // First, handle multiple <main> elements by converting extras to <section>
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    // Keep only the first main, convert others to section
    for (let i = 1; i < mains.length; i++) {
      const main = mains[i];
      const innerHTML = main.innerHTML;
      const section = document.createElement('section');
      Array.from(main.attributes).forEach(attr => {
        section.setAttribute(attr.name, attr.value);
      });
      // Update id to avoid duplicates
      if (section.id) {
        section.id = `section-${i + 1}`;
      }
      section.innerHTML = innerHTML;
      main.parentNode.replaceChild(section, main);
    }
  }

  // Process all landmark types for unique IDs
  landmarkTypes.forEach((role) => {
    const roleSelectors = {
      'banner': '[role="banner"]',
      'navigation': '[role="navigation"]',
      'main': 'main',
      'contentinfo': '[role="contentinfo"]',
      'complementary': '[role="complementary"]',
      'search': '[role="search"]'
    };

    const selector = roleSelectors[role];
    const elements = selector ? document.querySelectorAll(selector) : [];

    if (elements.length === 0) return;

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
    if (href && !link.textContent.trim()) {
      const accessibleName = getAccessibleName(link);
      if (!accessibleName) {
        if (link.querySelector('img')) {
          const img = link.querySelector('img');
          link.setAttribute('aria-label', img.alt || 'Link');
        } else if (link.title) {
          link.setAttribute('aria-label', link.title);
        } else {
          link.setAttribute('aria-label', 'Link');
        }
      }
    }
  });
  return document;
};

const addressAccessibilityIssues = (document) => {
  addLangAttribute(document);
  fixTableStructure(document);
  addMainLandmark(document);
  ensureUniqueLandmarks(document);
  addSvgAccessibleNames(document);
  fixFakeLinkIssue(document);
  return document;
};

// Existing exports and functions continue to be preserved
// No changes to exports are allowed

module.exports = { getAccessibleName, setAccessibleName, addLangAttribute, fixTableStructure, addMainLandmark, addSvgAccessibleNames, ensureUniqueLandmarks, fixFakeLinkIssue, addressAccessibilityIssues };