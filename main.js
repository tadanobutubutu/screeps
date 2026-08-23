// Accessibility-related code for improved screen reader support and WCAG compliance
// Import required module(s)
const { getMainElement } = require('./utils');

// Accessibility-related code for improved screen reader support and WCAG compliance
const htmlElement = document.documentElement;
htmlElement.lang = 'en';

// Example: English
// Existing code and exports from main.js
function existingFunction() {
  // Existing code
}

// New function to wrap content with a <main> tag
function wrapContentWithMain(content) {
  return getMainElement(content);
}

// Update the SVG icon for the favicon in app/layout.tsx
function updateFaviconIcon(icon) {
  const link = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]') || document.createElement('link');
  if (!link) return null;
  link.type = 'image/svg+xml';
  link.rel = 'shortcut icon';
  link.href = icon;
  return link;
}

// Function to ensure SVG icons have accessible names (titles)
function ensureSvgAccessibility(svgString, accessibleName) {
  if (!svgString || !accessibleName) {
    return svgString;
  }
  const hasTitle = svgString.includes('<title>');
  if (hasTitle) {
    return svgString.replace(/<title>[^<]*<\/title>/, `<title>${accessibleName}</title>`);
  }
  const titleElement = `<title>${accessibleName}</title>`;
  if (svgString.includes('<svg')) {
    return svgString.replace(/<svg([^>]*)>/, `<svg$1>${titleElement}`);
  }
  return svgString;
}

// Function to set page title for accessibility
function setAccessiblePageTitle(title) {
  if (document.title !== title) {
    document.title = title;
  }
  return document.title;
}

// Function to add ARIA live region for dynamic content announcements
function createLiveRegion(regionName = 'status', politeness = 'polite') {
  const existingRegion = document.getElementById(`aria-${regionName}`);
  if (existingRegion) {
    return existingRegion;
  }
  const liveRegion = document.createElement('div');
  liveRegion.id = `aria-${regionName}`;
  liveRegion.setAttribute('aria-live', politeness);
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.style.position = 'absolute';
  liveRegion.style.width = '1px';
  liveRegion.style.height = '1px';
  liveRegion.style.padding = '0';
  liveRegion.style.margin = '-1px';
  liveRegion.style.overflow = 'hidden';
  liveRegion.style.clip = 'rect(0, 0, 0, 0)';
  liveRegion.style.whiteSpace = 'nowrap';
  liveRegion.style.border = '0';
  document.body.appendChild(liveRegion);
  return liveRegion;
}

// New function to fix table structure issues (REACT_027)
function fixTableStructureIssues(table) {
  if (!table) return null;
  if (!table.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = table.getAttribute('aria-label') || 'Table';
    table.insertBefore(caption, table.firstChild);
  }
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      const isFirstRow = th.parentNode.rowIndex === 0;
      th.setAttribute('scope', isFirstRow ? 'col' : 'row');
    }
  });
  if (!table.hasAttribute('role')) {
    table.setAttribute('role', 'table');
  }
  return table;
}

// New function to ensure unique landmarks (REACT_025)
function ensureUniqueLandmarks() {
  const landmarkRoles = [
    'main', 'navigation', 'banner', 'contentinfo', 'search', 'complementary', 'form', 'region', 'article', 'section', 'aside', 'figure', 'footer', 'header', 'nav'
  ];
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      elements.forEach((el, idx) => {
        if (!el.hasAttribute('aria-label')) {
          el.setAttribute('aria-label', `${role} ${idx + 1}`);
        }
      });
    }
  });
  const implicitMap = {
    'main': 'main', 'navigation': 'nav', 'banner': 'header', 'contentinfo': 'footer', 'search': '[role="search"]', 'complementary': 'aside', 'form': '[role="form"]', 'region': '[role="region"]', 'article': 'article', 'section': 'section', 'aside': 'aside', 'figure': 'figure', 'footer': 'footer', 'header': 'header', 'nav': 'nav'
  };
  Object.keys(implicitMap).forEach(role => {
    const selector = implicitMap[role];
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      elements.forEach((el, idx) => {
        if (!el.hasAttribute('aria-label')) {
          el.setAttribute('aria-label', `${role} ${idx + 1}`);
        }
      });
    }
  });
}

// Existing exports with the new functions added
module.exports = {
  existingFunction,
  wrapContentWithMain,
  updateFaviconIcon,
  ensureSvgAccessibility,
  setAccessiblePageTitle,
  createLiveRegion,
  getMainElement,
  fixTableStructureIssues,
  ensureUniqueLandmarks
};