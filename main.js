// TODO: Address accessibility issues from insight report:
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinkIssue())
// - REACT_041: Fix SVG accessible name issues (handled by fixSvgAccessibility())
// - REACT_015: Add lang attribute to html element (handled by addHtmlLangAttribute())

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
    document.body.appendChild(main);
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
  skipLink.style.backgroundColor = '#000';
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

//------ END OF ORIGINAL CODE ------

// New functions to be added
const ensureUniqueLandmarks = (document) => {
  if (!document) {
    return document;
  }

  // Handle main: ensure only one <main> element
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    // Keep the first main, convert others to section
    mainElements.forEach((main, index) => {
      if (index === 0) {
        // Ensure the first main has id 'main-content' and role main
        if (!main.id) {
          main.id = 'main-content';
        }
        if (!main.getAttribute('role')) {
          main.setAttribute('role', 'main');
        }
      } else {
        // Convert to section
        const section = document.createElement('section');
        // Copy attributes (except id, role)
        for (const attr of Array.from(main.attributes)) {
          if (attr.name !== 'id' && attr.name !== 'role') {
            section.setAttribute(attr.name, attr.value);
          }
        }
        // Copy children
        while (main.firstChild) {
          section.appendChild(main.firstChild);
        }
        // Replace main with section
        main.parentNode.replaceChild(section, main);
      }
    });
  }

  // For other landmark selectors, add aria-label if duplicates
  const landmarkSelectors = ['header', 'nav', 'footer', 'aside', 'section', 'form'];
  const seenLabels = {};

  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        const labels = {
          header: 'Banner',
          nav: 'Navigation',
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
  });

  return document;
};

const fixFakeLinkIssue = (document) => {
  if (!document) {
    return document;
  }

  const fakeLinks = document.querySelectorAll('a[href=""], a[href="#"], a:not([href])');
  fakeLinks.forEach(link => {
    if (!link.getAttribute('role')) {
      link.setAttribute('role', 'button');
    }
    if (!link.getAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }
    if (!link.getAttribute('aria-label') && link.textContent && link.textContent.trim()) {
      link.setAttribute('aria-label', link.textContent.trim());
    }
  });

  return document;
};

const fixSvgAccessibility = (document) => {
  if (!document) {
    return document;
  }

  // Find all inline SVG elements
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    // Check if SVG already has an accessible name
    const hasAriaLabel = svg.getAttribute('aria-label');
    const hasAriaLabelledBy = svg.getAttribute('aria-labelledby');
    const hasTitleChild = svg.querySelector('title');
    const hasRole = svg.getAttribute('role');
    const isHidden = svg.getAttribute('hidden') !== null;

    // If SVG has no accessible name and is not explicitly hidden
    if (!hasAriaLabel && !hasAriaLabelledBy && !hasTitleChild && !hasRole && !isHidden) {
      // Check if it's likely a decorative icon (e.g., favicon, small decorative icon)
      const viewBox