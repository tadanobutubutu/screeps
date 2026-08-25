// Import lodash library
import _ from 'lodash';

// Import myOtherFunction from another module
import myOtherFunction from './otherModule';

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
  const hasMainTag = /<main[\s\S]*>/i.test(content);

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
  let itemsHtml = items.map(item => `<li>${item.name || item.id || item.text || 'Item'}</li>`).join('');
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

// Function to render skip navigation link for keyboard users
function renderSkipLink() {
  return '<a href="#main-content" class="skip-link">Skip to main content</a>';
}

// Updated original landmark navigation function
function renderLandmarkNavigation() {
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  const renderedLandmarks = landmarks.map(landmark => `<div class="landmark-${landmark}">${landmark}</div>`);
  return renderedLandmarks.join('');
}

// Utility function to format date
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Function to add lang attribute to HTML element
function addLangAttribute(html, lang = 'en') {
  if (!html) return html;
  const langPattern = /\s*lang\s*=\s*["'][^"']*["']/i;
  if (langPattern.test(html)) {
    return html.replace(langPattern, ` lang="${lang}"`);
  }
  return html.replace(/<html([^>]*)>/i, `<html$1 lang="${lang}">`);
}

// Function to fix table structure issues
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

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(html, lang = 'en') {
  if (!html) return html;
  const langPattern = /\s*lang\s*=\s*["'][^"']*["']/i;
  if (langPattern.test(html)) {
    return html.replace(langPattern, ` lang="${lang}"`);
  }
  return html.replace(/<html([^>]*)>/i, `<html$1 lang="${lang}">`);
}

// Export all functions from main module
export { myNewFunction as default, myNewFunction, addProperLandmarkRegions, renderDependencyGraph, renderIndexView, wrapPrimaryContentInMain, renderSkipLink, renderLandmarkNavigation, formatDate };
export * from './otherModule';
export { myOtherFunction };
export { addLangAttribute, fixTableStructureIssues, addMainLandmark, addSvgAccessibleNames, ensureUniqueLandmarks, fixFakeLinkIssue, fixButtonAccessibility };