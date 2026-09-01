const main = require('./utilities');

const {
    createInPageButton,
    createWebResourceButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    getLangAttribute,
    validateAccessibilityReport,
    exportUtils,
    addressAccessibilityIssues,
    handleCredentialResponse,
    ensureElementHasId,
    ensureElementHasIdOrigin,
    addAriaLabel,
    renderDependencyGraphs,
    fixButtonIdentifiers,
    fixDependencyGraphAria,
    addMainLandmarkToIndex,
    focusTrap,
    checkAccessibility,
} = main;

// Implement the function for addressing accessibility issues from insight report
function addressAccessibilityIssues(container, insightReport) {
    const fixes = {
        langAdded: false,
        mainLandmarkAdded: false,
        landmarksFixed: 0,
        svgNamesAdded: 0,
        fakeLinksFixed: 0,
    };

    if (!containerReport || !containerReport.issues) {
        // If no report, perform basic accessibility checks
        const issues = checkAccessibility(container);
        if (issues.length === 0) {
            return fixes;
    }

    // Add lang attribute to HTML element if missing
    const htmlEl =
        document.querySelector('html') ||
        (container.ownerDocument && container.ownerDocument.documentElement);
    if (htmlEl && !htmlEl.lang) {
        htmlEl.setAttribute('lang', 'en');
        fixes.langAdded = true;
    }

    // Add main landmark if missing
    const body = container.querySelector('body');
    const mainElement = container.querySelector('main');
    if (!mainElement) {
        const newMain = document.createElement('main');
        newMain.setAttribute('id', 'main-content');
        newMain.setAttribute('role', 'main');
        while (body.firstChild) {
            newMain.appendChild(body.firstChild);
        }
        body.insertBefore(newMain, body.firstChild);
        fixes.mainLandmarkAdded = true;
    }

    // Update the existing function using the new functions for rendering graph/index
    renderDependencyGraphs(container);
    // Add main landmark to index
    addMainLandmarkToIndex(container);

    // Fix landmark issues
    validateLandmark(container);
    validateLandmarkStructure(container);

    // Fix table accessibility
    const tables = container.querySelectorAll('table');
    tables.forEach(table => {
        validateTableAccessibility(table);
        validateTableStructure(table);
        fixes.tablesFixed++;

        // Check and fix headers
        const headers = table.querySelectorAll('th');
        headers.forEach(header => {
            if (!header.hasAttribute('scope') && header.closest('thead') === null) {
                const row = header.closest('tr');
                if (row) {
                    const cellsInRow = row.querySelectorAll('th, td');
                    if (cellsInRow.length > 0 && cellsInRow[0] === header) {
                        header.setAttribute('scope', 'row');
                    }
        });
    });

    // Fix SVG accessible names
    const svgElements = container.querySelectorAll('svg');
    svgElements.forEach((svg) => {
        const accessibleName = getSvgAccessibleName(svg);
        if (accessibleName && svg.getAttribute('role') !== 'img' && !svg.closest('a')) {
            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-label', accessibleName);
            fixes.svgNamesAdded++;
        }
    });

    // Fix fake link issues (elements that look like links but are missing href)
    const fakeLinks = container.querySelectorAll(
        '[role="link"], [onclick*="location"], [onclick*="href"]'
    );
    fakeLinks.forEach((link) => {
        link.setAttribute('href', '#' + (link.id || Math.random().toString(36).substr(2, 9)));
        link.setAttribute('role', 'link');
        fixes.fakeLinksFixed++;
    });

    // Validate accessibility report
    const report = validateAccessibilityReport(container);
    if (report && report.length > 0) {
        log(`Accessibility report contains ${report.length} remaining issues`, 'warn');
    }

    // Implement focus trap for keyboard navigation
    focusTrap(container);

    if (fixes.langAdded) {
        log('Lang attribute added to HTML element', 'info');
    }

    if (fixes.mainLandmarkAdded) {
        log('Main landmark added', 'info');
    }

    // Check for new accessibility issues
    const newAccessibilityIssues = checkAccessibility(container);
    if (newAccessibilityIssues.length > 0) {
        log(
            `New accessibility issues found: ${newAccessibilityIssues.map((i) => i.message).join(', ')}`,
            'error'
        );
    }

    const landmarkFixesCount = fixes.landmarksFixed || 0;
    if (landmarkFixesCount > 0) {
        log(`Fixed accessibility for ${landmarkFixesCount} unique landmarks`, 'info');
    }

    const svgFixes = fixes.svgNamesAdded || 0;
    if (svgFixes > 0) {
        log(`Fixed accessible names for ${svgFixes} SVGs`, 'info');
    }

    const fakeLinkFixes = fixes.fakeLinksFixed || 0;
    if (fakeLinkFixes > 0) {
        log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info');
    }

    return fixes;
}

// Accessibility-related function to be added
function checkAccessibility(content) {
    // Placeholder for accessibility checking logic
    // This function should be implemented to check for accessibility issues
    // For now, it just returns an empty array
    return [];
}

function createInPageButton(parent = document.body) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Open modal');
  parent.appendChild(btn);
  return btn;
}

function validateTableAccessibility(table) {
  if (!table || typeof table !== 'object') return true;
  return true;
}

function validateTableStructure(table) {
  if (!table || typeof table !== 'object') return true;
  return true;
}

function validateLandmark(element) {
  if (!element || typeof element !== 'object') return true;
  return true;
}

function validateLandmarkStructure(element) {
  if (!element || typeof element !== 'object') return true;
  return true;
}

function getSvgAccessibleName(svg) {
  if (!svg || typeof svg !== 'object') return '';
  return svg.getAttribute('aria-label') || svg.getAttribute('title') || '';
}

function addKeyboardNavigation(element, { nextSelector, prevSelector }) {
  if (!element) return;

  element.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && nextSelector) {
      const next = document.querySelector(nextSelector);
      next?.focus();
    } else if (e.key === 'ArrowLeft' && prevSelector) {
      const prev = document.querySelector(prevSelector);
      prev?.focus();
    }
  });
}

function addAriaLabel(element, label) {
  if (element && label) {
    element.setAttribute('aria-label', label);
  }
}

function announceToScreenReader(message) {
  if (!message) return;

  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);

  // Remove after announcement is complete
  setTimeout(() => {
    announcement.remove();
  }, 1000);
}

function trapFocus(modal) {
  if (!modal) return;

  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });

  // Focus the first element when modal opens
  firstFocusable?.focus();
}

module.exports = {
  newFunction,
  implementAccessibilityFixesFromReport,
  checkAccessibility,
  detectAndSetLang,
  createInPageButton,
  createWebResourceButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  handleCredentialResponse,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  addKeyboardNavigation,
  announceToScreenReader,
  trapFocus
};