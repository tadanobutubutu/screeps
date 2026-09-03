const fs = require('fs');
const main = require('./utilities');

const {
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  announceToScreenReader: originalAnnounceToScreenReader,
  handleKeyboardNav,
  exportUtils,
  transformInputData,
  addressAccessibilityIssues,
  handleCredentialResponse,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  initSkipLink,
  trapFocus,
  ensureElementHasId,
  newFocusTrap,
} = main;

const accessibilityUtils = {
  initSkipLink: () => {
    const skipLink = document.querySelector('a[href^="#"]');
    if (skipLink) {
      const targetId = skipLink.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    }
  },

  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  },

  announceToScreenReader: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  },

  ensureElementId: (element) => {
    if (element && !element.id) {
      element.id = 'element-' + Math.random().toString(36).substr(2, 9);
    }
    return element;
  },

  addAriaLabel: (element) => {
    if (element && !element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', 'Accessible element');
    }
  },

  addressAccessibilityIssues: (report) => {
    if (!report || !report.issues || !Array.isArray(report.issues)) {
      return { addressed: 0, failed: 0 };
    }
    
    let addressed = 0;
    let failed = 0;

    report.issues.forEach((issue) => {
      try {
        const { element, type, solution } = issue;

        if (!element) {
          failed++;
          return;
        }

        if (typeof solution === 'function') {
          solution(element);
          addressed++;
        } else if (type) {
          switch (type) {
            case 'missing-label':
              if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
                const label = document.createElement('label');
                label.setAttribute('for', element.id || '');
                label.textContent = issue.labelText || 'Label';
                element.setAttribute('aria-label', issue.labelText || 'Label');
                addressed++;
              }
              break;
            case 'missing-alt':
              if (element.tagName === 'IMG' && !element.alt) {
                element.alt = issue.altText || '';
                addressed++;
              }
              break;
            case 'missing-role':
              if (!element.getAttribute('role')) {
                element.setAttribute('role', issue.role || 'presentation');
                addressed++;
              }
              break;
            case 'missing-aria-describedby':
              if (!element.getAttribute('aria-describedby')) {
                element.setAttribute('aria-describedby', issue.describedById || '');
                addressed++;
              }
              break;
            case 'invalid-aria':
              if (element.getAttribute('aria-hidden') === 'true' && element.tagName === 'BUTTON') {
                element.setAttribute('aria-hidden', 'false');
                addressed++;
              }
              break;
            case 'tabindex-issue':
              if (element.getAttribute('tabindex') === '0' && element.tagName === 'DIV') {
                element.setAttribute('tabindex', '-1');
                addressed++;
              }
              break;
            case 'missing-lang':
              if (element.tagName === 'HTML' && !element.getAttribute('lang')) {
                element.setAttribute('lang', issue.lang || 'en');
                addressed++;
              }
              break;
            default:
              if (typeof solution === 'string') {
                element.setAttribute(solution.split('=')[0], solution.split('=')[1]);
                addressed++;
              }
          }
        }
      } catch (err) {
        failed++;
      }
    });

    return { addressed, failed };
  },

  renderDependencyGraphs: () => {
    // Render dependency graphs in the UI
  },

  fixButtonIdentifiers: () => {
    // Fix button identifier issues
  },

  fixDependencyGraphAria: () => {
    // Fix ARIA issues in dependency graphs
  },

  addSvgAccessibleName: (svgElement) => {
    if (svgElement && svgElement.tagName === 'svg') {
      const title = document.createElement('title');
      title.id = 'svg-title-' + Math.random().toString(36).substr(2, 9);
      title.textContent = 'SVG graphic';
      svgElement.insertBefore(title, svgElement.firstChild);
      svgElement.setAttribute('aria-labelledby', title.id);
    }
  },

  initFocusTrap: () => focusTrap,
  updateFocusTrap: () => focusTrap,
  focusTrap,
};

const wrapPrimaryContentInMain = () => {
  // Check if a main element already exists
  let mainElement = document.querySelector('main');

  if (!mainElement) {
    // If no main element exists, create one
    mainElement = document.createElement('main');

    // Find the primary content container (commonly #content, .content, or the body)
    const contentSelectors = ['#content', '.content', '#main', '.main', 'article', '[role="main"]'];
    let primaryContent = null;

    for (const selector of contentSelectors) {
      primaryContent = document.querySelector(selector);
      if (primaryContent) {
        break;
      }
    }

    // If no specific content container found, use body
    if (!primaryContent) {
      primaryContent = document.body;
    }

    // Move the primary content into the main element
    if (primaryContent !== document.body) {
      mainElement.appendChild(primaryContent);
      document.body.insertBefore(mainElement, document.body.firstChild);
    } else {
      // Wrap all body children except script and style elements
      const children = Array.from(document.body.children);
      children.forEach(child => {
        if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && child.tagName !== 'LINK') {
          mainElement.appendChild(child);
        }
      });
      document.body.insertBefore(mainElement, document.body.firstChild);
    }

    // Add ARIA landmark attribute
    mainElement.setAttribute('role', 'main');

    // Add accessible label if not present
    if (!mainElement.getAttribute('aria-label') && !mainElement.getAttribute('aria-labelledby')) {
      mainElement.setAttribute('aria-label', 'Main content');
    }
  }

  return mainElement;
};

const combinedUtils = Object.assign({}, accessibilityUtils, { focusTrap: newFocusTrap });

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// Version 1 implementation (HEAD branch) - preserved accessibility enhancements

module.exports = {
  ...accessibilityUtils,
  renderDependencyGraph: main.renderDependencyGraph || (() => {}),
  renderIndex: main.renderIndex || (() => {}),
  validateTableAccessibility,
  validateTableStructure,
  addAccessibleName: accessibilityUtils.addAriaLabel,
  accessibilityUtils,
  ensureElementId,
  ensureElementHasId,
  newFocusTrap,
  wrapPrimaryContentInMain,
};