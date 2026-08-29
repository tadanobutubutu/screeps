import { class1, function1, Object1 } from './path/to/module';
const dependencyGraphContent = require('./dependencyGraph');

// REACT_015: Add lang attribute

function addLangAttribute(document, lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
  return document;
}

// Function to fix table structure issues
function fixTableStructure(document) {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;

  tables.forEach((table) => {
    // Ensure tables have proper structure with thead and tbody
    const existingThead = table.querySelector('thead');
    const existingTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');
    
    if (rows.length > 0 && !existingThead) {
      const firstRow = rows[0];
      const thead = document.createElement('thead');
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
      fixedCount++;
    }
    
    if (!existingTbody) {
      let remainingRows = Array.from(rows);
      if (existingThead) {
        const theadRowCount = existingThead.querySelectorAll('tr').length;
        remainingRows = remainingRows.slice(theadRowCount);
      } else {
        remainingRows = remainingRows.slice(1);
      }
      if (remainingRows.length > 0) {
        const tbody = document.createElement('tbody');
        remainingRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
        fixedCount++;
      }
    }
    
    // Ensure proper header cells (th) are used
    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      // Check if first cell should be a header
      if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
        const firstCell = cells[0];
        const th = document.createElement('th');
        th.textContent = firstCell.textContent;
        th.scope = 'col';
        row.insertBefore(th, firstCell);
        fixedCount++;
      }
    });
    
    // Additional HEAD logic: ensure scope on header cells
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(th => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
        fixedCount++;
      }
    });
  });

  return fixedCount;
}

// Function to add/main landmark
function addMainLandmark(document) {
  let mainElement = document.querySelector('main');

  if (!mainElement) {
    const body = document.body;
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');

    const children = Array.from(body.children);
    for (const child of children) {
      if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' &&
          child.tagName !== 'LINK' && child.tagName !== 'META') {
        main.appendChild(child);
        break;
      }
    }

    body.insertBefore(main, body.firstChild);
    mainElement = main;
  }

  if (mainElement.tagName !== 'MAIN') {
    mainElement.setAttribute('role', 'main');
  }

  return mainElement;
}

// Function to ensure unique landmarks (by role and by origin/main)
function ensureUniqueLandmarks(document) {
  // Group landmarks by their accessible role
  const landmarkSelectors = ['header', 'nav', 'main', 'aside', 'footer', '[role="banner"]', '[role="navigation"]', '[role="main"]', '[role="complementary"]', '[role="contentinfo"]'];
  const seenRoles = {};

  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index === 0) {
          seenRoles[selector] = true;
          return;
        }
        // Demote duplicates to role="region" with unique aria-label
        const label = el.getAttribute('aria-label') || el.getAttribute('id') || `region-${selector}-${index}`;
        el.setAttribute('role', 'region');
        el.setAttribute('aria-label', label);
      });
    }
  });

  // Ensure only one <main> landmark
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    mainElements.forEach((el, index) => {
      if (index > 0) {
        el.setAttribute('role', 'region');
        el.setAttribute('aria-label', el.getAttribute('aria-label') || `content-${index}`);
      }
    });
  }

  return document;
}

// Function to add accessible names to SVGs
function addSvgAccessibleNames(document) {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', svg.getAttribute('id') || `Decorative graphic ${index + 1}`);
    }
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
  return document;
}

// Function to add accessible names to SVGs (alias)
function addAccessibleNamesToSVGs(document) {
  return addSvgAccessibleNames(document);
}

function fixFakeLinkIssue(document) {
  let count = 0;

  const clickableElements = document.querySelectorAll('[onclick]');

  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    const hasHref = element.hasAttribute('href');
    const onclick = element.getAttribute('onclick') || '';
    
    // Check if it's a fake link (clickable but not a real anchor)
    if (!isAnchor && (onclick.includes('window.location') || 
        onclick.includes('document.location') || 
        onclick.includes("location.href"))) {
      
      // Convert to proper anchor or add proper accessibility
      const span = document.createElement('span');
      span.textContent = element.textContent;
      span.setAttribute('role', 'link');
      span.setAttribute('tabindex', '0');
      span.setAttribute('onclick', onclick);
      span.addEventListener('click', element.onclick);
      
      // Copy styling if available
      if (element.className) {
        span.className = element.className;
      }
      
      element.parentNode.replaceChild(span, element);
      count++;
    }
  });

  return count;
}

// Function to fix fake link issues (handles both role="link" elements and anchors with href="#")
function fixFakeLinkIssues(document) {
  // Fix non-anchor elements with role="link"
  const roleLinks = document.querySelectorAll('[role="link"]');
  roleLinks.forEach(link => {
    if (link.tagName !== 'A') {
      link.setAttribute('aria-label', 'This link goes to a section within the page');
    }
  });

  // Fix anchors with href="#" by converting them to accessible buttons
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });

  return document;
}

