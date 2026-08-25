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
  const hasMainTag = /<main[\s\S]*?>/i.test(content);
  
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
  let itemsHtml = items.map(item => `<li>${item.name || item.id || item.text || ''}</li>`).join('');
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
  return landmarks.map(landmark => `<div role="${landmark}" class="landmark-${landmark}">${landmark}</div>`).join('');
}

// Original utility function
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// REACT_015: Add lang attribute to HTML element
export function addLangAttribute(html, lang = 'en') {
  if (!html) return html;
  const langPattern = /\s*lang\s*=\s*["'][^"']*["']/i;
  if (langPattern.test(html)) {
    return html.replace(langPattern, ` lang="${lang}"`);
  }
  return html.replace(/<html([^>]*)>/i, `<html$1 lang="${lang}">`);
}

// REACT_025: Ensure unique landmarks - fix multiple <main> elements
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

// REACT_025: Convert additional <main> landmarks to <section> for accessibility
function fixMultipleMainLandmarks(html) {
  if (!html) return html;
  
  const mainMatches = html.match(/<main[\s\S]*?<\/main>/gi) || [];
  const mainCount = mainMatches.length;
  
  if (mainCount <= 1) {
    return html;
  }
  
  // Keep the first <main> as-is, convert subsequent ones to <section>
  let mainIndex = 0;
  return html.replace(/<main[\s\S]*?<\/main>/gi, (match) => {
    mainIndex++;
    if (mainIndex === 1) {
      // First main, keep as main
      return match;
    }
    // Replace <main> with <section> and </main> with </section>
    let sectionHtml = match.replace(/<main/i, '<section');
    sectionHtml = sectionHtml.replace(/<\/main>/i, '</section>');
    
    // Add aria-label if it helps describe the section
    if (!/aria-label/i.test(sectionHtml)) {
      sectionHtml = sectionHtml.replace(/<section/i, '<section aria-label="Section content"');
    }
    
    return sectionHtml;
  });
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
  
  const hasMainLandmark = /<main[\s\S]*?>/i.test(html) || /<main\s/i.test(html);
  
  if (!hasMainLandmark) {
    const mainId = 'main-content';
    const mainElement = `<main id="${mainId}" role="main"></main>`;
    
    if (/<body/i.test(html)) {
      return html.replace(/(<body[^>]*>)/i, `$1\n    ${mainElement}`);
    }
    return mainElement + html;
  }
  
  const mainWithId = /<main[^>]*id\s*=\s*["'][^"']*["'][^>]*>/i.test(html);
  
  if (!mainWithId) {
    html = html.replace(/<main([^>]*)>/i, '<main$1 id="main-content">');
    if (!/role\s*=\s*["']main["']/i.test(html)) {
      html = html.replace(/<main([^>]*)>/i, '<main$1 id="main-content" role="main">');
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

// REACT_041: Create accessible SVG data URL for favicons
function createAccessibleSvgDataUrl(options = {}) {
  const {
    viewBox = '0 0 100 100',
    content = '',
    title = 'Icon',
    role = 'img',
    ariaHidden = false
  } = options;
  
  const encodedTitle = encodeURIComponent(title);
  const ariaAttr = ariaHidden ? ' aria-hidden="true"' : ` role="${role}" aria-label="${encodedTitle}"`;
  const roleAttr = ` role="${role}"`;
  
  // Build the SVG with title as first child for accessibility
  const svgContent = `<title>${title}</title>${content}`;
  
  // Encode the entire SVG for use as data URL
  const encodedSvg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"${ariaAttr}>${svgContent}</svg>`
  );
  
  return `data:image/svg+xml,${encodedSvg}`;
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

// REACT_042: Replace placeholder button ID with semantic ID
function fixButtonAccessibility(buttons) {
  if (!buttons || !Array.isArray(buttons)) return [];
  
  const seenIds = new Set();
  
  return buttons.map((button, index) => {
    if (!button) return button;
    
    // Check if button has a placeholder or non-semantic ID
    const placeholderPatterns = [
      /^btn$/i,
      /^button$/i,
      /^button-\d+$/i,
      /^btn-\d+$/i,
      /^placeholder$/i
    ];
    
    const hasPlaceholderId = button.id && placeholderPatterns.some(pattern => pattern.test(button.id));
    
    if (hasPlaceholderId || !button.id) {
      // Generate semantic ID from button text, aria-label, or role
      let semanticId = '';
      
      if (button['aria-label']) {
        semanticId = button['aria-label'].toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      } else if (button.textContent || button.innerText)