// main.js - Accessibility-focused implementation

/**
 * Main application entry point with accessibility features
 */
function mainApp() {
  const accessibleName = getAccessibleName();
  if (accessibleName) {
    // Use accessibleName
  }

  setSvgAttributes(svgElements);
}

function checkLandmarkElements() {
  // New function to check landmark elements
  // Placeholder implementation
  console.log('Checking landmark elements...');
}

// Export the new function (both versions agreed to do this)
export { checkLandmarkElements };

const sampleInsightReport = {
  title: 'Quarterly Performance Report',
  sections: [
    {
      heading: 'Sales Overview',
      content: 'Total sales increased by 15% compared to last quarter.'
    },
    {
      heading: 'Customer Satisfaction',
      content: 'Average satisfaction score: 4.2 out of 5.'
    }
  ]
};

function countDependencies() {
  const fs = require('fs');
  const packageJsonPath = './package.json';
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  return {
    dependencies: Object.keys(dependencies),
    devDependencies: Object.keys(devDependencies),
    total: Object.keys(dependencies).length + Object.keys(devDependencies).length
  };
}

/**
 * Handle credential response from browser authentication
 * @param {Object} response - The credential response object
 * @returns {Object} Processed credential information
 */
function handleCredentialResponse(response) {
  if (!response) {
    return { success: false, error: 'No credential response provided' };
  }

  // Check if response contains expected credential data
  const hasCredential = response.credential || response.token || response.id;
  
  if (!hasCredential) {
    return { success: false, error: 'Invalid credential response format' };
  }

  // Process credential information
  const processedCredential = {
    id: response.id || null,
    token: response.token || response.credential || null,
    name: response.name || 'Anonymous User',
    email: response.email || null,
    success: true
  };

  // Handle different types of credential responses
  if (response.credential) {
    // Google Sign-In response
    try {
      // Credential is a base64-encoded JWT
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      processedCredential.id = payload.sub || processedCredential.id;
      processedCredential.email = payload.email || processedCredential.email;
      processedCredential.name = payload.name || processedCredential.name;
    } catch (error) {
      console.warn('Failed to parse credential response:', error);
    }
  }

  // Announce success to screen readers
  if (typeof announceToScreenReader === 'function') {
    announceToScreenReader('User successfully authenticated');
  }

  return processedCredential;
}

// Ensure DOM is fully loaded before executing scripts
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment - setup basic exports
  module.exports = {
    checkTableStructure,
    countDependencies,
    init,
    processSvgElements,
    setupAriaLiveRegions,
    setupFocusManagement,
    enhanceSemanticMarkup,
    setupKeyboardNavigation,
    trapFocus,
    handleKeyNavigation,
    closeOpenDialogs,
    announceToScreenReader,
    calculateDifference,
    calculateProduct,
    isNumber,
    clamp,
    hello,
    getVersion,
    getConfig,
    addressAccessibilityIssues,
    generateAccessibilityReport,
    calculateAccessibilityScore,
    validateLandmark,
    spawnSomeCommand,
    createInPageButton,
    validateLinkAccessibility,
    handleFakeLinks,
    addLangAttribute,
    addDocumentLangAttribute,
    handleCredentialResponse,
    getSvgAccessibleName,
    setSvgAttributes,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmarkStructure,
    getSvgAccessibleNames,
    checkLandmarkElements,
    createResourceButton,
    renderDependencyGraph,
    displayModuleStructure,
    newFunction,
    MyComponent,
    getLangAttribute,
    fixMainLandmarkIssues,
    AddressabilityIssues
  };
} else {
  // Browser environment - wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

function init() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach((svg) => {
    // Helper function to process SVG elements
    processSvgElements();
    setSvgAttributes(svg);
    setupFocusManagement();
    setupAriaLiveRegions();
  });
}

function processSvgElements() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }
    setSvgAttributes(svg);

    setupFocusManagement();
    setupAriaLiveRegions();
  });
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.getAttribute('title') || '';
}

function setSvgAttributes(svg) {
  if (!svg) return;
  // Set necessary attributes for accessibility
  if (!svg.hasAttribute('focusable')) {
    svg.setAttribute('focusable', 'false');
  }
  if (!svg.hasAttribute('width') && svg.hasAttribute('viewBox')) {
    svg.setAttribute('width', '24');
  }
  if (!svg.hasAttribute('height') && svg.hasAttribute('viewBox')) {
    svg.setAttribute('height', '24');
  }
}

