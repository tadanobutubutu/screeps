// Import required module(s) and export the new necessary function(s) here in main.js
import { class1, function1, Object1 } from './path/to/module';
import { unique } from './utils';

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

// Add code for REACT_027: Table Structure Issues
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

// Remove Rotate back function and placeholder code as it's redundant

// Add code for new REACT_25: React Unique Landmarks

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
          section.setAttribute(attr.name, attr.value);
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

  return mainElements.length;
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

export const validateSingleMainLandmark = () => {
  const mainElements = document.querySelectorAll('main');
  return {
    count: mainElements.length,
    isValid: mainElements.length <= 1,
  };
};

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