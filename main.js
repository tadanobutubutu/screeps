// Existing code ...

// Implement the getSvgAccessibleName functionality
function getSvgAccessibleName(svgElement) {
  if (!svgElement || svgElement.nodeName !== 'svg') return '';

  const id = svgElement.getAttribute('id');
  const label = id ? document.getElementById(id) : null;

  if (!label) return '';

  if (label.nodeName === 'title') {
    return label.textContent;
  }

  if (label.nodeName === 'desc') {
    return label.textContent;
  }

  return ''; // If neither 'title' nor 'desc' are found, return an empty string
}

// Export the new getSvgAccessibleName function
export { getSvgAccessibleName };

// Implement the createInPageButton functionality with event handling
function createInPageButton(buttonId, buttonText, buttonClass) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = buttonClass;

  button.addEventListener('click', function() {
    // Placeholder for the button event handler logic
    console.log(`Button with ID ${buttonId} was clicked!`);
  });

  return button;
}

// Export the new createInPageButton function
export { createInPageButton };

// Implement the getLangAttribute function to handle REACT_015
function getLangAttribute(element) {
  if (!element) return '';

  const langAttribute = element.getAttribute('lang');
  if (langAttribute) return langAttribute;

  // If 'lang' attribute is missing, use default language (e.g., "en")
  return 'en';
}

// Export the new getLangAttribute function
export { getLangAttribute };

// Implement the function for addressing new accessibility issues from the insight report
function addressAccessibilityIssues() {
  // Set minimum font size
  document.body.style.fontSize = '16px';
}

// ADD THE FUNCTION TO FIX INSIGHT REPORT ISSUES
function fixAccessibilityIssues() {
  // Add lang attribute to the root HTML element
  const rootElement = document.documentElement || document.body;
  if (rootElement) {
    addLangAttribute(rootElement);
  }

  // Add main landmark to the root element
  addMainLandmark();

  // Add accessible names to 2 SVGs
  const svgs = document.querySelectorAll('svg');
  addSvgAccessibleNames(svgs);

  // Ensure unique landmarks
  ensureUniqueLandmarks();

  // Fix 1 fake link issue
  const links = document.querySelectorAll('a');
  fixFakeLinkIssue(links);
}

// ADD THESE LINES TO ADD ACCESSIBILITY ATTRIBUTES TO ROOT ELEMENT
fixAccessibilityIssues();

// Export the new addressAccessibilityIssues function
export { addressAccessibilityIssues };

// Implement the function for validating the structure of landmarks (Placeholder)
function validateLandmarkStructure(landmark, parent) {
  // Your implementation for validating the structure of landmarks
}

// Export the new validateLandmarkStructure function
export { validateLandmarkStructure };

// Implement the function for adding lang attribute
function addLangAttribute(element) {
  if (!element) return;
  
  if (!element.hasAttribute('lang')) {
    element.setAttribute('lang', 'en');
  }
}

// Implement the function for fixing table structure
function fixTableStructure(table) {
  if (!table || table.nodeName !== 'TABLE') return;
  
  // Ensure table has proper structure
  if (!table.caption && table.rows.length > 0) {
    const caption = document.createElement('caption');
    caption.textContent = 'Data Table';
    table.insertBefore(caption, table.firstChild);
  }
  
  // Ensure proper thead/tbody structure
  const headerRow = table.querySelector('thead tr') || table.rows[0];
  if (headerRow && !table.querySelector('thead')) {
    const thead = document.createElement('thead');
    thead.appendChild(headerRow);
    table.insertBefore(thead, table.firstChild);
  }
  
  if (!table.querySelector('tbody')) {
    const tbody = document.createElement('tbody');
    const rows = Array.from(table.querySelectorAll('tr'));
    rows.forEach(row => {
      if (!row.closest('thead')) {
        tbody.appendChild(row);
      }
    });
    table.appendChild(tbody);
  }
}

// Implement the function for adding main landmark
function addMainLandmark() {
  const mainElements = document.querySelectorAll('main');
  
  if (mainElements.length === 0) {
    // Create a main element if none exists
    const body = document.body;
    if (body && !body.querySelector('main')) {
      const main = document.createElement('main');
      main.setAttribute('id', 'main-content');
      main.setAttribute('role', 'main');
      
      // Move content into main
      while (body.firstChild) {
        main.appendChild(body.firstChild);
      }
      body.appendChild(main);
    }
  }
}

// Implement the function for ensuring unique landmarks
function ensureUniqueLandmarks() {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];
  
  landmarkRoles.forEach(role => {
    const landmarks = document.querySelectorAll(`[role="${role}"], ${role === 'main' ? 'main' : '[role="region"]'}`);
    
    // Mark duplicates with unique IDs
    if (landmarks.length > 1) {
      landmarks.forEach((landmark, index) => {
        if (!landmark.id) {
          landmark.id = `${role}-${index + 1}`;
        }
        // Add aria-label for distinction
        if (!landmark.getAttribute('aria-label') && !landmark.querySelector('h1, h2, h3, h4, h5, h6')) {
          landmark.setAttribute('aria-label', `${role} section ${index + 1}`);
        }
      });
    }
  });
}

