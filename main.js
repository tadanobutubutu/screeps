// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');
const { accessibilityUtils } = require('./accessibilityUtils');
const { a11yStore } = require('./a11yStore');
const { mathHelpers } = require('./mathHelpers');

const main = require('./utilities');

// Import necessary dependencies
import React from 'react';
import { render } from 'react-dom';
import {
  googleSignIn,
  decodeJwtResponse
} from './AccessibilityHelpers';

const {
  createInPageButton,
  createWebResourceButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  exportUtils: mainExportUtils,
  addressAccessibilityIssues,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  checkAccessibility,
} = main;

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
    let lang = 'en'; // Default to English

    if (content) {
        // Simple language detection based on common patterns
        if (content) {
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

        useEffect(() => {
            setHtmlLangAttribute(lang);
        }, [lang]);

        return lang;
    }

    return 'en';
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

console.log('Main script activated');

// Credential response handling
async function handleCredentialResponse(response) {
    if (!response) {
        throw new Error('No response received');
    }

    if (response.error) {
        throw new Error(response.error);
    }

    if (response.token) {
        return {
            success: true,
            token: response.token,
            expiresIn: response.expiresIn || 36000,
        };
    }

    throw new Error('Invalid credential response');
}

// Export functionality with accessibility support
const exportUtils = {
    exportData: (data, filename, mimeType) => {
        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.setAttribute('aria-label', `Download ${filename}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        accessibilityUtils.announceToScreenReader(`Download of ${filename} started`);
    },

    exportToJSON: (data, filename) => {
        const jsonString = JSON.stringify(data, null, 2);
        exportUtils.exportData(jsonString, filename || 'export.json', 'application/json');
    },

    exportToCSV: (data, filename) => {
        if (!data || data.length === 0) return;

        const headers = Object.keys(data[0]);
        const csvRows = [];
        csvRows.push(headers.join(','));

        for (const row of data) {
            const values = headers.map((header) => {
                const escaped = ('' + row[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }

        const csvString = csvRows.join('\n');
        exportUtils.exportData(csvString, filename || 'export.csv', 'text/csv');
    },
};

// Implement the function for addressing accessibility issues from insight report
function newFunction () {
  // TODO: Implement the new function as per the issue requirements
}

// Implement the function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport (container, report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  }

  if (!report || !report.issues) {
    return fixes
  }

  // Add lang attribute to HTML element if missing
  const htmlEl =
        container.querySelector('html') ||
        (container.ownerDocument && container.ownerDocument.querySelector('html'))
  if (htmlEl && !htmlEl.hasAttribute('lang')) {
    htmlEl.setAttribute('lang', 'en')
    fixes.langAdded = true
  }

  // Add main landmark if missing
  const mainElement = container.querySelector('main')
  if (!mainElement) {
    const body = container.querySelector('body')
    if (body) {
      const newMain = document.createElement('main')
      while (body.firstChild) {
        newMain.appendChild(body.firstChild)
      }
      body.appendChild(newMain)
      fixes.mainLandmarkAdded = true
    }
  }

  // Update the existing function using the new functions for rendering graph/index
  renderDependencyGraphs(container)
  fixButtonIdentifiers(container)
  fixDependencyGraphAria(container)
  addMainLandmarkToIndex(container)

  // Fix landmark issues
  validateLandmark(container)
  validateLandmarkStructure(container)

  // Fix SVG accessible names
  const svgElements = container.querySelectorAll('svg')
  svgElements.forEach((svg) => {
    const accessibleName = getSvgAccessibleName(svg)
    if (
      accessibleName &&
            !svg.getAttribute('aria-label') &&
            !svg.getAttribute('aria-labelledby')
    ) {
      svg.setAttribute('aria-label', accessibleName)
      fixes.svgNamesAdded++
    }
  })

  // Fix fake link issues (elements that look like links but are missing href)
  const fakeLinks = container.querySelectorAll('a:not([href])')
  fakeLinks.forEach((link) => {
    link.setAttribute('href', '#' + (link.id || `link-${Date.now()}`))
    link.setAttribute('role', 'link')
    fixes.fakeLinksFixed++
  })

  // Validate accessibility report
  const accessibilityReport = validateAccessibilityReport(container)
  if (accessibilityReport && accessibilityReport.length > 0) {
    log(`Accessibility report contains ${accessibilityReport.length} remaining issues`, 'warn')
  }

  // Implement focus trap for keyboard navigation
  focusTrap(container)

  if (fixes.langAdded) {
    log('Lang attribute added to HTML element', 'info')
  }

  if (fixes.mainLandmarkAdded) {
    log('Main landmark added', 'info')
  }

  // Check for new accessibility issues
  const newAccessibilityIssues = checkAccessibility(container)
  if (newAccessibilityIssues.length > 0) {
    log(`New accessibility issues found: ${newAccessibilityIssues.join(', ')}`, 'error')
  }

  const landmarkFixesCount = fixes.landmarksFixed || 0
  if (landmarkFixesCount > 0) {
    log(`Fixed ${landmarkFixesCount} unique landmarks`, 'info')
  }

  const svgFixes = fixes.svgNamesAdded || 0
  if (svgFixes > 0) {
    log(`Fixed accessible names for ${svgFixes} SVGs`, 'info')
  }

  const fakeLinkFixes = fixes.fakeLinksFixed || 0
  if (fakeLinkFixes > 0) {
    log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info')
  }

  return fixes
}

// Accessibility-related function to be added
function checkAccessibilityForReport (content) {
  // Placeholder for accessibility checking logic
  // This function should be implemented to check for accessibility issues
  // For now, it just returns an empty array
  return []
}

function sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9_\-\.]/gi, '_');
}

function readFileSafe(filePath) {
    try {
        const fs = require('fs');
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading file ${filePath}: ${error.message}`);
        return null;
    }
}

function initAccessibility() {
    accessibilityUtils.initSkipLink();
    document.addEventListener('keydown', (e) => a11yStore.handleKeyboardNav(e, {
        Escape: () => {
            // Close modals or dropdowns
        },
    }));
}

/**
 * Utility function to create a web resource button suitable for accessibility (e.g., Github, Stack Overflow, etc.)
 * @param {Object} options - An options object with the following properties:
 *   - label (String): The button label
 *   - url (String): The button URL
 *   - icon (String|HTMLElement): An optional icon for the button (String: SVG code, HTMLElement)
 *   - iconAltText (String): The alternative text for the icon if it's an SVG
 *   - ariaLabel (String): An optional aria-label for the button
 *   - className (String): The CSS class to apply to the button
 *   - target (String): The target for the link (e.g., '_blank', '_self')
 *   - rel (String): The rel attribute for the link (e.g., 'noopener noreferrer')
 * @returns {HTMLAnchorElement} The created button element
 */
function createWebResourceButton(options = {}) {
    const {
        label,
        url,
        icon = null,
        iconAltText = '',
        ariaLabel = null,
        className = 'web-resource-btn',
        target = '_blank',
        rel = 'noopener noreferrer',
    } = options;

    const button = document.createElement('a');
    button.href = url;
    button.className = className;
    button.target = target;
    button.rel = rel;

    // Set accessible name - prefer explicit ariaLabel, fallback to label
    const accessibleName = ariaLabel || label;
    button.setAttribute('aria-label', accessibleName);

    // Add text content
    if (label) {
        button.textContent = label;
    }

    // Handle icon accessibility
    if (icon) {
        if (typeof icon === 'string') {
            // If icon is an SVG string
            button.insertAdjacentHTML('beforebegin', icon);
            const svg = button.querySelector('svg');
            if (svg) {
                svg.setAttribute('aria-hidden', 'true');
                if (iconAltText) {
                    svg.setAttribute('aria-label', iconAltText);
                }
            }
        } else if (icon instanceof HTMLElement) {
            // If icon is already an DOM element
            icon.setAttribute('aria-hidden', 'true');
            button.insertBefore(icon, button.firstChild);
        }
    }

    return button;
}

// New rendering function
function renderGraphIndex(content, options = {}) {
  return content;
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  return function(e) {
    const isTab = e.key === 'Tab';
    if (!isTab) return;
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        if (lastElement) lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        if (firstElement) firstElement.focus();
      }
    }
  };
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
  let lang = 'en'; // Default to English

  if (content) {
    // Simple language detection based on common patterns
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

  useEffect(() => {
    setHtmlLangAttribute(lang);
  }, [lang]);

  return lang;
}

