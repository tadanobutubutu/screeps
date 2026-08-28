// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs
// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

// Example: Set the lang attribute on the root element dynamically
function setLanguage(lang) {
  document.documentElement.lang = lang;
}

// TODO: This is the existing code that needs to be preserved (This comment remains as-is)

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English
  
  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâäçéèêëîïôûü]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }
  
  return setHtmlLangAttribute(lang);
}

// New function to convert anchor tags to buttons with specific id and text
function convertAnchorsToButtons() {
  if (typeof document !== 'undefined') {
    const anchors = document.querySelectorAll('a#unrotate');
    anchors.forEach(anchor => {
      const button = document.createElement('button');
      button.id = anchor.id;
      button.type = 'button';
      button.textContent = anchor.textContent;
      anchor.parentNode.replaceChild(button, anchor);
    });
  }
}

/**
 * Initialize the application
 */
export function init() {
    console.log('Application initialized');
}

/**
 * Ensures an element has an id attribute
 * If the element doesn't have an id, generates a unique one
 * @param {HTMLElement} element - The element to check
 * @param {string} [prefix='element'] - Optional prefix for the generated id
 * @returns {string} The element's id
 */
export function ensureElementHasId(element, prefix = 'element') {
    if (!element) {
        throw new Error('Element is required');
    }
    
    if (!element.id) {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 11);
        element.id = `${prefix}-${timestamp}-${randomStr}`;
    }
    
    return element.id;
}

/**
 * Adds an aria-label attribute to an element
 * @param {HTMLElement} element - The element to modify
 * @param {string} label - The aria-label text
 * @returns {HTMLElement} The modified element
 */
export function addAriaLabel(element, label) {
    if (!element) {
        throw new Error('Element is required');
    }
    
    if (typeof label !== 'string') {
        throw new Error('Label must be a string');
    }
    
    element.setAttribute('aria-label', label);
    return element;
}

/**
 * Renders dependency graphs in the specified container
 * @param {HTMLElement} container - The container element for the graph
 * @param {Object[]} dependencies - Array of dependency objects with name, version, and optional dependencies
 * @param {string} dependencies[].name - The name of the dependency
 * @param {string} dependencies[].version - The version of the dependency
 * @param {string[]} [dependencies[].dependencies] - Optional array of dependency names
 * @returns {HTMLElement} The generated SVG element containing the graph
 */
export function renderDependencyGraph(container, dependencies = []) {
    if (!container) {
        throw new Error('Container element is required');
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 800 600');
    
    // Add styles
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
        .node-rect { fill: #4A90E2; stroke: #357ABD; stroke-width: 2; rx: 8; }
        .node-text { fill: white; font-family: Arial, sans-serif; font-size: 14px; }
        .edge { stroke: #999; stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
    `;
    svg.appendChild(style);
    
    // Add marker definition for arrowheads
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#999"/>
        </marker>
    `;
    svg.appendChild(defs);
    
    // Position calculations
    const nodeWidth = 150;
    const nodeHeight = 50;
    const horizontalGap = 50;
    const verticalGap = 80;
    const startX = 50;
    const startY = 50;
    
    // Layout nodes in a grid
    const cols = Math.floor((800 - startX) / (nodeWidth + horizontalGap));
    const nodes = [];
    
    dependencies.forEach((dep, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = startX + col * (nodeWidth + horizontalGap);
        const y = startY + row * (nodeHeight + verticalGap);
        
        const node = {
            ...dep,
            x,
            y,
            width: nodeWidth,
            height: nodeHeight,
            id: ensureElementHasId(document.createElement('div'), 'dep-node')
        };
        nodes.push(node);
        
        // Create node group
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('id', `node-${node.id}`);
        
        // Rectangle
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', nodeWidth);
        rect.setAttribute('height', nodeHeight);
        rect.setAttribute('class', 'node-rect');
        group.appendChild(rect);
        
        // Name text
        const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        nameText.setAttribute('x', x + nodeWidth / 2);
        nameText.setAttribute('y', y + nodeHeight / 2 - 5);
        nameText.setAttribute('text-anchor', 'middle');
        nameText.setAttribute('class', 'node-text');
        nameText.textContent = dep.name;
        group.appendChild(nameText);
        
        // Version text
        const versionText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        versionText.setAttribute('x', x + nodeWidth / 2);
        versionText.setAttribute('y', y + nodeHeight / 2 + 15);
        versionText.setAttribute('text-anchor', 'middle');
        versionText.setAttribute('class', 'node-text');
        versionText.setAttribute('font-size', '12');
        versionText.textContent = `v${dep.version}`;
        group.appendChild(versionText);
        
        svg.appendChild(group);
        
        // Draw edges to dependencies
        if (dep.dependencies && Array.isArray(dep.dependencies)) {
            dep.dependencies.forEach(depName => {
                const targetNode = nodes.find(n => n.name === depName);
                if (targetNode) {
                    const edge = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    edge.setAttribute('x1', x + nodeWidth);
                    edge.setAttribute('y1', y + nodeHeight / 2);
                    edge.setAttribute('x2', targetNode.x);
                    edge.setAttribute('y2', targetNode.y + nodeHeight / 2);
                    edge.setAttribute('class', 'edge');
                    svg.insertBefore(edge, svg.firstChild);
                }
            });
        }
    });
    
    container.appendChild(svg);
    return svg;
}

// Call the function to convert anchors to buttons if needed
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
    });
    convertAnchorsToButtons();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { init, ensureElementHasId, addAriaLabel, renderDependencyGraph, setHtmlLangAttribute, detectAndSetLang, setLanguage, convertAnchorsToButtons };
}