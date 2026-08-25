// Import lodash library
import _ from 'lodash';

// Import and use dependencyGraphContent/indexContent from the appropriate modules
import { renderDependencyGraph, indexContent } from './dependencyGraphContent';

// Import myOtherFunction from another module
import myOtherFunction from './otherModule';

// - REACT_015: Add lang attribute to HTML element
export function addLangAttribute() {
    const html = document.documentElement;
    if (html) {
        html.setAttribute('lang', 'en');
    }
}

// - REACT_041: Add accessible names to 2 SVGs
export function addSvgAccessibleNames() {
    // Find SVG elements in app/layout.tsx and dashboard/app/layout.tsx
    const svgElements = document.querySelectorAll('link[rel="icon"] svg, link[rel="apple-touch-icon"] svg');
    svgElements.forEach((svg, index) => {
        if (index === 0) {
            svg.setAttribute('aria-label', 'Application logo');
            svg.setAttribute('role', 'img');
        } else if (index === 1) {
            svg.setAttribute('aria-label', 'Navigation icon');
            svg.setAttribute('role', 'img');
        }
    });
}

// - REACT_036: Fix 1 fake link issue
export function fixFakeLink() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#' || href === '' || href === null || href === 'javascript:;') {
            link.setAttribute('href', '#main-content');
            if (!link.textContent.trim() || link.textContent === '') {
                link.setAttribute('aria-label', 'Skip to main content');
            }
        }
    });
}

// Newly added function...
export function addAccessibleIds() {
    const accessibleElements = document.querySelectorAll('button, a');
    accessibleElements.forEach((element) => {
        if (element.getAttribute('id')) return; // Skip elements with an id attribute

        const currentId = `accessible-${Math.random().toString(36).substr(2, 9)}`;
        element.setAttribute('id', currentId);
    });
}

// TODO: Implement wrapPrimaryContentInMain function
export function wrapPrimaryContentInMain() {
    const mainContent = document.querySelector('#main-content, .main-content');
    if (mainContent && mainContent.parentElement && mainContent.parentElement.tagName !== 'MAIN') {
        const mainTag = document.createElement('main');
        mainTag.setAttribute('role', 'main');
        const parent = mainContent.parentElement;
        while (mainContent.firstChild) {
            mainTag.appendChild(mainContent.firstChild);
        }
        parent.replaceChild(mainTag, mainContent);
    }
}

// Function to render dependency graph content
function renderDependencyGraphContent(data) {
  if (!data) return '';
  const { nodes = [], edges = [] } = data;
  let html = '<div class="dependency-graph"><ul>';
  nodes.forEach(node => {
    const connectedEdges = edges.filter(e => e.from === node.id || e.to === node.id);
    html += `<li>${node.label || node.id} (${connectedEdges.length} connections)</li>`;
  });
  html += '</ul></div>';
  return html;
}

// Function to render index view content
function renderIndexView(data) {
  if (!data) return '<div class="index-view">Index View</div>';
  const { title = 'Index View', items = [] } = data;
  let itemsHtml = items.map(item => `<li>${item.name || item}</li>`).join('');
  return `<div class="index-view"><h2>${title}</h2><ul>${itemsHtml}</ul></div>`;
}

// Function to add proper landmark regions
function addProperLandmarkRegions(data) {
  const landmarkRegions = [];
  const landmarks = data?.landmarks || [{ role: 'main', label: 'Main content' }];

  landmarks.forEach(landmark => {
    const region = {
      role: landmark.role || 'region',
      label: landmark.label || landmark.role || 'content',
      id: landmark.id || `landmark-${landmark.role || 'region'}`
    };
    landmarkRegions.push(region);
  });

  return landmarkRegions;
}

// Export the renderDependencyGraph function and indexContent from dependencyGraphContent module
export { renderDependencyGraph, indexContent };

export function addMainLandmark() {
    // Implementation for adding main landmark
    const mainElements = document.querySelectorAll('[role="main"]');
    if (mainElements.length === 0) {
        const main = document.createElement('main');
        main.setAttribute('role', 'main');
        const body = document.body;
        if (body.firstChild) {
            body.insertBefore(main, body.firstChild);
        } else {
            body.appendChild(main);
        }
        main.setAttribute('aria-label', 'Main content area');
    }
}

export function ensureUniqueLandmarks() {
    const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
    landmarks.forEach(role => {
        const elements = document.querySelectorAll(`[role="${role}"], ${role}`);
        if (elements.length > 1) {
            elements.forEach((el, index) => {
                if (index > 0) {
                    const div = document.createElement('div');
                    div.setAttribute('role', role);
                    while (el.firstChild) {
                        div.appendChild(el.firstChild);
                    }
                    el.parentNode.replaceChild(div, el);
                }
            });
        }
    });
}

// - REACT_027: Fix table structure issues
export function fixTableStructure() {
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
        // Check if table has headers
        const headers = table.querySelectorAll('th');
        const hasHeaders = headers.length > 0;
        
        if (!hasHeaders) {
            // Check first row for header cells
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const cells = firstRow.querySelectorAll('td');
                cells.forEach((cell) => {
                    const th = document.createElement('th');
                    th.setAttribute('scope', 'col');
                    while (cell.firstChild) {
                        th.appendChild(cell.firstChild);
                    }
                    cell.parentNode.replaceChild(th, cell);
                });
            }
        } else {
            // Add scope attributes to existing headers
            headers.forEach((header) => {
                if (!header.hasAttribute('scope')) {
                    const parent = header.parentElement;
                    if (parent && parent.tagName === 'TR') {
                        const siblings = Array.from(parent.querySelectorAll('th, td'));
                        const headerIndex = siblings.indexOf(header);
                        const firstRow = table.querySelector('tr');
                        if (firstRow && firstRow === parent) {
                            header.setAttribute('scope', 'col');
                        } else {
                            header.setAttribute('scope', 'row');
                        }
                    }
                }
            });
        }

        // Ensure proper table structure
        if (!table.querySelector('caption')) {
            const caption = document.createElement('caption');
            caption.textContent = 'Data table';
            table.insertBefore(caption, table.firstChild);
        }
    });
}

// TODO: Implement function for adding proper landmark regions
export function addLandmarkRegions() {
    const body = document.body;

    // Check for header landmark
    const header = document.querySelector('header, [role="banner"]');
    if (!header) {
        const headerEl = document.createElement('header');
        headerEl.setAttribute('role', 'banner');
        if (body.firstChild) {
            body.insertBefore(headerEl, body.firstChild);
        } else {
            body.appendChild(headerEl);
        }
    }

    // Check for nav landmark
    const nav = document.querySelector('nav, [role="navigation"]');
    if (!nav) {
        const navEl = document.createElement('nav');
        navEl.setAttribute('role', 'navigation');
        navEl.setAttribute('aria-label', 'Main navigation');
        if (body.firstChild) {
            body.insertBefore(navEl, body.firstChild);
        } else {
            body.appendChild(navEl);
        }
    }

    // Check for footer landmark
    const footer = document.querySelector('footer, [role="contentinfo"]');
    if (!footer) {
        const footerEl = document.createElement('footer');
        footerEl.setAttribute('role', 'contentinfo');
        if (body.lastChild) {
            body.insertBefore(footerEl, body.lastChild);
        } else {
            body.appendChild(footerEl);
        }
    }
}

// TODO: Implement function for addressing accessibility issues from insight report
export function addressAccessibilityIssues() {
    // Example of addressing accessibility issues:
    // - Add `lang` attribute to HTML element
    addLangAttribute();

    // - Add accessible names to SVGs
    addSvgAccessibleNames();

    // - Wrap primary content in a main element
    wrapPrimaryContentInMain();

    // - Fix table structure issues
    fixTableStructure();
}

// New function that needs to be exported with the requested name "myNewFunction"
function myNewFunction() {
  return 'myNewFunction result';
}

// Skip navigation link for keyboard users
function renderSkipLink() {
  return '<a href="#main-content" class="skip-link">Skip to main content</a>';
}

// Original landmark navigation function
function renderLandmarkNavigation() {
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  return landmarks.map(landmark => `<div class="landmark-${landmark}"></div>`).join('');
}

// Original utility function
function formatDate(date) {
  if (!date) return '';
  return _.format(date, 'YYYY-MM-DD');
}

