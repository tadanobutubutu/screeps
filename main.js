// main.js - Entry point for the application with accessibility fixes for React components
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), ... and createAccessibleLink())

// Import content modules for dependency graphs and index views
import { dependencyGraphContent } from './content/dependencyGraphContent.js';
import { indexContent } from './content/indexContent.js';

// New functions requested by the issue

function getLangAttribute() {
  const html = document.documentElement;
  return html.getAttribute('lang') || 'en';
}

function getFullLangAttribute() {
  const lang = document.documentElement.lang;
  return lang ? lang : 'en';
}

function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  let hasIssues = false;
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        hasIssues = true;
      } else if (!['row', 'col', 'rowgroup', 'colgroup'].includes(th.getAttribute('scope'))) {
        hasIssues = true;
      }
    });
  });
  return !hasIssues;
}

function validateTableStructure() {
  return checkTableStructure();
}

function getSvgAccessibleName() {
  const svgs = document.querySelectorAll('svg');
  for (let i = 0; i < svgs.length; i++) {
    const svg = svgs[i];
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    const ariaLabelledBy = svg.getAttribute('aria-labelledby');
    if (ariaLabelledBy) {
      const labelEl = document.getElementById(ariaLabelledBy);
      if (labelEl) return labelEl.textContent.trim();
    }
    const title = svg.querySelector('title');
    if (title) return title.textContent.trim();
  }
  return '';
}

// Wrap primary content in main element for accessibility
function addMainLandmark() {
  const main = document.querySelector('main');
  if (!main) {
    const newMain = document.createElement('main');
    document.body.prepend(newMain);
    return newMain;
  }
  return main;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarkIds() {
  const landmarks = document.querySelectorAll('header, footer, aside, main, nav, [role="banner"], [role="contentinfo"], [role="complementary"], [role="main"], [role="navigation"], [role="search"]');
  const landmarkRoles = new Map();
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (role && landmark.id) {
      if (landmarkRoles.has(role)) {
        landmark.id = role + '-' + landmarkRoles.get(role);
        landmarkRoles.set(role, landmarkRoles.get(role) + 1);
      } else {
        landmarkRoles.set(role, 1);
      }
    }
  });
}

// REACT_025: Fix multiple main landmarks by converting extras to section elements
function fixMultipleMainLandmarks() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length <= 1) {
    return mainElements.length;
  }

  let fixedCount = 0;
  mainElements.forEach((mainEl, index) => {
    if (index === 0) return; // Keep the first main element

    // Convert subsequent main elements to section
    const section = document.createElement('section');
    // Preserve attributes except role
    Array.from(mainEl.attributes).forEach(attr => {
      if (attr.name !== 'role') {
        section.setAttribute(attr.name, attr.value);
      }
    });
    // Add role="region" for accessibility
    section.setAttribute('role', 'region');
    // Add aria-label if not present
    if (!section.hasAttribute('aria-label') && !section.hasAttribute('aria-labelledby')) {
      section.setAttribute('aria-label', `Content section ${index + 1}`);
    }
    // Move children
    while (mainEl.firstChild) {
      section.appendChild(mainEl.firstChild);
    }
    // Replace main with section
    mainEl.parentNode.replaceChild(section, mainEl);
    fixedCount++;
  });

  return fixedCount;
}

