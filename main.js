import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

let icons = {};

// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(document, lang = 'en') {
  if (!document || !document.documentElement) {
    return false;
  }
  
  const htmlElement = document.documentElement;
  const currentLang = htmlElement.getAttribute('lang');
  
  if (!currentLang || currentLang.trim() === '') {
    htmlElement.setAttribute('lang', lang);
    return true;
  }
  
  return false;
}

function setLanguageAttribute(document, lang = 'en') {
  return addLangAttribute(document, lang);
}

// REACT_027: Fix 26 table structure issues
function fixTableStructureIssues(container) {
  if (!container) {
    container = document;
  }
  
  const tables = container.querySelectorAll('table');
  let fixCount = 0;
  
  tables.forEach(table => {
    // Ensure table has a caption or aria-label for accessibility
    if (!table.querySelector('caption') && !table.getAttribute('aria-label') && !table.getAttribute('aria-labelledby')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      caption.style.cssText = 'font-weight: bold; text-align: left; padding: 8px;';
      table.insertBefore(caption, table.firstChild);
      fixCount++;
    }
    
    // Ensure thead exists for tables with headers
    const headerCells = table.querySelectorAll('th');
    if (headerCells.length > 0 && !table.querySelector('thead')) {
      const rows = table.querySelectorAll('tr');
      if (rows.length > 0) {
        const thead = document.createElement('thead');
        const firstRow = rows[0];
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, table.firstChild);
        firstRow.remove();
        fixCount++;
      }
    }
    
    // Ensure tbody exists
    if (!table.querySelector('tbody')) {
      const rows = table.querySelectorAll('tr');
      const tbody = document.createElement('tbody');
      rows.forEach(row => tbody.appendChild(row));
      table.appendChild(tbody);
      fixCount++;
    }
    
    // Fix missing scope attributes on header cells
    const ths = table.querySelectorAll('th');
    ths.forEach(th => {
      if (!th.hasAttribute('scope')) {
        // Determine if header is column or row header
        const row = th.closest('tr');
        const rowHeaders = row.querySelectorAll('th');
        const thIndex = Array.from(rowHeaders).indexOf(th);
        if (thIndex === 0) {
          th.setAttribute('scope', 'row');
        } else {
          th.setAttribute('scope', 'col');
        }
        fixCount++;
      }
    });
  });
  
  return fixCount;
}

function landmarkStructureCheck(landmarksArray) {
  const errors = [];
  const validRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'banner', 'form', 'region'];
  
  if (!Array.isArray(landmarksArray)) {
    errors.push('Landmarks must be an array');
    return { valid: false, errors };
  }
  
  landmarksArray.forEach((landmark, index) => {
    if (!landmark.role || !validRoles.includes(landmark.role)) {
      errors.push(`Landmark at index ${index} has invalid role: ${landmark.role}`);
    }
    if (!landmark.id) {
      errors.push(`Landmark at index ${index} missing id`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// REACT_017: Add/fix 2 landmark issues
function addMainLandmark(document) {
  if (!document) return false;
  
  let mainElement = document.querySelector('main');
  
  if (!mainElement) {
    // Check for existing main element with different naming
    const existingMains = document.querySelectorAll('[role="main"]');
    if (existingMains.length > 0) {
      mainElement = existingMains[0];
      if (!mainElement.id) {
        mainElement.id = 'main-content';
      }
      return true;
    }
    
    // Create a new main element
    mainElement = document.createElement('main');
    mainElement.id = 'main-content';
    
    // Try to insert after header or at beginning of body
    const header = document.querySelector('header');
    if (header && header.nextSibling) {
      header.parentNode.insertBefore(mainElement, header.nextSibling);
    } else if (document.body) {
      document.body.insertBefore(mainElement, document.body.firstChild);
    }
    
    return true;
  }
  
  // Ensure main element has proper id for skip links
  if (!mainElement.id) {
    mainElement.id = 'main-content';
  }
  
  return false;
}

function addProperLandmarkRegions(container) {
  if (!container) container = document;
  
  const regions = {
    header: { role: 'banner', found: false },
    nav: { role: 'navigation', found: false },
    main: { role: 'main', found: false },
    aside: { role: 'complementary', found: false },
    footer: { role: 'contentinfo', found: false }
  };
  
  Object.keys(regions).forEach(region => {
    let element = container.querySelector(region);
    if (!element) {
      element = container.querySelector(`[role="${regions[region].role}"]`);
    }
    
    if (element) {
      regions[region].found = true;
      if (!element.id) {
        element.id = `${region}-region`;
      }
    }
  });
  
  return regions;
}

function addLandmarkRoles(container) {
  if (!container) container = document;
  
  // Add role="main" to main element
  addMainLandmark(container);
  
  // Ensure navigation elements have proper roles
  const navElements = container.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
    if (!nav.id) {
      nav.id = `navigation-${index + 1}`;
    }
  });
  
  return true;
}

// REACT_041: Add accessible names to 2 SVGs
function addSvgAccessibleNames(container) {
  if (!container) container = document;
  
  const svgs = container.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  let fixCount = 0;
  
  svgs.forEach((svg, index) => {
    // Check if SVG has a title child element
    let titleElement = svg.querySelector('title');
    
    if (!titleElement) {
      titleElement = document.createElement('title');
      titleElement.textContent = `Icon ${index + 1}`;
      svg.insertBefore(titleElement, svg.firstChild);
    }
    
    // Add aria-labelledby referencing the title
    const titleId = `svg-title-${index}-${Date.now()}`;
    titleElement.id = titleId;
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-labelledby', titleId);
    
    fixCount++;
  });
  
  return fixCount;
}

function validateSvgAccessibility(svg) {
  const errors = [];
  
  if (!svg) {
    errors.push('SVG element is required');
    return { valid: false, errors };
  }
  
  // Check for accessible name
  const hasAriaLabel = svg.hasAttribute('aria-label');
  const hasAriaLabelledby = svg.hasAttribute('aria-labelledby');
  const hasTitle = svg.querySelector('title') !== null;
  const hasRole = svg.hasAttribute('role');
  
  if (!hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
    errors.push('SVG must have an accessible name via aria-label, aria-labelledby, or title element');
  }
  
  if (!hasRole) {
    errors.push('SVG should have role="img" for proper accessibility');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
      return {};
  }
  const seen = new Set();
  return landmarksArray.filter(landmark => {
    const key = landmark.name + '_' + (landmark.role || 'default');
    // Merge both approaches for checking uniqueness
    if (seen.has(key)) {
        return false;
    }
    seen.add(key);
    return true;
  });
}

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          // Mark as duplicate by adding suffix
          landmark.id += '_duplicate';
          elementsById[landmark.id + '_duplicate'] = true;
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  return elements;
}

function processUniqueElements(elements) {
  const seen = new Set();
  const uniqueElements = [];
  
  if (Array.isArray(elements)) {
    elements.forEach(element => {
      const key = element.id || element.name || JSON.stringify(element);
      if (!seen.has(key)) {
        seen.add(key);
        uniqueElements.push(element);
      }
    });
  }
  
  return uniqueElements;
}

// Implemented validateLandmark functionality
function validateLandmark(landmark) {
  const errors = [];

  // Check if landmark exists
  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  // Validate name
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  // Validate latitude
  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }

  // Validate longitude
  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  // Additional validation changes from the other branch
  if (Array.isArray(landmark) && landmark.length > 0) {
    if (!landmark[0].name || typeof landmark[0