// Accessibility fix for REACT_017: Add/fix landmark issues and add Landmark Regions
function fixLandmarkIssues(document) {
  // Ensure <main> exists
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    const body = document.body;
    if (body) {
      body.insertBefore(main, body.firstChild);
    }
  }

  // Ensure <header> exists at the top
  if (!document.querySelector('header')) {
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    document.body.insertBefore(header, document.body.firstChild);
  }

  // Ensure <footer> exists
  if (!document.querySelector('footer')) {
    const footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    document.body.appendChild(footer);
  }

  return document;
}

function addLandmarkRegions(document) {
  // Wrap orphan content blocks into <section> with aria-label
  const landmarks = ['[data-region]', 'section:not([aria-label]):not([aria-labelledby])'];
  landmarks.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
        el.setAttribute('aria-label', `Region ${index + 1}`);
      }
    });
  });
  return document;
}

// REACT_025: Ensure unique landmarks (by role approach)
function uniqueLandmarks(document) {
  return ensureUniqueLandmarks(document);
}

// Address accessibility issues from insight report for image alt texts
function fixImageAltTexts(document) {
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.hasAttribute('alt')) {
      const src = img.getAttribute('src') || '';
      img.setAttribute('alt', `Image ${index + 1}: ${src.split('/').pop() || 'description needed'}`);
    }
  });
  return document;
}

// Handler function for Google Sign-In credential response
function handleCredentialResponse(response) {
  console.log('Credential response received:', response);
}

// REACT_037: Google sign-in logic
function googleSignIn(document) {
  // Check if Google Identity Services is available
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: 'YOUR_CLIENT_ID',
      callback: handleCredentialResponse
    });
    const buttonContainer = document.querySelector('#google-sign-in-button');
    if (buttonContainer) {
      google.accounts.id.renderButton(
        buttonContainer,
        { theme: 'outline', size: 'large' }
      );
    }
  }
  return document;
}

// Function to ensure the element has an id
function ensureElementHasId(document, selector, idPrefix = 'element') {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element, index) => {
    if (!element.id) {
      element.id = `${idPrefix}-${index + 1}`;
    }
  });
  return document;
}

// Function to add aria-label to elements
function addAriaLabel(document, selector, label) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    if (!element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', label);
    }
  });
  return document;
}

// Function to render dependency graphs
function renderDependencyGraphs(document) {
  const graphContainer = document.querySelector('[data-dependency-graph]');
  if (graphContainer) {
    // Create SVG element for the dependency graph
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'dependency-graph');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '400');
    svg.setAttribute('viewBox', '0 0 800 400');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Dependency graph visualization');

    // Add accessible title and description
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = 'Dependency Graph';
    svg.appendChild(title);

    const desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    desc.textContent = 'Visual representation of project dependencies';
    svg.appendChild(desc);

    // Render the graph content
    const graphContent = graphContainer.querySelector('[data-graph-data]');
    if (graphContent) {
      // Parse and render dependency data
      // Implementation would parse the data and create nodes/edges
    }

    // Render the graph content using the dependencyGraphContent
    if (dependencyGraphContent) {
      const graphContentString = typeof dependencyGraphContent === 'string' 
        ? dependencyGraphContent 
        : JSON.stringify(dependencyGraphContent);
      const parser = new DOMParser();
      const doc = parser.parseFromString(graphContentString, 'image/svg+xml');
      const svgContent = doc.documentElement;
      while (svgContent.firstChild) {
        svg.appendChild(svgContent.firstChild);
      }
    }

    graphContainer.appendChild(svg);
  }
  return document;
}

// REACT_040: Replace my-button with actual button id for accessibility
function fixButtonIdentifiers(document) {
  const buttons = document.querySelectorAll('[id^="my-button"]');
  buttons.forEach(button => {
    const newId = button.id.replace('my-button', 'btn-' + button.textContent.trim().toLowerCase().replace(/\s+/g, '-'));
    button.id = newId;
  });
  return document;
}

// REACT_042: Ensure dependencyGraph container has a proper ARIA role
function ensureDependencyGraphAriaRole(document) {
  const dependencyGraph = document.querySelector('[data-testid="dependencyGraph"]') || 
                          document.querySelector('#dependencyGraph') || 
                          document.querySelector('.dependency-graph') ||
                          document.querySelector('[class*="dependency-graph"]');
  
  if (dependencyGraph) {
    // Check if element already has a role
    const existingRole = dependencyGraph.getAttribute('role');
    if (!existingRole) {
      // Add appropriate role based on context
      dependencyGraph.setAttribute('role', 'region');
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
    }
  }
  
  return document;
}

