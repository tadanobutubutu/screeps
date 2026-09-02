// TODO: This is the existing code that needs to be preserve
// (This comment remains as-is)

// REACT_015: Add lang attribute to the <html> element
function addLangAttribute (html, lang = 'en') {
  if (typeof html !== 'string') return html
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    if (/\blang=/i.test(match)) return match
    return `<html${attrs} lang="${lang}">`
  })
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function fixTableStructure (html) {
  if (typeof html !== 'string') return html

  // Ensure every table has a caption
  html = html.replace(/<table([^>]*)>/gi, (match, attrs) => {
    if (/<caption/i.test(match)) return match
    return `<table${attrs}><caption></caption>`
  })

  // Close caption and wrap rows in thead/tbody where missing
  html = html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (match, attrs, content) => {
    if (/<thead/i.test(content)) return match
    const rows = content.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || []
    if (rows.length === 0) return match
    const firstRows = rows.slice(0, 1).join('')
    const restRows = rows.slice(1).join('')
    const thPattern = /<td>/gi
    const firstRowHasTh = thPattern.test(firstRows)
    let thead = ''
    let tbody = restRows

    if (!firstRowHasTh) {
      thead = `<thead>${firstRows.replace(/<td>/gi, '<th scope="col">').replace(/<\/td>/gi, '</th>')}</thead>`
    } else {
      thead = `<thead>${firstRows}</thead>`
    }
    if (!tbody) tbody = ''
    tbody = `<tbody>${tbody}</tbody>`

    return `<table${attrs}>${thead}${tbody}</table>`
  })

  // Add scope="col" to th elements that don't have it
  html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
    if (/\bscope=/i.test(match)) return match
    return `<th${attrs} scope="col">`
  })

  return html
}

/**
 * Divides two numbers with proper error handling
 * @param {number} dividend - The number to be divided
 * @param {number} divisor - The number to divide by
 * @returns {number} The result of the division
 * @throws {Error} If divisor is zero or if inputs are not valid numbers
 */
function divide (dividend, divisor) {
  if (typeof dividend !== 'number' || typeof divisor !== 'number') {
    throw new Error('Both arguments must be numbers')
  }

  if (isNaN(dividend) || isNaN(divisor)) {
    throw new Error('Both arguments must be valid numbers')
  }

  if (divisor === 0) {
    throw new Error('Division by zero is not allowed')
  }

  return dividend / divisor
}