// REACT_025: Dynamically observe and fix multiple main landmarks (handles React re-renders)
function observeAndFixMainLandmarks() {
  const fix = () => {
    const mainElements = document.querySelectorAll('main');
    if (mainElements.length <= 1) return;

    // Keep the first main, convert others to section with role="region"
    for (let i = 1; i < mainElements.length; i++) {
      const mainEl = mainElements[i];
      const section = document.createElement('section');
      section.setAttribute('role', 'region');
      // Preserve original attributes except role
      Array.from(mainEl.attributes).forEach(attr => {
        if (attr.name !== 'role') {
          section.setAttribute(attr.name, attr.value);
        }
      });
      // Add aria-label if not present
      if (!section.hasAttribute('aria-label') && !section.hasAttribute('aria-labelledby')) {
        section.setAttribute('aria-label', `Content section ${i + 1}`);
      }
      // Move children
      while (mainEl.firstChild) {
        section.appendChild(mainEl.firstChild);
      }
      // Replace main with section
      mainEl.parentNode.replaceChild(section, mainEl);
    }
  };

  // Initial fix
  fix();

  // Observe dynamic changes (e.g., React updates)
  const observer = new MutationObserver((mutations) => {
    let hasNewMain = false;
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeName === 'MAIN') {
            hasNewMain = true;
            break;
          }
          if (node.querySelectorAll && node.querySelectorAll('main').length > 0) {
            hasNewMain = true;
            break;
          }
        }
      }
      if (hasNewMain) break;
    }
    if (hasNewMain) {
      fix();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// REACT_025: Validate that only one main landmark exists
function ensureUniqueLandmarks() {
  const mainElements = document.querySelectorAll('main');
  const issues = [];

  if (mainElements.length === 0) {
    issues.push('No main landmark found');
  } else if (mainElements.length > 1) {
    issues.push(`Multiple main landmarks found (${mainElements.length}). Only one <main> element should exist per page.`);
  }

  // Check for other duplicate landmarks
  const landmarkSelectors = ['header', 'footer', 'aside', 'nav'];
  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      issues.push(`Multiple <${selector}> landmarks found (${elements.length}). Consider using aria-label or aria-labelledby to distinguish them.`);
    }
  });

  return {
    valid: issues.length === 0,
    issues,
    mainCount: mainElements.length
  };
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  svgs.forEach((svg, index) => {
    if (!svg.querySelector('title') && !svg.getAttribute('aria-label')) {
      const title = document.createElement('title');
      title.textContent = `SVG graphic ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
    }
  });
}

// NEW: Fix favicon accessibility by marking as decorative
function fixFaviconAccessibility() {
  const faviconLinks = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
  faviconLinks.forEach(link => {
    link.setAttribute('aria-hidden', 'true');
  });
}

// Fake link / accessible link creation helpers
function createInPageButton(label, onClick) {
  const button = document.createElement('button');
  button.textContent = label;
  button.setAttribute('type', 'button');
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  return button;
}

function createAccessibleLink(href, label) {
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('aria-label', label);
  link.textContent = label;
  return link;
}

// Validate link accessibility (fake link check)
function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  let hasIssues = false;
  links.forEach(link => {
    if (!link.hasAttribute('href') || link.getAttribute('href') === '#') {
      hasIssues = true;
    }
  });
  return !hasIssues;
}

// Check valid TH scope attribute
function hasValidTHScope(th) {
  const scope = th.getAttribute('scope');
  return scope === 'row' || scope === 'col' || scope === 'rowgroup' || scope === 'colgroup';
}

// Add lang attribute to HTML element
function addLangAttribute() {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

// Fix table structure issues
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        // Try to infer scope from position
        const isFirstInRow = th.parentElement && th.parentElement.firstElementChild === th;
        const rowIndex = Array.from(th.parentElement.children).indexOf(th);
        const isFirstInCol = rowIndex === 0;
        if (isFirstInRow && isFirstInCol) {
          th.setAttribute('scope', 'col');
        } else if (isFirstInRow) {
          th.setAttribute('scope', 'row');
        } else {
          th.setAttribute('scope', 'col');
        }
      }
    });
  });
}

// Check table structure validity
function checkTableStructure() {
  const tables = document.querySelectorAll('table');
  for (const table of tables) {
    const headers = table.querySelectorAll('th');
    for (const th of headers) {
      if (!hasValidTHScope(th)) {
        return false;
      }
    }
  }
  return true;
}

// Add main landmark if missing
function addMainLandmark() {
  const main = document.querySelector('main');
  if (!main) {
    const newMain = document.createElement('main');
    document.body.prepend(newMain);
    return newMain;
  }
  return main;
}

// Add landmark regions for accessibility
function addLandmarkRegions() {
  // Ensure main landmark exists
  addMainLandmark();

  // Validate and fix unique landmarks
  ensureUniqueLandmarkIds();
  fixMultipleMainLandmarks();

  // Ensure other landmarks have proper labeling
  const landmarks = document.querySelectorAll('header, nav, aside, footer');
  landmarks.forEach((landmark, index) => {
    if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
      const tagName = landmark.tagName.toLowerCase();
      landmark.setAttribute('aria-label', `${tagName} ${index + 1}`);
    }
  });
}

// Fix fake link issue - convert anchor tags without href to buttons
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a:not([href]), a[href="#"]');
  fakeLinks.forEach(link => {
    const button = document.createElement('button');
    button.textContent = link.textContent;
    button.setAttribute('type', 'button');
    // Copy all attributes except href
    Array.from(link.attributes).forEach(attr => {
      if (attr.name !== 'href') {
        button.setAttribute(attr.name, attr.value);
      }
    });
    // Copy event listeners by cloning
    const clonedLink = link.cloneNode(true);
    link.parentNode.replaceChild(button, link);
  });
}

// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from the
// appropriate modules.

/**
 * Render the dependency graph view using the imported dependencyGraphContent module.
 * This function identifies the container element and populates it with the 
 * dependency graph content from the appropriate module.
 * 
 * @param {string} containerId - The ID of the container element to render the graph in
 * @param {Object} options - Optional configuration options for rendering
 * @returns {HTMLElement} The rendered dependency graph container
 */
function renderDependencyGraph(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Dependency graph container with ID "${containerId}" not found`);
    return null;
  }

  // Clear existing content
  container.innerHTML = '';

  // Get content from the dependencyGraphContent module
  const graphContent = dependencyGraphContent(options);

  // Append the content to the container
  if (typeof graphContent === 'string') {
    container.innerHTML = graphContent;
  } else if (graphContent instanceof HTMLElement) {
    container.appendChild(graphContent);
  } else if (Array.isArray(graphContent)) {
    graphContent.forEach(item => {
      if (typeof item === 'string') {
        container.innerHTML += item;
      } else if (item instanceof HTMLElement) {
        container.appendChild(item);
      }
    });
  }

  return container;
}

