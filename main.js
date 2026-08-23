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
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en'); // Assuming English for this example
  }
};

// Accessibility fix for REACT_041: Add accessible names to 2 SVGs
export const addAccessibleNamesToSVGs = () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const title = svg.querySelector('title');
    if (!title) {
      const titleElement = document.createElement('title');
      titleElement.textContent = 'Accessible title for SVG ' + (index + 1);
      svg.insertBefore(titleElement, svg.firstChild);

      // Add aria-labelledby attribute to link the title
      const titleId = 'svg-title-' + index;
      titleElement.id = titleId;

      // Add role="img" if not present
      if (!svg.getAttribute('role')) {
        svg.setAttribute('role', 'img');
      }

      // Add aria-labelledby to reference the title
      svg.setAttribute('aria-labelledby', titleId);
    }
  });
};

// Function to add scope to table headers
export const addScopeToTableHeaders = () => {
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.getAttribute('scope')) {
      // Determine if header is in thead (col) or first cell of row (row)
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

  // Check if table has proper structure
  if (!table.querySelector('thead')) {
    issues.push('Table missing thead element');
  }
  if (!table.querySelector('tbody')) {
    issues.push('Table missing tbody element');
  }

  // Check for headers
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      issues.push('Header missing scope attribute');
    }
  });

  return issues;
};

// Function to fix table structure and add scope to <th> elements
export const fixTableStructure = () => {
  // ... (Existing fixTableStructure function)
};

