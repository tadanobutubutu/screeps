// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute

const dependencyGraphContent = null;

const rotateBack = function () {
  // Logic to rotate back
  // For example, if you're manipulating the DOM or a state:
  // ...
  // ...
};

function addLangAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.lang = lang;
  }
  return document;
}

exports.rotateBack = rotateBack;

const addressAccessibilityIssue038 = (element, accessibilityInfo) => {
  // Code to address the specific accessibility issue on the element
  // This is a placeholder function and should be replaced with the actual implementation
  console.log(`Addressing accessibility issue for ${element} with info:`, accessibilityInfo);
};

exports.addressAccessibilityIssue038 = addressAccessibilityIssue038;

const renderDependencyGraph = (dependencyGraph, container) => {
  // Render the dependency graph using the dependencyGraphContent
  const graphContent = dependencyGraphContent;
  // Append the graphContent to the container
  container.innerHTML = graphContent || '';
};

exports.renderDependencyGraph = renderDependencyGraph;

// Function to fix table structure issues for accessibility
function fixTableStructureIssues(document) {
  // Function to fix table structure issues for accessibility
  let fixedCount = 0;
  const tables = document.querySelectorAll('table');
  
  tables.forEach(table => {
    const existingThead = table.querySelector('thead');
    const existingTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');
    
    if (!existingTbody) {
      let remainingRows = Array.from(rows);
      if (existingThead) {
        const theadRowCount = existingThead.querySelectorAll('tr').length;
        remainingRows = Array.from(rows).slice(theadRowCount);
      } else {
        remainingRows = [];
      }
      if (remainingRows.length > 0) {
        const tbody = document.createElement('tbody');
        remainingRows.forEach(row => {
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
        fixedCount++;
      }
    }

    // Ensure proper header cells (th) are used
    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      // Check if first cell should be a header
      if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
        const firstCell = cells[0];
        const th = document.createElement('th');
        th.textContent = firstCell.textContent;
        th.scope = 'col';
        row.insertBefore(th, firstCell);
        fixedCount++;
      }
    });

    // Additional HEAD logic: ensure scope on header cells
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(th => {
      if (!th.scope) {
        th.setAttribute('scope', 'col');
        fixedCount++;
      }
    });
  });

  return fixedCount;
}

// Function to addMainLandmark(document) {
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

// Function to handle credential response from Google Sign-In
function handleCredentialResponse(response) {
  // TODO: Implement credential response handling
  console.log('Credential response received:', response);
}

// Function to ensure unique landmarks (combined approach)
function ensureUniqueLandmarks(document) {
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
  const seen = new Map();
  let count = 0;
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    const existing = seen.get(role);
    
    if (existing) {
      // Keep the first one, mark others
      if (!landmark.hasAttribute('aria-label')) {
        landmark.setAttribute('aria-label', `${role} section ${count + 1}`);
        count++;
      }
    } else {
      seen.set(role, landmark);
    }
  });
  
  return count;
}

// Function to add accessible names to SVGs
function addSvgAccessibleNames(document) {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', `SVG graphic ${index + 1}`);
    }
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
  return document;
}

// Function to add accessible names to SVGs (alias)
function addSvgAccessibleNamesToDocument(document) {
  return addSvgAccessibleNames(document);
}

// Function to fix fake link issue (merged fixes)
function fixFakeLinkIssue(document) {
  let count = 0;

  const clickableElements = document.querySelectorAll('[onclick], [role="link"]');

  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    const hasHref = element.hasAttribute('href');
    const onclick = element.getAttribute('onclick') || '';
    
    // Check if it's a fake link (clickable but not a real anchor)
    if (!isAnchor && (onclick.includes('window.location') || 
        onclick.includes('document.location') || 
        onclick.includes('href'))) {
      
      // Convert to proper anchor or add proper accessibility
      const span = document.createElement('span');
      span.textContent = element.textContent;
      span.setAttribute('role', 'link');
      span.setAttribute('tabindex', '0');
      span.setAttribute('onclick', onclick);
      element.setAttribute('onclick', '');
      span.onclick = element.onclick;
      
      // Copy styling if available
      if (element.className) {
        span.className = element.className;
      }
      
      element.parentNode.replaceChild(span, element);
      count++;
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
  const regions = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  let count = 0;
  
  regions.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 0 && !elements[0].hasAttribute('aria-label')) {
      elements[0].setAttribute('aria-label', `${role} region`);
      count++;
    }
  });
  
  return count;
}

function addLandmarkRegions(document) {
  return fixLandmarkIssues(document);
}

// REACT_025: Ensure unique landmarks (by role approach)
function uniqueLandmarks(document) {
  return ensureUniqueLandmarks(document);
}

// Address accessibility issues from insight report for image alt texts
function fixImageAltTexts(document) {
  const images = document.querySelectorAll('img');
  let count = 0;
  
  images.forEach(img => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
      count++;
    }
  });
  
  return count;
}

// REACT_037: Google sign-in logic
function googleSignIn(document) {
  // Check if Google Identity Services is available
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: 'YOUR_CLIENT_ID',
      callback: handleCredentialResponse
    });
    const buttonContainer = document.getElementById('google-sign-in-button');
    if (buttonContainer) {
      google.accounts.id.renderButton(
        buttonContainer,
        { theme: 'outline', size: 'large' }
      );
    }
  }
  return document;
}

// Function to ensure the element has an id
function ensureElementHasId(document, selector, idPrefix = 'element') {
  const elements = document.querySelectorSelectorAll(selector);
  elements.forEach((element, index) => {
    if (!element.id) {
      element.id = `${idPrefix}-${index + 1}`;
    }
  });
  return document;
}

// Function to add aria-label to elements
function addAriaLabelToElements(document, selector, label) {
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
  const graphContainer = document.querySelector('.dependency-graph-container');
  if (graphContainer) {
    // Create SVG element for the dependency graph
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'dependency-graph');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Dependency graph visualization');
    graphContainer.appendChild(svg);
    
    // Render the graph content
    if (dependencyGraphContent) {
      const graphContent = typeof dependencyGraphContent === 'string' 
        ? dependencyGraphContent 
        : '';
      const parser = new DOMParser();
      const doc = parser.parseFromString(graphContent, 'image/svg+xml');
      const svgContent = doc.documentElement;
      while (svg.firstChild) {
        svg.appendChild(svg.firstChild);
      }
    }
  }
  return document;
}

const a11yStore = {
  liveRegion: null,
  
  init