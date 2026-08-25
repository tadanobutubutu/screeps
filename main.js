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
        svgTitle.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
    }
    if (!svgDesc.id) {
        svgDesc.id = `svg-desc-${Math.random().toString(36).substr(2, 9)}`;
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
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    inputs.forEach(input => {
        if (!input.id) {
            input.id = `input-${Math.random().toString(36).substr(2, 9)}`;
        }
        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.textContent = 'Input description';
        input.parentNode.insertBefore(label, input);
    });
}

// Function to add proper landmark regions to the page
function addProperLandmarkRegions() {
    // Add role="banner" to header elements
    const headers = document.querySelectorAll('header:not([role])');
    headers.forEach(header => {
        header.setAttribute('role', 'banner');
    });
    // Add role="navigation" to nav elements
    const navs = document.querySelectorAll('nav:not([role])');
    navs.forEach(nav => {
        nav.setAttribute('role', 'navigation');
    });
    // Add role="main" to main elements
    const mains = document.querySelectorAll('main:not([role])');
    mains.forEach(main => {
        main.setAttribute('role', 'main');
    });
    // Add role="complementary" to aside elements
    const asides = document.querySelectorAll('aside:not([role])');
    asides.forEach(aside => {
        aside.setAttribute('role', 'complementary');
    });
    // Add role="contentinfo" to footer elements
    const footers = document.querySelectorAll('footer:not([role])');
    footers.forEach(footer => {
        footer.setAttribute('role', 'contentinfo');
    });
}

// Function to find all th elements on the page and add the scope attribute
function addAllTableHeadersScope() {
    const thElements = document.querySelectorAll('th:not([scope])');
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

// New function to replace fake links (<a href="#">) with accessible buttons
function fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('a[href="#"]');
    fakeLinks.forEach(link => {
        const button = document.createElement('button');
        button.textContent = link.textContent;
        button.type = 'button'; // Ensures the button acts as a button
        if (link.id) {
            button.id = link.id;
        }
        link.parentNode.replaceChild(button, link);
    });
}

// Export the new functions
export {
    setHtmlLangAttribute,
    addAllSvgAccessibleNames,
    addAllTableHeadersScope,
    fixInputAccessibility,
    fixTableStructureIssues,
    addProperLandmarkRegions,
    fixTableConstraints,
    fixFakeLinks,
};