// main.js - Accessibility improvements implementation and additional features

const fs = require('fs');
const path = require('path');
const {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
} = require('./accessibility-utils');

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

const viewsDir = path.join(__dirname, 'views');

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];

// The new function you need to add
function newFunction() {
    // Example implementation: return a simple message
    return 'New function executed';
}

// TODO: Add back any required exports that might have been omitted

// Game loop function
function run() {
  // Your game logic here...

  // Update scope attributes in all .html files in the views directory
  const files = fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(viewsDir, file));

  files.forEach(file => {
    updateThScope(file);
    validateTableAccessibility(file);
    // Add more accessibility checks here if needed
    
    // REACT_015: Add lang attribute to HTML element
    addLangAttributeToHtml(file);
    
    // REACT_017: Add landmark roles and fix landmark issues
    fixLandmarkRoles(file);
    
    // REACT_041: Add accessible names to 2 SVGs
    addAccessibleNamesToSvgs(file);
    
    // REACT_025: Ensure unique landmarks (2 issues)
    ensureUniqueLandmarksInFile(file);
    
    // REACT_036: Fix 1 fake link issue
    fixFakeLinks(file);
  });
}

/**
 * REACT_015: Adds lang attribute to HTML element if missing
 * @param {string} file - The file path to process
 */
function addLangAttributeToHtml(file) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const langRegex = /<html([^>]*)>/gi;
    const match = langRegex.exec(content);
    
    if (match) {
      const openingTag = match[0];
      const attributes = match[1];
      
      // Check if lang attribute already exists
      if (!/lang\s*=/i.test(attributes)) {
        // Add lang="en" to the html tag
        const updatedTag = openingTag.replace(/>/, ' lang="en">');
        content = content.replace(openingTag, updatedTag);
        fs.writeFileSync(file, content);
        console.log(`Added lang attribute to HTML element in ${file}`);
      }
    }
  } catch (error) {
    console.error(`Error adding lang attribute in ${file}:`, error);
  }
}

/**
 * REACT_017: Fixes landmark issues by adding appropriate roles and labels
 * @param {string} file - The file path to process
 */
function fixLandmarkRoles(file) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    // Check for section elements without aria-label or role
    const sectionRegex = /<section(?![^>]*aria-label)(?![^>]*aria-labelledby)(?![^>]*role)([^>]*)>/gi;
    content = content.replace(sectionRegex, (match, attrs) => {
      modified = true;
      return `<section${attrs} role="region">`;
    });
    
    // Check for divs used as navigation without proper attributes
    const navDivRegex = /<div(?=[^>]*class[^>]*\bnav\b)(?![^>]*role)([^>]*)>/gi;
    content = content.replace(navDivRegex, (match, attrs) => {
      modified = true;
      return `<div${attrs} role="navigation">`;
    });
    
    if (modified) {
      fs.writeFileSync(file, content);
      console.log(`Fixed landmark roles in ${file}`);
    }
  } catch (error) {
    console.error(`Error fixing landmark roles in ${file}:`, error);
  }
}

/**
 * REACT_041: Adds accessible names to SVG elements that are missing them
 * @param {string} file - The file path to process
 */
function addAccessibleNamesToSvgs(file) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let svgCount = 0;
    
    // Find SVG elements that need accessible names
    const svgRegex = /<svg(?![^>]*aria-label)(?![^>]*aria-labelledby)(?![^>]*role)([^>]*)>/gi;
    
    content = content.replace(svgRegex, (match, attrs) => {
      svgCount++;
      const titleId = `svg-title-${svgCount}-${Date.now()}`;
      // Add role="img" and aria-labelledby
      const newAttrs = attrs.replace(/\s*$/, '');
      return `<svg${newAttrs} role="img" aria-labelledby="${titleId}"><title id="${titleId}">SVG Image ${svgCount}</title>`;
    });
    
    if (svgCount > 0) {
      fs.writeFileSync(file, content);
      console.log(`Added accessible names to ${svgCount} SVG(s) in ${file}`);
    }
  } catch (error) {
    console.error(`Error adding SVG accessible names in ${file}:`, error);
  }
}

/**
 * REACT_025: Ensures landmarks have unique identifiers
 * @param {string} file - The file path to process
 */
function ensureUniqueLandmarksInFile(file) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    const usedIds = new Set();
    
    // Find all landmark elements
    LANDMARK_ELEMENTS.forEach(landmark => {
      const landmarkRegex = new RegExp(`<${landmark}([^>]*)>`, 'gi');
      
      content = content.replace(landmarkRegex, (match, attrs) => {
        // Check if element has an id
        const idMatch = /id\s*=\s*["']([^"']+)["']/i.exec(attrs);
        
        if (idMatch) {
          const id = idMatch[1];
          if (usedIds.has(id)) {
            // ID is not unique, create a new unique id
            modified = true;
            const newId = `${landmark}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            return match.replace(idMatch[0], `id="${newId}"`);
          }
          usedIds.add(id);
        } else {
          // Add unique id to landmark elements that are likely to be duplicated
          if (landmark === 'section' || landmark === 'aside' || landmark === 'nav') {
            modified = true;
            const newId = `${landmark}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            return match.replace('>', ` id="${newId}">`);
          }
        }
        return match;
      });
    });
    
    if (modified) {
      fs.writeFileSync(file, content);
      console.log(`Ensured unique landmarks in ${file}`);
    }
  } catch (error) {
    console.error(`Error ensuring unique landmarks in ${file}:`, error);
  }
}

