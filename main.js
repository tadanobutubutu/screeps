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
  return document.documentElement.lang || 'en';
}

function addLangAttribute(element) {
  // Code for adding the language attribute to the specified element
  if (element && !element.hasAttribute('lang')) {
    const lang = getLangAttribute();
    element.setAttribute('lang', lang);
  }
  return element;
}

function validateTableAccessibility() {
  // Code for validating table accessibility
  const issues = [];
  const tables = document.querySelectorAll('table');
  
  tables.forEach((table, index) => {
    const hasCaption = table.querySelector('caption');
    const hasHeaderCells = table.querySelector('th');
    
    if (!hasCaption) {
      issues.push({
        type: 'REACT_027',
        message: `Table ${index + 1} is missing a caption`,
        element: table
      });
    }
    
    if (!hasHeaderCells) {
      issues.push({
        type: 'REACT_027',
        message: `Table ${index + 1} is missing header cells (th)`,
        element: table
      });
    }
  });
  
  return issues;
}

function validateTableStructure() {
  // Code for validating table structure
  const issues = [];
  const tables = document.querySelectorAll('table');
  
  tables.forEach((table, index) => {
    // Check for proper table structure
    const hasThead = table.querySelector('thead');
    const hasTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');
    
    if (!hasThead) {
      issues.push({
        type: 'REACT_027',
        message: `Table ${index + 1} is missing thead element`,
        element: table
      });
    }
    
    if (!hasTbody) {
      issues.push({
        type: 'REACT_027',
        message: `Table ${index + 1} is missing tbody element`,
        element: table
      });
    }
    
    // Check for proper scope attributes on headers
    const headers = table.querySelectorAll('th');
    headers.forEach((header, hIndex) => {
      if (!header.hasAttribute('scope')) {
        issues.push({
          type: 'REACT_027',
          message: `Table ${index + 1} header ${hIndex + 1} is missing scope attribute`,
          element: header
        });
      }
    });
  });
  
  return issues;
}

function fixTableStructure() {
  // Code for fixing table structure issues
  const tables = document.querySelectorAll('table');
  
  tables.forEach((table, index) => {
    // Ensure thead exists
    let thead = table.querySelector('thead');
    if (!thead) {
      thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    
    // Ensure tbody exists
    let tbody = table.querySelector('tbody');
    if (!tbody) {
      tbody = document.createElement('tbody');
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        if (row.parentNode === table) {
          tbody.appendChild(row);
        }
      });
      table.appendChild(tbody);
    }
    
    // Add scope to headers if missing
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      if (!header.hasAttribute('scope')) {
        // Determine if header is for a row or column
        const parentRow = header.parentElement;
        const parentCells = parentRow ? parentRow.querySelectorAll('th, td') : [];
        const cellIndex = Array.from(parentCells).indexOf(header);
        
        if (cellIndex === 0) {
          header.setAttribute('scope', 'row');
        } else {
          header.setAttribute('scope', 'col');
        }
      }
    });
    
    // Add caption if missing
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = `Table ${index + 1}`;
      table.insertBefore(caption, table.firstChild);
    }
  });
}

function addMainLandmark() {
  // Code for adding main landmark
  const existingMain = document.querySelector('main');
  if (!existingMain) {
    const main = document.createElement('main');
    const body = document.querySelector('body');
    if (body) {
      // Move main content into main element
      const children = Array.from(body.children);
      children.forEach(child => {
        if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && 
            child.tagName !== 'HEADER' && child.tagName !== 'FOOTER' && 
            !child.hasAttribute('role') || child.getAttribute('role') !== 'banner') {
          main.appendChild(child);
        }
      });
      body.insertBefore(main, body.firstChild);
    }
  }
  return document.querySelector('main');
}

function validateLandmark() {
  // Code for validating landmark
  const issues = [];
  
  const landmarks = {
    banner: document.querySelector('header, [role="banner"]'),
    main: document.querySelector('main, [role="main"]'),
    contentinfo: document.querySelector('footer, [role="contentinfo"]'),
    navigation: document.querySelector('nav, [role="navigation"]')
  };
  
  if (!landmarks.main) {
    issues.push({
      type: 'REACT_017',
      message: 'Main landmark is missing',
      element: null
    });
  }
  
  if (!landmarks.banner) {
    issues.push({
      type: 'REACT_017',
      message: 'Banner landmark (header) is missing',
      element: null
    });
  }
  
  if (!landmarks.contentinfo) {
    issues.push({
      type: 'REACT_017',
      message: 'Contentinfo landmark (footer) is missing',
      element: null
    });
  }
  
  return issues;
}

