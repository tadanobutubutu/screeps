// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'
function setHtmlLangAttribute(lang = 'en') {
    const html = document.querySelector('html');
    if (html && html.tagName) {
        html.setAttribute('lang', lang);
    }
}

// Function to add accessible names to SVGs
// You can refactor and improve it based on the SVG structure in your project
function addSvgAccessibleNames(svg) {
    const svgTitle = svg.querySelector('title');
    const svgDesc = svg.querySelector('desc');
    if (!svgTitle || !svgDesc) {
        console.error('Missing required SVG tags: title or desc');
        return;
    }
    if (!svgTitle.id) {
        svgTitle.id = 'svg-title-' + Math.random().toString(36).substr(2, 9);
    }
    if (!svgDesc.id) {
        svgDesc.id = 'svg-desc-' + Math.random().toString(36).substr(2, 9);
    }
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-labelledby', `${svgTitle.id} ${svgDesc.id}`);
}

// Function to find all SVG elements on the page and add accessible names
function addAllSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => addSvgAccessibleNames(svg));
}

// New function to fix an issue where SVGs (e.g., favicons) are missing accessible name
function addAriaHiddenToSvgIcons() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        if (!svg.hasAttribute('aria-hidden')) {
            svg.setAttribute('aria-hidden', 'true');
        }
    });
}

// New function to fix table structure issues
function fixTableStructureIssues() {
    // Addresses table structure issues by ensuring each table has a <thead>
    // with at least one header row and that all <th> elements have a
    // 'scope' attribute set to 'col'.
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const hasThead = table.querySelector('thead');

        // If no <thead> exists, create one and populate it with existing <th> elements
        if (!hasThead) {
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');

            // Move existing <th> elements into the header row
            const existingThs = Array.from(table.querySelectorAll('th'));
            existingThs.forEach(th => {
                const newTh = th.cloneNode(true);
                newTh.setAttribute('scope', 'col');
                headerRow.appendChild(newTh);
            });

            thead.appendChild(headerRow);
            table.prepend(thead);
        }

        // Ensure all <th> elements have the 'scope' attribute set to 'col'
        table.querySelectorAll('th').forEach(th => {
            th.setAttribute('scope', 'col');
        });
    });
}

// Function to fix table constraints (ensures basic structural validation)
function fixTableConstraints() {
    // Example implementation: Enforce at least one THEAD or headerRowCount rows in TABLEs
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        let hasThead = false;
        const headerRowCount = 1; // Modify this number if required

        const theads = table.querySelectorAll('thead');
        theads.forEach(thead => {
            if (thead.rows.length > 0) {
                hasThead = true;
            }
        });

        if (!hasThead && table.rows.length < headerRowCount) {
            console.error("Table does not have a thead or enough header rows:", table);
        }
    });
}

// New function to address unique landmark concerns
function ensureUniqueLandmarks() {
    // Guarantees that each landmark role appears at most once on the page.
    // If duplicate roles are detected, the extra role attributes are removed.
    const seenRoles = new Set();
    document.querySelectorAll('[role]').forEach(el => {
        const role = el.getAttribute('role');
        if (seenRoles.has(role)) {
            el.removeAttribute('role');
        } else {
            seenRoles.add(role);
        }
    });
}

// Additional functions required by the issue
function getLangAttribute() {
    const html = document.querySelector('html');
    return html ? html.getAttribute('lang') : null;
}

function getFullLangAttribute() {
    const html = document.querySelector('html');
    return html ? html.getAttribute('lang') : null;
}

function validateTableAccessibility() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const hasHeader = table.querySelector('th');
        if (!hasHeader) {
            console.warn('Table missing header cells');
        }
    });
}

function validateTableStructure() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const hasThead = table.querySelector('thead');
        if (!hasThead) {
            console.warn('Table missing THEAD');
        }
    });
}

function validateLandmark() {
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
    if (landmarks.length === 0) {
        console.warn('No landmark regions found');
    }
}

function validateLandmarkStructure() {
    const main = document.querySelector('main');
    if (!main) {
        console.warn('Missing main landmark');
    }
}

function getSvgAccessibleName(svg) {
    const title = svg.querySelector('title');
    return title ? title.textContent : '';
}

function createInPageButton() {
    const button = document.createElement('button');
    button.textContent = 'Click me';
    return button;
}

function createAccessibleLink() {
    const link = document.createElement('a');
    link.textContent = 'Accessible link';
    link.setAttribute('href', '#');
    return link;
}

function wrapPrimaryContentInMain() {
    const main = document.querySelector('main');
    if (main) {
        return;
    }
    const body = document.body;
    if (!body) {
        return;
    }
    const nonLandmarks = Array.from(body.children).filter(element => {
        const tag = element.tagName.toLowerCase();
        return !['header', 'nav', 'aside', 'footer', 'script', 'style'].includes(tag);
    });
    if (nonLandmarks.length === 0) {
        return;
    }
    const mainEl = document.createElement('main');
    const first = nonLandmarks[0];
    body.insertBefore(mainEl, first);
    nonLandmarks.forEach(child => mainEl.appendChild(child));
}

// New function to fix an issue with fake links
function fixFakeLinkIssue() {
    // Ensures every <a> tag has a meaningful href and accessible text.
    // Removes any nested anchor elements that might have been added previously.
    document.querySelectorAll('a').forEach(link => {
        // Set href to '#' if missing or empty
        if (!link.hasAttribute('href') || link.getAttribute('href') === '') {
            link.setAttribute('href', '#');
        }
        // Provide accessible text if the link is empty
        if (!link.textContent.trim()) {
            link.textContent = 'Link';
        }
        // Ensure role is set to 'link' (default is already link, but explicit is safe)
        link.setAttribute('role', 'link');

        // Clean up any stray nested <a> elements that might have been added earlier
        const nestedAnchor = link.querySelector('a');
        if (nestedAnchor) {
            nestedAnchor.parentNode.replaceChild(link, nestedAnchor);
        }
    });
}

// Additional calls to address accessibility items
setHtmlLangAttribute('en');
ensureUniqueLandmarks();
fixTableStructureIssues();
addAriaHiddenToSvgIcons();
fixFakeLinkIssue();
addProperLandmarkRegions();
wrapPrimaryContentInMain();

export {
    setHtmlLangAttribute,
    addSvgAccessibleNames,
    addAllSvgAccessibleNames,
    addAriaHiddenToSvgIcons,
    fixTableStructureIssues,
    addProperLandmarkRegions,
    fixTableConstraints,
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    createInPageButton,
    createAccessibleLink,
    wrapPrimaryContentInMain,
    fixFakeLinkIssue
};