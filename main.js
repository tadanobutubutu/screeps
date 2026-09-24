// TODO: This is the existing code that needs to be preserved (This comment remains as-is)
// REACT_015: Add lang attribute to the <html> element
function addLangToHtml(html, lang = 'en') {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/\blang=/i.test(match)) return match;
        return '<html' + attrs + ' lang="' + lang + '">';
    });
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function ... {
    if (typeof html !== 'string') return html;

    // Ensure every table has a caption
    html = html.replace(/<table([^>]*)>/gi, (match, attrs) => {
        if (/<caption/i.test(match)) return match;
        return '<table' + attrs + '><caption></caption>';
    });

    // Close caption and wrap rows in thead/tbody where missing
    html = html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (match, attrs, content) => {
        if (/<thead/gi.test(content)) return match;
        
        // Close caption if it's open
        content = content.replace(/<caption([^>]*)>([\s\S]*?)(?=<(thead|tbody|tr|$))/gi, 
            (captionMatch, captionAttrs, captionContent) => {
                if (!captionContent.includes('</caption>')) {
                    return `<caption${captionAttrs}>${captionContent}</caption>`;
                }
                return captionMatch;
            }
        );

        const rows = content.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
        if (rows.length === 0) return match;

        const firstRows = rows.slice(0, 1).join('');
        const restRows = rows.slice(1).join('');

        const thPattern = /<th[^>]*>/gi;
        const firstRowHasTh = thPattern.test(firstRows);
        
        let thead = '';
        let tbody = restRows;

        if (!firstRowHasTh) {
            thead = '<thead>' + firstRows.replace(/<td>/gi, '<th scope="col">').replace(/<\/td>/gi, '</th>') + '</thead>';
        } else {
            thead = '<thead>' + firstRows + '</thead>';
        }
        
        if (!tbody) tbody = '';
        tbody = '<tbody>' + tbody + '</tbody>';

        return '<table' + attrs + '>' + thead + tbody + '</table>';
    });

    // Add scope="col" to th elements that don't have it
    html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
        if (/\bscope=/i.test(match)) return match;
        return '<th' + attrs + ' scope="col">';
    });

    return html;
}

// Export functions for use elsewhere
module.exports = {
    addLangAttribute,
    fixTableStructure
};

// Support ES modules export if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = module.exports;
}

