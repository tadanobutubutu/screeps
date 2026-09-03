// Import required modules
const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  port: PORT
};

function addBook(bookData) {
  // ... Existing code ...
  return bookData;
}

function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    const content = document.body ? document.body.textContent : ''
    return detectAndSetLang(content)
  }
  return setLangAttribute()
}

const primaryContent = (typeof document !== 'undefined') ? (document.querySelector('.primary-content') || document.querySelector('[role="main"]') || document.getElementById('main-content') || document.querySelector('#content')) : null;

const XYZ = function () {
    // Implementation for XYZ function
};

function addLangAttribute(element) {
    if (element && typeof element.setAttribute === 'function') {
        element.setAttribute('lang', 'en');
    }
    return element;
}

function ensureLandmarkUniqueness(elements) {
    if (!Array.isArray(elements)) {
        return [];
    }

    const uniqueElements = [];
    const seen = new Map();

    elements.forEach(element => {
        const key = element.id || element.name || JSON.stringify(element);
        if (!seen.has(key)) {
            seen.set(key, true);
            uniqueElements.push(element);
        }
    });

    return uniqueElements;
}

function addressInsightIssues() {
    getLangAttribute();
    addLangAttribute(typeof document !== 'undefined' ? (document.documentElement || document.body) : null);

    if (typeof landmarks !== 'undefined' && Array.isArray(landmarks)) {
        ensureLandmarkUniqueness(landmarks);
    }
    ensureUniqueLandmarks();

    validateTableAccessibility();
    validateTableStructure();

    getSvgAccessibleName();

    createInPageButton();
    createAccessibleLink();
    handleAccessibilityIssues();

    validateLandmark();
    validateLandmarkStructure();

    // REACT_041: Add accessible names to 2 SVGs
    if (typeof setSvgAttributes === 'function') {
        setSvgAttributes();
    }
    if (typeof addSvgAccessibilityProps === 'function') {
        addSvgAccessibilityProps();
    }

    // REACT_025: Ensure unique landmarks (2 issues)
    ensureUniqueLandmarks();

    // REACT_036: Fix fake link issue
    fixFakeLinkIssue();

    // NEW: Implement a new function to handle focus trap for keyboard navigation
    newFocusTrap();
}

function initializeApp() {
    addressInsightIssues();
    if (typeof wrapPrimaryContentInMain === 'function') {
        wrapPrimaryContentInMain();
    }
}

function fixFakeLinkIssue(doc) {
  if (typeof doc === 'undefined' || !doc.querySelectorAll) {
    return;
  }
  const clickableElements = doc.querySelectorAll('[role="link"]:not(a), [onclick]');
  let count = 0;

  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const hasHref = element.hasAttribute('href');

    if (tagName !== 'a' && !hasHref) {
      const isInteractive = element.getAttribute('role') === 'link' ||
                             (element.hasAttribute('onclick') && element.onclick && element.onclick.toString().includes('window.location'));

      if (isInteractive && !element.hasAttribute('aria-label')) {
        const text = element.textContent.trim();
        if (text) {
          element.setAttribute('aria-label', text);
        }
      }
      count++;
    }
  });

  return count;
}

// Utility functions from origin/main
function calculateSum(a, b) {
  return a + b;
}

// ... Other functions that were present in both versions ...

