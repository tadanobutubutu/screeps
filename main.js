const someVar = require('some-module');

// Accessibility functions (converted to CommonJS from origin/main)

function addLangAttribute() {
  const html = document.documentElement;
  if (!html.getAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('th, td');
      cells.forEach((cell, cellIndex) => {
        const isTH = cell.tagName === 'TH';
        if (!isTH) return;
        if (cellIndex === 0) {
          cell.setAttribute('scope', 'row');
        } else {
          cell.setAttribute('scope', 'col');
        }
      });
    });
  });
}

function checkTableStructure() {
  const tables = document.querySelectorAll('table');
  let hasIssues = false;
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        hasIssues = true;
      }
    });
  });
  return !hasIssues;
}

function validateLandmark() {
  const landmarks = document.querySelectorAll('nav, footer, aside, main');
  landmarks.forEach(landmark => {
    if (!landmark.getAttribute('role')) {
      landmark.setAttribute('role', 'landmark');
    }
  });
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('nav, footer, aside, main');
  const landmarkIds = new Set();
  for (let i = 0; i < landmarks.length; i++) {
    if (landmarkIds.has(landmarks[i].id)) {
      landmarks[i].setAttribute('role', landmarks[i].tagName.toLowerCase());
      landmarks[i].id = `${landmarks[i].id}-duplicate`;
    } else {
      landmarkIds.add(landmarks[i].id);
    }
  }

  return Array.from(landmarkIds).length === landmarks.length;
}

function addLandmarkRegions() {
  const landmarkElements = ['header', 'nav', 'footer', 'article', 'section'];
  landmarkElements.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    elements.forEach(element => {
      if (!element.getAttribute('role')) {
        element.setAttribute('role', landmark);
      }
    });
  });
}

function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a:not([href])');
  fakeLinks.forEach(link => {
    if (link.href === '#' || !link.href) {
      const button = document.createElement('button');
      button.textContent = link.textContent;
      button.setAttribute('type', 'button');

      Array.from(link.attributes).forEach(attr => {
        if (attr.name !== 'href') {
          button.setAttribute(attr.name, attr.value);
        }
      });

      if (link.getAttribute('aria-label')) {
        button.setAttribute('aria-label', link.getAttribute('aria-label'));
      }
      if (link.getAttribute('aria-labelledby')) {
        button.setAttribute('aria-labelledby', link.getAttribute('aria-labelledby'));
      }

      link.parentNode.replaceChild(button, link);
    }
  });
}

function getLangAttribute() {
  const html = document.documentElement;
  return html.getAttribute('lang') || 'en';
}

function getFullLangAttribute() {
  const lang = document.documentElement.lang;
  return lang ? lang : 'en';
}

function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  let hasIssues = false;
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        hasIssues = true;
      } else if (!hasValidTHScope(th)) {
        hasIssues = true;
      }
    });
  });
  return !hasIssues;
}

function validateTableStructure() {
  return checkTableStructure();
}

function getSvgAccessibleName() {
  const svgs = document.querySelectorAll('svg');
  for (let i = 0; i < svgs.length; i++) {
    const svg = svgs[i];
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    const ariaLabelledBy = svg.getAttribute('aria-labelledby');
    if (ariaLabelledBy) {
      const labelEl = document.getElementById(ariaLabelledBy);
      if (labelEl) return labelEl.textContent.trim();
    }
    const title = svg.querySelector('title');
    if (title) return title.textContent.trim();
  }
  return '';
}

function wrapPrimaryContentInMain() {
  let mainElement = document.querySelector('main');

  if (mainElement) {
    return mainElement;
  }

  const body = document.body;
  const excludedTags = ['header', 'nav', 'footer', 'aside', 'script', 'style', 'link', 'meta'];
  const mainContent = [];

  Array.from(body.children).forEach(child => {
    if (!excludedTags.includes(child.tagName.toLowerCase())) {
      mainContent.push(child);
    }
  });

  if (mainContent.length === 0) {
    return null;
  }

  mainElement = document.createElement('main');
  mainElement.setAttribute('id', 'main-content');

  while (mainContent.length > 0) {
    const child = mainContent.pop();
    mainElement.appendChild(child);
  }

  const header = body.querySelector('header');
  if (header && header.nextSibling) {
    body.insertBefore(mainElement, header.nextSibling);
  } else if (header) {
    body.appendChild(mainElement);
  } else {
    body.insertBefore(mainElement, body.firstChild);
  }

  return mainElement;
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('nav, footer, aside, main, header');
  const landmarkRoles = new Map();
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
      if (landmarkRoles.has(role)) {
        landmark.setAttribute('aria-label', `${role}-${landmarkRoles.get(role)}`);
        landmarkRoles.set(role, landmarkRoles.get(role) + 1);
      } else {
        landmarkRoles.set(role, 1);
      }
    }
  });
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (!title) {
        const newTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        newTitle.textContent = `SVG graphic ${index + 1}`;
        svg.insertBefore(newTitle, svg.firstChild);
      }
    }
  });
}

function createInPageButton(label, onClick) {
  const button = document.createElement('button');
  button.textContent = label;
  button.setAttribute('type', 'button');
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  return button;
}

function createAccessibleLink(href, label) {
  const link = document.createElement('a');
  link.setAttribute('href', href);
  link.setAttribute('aria-label', label);
  link.textContent = label;
  return link;
}

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  let hasIssues = false;
  links.forEach(link => {
    if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
      hasIssues = true;
    }
  });
  return !hasIssues;
}

function hasValidTHScope(th) {
  const scope = th.getAttribute('scope');
  return scope === 'row' || scope === 'col' || scope === 'rowgroup' || scope === 'colgroup';
}

function addMainLandmark() {
  return wrapPrimaryContentInMain();
}

function fixUniqueLandmarks() {
  return validateLandmarkStructure();
}

function addressAccessibilityIssues() {
  addLangAttribute();
  fixTableStructure();
  addLandmarkRegions();
  ensureUniqueLandmarks();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
}

// Conditionally run accessibility fixes if in a browser environment
if (typeof document !== 'undefined') {
  addressAccessibilityIssues();
  addLandmarkRegions();
}

// Original Screeps bot functions
function init() {
  // initialization code
}

// Export all functions for use by other modules and tests
module.exports = {
  // Original functions
  init,
  loop: function() {
    // main loop logic
  },
  // Accessibility functions
  addLangAttribute,
  fixTableStructure,
  checkTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  fixUniqueLandmarks,
  addLandmarkRegions,
  fixFakeLinkIssue,
  createInPageButton,
  addSvgAccessibleNames,
  validateLinkAccessibility,
  createAccessibleLink,
  addressAccessibilityIssues,
  hasValidTHScope,
  validateLandmark,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  wrapPrimaryContentInMain
};