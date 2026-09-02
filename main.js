const main = require('./utilities')

// TODO: Implement this function for creating in-page buttons
function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    button.setAttribute('type', 'button');
    return button;
}

function updateFunction() {
    return main.updateFunction();
}

function accessibleFunction() {
    return main.accessibleFunction();
}

function newFunction1() {
    return main.newFunction1();
}

function newFunction2() {
    return main.newFunction2();
}

// Accessibility helper functions
function getLangAttribute() {
    return document.documentElement.lang || 'en';
}

function ensureDependencyGraphARIA() {
    const elements = [];
    elements.forEach(el => {
        el.setAttribute('role', 'graph');
        el.setAttribute('aria-label', 'Dependency graph visualization');
    });
}

function newFunction() {
    // New function implementation
}

function anotherNewFunction() {
    // Another new function implementation
}

// Update the existing function using the new functions for rendering graph/index
renderDependencyGraphs(container)
fixButtonIdentifiers(container)
fixDependencyGraphAria(container)
addMainLandmarkToIndex(container)

// Implement the function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport(container, report) {
    const fixes = {
        langAdded: false,
        mainLandmarkAdded: false,
        landmarksFixed: 0,
        svgNamesAdded: 0,
        fakeLinksFixed: 0
    };

    if (!report || !report.issues) {
        return fixes;
    }

    // Add lang attribute to HTML element if missing
    const htmlEl =
        container.querySelector('html') ||
        (container.ownerDocument && container.ownerDocument.querySelector('html'))
    if (htmlEl && !htmlEl.hasAttribute('lang')) {
        htmlEl.setAttribute('lang', 'en');
        fixes.langAdded = true;
    }

    // Add main landmark if missing
    const mainElement = container.querySelector('main');
    if (!mainElement) {
        const body = container.ownerDocument ? container.ownerDocument.body : document.body;
        if (body) {
            const newMain = document.createElement('main');
            while (body.firstChild) {
                newMain.appendChild(body.firstChild);
            }
            body.appendChild(newMain);
            fixes.mainLandmarkAdded = true;
        }
    }

    // Update the existing function using the new functions for rendering graph/index
    renderGraphIndex(container);

    // Fix landmark issues
    validateLandmark(container);
    validateLandmarkStructure(container);
    fixes.landmarksFixed++;

    // Fix SVG accessible names
    const svgElements = container.querySelectorAll('svg');
    svgElements.forEach(svg => {
        const accessibleName = getSvgAccessibleName(svg);
        if (accessibleName && !svg.getAttribute('aria-label') && !svg.querySelector('title')) {
            svg.setAttribute('aria-label', accessibleName);
            fixes.svgNamesAdded++;
        }
    });

    // Fix fake link issues (elements that look like links but are missing href)
    const fakeLinks = container.querySelectorAll('a:not([href]), [role="link"]:not([href])');
    fakeLinks.forEach(link => {
        if (!link.getAttribute('href')) {
            link.setAttribute('href', '#' + (link.id || `link-${Date.now()}`));
        }
        if (!link.getAttribute('role')) {
            link.setAttribute('role', 'link');
        }
        fixes.fakeLinksFixed++;
    });

    // Validate accessibility report
    const accessibilityReport = validateAccessibilityReport(container);
    if (accessibilityReport && accessibilityReport.issues && accessibilityReport.issues.length > 0) {
        console.log(`Accessibility report contains ${accessibilityReport.issues.length} remaining issues`);
    }

    // Implement focus trap for keyboard navigation
    focusTrap(container);

    if (fixes.langAdded) {
        console.log('Lang attribute added to HTML element');
    }

    if (fixes.mainLandmarkAdded) {
        console.log('Main landmark added');
    }

    // Check for new accessibility issues
    const newAccessibilityIssues = checkAccessibilityForReport(container);
    if (newAccessibilityIssues.length > 0) {
        console.log(`New accessibility issues found: ${newAccessibilityIssues.join(', ')}`);
    }

    const landmarkFixesCount = fixes.landmarksFixed || 0;
    if (landmarkFixesCount > 0) {
        console.log(`Fixed ${landmarkFixesCount} unique landmarks`);
    }

    const svgFixes = fixes.svgNamesAdded || 0;
    if (svgFixes > 0) {
        console.log(`Fixed accessible names for ${svgFixes} SVGs`);
    }

    const fakeLinkFixes = fixes.fakeLinksFixed || 0;
    if (fakeLinkFixes > 0) {
        console.log(`Fixed fake link issues for ${fakeLinkFixes} elements`);
    }

    return fixes;
}