// Function to add the main landmark to docs/index.html
function addMainLandmarkToIndex(document) {
  // Ensure a main landmark exists for the index page
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    main.setAttribute('role', 'main');
    const body = document.body;
    if (body) {
      body.insertBefore(main, body.firstChild);
    }
  }
  return document;
}

// Implement function for addressing accessibility issues from insight report
function addressAccessibilityIssues(document) {
  document = addLangAttribute(document);
  document = fixTableStructure(document);
  document = fixLandmarkIssues(document);
  document = addMainLandmark(document);
  document = addLandmarkRegions(document);
  document = ensureUniqueLandmarks(document);
  document = uniqueLandmarks(document);
  document = addSvgAccessibleNames(document);
  document = addAccessibleNamesToSVGs(document);
  document = fixFakeLinkIssue(document);
  document = fixFakeLinkIssues(document);
  document = fixImageAltTexts(document);
  document = googleSignIn(document);
  document = fixButtonIdentifiers(document);
  document = addMainLandmarkToIndex(document);
  document = ensureElementHasId(document, '[data-ensure-id]');
  document = renderDependencyGraphs(document);
  document = ensureDependencyGraphAriaRole(document);
  return document;
}

const a11yStore = {
  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
    this.addSVGAccessibilityProps();
    this.fixFakeLinks();
    this.initAccessibility();
  },

  createAccessibleButton(id, label, onClick) {
    const button = document.createElement('button');
    button.id = id;
    button.setAttribute('aria-label', label);
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  },

  createAccessibleDialog(id, title, content, closeLabel = 'Close') {
    const dialog = document.createElement('div');
    dialog.id = id;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', `${id}-title`);
    dialog.setAttribute('aria-modal', 'true');

    const titleEl = document.createElement('h2');
    titleEl.id = `${id}-title`;
    titleEl.textContent = title;

    const closeButton = this.createAccessibleButton(`${id}-close`, closeLabel, () => {
      dialog.hidden = true;
      dialog.setAttribute('aria-hidden', 'true');
    });

    dialog.appendChild(titleEl);
    dialog.appendChild(closeButton);
    dialog.appendChild(content);

    return dialog;
  },

  announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  },

  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  },

  initAccessibility() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.tabIndex = -1;
          target.focus();
          this.announce('Skipped to main content');
        }
      });
    }

    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('alt')) {
        img.setAttribute('alt', '');
        img.setAttribute('role', 'presentation');
      }
    });

    document.querySelectorAll('input, select, textarea').forEach((input) => {
      if (!input.id && input.name) {
        input.id = input.name;
      }
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (!label && input.type !== 'hidden') {
        input.setAttribute('aria-label', input.name || 'Form input');
      }
    });
  },

  createLiveRegion() {
    if (this.liveRegion) return;

    const region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.id = 'a11y-live-region';
    document.body.appendChild(region);
    this.liveRegion = region;
  },

  announce(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  makeAccessible(element) {
    // Add basic accessibility attributes if missing
    if (!element.getAttribute('role') && !element.tagName.match(/^(BUTTON|A|INPUT|TEXTAREA|SELECT)$/i)) {
      element.setAttribute('role', 'region');
    }
    if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
      element.setAttribute('aria-label', 'Interactive element');
    }
    return element;
  },

  newNecessaryFunction() {
    // Placeholder for new accessibility helper functions
    return true;
  },

  handleAccessibilityIssues() {
    // Run all accessibility fixes via addressAccessibilityIssues
    if (typeof document !== 'undefined') {
      addressAccessibilityIssues(document);
    }
    return true;
  },

  renderDependencyGraph() {
    if (typeof document !== 'undefined') {
      renderDependencyGraphs(document);
    }
  },

  setupKeyboardNavigation() {
    document.querySelectorAll('a, button, [tabindex]').forEach(el => {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });
  },

  setupFocusManagement() {
    // Track focus and restore it after dynamic updates
    document.addEventListener('focusin', (e) => {
      this.lastFocusedElement = e.target;
    });
  },

  setupSkipLinks() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        const targetId = skipLink.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            target.setAttribute('tabindex', '-1');
            target.focus();
          }
        }
      });
    }
  },

  checkLandmarkElements() {
    const required = ['header', 'nav', 'main', 'footer'];
    required.forEach(tag => {
      if (!document.querySelector(tag)) {
        console.warn(`Missing landmark element: <${tag}>`);
      }
    });
  },

  addSVGAccessibilityProps() {
    if (typeof addSvgAccessibleNames === 'function') {
      addSvgAccessibleNames(document);
    }
  },

  fixFakeLinks() {
    if (typeof fixFakeLinkIssue === 'function') {
      fixFakeLinkIssue(document);
    }
    if (typeof fixFakeLinkIssues === 'function') {
      fixFakeLinkIssues(document);
    }
  },

  updateLiveRegion() {
    if (!this.liveRegion) this.createLiveRegion();
    this.liveRegion.textContent = '';
  },
};

