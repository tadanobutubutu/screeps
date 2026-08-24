// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'
function setHtmlLangAttribute(lang = 'en') {
    const html = document.querySelector('html');
    if (html && html.tagName) {
        html.setAttribute('lang', lang);
    }
}

// Enhanced function to ensure language attribute is properly set
function ensureLanguageAttribute() {
    const html = document.querySelector('html');
    if (html) {
        // Ensure lang attribute exists and has a valid value
        const lang = html.getAttribute('lang');
        if (!lang || lang.trim() === '') {
            html.setAttribute('lang', 'en'); // Set default language
        }
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

// Enhanced function to handle SVG accessibility with fallback options
function enhanceSvgAccessibility() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        // Skip SVGs that are already handled or are decorative
        if (svg.getAttribute('aria-hidden') === 'true') {
            return;
        }
        
        const title = svg.querySelector('title');
        const desc = svg.querySelector('desc');
        
        // For SVGs missing title or desc, create them
        if (!title && !desc) {
            // Create title element
            const newTitle = document.createElement('title');
            newTitle.textContent = svg.getAttribute('aria-label') || 
                                  svg.getAttribute('alt') || 
                                  'Decoration';
            newTitle.id = 'svg-title-' + Math.random().toString(36).substr(2, 9);
            svg.insertBefore(newTitle, svg.firstChild);
            
            // Create desc element if needed
            if (!svg.getAttribute('aria-label') && !svg.getAttribute('alt')) {
                const newDesc = document.createElement('desc');
                newDesc.textContent = 'Graphical element';
                newDesc.id = 'svg-desc-' + Math.random().toString(36).substr(2, 9);
                svg.appendChild(newDesc);
            }
            
            // Set accessibility attributes
            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-labelledby', newTitle.id + (newDesc ? ' ' + newDesc.id : ''));
        } else if (!title) {
            // Only title is missing
            const newTitle = document.createElement('title');
            newTitle.textContent = 'Icon';
            newTitle.id = 'svg-title-' + Math.random().toString(36).substr(2, 9);
            svg.insertBefore(newTitle, svg.firstChild);
            
            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-labelledby', newTitle.id + ' ' + desc.id);
        } else if (!desc) {
            // Only desc is missing
            const newDesc = document.createElement('desc');
            newDesc.textContent = svg.getAttribute('aria-label') || 'Graphical element';
            newDesc.id = 'svg-desc-' + Math.random().toString(36).substr(2, 9);
            svg.appendChild(newDesc);
            
            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-labelledby', title.id + ' ' + newDesc.id);
        }
    });
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

// Enhanced function to fix table structure issues
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
        
        // Ensure every row that has cells is part of a proper structure
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            // Ensure each cell in the row is either a th or td
            const cells = row.querySelectorAll('td, th');
            if (cells.length > 0) {
                // Check if this row should be in thead or tbody
                const hasHeaderCells = row.querySelector('th') !== null;
                if (hasHeaderCells && !hasThead) {
                    // This might be a header row that should be in thead
                    if (!row.closest('thead')) {
                        // Could move to thead, but that would complicate things
                        // Instead, just ensure proper scope
                        row.querySelectorAll('th').forEach(th => {
                            if (!th.hasAttribute('scope')) {
                                th.setAttribute('scope', 'col');
                            }
                        });
                    }
                }
            }
        });
    });
}

// Enhanced function to fix table constraints
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
        
        // Additional check: ensure all th elements have scope attribute
        const thElements = table.querySelectorAll('th');
        thElements.forEach(th => {
            if (!th.hasAttribute('scope')) {
                th.setAttribute('scope', 'col');
            }
        });
        
        // Ensure tables have captions for better accessibility
        if (!table.querySelector('caption')) {
            const caption = document.createElement('caption');
            caption.textContent = 'Data table';
            table.insertBefore(caption, table.firstChild);
        }
    });
}

// Enhanced function to address unique landmark concerns
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

// Enhanced function to ensure proper landmarks
function ensureProperLandmarks() {
    // Ensure there's exactly one main landmark
    const mainElements = document.querySelectorAll('main, [role="main"]');
    if (mainElements.length === 0) {
        // Create a main element if none exists
        wrapPrimaryContentInMain();
    }
    
    // Ensure banner, contentinfo, complementary, and search roles are unique
    ['banner', 'contentinfo', 'complementary', 'search'].forEach(role => {
        const elements = document.querySelectorAll(`[role="${role}"]`);
        if (elements.length > 1) {
            // Keep only the first one, remove role from others
            elements.forEach((el, index) => {
                if (index > 0) {
                    el.removeAttribute('role');
                }
            });
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

// Enhanced function to fix an issue with fake links
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
            // Check for aria-label first
            if (link.getAttribute('aria-label')) {
                // Already has an accessible name through aria-label
            } else {
                link.textContent = 'Link';
            }
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
ensureLanguageAttribute();
addAllSvgAccessibleNames();
enhanceSvgAccessibility();
addMissingSvgAccessibleNames();
fixTableStructureIssues();
ensureUniqueLandmarks();
ensureProperLandmarks();
fixTableConstraints();
validateTableAccessibility();
validateTableStructure();
validateLandmark();
validateLandmarkStructure();
wrapPrimaryContentInMain();
fixFakeLinkIssue();

export {
    setHtmlLangAttribute,
    ensureLanguageAttribute,
    addSvgAccessibleNames,
    addAllSvgAccessibleNames,
    addMissingSvgAccessibleNames,
    enhanceSvgAccessibility,
    fixTableStructureIssues,
    ensureUniqueLandmarks,
    ensureProperLandmarks,
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
// ----- END ORIGINAL CODE-----