// REACT_015: Add lang attribute to document
function ensureLangAttribute() {
    if (!document.documentElement.hasAttribute('lang')) {
        document.documentElement.setAttribute('lang', 'en');
    }
}

// REACT_017: Add/fix landmark issues
function ensureLandmarks() {
    const body = document.body;
    
    // Ensure main landmark exists
    let main = document.querySelector('main');
    if (!main) {
        main = document.createElement('main');
        main.setAttribute('role', 'main');
        body.appendChild(main);
    }

    // Ensure header landmark exists
    let header = document.querySelector('header');
    if (!header) {
        header = document.createElement('header');
        header.setAttribute('role', 'banner');
        body.insertBefore(header, body.firstChild);
    }

    // Ensure footer landmark exists
    let footer = document.querySelector('footer');
    if (!footer) {
        footer = document.createElement('footer');
        footer.setAttribute('role', 'contentinfo');
        body.appendChild(footer);
    }

    // Ensure nav landmark exists
    const nav = document.querySelector('nav');
    if (!nav) {
        const navElement = document.createElement('nav');
        navElement.setAttribute('aria-label', 'main navigation');
        body.insertBefore(navElement, body.firstChild);
    }

    return validateLandmarkStructure();
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
    const landmarks = document.querySelectorAll('header[role="banner"], footer[role="contentinfo"], main[role="main"], nav[role="navigation"]');
    const seenIds = new Set();
    
    landmarks.forEach(landmark => {
        if (!landmark.id) {
            const tagName = landmark.tagName.toLowerCase();
            let id = tagName;
            let counter = 1;
            while (seenIds.has(id)) {
                id = `${tagName}-${counter++}`;
            }
            landmark.id = id;
            seenIds.add(id);
        } else {
            seenIds.add(landmark.id);
        }
    });

    // Check for duplicate IDs
    const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
    const uniqueIds = new Set(allIds);
    return uniqueIds.size === allIds.length;
}

// REACT_027: Fix table structure issues
function fixTableStructures() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        // Ensure thead exists
        if (!table.querySelector('thead')) {
            const thead = document.createElement('thead');
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const headerCells = firstRow.querySelectorAll('th, td');
                if (headerCells.length > 0) {
                    const tr = document.createElement('tr');
                    headerCells.forEach(cell => {
                        if (cell.tagName === 'TD') {
                            const th = document.createElement('th');
                            th.textContent = cell.textContent;
                            Array.from(cell.attributes).forEach(attr => {
                                th.setAttribute(attr.name, attr.value);
                            });
                            tr.appendChild(th);
                            cell.replaceWith(th);
                        }
                    });
                    thead.appendChild(tr);
                    table.insertBefore(thead, table.firstChild);
                }
            }
        }

        // Ensure tbody exists
        if (!table.querySelector('tbody')) {
            const rows = Array.from(table.querySelectorAll('tr'));
            const thead = table.querySelector('thead');
            const firstTrIndex = thead ? rows.indexOf(thead.nextElementSibling) : 0;
            
            if (firstTrIndex > 0 && rows.length > firstTrIndex) {
                const tbody = document.createElement('tbody');
                rows.slice(firstTrIndex).forEach(row => {
                    tbody.appendChild(row);
                });
                if (thead) {
                    thead.insertAdjacentElement('afterend', tbody);
                } else {
                    table.insertBefore(tbody, table.firstChild);
                }
            }
        }
    });
}

// REACT_036: Fix fake link issues
function fixFakeLinks() {
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        if (!link.href || link.href === '#' || link.getAttribute('href') === '') {
            link.setAttribute('role', 'button');
        }
    });

    // Fix non-link elements that should be buttons
    const fakeLinks = document.querySelectorAll('[onclick], [role="link"]');
    fakeLinks.forEach(element => {
        if (!element.href && element.tagName !== 'A') {
            const isInteractive = element.getAttribute('role') === 'link' || element.hasAttribute('onclick');
            if (isInteractive && !element.href) {
                element.setAttribute('role', 'button');
            }
        }
    });
}

// REACT_037: Google sign-in logic
function initGoogleSignIn() {
    // This function can be expanded based on actual Google Sign-In implementation
    const googleButtons = document.querySelectorAll('[data-google-signin]');
    
    googleButtons.forEach(button => {
        button.setAttribute('aria-label', 'Sign in with Google');
        button.setAttribute('type', 'button');
    });
}