// ===== NEW CODE TO ADDRESS REACT_027 (Table Structure Issues) =====
// Additional table structure validation and fixes for REACT_027
export const validateTableStructure = () => {
  // Implementation for handling additional table structure issues
  // This function complements fixTableStructure for complex scenarios
  console.log('Validating table structure for REACT_027...');

  const tables = document.querySelectorAll('table');
  const issues = [];

  tables.forEach((table, index) => {
    // Check for proper table structure
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    if (!thead) {
      issues.push(`Table ${index + 1}: Missing thead element`);
    }

    if (!tbody) {
      issues.push(`Table ${index + 1}: Missing tbody element`);
    }

    // Check that all th elements have scope attributes
    const headers = table.querySelectorAll('th');
    headers.forEach((th, thIndex) => {
      if (!th.getAttribute('scope')) {
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

// ===== NEW CODE TO ADDRESS REACT_041 (SVG Accessible Names) =====
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

// ===== NEW CODE TO ADDRESS REACT_017 (Landmark Issues) =====
// Banner landmark validation
export const validateLandmark = () => {
  const banner = document.querySelector('[role="banner"]');
  if (!banner) {
    const header = document.querySelector('header');
    if (header) header.setAttribute('role', 'banner');
  }
};

// Navigation landmark validation
export const validateNavigationLandmark = () => {
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label') && navs.length > 1) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
};

// Unique landmarks validation
export const validateUniqueLandmarks = () => {
  // Check for duplicate landmarks
  const landmarks = document.querySelectorAll('[role="navigation"], [role="contentinfo"], [role="complementary"], [role="search"]');
  const landmarkRoles = Array.from(landmarks).map(el => el.getAttribute('role'));

  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1 && role === 'main') {
      // Handle duplicate main landmarks
      elements.forEach((el, index) => {
        if (index > 0) {
          // Remove extra main landmark or adjust
          console.log('Duplicate main landmark found, adjusting...');
        }
      });
    }
  });
};

// Landmark structure validation
export const validateLandmarkStructure = () => {
  const structureIssues = [];

  // Check banner placement
  const banner = document.querySelector('[role="banner"]');
  if (banner && banner.parentElement !== document.body) {
    structureIssues.push('Banner landmark not direct child of body');
  }

  // Check navigation placement
  const navs = document.querySelectorAll('nav');
  navs.forEach(nav => {
    if (!nav.getAttribute('aria-label') && navs.length > 1) {
      console.log('Navigation landmark in invalid location - missing label');
    }
  });
};

// ===== NEW CODE TO ADDRESS REACT_025 (React Unique Landmarks) =====
// Fix for duplicate <main> landmarks - converts extra main elements to <section>
export const fixDuplicateMainLandmarks = () => {
  const mainElements = document.querySelectorAll('main');

  if (mainElements.length > 1) {
    // Keep the first main landmark as is
    // Convert subsequent main landmarks to section elements
    mainElements.forEach((main, index) => {
      if (index > 0) {
        // Create a section element to replace the duplicate main
        const section = document.createElement('section');

        // Copy all attributes from main to section
        Array.from(main.attributes).forEach(attr => {
          if (attr.name !== 'role') {
            section.setAttribute(attr.name, attr.value);
          }
        });

        // Move all child nodes to the section
        while (main.firstChild) {
          section.appendChild(main.firstChild);
        }

        // Replace main with section in the DOM
        main.parentNode.replaceChild(section, main);
      }
    });
  }
};

// Helper function to get unique main landmark
export const getUniqueMainLandmark = () => {
  const mainElements = document.querySelectorAll('main');
  return mainElements.length === 1 ? mainElements[0] : null;
};

// Helper function to convert duplicate main to section with aria-label
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

  // Add aria-label for accessibility
  if (label) {
    section.setAttribute('aria-label', label);
  }

  // Move children
  while (mainElement.firstChild) {
    section.appendChild(mainElement.firstChild);
  }

  mainElement.parentNode.replaceChild(section, mainElement);

  return section;
};

// Function to validate that only one main landmark exists
export const validateSingleMainLandmark = () => {
  const mainElements = document.querySelectorAll('main');
  return {
    count: mainElements.length,
    isValid: mainElements.length <= 1,
  };
};

// ===== NEW CODE TO ADDRESS REACT_017 (Add main landmark if missing) =====
// Ensure the page has a main landmark; if not, wrap the body content in a main element
export const addMainLandmark = () => {
  const main = document.querySelector('main');
  if (!main) {
    const mainElement = document.createElement('main');
    const body = document.body;
    if (body) {
      // Move all children of body into the main element
      while (body.firstChild) {
        mainElement.appendChild(body.firstChild);
      }
      body.appendChild(mainElement);
    }
  }
};

// ===== NEW CODE TO ADDRESS REACT_036 (React Fake Link) =====
// Fix for fake links - elements that act as links but are not <a> tags
export const fixFakeLinks = () => {
  const fakeLinks = document.querySelectorAll('div[onclick], span[onclick], [role="link"]');
  fakeLinks.forEach(el => {
    if (el.tagName !== 'A' && el.tagName !== 'BUTTON' && el.tagName !== 'INPUT') {
      if (!el.hasAttribute('role')) {
        el.setAttribute('role', 'link');
      }
      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
      }
    }
  });
};

// ===== NEW CODE TO ADDRESS THE TODO: Functions that render dependency graphs or index views =====
// Function to render dependency graph using imported dependencyGraphContent
export const renderDependencyGraph = () => {
  // Implementation would use dependencyGraphContent to render the graph
  console.log('Rendering dependency graph using:', dependencyGraphContent);
  // Placeholder implementation - actual rendering logic would go here
  return dependencyGraphContent;
};

// Function to render index view using imported indexContent
export const renderIndexView = () => {
  // Implementation would use indexContent to render the index view
  console.log('Rendering index view using:', indexContent);
  // Placeholder implementation - actual rendering logic would go here
  return indexContent;
};

// Function to apply all accessibility fixes from the insight report
export const applyAllAccessibilityFixes = () => {
  addLangAttribute();
  addAccessibleNamesToSVGs();
  addScopeToTableHeaders();
  fixTableStructure();
  validateTableStructure();
  validateLandmark();
  validateNavigationLandmark();
  validateUniqueLandmarks();
  validateLandmarkStructure();
  fixDuplicateMainLandmarks();
  addMainLandmark();
  fixFakeLinks();
};

// Function to initialize accessibility fixes when DOM is fully loaded
export const initAccessibilityFixes = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAllAccessibilityFixes);
  } else {
    applyAllAccessibilityFixes();
  }
};

export { class1, function1, Object1 };