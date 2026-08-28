function improveAccessibility() {
  // Add ARIA labels to buttons without them
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.getAttribute('aria-label')) {
      button.setAttribute('aria-label', button.textContent || 'Button');
    }
  });

  // Ensure all clickable elements are focusable
  const focusable = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
  focusable.forEach(el => {
    if (el.tabIndex < 0) el.tabIndex = 0;
  });

  // Ensure the dependencyGraph container has a proper ARIA role
  const dependencyGraph = document.getElementById('dependencyGraph') ||
                          document.querySelector('[data-testid="dependency-graph"]') ||
                          document.querySelector('.dependency-graph');
  if (dependencyGraph) {
    if (!dependencyGraph.getAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }
    if (!dependencyGraph.getAttribute('aria-label') && !dependencyGraph.getAttribute('aria-labelledby')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
    }
  }

  // Add proper landmark regions to ensure consistency
  addProperLandmarkRegions();

  // Check table structure for accessibility
  checkTableStructure();
}

function checkLinkAccessibility() {
  const links = document.querySelectorAll('a');
  const results = [];

  links.forEach(link => {
    const href = link.getAttribute('href');
    const text = link.textContent.trim();
    const ariaLabel = link.getAttribute('aria-label');
    const title = link.getAttribute('title');
    const accessibleName = ariaLabel || text;

    if (!href) {
      results.push({
        element: link,
        issue: 'Link is missing an href attribute'
      });
    }

    if (!accessibleName) {
      results.push({
        element: link,
        issue: 'Link is missing an accessible name (text content or aria-label)'
      });
    }

    if (href && (href.startsWith('javascript:') || href === '#' || href.toLowerCase() === 'void(0)')) {
      results.push({
        element: link,
        issue: 'Link uses a non-navigable href value'
      });
    }

    if (link.querySelector('img')) {
      const img = link.querySelector('img');
      if (!img.getAttribute('alt') && !ariaLabel) {
        results.push({
          element: link,
          issue: 'Link contains an image without alt text and no aria-label on the link'
        });
      }
    }
  });

  return results;
}

function checkButtonAccessibility() {
  const buttons = document.querySelectorAll('button');
  const results = [];

  buttons.forEach(button => {
    const text = button.textContent.trim();
    const ariaLabel = button.getAttribute('aria-label');
    const title = button.getAttribute('title');
    const accessibleName = ariaLabel || title || text;

    if (!accessibleName) {
      results.push({
        element: button,
        issue: 'Button is missing an accessible name (text content, aria-label, or title)'
      });
    }

    // Check if button type is specified
    const type = button.getAttribute('type');
    if (!type) {
      results.push({
        element: button,
        issue: 'Button is missing a type attribute'
      });
    }

    // Check for empty text content and no aria-label
    if (!text && !ariaLabel && !title) {
      results.push({
        element: button,
        issue: 'Button has no text content and no accessible name'
      });
    }
  });

  return results;
}

function addressInsightReportIssues(insightReport) {
  const issues = insightReport.issues || [];
  issues.forEach(issue => {
    const element = document.querySelector(issue.selector);
    if (element) {
      // Add lang attribute to HTML element
      if (issue.code === 'REACT_015') {
        document.documentElement.lang = getLangAttribute() || 'en';
      }
      // Add landmark roles and fix landmark issues
      if (issue.code === 'REACT_017') {
        if (issue.ariaRole) {
          element.setAttribute('role', issue.ariaRole);
        }
        validateLandmark(element);
      }
      // Add accessible names to 2 SVGs
      if (issue.code === 'REACT_041') {
        const svgAccessibleName = getSvgAccessibleName(element);
        if (svgAccessibleName) {
          element.setAttribute('aria-label', svgAccessibleName);
        }
      }
      // Ensure unique landmarks (2 issues)
      if (issue.code === 'REACT_025') {
        ensureUniqueLandmarks(element);
      }
      // Fix 1 fake link issue
      if (issue.code === 'REACT_036') {
        // Check if this is a fake link (link with javascript: or # href)
        const href = element.getAttribute('href');
        if (href && (href.startsWith('javascript:') || href === '#' || href.toLowerCase() === 'void(0)')) {
          // Convert to button if it's a fake link
          element.setAttribute('role', 'button');
          element.setAttribute('tabindex', '0');
        }
        // Also check for in-page navigation buttons
        createInPageButtons();
      }
      // Add scope="col" or scope="row" to <th> elements (already implemented)
      if (issue.code === 'REACT_027') {
        validateTableAccessibility(element);
        validateTableStructure();
      }
    }
  });
  
  // Also run validateLandmarkStructure() to fix landmark issues
  validateLandmarkStructure();
}

