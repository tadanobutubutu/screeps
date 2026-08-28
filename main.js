// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// existing code...

// Assuming there's a function `newFunction` that needs to be exported
export function newFunction() {
  // function body...
}

// Assuming there's a variable `newVar` that needs to be exported
export let newVar = 'some value';

// Adding new function to handle landmark region addition
function addLandmarkRegion(landmark) {
  // Implement the logic to add the landmark region
  // This function was added from the new changes
}

// Don't forget to export new functions if necessary
export { addLandmarkRegion };

// Check if main element already exists with main-content id
const wrapPrimaryContentInMain = (document) => {
  const existingMain = document.querySelector('#main-content');
  if (existingMain) {
    return document;
  }

  // Check if any main element exists
  const anyMain = document.querySelector('main');
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
  const bodyChildren = Array.from(body.children).filter(node => node.nodeType === 1);

  if (bodyChildren.length > 0) {
    // Move children to main element
    bodyChildren.forEach(child => {
      main.appendChild(child);
    });

    // Append main to body
    body.appendChild(main);
  }

  return document;
};

const addSkipLink = (document) => {
  if (!document || !document.body) {
    return document;
  }

  const existingSkipLink = document.querySelector('#skip-link');
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
};

const getAccessibleName = (node) => {
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

const addProperLandmarkRegions = (document) => {
  const landmarkTypes = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  landmarkTypes.forEach((type) => {
    const elements = document.querySelectorAll(`[role="${type}"]`);
    elements.forEach((element) => {
      if (!element.id) {
        let idSuffix = 1;
        const existingIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
        let id = `${type}-${idSuffix}`;
        while (existingIds.includes(id)) {
          idSuffix++;
          id = `${type}-${idSuffix}`;
        }
        element.id = id;
      }
    });
  });
};

// Add the updated addressAccessibilityIssues function
const addressAccessibilityIssues = (document) => {
  if (!document) {
    return document;
  }

  wrapPrimaryContentInMain(document);
  addSkipLink(document);
  addProperLandmarkRegions(document);

  return document;
};

// New functions to be added
const addLangAttribute = (document) => {
  const html = document.documentElement;
  if (html && !html.lang) {
    html.lang = 'en';
  }
  return document;
};

const getAccessibilityReport = (document) => {
  if (!document) {
    return null;
  }

  const report = {
    landmarks: {},
    tables: 0,
    svgs: 0,
    links: 0,
    lang: document.documentElement ? document.documentElement.lang : null,
  };

  const landmarkTypes = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  landmarkTypes.forEach((type) => {
    report.landmarks[type] = document.querySelectorAll(`[role="${type}"]`).length;
  });

  report.tables = document.querySelectorAll('table').length;
  report.svgs = document.querySelectorAll('svg').length;
  report.links = document.querySelectorAll('a').length;

  return report;
};

const fixTableStructureIssues = (document) => {
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
};

const ensureUniqueLandmarks = (document) => {
  const landmarkTypes = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  const usedIds = new Set();

  landmarkTypes.forEach((type) => {
    const elements = document.querySelectorAll(`[role="${type}"]`);
    elements.forEach((element) => {
      if (!element.id) {
        let idSuffix = 1;
        const existingIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
        let id = `${type}-${idSuffix}`;
        while (existingIds.includes(id)) {
          idSuffix++;
          id = `${type}-${idSuffix}`;
        }
        element.id = id;
      }
    });
  });
};

const addSvgAccessibleNames = (document) => {
  const svgs = document.querySelectorAll('svg:not([aria-hidden="true"])');
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

const fixFakeLinkIssue = (document) => {
  const fakeLinks = document.querySelectorAll('[role="link"], a[href="#"]');
  fakeLinks.forEach(link => {
    // Add role="link" to ensure it's recognized as a link by screen readers
    if (!link.getAttribute('role') || link.getAttribute('role') === 'button') {
      link.setAttribute('role', 'link');
    }
    // Ensure the link has accessible name
    if (link.getAttribute('role') === 'link' && !link.textContent.trim()) {
      link.setAttribute('aria-label', 'Link');
    }
    // Remove href="#" and add href="#" with proper handling
    if (link.getAttribute('href') === '#') {
      link.setAttribute('href', 'javascript:void(0);');
    }
  });
  return document;
};

// Export all functions for use in tests and other parts of the application
export {
  newFunction,
  newVar,
  wrapPrimaryContentInMain,
  addSkipLink,
  getAccessibleName,
  setAccessibleName,
  addProperLandmarkRegions,
  addressAccessibilityIssues,
  addLangAttribute,
  getAccessibilityReport,
  fixTableStructureIssues,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  addLandmarkRegion,
};