// REACT_015: Add lang attribute to HTML element
function addLangAttributeUtil(html, lang = 'en') {
  if (!html) return html;
  const langPattern = /\s*lang\s*=\s*["'][^"']*["']/i;
  if (langPattern.test(html)) {
    return html.replace(langPattern, ` lang="${lang}"`);
  }
  return html.replace(/<html/i, `<html lang="${lang}"`);
}

// REACT_027: Fix table structure issues
function fixTableStructureIssues(tables) {
  if (!tables || !Array.isArray(tables)) return [];
  
  return tables.map(table => {
    const hasHeader = table.rows?.some(row => row.isHeader);
    const hasCaption = !!table.caption;
    const scopeAttributes = ['col', 'row'];
    
    if (!hasCaption && table.rows?.length > 0) {
      table.hasCaptionAdded = true;
    }
    
    if (hasHeader) {
      table.rows = table.rows.map(row => {
        if (row.isHeader && !row.scope) {
          row.scope = row.type === 'column' ? 'col' : 'row';
        }
        return row;
      });
    }
    
    return table;
  });
}

// REACT_017: Add/fix landmark issues - ensure main landmark exists
function addMainLandmarkUtil(html) {
  if (!html) return html;
  
  const hasMainLandmark = /<main[\s>]/i.test(html);
  
  if (!hasMainLandmark) {
    const mainId = 'main-content';
    const mainElement = `<main id="${mainId}" role="main"></main>`;
    
    if (/<body[\s>]/i.test(html)) {
      return html.replace(/(<body[\s>]*>)/i, `$1\n    ${mainElement}`);
    }
    return mainElement + html;
  }
  
  const mainWithId = /<main[^>]*id\s*=/i.test(html);
  
  if (!mainWithId) {
    html = html.replace(/<main(\s|>)/i, '<main id="main-content"$1');
  }
  
  return html;
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNamesUtil(svgs) {
  if (!svgs || !Array.isArray(svgs)) return [];
  
  return svgs.map((svg, index) => {
    if (!svg.accessibleName) {
      svg.accessibleName = svg.title || `SVG icon ${index + 1}`;
      svg.role = 'img';
    }
    return svg;
  });
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarksUtil(landmarks) {
  if (!landmarks || !Array.isArray(landmarks)) return [];
  
  const seenIds = new Set();
  const seenRoles = new Map();
  
  return landmarks.map((landmark, index) => {
    const role = landmark.role || 'region';
    
    if (landmark.id) {
      if (seenIds.has(landmark.id)) {
        landmark.id = `${landmark.id}-${index}`;
      }
      seenIds.add(landmark.id);
    } else {
      landmark.id = `${role}-${index}`;
      seenIds.add(landmark.id);
    }
    
    if (seenRoles.has(role)) {
      const count = seenRoles.get(role);
      seenRoles.set(role, count + 1);
      landmark.uniqueLabel = `${role}-${count + 1}`;
    } else {
      seenRoles.set(role, 1);
    }
    
    if (landmark.label) {
      landmark.id = landmark.id || `${role}-${landmark.label.toLowerCase().replace(/\s+/g, '-')}`;
    }
    
    return landmark;
  });
}

// REACT_036: Fix fake link issue
function fixFakeLinkIssue(element) {
  if (!element) return null;
  
  const tagName = element.tagName?.toLowerCase();
  const isClickable = element.onclick || element.getAttribute?.('role') === 'link';
  const href = element.getAttribute?.('href');
  
  if (isClickable && !href && tagName !== 'a' && tagName !== 'button') {
    element.role = 'button';
    element.tabIndex = element.tabIndex ?? 0;
    element.isFakeLink = true;
  }
  
  if (tagName === 'a' && !href) {
    element.setAttribute?.('role', 'button');
    element.tabIndex = element.tabIndex ?? 0;
  }
  
  return element;
}

// Export the new functions, preserving the existing exports
export { myNewFunction as default, myNewFunction, addProperLandmarkRegions, renderDependencyGraph, renderIndexView, wrapPrimaryContentInMain };
export * from './otherModule';
export { myOtherFunction };
export { addLangAttributeUtil, fixTableStructureIssues, addMainLandmarkUtil, addSvgAccessibleNamesUtil, ensureUniqueLandmarksUtil, fixFakeLinkIssue, renderSkipLink, renderLandmarkNavigation, formatDate };