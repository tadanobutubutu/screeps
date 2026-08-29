// main.js - Accessibility Checker Module

/**
 * Checks accessibility of links and buttons within a given container
 * @param {HTMLElement} container - The container element to check for accessibility issues
 * @returns {Array} - Array of accessibility issues found
 */
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
  const buttons = container.querySelectorAll('button, [role="button"]');
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
    renderIndexView
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
}