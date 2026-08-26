// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and [PERSON_NAME]())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... [PERSON_NAME](), ... and [PERSON_NAME]())

/// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... [PERSON_NAME](), ... and [PERSON_NAME]())

//------ BEGIN ORIGINAL CODE (unchanged)------

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

// New requested function
const newFunction = (document) => {
  // Implementation for handling the new function
  // This could include additional processing or setup needed for the document
  return document;
};

const wrapPrimaryContentInMain = (document) => {
  if (!document || !document.body) {
    return document;
  }

  // Check if main element already exists with main-content id
  const existingMain = document.getElementById('main-content');
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
};

const addSkipLink = (document) => {
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

  if (document.body.firstChild) {
    document.body.insertBefore(skipLink, document.body.firstChild);
  } else {
    document.body.appendChild(skipLink);
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
  landmarkTypes.forEach(type => {
    const elements = document.querySelectorAll(type);
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

//------ END OF ORIGINAL CODE ------

// New functions to be added
const addLangAttribute = (document) => {
  const html = document.documentElement;
  if (html && !html.lang) {
    html.lang = 'en';
  }
  return document;
};

const fixTableStructureIssues = (document) => {
  if (!document) {
    return document;
  }

  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure tables have proper structure
    if (!table.querySelector('thead') && table.querySelector('tr')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
      }
    }

    // Ensure tables have a caption or title for accessibility
    if (!table.querySelector('caption') && table.id) {
      const caption = document.createElement('caption');
      caption.textContent = table.id.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());
      table.insertBefore(caption, table.firstChild);
    }

    // Add scope attributes to header cells
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      if (header.querySelector('abbr')) {
        header.setAttribute('scope', 'row');
      } else {
        header.setAttribute('scope', 'col');
      }
    });
  });

  return document;
};

const ensureUniqueLandmarks = (document) => {
  if (!document) {
    return document;
  }

  const landmarkSelectors = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'form'];
  const seenLabels = {};

  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
          const labels = {
            header: 'Banner',
            nav: 'Navigation',
            main: 'Main content',
            footer: 'Footer',
            aside: 'Complementary',
            section: 'Section',
            form: 'Form',
          };
          const baseLabel = labels[selector] || selector;
          let label = baseLabel;
          let count = index + 1;
          while (seenLabels[label]) {
            label = `${baseLabel} ${count}`;
            count++;
          }
          seenLabels[label] = true;
          element.setAttribute('aria-label', label);
        } else {
          const existingLabel = element.getAttribute('aria-label') || element.getAttribute('aria-labelledby');
          if (existingLabel) {
            seenLabels[existingLabel] = true;
          }
        }
      });
    }
  });

  return document;
};

const addSvgAccessibleNames = (document) => {
  if (!document) {
    return document;
  }

  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const titleEl = svg.querySelector('title');
      const label = titleEl && titleEl.textContent
        ? titleEl.textContent.trim()
        : svg.getAttribute('data-name') || 'Graphic';
      svg.setAttribute('aria-label', label);
    }
  });

  return document;
};

const fixFakeLinkIssue = (document) => {
  if (!document) {
    return document;
  }

  const fakeLinks = document.querySelectorAll('a:not([href]), a[href=""], a[href="#"], a[href="javascript:void(0)"], a[href="javascript:void(0);"]');
  fakeLinks.forEach(link => {
    if (!link.getAttribute('role')) {
      link.setAttribute('role', 'button');
    }
    if (!link.hasAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }
    if (!link.getAttribute('aria-label') && link.textContent && link.textContent.trim()) {
      link.setAttribute('aria-label', link.textContent.trim());
    }
  });

  return document;
};

// Add the updated addressAccessibilityIssues function
const addressAccessibilityIssues = (document) => {
  if (!document) {
    return document;
  }

  // Wrap primary content in main element
  wrapPrimaryContentInMain(document);

  // Add skip link for keyboard navigation
  addSkipLink(document);

  // Add proper landmark regions
  addProperLandmarkRegions(document);

  // Ensure unique landmarks
  ensureUniqueLandmarks(document);

  // Add language attribute to HTML
  addLangAttribute(document);

  // Fix table structure issues
  fixTableStructureIssues(document);

  // Add accessible names to SVGs
  addSvgAccessibleNames(document);

  // Fix fake link issues (links without proper href)
  fixFakeLinkIssue(document);

  return document;
};

// Export all functions for use in tests and other parts of the application
export {
  newFunction,
  wrapPrimaryContentInMain,
  addSkipLink,
  getAccessibleName,
  setAccessibleName,
  addProperLandmarkRegions,
  addressAccessibilityIssues,
  addLangAttribute,
  fixTableStructureIssues,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
};