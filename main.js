// TODO: This is the existing code that needs to be preserved

/**
 * Accessibility improvements for main.js
 * Addressing issues from insight report
 */

/**
 * REACT_015: Add lang attribute to HTML element
 * @param {Document} doc - The document object
 * @param {string} lang - The language code (e.g., 'en', 'es')
 */
function addLangAttribute(doc, lang = 'en') {
  if (doc && doc.documentElement) {
    doc.documentElement.lang = lang;
  }
}

/**
 * REACT_027: Fix table structure issues
 * Ensures tables have proper semantic structure with thead, tbody, and captions
 * @param {Document|string} containerOrDoc - Container element or document
 */
function fixTableStructure(containerOrDoc) {
  const container = typeof containerOrDoc === 'string' 
    ? document.querySelector(containerOrDoc) 
    : containerOrDoc;
  
  if (!container) return;
  
  const tables = container.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, table.firstChild);
        firstRow.remove();
      }
    }
    
    if (!table.querySelector('tbody')) {
      const tbody = document.createElement('tbody');
      const rows = Array.from(table.querySelectorAll('tr'));
      rows.forEach(row => tbody.appendChild(row));
      table.appendChild(tbody);
    }
    
    if (!table.querySelector('caption') && !table.getAttribute('aria-label')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
    }
  });
}

/**
 * REACT_017: Add/fix landmark issues
 * @param {Document|string} containerOrDoc - Container element or document
 */
function fixLandmarkIssues(containerOrDoc) {
  const container = typeof containerOrDoc === 'string' 
    ? document.querySelector(containerOrDoc) 
    : containerOrDoc;
  
  if (container) {
    addMainLandmark(container);
    addLandmarkRegions(container);
    ensureUniqueLandmarks(container);
  }
}

/**
 * Add main landmark to the main content area
 * @param {Element} container - The container element
 */
function addMainLandmark(container) {
  const mainElements = container.querySelectorAll('main');
  mainElements.forEach(main => {
    if (!main.id) {
      main.id = 'main-content';
    }
    main.setAttribute('role', 'main');
  });
}

/**
 * Add landmark regions for proper navigation
 * @param {Element} container - The container element
 */
function addLandmarkRegions(container) {
  const regions = [
    { selector: 'header', role: 'banner' },
    { selector: 'nav', role: 'navigation' },
    { selector: 'footer', role: 'contentinfo' }
  ];
  
  regions.forEach(({ selector, role }) => {
    const elements = container.querySelectorAll(selector);
    elements.forEach((el, index) => {
      if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
        el.setAttribute('aria-label', `${role} ${index + 1}`);
      }
      if (!el.getAttribute('role')) {
        el.setAttribute('role', role);
      }
    });
  });
}

/**
 * REACT_025: Ensure unique landmarks
 * @param {Element} container - The container element
 */
function ensureUniqueLandmarks(container) {
  uniqueLandmarks(container);
}

/**
 * Make landmark names unique within the document
 * @param {Element} container - The container element
 */
function uniqueLandmarks(container) {
  const landmarkTypes = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  
  landmarkTypes.forEach(role => {
    const landmarks = container.querySelectorAll(`[role="${role}"]`);
    landmarks.forEach((landmark, index) => {
      if (!landmark.id) {
        landmark.id = `${role}-${index + 1}`;
      }
      if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
        const label = document.createElement('span');
        label.id = `${role}-label-${index + 1}`;
        label.textContent = `${role.charAt(0).toUpperCase() + role.slice(1)} region ${index + 1}`;
        label.style.display = 'none';
        landmark.appendChild(label);
        landmark.setAttribute('aria-labelledby', label.id);
      }
    });
  });
}

/**
 * REACT_041: Add accessible names to SVGs
 * @param {Document|string} containerOrDoc - Container element or document
 */
function addSvgAccessibleNames(containerOrDoc) {
  addAccessibleNamesToSVGs(containerOrDoc);
}

/**
 * Add accessible names to SVG elements
 * @param {Document|string} containerOrDoc - Container element or document
 */
function addAccessibleNamesToSVGs(containerOrDoc) {
  const container = typeof containerOrDoc === 'string' 
    ? document.querySelector(containerOrDoc) 
    : (containerOrDoc.documentElement || containerOrDoc);
  
  if (!container) return;
  
  const svgs = container.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby') && !svg.getAttribute('title')) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
}

/**
 * REACT_036: Fix fake link issue
 * @param {Document|string} containerOrDoc - Container element or document
 */
function fixFakeLinkIssue(containerOrDoc) {
  fixFakeLinkIssues(containerOrDoc);
}

/**
 * Fix elements that look like links but aren't
 * @param {Document|string} containerOrDoc - Container element or document
 */
