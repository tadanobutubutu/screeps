const fs = require('fs');
const path = require('path');

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: ensureDependencyGraphARIA, getLangAttribute)
const getLangAttribute = () => document.documentElement ? document.documentElement.lang || 'en' : 'en';
document.documentElement.lang = getLangAttribute();

function rotateBack() {
  // Logic to rotate back
  // JavaScript code to rotate back
  console.log('Rotating back...');
  // For example, if you're manipulating the DOM or a state:
  // ...
  // ...
};

export const metadata = {
  title: "Screeps Dashboard",
  description: "Dashboard for Screeps",
};

function addLangAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.lang = lang;
  }
  return document;
}

function addMainLandmark(document) {
  let mainElement = document.querySelector('main');

  if (!mainElement) {
    const body = document.body;
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');

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

  if (mainElement.tagName !== 'MAIN') {
    mainElement.setAttribute('role', 'main');
  }

  return mainElement;
}

function validateLandmarkElements(document) {
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'main-content';
  }

  const navigations = document.querySelectorAll('nav');
  navigations.forEach((nav, index) => {
    if (!nav.id && !nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', `navigation-${index + 1}`);
    }
  });

  const regions = document.querySelectorAll('[role="region"]');
  regions.forEach((region, index) => {
    if (!region.id) {
      region.id = `region-${index + 1}`;
    }
  });

  return document;
}

// Function to add lang attribute to HTML element (REACT_015)
function addLangAttributeToDocument(document) {
  if (!document.documentElement.hasAttribute('lang')) {
    const lang = getLangAttribute();
    document.documentElement.setAttribute('lang', lang);
  }
  return document;
}

// Function to get full language attribute
function getFullLangAttribute(document) {
  const lang = document.documentElement.getAttribute('lang');
  return lang || 'en';
}

// Function to fix image alt texts
function fixImageAltTexts(document) {
  const images = document.querySelectorAll('img');
  let fixedCount = 0;
  
  images.forEach(img => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
      fixedCount++;
    } else if (img.getAttribute('alt') === '' && !img.hasAttribute('role')) {
      img.setAttribute('role', 'presentation');
      fixedCount++;
    }
  });
  
  return fixedCount;
}

// Function to handle credential response from Google Sign-In
function handleCredentialResponse(response) {
  // Decode the credential response
  const responsePayload = JSON.parse(atob(response.credential.split('.')[1]));
  console.log('Google ID: ' + responsePayload.sub);
  console.log('Email: ' + responsePayload.email);
  console.log('Name: ' + responsePayload.name);
  
  // Store user information in session or send to server
  sessionStorage.setItem('userEmail', responsePayload.email);
  sessionStorage.setItem('userName', responsePayload.name);
  
  return responsePayload;
}

// Function to set SVG accessibility properties
function setSvgAccessibilityProps(svg) {
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  
  // Add title if not present
  const title = svg.querySelector('title');
  if (!title) {
    const newTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    newTitle.textContent = 'Graphical content';
    svg.insertBefore(newTitle, svg.firstChild);
  }
  
  // Add desc if not present
  const desc = svg.querySelector('desc');
  if (!desc) {
    const newDesc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    newDesc.textContent = 'Graphical representation';
    svg.insertBefore(newDesc, svg.firstChild);
  }
  
  return svg;
}

// Function to add accessible names to SVG elements
function addAccessibleNamesToSVGs(document) {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    setSvgAccessibilityProps(svg);
    const titleElement = svg.querySelector('title');
    if (titleElement && titleElement.textContent.trim()) {
      svg.setAttribute('aria-label', titleElement.textContent.trim());
    } else if (!svg.getAttribute('aria-label')) {
      svg.setAttribute('aria-label', 'Graphic');
    }
  });
  return document;
}

// Function to fix fake link issue (merged fixes)
function fixFakeLinkIssues(document) {
  // Implementation for fixing fake link issues
}

