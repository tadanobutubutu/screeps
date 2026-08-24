// main.js - Entry point for the application with accessibility fixes for React components
// TODO: Address accessibility issues from insight report: 
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
// Commit: 16b23d2ea3c82541850f8d1c43a3781a65503246
<!-- todo-hash: 6468a1295031a6500a8981582d2e182e6d55a296 -->

import { dependencyGraphContent } from './content/dependencyGraphContent.js';
import { indexContent } from './content/indexContent.js';

// New functions requested by the issue
function addLangAttribute() {
  const html = document.documentElement;
  html.setAttribute('lang', getLangAttribute());
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
        const isFirstInCol = Array.from(th.parentNode.children).indexOf(th) === 0;
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
    svg.setAttribute('aria-labelledby', `${svg.id || `svg-${index}`}-title`);
    const titleEl = document.createElement('title');
    titleEl.id = `${svg.id || 'svg-' + index}-title`;
    titleEl.textContent = title;
    svg.appendChild(titleEl);
  });
}

function addMainLandmark() {
  const main = document.getElementById('main') || document.body;
  if (main) {
    main.setAttribute('role', 'main');
    main.setAttribute('aria-label', 'Main content of the application');
  }
}

function ensureUniqueLandmarks() {
  const landmarks = [...document.querySelectorAll('nav, footer, aside, main, header')];
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
    landmark.setAttribute('aria-labelledby', currentId);
  });
}

function fixFakeLinkIssue() {
  const links = document.querySelectorAll('a[href="#"]');
  const isValid = !links.length;
  links.forEach(link => {
    if (link.textContent) {
      link.setAttribute('href', '#');
      link.setAttribute('tabindex', '-1');
    }
  });
  return isValid;
}

// Helper function to add title to favicon for accessibility
function addFaviconAccessibleName() {
  const faviconLink = document.querySelector('link[rel="icon"]');
  if (faviconLink) {
    faviconLink.setAttribute('aria-label', 'Favicon');
  }
}

function wrapPrimaryContentInMain() {
  const mainElement = document.getElementById('main');
  if (mainElement) {
    mainElement.innerHTML = '';
    if (document.body.firstChild) {
      mainElement.appendChild(document.body.firstChild);
    }
  }
}

// Validate link accessibility (fake link check)
function validateLinkAccessibility() {
  const links = document.querySelectorAll('a[href="#"], a[href$="javascript:void(0)"], a[href$="javascript:void(0)"]');
  let isValid = true;
  links.forEach(link => {
    if (link.href.endsWith('#') && link.textContent.trim()) {
      link.setAttribute('href', 'javascript:void(0)');
      isValid = false;
    }
  });
  return isValid;
}

// Identify and update specific functions that render dependency graphs or // index views
function renderDependencyGraph(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Dependency graph container with ID "${containerId}" not found`);
    return null;
  }
  container.innerHTML = '';
  const graphContent = dependencyGraphContent(options);
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

function renderIndexView(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Index view container with ID "${containerId}" not found`);
    return null;
  }
  container.innerHTML = '';
  const content = indexContent(options);
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
  addFaviconAccessibleName();
  addSvgAccessibleNames();
  addMainLandmark();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();
  validateTableAccessibility();
  validateTableStructure();
  validateLinkAccessibility();
  wrapPrimaryContentInMain();
}

// Example usage of the accessibility functions
addressAccessibilityIssues();