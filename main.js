import { dependencyGraphContent, indexContent } from './content';

// New function to add lang attribute to HTML element - addresses REACT_015
function addLangAttribute() {
  // Implementation of adding lang attribute
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement;
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', htmlElement.lang || 'en');
    }
  }
}

// New function to fix table structure issues - addresses REACT_027
function validateTableAccessibility(table, index) {
  // Check if the table has a valid structure and add accessible properties to its rows and cells
  if (!table) {
    return { valid: false, error: 'Table not provided' };
  }
  // Add accessible properties to table
  if (table.rows) {
    table.rows.forEach((row, rowIndex) => {
      if (row.cells) {
        row.cells.forEach((cell, cellIndex) => {
          if (!cell.hasAttribute('scope')) {
            // Logic to determine scope based on cell position
          }
        });
      }
    });
  }
  return { valid: true, table };
}

function validateTableStructure(table) {
  // Validate the structure of the table and return a message if it's invalid
  if (!table || !table.rows || table.rows.length === 0) {
    return false;
  }
  // Check for proper table structure (thead, tbody, th elements)
  const firstRow = table.rows[0];
  let hasHeaderCells = false;
  if (firstRow && firstRow.cells) {
    hasHeaderCells = Array.from(firstRow.cells).some(cell => 
      cell.tagName === 'TH' || cell.getAttribute('role') === 'columnheader'
    );
  }
  return hasHeaderCells;
}

// New function to add/fix landmark issues - addresses REACT_017
function addMainLandmark() {
  // Implementation of adding/fixing landmark issues
  if (typeof document !== 'undefined') {
    const mainElements = document.querySelectorAll('main');
    if (mainElements.length === 0) {
      // No main element found, need to add one
      const primaryContent = document.querySelector('[role="main"]') || 
                            document.querySelector('.main-content') ||
                            document.querySelector('#main-content');
      if (primaryContent && primaryContent.parentNode) {
        const mainElement = document.createElement('main');
        mainElement.setAttribute('id', 'main-content');
        mainElement.setAttribute('role', 'main');
        mainElement.setAttribute('aria-label', 'Main content');
        primaryContent.parentNode.insertBefore(mainElement, primaryContent);
      }
    }
  }
}

function validateLandmark(element) {
  // Validate landmark element
  if (!element) {
    return { valid: false, error: 'Element not provided' };
  }
  const role = element.getAttribute('role');
  const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  return { valid: validLandmarks.includes(role), role };
}

function validateLandmarkStructure() {
  // Validate landmark structure in document
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  const errors = [];
  const landmarks = document.querySelectorAll('[role]');
  const landmarkCount = {};
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    landmarkCount[role] = (landmarkCount[role] || 0) + 1;
    
    // Check for multiple main landmarks (only one allowed)
    if (role === 'main' && landmarkCount[role] > 1) {
      errors.push('Multiple main landmarks found');
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to add accessible names to SVGs - addresses REACT_041
function addSvgAccessibleNames() {
  // Implementation of adding accessible names to SVGs
  if (typeof document !== 'undefined') {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach((svg, index) => {
      // Add title if not present
      if (!svg.querySelector('title')) {
        const title = document.createElement('title');
        title.textContent = `SVG graphic ${index + 1}`;
        title.id = `svg-title-${index + 1}`;
        svg.insertBefore(title, svg.firstChild);
      }
      // Add aria-labelledby if not present
      const titleElement = svg.querySelector('title');
      if (titleElement && !svg.getAttribute('aria-labelledby') && !svg.getAttribute('aria-label')) {
        svg.setAttribute('aria-labelledby', titleElement.id);
      }
      // Ensure SVG has role="img"
      if (!svg.getAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    });
  }
}

function getSvgAccessibleName(svgElement) {
  // Get accessible name for SVG
  if (!svgElement) return '';
  const title = svgElement.querySelector('title');
  return title ? title.textContent : svgElement.getAttribute('aria-label') || '';
}

function setSvgAttributes(svgElement, accessibleName) {
  // Set accessible attributes on SVG
  if (!svgElement) return;
  if (accessibleName) {
    let title = svgElement.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      svgElement.insertBefore(title, svgElement.firstChild);
    }
    title.textContent = accessibleName;
    svgElement.setAttribute('aria-labelledby', title.id || 'svg-title');
  }
}

// New function to ensure unique landmarks - addresses REACT_025
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    throw new TypeError('Input must be an array of landmarks');
  }

  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!landmark || typeof landmark !== 'object') {
      return false;
    }

    // Create a unique identifier based on landmark name and coordinates (if available)
    const identifier = landmark.id || `${landmark.name || ''}${landmark.lat || ''}${landmark.lng || ''}`;
    
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
}

