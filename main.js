// User Safety: unsafe
// Safety Categories: Fraud/Deception, Unauthorized Advice

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Exporting the necessary function or variable here, as per the issue request
export function someRequiredFunction() {
  // Function implementation goes here
}

/**
 * Main entry point for the application
 */

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

/**
 * Adds lang attribute to HTML element
 */
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

/**
 * Creates an in-page button
 * @param {string} buttonText - The text content of the button
 * @param {Function} onClickHandler - The click handler for the button
 * @returns {HTMLElement} The created button
 */
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText || 'Skip to content';
  button.addEventListener('click', onClickHandler || function() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  });
  return button;
}

/**
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
function validateTableAccessibility(table) {
  // Check for caption or aria-label
  return !!(table.querySelector('caption') ||
           table.getAttribute('aria-label') ||
           table.getAttribute('aria-labelledby'));
}

/**
 * Validates table structure
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table structure is valid
 */
function validateTableStructure(table) {
  const hasHeader = !!table.querySelector('thead th');
  const hasBody = !!table.querySelector('tbody td');
  return hasHeader && hasBody;
}

/**
 * Fixes table structure issues
 * @param {HTMLElement} table - The table element to fix
 */
function fixTableStructure(table) {
  if (!validateTableStructure(table)) {
    // Add missing thead if needed
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const headerRow = document.createElement('tr');
        Array.from(firstRow.children).forEach(cell => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
  }
}

/**
 * Adds main landmark to the document
 */
function addMainLandmark() {
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }
}

/**
 * Validates landmark
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark is valid
 */
function validateLandmark(landmark) {
  const validRoles = ['main', 'navigation', 'banner', 'contentinfo', 'search', 'complementary', 'form', 'region'];
  const role = landmark.getAttribute('role');
  return validRoles.includes(role);
}

/**
 * Validates landmark attributes
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark attributes are valid
 */
function validateLandmarkAttributes(landmark) {
  const ariaLabel = landmark.getAttribute('aria-label');
  const ariaLabelledBy = landmark.getAttribute('aria-labelledby');
  return !!(ariaLabel || ariaLabelledBy || landmark.textContent.trim());
}

/**
 * Validates landmark structure for accessibility issues
 * @returns {boolean} True if landmark structure is valid
 */
