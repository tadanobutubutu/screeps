// TODO: This is the existing code that needs to be preserved

// Accessibility utility functions

/**
 * Adds lang attribute to HTML element for proper language declaration
 * @param {Document} doc - The document object
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 */
function addLangAttribute(doc, lang = 'en') {
    if (doc && doc.documentElement) {
        doc.documentElement.lang = lang;
    }
}

/**
 * Fixes table structure issues for accessibility
 * @param {Document} doc - The document object
 */
function fixTableStructure(doc) {
    const tables = doc.querySelectorAll('table');
    tables.forEach((table, index) => {
        // Ensure tables have proper structure
        if (!table.querySelector('caption')) {
            const caption = doc.createElement('caption');
            caption.textContent = `Table ${index + 1}`;
            table.insertBefore(caption, table.firstChild);
        }
        
        // Ensure proper thead/tbody structure
        if (!table.querySelector('thead')) {
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const thead = doc.createElement('thead');
                thead.appendChild(firstRow.cloneNode(true));
                table.insertBefore(thead, firstRow);
                firstRow.remove();
            }
        }
        
        if (!table.querySelector('tbody')) {
            const tbody = doc.createElement('tbody');
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => tbody.appendChild(row));
            table.appendChild(tbody);
        }
    });
}

/**
 * Fixes landmark issues for accessibility
 * @param {Document} doc - The document object
 */
function fixLandmarkIssues(doc) {
    fixLandmarkIssuesInner(doc);
    addMainLandmark(doc);
    addLandmarkRegions(doc);
}

function fixLandmarkIssuesInner(doc) {
    // Fix any duplicate or missing landmarks
    const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
    landmarks.forEach(landmark => {
        const elements = doc.querySelectorAll(landmark);
        if (elements.length > 1 && landmark !== 'header' && landmark !== 'footer') {
            elements.forEach((el, i) => {
                if (i > 0) {
                    el.setAttribute('aria-label', `${landmark}-${i + 1}`);
                }
            });
        }
    });
}

/**
 * Adds main landmark to document
 * @param {Document} doc - The document object
 */
function addMainLandmark(doc) {
    let main = doc.querySelector('main');
    if (!main) {
        main = doc.createElement('main');
        const body = doc.querySelector('body');
        if (body && body.firstChild) {
            body.insertBefore(main, body.firstChild);
        } else if (body) {
            body.appendChild(main);
        }
    } else {
        main.setAttribute('role', 'main');
    }
}

/**
 * Adds landmark regions to document
 * @param {Document} doc - The document object
 */
function addLandmarkRegions(doc) {
    const regions = ['header', 'nav', 'main', 'footer'];
    regions.forEach(region => {
        const elements = doc.querySelectorAll(region);
        elements.forEach(el => {
            if (!el.id) {
                el.id = `${region}-region`;
            }
        });
    });
}

/**
 * Ensures unique landmarks in the document
 * @param {Document} doc - The document object
 */
function ensureUniqueLandmarks(doc) {
    uniqueLandmarks(doc);
}

function uniqueLandmarks(doc) {
    const landmarks = doc.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
    const seenIds = new Set();
    
    landmarks.forEach(landmark => {
        const role = landmark.getAttribute('role');
        if (seenIds.has(role)) {
            if (!landmark.id) {
                landmark.id = `${role}-${seenIds.size}`;
            }
        }
        seenIds.add(role);
    });
}

/**
 * Adds accessible names to SVGs
 * @param {Document} doc - The document object
 */
function addSvgAccessibleNames(doc) {
    addAccessibleNamesToSVGs(doc);
}

function addAccessibleNamesToSVGs(doc) {
    const svgs = doc.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
        if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
            const title = doc.createElement('title');
            title.id = `svg-title-${index}`;
            title.textContent = `SVG graphic ${index + 1}`;
            svg.insertBefore(title, svg.firstChild);
            svg.setAttribute('aria-labelledby', title.id);
            svg.setAttribute('role', 'img');
        }
    });
}

