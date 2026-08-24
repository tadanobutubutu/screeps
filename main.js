import accessibilityModule from 'accessibility-module';

// Add lang attribute to HTML element
function addLangAttribute() {
  const html = document.documentElement;
  if (!html.getAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

// Fix table structure issues
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td, th');
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
function addMainLandmark() {
  const main = document.querySelector('main') || document.createElement('main');
  main.setAttribute('role', 'main');
}

// Ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, nav, main, footer, aside');
  if (landmarks.length > 1) {
    landmarks.forEach((landmark, index) => {
      if (index > 0) {
        const tagName = landmark.tagName.toLowerCase();
        landmark.setAttribute('aria-label', `${tagName}-${index}`);
      }
    });
  }
}

// Fix unique landmarks (2 issues)
function fixUniqueLandmarks() {
  ensureUniqueLandmarks();
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
  const fakeLinks = document.querySelectorAll('[role="link"]');
  fakeLinks.forEach(link => {
    if (!link.hasAttribute('href') && !link.getAttribute('onclick')) {
      link.setAttribute('role', 'button');
    }
  });
}

// Add accessible names to SVG elements
function addAccessibleNamesToSVGs() {
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

// Update validate link accessibility function to check ARIA labels
function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  let hasIssues = false;
  links.forEach(link => {
    if (!link.textContent.trim() && !link.getAttribute('href') && !link.getAttribute('aria-label')) {
      hasIssues = true;
    }
  });
  return !hasIssues;
}

// Create accessible link function
function createAccessibleLink() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (!link.getAttribute('href')) {
      link.setAttribute('href', '#');
    }
  });
}

// Address accessibility issues from the insight report
function addressAccessibilityIssues() {
  addLangAttribute();
  fixTableStructure();
  checkTableStructure();
  addMainLandmark();
  validateLandmark();
  fixUniqueLandmarks();
  fixFakeLinkIssue();
  createInPageButton();
  createAccessibleLink();
  addAccessibleNamesToSVGs();
  addLandmarkRegions();
}

// Function to check TH cell scope
function hasValidTHScope(cell) {
  const acceptedScopes = ['row', 'col', 'rowgroup', 'colgroup'];
  const scope = cell.getAttribute('scope');
  return scope && acceptedScopes.includes(scope);
}

// Create in page button
function createInPageButton() {
  const button = document.createElement('button');
  button.textContent = 'Skip to main content';
  button.className = 'skip-link';
  button.addEventListener('click', () => {
    const main = document.querySelector('main') || document.querySelector('[role="main"]');
    if (main) {
      main.focus();
    }
  });
  document.body.insertBefore(button, document.body.firstChild);
}

// Function to validate landmarks
function validateLandmark() {
  const landmarks = document.querySelectorAll('main, header, nav, footer, aside');
  landmarks.forEach(landmark => {
    if (!landmark.getAttribute('role')) {
      landmark.setAttribute('role', 'landmark');
    }
  });
}

// Example usage of the accessibility functions
addressAccessibilityIssues();
addLandmarkRegions();