// Implement the function for adding SVG accessible names
function addSvgAccessibleNames(svgs) {
  if (!svgs) return;
  
  svgs.forEach((svg, index) => {
    const accessibleName = getSvgAccessibleName(svg);
    
    if (accessibleName && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      // Check if there's a title element
      const title = svg.querySelector('title');
      if (title) {
        if (!title.id) {
          title.id = `svg-title-${index}`;
        }
        svg.setAttribute('aria-labelledby', title.id);
      } else if (accessibleName) {
        // Create a title element if none exists
        const newTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        newTitle.id = `svg-title-${index}`;
        newTitle.textContent = accessibleName;
        svg.insertBefore(newTitle, svg.firstChild);
        svg.setAttribute('aria-labelledby', newTitle.id);
      }
    }
    
    // Ensure role="img" is present
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
}

// Implement the function for fixing fake link issues
function fixFakeLinkIssue(links) {
  if (!links) return;
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    
    // Check if it's a fake link (e.g., href="#" or javascript:void(0))
    if (href === '#' || href === 'javascript:void(0)' || href === 'javascript:;') {
      // Convert to button if it triggers an action
      const onClick = link.getAttribute('onclick');
      if (onClick || link.classList.contains('fake-link') || link.getAttribute('role') === 'link') {
        // Change to button element
        const button = document.createElement('button');
        button.id = link.id;
        button.className = link.className;
        button.textContent = link.textContent;
        button.setAttribute('aria-label', link.getAttribute('aria-label') || link.textContent);
        
        // Copy onclick handler
        if (onClick) {
          button.setAttribute('onclick', onClick);
        }
        
        // Replace link with button
        link.parentNode.replaceChild(button, link);
      }
    }
  });
}

// Implement validateTableAccessibility function
function validateTableAccessibility(table) {
  if (!table || table.nodeName !== 'TABLE') return { valid: false, errors: [] };
  
  const errors = [];
  
  // Check if table has caption
  if (!table.caption) {
    errors.push('Table is missing a caption');
  }
  
  // Check if table has proper headers
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    errors.push('Table is missing header cells (th)');
  }
  
  // Check for scope attributes
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      errors.push('Header cell is missing scope attribute');
    }
  });
  
  // Check for id/headers attributes for complex tables
  const cells = table.querySelectorAll('td');
  cells.forEach(cell => {
    if (!cell.getAttribute('headers') && !cell.closest('table[role="presentation"]')) {
      // Only warn for complex tables
      if (table.querySelectorAll('th').length > 1) {
        errors.push('Complex table cell is missing headers attribute');
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// Implement validateTableStructure function
function validateTableStructure(table) {
  if (!table || table.nodeName !== 'TABLE') return { valid: false, errors: [] };
  
  const errors = [];
  
  // Check for thead
  if (!table.querySelector('thead')) {
    errors.push('Table is missing thead element');
  }
  
  // Check for tbody
  if (!table.querySelector('tbody')) {
    errors.push('Table is missing tbody element');
  }
  
  // Check for proper row structure
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    errors.push('Table has no rows');
  }
  
  // Check that thead contains only tr with th
  const theadRows = table.querySelectorAll('thead tr');
  theadRows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length > 0) {
      errors.push('thead contains td elements instead of only th');
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// Implement validateLandmarkAttributes function
function validateLandmarkAttributes(element) {
  if (!element) return { valid: false, errors: [] };
  
  const errors = [];
  const role = element.getAttribute('role');
  const tagName = element.nodeName.toLowerCase();
  
  // Check for valid landmark roles
  const validLandmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'search', 'form'];
  const validLandmarkTags = ['header', 'nav', 'main', 'aside', 'footer', 'form', 'section'];
  
  const isLandmark = validLandmarkRoles.includes(role) || validLandmarkTags.includes(tagName);
  
  if (isLandmark) {
    // Check for accessible name
    const hasLabel = element.getAttribute('aria-label') || 
                     element.getAttribute('aria-labelledby') ||
                     element.querySelector('h1, h2, h3, h4, h5, h6');
    
    if (!hasLabel) {
      errors.push('Landmark is missing accessible name (aria-label, aria-labelledby, or heading)');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

// Implement setSvgAttributes function
function setSvgAttributes(svg, attributes) {
  if (!svg || svg.nodeName !== 'svg') return;
  
  if (typeof attributes === 'object') {
    Object.keys(attributes).forEach(key => {
      svg.setAttribute(key, attributes[key]);
    });
  }
  
  // Ensure role="img" is set
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
}

// Implement validateLinkAccessibility function
function validateLinkAccessibility(link) {
  if (!link || link.nodeName !== 'A') return { valid: false, errors: [] };
  
  const errors = [];
  const href = link.getAttribute('href');
  
  // Check for valid href
  if (!href || href === '#' || href === 'javascript:void(0)') {
    errors.push('Link has an invalid or fake href');
  }
  
  // Check for accessible text
  const text = link.textContent.trim();
  const ariaLabel = link.getAttribute('aria-label');
  
  if (!text && !ariaLabel) {
    errors.push('Link