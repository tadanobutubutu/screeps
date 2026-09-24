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
 * Checks landmark elements in HTML content for accessibility compliance.
 * @param {string} htmlContent - The HTML content to check
 * @returns {Object} - Object containing landmark element information and any warnings
 */
function checkLandmarkElements(htmlContent) {
  const warnings = [];
  const foundLandmarks = {};

  LANDMARK_ELEMENTS.forEach(landmark => {
    const regex = new RegExp(`<${landmark}[^>]*>`, 'gi');
    const matches = htmlContent.match(regex);
    if (matches) {
      foundLandmarks[landmark] = matches.length;
    } else {
      warnings.push(`Missing landmark element: <${landmark}>`);
    }
  });
  return { warnings, foundLandmarks };
}

/**
 * Add lang attribute to HTML element
 */
function addLangAttribute(lang) {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
        htmlElement.setAttribute('lang', lang);
    }
  });

  if (!foundLandmarks.main) {
    warnings.push('Missing main landmark element');
  }

  return {
    foundLandmarks,
    warnings,
    hasMainLandmark: !!foundLandmarks.main
  };
}

/**
 * Creates an in-page button for the game interface
 * @param {Object} options - Button configuration options
 * @param {string} options.text - The text to display on the button
 * @param {Function} options.onClick - The callback function when button is clicked
 * @param {string} [options.id] - Optional unique identifier for the button
 * @param {string} [options.title] - Optional title/tooltip for the button
 * @param {string} [options.className] - Optional CSS class name for styling
 * @returns {Object} - The created button object
 */
function createInPageButton(options) {
  const { text, onClick, id, title, className } = options;

  // Validate required options
  if (!text) {
    throw new Error('Button text is required');
  }
  if (typeof onClick !== 'function') {
    throw new Error('onClick callback must be a function');
  }

  // Create button object
  const button = {
    id: id || `btn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    text: String(text),
    title: title || '',
    className: className || 'default-button',
    onClick,
    disabled: false,
    visible: true,
    element: null
  };

  // Store button reference
  if (!createInPageButton.buttons) {
    createInPageButton.buttons = {};
  }
  createInPageButton.buttons[button.id] = button;

  return button;
}

// TODO: Implement a function to count dependencies
function countDependencies() {
  // Existing function implementation
  // New implementation to count dependencies using dependencyGraphContent and regex
  const importCommentRegExp = /\/\/\s*require\s*\(|import\s+.*\s+from\s+['"`]/g;
  const importCount = (dependencyGraphContent || '').match(importCommentRegExp) || [];
  return importCount.length;
}

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,
  announcements: [],
  addAnnouncement(message) {
    this.announcements.push({
      message,
      timestamp: Date.now()
    });
  },
  getAnnouncements() {
    return this.announcements;
  },
  clearAnnouncements() {
    this.announcements = [];
  },

// Utility: Check if user prefers reduced motion
function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
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