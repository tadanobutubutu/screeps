// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Original code goes here
// ----- END ORIGINAL CODE -----

// REACT_015: Add lang attribute to the <html> element
function addLangAttribute(html, lang = 'en') {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/lang\s*=/i.test(attrs)) return match;
        return `<html${attrs} lang="${lang}">`;
    });
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

    // Ensure every table has a caption
    html = html.replace(/<table([^>]*)>/gi, (match, attrs) => {
        if (/<caption/i.test(match)) return match;
        return match + '<caption></caption>';
    });

    // Close caption and wrap rows in thead/tbody where missing
    html = html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (match, attrs, content) => {
        if (/<thead/i.test(content)) return match;
        const rows = content.match(/<tr>[\s\S]*?<\/tr>/gi) || [];
        if (rows.length === 0) return match;
        const firstRows = rows.slice(0, 1).join('');
        const restRows = rows.slice(1).join('');
        const thPattern = /<td>/gi;
        const firstRowHasTh = thPattern.test(firstRows);
        let thead = '';
        let tbody = restRows;

        if (!firstRowHasTh) {
            thead = '<thead><tr>' + firstRows.replace(/<td>/gi, '<th scope="col">').replace(/<\/td>/gi, '</th>') + '</tr></thead>';
        } else {
            thead = '<thead>' + firstRows + '</thead>';
        }
        if (!tbody) tbody = '';
        tbody = '<tbody>' + tbody + '</tbody>';

        return '<table' + attrs + '>' + thead + tbody + '</table>';
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

// TODO: Implement wrapPrimaryContentInMain function, including the added logic (from both versions)
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

    // Add class "primary-content" to the new <main> element (from both versions)
    main.className = "primary-content";

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

/**
 * Creates an in-page button element with the specified ID, text, and class
 * @param {string} buttonId - The ID to assign to the button
 * @param {string} buttonText - The text content of the button
 * @param {string} buttonClass - The CSS class to assign to the button
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    button.setAttribute('aria-label', buttonText); // Added for accessibility
    button.setAttribute('role', 'button'); // Added for accessibility
    document.body.appendChild(button);
    return button;
}

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

    // Here you could add additional logic to address the issues
    // For example, you might want to update the DOM or call other functions
}

// Export accessibility utility functions
export {
    getLangAttribute,
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLinkAccessibility,
    handleFakeLinks,
    checkLinkAccessibility,
    divide,
    spawnEntity,
    calculateDiscount,
    wrapPrimaryContentInMain,
    ensureUniqueLandmarks,
    fixFakeLinks,
    applyAccessibilityFixes,
    addLangAttribute,
    fixTableStructure
};