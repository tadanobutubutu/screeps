const axe = require('axe-core');

// Function to handle the axe-core scan result
function handleScanResult(result) {
  // This is where you would write the logic to process the result
  // and generate the report. For now, we'll just log the result.
  console.log('Accessibility Report:', result);
}

const generateAccessibilityReport = () => {
  const htmlContent = `
    <div>
      <p>User Safety: unsafe</p>
      <p>Safety Categories: Unauthorized Advice</p>
    </div>
  `;

  axe.run(htmlContent, { /* options */ }, (error, result) => {
    if (error) {
      console.error('Error running axe-core:', error);
    } else {
      handleScanResult(result);
    }
  });
};

const fixFakeLinks = () => {
  const fakeLinks = document.querySelectorAll('[href="#"]:not([aria-hidden])');
  fakeLinks.forEach((link) => {
    link.removeAttribute('href');
  });
};

// Merged landmark roles function to include both implementations
function addLandmarkRoles() {
  // From HEAD: Navigation, Main, Header
  const navElement = document.querySelector('nav');
  if (navElement && !navElement.getAttribute('role')) {
    navElement.setAttribute('role', 'navigation');
  }

  const mainElement = document.querySelector('main');
  if (mainElement && !mainElement.getAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }

  const headerElement = document.querySelector('header');
  if (headerElement && !headerElement.getAttribute('role')) {
    headerElement.setAttribute('role', 'banner');
  }

  // From origin/main: Footer and Main Content
  const footerElement = document.querySelector('footer');
  if (footerElement && !footerElement.getAttribute('role')) {
    footerElement.setAttribute('role', 'contentinfo');
  }

  const mainContent = document.getElementById('main-content');
  if (mainContent && !mainContent.getAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }
}

// Function to ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  // Define landmark roles - some should be unique per page
  const uniqueLandmarkRoles = ['main', 'banner', 'contentinfo'];
  const multipleAllowedRoles = ['navigation', 'complementary', 'region', 'search', 'form'];
  const allLandmarkRoles = [...uniqueLandmarkRoles, ...multipleAllowedRoles];

  // Find all elements with landmark roles
  const landmarks = document.querySelectorAll(allLandmarkRoles.map(role => `[role="${role}"]`).join(', '));

  // Group landmarks by role
  const landmarksByRole = {};
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (!landmarksByRole[role]) {
      landmarksByRole[role] = [];
    }
    landmarksByRole[role].push(landmark);
  });

  // Check unique landmark roles - should only have one per page
  uniqueLandmarkRoles.forEach(role => {
    const elements = landmarksByRole[role] || [];
    if (elements.length > 1) {
      console.warn(`Multiple ${role} landmarks found. Only one is allowed per page.`);
      // Keep the first one, remove role from others
      elements.slice(1).forEach(el => {
        el.removeAttribute('role');
        console.warn(`Removed duplicate ${role} landmark role from element:`, el);
      });
    }
  });

  // For roles that allow multiples, ensure each has a unique accessible name
  multipleAllowedRoles.forEach(role => {
    const elements = landmarksByRole[role] || [];
    if (elements.length > 1) {
      const usedNames = new Set();
      elements.forEach((el, index) => {
        // Check for existing accessible name
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledBy = el.getAttribute('aria-labelledby');
        let accessibleName = ariaLabel || (ariaLabelledBy ? document.getElementById(ariaLabelledBy)?.textContent : null);

        if (!accessibleName) {
          // Generate a unique name
          accessibleName = `${role} ${index + 1}`;
          el.setAttribute('aria-label', accessibleName);
        }

        // Ensure uniqueness
        let uniqueName = accessibleName;
        let counter = 1;
        while (usedNames.has(uniqueName)) {
          uniqueName = `${accessibleName} ${counter}`;
          counter++;
        }
        usedNames.add(uniqueName);

        if (uniqueName !== accessibleName) {
          el.setAttribute('aria-label', uniqueName);
        }
      });
    } else if (elements.length === 1) {
      // Single landmark of this type - ensure it has an accessible name if needed
      const el = elements[0];
      const ariaLabel = el.getAttribute('aria-label');
      const ariaLabelledBy = el.getAttribute('aria-labelledby');
      if (!ariaLabel && !ariaLabelledBy) {
        el.setAttribute('aria-label', role);
      }
    }
  });
}

// Function to fix 1 fake link issue
function fixFakeLink() {
  const fakeLink = document.getElementById('unrotate');
  if (fakeLink && fakeLink.tagName === 'A') {
    const newButton = createUnrotateButton();
    fakeLink.parentNode.replaceChild(newButton, fakeLink);
  }
}

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  fixFakeLink();

  // Ensure table headers have proper scope
  ensureThScope();

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-hidden') || svg.getAttribute('aria-hidden') !== 'true') {
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
}

// New function requested in the issue
function newFunction() {
  // Implementation of the new function
  const button = createInPageButton('New Button', function() {
    console.log('New Function clicked!');
  });
  document.body.appendChild(button);
}

module.exports = {
  generateAccessibilityReport,
  initializeAccessibility,
  fixFakeLink,
  addLandmarkRoles,
  ensureUniqueLandmarks,
  newFunction
};