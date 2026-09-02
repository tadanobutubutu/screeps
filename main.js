const main = require('./utilities');

const {
    createInPageButton,
    createWebResourceButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    getLangAttribute,
    validateAccessibilityReport,
    exportUtils,
    handleCredentialResponse,
    ensureElementHasId,
    ensureElementHasIdOrigin,
    addAriaLabel,
    renderDependencyGraphs,
    fixButtonIdentifiers,
    fixDependencyGraphAria,
    addMainLandmarkToIndex,
    focusTrap,
    ensureUniqueLandmarks,
    addProperLandmarkRegions,
    validateLinkAccessibility,
    handleFakeLinks,
    checkAccessibility,
} = main;

// Implement the function for addressing accessibility issues from insight report
function addressAccessibilityIssues(container, insightReport) {
    const fixes = {
        langAdded: false,
        mainLandmarkAdded: false,
        landmarksFixed: 0,
        svgNamesAdded: 0,
        fakeLinksFixed: 0,
    };

    if (!insightReport || !insightReport.issues) {
        return fixes;
    }

    // Add lang attribute to HTML element if missing
    const htmlEl =
        container.ownerDocument && container.ownerDocument.documentElement;
    if (htmlEl) {
        const langAttr = getLangAttribute ? getLangAttribute() : 'en';
        if (!htmlEl.getAttribute('lang')) {
            htmlEl.setAttribute('lang', langAttr || 'en');
            fixes.langAdded = true;
        }
    }

    // Add main landmark if missing
    const mainElement = container.querySelector('main');
    if (!mainElement) {
        const body = container.ownerDocument && container.ownerDocument.body;
        if (body) {
            const newMain = container.ownerDocument.createElement('main');
            while (body.firstChild) {
                newMain.appendChild(body.firstChild);
            }
            body.insertBefore(newMain, body.firstChild);
            fixes.mainLandmarkAdded = true;
        }
    }

    // Update the existing function using the new functions for rendering graph/index
    if (renderDependencyGraphs) {
        renderDependencyGraphs(container);
    }

    // Fix landmark issues
    if (validateLandmark) {
        validateLandmark(container);
    }

    if (ensureUniqueLandmarks) {
        const uniqueLandmarkFixes = ensureUniqueLandmarks(container);
        fixes.landmarksFixed = uniqueLandmarkFixes || 0;
    }

    // Fix SVG accessible names
    const svgElements = container.querySelectorAll('svg');
    svgElements.forEach((svg) => {
        const accessibleName = getSvgAccessibleName ? getSvgAccessibleName(svg) : null;
        if (
            accessibleName &&
            !svg.getAttribute('aria-label') &&
            !svg.getAttribute('aria-labelledby')
        ) {
            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-label', accessibleName);
            fixes.svgNamesAdded++;
        }
    });

    // Fix fake link issues (elements that look like links but are missing href)
    const fakeLinks = container.querySelectorAll(
        '[role="link"], [onclick*="location"], [onclick*="href"], a:not([href])'
    );
    fakeLinks.forEach((link) => {
        const linkId = link.id || 'fake-link-' + Math.random().toString(36).substr(2, 9);
        link.setAttribute('href', '#' + linkId);
        link.setAttribute('role', 'link');
        fixes.fakeLinksFixed++;
    });

    // Validate accessibility report
    const accessibilityReport = validateAccessibilityReport ? validateAccessibilityReport(container) : null;
    if (accessibilityReport && accessibilityReport.issues && accessibilityReport.issues.length > 0) {
        log(`Accessibility report contains ${accessibilityReport.issues.length} remaining issues`, 'warn');
    }

    // Implement focus trap for keyboard navigation
    if (focusTrap) {
        focusTrap(container);
    }

    if (fixes.langAdded) {
        log('Lang attribute added to HTML element', 'info');
    }

    if (fixes.mainLandmarkAdded) {
        log('Main landmark added', 'info');
    }

    // Check for new accessibility issues
    const newAccessibilityIssues = checkAccessibility ? checkAccessibility(container) : [];
    if (newAccessibilityIssues.length > 0) {
        log(
            `New accessibility issues found: ${newAccessibilityIssues.map((i) => i.message || i).join(', ')}`,
            'error'
        );
    }

    const landmarkFixesCount = fixes.landmarksFixed || 0;
    if (landmarkFixesCount > 0) {
        log(`Fixed accessibility for ${landmarkFixesCount} unique landmarks`, 'info');
    }

    const svgFixes = fixes.svgNamesAdded || 0;
    if (svgFixes > 0) {
        log(`Fixed accessible names for ${svgFixes} SVGs`, 'info');
    }

    const fakeLinkFixes = fixes.fakeLinksFixed || 0;
    if (fakeLinkFixes > 0) {
        log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info');
    }

    return fixes;
}

// Helper function for logging
function log(message, level) {
    const levels = ['info', 'warn', 'error'];
    const logLevel = levels.includes(level) ? level : 'info';
    if (typeof console !== 'undefined') {
        console[logLevel](`[Accessibility] ${message}`);
    }
}

// Export functions
module.exports = {
    ...exportUtils,
    addressAccessibilityIssues,
    checkAccessibility,
    createInPageButton,
    createWebResourceButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    getLangAttribute,
    validateAccessibilityReport,
    handleCredentialResponse,
    ensureElementHasId,
    ensureElementHasIdOrigin,
    addAriaLabel,
    renderDependencyGraphs,
    fixButtonIdentifiers,
    fixDependencyGraphAria,
    addMainLandmarkToIndex,
    focusTrap,
};