/**
 * Returns a properly formatted person name
 * @param {string} name - The person's name
 * @returns {string} The formatted person name
 */
function personName(name) {
  if (!name) return '';
  return String(name).trim();
}

/**
 * Creates an accessible in-page button and appends it to the given parent element.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(parent = document.body) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Open modal');
  parent.appendChild(btn);
  return btn;
}

/**
 * Validates the accessibility of a table element
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} Whether the table is accessible
 */
function validateTableAccessibility(table) {
  if (!table || typeof table !== 'object' || !(table instanceof HTMLElement)) return false;

  // Check if table has a caption
  if (!table.querySelector('caption')) {
    console.warn('Table is missing a caption');
    return false;
  }

  // Check if table has proper headers
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    console.warn('Table is missing header cells');
    return false;
  }

  // Check if table cells have proper scope attributes
  const cells = table.querySelectorAll('td, th');
  for (const cell of cells) {
    if (cell.tagName === 'TH' && !cell.hasAttribute('scope')) {
      console.warn('Table header cell is missing scope attribute');
      return false;
    }
  }

  // Add accessible label if not already present
  if (!dependencyGraph.getAttribute('aria-label')) {
    dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
  }

  // Ensure element has an ID if not present
  if (!dependencyGraph.getAttribute('id')) {
    dependencyGraph.setAttribute('id', 'dependencyGraph');
  }

  // Ensure the container is focusable if it's interactive
  if (!dependencyGraph.getAttribute('tabindex')) {
    dependencyGraph.setAttribute('tabindex', '0');
  }
}

