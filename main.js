// main.js - Accessibility Checker Module

/**
 * Checks accessibility of links and buttons within a given container
 * @param {HTMLElement} container - The container element to check for accessibility issues
 * @returns {Array} - Array of accessibility issues found
 */

// Example data structure
const DEFAULT_CONFIG = {
  apiUrl: '...',
  timeout: 5000,
  retries: 3
};

function checkLinkAndButtonAccessibility(container) {
  const issues = [];
  
  // Check links for accessible names
  const links = container.querySelectorAll('a[href]');
  links.forEach((link, index) => {
    const text = link.textContent.trim();
    const ariaLabel = link.getAttribute('aria-label');
    const ariaLabelledby = link.getAttribute('aria-labelledby');
    const title = link.getAttribute('title');
    const imgAlt = link.querySelector('img') ? link.querySelector('img').getAttribute('alt') : null;
    
    if (!text && !ariaLabel && !ariaLabelledby && !title && !imgAlt) {
      issues.push({
        type: 'link',
        index,
        element: link,
        message: 'Link is missing accessible name. Add visible text, aria-label, aria-labelledby, title attribute, or alt text on contained image.'
      });
    }
  });

  // Check buttons for accessibility
  const buttons = container.querySelectorAll('[role="button"], button');
  buttons.forEach((button, index) => {
    const text = button.textContent.trim();
    const ariaLabel = button.getAttribute('aria-label');
    const ariaLabelledby = button.getAttribute('aria-labelledby');
    const title = button.getAttribute('title');
    
    if (!text && !ariaLabel && !ariaLabelledby && !title) {
      issues.push({
        type: 'button',
        index,
        element: button,
        message: 'Button is missing accessible name. Add visible text, aria-label, aria-labelledby, or title attribute.'
      });
    }
  });
  
  return issues;
}

/**
 * Checks if the html element has a lang attribute
 * @returns {Object|null} - Returns an issue object if lang attribute is missing, null otherwise
 */
function checkLangAttribute() {
  const htmlElement = document.querySelector('html');
  
  if (!htmlElement) {
    return null;
  }
  
  const langAttribute = htmlElement.getAttribute('lang');
  
  if (!langAttribute) {
    return {
      type: 'language',
      element: htmlElement,
      message: 'HTML element is missing lang attribute. Add lang attribute to specify the page language (e.g., lang="en").'
    };
  }
  
  return null;
}

/**
 * Checks images for alt attributes
 * @param {HTMLElement} container - The container element to check for images
 * @returns {Array} - Array of accessibility issues found
 */
function checkImageAltAccessibility(container) {
  const issues = [];
  
  const images = container.querySelectorAll('img');
  images.forEach((img, index) => {
    const altAttribute = img.getAttribute('alt');
    
    // Empty alt is acceptable for decorative images with aria-hidden="true"
    const isDecorative = img.getAttribute('aria-hidden') === 'true';
    
    if (altAttribute === null && !isDecorative) {
      issues.push({
        type: 'image',
        index,
        element: img,
        message: 'Image is missing alt attribute. Add alt attribute describing the image content, or use empty alt="" for decorative images.'
      });
    }
  });
  
  return issues;
}

/**
 * Checks form elements for proper labels
 * @param {HTMLElement} container - The container element to check for form elements
 * @returns {Array} - Array of accessibility issues found
 */
function checkFormLabelAccessibility(container) {
  const issues = [];
  const checkedInputs = new Set();
  
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    if (checkedInputs.has(input)) return;
    
    // Check for implicit label (input wrapped in label)
    const parentLabel = input.parentElement && input.parentElement.tagName.toLowerCase() === 'label';
    
    // Check for explicit label
    const id = input.getAttribute('id');
    const explicitLabel = id ? document.querySelector(`label[for="${id}"]`) : null;
    
    // Check for aria-label
    const ariaLabel = input.getAttribute('aria-label');
    
    // Check for aria-labelledby
    const ariaLabelledby = input.getAttribute('aria-labelledby');
    
    // Check for title attribute
    const title = input.getAttribute('title');
    
    const hasLabel = parentLabel || explicitLabel || ariaLabel || ariaLabelledby || title;
    
    if (!hasLabel) {
      issues.push({
        type: 'form',
        index,
        element: input,
        message: 'Form element is missing accessible label. Add a label element, aria-label, aria-labelledby, or title attribute.'
      });
    }
  });
  
  return issues;
}

