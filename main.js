// Import lodash library
import _ from 'lodash';

// Import myOtherFunction from another module
import myOtherFunction from './otherModule';

// TODO: Add any other missing exports that might have been?
// Added missing exports as per the issue

// Function to wrap primary content in main element
function wrapPrimaryContentInMain(content, options = {}) {
  if (!content) return '';
  
  const {
    id = 'main-content',
    role = 'main',
    className = ''
  } = options;
  
  const classAttr = className ? ` class="${className}"` : '';
  const mainStart = `<main id="${id}" role="${role}"${classAttr}>`;
  const mainEnd = '</main>';
  
  // Check if content is already wrapped in a main element
  const hasMainTag = /<main[\s>]/i.test(content) ||
                     /role\s*=\s*["']main["']/i.test(content);
  
  if (hasMainTag) {
    return content;
  }
  
  return mainStart + content + mainEnd;
}

// Function to render dependency graph content
function renderDependencyGraph(data) {
  if (!data) return '';
  const { nodes = [], edges = [] } = data;
  let html = '<div class="dependency-graph"><ul>';
  nodes.forEach(node => {
    const connectedEdges = edges.filter(e => e.from === node.id || e.to === node.id);
    html += `<li>${node.name || node.id} (${connectedEdges.length} connections)</li>`;
  });
  html += '</ul></div>';
  return html;
}

// Function to render index view content
function renderIndexView(data) {
  if (!data) return '<div class="index-view">Index View</div>';
  const { title = 'Index View', items = [] } = data;
  let itemsHtml = items.map(item => `<li>${item.name || item.id || 'Item'}</li>`).join('');
  return `<div class="index-view"><h2>${title}</h2><ul>${itemsHtml}</ul></div>`;
}

// Function to add proper landmark regions
function addProperLandmarkRegions(data) {
  const landmarkRegions = [];
  const landmarks = data?.landmarks || ['main'];
  
  landmarks.forEach((landmark, index) => {
    const region = {
      role: landmark.role || 'region',
      label: landmark.label || landmark.role || 'content',
      id: landmark.id || `${landmark.role || 'region'}-${index}`
    };
    landmarkRegions.push(region);
  });
  
  return landmarkRegions;
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
  return landmarks.map(landmark => `<div role="${landmark}">${landmark}</div>`).join('');
}

// Original utility function
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(html, lang = 'en') {
  if (!html) return html;
  const langPattern = /\s*lang\s*=\s*["'][^"']*["']/i;
  if (langPattern.test(html)) {
    return html.replace(langPattern, ` lang="${lang}"`);
  }
  return html.replace(/<html(\s[^>]*)?>/i, `<html$1 lang="${lang}">`);
}

// REACT_027: Fix table structure issues
function fixTableStructureIssues(tables) {
  if (!tables || !Array.isArray(tables)) return [];
  
  return tables.map(table => {
    const hasHeader = table.rows?.some(row => row.isHeader);
    const hasCaption = !!table.caption;
    
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
function addMainLandmark(html) {
  if (!html) return html;
  
  const hasMainLandmark = /<main[\s>]/i.test(html) ||
                          /role\s*=\s*["']main["']/i.test(html);
  
  if (!hasMainLandmark) {
    const mainId = 'main-content';
    const mainElement = `<main id="${mainId}" role="main"></main>`;
    
    if (/<body[^>]*>/i.test(html)) {
      return html.replace(/(<body[^>]*>)/i, `$1\n    ${mainElement}`);
    }
    return mainElement + html;
  }
  
  const mainWithId = /<main[^>]*\sid\s*=/i.test(html);
  
  if (!mainWithId) {
    html = html.replace(/<main(\s[^>]*)?>/i, '<main$1 id="main-content">');
    if (!/id\s*=\s*["']main-content["']/i.test(html)) {
      html = html.replace(/<main(\s[^>]*)?>/i, '<main$1 id="main-content" role="main">');
    }
  }
  
  return html;
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames(svgs) {
  if (!svgs || !Array.isArray(svgs)) return [];
  
  return svgs.map((svg, index) => {
    if (!svg.accessibleName && !svg.title && !svg.desc) {
      svg.accessibleName = svg.title || `SVG icon ${index + 1}`;
      svg.role = 'img';
    }
    return svg;
  });
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(landmarks) {
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
      landmark.id = landmark.id || `${role}-${index}`;
    }
    
    return landmark;
  });
}

// REACT_036: Fix fake link issue
function fixFakeLinkIssue(element) {
  if (!element) return null;
  
  const tagName = (element.tagName || element.tag || '').toLowerCase();
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
export { addLangAttribute, fixTableStructureIssues, addMainLandmark, addSvgAccessibleNames, ensureUniqueLandmarks, fixFakeLinkIssue, renderSkipLink, renderLandmarkNavigation, formatDate };