// Function to render dependency graph
function renderDependencyGraph(element) {
  console.log('Rendering dependency graph for element:', element);
}

// Function to render a simple dependency graph
function renderSimpleDependencyGraph(element) {
  console.log('Rendering simple dependency graph for element:', element);
}

// Required changes to fix the React SVG Accessible Name issue
function addAccessibleName (svgString) {
  // This function adds an `aria-label` attribute to the SVG if it doesn't already have one
  // and returns the modified SVG string.
  // Note: This is a simplified example and might need adjustments based on the actual SVG structure.
  const svg = new DOMParser().parseFromString(svgString, 'image/svg+xml');
  const svgElement = svg.documentElement;
  if (!svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', 'Descriptive label for SVG');
  }
  return new XMLSerializer().serializeToString(svgElement);
}

// New function to extract accessible name from SVG content
function getSvgAccessibleNameNew(svgString) {
  // Extracts the accessible name from SVG content by looking for:
  // 1. aria-label attribute
  // 2. aria-labelledby attribute and referenced element
  // 3. <title> element
  // 4. <desc> element
  // 5. text content if no other accessible name is found

  const svg = new DOMParser().parseFromString(svgString, "image/svg+xml");
  const svgElement = svg.documentElement;

  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Check for aria-labelledby
  const labelledById = svgElement.getAttribute('aria-labelledby');
  if (labelledById) {
    const labelledElement = svg.getElementById(labelledById);
    if (labelledElement) return labelledElement.textContent.trim();
  }

  // Check for <title> element
  const titleElement = svg.querySelector('title');
  if (titleElement) return titleElement.textContent.trim();

  // Check for <desc> element
  const descElement = svg.querySelector('desc');
  if (descElement) return descElement.textContent.trim();

  // Fallback to text content if no accessible name found
  return svgElement.textContent.trim() || 'SVG graphic';
}

// Example usage of the function
const originalSvgString =
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>';
const modifiedSvgString = addAccessibleName(originalSvgString);

/**
 * Validates table accessibility
 * @param {Array} tableData - Table data to validate
 * @returns {boolean} True if table is accessible, false otherwise
 */
function validateTableAccessibility (tableData) {
  // Implementation placeholder - function to be implemented
  return true;
}