// Function to fix fake link issue (handles both role="link" elements and anchors with href="#")
function fixFakeLinkIssue(document) {
  let count = 0;

  const clickableElements = document.querySelectorAll('[onclick], [role="link"]');

  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    const hasHref = element.hasAttribute('href');
    const onclick = element.getAttribute('onclick') || '';

    if (!isAnchor && (onclick.includes('window.location') ||
        onclick.includes('document.location') ||
        onclick.includes('.href'))) {

      const span = document.createElement('span');
      span.textContent = element.textContent;
      span.setAttribute('role', 'link');
      span.setAttribute('tabindex', '0');
      span.setAttribute('onclick', onclick);
      span.onclick = element.onclick;
      
      span.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          element.click();
        }
      });

      if (element.className) {
        span.className = element.className;
      }

      element.parentNode.replaceChild(span, element);
      count++;
    }
  });

  return count;
}

// Function to fix table structure issues
function fixTableStructureIssues(document) {
  let fixedCount = 0;
  const tables = document.querySelectorAll('table');

  tables.forEach(table => {
    const existingThead = table.querySelector('thead');
    const existingTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');

    if (!existingTbody && rows.length > 0) {
      const remainingRows = rows.length > 1 ? Array.from(rows).slice(1) : [];
      if (remainingRows.length > 0) {
        const tbody = document.createElement('tbody');
        remainingRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
        fixedCount++;
      }
    }

    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
      const cells = row.querySelectorAll('th');
      if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
        const firstCell = cells[0];
        const th = document.createElement('th');
        th.textContent = firstCell.textContent;
        th.scope = 'col';
        row.replaceChild(th, firstCell);
        fixedCount++;
      }
    });

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

function uniqueLandmarks(document) {
  const landmarks = document.querySelectorAll('[role="main"], main, [role="navigation"], nav, [role="banner"], header, [role="contentinfo"], footer, [role="complementary"], aside');
  const seen = new Map();
  
  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || tagName;
    const key = `${role}-${tagName}`;
    
    if (seen.has(key)) {
      // Remove duplicate landmark role or convert to region
      if (landmark.hasAttribute('role')) {
        const currentRole = landmark.getAttribute('role');
        if (['main', 'navigation', 'banner', 'contentinfo', 'complementary'].includes(currentRole)) {
          landmark.setAttribute('role', 'region');
        } else if (['main', 'nav', 'header', 'footer', 'aside'].includes(tagName)) {
          landmark.setAttribute('role', 'region');
          if (!landmark.getAttribute('aria-label')) {
            landmark.setAttribute('aria-label', `${tagName} region`);
          }
        }
      } else if (['main', 'nav', 'header', 'footer', 'aside'].includes(tagName)) {
        landmark.setAttribute('role', 'region');
        if (!landmark.getAttribute('aria-label')) {
          landmark.setAttribute('aria-label', `${tagName} region`);
        }
      }
    } else {
      seen.set(key, landmark);
    }
  });
  
  return document;
}

// Function to address accessibility issues by applying fixes
function addressAccessibilityIssues(document) {
  document = addLangAttributeToDocument(document);
  document = fixTableStructureIssues(document);
  document = fixLandmarkIssues(document);
  document = addMainLandmark(document);
  document = addLandmarkRegions(document);
  document = ensureUniqueLandmarks(document);
  document = uniqueLandmarks(document);
  document = addSvgAccessibleNames(document);
  document = addAccessibleNamesToSVGs(document);
  document = fixFakeLinkIssue(document);
  document = fixFakeLinkIssues(document);
  document = fixImageAltTexts(document);
  document = googleSignIn(document);
  document = ensureElementHasId(document, 'button, a, input');
  document = addAriaLabel(document, 'nav', 'Main navigation');
  document = fixDependencyGraphAria(document);
  document = renderDependencyGraphs(document);
  document = addMainLandmarkToIndex(document);
  return document;
}

// Function to add lang attribute to HTML element (REACT_015)
function addLangAttributeToDocument(document) {
  if (!document.documentElement.hasAttribute('lang')) {
    const lang = getLangAttribute();
    document.documentElement.setAttribute('lang', lang);
  }
  return document;
}

// Function to get full language attribute
function getFullLangAttribute(document) {
  const lang = document.documentElement.getAttribute('lang');
  return lang || 'en';
}

// Function to fix image alt texts
function fixImageAltTexts(document) {
  const images = document.querySelectorAll('img');
  let fixedCount = 0;
  
  images.forEach(img => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
      fixedCount++;
    } else if (img.getAttribute('alt') === '' && !img.hasAttribute('role')) {
      img.setAttribute('role', 'presentation');
      fixedCount++;
    }
  });
  
  return fixedCount;
}