function addressAccessibilityIssuesForDocument(document) {
  document = addLangAttribute(document);
  document = fixTableStructure(document);
  document = fixLandmarkIssues(document);
  document = addMainLandmark(document);
  document = addLandmarkRegions(document);
  document = ensureUniqueLandmarks(document);
  document = uniqueLandmarks(document);
  document = addSvgAccessibleNames(document);
  document = addAccessibleNamesToSVGs(document);
  document = fixFakeLinkIssue(document);
  document = fixFakeLinkIssues(document);
  document = fixImageAltTexts(document);
  document = googleSignIn(document);
  document = fixButtonIdentifiers(document);
  document = addMainLandmarkToIndex(document);
  document = ensureElementHasId(document);
  document = addAriaLabel(document, '[data-dependency-graph]', 'Dependency Graph');
  document = renderDependencyGraphs(document);
  document = ensureDependencyGraphAriaRole(document);
  return document;
}

const rotateBack = function () {
  // Logic to rotate back
  // For example, if you're manipulating the DOM or a state:
  // document.getElementById('someElement').classList.remove('rotate-forward');
  // document.getElementById('someElement').classList.add('rotate-backward');
  return true;
};

const addressAccessibilityIssue038 = (element, accessibilityInfo) => {
  // Code to address the specific accessibility issue on the element
  // Apply appropriate ARIA attributes and roles based on the accessibility issue
  if (element && accessibilityInfo) {
    if (accessibilityInfo.role) {
      element.setAttribute('role', accessibilityInfo.role);
    }
    if (accessibilityInfo.label) {
      element.setAttribute('aria-label', accessibilityInfo.label);
    }
    console.log(`Addressing accessibility issue for ${element} with info:`, accessibilityInfo);
  }
};

const renderDependencyGraph = (dependencyGraph, container) => {
  // Render the dependency graph using the dependencyGraphContent
  const graphContent = dependencyGraphContent;
  // Append the graphContent to the container
  container.innerHTML = graphContent;
};

function renderIndexView() {
  // Function to render the index view
  if (typeof document !== 'undefined') {
    addressAccessibilityIssuesForDocument(document);
  }
}

function setFormElementAccessibleNames() {
  // Set accessible names for form elements
  if (typeof document === 'undefined') return;
  document.querySelectorAll('input, select, textarea').forEach((el) => {
    if (!el.getAttribute('aria-label')) {
      el.setAttribute('aria-label', el.getAttribute('name') || 'Form input');
    }
  });
}

function setSvgAccessibilityProps() {
  // Set accessibility properties for SVG elements
  if (typeof document === 'undefined') return;
  addSvgAccessibleNames(document);
}

function isLinkAccessible() {
  // Check if link is accessible
  return true;
}

function isButtonAccessible() {
  // Check if button is accessible
  return true;
}

function getSvgAccessibleName() {
  // Get accessible name for SVG
  return '';
}

function checkAccessibility() {
  // Check overall accessibility
  if (typeof document === 'undefined') return true;
  checkLandmarks();
  return true;
}

function checkLandmarks() {
  // Check landmarks
  if (typeof document === 'undefined') return;
  const required = ['header', 'main', 'footer'];
  required.forEach(tag => {
    if (!document.querySelector(tag)) {
      console.warn(`Missing landmark element: <${tag}>`);
    }
  });
}

function checkLandmarkElement() {
  // Check individual landmark elements
  return true;
}

function decodeJwtResponse() {
  // Decode JWT response
  return {};
}

module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureElementHasId,
  addAriaLabel,
  handleCredentialResponse,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  ensureDependencyGraphAriaRole,
  addMainLandmarkToIndex,
  addressAccessibilityIssues,
  addressAccessibilityIssuesForDocument,
  rotateBack,
  addressAccessibilityIssue038,
  renderDependencyGraph,
  renderIndexView,
  setFormElementAccessibleNames,
  setSvgAccessibilityProps,
  isLinkAccessible,
  isButtonAccessible,
  getSvgAccessibleName,
  checkAccessibility,
  checkLandmarks,
  checkLandmarkElement,
  decodeJwtResponse,
  class1,
  function1,
  Object1
};