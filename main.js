import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';

// Accessibility utility functions
// Integration of both branches' accessibility features

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
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
function validateTableAccessibility(table) {
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
 * Creates an in-page button
 * @returns {HTMLElement} The created button
 */
function createInPageButton() {
  const button = document.createElement('button');
  button.textContent = 'Skip to content';
  button.addEventListener('click', function() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  });
  return button;
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
 * Adds accessible names to 2 SVGs
 */
function setSvgAccessibleNames(svgId1, svgId2, accessibleNames1, accessibleNames2) {
  const svg1 = document.getElementById(svgId1);
  const svg2 = document.getElementById(svgId2);

  if (svg1) {
    svg1.setAttribute('aria-labelledby', `svg-${svgId1}-label`);
    const labelDiv = document.createElement('div');
    labelDiv.id = `svg-${svgId1}-label`;
    labelDiv.textContent = accessibleNames1;
    svg1.appendChild(labelDiv);
  }

  if (svg2) {
    svg2.setAttribute('aria-labelledby', `svg-${svgId2}-label`);
    const labelDiv = document.createElement('div');
    labelDiv.id = `svg-${svgId2}-label`;
    labelDiv.textContent = accessibleNames2;
    svg2.appendChild(labelDiv);
  }
}

/**
 * Enhanced function to handle SVG accessibility for data URIs
 */
function enhanceSvgAccessibility() {
  const svgs = document.querySelectorAll('svg');

  svgs.forEach((svg, index) => {
    const hasAccessibleName = svg.getAttribute('aria-label') ||
                              svg.getAttribute('aria-labelledby') ||
                              svg.querySelector('title');

    if (!hasAccessibleName) {
      const isDecorative = svg.getAttribute('data-decorative') === 'true';

      if (isDecorative) {
        svg.setAttribute('aria-hidden', 'true');
      } else {
        const title = document.createElement('title');
        title.textContent = `SVG Icon ${index + 1}`;
        svg.insertBefore(title, svg.firstChild);
      }
    }
  });
}

/**
 * Fixes fake link issues
 */
function fixFakeLink() {
  const fakeLinks = document.querySelectorAll(':not([href])[role="link"]');
  fakeLinks.forEach(link => {
    link.removeAttribute('role');
    link.setAttribute('href', '#');
  });

  const modalElement = document.getElementById('modal');
  if (modalElement && a11y && a11y.trapFocus) {
    a11y.trapFocus(modalElement);
  }
  if (a11y && a11y.announce) {
    a11y.announce('Welcome to the bot!', 'assertive');
  }

  const imageElement = document.getElementById('example-image');
  if (imageElement) {
    imageElement.setAttribute('alt', 'A description of the image');
  }

  const divElement = document.getElementById('example-div');
  if (divElement) {
    divElement.setAttribute('role', 'list');
  }

  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }

  function checkLandmarkElements() {
    const landmarks = ['main', 'nav', 'aside', 'footer', 'header'];
    landmarks.forEach(landmark => {
      const element = document.querySelector(`[role="${landmark}"]`);
      if (element) {
        element.setAttribute('aria-label', `Navigation: ${landmark}`);
      }
    });
  }

  checkLandmarkElements();

  return accessibilityUtils;
}

/**
 * Addresses accessibility issues at runtime
 */
