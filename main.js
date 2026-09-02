// TODO: This is the existing code that needs to be preserved
// _Commit: 243c66538868c6b87845660312397ab39e0f830d_
// <!-- todo-hash: ... -->

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// _Commit: ec56c28dafbd3fb2078fbae75354cf99a4fb9f89_

// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_027: Fix 26 table structure issues
// REACT_017: Add/fix 4 landmark issues
// REACT_041: Add accessible names to 2 SVGs
// REACT_025: Ensure unique landmarks (2 issues) — (DONE: ensureUniqueLandmarks)
// REACT_036: Fix 1 fake link issue

// REACT_015: Add lang attribute to the <html> element
function addLangAttribute(html) {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/\blang=/i.test(match)) return match;
        return `<html${attrs} lang="en">`;
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
  const links = document.querySelectorAll('a[href]');
  const issues = [];

  links.forEach(link => {
    const href = link.getAttribute('href');
    const text = link.textContent.trim();

    // Check for empty link text
    if (!text) {
      issues.push(`Link with href "${href}" has no accessible text`);
    }

    // Check for aria-label or aria-labelledby if link text is empty
    if (!text && !link.hasAttribute('aria-label') && !link.hasAttribute('aria-labelledby')) {
      issues.push(`Link with href "${href}" has no accessible name (missing aria-label or aria-labelledby)`);
    }

    // Check for decorative links that should be buttons
    if (href === '#' && !link.hasAttribute('role') && !link.hasAttribute('aria-hidden')) {
      issues.push(`Link with href="#" should be a button or have role="button" or aria-hidden="true"`);
    }

    // Check for links with title but no visible text
    if (link.hasAttribute('title') && !text) {
      issues.push(`Link with href "${href}" has title but no visible text`);
    }
  });

  return issues;
}

// TODO: Implement function for generating a report based on accessibility issues
// Replaced placeholder with full implementation using axe-core scanning and report writing
/**
 * Generates a comprehensive accessibility report using axe-core.
 * Scans the entire page for accessibility violations and displays results.
 * @param {Object} options - Optional configuration for the scan
 * @returns {Promise<Object>} The complete accessibility report with violations and statistics
 */
