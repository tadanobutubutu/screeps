import React from 'react';

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// _Commit: b8888a21083c89f599fb68eef1dc4d5df1051e52_
// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->
// _Commit: c2d57306a2943dfa0dba6093d0517acd3e5672ca_
// <!-- todo-hash: f863d4968b6ba99c88ed9bf7a41317f7f788cc95 -->

// Implement the function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport(container, report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  if (!report || !report.issues) {
    return fixes;
  }

  // Fix lang attribute on HTML element
  if (report.issues.missingLang) {
    const htmlElement = container.querySelector('html') || container.ownerDocument?.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
      fixes.langAdded = true;
    }
  }

  // Add main landmark if missing
  if (report.issues.missingMainLandmark) {
    const mainElements = container.querySelectorAll('main, [role="main"]');
    if (mainElements.length === 0) {
      // Try to convert the first section to main
      const firstSection = container.querySelector('section');
      if (firstSection) {
        // Create a new main element and move content into it
        const mainElement = container.ownerDocument.createElement('main');
        while (firstSection.firstChild) {
          mainElement.appendChild(firstSection.firstChild);
        }
        firstSection.parentNode.insertBefore(mainElement, firstSection);
        firstSection.remove();
        fixes.mainLandmarkAdded = true;
      }
    }
  }

  // Fix landmarks by ensuring proper roles and accessible names
  if (report.issues.landmarkIssues && Array.isArray(report.issues.landmarkIssues)) {
    const uniqueLandmarksFixed = new Set();

    report.issues.landmarkIssues.forEach(issue => {
      if (issue.selector && !uniqueLandmarksFixed.has(issue.selector)) {
        const element = container.querySelector(issue.selector);
        if (element) {
          // Add accessible name if missing
          if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
            const role = element.getAttribute('role') || element.tagName.toLowerCase();

            // Try to get label from surrounding context
            const previousSibling = element.previousElementSibling;
            if (previousSibling && previousSibling.textContent.trim()) {
              const labelId = `landmark-label-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              const labelSpan = container.ownerDocument.createElement('span');
              labelSpan.id = labelId;
              labelSpan.textContent = previousSibling.textContent.trim();
              labelSpan.style.display = 'none';
              element.parentNode.insertBefore(labelSpan, element);
              element.setAttribute('aria-labelledby', labelId);
            } else {
              // Use role as fallback label
              const roleLabel = role.charAt(0).toUpperCase() + role.slice(1).replace(/[^a-zA-Z]/g, ' ');
              element.setAttribute('aria-label', roleLabel);
            }
            uniqueLandmarksFixed.add(issue.selector);
            fixes.landmarksFixed++;
          }
        }
      }
    });
  }

  // Add accessible names to SVGs
  if (report.issues.svgIssues && Array.isArray(report.issues.svgIssues)) {
    report.issues.svgIssues.forEach(issue => {
      const svg = container.querySelector(issue.selector);
      if (svg && svg.tagName.toLowerCase() === 'svg') {
        // Check if SVG already has an accessible name
        if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
          // Look for a title element within the SVG
          let titleElement = svg.querySelector('title');

          if (!titleElement) {
            // Create a title element
            titleElement = container.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'title');
            const titleId = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            titleElement.id = titleId;
            titleElement.textContent = issue.suggestedName || 'Decorative SVG';

            // Insert title as first child of SVG
            if (svg.firstChild) {
              svg.insertBefore(titleElement, svg.firstChild);
            } else {
              svg.appendChild(titleElement);
            }

            svg.setAttribute('aria-labelledby', titleId);
            fixes.svgNamesAdded++;
          }
        }
      }
    });
  }

  // Fix fake links (elements that look like links but aren't)
  if (report.issues.fakeLinkIssues && Array.isArray(report.issues.fakeLinkIssues)) {
    const uniqueFakeLinksFixed = new Set();

    report.issues.fakeLinkIssues.forEach(issue => {
      if (issue.selector && !uniqueFakeLinksFixed.has(issue.selector)) {
        const element = container.querySelector(issue.selector);
        if (element) {
          // Check if this element should be a link or a button
          const isNavigation = element.closest('nav') !== null;

          if (isNavigation || element.tagName.toLowerCase() === 'a') {
            // Convert to proper link with href
            if (!element.hasAttribute('href')) {
              element.setAttribute('href', '#' + (element.id || `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`));
              element.setAttribute('role', 'link');
              uniqueFakeLinksFixed.add(issue.selector);
              fixes.fakeLinksFixed++;
            }
          } else {
            // Convert to button
            element.setAttribute('role', 'button');
            if (!element.hasAttribute('tabindex')) {
              element.setAttribute('tabindex', '0');
            }
            uniqueFakeLinksFixed.add(issue.selector);
            fixes.fakeLinksFixed++;
          }
        }
      }
    });
  }

  return fixes;
}

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English
  
  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[一-鿿]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[぀-ヿ]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[Ѐ-ӿ]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[؀-ۿ]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôùûüÿœæ]+/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]+/i.test(content)) {
      lang = 'de'; // German
    }
  }

  setHtmlLangAttribute(lang);
  return lang;
}

/**
 * Get language attribute for HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

/**
 * Validate table structure for accessibility
 * @param {HTMLElement} tableElement - The table element to validate
 * @returns {Object} Validation result
 */
function validateTableStructure(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found'] };
  }
  
  const errors = [];
  const rows = tableElement.querySelectorAll('tr');
  
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    const cellCount = cells.length;
    
    // Check for empty cells
    cells.forEach((cell, cellIndex) => {
      if (!cell.textContent.trim()) {
        errors.push(`Row ${rowIndex + 1}, Cell ${cellIndex + 1} is empty`);
      }
    });
    
    // Check that rows have consistent cell counts
    if (rowIndex > 0) {
      const prevRow = rows[rowIndex - 1];
      const prevCells = prevRow.querySelectorAll('td, th');
      if (cellCount !== prevCells.length) {
        errors.push(`Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length} in previous row)`);
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_027: Fix table structure issues
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }
  
  const errors = [];
  
  // Check if table has proper structure
  if (!tableElement.querySelector('thead')) {
    errors.push('Table is missing <thead> element');
  }
  
  if (!tableElement.querySelector('tbody')) {
    errors.push('Table is missing <tbody> element');
  }
  
  // Check for th elements in thead
  const thead = tableElement.querySelector('thead');
  const thElements = thead ? thead.querySelectorAll('th') : [];
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements');
  }
  
  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });
  
  // Check for proper caption or summary
  const hasCaption = tableElement.querySelector('caption');
  const hasSummary = tableElement.getAttribute('aria-describedby');
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate landmark structure
 * @returns {Object} Validation result
 */
function validateLandmarkStructure() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  
  const errors = [];
  
  // Check for multiple main landmarks
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    errors.push(`Multiple main landmarks found (${mainElements.length}). Only one main landmark should exist.`);
  }
  
  // Check for proper nesting of landmarks
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section, article, [role]');
  landmarks.forEach((landmark) => {
    const parent = landmark.parentElement;
    while (parent) {
      const parentTag = parent.tagName ? parent.tagName.toLowerCase() : '';
      const parentRole = parent.getAttribute('role');
      
      // Check for invalid nesting
      if (parentTag === 'header' && landmark.tagName && landmark.tagName.toLowerCase() === 'header') {
        errors.push('Nested header elements found');
      }
      if (parentTag === 'footer' && landmark.tagName && landmark.tagName.toLowerCase() === 'footer') {
        errors.push('Nested footer elements found');
      }
      
      parent = parent.parentElement;
    }
  });
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate landmark uniqueness
 * @returns {Object} Validation result
 */
function validateLandmark() {
  const errors = [];
  const landmarks = ['navigation', 'search', 'main', 'contentinfo', 'complementary', 'form'];
  const usedLandmarks = new Set();

  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
    if (elements.length > 1) {
      errors.push(`Multiple elements with role="${landmark}" found`);
    }
    if (elements.length > 0) {
      usedLandmarks.add(landmark);
    }
  });

  if (usedLandmarks.size < landmarks.length) {
    errors.push('Not all required landmarks are present');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get accessible name for SVG element
 * @param {HTMLElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  if (svg.getAttribute('aria-label')) {
    return svg.getAttribute('aria-label');
  }
  if (svg.getAttribute('aria-labelledby')) {
    const labelId = svg.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(labelId);
    return labelElement ? labelElement.textContent : '';
  }
  if (svg.querySelector('title')) {
    return svg.querySelector('title').textContent;
  }
  return 'SVG graphic';
}

// New function to address REACT_041: Add accessible names to SVGs
function getSvgAccessibleNameAdvanced(svgElement) {
  if (typeof document === 'undefined' || !svgElement) {
    return null;
  }
  
  // Check for aria-label
  let accessibleName = svgElement.getAttribute('aria-label');
  if (accessibleName) return accessibleName;
  
  // Check for aria-labelledby referencing another element
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent;
  }
  
  // Check for title element inside SVG
  const title = svgElement.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
  // Check for desc element inside SVG
  const desc = svgElement.querySelector('desc');
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim();
  }
  
  return null;
}

function validateSvgAccessibility() {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  
  const errors = [];
  const svgs = document.querySelectorAll('svg');
  
  svgs.forEach((svg, index) => {
    const name = getSvgAccessibleNameAdvanced(svg) || getSvgAccessibleName(svg);
    if (!name) {
      errors.push(`SVG ${index + 1} is missing accessible name`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  
  const errors = [];
  const landmarkTypes = ['header', 'nav', 'main', 'aside', 'footer'];
  
  landmarkTypes.forEach((type) => {
    const elements = document.querySelectorAll(type);
    const labeledElements = document.querySelectorAll(`[role="${type}"]`);
    const total = elements.length + labeledElements.length;
    
    if (total > 1 && type !== 'nav' && type !== 'aside') {
      errors.push(`Multiple ${type} landmarks found (${total}). Consider using unique aria-labels to differentiate them.`);
    } else if (total > 1) {
      // For nav and aside, multiple are allowed but must have unique labels
      const allElements = [...elements, ...labeledElements];
      const labels = allElements.map(el => el.getAttribute('aria-label') || el.getAttribute('aria-labelledby'));
      const uniqueLabels = new Set(labels.filter(l => l));
      if (uniqueLabels.size < total) {
        errors.push(`Multiple ${type} landmarks found without unique aria-labels`);
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}

const addAriaLabel = (element, label) => {
  if (element) {
    element.setAttribute('aria-label', label);
  }
  return element;
};

const renderDependencyGraph = (data) => {
  // Implementation for rendering dependency graphs
  return {
    nodes: data.nodes || [],
    edges: data.edges || []
  };
};

/**
 * Ensure an element has an id, generating one if necessary.
 * @param {HTMLElement} element - The element to check/generate id for
 * @param {string} [prefix='element'] - Prefix for generated id
 * @returns {string} The element's id
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
}

function renderDependencyGraphs(container, dependencies, options = {}) {
  if (!container) {
    throw new Error('Container element is required');
  }

  if (!dependencies) {
    throw new Error('Dependencies data is required');
  }

  // Ensure container has an id for graph references
  const containerId = ensureElementHasId(container, 'graph-container');

  // Add accessibility label if not present
  const hasAriaLabel = addAriaLabel(container, `Dependency graph: ${containerId}`);

  return {
    containerId,
    accessible: hasAriaLabel,
    ...renderDependencyGraph(dependencies)
  };
}

/**
 * Trap focus within an element.
 * @param {HTMLElement} element - The element to trap focus within
 */
function focusTrap(element) {
  if (!element) return;

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  });
}

// New function to address REACT_036: Fix fake link issue
// Creates a button element with correct accessibility properties for in-page linking
/**
 * Creates a button element with correct accessibility properties for in-page linking
 * @param {string} text - The visible text content of the button
 * @param {string} targetId - The id of the target element to scroll/link to
 * @param {object} [options] - Additional options
 * @param {string} [options.ariaLabel] - Custom aria-label for the button
 * @param {string} [options.className] - CSS class name(s) to apply to the button
 * @returns {HTMLButtonElement|null} The created button element, or null if document is unavailable
 */
function createInPageButton(text, targetId, options) {
  if (typeof document === 'undefined') {
    return null;
  }
  
  const opts = options || {};
  const button = document.createElement('button');
  
  // Set the type explicitly to avoid form submission side effects
  button.type = 'button';
  
  // Set the accessible name
  button.setAttribute('aria-label', opts.ariaLabel || text);
  
  // Use aria-controls to indicate the element the button controls/links to
  if (targetId) {
    button.setAttribute('aria-controls', targetId);
  }
  
  // Set the text content
  button.textContent = text;
  
  // Apply optional className
  if (opts.className) {
    button.className = opts.className;
  }
  
  // Store the target id as a data attribute for handling clicks
  if (targetId) {
    button.setAttribute('data-target-id', targetId);
    
    // Attach a click handler that scrolls to the target and updates the URL hash
    button.addEventListener('click', function(event) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // Prevent default to allow smooth scrolling behavior to be controlled
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update the URL hash without jumping
        if (history && typeof history.pushState === 'function') {
          history.pushState(null, '', '#' + targetId);
        } else {
          window.location.hash = targetId;
        }
        // Move focus to the target element if it's focusable, otherwise set tabindex
        if (!targetElement.hasAttribute('tabindex')) {
          targetElement.setAttribute('tabindex', '-1');
        }
        targetElement.focus({ preventScroll: true });
      }
    });
  }
  
  return button;
}

function personName(name) {
  if (typeof name !== 'string') {
    return '';
  }
  return name.trim();
}

// Export all functions to make them available as module exports
export {
  implementAccessibilityFixesFromReport,
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateSvgAccessibility,
  ensureUniqueLandmarks,
  createInPageButton,
  personName
};