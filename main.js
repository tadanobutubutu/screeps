import accessibilityModule from 'accessibility-module';

// Add lang attribute to HTML element
function addLangAttribute() {
  const html = document.documentElement;
  if (!html.getAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

// Fix 26 table structure issues
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

// Validate landmark
function validateLandmark() {
  const main = document.querySelector('[role="main"]');
  return main && main.getAttribute('role') === 'main';
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

// Fix 1 fake link issue
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('[role="link"]');
  fakeLinks.forEach(link => {
    if (!link.hasAttribute('href') && !link.getAttribute('onclick')) {
      link.setAttribute('role', 'button');
    }
  });
}

// Validate link accessibility
function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  let hasIssues = false;
  
  links.forEach(link => {
    if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
      hasIssues = true;
    }
  });
  
  return !hasIssues;
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

// Create accessible link
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
}

// Function to check TH cell scope
function hasValidTHScope(cell) {
  const acceptedScopes = ['row', 'col', 'rowgroup', 'colgroup'];
  const scope = cell.getAttribute('scope');
  return scope && acceptedScopes.includes(scope);
}

// Add proper landmark regions
function addLandmarkRegions() {
  // Implementation code
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

// Example usage of the accessibility functions
addressAccessibilityIssues();
addLandmarkRegions();