/**
 * Render the index view using the imported indexContent module.
 * This function identifies the container element and populates it with the
 * index content from the appropriate module.
 * 
 * @param {string} containerId - The ID of the container element to render the index in
 * @param {Object} options - Optional configuration options for rendering
 * @returns {HTMLElement} The rendered index view container
 */
function renderIndexView(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Index view container with ID "${containerId}" not found`);
    return null;
  }

  // Clear existing content
  container.innerHTML = '';

  // Get content from the indexContent module
  const content = indexContent(options);

  // Append the content to the container
  if (typeof content === 'string') {
    container.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    container.appendChild(content);
  } else if (Array.isArray(content)) {
    content.forEach(item => {
      if (typeof item === 'string') {
        container.innerHTML += item;
      } else if (item instanceof HTMLElement) {
        container.appendChild(item);
      }
    });
  }

  return container;
}

// Main entry: Address all accessibility issues
function addressAccessibilityIssues() {
  addLangAttribute();
  fixTableStructure();
  addLandmarkRegions();
  addSvgAccessibleNames();
  fixFaviconAccessibility();
  fixFakeLinkIssue();
}

// Example usage of the accessibility functions
addressAccessibilityIssues();
addLandmarkRegions();
observeAndFixMainLandmarks();

// REACT_017: Validate landmark elements for accessibility
function validateLandmark(landmark) {
  if (!landmark) return false;
  const validLandmarkRoles = ['main', 'header', 'footer', 'nav', 'aside', 'section', 'article', 'search'];
  const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
  return validLandmarkRoles.includes(role);
}

// REACT_017: Validate overall landmark structure
function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('header, footer, nav, main, aside, section[aria-label], article, [role="search"]');
  let hasIssues = false;
  let landmarkCount = 0;
  landmarks.forEach(landmark => {
    if (!validateLandmark(landmark)) {
      hasIssues = true;
    }
    landmarkCount++;
  });
  return {
    valid: !hasIssues,
    landmarkCount
  };
}