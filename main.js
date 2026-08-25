// main.js - Entry point for the application with accessibility fixes for React components
import { dependencyGraphContent } from './content/dependencyGraphContent.js';
import { indexContent } from './content/indexContent.js';

// Existing functions
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
  const links = document.querySelectorAll('a[href="#]');
  const isValid = !links.length;
  links.forEach(link => {
    if (link.textContent) {
      link.setAttribute('href', 'javascript:void(0)');
      link.setAttribute('tabindex', '-1');
    }
  });
  return isValid;
}

function addSidebarLandmark() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.setAttribute('role', 'navigation');
    sidebar.setAttribute('aria-label', 'Sidebar navigation');
  }
}

function addFooterLandmark() {
  const footer = document.getElementById('footer');
  if (footer) {
    footer.setAttribute('role', 'contentinfo');
    footer.setAttribute('aria-label', 'Footer information');
  }
}

function addNavLandmark() {
  const nav = document.getElementById('nav');
  if (nav) {
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Navigation');
  }
}

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

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a[href="#"], a[href$="javascript:void(0)"]');
  let isValid = true;
  links.forEach(link => {
    if (link.href.endsWith('#') && link.textContent.trim()) {
      link.setAttribute('href', 'javascript:void(0)');
      isValid = false;
    }
  });
  return isValid;
}

// New function requested by the issue
function addMainElementToDocuments() {
  const mainElements = document.querySelectorAll('main');
  mainElements.forEach(main => {
    main.innerHTML = '';
    if (main.parentNode.firstChild) {
      main.appendChild(main.parentNode.firstChild);
    }
  });
}

// Export all functions for testing and external use
export { addLangAttribute, getLangAttribute, validateTableAccessibility, validateTableStructure, addSvgAccessibleNames, addMainLandmark, ensureUniqueLandmarks, fixFakeLinkIssue, addSidebarLandmark, addFooterLandmark, addNavLandmark, addFaviconAccessibleName, wrapPrimaryContentInMain, validateLinkAccessibility, addMainElementToDocuments };