/**
 * Performs comprehensive accessibility check on the document
 * @param {HTMLElement} [container=document] - The container element to check (defaults to entire document)
 * @returns {Array} - Array of accessibility issues found
 */
function checkAccessibility(container) {
  if (!container) {
    container = document;
  }
  
  const issues = [];
  
  // Check language attribute
  const langIssue = checkLangAttribute();
  if (langIssue) {
    issues.push(langIssue);
  }
  
  // Check links and buttons
  const linkButtonIssues = checkLinkAndButtonAccessibility(container);
  issues.push(...linkButtonIssues);
  
  // Check images
  const imageIssues = checkImageAltAccessibility(container);
  issues.push(...imageIssues);
  
  // Check form labels
  const formIssues = checkFormLabelAccessibility(container);
  issues.push(...formIssues);
  
  return issues;
}

/**
 * Renders a graph visualization for accessibility issues
 * @param {Array} issues - Array of accessibility issues to render
 * @param {HTMLElement} container - The container element to render the graph into
 */
function renderAccessibilityGraph(issues, container) {
  if (!container || !issues || issues.length === 0) {
    return;
  }

  const graphContainer = document.createElement('div');
  graphContainer.className = 'accessibility-graph';
  graphContainer.innerHTML = `
    <h3>Accessibility Issues Graph</h3>
    <div class="graph-content">
      ${issues.map((issue, index) => `
        <div class="graph-node" data-index="${index}">
          <span class="node-type">${issue.type}</span>
          <span class="node-message">${issue.message}</span>
        </div>
      `).join('')}
    </div>
  `;
  
  container.appendChild(graphContainer);
}

/**
 * Renders an index of accessibility issues
 * @param {Array} issues - Array of accessibility issues to render
 * @param {HTMLElement} container - The container element to render the index into
 */
function renderAccessibilityIndex(issues, container) {
  if (!container || !issues || issues.length === 0) {
    return;
  }

  const indexContainer = document.createElement('div');
  indexContainer.className = 'accessibility-index';
  
  const groupedIssues = {};
  issues.forEach((issue, index) => {
    if (!groupedIssues[issue.type]) {
      groupedIssues[issue.type] = [];
    }
    groupedIssues[issue.type].push({ ...issue, originalIndex: index });
  });

  let indexHTML = '<h3>Accessibility Issues Index</h3><ul class="index-list">';
  
  Object.keys(groupedIssues).forEach(type => {
    indexHTML += `<li class="index-type"><strong>${type}s</strong> (${groupedIssues[type].length})`;
    indexHTML += '<ul class="index-sublist">';
    groupedIssues[type].forEach(item => {
      indexHTML += `<li data-original-index="${item.originalIndex}">${item.message}</li>`;
    });
    indexHTML += '</ul></li>';
  });
  
  indexHTML += '</ul>';
  indexContainer.innerHTML = indexHTML;
  
  container.appendChild(indexContainer);
}

/**
 * Renders both graph and index for accessibility issues
 * @param {HTMLElement} container - The container element to check for accessibility issues
 * @param {HTMLElement} outputContainer - The container element to render results into
 */
function renderAccessibilityResults(container, outputContainer) {
  const issues = checkLinkAndButtonAccessibility(container);
  
  if (outputContainer) {
    renderAccessibilityGraph(issues, outputContainer);
    renderAccessibilityIndex(issues, outputContainer);
  }
  
  return issues;
}

/**
 * Renders the index view of the application
 */
function renderIndexView() {
  // Placeholder for the index view rendering logic
  // This could involve creating elements, setting text content, and appending them to the DOM
  // For the purpose of this example, we'll just log a message
  console.log('Index view rendered');
}

