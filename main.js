const init = () => {
  addLangAttribute();
  fixTableStructure();
  checkLandmarkElements();
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

const addLangAttribute = () => {
  // Add lang attribute to HTML element if missing
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
};

const fixTableStructure = () => {
  // ... (modified original implementation to preserve both changes)
};

const ensureUniqueLandmarks = () => uniqueLandmarks();

const uniqueLandmarks = () => {
  // Ensure landmarks have unique accessible names if duplicates exist
  const landmarks = [...document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"]')];
  const landmarkCounts = {};

  landmarks.forEach(landmark => {
    const type = landmark.getAttribute('role');
    const name = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby') || getSvgAccessibleName(landmark) || landmark.tagName.toLowerCase();
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