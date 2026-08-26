// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark, fixLandmarkIssues)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks, uniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames, addAccessibleNamesToSVGs)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue, fixFakeLinkIssues)
// - REACT_037: Google sign-in logic (DONE: googleSignIn)
// - REACT_040: Replace my-button with actual button id for accessibility (DONE: fixButtonIdentifiers)

import { class1, function1, Object1 } from './path/to/module';

// Function to add lang attribute to HTML element
function addLangAttribute(document, lang = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
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
    const rows = Array.from(table.querySelectorAll('tr'));
    
    if (rows.length > 0 && !existingThead) {
      const firstRow = rows[0];
      const thead = document.createElement('thead');
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
      fixedCount++;
    }
    
    if (!existingTbody) {
      const remainingRows = Array.from(table.querySelectorAll('tr'));
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
      const cells = row.querySelectorAll('td');
      // Check if first cell should be a header
      if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
        const firstCell = cells[0];
        const th = document.createElement('th');
        th.textContent = firstCell.textContent;
        th.scope = 'col';
        firstCell.parentNode.replaceChild(th, firstCell);
        fixedCount++;
      }
    });
    
    // Additional HEAD logic: ensure scope on header cells
    const headerCells = table.querySelectorAll('th');
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
  if (!mainElement.hasAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }
  
  return mainElement;
}

// Function to ensure unique landmarks (origin/main approach)
function ensureUniqueLandmarks(document) {
  const landmarkTypes = ['header', 'nav', 'main', 'aside', 'footer'];
  const usedLabels = {};
  
  landmarkTypes.forEach(type => {
    const landmarks = document.querySelectorAll(type);
    landmarks.forEach((landmark, index) => {
      const existingLabel = landmark.getAttribute('aria-label') || 
                           landmark.getAttribute('aria-labelledby');
      
      if (landmarks.length > 1) {
        let label = existingLabel || `${type}-${index + 1}`;
        
        // Ensure uniqueness
        if (usedLabels[type] && usedLabels[type].has(label)) {
          label = `${type}-${index + 1}`;
        }
        
        if (!usedLabels[type]) {
          usedLabels[type] = new Set();
        }
        usedLabels[type].add(label);
        
        landmark.setAttribute('aria-label', label);
      }
    });
  });
}

// Function to add accessible names to SVGs
function addSvgAccessibleNames(document) {
  const svgs = document.querySelectorAll('svg');
  let count = 0;
  
  svgs.forEach((svg, index) => {
    const hasAccessibleName = svg.getAttribute('aria-label') || 
                              svg.getAttribute('aria-labelledby') ||
                              svg.querySelector('title');
    
    if (!hasAccessibleName) {
      const title = document.createElement('title');
      title.textContent = `SVG icon ${index + 1}`;
      title.id = `svg-title-${index + 1}`;
      
      // Insert title as first child
      if (svg.firstChild) {
        svg.insertBefore(title, svg.firstChild);
      } else {
        svg.appendChild(title);
      }
      
      svg.setAttribute('aria-labelledby', title.id);
      count++;
    }
  });
  
  return count;
}

// Alias for addSvgAccessibleNames as referenced in the accessibility TODO
function addAccessibleNamesToSVGs(document) {
  return addSvgAccessibleNames(document);
}

// Function to fix fake link issue (origin/main approach - more robust)
function fixFakeLinkIssue(document) {
  let count = 0;
  
  // Find elements with onclick that look like links but aren't anchors
  const clickableElements = document.querySelectorAll('[onclick]');
  
  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    const hasHref = element.hasAttribute('href');
    const onclick = element.getAttribute('onclick') || '';
    
    // Check if it's a fake link (clickable but not a real anchor)
    if (!isAnchor && (onclick.includes('window.location') || 
        onclick.includes('location.href') || 
        onclick.includes('navigate'))) {
      
      // Convert to proper anchor or add proper accessibility
      const span = document.createElement('span');
      span.textContent = element.textContent;
      span.setAttribute('role', 'link');
      span.setAttribute('tabindex', '0');
      span.setAttribute('onclick', onclick);
      span.setAttribute('onkeypress', `if(event.key==='Enter'){${onclick}}`);
      
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

// HEAD version: simpler fake link fix for anchors with href="#"
function fixFakeLinkIssues(document) {
  const fakeLinks = document.querySelectorAll('a[href="#"], [role="link"]');
  fakeLinks.forEach(link => {
    if (!link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', 'This link goes to a section within the page');
    }
  });
}

// Accessibility fix for REACT_017: Add/fix landmark issues and add Landmark Regions
function fixLandmarkIssues(document) {
  const landmarks = {
    'nav': 'navigation',
    'main': 'main',
    'header': 'banner',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'section': 'region',
    'article': 'article'
  };

  Object.entries(landmarks).forEach(([tag, role]) => {
    const elements = document.querySelectorAll(tag);
    elements.forEach(element => {
      if (element.getAttribute('role') !== role) {
        element.setAttribute('role', role);
      }
    });
  });
}

function addLandmarkRegions(document) {
  const landmarks = ['main', 'header', 'footer', 'aside', 'section', 'article'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    elements.forEach(element => {
      if (!element.getAttribute('role')) {
        element.setAttribute('role', 'landmark');
      }
    });
  });
}

// REACT_025: Ensure unique landmarks (HEAD approach - by role)
function uniqueLandmarks(document) {
  const landmarkRoles = ['navigation', 'banner', 'contentinfo', 'complementary', 'main', 'region', 'article'];
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      let index = 1;
      elements.forEach((el) => {
        if (!el.getAttribute('aria-label')) {
          el.setAttribute('aria-label', `${role} ${index}`);
        }
        index++;
      });
    }
  });
}

