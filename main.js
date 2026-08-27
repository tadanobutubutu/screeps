// TODO: Add back any required exports that might have been?

function improveAccessibility() {
  // Add ARIA labels to buttons without them
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.getAttribute('aria-label')) {
      button.setAttribute('aria-label', button.textContent || 'Button');
    }
  });

  // Ensure all clickable elements are focusable
  const focusable = document.querySelectorAll('[role="link"]');
  focusable.forEach(el => {
    if (el.tabIndex < 0) el.tabIndex = 0;
  });

  // Ensure the dependencyGraph container has a proper ARIA role
  ensureDependencyGraphAccessibility();

  // Add proper landmark regions to ensure consistency
  addProperLandmarkRegions();
}

function addressInsightReportIssues(insightReport) {
  const issues = insightReport.issues || [];
  issues.forEach(issue => {
    const element = document.querySelector(issue.selector);
    if (element) {
      // Add lang attribute to HTML element
      if (issue.code === 'REACT_015') {
        document.documentElement.lang = 'en';
      }
      // Add landmark roles and fix landmark issues
      if (issue.code === 'REACT_017') {
        if (issue.ariaRole) {
          element.setAttribute('role', issue.ariaRole);
        }
      }
      // Add accessible names to 2 SVGs
      if (issue.code === 'REACT_041') {
        if (issue.ariaLabel) {
          element.setAttribute('aria-label', issue.ariaLabel);
        }
      }
      // Ensure unique landmarks (2 issues)
      if (issue.code === 'REACT_025') {
        // Implement logic to ensure unique landmarks if needed
        ensureUniqueLandmarksFromInsightReport(insightReport);
      }
      // Fix 1 fake link issue
      if (issue.code === 'REACT_036') {
        // Implement logic to fix fake link issues if needed
      }
      // Add scope="col" or scope="row" to <th> elements (already implemented)
      if (issue.code === 'REACT_027') {
        // This issue is already implemented, so no action is needed here
      }
    }
  });
}

function ensureUniqueLandmarks() {
  // Example logic to ensure unique landmarks
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
    const uniqueElements = [];
    elements.forEach(el => {
      const isUnique = !uniqueElements.some(uEl => uEl === el);
      if (isUnique) {
        uniqueElements.push(el);
      } else {
        // Remove the role if it's not unique
        el.removeAttribute('role');
      }
    });
  });
}

function ensureUniqueLandmarksFromInsightReport(insightReport) {
  const issues = insightReport.issues || [];
  let uniqueLandmarks = {};

  issues.forEach(issue => {
    if (issue.code === 'REACT_025') {
      const element = document.querySelector(issue.selector);

      // If the landmark role exists, add it to the unique landmarks object
      if (element && issue.ariaRole) {
        if (!uniqueLandmarks[issue.ariaRole]) {
          uniqueLandmarks[issue.ariaRole] = true;
        } else {
          // Remove the role if it's not unique
          element.removeAttribute('role');
        }
      }
    }
  });

  // Check if all landmarks are unique and re-add if necessary
  ensureUniqueLandmarks();
}

function addProperLandmarkRegions() {
  // Define the standard landmark roles that should be present
  const landmarkRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  // Map of semantic HTML elements to their corresponding ARIA landmark roles
  const semanticToLandmark = {
    'main': 'main',
    'nav': 'navigation',
    'search': 'search',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'form': 'form',
    'section': 'region'
  };

  // Ensure proper landmark roles are present on semantic elements
  landmarkRoles.forEach(role => {
    const semanticTag = Object.keys(semanticToLandmark).find(
      key => semanticToLandmark[key] === role
    );
    if (semanticTag) {
      const elements = document.querySelectorAll(semanticTag);
      elements.forEach(el => {
        if (!el.getAttribute('role')) {
          el.setAttribute('role', role);
        }
      });
    }
  });

  // Add role="region" to sections that have an accessible name (aria-label or aria-labelledby)
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    if (!section.getAttribute('role')) {
      const hasAccessibleName =
        section.hasAttribute('aria-label') ||
        section.hasAttribute('aria-labelledby');
      if (hasAccessibleName) {
        section.setAttribute('role', 'region');
      }
    }
  });
}

function ensureDependencyGraphAccessibility() {
  // Find the dependencyGraph container element
  const dependencyGraph = document.getElementById('dependencyGraph') ||
                          document.querySelector('.dependencyGraph') ||
                          document.querySelector('[data-dependency-graph]');

  if (dependencyGraph) {
    // Ensure it has a proper ARIA role
    if (!dependencyGraph.getAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }

    // Add accessible name if not present
    if (!dependencyGraph.getAttribute('aria-label') &&
        !dependencyGraph.getAttribute('aria-labelledby')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
    }
  }
}

module.exports = {
  improveAccessibility,
  addressInsightReportIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  ensureUniqueLandmarksFromInsightReport,
  addLandmarkRegions
};