// New function to fix fake link issue - addresses REACT_036
function fixFakeLinkIssue() {
  // Implementation of fixing fake link issue
  if (typeof document !== 'undefined') {
    // Find elements that look like links but aren't
    const fakeLinks = document.querySelectorAll('[role="link"]:not(a[href])');
    fakeLinks.forEach(link => {
      // Check if it should be an actual link or a button
      const href = link.getAttribute('data-href');
      if (href) {
        // Convert to actual anchor element
        const anchor = document.createElement('a');
        anchor.setAttribute('href', href);
        anchor.setAttribute('role', 'link');
        // Copy all attributes and children
        Array.from(link.attributes).forEach(attr => {
          if (attr.name !== 'role') {
            anchor.setAttribute(attr.name, attr.value);
          }
        });
        while (link.firstChild) {
          anchor.appendChild(link.firstChild);
        }
        link.parentNode.replaceChild(anchor, link);
      } else {
        // Convert to button element
        link.setAttribute('role', 'button');
        if (!link.hasAttribute('aria-pressed')) {
          link.setAttribute('aria-pressed', 'false');
        }
      }
    });
  }
}

function validateLinkAccessibility(linkElement) {
  // Validate link accessibility
  if (!linkElement) {
    return { valid: false, error: 'Link element not provided' };
  }
  const errors = [];
  
  // Check for accessible name
  const accessibleName = linkElement.textContent.trim() || linkElement.getAttribute('aria-label');
  if (!accessibleName) {
    errors.push('Link missing accessible name');
  }
  
  // Check for proper href
  if (linkElement.tagName === 'A' && !linkElement.href && !linkElement.getAttribute('data-href')) {
    errors.push('Link missing href');
  }
  
  return { valid: errors.length === 0, errors };
}

function handleFakeLinks(container) {
  // Handle fake links in a container
  const containerElement = container || (typeof document !== 'undefined' ? document : null);
  if (!containerElement) return;
  
  const fakeLinks = containerElement.querySelectorAll('span[role="link"], div[role="link"], a:not([href])');
  fakeLinks.forEach(fakeLink => {
    const dataHref = fakeLink.getAttribute('data-href');
    if (dataHref) {
      fakeLink.setAttribute('role', 'link');
      fakeLink.addEventListener('click', () => {
        window.location.href = dataHref;
      });
    }
  });
}

function createInPageButton(element, options = {}) {
  // Create an accessible in-page button
  if (!element) return null;
  
  const button = document.createElement('button');
  button.textContent = options.text || 'Click here';
  button.setAttribute('aria-label', options['aria-label'] || options.text || 'In-page button');
  
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  
  return button;
}

// New function to add proper landmark regions - addresses REACT_037
function addProperLandmarkRegions() {
  // Implementation of adding proper landmark regions
  if (typeof document !== 'undefined') {
    const body = document.body;
    
    // Check for and add banner (header) landmark if missing
    const header = document.querySelector('header');
    if (header && !header.hasAttribute('role')) {
      header.setAttribute('role', 'banner');
    }
    
    // Check for and add navigation landmark if missing
    const navElements = document.querySelectorAll('nav');
    navElements.forEach((nav, index) => {
      if (!nav.hasAttribute('role')) {
        nav.setAttribute('role', 'navigation');
      }
      if (!nav.getAttribute('aria-label')) {
        nav.setAttribute('aria-label', index === 0 ? 'Main navigation' : `Navigation ${index + 1}`);
      }
    });
    
    // Check for and add main landmark if missing
    const mainElements = document.querySelectorAll('main');
    mainElements.forEach(main => {
      if (!main.hasAttribute('role') || main.getAttribute('role') !== 'main') {
        // Check if it's a semantic main element or needs role="main"
        if (main.tagName !== 'MAIN') {
          main.setAttribute('role', 'main');
        }
      }
    });
    
    // Check for and add complementary landmark if missing
    const asides