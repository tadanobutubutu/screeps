// TODO: This is the existing code that needs to be preserved

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
  // Your code to rotate back
}

// ... (other code in main.js)

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

function addLangAttribute(rootElement, langCode) {
  if (!rootElement) return null;
  rootElement.setAttribute('lang', langCode || 'en');
  return rootElement;
}

function fixTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') return table;
  
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      const parent = th.parentElement;
      if (parent && parent.tagName === 'TR') {
        // Determine scope based on position
        if (parent.parentElement && parent.parentElement.tagName === 'THEAD') {
          th.setAttribute('scope', 'col');
        } else if (parent.parentElement && parent.parentElement.tagName === 'TBODY') {
          // Check if it's a row header
          const isRowHeader = parent.children[0] === th && parent.parentElement === table;
          th.setAttribute('scope', isRowHeader ? 'row' : 'col');
        }
      }
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
    // Move all child elements except script, style, etc. into main
    const children = Array.from(rootElement.children);
    while (rootElement.firstChild) {
      const child = rootElement.firstChild;
      if (child.tagName && ['SCRIPT', 'STYLE', 'LINK', 'META'].includes(child.tagName)) {
        break; // leave non-content elements outside
      }
      mainElement.appendChild(child);
    }
    rootElement.insertBefore(mainElement, rootElement.firstChild);
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
  if (!svgElement || svgElement.tagName !== 'SVG') {
    return svgElement;
  }

  const title = svgElement.querySelector('title');
  if (!title) {
    const newTitle = document.createElement('title');
    newTitle.textContent = 'Decorative graphic';
    svgElement.insertBefore(newTitle, svgElement.firstChild);
  }

  const desc = svgElement.querySelector('desc');
  if (!desc) {
    const newDesc = document.createElement('desc');
    newDesc.textContent = '';
    svgElement.appendChild(newDesc);
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
};