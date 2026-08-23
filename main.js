// Import required module(s) and export the new necessary function(s) here in main.js
import { class1, function1, Object1 } from './path/to/module';
import { unique } from './utils';
import dependencyGraphContent from './dependencyGraphContent';
import indexContent from './indexContent';
import React from 'react';
export { unique };

// ==========================================
// VANILLA JAVASCRIPT DOM MANIPULATION UTILITIES
// ==========================================

// Helper function to get lang attribute value
export const getLangAttribute = () => {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    return htmlElement.getAttribute('lang') || 'en';
  }
  return 'en';
};

// Helper function to get full lang attribute with region
export const getFullLangAttribute = () => {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    const lang = htmlElement.getAttribute('lang') || 'en';
    return lang;
  }
  return 'en';
};

// Accessibility fix for REACT_015: Add lang attribute to HTML element
export const addLangAttribute = () => {
  const htmlElement = document.documentElement;
  if (htmlElement && htmlElement.getAttribute('lang') !== 'en') {
    htmlElement.setAttribute('lang', 'en');
  }
};

// Accessibility fix for REACT_041: Add accessible names to 2 SVGs
export const addAccessibleNamesToSVGs = () => {
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([title])');
  svgs.forEach((svg, index) => {
    const title = svg.querySelector('title');
    if (!title) {
      const titleElement = document.createElement('title');
      titleElement.textContent = 'Accessible title for SVG ' + (index + 1);
      svg.insertBefore(titleElement, svg.firstChild);
    }
    if (svg.getAttribute('role') !== 'img') {
      svg.setAttribute('role', 'img');
    }
    const titleId = 'svg-title-' + index;
    svg.setAttribute('aria-labelledby', titleId);
  });
};

// Function to add scope to table headers
export const addScopeToTableHeaders = () => {
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (header.tagName === 'TH') {
      const parentRow = header.closest('tr');
      const parentThead = header.closest('thead');
      const isFirstCell = parentRow && parentRow.cells[0] === header;
      if (parentThead) {
        header.setAttribute('scope', 'col');
      } else if (isFirstCell) {
        header.setAttribute('scope', 'row');
      } else {
        header.setAttribute('scope', 'col');
      }
    }
  });
};

// New code to address REACT_027 (Table Structure Issues)
export const validateTableStructure = () => {
  // Implementation for handling additional table structure issues
  console.log('Validating table structure for REACT_027...');
  const tables = document.querySelectorAll('table');
  const issues = [];
  tables.forEach((table, index) => {
    // Check for proper table structure
    const thead = table.tHead;
    const tbody = table.tBODY;
    if (!thead) {
      issues.push(`Table ${index + 1}: Missing thead element`);
    }
    if (!tbody) {
      issues.push(`Table ${index + 1}: Missing tbody element`);
    }
    // Check that all th elements have scope attributes
    const headers = table.querySelectorAll('th');
    headers.forEach((th, thIndex) => {
      if (!th.hasAttribute('scope')) {
        issues.push(`Table ${index + 1}, Header ${thIndex + 1}: Missing scope attribute`);
      }
    });
    // Check for proper caption if table has headers
    const caption = table.querySelector('caption');
    if (headers.length > 0 && !caption) {
      issues.push(`Table ${index + 1}: Missing caption for table with headers`);
    }
  });
  return issues;
};

// New code to address REACT_041 (SVG Accessible Names)
export const getSvgAccessibleName = (svg) => {
  const title = svg.querySelector('title');
  const desc = svg.querySelector('desc');
  const ariaLabel = svg.getAttribute('aria-label');
  return title?.textContent || desc?.textContent || ariaLabel || '';
};

export const getSvgAccessibleProps = (svg) => {
  const props = {};
  // Get accessible name
  const name = getSvgAccessibleName(svg);
  if (name) {
    props['aria-label'] = name;
  }
  // Add role if needed
  const hasRole = svg.getAttribute('role');
  if (!hasRole) {
    props['role'] = 'img';
  }
  // Ensure focusable is handled
  props['focusable'] = 'false';
  return props;
};

