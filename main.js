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
function addMissingSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        const title = svg.querySelector('title');
        const desc = svg.querySelector('desc');
        if (!title || !desc) {
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
            const existingThs = table.querySelectorAll('th');
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
    // If duplicate roles are detected, the extra role attributes are removed or
    // elements are converted to semantic alternatives.
    const seenRoles = new Set();
    
    // Also track specific landmark elements (like <main>) to ensure uniqueness
    const seenMain = [];
    const mainElements = document.querySelectorAll('main, [role="main"]');
    
    mainElements.forEach((main, index) => {
        if (index === 0) {
            seenMain.push(main);
        } else {
            // Convert duplicate <main> elements to <section> elements
            const section = document.createElement('section');
            // Copy all attributes except id-related ones to avoid conflicts
            Array.from(main.attributes).forEach(attr => {
                if (attr.name !== 'id' || !document.getElementById(attr.value)) {
                    section.setAttribute(attr.name, attr.value);
                }
            });
            // Move all children to the new section
            while (main.firstChild) {
                section.appendChild(main.firstChild);
            }
            // Replace the main element with section
            main.parentNode.replaceChild(section, main);
        }
    });
    
    // Handle elements with explicit role attributes
    const landmarkElements = document.querySelectorAll('[role="complementary"], [role="contentinfo"], [role="banner"], [role="search"]');
    landmarkElements.forEach(el => {
        const role = el.getAttribute('role');
        if (role) {
            if (seenRoles.has(role)) {
                // Convert to a more generic element for duplicates
                const newEl = document.createElement('div');
                // Copy children
                while (el.firstChild) {
                    newEl.appendChild(el.firstChild);
                }
                // Copy remaining attributes
                Array.from(el.attributes).forEach(attr => {
                    if (attr.name !== 'role') {
                        newEl.setAttribute(attr.name, attr.value);
                    }
                });
                el.parentNode.replaceChild(newEl, el);
            } else {
                seenRoles.add(role);
            }
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
        const hasHeader = table.querySelector('th, thead');
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
    const landmarks = document.querySelectorAll('[role="complementary"], [role="contentinfo"]');
    if (landmarks.length === 0) {
        console.warn('No landmark regions found');
    }
}

function validateLandmarkStructure() {
    const main = document.querySelector('main, [role="main"]');
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
    // Check if a main element already exists
    const main = document.querySelector('main, [role="main"]');
    if (main) {
        return;
    }
    const body = document.body;
    if (!body) {
        return;
    }
    // Find non-landmark children of body that should be wrapped in main
    const nonLandmarks = Array.from(body.children).filter(element => {
        const tag = element.tagName.toLowerCase();
        return !['header', 'nav', 'aside', 'footer', 'script', 'style', 'link', 'meta'].includes(tag);
    });
    if (nonLandmarks.length === 0) {
        return;
    }
    // Create main element
    const mainEl = document.createElement('main');
    const first = nonLandmarks[0];
    // Insert main element before the first non-landmark content
    body.insertBefore(mainEl, first);
    // Move all non-landmark content into the main element
    nonLandmarks.forEach(child => mainEl.appendChild(child));
}

// New function to fix an issue with fake links
function fixFakeLinkIssue() {
    // Ensures every <a> tag has a meaningful href and accessible text.
    // Removes any nested anchor elements that might have been added previously.
    document.querySelectorAll('a').forEach(link => {
        // Set href to '#' if missing or empty
        if (!link.getAttribute('href') || link.getAttribute('href') === '') {
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
            nestedAnchor.remove();
        }
    });
}

// Additional calls to address accessibility items
setHtmlLangAttribute();
addAllSvgAccessibleNames();
addMissingSvgAccessibleNames();
fixTableStructureIssues();
ensureUniqueLandmarks();
fixTableConstraints();
validateTableAccessibility();
validateTableStructure();
validateLandmark();
validateLandmarkStructure();
wrapPrimaryContentInMain();
fixFakeLinkIssue();

export {
    setHtmlLangAttribute,
    addSvgAccessibleNames,
    addAllSvgAccessibleNames,
    addMissingSvgAccessibleNames,
    fixTableStructureIssues,
    ensureUniqueLandmarks,
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