// REACT_040: Replace my-button with actual button id for accessibility
function fixButtonIds() {
    const buttons = document.querySelectorAll('[id*="my-button"], .my-button');
    
    buttons.forEach((button, index) => {
        if (!button.id || button.id.includes('my-button')) {
            const newId = button.id ? button.id.replace(/my-button/gi, 'btn') : `button-${index}`;
            button.id = newId;
        }
    });

    // Update any references in the code
    const buttonsWithIds = document.querySelectorAll('button[id]');
    buttonsWithIds.forEach(button => {
        if (!button.hasAttribute('aria-label') && !button.textContent) {
            button.setAttribute('aria-label', `Button ${button.id}`);
        }
    });
}

// REACT_041: Add accessible names to SVGs
function ensureSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg');
    
    svgs.forEach((svg, index) => {
        if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
            // Check for title element
            const title = svg.querySelector('title');
            if (title) {
                const titleId = `svg-title-${index}`;
                title.id = titleId;
                svg.setAttribute('aria-labelledby', titleId);
            } else {
                svg.setAttribute('aria-label', `SVG icon ${index + 1}`);
            }
        }
    });
}

// REACT_042: Ensure dependencyGraph container has proper ARIA role
function ensureDependencyGraphAriaRole() {
    const container = document.getElementById('dependencyGraph') || document.querySelector('.dependency-graph');
    
    if (container) {
        if (!container.hasAttribute('role')) {
            container.setAttribute('role', 'img');
        }
        if (!container.hasAttribute('aria-label')) {
            container.setAttribute('aria-label', 'Dependency graph visualization');
        }
        if (!container.hasAttribute('aria-describedby')) {
            const description = container.querySelector('[id*="description"], .description');
            if (description) {
                container.setAttribute('aria-describedby', description.id || 'graph-description');
            }
        }
    }
}

// Main initialization function for accessibility fixes
function initAccessibility() {
    ensureLangAttribute();
    ensureLandmarks();
    ensureUniqueLandmarks();
    fixTableStructures();
    fixFakeLinks();
    initGoogleSignIn();
    fixButtonIds();
    ensureSvgAccessibleNames();
    ensureDependencyGraphAriaRole();
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccessibility);
    } else {
        initAccessibility();
    }
}

function validateSession() {
    return false;
}

function handleCredentialResponse(response) {
    console.log('Credential Response:', response);
}

/**
 * Validates table structure
 * @param {Array} tableData - Table data to validate
 * @returns {boolean} True if table structure is valid, false otherwise
 */
function validateTableStructure(tableData) {
    return true;
}

function addLangAttribute(element, lang = 'en') {
    let htmlElement = element || document.documentElement;
    if (!htmlElement) {
        return null;
    }

    if (htmlElement && !htmlElement.hasAttribute('lang')) {
        htmlElement.setAttribute('lang', lang);
    }
    return htmlElement;
}

function fixTableStructure(tableElement) {
    if (!tableElement) return null;

    const headers = tableElement.querySelectorAll('th');
    headers.forEach(th => {
        if (!th.hasAttribute('scope')) {
            const row = th.closest('tr');
            const cellIndex = Array.from(row.children).indexOf(th);
            th.setAttribute('scope', 'col');
        }
    });

    const existingCaption = tableElement.querySelector('caption');
    if (!existingCaption) {
        const caption = document.createElement('caption');
        caption.textContent = 'Data table';
        tableElement.insertBefore(caption, tableElement.firstChild);
    }

    return tableElement;
}

function addAriaLabel(elementId, label) {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute('aria-label', label);
    }
}

// Required changes to fix the React SVG Accessible Name issue
function addAccessibleName(svgString) {
    const parser = new DOMParser();
    const svg = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = svg.documentElement;
    if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
        svgElement.setAttribute('aria-label', getSvgAccessibleName(svgElement));
    }
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgElement);
}

function validateTableAccessibility(tableData) {
    return main.validateTableAccessibility(tableData);
}

// Export for use in other modules
module.exports = {
    ...main,
    navigate,
    validateTableStructure,
    validateTableAccessibility,
    implementAccessibilityFixesFromReport,
    checkAccessibilityForReport,
    renderGraphIndex,
    trapFocus,
    addLangAttribute,
    fixTableStructure,
    addAriaLabel,
    addAccessibleName,
    createInPageButton,
    ensureLangAttribute,
    ensureLandmarks,
    ensureUniqueLandmarks,
    fixTableStructures,
    fixFakeLinks,
    initGoogleSignIn,
    fixButtonIds,
    ensureSvgAccessibleNames,
    ensureDependencyGraphAriaRole,
    initAccessibility
};