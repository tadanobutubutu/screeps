// main.js - Entry point for the application with accessibility fixes for React components
import { dependencyGraphContent } from ...
import { indexContent } from './content/indexContent.js';

// Existing functions
function addLangAttribute() {
  const html = document.documentElement;
  ... getLangAttribute());
}

function getLangAttribute() {
  const lang = document.documentElement.lang;
  return lang ? lang : 'en';
}

function validateTableAccessibility() {
  const tables = ...
  let hasIssues = false;
  tables.forEach(table => {
    const headers = ...
    headers.forEach(th => {
      if (!th.scope) {
        const isFirstInRow = th.parentElement && th.parentElement.firstElementChild === th;
        const isFirstInCol = ... === 0;
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
  const tables = ...
  let isValid = true;
  tables.forEach(table => {
    const headers = ...
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
  const svgs = ...
  svgs.forEach((svg, index) => {
    const title = svg.getAttribute('title') || `SVG graphic ${index + 1}`;
    ... `${svg.id || ...
    const titleEl = document.createElement('title');
    titleEl.id = `${svg.id || 'svg-' + index}-title`;
    titleEl.textContent = title;
    ...
  });
}

function addMainLandmark() {
  const main = ... || document.body;
  if (main) {
    main.setAttribute('role', 'main');
    main.setAttribute('aria-label', 'Main content of the application');
  }
}

function ensureUniqueLandmarks() {
  const landmarks = ... footer, aside, main, header')];
  const idMap = new Map();
  landmarks.forEach(landmark => {
    let currentId = landmark.id;
    if (!currentId) {
      currentId = ...
      landmark.id = currentId;
    }
    if ... {
      let counter = 1;
      const newId = `${currentId}-${counter}`;
      while (idMap.has(newId)) {
        counter++;
        newId = `${currentId}-${counter}`;
      }
      landmark.id = newId;
      currentId = newId;
    }
    ... true);
    ... currentId);
  });
}

function fixFakeLinkIssue() {
  const links = ...
  const isValid = !links.length;
  links.forEach(link => {
    if (link.textContent) {
      link.setAttribute('href', ...
      ... '-1');
    }
  });
  return isValid;
}

// New functions requested by the issue
function addSidebarLandmark() {
  const sidebar = ...
  if (sidebar) {
    sidebar.setAttribute('role', 'navigation');
    sidebar.setAttribute('aria-label', 'Sidebar navigation');
  }
}

function addFooterLandmark() {
  const footer = ...
  if (footer) {
    footer.setAttribute('role', 'contentinfo');
    footer.setAttribute('aria-label', 'Footer information');
  }
}

function addNavLandmark() {
  const nav = ...
  if (nav) {
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Navigation');
  }
}

// Helper function to add title to favicon for accessibility
function addFaviconAccessibleName() {
  const faviconLink = document.querySelector('link[rel="icon"]');
  if (faviconLink) {
    const href = faviconLink.getAttribute('href');
    if (href && href.endsWith('.svg')) {
      fetch(href)
        .then(response => response.text())
        .then(svgText => {
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
          const svgElement = svgDoc.querySelector('svg');
          if (svgElement && !svgElement.querySelector('title')) {
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.textContent = 'Favicon';
            svgElement.insertBefore(title, svgElement.firstChild);
            const serializer = new XMLSerializer();
            const serializedSvg = serializer.serializeToString(svgElement);
            faviconLink.setAttribute('href', 'data:image/svg+xml,' + encodeURIComponent(serializedSvg));
          }
        })
        .catch(err => console.error('Failed to add accessible name to favicon:', err));
    }
  }
}

function wrapPrimaryContentInMain() {
  const mainElement = ...
  if (mainElement) {
    mainElement.innerHTML = '';
    if ... {
      ...
    }
  }
}

function validateLinkAccessibility() {
  const links = ... ...
  let isValid = true;
  links.forEach(link => {
    if ... && link.textContent.trim()) {
      link.setAttribute('href', ...
      isValid = false;
    }
  });
  return isValid;
}

// Export all functions for testing and external use
export { addLangAttribute, getLangAttribute, validateTableAccessibility, validateTableStructure, addSvgAccessibleNames, addMainLandmark, ensureUniqueLandmarks, fixFakeLinkIssue, addSidebarLandmark, addFooterLandmark, addNavLandmark, addFaviconAccessibleName, wrapPrimaryContentInMain, validateLinkAccessibility };