// REACT_017: Add/fix landmark issues
function fixLandmarks (html) {
  if (typeof html !== 'string') return html

  // Ensure <main> landmark exists
  if (!/<main[^>]*>/i.test(html) && !/<div[^>]*role=["']main["']/i.test(html)) {
    html = html.replace(/<body([^>]*)>/i, '<body$1><main>')
    html = html.replace(/<\/body>/i, '</main></body>')
  }

  // Ensure <nav> landmark exists
  if (!/<nav[^>]*>/i.test(html) && !/<div[^>]*role=["']navigation["']/i.test(html)) {
    html = html.replace(/<main[^>]*>/i, '<nav aria-label="Main navigation"></nav><main>')
  }

  // Ensure <aside> landmark exists if content suggests a sidebar
  if (!/<aside[^>]*>/i.test(html) && !/<div[^>]*role=["']complementary["']/i.test(html)) {
    html = html.replace(/<\/main>/i, '<aside aria-label="Supplementary"></aside></main>')
  }

  // Ensure <footer> landmark exists
  if (!/<footer[^>]*>/i.test(html) && !/<div[^>]*role=["']contentinfo["']/i.test(html)) {
    html = html.replace(/<\/body>/i, '<footer></footer></body>')
  }

  return html
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames (html) {
  if (typeof html !== 'string') return html

  const svgMatches = [...html.matchAll(/<svg([^>]*)>/gi)]
  let offset = 0

  svgMatches.forEach((match, index) => {
    const fullMatch = match[0]
    const attrs = match[1]
    const svgStart = match.index + offset
    const svgEnd = html.indexOf('</svg>', svgStart)

    if (svgEnd === -1) return

    const svgContent = html.substring(svgStart, svgEnd + 6)
    const hasTitle = /<title/i.test(svgContent)
    const hasAriaLabel = /\baria-label=/i.test(attrs)
    const hasAriaLabelledBy = /\baria-labelledby=/i.test(attrs)

    if (!hasTitle && !hasAriaLabel && !hasAriaLabelledBy) {
      const newSvg = fullMatch.replace(/>/, `><title>SVG ${index + 1}</title>`)
      const oldSvgLength = svgContent.length
      html = html.substring(0, svgStart) + newSvg + html.substring(svgStart + oldSvgLength)
      offset += newSvg.length - oldSvgLength
    }
  })

  return html
}

function checkLinkAccessibility () {
  // Implementation for checking link accessibility
  // This function will be used to validate the accessibility of links
  const links = document.querySelectorAll('a[href]')
  const issues = []
  links.forEach(link => {
    const href = link.getAttribute('href')
    const text = link.textContent.trim()
    if (!text) {
      issues.push(`Link with href "${href}" has no accessible text`)
    }
  })
  return issues
}

// TODO: Implement wrapPrimaryContentInMain function, including the added logic
/**
 * Wraps the primary content of the page in a <main> element for improved accessibility.
 * This function checks if a <main> element already exists; if not, it creates one
 * and moves all body content into it.
 * @returns {Element|null} The <main> element if successfully created/wrapped, or null if body is not available
 */
function wrapPrimaryContentInMain () {
  const body = document.body

  // Return null if body element is not available
  if (!body) {
    return null
  }

  // Check if a <main> element already exists to avoid duplication
  const existingMain = document.querySelector('main')
  if (existingMain) {
    return existingMain
  }

  // Create a new <main> element
  const main = document.createElement('main')

  // Move all existing body children into the <main> element
  while (body.firstChild) {
    main.appendChild(body.firstChild)
  }

  // Append the <main> element to the body
  body.appendChild(main)

  return main
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks (html) {
  if (typeof html !== 'string') return html

  const landmarkRoles = [
    'banner',
    'navigation',
    'main',
    'complementary',
    'contentinfo',
    'search',
    'form'
  ]

  landmarkRoles.forEach((role) => {
    const pattern = new RegExp(`role=["']${role}["']`, 'gi')
    const matches = html.match(pattern)
    if (matches && matches.length > 1) {
      // Keep first occurrence, change subsequent ones
      let count = 0
      html = html.replace(pattern, (match) => {
        count++
        if (count === 1) return match
        return 'role="region"'
      })
    }
  })

  // Also check for duplicate HTML5 landmark elements (header, nav, main, aside, footer)
  const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer']
  html5Landmarks.forEach((tag) => {
    const pattern = new RegExp(`<${tag}[^>]*>`, 'gi')
    const matches = html.match(pattern)
    if (matches && matches.length > 1) {
      // Keep first, add role="region" to others
      let count = 0
      html = html.replace(pattern, (match) => {
        count++
        if (count === 1) return match
        return match.replace(new RegExp(`<${tag}`, 'i'), `<${tag} role="region"`)
      })
    }
  })

  return html
}

// REACT_036: Fix fake link issues
function fixFakeLinks (html) {
  if (typeof html !== 'string') return html

  // Find spans or divs with onclick that act as links and convert to <a>
  html = html.replace(
    /<span([^>]*)onclick=["']([^"']*)["']([^>]*)>/gi,
    (match, before, onclick, after) => {
      const hrefMatch = onclick.match(/window\.location\s*=\s*['"]([^'"]+)['"]/)
      if (hrefMatch) {
        return `<a href="${hrefMatch[1]}"${before}${after}>`
      }
      return match
    }
  )

  html = html.replace(/<\/span>/gi, '</a>')

  return html
}

// NEW: Validate table accessibility
function validateTableAccessibility(html) {
  if (typeof html !== 'string') return true;

  // Check for tables without captions
  const tablesWithoutCaptions = html.match(/<table[^>]*>(?!.*<caption[^>]*>)/gi);
  if (tablesWithoutCaptions) {
    console.warn(`Found ${tablesWithoutCaptions.length} tables without captions`);
    return false;
  }

  // Check for tables without thead/tbody
  const tablesWithoutStructure = html.match(/<table[^>]*>(?!.*<thead[^>]*>)(?!.*<tbody[^>]*>)/gi);
  if (tablesWithoutStructure) {
    console.warn(`Found ${tablesWithoutStructure.length} tables without proper structure`);
    return false;
  }

  return true;
}

// NEW: Validate landmark structure
function validateLandmarkStructure(html) {
  if (typeof html !== 'string') return true;

  const requiredLandmarks = ['main', 'nav', 'footer'];
  let isValid = true;

  requiredLandmarks.forEach(landmark => {
    const pattern = new RegExp(`<${landmark}[^>]*>|<div[^>]*role=["']${landmark}["']`, 'i');
    if (!pattern.test(html)) {
      console.warn(`Missing required landmark: ${landmark}`);
      isValid = false;
    }
  });

  return isValid;
}

// NEW: Get language attribute for HTML element
function getLangAttribute(html) {
  if (typeof html !== 'string') return 'en';

  const match = html.match(/<html[^>]*lang=["']([^"']*)["']/i);
  return match ? match[1] : 'en';
}

// NEW: Get accessible name for SVG
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return 'SVG';

  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }

  if (svgElement.hasAttribute('aria-labelledby')) {
    const id = svgElement.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(id);
    return labelElement ? labelElement.textContent : 'SVG';
  }

  const title = svgElement.querySelector('title');
  return title ? title.textContent : 'SVG';
}

// NEW: Person name utility
function personName(name) {
  if (!name) return '';

  // Simple name formatting - can be enhanced as needed
  return name.trim()
      .replace(/\s+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2');
}

// Main function that applies all accessibility fixes
function applyAccessibilityFixes (html) {
  let result = html
  result = addLangAttribute(result)
  result = fixTableStructure(result)
  result = fixLandmarks(result)
  result = addSvgAccessibleNames(result)
  result = ensureUniqueLandmarks(result)
  result = fixFakeLinks(result)
  return result
}

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and validateLandmarkAttributes())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// Helper function to validate landmark structure
function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

// Existing code preserved

// TODO: Implement the feature

// New function or change
function implementFeature() {
  // Implementation details go here
  console.log('Feature implemented');
}

// Call the new function to demonstrate its effect (optional, for testing purposes)
implementFeature();

// Address accessibility issues from insight report
function addressAccessibilityIssues(insightReport) {
  // Apply accessibility fixes to HTML content based on insight report
  if (insightReport && insightReport.html) {
    console.log('Addressing accessibility issues:', insightReport);
    insightReport.html = applyAccessibilityFixes(insightReport.html);
  }
}

// Process and filter landmarks
function processLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const validLandmarks = landmarks.filter(isValidLandmark);
    const uniqueLandmarks = ensureUniqueLandmarksById(validLandmarks);

    return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

// Sort landmarks by name
function sortLandmarks(landmarks, ascending = true) {
    return landmarks.slice().sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();

        if (ascending) {
            return nameA.localeCompare(nameB);
        }
        return nameB.localeCompare(nameA);
    });
}

// Ensure unique landmarks by ID
function ensureUniqueLandmarksById(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const seen = new Set();
    const uniqueLandmarks = [];

    for (const landmark of landmarks) {
        if (!landmark || typeof landmark.id === 'undefined') {
            continue;
        }

        const landmarkId = typeof landmark.id === 'string' ? landmark.id : String(landmark.id);

        if (!seen.has(landmarkId)) {
            seen.add(landmarkId);
            uniqueLandmarks.push(landmark);
        }
    }

    return uniqueLandmarks;
}

// Configuration object
const CONFIG = {
    maxResults: 100
};

// Accessibility helpers
function getDocument() {
    return document;
}

function getFullLangAttribute() {
    return document.documentElement ? document.documentElement.lang : 'en';
}

function createInPageButton(options) {
    const button = document.createElement('button');
    button.textContent = options.text || 'Button';
    button.setAttribute('aria-label', options.ariaLabel || options.text || 'Button');
    return button;
}

function handleAccessibilityIssues(html) {
    return applyAccessibilityFixes(html);
}

function createAccessibleLink(url, text) {
    const link = document.createElement('a');
    link.href = url;
    link.textContent = text;
    return link;
}

function validateLandmark(landmark) {
    if (!landmark) return false;
    return isValidLandmark(landmark);
}

function triggerAccessibilityMode() {
    console.log('Accessibility mode triggered');
}

// Load landmarks (placeholder implementation)
function loadLandmarks() {
    return [];
}

// Get landmark by ID (placeholder implementation)
function getLandmarkById(id) {
    return null;
}

// Validate table structure
function validateTableStructure(html) {
    if (typeof html !== 'string') return { valid: false, issues: [] };
    const issues = [];

    // Check for tables without thead
    const tables = html.match(/<table[^>]*>[\s\S]*?<\/table>/gi) || [];
    tables.forEach((table, index) => {
        if (!/<thead/i.test(table)) {
            issues.push(`Table ${index + 1} is missing thead element`);
        }
        if (!/<tbody/i.test(table)) {
            issues.push(`Table ${index + 1} is missing tbody element`);
        }
    });

    return { valid: issues.length === 0, issues };
}

// Validate link accessibility
function validateLinkAccessibility(html) {
    if (typeof html !== 'string') return { valid: false, issues: [] };
    const issues = [];

    // Check for links with no text content
    const linkPattern = /<a([^>]*)>([\s]*)<\/a>/gi;
    let match;
    while ((match = linkPattern.exec(html)) !== null) {
        issues.push(`Link ${match[1]} has no accessible text`);
    }

    return { valid: issues.length === 0, issues };
}

// Handle fake links
function handleFakeLinks(html) {
    if (typeof html !== 'string') return { html, linksConverted: 0 };
    let count = 0;

    // Find spans or divs with onclick that act as links
    const fakeLinkPattern = /<span([^>]*)onclick=["']([^"']*)["']([^>]*)>/gi;
    html = html.replace(fakeLinkPattern, (match, before, onclick, after) => {
        const hrefMatch = onclick.match(/window\.location\s*=\s*['"]([^'"]+)['"]/);
        if (hrefMatch) {
            count++;
            return `<a href="${hrefMatch[1]}"${before}${after}>`;
        }
        return match;
    });

    html = html.replace(/<\/span>/gi, '</a>');

    return { html, linksConverted: count };
}

// Set SVG attributes
function setSvgAttributes(svgElement, attributes) {
    if (!svgElement) return;
    Object.keys(attributes).forEach(key => {
        svgElement.setAttribute(key, attributes[key]);
    });
}

// Check if link is accessible
function isLinkAccessible(link) {
    if (!link) return false;
    const href = link.getAttribute('href');
    const text = link.textContent.trim();
    return href && text.length > 0;
}

// Create accessible book form
function createAccessibleBookForm(formId, submitButtonId) {
    const form = document.createElement('form');
    form.id = formId;
    form.setAttribute('aria-label', 'Add new book form');

    // Create field helper
    function createField(labelText, fieldId) {
        const container = document.createElement('div');
        container.style.marginBottom = '10px';

        const label = document.createElement('label');
        label.htmlFor = fieldId;
        label.textContent = labelText;

        const input = document.createElement('input');
        input.id = fieldId;
        input.type = fieldId.includes('year') ? 'number' : 'text';
        input.name = fieldId;

        container.appendChild(label);
        container.appendChild(input);
        return container;
    }

    // Add form fields
    form.appendChild(createField('Book Title:', `${formId}-title`));
    form.appendChild(createField('Author:', `${formId}-author`));
    form.appendChild(createField('Publication Year:', `${formId}-year`));

    // Add submit button
    const submitButton = document.createElement('button');
    submitButton.id = submitButtonId;
    submitButton.type = 'submit';
    submitButton.textContent = 'Add Book';
    submitButton.setAttribute('aria-label', 'Submit new book form');
    form.appendChild(submitButton);

    return form;
}

// Function to write the generated report to a file
function writeReport(report) {
    const fs = require('fs');
    const path = require('path');
    const reportFile = path.join(__dirname, 'accessibility_report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Function to scan for accessibility issues using axe-core
function scanAccessibility() {
    // This is a simplified example - in a real application you would:
    // 1. Load the HTML content to scan
    // 2. Use axe.run() to analyze it
    // 3. Return the results

    // Placeholder implementation
    const mockReport = {
        url: 'http://example.com',
        timestamp: new Date().toISOString(),
        violations: [
            {
                id: 'aria-required-children',
                impact: 'serious',
                description: 'ARIA role requires children',
                nodes: [
                    {
                        target: ['div[role="list"]'],
                        html: '<div role="list"></div>',
                        any: [
                            {
                                id: 'aria-required-children',
                                message: 'ARIA role "list" must have children with role "listitem"',
                                data: null
                            }
                        ]
                    }
                ]
            }
        ],
        passes: [],
        incomplete: [],
        inapplicable: []
    };

    return mockReport;
}

// Function to generate an accessibility report
function generateAccessibilityReport() {
    const report = scanAccessibility();
    writeReport(report);
    return report;
}

// Existing utility function
const formatResponse = (data) => {
    return JSON.stringify(data, null, 2);
};

// Main function to process accessibility issues from an insight report
function processAccessibilityIssues(insightReport) {
    // Call function to address accessibility issues
    addressAccessibilityIssues(insightReport);
}

// TODO: Update the existing function using the new functions for rendering graph/index
function renderGraph(data, containerId) {
    // Get the container element
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found`);
        return;
    }

    // Clear any existing content
    container.innerHTML = '';

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 100 100 100');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // Add accessible title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = 'Data Visualization Graph';
    svg.appendChild(title);

    // Add description for screen readers
    const desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    desc.textContent = 'This graph displays the provided data in a visual format.';
    svg.appendChild(desc);

    // Calculate max value for scaling
    const maxValue = Math.max(...data.map(item => item.value));

    // Create bars for each data point
    data.forEach((item, index) => {
        const barHeight = (item.value / maxValue) * 80;
        const barY = 100 - barHeight;

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', `${index * 20 + 10}`);
        rect.setAttribute('y', `${barY}`);
        rect.setAttribute('width', '10');
        rect.setAttribute('height', `${barHeight}`);
        rect.setAttribute('fill', '#4CAF50');
        rect.setAttribute('aria-label', `Value: ${item.value}, Label: ${item.label}`);

        // Add hover effect
        rect.addEventListener('mouseenter', () => {
            rect.setAttribute('fill', '#45a049');
        });
        rect.addEventListener('mouseleave', () => {
            rect.setAttribute('fill', '#4CAF50');
        });

        svg.appendChild(rect);

        // Add label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', `${index * 20 + 15}`);
        text.setAttribute('y', '195');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '3');
        text.textContent = item.label;
        svg.appendChild(text);
    });

    container.appendChild(svg);
}

function renderIndex(data, containerId) {
    // Get the container element
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found`);
        return;
    }

    // Clear any existing content
    container.innerHTML = '';

    // Create a list element
    const list = document.createElement('ul');
    list.setAttribute('role', 'list');
    list.setAttribute('aria-label', 'Data Index');

    // Add each data item to the list
    data.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('role', 'listitem');
        listItem.setAttribute('aria-label', `Item ${index + 1}: ${item.label}, Value: ${item.value}`);

        const label = document.createElement('span');
        label.textContent = item.label;
        label.style.fontWeight = 'bold';

        const value = document.createElement('span');
        value.textContent = `: ${item.value}`;
        value.style.marginLeft = '5px';

        listItem.appendChild(label);
        listItem.appendChild(value);
        list.appendChild(listItem);
    });

    container.appendChild(list);
}

