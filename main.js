// main.js - Application entry point

// Import necessary modules
import { initializeApp } from './app.js';
import { handleAccessibility } from './accessibility.js';
import { validateUserInput } from './utils/validation.js';

// Configuration
const config = {
    apiUrl: 'https://api.example.com',
    timeout: 5000,
    enableAccessibility: true
};

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp(config);
    
    // Address new accessibility issues from the insight report
    handleAccessibility();
    
    // Setup form validation
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', validateUserInput);
    }
});

// Helper function for logging
export function logMessage(message, level = 'info') {
    console[`${level}`](`[App] ${message}`);
}

// Accessibility helper function
export function checkAccessibilityCompliance(element) {
    const issues = [];
    
    // Check for missing alt attributes on images
    const images = element.querySelectorAll('img');
    images.forEach((img, index) => {
        if (!img.alt && !img.getAttribute('role')) {
            issues.push({
                type: 'missing-alt',
                element: `img:nth-child(${index + 1})`,
                severity: 'high',
                recommendation: 'Add descriptive alt text or role="presentation" for decorative images'
            });
        }
    });
    
    // Check for buttons without accessible names
    const buttons = element.querySelectorAll('button');
    buttons.forEach((btn, index) => {
        const hasText = btn.textContent.trim().length > 0;
        const hasAriaLabel = btn.getAttribute('aria-label');
        const hasAriaLabelledby = btn.getAttribute('aria-labelledby');
        
        if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
            issues.push({
                type: 'button-no-name',
                element: `button:nth-child(${index + 1})`,
                severity: 'critical',
                recommendation: 'Add text content, aria-label, or aria-labelledby to button'
            });
        }
    });
    
    // Check for form inputs without labels
    const inputs = element.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"])');
    inputs.forEach((input, index) => {
        const hasLabel = input.getAttribute('aria-label') || 
                         input.getAttribute('aria-labelledby') ||
                         document.querySelector(`label[for="${input.id}"]`);
        
        if (!input.id && !hasLabel) {
            issues.push({
                type: 'input-no-label',
                element: `input:nth-child(${index + 1})`,
                severity: 'critical',
                recommendation: 'Add id to input and associate with a label, or use aria-label/aria-labelledby'
            });
        }
    });
    
    // Check for interactive elements with insufficient contrast potential
    const links = element.querySelectorAll('a');
    links.forEach((link, index) => {
        const style = window.getComputedStyle(link);
        const bgStyle = window.getComputedStyle(link.parentElement || element);
        
        // Basic check - full implementation would calculate actual color contrast ratios
        if (style.color === bgStyle.backgroundColor) {
            issues.push({
                type: 'contrast-issue',
                element: `a:nth-child(${index + 1})`,
                severity: 'medium',
                recommendation: 'Ensure link color has sufficient contrast with background'
            });
        }
    });
    
    return issues;
}

// Export for testing
export { config };

// Uncomment the implementation of the function for addressing new accessibility issues from the insight report
export function getAccessibilityReport(scope = document) {
    const allIssues = [];
    
    // Run comprehensive accessibility checks
    const altIssues = checkAccessibilityCompliance(scope);
    allIssues.push(...altIssues);
    
    // Check for proper heading hierarchy
    const headings = scope.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingLevels = Array.from(headings).map(h => parseInt(h.tagName[1]));
    for (let i = 1; i < headingLevels.length; i++) {
        if (headingLevels[i] - headingLevels[i-1] > 1) {
            allIssues.push({
                type: 'heading-skip',
                element: headings[i].tagName,
                severity: 'medium',
                recommendation: 'Heading levels should not skip (e.g., h1 to h3)'
            });
        }
    }
    
    // Check for lang attribute on html element
    if (!document.documentElement.hasAttribute('lang')) {
        allIssues.push({
            type: 'missing-lang',
            element: 'html',
            severity: 'critical',
            recommendation: 'Add lang attribute to html element for screen readers'
        });
    }
    
    return {
        timestamp: new Date().toISOString(),
        totalIssues: allIssues.length,
        issues: allIssues,
        summary: {
            critical: allIssues.filter(i => i.severity === 'critical').length,
            high: allIssues.filter(i => i.severity === 'high').length,
            medium: allIssues.filter(i => i.severity === 'medium').length,
            low: allIssues.filter(i => i.severity === 'low').length
        }
    };
}

// Export for external use
export default {
    logMessage,
    checkAccessibilityCompliance,
    getAccessibilityReport,
    config
};