// Get lang attribute value for HTML element
function getLangAttribute(element) {
  // If element is passed, get its lang attribute
  if (element) {
    return element.getAttribute('lang');
  }
  // Otherwise return the HTML element's lang attribute
  return document.documentElement.lang || document.documentElement.getAttribute('lang');
}

// Set lang attribute on HTML element (used by REACT_015)
function setLangAttribute(lang) {
  const langValue = lang || 'en';
  document.documentElement.lang = langValue;
  return langValue;
}

// Validate table accessibility for REACT_027
function validateTableAccessibility(tableElement) {
  const results = [];
  const table = tableElement || document.querySelector('table');
  
  if (!table) return results;
  
  // Check if table has proper structure
  const hasCaption = table.querySelector('caption');
  const hasThead = table.querySelector('thead');
  const hasTbody = table.querySelector('tbody') || table.querySelector('tfoot');
  
  if (!hasCaption) {
    results.push({
      element: table,
      issue: 'Table is missing a caption'
    });
  }
  
  if (!hasThead) {
    results.push({
      element: table,
      issue: 'Table is missing a thead element'
    });
  }
  
  // Check for proper scope attributes on header cells
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    const scope = th.getAttribute('scope');
    const rowSpan = th.getAttribute('rowspan');
    const colSpan = th.getAttribute('colspan');
    
    // Determine if this is a column header or row header
    const parent = th.parentElement;
    const isHeaderRow = parent && parent.tagName === 'TR' && parent.parentElement && 
                        parent.parentElement.tagName === 'THEAD';
    
    if (!scope) {
      if (isHeaderRow) {
        th.setAttribute('scope', 'col');
      } else {
        th.setAttribute('scope', 'row');
      }
    }
  });
  
  return results;
}

// Validate table structure for REACT_027
function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has role="table"
    if (!table.getAttribute('role') || table.getAttribute('role') !== 'table') {
      table.setAttribute('role', 'table');
    }
    
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      // Ensure row has role="row"
      if (!row.getAttribute('role') || row.getAttribute('role') !== 'row') {
        row.setAttribute('role', 'row');
      }
    });
    
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      // Ensure header has role="columnheader" or "rowheader"
      const parent = header.parentElement;
      const isHeaderRow = parent && parent.tagName === 'TR' && parent.parentElement && 
                          parent.parentElement.tagName === 'THEAD';
      
      if (!header.getAttribute('role')) {
        if (isHeaderRow) {
          header.setAttribute('role', 'columnheader');
        } else {
          header.setAttribute('role', 'rowheader');
        }
      }
      
      // Ensure header has scope attribute
      if (!header.getAttribute('scope')) {
        if (isHeaderRow) {
          header.setAttribute('scope', 'col');
        } else {
          header.setAttribute('scope', 'row');
        }
      }
    });
    
    const dataCells = table.querySelectorAll('td');
    dataCells.forEach(cell => {
      // Ensure data cell has role="cell"
      if (!cell.getAttribute('role') || cell.getAttribute('role') !== 'cell') {
        cell.setAttribute('role', 'cell');
      }
    });
  });
}

