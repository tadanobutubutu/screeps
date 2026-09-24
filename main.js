const main = require('./utilities');
const {
    createInPageButton,
    createWebResourceButton,
    validateLandmark,
    validateLandmarkStructure,
    validateAccessibilityReport,
    validateTableStructure,
    getSvgAccessibleName,
    getLangAttribute,
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
    functionA,
    functionB
} = require('./utilities');

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// _Commit: b8888a21083c89f599fb68eef1dc4d5df1051e52_
// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->
// _Commit: c2d57306a2943dfa0dba6093d0517acd3e5672ca_
// <!-- todo-hash: f863d4968b6ba99c88ed9bf7a41317f7f788cc95 -->

// Implement the function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport(container, report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  if (!report || !report.issues) {
    return fixes;
  }

  // Fix lang attribute on HTML element
  if (report.issues.missingLang) {
    const htmlElement = container.querySelector('html') || container.ownerDocument?.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
      fixes.langAdded = true;
    }
  }

  // Add main landmark if missing
  if (report.issues.missingMainLandmark) {
    const mainElements = container.querySelectorAll('main, [role="main"]');
    if (mainElements.length === 0) {
      // Try to convert the first section to main
      const firstSection = container.querySelector('section');
      if (firstSection) {
        // Create a new main element and move content into it
        const mainElement = container.ownerDocument.createElement('main');
        while (firstSection.firstChild) {
          mainElement.appendChild(firstSection.firstChild);
        }
        firstSection.parentNode.insertBefore(mainElement, firstSection);
        firstSection.remove();
        fixes.mainLandmarkAdded = true;
      }
    }
  }

  // Fix landmarks by ensuring proper roles and accessible names
  if (report.issues.landmarkIssues && Array.isArray(report.issues.landmarkIssues)) {
    const uniqueLandmarksFixed = new Set();

    report.issues.landmarkIssues.forEach(issue => {
      if (issue.selector && !uniqueLandmarksFixed.has(issue.selector)) {
        const element = container.querySelector(issue.selector);
        if (element) {
          // Add accessible name if missing
          if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
            const role = element.getAttribute('role') || element.tagName.toLowerCase();

            // Try to get label from surrounding context
            const previousSibling = element.previousElementSibling;
            if (previousSibling && previousSibling.textContent.trim()) {
              const labelId = `landmark-label-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              const labelSpan = container.ownerDocument.createElement('span');
              labelSpan.id = labelId;
              labelSpan.textContent = previousSibling.textContent.trim();
              labelSpan.style.display = 'none';
              element.parentNode.insertBefore(labelSpan, element);
              element.setAttribute('aria-labelledby', labelId);
            } else {
              // Use role as fallback label
              const roleLabel = role.charAt(0).toUpperCase() + role.slice(1).replace(/[^a-zA-Z]/g, ' ');
              element.setAttribute('aria-label', roleLabel);
            }
            uniqueLandmarksFixed.add(issue.selector);
            fixes.landmarksFixed++;
          }
        }
      }
    });
  }

  // Add accessible names to SVGs
  if (report.issues.svgIssues && Array.isArray(report.issues.svgIssues)) {
    report.issues.svgIssues.forEach(issue => {
      const svg = container.querySelector(issue.selector);
      if (svg && svg.tagName.toLowerCase() === 'svg') {
        // Check if SVG already has an accessible name
        if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
          // Look for a title element within the SVG
          let titleElement = svg.querySelector('title');

          if (!titleElement) {
            // Create a title element
            titleElement = container.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'title');
            const titleId = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            titleElement.id = titleId;
            titleElement.textContent = issue.suggestedName || 'Decorative SVG';

            // Insert title as first child of SVG
            if (svg.firstChild) {
              svg.insertBefore(titleElement, svg.firstChild);
            } else {
              svg.appendChild(titleElement);
            }

            svg.setAttribute('aria-labelledby', titleId);
            fixes.svgNamesAdded++;
          }
        }
      }
    });
  }

  // Fix fake links (elements that look like links but aren't)
  if (report.issues.fakeLinkIssues && Array.isArray(report.issues.fakeLinkIssues)) {
    const uniqueFakeLinksFixed = new Set();

    report.issues.fakeLinkIssues.forEach(issue => {
      if (issue.selector && !uniqueFakeLinksFixed.has(issue.selector)) {
        const element = container.querySelector(issue.selector);
        if (element) {
          // Check if this element should be a link or a button
          const isNavigation = element.closest('nav') !== null;

          if (isNavigation || element.tagName.toLowerCase() === 'a') {
            // Convert to proper link with href
            if (!element.hasAttribute('href')) {
              element.setAttribute('href', '#' + (element.id || `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`));
              element.setAttribute('role', 'link');
              uniqueFakeLinksFixed.add(issue.selector);
              fixes.fakeLinksFixed++;
            }
          } else {
            // Convert to button
            element.setAttribute('role', 'button');
            if (!element.hasAttribute('tabindex')) {
              element.setAttribute('tabindex', '0');
            }
            uniqueFakeLinksFixed.add(issue.selector);
            fixes.fakeLinksFixed++;
          }
        }
      }
    });
  }

  return fixes;
}

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

// Function to validate table accessibility (merged from both versions)
const validateTableAccessibility = (html) => {
    const issues = [];

    // Check if HTML contains tables
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    let match;

    while ((match = tableRegex.exec(html)) !== null) {
        const tableContent = match[0];
        const tableNumber = (html.slice(0, match.index).match(/<table/gi) || []).length + 1;

        // Check for caption
        const hasCaption = /<caption[^>]*>[\s\S]*?<\/caption>/i.test(tableContent);
        if (!hasCaption) {
            issues.push({
                type: 'table',
                severity: 'warning',
                message: `Table ${tableNumber} is missing a <caption> element for accessibility`,
                suggestion:
                    'Add a <caption> element immediately after the <table> tag to describe the purpose of the table',
            });
        }

        // Check for th elements
        const hasHeaders = /<th[^>]*>/i.test(tableContent);
        if (!hasHeaders) {
            issues.push({
                type: 'table',
                severity: 'warning',
                message: `Table ${tableNumber} appears to be a data table but has no <th> (table header) elements`,
                suggestion:
                    'Add <th> elements for column or row headers to improve accessibility for screen readers',
            });
        }

        // Check for scope attributes on th elements
        const thMatches = tableContent.match(/<th[^>]*>/gi) || [];
        thMatches.forEach((thTag, index) => {
            if (!/scope=["'](row|col|rowgroup|colgroup)["']/i.test(thTag)) {
                issues.push({
                    type: 'table',
                    severity: 'info',
                    message: `Table ${tableNumber} header ${index + 1} is missing a 'scope' attribute`,
                    suggestion:
                        'Add scope="col", scope="row", scope="rowgroup", or scope="colgroup" to <th> elements',
                });
            }
        });

        // Check for thead and tbody structure
        const hasThead = /<thead[^>]*>[\s\S]*?<\/thead>/i.test(tableContent);
        const hasTbody = /<tbody[^>]*>[\s\S]*?<\/tbody>/i.test(tableContent);

        if (!hasThead) {
            issues.push({
                type: 'table',
                severity: 'info',
                message: `Table ${tableNumber} is missing <thead> element`,
                suggestion: 'Wrap header rows in a <thead> element for better semantic structure',
            });
        }

        if (!hasTbody) {
            issues.push({
                type: 'table',
                severity: 'info',
                message: `Table ${tableNumber} is missing <tbody> element`,
                suggestion: 'Wrap data rows in a <tbody> element for better semantic structure',
            });
        }

        // Check for id and headers attributes for complex tables (merged from both versions)
        const hasMultipleHeaders = (tableContent.match(/<th/gi) || []).length > 1;
        if (hasMultipleHeaders) {
            const hasHeadersAttr = /headers=["'][^"']+["']/.test(tableContent);
            const hasIdAttr = /id=["'][^"']+["']/.test(tableContent.replace(/<th/gi, '<td'));

            if (!hasIdAttr && !hasHeadersAttr) {
                issues.push({
                    type: 'table',
                    severity: 'warning',
                    message: `Table ${tableNumber} has multiple headers but may not have proper id/headers associations`,
                    suggestion:
                        'For complex tables, ensure header cells have unique id attributes and data cells have headers attributes referencing those ids',
                });
            }
        }
    }

    return issues;
};

// Implement the function for addressing accessibility issues from insight report (merged from both versions)
function implementAccessibilityFixesFromReport(container, report) {
    const fixes = {
        langAdded: false,
        mainLandmarkAdded: false,
        landmarksFixed: 0,
        svgNamesAdded: 0,
        fakeLinksFixed: 0,
    };

    if (!report || !report.issues) {
        return fixes;
    }

    // Combine languages
    const existingLangAttribute = container.querySelector('html')?.getAttribute('lang');
    const newLangAttribute = report.issues.missingLang?.[0]?.lang || 'en';
    if (existingLangAttribute !== newLangAttribute) {
        container.querySelector('html')?.setAttribute('lang', newLangAttribute);
        fixes.langAdded = true;
    }

    // Add main landmark if missing
    if (!container.querySelector('main')) {
        const firstSection = container.querySelector('section');
        if (firstSection) {
            const mainElement = container.ownerDocument.createElement('main');
            while (firstSection.firstChild) {
                mainElement.appendChild(firstSection.firstChild);
            }
            firstSection.parentNode.insertBefore(mainElement, firstSection);
            firstSection.remove();
            fixes.mainLandmarkAdded = true;
        }
    }

    // Fix landmarks by ensuring proper roles and accessible names (merged from both versions)
    if (
        report.issues.landmarkIssues &&
        Array.isArray(report.issues.landmarkIssues)
    ) {
        report.issues.landmarkIssues.forEach((issue) => {
            const element = container.querySelector(issue.selector);
            if (element) {
                // Add accessible name if missing
                if (
                    !element.getAttribute('aria-label') &&
                    !element.getAttribute('aria-labelledby')
                ) {
                    // Try to get label from surrounding context
                    const previousSibling = element.previousElementSibling;
                    if (previousSibling && previousSibling.textContent.trim()) {
                        const labelId = `landmark-label-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                        const labelSpan = container.ownerDocument.createElement('span');
                        labelSpan.id = labelId;
                        labelSpan.textContent = previousSibling.textContent.trim();
                        labelSpan.style.display = 'none';
                        element.parentNode.insertBefore(labelSpan, element);
                        element.setAttribute('aria-labelledby', labelId);
                    } else {
                        // Use role as fallback label
                        const role = element.getAttribute('role') || element.tagName.toLowerCase();
                        element.setAttribute('aria-label', role);
                    }
                    fixes.landmarksFixed++;
                }
            }
        });
    }

    // Fix SVG accessible names (merged from both versions)
    if (report.issues.svgIssues && Array.isArray(report.issues.svgIssues)) {
        report.issues.svgIssues.forEach((issue) => {
            const svg = container.querySelector(issue.selector);
            if (svg && svg.tagName.toLowerCase() === 'svg') {
                svg.setAttribute('aria-label', issue.suggestedName || 'Decorative SVG');
                fixes.svgNamesAdded++;
            }
        });
    }

    // Fix fake links (elements that look like links but aren't) (merged from both versions)
    if (report.issues.fakeLinkIssues && Array.isArray(report.issues.fakeLinkIssues)) {
        report.issues.fakeLinkIssues.forEach((issue) => {
            const element = container.querySelector(issue.selector);
            if (element) {
                // Check if this element should be a link or a button
                const isNavigation = element.closest('nav') !== null;

                if (isNavigation || element.tagName.toLowerCase() === 'a') {
                    // Convert to proper link with href
                    if (!element.hasAttribute('href')) {
                        element.setAttribute(
                            'href',
                            '#' +
                                (element.id ||
                                    `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
                        );
                        element.setAttribute('role', 'link');
                        fixes.fakeLinksFixed++;
                    }
                } else {
                    // Convert to button
                    element.setAttribute('role', 'button');
                    if (!element.hasAttribute('tabindex')) {
                        element.setAttribute('tabindex', '0');
                    }
                    fixes.fakeLinksFixed++;
                }
            }
        });
    }

    return fixes;
}

function personName(name) {
  if (typeof name !== 'string') {
    return '';
  }
  return name.trim();
}

// Export all functions to make them available as module exports
export {
  implementAccessibilityFixesFromReport,
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  validateTableAccessibility,
  a11yStore,
  getSvgAccessibleName,
  getActiveSessionsCount,
  validateSession,
  handleCredentialResponse,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  createInPageButton,
  createWebResourceButton,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  setSvgAccessibilityProps,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  addressAccessibilityIssues,
  implementAccessibilityFixesFromReport,
  http,
  url
};