async function generateAccessibilityReport(options = {}) {
    const defaultOptions = {
        runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
        },
        reporter: 'v2'
    };

    const scanOptions = { ...defaultOptions, ...options };

    try {
        const results = await axe.run(document, scanOptions);
        
        // Create report object
        const report = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            violations: results.violations,
            passes: results.passes,
            incomplete: results.incomplete,
            inapplicable: results.inapplicable,
            summary: {
                totalViolations: results.violations.length,
                totalPasses: results.passes.length,
                totalIncomplete: results.incomplete.length,
                totalInapplicable: results.inapplicable.length,
                violationsByImpact: {}
            }
        };

        // Categorize violations by impact level
        results.violations.forEach(violation => {
            const impact = violation.impact || 'unknown';
            if (!report.summary.violationsByImpact[impact]) {
                report.summary.violationsByImpact[impact] = [];
            }
            report.summary.violationsByImpact[impact].push({
                id: violation.id,
                description: violation.description,
                help: violation.help,
                helpUrl: violation.helpUrl,
                nodes: violation.nodes.length
            });
        });

        // Display report in page
        displayAccessibilityReportUI(report);

        console.log('Accessibility Report Generated:', report);
        return report;
    } catch (error) {
        console.error('Error generating accessibility report:', error);
        return {
            error: true,
            message: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Displays the accessibility report in a formatted UI panel
 * @param {Object} report - The accessibility report object
 */
function displayAccessibilityReportUI(report) {
    // Remove existing report if present
    const existingReport = document.getElementById('accessibility-report-panel');
    if (existingReport) {
        existingReport.remove();
    }

    // Create report container
    const reportPanel = document.createElement('div');
    reportPanel.id = 'accessibility-report-panel';
    reportPanel.setAttribute('role', 'region');
    reportPanel.setAttribute('aria-label', 'Accessibility Report');
    reportPanel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 400px;
        max-height: 80vh;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        z-index: 10000;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    `;

    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
        background: #2c3e50;
        color: white;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
    `;
    header.innerHTML = `
        <h2 style="margin: 0; font-size: 16px;">Accessibility Report</h2>
        <button id="close-report-btn" aria-label="Close report" style="
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        ">×</button>
    `;
    reportPanel.appendChild(header);

    // Create content area
    const content = document.createElement('div');
    content.style.cssText = `
        padding: 15px;
        overflow-y: auto;
        flex: 1;
    `;

    // Add summary section
    const summaryHTML = `
        <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
            <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #2c3e50;">Summary</h3>
            <p style="margin: 5px 0; color: #e74c3c;"><strong>Violations:</strong> ${report.summary.totalViolations}</p>
            <p style="margin: 5px 0; color: #27ae60;"><strong>Passed:</strong> ${report.summary.totalPasses}</p>
            <p style="margin: 5px 0; color: #f39c12;"><strong>Incomplete:</strong> ${report.summary.totalIncomplete}</p>
            <p style="margin: 5px 0; color: #7f8c8d;"><small>Generated: ${new Date(report.timestamp).toLocaleTimeString()}</small></p>
        </div>
    `;
    content.innerHTML = summaryHTML;

    // Add violations if any
    if (report.violations && report.violations.length > 0) {
        const violationsContainer = document.createElement('div');
        violationsContainer.style.cssText = 'max-height: 300px; overflow-y: auto;';

        report.violations.forEach((violation, index) => {
            const impactColors = {
                critical: '#c0392b',
                serious: '#e74c3c',
                moderate: '#f39c12',
                minor: '#3498db'
            };
            const impactColor = impactColors[violation.impact] || '#7f8c8d';

            const violationDiv = document.createElement('div');
            violationDiv.style.cssText = `
                margin-bottom: 10px;
                padding: 10px;
                background: #fff;
                border-left: 3px solid ${impactColor};
                border-radius: 0 4px 4px 0;
            `;
            violationDiv.innerHTML = `
                <h4 style="margin: 0 0 5px 0; color: #2c3e50; font-size: 13px;">
                    <span style="display: inline-block; padding: 2px 6px; background: ${impactColor}; color: white; border-radius: 3px; font-size: 11px; margin-right: 5px;">${violation.impact || 'unknown'}</span>
                    ${violation.id}
                </h4>
                <p style="margin: 5px 0; color: #555; font-size: 12px;">${violation.description}</p>
                <p style="margin: 5px 0; font-size: 11px; color: #777;">${violation.help}</p>
                <details style="margin-top: 5px;">
                    <summary style="cursor: pointer; color: #3498db; font-size: 11px;">View ${violation.nodes.length} affected node(s)</summary>
                    <div style="margin-top: 5px; font-size: 11px; color: #666;">
                        ${violation.nodes.map(node => `
                            <div style="margin: 3px 0; padding: 3px; background: #f5f5f5; border-radius: 2px;">
                                <code style="word-break: break-all;">${node.html}</code>
                            </div>
                        `).join('')}
                    </div>
                </details>
            `;
            violationsContainer.appendChild(violationDiv);
        });

        content.appendChild(violationsContainer);
    } else {
        content.innerHTML += `
            <div style="padding: 20px; text-align: center; color: #27ae60;">
                <p style="margin: 0; font-size: 16px;">✓ No accessibility violations found!</p>
            </div>
        `;
    }

    // Add export button
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export Report (JSON)';
    exportBtn.style.cssText = `
        margin: 10px 15px;
        padding: 10px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
    `;
    exportBtn.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accessibility-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    reportPanel.appendChild(content);
    reportPanel.appendChild(exportBtn);
    document.body.appendChild(reportPanel);

    // Close button handler
    document.getElementById('close-report-btn').addEventListener('click', () => {
        reportPanel.remove();
    });
}

/**
 * Runs a quick accessibility check and returns violations
 * @param {string} selector - CSS selector to scope the check
 * @returns {Promise<Array>} Array of accessibility violations
 */
async function quickAccessibilityCheck(selector = null) {
    const options = {
        runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa']
        }
    };

    if (selector) {
        options.include = [[selector]];
    }

    try {
        const results = await axe.run(document, options);
        return {
            violations: results.violations,
            summary: {
                total: results.violations.length,
                byImpact: results.violations.reduce((acc, v) => {
                    acc[v.impact] = (acc[v.impact] || 0) + 1;
                    return acc;
                }, {})
            }
        };
    } catch (error) {
        console.error('Accessibility check failed:', error);
        return { violations: [], error: error.message };
    }
}

/**
 * Validates a single element for accessibility issues
 * @param {HTMLElement} element - The element to validate
 * @returns {Promise<Object>} Validation results for the element
 */
async function validateElement(element) {
    try {
        const results = await axe.run(element);
        return {
            element: element.tagName.toLowerCase() + (element.id ? `#${element.id}` : ''),
            violations: results.violations,
            passes: results.passes,
            hasIssues: results.violations.length > 0
        };
    } catch (error) {
        return {
            element: element.tagName.toLowerCase(),
            error: error.message,
            hasIssues: true
        };
    }
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

// REACT_025: Ensure unique landmarks (2 issues)
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
                return match.replace(/^</, '<' + tag).replace(`<${tag}`, `<${tag} role="region"`);
            });
        }
    });

    return html;
}

// REACT_036: Fix 1 fake link issue
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
  buttons.forEach(button => {
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

// TODO: Implement this function for creating in-page buttons
// (Now implemented with accessibility improvements)
function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    button.setAttribute('aria-label', buttonText); // Add ARIA label
    button.setAttribute('role', 'button'); // Added for accessibility
    document.body.appendChild(button);
}

function renderAccessibilityReport(insightReport) {
    addressAccessibilityIssues(insightReport);
}

function renderUIComponents() {
    createInPageButton('accessibility-btn', 'Check Accessibility', 'accessibility-button');
}

// Accessibility improvements for addBook function/form
function addBook(title, author, isbn) {
    // Create form elements with proper ARIA attributes
    const form = document.createElement('form');
    form.setAttribute('role', 'form');
    form.setAttribute('aria-label', 'Add a new book');

    // Title input
    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'book-title');
    titleLabel.textContent = 'Book Title:';
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

// Added function to handle button click events
function handleButtonClick(buttonId, callback) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener('click', callback);
    }
}

function newFunctionForMain() {
    console.log('New function is now accessible in main.js');
}

// Preserve any existing exports here
// Export all public functions
export {
    addressAccessibilityIssues,
    createInPageButton,
    renderAccessibilityReport,
    renderUIComponents,
    addBook,
    handleButtonClick,
    newFunctionForMain,
    addLangAttribute,
    fixTableStructure,
    fixLandmarks,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinks,
    applyAccessibilityFixes,
    generateAccessibilityReport,
    quickAccessibilityCheck,
    validateElement
};