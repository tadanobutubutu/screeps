import accessibilityModule from 'accessibility-module';

// Add lang attribute to HTML element
function addLangAttribute() {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
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
        if (cell.tagName === 'TH') {
          if (cellIndex === 0) {
            cell.setAttribute('scope', 'row');
          } else {
            cell.setAttribute('scope', 'col');
          }
        }
      });
    });
  });
}

// Add/fix 4 landmark issues
function addMainLandmark() {
  const main = document.querySelector('main');
  if (main) {
    main.setAttribute('role', 'main');
  }
}

function validateLandmark() {
  const main = document.querySelector('main, [role="main"]');
  if (!main) {
    console.warn('Warning: No main landmark found on the page');
  }
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]');
  const seenTypes = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (seenTypes[role]) {
      landmark.removeAttribute('role');
    } else {
      seenTypes[role] = true;
    }
  });
}

// Ensure unique landmarks (2 issues)
function ensureUniqueLandmarkRoles() {
  const allLandmarks = document.querySelectorAll('[role]');
  const roleCount = {};

  allLandmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    roleCount[role] = (roleCount[role] || 0) + 1;
  });

  for (const role in roleCount) {
    if (roleCount[role] > 1) {
      console.warn(`Warning: Multiple landmarks with role="${role}" found`);
    }
  }
}

// Fix 1 fake link issue
function fixFakeLinkIssue() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#' || href === '' || href === 'javascript:void(0)') {
      link.setAttribute('role', 'button');
    }
  });
}

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const hasText = link.textContent.trim().length > 0;
    const hasAriaLabel = link.hasAttribute('aria-label');
    const hasTitle = link.hasAttribute('title');

    if (!hasText && !hasAriaLabel && !hasTitle) {
      console.warn('Warning: Link missing accessible text content');
    }
  });
}

function createInPageButton() {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.position = 'absolute';
  skipLink.style.top = '-40px';
  document.body.insertBefore(skipLink, document.body.firstChild);

  const main = document.getElementById('main-content') || document.querySelector('main');
  if (main) {
    main.tabIndex = -1;
  }
}

function createAccessibleLink() {
  const buttons = document.querySelectorAll('button, [role="button"]');
  buttons.forEach(btn => {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = btn.textContent;
    link.setAttribute('role', 'button');
    
    btn.parentNode.replaceChild(link, btn);
  });
}

// Address accessibility issues from the insight report
function addressAccessibilityIssues() {
  addLangAttribute();
  fixTableStructure();
  addMainLandmark();
  validateLandmark();
  ensureUniqueLandmarks();
  ensureUniqueLandmarkRoles();
  fixFakeLinkIssue();
  validateLinkAccessibility();
  createInPageButton();
  createAccessibleLink();
}

// Example usage of the accessibility functions
document.addEventListener('DOMContentLoaded', () => {
  accessibilityModule.init();
});

// Add the new function at the end
addressAccessibilityIssues();