function validateLandmarkStructure() {
  // Code for validating landmark structure
  const issues = [];
  
  // Check for proper nesting of landmarks
  const main = document.querySelector('main, [role="main"]');
  if (main) {
    const nestedMains = main.querySelectorAll('main, [role="main"]');
    if (nestedMains.length > 0) {
      issues.push({
        type: 'REACT_017',
        message: 'Main landmark should not be nested',
        element: main
      });
    }
  }
  
  // Check for proper landmark hierarchy
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  const navElements = document.querySelectorAll('nav');
  
  if (header && header.querySelector('footer')) {
    issues.push({
      type: 'REACT_017',
      message: 'Footer should not be inside header',
      element: header
    });
  }
  
  return issues;
}

function validateLandmarkAttributes() {
  // Code for validating landmark attributes
  const issues = [];
  
  const landmarks = document.querySelectorAll('[role]');
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    
    // Check for valid landmark roles
    const validLandmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];
    
    if (!validLandmarkRoles.includes(role)) {
      issues.push({
        type: 'REACT_025',
        message: `Invalid landmark role: ${role}`,
        element: landmark
      });
    }
  });
  
  return issues;
}

function getSvgAccessibleName() {
  // Code for getting accessible name for SVGs
  const svgs = document.querySelectorAll('svg');
  const svgNames = [];
  
  svgs.forEach((svg, index) => {
    // Check for aria-label
    let accessibleName = svg.getAttribute('aria-label');
    
    // Check for aria-labelledby
    if (!accessibleName) {
      const labelledby = svg.getAttribute('aria-labelledby');
      if (labelledby) {
        const labelElement = document.getElementById(labelledby);
        if (labelElement) {
          accessibleName = labelElement.textContent;
        }
      }
    }
    
    // Check for title element
    if (!accessibleName) {
      const title = svg.querySelector('title');
      if (title) {
        accessibleName = title.textContent;
      }
    }
    
    // Check for desc element
    if (!accessibleName) {
      const desc = svg.querySelector('desc');
      if (desc) {
        accessibleName = desc.textContent;
      }
    }
    
    svgNames.push({
      svg,
      index,
      accessibleName: accessibleName || null,
      hasAccessibleName: !!accessibleName
    });
  });
  
  return svgNames;
}

function setSvgAttributes(svg, accessibleName) {
  // Code for setting SVG attributes with the accessible name
  if (!svg || !accessibleName) return svg;
  
  // Generate a unique ID for the title if needed
  const existingTitle = svg.querySelector('title');
  if (existingTitle) {
    existingTitle.textContent = accessibleName;
  } else {
    const title = document.createElement('title');
    title.textContent = accessibleName;
    svg.insertBefore(title, svg.firstChild);
  }
  
  // Add aria-labelledby reference
  let titleId = svg.querySelector('title')?.id;
  if (!titleId) {
    titleId = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const title = svg.querySelector('title');
    if (title) {
      title.id = titleId;
    }
  }
  
  svg.setAttribute('aria-labelledby', titleId);
  
  return svg;
}

function ensureUniqueLandmarks() {
  // Code for ensuring unique landmarks
  const issues = [];
  
  const landmarkSelectors = ['header', 'footer', 'nav', 'main'];
  
  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    const roleBasedElements = document.querySelectorAll(`[role="${selector}"]`);
    const allElements = [...elements, ...roleBasedElements];
    
    // Check for duplicates
    if (allElements.length > 1) {
      // For header and footer, check if they are within the same section
      const uniqueParents = new Set();
      allElements.forEach(el => {
        const parent = el.closest('section, article, div') || el.parentElement;
        if (parent) {
          uniqueParents.add(parent);
        }
      });
      
      if (uniqueParents.size < allElements.length && selector !== 'nav') {
        issues.push({
          type: 'REACT_025',
          message: `Multiple ${selector} landmarks found. Consider using aria-label to distinguish them.`,
          elements: allElements
        });
      }
      
      // Add labels to distinguish landmarks
      allElements.forEach((el, index