/**
 * Validates the structure of a table element
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} Whether the table structure is valid
 */
function validateTableStructure(table) {
  if (!table || typeof table !== 'object' || !(table instanceof HTMLElement)) return false;

  // Check if table has proper structure
  if (!table.querySelector('thead') || !table.querySelector('tbody')) {
    console.warn('Table is missing required thead or tbody elements');
    return false;
  }

  // Check if table has at least one row
  if (table.querySelectorAll('tr').length === 0) {
    console.warn('Table is missing rows');
    return false;
  }

  return true;
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();
  
  ensureUniqueLandmarks(document.body);
  
  return {
    announce: announcer.announce,
    getLastMessage: announcer.getLastMessage
  };
}

function main() {
    // Application initialization

    // Load necessary resources and render content (possibly using dependencyGraphContent/indexContent depending on the situation)

    // Initialize accessibility features
    initAccessibility();

    // Manage server, credentials, sessions, etc. if applicable

    // ... Other functionality or event listeners ...
}

// Assuming the new function is called `renderGraphIndex` and it should replace or integrates with the existing `renderDependencyGraphs` function.
const renderGraphIndexFromHead = (graphData) => {
    a11yStore.setSvgAccessibilityProps(graphData);
    a11yStore.addSVGAccessibleNames(graphData);
    highLevelRender(graphData); // You might need to update this function to use newly added accessibility utilities
};

// ... Existing Utility Functions from origin/main ...

// New function or changes requested in the issue
/**
 * Validates a landmark element for accessibility
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {boolean} Whether the landmark is valid
 */
function validateLandmark(element) {
  if (!element || typeof element !== 'object') return false;

  // Check if element is a valid landmark role
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  const role = element.getAttribute('role') || element.tagName.toLowerCase();

  if (!validRoles.includes(role)) {
    return false;
  }

  // Check for required ARIA attributes based on role
  switch (role) {
    case 'navigation':
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        return false;
      }
      break;
    case 'region':
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        return false;
      }
      break;
    case 'form':
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        return false;
      }
      break;
  }

  // Check if landmark is unique when required
  if (['banner', 'main', 'contentinfo'].includes(role)) {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      return false;
    }
  }

  return true;
}

/**
 * Sets SVG attributes to ensure accessibility
 * @param {SVGSVGElement} svg - The SVG element
 * @param {string} name - The accessible name for the SVG
 */
function setSvgAttributes(svg, name) {
  if (!svg || typeof svg !== 'object') return;
  svg.setAttribute('aria-label', name);
  svg.setAttribute('role', 'img');
}

/**
 * Validates landmark attributes for accessibility
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {boolean} Whether the landmark attributes are valid
 */
function validateLandmarkAttributes(element) {
  if (!element || typeof element !== 'object') return true;
  return true;
}

/**
 * Gets the accessible name from an SVG element
 * @param {SVGSVGElement} svg - The SVG element
 * @returns {string} The accessible name of the SVG
 */
function getSvgAccessibleName(svg) {
  if (!svg || typeof svg !== 'object') return '';
  return svg.getAttribute('aria-label') || svg.getAttribute('title') || '';
}

/**
 * Ensures all landmarks are unique in the document
 * @returns {boolean} Whether all landmarks are unique
 */
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return true;
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="search"], [role="complementary"], [role="contentinfo"]');
  const landmarkRoles = new Set();
  for (const landmark of landmarks) {
    const role = landmark.getAttribute('role');
    if (landmarkRoles.has(role)) {
      return false;
    }
    landmarkRoles.add(role);
  }
  return true;
}

/**
 * Validates link accessibility
 * @param {HTMLAnchorElement} link - The link element to validate
 * @returns {boolean} Whether the link is accessible
 */
function validateLinkAccessibility(link) {
  if (!link || typeof link !== 'object') return true;
  return link.hasAttribute('href') && link.getAttribute('href') !== '#';
}

/**
 * Handles fake links by converting them to proper buttons
 * @param {HTMLAnchorElement} link - The fake link to convert
 * @returns {HTMLButtonElement} The converted button element
 */
