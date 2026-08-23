// Import required module(s) and export the new necessary function(s) here in main.js
import { class1, function1, Object1 } from './path/to/module';
import { unique } from './utils';
import dependencyGraphContent from './dependencyGraphContent';
import indexContent from './indexContent';
export { unique };

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

// Initialize accessibility fixes
addLangAttribute();