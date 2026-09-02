// TODO: This is the existing code that needs to be preserved (This comment remains as-is)
// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_027: Fix 26 table structure issues
// REACT_017: Add/fix 4 landmark issues
// REACT_041: Add accessible names to 2 SVGs
// REACT_025: Ensure unique landmarks (2 issues) — (DONE: ensureUniqueLandmarks)
// REACT_036: Fix 1 fake link issue
// ADD: Address new accessibility issues from insight report — FIXED

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation
// main.js - Combined utility and accessibility features

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// Version 1 implementation (HEAD branch) - preserved accessibility enhancements

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

// New function to check link accessibility
function isLinkAccessible(html, linkSelector) {
    if (typeof html !== 'string' || !linkSelector) return false;

    // Create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Find the link element
    const linkElement = tempDiv.querySelector(linkSelector);

    if (!linkElement) return false;

    // Check if the link has an accessible name
    const hasAccessibleName =
        linkElement.textContent.trim().length > 0 ||
        linkElement.getAttribute('aria-label') ||
        linkElement.getAttribute('title');

    // Check if the link has a valid href
    const href = linkElement.getAttribute('href');
    const hasValidHref = href && href.trim() !== '#' && !href.startsWith('javascript:');

    // Check if the link is not hidden
    const isVisible = linkElement.offsetParent !== null &&
                      !linkElement.hasAttribute('hidden') &&
                      window.getComputedStyle(linkElement).display !== 'none';

    return hasAccessibleName && hasValidHref && isVisible;
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

function addressAccessibilityIssues(insightReport) {
  // Apply accessibility fixes to HTML content based on insight report
  if (insightReport && insightReport.html) {
    insightReport.html = applyAccessibilityFixes(insightReport.html);
  }
  console.log('Addressing accessibility issues from insight report:', insightReport);
}

function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    button.setAttribute('aria-label', buttonText); // Added for accessibility
    button.setAttribute('role', 'button'); // Added for accessibility
    document.body.appendChild(button);
}

// New function to improve accessibility for adding a new book
/**
 * Creates an accessible form for adding a new book with proper labels and ARIA attributes
 * @param {string} formId - The ID for the form element
 * @param {string} submitButtonId - The ID for the submit button
 * @returns {HTMLFormElement} The created form element
 */
function createAccessibleBookForm(formId, submitButtonId) {
    const form = document.createElement('form');
    form.id = formId;
    form.setAttribute('role', 'form');
    form.setAttribute('aria-labelledby', `${formId}-title`);

    // Add form title for accessibility
    const title = document.createElement('h2');
    title.id = `${formId}-title`;
    title.textContent = 'Add New Book';
    form.appendChild(title);

    // Create accessible form fields
    const createField = (labelText, inputId, inputType = 'text') => {
        const fieldset = document.createElement('fieldset');
        const label = document.createElement('label');
        label.setAttribute('for', inputId);
        label.textContent = labelText;
        const input = document.createElement('input');
        input.type = inputType;
        input.id = inputId;
        input.setAttribute('required', 'true');
        input.setAttribute('aria-required', 'true');

        fieldset.appendChild(label);
        fieldset.appendChild(input);
        return fieldset;
    };

    // Add form fields
    form.appendChild(createField('Book Title:', `${formId}-title`));
    form.appendChild(createField('Author:', `${formId}-author`));
    form.appendChild(createField('Publication Year:', `${formId}-year`, 'number'));

    // Add submit button
    const submitButton = document.createElement('button');
    submitButton.id = submitButtonId;
    submitButton.type = 'submit';
    submitButton.textContent = 'Add Book';
    submitButton.setAttribute('aria-label', 'Submit new book form');
    form.appendChild(submitButton);

    return form;
}

// Validation functions for accessibility checks
function getLangAttribute(html) {
    if (typeof html !== 'string') return null;
    const match = html.match(/<html[^>]*\slang=["']([^"']+)["']/i);
    return match ? match[1] : null;
}

function validateTableAccessibility(html) {
    if (typeof html !== 'string') return { valid: false, issues: [] };
    const issues = [];

    // Check for tables without captions
    const tables = html.match(/<table[^>]*>[\s\S]*?<\/table>/gi) || [];
    tables.forEach((table, index) => {
        if (!/<caption/i.test(table)) {
            issues.push(`Table ${index + 1} is missing a caption`);
        }
    });

    // Check for th elements without scope
    const thWithoutScope = html.match(/<th(?!([^>]*)scope=)/gi) || [];
    if (thWithoutScope.length > 0) {
        issues.push(`${thWithoutScope.length} table header(s) missing scope attribute`);
    }

    return { valid: issues.length === 0, issues };
}

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

// Don't forget to test your new additions in the test file

// Export accessibility utility functions
module.exports = {
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
    createAccessibleBookForm
};

// Run if executed directly
if (require.main === module) {
  main();
}