// Validate landmark for REACT_017
function validateLandmark(element) {
  const results = [];
  const landmarkRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  
  if (!element) return results;
  
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  // Map of semantic HTML tags to their landmark roles
  const semanticToLandmark = {
    'main': 'main',
    'nav': 'navigation',
    'search': 'search',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'form': 'form',
    'section': 'region',
    'header': 'banner',
    'address': 'contentinfo'
  };
  
  // Check if element has a valid landmark role
  if (role) {
    if (!landmarkRoles.includes(role) && role !== 'banner') {
      results.push({
        element: element,
        issue: `Invalid landmark role: ${role}`
      });
    }
    
    // Check if landmark has an accessible name (except for main)
    if (role !== 'main') {
      const hasAccessibleName = 
        element.getAttribute('aria-label') ||
        element.getAttribute('aria-labelledby') ||
        element.textContent.trim();
      
      if (!hasAccessibleName) {
        results.push({
          element: element,
          issue: `Landmark role "${role}" is missing an accessible name`
        });
      }
    }
  } else if (semanticToLandmark[tagName]) {
    // If no role but has semantic tag, add the appropriate role
    element.setAttribute('role', semanticToLandmark[tagName]);
  }
  
  return results;
}

// Validate landmark structure for REACT_017
function validateLandmarkStructure() {
  const results = [];
  const landmarkRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  
  // Map of semantic HTML tags to their landmark roles
  const semanticToLandmark = {
    'main': 'main',
    'nav': 'navigation',
    'search': 'search',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'form': 'form',
    'section': 'region'
  };
  
  // Ensure proper landmark roles are present on semantic elements
  Object.keys(semanticToLandmark).forEach(semanticTag => {
    const role = semanticToLandmark[semanticTag];
    const elements = document.querySelectorAll(semanticTag);
    
    elements.forEach(el => {
      if (!el.getAttribute('role')) {
        el.setAttribute('role', role);
      }
    });
  });
  
  // Add role="region" to sections that have an accessible name (aria-label or aria-labelledby)
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    if (!section.getAttribute('role')) {
      const hasAccessibleName =
        section.getAttribute('aria-label') ||
        section.getAttribute('aria-labelledby');
      if (hasAccessibleName) {
        section.setAttribute('role', 'region');
      }
    }
  });
  
  return results;
}

// Get SVG accessible name for REACT_041
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;
  
  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check for aria-labelledby
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const referencedElement = document.getElementById(ariaLabelledby);
    if (referencedElement) {
      return referencedElement.textContent.trim();
    }
  }
  
  // Check for <title> element within SVG
  const titleElement = svgElement.querySelector('title');
  if (titleElement) {
    return titleElement.textContent.trim();
  }
  
  // Check for alt attribute (deprecated but still used)
  const altText = svgElement.getAttribute('alt');
  if (altText) return altText;
  
  // Check for data-name attribute
  const dataName = svgElement.getAttribute('data-name');
  if (dataName) return dataName;
  
  // Check parent element for accessible name
  const parent = svgElement.parentElement;
  if (parent) {
    const parentAriaLabel = parent.getAttribute('aria-label');
    if (parentAriaLabel) return parentAriaLabel;
  }
  
  // Return default fallback
  return 'Graphic';
}

// Get person name for accessibility (used by REACT_015, REACT_036)
function personName(element) {
  if (!element) return null;
  
  // Check for aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check for aria-labelledby
  const ariaLabelledby = element.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const referencedElement = document.getElementById(ariaLabelledby);
    if (referencedElement) {
      return referencedElement.textContent.trim();
    }
  }
  
  // Check for text content
  const textContent = element.textContent.trim();
  if (textContent) return textContent;
  
  // Check for title attribute
  const title = element.getAttribute('title');
  if (title) return title;
  
  // Check for alt attribute
  const alt = element.getAttribute('alt');
  if (alt) return alt;
  
  return null;
}

