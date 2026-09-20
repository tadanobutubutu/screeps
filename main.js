// TODO: Address accessibility issues from insight report
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix table structure issues
// - REACT_017: Add/fix landmark issues
// - REACT_025: Ensure unique landmarks
// - REACT_036: Fix fake link issues
// - REACT_041: Add accessible names to SVGs
// - REACT_043: Make header focusable
// New function to check link accessibility
function checkLinkAccessibility() {
    const links = document.querySelectorAll('a, button:not([aria-label])');
    const issues = [];

    links.forEach(link => {
        if (link.tagName === 'A' && !link.href) {
            issues.push({
                element: link,
                issue: 'Missing href attribute',
                severity: 'high'
            });
        }

        if (link.tagName === 'BUTTON' && !link.getAttribute('aria-label') && !link.textContent.trim()) {
            issues.push({
                element: link,
                issue: 'Button missing accessible name',
                severity: 'high'
            });
        }
    });

    return issues;
}

// New function to make header focusable
export const makeHeaderFocusable = () => {
    const header = document.querySelector('header');
    if (header) {
        header.setAttribute('tabindex', '0');
    }
};

// Process the given insight report
function handleInsightReport(insightReport) {
    if (insightReport) {
        const accessibilityIssues = insightReport.accessibility || [];
        if (Array.isArray(accessibilityIssues) && accessibilityIssues.length > 0) {
            console.log(`Found ${accessibilityIssues.length} accessibility issues:`);
            accessibilityIssues.forEach((issue, index) => {
                if (issue && typeof issue === 'object') {
                    const description = issue.description || 'No description available';
                    const severity = issue.severity || 'unknown';
                    const impact = issue.impact || 'unknown';
                    const selector = issue.selector || 'unknown selector';
                    console.log(`Issue ${index + 1}:`);
                    console.log(`  Description: ${description}`);
                    console.log(`  Severity: ${severity}`);
                    console.log(`  Impact: ${impact}`);
                    console.log(`  Selector: ${selector}`);
                    // Attempt to address the issue based on type
                    if (issue.type) {
                        switch (issue.type) {
                            case 'color-contrast':
                                console.log('  Action: Consider adjusting color contrast for better visibility');
                                break;
                            case 'alt-text':
                                console.log('  Action: Add or improve alt text for images');
                                break;
                            case 'aria-label':
                                console.log('  Action: Add or improve aria-label attributes');
                                break;
                            case 'heading-order':
                                console.log('  Action: Review and fix heading hierarchy order');
                                break;
                            default:
                                console.log(`  Action: Review and address ${issue.type} issue`);
                        }
                    }
                    console.log('---');
                }
            });
        }
    }

    // Perform accessibility fixes
    addLangAttribute();
    makeHeaderFocusable();
    checkLinkAccessibility();
    handleAccessibilityIssues();
}

// Function to display the main game loop
module.exports = function() {
    // Initialize accessibility features
    const langAttr = getLangAttribute();
    addLangAttribute(langAttr);
    const primaryContent = wrapPrimaryContentInMain();

    // Update other accessibility features
    checkLinkAccessibility();

    // Validate accessibility
    validateTableAccessibilityAll();
    validateTableStructureAll();
    validateLandmarkAll();
    validateLandmarkStructure();
    addFixLandmarkIssues();

    // SVG accessibility
    const svgName = getSvgAccessibleName();
    addAriaToFormControls();

    // Unique landmarks and fake link fixes
    ensureUniqueLandmarksAll();
    fixFakeLinkIssues();
    createAccessibleLink();

    // Harvest and upgrade logic
    const creeps = Game.creeps;
    const sources = Game.sources;
    const controller = Game.controllers[0]; // assuming first controller

    Object.values(creeps).forEach(creep => {
        const source = creep.findClosestByPath(FIND_SOURCES, {
            filter: (source) => source.energy > 0
        });
        if (source) {
            harvest(creep, source);
        } else {
            upgradeController(creep, controller);
        }
    });
};