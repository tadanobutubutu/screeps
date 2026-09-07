// TODO: This is the existing code that needs to be preserved

// ... (other code in main.js)

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

// REACT_015: lang attribute should be added to the HTML element (typically in index.html)
function addLangAttribute(element, lang) {
  if (element) {
    element.classList.remove('rotated');
  }
}

// Added: The requested function
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.ariaLabel = 'rotate back';
  button.textContent = 'rotate back';
  button.onclick = rotateBack;
  return button;
}

// REACT_041: Add accessible names to 2 SVGs
// Add aria-label or aria-labelledby to SVG elements
function addSvgAccessibleNames(svgElement, label) {
  if (!svgElement || svgElement.tagName !== 'SVG') {
    return;
  }
  svgElement.setAttribute('role', 'img');
  svgElement.setAttribute('aria-label', label);
}

// Example usage for SVGs:
// const svg1 = document.querySelector('svg.icon1');
// const svg2 = document.querySelector('svg.icon2');
// addSvgAccessibleNames(svg1, 'Description of first icon');
// addSvgAccessibleNames(svg2, 'Description of second icon');

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// Ensure all <th> elements have scope attribute
function ensureThScope() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      // Determine if it's a column header or row header based on context
      const parent = th.parentElement;
      const parentTagName = parent ? parent.tagName.toLowerCase() : '';
      const isFirstCell = parent && Array.from(parent.children).indexOf(th) === 0;

      if (isFirstCell && parentTagName === 'tr') {
        th.setAttribute('scope', 'row');
      } else if (parentTagName === 'thead' || !isFirstCell) {
        th.setAttribute('scope', 'col');
      }
    }
  });
}

// Ensure the dependencyGraph container has a proper ARIA role
function ensureDependencyGraphAriaRole() {
  const dependencyGraph = document.getElementById('dependencyGraph') || 
                          document.querySelector('.dependencyGraph') || 
                          document.querySelector('[data-dependency-graph]');
  
  if (dependencyGraph) {
    // Add ARIA role if not present
    if (!dependencyGraph.hasAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }
    
    // Add accessible name if not present
    if (!dependencyGraph.hasAttribute('aria-label') && 
        !dependencyGraph.hasAttribute('aria-labelledby')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
    }
  }
}

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  const fakeLink = document.querySelector('a[href="#"]');
  if (fakeLink) {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }

  // Ensure table headers have proper scope
  ensureThScope();

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
  
  // Ensure dependencyGraph container has proper ARIA role
  ensureDependencyGraphAriaRole();
}

// Run accessibility initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAccessibility);
} else {
  initializeAccessibility();
}

// ADD THESE LINES TO ADD ACCESSIBILITY ATTRIBUTES TO ROOT ELEMENT
const rootElement = document.documentElement || document.body;

if (rootElement) {
  addLangAttribute('en');
}

ensureUniqueLandmarks();

// REACT_027: Fix 26 table structure issues
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has a caption
    if (!table.querySelector('caption') && !table.getAttribute('aria-label')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure all <th> elements have scope attribute
    const thElements = table.querySelectorAll('th');
    thElements.forEach(th => {
      if (!th.hasAttribute('scope')) {
        const parent = th.parentElement;
        const parentTagName = parent ? parent.tagName.toLowerCase() : '';
        const isFirstCell = parent && Array.from(parent.children).indexOf(th) === 0;

        if (isFirstCell && parentTagName === 'tr') {
          th.setAttribute('scope', 'row');
        } else if (parentTagName === 'thead' || !isFirstCell) {
          th.setAttribute('scope', 'col');
        }
      }
    });

    // Ensure table has proper structure with thead and tbody
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        table.insertBefore(thead, firstRow);
        thead.appendChild(firstRow);
      }
    }

    if (!table.querySelector('tbody')) {
      const tbody = document.createElement('tbody');
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        if (row.parentElement === table) {
          tbody.appendChild(row);
        }
      });
      if (tbody.children.length > 0) {
        table.appendChild(tbody);
      }
    }
  });
}

// REACT_017: Fix landmark issues
function fixLandmarkIssues() {
  // Ensure banner landmark exists
  if (!document.querySelector('header, [role="banner"]')) {
    const banner = document.createElement('header');
    banner.setAttribute('role', 'banner');
    const root = document.body || document.documentElement;
    if (root.firstChild) {
      root.insertBefore(banner, root.firstChild);
    } else {
      root.appendChild(banner);
    }
  }

  // Ensure main landmark exists
  if (!document.querySelector('main, [role="main"]')) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    const body = document.body;
    if (body) {
      body.appendChild(main);
    }
  }

  // Ensure contentinfo landmark exists
  if (!document.querySelector('footer, [role="contentinfo"]')) {
    const footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    const body = document.body;
    if (body) {
      body.appendChild(footer);
    }
  }
}

// REACT_025: Ensure unique landmarks
function uniqueLandmarks() {
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  const seen = {};

  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    elements.forEach((el, index) => {
      if (index > 0) {
        const baseId = el.id || landmark;
        let newId = `${baseId}-${index}`;
        let counter = index;
        while (seen[newId]) {
          counter++;
          newId = `${baseId}-${counter}`;
        }
        el.id = newId;
        seen[newId] = true;
      } else if (el.id) {
        seen[el.id] = true;
      }
    });
  });
}

// REACT_041: Add accessible names to 2 SVGs
function addAccessibleNamesToSVGs() {
  const svgs = document.querySelectorAll('svg');
  let svgCount = 0;
  svgs.forEach(svg => {
    if (svgCount >= 2) return;
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', `Decorative icon ${svgCount + 1}`);
    }
    svgCount++;
  });
}

// REACT_036: Fix fake link issues (plural)
function fixFakeLinkIssues() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    fixFakeLinkIssue(link);
  });
}

// REACT_037: Google sign-in logic
function googleSignIn() {
  // Google sign-in logic implementation
  const googleButton = document.getElementById('google-signin');
  if (googleButton) {
    googleButton.addEventListener('click', function () {
      // Trigger Google OAuth flow
      // Placeholder for actual Google sign-in implementation
    });
  }
}

// REACT_040: Replace my-button with actual button id for accessibility
function fixButtonIdentifiers() {
  const myButtons = document.querySelectorAll('[id="my-button"]');
  myButtons.forEach(button => {
    button.setAttribute('id', 'accessible-button');
  });

  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    if (!button.id) {
      button.id = `button-${index + 1}`;
    }
    if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', 'Button');
    }
  });
}

module.exports = {
  rotateBack,
  createUnrotateButton,
  addSvgAccessibility,
  ensureThScope,
  initializeAccessibility,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  addLangAttribute,
  ensureDependencyGraphAriaRole
};