// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'
function setHtmlLangAttribute(lang = 'en') {
    const html = document.querySelector('html');
    if (html && !html.getAttribute('lang')) {
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
        svgTitle.id = `svg-title-${Date.now()}`;
    }
    if (!svgDesc.id) {
        svgDesc.id = `svg-desc-${Date.now()}`;
    }
    svg.setAttribute('aria-labelledby', `${svgTitle.id} ${svgDesc.id}`);
}

// Function to find all SVG elements on the page and add accessible names
function addAllSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => addSvgAccessibleNames(svg));
}

// Function to implement addressing accessibility issues from insight report
function fixInputAccessibility() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        if (!input.id) {
            input.id = `input-${Date.now()}`;
        }
        const label = document.querySelector(`label[for="${input.id}"]`);
        label.htmlFor = input.id;
        label.textContent = 'Input description';
        input.setAttribute('aria-describedby', label.id);
    });
}

// Function to add proper landmark regions to the page
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

// Function to find all th elements on the page and add the scope attribute
function addAllTableHeadersScope() {
    const thElements = document.querySelectorAll('th');
    thElements.forEach(th => {
        th.setAttribute('scope', 'col');
    });
}

// New function to fix table structure issues
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

        if (!hasThead && table.rows.length < headerRowCount) {
            console.error("Table does not have a thead or enough header rows:", table);
        }

        const tableHeaders = table.querySelectorAll('th');
        tableHeaders.forEach(th => {
            th.setAttribute('scope', 'col');
        });
    });
}

// Function to fix table constraints
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

// Additional functions required by the issue
function getLangAttribute() {
    const html = document.querySelector('html');
    return html ? html.getAttribute('lang') : null;
}

function getFullLangAttribute() {
    const html = document.querySelector('html');
    if (!html) return null;
    return html.getAttribute('lang');
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
    const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
    if (landmarks.length === 0) {
        console.warn('No landmark regions found');
    }
}

function validateLandmarkStructure() {
    const main = document.querySelector('[role="main"]');
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
    if (document.querySelector('[role="main"]')) {
        return;
    }
    const body = document.body;
    if (!body) {
        return;
    }
    const nonLandmarks = Array.from(body.children).filter(element => {
        const tag = element.tagName.toLowerCase();
        return !['header', 'nav', 'aside', 'footer', 'script', 'style', 'main'].includes(tag);
    });
    if (nonLandmarks.length === 0) {
        return;
    }
    const mainEl = document.createElement('main');
    const first = nonLandmarks[0];
    body.insertBefore(mainEl, first);
    nonLandmarks.forEach(child => mainEl.appendChild(child));
}

// Export all functions
export { 
    setHtmlLangAttribute, 
    addAllSvgAccessibleNames, 
    addAllTableHeadersScope, 
    fixInputAccessibility, 
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
    wrapPrimaryContentInMain
};