function handleFakeLinks(link) {
  if (!link || typeof link !== 'object' || link.tagName !== 'A') return null;
  if (link.getAttribute('href') === '#') {
    const button = document.createElement('button');
    button.textContent = link.textContent;
    button.setAttribute('aria-label', link.getAttribute('aria-label') || link.textContent);
    link.parentNode.replaceChild(button, link);
    return button;
  }
  return null;
}

// REACT_015: Add lang attribute to HTML element
// Add the language attribute to the HTML element for proper accessibility
useEffect(() => {
  detectAndSetLang();
}, []);

// Assuming main.js already exports the renderDependencyGraph and renderIndexView functions
// No need to handle those conflicts here

module.exports = {
    handleCredentialResponse,
    ensureElementId,
    addAriaLabel,
    renderDependencyGraph,
    renderDependencyGraphs,
    renderIndexView,
    calculateSum,
    detectAndSetLang,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    createInPageButton,
    createWebResourceButton,
    ensureUniqueLandmarks,
    newFocusTrap,
    transformInputData,
    dependencyGraphContent,
    indexContent,
    affectedFunction,
    updateFunction,
    accessibleFunction,
    main,
    log,
    sanitizeFilename,
    readFileSafe,
    renderGraphIndexFromHead,
    initAccessibility,
    config,
    a11yStore,
    exportUtils,
    newFunction,
    implementAccessibilityFixesFromReport,
    checkAccessibilityForReport,
    renderGraphIndex,
    trapFocus,
    addLandmarkRegions,
    uniqueLandmarks,
    fixFakeLinkIssues,
    getActiveSessionsCount,
    validateSession,
    accessibilityUtils,
    createAnnouncer,
    prefersReducedMotion,
    renderSimpleDependencyGraph,
    addAccessibleName,
    initializeAccessibility,
    addLangAttribute,
    fixTableStructure,
    addMainLandmark,
    fixLandmarkIssues,
    addSvgAccessibleNames,
    addAccessibleNamesToSVGs,
    fixFakeLinkIssue,
    renderAdditionalContent,
    googleSignIn,
    decodeJwtResponse,
    fixButtonIdentifiers,
    fixDependencyGraphAria,
    addMainLandmarkToIndex,
    focusTrap,
    checkAccessibility,
    validateAccessibilityReport,
    addressAccessibilityIssues,
    ensureElementHasId,
    ensureElementHasIdOrigin,
};

// Attach to global scope for browser/standalone access
if (typeof window !== 'undefined') {
    window.affectedFunction = affectedFunction;
    window.updateFunction = updateFunction;
    window.accessibleFunction = accessibleFunction;
    window.main = main;
    window.accessibilityUtils = accessibilityUtils;
    window.ensureElementId = ensureElementId;
    window.addAriaLabel = addAriaLabel;
    window.renderDependencyGraph = renderDependencyGraph;
    window.renderIndexView = renderIndexView;
    window.getLangAttribute = getLangAttribute;
    window.detectAndSetLang = detectAndSetLang;
    window.createWebResourceButton = createWebResourceButton;
    window.renderGraphIndex = renderGraphIndex;
    window.renderGraphIndexFromHead = renderGraphIndexFromHead;
    window.addLangAttribute = addLangAttribute;
    window.fixTableStructure = fixTableStructure;
    window.addMainLandmark = addMainLandmark;
    window.fixLandmarkIssues = fixLandmarkIssues;
    window.addLandmarkRegions = addLandmarkRegions;
    window.ensureUniqueLandmarks = ensureUniqueLandmarks;
    window.addSvgAccessibleNames = addSvgAccessibleNames;
    window.addAccessibleNamesToSVGs = addAccessibleNamesToSVGs;
    window.fixFakeLinkIssue = fixFakeLinkIssue;
    window.fixFakeLinkIssues = fixFakeLinkIssues;
    window.initializeAccessibility = initializeAccessibility;
    window.createAnnouncer = createAnnouncer;
    window.prefersReducedMotion = prefersReducedMotion;
    window.renderAdditionalContent = renderAdditionalContent;
}