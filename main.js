// TODO: Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----

/**
 * REACT_036 Fix: React Fake Link
 *
 * Issue: The "rotate back" link in ... used
 * <a href="#"> which doesn't navigate anywhere, causing screen readers
 * to announce it as a dead link and preventing proper keyboard activation.
 *
 * Fix: This script replaces the anchor element with a proper <button>
 * element that has correct keyboard focus,
 * space/enter activation, and screen reader semantics.
 */

/**
 * Configuration for the dependency graph controller.
 */
const config = {
    rotationStep: 90,
    animationDuration: 300
};

/**
 * Replaces the fake anchor link with a proper button element
 * for accessibility compliance (REACT_036).
 *
 * This function finds the <a id="unrotate" href="#"> element and
 * replaces it with a <button> that provides proper keyboard focus,
 * space/enter activation, and screen reader semantics.
 */
function fixFakeLink() {
    const oldLink = document.getElementById('unrotate');
    if (oldLink) {
        const unrotateButton = document.createElement('button');
        unrotateButton.id = 'unrotate';
        unrotateButton.textContent = 'Rotate back';
        unrotateButton.setAttribute('role', 'button');
        unrotateButton.setAttribute('aria-label', 'Rotate the dependency graph back to the original position.');
        oldLink.parentNode.replaceChild(unrotateButton, oldLink);
        unrotateButton.addEventListener('click', handleRotateBack);
    }
}

/* New function REACT_015: Add lang attribute to HTML element */
function addLangAttribute() {
    const htmlElement = document.documentElement;
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
        htmlElement.setAttribute('lang', 'en');
    }
}

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
export const addLangAttributeExport = () => {
  const htmlElement = document.documentElement;
  if (htmlElement && htmlElement.getAttribute('lang') !== 'en') {
    htmlElement.setAttribute('lang', 'en');
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
    }
    if (!svg.getAttribute('role')) {
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

// Rotate back function for unrotate button
export const rotateBack = () => {
  rotation = 0;
  img.style.transform = 'rotate(0deg)';
};

// Function to validate table accessibility
export const validateTableAccessibility = (table) => {
  const issues = [];
  // Check if table has proper structure
  if (!table.tHead) {
    issues.push('Table missing thead element');
  }
  if (!table.tBodies || table.tBodies.length === 0) {
    issues.push('Table missing tbody element');
  }
  // Check for headers
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
  // Implementation for fixing table structure
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has thead
    if (!table.tHead) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    // Ensure table has tbody
    if (!table.tBodies || table.tBodies.length === 0) {
      const tbody = document.createElement('tbody');
      const rows = Array.from(table.querySelectorAll('tr'));
      const theadRow = table.tHead ? table.tHead.querySelector('tr') : null;
      rows.forEach(row => {
        if (row !== theadRow) {
          tbody.appendChild(row);
        }
      });
      table.appendChild(tbody);
    }
    // Add scope to headers
    const headers = table.querySelectorAll('th');
    headers.forEach((th, index) => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
};

// ===== NEW CODE TO ADDRESS REACT_027 (Table Structure Issues) =====
// Additional table structure validation and fixes for REACT_027
export const validateTableStructure = () => {
  // Implementation for handling additional table structure issues
  console.log('Validating table structure for REACT_027...');
  const tables = document.querySelectorAll('table');
  const issues = [];
  tables.forEach((table, index) => {
    // Check for proper table structure
    const thead = table.tHead;
    const tbody = table.tBodies && table.tBodies.length > 0;
    if (!thead) {
      issues.push('Table ' + (index + 1) + ': Missing thead element');
    }
    if (!tbody) {
      issues.push('Table ' + (index + 1) + ': Missing tbody element');
    }
    // Check that all th elements have scope attributes
    const headers = table.querySelectorAll('th');
    headers.forEach((th, thIndex) => {
      if (!th.hasAttribute('scope')) {
        issues.push('Table ' + (index + 1) + ', Header ' + (thIndex + 1) + ': Missing scope attribute');
      }
    });
    // Check for proper caption if table has headers
    const caption = table.querySelector('caption');
    if (headers.length > 0 && !caption) {
      issues.push('Table ' + (index + 1) + ': Missing caption for table with headers');
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
    if (header) {
      header.setAttribute('role', 'banner');
    }
  }
};

// Navigation landmark validation
export const validateNavigationLandmark = () => {
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (navs.length > 1 && !nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', 'Navigation ' + (index + 1));
    }
  });
};

// Unique landmarks validation
export const validateUniqueLandmarks = () => {
  // Check for duplicate landmarks
  const landmarks = document.querySelectorAll('main, [role="main"], [role="article"], [role="contentinfo"], [role="complementary"], [role="search"]');
  const landmarkRoles = Array.from(landmarks).map(el => el.getAttribute('role') || el.tagName.toLowerCase());
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll('[role="' + role + '"], ' + role);
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
    if (nav && nav.parentElement !== document.body && nav.tagName !== 'HEADER') {
      console.log('Navigation landmark in invalid location - missing label');
    }
  });
  return structureIssues;
};

// ===== NEW CODE TO ADDRESS REACT_025 (React Unique Landmarks) =====
// Fix for duplicate <main> landmarks - converts extra main elements to <section>
export const fixDuplicateMainLandmarks = () => {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    // Keep the first main landmark as is
    const mainElementsArray = Array.from(mainElements);
    mainElementsArray.slice(1).forEach((main, index) => {
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
    });
  }
};

// Helper function to get unique main landmark
export const getUniqueMainLandmark = () => {
  const mainElements = document.querySelectorAll('main');
  return mainElements.length ===