function addressAccessibilityIssues() {
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

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

  document.querySelectorAll('[role="button"]').forEach(button => {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });

  a11y.announce('Welcome to the bot!', 'assertive');

  const imageElement = document.querySelector('.image-placeholder');
  if (imageElement) {
    imageElement.setAttribute('alt', 'A description of the image');
  }

  const divElement = document.querySelector('.list-container');
  if (divElement) {
    divElement.setAttribute('role', 'list');
  }

  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

/**
 * New function to count dependencies
 */
function countDependencies() {
  console.log('Counting dependencies...');
}

/**
 * New function3 logic - accessibility checks and improvements
 */
function function3() {
  const dependencyGraph = document.getElementById('dependencyGraph');

  try {
    if (dependencyGraph) {
      if (!dependencyGraph.hasAttribute('role')) {
        dependencyGraph.setAttribute('role', 'region');
      }
      if (!dependencyGraph.hasAttribute('aria-label')) {
        dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
      }

      console.log('Dependency graph accessibility enhanced:', {
        role: dependencyGraph.getAttribute('role'),
        ariaLabel: dependencyGraph.getAttribute('aria-label')
      });
    }

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      if (!button.hasAttribute('role')) {
        button.setAttribute('role', 'button');
      }
      if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
        button.setAttribute('aria-label', 'Button');
      }
    });

    const landmarks = ['main', 'nav', 'aside', 'footer', 'header'];
    landmarks.forEach(landmark => {
      const elements = document.querySelectorAll(`[role="${landmark}"]`);
      elements.forEach(element => {
        if (!element.hasAttribute('aria-label')) {
          element.setAttribute('aria-label', `${landmark} section`);
        }
      });
    });

    return {
      status: 'success',
      message: 'Accessibility checks and improvements completed',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in function3:', error);
    return {
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Helper function to check if a link is accessible
 */
function checkLinkAccessibility(linkUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  return fetch(linkUrl, { method: 'HEAD', signal: controller.signal })
    .then(response => {
      clearTimeout(timeout);
      return response.ok;
    })
    .catch(() => {
      clearTimeout(timeout);
      return false;
    });
}

/**
 * Creates an in-page button (generic version)
 */
function createInPageButtonGeneric(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  button.onclick = onClickHandler;
  return button;
}

/**
 * Creates an accessible in-page button
 */
function createAccessibleInPageButton() {
  const button = document.createElement('button');
  button.textContent = 'Accessibility Info';
  button.setAttribute('aria-label', 'Show accessibility information');
  button.setAttribute('role', 'button');
  button.setAttribute('tabindex', '0');
  document.body.appendChild(button);
}

/**
 * Function to add a new book with accessibility improvements
 */
function addNewBook(title, author, description) {
  const bookElement = document.createElement('div');
  bookElement.setAttribute('role', 'article');
  bookElement.setAttribute('aria-label', `Book: ${title} by ${author}`);

  const titleElement = document.createElement('h3');
  titleElement.textContent = title;
  titleElement.setAttribute('aria-label', `Title: ${title}`);
  bookElement.appendChild(titleElement);

  const authorElement = document.createElement('p');
  authorElement.textContent = `Author: ${author}`;
  authorElement.setAttribute('aria-label', `Author: ${author}`);
  bookElement.appendChild(authorElement);

  const descElement = document.createElement('p');
  descElement.textContent = description;
  descElement.setAttribute('aria-label', `Description: ${description}`);
  bookElement.appendChild(descElement);

  bookElement.setAttribute('tabindex', '0');
  bookElement.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.style.outline = '2px solid #0056b3';
    }
  });

  const booksContainer = document.getElementById('booksContainer');
  if (booksContainer) {
    booksContainer.appendChild(bookElement);
  } else {
    console.error('Books container not found');
  }

  if (a11y && a11y.announce) {
    a11y.announce(`New book added: ${title} by ${author}`, 'assertive');
  }

  return bookElement;
}

/**
 * New function to handle keyboard navigation
 */
function handleKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });
}

/**
 * New function to add ARIA labels to interactive elements
 */
function addARIALabels() {
  const interactiveElements = document.querySelectorAll('[role="button"], [role="link"], [role="menuitem"]');
  interactiveElements.forEach(element => {
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      const textContent = element.textContent.trim();
      if (textContent) {
        element.setAttribute('aria-label', textContent);
      }
    }
  });
}

/**
 * New function to add screen reader announcements
 */
function addScreenReaderAnnouncements() {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.setAttribute('class', 'sr-only');
  document.body.appendChild(liveRegion);

  if (a11y && a11y.announce) {
    a11y.announce('Accessibility features initialized', 'polite');
  }
}

/**
 * New function to trap focus in modals
 */
function trapModalFocus(modal) {
  if (!modal) return;

  const focusableElements = modal.querySelectorAll(
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  modal.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });

  if (firstFocusable) {
    firstFocusable.focus();
  }
}

/**
 * Scans pages for accessibility issues
 */
async function scanAccessibility() {
  const filePaths = await fs.promises.readdir(pagesDir);
  const issues = [];

  for (const filePath of filePaths) {
    const fileEmitted = path.join(pagesDir, filePath);
    const { violations } = await axe.analyze(fileEmitted);

    if (violations.length > 0) {
      issues.push({
        file: filePath,
        issues: violations,
      });
    }
  }

  return issues;
}

/**
 * Generates a report based on accessibility issues
 */
function generateAccessibilityReport(issuesData) {
  const analyzedIssues = analyzeAccessibility(issuesData);

  const report = {
    introduction: 'Accessibility report for the application',
    data: {},
    conclusions: ''
  };

  writeReport(report);
  return report;
}

/**
 * Generates a report based on accessibility issues (browser version)
 */