// Address accessibility issues from insight report for image alt texts
function fixImageAltTexts(document) {
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.getAttribute('alt')) {
      img.setAttribute('alt', 'Image description');
    }
  });
}

// REACT_037: Google sign-in logic
function googleSignIn(document) {
  // Check if Google Identity Services is available
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: 'YOUR_CLIENT_ID',
      callback: handleCredentialResponse
    });
    const buttonContainer = document.getElementById('g_id_onbutton');
    if (buttonContainer) {
      google.accounts.id.renderButton(
        buttonContainer,
        { theme: 'outline', size: 'large' }
      );
    }
  }
}

function handleCredentialResponse(response) {
  // Decode the JWT token
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  console.log('User signed in:', payload);
  // Handle the sign-in logic here
}

// REACT_040: Replace my-button with actual button id for accessibility
function fixButtonIdentifiers(document) {
  const buttonIdMap = {
    'my-button': 'primary-action-btn'
  };
  
  Object.entries(buttonIdMap).forEach(([oldId, newId]) => {
    const button = document.getElementById(oldId);
    if (button) {
      button.id = newId;
      button.setAttribute('aria-label', button.getAttribute('aria-label') || 'Primary action');
    }
  });
  
  function getAccessibleName(button) {
    return button.getAttribute('aria-label') || 
           button.getAttribute('aria-labelledby') ||
           button.textContent?.trim() ||
           button.value;
  }
}

// Add the fix for REACT_017: Add <main> landmark to docs/index.html
function addMainLandmarkToIndex(document) {
  const indexContent = document.querySelector('#content');
  if (indexContent) {
    const mainElement = document.createElement('main');
    mainElement.appendChild(indexContent);
    const container = document.createElement('div');
    container.classList.add('container');
    mainElement.appendChild(container);
    document.body.appendChild(mainElement);
  }
}

// TODO: Implement function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport(document) {
  // Assuming the insight report provides an object with the issues to be addressed
  const insightReport = {
    'REACT_015': () => addLangAttribute(document),
    'REACT_041': () => addSvgAccessibleNames(document),
    'REACT_036': () => { fixFakeLinkIssue(document); fixFakeLinkIssues(document); },
    'REACT_017': () => { fixLandmarkIssues(document); addLandmarkRegions(document); addMainLandmark(document); },
    'REACT_027': () => fixTableStructure(document),
    'REACT_025': () => { ensureUniqueLandmarks(document); uniqueLandmarks(document); },
    'REACT_037': () => googleSignIn(document),
    'REACT_040': () => fixButtonIdentifiers(document),
    // Additional fixes
    'IMAGE_ALT': () => fixImageAltTexts(document),
    'INDEX_MAIN': () => addMainLandmarkToIndex(document),
  };

  Object.values(insightReport).forEach((functionToCall) => {
    if (typeof functionToCall === 'function') {
      functionToCall();
    }
  });
}

// Export all functions
export { 
  addLangAttribute, 
  fixTableStructure, 
  addMainLandmark, 
  ensureUniqueLandmarks, 
  addSvgAccessibleNames, 
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn,
  handleCredentialResponse,
  fixButtonIdentifiers,
  addMainLandmarkToIndex,
  implementAccessibilityFixesFromReport,
  class1, 
  function1, 
  Object1 
};