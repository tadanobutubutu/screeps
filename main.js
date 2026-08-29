// main.js

// ... (existing code, exports, and functions)

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 4 landmark issues
// - REACT_025: Ensure unique landmarks
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_036: Fix 1 fake link issue
// - REACT_037: Google sign-in logic
// - REACT_040: Replace my-button with actual button id for accessibility

import react from 'react';
const HTML = ({ lang }) => <html lang={lang}>{/* other children */}</html>;

// ... (existing code, exports, and functions)

function getLangAttribute() {
  // Code for getting the language attribute
  // Returns the language code for the page based on content or configuration
  const contentLang = document.documentElement?.lang || document.querySelector('html')?.getAttribute('lang');
  return contentLang || 'en';
}

function addLangAttribute(element) {
  // Code for adding the language attribute to the specified element
  if (element) {
    const lang = getLangAttribute();
    if (!element.hasAttribute('lang')) {
      element.setAttribute('lang', lang);
    }
    return element;
  }
  return null;
}

function validateTableAccessibility() {
  // Code for validating table accessibility
  const tables = document.querySelectorAll('table');
  const issues = [];
  
  tables.forEach((table, index) => {
    // Check for th elements
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      issues.push({
        table: index,
        issue: 'Table missing header elements (th)'
      });
    }
    
    // Check for caption
    const caption = table.querySelector('caption');
    if (!caption) {
      issues.push({
        table: index,
        issue: 'Table missing caption element'
      });
    }
    
    // Check for scope attributes on headers
    headers.forEach((th, thIndex) => {
      if (!th.hasAttribute('scope')) {
        issues.push({
          table: index,
          header: thIndex,
          issue: 'Header missing scope attribute'
        });
      }
    });
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

function validateTableStructure() {
  // Code for validating table structure
  const tables = document.querySelectorAll('table');
  const issues = [];
  
  tables.forEach((table, index) => {
    // Check for proper table structure (thead, tbody, tfoot)
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    
    if (!thead) {
      issues.push({
        table: index,
        issue: 'Table missing thead element'
      });
    }
    
    if (!tbody) {
      issues.push({
        table: index,
        issue: 'Table missing tbody element'
      });
    }
    
    // Check for proper column/row headers
    const cells = table.querySelectorAll('td, th');
    cells.forEach((cell, cellIndex) => {
      const rowSpan = cell.getAttribute('rowspan');
      const colSpan = cell.getAttribute('colspan');
      
      if (rowSpan && parseInt(rowSpan) > 1) {
        // Verify proper structure for rowspan
        const row = cell.parentElement;
        const cellIndex = Array.from(row.children).indexOf(cell);
        // Additional rowspan validation logic
      }
      
      if (colSpan && parseInt(colSpan) > 1) {
        // Verify proper column count for colspan
        const row = cell.parentElement;
        const expectedCols = Array.from(row.children).reduce((sum, c) => {
          return sum + (parseInt(c.getAttribute('colspan')) || 1);
        }, 0);
        // Additional colspan validation logic
      }
    });
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

function fixTableStructure() {
  // Code for fixing table structure issues
  const tables = document.querySelectorAll('table');
  
  tables.forEach((table) => {
    // Ensure proper table structure
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, table.firstChild);
        firstRow.remove();
      }
    }
    
    if (!table.querySelector('tbody')) {
      const existingBody = table.querySelector('tbody');
      if (!existingBody) {
        const tbody = document.createElement('tbody');
        const rows = Array.from(table.querySelectorAll('tr'));
        rows.forEach(row => {
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
      }
    }
    
    // Add missing caption if needed
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
    }
    
    // Add scope to headers without it
    const headers = table.querySelectorAll('th');
    headers.forEach((th) => {
      if (!th.hasAttribute('scope')) {
        // Determine if row or column header
        const row = th.parentElement;
        const rowIndex = Array.from(row.parentElement.children).indexOf(row);
        if (rowIndex === 0) {
          th.setAttribute('scope', 'col');
        } else if (Array.from(row.children).indexOf(th) === 0) {
          th.setAttribute('scope', 'row');
        } else {
          th.setAttribute('scope', 'col');
        }
      }
    });
  });
}

function addMainLandmark() {
  // Code for adding main landmark
  let main = document.querySelector('main');
  if (!main) {
    main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    main.setAttribute('role', 'main');
  }
  return main;
}

function validateLandmark() {
  // Code for validating landmark
  const landmarks = {
    header: document.querySelector('header'),
    nav: document.querySelector('nav'),
    main: document.querySelector('main'),
    aside: document.querySelector('aside'),
    footer: document.querySelector('footer')
  };
  
  const issues = [];
  
  Object.entries(landmarks).forEach(([name, element]) => {
    if (element && !element.textContent.trim()) {
      issues.push({
        landmark: name,
        issue: 'Landmark is empty'
      });
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

function validateLandmarkStructure() {
  // Code for validating landmark structure
  const issues = [];
  
  // Check for multiple header elements without proper labeling
  const headers = document.querySelectorAll('header');
  headers.forEach((header, index) => {
    if (index > 0 && !header.hasAttribute('aria-label') && !header.id) {
      issues.push({
        element: 'header',
        index,
        issue: 'Duplicate header needs aria-label or id'
      });
    }
  });
  
  // Check for multiple main elements
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    issues.push({
      element: 'main',
      issue: 'Page has multiple main elements'
    });
  }
  
  // Check nav elements have proper labels if multiple
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (navs.length > 1 && !nav.hasAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      issues.push({
        element: 'nav',
        index,
        issue: 'Navigation needs aria-label or aria-labelledby when multiple nav elements exist'
      });
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

function validateLandmarkAttributes() {
  // Code for validating landmark attributes
  const landmarks = document.querySelectorAll('[role]');
  const issues = [];
  
  landmarks.forEach((element) => {
    const role = element.getAttribute('role');
    const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
    
    if (!validRoles.includes(role)) {
      issues.push({
        element: element.tagName,
        role,
        issue: 'Invalid or non-standard landmark role'
      });
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

function getSvgAccessibleName() {
  // Code for getting accessible name for SVGs
  const svgs = document.querySelectorAll('svg');
  const names = [];
  
  svgs.forEach((svg, index) => {
    // Check for aria-label
    let accessibleName = svg.getAttribute('aria-label');
    
    // Check for aria-labelledby
    if (!accessibleName) {
      const labelledBy = svg.getAttribute('aria-labelledby');
      if (labelledBy) {
        const labelElement = document.getElementById(labelledBy);
        accessibleName = labelElement ? labelElement.textContent : null;
      }
    }
    
    // Check for title element
    if (!accessibleName) {
      const title = svg.querySelector('title');
      accessibleName = title ? title.textContent : null;
    }
    
    names.push({
      index,
      hasAccessibleName: !!accessibleName,
      accessibleName: accessibleName || null
    });
  });
  
  return names;
}

function setSvgAttributes(svg, accessibleName) {
  // Code for setting SVG attributes with the accessible name
  if (svg && svg.tagName.toLowerCase() === 'svg') {
    // Check if title exists, if not create one
    let title = svg.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      svg.insertBefore(title, svg.firstChild);
    }
    title.textContent = accessibleName;
    
    // Set aria-label on the SVG
    svg.setAttribute('aria-label', accessibleName);
    svg.removeAttribute('aria-hidden');
    
    return svg;
  }
  return null;
}

function ensureUniqueLandmarks() {
  // Code for ensuring unique landmarks
  const issues = [];
  
  // Track landmark types and their occurrences
  const landmarkCounts = {
    banner: 0,
    navigation: 0,
    main: 0,
    complementary: 0,
    contentinfo: 0
  };
  
  // Check for multiple banner landmarks
  const banners = document.querySelectorAll('[role="banner"], header');
  if (banners.length > 1) {
    banners.forEach((banner, index) => {
      if (index > 0) {
        if (!banner.hasAttribute('aria-label') && !banner.id) {
          issues.push({