// TODO: This is the existing code that needs to be preserved (This comment remains as-is)
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// Importing the necessary functions (for illustration purposes)
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import {
    validateTableAccessibility,
    validateTableStructure,
} from './utils/tableAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';

// TODO: Add back any required exports that might have been removed
//_Commit: 243c66538868c6b87845660312397ab39e0f830d_

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
        html = html.replace(/<body([^>]*)>/i, '<body$1><main>');
        html = html.replace(/<\/body>/i, '</main></body>');
    }

    // Ensure <nav> landmark exists
    if (!/<nav[^>]*>/i.test(html) && !/<div[^>]*role=["']navigation["']/i.test(html)) {
        html = html.replace(/<main[^>]*>/i, '<nav aria-label="Main navigation"></nav><main>');
    }

    // Ensure <aside> landmark exists if content suggests a sidebar
    if (!/<aside[^>]*>/i.test(html) && !/<div[^>]*role=["']complementary["']/i.test(html)) {
        html = html.replace(/<\/main>/i, '<aside aria-label="Supplementary"></aside></main>');
    }

    // Ensure <footer> landmark exists
    if (!/<footer[^>]*>/i.test(html) && !/<div[^>]*role=["']contentinfo["']/i.test(html)) {
        html = html.replace(/<\/body>/i, '<footer></footer></body>');
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

    links.forEach((link) => {
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

    const landmarkRoles = [
        'banner',
        'navigation',
        'main',
        'complementary',
        'contentinfo',
        'search',
        'form',
    ];

    landmarkRoles.forEach((role) => {
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
    html5Landmarks.forEach((tag) => {
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

function addressAccessibilityIssues(insightReport) {
    // Implement the logic to address accessibility issues based on the insight report
    // This is a placeholder function and should be replaced with actual implementation
    console.log('Addressing accessibility issues from insight report:', insightReport);

    // Add accessibility improvements
    document.body.setAttribute('lang', 'en');
    document.title = 'Accessible Application';

    // Add ARIA attributes to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button) => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', button.textContent);
        }
    });

    // Add skip link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add focus styles for keyboard navigation
    const style = document.createElement('style');
    style.textContent = `
    .skip-link {
      position: absolute;
      left: -9999px;
      top: 0;
    }
    .skip-link:focus {
      left: 0;
      background: #000;
      color: #fff;
      padding: 0.5em;
      z-index: 100;
    }
    button:focus {
      outline: 3px solid #4d90fe;
    }
  `;
    document.head.appendChild(style);
}

// TODO: Implement function for generating a report based on accessibility issues
/**
 * Generates an accessibility report based on the current page's HTML and DOM
 * @param {Object} options - Configuration options for the report
 * @param {boolean} options.includeHtml - Whether to include HTML analysis in the report
 * @param {boolean} options.includeDom - Whether to include DOM analysis in the report
 * @returns {Object} The generated accessibility report
 */
function generateAccessibilityReport(options = { includeHtml: true, includeDom: true }) {
    const report = {
        timestamp: new Date().toISOString(),
        issues: [],
        summary: {
            totalIssues: 0,
            critical: 0,
            serious: 0,
            moderate: 0,
            minor: 0,
        },
    };

    // HTML-based analysis
    if (options.includeHtml && document.documentElement) {
        const html = document.documentElement.outerHTML;

        // Check for missing lang attribute
        if (!/<html[^>]*\blang=/i.test(html)) {
            report.issues.push({
                type: 'missing-lang-attribute',
                severity: 'critical',
                message: 'HTML element is missing lang attribute',
                selector: 'html',
            });
            report.summary.critical++;
        }

        // Check for tables without captions
        const tableMatches = html.match(/<table[^>]*>/gi) || [];
        const captionMatches = html.match(/<caption[^>]*>/gi) || [];
        if (tableMatches.length > captionMatches.length) {
            report.issues.push({
                type: 'missing-table-caption',
                severity: 'serious',
                message: `${tableMatches.length - captionMatches.length} tables are missing captions`,
                selector: 'table',
            });
            report.summary.serious += tableMatches.length - captionMatches.length;
        }

        // Check for SVGs without accessible names
        const svgMatches = html.match(/<svg[^>]*>/gi) || [];
        const accessibleSvgs = svgMatches.filter((svg) => {
            return /<title[^>]*>|aria-label=|aria-labelledby=/i.test(svg);
        });
        if (svgMatches.length > accessibleSvgs.length) {
            report.issues.push({
                type: 'inaccessible-svg',
                severity: 'moderate',
                message: `${svgMatches.length - accessibleSvgs.length} SVGs are missing accessible names`,
                selector: 'svg',
            });
            report.summary.moderate += svgMatches.length - accessibleSvgs.length;
        }
    }

    // DOM-based analysis
    if (options.includeDom) {
        // Check for links without text
        const links = document.querySelectorAll('a[href]');
        const emptyLinks = Array.from(links).filter((link) => !link.textContent.trim());
        if (emptyLinks.length > 0) {
            report.issues.push({
                type: 'empty-link',
                severity: 'serious',
                message: `${emptyLinks.length} links have no accessible text`,
                selector: 'a[href]',
                count: emptyLinks.length,
            });
            report.summary.serious += emptyLinks.length;
        }

        // Check for images without alt text
        const images = document.querySelectorAll('img');
        const imagesWithoutAlt = Array.from(images).filter((img) => !img.getAttribute('alt'));
        if (imagesWithoutAlt.length > 0) {
            report.issues.push({
                type: 'missing-alt-text',
                severity: 'serious',
                message: `${imagesWithoutAlt.length} images are missing alt text`,
                selector: 'img',
                count: imagesWithoutAlt.length,
            });
            report.summary.serious += imagesWithoutAlt.length;
        }

        // Check for ARIA attributes without corresponding elements
        const ariaElements = document.querySelectorAll('[aria-labelledby], [aria-describedby]');
        Array.from(ariaElements).forEach((element) => {
            const labelledBy = element.getAttribute('aria-labelledby');
            const describedBy = element.getAttribute('aria-describedby');

            if (labelledBy && !document.getElementById(labelledBy)) {
                report.issues.push({
                    type: 'invalid-aria-labelledby',
                    severity: 'serious',
                    message: `Element with aria-labelledby="${labelledBy}" references non-existent ID`,
                    selector: `[aria-labelledby="${labelledBy}"]`,
                });
                report.summary.serious++;
            }

            if (describedBy && !document.getElementById(describedBy)) {
                report.issues.push({
                    type: 'invalid-aria-describedby',
                    severity: 'serious',
                    message: `Element with aria-describedby="${describedBy}" references non-existent ID`,
                    selector: `[aria-describedby="${describedBy}"]`,
                });
                report.summary.serious++;
            }
        });

        // Check for duplicate landmarks
        const landmarkSelectors = [
            'header',
            'nav',
            'main',
            'aside',
            'footer',
            '[role="banner"]',
            '[role="navigation"]',
            '[role="main"]',
            '[role="complementary"]',
            '[role="contentinfo"]',
        ];

        landmarkSelectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 1) {
                report.issues.push({
                    type: 'duplicate-landmark',
                    severity: 'serious',
                    message: `Multiple elements found for landmark ${selector}`,
                    selector: selector,
                    count: elements.length,
                });
                report.summary.serious += elements.length - 1;
            }
        });
    }

    // Update summary totals
    report.summary.totalIssues = report.issues.length;

    return report;
}

function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    button.setAttribute('aria-label', buttonText); // Add ARIA label
    document.body.appendChild(button);
}

// Accessibility improvements for addBook function/form
function addBook(title, author, isbn) {
    // Create form elements with proper ARIA attributes
    const form = document.createElement('form');
    form.setAttribute('role', 'form');
    form.setAttribute('aria-label', 'Add a new book');

    // Title input
    const titleLabel = document.createElement('label');
    ylabel.setAttribute('for', 'book-title');
    ylabel.textContent = 'Book Title:';
    const titleInput = document.createElement('input');
    titleInput.id = 'book-title';
    titleInput.type = 'text';
    titleInput.required = true;
    titleInput.setAttribute('aria-required', 'true');
    titleInput.setAttribute('aria-label', 'Enter the book title');

    // Author input
    const authorLabel = document.createElement('label');
    authorLabel.setAttribute('for', 'book-author');
    authorLabel.textContent = 'Author:';
    const authorInput = document.createElement('input');
    authorInput.id = 'book-author';
    authorInput.type = 'text';
    authorInput.required = true;
    authorInput.setAttribute('aria-required', 'true');
    authorInput.setAttribute('aria-label', 'Enter the author name');

    // ISBN input
    const isbnLabel = document.createElement('label');
    isbnLabel.setAttribute('for', 'book-isbn');
    isbnLabel.textContent = 'ISBN:';
    const isbnInput = document.createElement('input');
    isbnInput.id = 'book-isbn';
    isbnInput.type = 'text';
    isbnInput.setAttribute('aria-label', 'Enter the ISBN number');

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Add Book';
    submitButton.setAttribute('aria-label', 'Submit the book information');

    // Assemble form
    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(authorLabel);
    form.appendChild(authorInput);
    form.appendChild(isbnLabel);
    form.appendChild(isbnInput);
    form.appendChild(submitButton);

    // Add form to document
    document.body.appendChild(form);

    // Return form for potential further manipulation
    return form;
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
    addressAccessibilityIssues,
    createInPageButton,
    divide,
    checkLinkAccessibility,
    wrapPrimaryContentInMain,
    generateAccessibilityReport,
};

// Preserve any existing exports here
// export { addressAccessibilityIssues, createInPageButton, existingFunction };
// Assuming existingFunction is the name of another export in the codebase (you should replace this with its actual name)
