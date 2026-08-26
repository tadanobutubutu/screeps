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

// New functions requested in the issue
function fixInputAccessibility() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        if (!input.id) {
            input.id = 'input-' + Math.random().toString(36).substr(2, 9);
        }
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (!label) {
            const newLabel = document.createElement('label');
            newLabel.htmlFor = input.id;
            newLabel.textContent = 'Input description';
            input.parentNode.insertBefore(newLabel, input);
            newLabel.id = 'label-' + input.id;
        } else {
            label.textContent = 'Input description';
            label.id = 'label-' + input.id;
        }
    });
}

function addProperLandmarkRegions() {
    // Add role="banner" to header elements
    const headers = document.querySelectorAll('header');
    headers.forEach(header => {
        header.setAttribute('role', 'banner');
    });
    // Add role="navigation" to nav elements
    const navs = document.querySelectorAll('nav');
    navs.forEach(nav => {
        nav.setAttribute('role', 'navigation');
    });
    // Add role="main" to main elements
    const mains = document.querySelectorAll('main');
    mains.forEach(main => {
        main.setAttribute('role', 'main');
    });
    // Add role="complementary" to aside elements
    const asides = document.querySelectorAll('aside');
    asides.forEach(aside => {
        aside.setAttribute('role', 'complementary');
    });
    // Add role="contentinfo" to footer elements
    const footers = document.querySelectorAll('footer');
    footers.forEach(footer => {
        footer.setAttribute('role', 'contentinfo');
    });
}

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

// Additional functions provided for completeness, but not explicitly requested
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

function ensureMainLandmark() {
    let main = document.querySelector('main');
    if (!main) {
        main = document.createElement('main');
        const body = document.body;
        if (body) {
            body.appendChild(main);
        }
    }
    return main;
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

function fixFakeLinkIssue() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const clickable = document.createElement('a');
        clickable.href = link.getAttribute('href') || '#';
        clickable.textContent = 'Click me';
        link.appendChild(clickable);
    });
}

// Modified function to fix table structure issues
function fixTableStructureIssues() {
    // Example implementation: Add scope attribute to all th elements and enforce at least one THEAD or headerRowCount rows in TABLEs
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

        if (!hasThead) {
            console.error("Table does not have a thead or enough header rows:", table);
        }

        const tableHeaders = table.querySelectorAll('th');
        tableHeaders.forEach(th => {
            th.setAttribute('scope', 'col');
        });
    });
}

// Modified function to fix table constraints
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

export {
    setHtmlLangAttribute,
    addSvgAccessibleNames,
    addAllSvgAccessibleNames,
    fixInputAccessibility,
    addProperLandmarkRegions,
    fixTableStructureIssues,
    addAllTableHeadersScope,
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
    ensureMainLandmark,
    fixFakeLinkIssue
};