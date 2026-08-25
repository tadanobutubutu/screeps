// Assuming main.js has a <html> tag, add the lang attribute based on your content
document.documentElement.lang = 'en';

// Function to add accessible names to SVGs
function addSvgAccessibleNames(svg) {
    const svgTitle = svg.querySelector('title');
    const svgDesc = svg.querySelector('desc');
    if (!svgTitle || !svgDesc) {
        console.error('Missing required SVG tags: title or desc');
        return;
    }
    svg.setAttribute('aria-label', `${svgTitle.textContent} ${svgDesc.textContent}`);
}

// Function to find all SVG elements on the page and add accessible names
function addAllSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => addSvgAccessibleNames(svg));
}

// Function to add scope attribute to th elements for accessibility
function addScopeToTableHeaders(th) {
    th.setAttribute('scope', 'col');
}

// Function to find all th elements on the page and add the scope attribute
function addAllTableHeadersScope() {
    const thElements = document.querySelectorAll('th');
    thElements.forEach(th => {
        addScopeToTableHeaders(th);
    });
}

// Function to implement addressing accessibility issues from insight report
function addAccessibleNamesToInputs() {
    // The implementation will depend on the insight report details
    // As an example, let's assume the report suggests adding labels to inputs
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    inputs.forEach(input => {
        const existingLabel = document.querySelector(`label[for="${input.id}"]`);
        if (!existingLabel) {
            const label = document.createElement('label');
            label.htmlFor = input.id;
            label.textContent = 'Input description';
            input.parentNode.insertBefore(label, input);
        }
    });
}

// New function to fix table structure issues
function fixTableStructureIssues() {
    // Example implementation: Add scope attribute to all th elements
    const tableHeaders = document.querySelectorAll('th');
    tableHeaders.forEach(th => {
        th.setAttribute('scope', 'col');
    });
    // Additional fixes can be added here based on the specific issues identified
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

// New function to fix table structure issues
function fixTableConstraints() {
    // Example implementation: Enforce at least one THEAD or `${headerRowCount}` rows in TABLEs
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        let hasThead = false;
        let headerRowCount = 1; // Modify this number if required

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

// Function to fix fake link issues (links that don't navigate)
function fixFakeLinks() {
    const links = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"], a[href="javascript:void(0);"], a[href=""]');
    links.forEach(link => {
        if (!link.getAttribute('role')) {
            link.setAttribute('role', 'button');
        }
    });
}

// Export the new functions
export { addAllSvgAccessibleNames, addAllTableHeadersScope, addAccessibleNamesToInputs, fixTableStructureIssues, addProperLandmarkRegions, fixTableConstraints, fixFakeLinks };