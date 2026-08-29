// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: fixLandmarkIssues, addMainLandmark, addLandmarkRegions)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks, uniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames, addAccessibleNamesToSVGs)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue, fixFakeLinkIssues)
// - REACT_037: Google sign-in logic (DONE: googleSignIn)
// - REACT_040: Replace my-button with actual button id for accessibility (DONE: fixButtonIdentifiers)
// - REACT_042: Ensure dependencyGraph container has proper ARIA role (DONE: ensureDependencyGraphHasProperAriaRole)

import { class1, function1, Object1 } from './path/to/module';

// Function to add lang attribute to HTML element
function addLangAttribute(document, lang = 'en') {
  const htmlElement = document?.documentElement;
  if (htmlElement && !htmlElement.lang) {
    htmlElement.setAttribute('lang', lang);
  }
  return document;
}

// Function to fix table structure issues
function fixTableStructure(document) {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;

  tables.forEach((table) => {
    // Ensure tables have proper structure with thead and tbody
    const existingThead = table.querySelector('thead');
    const existingTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');
    
    if (rows.length > 0 && !existingThead) {
      const firstRow = rows[0];
      const thead = document.createElement('thead');
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
      fixedCount++;
    }
    
    if (!existingTbody) {
      const remainingRows = rows.length > 0 ? rows.slice(1) : [];
      if (remainingRows.length > 0) {
        const tbody = document.createElement('tbody');
        remainingRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
        fixedCount++;
      }
    }
    
    // Ensure proper header cells (th) are used
    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      cells.forEach(cell => {
        if (!cell.tagName.equals('TH') && cell.parentElement.tagName === 'thead') {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          th.scope = 'col';
          row.insertBefore(th, cell);
          fixedCount++;
        }
      });
    });
    
    // Additional HEAD logic: ensure scope on header cells
    const headerCells = table.querySelectorAll('thead th');
    headerCells.forEach(th => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
        fixedCount++;
      }
    });
  });

  return fixedCount;
}

// Function to add/main landmark
function addMainLandmark(document) {
  let mainElement = document.querySelector('main');
  
  if (!mainElement) {
    // Find the main content area and wrap it or create main element
    const body = document.body;
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    
    // Move first significant content child to main
    const children = Array.from(body.children);
    for (const child of children) {
      if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && 
          child.tagName !== 'LINK' && child.tagName !== 'META') {
        main.appendChild(child);
        break;
      }
    }
    
    body.insertBefore(main, body.firstChild);
    mainElement = main;
  }
  
  // Ensure main has proper role if not using native element
  if (mainElement.tagName !== 'MAIN') {
    mainElement.setAttribute('role', 'main');
  }
  
  return mainElement;
}

// Function to ensure unique landmarks (combined approach)
function ensureUniqueLandmarks(document) {
  // ... existing implementation for by role
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  const seenRoles = {};
  
  landmarks.forEach(element => {
    const role = element.getAttribute('role') || element.tagName.toLowerCase();
    if (seenRoles[role]) {
      element.setAttribute('aria-label', `Unique ${role} ${seenRoles[role]}`);
    }
    seenRoles[role] = (seenRoles[role] || 0) + 1;
  });

  // ... existing unique landmarks implementation for origin/main
  return document;
}

// Function to add accessible names to SVGs
function addSvgAccessibleNames(document) {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = 'Graphic';
      svg.insertBefore(title, svg.firstChild);
    }
  });
  return document;
}

// Function to add accessible names to SVGs (alias)
function addAccessibleNamesToSVGs(document) {
  return addSvgAccessibleNames(document);
}

// Function to fix fake link issue (merged fixes)
function fixFakeLinkIssue(document) {
  let count = 0;

  const clickableElements = document.querySelectorAll('[onclick], a[href="#"]');

  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    const hasHref = element.hasAttribute('href');
    const href = hasHref ? element.getAttribute('href') : '';
    const onclick = element.getAttribute('onclick') || '';
    
    // Check if it's a fake link (clickable but not a real anchor)
    if (!isAnchor && (onclick.includes('window.location') || 
        onclick.includes('document.location') || 
        !hasHref)) {
      
      // Convert to proper anchor or add proper accessibility
      const span = document.createElement('span');
      span.textContent = element.textContent;
      span.setAttribute('role', 'link');
      span.setAttribute('tabindex', '0');
      span.setAttribute('onclick', onclick);
      
      // Copy styling if available
      if (element.className) {
        span.className = element.className;
      }
      
      element.replaceWith(span);
      count++;
    } else if (isAnchor && href === '#') {
      element.setAttribute('role', 'button');
      element.setAttribute('tabindex', '0');
    }
  });

  return count;
}

// Function to fix fake link issues (handles both role="link" elements and anchors with href="#")
function fixFakeLinkIssues(document) {
  // Fix non-anchor elements with role="link"
  const roleLinks = document.querySelectorAll('[role="link"]');
  roleLinks.forEach(link => {
    if (link.tagName !== 'A') {
      link.setAttribute('aria-label', 'This link goes to a section within the page');
    }
  });

  // Fix anchors with href="#" by converting them to accessible buttons
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });

  return document;
}

// Accessibility fix for REACT_017: Add/fix landmark issues and add Landmark Regions
function fixLandmarkIssues(document) {
  // ... updated landmark issue fix implementation
  const mainLandmark = addMainLandmark(document);
  
  // Add landmark regions if missing
  const landmarked = document.querySelectorAll('header, nav, main, aside, footer');
  landmarked.forEach(element => {
    if (!element.hasAttribute('role') && element.tagName !== 'MAIN') {
      const roleMap = {
        'HEADER': 'banner',
        'NAV': 'navigation',
        'MAIN': 'main',
        'ASIDE': 'complementary',
        'FOOTER': 'contentinfo'
      };
      const role = roleMap[element.tagName] || 'region';
      element.setAttribute('role', role);
    }
  });
  
  return document;
}

