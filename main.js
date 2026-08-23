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
  const svgs = document.querySelectorAll('svg');
  const svgsArray = Array.from(svgs);
  const titleIds = new Set();
  svgsArray.forEach((svg, index) => {
    const title = svg.querySelector('title');
    if (!title) {
      const titleElement = document.createElement('title');
      const existingTitle = svgsArray.find(s => s.querySelector('title'));
      const titleText = existingTitle ? existingTitle.querySelector('title').textContent : 'Accessible title for SVG';
      titleElement.textContent = titleText;
      svg.insertBefore(titleElement, svg.firstChild);
    }
    if (!title) {
      const titleElement = svg.querySelector('title');
      titleElement.setAttribute('id', `svg-title-${index}`);
    }
    const label = title ? title.textContent : 'Accessible title for SVG ' + (index + 1);
    svg.setAttribute('aria-label', label);
    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
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

// Rotate back function for unrotate button
export const rotateBack = () => {
  // Placeholder for rotate back functionality
  console.log('Rotate back action triggered');
};

// Function to validate table accessibility
export const validateTableAccessibility = (table) => {
  const issues = [];
  if (!table.tHead) {
    issues.push('Table missing thead element');
  }
  if (!table.tBODY) {
    issues.push('Table missing tbody element');
  }
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      issues.push('Header missing scope attribute');
    }
  });
  return issues;
};

// Function to fix table structure and add scope to <th> elements
export const fixTableStructure = () => {
  // ... (Existing fixTableStructure function)
};

// Additional table structure validation and fixes for REACT_027
export const validateTableStructure = () => {
  // Implementation for handling additional table structure issues
  console.log('Validating table structure for REACT_027...');
  const tables = document.querySelectorAll('table');
  const issues = [];
  tables.forEach((table, index) => {
    const thead = table.tHead;
    const tbody = table.tBODY;
    if (!thead) {
      issues.push(`Table ${index + 1}: Missing thead element`);
    }
    if (!tbody) {
      issues.push(`Table ${index + 1}: Missing tbody element`);
    }
    const headers = table.querySelectorAll('th');
    headers.forEach((th, thIndex) => {
      if (!th.hasAttribute('scope')) {
        issues.push(`Table ${index + 1}, Header ${thIndex + 1}: Missing scope attribute`);
      }
    });
    const caption = table.querySelector('caption');
    if (headers.length > 0 && !caption) {
      issues.push(`Table ${index + 1}: Missing caption for table with headers`);
    }
  });
  return issues;
};

// Helper function to get SVG accessible name
export const getSvgAccessibleName = (svg) => {
  const title = svg.querySelector('title');
  const desc = svg.querySelector('desc');
  const ariaLabel = svg.getAttribute('aria-label');
  return title?.textContent || desc?.textContent || ariaLabel || '';
};

// Helper function to create SVG accessibility props
export const getSvgAccessibleProps = (svg) => {
  const props = {};
  const name = getSvgAccessibleName(svg);
  if (name) {
    props['aria-label'] = name;
  }
  const hasRole = svg.getAttribute('role');
  if (!hasRole) {
    props['role'] = 'img';
  }
  props['focusable'] = 'false';
  return props;
};

// Banner landmark validation
export const validateLandmark = () => {
  const banner = document.querySelector('banner');
  if (banner) {
    if (!banner.hasAttribute('role')) {
      banner.setAttribute('role', 'banner');
    }
  } else {
    const header = document.querySelector('header');
    if (header) {
      header.setAttribute('role', 'banner');
    }
  }
};

// Navigation landmark validation
export const validateNavigationLandmark = () => {
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (navs.length > 1) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
};

// Unique landmarks validation
export const validateUniqueLandmarks = () => {
  const landmarks = document.querySelectorAll('main, article, [role="contentinfo"], [role="complementary"], [role="search"]');
  const landmarkRoles = Array.from(landmarks).map(el => el.getAttribute('role'));
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    const count = elements.length;
    if (count > 1 && role === 'main') {
      const elementsArray = Array.from(elements);
      elementsArray.forEach((el, index) => {
        if (index > 0) {
          console.log(`Duplicate main landmark found, adjusting...`);
          while (el.firstChild) {
            el.lastChild.parentNode.insertBefore(el.lastChild, el);
          }
          el.remove();
        }
      });
    }
  });
};

// Landmark structure validation
export const validateLandmarkStructure = () => {
  const structureIssues = [];
  const banner = document.querySelector('banner');
  if (banner && banner.parentElement !== document.body) {
    structureIssues.push('Banner landmark not direct child of body');
  }
  const navs = document.querySelectorAll('nav');
  navs.forEach(nav => {
    if (nav && nav.parentElement !== document.body && nav.tagName !== 'HEADER') {
      structureIssues.push('Navigation landmark in invalid location - missing label');
    }
  });
  return structureIssues;
};

// Fix for duplicate <main> landmarks - converts extra main elements to <section>
export const convertDuplicateMainToSection = () => {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    const mainElementsArray = Array.from(mainElements);
    for (let i = 0; i < mainElementsArray.length; i++) {
      const main = mainElementsArray[i];
      if (i > 0) {
        const section = document.createElement('section');
        const attributes = Array.from(main.attributes);
        attributes.forEach((attr) => {
          if (attr.name !== 'role') {
            section.setAttribute(attr.name, attr.value);
          }
        });
        const children = Array.from(main.children);
        children.forEach(child => {
          section.appendChild(child);
        });
        main.replaceWith(section);
        section.setAttribute('role', 'region');
      }
    }
  }
};

// Helper function to get unique main landmark
export const getUniqueMainLandmark = () => {
  const mainElements = document.querySelectorAll('main');
  return mainElements.length === 1 ? mainElements[0] : null;
};

// Helper function to convert duplicate main to section with aria-label
export const convertDuplicateMainToSectionWithLabel = (mainElement, label) => {
  if (!mainElement || mainElement.tagName !== 'MAIN') {
    return null;
  }
  const section = document.createElement('section');
  const attributes = Array.from(mainElement.attributes);
  attributes.forEach((attr) => {
    if (attr.name !== 'role') {
      section.setAttribute(attr.name, attr.value);
    }
  });
  const children = Array.from(mainElement.children);
  children.forEach(child => {
    section.appendChild(child);
  });
  mainElement.replaceWith(section);
  section.setAttribute('role', 'region');
  if (label) {
    section.setAttribute('aria-label', label);
  }
  return section;
};

// Function to validate that only one main landmark exists
export const validateSingleMainLandmark = () => {
  const mainElements = document.querySelectorAll('main');
  return {
    count: mainElements.length,
    isValid: mainElements.length <= 1,
    message: mainElements.length > 1 ? 'Duplicate main landmarks found' : 'No issues found'
  };
};

// Function to wrap primary content in a <main> element if it's not already wrapped
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
  const isAlreadyWrapped = firstChild && (firstChild.tagName === 'HEADER' || firstChild.tagName === 'NAV' || firstChild.tagName === 'SECTION');
  if (!isAlreadyWrapped) {
    const main = document.createElement('main');
    const childrenCopy = Array.from(body.children);
    childrenCopy.forEach(child => {
      main.appendChild(child);
    });
    body.appendChild(main);
  }
};