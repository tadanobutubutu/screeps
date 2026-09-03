// TODO: Add back any required exports that might have been removed
// TODO: This is the existing code that needs to be preserved
//_Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: ... -->

// Function to create in-page buttons
function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    return button;
}

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
        console.warn(`Accessibility Warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
        return false;
    }

    return true;
}

// Function to check link accessibility
function isLinkAccessible(linkElement) {
    if (!linkElement) {
        return false;
    }

    const href = linkElement.getAttribute('href');
    if (!href || href === '#' || href === '') {
        console.warn('Accessibility Warning: Link missing or empty href attribute');
        return false;
    }

    // Check if link is visible
    const style = window.getComputedStyle(linkElement);
    if (style.display === 'none' || style.visibility === 'hidden') {
        console.warn('Accessibility Warning: Link is hidden and not accessible');
        return false;
    }

    return true;
}

// Combined and slightly modified generateAccessibilityReport function
function generateAccessibilityReport() {
    const axe = require('axe-core');
    const report = {
        violations: [],
        warnings: [],
        errors: []
    };

    const results = axe.run();
    results.violations.forEach(violation => {
        if (violation.impact === 'critical') {
            report.errors.push({
                id: violation.id,
                description: violation.description,
                help: violation.help,
                nodes: violation.nodes.map(node => node.target)
            });
        } else if (violation.impact === 'warning') {
            report.warnings.push({
                id: violation.id,
                description: violation.description,
                help: violation.help,
                nodes: violation.nodes.map(node => node.target)
            });
        }
    });

    // Example accessibility checks
    const landmarkCheck = validateLandmarkStructure();
    if (!landmarkCheck) {
        report.warnings.push({
            id: 'landmark-missing',
            description: 'Missing required landmark structure detected',
            help: 'Ensure page has header, main, and footer landmarks'
        });
    }

    // Check all links for accessibility
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        if (!isLinkAccessible(link)) {
            report.warnings.push({
                id: 'link-inaccessible',
                description: 'Link is not accessible',
                help: 'Ensure link has valid href and is visible'
            });
        }
    });

    // Add more accessibility checks here

    // Generate the report content
    const reportContent = `Accessibility Report:
    Warnings: ${report.warnings.map(error => error.description).join(', ')}
    Errors: ${report.errors.map(error => error.description).join(', ')}`;

    // Output the report content to the console
    console.log(reportContent);
    return report;
}

// Preserve any existing exports here
export { createInPageButton, validateLandmarkStructure, generateAccessibilityReport };