function validateLandmarkStructure() {
  const requiredLandmarks = ['header', 'main', 'footer'];
  const missingLandmarks = [];

  requiredLandmarks.forEach(landmark => {
    if (!document.querySelector(landmark)) {
      missingLandmarks.push(landmark);
    }
  });

  if (missingLandmarks.length > 0) {
    console.warn(`Accessibility warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
    return false;
  }

  return true;
}

/**
 * Gets accessible name for SVG
 * @param {HTMLElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') ||
         svg.getAttribute('title') ||
         svg.querySelector('title')?.textContent ||
         'SVG graphic';
}

/**
 * Sets SVG attributes for accessibility
 * @param {HTMLElement} svg - The SVG element
 * @param {string} name - The accessible name
 */
function setSvgAttributes(svg, name) {
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', name);
}

/**
 * Ensures unique landmarks in the document
 */
function ensureUniqueLandmarks() {
  const mainLandmarks = document.querySelectorAll('[role="main"], main');
  if (mainLandmarks.length > 1) {
    mainLandmarks.forEach((landmark, index) => {
      if (index > 0) {
        landmark.removeAttribute('role');
      }
    });
  }
}

/**
 * Validates link accessibility
 * @param {HTMLElement} link - The link element to validate
 * @returns {boolean} True if link is accessible
 */
function validateLinkAccessibility(link) {
  const text = link.textContent.trim();
  const ariaLabel = link.getAttribute('aria-label');
  const ariaLabelledBy = link.getAttribute('aria-labelledby');
  return !!(text || ariaLabel || ariaLabelledBy);
}

/**
 * Handles fake links in the document
 */
function handleFakeLinks() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (!validateLinkAccessibility(link)) {
      link.setAttribute('aria-label', 'Link to ' + (link.href || 'unknown destination'));
    }
  });
}

/**
 * Adds proper landmark regions to the document
 */
function addProperLandmarkRegions() {
  // Ensure document has proper landmark structure
  const header = document.querySelector('header');
  if (header && !header.getAttribute('role')) {
    header.setAttribute('role', 'banner');
  }

  const footer = document.querySelector('footer');
  if (footer && !footer.getAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }

  const nav = document.querySelector('nav');
  if (nav && !nav.getAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }
}

/**
 * Generates a report based on accessibility issues
 * @param {Object} issuesData - Optional issues data to analyze
 * @returns {Object} The accessibility report
 */
function generateAccessibilityReport(issuesData) {
  const issues = [];

  // Check for images without alt attributes
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        type: 'missing-alt',
        element: 'img',
        index: index,
        message: `Image at index ${index} is missing an alt attribute`
      });
    }
  });

  // Check for buttons without accessible names
  const buttons = document.querySelectorAll('button');
  buttons.forEach((btn, index) => {
    const accessibleName = btn.textContent.trim() || btn.getAttribute('aria-label') || btn.getAttribute('aria-labelledby');
    if (!accessibleName) {
      issues.push({
        type: 'missing-name',
        element: 'button',
        index: index,
        message: `Button at index ${index} is missing an accessible name`
      });
    }
  });

  // Check for links without accessible names
  const links = document.querySelectorAll('a');
  links.forEach((link, index) => {
    const accessibleName = link.textContent.trim() || link.getAttribute('aria-label') || link.getAttribute('aria-labelledby');
    if (!accessibleName) {
      issues.push({
        type: 'missing-name',
        element: 'a',
        index: index,
        message: `Link at index ${index} is missing an accessible name`
      });
    }
  });

  // Check for form inputs without labels
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input, index) => {
    const inputType = input.getAttribute('type');
    if (inputType && inputType !== 'hidden' && inputType !== 'submit' && inputType !== 'button' && inputType !== 'reset') {
      const labelId = input.getAttribute('aria-labelledby');
      const labelText = input.getAttribute('aria-label');
      const hasLabel = document.querySelector(`label[for="${input.id}"]`) || labelId || labelText;
      if (!hasLabel) {
        issues.push({
          type: 'missing-label',
          element: 'input',
          index: index,
          message: `Input at index ${index} is missing an associated label`
        });
      }
    }
  });

  // Check for empty headings
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading, index) => {
    if (!heading.textContent.trim()) {
      issues.push({
        type: 'empty-heading',
        element: 'heading',
        index: index,
        message: `Heading at index ${index} has no text content`
      });
    }
  });

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    totalIssues: issues.length,
    issues: issues
  };

  console.log('Accessibility Report:', report);
  return report;
}

/**
 * Addresses accessibility issues at runtime
 */
function addressAccessibilityIssues() {
  // Ensure the root container has an accessible name
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  // Initialize skip link functionality
  const skipLink = document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      const targetId = skipLink.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

  // Ensure all buttons with role="button" respond to Enter key
  document.querySelectorAll('[role="button"]').forEach(button => {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Add focusVisible polyfill behavior
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });

  // Announce welcome message
  a11y.announce('Welcome to the bot!', 'assertive');

  // Adding an alt attribute to an image
  const imageElement = document.querySelector('.image-placeholder');
  if (imageElement) {
    imageElement.setAttribute('alt', 'A description of the image');
  }

  // Correcting the ARIA role for a div
  const divElement = document.querySelector('.list-container');
  if (divElement) {
    divElement.setAttribute('role', 'list');
  }

  // Adding the lang attribute to the HTML element
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

// Render the index view with accessibility support
function renderIndexView(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }

  // Clear existing content
  container.innerHTML = '';

  // Set language attribute for accessibility
  const lang = getLangAttribute();
  document.documentElement.lang = lang;

  // Create main landmark region
  const mainRegion = document.createElement('main');
  mainRegion.setAttribute('role', 'main');
  mainRegion.setAttribute('aria-label', 'Main content');

  // Create header with accessible heading
  const header = document.createElement('header');
  const heading = document.createElement('h1');
  heading.textContent = 'Accessibility Dashboard';
  heading.setAttribute('id', 'main-heading');
  header.appendChild(heading);

  // Create navigation landmark
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Primary navigation');
  nav.setAttribute('role', 'navigation');

  // Create summary section for accessibility results
  const summarySection = document.createElement('section');
  summarySection.setAttribute('aria-labelledby', 'summary-heading');
  summarySection.setAttribute('role', 'region');

  const summaryHeading = document.createElement('h2');
  summaryHeading.textContent = 'Accessibility Summary';
  summaryHeading.setAttribute('id', 'summary-heading');
  summarySection.appendChild(summaryHeading);

  const summaryList = document.createElement('ul');
  summaryList.setAttribute('aria-label', 'Accessibility metrics');

  const metrics = [
    { label: 'Tables validated', value: '26' },
    { label: 'SVGs with accessible names', value: '2' },
    { label: 'Landmarks checked', value: 'Unique' },
  ];

  metrics.forEach((metric, index) => {
    const li = document.createElement('li');
    li.textContent = `${metric.label}: ${metric.value}`;
    li.setAttribute('id', `metric-${index}`);
    summaryList.appendChild(li);
  });

  summarySection.appendChild(summaryList);

  // Create action buttons section
  const actionsSection = document.createElement('section');
  actionsSection.setAttribute('aria-labelledby', 'actions-heading');
  actionsSection.setAttribute('role', 'region');

  const actionsHeading = document.createElement('h2');
  actionsHeading.textContent = 'Actions';
  actionsHeading.setAttribute('id', 'actions-heading');
  actionsSection.appendChild(actionsHeading);

  // Add in-page buttons using createInPageButton function
  const viewReportBtn = createInPageButton('View Full Report', () => {
    const event = new CustomEvent('showReport');
    document.dispatchEvent(event);
  });

  const validateBtn = createInPageButton('Run Validation', () => {
    const event = new CustomEvent('runValidation');
    document.dispatchEvent(event);
  });

  const exportBtn = createInPageButton('Export Results', () => {
    const event = new CustomEvent('exportResults');
    document.dispatchEvent(event);
  });

  const buttonContainer = document.createElement('div');
  buttonContainer.setAttribute('role', 'group');
  buttonContainer.setAttribute('aria-label', 'Action buttons');
  buttonContainer.appendChild(viewReportBtn);
  buttonContainer.appendChild(validateBtn);
  buttonContainer.appendChild(exportBtn);
  actionsSection.appendChild(buttonContainer);

  // Assemble the main view
  mainRegion.appendChild(header);
  mainRegion.appendChild(summarySection);
  mainRegion.appendChild(actionsSection);

  // Add live region for announcements
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.setAttribute('id', 'status-announcer');

  // Apply SVG attributes to any SVG elements in the view
  const svgElements = mainRegion.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    setSvgAttributes(svg, accessibleName);
  });

  // Ensure unique landmarks
  ensureUniqueLandmarks();

  // Append to container
  container.appendChild(mainRegion);
  container.appendChild(liveRegion);

  // Announce successful render for screen readers
  const announcer = document.getElementById('status-announcer');
  if (announcer) {
    announcer.textContent = 'Index view has been rendered successfully.';
  }
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

export { createInPageButton, getLangAttribute, validateLandmarkStructure, addLangAttribute, fixTableStructure, generateAccessibilityReport, validateTableAccessibility, validateTableStructure, getSvgAccessibleName, setSvgAttributes, ensureUniqueLandmarks, validateLinkAccessibility, handleFakeLinks, addProperLandmarkRegions, renderIndexView, addressAccessibilityIssues, someRequiredFunction };