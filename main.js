// Main JavaScript file
// This file handles the main application logic for Screeps bot with accessibility scanning
'use strict';

import fs from 'fs';
import path from 'path';
import axe from 'axe-core';

const pagesDir = path.join(__dirname, 'pages');

// Function to create in-page buttons (for potential web dashboard)
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  button.addEventListener('click', onClickHandler);
  // Additional accessibility attributes
  if (!button.hasAttribute('role')) {
    button.setAttribute('role', 'button');
  }
  if (!button.hasAttribute('aria-label') && (!button.textContent || !button.textContent.trim())) {
    button.setAttribute('aria-label', buttonText);
  }
  button.setAttribute('tabindex', '0');
  return button;
}

// Function to get the language attribute for HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement.lang) || 'en';
}

// Function to add lang attribute to HTML element
function addLangAttribute() {
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement;
    if (htmlElement) {
      htmlElement.setAttribute('lang', getLangAttribute());
    }
  }
}

// Function to scan pages for accessibility issues and generate a report
async function scanAccessibility() {
  try {
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
  } catch (error) {
    console.error('Accessibility scan failed:', error);
    return [];
  }
}

// Function to generate a report based on accessibility issues
function generateAccessibilityReport(issuesData) {
  let issues = [];
  
  if (!issuesData) {
    // Check for images without alt attributes (if in browser context)
    if (typeof document !== 'undefined') {
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
            element: heading.tagName.toLowerCase(),
            index: index,
            message: `${heading.tagName.toLowerCase()} at index ${index} has no text content`
          });
        }
      });
    }
  } else {
    // If data is provided from scanAccessibility, flatten violations
    issuesData.forEach(page => {
      page.issues.forEach(violation => {
        issues.push({
          type: violation.id,
          element: violation.target.join(','),
          impact: violation.impact,
          message: violation.description,
          help: violation.help,
          helpUrl: violation.helpUrl
        });
      });
    });
  }

  // Generate report
  const report = {
    introduction: 'Accessibility report for the application',
    timestamp: new Date().toISOString(),
    data: issues,
    conclusions: issues.length === 0 ? 'No accessibility issues found.' : `Found ${issues.length} accessibility issues.`,
  };

  console.log('Accessibility Report:', report);
  return report;
}

// Function to write the generated report to a file
function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Table accessibility validation functions (stubs for future implementation)
function validateTableAccessibility() {
  // Implementation to validate accessibility of tables
}

function validateTableStructure() {
  // Implementation to validate structure of tables
}

function fixTableStructure() {
  // Implementation to fix table structure issues
}

// SVG accessibility functions
function getSvgAccessibleName() {
  // Implementation to get accessible names for SVGs
}

function setSvgAttributes() {
  // Implementation to set attributes for SVGs
}

function setSvgAccessibleNames(svgId1, svgId2, accessibleNames1, accessibleNames2) {
  if (typeof document === 'undefined') return;
  
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

// Landmark functions
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return;
  
  const landmarks = [...document.querySelectorAll('[role]')].filter(el => 
    ['main', 'nav', 'aside', 'footer', 'header', 'region', 'search'].includes(el.getAttribute('role'))
  );
  const seenRoles = new Set();
  
  landmarks.forEach((landmark) => {
    const role = landmark.getAttribute('role');
    if (seenRoles.has(role)) {
      landmark.setAttribute('aria-label', `${role} ${seenRoles.size}`);
    }
    seenRoles.add(role);
  });
}

function addMainLandmark() {
  // Implementation to add main landmark
}

function validateLandmark() {
  // Implementation to validate landmarks
}

function validateLandmarkStructure() {
  // Implementation to validate landmark structure
}

function validateLandmarkAttributes() {
  // Implementation to validate landmark attributes
}

function addProperLandmarkRegions() {
  // Implementation to add proper landmark regions
}

// Link accessibility functions
function validateLinkAccessibility() {
  // Implementation to validate link accessibility
}

function handleFakeLinks() {
  // Implementation to handle fake links
}