/**
 * REACT_036: Fixes fake links (anchor tags without href that should be buttons)
 * @param {string} file - The file path to process
 */
function fixFakeLinks(file) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    // Find anchor tags without href or with href="#"
    const fakeLinkRegex = /<a(?![^>]*href)([^>]*)>([^<]*)<\/a>/gi;
    
    content = content.replace(fakeLinkRegex, (match, attrs, text) => {
      modified = true;
      // Convert to button
      return `<button${attrs}>${text}</button>`;
    });
    
    // Also fix empty anchors (just closing tag or whitespace)
    const emptyLinkRegex = /<a\s+class\s*=\s*["']([^"']*)["'][^>]*>\s*<\/\s*a\s*>/gi;
    
    content = content.replace(emptyLinkRegex, (match, className) => {
      modified = true;
      return `<button class="${className}"></button>`;
    });
    
    if (modified) {
      fs.writeFileSync(file, content);
      console.log(`Fixed fake links in ${file}`);
    }
  } catch (error) {
    console.error(`Error fixing fake links in ${file}:`, error);
  }
}

// Start the game loop
Module.onInit = function() {
  setInterval(run, 1000);
};

/**
 * Ensures an element has an id attribute
 * @param {HTMLElement} element - The element to check
 * @returns {string} The element's id (existing or newly generated)
 */
function ensureElementHasId(element) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (element.id) {
    return element.id;
  }
  
  const id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
}

/**
 * Adds an aria-label attribute to an element
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text
 * @returns {HTMLElement} The element with aria-label added
 */
function addAriaLabel(element, label) {
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
 * Renders a dependency graph
 * @param {Object} data - The dependency data to render
 * @param {HTMLElement} container - The container element for the graph
 * @returns {HTMLElement} The rendered graph container
 */
function renderDependencyGraph(data, container) {
  if (!data) {
    throw new Error('Dependency data is required');
  }
  
  const graphContainer = container || document.createElement('div');
  graphContainer.className = 'dependency-graph';
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 800 600');
  
  // Render nodes and edges based on data
  if (data.nodes && Array.isArray(data.nodes)) {
    data.nodes.forEach((node, index) => {
      const x = 100 + (index % 4) * 200;
      const y = 100 + Math.floor(index / 4) * 150;
      
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${x}, ${y})`);
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', '30');
      circle.setAttribute('fill', node.color || '#4A90E2');
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', '.35em');
      text.textContent = node.name || node.id || index;
      
      g.appendChild(circle);
      g.appendChild(text);
      svg.appendChild(g);
    });
  }
  
  // Render edges
  if (data.edges && Array.isArray(data.edges)) {
    data.edges.forEach(edge => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', edge.sourceX || 0);
      line.setAttribute('y1', edge.sourceY || 0);
      line.setAttribute('x2', edge.targetX || 0);
      line.setAttribute('y2', edge.targetY || 0);
      line.setAttribute('stroke', '#999');
      line.setAttribute('stroke-width', '2');
      svg.appendChild(line);
    });
  }
  
  graphContainer.appendChild(svg);
  ensureElementHasId(graphContainer);
  addAriaLabel(graphContainer, 'Dependency graph visualization');
  
  return graphContainer;
}

function myFunction() {
    // Existing implementation
}

module.exports = {
    main,
    SomeClass,
    someUtility,
    config,
    countDependencies,
    run,
    checkTableStructure,
    ensureElementHasId,
    addAriaLabel,
    renderDependencyGraph,
    myNewFunction,
    newFunction,
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmarkStructure,
    getSvgAccessibleName,
    createInPageButton,
    createAccessibleLink,
    displayModuleStructure,
    // New functions from merge
    checkLandmarkElements,
    createInPageButtonOptions,
    countDependencies: countDependencies,
    a11yStore,
    addLandmarkRegions,
    addressAccessibilityIssues,
    LANDMARK_ELEMENTS,
    updateLiveRegion,
    addSVGAccessibilityProps,
    preserveExistingCode,
    personName,
    validateLandmark,
    ensureUniqueLandmarks,
    checkLandmarkElementsInDom,
    makeAPICall,
    createInPageButtonElement,
    updateThScopeAttribute,
    validateTableAccessibilityFn,
    validateTableStructureFn,
    validateLandmarkStructureFn,
    getSvgAccessibleNameFn,
    // Accessibility fix functions
    addLangAttributeToHtml,
    fixLandmarkRoles,
    addAccessibleNamesToSvgs,
    ensureUniqueLandmarksInFile,
    fixFakeLinks,
    myFunction,
};