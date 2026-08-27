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

// Implement the addLangAttribute function to handle REACT_015
function addLangAttribute(element, lang) {
  if (!element) return;
  
  const langValue = lang || 'en';
  element.setAttribute('lang', langValue);
}

// Implement the fixTableStructure function to ensure proper table accessibility
function fixTableStructure(table) {
  if (!table || table.nodeName !== 'table') return;

  // Ensure table has a thead
  let thead = table.querySelector('thead');
  if (!thead) {
    thead = document.createElement('thead');
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
    }
  }

  // Ensure table has a tbody
  let tbody = table.querySelector('tbody');
  if (!tbody) {
    tbody = document.createElement('tbody');
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      if (row.parentNode !== thead) {
        tbody.appendChild(row);
      }
    });
    table.appendChild(tbody);
  }

  // Ensure proper scope attributes on header cells
  const headers = thead ? thead.querySelectorAll('th') : [];
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

// Implement the addMainLandmark function to add main landmark
function addMainLandmark(element) {
  if (!element) return;
  
  if (!element.hasAttribute('role') && element.nodeName !== 'MAIN') {
    element.setAttribute('role', 'main');
  }
  
  // Also check if element is already a main element
  if (element.nodeName === 'MAIN' && !element.id) {
    element.id = 'main-content';
  }
}

// Implement the ensureUniqueLandmarks function to ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], main');
  
  // Keep only the first main landmark, remove role from others or add unique identifiers
  landmarks.forEach((landmark, index) => {
    if (index > 0) {
      landmark.removeAttribute('role');
    }
  });

  // Ensure unique ids for all landmarks
  const allLandmarks = document.querySelectorAll('[role]');
  const seenIds = new Set();
  
  allLandmarks.forEach(landmark => {
    const id = landmark.id;
    if (id) {
      if (seenIds.has(id)) {
        landmark.removeAttribute('id');
      } else {
        seenIds.add(id);
      }
    }
  });
}

// Implement the addSvgAccessibleNames function to add accessible names to SVGs
function addSvgAccessibleNames(svgs) {
  if (!svgs || !svgs.length) return;

  svgs.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    
    // Add aria-label if no accessible name is found through linked title/desc
    if (!accessibleName) {
      // Check if svg has direct title or desc
      const title = svg.querySelector('title');
      const desc = svg.querySelector('desc');
      
      if (title && title.textContent) {
        svg.setAttribute('aria-label', title.textContent);
      } else if (desc && desc.textContent) {
        svg.setAttribute('aria-label', desc.textContent);
      }
    } else {
      // Set the accessible name as aria-label
      svg.setAttribute('aria-label', accessibleName);
    }
    
    // Add role="img" if not present
    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
}

// Implement the fixFakeLinkIssue function to fix fake links that should be buttons
function fixFakeLinkIssue(links) {
  if (!links || !links.length) return;

  links.forEach(link => {
    // Check if the link has no href or javascript: href (fake link)
    const href = link.getAttribute('href');
    const isFakeLink = !href || href === '#' || href.startsWith('javascript:');
    
    // Check if it looks like a button (has button-like styling or content)
    const isButtonLike = link.getAttribute('role') === 'button' || 
                         link.classList.contains('btn') ||
                         link.classList.contains('button');
    
    if (isFakeLink && isButtonLike) {
      // Convert to button
      const button = document.createElement('button');
      
      // Copy all attributes except href
      Array.from(link.attributes).forEach(attr => {
        if (attr.name !== 'href') {
          button.setAttribute(attr.name, attr.value);
        }
      });
      
      // Copy content
      button.innerHTML = link.innerHTML;
      
      // Copy event listeners
      const clone = link.cloneNode(true);
      button.addEventListener('click', function(e) {
        // Dispatch click event to cloned element for any existing handlers
        clone.dispatchEvent(new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        }));
      });
      
      // Replace link with button
      link.parentNode.replaceChild(button, link);
    }
  });
}

// Implement the function for addressing new accessibility issues from the insight report
function addressAccessibilityIssues() {
  // Set minimum font size
  document.documentElement.style.fontSize = '16px';
}

// ADD THE FUNCTION TO FIX INSIGHT REPORT ISSUES
function fixAccessibilityIssues() {
  // Add lang attribute to the root HTML element
  const rootElement = document.documentElement || document.body;
  if (rootElement) {
    addLangAttribute(rootElement, getLangAttribute(document.body) || 'en');
  }

  // Add main landmark to the root element
  const mainElement = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;
  if (mainElement) {
    addMainLandmark(mainElement);
  }

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  if (svgs.length > 0) {
    addSvgAccessibleNames(Array.from(svgs));
  }

  // Ensure unique landmarks
  ensureUniqueLandmarks();

  // Fix fake link issues
  const links = document.querySelectorAll('a');
  if (links.length > 0) {
    fixFakeLinkIssue(Array.from(links));
  }
}

// ADD THESE LINES TO ADD ACCESSIBILITY ATTRIBUTES TO ROOT ELEMENT
fixAccessibilityIssues();

// Export the new addressAccessibilityIssues function
export { addressAccessibilityIssues };

// Implement the function for validating the structure of landmarks (Placeholder)
function validateLandmarkStructure(landmark, parent) {
  // Your implementation for validating the structure of landmarks
  if (!landmark) return false;
  
  // Check if landmark has valid role attribute
  const validRoles = ['main', 'nav', 'banner', 'contentinfo', 'complementary', 'search', 'form', 'article', 'region'];
  const role = landmark.getAttribute('role');
  
  if (role && !validRoles.includes(role)) {
    return false;
  }
  
  // Check parent relationship if provided
  if (parent && landmark.parentElement !== parent) {
    return false;
  }
  
  return true;
}

// Export the new validateLandmarkStructure function
export { validateLandmarkStructure };

// Implement validateTableAccessibility function
function validateTableAccessibility(table) {
  if (!table || table.nodeName !== 'table') {
    return { valid: false, errors: ['Invalid table element'] };
  }

  const errors = [];

  // Check for caption or summary
  const caption = table.querySelector('caption');
  if (!caption) {
    errors.push('Table should have a caption for accessibility');
  }

  // Check for proper header structure
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    errors.push('Tables should have proper header cells (th)');
  }

  // Check for scope attributes
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      errors.push('Header cells should have scope attribute');
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

// Implement validateTableStructure function
function validateTableStructure(table) {
  if (!table || table.nodeName !== 'table') {
    return { valid: false, errors: ['Invalid table element'] };
  }

  const errors = [];

  // Check for thead
  const thead = table.querySelector('thead');
  if (!thead) {
    errors.push('Table should have a thead element');
  }

  // Check for tbody
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    errors.push('Table should have a tbody element');
  }

  // Check for proper row structure
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    errors.push('Table should have at least one row');
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

// Implement validateLinkAccessibility function
function validateLinkAccessibility(link) {
  if (!link || link.nodeName !== 'a') {
    return { valid: false, errors: ['Invalid link element'] };
  }

  const errors = [];

  // Check for meaningful text
  const text = link.textContent.trim();
  if (!text) {
    errors.push('Link should have meaningful text content');
  }

  // Check for proper href
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    errors.push('Link should have a valid href attribute');
  }

  // Check for unique link text within context
  const linksWithSameText = document.querySelectorAll(`a:text("${text}")`);
  if (linksWithSameText.length > 1) {
    errors.push('Links with the same destination should have the same text');
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

// Implement handleFakeLinks function
function handleFakeLinks(container) {
  const containerElement = container || document;
  const links = container