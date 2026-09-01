// TODO: This is the existing code that needs to be preserved (This comment remains as-is)
// Main entry point for dependency visualization tool
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// [PLACE ALL EXISTING FUNCTIONS, VARIABLES, AND EXPORTS HERE]

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// Importing the necessary functions (for illustration purposes)
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import {
    validateTableAccessibility,
    validateTableStructure,
} from './utils/tableAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';

// TODO: Implement spawning logic
function spawnEntity(entityType, position, properties = {}) {
    // Validate required parameters
    if (!entityType || typeof entityType !== 'string') {
        throw new Error('Entity type must be a non-empty string');
    }

    if (
        !position ||
        typeof position !== 'object' ||
        typeof position.x !== 'number' ||
        typeof position.y !== 'number'
    ) {
        throw new Error('Position must be an object with x and y coordinates');
    }

    // Create a new entity object with default properties
    const entity = {
        type: entityType,
        position: { ...position },
        health: properties.health || 100,
        speed: properties.speed || 1,
        createdAt: new Date(),
        ...properties,
    };

    // Additional initialization based on entity type
    switch (entityType.toLowerCase()) {
        case 'player':
            entity.inventory = properties.inventory || [];
            entity.score = properties.score || 0;
            break;
        case 'enemy':
            entity.aggression = properties.aggression || 50;
            entity.damage = properties.damage || 10;
            break;
        case 'npc':
            entity.dialogue = properties.dialogue || [];
            break;
        default:
            // For custom entity types, merge any additional properties
            Object.assign(entity, properties);
    }

    return entity;
}

// TODO: Implement calculateDiscount
function calculateDiscount(originalPrice, discountPercentage) {
    const discountAmount = originalPrice * (discountPercentage / 100);
    return originalPrice - discountAmount;
}

// Example of adding a new function
function newFunction() {
    // Function body
}

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation
// main.js - Combined utility and accessibility features

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// Version 1 implementation (HEAD branch) - preserved accessibility enhancements

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Original code goes here
// ----- END ORIGINAL CODE -----

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

        // Check for aria-label or aria-labelledby if link has no text
        if (!text && !link.hasAttribute('aria-label') && !link.hasAttribute('aria-labelledby')) {
            issues.push(
                `Link with href "${href}" has no accessible name (missing text, aria-label, or aria-labelledby)`
            );
        }

        // Check if link is decorative but not marked as such
        if (href === '#' && !link.hasAttribute('aria-hidden') && !link.hasAttribute('role')) {
            issues.push(
                `Decorative link with href="#" should have aria-hidden="true" or role="presentation"`
            );
        }
    });

    return issues;
}

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// Version 1 implementation (HEAD branch) - preserved accessibility enhancements
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

// Dependency graph accessibility functions (merged from HEAD)
const accessibilityUtils = {
    init: function () {
        // REACT_042: Ensure dependencyGraph container has proper ARIA role
        this.ensureDependencyGraphRole();

        // REACT_040: Replace my-button with actual button id
        this.replaceMyButtonId();

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

                    if (!hasLabel) {
                        element.setAttribute('aria-label', `${role} ${index + 1}`);
                    }
                });
            }
        });

        const landmarksAll = document.querySelectorAll('nav, main, aside, footer');
        const seenIds = new Set();
        const seenRoles = new Map();

        landmarksAll.forEach((landmark) => {
            const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();

            if (!landmark.id) {
                let id = role;
                let counter = 1;
                while (seenIds.has(id)) {
                    id = `${role}-${counter++}`;
                }
                landmark.id = id;
                seenIds.add(id);
            } else {
                seenIds.add(landmark.id);
            }

            if (!seenRoles.has(role)) {
                seenRoles.set(role, []);
            }
            seenRoles.get(role).push(landmark);
        });

        const mainLandmarks = document.querySelectorAll('main, [role="main"]');
        if (mainLandmarks.length > 1) {
            for (let i = 1; i < mainLandmarks.length; i++) {
                mainLandmarks[i].setAttribute('aria-hidden', 'true');
            }
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

            // Add keyboard navigation support
            graph.addEventListener('keydown', function (e) {
                if (e.key === 'Tab') {
                    // Handle tab navigation within graph
                }
            });
        });
    },
};

// Export accessibility utility functions
export {
    getLangAttribute,
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLinkAccessibility,
    handleFakeLinks,
    checkLinkAccessibility,
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
    spawnEntity,
    accessibilityUtils,
};

// Run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
    main();
}