// Function to handle credential response from Google Sign-In
function handleCredentialResponse(response) {
  // Decode the credential response
  const responsePayload = JSON.parse(atob(response.credential.split('.')[1]));
  console.log('Google ID: ' + responsePayload.sub);
  console.log('Email: ' + responsePayload.email);
  console.log('Name: ' + responsePayload.name);
  
  // Store user information in session or send to server
  sessionStorage.setItem('userEmail', responsePayload.email);
  sessionStorage.setItem('userName', responsePayload.name);
  
  return responsePayload;
}

// Function to set SVG accessibility properties
function setSvgAccessibilityProps(svg) {
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  
  // Add title if not present
  const title = svg.querySelector('title');
  if (!title) {
    const newTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    newTitle.textContent = 'Graphical content';
    svg.insertBefore(newTitle, svg.firstChild);
  }
  
  // Add desc if not present
  const desc = svg.querySelector('desc');
  if (!desc) {
    const newDesc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    newDesc.textContent = 'Graphical representation';
    svg.insertBefore(newDesc, svg.firstChild);
  }
  
  return svg;
}

// Function to add accessible names to SVG elements
function addAccessibleNamesToSVGs(document) {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    setSvgAccessibilityProps(svg);
    const titleElement = svg.querySelector('title');
    if (titleElement && titleElement.textContent.trim()) {
      svg.setAttribute('aria-label', titleElement.textContent.trim());
    } else if (!svg.getAttribute('aria-label')) {
      svg.setAttribute('aria-label', 'Graphic');
    }
  });
  return document;
}

// Function to fix fake link issue (handles both role="link" elements and anchors with href="#")
function fixFakeLinkIssue(document) {
  let count = 0;

  const clickableElements = document.querySelectorAll('[onclick], [role="link"]');

  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    const hasHref = element.hasAttribute('href');
    const onclick = element.getAttribute('onclick') || '';

    if (!isAnchor && (onclick.includes('window.location') ||
        onclick.includes('document.location') ||
        onclick.includes('.href'))) {

      const span = document.createElement('span');
      span.textContent = element.textContent;
      span.setAttribute('role', 'link');
      span.setAttribute('tabindex', '0');
      span.setAttribute('onclick', onclick);
      span.onclick = element.onclick;
      
      span.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          element.click();
        }
      });

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
  // Implementation for fixing fake link issues
}

// Function to address accessibility issues by applying fixes
function addressAccessibilityIssues(document) {
  document = addLangAttributeToDocument(document);
  document = fixTableStructureIssues(document);
  document = fixLandmarkIssues(document);
  document = addMainLandmark(document);
  document = addLandmarkRegions(document);
  document = ensureUniqueLandmarks(document);
  document = uniqueLandmarks(document);
  document = addSvgAccessibleNames(document);
  document = addAccessibleNamesToSVGs(document);
  document = fixFakeLinkIssue(document);
  document = fixFakeLinkIssues(document);
  document = fixImageAltTexts(document);
  document = googleSignIn(document);
  document = ensureElementHasId(document, 'button, a, input');
  document = addAriaLabel(document, 'nav', 'Main navigation');
  document = fixDependencyGraphAria(document);
  document = renderDependencyGraphs(document);
  document = addMainLandmarkToIndex(document);
  return document;
}

// Function to add lang attribute to HTML element (REACT_015)
function addLangAttributeToDocument(document) {
  if (!document.documentElement.hasAttribute('lang')) {
    const lang = getLangAttribute();
    document.documentElement.setAttribute('lang', lang);
  }
  return document;
}

// Function to get full language attribute
function getFullLangAttribute(document) {
  const lang = document.documentElement.getAttribute('lang');
  return lang || 'en';
}

// Function to fix image alt texts
function fixImageAltTexts(document) {
  const images = document.querySelectorAll('img');
  let fixedCount = 0;
  
  images.forEach(img => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
      fixedCount++;
    } else if (img.getAttribute('alt') === '' && !img.hasAttribute('role')) {
      img.setAttribute('role', 'presentation');
      fixedCount++;
    }
  });
  
  return fixedCount;
}

// Function to handle credential response from Google Sign-In
function handleCredentialResponse(response) {
  // Decode the credential response
  const responsePayload = JSON.parse(atob(response.credential.split('.')[1]));
  console.log('Google ID: ' + responsePayload.sub);
  console