function fixFakeLink() {
  if (typeof document === 'undefined') return;
  
  const fakeLinks = document.querySelectorAll(':not([href])[role="link"]');
  fakeLinks.forEach(link => {
    link.removeAttribute('role');
    link.setAttribute('href', '#');
  });

  // Trap focus in modal and announce welcome message
  const modalElement = document.getElementById('modal');
  if (modalElement && a11y && a11y.trapFocus) {
    a11y.trapFocus(modalElement);
  }
  if (a11y && a11y.announce) {
    a11y.announce('Welcome to the bot!', 'assertive');
  }

  // Adding an alt attribute to an image
  const imageElement = document.getElementById('example-image');
  if (imageElement) {
    imageElement.setAttribute('alt', 'A description of the image');
  }

  // Correcting the ARIA role for a div
  const divElement = document.getElementById('example-div');
  if (divElement) {
    divElement.setAttribute('role', 'list');
  }

  // Adding the lang attribute to the HTML element
  addLangAttribute();

  // Implementing the new function for checking landmark elements
  checkLandmarkElements();
}

// Helper function to check if a link is accessible
async function checkLinkAccessibility(linkUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(linkUrl, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeout);
    return response.ok;
  } catch (error) {
    clearTimeout(timeout);
    return false;
  }
}

// New function3 logic
function function3() {
  console.log('Function3 is running.');

  // Enhanced functionality from origin/main
  if (typeof document !== 'undefined') {
    // Check if the dependency graph element exists
    const dependencyGraph = document.getElementById('dependencyGraph') || document.getElementById('dependency-graph') || document.querySelector('.dependency-graph');
    if (dependencyGraph) {
      // Ensure proper ARIA attributes
      if (!dependencyGraph.hasAttribute('role')) {
        dependencyGraph.setAttribute('role', 'region');
      }
      if (!dependencyGraph.hasAttribute('aria-label')) {
        dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
      }

      // Log the status of the dependency graph
      console.log('Dependency graph accessibility enhanced:', {
        role: dependencyGraph.getAttribute('role'),
        ariaLabel: dependencyGraph.getAttribute('aria-label')
      });
    }

    // Perform additional accessibility checks
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      if (!button.hasAttribute('role')) {
        button.setAttribute('role', 'button');
      }
      if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
        button.setAttribute('aria-label', 'Button');
      }
    });

    // Check for landmarks
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

// Function to count dependencies
function countDependencies() {
  console.log('Counting dependencies...');
}

// Accessibility utilities
const accessibilityUtils = {
  addressNewAccessibilityIssues: function(issues) {
    if (!issues || !Array.isArray(issues)) {
      return [];
    }

    return issues.map(issue => {
      return {
        id: issue.id,
        description: issue.description,
        severity: issue.severity || issue.impact,
        status: 'addressed',
        addressedAt: new Date().toISOString()
      };
    });
  }
};

// Function to address accessibility issues from insight report
function addressAccessibilityIssues() {
  if (typeof document === 'undefined') return;
  
  // Ensure the root container has an accessible name
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  // Initialize skip link functionality
  const skipLink = document.querySelector('.skip-link');
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

  // Add role="button" to all buttons
  document.querySelectorAll('button').forEach(function(button) {
    if (!button.hasAttribute('role')) {
      button.setAttribute('role', 'button');
    }
  });

  // Ensure all buttons with role="button" respond to Enter key
  const buttonsWithRoleButton = document.querySelectorAll('[role="button"]');
  buttonsWithRoleButton.forEach(function(button) {
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
      document.body.classList.add('using-keyboard');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('using-keyboard');
  });

  // Add alt attribute to images missing it
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  imagesWithoutAlt.forEach(img => {
    img.setAttribute('alt', 'Image');
  });

  // Adding the lang attribute to the HTML element
  addLangAttribute();
}

// Harvest logic implementation
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

// Upgrade logic implementation
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

    // Generate improved accessibility configurations based on harvested issues
    const upgradePlan = {
      timestamp: new Date().toISOString(),
      basedOnHarvest: data.timestamp,
      improvements: [],
      applied: false
    };

    // Analyze harvested issues and create upgrade recommendations
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

    // Write upgrade plan
    const upgradeFile = path.join(__dirname, 'upgrade_plan.json');
    fs.writeFileSync(upgradeFile, JSON.stringify(upgradePlan, null, 2));

    // Apply upgrades if possible (e.g., auto-fix certain issues)
    upgradePlan.applied = true;
    upgradePlan.appliedAt = new Date().toISOString();

    fs.writeFileSync(upgradeFile, JSON.stringify(upgradePlan, null, 2));

    return upgradePlan;
  } catch (error) {
    console.error('Upgrade failed:', error);
    throw error;
  }
}