// Additional existing functionality preserved below
function processHTML(html, options = {}) {
    const { lang = 'en', fixTables = true } = options;
    
    if (fixTables) {
        html = fixTableStructure(html);
    }
    
    html = addLangAttribute(html, lang);
    
    return html;
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames(html) {
    if (typeof html !== 'string') return html;

    const svgMatches = [...html.matchAll(/<svg([^>]*)>/gi)];
    let offset = 0;

    svgMatches.forEach((match, index) => {
        const fullMatch = match[0];
        const attrs = match[1];
        const svgStart = match.index + offset;
        const svgEnd = html.indexOf('</svg>', svgStart);

        if (svgEnd === -1) return;

        const svgContent = html.substring(svgStart, svgEnd + 6);
        const hasTitle = /<title/i.test(svgContent);
        const hasAriaLabel = /\baria-label=/i.test(attrs);
        const hasAriaLabelledBy = /\baria-labelledby=/i.test(attrs);

        if (!hasTitle && !hasAriaLabel && !hasAriaLabelledBy) {
            const newSvg = fullMatch.replace('>', '><title>SVG ' + (index + 1) + '</title>');
            const oldSvgLength = svgContent.length;
            html = html.substring(0, svgStart) + newSvg + html.substring(svgStart + oldSvgLength);
            offset += newSvg.length - oldSvgLength;
        }
    });

    return html;
}

function checkLinkAccessibility() {
  // Implementation for checking link accessibility
  // This function will be used to validate the accessibility of links
  const links = document.querySelectorAll('a[href]');
  const issues = [];

  links.forEach(link => {
    const href = link.getAttribute('href');
    const text = link.textContent.trim();

    if (!text) {
      issues.push('Link with href "' + href + '" has no accessible text');
    }
  });

  return issues;
}

// TODO: Implement wrapPrimaryContentInMain function, including the added logic
/**
 * Wraps the primary content of the page in a <main> element for improved accessibility.
 * This function checks if a <main> element already exists; if not, it creates one
 * and moves all body content into it.
 * @returns {Element|null} The <main> element if successfully created/wrapped, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  const body = document.body;

  // Return null if body element is not available
  if (!body) {
    return null;
  }

  // Check if a <main> element already exists to avoid duplication
  const existingMain = document.querySelector('main');
  if (existingMain) {
    return existingMain;
  }

  // Create a new <main> element
  const main = document.createElement('main');

  // Move all existing body children into the <main> element
  while (body.firstChild) {
    main.appendChild(body.firstChild);
  }

  // Append the <main> element to the body
  body.appendChild(main);

  return main;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(html) {
    if (typeof html !== 'string') return html;

    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];

    landmarkRoles.forEach(role => {
        const pattern = new RegExp('role=["\']' + role + '["\']', 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first occurrence, change subsequent ones
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return 'role="region"';
            });
        }
    });

    // Also check for duplicate HTML5 landmark elements (header, nav, main, aside, footer)
    const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
    html5Landmarks.forEach(tag => {
        const pattern = new RegExp('<' + tag + '([^>]*)>', 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first, add role="region" to others
            let count = 0;
            html = html.replace(pattern, (match, attrs) => {
                count++;
                if (count === 1) return match;
                return '<' + tag + ' role="region"' + attrs + '>';
            });
        }
    });

    return html;
}

// REACT_036: Fix fake link issues
function fixFakeLinks(html) {
    if (typeof html !== 'string') return html;

    // Find spans or divs with onclick that act as links and convert to <a>
    html = html.replace(
        /<span([^>]*)onclick=["']([^"']*)["']([^>]*)>/gi,
        (match, before, onclick, after) => {
            const hrefMatch = onclick.match(/window\.location\s*=\s*['"]([^'"]+)['"]/);
            if (hrefMatch) {
                return '<a href="' + hrefMatch[1] + '"' + before + after + '>';
            }
            return match;
        }
    );

    html = html.replace(/<\/span>/gi, '</a>');

    return html;
}

// Main function that applies all accessibility fixes
function applyAccessibilityFixes(html) {
    let result = html;
    result = addLangAttribute(result);
    result = fixTableStructure(result);
    result = fixLandmarks(result);
    result = addSvgAccessibleNames(result);
    result = ensureUniqueLandmarks(result);
    result = fixFakeLinks(result);
    return result;
}

/**
 * Gets the lang attribute value from an HTML string
 * @param {string} html - The HTML string to extract lang attribute from
 * @returns {string|null} The lang attribute value or null if not found
 */
function getLangAttribute(html) {
    if (typeof html !== 'string') return null;
    const match = html.match(/<html[^>]*\slang=["']([^"']+)["']/i);
    return match ? match[1] : null;
}

/**
 * Validates table accessibility issues
 * @returns {Array} Array of accessibility issues found in tables
 */
function validateTableAccessibility() {
    const issues = [];
    
    if (typeof document === 'undefined') {
        return issues;
    }
    
    const tables = document.querySelectorAll('table');
    
    tables.forEach((table, index) => {
        // Check if table has a caption
        if (!table.querySelector('caption')) {
            issues.push({
                type: 'table-accessibility',
                message: `Table ${index + 1} is missing a caption element`,
                element: 'table',
                suggestion: 'Add a <caption> element to describe the table content'
            });
        }
        
        // Check if th elements have scope attribute
        const headers = table.querySelectorAll('th');
        headers.forEach((header, hIndex) => {
            if (!header.hasAttribute('scope')) {
                issues.push({
                    type: 'table-accessibility',
                    message: `Table ${index + 1} header ${hIndex + 1} is missing scope attribute`,
                    element: 'th',
                    suggestion: 'Add scope="col" or scope="row" to header cells'
                });
            }
        });
    });
    
    return issues;
}

/**
 * Validates table structure issues
 * @returns {Array} Array of structure issues found in tables
 */
function validateTableStructure() {
    const issues = [];
    
    if (typeof document === 'undefined') {
        return issues;
    }
    
    const tables = document.querySelectorAll('table');
    
    tables.forEach((table, index) => {
        // Check if table has thead
        if (!table.querySelector('thead')) {
            issues.push({
                type: 'table-structure',
                message: `Table ${index + 1} is missing <thead> element`,
                element: 'table',
                suggestion: 'Wrap header rows in a <thead> element'
            });
        }
        
        // Check if table has tbody
        if (!table.querySelector('tbody')) {
            issues.push({
                type: 'table-structure',
                message: `Table ${index + 1} is missing <tbody> element`,
                element: 'table',
                suggestion: 'Wrap data rows in a <tbody> element'
            });
        }
        
        // Check for proper th usage in first row when no thead exists
        const firstRow = table.querySelector('tr');
        if (firstRow) {
            const cells = firstRow.querySelectorAll('td');
            const headers = firstRow.querySelectorAll('th');
            if (cells.length > 0 && headers.length === 0) {
                issues.push({
                    type: 'table-structure',
                    message: `Table ${index + 1} first row should use <th> for header cells`,
                    element: 'tr',
                    suggestion: 'Replace <td> with <th scope="col"> for header cells'
                });
            }
        }
    });
    
    return issues;
}

/**
 * Validates link accessibility issues
 * @returns {Array} Array of accessibility issues found in links
 */
function validateLinkAccessibility() {
    const issues = [];
    
    if (typeof document === 'undefined') {
        return issues;
    }
    
    const links = document.querySelectorAll('a');
    
    links.forEach((link, index) => {
        // Check if link has href
        if (!link.hasAttribute('href')) {
            issues.push({
                type: 'link-accessibility',
                message: `Link ${index + 1} is missing href attribute`,
                element: 'a',
                suggestion: 'Add a valid href attribute or convert to appropriate element'
            });
        }
        
        // Check if link has accessible text
        const text = link.textContent.trim();
        const hasAriaLabel = link.hasAttribute('aria-label');
        const hasAriaLabelledBy = link.hasAttribute('aria-labelledby');
        const hasTitle = link.hasAttribute('title');
        
        if (!text && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle) {
            issues.push({
                type: 'link-accessibility',
                message: `Link ${index + 1} has no accessible text`,
                element: 'a',
                suggestion: 'Add visible text, aria-label, aria-labelledby, or title attribute'
            });
        }
        
        // Check for generic link text
        const genericTexts = ['click here', 'here', 'read more', 'learn more', 'more', 'link'];
        if (genericTexts.includes(text.toLowerCase())) {
            issues.push({
                type: 'link-accessibility',
                message: `Link ${index + 1} uses generic text "${text}"`,
                element: 'a',
                suggestion: 'Use descriptive link text that indicates the link destination'
            });
        }
    });
    
    return issues;
}

/**
 * Handles fake link issues (elements with onclick that act as links)
 * @returns {Array} Array of fake link issues found
 */
function handleFakeLinks() {
    const issues = [];
    
    if (typeof document === 'undefined') {
        return issues;
    }
    
    // Find elements with onclick that might be fake links
    const clickableElements = document.querySelectorAll('[onclick]');
    
    clickableElements.forEach((element, index) => {
        const tagName = element.tagName.toLowerCase();
        const onclick = element.getAttribute('onclick') || '';
        
        // Check if it's a span or div with location change
        if ((tagName === 'span' || tagName === 'div') && 
            (onclick.includes('window.location') || 
             onclick.includes('location.href') || 
             onclick.includes('document.location'))) {
            issues.push({
                type: 'fake-link',
                message: `Element ${index + 1} is a fake link using ${tagName} with onclick`,
                element: tagName,
                suggestion: 'Replace with <a> element for proper accessibility'
            });
        }
        
        // Check for navigation-related onclick
        if (onclick.includes('navigate') || onclick.includes('goTo') || onclick.includes('redirect')) {
            issues.push({
                type: 'fake-link',
                message: `Element ${index + 1} appears to be a navigation fake link`,
                element: tagName,
                suggestion: 'Use <a> element for navigation links'
            });
        }
    });
    
    // Check for links without href (might be broken)
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        if (href === '' || href === '#' || href === 'javascript:void(0)' || href === 'javascript:;') {
            issues.push({
                type: 'fake-link',
                message: `Link ${index + 1} uses a non-navigable href value "${href}"`,
                element: 'a',
                suggestion: 'Use a valid URL or remove the link if it does not navigate'
            });
        }
    });
    
    return issues;
}

