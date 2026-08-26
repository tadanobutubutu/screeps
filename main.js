// Existing code from main.js
function existingFunction() {
  // existing logic
}

const getAccessibleName = (node) => {
  if (!node) {
    return null;
  }

  if (node.hasAttribute && node.hasAttribute('aria-label')) {
    return node.getAttribute('aria-label');
  }

  if (node.hasAttribute && node.hasAttribute('aria-labelledby')) {
    const labelledById = node.getAttribute('aria-labelledby');
    const labelledElement = node.ownerDocument && node.ownerDocument.getElementById(labelledById);
    return labelledElement ? labelledElement.textContent : null;
  }

  if (node.tagName === 'INPUT' && node.type !== 'submit' && node.type !== 'reset') {
    if (node.labels && node.labels.length > 0) {
      return node.labels[0].textContent;
    }
  }

  const titleEl = node.querySelector && node.querySelector('title');
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
      const rows = Array.from(table.querySelectorAll('tr'));
      if (rows.length > 0) {
        const newTbody = document.createElement('tbody');
        rows.forEach((row) => newTbody.appendChild(row));
        table.appendChild(newTbody);
      }
    }

    // Add scope attributes to header cells in thead
    const thead = table.querySelector('thead');
    if (thead) {
      thead.querySelectorAll('th').forEach((th) => {
        if (!th.hasAttribute('scope')) {
          th.setAttribute('scope', 'col');
        }
      });
    }

    // Add scope attributes to header cells in tbody (row headers)
    const tbodies = table.querySelectorAll('tbody');
    tbodies.forEach(tbody => {
      tbody.querySelectorAll('th').forEach((th) => {
        if (!th.hasAttribute('scope')) {
          th.setAttribute('scope', 'row');
        }
      });
    });

    // Handle any th elements not inside thead or tbody (e.g. direct table rows)
    table.querySelectorAll('th').forEach((th) => {
      if (!th.hasAttribute('scope')) {
        const parent = th.parentElement;
        if (parent && parent.tagName === 'TR') {
          const parentContainer = parent.parentElement;
          if (parentContainer && parentContainer.tagName === 'THEAD') {
            th.setAttribute('scope', 'col');
          } else {
            th.setAttribute('scope', 'row');
          }
        }
      }
    });
  });
  return document;
};

const addMainLandmark = (document) => {
  const mains = document.querySelectorAll('main');
  if (mains.length === 0) {
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    while (document.firstChild) {
      main.appendChild(document.firstChild);
    }
    document.body && document.body.appendChild(main);
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
  const svgs = document.querySelectorAll('svg');
  let svgIndex = 0;
  svgs.forEach((svg) => {
    if (!svg.querySelector('title') && svg.id) {
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
    if (href && !link.textContent.trim()) {
      const accessibleName = getAccessibleName(link);
      if (!accessibleName) {
        if (link.title) {
          link.setAttribute('aria-label', link.title);
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
  addSvgAccessibleNames(document);
  ensureUniqueLandmarks(document);
  fixFakeLinkIssue(document);
  return document;
};

function exportedFunction() {
  // existing logic
}

// Existing exports and functions continue to be preserved
// No changes to exports are allowed

module.exports = { existingFunction, getAccessibleName, setAccessibleName, addLangAttribute, fixTableStructure, addMainLandmark, addSvgAccessibleNames, ensureUniqueLandmarks, fixFakeLinkIssue, addressAccessibilityIssues, exportedFunction };