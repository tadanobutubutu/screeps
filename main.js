// Assuming the main.js file is a JavaScript file that includes the HTML content of the ... file.

// ... (other code in main.js)

// Before:
// <a id="unrotate" href="#">rotate back</a>

// After:
// Replace the <a> tag with a <button> element
// <button id="unrotate" role="button" aria-label="rotate back" onclick="rotateBack()">rotate back</button>

// ... (other code in main.js)

// If the `rotateBack` function is defined elsewhere in main.js, ensure it's called when the button is clicked.
// If not, define it here:
function rotateBack() {
  // Code to rotate back
  const graphContainer = document.getElementById('graph-container');
  if (graphContainer) {
    graphContainer.style.transform = 'rotate(0deg)';
  }
}

// ... (other code in main.js)

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

function renderGraphOrIndex(container, data) {
  // Existing function for rendering graph/index
  // This function now uses the new accessibility functions
  
  if (!container) {
    return null;
  }

  // Clear existing content
  container.innerHTML = '';

  // Create main content structure
  const main = document.createElement('main');
  main.setAttribute('id', 'main-content');

  // Render based on data type
  if (data && data.graph) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'graph-svg');
    svg.setAttribute('role', 'img');
    
    // Add accessible names to SVG
    addSvgAccessibleNames(svg);
    
    // Build graph content...
    main.appendChild(svg);
  } else {
    // Render index content
    const table = document.createElement('table');
    table.setAttribute('role', 'table');
    // Continue building table...
    main.appendChild(table);
  }

  // Fix any fake links in the container
  const links = main.querySelectorAll('a');
  links.forEach(link => fixFakeLinkIssue(link));

  container.appendChild(main);

  // Ensure unique landmarks
  ensureUniqueLandmarks();

  // Add main landmark
  addMainLandmark(container);

  return container;
}

function fixTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') {
    return table;
  }

  const caption = table.querySelector('caption');
  if (!caption) {
    const newCaption = table.createCaption();
    newCaption.textContent = 'Data Table';
    table.insertBefore(newCaption, table.firstChild);
  }

  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.id) {
      th.id = `header-${index}`;
    }
    if (!th.getAttribute('scope')) {
      th.setAttribute('scope', 'col');
    }
  });

  const cells = table.querySelectorAll('td');
  cells.forEach(cell => {
    const row = cell.parentElement;
    const cellIndex = Array.from(row.cells).indexOf(cell);
    const headerCell = table.querySelector(`th:nth-child(${cellIndex + 1})`);
    if (headerCell) {
      cell.setAttribute('headers', headerCell.id);
    }
  });

  return table;
}

function addMainLandmark(rootElement) {
  // Add main landmark to the provided rootElement
  if (!rootElement) {
    return null;
  }

  const existingMain = rootElement.querySelector('main');
  if (!existingMain) {
    const mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    
    const firstSection = rootElement.querySelector('section, div, article');
    if (firstSection) {
      rootElement.insertBefore(mainElement, firstSection);
    } else {
      rootElement.insertBefore(mainElement, rootElement.firstChild);
    }
  }

  return rootElement;
}

function ensureUniqueLandmarks() {
  // Ensure unique landmarks in the entire application
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0 && el.id) {
          el.id = `${el.id}-${index}`;
        }
      });
    }
  });
}

function addSvgAccessibleNames(svgElement) {
  // Add accessible names to the provided svgElement
  if (!svgElement || svgElement.tagName !== 'svg') {
    return svgElement;
  }

  const title = svgElement.querySelector('title');
  if (!title) {
    const newTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    newTitle.textContent = 'Decorative graphic';
    svgElement.insertBefore(newTitle, svgElement.firstChild);
  }

  const desc = svgElement.querySelector('desc');
  if (!desc) {
    const newDesc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    newDesc.textContent = '';
    const titleElement = svgElement.querySelector('title');
    if (titleElement && titleElement.nextSibling) {
      svgElement.insertBefore(newDesc, titleElement.nextSibling);
    } else {
      svgElement.appendChild(newDesc);
    }
  }
  
  return svgElement;
}

function fixFakeLinkIssue(link) {
  // Fix fake link issues in the provided link
  if (!link) {
    return link;
  }

  if (link.href === '#' || link.href === '' || !link.href) {
    const parent = link.parentElement;
    if (parent && parent.tagName === 'A') {
      const hasClickHandler = parent.onclick || parent.getAttribute('onclick');
      if (!hasClickHandler) {
        parent.setAttribute('role', 'button');
      }
    }
  }

  return link;
}

function addLangAttribute(rootElement, lang) {
  // Add language attribute to root element
  if (!rootElement) {
    return;
  }
  
  if (!rootElement.hasAttribute('lang')) {
    rootElement.setAttribute('lang', lang || 'en');
  }
}

// ADD THESE LINES TO ADD ACCESSIBILITY ATTRIBUTES TO ROOT ELEMENT
const rootElement = document.documentElement || document.body;

if (rootElement) {
  addLangAttribute(rootElement, 'en');
}

ensureUniqueLandmarks();

export {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  renderGraphOrIndex,
  rotateBack,
};