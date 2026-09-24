const init = () => {
  addLangAttribute();
  fixTableStructure();
  fixLandmarkIssues();
  ensureUniqueLandmarks();
  addSvgAccessibleNames();
  fixFakeLinkIssues();
  fixButtonIdentifiers();
  ensureDependencyGraphAriaRole();

  // Added functions from the combined source code branches
  countDependencies();
  handleCredentialResponse();

  // Added and modified functions from the newer source code branch
  getSvgAccessibleName;
  setSvgAttributes;
  renderDependencyGraphs;

  // Moved the renderDependencyGraphs function to the init function
};

function addLangAttribute() {
  // Add lang attribute to HTML element if missing
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
}

function fixTableStructure() {
  // Fix table structure issues
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure proper role
    if (!table.hasAttribute('role')) {
      table.setAttribute('role', 'table');
    }
    
    // Ensure caption if missing
    if (!table.querySelector('caption') && table.hasAttribute('aria-label')) {
      const caption = document.createElement('caption');
      caption.textContent = table.getAttribute('aria-label');
      table.insertBefore(caption, table.firstChild);
    }
    
    // Check for proper header structure
    const rows = table.querySelectorAll('tr');
    if (rows.length > 0) {
      const firstRowCells = rows[0].querySelectorAll('td, th');
      let hasHeader = false;
      firstRowCells.forEach(cell => {
        if (cell.tagName === 'TH') hasHeader = true;
      });
      
      if (!hasHeader) {
        firstRowCells.forEach(cell => {
          const th = document.createElement('th');
          th.setAttribute('scope', 'col');
          th.textContent = cell.textContent;
          th.setAttribute('role', 'columnheader');
          cell.parentNode.replaceChild(th, cell);
        });
      }
    }
  });
}

const ensureUniqueLandmarks = () => uniqueLandmarks();

function addMainLandmark() {
  // Ensure main content has proper landmark
  const main = document.querySelector('main');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }
  
  // If no main element exists, create one or use div with role
  if (!main) {
    const mainContent = document.querySelector('#main-content, .main-content, [contentmain]');
    if (mainContent && !mainContent.hasAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }
  }
}

function addLandmarkRegions() {
  // Add landmark roles to common regions
  const regions = {
    'header': 'banner',
    'footer': 'contentinfo',
    'nav': 'navigation',
    'aside': 'complementary',
    'section[aria-label]': 'region',
    'section[aria-labelledby]': 'region'
  };
  
  Object.entries(regions).forEach(([selector, role]) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (!el.hasAttribute('role') && !el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
        el.setAttribute('role', role);
      }
    });
  });
}

function ensureUniqueLandmarks() {
  uniqueLandmarks();
}

function uniqueLandmarks() {
  // Ensure landmarks have unique accessible names if duplicates exist
  const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"]');
  const landmarkCounts = {};
  
  landmarks.forEach(landmark => {
    const type = landmark.getAttribute('role');
    const name = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby') || landmark.tagName.toLowerCase();
    const key = `${type}-${name}`;
    
    if (landmarkCounts[key]) {
      landmarkCounts[key]++;
      // Make unique by adding a suffix
      const uniqueName = `${name} (${landmarkCounts[key]})`;
      landmark.setAttribute('aria-label', uniqueName);
    } else {
      landmarkCounts[key] = 1;
    }
  });
}

function addAccessibleNamesToSVGs() {
  addSvgAccessibleNames();
}

function fixFakeLinkIssues() {
  // Fix fake link issues - elements that look like links but aren't
  const fakeLinks = document.querySelectorAll('.fake-link, [data-fake-link]');
  fakeLinks.forEach(link => {
    // Convert to proper button if it's interactive
    if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
      link.removeAttribute('href');
      if (link.tagName === 'A') {
        const button = document.createElement('button');
        button.innerHTML = link.innerHTML;
        button.addEventListener('click', () => {
          // Handle click event
        });
        link.parentNode.replaceChild(button, link);
      }
    }
  });
}

function googleSignIn() {
  // Google sign-in logic
  const googleButtons = document.querySelectorAll('[data-google-signin]');
  googleButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Initiate Google sign-in flow
      console.log('Google sign-in initiated');
    });
  });
}

function fixButtonIdentifiers() {
  // Replace my-button with actual button id for accessibility
  const myButtons = document.querySelectorAll('my-button');
  myButtons.forEach(customButton => {
    const button = document.createElement('button');
    button.id = customButton.getAttribute('id') || `button-${Math.random().toString(36).substr(2, 9)}`;
    button.textContent = customButton.textContent;
    button.setAttribute('type', customButton.getAttribute('type') || 'button');
    
    // Copy attributes
    Array.from(customButton.attributes).forEach(attr => {
      if (attr.name !== 'id') {
        button.setAttribute(attr.name, attr.value);
      }
    });
    
    customButton.parentNode.replaceChild(button, customButton);
  });
}

function ensureDependencyGraphAriaRole() {
  // Ensure dependencyGraph container has proper ARIA role
  const depGraph = document.querySelector('#dependencyGraph, .dependency-graph, [data-dependency-graph]');
  if (depGraph && !depGraph.hasAttribute('role')) {
    depGraph.setAttribute('role', 'region');
    depGraph.setAttribute('aria-label', 'Dependency Graph');
  }
}

function setupAriaLiveRegions() {
  const liveRegion = document.querySelector('#aria-live-region');
  if (!liveRegion) {
    const region = document.createElement('div');
    region.id = 'aria-live-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-relevant', 'all');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }
}

function setupFocusManagement() {
  // Trap focus within modal dialogs
  const modals = document.querySelectorAll('.modal, [role="dialog"]');
  modals.forEach((modal) => {
    modal.addEventListener('keydown', trapFocus);
  });

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]'
  );
  interactiveElements.forEach(element => {
    if (element.getAttribute('tabindex') === '-1') {
      element.setAttribute('tabindex', '0');
    }
  });
}

function enhanceSemanticMarkup() {
  // Add skip link if not present
  if (!document.querySelector('#skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
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
  inputs.forEach(input => {
    const id = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    input.id = id;
    if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
      input.setAttribute('aria-label', input.name || 'Input field');
    }
  });
}

function closeOpenDialogs() {
  const openDialogs = document.querySelectorAll('[role="dialog"][open], .modal.open');
  openDialogs.forEach(dialog => {
    dialog.style.display = 'none';
    dialog.removeAttribute('open');
  });
}

function announceToScreenReader(message) {
  const liveRegion = document.querySelector('#aria-live-region');
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
  return button;
}

function handleFakeLinks(issues) {
  if (!Array.isArray(issues)) return;
  
  issues.forEach(issue => {
    const element = document.querySelector(`[data-issue-id="${issue.id}"]`);
    if (element && element.tagName === 'A' && element.getAttribute('href') === '#') {
      element.removeAttribute('href');
      element.setAttribute('role', 'button');
      element.setAttribute('tabindex', '0');
    }
  });
}

// Accessibility utilities
const hello = () => {
  return 'Hello from main.js';
};

const addSvgAccessibleNames = () => {
  getSvgAccessibleName;
  setSvgAttributes;
  renderDependencyGraphs;
};

const fixFakeLinkIssues = () => {
  // Fix fake link issues - elements that look like links but aren't
  const fakeLinks = document.querySelectorAll('.fake-link, [data-fake-link]');
  fakeLinks.forEach(link => {
    // Convert to proper button if it's interactive
    if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
      link.removeAttribute('href');
      if (link.tagName === 'A') {
        const button = document.createElement('button');
        button.innerHTML = link.innerHTML;
        button.addEventListener('click', () => {
          // Handle click event
        });
        link.parentNode.replaceChild(button, link);
      }
    }
  });
};

const fixButtonIdentifiers = () => {
  // Replace my-button with actual button id for accessibility
  const myButtons = document.querySelectorAll('my-button');
  myButtons.forEach(customButton => {
    const button = document.createElement('button');
    button.id = customButton.getAttribute('id') || `button-${Math.random().toString(36).substr(2, 9)}`;
    button.textContent = customButton.textContent;
    button.setAttribute('type', customButton.getAttribute('type') || 'button');

    // Copy attributes
    Array.from(customButton.attributes).forEach(attr => {
      if (attr.name !== 'id') {
        button.setAttribute(attr.name, attr.value);
      }
    });

    customButton.parentNode.replaceChild(button, customButton);
  });
};

const ensureDependencyGraphAriaRole = () => {
  // Ensure dependencyGraph container has proper ARIA role
  const depGraph = document.querySelector('#dependencyGraph, .dependency-graph, [data-dependency-graph]');
  if (depGraph && !depGraph.hasAttribute('role')) {
    depGraph.setAttribute('role', 'region');
    depGraph.setAttribute('aria-label', 'Dependency Graph');
  }
};

// Added functions from the combined source code branches
const countDependencies = () => {
    const fs = require('fs');
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
        dependencies: Object.keys(dependencies),
        devDependencies: Object.keys(devDependencies),
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
};

const handleCredentialResponse = (response) => {
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
            processedCredential.email = payload.email || null;
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
};

// Moved the renderDependencyGraphs function to the init function

// Setting up the functions in the export object
module.exports = {
  init,
  checkLandmarkElements,
  countDependencies,
  handleCredentialResponse,
  getSvgAccessibleName,
  setSvgAttributes,
  renderDependencyGraphs,
  checkTableStructure,
  checkFakeLinks,
  fixButtonIdentifiers,
  newBranchFunction
};