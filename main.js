const {
  getLangAttribute,
  getFullLangAttribute,
  createInPageButton,
  createAccessibleLink,
} = require('./accessibilityHelperFunctions');

const a11yStore = {
  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
    this.addSVGAccessibilityProps();
    this.fixFakeLinks();
    this.initAccessibility();
  },

  createAccessibleButton(id, label, onClick) {
    const button = document.createElement('button');
    button.id = id;
    button.setAttribute('aria-label', label);
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  },

  createAccessibleDialog(id, title, content, closeLabel = 'Close') {
    const dialog = document.createElement('div');
    dialog.id = id;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', `${id}-title`);
    dialog.setAttribute('aria-modal', 'true');

    const titleEl = document.createElement('h2');
    titleEl.id = `${id}-title`;
    titleEl.textContent = title;

    const closeButton = this.createAccessibleButton(`${id}-close`, closeLabel, () => {
      dialog.hidden = true;
      dialog.setAttribute('aria-hidden', 'true');
    });

    dialog.appendChild(titleEl);
    dialog.appendChild(closeButton);
    dialog.appendChild(content);

    return dialog;
  },

  announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  },

  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', (e) => {
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

  initAccessibility() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.tabIndex = -1;
          target.focus();
          this.announce('Skipped to main content');
        }
      });
    }

    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('alt')) {
        img.setAttribute('alt', '');
        img.setAttribute('role', 'presentation');
      }
    });

    document.querySelectorAll('input, select, textarea').forEach((input) => {
      if (!input.id && input.name) {
        input.id = input.name;
      }
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (!label && input.type !== 'hidden') {
        input.setAttribute('aria-label', input.name || 'Form input');
      }
    });
  },

  createLiveRegion() {
    if (this.liveRegion) return;

    const region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.id = 'a11y-live-region';
    document.body.appendChild(region);
    this.liveRegion = region;
  },

  announce(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  makeAccessible(element) {
    // Apply basic accessibility improvements to the given element
    if (element.matches('button')) {
      element.setAttribute('role', 'button');
    }
    if (element.matches('dialog')) {
      element.setAttribute('role', 'dialog');
    }
    // Ensure a descriptive label if missing
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      element.setAttribute('aria-label', 'Main content area');
    }
  },

  newNecessaryFunction() {
    // Placeholder for newly required accessibility functionality
    console.log('New necessary function executed');
  },

  handleAccessibilityIssues() {
    // Process each issue from the insight report
    if (!report) return;
    report.forEach(issue => {
      addressAccessibilityIssue038(issue);
    });
  },

  addressAccessibilityIssue038() {
    // Existing code for addressing accessibility issue 038
  },

  renderDependencyGraph() {
    // Existing code for rendering dependency graph
  },
};

function getSvgAccessibleName(svgElement) {
  const title = svgElement.querySelector('title');
  const desc = svgElement.querySelector('desc');

  if (title && title.textContent) {
    return title.textContent.trim();
  }

  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }

  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel.trim();
  }

  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labeledElement = document.getElementById(ariaLabelledby);
    if (labeledElement && labeledElement.textContent) {
      return labeledElement.textContent.trim();
    }
  }

  return 'SVG graphic';
}

function addressAccessibilityIssues(report) {
  if (!report) return;
  report.forEach(issue => {
    addressAccessibilityIssue038(issue);
  });
}

const mainElement = document.createElement('main');
mainElement.setAttribute('lang', document.documentElement.lang);

// Assuming the HTML content is included in a component or similar file that is imported into main.js
// ...

export {
  a11yStore,
  handleAccessibilityIssues,
  getSvgAccessibleName,
  newNecessaryFunction,
  createAccessibleButton,
  createAccessibleDialog,
  announceToScreenReader,
  trapFocus,
  initAccessibility,
  updateLiveRegion,
  checkLandmarkElements,
  addSVGAccessibilityProps,
  addressAccessibilityIssue038,
  renderDependencyGraph,
};
export default a11yStore;