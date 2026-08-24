import accessibilityModule from 'accessibility-module';

// Add Lang attribute to HTML element
function addLangAttribute() {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', getLangAttribute());
  }
}

// Fix table structure issues
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

// Check if a TH element has a valid scope attribute
function hasValidTHScope(th) {
  const scope = th.getAttribute('scope');
  return scope === 'row' || scope === 'col' || scope === 'rowgroup' || scope === 'colgroup';
}

// Fix table structure issues by checking TH cell scopes
function checkTableStructure() {
  const tables = document.querySelectorAll('table');
  let hasIssues = false;
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!hasValidTHScope(th)) {
        hasIssues = true;
      }
    });
  });
  return !hasIssues;
}

// Add/fix 4 landmark issues
function validateLandmark() {
  const landmarks = document.querySelectorAll('nav, footer, aside, main');
  for (let i = 0; i < landmarks.length; i++) {
    if (!landmarks[i].getAttribute('role')) {
      landmarks[i].setAttribute('role', 'landmark');
    }
  }
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('nav, footer, aside, main');
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

// Add proper landmark regions
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

// Fix 1 fake link issue
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a:not([href])');
  fakeLinks.forEach(link => {
    if (link.href === '#' || !link.href) {
      // Replace the link with a button for in-page actions
      const button = document.createElement('button');
      button.textContent = link.textContent;
      button.setAttribute('type', 'button');

      // Copy all attributes except href
      Array.from(link.attributes).forEach(attr => {
        if (attr.name !== 'href') {
          button.setAttribute(attr.name, attr.value);
        }
      });

      // Preserve ARIA attributes for accessibility
      if (link.hasAttribute('aria-label')) {
        button.setAttribute('aria-label', link.getAttribute('aria-label'));
      }
      if (link.hasAttribute('aria-labelledby')) {
        button.setAttribute('aria-labelledby', link.getAttribute('aria-labelledby'));
      }

      // Replace the link with the button in the DOM
      link.parentNode.replaceChild(button, link);
    }
  });
}

// Add accessible names to SVG elements
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const title = svg.querySelector('title');
    const ariaLabel = svg.getAttribute('aria-label');
    const textContent = svg.textContent.trim();
    if (!title && !ariaLabel && textContent) {
      const titleElement = document.createElement('title');
      titleElement.textContent = textContent;
      svg.prepend(titleElement);
    }
  });
}

// Wrap primary content in main element for accessibility
function wrapPrimaryContentInMain() {
  // Check if a main element already exists
  let mainElement = document.querySelector('main');

  if (mainElement) {
    return mainElement;
  }

  // Find body content excluding common landmark elements
  const body = document.body;
  const excludedTags = ['header', 'nav', 'footer', 'aside', 'script', 'style', 'link', 'meta'];
  const mainContent = [];

  // Get all direct children of body
  Array.from(body.children).forEach(child => {
    if (!excludedTags.includes(child.tagName.toLowerCase())) {
      mainContent.push(child);
    }
  });

  // If no content to wrap, return null
  if (mainContent.length === 0) {
    return null;
  }

  // Create main element
  mainElement = document.createElement('main');
  mainElement.setAttribute('id', 'main-content');

  // Move content into main element (insert in reverse order to maintain position)
  while (mainContent.length > 0) {
    const child = mainContent.pop();
    mainElement.appendChild(child);
  }

  // Insert main element after header if one exists
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

module.exports = {
  addLangAttribute,
  fixTableStructure,
  hasValidTHScope,
  checkTableStructure,
  validateLandmark,
  ensureUniqueLandmarks,
  addLandmarkRegions,
  fixFakeLinkIssue,
  addSvgAccessibleNames,
  wrapPrimaryContentInMain
};