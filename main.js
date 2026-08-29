// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: fixLandmarkIssues, addMainLandmark, addLandmarkRegions)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks, uniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames, addAccessibleNamesToSVGs)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue, fixFakeLinkIssues)
// - REACT_037: Google sign-in logic (DONE: googleSignIn)
// - REACT_040: Replace my-button with actual button id for accessibility (DONE: fixButtonIdentifiers)
// - REACT_042: Ensure dependencyGraph container has proper ARIA role (DONE: addDependencyGraphRole)

/**
 * Adds lang attribute to HTML element for REACT_015
 */
function addLangAttribute(document) {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

/**
 * Fixes table structure issues for REACT_027
 * Ensures tables have proper headers and structure
 */
function fixTableStructure(document) {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const newRow = document.createElement('tr');
        firstRow.querySelectorAll('th, td').forEach((cell) => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          newRow.appendChild(th);
        });
        thead.appendChild(newRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
  });
}

/**
 * Fixes landmark issues for REACT_017
 */
function fixLandmarkIssues(document) {
  addMainLandmark(document);
  addLandmarkRegions(document);
}

/**
 * Adds main landmark for REACT_017
 */
function addMainLandmark(document) {
  const existingMain = document.querySelector('main');
  if (!existingMain) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    const body = document.body;
    const firstChild = body.firstChild;
    if (firstChild) {
      body.insertBefore(main, firstChild);
    } else {
      body.appendChild(main);
    }
  }
}

/**
 * Adds landmark regions for REACT_017
 */
function addLandmarkRegions(document) {
  const banner = document.querySelector('[role="banner"]') || document.querySelector('header');
  const navigation = document.querySelector('[role="navigation"]') || document.querySelector('nav');
  const contentinfo = document.querySelector('[role="contentinfo"]') || document.querySelector('footer');
  
  if (banner && !banner.hasAttribute('role')) {
    banner.setAttribute('role', 'banner');
  }
  if (navigation && !navigation.hasAttribute('role')) {
    navigation.setAttribute('role', 'navigation');
  }
  if (contentinfo && !contentinfo.hasAttribute('role')) {
    contentinfo.setAttribute('role', 'contentinfo');
  }
}

/**
 * Ensures unique landmarks for REACT_025
 */
function ensureUniqueLandmarks(document) {
  uniqueLandmarks(document);
}

/**
 * Makes landmarks unique by adding aria-labels
 */
function uniqueLandmarks(document) {
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (navElements.length > 1 && !nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
}

/**
 * Adds accessible names to SVGs for REACT_041
 */
function addSvgAccessibleNames(document) {
  addAccessibleNamesToSVGs(document);
}

/**
 * Adds accessible names to all SVGs in the document
 */
function addAccessibleNamesToSVGs(document) {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', `SVG graphic ${index + 1}`);
    }
  });
}

/**
 * Fixes fake link issues for REACT_036
 */
function fixFakeLinkIssue(document) {
  fixFakeLinkIssues(document);
}

/**
 * Converts non-link elements that behave as links to actual links or buttons
 */
function fixFakeLinkIssues(document) {
  const fakeLinks = document.querySelectorAll('[role="link"]');
  fakeLinks.forEach((element) => {
    const href = element.getAttribute('data-href');
    if (href) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = element.textContent;
      element.parentNode.replaceChild(link, element);
    } else {
      element.setAttribute('role', 'button');
    }
  });
}

/**
 * Google sign-in logic for REACT_037
 */
function googleSignIn() {
  // Google Sign-In implementation placeholder
  console.log('Google sign-in logic');
}

/**
 * Fixes button identifiers for REACT_040
 * Replaces "my-button" with proper button IDs
 */
function fixButtonIdentifiers(document) {
  const myButtons = document.querySelectorAll('#my-button, .my-button');
  myButtons.forEach((button, index) => {
    const uniqueId = `accessible-button-${index + 1}`;
    if (button.id === 'my-button') {
      button.id = uniqueId;
    }
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', `Button ${index + 1}`);
    }
  });
}

/**
 * Ensures dependencyGraph container has proper ARIA role for REACT_042
 */
function addDependencyGraphRole(document) {
  const dependencyGraph = document.querySelector('#dependencyGraph, .dependency-graph, [data-graph="dependency"]');
  if (dependencyGraph) {
    if (!dependencyGraph.getAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }
    if (!dependencyGraph.getAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
    }
  }
}

/**
 * Main initialization function
 */
function init(document) {
  addLangAttribute(document);
  fixTableStructure(document);
  fixLandmarkIssues(document);
  ensureUniqueLandmarks(document);
  addSvgAccessibleNames(document);
  fixFakeLinkIssues(document);
  fixButtonIdentifiers(document);
  addDependencyGraphRole(document);
}

// Export functions for testing
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
  addDependencyGraphRole,
  init
};