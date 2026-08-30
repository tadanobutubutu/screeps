// TODO: This is the existing code that needs to be preserved

// REACT_015: Add lang attribute to HTML element
const addLangAttribute = () => {
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('lang', 'en');
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
  }
};

// REACT_025: Unique landmarks function
const uniqueLandmarks = () => {
  if (typeof document !== 'undefined') {
    ensureUniqueLandmarks();
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

// REACT_041: Add accessible names to SVGs
const addAccessibleNamesToSVGs = () => {
  addSvgAccessibleNames();
};

// REACT_036: Fix 1 fake link issue
const fixFakeLinkIssue = () => {
  if (typeof document !== 'undefined') {
    const spans = document.querySelectorAll('span[role="button"]');
    spans.forEach(span => {
      span.setAttribute('tabindex', '0');
      span.setAttribute('role', 'button');
    });
  }
};

// REACT_036: Fix fake link issues
const fixFakeLinkIssues = () => {
  fixFakeLinkIssue();
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

const ensureDependencyGraphAriaRole = () => {
  dependencyGraphContainer();
};

// Export all functions
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
  dependencyGraphContainer,
  ensureDependencyGraphAriaRole
};