function fixFakeLinkIssues(containerOrDoc) {
  const container = typeof containerOrDoc === 'string' 
    ? document.querySelector(containerOrDoc) 
    : containerOrDoc;
  
  if (!container) return;
  
  const fakeLinks = container.querySelectorAll('[role="link"], a[href=""], a[href="#"]');
  fakeLinks.forEach(link => {
    if (link.tagName !== 'A') {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
    }
  });
}

/**
 * REACT_037: Google sign-in logic
 * @param {Object} options - Google sign-in options
 */
function googleSignIn(options = {}) {
  const defaultOptions = {
    clientId: '',
    scope: 'profile email',
    prompt: 'select_account'
  };
  
  const config = { ...defaultOptions, ...options };
  
  return {
    initialize: function() {
      if (typeof window !== 'undefined' && window.gapi) {
        window.gapi.load('auth2', () => {
          window.gapi.auth2.init(config);
        });
      }
    },
    
    signIn: async function() {
      const auth2 = window.gapi?.auth2?.getAuthInstance();
      if (auth2) {
        try {
          const user = await auth2.signIn();
          return { success: true, user };
        } catch (error) {
          return { success: false, error };
        }
      }
      return { success: false, error: 'Google Auth not initialized' };
    },
    
    signOut: async function() {
      const auth2 = window.gapi?.auth2?.getAuthInstance();
      if (auth2) {
        try {
          await auth2.signOut();
          return { success: true };
        } catch (error) {
          return { success: false, error };
        }
      }
      return { success: false, error: 'Google Auth not initialized' };
    }
  };
}

/**
 * REACT_040: Replace my-button with actual button id for accessibility
 * @param {Document|string} containerOrDoc - Container element or document
 */
function fixButtonIdentifiers(containerOrDoc) {
  const container = typeof containerOrDoc === 'string' 
    ? document.querySelector(containerOrDoc) 
    : containerOrDoc;
  
  if (!container) return;
  
  const buttons = container.querySelectorAll('button[id="my-button"], [id="my-button"]');
  buttons.forEach((button, index) => {
    if (button.tagName !== 'BUTTON' && button.getAttribute('role') === 'button') {
      button.setAttribute('role', 'button');
    }
    if (button.id === 'my-button') {
      button.id = `accessible-button-${Date.now()}-${index}`;
    }
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', `Button ${index + 1}`);
    }
  });
  
  const anchors = container.querySelectorAll('a[id="my-button"]');
  anchors.forEach((anchor, index) => {
    if (anchor.id === 'my-button') {
      anchor.id = `accessible-link-button-${Date.now()}-${index}`;
    }
  });
}

/**
 * Ensure dependencyGraph container has proper ARIA role
 * @param {Document|string} containerOrDoc - Container element or document
 * @param {string} graphId - The ID of the dependency graph container
 */
function ensureDependencyGraphAriaRole(containerOrDoc, graphId = 'dependencyGraph') {
  const container = typeof containerOrDoc === 'string' 
    ? document.querySelector(containerOrDoc) 
    : containerOrDoc;
  
  if (!container) return;
  
  const graphContainer = container.querySelector(`#${graphId}`);
  if (graphContainer) {
    graphContainer.setAttribute('role', 'img');
    if (!graphContainer.getAttribute('aria-label')) {
      graphContainer.setAttribute('aria-label', 'Dependency graph visualization');
    }
    if (!graphContainer.getAttribute('aria-describedby')) {
      const descId = `${graphId}-desc`;
      let desc = container.querySelector(`#${descId}`);
      if (!desc) {
        desc = document.createElement('div');
        desc.id = descId;
        desc.style.display = 'none';
        desc.textContent = 'This diagram shows the dependencies between project components.';
        container.appendChild(desc);
      }
      graphContainer.setAttribute('aria-describedby', descId);
    }
  }
}

/**
 * Initialize all accessibility improvements
 * @param {Object} options - Configuration options
 */
function initializeAccessibility(options = {}) {
  const doc = options.document || document;
  const container = options.container ? doc.querySelector(options.container) : doc.body;
  
  if (!container) return;
  
  // Apply all accessibility fixes
  addLangAttribute(doc, options.lang || 'en');
  fixTableStructure(container);
  fixLandmarkIssues(container);
  addSvgAccessibleNames(container);
  fixFakeLinkIssues(container);
  fixButtonIdentifiers(container);
  
  if (options.dependencyGraphId) {
    ensureDependencyGraphAriaRole(container, options.dependencyGraphId);
  }
  
  if (options.googleSignIn) {
    return googleSignIn(options.googleSignIn);
  }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addLangAttribute,
    fixTableStructure,
    fixLandmarkIssues,
    addMainLandmark,
    addLandmarkRegions,
    ensureUniqueLandmarks,
    uniqueLandmarks,
    addSvgAccessibleNames,
    addAccessibleNamesToSVGs,
    fixFakeLinkIssue,
    fixFakeLinkIssues,
    googleSignIn,
    fixButtonIdentifiers,
    ensureDependencyGraphAriaRole,
    initializeAccessibility
  };
}