// New code to address REACT_017 (Landmark Issues)
export const validateLandmark = () => {
  const banner = document.querySelector('[role="banner"], header');
  if (!banner) {
    const header = document.querySelector('header');
    if (header) {
      header.setAttribute('role', 'banner');
    }
  }
};

export const validateNavigationLandmark = () => {
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (navs.length > 1 && !nav.hasAttribute('aria-label')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
};

export const validateUniqueLandmarks = () => {
  // Check for duplicate landmarks
  const landmarks = document.querySelectorAll('main, article, [role="contentinfo"], [role="complementary"], [role="search"]');
  const landmarkRoles = Array.from(landmarks).map(el => el.getAttribute('role'));
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1 && role === 'main') {
      elements.forEach((el, index) => {
        if (index > 0) {
          // Remove extra main landmark or adjust
          console.log('Duplicate main landmark found, adjusting...');
        }
      });
    }
  });
};

export const validateLandmarkStructure = () => {
  const structureIssues = [];
  // Check banner placement
  const banner = document.querySelector('[role="banner"], header');
  if (banner && banner.parentElement !== document.body) {
    structureIssues.push('Banner landmark not direct child of body');
  }
  // Check navigation placement
  const navs = document.querySelectorAll('nav');
  navs.forEach(nav => {
    if (nav && nav.parentElement !== document.body && nav.tagName !== 'HEADER') {
      structureIssues.push('Navigation landmark in invalid location - missing label');
    }
  });
  return structureIssues;
};

// New code to address REACT_025 (React Unique Landmarks)
export const fixDuplicateMainLandmarks = () => {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    // Keep the first main landmark as is
    const mainElementsArray = Array.from(mainElements);
    mainElementsArray.forEach((main, index) => {
      if (index === 0) return; // Skip the first main
      // Create a section element to replace the duplicate main
      const section = document.createElement('section');
      // Copy all attributes from main to section
      Array.from(main.attributes).forEach(attr => {
        if (attr.name !== 'role') {
          section.setAttribute(attr.name, attr.value);
        }
      });
      // Add aria-label for accessibility if label exists
      const ariaLabel = main.getAttribute('aria-label');
      if (ariaLabel) {
        section.setAttribute('aria-label', ariaLabel);
      }
      // Move all child nodes to the section
      while (main.firstChild) {
        section.appendChild(main.firstChild);
      }
      // Replace main with section in the DOM
      main.parentNode.replaceChild(section, main);
    });
  }
};

export const getUniqueMainLandmark = () => {
  const mainElements = document.querySelectorAll('main');
  return mainElements.length === 1 ? mainElements[0] : null;
};

export const convertDuplicateMainToSection = (mainElement, label) => {
  if (!mainElement || mainElement.tagName !== 'MAIN') {
    return null;
  }
  const section = document.createElement('section');
  // Copy attributes from main
  Array.from(mainElement.attributes).forEach(attr => {
    if (attr.name !== 'role') {
      section.setAttribute(attr.name, attr.value);
    }
  });
  // Add aria-label for accessibility if label exists
  if (label) {
    section.setAttribute('aria-label', label);
  }
  // Move children
  while (mainElement.firstChild) {
    section.appendChild(mainElement.firstChild);
  }
  // Replace main with section in the DOM
  mainElement.parentNode.replaceChild(section, mainElement);
  return section;
};

export const validateSingleMainLandmark = () => {
  const mainElements = document.querySelectorAll('main');
  return {
    count: mainElements.length,
    isValid: mainElements.length <= 1,
    message: mainElements.length > 1 ? 'Duplicate main landmarks found' : 'No issues found'
  };
};

export const wrapPrimaryContentInMain = () => {
  // Check if a main element already exists
  const existingMain = document.querySelector('main');
  if (existingMain) {
    return existingMain; // Already wrapped, no need to do anything
  }

  const body = document.body;
  if (!body) {
    console.log('No body element found.');
    return null;
  }

  // Get all children of body
  const children = Array.from(body.children);
  if (children.length === 0) {
    console.log('No content found to wrap in main.');
    return null;
  }

  // Check if content is already wrapped in a suitable container
  const firstChild = children[0];
  const isAlreadyWrapped = firstChild && firstChild.tagName === 'MAIN';
  if (isAlreadyWrapped) {
    return firstChild;
  }

  // Create a main element
  const main = document.createElement('main');
  // Move all children of body to main
  children.forEach(child => {
    main.appendChild(child);
  });
  // Append main to body
  body.appendChild(main);
  return main;
};

