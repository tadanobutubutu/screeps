// Screeps AI - Main Module

// Main game loop
module.exports = function() {
    // Initialize accessibility features
    const langAttr = getLangAttribute();
    const primaryContent = wrapPrimaryContentInMain();

    // Validate accessibility
    validateTableAccessibilityAll();
    validateLandmark();
    validateLandmarkStructure();
    addFixLandmarkIssues();
    addAriaToFormControls();

    // SVG accessibility
    const svgName = getSvgAccessibleName();

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

    // New functions to support missing definitions
    function findIndex(arr, predicate) {
        return arr.findIndex(predicate);
    }

    function originalFilterLandmarks(landmarks, role) {
        return Array.from(landmarks).filter(function(el) {
            return el.getAttribute('role') === role;
        });
    }

    function sortLandmarksByText(landmarks) {
        return Array.from(landmarks).sort(function(a, b) {
            return a.textContent.localeCompare(b.textContent);
        });
    }

    // Accessibility helper functions
    function getLangAttribute() {
        return 'en';
    }

    function getFullLangAttribute(lang) {
        const defaultLang = getLangAttribute();
        return `${defaultLang}-US`;
    }

    function wrapPrimaryContentInMain() {
        return '<main role="main"></main>';
    }

    function validateTableAccessibility(table) {
        if (!table) return true;
        let issues = [];
        if (!table.querySelector('caption')) {
            issues.push('Missing caption');
        }
        const thElements = table.querySelectorAll('th');
        thElements.forEach(th => {
            if (!th.getAttribute('scope')) {
                issues.push('Missing scope attribute on th');
            }
        });
        return issues.length === 0;
    }

    function validateTableAccessibilityAll() {
        const doc = getDocument();
        if (!doc) return false;
        const tables = doc.querySelectorAll('table');
        let issues = [];
        tables.forEach(table => {
            if (!table.querySelector('caption')) {
                issues.push('Missing caption');
            }
            const thElements = table.querySelectorAll('th');
            thElements.forEach(th => {
                if (!th.getAttribute('scope')) {
                    issues.push('Missing scope attribute on th');
                }
            });
        });
        return issues.length === 0;
    }

    /**
     * Adds an aria-label attribute to an element if it doesn't already have one.
     * @param {HTMLElement} element - The element to add the aria-label to.
     * @param {string} label - The label text to be added.
     */
    function addAriaLabel(element, label) {
        if (element && !element.hasAttribute('aria-label')) {
            element.setAttribute('aria-label', label);
        }
    }

    function getSvgAccessibleName(svg) {
        // Get SVG accessible name
        if (!svg) return '';
        return svg.getAttribute('aria-label') || svg.getAttribute('title') || 'SVG element';
    }

    function addAriaToFormControls() {
        // Add ARIA to form controls
        const doc = getDocument();
        if (!doc) return;
        const formControls = doc.querySelectorAll('input, select, textarea');
        formControls.forEach(control => {
            if (!control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby')) {
                // Add default aria-label if missing
                const label = control.closest('label');
                if (label) {
                    control.setAttribute('aria-label', label.textContent);
                }
            }
        });
    }

    // New function to check link accessibility
    function checkLinkAccessibility() {
        return validateLinkAccessibility();
    }

    // Internal set to track used landmark IDs
    // Global set to track used landmark IDs
    const _usedLandmarkIds = new Set();

    /**
     * Creates a unique identifier for a landmark given a base name.
     * @param {string} baseName - Base name of the landmark.
     * @returns {string} Unique ID.
     */
    function createUniqueLandmarkId(baseName) {
        let candidate = baseName;
        let counter = 1;
        while (_usedLandmarkIds.has(candidate)) {
            // Collision handling: add numeric suffix
            const suffix = Math.floor(Math.random() * 900) + 100;
            candidate = `${baseName}-${suffix}`;
            counter++;
            if (counter > 100) {
                candidate = `${baseName}-${Date.now()}`;
                break;
            }
        }
        _usedLandmarkIds.add(candidate);
        return candidate;
    }

    function ensureUniqueLandmarksAll() {
        const doc = getDocument();
        if (!doc) return;
        const landmarks = doc.querySelectorAll('[role="navigation"], [role="main"], [role="contentinfo"], [role="banner"], [role="complementary"], [role="search"]');
        const landmarkIds = new Set();
        landmarks.forEach(landmark => {
            if (landmark.id) {
                if (landmarkIds.has(landmark.id)) {
                    landmark.removeAttribute('id');
                } else {
                    landmarkIds.add(landmark.id);
                }
            }
        });
    }

    function handleAccessibilityErrors(element) {
        // Handle accessibility errors
        console.warn('Accessibility error detected:', element);
    }

    function fixAccessibilityIssues(insightReport) {
        if (insightReport && typeof insightReport === 'object') {
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

        // Perform actual accessibility fixes
        addLangAttribute();
        createInPageButton();
        const table = document.getElementById('myTable');
        if (table) {
            validateTableAccessibility(table);
            validateTableStructure(table);
        }

        // Validate landmark structure and uniqueness
        const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
        const landmarkIds = new Set();
        landmarks.forEach(landmark => {
            if (landmark.id) {
                if (landmarkIds.has(landmark.id)) {
                    landmark.removeAttribute('id');
                } else {
                    landmarkIds.add(landmark.id);
                }
            }
        });

        // Add accessible names to all SVG elements
        const svgs = document.querySelectorAll('svg');
        svgs.forEach(svg => {
            const accessibleName = getSvgAccessibleName(svg);
            setSvgAttributes(svg, accessibleName);
        });

        validateLinkAccessibility();
        handleFakeLinks();

        // Fix button identifiers
        const buttons = document.querySelectorAll('button, [role="button"]');
        buttons.forEach((button, index) => {
            if (!button.id) {
                button.id = `accessible-button-${index}`;
            }
        });
    }

    function fixFakeLinkIssues() {
        // Fix fake link issues
        const doc = getDocument();
        if (!doc) return;
        const fakeLinks = doc.querySelectorAll('a[role="button"], a[role="link"]');
        fakeLinks.forEach(link => {
            // Convert to button if appropriate
            if (link.getAttribute('role') === 'button') {
                link.setAttribute('role', 'button');
            }
        });
    }

    function createAccessibleLink() {
        // Create accessible link
        const doc = getDocument();
        if (!doc) return;
        const links = doc.querySelectorAll('a');
        links.forEach(link => {
            if (!link.textContent && !link.getAttribute('aria-label')) {
                link.setAttribute('aria-label', 'Link');
            }
        });
    }

    function validateLinkAccessibility() {
        // Existing code...
        const doc = getDocument();
        if (!doc) return true;
        const links = doc.querySelectorAll('a');
        let issues = [];
        links.forEach(link => {
            if (!link.textContent && !link.getAttribute('aria-label')) {
                issues.push('Link missing accessible name');
            }
        });
        return issues.length === 0;
    }
}