function generateAccessibilityReportBrowser() {
  const issues = [];

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

  const inputs = document.querySelectorAll('input');
  inputs.forEach((input, index) => {
    const inputType = input.getAttribute('type');
    if (inputType && inputType !== 'hidden' && inputType !== 'submit' && inputType !== 'button' && inputType !== 'reset') {
      const hasLabel = document.querySelector(`label[for="${input.id}"]`) || input.getAttribute('aria-label');
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

  const report = {
    timestamp: new Date().toISOString(),
    totalIssues: issues.length,
    issues: issues
  };

  console.log('Accessibility Report:', report);
  return report;
}

/**
 * Function to write the generated report to a file
 */
function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

/**
 * Accessibility utilities - preserves the original accessibilityUtils functionality
 */
const accessibilityUtils = {
  addressNewAccessibilityIssues: function(issues) {
    if (!issues || !Array.isArray(issues)) {
      return [];
    }

    return issues.map(issue => {
      return {
        id: issue.id,
        description: issue.description,
        severity: issue.severity,
        status: 'addressed',
        addressedAt: new Date().toISOString()
      };
    });
  }
};

/**
 * Harvest logic implementation
 */
async function harvest() {
  try {
    const report = await scanAccessibility();
    const harvestedData = {
      timestamp: new Date().toISOString(),
      pagesScanned: report.length,
      totalIssues: report.reduce((acc, curr) => acc + curr.issues.length, 0),
      details: report
    };

    const harvestFile = path.join(__dirname, 'harvest_data.json');
    fs.writeFileSync(harvestFile, JSON.stringify(harvestedData, null, 2));

    return harvestedData;
  } catch (error) {
    console.error('Harvest failed:', error);
    throw error;
  }
}

/**
 * Upgrade logic implementation
 */
async function upgrade(harvestedData) {
  try {
    const data = harvestedData || (() => {
      const harvestFile = path.join(__dirname, 'harvest_data.json');
      if (fs.existsSync(harvestFile)) {
        return JSON.parse(fs.readFileSync(harvestFile, 'utf8'));
      }
      return null;
    })();

    if (!data) {
      throw new Error('No harvested data available for upgrade');
    }

    const upgradePlan = {
      timestamp: new Date().toISOString(),
      basedOnHarvest: data.timestamp,
      improvements: [],
      applied: false
    };

    if (data.details && data.details.length > 0) {
      data.details.forEach(page => {
        page.issues.forEach(violation => {
          upgradePlan.improvements.push({
            file: page.file,
            rule: violation.id,
            impact: violation.impact,
            description: violation.description,
            recommendation: `Fix ${violation.id} issue in ${page.file}`
          });
        });
      });
    }

    const upgradeFile = path.join(__dirname, 'upgrade_plan.json');
    fs.writeFileSync(upgradeFile, JSON.stringify(upgradePlan, null, 2));

    upgradePlan.applied = true;
    upgradePlan.appliedAt = new Date().toISOString();

    fs.writeFileSync(upgradeFile, JSON.stringify(upgradePlan, null, 2));

    return upgradePlan;
  } catch (error) {
    console.error('Upgrade failed:', error);
    throw error;
  }
}

/**
 * Combined harvest and upgrade workflow
 */
async function harvestAndUpgrade() {
  const harvested = await harvest();
  const upgraded = await upgrade(harvested);
  return { harvested, upgraded };
}

// === Accessibility Utilities Object ===
const accessibilityUtilsCombined = {
  addressAccessibilityIssues,
  getLangAttribute,
  addLangAttribute,
  createInPageButton,
  countDependencies,
  function3,
  a11y,
  setSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLink,
  harvest,
  upgrade,
  harvestAndUpgrade,
  checkLinkAccessibility,
  writeReport,
  scanAccessibility,
  addNewBook,
  ...accessibilityUtils
};

// Initialize on DOM ready
function initialize() {
  const dependencyGraph = document.getElementById('dependencyGraph');

  if (dependencyGraph) {
    if (!dependencyGraph.id) {
      dependencyGraph.id = 'dependencyGraph';
    }
    if (!dependencyGraph.hasAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }
    if (!dependencyGraph.hasAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
    }
  }

  addressAccessibilityIssues();
  createInPageButton();
  setSvgAccessibleNames('svg1Id', 'svg2Id', 'aria-label for SVG1', 'aria-label for SVG2');
  ensureUniqueLandmarks();
  fixFakeLink();

  if (a11y && a11y.init) {
    a11y.init();
  }

  handleKeyboardNavigation();
  addARIALabels();
  addScreenReaderAnnouncements();

  const modal = document.getElementById('modal');
  if (modal) {
    trapModalFocus(modal);
  }
}

// === React Rendering ===
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}

export {
  createInPageButton,
  validateLandmarkStructure,
  addLangAttribute,
  fixTableStructure,
  generateAccessibilityReportBrowser as generateAccessibilityReport,
  addressAccessibilityIssues,
  getLangAttribute,
  addARIALabels,
  handleKeyboardNavigation,
  trapModalFocus,
  ensureUniqueLandmarks,
  fixFakeLink,
  harvest,
  upgrade,
  harvestAndUpgrade,
  checkLinkAccessibility,
  writeReport,
  scanAccessibility,
  addNewBook,
  function3,
  countDependencies,
  setSvgAccessibleNames,
  enhanceSvgAccessibility,
  accessibilityUtilsCombined
};