// Check table structure function
const checkTableStructure = function(tableElement) {
  if (!tableElement) {
    return { valid: false, error: 'Table element is required' };
  }

  const hasHeader = tableElement.querySelector('thead') !== null || tableElement.querySelector('th') !== null;
  const hasBody = tableElement.querySelector('tbody') !== null;
  const hasCaption = tableElement.querySelector('caption') !== null;

  return {
    valid: true,
    hasHeader,
    hasBody,
    hasCaption
  };
};

function getVersion() {
  const fs = require('fs');
  const packageJsonPath = './package.json';
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

function getConfig() {
  return {
    appName: 'Screeps',
    version: getVersion()
  };
}

function addressAccessibilityIssues(issues) {
  return issues.map(issue => {
    return {
      ...issue,
      fixApplied: true,
      status: 'fixed'
    };
  });
}

function generateAccessibilityReport(accessibilityReport) {
  if (!accessibilityReport || !Array.isArray(accessibilityReport.issues)) {
    return [];
  }

  const report = accessibilityReport.issues.map(issue => ({
    issueType: issue.type,
    status: issue.status || 'pending',
    fixApplied: issue.fixApplied || ''
  }));

  return report;
}

function calculateAccessibilityScore(fixedIssues) {
  if (!Array.isArray(fixedIssues)) {
    return 0;
  }

  const scorePoints = {
    'color-contrast': 5,
    'missing-alt-text': 3,
    'missing-aria-label': 5,
    'heading-order': 2,
    'other': 1
  };

  return fixedIssues.reduce((score, issue) => {
    const points = scorePoints[issue.type] || scorePoints['other'];
    return score + points;
  }, 0);
}

function validateLandmark(element) {
  if (!element) {
    return { valid: false, error: 'Element is required' };
  }

  const tagName = element.tagName ? element.tagName.toLowerCase() : element.tagName;

  const implicitLandmarks = {
    'header': 'banner',
    'main': 'main',
    'nav': 'navigation',
    'aside': 'complementary',
    'footer': 'contentinfo',
    'section': 'region',
    'form': 'form'
  };

  let landmarkRole = element.getAttribute ? element.getAttribute('role') : element.role;

  if (!landmarkRole) {
    if (implicitLandmarks[tagName]) {
      landmarkRole = implicitLandmarks[tagName];
    } else {
      return { valid: false, error: 'No landmark role found' };
    }
  }

  if (!Array.from(document.querySelectorAll(`[role="${landmarkRole}"]`)).includes(element)) {
    return {
      valid: false,
      error: `Landmark with role "${landmarkRole}" should be immediate child of ${tagName}`,
      element: tagName
    };
  }

  return { valid: true, role: landmarkRole };
}

function spawnSomeCommand() {
  console.log('Spawning command...');
}

function addLangAttribute(htmlElement) {
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

function setupAriaLiveRegions() {
  const liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    const region = document.createElement('div');
    region.id = 'aria-live-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }
}

function setupFocusManagement() {
  // Trap focus within modal dialogs
  const modals = document.querySelectorAll('[role="dialog"]');
  modals.forEach((modal) => {
    trapFocus(modal);
  });

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]'
  );
  interactiveElements.forEach((element) => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
}

function enhanceSemanticMarkup() {
  // Add skip link if not present
  if (!document.getElementById('skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.position = 'absolute';
    skipLink.style.left = '-9999px';
    skipLink.style.top = '0';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Ensure images have alt attributes
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
    }
  });

  // Ensure form inputs have associated labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const id = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    input.id = id;
    if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
      input.setAttribute('aria-label', input.name || 'Input');
    }
  });
}

function trapFocus(element) {
  if (!element) return;
  
  const focusableElements = element.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });
}

function closeOpenDialogs() {
  const openDialogs = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
  openDialogs.forEach((dialog) => {
    dialog.setAttribute('aria-hidden', 'true');
  });
}

function announceToScreenReader(message) {
  const liveRegion = document.getElementById('aria-live-region');
  if (liveRegion) {
    liveRegion.textContent = '';
    // Slight delay to ensure screen readers pick up the change
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }
}

function calculateDifference(a, b) {
  return a - b;
}

function calculateProduct(a, b) {
  return a * b;
}

function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createInPageButton(buttonId, buttonText) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = 'in-page-button';
  return button;
}

function handleKeyNavigation(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    const target = event.target;
    if (target.getAttribute('role') === 'button') {
      target.click();
    }
  }
}

function setupKeyboardNavigation() {
  // Set up keyboard navigation handlers
  document.addEventListener('keydown', handleKeyNavigation);
}

