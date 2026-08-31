// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs

// New function to ensure proper ARIA role for dependencyGraph container
function setARIARoleForDependencyGraph() {
    const dependencyGraphContainer = document.getElementById('dependencyGraph');
    if (dependencyGraphContainer) {
        dependencyGraphContainer.setAttribute('role', 'region');
    }
}

/**
 * Main application entry point with accessibility features
 */
function init() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach((svg) => {
    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }

    setSvgAttributes(svg);
  });

  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();

  // Address accessibility issues from insight report:
  // Ensure the dependencyGraph container has a proper ARIA role
  setARIARoleForDependencyGraph();

  // REACT_015: Add lang attribute to HTML element
  const addLangAttribute = () => {
    if (typeof document !== 'undefined') {
      const htmlElement = document.documentElement;
      htmlElement.setAttribute('lang', 'en'); // Use expected value here instead of a function return
    }
  };

  // REACT_027: Fix 26 table structure issues
  const fixTableStructure = () => {
    if (typeof document !== 'undefined') {
      const tables = document.querySelectorAll('table');
      tables.forEach(table => {
        if (!table.getAttribute('role')) {
          table.setAttribute('role', 'table');
        }
        const captions = table.querySelectorAll('caption');
        if (captions.length === 0) {
          const newCaption = document.createElement('caption');
          table.insertBefore(newCaption, table.firstChild);
        }
      });
    }
  };

  // REACT_017: Add/fix 4 landmark issues
  const fixLandmarkIssues = () => {
    if (typeof document !== 'undefined') {
      const navs = document.querySelectorAll('nav');
      navs.forEach(nav => {
        nav.setAttribute('role', 'navigation');
      });
    }
  };

  // REACT_017: Add main landmark
  const addMainLandmark = () => {
    if (typeof document !== 'undefined') {
      const mains = document.querySelectorAll('main');
      mains.forEach(main => {
        main.setAttribute('role', 'main');
      });
    }
  };

  // REACT_017: Add landmark regions
  const addLandmarkRegions = () => {
    if (typeof document !== 'undefined') {
      const asides = document.querySelectorAll('aside');
      asides.forEach(aside => {
        if (!aside.getAttribute('role')) {
          aside.setAttribute('role', 'complementary');
        }
      });

      const headers = document.querySelectorAll('header');
      headers.forEach(header => {
        if (!header.getAttribute('role')) {
          header.setAttribute('role', 'banner');
        }
      });
    }
  };

  // REACT_025: Ensure unique landmarks
  const ensureUniqueLandmarks = () => {
    if (typeof document !== 'undefined') {
      const regions = document.querySelectorAll('[role]');
      const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
      const landmarkCounts = {};

      regions.forEach(region => {
        const role = region.getAttribute('role');
        if (landmarkRoles.includes(role)) {
          landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;
        }
      });

      // Warn about duplicate landmarks
      Object.entries(landmarkCounts).forEach(([role, count]) => {
        if (count > 1) {
          console.warn(`Accessibility: Multiple landmarks with role="${role}" found (${count}). Consider using aria-label or aria-labelledby to distinguish them.`);
        }
      });
    }
  };

  // REACT_041: Add accessible names to 2 SVGs
  const addSvgAccessibleNames = () => {
    if (typeof document !== 'undefined') {
      const svgs = document.querySelectorAll('svg');
      svgs.forEach((svg, index) => {
        if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
          svg.setAttribute('role', 'img');
          svg.setAttribute('aria-label', `Graphic ${index + 1}`);
        }
      });
    }
  };

  // REACT_036: Fix 1 fake link issue
  const fixFakeLinkIssue = () => {
    if (typeof document !== 'undefined') {
      const spans = document.querySelectorAll('span[role="button"], span[onclick], a[href="#"]');
      spans.forEach(span => {
        span.setAttribute('tabindex', '0');
        span.setAttribute('role', 'button');
        if (!span.hasAttribute('aria-label') && !span.textContent.trim()) {
          span.setAttribute('aria-label', 'Button');
        }
      });
    }
  };

  // REACT_037: Google sign-in logic
  const googleSignIn = () => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: 'your-client-id.apps.googleusercontent.com',
        callback: (response) => {
          console.log('Google sign-in response:', response);
        }
      });
    }
  };

  // REACT_040: Replace my-button with actual button id for accessibility
  const fixButtonIdentifiers = () => {
    if (typeof document !== 'undefined') {
      const myButtons = document.querySelectorAll('my-button');
      myButtons.forEach(button => {
        const newButton = document.createElement('button');
        if (button.id) {
          newButton.id = button.id;
        } else {
          newButton.id = `btn-${Math.random().toString(36).substr(2, 9)}`;
        }
        // Copy attributes
        Array.from(button.attributes).forEach(attr => {
          if (attr.name !== 'id') {
            newButton.setAttribute(attr.name, attr.value);
          }
        });
        while (button.firstChild) {
          newButton.appendChild(button.firstChild);
        }
        button.parentNode.replaceChild(newButton, button);
      });
    }
  };

  // REACT_042: Ensure dependencyGraph container has proper ARIA role
  const dependencyGraphContainer = () => {
    if (typeof document !== 'undefined') {
      const containers = document.querySelectorAll('[id="dependencyGraph"], .dependencyGraph, [data-dependency-graph]');
      containers.forEach(container => {
        if (!container.getAttribute('role')) {
          container.setAttribute('role', 'region');
        }
        if (!container.getAttribute('aria-label') && !container.getAttribute('aria-labelledby')) {
          container.setAttribute('aria-label', 'Dependency Graph');
        }
      });
    }
  };

  // ADD: New function for handling the new accessibility issues from the insight report
  function addressNewAccessibilityIssues() {
    // ... code to handle the new accessibility issues
    addLangAttribute();
    fixTableStructure();
    validateLandmark();
    validateLandmarkStructure();
    getSvgAccessibleName();
    fixFakeLinkIssue();
    fixButtonIdentifiers();
    dependencyGraphContainer();
  }

  /**
   * Function to address accessibility issues from an insight report.
   * This function should implement the logic to take an insight report and apply fixes based on the report's findings.
   *
   * @param {Object} insightReport - An object containing details about the accessibility issues.
   * @returns {void}
   */
  function addressAccessibilityInsights(insightReport) {
    // Process the insight report and apply fixes based on findings.
    // For now, we call the existing function that applies all fixes.
    // In the future, this could use the insight report to apply specific fixes.
    console.log('Processing accessibility insights report:', insightReport);
    addressNewAccessibilityIssues();
  }

  // Call the additional accessibility functions
  addLangAttribute();
  fixTableStructure();
  fixLandmarkIssues();
  addMainLandmark();
  addLandmarkRegions();
  ensureUniqueLandmarks();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
  fixButtonIdentifiers();
  dependencyGraphContainer();
}

