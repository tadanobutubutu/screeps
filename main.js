module.exports = {
  newFunction: (document) => {
    // Implementation for handling the new function
    // This could include additional processing or setup needed for the document
    return document;
  },

  wrapPrimaryContentInMain: (document) => {
    if (!document || !document.body) {
      return document;
    }

    // Check if main element already exists with main-content id
    const existingMain = document.querySelector('#main-content');
    if (existingMain) {
      return document;
    }

    // Check if any main element exists
    const anyMain = document.querySelector('[role="main"]');
    if (anyMain) {
      // Add id to existing main element if it doesn't have one
      if (!anyMain.id) {
        anyMain.id = 'main-content';
      }
      return document;
    }

    // Create main element and wrap appropriate content
    const main = document.createElement('main');
    main.id = 'main-content';
    main.setAttribute('role', 'main');

    const body = document.body;

    // Get all direct children of body
    const bodyChildren = Array.from(body.childNodes).filter(node => node.nodeType === 1);

    if (bodyChildren.length > 0) {
      // Move children to main element
      bodyChildren.forEach(child => {
        main.appendChild(child);
      });

      // Append main to body
      body.appendChild(main);
    }

    return document;
  },

  addSkipLink: (document) => {
    if (!document || !document.body) {
      return document;
    }

    const existingSkipLink = document.getElementById('skip-link');
    if (existingSkipLink) {
      return document;
    }

    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.id = 'skip-link';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    skipLink.style.left = '0';
    skipLink.style.background = '#000';
    skipLink.style.color = '#fff';
    skipLink.style.padding = '8px 16px';
    skipLink.style.zIndex = '10000';
    skipLink.style.transition = 'top 0.3s';

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    if (document.body) {
      document.body.insertBefore(skipLink, document.body.firstChild);
    } else {
      document.documentElement.insertBefore(skipLink, document.documentElement.firstChild);
    }

    return document;
  },

  getAccessibleName: (node) => {
    if (!node) {
      return null;
    }

    if (node.getAttribute('aria-labelledby')) {
      const labelledById = node.getAttribute('aria-labelledby');
      const labelledElement = document.getElementById(labelledById);
      return labelledElement ? labelledElement.textContent : null;
    }

    if (node.getAttribute('aria-label')) {
      return node.getAttribute('aria-label');
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
  },

  setAccessibleName: (node, accessibleName) => {
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
  },

  addProperLandmarkRegions: (document) => {
    const landmarkTypes = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
    landmarkTypes.forEach(type => {
      const elements = document.querySelectorAll(`[role="${type}"]`);
      elements.forEach((element) => {
        if (!element.id) {
          let idSuffix = 1;
          const existingIds = Array.from(document.querySelectorAll(`#${type}-${idSuffix}`)).map(el => el.id);
          let id = `${type}-${idSuffix}`;
          while (existingIds.includes(id)) {
            idSuffix++;
            id = `${type}-${idSuffix}`;
          }
          element.id = id;
        }
      });
    });
  },

  addLangAttribute: (document) => {
    const html = document.documentElement;
    if (html && !html.lang) {
      html.lang = 'en';
    }
    return document;
  },

  fixTableStructureIssues: (document) => {
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

      if (table.querySelector('tbody') === null) {
        const rows = Array.from(table.querySelectorAll('tr'));
        if (rows.length > 0) {
          const newTbody = document.createElement('tbody');
          rows.forEach((row) => newTbody.appendChild(row));
          table.appendChild(newTbody);
        }
      }

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
  },

  addMainLandmark: (document) => {
    const mains = document.querySelectorAll('[role="main"]');
    if (mains.length === 0) {
      const main = document.createElement('main');
      main.setAttribute('id', 'main-content');
      while (document.body.firstChild) {
        main.appendChild(document.body.firstChild);
      }
      document.body.appendChild(main);
    } else {
      mains.forEach((main, index) => {
        if (!main.id) {
          main.id = index === 0 ? 'main-content' : `main-content-${index + 1}`;
        }
      });
    }
    return document;
  },

  addSvgAccessibleNames: (document) => {
    const svgs = document.querySelectorAll('svg');
    let svgIndex = 0;
    svgs.forEach((svg) => {
      if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
        const title = document.createElement('title');
        title.textContent = `SVG ${svgIndex + 1}`;
        title.id = `svg-title-${svgIndex + 1}`;
        svg.insertBefore(title, svg.firstChild);
        svg.setAttribute('aria-labelledby', title.id);
      }
      svgIndex++;
    });
    return document;
  },

  ensureUniqueLandmarks: (document) => {
    const landmarkTypes = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
    const usedIds = new Set();

    landmarkTypes.forEach(type => {
      const elements = document.querySelectorAll(`[role="${type}"]`);
      elements.forEach((element) => {
        if (!element.id) {
          let idSuffix = 1;
          const existingIds = Array.from(document.querySelectorAll(`[id]`)).map(el => el.id);
          let id = `${type}-${idSuffix}`;
          while (existingIds.includes(id)) {
            idSuffix++;
            id = `${type}-${idSuffix}`;
          }
          element.id = id;
        }
      });
    });
  },
};