// Validate link accessibility for REACT_036 (fake link issues)
function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  const results = [];
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    const text = link.textContent.trim();
    const ariaLabel = link.getAttribute('aria-label');
    
    // Check for fake links (javascript:, #, void(0))
    if (href) {
      if (href.startsWith('javascript:') || href === '#' || href.toLowerCase() === 'void(0)') {
        // This is a fake link that should be a button
        const accessibleName = ariaLabel || text;
        
        if (!accessibleName) {
          results.push({
            element: link,
            issue: 'Fake link is missing an accessible name'
          });
        }
        
        results.push({
          element: link,
          issue: 'Link uses a non-navigable href value and should be a button',
          recommendation: 'Convert this element to a <button> element'
        });
      }
    } else {
      results.push({
        element: link,
        issue: 'Link is missing an href attribute'
      });
    }
    
    // Check for accessible name
    const accessibleName = ariaLabel || text;
    if (!accessibleName) {
      results.push({
        element: link,
        issue: 'Link is missing an accessible name'
      });
    }
  });
  
  return results;
}

function ensureUniqueLandmarks(element) {
  const landmarkRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    const uniqueElements = [];
    elements.forEach(el => {
      const isUnique = !uniqueElements.some(uEl => uEl === el);
      if (isUnique) {
        uniqueElements.push(el);
      } else {
        // Remove the role if it's not unique
        el.removeAttribute('role');
      }
    });
  });
}

function addProperLandmarkRegions(insightReport) {
  const issues = insightReport ? insightReport.issues || [] : [];
  let uniqueLandmarks = {};

  issues.forEach(issue => {
    if (issue.code === 'REACT_025') {
      const element = document.querySelector(issue.selector);

      // If the landmark role exists, add it to the unique landmarks object
      if (element && issue.ariaRole) {
        if (!uniqueLandmarks[issue.ariaRole]) {
          uniqueLandmarks[issue.ariaRole] = true;
        } else {
          // Remove the role if it's not unique
          element.removeAttribute('role');
        }
      }
    }
  });

  // Define the standard landmark roles that should be present
  const landmarkRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  // Map of semantic HTML elements to their corresponding ARIA landmark roles
  const semanticToLandmark = {
    'main': 'main',
    'nav': 'navigation',
    'search': 'search',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'form': 'form',
    'section': 'region'
  };

  // Ensure proper landmark roles are present on semantic elements
  landmarkRoles.forEach(role => {
    const semanticTag = Object.keys(semanticToLandmark).find(
      key => semanticToLandmark[key] === role
    );

    if (semanticTag) {
      const elements = document.querySelectorAll(semanticTag);
      elements.forEach(el => {
        if (!el.getAttribute('role')) {
          el.setAttribute('role', role);
        }
      });
    }
  });

  // Add role="region" to sections that have an accessible name (aria-label or aria-labelledby)
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    if (!section.getAttribute('role')) {
      const hasAccessibleName =
        section.getAttribute('aria-label') ||
        section.getAttribute('aria-labelledby');
      if (hasAccessibleName) {
        section.setAttribute('role', 'region');
      }
    }
  });
}

function renderDependencyGraph() {
  // Find the dependencyGraph container element
  const dependencyGraph = document.getElementById('dependencyGraph') ||
                          document.querySelector('[data-testid="dependency-graph"]') ||
                          document.querySelector('.dependency-graph');

  if (dependencyGraph) {
    // Ensure it has a proper ARIA role
    if (!dependencyGraph.getAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }

    // Add accessible name if not present
    if (!dependencyGraph.getAttribute('aria-label') &&
        !dependencyGraph.getAttribute('aria-labelledby')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
    }
  }
}

function checkTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.getAttribute('role') || table.getAttribute('role') !== 'table') {
      table.setAttribute('role', 'table');
    }
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      if (!row.getAttribute('role') || row.getAttribute('role') !== 'row') {
        row.setAttribute('role', 'row');
      }
    });
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      if (!header.getAttribute('role') || header.getAttribute('role') !== 'columnheader') {
        header.setAttribute('role', 'columnheader');
      }
    });
    const dataCells = table.querySelectorAll('td');
    dataCells.forEach(cell => {
      if (!cell.getAttribute('role') || cell.getAttribute('role') !== 'cell') {
        cell.setAttribute('role', 'cell');
      }
    });
  });
}

