// Import required module(s) - for fixing table structure issues and SVG accessibility issues
import './table-styles.css';

// main.js - Entry point for the application

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// Ensure all landmark elements have unique ids. If a landmark doesn't have an id, generates one.
// Update or create the affected functions to be accessible
// Address additional accessibility issues by fixing table structure issues

function ensureUniqueLandmarks(landmarks, prefix = 'landmark') {
  if (!landmarks || !Array.isArray(landmarks)) {
    throw new Error('Landmarks array is required');
  }

  const ids = [];
  const usedIds = new Set();

  landmarks.forEach((landmark, index) => {
    if (!landmark) {
      return;
    }

    if (landmark.id) {
      if (usedIds.has(landmark.id)) {
        const newId = `${prefix}-${index}`;
        landmark.id = newId;
        usedIds.add(newId);
        ids.push(newId);
      } else {
        usedIds.add(landmark.id);
        ids.push(landmark.id);
      }
    } else {
      let generatedId = `${prefix}-${Math.floor(Math.random() * 900000) + 100000}`;
      while (usedIds.has(generatedId)) {
        generatedId = `${prefix}-${Math.floor(Math.random() * 900000) + 100000}`;
      }
      landmark.id = generatedId;
      usedIds.add(generatedId);
      ids.push(generatedId);
    }
  });

  return ids;
}

function setLanguageAttribute(languageCode) {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', languageCode || 'en');
  }
}

export function anotherFunction() {
  // More existing functionality
  return true;
}

function addDependencyGraphAria(container) {
  const containerEl = document.querySelector(container);
  if (containerEl) {
    containerEl.setAttribute('role', 'img');
    containerEl.setAttribute('aria-label', 'Dependency Graph');
  }
}

function validateTableAccessibility(tables) {
  const tablesArr = document.querySelectorAll(tables);
  tablesArr.forEach((table) => {
    const hasCaption = table.querySelector('caption');
    const hasHeaders = table.querySelector('th');
    const hasScope = table.querySelectorAll('th[scope]');
    
    if (!hasCaption) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data Table';
      table.insertBefore(caption, table.firstChild);
    }
    
    if (!hasHeaders) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const cells = firstRow.querySelectorAll('td');
        cells.forEach(cell => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          cell.parentNode.replaceChild(th, cell);
        });
      }
    }
  });
}

function validateTableStructure(tables) {
  const tablesArr = document.querySelectorAll(tables);
  tablesArr.forEach((table) => {
    const rows = table.querySelectorAll('tr');
    let headerRowIndex = 0;
    
    rows.forEach((row, index) => {
      const cells = row.querySelectorAll('th, td');
      if (cells.length === 0) {
        row.parentNode.removeChild(row);
      }
    });
    
    const thead = table.querySelector('thead') || table.createTHead();
    const firstRow = table.querySelector('tr');
    if (firstRow && !table.querySelector('thead tr')) {
      thead.appendChild(firstRow);
    }
    
    const tbody = table.querySelector('tbody') || table.createTBody();
    const remainingRows = Array.from(table.querySelectorAll('tr'));
    remainingRows.forEach(row => {
      if (row.parentNode === table) {
        tbody.appendChild(row);
      }
    });
  });
}

function addMainLandmark() {
  let mainElement = document.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    const body = document.body;
    if (body) {
      const existingContent = Array.from(body.childNodes);
      existingContent.forEach(node => mainElement.appendChild(node));
      body.appendChild(mainElement);
    }
  }
  return mainElement;
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  svgs.forEach((svg) => {
    const title = svg.querySelector('title');
    if (title) {
      const id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
      title.id = id;
      svg.setAttribute('aria-labelledby', id);
    } else {
      svg.setAttribute('aria-label', 'Image');
    }
  });
}

function ensureUniqueLandmarks() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    for (let i = 1; i < mainElements.length; i++) {
      const newElement = document.createElement('section');
      newElement.setAttribute('aria-label', `Section ${i + 1}`);
      mainElements[i].parentNode.replaceChild(newElement, mainElements[i]);
    }
  }
}

function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('.fake-link, [data-fake-link]');
  fakeLinks.forEach((fakeLink) => {
    const href = fakeLink.getAttribute('data-href');
    if (href) {
      fakeLink.setAttribute('href', href);
      fakeLink.setAttribute('role', 'link');
      fakeLink.setAttribute('tabindex', '0');
    }
  });
}

function setSvgAttributes(svgElement, options = {}) {
  if (!svgElement) {
    return;
  }

  const { label, role = 'img' } = options;

  if (role) {
    svgElement.setAttribute('role', role);
  }

  if (label) {
    svgElement.setAttribute('aria-label', label);
  }

  svgElement.setAttribute('focusable', 'false');

  return svgElement;
}

function enhanceSVGsAccessibility() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach((svg) => {
    const hasRole = svg.getAttribute('role');
    const hasAriaLabel = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby');
    const hasDescriptiveChild = svg.querySelector('title, desc');

    if (!hasRole && !hasAriaLabel && !hasDescriptiveChild) {
      setSvgAttributes(svg, { label: 'Decorative image' });
    }
  });
}

function setupAccessibility() {
  setLanguageAttribute();

  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      const targetId = skipLink.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.tabIndex = -1;
        target.focus();
      }
    });
  }

  enhanceSVGsAccessibility();
}

let internalFunction1 = (arg1, arg2) => {
  return arg1 + arg2;
};

let internalFunction2 = () => {
  return true;
};

function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const generatedId = `${prefix}-${Math.floor(Math.random() * 900000) + 100000}`;
  element.id = generatedId;
  return generatedId;
}

function getLangAttribute() {
  const htmlElement = document.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

function createInPageButton(options = {}) {
  const button = document.createElement('button');
  button.textContent = options.text || 'Skip to content';
  button.className = options.className || 'in-page-button';
  button.setAttribute('aria-label', options.ariaLabel || 'Skip to main content');
  
  const targetId = options.targetId || 'main-content';
  let target = document.getElementById(targetId);
  
  if (!target) {
    target = addMainLandmark();
    target.id = targetId;
  }
  
  button.addEventListener('click', () => {
    target.tabIndex = -1;
    target.focus();
    target.scrollIntoView({ behavior: 'smooth' });
  });
  
  document.body.insertBefore(button, document.body.firstChild);
  return button;
}

function validateLandmark(element) {
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  const tagName = element.tagName ? element.tagName.toLowerCase() : '';
  return validLandmarks.includes(tagName) || element.getAttribute('role');
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section, article');
  
  landmarks.forEach((landmark, index) => {
    if (!landmark.id) {
      landmark.id = `landmark-${index}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    const role = landmark.getAttribute('role');
    const tagName = landmark.tagName ? landmark.tagName.toLowerCase() : '';
    
    if (role && !validateLandmark(landmark)) {
      landmark.removeAttribute('role');
    }
  });
  
  return ensureUniqueLandmarks(Array.from(landmarks));
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;
  
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (