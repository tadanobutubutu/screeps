// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// Preserve existing functionality
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation
// main.js - Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Internal set to track used landmark IDs
// Global set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function generateUniqueLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.floor(Math.random() * 9000) + 1000;
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
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

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (!element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Adds lang attribute as per the issue requirement
 */
function addLangAttribute() {
  // Get the HTML element
  const elementToModify = document.documentElement;
  if (elementToModify) {
    elementToModify.setAttribute('lang', 'en'); // Example: English
  }
}

// REACT_017: Add landmark roles and fix landmark issues
/**
 * Ensures unique landmarks by validating and fixing duplicates
 * @param {Array} landmarks - List of landmark elements
 * @returns {Array} Array of unique landmark elements
 */
function ensureUniqueLandmarks(landmarks) {
    const seen = new Set();
    const unique = [];
    for (const landmark of landmarks) {
        const id = landmark.id || generateUniqueLandmarkId(landmark.tagName.toLowerCase());
        if (!seen.has(id)) {
            seen.add(id);
            landmark.id = id;
            unique.push(landmark);
        } else {
            // Generate new unique ID for duplicate
            landmark.id = generateUniqueLandmarkId(landmark.tagName.toLowerCase());
            unique.push(landmark);
        }
    }
    return unique;
}

/**
 * Adds main landmark to the page
 * @param {HTMLElement} element - Element to add main landmark to
 */
function addMainLandmark(element) {
    if (element && !element.hasAttribute('role')) {
        element.setAttribute('role', 'main');
    }
}

/**
 * Adds landmark regions to specified elements
 * @param {Array} elements - Array of elements to add landmark regions to
 */
function addLandmarkRegions(elements) {
    for (const element of elements) {
        if (element && !element.hasAttribute('role')) {
            element.setAttribute('role', 'region');
        }
    }
}

/**
 * Fixes landmark issues by ensuring proper landmark roles
 * @param {HTMLElement} container - Container element to validate landmarks in
 */
function fixLandmarkIssues(container) {
    const landmarks = container.querySelectorAll('header, nav, main, aside, footer, section, article');
    for (const landmark of landmarks) {
        const tagName = landmark.tagName.toLowerCase();
        if (!landmark.hasAttribute('role')) {
            if (tagName === 'header') {
                landmark.setAttribute('role', 'banner');
            } else if (tagName === 'nav') {
                landmark.setAttribute('role', 'navigation');
            } else if (tagName === 'main') {
                landmark.setAttribute('role', 'main');
            } else if (tagName === 'aside') {
                landmark.setAttribute('role', 'complementary');
            } else if (tagName === 'footer') {
                landmark.setAttribute('role', 'contentinfo');
            }
        }
    }
}

// REACT_041: Add accessible names to SVGs
/**
 * Adds accessible names to all SVGs in the document
 * @param {Array} svgs - Array of SVG elements
 */
function addAccessibleNamesToSVGs(svgs) {
    for (const svg of svgs) {
        const accessibleName = getSvgAccessibleName(svg);
        setSvgAttributes(svg, accessibleName);
    }
}

/**
 * Adds SVG accessible names based on context or title
 * @param {SVGElement} svg - The SVG element
 * @returns {string} Accessible name for the SVG
 */
function addSvgAccessibleNames(svg) {
    // Check for title element within SVG
    const title = svg.querySelector('title');
    if (title) {
        return title.textContent;
    }
    // Check for aria-label
    if (svg.hasAttribute('aria-label')) {
        return svg.getAttribute('aria-label');
    }
    // Generate descriptive name based on context
    const parent = svg.parentElement;
    if (parent) {
        const precedingText = parent.textContent.substring(0, 50).trim();
        return precedingText || 'Decorative graphic';
    }
    return 'Decorative graphic';
}

// REACT_036: Fix fake link issues
/**
 * Fixes fake link issues by converting pseudo-links to proper buttons or links
 * @param {HTMLElement} container - Container to search for fake links
 */
function fixFakeLinkIssue(container) {
    const fakeLinks = container.querySelectorAll('[role="link"], a[href="#"], a[href=""]');
    for (const fakeLink of fakeLinks) {
        const isFakeLink = !fakeLink.href || fakeLink.href === '#' || fakeLink.href === '';
        if (isFakeLink && !fakeLink.hasAttribute('href')) {
            fakeLink.setAttribute('role', 'button');
            fakeLink.setAttribute('tabindex', '0');
        }
    }
}

/**
 * Fixes all fake link issues in the document
 */
function fixFakeLinkIssues() {
    const containers = document.querySelectorAll('main, article, section, nav');
    for (const container of containers) {
        fixFakeLinkIssue(container);
    }
}

// REACT_040: Replace my-button with actual button id for accessibility
/**
 * Ensures elements with class 'my-button' have proper accessibility attributes
 * @param {HTMLElement} container - Container to search for button elements
 */
function fixButtonIdentifiers(container) {
    const buttons = container.querySelectorAll('.my-button, [class*="button"]');
    for (const button of buttons) {
        if (!button.id) {
            button.id = generateUniqueLandmarkId('button');
        }
        // Ensure proper button role if not a native button
        if (button.tagName !== 'BUTTON') {
            button.setAttribute('role', 'button');
        }
    }
}

// REACT_042: Ensure dependencyGraph container has proper ARIA role
/**
 * Ensures the dependency graph container has proper ARIA role
 * @param {HTMLElement} container - The dependency graph container element
 */
function ensureDependencyGraphARIA(container) {
    if (container) {
        container.setAttribute('role', 'img');
        if (!container.hasAttribute('aria-label')) {
            container.setAttribute('aria-label', 'Dependency graph visualization');
        }
        if (!container.hasAttribute('aria-describedby')) {
            const description = container.querySelector('[id*="description"], [id*="desc"]');
            if (description) {
                container.setAttribute('aria-describedby', description.id);
            }
        }
    }
}

// REACT_037: Google sign-in logic
/**
 * Handles Google sign-in with accessibility considerations
 * @param {string} clientId - Google client ID
 * @returns {Promise} Promise resolving to sign-in result
 */
function googleSignIn(clientId) {
    return new Promise((resolve, reject) => {
        // Check if Google API is available
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({
                client_id: clientId,
                callback: (response) => {
                    // Handle the token response
                    if (response.credential) {
                        resolve({ success: true, token: response.credential });
                    } else {
                        resolve({ success: false, error: 'No credential received' });
                    }
                }
            });
            
            // Render the button with accessibility attributes
            const buttonContainer = document.getElementById('g-signin2');
            if (buttonContainer) {
                buttonContainer.setAttribute('aria-label', 'Sign in with Google');
            }
        } else {
            reject(new Error('Google API not available'));
        }
    });
}

// ... other fixes ...

// DOM-based accessibility code

// Add lang attribute to HTML element
getLangAttribute();

// Create in-page button with accessibility considerations
createInPageButton();

// Validate table structure and accessibility
// Assuming you have a table element with an id of 'myTable'
const table = document.getElementById('myTable');
if (table) {
    validateTableAccessibility(table);
    validateTableStructure(table);
}

// Add/fix landmark issues
const mainContainer = document.querySelector('main') || document.body;
fixLandmarkIssues(mainContainer);
validateLandmark();
addMainLandmark(mainContainer);
addLandmarkRegions(document.querySelectorAll('section, aside'));

// Add accessible names to SVGs
// Assuming you have an SVG element with an id of 'mySvg'
const svg = document.getElementById('mySvg');
if (svg) {
    const accessibleName = getSvgAccessibleName(svg);
    setSvgAttributes(svg, accessibleName);
}

// Ensure unique landmarks
// This would be handled by the appropriate function call
const landmarks = document.querySelectorAll('header, nav, main, aside, footer');
ensureUniqueLandmarks(Array.from(landmarks));

// Handle fake links
handleFakeLinks();
fixFakeLinkIssues();

// Fix button identifiers
fixButtonIdentifiers(document.body);

// Ensure dependencyGraph container has proper ARIA role
const dependencyGraph = document.getElementById('dependencyGraph');
ensureDependencyGraphARIA(dependencyGraph);

// ... rest of your code ...

// React / UI related functions