// TODO: Implement this function for checking landmark elements
function checkLandmarkElements() {
  const results = [];
  const landmarkRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  
  // Mapping of semantic HTML tags to their landmark roles
  const semanticToLandmark = {
    'main': 'main',
    'nav': 'navigation',
    'search': 'search',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'form': 'form',
    'section': 'region'
  };

  // Check each landmark role
  landmarkRoles.forEach(role => {
    const semanticTag = Object.keys(semanticToLandmark).find(
      key => semanticToLandmark[key] === role
    );
    
    if (semanticTag) {
      const elements = document.querySelectorAll(semanticTag);
      elements.forEach(el => {
        const hasAccessibleName = 
          el.getAttribute('aria-label') ||
          el.getAttribute('aria-labelledby') ||
          (el.textContent.trim());
        
        if (!hasAccessibleName && role !== 'main') {
          results.push({
            element: el,
            role: role,
            issue: `Landmark role "${role}" is missing an accessible name`
          });
        }
      });
    }
  });

  return results;
}

function setSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    // Set role="img" if not present to identify the SVG as an image
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }

    // Try to find a <title> element within the SVG to use as accessible name
    const titleElement = svg.querySelector('title');
    if (titleElement) {
      // If <title> exists, use its text content for the aria-label
      const titleText = titleElement.textContent.trim();
      if (titleText && !svg.getAttribute('aria-label')) {
        svg.setAttribute('aria-label', titleText);
      }
    } else {
      // If no <title> exists, derive accessible name from alt attribute if available
      const altText = svg.getAttribute('alt');
      if (altText && !svg.getAttribute('aria-label')) {
        svg.setAttribute('aria-label', altText);
      } else if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        // Default fallback if no other source of accessible name is available
        svg.setAttribute('aria-label', 'Graphic');
      }
    }
  });
}

// TODO: Implement this function for adding SVG accessibility props
function addSvgAccessibilityProps() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    // Ensure SVG has role="img" for screen readers
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }

    // Use <title> content if available
    const titleElement = svg.querySelector('title');
    if (titleElement) {
      const titleText = titleElement.textContent.trim();
      if (titleText && !svg.getAttribute('aria-label')) {
        svg.setAttribute('aria-label', titleText);
      }
    } else {
      // Fallback to alt attribute
      const altText = svg.getAttribute('alt');
      if (altText && !svg.getAttribute('aria-label')) {
        svg.setAttribute('aria-label', altText);
      } else if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        // Final fallback
        svg.setAttribute('aria-label', 'Graphic');
      }
    }
  });
}

function renderIndexView() {
  // TODO: Implement renderIndexView functionality
}

function calculateSum(a, b) {
  return a + b;
}

// Create in-page buttons for navigation
function createInPageButtons() {
  // Create a container for the buttons
  const container = document.createElement('div');
  container.setAttribute('aria-label', 'In-page navigation');

  // Find all elements with an id attribute to use as anchors
  const anchorElements = document.querySelectorAll('[id]');

  anchorElements.forEach(element => {
    const id = element.id;
    const button = document.createElement('button');
    button.textContent = id;
    button.addEventListener('click', () => {
      element.scrollIntoView({ behavior: 'smooth' });
    });
    container.appendChild(button);
  });

  // Append the container to the body
  document.body.appendChild(container);
}

module.exports = {
  improveAccessibility,
  addressInsightReportIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  ensureUniqueLandmarks,
  addProperLandmarkRegions,
  checkTableStructure,
  checkLandmarkElements,
  setSvgAccessibleNames,
  addSvgAccessibilityProps,
  checkLinkAccessibility,
  checkButtonAccessibility,
  createInPageButtons,
  getLangAttribute,
  setLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  personName,
  validateLinkAccessibility
};