function main() {
  init();
}

function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }
  const desc = svg.querySelector('desc');
  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || '';
}

function setSvgAttributes(svg) {
  if (!svg.hasAttribute('aria-hidden')) {
    svg.setAttribute('aria-hidden', 'true');
  }
}

// Function for checking table structure
const checkTableStructure = (table) => {
  if (!table) return false;
  const rows = table.querySelectorAll('tr');
  return rows.length > 0;
};

function getVersion() {
  const fs = require('fs');
  const packageJsonPath = require('path').join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

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
    modal.addEventListener('keydown', trapFocus);
  });

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]'
  );
  interactiveElements.forEach((element) => {
    if (!element.getAttribute('tabindex')) {
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
  const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
  inputs.forEach((input) => {
    const id = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    input.id = id;
    if (!input.hasAttribute('aria-label') && !document.querySelector(`label[for="${id}"]`)) {
      input.setAttribute('aria-label', input.name || 'Input');
    }
  });
}

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
  const packageJsonPath = require('path').join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  return {
    dependencies: Object.keys(dependencies).length,
    devDependencies: Object.keys(devDependencies).length,
    total: Object.keys(dependencies).length + Object.keys(devDependencies).length
  };
}

// Ensure DOM is fully loaded before executing scripts
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment - setup basic exports
  module.exports = {
    checkTableStructure,
    countDependencies,
    init,
    setupAriaLiveRegions,
    setupFocusManagement,
    enhanceSemanticMarkup,
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
    addLangAttribute,
    handleCredentialResponse,
    sampleInsightReport
  };
} else {
  // Browser environment - wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}