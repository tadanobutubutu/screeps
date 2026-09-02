// TODO: This is the existing code that needs to be preserved (This comment remains as-is)
// Main entry point for dependency visualization tool
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// [PLACE ALL EXISTING FUNCTIONS, VARIABLES, AND EXPORTS HERE]

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// Importing the necessary functions (for illustration purposes)
import { getLangAttribute, createInPageButton, checkLinkAccessibility } from './utils/accessibilityUtils';
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

  if (!position || typeof position !== 'object' ||
      typeof position.x !== 'number' || typeof position.y !== 'number') {
    throw new Error('Position must be an object with x and y coordinates');
  }

  // Create a new entity object with default properties
  const entity = {
    type: entityType,
    position: { ...position },
    health: properties.health || 100,
    speed: properties.speed || 1,
    createdAt: new Date(),
    ...properties
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

// REACT_017: Validate and fix landmark issues
function validateLandmark(element) {
    if (!element) return { valid: false, message: 'Element is null or undefined' };
    
    const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
    const role = element.getAttribute('role');
    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    
    // HTML5 landmark elements
    const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
    
    if (role && validLandmarks.includes(role.toLowerCase())) {
        return { valid: true, message: 'Valid landmark role' };
    }
    
    if (html5Landmarks.includes(tagName)) {
        return { valid: true, message: 'Valid HTML5 landmark element' };
    }
    
    return { valid: false, message: 'No valid landmark found' };
}

// REACT_017: Validate landmark structure
function validateLandmarkStructure(html) {
    if (typeof html !== 'string') return { valid: true, issues: [] };
    
    const issues = [];
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];
    
    landmarkRoles.forEach(role => {
        const pattern = new RegExp(`role=["']${role}["']`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            issues.push({
                type: 'duplicate-landmark',
                role: role,
                count: matches.length,
                message: `Duplicate ${role} landmark found (${matches.length} occurrences)`
            });
        }
    });
    
    return { valid: issues.length === 0, issues: issues };
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svgElement) {
    if (!svgElement || typeof svgElement !== 'object') return '';
    
    // Check for aria-label
    const ariaLabel = svgElement.getAttribute ? svgElement.getAttribute('aria-label') : null;
    if (ariaLabel) return ariaLabel;
    
    // Check for aria-labelledby
    const ariaLabelledby = svgElement.getAttribute ? svgElement.getAttribute('aria-labelledby') : null;
    if (ariaLabelledby) return ariaLabelledby;
    
    // Check for title element inside SVG
    const title = svgElement.querySelector ? svgElement.querySelector('title') : null;
    if (title && title.textContent) return title.textContent;
    
    // Check for desc element inside SVG
    const desc = svgElement.querySelector ? svgElement.querySelector('desc') : null;
    if (desc && desc.textContent) return desc.textContent;
    
    return '';
}

// REACT_041: Set SVG accessibility attributes
function setSvgAttributes(svgElement, accessibleName) {
    if (!svgElement || typeof svgElement !== 'object') return svgElement;
    
    // Set role="img" if not already set
    if (!svgElement.getAttribute || !svgElement.getAttribute('role')) {
        if (svgElement.setAttribute) {
            svgElement.setAttribute('role', 'img');
        }
    }
    
    // Set aria-label if name is provided
    if (accessibleName && svgElement.setAttribute) {
        svgElement.setAttribute('aria-label', accessibleName);
    }
    
    return svgElement;
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
  
  // Validate landmarks (REACT_017)
  const landmarkIssues = validateLandmarkStructure(insightReport && insightReport.html ? insightReport.html : '');
  const landmarkValidation = insightReport && insightReport.element ? validateLandmark(insightReport.element) : null;
  
  // Handle SVG accessibility (REACT_041)
  const svgAccessibleName = insightReport && insightReport.svgElement ? getSvgAccessibleName(insightReport.svgElement) : '';
  if (insightReport && insightReport.svgElement) {
    setSvgAttributes(insightReport.svgElement, svgAccessibleName);
  }
  
  console.log('Addressing accessibility issues from insight report:', insightReport);
  console.log('Landmark issues:', landmarkIssues);
  console.log('Landmark validation:', landmarkValidation);
  console.log('SVG accessible name:', svgAccessibleName);
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
    wrapPrimaryContentInMain,
    ensureUniqueLandmarks,
    fixFakeLinks,
    applyAccessibilityFixes,
    addLangAttribute,
    fixTableStructure,
    addressAccessibilityIssues,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    setSvgAttributes
};

// Run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
    main();
}