/**
 * Gets recommendation for specific accessibility issue type
 * @param {string} issueType - Type of accessibility issue
 * @returns {string} - Recommendation for fixing the issue
 */
function getRecommendation(issueType) {
  const recommendations = {
    'missing-alt-text': 'Add descriptive alt text to images for screen readers',
    'missing-aria-label': 'Add ARIA labels to interactive elements',
    'low-contrast': 'Increase color contrast ratio to at least 4.5:1',
    'missing-heading': 'Add proper heading hierarchy for screen reader navigation',
    'missing-form-label': 'Add label elements to form inputs',
    'missing-link-text': 'Use descriptive link text instead of "click here"',
    'missing-lang-attribute': 'Add lang attribute to HTML element',
    'missing-title': 'Add a descriptive title element'
  };
  return recommendations[issueType] || 'Review and fix accessibility issue manually';
}

/**
 * New function to fix the React SVG Accessible Name issue
 * @param {string} svgString - The SVG string to fix
 * @returns {string} - SVG string with accessible name added
 */
function fixSVGAccessibleName(svgString) {
  // Check if the SVG string already contains an accessible name
  if (svgString.includes('aria-label') || svgString.includes('aria-labelledby') || svgString.includes('title')) {
    return svgString;
  }

  // Create a temporary SVG element to parse the SVG string
  const tempSVG = document.implementation.createHTMLDocument();
  tempSVG.body.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${svgString}</svg>`;
  const svgRoot = tempSVG.querySelector('svg');

  // Check if the SVG is decorative and does not need an accessible name
  const parentElement = svgRoot.parentElement;
  const isDecorative = parentElement && (
    parentElement.tagName === 'button' || 
    parentElement.tagName === 'input' || 
    parentElement.tagName === 'textarea' || 
    parentElement.tagName === 'select' ||
    (parentElement.tagName === 'audio' && parentElement.hasAttribute('controls')) ||
    (parentElement.tagName === 'video' && parentElement.hasAttribute('controls'))
  );
  
  if (isDecorative) {
    return svgString.replace('<svg', '<svg aria-hidden="true"');
  }

  // Add an aria-label to the SVG if it's not decorative
  const svgWithAriaLabel = svgString.replace('<svg', '<svg aria-label="SVG description"');
  return svgWithAriaLabel;
}

/**
 * Generates a summary of addressed accessibility issues
 * @param {Array} addressedIssues - Array of addressed issues
 * @returns {string} - Summary text
 */
function generateSummary(addressedIssues) {
  const total = addressedIssues.length;
  const critical = addressedIssues.filter(i => i.severity === 'critical').length;
  const moderate = addressedIssues.filter(i => i.severity === 'moderate').length;
  const low = addressedIssues.filter(i => i.severity === 'low').length;

  return `Addressed ${total} accessibility issues: ${critical} critical, ${moderate} moderate, ${low} low priority.`;
}

const {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  createInPageButton,
  createAccessibleLink,
} = require('./accessibility-helpers');

const { class1, function1, Object1 } = require('./components');

const version = "1.0.0";

const a11yStore = {
  init() {
    this.initLangAttribute();
    this.setupSkipLinks();
    this.ensureUniqueLandmarks();
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
};

function getSVGAccessibleName(svgElement) {
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
    switch (issue.type) {
      case 'missing-lang':
        if (issue.element) {
          issue.element.setAttribute('lang', 'en');
        }
        break;
      case 'missing-skip-link':
        if (issue.element) {
          const skipLink = document.createElement('a');
          skipLink.className = 'skip-link';
          skipLink.href = '#main-content';
          skipLink.textContent = 'Skip to main content';
          skipLink.setAttribute('aria-label', 'Skip to main content');
          document.body.insertBefore(skipLink, document.body.firstChild);
        }
        break;
      case 'missing-alt':
        document.querySelectorAll('img').forEach(img => {
          if (!img.getAttribute('alt')) {
            img.setAttribute('alt', 'Image description');
          }
        });
        break;
      case 'missing-label':
        document.querySelectorAll('input, select, textarea').forEach(el => {
          if (!el.getAttribute('aria-label') && !el.getAttribute('id')) {
            el.setAttribute('aria-label', 'Form field');
          }
        });
        break;
    }
  });
}

const mainElement = document.querySelector('main') || wrapPrimaryContentInMain();
console.log('Main element lang:', document.documentElement.lang);

if (!document.documentElement.lang) {
  document.documentElement.lang = 'en';
}

/**
 * Ensures all landmarks have unique IDs to meet accessibility requirements
 * @returns {Set<string>} - Set of IDs found in landmark elements
 */
function ensureUniqueLandmarks() {
  const landmarkSelectors = [
    'main',
    '[role="banner"]',
    '[role="header"]',
    '[role="navigation"]',
    '[role="complementary"]',
    '[role="contentinfo"]',
    '[role="footer"]',
    '[role="search"]',
    '[role="form"]'
  ];
  
  const landmarkElements = document.querySelectorAll(landmarkSelectors.join(', '));
  const ids = new Set();
  
  landmarkElements.forEach(el => {
    if (el.id) {
      if (ids.has(el.id)) {
        console.warn('Duplicate ID found for landmark:', el.id);
        // Generate unique ID by appending a suffix
        let uniqueId = el.id;
        let counter = 1;
        while (ids.has(uniqueId)) {
          uniqueId = `${el.id}-${counter}`;
          counter++;
        }
        el.id = uniqueId;
        ids.add(uniqueId);
      } else {
        ids.add(el.id);
      }
    }
  });
  
  return ids;
}

/**
 * Wraps the primary content in a main element if one doesn't exist
 * @returns {HTMLElement|null} - The main element or null if not in browser
 */
function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }

  let mainElement = document.querySelector('main');
  if (mainElement) {
    return mainElement;
  }

  const elementsToExclude = [];
  const landmarks = ['nav', 'aside', 'footer', '[role="banner"]', '[role="navigation"]', '[role="main"]', '[role="complementary"]', '[role="contentinfo"]', '[role="search"]', '[role="form"]'];
  
  const possibleMainContent = Array.from(document.body.children).filter(
    el => !landmarks.includes(el.tagName.toLowerCase()) && 
          !landmarks.some(landmark => el.matches(landmark)) &&
          el.tagName !== 'MAIN'
  );
  
  mainElement = document.createElement('main');
  mainElement.id = 'main-content';
  possibleMainContent.forEach(child => {
    mainElement.appendChild(child);
  });
  
  document.body.appendChild(mainElement);
  return mainElement;
}

// Example usage and export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    checkLinkAndButtonAccessibility,
    checkLangAttribute,
    checkImageAltAccessibility,
    checkFormLabelAccessibility,
    checkAccessibility,
    renderAccessibilityGraph,
    renderAccessibilityIndex,
    renderAccessibilityResults,
    renderIndexView,
    getRecommendation,
    fixSVGAccessibleName,
    generateSummary,
    getSVGAccessibleName,
    addressAccessibilityIssues,
    ensureUniqueLandmarks,
    wrapPrimaryContentInMain,
    a11yStore
  };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.checkLinkAndButtonAccessibility = checkLinkAndButtonAccessibility;
  window.checkLangAttribute = checkLangAttribute;
  window.checkImageAltAccessibility = checkImageAltAccessibility;
  window.checkFormLabelAccessibility = checkFormLabelAccessibility;
  window.checkAccessibility = checkAccessibility;
  window.renderAccessibilityGraph = renderAccessibilityGraph;
  window.renderAccessibilityIndex = renderAccessibilityIndex;
  window.renderAccessibilityResults = renderAccessibilityResults;
  window.renderIndexView = renderIndexView;
  window.getRecommendation = getRecommendation;
  window.fixSVGAccessibleName = fixSVGAccessibleName;
  window.generateSummary = generateSummary;
  window.getSVGAccessibleName = getSVGAccessibleName;
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.ensureUniqueLandmarks = ensureUniqueLandmarks;
  window.wrapPrimaryContentInMain = wrapPrimaryContentInMain;
  window.a11yStore = a11yStore;
}