function handleFakeLinks() {
  // Function to handle fake links (links without proper href)
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"], a[href="javascript:;"]');
  fakeLinks.forEach(link => {
    const button = document.createElement('button');
    button.innerHTML = link.innerHTML;
    Array.from(link.attributes).forEach(attr => {
      if (attr.name !== 'href') {
        button.setAttribute(attr.name, attr.value);
      }
    });
    if (!button.hasAttribute('role')) {
      button.setAttribute('role', 'button');
    }
    link.parentNode.replaceChild(button, link);
  });
}

function validateLinkAccessibility(link) {
  if (!link) return { valid: false, error: 'Link is required' };
  
  const href = link.getAttribute('href');
  const hasValidHref = href && href !== '#' && !href.startsWith('javascript:');
  
  return {
    valid: hasValidHref,
    error: hasValidHref ? null : 'Link has an invalid or fake href'
  };
}

function addDocumentLangAttribute() {
  if (!document.documentElement.hasAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
}

function validateTableAccessibility(tableElement) {
  const results = {
    hasCaption: false,
    hasHeaders: false,
    hasScope: false,
    issues: []
  };

  if (!tableElement) return results;

  const caption = tableElement.querySelector('caption');
  results.hasCaption = !!caption;

  const headers = tableElement.querySelectorAll('th');
  results.hasHeaders = headers.length > 0;

  headers.forEach(th => {
    if (th.hasAttribute('scope')) {
      results.hasScope = true;
    } else {
      results.issues.push({ type: 'missing-scope', element: th });
    }
  });

  return results;
}

function validateTableStructure(tableElement) {
  if (!tableElement) {
    return { valid: false, error: 'Table element is required' };
  }

  const hasHeader = tableElement.querySelector('thead') !== null || tableElement.querySelector('th') !== null;
  const hasBody = tableElement.querySelector('tbody') !== null;
  const hasCaption = tableElement.querySelector('caption') !== null;

  return {
    valid: true,
    hasHeader,
    hasBody,
    hasCaption
  };
}

function validateLandmarkStructure(container) {
  const landmarks = {
    banner: [],
    main: [],
    navigation: [],
    contentinfo: [],
    complementary: [],
    other: []
  };

  const elements = container ? container.querySelectorAll('[role], header, main, nav, aside, footer') : [];

  elements.forEach(el => {
    const role = el.getAttribute('role') || el.tagName.toLowerCase();
    if (landmarks[role]) {
      landmarks[role].push(el);
    } else if (role !== 'main') {
      landmarks.other.push(el);
    }
  });

  return {
    landmarks,
    isValid: landmarks.main.length === 1,
    error: landmarks.main.length !== 1 ? 'Page must have exactly one main landmark' : null
  };
}

function getSvgAccessibleNames(container) {
  const svgs = container ? container.querySelectorAll('svg') : document.querySelectorAll('svg');
  return Array.from(svgs).map(svg => {
    return {
      element: svg,
      accessibleName: svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.getAttribute('title') || ''
    };
  });
}

function createResourceButton(resourceId, resourceName) {
  const button = document.createElement('button');
  button.id = `resource-${resourceId}`;
  button.textContent = resourceName;
  button.className = 'resource-button';
  button.setAttribute('aria-label', `Access ${resourceName}`);
  return button;
}

function renderDependencyGraph(dependencies) {
  const container = document.createElement('div');
  container.setAttribute('role', 'img');
  container.setAttribute('aria-label', 'Dependency graph');
  container.className = 'dependency-graph';

  const list = document.createElement('ul');
  dependencies.forEach(dep => {
    const item = document.createElement('li');
    item.textContent = dep;
    list.appendChild(item);
  });

  container.appendChild(list);
  return container;
}

function displayModuleStructure(modules) {
  const container = document.createElement('div');
  container.className = 'module-structure';

  modules.forEach(mod => {
    const section = document.createElement('section');
    section.setAttribute('role', 'region');
    section.setAttribute('aria-labelledby', `module-${mod.name}`);

    const heading = document.createElement('h2');
    heading.id = `module-${mod.name}`;
    heading.textContent = mod.name;
    section.appendChild(heading);

    if (mod.exports && mod.exports.length > 0) {
      const exportsList = document.createElement('ul');
      mod.exports.forEach(exp => {
        const li = document.createElement('li');
        li.textContent = exp;
        exportsList.appendChild(li);
      });
      section.appendChild(exportsList);
    }

    container.appendChild(section);
  });

  return container;
}

function newFunction() {
  console.log('New function implementation');
}

class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupAccessibility();
  }

  render() {
    this.shadowRoot.innerHTML = '<div part="container"><slot></slot></div>';
  }

  setupAccessibility() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'region');
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }
}

