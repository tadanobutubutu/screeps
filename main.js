// TODO: This is the existing code that needs to be preserved
// REACT_015: Add lang attribute to the <html> element
function addLangAttribute(html, lang = 'en') {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/\blang=/i.test(match)) return match;
        return `<html${attrs} lang="${lang}">`;
    });
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function fixTableStructure(html) {
    if (typeof html !== 'string') return html;

    // Ensure every table has a caption
    html = html.replace(/<table([^>]*)>/gi, (match, attrs) => {
        if (/<caption/i.test(match)) return match;
        return `<table${attrs}><caption></caption>`;
    });

    // Close caption and wrap rows in thead/tbody where missing
    html = html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (match, attrs, content) => {
        if (/<thead/i.test(content)) return match;
        const rows = content.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
        if (rows.length === 0) return match;
        const firstRows = rows.slice(0, 1).join('');
        const restRows = rows.slice(1).join('');
        const thPattern = /<td>/gi;
        const firstRowHasTh = thPattern.test(firstRows);
        let thead = '';
        let tbody = restRows;

        if (!firstRowHasTh) {
            thead = `<thead>${firstRows.replace(/<td>/gi, '<th scope="col">').replace(/<\/td>/gi, '</th>')}</thead>`;
        } else {
            thead = `<thead>${firstRows}</thead>`;
        }
        if (!tbody) tbody = '';
        tbody = `<tbody>${tbody}</tbody>`;

        return `<table${attrs}>${thead}${tbody}</table>`;
    });

    // Add scope="col" to th elements that don't have it
    html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
        if (/\bscope=/i.test(match)) return match;
        return `<th${attrs} scope="col">`;
    });

    return html;
}

/**
 * Divides two numbers with proper error handling
 * @param {number} dividend - The number to be divided
 * @param {number} divisor - The number to divide by
 * @returns {number} The result of the division
 * @throws {Error} If divisor is zero or if inputs are not valid numbers
 */
function divide(dividend, divisor) {
  if (typeof dividend !== 'number' || typeof divisor !== 'number') {
    throw new Error('Both arguments must be numbers');
  }

  if (isNaN(dividend) || isNaN(divisor)) {
    throw new Error('Both arguments must be valid numbers');
  }

  if (divisor === 0) {
    throw new Error('Division by zero is not allowed');
  }

  return dividend / divisor;
}