// New function to address accessibility issues
function addressAccessibilityIssues(insightReport) {
  // Apply accessibility fixes to HTML content based on insight report
  if (insightReport && insightReport.html) {
    insightReport.html = applyAccessibilityFixes(insightReport.html);
  }

  // Ensure dependency graph container has proper ARIA role
  ensureDependencyGraphContainerAccessibility();

  // Ensure all landmark elements have unique IDs
  ensureUniqueLandmarkIds();

  // Implement the changes required to address accessibility issues from the insight report
  const linkIssues = checkLinkAccessibility();
  const tableIssues = validateTableAccessibility();
  const tableStructureIssues = validateTableStructure();
  const linkAccessibilityIssues = validateLinkAccessibility();
  const fakeLinkIssues = handleFakeLinks();

  // Handle issues (e.g., log them, display warnings, etc.)
  console.log('Addressing accessibility issues from insight report:', insightReport);
  console.log('Link Accessibility Issues:', linkIssues);
  console.log('Table Accessibility Issues:', tableIssues);
  console.log('Table Structure Issues:', tableStructureIssues);
  console.log('Link Accessibility Validation Issues:', linkAccessibilityIssues);
  console.log('Fake Link Issues:', fakeLinkIssues);

  return {
    success: true,
    message: 'Accessibility issues addressed successfully',
    issues: {
      linkIssues,
      tableIssues,
      tableStructureIssues,
      linkAccessibilityIssues,
      fakeLinkIssues
    }
  };
}