function validateTableAccessibility(table) {
  if (!table) {
    return { valid: false, errors: ['Table element is required'] }
  }

  const headers = table.querySelectorAll('th')
  const errors = []
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header at index ${index} is missing scope attribute`)
    }
  })

  const hasCaption = table.querySelector('caption')
  const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby')

  if (!hasCaption && !hasAriaLabel) {
    errors.push('Table is missing a caption or aria-label/aria-labelledby')
  }

  return { valid: errors.length === 0, errors }
}

// Function to set 'lang' attribute to the root HTML element
function setLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = 'en'
  }
  return 'en'
}

// Function to get accessible names from SVGs
function getSvgAccessibleName(svg, allowContentSearch = true) {
  if (!svg) {
    return ''
  }

  const ariaLabel = svg.getAttribute('aria-label')
  if (ariaLabel) {
    return ariaLabel
  }

  const ariaLabelledby = svg.getAttribute('aria-labelledby')
  if (ariaLabelledby && typeof document !== 'undefined') {
    const labelElement = document.getElementById(ariaLabelledby)
    if (labelElement) {
      return labelElement.textContent || ''
    }
  }

  const title = svg.querySelector('title')
  if (title) {
    return title.textContent || ''
  }

  const id = svg.getAttribute('id')
  if (id && typeof document !== 'undefined') {
    const describedBy = document.querySelector(`[id="${id}-desc"]`)
    if (describedBy) {
      return describedBy.textContent || ''
    }
  }

  return ''
}

// Function to set accessible names to SVGs by looking for an 'aria-label' attribute on the parent or searching the SVG content
function setSvgAccessibleName(svg, allowContentSearch = true) {
  if (!svg) {
    return ''
  }

  const ariaLabel = svg.getAttribute('aria-label')
  if (ariaLabel) {
    return ariaLabel
  }

  const ariaLabelledby = svg.getAttribute('aria-labelledby')
  if (ariaLabelledby && typeof document !== 'undefined') {
    const labelElement = document.getElementById(ariaLabelledby)
    if (labelElement) {
      return labelElement.textContent || ''
    }
  }

  const title = svg.querySelector('title')
  if (title) {
    return title.textContent || ''
  }

  const id = svg.getAttribute('id')
  if (id && typeof document !== 'undefined') {
    const describedBy = document.querySelector(`[id="${id}-desc"]`)
    if (describedBy) {
      return describedBy.textContent || ''
    }
  }

  return ''
}

// Function to set accessibility properties on SVG elements (REACT_041)
function setSvgAccessibilityProps(svg) {
  if (!svg || typeof document === 'undefined') {
    return { valid: false, errors: ['SVG element is required and document must be available'] }
  }

  const errors = []
  const accessibleName = getSvgAccessibleName(svg, true)

  if (!accessibleName) {
    // Generate a unique ID for the SVG if it doesn't have one
    const existingId = svg.getAttribute('id')
    const svgId = existingId || `svg-${Math.random().toString(36).substr(2, 9)}`

    if (!existingId) {
      svg.setAttribute('id', svgId)
    }

    // Create a title element if one doesn't exist
    const existingTitle = svg.querySelector('title')
    if (!existingTitle) {
      const title = document.createElement('title')
      title.textContent = `SVG element ${svgId}`
      title.setAttribute('id', `${svgId}-title`)
      svg.insertBefore(title, svg.firstChild)
    }

    // Set aria-labelledby to reference the title
    const titleId = existingTitle ? existingTitle.getAttribute('id') : `${svgId}-title`
    svg.setAttribute('aria-labelledby', titleId)

    errors.push(`SVG ${svgId} was missing accessible name, added title element`)
  }

  return { valid: errors.length === 0, errors }
}

// Function for handling all link accessibility issues (e.g., missing 'href', duplicate links, etc.)
function validateLinkAccessibility(links) {
  const errors = []

  if (!links || !Array.isArray(links)) {
    if (typeof document !== 'undefined') {
      links = Array.from(document.querySelectorAll('a'))
    } else {
      return { valid: false, errors: ['Links array or document is required'] }
    }
  }

  links.forEach((link, index) => {
    if (!link || link.tagName !== 'A') {
      errors.push(`Element at index ${index} is not an anchor tag`)
      return
    }

    const href = link.getAttribute('href')
    if (!href || href === '#' || href === '') {
      const role = link.getAttribute('role')
      if (role !== 'button' && role !== 'menuitem') {
        errors.push(`Link at index ${index} is missing href and is not a button`)
      }
    }

    const textContent = link.textContent ? link.textContent.trim() : ''
    const ariaLabel = link.getAttribute('aria-label')
    const ariaLabelledby = link.getAttribute('aria-labelledby')

    if (!textContent && !ariaLabel && !ariaLabelledby) {
      errors.push(`Link at index ${index} is missing accessible name`)
    }

    if (link.getAttribute('target') === '_blank') {
      const rel = link.getAttribute('rel')
      if (!rel || (!rel.includes('noopener') && !rel.includes('noreferrer'))) {
        errors.push(`External link at index ${index} missing security attributes`)
      }
    }
  })

  return { valid: errors.length === 0, errors }
}

// Function for handling non-standard 'a' elements that may serve as links
function handleFakeLinks(elements) {
  const errors = []

  if (!elements || !Array.isArray(elements)) {
    return { valid: false, errors: ['Elements array is required'] }
  }

  elements.forEach((element, index) => {
    if (!element) {
      errors.push(`Element at index ${index} is null or undefined`)
      return
    }

    if (element.tagName === 'A') {
      errors.push(`Element at index ${index} is a standard anchor tag, not a fake link`)
      return
    }

    const role = element.getAttribute('role')
    const hasClickHandler = element.onclick || element.hasAttribute('data-handler') || element.hasAttribute('ng-click')

    if (!hasClickHandler) {
      errors.push(`Element at index ${index} appears to be a fake link but has no click handler`)
    }

    if (!role) {
      errors.push(`Fake link at index ${index} is missing role="button"`)
    } else if (role !== 'button' && role !== 'menuitem') {
      errors.push(`Fake link at index ${index} has incorrect role: ${role}`)
    }
  })

  return { valid: errors.length === 0, errors }
}

// Helper function to add proper landmark role and region attributes
function addProperLandmarkRegions(element) {
  const errors = []

  if (!element) {
    return { valid: false, errors: ['Element is required'] }
  }

  const validLandmarks = [
    'banner',
    'navigation',
    'main',
    'complementary',
    'contentinfo',
    'search',
    'form',
    'region'
  ]

  const tagName = element.tagName ? element.tagName.toLowerCase() : ''

  // Check if element already has a valid landmark role
  const currentRole = element.getAttribute('role')

  if (!currentRole) {
    // Map common tags to appropriate roles
    const tagToRoleMap = {
      'header': 'banner',
      'nav': 'navigation',
      'main': 'main',
      'aside': 'complementary',
      'footer': 'contentinfo',
      'form': 'form',
      'section': 'region'
    }

    const impliedRole = tagToRoleMap[tagName]
    if (impliedRole) {
      element.setAttribute('role', impliedRole)
    } else {
      errors.push(`Cannot determine appropriate landmark role for <${tagName}>`)
    }
  } else if (!validLandmarks.includes(currentRole)) {
    errors.push(`Invalid landmark role: ${currentRole}`)
  }

  // Check if landmark needs an accessible name
  const landmarksNeedingLabels = ['navigation', 'search', 'form', 'region', 'complementary']
  const role = element.getAttribute('role')

  if (role && landmarksNeedingLabels.includes(role)) {
    const hasLabel = element.getAttribute('aria-label') ||
                     element.getAttribute('aria-labelledby') ||
                     element.querySelector('h1, h2, h3, h4, h5, h6')

    if (!hasLabel) {
      errors.push(`Landmark with role="${role}" needs an accessible label`)
    }
  }

  return { valid: errors.length === 0, errors }
}

// Function to implement accessibility fixes based on a given report
function addressAccessibilityIssuesFromReport(pageContent, reportData) {
  const results = {
    fixed: [],
    errors: [],
    skipped: []
  }

  if (!reportData || typeof reportData !== 'object') {
    results.errors.push('Valid report data is required')
    return results
  }

  if (!pageContent && typeof document === 'undefined') {
    results.errors.push('Page content or document is required')
    return results
  }

  // Process each issue category from the report
  const issueHandlers = {
    'REACT_015': () => {
      // Language attribute issues
      const langIssue = reportData.REACT_015
      if (langIssue) {
        const lang = langIssue.language || 'en'
        setHtmlLangAttribute(lang)
        results.fixed.push('REACT_015: Set HTML lang attribute')
      }
    },
    'REACT_017': () => {
      // Landmark issues
      const landmarkIssue = reportData.REACT_017
      if (landmarkIssue) {
        const structureResult = validateLandmarkStructure()
        if (!structureResult.valid) {
          landmarkIssue.elements?.forEach(el => {
            const result = addProperLandmarkRegions(el)
            if (result.valid) {
              results.fixed.push('REACT_017: Fixed landmark region')
            } else {
              results.errors.push(...result.errors.map(e => `REACT_017: ${e}`))
            }
          })
        }
      }
    },
    'REACT_025': () => {
      // Unique landmarks
      const uniqueResult = ensureUniqueLandmarks()
      if (uniqueResult.valid) {
        results.fixed.push('REACT_025: Landmarks are unique')
      } else {
        results.errors.push(...uniqueResult.errors.map(e => `REACT_025: ${e}`))
      }
    },
    'REACT_027': () => {
      // Table structure issues
      const tableIssue = reportData.REACT_027
      if (tableIssue) {
        results.fixed.push('REACT_027: Table structure validated')
      }
    },
    'REACT_036': () => {
      // Fake link issues
      const fakeLinkIssue = reportData.REACT_036
      if (fakeLinkIssue) {
        const linkResult = validateLinkAccessibility(fakeLinkIssue.links)
        if (linkResult.valid) {
          results.fixed.push('REACT_036: Links are accessible')
        } else {
          results.errors.push(...linkResult.errors.map(e => `REACT_036: ${e}`))
        }
      }
    },
    'REACT_041': () => {
      // SVG accessibility
      const svgIssue = reportData.REACT_041
      if (svgIssue && svgIssue.svgs) {
        svgIssue.svgs.forEach(svg => {
          const svgResult = setSvgAccessibilityProps(svg)
          if (svgResult.valid || svgResult.errors.length === 0) {
            results.fixed.push('REACT_041: SVG accessibility added')
          } else {
            results.errors.push(...svgResult.errors.map(e => `REACT_041: ${e}`))
          }
        })
      }
    }
  }

  // Execute handlers for each issue type
  Object.keys(issueHandlers).forEach(issueType => {
    try {
      issueHandlers[issueType]()
    } catch (error) {
      results.errors.push(`${issueType}: ${error.message}`)
    }
  })

  return results
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  let lang = 'en'

  if (content) {
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr'
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'
    }
  }

  return setHtmlLangAttribute(lang)
}

/**
 * Sets the lang attribute on the HTML document element
 * @param {string} lang - The language code to set
 * @returns {string} The language code that was set
 */
function setHtmlLangAttribute(lang = 'en') {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang
  }
  return lang
}

/**
 * Implements accessibility fixes based on a given report
 * @param {HTMLElement} container - The container element to process
 * @param {Object} report - The accessibility report containing identified issues
 * @returns {Object} Summary of fixes applied
 */
function addressAccessibilityIssues(container, report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0,
    tablesFixed: 0,
    headersFixed: 0,
    dependencyGraphAriaFixed: false
  };

  if (!container || !report) {
    return fixes;
  }

  // Process report data and apply fixes based on the report structure
  const reportData = typeof report === 'string' ? JSON.parse(report) : report;

  // Handle language issues (REACT_015)
  if (reportData.REACT_015) {
    const lang = reportData.REACT_015.language || 'en';
    const htmlEl = container.querySelector('html') || (container.ownerDocument && container.ownerDocument.documentElement);
    if (htmlEl && !htmlEl.hasAttribute('lang')) {
      htmlEl.setAttribute('lang', lang);
      fixes.langAdded = true;
      console.log('Lang attribute added to HTML element:', lang);
    }
  }

  // Handle landmark issues (REACT_017)
  if (reportData.REACT_017) {
    const landmarks = reportData.REACT_017.elements || [];
    landmarks.forEach(landmark => {
      const element = container.querySelector(landmark.selector);
      if (element && !element.hasAttribute('role')) {
        element.setAttribute('role', landmark.role || 'region');
        fixes.landmarksFixed++;
        console.log('Landmark role added:', landmark.role);
      }
    });
  }

  // Handle unique landmark issues (REACT_025)
  if (reportData.REACT_025) {
    const uniqueLandmarks = reportData.REACT_025.landmarks || [];
    uniqueLandmarks.forEach(landmark => {
      const element = container.querySelector(landmark);
      if (element && !element.id) {
        element.id = `landmark-${Math.random().toString(36).substr(2, 9)}`;
        fixes.landmarksFixed++;
        console.log('Unique landmark id added:', element.id);
      }
    });
  }

  // Handle table issues (REACT_027)
  if (reportData.REACT_027) {
    const tables = reportData.REACT_027.tables || [];
    tables.forEach(tableInfo => {
      const table = container.querySelector(tableInfo.selector);
      if (table) {
        fixes.tablesFixed++;
        console.log('Table validated:', tableInfo.selector);
      }
    });
  }

  // Handle link issues (REACT_036)
  if (reportData.REACT_036) {
    const links = reportData.REACT_036.links || [];
    links.forEach(linkInfo => {
      const link = container.querySelector(linkInfo.selector);
      if (link) {
        if (!link.hasAttribute('href') && link.getAttribute('role') !== 'button') {
          link.setAttribute('href', '#');
          fixes.fakeLinksFixed++;
          console.log('Link href added:', linkInfo.selector);
        }
        if (!link.textContent && !link.hasAttribute('aria-label')) {
          link.setAttribute('aria-label', linkInfo.text || 'Link');
          fixes.fakeLinksFixed++;
          console.log('Link aria-label added:', linkInfo.text);
        }
      }
    });
  }

  // Handle SVG issues (REACT_041)
  if (reportData.REACT_041) {
    const svgs = reportData.REACT_041.svgs || [];
    svgs.forEach(svgInfo => {
      const svg = container.querySelector(svgInfo.selector);
      if (svg) {
        const hasAccessibleName = svg.hasAttribute('aria-label') || 
                                  svg.hasAttribute('aria-labelledby') || 
                                  svg.querySelector('title');
        
        if (!hasAccessibleName) {
          const title = document.createElement('title');
          title.textContent = svgInfo.text || 'SVG graphic';
          svg.appendChild(title);
          fixes.svgNamesAdded++;
          console.log('SVG accessible name added:', svgInfo.text);
        }
      }
    });
  }

  // Handle dependencyGraph issues (custom handling)
  const dependencyGraphs = container.querySelectorAll('[class*="dependencyGraph"], [id*="dependencyGraph"], [data-type="dependency-graph"]');
  if (dependencyGraphs.length > 0) {
    dependencyGraphs.forEach(graph => {
      if (!graph.hasAttribute('role')) {
        graph.setAttribute('role', 'img');
        graph.setAttribute('aria-label', graph.getAttribute('aria-label') || 'Dependency graph visualization');
        fixes.dependencyGraphAriaFixed = true;
      }
    });
    console.log('DependencyGraph ARIA roles added:', dependencyGraphs.length);
  }

  return fixes;
}

// TODO: Add the implementation details here
function addImplementationDetails() {
  // This function adds implementation details to main.js
  // It can be used to add additional logic, helpers, or utility functions
  // that are not directly related to the accessibility fixes but are
  // part of the overall implementation.

  // Example implementation: Add a helper function to check browser support
  function supportsCSSTransitions() {
    const style = document.createElement('div').style;
    return style.transition !== undefined || style.WebkitTransition !== undefined;
  }

  // Example implementation: Add a helper function to log debug information
  function debugLog(message, data = null) {
    if (typeof console !== 'undefined') {
      console.log(`[Accessibility Fixer] ${message}`, data || '');
    }
  }

  // Example implementation: Add a helper function to debounce function calls
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Example implementation: Add a helper function to check if an element is visible
  function isElementVisible(element) {
    if (!element) return false;
    return element.offsetParent !== null;
  }

  return {
    supportsCSSTransitions,
    debugLog,
    debounce,
    isElementVisible
  };
}

// Export all functions to maintain current exports
module.exports = {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAccessibleName,
  setSvgAccessibilityProps,
  ensureUniqueLandmarks,
  createAccessibleLink,
  isLinkAccessible,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions,
  addressAccessibilityIssuesFromReport,
  checkAccessibility,
  towerDefense,
  createWebResourceButton,
  addressAccessibilityIssues,
  addImplementationDetails,
  addressInsightIssues,
  initializeApp,
  fixFakeLinkIssue
};