// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

// REACT_015: Add lang attribute to HTML element
function addLangAttributeToHtml(document) {
  if (!document || !document.documentElement) {
    return document;
  }
  
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
  
  return document;
}

// REACT_017: Add landmark roles and fix landmark issues
function addProperLandmarkRegions(document) {
  if (!document || !document.body) {
    return document;
  }

  const landmarkTypes = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  
  landmarkTypes.forEach((landmarkType) => {
    const elements = document.querySelectorAll(landmarkType);
    elements.forEach((element) => {
      // Add appropriate role if not present
      if (!element.hasAttribute('role')) {
        element.setAttribute('role', landmarkType);
      }
      // Ensure unique IDs for landmarks (REACT_025)
      if (!element.id) {
        let idSuffix = 1;
        const existingIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
        let id = `${landmarkType}-${idSuffix}`;
        while (existingIds.includes(id)) {
          idSuffix++;
          id = `${landmarkType}-${idSuffix}`;
        }
        element.id = id;
      }
    });
  });

  return document;
}

// REACT_027: Add scope attribute to th elements
function addScopeToThElements(document) {
  if (!document || !document.body) {
    return document;
  }

  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('th, td');
      cells.forEach((cell, cellIndex) => {
        if (cell.tagName === 'TH') {
          if (rowIndex === 0 && !cell.hasAttribute('scope')) {
            cell.setAttribute('scope', 'col');
          } else if (cellIndex === 0 && !cell.hasAttribute('scope')) {
            cell.setAttribute('scope', 'row');
          }
        }
      });
    });
  });

  return document;
}

// REACT_036: Fix fake links (links that should be buttons)
function fixFakeLinks(document) {
  if (!document || !document.body) {
    return document;
  }

  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    // Check if it's a fake link (no href, or href="#" or href="javascript:void(0)")
    if (!href || href === '#' || href === 'javascript:void(0)' || href === 'javascript:;') {
      // Check if it behaves like a button (no other navigation)
      const hasOnclick = link.hasAttribute('onclick');
      const isInsideNav = link.closest('nav');
      const hasButtonRole = link.getAttribute('role') === 'button';
      
      if ((hasOnclick && !isInsideNav) || hasButtonRole) {
        // Convert to button if it acts like one
        if (!hasButtonRole) {
          link.setAttribute('role', 'button');
        }
        if (!link.hasAttribute('tabindex')) {
          link.setAttribute('tabindex', '0');
        }
      }
    }
  });

  return document;
}

// REACT_041: Add accessible names to SVGs
function addAccessibleNamesToSvgs(document) {
  if (!document || !document.body) {
    return document;
  }

  const svgs = document.querySelectorAll('svg');
  let svgCounter = 1;
  
  svgs.forEach((svg) => {
    // Check if SVG already has an accessible name via aria-label, aria-labelledby, or title
    const hasAriaLabel = svg.hasAttribute('aria-label');
    const hasAriaLabelledby = svg.hasAttribute('aria-labelledby');
    const hasTitle = svg.querySelector('title');
    
    if (!hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
      // Create a title element and add aria-labelledby reference
      const title = document.createElement('title');
      title.id = `svg-title-${svgCounter}`;
      title.textContent = `SVG icon ${svgCounter}`;
      
      // Insert title as first child
      if (svg.firstChild) {
        svg.insertBefore(title, svg.firstChild);
      } else {
        svg.appendChild(title);
      }
      
      svg.setAttribute('aria-labelledby', title.id);
      svg.setAttribute('role', 'img');
      svgCounter++;
    }
  });

  return document;
}

// ... existing code (preserved) ...

// Function to wrap the primary content in a main element
const wrapPrimaryContentInMain = (document) => {
  if (!document || !document.body) {
    return document;
  }

  // Check if main element already exists with main-content id
  const existingMain = document.querySelector('#main-content');
  if (existingMain) {
    return document;
  }

  // Check if any main element exists
  const anyMain = document.querySelector('main');
  if (anyMain) {
    // Add id to existing main element if it doesn't have one
    if (!anyMain.id) {
      anyMain.id = 'main-content';
    }
    return document;
  }

  // Create main element and wrap appropriate content
  const main = document.createElement('main');
  main.id = 'main-content';
  main.setAttribute('role', 'main');

  const body = document.body;

  // Get all direct children of body
  const bodyChildren = Array.from(body.childNodes).filter(node => node.nodeType === 1);

  if (bodyChildren.length > 0) {
    // Move children to main element
    bodyChildren.forEach(child => {
      main.appendChild(child);
    });

    // Append main to body
    body.appendChild(main);
  }

  return document;
};

// Export all functions for use in tests and other parts of the application
export {
  addProperLandmarkRegions,
  wrapPrimaryContentInMain,
  addLangAttributeToHtml,
  addScopeToThElements,
  fixFakeLinks,
  addAccessibleNamesToSvgs,
  // ... existing exports (accessibility fixes, newFunction, etc.) ...
};