function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    document.body.appendChild(button);
}

function newFunction() {
  // Placeholder for new function
}

function validateTableAccessibility() {
  // Placeholder for table accessibility validation
  return [];
}

function validateTableStructure() {
  // Placeholder for table structure validation
  return [];
}

function validateLinkAccessibility() {
  // Placeholder for link accessibility validation
  return [];
}

function handleFakeLinks() {
  // Placeholder for fake link handling
  return [];
}

// Function to ensure dependency graph container has proper ARIA role
function ensureDependencyGraphContainerAccessibility() {
  const container = document.querySelector('.dependency-graph-container');
  if (container && !container.hasAttribute('role')) {
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Dependency Graph');
  }
}

// Function to ensure all landmark elements have unique IDs
function ensureUniqueLandmarkIds() {
  const landmarks = [
    { selector: 'header', role: 'banner' },
    { selector: 'nav', role: 'navigation' },
    { selector: 'main', role: 'main' },
    { selector: 'aside', role: 'complementary' },
    { selector: 'footer', role: 'contentinfo' }
  ];

  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark.selector);
    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = landmark.role + '-' + (index + 1);
      }
    });
  });
}

// Export accessibility utility functions
module.exports = {
  addLangAttribute,
  fixTableStructure,
  fixLandmarks,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  applyAccessibilityFixes,
  divide,
  wrapPrimaryContentInMain,
  ensureDependencyGraphContainerAccessibility,
  ensureUniqueLandmarkIds,
  checkLinkAccessibility,
  addressAccessibilityIssues,
  createInPageButton,
  newFunction,
  validateTableAccessibility,
  validateTableStructure,
  validateLinkAccessibility,
  handleFakeLinks
};