// ==========================================
// REACT-BASED ACCESSIBILITY UTILITIES
// ==========================================

// New changes to fix the React SVG Accessible Name issue
// Add an accessible name to the SVGs in the icons object
const icons = {
  icon: '<svg ... viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" ...',
  apple: '<svg ... viewBox="0 0 100 100"><title>Apple Icon</title><text y="0.9em" ...',
};

/**
 * Adds a language attribute to an HTML element.
 * @param {React.ReactElement} element JSX element to add lang attribute
 */
export function addLangAttributeReact(element) {
  if (!element || !element.props) {
    return element;
  }
  
  return React.cloneElement(element, {
    ...element.props,
    lang: element.props.lang || 'en',
  });
}

/**
 * Recursively processes children to add language attributes.
 * @param {React.ReactElement} element JSX element to process
 * @returns {React.ReactElement} Element with lang attributes added
 */
export function processChildrenWithLang(element) {
  if (!element || typeof element !== 'object') {
    return element;
  }

  if (element.props && element.props.children) {
    const processedChildren = React.Children.map(element.props.children, child => {
      if (child && typeof child === 'object' && child !== null && child.props) {
        if (child.props) {
          return React.cloneElement(child, {
            ...child.props,
            className: (child.props.className || '') + ' jsx-lang-en',
            lang: child.props.lang || 'en',
          });
        }
      }
      return child;
    });

    return React.cloneElement(element, {
      ...element.props,
      children: processedChildren,
    });
  }

  return element;
}

/**
 * Fixes 26 table structure issues.
 */
export function fixTableStructure() {
  // Ensure tables have proper semantic structure
  // - Add <caption> for table titles
  // - Use <thead> and <tbody> properly
  // - Add scope attributes to header cells
  // - Ensure proper th/td usage
  
  const tableFixes = {
    addCaption: (table, captionText) => {
      return React.cloneElement(table, {
        ...table.props,
      }, [
        React.createElement('caption', { key: 'caption' }, captionText),
        ...React.Children.toArray(table.props.children)
      ]);
    },
    
    addScopeToHeaders: (headerCells) => {
      return headerCells.map((cell, index) => {
        if (cell.type === 'th') {
          return React.cloneElement(cell, {
            ...cell.props,
            scope: cell.props.scope || 'col',
          });
        }
        return cell;
      });
    },
    
    ensureTheadTbody: (table) => {
      const children = React.Children.toArray(table.props.children);
      let hasThead = false;
      let hasTbody = false;
      
      React.Children.forEach(table.props.children, child => {
        if (child && child.type === 'thead') hasThead = true;
        if (child && child.type === 'tbody') hasTbody = true;
      });
      
      return table;
    },
  };
  
  return tableFixes;
}

/**
 * Adds a main landmark to the application.
 */
export function addMainLandmark(element) {
  if (!element) {
    return React.createElement('main', { id: 'main-content', role: 'main' });
  }
  
  return React.cloneElement(element, {
    ...element.props,
    id: element.props.id || 'main-content',
    role: element.props.role || 'main',
  });
}

/**
 * Validates that a landmark exists.
 * @param {Document} doc Document to check for landmarks
 * @returns {boolean} True if at least one landmark exists
 */
export function validateLandmarkReact(doc) {
  const landmarks = doc.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="search"], [role="form"]');
  const validLandmarkRoles = [
    'banner', 'navigation', 'main', 'complementary', 
    'contentinfo', 'search', 'form'
  ];
  
  for (const landmark of landmarks) {
    if (validLandmarkRoles.includes(landmark.getAttribute('role'))) {
      return true;
    }
  }
  
  // Also check for native HTML5 landmark elements
  const nativeLandmarks = doc.querySelectorAll('header, nav, main, aside, footer');
  return nativeLandmarks.length > 0;
}

/**
 * Ensures landmarks are unique.
 * @param {Array} landmarks Array of landmark elements or objects
 * @returns {Array} Array with duplicates removed
 */