// REACT_017: Add/fix landmark issues
function fixLandmarks(html) {
    if (typeof html !== 'string') return html;

    // Ensure <main> landmark exists
    if (!/<main[^>]*>/i.test(html) && !/<div[^>]*role=["']main["']/i.test(html)) {
        html = html.replace(
            /<body([^>]*)>/i,
            '<body$1><main>'
        );
        html = html.replace(/<\/body>/i, '</main></body>');
    }

    // Ensure <nav> landmark exists
    if (!/<nav[^>]*>/i.test(html) && !/<div[^>]*role=["']navigation["']/i.test(html)) {
        html = html.replace(
            /<main[^>]*>/i,
            '<nav aria-label="Main navigation"></nav><main>'
        );
    }

    // Ensure <aside> landmark exists if content suggests a sidebar
    if (!/<aside[^>]*>/i.test(html) && !/<div[^>]*role=["']complementary["']/i.test(html)) {
        html = html.replace(
            /<\/main>/i,
            '<aside aria-label="Supplementary"></aside></main>'
        );
    }

    // Ensure <footer> landmark exists
    if (!/<footer[^>]*>/i.test(html) && !/<div[^>]*role=["']contentinfo["']/i.test(html)) {
        html = html.replace(
            /<\/body>/i,
            '<footer></footer></body>'
        );
    }

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
            const newSvg = fullMatch.replace(/>/, `><title>SVG ${index + 1}</title>`);
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
      issues.push(`Link with href "${href}" has no accessible text`);
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
        const pattern = new RegExp(`role=["']${role}["']`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first occurrence, change subsequent ones
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return `role="region"`;
            });
        }
    });

    // Also check for duplicate HTML5 landmark elements (header, nav, main, aside, footer)
    const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
    html5Landmarks.forEach(tag => {
        const pattern = new RegExp(`<${tag}[^>]*>`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first, add role="region" to others
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return match.replace(new RegExp(`<${tag}`, 'i'), `<${tag} role="region"`);
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
                return `<a href="${hrefMatch[1]}"${before}${after}>`;
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

// New function to address accessibility issues
function addressAccessibilityIssues(insightReport) {
  // Apply accessibility fixes to HTML content based on insight report
  if (insightReport && insightReport.html) {
    insightReport.html = applyAccessibilityFixes(insightReport.html);
  }

  // Implement the changes required to address accessibility issues from the insight report
  // For example, this could be calling existing utility functions to validate accessibility
  const linkIssues = checkLinkAccessibility();
  const tableIssues = validateTableAccessibility();
  const tableStructureIssues = validateTableStructure();
  const linkAccessibilityIssues = validateLinkAccessibility();
  const fakeLinkIssues = handleFakeLinks();

  // Handle issues (e.g., log them, display warnings, etc.)
  // For demonstration purposes, we will just log the issues to the console
  console.log('Addressing accessibility issues from insight report:', insightReport);
  console.log('Link Accessibility Issues:', linkIssues);
  console.log('Table Accessibility Issues:', tableIssues);
  console.log('Table Structure Issues:', tableStructureIssues);
  console.log('Link Accessibility Validation Issues:', linkAccessibilityIssues);
  console.log('Fake Link Issues:', fakeLinkIssues);

  // Here you could add additional logic to address the issues
  // For example, you might want to update the DOM or call other functions
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
        element.id = `${landmark.role}-${index + 1}`;
      }
    });
  });
}

// Updated addressAccessibilityIssues function to include new requirements
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

// Helper function: get the lang attribute from an HTML string
function getLangAttribute(html) {
    if (typeof html !== 'string') return null;
    const match = html.match(/<html[^>]*\slang=["']([^"']+)["']/i);
    return match ? match[1] : null;
}

// Helper function: validate table accessibility
function validateTableAccessibility() {
    const tables = document.querySelectorAll('table');
    const issues = [];
    tables.forEach((table, index) => {
        const caption = table.querySelector('caption');
        if (!caption) {
            issues.push(`Table ${index + 1} is missing a caption`);
        }
    });
    return issues;
}

// Helper function: validate table structure
function validateTableStructure() {
    const tables = document.querySelectorAll('table');
    const issues = [];
    tables.forEach((table, index) => {
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');
        if (!thead) {
            issues.push(`Table ${index + 1} is missing <thead>`);
        }
        if (!tbody) {
            issues.push(`Table ${index + 1} is missing <tbody>`);
        }
    });
    return issues;
}

// Helper function: validate link accessibility
function validateLinkAccessibility() {
    const links = document.querySelectorAll('a[href]');
    const issues = [];
    links.forEach(link => {
        const text = link.textContent.trim();
        const ariaLabel = link.getAttribute('aria-label');
        if (!text && !ariaLabel) {
            issues.push('Link has no accessible name');
        }
    });
    return issues;
}

// Helper function: handle fake links
function handleFakeLinks() {
    const fakeLinks = document.querySelectorAll('span[onclick], div[onclick]');
    const issues = [];
    fakeLinks.forEach(el => {
        issues.push('Potential fake link detected (span/div with onclick)');
    });
    return issues;
}

// New function referenced in exports
function newFunction() {
    return 'newFunction executed';
}

// Don't forget to test your new additions in the test file

// Export the function for testing and external use
module.exports = {
  newFunction,
  addressAccessibilityIssues,
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
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLinkAccessibility,
  handleFakeLinks,
  checkLinkAccessibility
};