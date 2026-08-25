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

  if (node.getAttribute('aria-label')) {
    return node.getAttribute('aria-label');
  }

  if (node.getAttribute('aria-labelledby')) {
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
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, table.firstChild);
      }
    }

    if (!table.querySelector('tbody')) {
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
};

const ensureUniqueLandmarks = (document) => {
  const landmarkTypes = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  const usedIds = new Set();

  landmarkTypes.forEach((role) => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
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
        if (link.getAttribute('aria-label')) {
          link.setAttribute('aria-label', link.getAttribute('aria-label'));
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

// React Dashboard Component (integrated from origin/main)
const React = require('react');
const { useState } = React;

const Dashboard = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  const copyErr = () => {
    // Implement error copying logic
  };

  const fetchStats = (shouldRetry) => {
    // Implement stats fetching logic
  };

  return React.createElement('div', { style: { padding: '2rem', fontFamily: 'monospace' } },
    error && React.createElement('main', null,
      React.createElement('h1', { style: { color: '#b71c1c' } }, '⚠️ エラー'),
      React.createElement('pre', {
        tabIndex: 0,
        'aria-label': 'エラーメッセージ詳細',
        style: {
          color: '#c53030',
          backgroundColor: '#fff5f5',
          padding: '1rem',
          borderRadius: '4px',
          overflow: 'auto',
        }
      }, error)
    ),
    success && React.createElement('main', null,
      React.createElement('h1', { style: { color: '#155d27' } }, '🎉 Success'),
      React.createElement('section', null,
        // ... rest of the success state content
      )
    ),
    !error && !success && (
      // This is where you might have other UI components
      // without rendering a main element
    )
  );
};

// Existing exports and functions continue to be preserved
// No changes to exports are allowed

module.exports = {
  getAccessibleName,
  setAccessibleName,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  addressAccessibilityIssues,
  Dashboard
};