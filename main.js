// Import required modules for table structure issues
const fs = require('fs');
const path = require('path');
const Table = require('table');

const { class1, function1, Object1 } = require('./path/to/module');
const dependencyGraphContent = require('./content/dependencyGraphContent.js');
const indexContent = require('./content/indexContent.js');

// Export imported values (if needed)
module.exports = {
  class1,
  function1,
  Object1,
  renderDependencyGraph,
  renderIndexView,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  fixFakeLinkIssueHead,
  addLandmarkRoles,
  addLandmarkRegions,
  ensureUniqueLandmarksHead,
  fixImageAltTexts,
  googleSignIn,
  handleCredentialResponse,
  fixButtonIdentifiers
};

// Existing code and functions below are preserved
// ... existing code continues ...

function formatTableData(data) {
  return Table(data);
}

function updateTableStructure(tableData) {
  // Fix table structure issues
  const formattedTable = formatTableData(tableData);
  return formattedTable;
}

module.exports.formatTableData = formatTableData;
module.exports.updateTableStructure = updateTableStructure;

// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from the
// appropriate modules.

function renderDependencyGraph(data) {
  return dependencyGraphContent.render(data);
}

function renderIndexView(data) {
  return indexContent.render(data);
}

// Function to add lang attribute to HTML element
function addLangAttribute(document, lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
  return document;
}

// Function to fix table structure issues
function fixTableStructureIssues(document) {
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
      const remainingRows = rows.length > 1 ? Array.from(rows).slice(1) : [];
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
      const cells = row.querySelectorAll('th, td');
      // Check if first cell should be a header
      if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
        const firstCell = cells[0];
        if (firstCell.tagName !== 'TH') {
          const th = document.createElement('th');
          th.textContent = firstCell.textContent;
          th.scope = 'col';
          row.insertBefore(th, firstCell);
          firstCell.remove();
          fixedCount++;
        }
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
  if (mainElement.tagName !== 'MAIN') {
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
        onclick.includes('document.location') ||
        onclick.includes('.href'))) {

      // Convert to proper anchor or add proper accessibility
      const span = document.createElement('span');
      span.textContent = element.textContent;
      span.setAttribute('role', 'link');
      span.setAttribute('tabindex', '0');
      span.setAttribute('onclick', onclick);
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

// HEAD version: simpler fake link fix for anchors with href="#"
function fixFakeLinkIssueHead(document) {
  const fakeLinks = document.querySelectorAll('[role="link"]');
  fakeLinks.forEach(link => {
    if (link.tagName === 'A' && link.getAttribute('href') === '#') {
      link.setAttribute('aria-label', 'This link goes to a section within the page');
    }
  });
}

// Accessibility fix for REACT_017: Add/fix landmark issues and add Landmark Regions
function addLandmarkRoles(document) {
  const landmarks = {
    'nav': 'navigation',
    'main': 'main',
    'header': 'banner',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'section': 'region',
    'article': 'article'
  };

  Object.entries(landmarks).forEach(([element, role]) => {
    const elements = document.querySelectorAll(element);
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
function ensureUniqueLandmarksHead(document) {
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
    const buttonContainer = document.getElementById('g_id_onload');
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
  });
}