/**
 * Fixes fake link issues (elements that look like links but aren't)
 * @param {Document} doc - The document object
 */
function fixFakeLinkIssue(doc) {
    fixFakeLinkIssues(doc);
}

function fixFakeLinkIssues(doc) {
    const fakeLinks = doc.querySelectorAll('[role="link"]:not(a)');
    fakeLinks.forEach(el => {
        el.setAttribute('tabindex', '0');
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
    });
}

/**
 * Handles Google sign-in logic with accessibility considerations
 * @param {Object} options - Sign-in options
 * @returns {Promise} Promise resolving to sign-in result
 */
function googleSignIn(options = {}) {
    return new Promise((resolve, reject) => {
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({
                client_id: options.clientId || '',
                callback: (response) => {
                    if (response.credential) {
                        resolve({ success: true, credential: response.credential });
                    } else {
                        reject(new Error('No credential received'));
                    }
                }
            });
            
            const buttonElement = document.getElementById('google-signin-button');
            if (buttonElement) {
                google.accounts.id.renderButton(buttonElement, {
                    theme: options.theme || 'outline',
                    size: options.size || 'medium',
                    text: options.text || 'signin_with'
                });
            }
        } else {
            reject(new Error('Google Sign-In not available'));
        }
    });
}

/**
 * Replaces my-button with proper button identifiers for accessibility
 * @param {Document} doc - The document object
 */
function fixButtonIdentifiers(doc) {
    const buttons = doc.querySelectorAll('[id="my-button"], [class*="my-button"]');
    buttons.forEach((button, index) => {
        if (button.id === 'my-button') {
            button.id = `action-button-${index + 1}`;
        }
        
        if (button.getAttribute('class') && button.getAttribute('class').includes('my-button')) {
            button.setAttribute('class', button.getAttribute('class').replace(/my-button/g, `action-button-${index + 1}`));
        }
        
        // Ensure proper button semantics
        if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
            button.setAttribute('aria-label', `Action button ${index + 1}`);
        }
    });
}

/**
 * Ensures dependencyGraph container has proper ARIA role
 * @param {Document} doc - The document object
 */
function fixDependencyGraphAriaRole(doc) {
    const container = doc.getElementById('dependencyGraph') || doc.querySelector('.dependencyGraph');
    if (container) {
        container.setAttribute('role', 'img');
        if (!container.getAttribute('aria-label')) {
            container.setAttribute('aria-label', 'Dependency graph visualization');
        }
        if (!container.getAttribute('aria-describedby')) {
            const description = doc.createElement('div');
            description.id = 'dependencyGraph-desc';
            description.textContent = 'This graph shows the dependencies between various modules in the project.';
            description.style.position = 'absolute';
            description.style.left = '-9999px';
            container.setAttribute('aria-describedby', 'dependencyGraph-desc');
        }
    }
}

/**
 * Main accessibility initialization function
 * @param {Document} doc - The document object (defaults to window.document)
 */
function initializeAccessibility(doc = window.document) {
    addLangAttribute(doc);
    fixTableStructure(doc);
    fixLandmarkIssues(doc);
    ensureUniqueLandmarks(doc);
    addSvgAccessibleNames(doc);
    fixFakeLinkIssues(doc);
    fixButtonIdentifiers(doc);
    fixDependencyGraphAriaRole(doc);
}

// Export for Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addLangAttribute,
        fixTableStructure,
        fixLandmarkIssues,
        addMainLandmark,
        addLandmarkRegions,
        ensureUniqueLandmarks,
        uniqueLandmarks,
        addSvgAccessibleNames,
        addAccessibleNamesToSVGs,
        fixFakeLinkIssue,
        fixFakeLinkIssues,
        googleSignIn,
        fixButtonIdentifiers,
        fixDependencyGraphAriaRole,
        initializeAccessibility
    };
}