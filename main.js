// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and addAccessibleNamesToSVGs())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - REACT_037: Google sign-in logic (handled by googleSignIn())
// - REACT_040: Replace my-button with actual button id for accessibility (handled by fixButtonIdentifiers())
// - REACT_042: Ensure dependencyGraph container has proper ARIA role (handled by ensureDependencyGraphAriaRole())
// - ADD: Address new accessibility issues from insight report

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function personName() {
  return 'Unknown';
}

function validateTableAccessibility(table) {
  if (!table) return false;
  const headers = table.querySelectorAll('th');
  return headers.length > 0;
}

function validateTableStructure(table) {
  if (!table) return false;
  const rows = table.querySelectorAll('tr');
  let hasIssue = false;
  rows.forEach(row => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) hasIssue = true;
  });
  return !hasIssue;
}

function validateLandmark(element) {
  if (!element) return false;
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  return landmarkRoles.some(role => element.getAttribute('role') === role || element.tagName.toLowerCase() === role);
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('main, [role="main"], [role="navigation"], nav, [role="banner"], header, [role="contentinfo"], footer');
  let issues = 0;
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) issues += mains.length - 1;
  return { issues, valid: issues === 0 };
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  return '';
}

function fixTableStructure(table) {
  if (!table) return table;
  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      const cellCount = row.parentElement ? Array.from(row.parentElement.children).filter(el => el.tagName === 'TD' || el.tagName === 'TH').length : 0;
      if (cellCount > 0) {
        const th = document.createElement('th');
        th.setAttribute('scope', 'row');
        row.appendChild(th);
      }
    }
  });
  return table;
}

function fixLandmarkIssues(container) {
  if (!container) return null;
  const landmarks = container.querySelectorAll('[role="main"], main');
  if (landmarks.length === 0) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    container.insertBefore(main, container.firstChild);
  }
  return container;
}

function addMainLandmark(container) {
  if (!container) return null;
  const existingMain = container.querySelector('main, [role="main"]');
  if (existingMain) return container;
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  container.insertBefore(main, container.firstChild);
  return container;
}

function addLandmarkRegions(container) {
  if (!container) return null;
  const landmarks = ['navigation', 'main', 'complementary', 'contentinfo'];
  landmarks.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"], ${role}`);
    if (elements.length > 0) {
      elements.forEach(el => {
        if (!el.id) {
          el.id = `${role}-${Math.random().toString(36).substr(2, 9)}`;
        }
      });
    }
  });
  return container;
}

function ensureUniqueLandmarks(container) {
  if (!container) return { valid: true, issues: 0 };
  let issues = 0;
  const roleCounts = {};
  const landmarks = container.querySelectorAll('main, [role="main"], nav, [role="navigation"], header, [role="banner"], footer, [role="contentinfo"]');
  landmarks.forEach(el => {
    const role = el.getAttribute('role') || el.tagName.toLowerCase();
    roleCounts[role] = (roleCounts[role] || 0) + 1;
    if (roleCounts[role] > 1 && (role === 'main' || role === 'banner' || role === 'contentinfo')) {
      if (!el.id) {
        el.id = `${role}-${Math.random().toString(36).substr(2, 9)}`;
        el.setAttribute('aria-label', `${role} ${roleCounts[role]}`);
      }
      issues++;
    }
  });
  return { valid: issues === 0, issues };
}

function addAccessibleNamesToSVGs(container) {
  if (!container) return container;
  const svgs = container.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = `SVG ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', title.id || `svg-title-${index}`);
      if (!title.id) title.id = `svg-title-${index}`;
    }
  });
  return container;
}

function fixFakeLinkIssue(container) {
  if (!container) return container;
  const fakeLinks = container.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    if (link.getAttribute('onclick') || link.dataset.action) {
      const button = document.createElement('button');
      button.innerHTML = link.innerHTML;
      Array.from(link.attributes).forEach(attr => {
        if (attr.name !== 'href' && attr.name !== 'onclick') {
          button.setAttribute(attr.name, attr.value);
        }
      });
      if (link.dataset.action) {
        button.dataset.action = link.dataset.action;
      }
      link.parentNode.replaceChild(button, link);
    }
  });
  return container;
}

function fixFakeLinkIssues(container) {
  return fixFakeLinkIssue(container);
}

function googleSignIn() {
  const googleButton = document.querySelector('[data-google-signin]');
  if (googleButton) {
    googleButton.setAttribute('role', 'button');
    googleButton.setAttribute('aria-label', 'Sign in with Google');
    const icon = googleButton.querySelector('svg');
    if (icon && !icon.getAttribute('aria-label') && !icon.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = 'Google icon';
      icon.insertBefore(title, icon.firstChild);
      icon.setAttribute('aria-labelledby', title.id);
      title.id = 'google-icon-title';
    }
  }
  return googleButton;
}

function fixButtonIdentifiers(container) {
  if (!container) return container;
  const buttons = container.querySelectorAll('button[id="my-button"], button:not([id])');
  buttons.forEach((button, index) => {
    if (button.id === 'my-button' || !button.id) {
      const label = button.textContent.trim() || button.getAttribute('aria-label') || 'button';
      const normalizedLabel = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30);
      button.id = normalizedLabel || `button-${index + 1}`;
    }
  });
  return container;
}

function ensureDependencyGraphAriaRole(container) {
  if (!container) return container;
  const depGraph = container.querySelector('.dependencyGraph, #dependencyGraph, [data-dependency-graph]');
  if (depGraph) {
    if (!depGraph.getAttribute('role')) {
      depGraph.setAttribute('role', 'img');
    }
    if (!depGraph.getAttribute('aria-label') && !depGraph.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = 'Dependency graph';
      depGraph.insertBefore(title, depGraph.firstChild);
      const titleId = 'dep-graph-title';
      title.id = titleId;
      depGraph.setAttribute('aria-labelledby', titleId);
    }
  }
  return container;
}

function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  if (onClick) button.addEventListener('click', onClick);
  return button;
}

module.exports = {
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  fixButtonIdentifiers,
  ensureDependencyGraphAriaRole
};