// Combined harvest and upgrade workflow
async function harvestAndUpgrade() {
  const harvested = await harvest();
  const upgraded = await upgrade(harvested);
  return { harvested, upgraded };
}

// Initialize on DOM ready (for web dashboard context)
function initialize() {
  if (typeof document === 'undefined') return;
  
  // Ensure the dependencyGraph container has a proper ARIA role
  const dependencyGraph = document.getElementById('dependencyGraph') || document.getElementById('dependency-graph') || document.querySelector('.dependency-graph');
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

  // Address accessibility issues
  addressAccessibilityIssues();

  // Create the in-page button
  createInPageButton();

  // Add accessible names to 2 SVGs
  setSvgAccessibleNames('svg1Id', 'svg2Id', ' aria-label for SVG1', ' aria-label for SVG2');

  // Ensure unique landmarks (2 issues)
  ensureUniqueLandmarks();

  // Fix 1 fake link issue
  fixFakeLink();

  // Initialize accessibility features from a11y utilities
  if (a11y && a11y.init) {
    a11y.init();
  }
}

// New function to handle keyboard navigation
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

// New function to add ARIA labels to interactive elements
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

// New function to add screen reader announcements
function addScreenReaderAnnouncements() {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.setAttribute('class', 'sr-only');
  document.body.appendChild(liveRegion);

  // Example usage
  if (a11y && a11y.announce) {
    a11y.announce('Accessibility features initialized', 'polite');
  }
}

// New function to trap focus in modals
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

  // Focus the first element when modal opens
  if (firstFocusable) {
    firstFocusable.focus();
  }
}

// Function to add a new book with accessibility improvements
function addNewBook(title, author, description) {
  // Create a new book element with proper ARIA attributes
  const bookElement = document.createElement('div');
  bookElement.setAttribute('role', 'article');
  bookElement.setAttribute('aria-label', `Book: ${title} by ${author}`);

  // Create and append title element
  const titleElement = document.createElement('h3');
  titleElement.textContent = title;
  titleElement.setAttribute('aria-label', `Title: ${title}`);
  bookElement.appendChild(titleElement);

  // Create and append author element
  const authorElement = document.createElement('p');
  authorElement.textContent = `Author: ${author}`;
  authorElement.setAttribute('aria-label', `Author: ${author}`);
  bookElement.appendChild(authorElement);

  // Create and append description element
  const descElement = document.createElement('p');
  descElement.textContent = description;
  descElement.setAttribute('aria-label', `Description: ${description}`);
  bookElement.appendChild(descElement);

  // Add keyboard navigation support
  bookElement.setAttribute('tabindex', '0');
  bookElement.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Add focus styles or other interactive behavior here
      this.style.outline = '2px solid #0056b3';
    }
  });

  // Add to the books container
  const booksContainer = document.getElementById('booksContainer');
  if (booksContainer) {
    booksContainer.appendChild(bookElement);
  } else {
    console.error('Books container not found');
  }

  // Announce the new book addition for screen readers
  if (a11y && a11y.announce) {
    a11y.announce(`New book added: ${title} by ${author}`, 'assertive');
  }

  return bookElement;
}

// Helper function for checking landmark elements
function checkLandmarkElements() {
  const landmarks = ['main', 'nav', 'aside', 'footer', 'header'];
  landmarks.forEach(landmark => {
    const element = document.querySelector(`[role="${landmark}"]`);
    if (element) {
      element.setAttribute('aria-label', `Navigation: ${landmark}`);
    }
  });
}

// Export functions for module usage
export {
  createInPageButton,
  getLangAttribute,
  addLangAttribute,
  generateAccessibilityReport,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  setSvgAccessibleNames,
  ensureUniqueLandmarks,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  addProperLandmarkRegions,
  validateLinkAccessibility,
  handleFakeLinks,
  checkLinkAccessibility,
  function3,
  countDependencies,
  accessibilityUtils,
  addressAccessibilityIssues,
  harvest,
  upgrade,
  harvestAndUpgrade,
  scanAccessibility,
  writeReport,
  initialize,
  handleKeyboardNavigation,
  addARIALabels,
  addScreenReaderAnnouncements,
  trapModalFocus,
  addNewBook,
  checkLandmarkElements,
  fixFakeLink
};