function addLandmarkRegions(document) {
  // ... existing implementation
  const regions = document.querySelectorAll('[role="region"]');
  regions.forEach(region => {
    if (!region.hasAttribute('aria-label')) {
      const label = region.getAttribute('aria-labelledby') || 'Region';
      region.setAttribute('aria-label', label);
    }
  });
  return document;
}

// REACT_025: Ensure unique landmarks (by role approach)
function uniqueLandmarks(document) {
  // ... unique landmarks implementation by role
  const roleCounts = {};
  const elements = document.querySelectorAll('header, nav, main, aside, footer, [role]');
  
  elements.forEach(element => {
    const role = element.getAttribute('role') || element.tagName.toLowerCase();
    roleCounts[role] = (roleCounts[role] || 0) + 1;
    if (roleCounts[role] > 1) {
      element.setAttribute('aria-label', `${role} ${roleCounts[role]}`);
    }
  });
  
  return document;
}

// Address accessibility issues from insight report for image alt texts
function fixImageAltTexts(document) {
  // ... existing implementation
  const images = document.querySelectorAll('img:not([alt])');
  images.forEach(img => {
    const altText = img.getAttribute('title') || 'Image description';
    img.setAttribute('alt', altText);
  });
  return document;
}

// REACT_037: Google sign-in logic
function googleSignIn(document) {
  // Check if Google Identity Services is available
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: 'YOUR_CLIENT_ID',
      callback: handleCredentialResponse
    });
    const buttonContainer = document.querySelector('#g_id_onload') || document.querySelector('[data-google-signin]');
    if (buttonContainer) {
      google.accounts.id.renderButton(
        buttonContainer,
        { theme: 'outline', size: 'large' }
      );
    }
  }
}

// Function to count dependencies
function countDependencies() {
  // Find the dependency graph container
  const graphContainer = document.querySelector('.dependency-graph, #dependency-graph, [data-graph-type="dependency"], [role="region"][aria-label*="dependency" i]');
  
  if (!graphContainer) {
    return 0;
  }
  
  // Count nodes in the dependency graph
  const nodes = graphContainer.querySelectorAll('.node, [class*="node"], circle, rect, g[class*="dependency"], [data-dependency]');
  
  // Use a Set to count unique dependencies
  const dependencies = new Set();
  
  nodes.forEach(node => {
    // Try to get a unique identifier for each dependency
    const id = node.id || 
               node.getAttribute('data-name') || 
               node.getAttribute('data-id') ||
               node.getAttribute('data-dependency-id');
    if (id) {
      dependencies.add(id);
    } else {
      // Use the node's position or text content as a fallback identifier
      const text = node.textContent?.trim();
      if (text) {
        dependencies.add(text);
      } else {
        // Use the node reference itself as last resort
        dependencies.add(node);
      }
    }
  });
  
  return dependencies.size;
}

// Function to ensure the element has an id
function ensureElementHasId(document, selector, idPrefix = 'element') {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element, index) => {
    if (!element.id) {
      element.id = `${idPrefix}-${index + 1}`;
    }
  });
  return document;
}

// Function to add aria-label to elements
function addAriaLabel(selector, label) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    if (!element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', label);
    }
  });
  return document;
}

// Function to render dependency graphs
function renderDependencyGraphs(document) {
  const graphContainer = document.querySelector('.dependency-graph, #dependency-graph') || 
                          document.querySelector('[data-graph-type="dependency"]');
  if (graphContainer) {
    // Create SVG element for the dependency graph
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'dependency-graph');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '400');
    svg.setAttribute('viewBox', '0 0 800 400');

    // Add accessible title and description
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = 'Dependency Graph';
    svg.appendChild(title);

    const desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    desc.textContent = 'Visual representation of project dependencies';
    svg.appendChild(desc);

    // Render the graph content
    const graphContent = document.querySelector('[data-graph-content]');
    if (graphContent) {
      // Parse and render dependency data
      // Implementation would parse the data and create nodes/edges
    }

    graphContainer.appendChild(svg);
  }
  return document;
}

// REACT_040: Replace my-button with actual button id for accessibility
function fixButtonIdentifiers(document) {
  const buttons = document.querySelectorAll('my-button, [is="my-button"]');
  buttons.forEach(button => {
    const newId = 'btn-' + (button.id || Math.random().toString(36).substr(2, 9));
    button.id = newId;
    button.setAttribute('role', 'button');
    button.removeAttribute('is');
  });
  return document;
}

// REACT_042: Ensure dependencyGraph container has a proper ARIA role
function ensureDependencyGraphHasProperAriaRole(document) {
  const dependencyGraph = document.querySelector('.dependency-graph') || 
                          document.querySelector('#dependency-graph') || 
                          document.querySelector('[data-graph-type="dependency"]') ||
                          document.querySelector('[role="region"][aria-label*="dependency" i]');
  
  if (dependencyGraph) {
    // Check if element already has a role
    const existingRole = dependencyGraph.getAttribute('role');
    if (!existingRole) {
      // Add appropriate role based on context
      dependencyGraph.setAttribute('role', 'region');
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
    }
  }
  
  return document;
}

export {
  addLangAttribute,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  fixButtonIdentifiers,
  ensureDependencyGraphHasProperAriaRole,
  fixImageAltTexts,
  countDependencies,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs
};
//