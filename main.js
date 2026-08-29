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
    if (!element) return;

    const tagName = element.tagName.toLowerCase();

    if (tagName === 'div' || tagName === 'span') {
      if (!element.hasAttribute('role')) {
        const onclick = element.getAttribute('onclick');
        const tabindex = element.getAttribute('tabindex');
        if (onclick || tabindex === '0') {
          element.setAttribute('role', 'button');
          if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
          }
        }
      }
    }

    if (tagName === 'a' && !element.hasAttribute('role') && element.getAttribute('onclick')) {
      element.setAttribute('role', 'button');
    }

    if (!element.hasAttribute('tabindex') && element.getAttribute('role') === 'button') {
      element.setAttribute('tabindex', '0');
    }

    if (!element.hasAttribute('aria-label') && element.textContent.trim()) {
      const accessibleName = element.textContent.trim();
      element.setAttribute('aria-label', accessibleName);
    }

    if (element.getAttribute('role') === 'img' && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      element.setAttribute('aria-label', 'Image');
    }

    if (tagName === 'input' && element.type === 'image' && !element.hasAttribute('alt')) {
      element.setAttribute('alt', 'Submit');
    }
  },

  newNecessaryFunction() {
    const issues = [];
    const elements = document.querySelectorAll('[aria-hidden="true"]');
    elements.forEach(el => {
      if (el.getAttribute('tabindex') === '0' || el.querySelector('a, button, input')) {
        issues.push({
          element: el,
          issue: 'Focusable element inside aria-hidden container',
          severity: 'critical'
        });
      }
    });
    return issues;
  },

  handleAccessibilityIssues() {
    const issues = [];

    document.querySelectorAll('*').forEach(element => {
      if (element.getAttribute('onclick') && !element.hasAttribute('role')) {
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'div' || tagName === 'span' || tagName === 'p') {
          this.makeAccessible(element);
          issues.push({
            element,
            issue: 'Added role="button" to clickable non-interactive element',
            severity: 'high'
          });
        }
      }

      if (element.tagName.toLowerCase() === 'img' && !element.hasAttribute('alt')) {
        element.setAttribute('alt', '');
        element.setAttribute('role', 'presentation');
        issues.push({
          element,
          issue: 'Added empty alt and presentation role to decorative image',
          severity: 'medium'
        });
      }

      if (element.tagName.toLowerCase() === 'svg' && !element.hasAttribute('role')) {
        this.addSVGAccessibilityProps();
        issues.push({
          element,
          issue: 'Added accessibility attributes to SVG element',
          severity: 'high'
        });
      }
    });

    document.querySelectorAll('a').forEach(link => {
      if (link.href === '#' || link.href === 'javascript:void(0)') {
        if (!link.hasAttribute('role')) {
          link.setAttribute('role', 'button');
          link.setAttribute('tabindex', '0');
        }
        if (!link.hasAttribute('aria-label') && link.textContent.trim()) {
          link.setAttribute('aria-label', link.textContent.trim());
        }
      }
    });

    document.querySelectorAll('[class*="icon"]').forEach(icon => {
      if (!icon.hasAttribute('aria-hidden')) {
        icon.setAttribute('aria-hidden', 'true');
        icon.setAttribute('focusable', 'false');
      }
    });

    const formElements = document.querySelectorAll('input, select, textarea');
    formElements.forEach(input => {
      if (!input.hasAttribute('id') && input.hasAttribute('name')) {
        input.id = input.name;
      }
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (!label && input.type !== 'hidden') {
        input.setAttribute('aria-label', input.getAttribute('placeholder') || input.name || 'Form input');
      }
    });

    return issues;
  },

  addressAccessibilityIssue038() {
    const colorContrastIssues = [];
    const elements = document.querySelectorAll('*');

    elements.forEach(element => {
      const style = window.getComputedStyle(element);
      const color = style.color;
      const backgroundColor = style.backgroundColor;

      if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        const colorRatio = this.calculateContrastRatio(color, backgroundColor);
        if (colorRatio < 4.5) {
          colorContrastIssues.push({
            element,
            color,
            backgroundColor,
            ratio: colorRatio,
            requiredRatio: 4.5
          });
        }
      }
    });

    return colorContrastIssues;
  },

  calculateContrastRatio(color1, color2) {
    const getLuminance = (color) => {
      const hex = color.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/, (match, r, g, b) => {
        const toHex = (x) => {
          const hex = parseInt(x).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${hex(parseInt(r))}${hex(parseInt(g))}${hex(parseInt(b))}`;
      });

      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const toLinear = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

      return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  },

  renderDependencyGraph() {
    const graphContainer = document.createElement('div');
    graphContainer.id = 'a11y-dependency-graph';
    graphContainer.setAttribute('role', 'img');
    graphContainer.setAttribute('aria-label', 'Accessibility dependency graph');

    const dependencies = {
      'a11yStore': ['createLiveRegion', 'initAccessibility', 'makeAccessible'],
      'createAccessibleButton': ['a11yStore'],
      'createAccessibleDialog': ['createAccessibleButton', 'a11yStore'],
      'handleAccessibilityIssues': ['a11yStore', 'makeAccessible'],
      'updateLiveRegion': ['createLiveRegion'],
    };

    const graphData = JSON.stringify(dependencies, null, 2);
    graphContainer.setAttribute('data-graph', graphData);

    const title = document.createElement('h2');
    title.textContent = 'Accessibility Dependency Graph';
    graphContainer.appendChild(title);

    const graphList = document.createElement('ul');
    Object.keys(dependencies).forEach(key => {
      const listItem = document.createElement('li');
      listItem.textContent = key;
      graphList.appendChild(listItem);
    });
    graphContainer.appendChild(graphList);

    return graphContainer;
  },

  setupKeyboardNavigation() {},
  setupFocusManagement() {},
  setupSkipLinks() {},
  fixFakeLinks() {},
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
    const { type, element, description } = issue;

    switch (type) {
      case 'missing-alt':
        if (element.tagName.toLowerCase() === 'img') {
          element.setAttribute('alt', description || 'Image');
        }
        break;
      case 'missing-aria-label':
        element.setAttribute('aria-label', description || 'Accessible element');
        break;
      case 'missing-role':
        element.setAttribute('role', description || 'generic');
        break;
      case 'focusable-element':
        element.setAttribute('tabindex', '0');
        break;
      case 'color-contrast':
        console.warn(`Color contrast issue: ${description}`);
        break;
      default:
        console.warn(`Unknown accessibility issue type: ${type}`);
    }
  });
}

function createAccessibleButton(id, label, onClick) {
  return a11yStore.createAccessibleButton(id, label, onClick);
}

function createAccessibleDialog(id, title, content, closeLabel = 'Close') {
  return a11yStore.createAccessibleDialog(id, title, content, closeLabel);
}

function announceToScreenReader(message, priority = 'polite') {
  return a11yStore.announceToScreenReader(message, priority);
}

function trapFocus(container) {
  return a11yStore.trapFocus(container);
}

function initAccessibility() {
  return a11yStore.initAccessibility();
}

function updateLiveRegion(message) {
  if (!a11yStore.liveRegion) a11yStore.createLiveRegion();
  a11yStore.announce(message);
}

function checkLandmarkElements() {
  const landmarks = ['header', 'main', 'nav', 'footer', 'aside'];
  const missingLandmarks = [];

  landmarks.forEach(landmark => {
    if (!document.querySelector(landmark)) {
      missingLandmarks.push({
        landmark,
        message: `Missing landmark element: <${landmark}>`
      });
    }
  });

  if (missingLandmarks.length === 0) {
    const main = document.querySelector('main');
    if (main && !main.hasAttribute('id') && !main.hasAttribute('aria-label')) {
      main.setAttribute('id', 'main-content');
    }
  }

  return missingLandmarks;
}

function addSVGAccessibilityProps() {
  document.querySelectorAll('svg').forEach(svg => {
    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
    if (!svg.hasAttribute('focusable')) {
      svg.setAttribute('focusable', 'false');
    }

    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      const accessibleName = getSvgAccessibleName(svg);
      if (accessibleName !== 'SVG graphic') {
        svg.setAttribute('aria-label', accessibleName);
      }
    }

    const title = svg.querySelector('title');
    if (title && !svg.hasAttribute('aria-labelledby')) {
      if (!title.id) {
        title.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
      }
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
}

function makeAccessible(element) {
  return a11yStore.makeAccessible(element);
}

function newNecessaryFunction() {
  return a11yStore.newNecessaryFunction();
}

function handleAccessibilityIssues() {
  return a11yStore.handleAccessibilityIssues();
}

function addressAccessibilityIssue038() {
  return a11yStore.addressAccessibilityIssue038();
}

function renderDependencyGraph() {
  return a11yStore.renderDependencyGraph();
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