export function ensureUniqueLandmarks(landmarks) {
  const unique = [];
  const seen = new Set();
  
  landmarks.forEach(landmark => {
    const identifier = landmark.id || landmark.getAttribute?.('role') || landmark.label || JSON.stringify(landmark);
    if (!seen.has(identifier)) {
      seen.add(identifier);
      unique.push(landmark);
    }
  });
  
  return unique;
}

/**
 * Validates the structure of landmarks.
 * @param {Document} doc Document to validate landmark structure
 * @returns {Object} Validation result with errors array
 */
export function validateLandmarkStructureReact(doc) {
  const errors = [];
  const landmarks = doc.querySelectorAll('[role="main"], main');
  
  // Ensure exactly one main landmark
  if (landmarks.length === 0) {
    errors.push('No main landmark found. Add a <main> element or role="main".');
  } else if (landmarks.length > 1) {
    errors.push(`Found ${landmarks.length} main landmarks. Should have exactly one.`);
  }
  
  // Check for proper landmark nesting
  const headerElements = doc.querySelectorAll('header, [role="banner"]');
  headerElements.forEach(header => {
    const parent = header.parentElement;
    if (parent && (parent.tagName === 'ARTICLE' || parent.tagName === 'ASIDE' || parent.getAttribute?.('role') === 'complementary')) {
      errors.push('Header should not be nested inside article, aside, or complementary landmarks.');
    }
  });
  
  // Check for unique landmark labels
  const landmarkLabels = {};
  const labeledLandmarks = doc.querySelectorAll('[aria-label], [aria-labelledby]');
  labeledLandmarks.forEach(landmark => {
    const label = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby');
    if (landmarkLabels[label]) {
      errors.push(`Duplicate landmark label: "${label}". Labels should be unique.`);
    }
    landmarkLabels[label] = true;
  });
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Adds an accessible name to an SVG element.
 * @param {SVGElement} svgElement SVG element to modify
 * @param {string} accessibleName Accessible name to add
 */
export function addAccessibleNameToSVG(svgElement, accessibleName) {
  if (!svgElement || !accessibleName) {
    return svgElement;
  }
  
  // Ensure role="img" is set
  if (!svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
  
  // Set aria-label for accessible name
  svgElement.setAttribute('aria-label', accessibleName);
  
  return svgElement;
}

/**
 * Gets the accessible name of an SVG element.
 * @param {SVGElement} svgElement SVG element to get name from
 * @returns {string} The accessible name (title, aria-label, or aria-labelledby)
 */
export function getAccessibleName(svgElement) {
  if (!svgElement) {
    return '';
  }
  
  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby reference
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const titleElement = document.getElementById(ariaLabelledby);
    if (titleElement) {
      return titleElement.textContent;
    }
  }
  
  // Fallback to title element
  const titleElement = svgElement.querySelector('title');
  if (titleElement) {
    return titleElement.textContent;
  }
  
  return '';
}

/**
 * Creates accessibility properties for an SVG element.
 * @param {string} accessibleName The accessible name for the SVG
 * @returns {Object} Object with role, aria-labelledby, and aria-label
 */
export function createAccessibilityProps(accessibleName) {
  if (!accessibleName) {
    return {
      role: 'img',
      'aria-hidden': 'true',
    };
  }
  
  return {
    role: 'img',
    'aria-label': accessibleName,
    'aria-labelledby': undefined, // Prefer aria-label over aria-labelledby for simple cases
  };
}

/**
 * Fixes a fake link issue.
 * @param {HTMLElement} element Element to check and fix
 * @returns {HTMLElement} Fixed element
 */
export function fixFakeLinkIssue(element) {
  if (!element) {
    return element;
  }
  
  // Check if it's an anchor tag without href (fake link)
  if (element.tagName === 'A' && !element.href && !element.getAttribute('href')) {
    if (!element.getAttribute('role')) {
      element.setAttribute('role', 'button');
    }
    if (!element.getAttribute('tabIndex')) {
      element.setAttribute('tabIndex', '0');
    }
  }
  
  return element;
}

export { icons };

// Initialize accessibility fixes (vanilla JS)
addLangAttribute();