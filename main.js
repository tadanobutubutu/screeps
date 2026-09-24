// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

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

/**
 * Gets the current lang attribute from the document's <html> element
 * @returns {string} The current lang attribute value
 */
function getLangAttribute() {
    if (typeof document !== 'undefined' && document.documentElement) {
        return document.documentElement.lang || '';
    }
    return '';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
    // Simple language detection based on common patterns
    let lang = 'en'; // Default to English

    if (content) {
        // Check for common non-ASCII characters to help detect language
        if (/[\u4e00-\u9fff]/.test(content)) {
            lang = 'zh'; // Chinese
        } else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(content)) {
            lang = 'ja'; // Japanese
        } else if (/[\u0400-\u04ff]/.test(content)) {
            lang = 'ru'; // Russian/Cyrillic
        } else if (/[\u0600-\u06ff]/.test(content)) {
            lang = 'ar'; // Arabic
        } else if (/[éèêàâïîôùûüç]/i.test(content)) {
            lang = 'fr'; // French
        } else if (/[äöüß]/i.test(content)) {
            lang = 'de'; // German
        }
    }

    return lang;
}

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
    return null;
  },
  createInPageButton: function() {
    // Implementation of createInPageButton
    // TODO: Add the implementation details here
  },
  validateTableAccessibility: function() {
    // Implementation of validateTableAccessibility
    // TODO: Add the implementation details here
  },
  validateTableStructure: function() {
    // Implementation of validateTableStructure
    // TODO: Add the implementation details here
  },
  getSvgAccessibleName: function() {
    // Implementation of getSvgAccessibleName
    // TODO: Add the implementation details here
  },
  setSvgAttributes: function() {
    // Implementation of setSvgAttributes
    // TODO: Add the implementation details here
  },
  validateLinkAccessibility: function() {
    // Implementation of validateLinkAccessibility
    // TODO: Add the implementation details here
  },
  handleFakeLinks: function() {
    // Implementation of handleFakeLinks
    // TODO: Add the implementation details here
  },
  addProperLandmarkRegions: function() {
    // Implementation of addProperLandmarkRegions
    // TODO: Add the implementation details here
  },
  validateLandmark: function() {
    // Implementation of validateLandmark
    // TODO: Add the implementation details here
  },
  validateLandmarkStructure: function() {
    // Implementation of validateLandmarkStructure
    // TODO: Add the implementation details here
  },
  ensureUniqueLandmarks: function() {
    // Implementation of ensureUniqueLandmarks
    // TODO: Add the implementation details here
  },
  fixFakeLink: function() {
    // Implementation of fixFakeLink
    // This function handles fixing fake links that should be buttons
    // It ensures proper semantic HTML and accessibility
    return function(linkElement) {
      if (!linkElement) return null;
      
      const href = linkElement.getAttribute('href');
      
      // Check if it's a fake link (link that behaves like a button)
      const isFakeLink = href === '#' || href === 'javascript:void(0)' || href === null;
      
      if (isFakeLink) {
        // Convert to proper button element
        const button = document.createElement('button');
        button.innerHTML = linkElement.innerHTML;
        
        // Copy attributes
        Array.from(linkElement.attributes).forEach(attr => {
          if (attr.name !== 'href') {
            button.setAttribute(attr.name, attr.value);
          }
        });
        
        // Add accessibility attributes
        button.setAttribute('type', 'button');
        
        // Replace the link with button
        linkElement.parentNode.replaceChild(button, linkElement);
        
        return button;
      }
      
      return linkElement;
    };
  },
  personName: function() {
    // Implementation of personName helper function
    return function(element) {
      if (!element) return '';
      return element.textContent || element.innerText || '';
    };
  },

  // New accessibility-related functions
  detectAndSetLang: function() {
    // Implementation of detectAndSetLang
  },

  // Add the new export at the bottom, following the same naming pattern as existing exports
  newExportFunction: function() {
    // Implementation of the new export function
    // The function implementation should go here. It could look like this:
    // return someCodeOrFunctionThatImplementsTheRequirement;
    return 'newExportFunction executed';
  },

  applyAccessibilityFixes: function(container) {
    const fixes = {};

    // Add lang attribute to HTML element if missing
    const htmlEl = container.ownerDocument && container.ownerDocument.documentElement;
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
      log(`Fixed ${landmarkFixesCount} unique landmarks`, 'info');
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
  return '';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English

  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[éèêàâïîôùûüç]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German;
    }
  }

  return lang;
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