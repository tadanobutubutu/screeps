// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_027: Fix 26 table structure issues
// REACT_017: Add/fix landmark issues
// REACT_041: Add accessible names to 2 SVGs
// REACT_025: Ensure unique landmarks (2 issues) — (DONE: ensureUniqueLandmarks)
// REACT_036: Fix 1 fake link issue

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

    // Function to validate table accessibility
    function validateTableAccessibility(tableElement) {
      if (!tableElement) return false;

      // Check if table has a caption
      const hasCaption = tableElement.querySelector('caption') !== null;

      // Check if table has proper headers
      const hasHeaders = tableElement.querySelector('thead') !== null ||
                        tableElement.querySelector('th') !== null;

      // Check if table has proper scope attributes for headers
      const headers = tableElement.querySelectorAll('th');
      let hasScope = true;
      headers.forEach(header => {
        if (!header.hasAttribute('scope')) {
          hasScope = false;
        }
    });

    return html;
}

    // Function to validate table structure
    function validateTableStructure(tableElement) {
      if (!tableElement) return false;

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
    // Apply accessibility fixes to HTML content based on insight report
    if (insightReport && insightReport.html) {
        insightReport.html = applyAccessibilityFixes(insightReport.html);
    }
    console.log('Addressing accessibility issues from insight report:', insightReport);
}

    // Function to validate landmark
    function validateLandmark(landmarkElement) {
      if (!landmarkElement) return false;

// New function to address accessibility issues
function addressAccessibilityIssues() {
    // Implement the changes required to address accessibility issues from the insight report
    // For example, this could be calling existing utility functions to validate accessibility
    const linkIssues = checkLinkAccessibility();
    const tableIssues = validateTableAccessibility();
    const tableStructureIssues = validateTableStructure();
    const linkAccessibilityIssues = validateLinkAccessibility();
    const fakeLinkIssues = handleFakeLinks();

    // Handle issues (e.g., log them, display warnings, etc.)
    // For demonstration purposes, we will just log the issues to the console
    console.log('Link Accessibility Issues:', linkIssues);
    console.log('Table Accessibility Issues:', tableIssues);
    console.log('Table Structure Issues:', tableStructureIssues);
    console.log('Link Accessibility Validation Issues:', linkAccessibilityIssues);
    console.log('Fake Link Issues:', fakeLinkIssues);

    // Function to validate landmark structure
    function validateLandmarkStructure(landmarkElement) {
      if (!landmarkElement) return false;

// Dependency graph accessibility functions (merged from HEAD)
const accessibilityUtils = {
    init: function () {
        // REACT_042: Ensure dependencyGraph container has proper ARIA role
        this.ensureDependencyGraphRole();

    // Function to get SVG accessible name
    function getSvgAccessibleName(svgElement) {
      if (!svgElement) return '';

        // REACT_037: Google sign-in logic
        this.googleSignIn();

        // TODO: Identify and update specific functions that render dependency graphs or
        this.updateDependencyGraphs();
    },
    ensureUniqueLandmarks: function () {
        // REACT_017 & REACT_025: Ensure unique landmarks by adding unique IDs
        var landmarks = this.main.querySelectorAll('[role="main"]');
        landmarks.forEach(function (landmark, index) {
            if (!landmark.id) {
                landmark.id = 'main-content-' + (index + 1);
            }
            landmark.setAttribute(
                'aria-label',
                landmark.getAttribute('aria-label') || 'Main content'
            );
        });

        // Additional landmark uniqueness handling from origin/main
        const uniqueLandmarkSelectors = [
            'main',
            '[role"main"]',
            '[role="banner"]',
            '[role="contentinfo"]',
            '[role="search"]',
        ];
        uniqueLandmarkSelectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 1) {
                elements.forEach((element, index) => {
                    const existingLabel = element.getAttribute('aria-label');
                    const elementTag = element.tagName.toLowerCase();
                    const role = element.getAttribute('role') || elementTag;

                    if (!existingLabel) {
                        element.setAttribute('aria-label', `${role} ${index + 1}`);
                    }
                });
            }
        });

        const sectionLandmarkSelectors = ['nav', '[role="region"]', 'aside'];
        sectionLandmarkSelectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 1) {
                elements.forEach((element, index) => {
                    const hasLabel =
                        element.getAttribute('aria-label') ||
                        element.getAttribute('aria-labelledby') ||
                        element.id;
                    const role = element.getAttribute('role') || element.tagName.toLowerCase();

    // Function to set SVG attributes
    function setSvgAttributes(svgElement, name) {
      if (!svgElement || !name) return;

        const landmarksAll = document.querySelectorAll('nav, main, aside, footer');
        const seenIds = new Set();
        const seenRoles = new Map();

        landmarksAll.forEach((landmark) => {
            const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();

    // Export the report generation function
    module.exports = {
      generateAccessibilityReport: async function () {
        const report = await scanAccessibility();
        writeReport(report);
      },
      checkLinkAccessibility,
      addressAccessibilityIssues,
      getLangAttribute,
      createInPageButton,
      a11y,
      importAndExecute,
      validateTableAccessibility,
      validateTableStructure,
      validateLandmark,
      validateLandmarkStructure,
      getSvgAccessibleName,
      setSvgAttributes
    };

            if (!seenRoles.has(role)) {
                seenRoles.set(role, []);
            }
            seenRoles.get(role).push(landmark);
        });

    const style = window.getComputedStyle(element);
    const bgColor = style.backgroundColor;
    const color = style.color;

    // Convert colors to RGB
    const bgRgb = parseColor(bgColor);
    const fgRgb = parseColor(color);

    if (!bgRgb || !fgRgb) return false;

    // Calculate luminance
    const bgLum = calculateLuminance(bgRgb);
    const fgLum = calculateLuminance(fgRgb);

    // Calculate contrast ratio
    const lighter = Math.max(bgLum, fgLum);
    const darker = Math.min(bgLum, fgLum);
    const contrastRatio = (lighter + 0.05) / (darker + 0.05);

    // WCAG AA standard requires at least 4.5:1 contrast for normal text
    return contrastRatio >= 4.5;
}

// Helper function to parse color strings to RGB
function parseColor(colorString) {
    if (!colorString) return null;

    // Handle rgb() format
    const rgbMatch = colorString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1], 10),
            g: parseInt(rgbMatch[2], 10),
            b: parseInt(rgbMatch[3], 10)
        };
    }

    // Handle rgba() format (ignore alpha)
    const rgbaMatch = colorString.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)$/);
    if (rgbaMatch) {
        return {
            r: parseInt(rgbaMatch[1], 10),
            g: parseInt(rgbaMatch[2], 10),
            b: parseInt(rgbaMatch[3], 10)
        };
    }

    // Handle hex format
    const hexMatch = colorString.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
        const hex = hexMatch[1];
        if (hex.length === 3) {
            return {
                r: parseInt(hex[0] + hex[0], 16),
                g: parseInt(hex[1] + hex[1], 16),
                b: parseInt(hex[2] + hex[2], 16)
            };
        } else {
            return {
                r: parseInt(hex.substring(0, 2], 16),
                g: parseInt(hex.substring(2, 4), 16),
                b: parseInt(hex.substring(4, 6), 16)
            };
        }
    },
    fixTableStructures: function () {
        // REACT_027: Fix 26 table structure issues - add proper th, caption, scope
        var tables = document.querySelectorAll('table');
        tables.forEach(function (table) {
            var headers = table.querySelectorAll('th');
            headers.forEach(function (th) {
                if (!th.getAttribute('scope')) {
                    th.setAttribute('scope', 'col');
                }
            });
            if (!table.querySelector('caption')) {
                var caption = document.createElement('caption');
                caption.textContent = 'Data table';
                table.insertBefore(caption, table.firstChild);
            }
        });
    },
    addSvgAccessibility: function () {
        // REACT_041: Add accessible names to 2 SVGs
        var svgs = document.querySelectorAll('svg');
        svgs.forEach(function (svg, index) {
            if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
                var label = 'SVG graphic ' + (index + 1);
                svg.setAttribute('aria-label', label);
            }
            if (!svg.getAttribute('role')) {
                svg.setAttribute('role', 'img');
            }
        });
    },
    fixFakeLinks: function () {
        // REACT_036: Fix 1 fake link issue - ensure proper link behavior
        var fakeLinks = document.querySelectorAll('[role="link"], a[href="#"], a[href=""]');
        fakeLinks.forEach(function (link) {
            if (link.tagName !== 'A') {
                link.setAttribute('role', 'button');
                link.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        link.click();
                    }
                });
            }
        });
    },
    ensureDependencyGraphRole: function () {
        // REACT_042: Ensure dependencyGraph container has proper ARIA role
        var depGraph =
            document.getElementById('dependencyGraph') ||
            document.querySelector('.dependency-graph');
        if (depGraph && !depGraph.getAttribute('role')) {
            depGraph.setAttribute('role', 'region');
            if (!depGraph.getAttribute('aria-label')) {
                depGraph.setAttribute('aria-label', 'Dependency graph visualization');
            }
        }
    },
    replaceMyButtonId: function () {
        // REACT_040: Replace my-button with actual button id for accessibility
        var myButton = document.getElementById('my-button');
        if (myButton) {
            myButton.id = 'primary-action-button';
            myButton.setAttribute('aria-label', 'Primary action button');
        }
    },
    googleSignIn: function () {
        // REACT_037: Google sign-in logic
        var signInBtn = document.getElementById('google-signin-button');
        if (signInBtn) {
            signInBtn.setAttribute('aria-label', 'Sign in with Google');
            signInBtn.addEventListener('click', function () {
                // Google sign-in implementation
                console.log('Google sign-in initiated');
            });
        }
    },
    updateDependencyGraphs: function () {
        // TODO: Implement function to update dependency graphs
        const dependencyGraphs = document.querySelectorAll('.dependency-graph, #dependencyGraph');
        dependencyGraphs.forEach((graph) => {
            // Ensure proper ARIA attributes
            if (!graph.getAttribute('role')) {
                graph.setAttribute('role', 'region');
            }
            if (!graph.getAttribute('aria-label')) {
                graph.setAttribute('aria-label', 'Dependency graph visualization');
            }

            // Add interactive features if needed
            const nodes = graph.querySelectorAll('.node');
            nodes.forEach((node, index) => {
                if (!node.getAttribute('tabindex')) {
                    node.setAttribute('tabindex', '0');
                }
                if (!node.getAttribute('aria-label')) {
                    node.setAttribute('aria-label', `Dependency node ${index + 1}`);
                }
            });

    return namedColors[colorString.toLowerCase()] || null;
}

// Helper function to calculate relative luminance
function calculateLuminance(rgb) {
    const sRGB = [rgb.r, rgb.g, rgb.b].map(c => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
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

// Preserve any existing exports here
// export { existingFunction1, existingFunction2, ... };

// Export accessibility utility functions
// Re-add the required exports
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
    myNewFunction,
    functionA,
    functionB,
    isLinkAccessible,
    checkColorContrast,
    parseColor,
    calculateLuminance,
    validateTableStructure,
    validateLinkAccessibility,
    handleFakeLinks
};

// Run if executed directly
if (require.main === module) {
  main();
}

function main() {
  // Entry point for the module
}