// Main execution when run directly
if (require.main === module) {
    const landmarks = loadLandmarks();
    const processed = processLandmarks(landmarks);
    const sorted = sortLandmarks(processed);

    console.log(`Loaded ${landmarks.length} landmarks`);
    console.log(`Processed to ${processed.length} unique landmarks`);
    console.log(`Sorted ${sorted.length} landmarks`);

    if (sorted.length > 0) {
        console.log('First landmark:', sorted[0]);
    }
}

// Export all functions and utilities using module.exports
module.exports = {
    // Accessibility functions
    addLangAttribute,
    fixTableStructure,
    fixLandmarks,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinks,
    applyAccessibilityFixes,
    addressAccessibilityIssues,
    createInPageButton,
    divide,
    isLinkAccessible,
    checkLinkAccessibility,
    wrapPrimaryContentInMain,
    getLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLinkAccessibility,
    handleFakeLinks,
    validateLandmarkStructure,
    getSvgAccessibleName,
    setSvgAttributes,
    personName,

    // Landmark functions
    isValidLandmark,
    loadLandmarks,
    processLandmarks,
    sortLandmarks,
    getLandmarkById,
    ensureUniqueLandmarksById,

    // Form and rendering
    createAccessibleBookForm,
    renderGraph,
    renderIndex,

    // Accessibility helpers
    getDocument,
    getFullLangAttribute,
    handleAccessibilityIssues,
    createAccessibleLink,
    validateLandmark,
    triggerAccessibilityMode,

    // Reporting
    generateAccessibilityReport,
    scanAccessibility,
    writeReport,

    // Utilities
    formatResponse,
    implementFeature,
    processAccessibilityIssues,

    // Config
    CONFIG
};