function getLangAttribute(element) {
  return element ? element.getAttribute('lang') : null;
}

// Utilities for addressing accessibility issues
const AddressabilityIssues = {
  addressAccessibilityIssues,

  generateAccessibilityReport(accessibilityReport) {
    if (!accessibilityReport || !Array.isArray(accessibilityReport.issues)) {
      return [];
    }

    const report = accessibilityReport.issues.map(issue => ({
      issueType: issue.type,
      status: issue.status || 'pending',
      fixApplied: issue.fixApplied || ''
    }));

    return report;
  },

  calculateAccessibilityScore(fixedIssues) {
    if (!Array.isArray(fixedIssues)) {
      return 0;
    }

    const scorePoints = {
      'color-contrast': 5,
      'missing-alt-text': 3,
      'missing-aria-label': 5,
      'heading-order': 2,
      'other': 1
    };

    return fixedIssues.reduce((score, issue) => {
      const points = scorePoints[issue.type] || scorePoints['other'];
      return score + points;
    }, 0);
  },

  fixFakeLinkIssue(selector) {
    const links = document.querySelectorAll(selector);
    const results = [];

    links.forEach(link => {
      const result = AddressabilityIssues.fixFakeLink(link);
      results.push(result);
    });

    return {
      total: links.length,
      fixed: results.filter(r => r.fixed).length,
      failed: results.filter(r => !r.fixed).length,
      results
    };
  },

  fixFakeLink(link) {
    if (!link) return { fixed: false, error: 'Link is required' };

    const tagName = link.tagName ? link.tagName.toLowerCase() : '';

    if (tagName !== 'a') {
      return { fixed: false, error: 'Element is not an anchor tag' };
    }

    const href = link.getAttribute('href') || '';
    const isFakeLink = href === '#' || href === 'javascript:void(0)' || href === 'javascript:;';

    if (!isFakeLink) {
      return { fixed: false, error: 'Not a fake link' };
    }

    // Convert fake link to button
    const newButton = document.createElement('button');
    newButton.innerHTML = link.innerHTML;

    // Copy relevant attributes except href
    Array.from(link.attributes).forEach(attr => {
      if (attr.name !== 'href') {
        newButton.setAttribute(attr.name, attr.value);
      }
    });

    // Add role="button" if not present
    if (!newButton.hasAttribute('role')) {
      newButton.setAttribute('role', 'button');
    }

    // Replace the fake link with the button
    link.parentNode.replaceChild(newButton, link);

    return { fixed: true };
  },

  fixMainLandmarkIssues(source) {
    const mainBlockRegex = /<main\b[^>]*>([\s\S]*)<\/main>/g;
    const matches = source.matchAll(mainBlockRegex);
    let result = source;
    for (let match of matches) {
      const block = match[1];
      const fixedBlock = block
        .replace(/<main\b([^>]*)>/, '<section$1>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(match[0], fixedBlock);
    }
    return result;
  },

  validateLandmark(element) {
    if (!element) {
      return { valid: false, error: 'Element is required' };
    }

    const tagName = element.tagName ? element.tagName.toLowerCase() : element.tagName;

    const implicitLandmarks = {
      'header': 'banner',
      'main': 'main',
      'nav': 'navigation',
      'aside': 'complementary',
      'footer': 'contentinfo',
      'section': 'region',
      'form': 'form'
    };

    let landmarkRole = element.getAttribute ? element.getAttribute('role') : element.role;

    if (!landmarkRole) {
      if (implicitLandmarks[tagName]) {
        landmarkRole = implicitLandmarks[tagName];
      } else {
        return { valid: false, error: 'No landmark role found' };
      }
    }

    if (!Array.from(document.querySelectorAll(`[role="${landmarkRole}"]`)).includes(element)) {
      return {
        valid: false,
        error: `Landmark with role "${landmarkRole}" should be immediate child of ${tagName}`,
        element: tagName
      };
    }

    return { valid: true, role: landmarkRole };
  },

  ensureUniqueLandmarksFromString(source) {
    const mainBlockRegex = /<main[^>]*>.*?<\/main>/gs;

    const matches = Array.from(source.matchAll(mainBlockRegex));
    if (matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main([^>]*)>/, '<section$1 id="unique-main-release-' + i + '">')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  }
};