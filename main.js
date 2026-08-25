// main.js - Entry point for the application with accessibility fixes for React components

import { dependencyGraphContent } from './content/dependencyGraphContent.js';
import { indexContent } from './content/indexContent.js';

// Existing functions
function addLangAttribute() {
  const html = document.documentElement;
  const lang = getLangAttribute();
  html.setAttribute('lang', lang);
}

function getLangAttribute() {
  const lang = document.documentElement.lang;
  return lang ? lang : 'en';
}

function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  let hasIssues = false;
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.scope) {
        const isFirstInRow = th.parentElement && th.parentElement.firstElementChild === th;
        const isFirstInCol = th.cellIndex === 0;
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
  return !hasIssues;
}

function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  let isValid = true;
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    const row = table.rows[1];
    if (headers.length !== row.cells.length) {
      isValid = false;
    }
    headers.forEach((header, index) => {
      const cell = row.cells[index];
      if (!header.cellScope || header.cellScope !== cell.scope) {
        isValid = false;
      }
    });
  });
  return isValid;
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const title = svg.getAttribute('title') || `SVG graphic ${index + 1}`;
    const titleId = `${svg.id || 'svg-' + index}-title`;
    const titleEl = document.createElement('title');
    titleEl.id = titleId;
    titleEl.textContent = title;
    svg.insertBefore(titleEl, svg.firstChild);
    svg.setAttribute('aria-labelledby', titleId);
  });
}

function addMainLandmark() {
  const main = document.querySelector('main') || document.body;
  if (main) {
    main.setAttribute('role', 'main');
    main.setAttribute('aria-label', 'Main content of the application');
  }
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('footer, aside, main, header');
  const idMap = new Map();

  landmarks.forEach(landmark => {
    let currentId = landmark.id;
    if (!currentId) {
      currentId = `${landmark.tagName.toLowerCase()}-${Date.now()}`;
      landmark.id = currentId;
    }

    if (idMap.has(currentId)) {
      let counter = 1;
      const newId = `${currentId}-${counter}`;
      while (idMap.has(newId)) {
        counter++;
        newId = `${currentId}-${counter}`;
      }
      landmark.id = newId;
      currentId = newId;
    }

    idMap.set(currentId, true);
  });
}

function fixFakeLinkIssue() {
  const links = document.querySelectorAll('a:not([href])');
  const isValid = links.length === 0;
  links.forEach(link => {
    if (link.textContent) {
      link.setAttribute('href', '#');
      link.setAttribute('role', 'link');
    }
  });
  return isValid;
}

// New functions requested by the issue
function addSidebarLandmark() {
  const sidebar = document.querySelector('.sidebar, [role="complementary"]');
  if (sidebar) {
    sidebar.setAttribute('role', 'navigation');
    sidebar.setAttribute('aria-label', 'Sidebar navigation');
  }
}

function addFooterLandmark() {
  const footer = document.querySelector('footer');
  if (footer) {
    footer.setAttribute('role', 'contentinfo');
    footer.setAttribute('aria-label', 'Footer information');
  }
}

function addNavLandmark() {
  const nav = document.querySelector('nav');
  if (nav) {
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Navigation');
  }
}

// Helper function to add title to favicon for accessibility
function addFaviconAccessibleName() {
  const faviconLink = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
  if (faviconLink) {
    faviconLink.setAttribute('aria-label', 'Favicon');
  }
}

function wrapPrimaryContentInMain() {
  const mainElement = document.querySelector('main');
  if (mainElement) {
    const existingContent = mainElement.innerHTML;
    mainElement.innerHTML = '';
    if (existingContent) {
      mainElement.innerHTML = existingContent;
    }
  }
}

// Validate link accessibility (fake link check)
function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  let isValid = true;
  links.forEach(link => {
    if (!link.href && link.textContent.trim()) {
      link.setAttribute('href', '#');
      isValid = false;
    }
  });
  return isValid;
}

// Main function to address all accessibility issues
function addressAccessibilityIssues() {
  addLangAttribute();
  validateTableAccessibility();
  addSvgAccessibleNames();
  addMainLandmark();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();
  addSidebarLandmark();
  addFooterLandmark();
  addNavLandmark();
  addFaviconAccessibleName();
}

// Example usage of the accessibility functions
addressAccessibilityIssues();

// Export all functions for testing and external use
export {
  addLangAttribute,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  addSvgAccessibleNames,
  addMainLandmark,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  addSidebarLandmark,
  addFooterLandmark,
  addNavLandmark,
  addFaviconAccessibleName,
  wrapPrimaryContentInMain,
  validateLinkAccessibility
};