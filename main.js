// TODO: This is the modified and merged code
// This is the existing code that needs to be preserved in main.js
//_Commit: 3983c7bf3a9d6c99109e3c8293ba4f018fca6d94_
//<!-- todo-hash: 4b03b75f14168d98d014bcb3fe7f5d35f70503d4 -->


const fs = require('fs');
const main = require('./utilities');

// TODO: add the new functions or changes requested in the issue
// Here is the implementation for checking link accessibility
function checkLinkAccessibility() {
    const issues = [];
    const links = document.querySelectorAll('a[href]');
    
    links.forEach((link, index) => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();
        
        // Check for empty href
        if (!href || href === '' || href === '#') {
            issues.push({
                index,
                type: 'empty_href',
                message: `Link at index ${index} has an empty or invalid href`,
                element: link
            });
        }
        
        // Check for JavaScript hrefs
        if (href && (href.startsWith('javascript:') || href === 'javascript:void(0)')) {
            issues.push({
                index,
                type: 'javascript_href',
                message: `Link at index ${index} uses JavaScript href which may not be accessible`,
                element: link
            });
        }
        
        // Check for generic link text
        const genericTexts = ['click here', 'here', 'read more', 'more', 'link', 'learn more'];
        if (genericTexts.includes(text.toLowerCase())) {
            issues.push({
                index,
                type: 'generic_text',
                message: `Link at index ${index} has generic accessible text: "${text}"`,
                element: link
            });
        }
        
        // Check for missing accessible text
        if (!text || text.length === 0) {
            const ariaLabel = link.getAttribute('aria-label');
            const title = link.getAttribute('title');
            if (!ariaLabel && !title) {
                issues.push({
                    index,
                    type: 'missing_text',
                    message: `Link at index ${index} has no accessible text`,
                    element: link
                });
            }
        }
    });
    
    if (issues.length > 0) {
        console.warn(`Link accessibility issues found: ${issues.length}`);
        issues.forEach(issue => {
            console.warn(`- ${issue.message}`);
        });
    }
    
    return {
        isValid: issues.length === 0,
        issues
    };
}

const accessibilityUtils = {
  initSkipLink,
  trapFocus,
  newFocusTrap: (element) => {
    if (!element) return;
    const focusable = element.querySelectorAll(
      'a[href], button, textarea, input, select'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

// Function to validate landmark structure for accessibility issues
function validateLandmarkStructure() {
    const requiredLandmarks = ['header', 'main', 'footer'];
    const missingLandmarks = [];

    requiredLandmarks.forEach(landmark => {
        const element = document.querySelector(landmark);
        if (!element) {
            missingLandmarks.push(landmark);
        }
    });

    if (missingLandmarks.length > 0) {
        console.warn(`Warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
        return false;
    }

    return true;
}

// Function to ensure unique landmarks for accessibility (REACT_025)
function ensureUniqueLandmarks() {
    const landmarkSelectors = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
    const issues = [];

    landmarkSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        const elementArray = Array.from(elements);

        // For landmarks that should be unique (header, main, footer)
        if (['header', 'main', 'footer'].includes(selector) && elementArray.length > 1) {
            issues.push(`Multiple <${selector}> elements found (${elementArray.length}). Only one should be used.`);
        }

        // Check for sections/articles without accessible headings (potential landmark duplicates)
        if (selector === 'section' || selector === 'article') {
            elementArray.forEach((el, index) => {
                if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
                    const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
                    if (!heading) {
                        issues.push(`<${selector}> at index ${index} is missing an accessible name (aria-label, aria-labelledby, or heading).`);
                    }
                }
            });
        }
    });

    if (issues.length > 0) {
        console.warn('Unique landmark issues found:', issues);
        return false;
    }

    return true;
}

// TODO: Implement harvest logic
function harvest() {
    // This function should collect resources or data from available sources
    // Add your implementation here
}

// Implement this function for creating in-page buttons
function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    return button;
}

// Preserve any existing exports here
// export { createInPageButton, validateLandmarkStructure, ensureUniqueLandmarks, harvest };