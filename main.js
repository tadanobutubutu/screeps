// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'
function addLangAttributeToHtml(lang = 'en') {
    const html = document.querySelector('html');
    if (html) {
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
        return false;
    }
    
    // Ensure IDs exist on title and desc
    if (!svgTitle.id) {
        svgTitle.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
    }
    if (!svgDesc.id) {
        svgDesc.id = `svg-desc-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Set aria-labelledby and aria-describedby on the SVG
    svg.setAttribute('aria-labelledby', svgTitle.id);
    svg.setAttribute('aria-describedby', `${svgTitle.id} ${svgDesc.id}`);
    return true;
}

// Function to find all SVG elements on the page and add accessible names
function addAllSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => addSvgAccessibleNames(svg));
}

// Function to add scope attribute to th elements for accessibility
function addScopeToTableHeaders(th) {
    const tableHeaders = th ? [th] : document.querySelectorAll('th');
    tableHeaders.forEach(th => {
        // Determine if this is a column header or row header
        const parent = th.parentElement;
        const isRowHeader = parent && parent.tagName === 'TR' && 
            Array.from(parent.children).indexOf(th) > 0;
        
        if (isRowHeader) {
            th.setAttribute('scope', 'row');
        } else {
            th.setAttribute('scope', 'col');
        }
    });
}

// Function to find all th elements on the page and add the scope attribute
function addAllTableHeadersScope() {
    const thElements = document.querySelectorAll('th');
    thElements.forEach(th => {
        // Determine if this is a column header or row header
        const parent = th.parentElement;
        const isRowHeader = parent && parent.tagName === 'TR' && 
            Array.from(parent.children).indexOf(th) > 0;
        
        if (isRowHeader) {
            th.setAttribute('scope', 'row');
        } else {
            th.setAttribute('scope', 'col');
        }
    });
}

// Function to implement addressing accessibility issues from insight report
function fixInputLabels() {
    // The implementation will depend on the insight report details
    // As an example, let's assume the report suggests adding labels to inputs
    const inputs = document.querySelectorAll('input:not([type="hidden"]):not([id])');
    inputs.forEach(input => {
        const label = document.createElement('label');
        if (input.id) {
            label.htmlFor = input.id;
        } else {
            const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
            input.id = inputId;
            label.htmlFor = inputId;
        }
        label.textContent = 'Input description';
        input.parentNode.insertBefore(label, input);
    });
}

// Function to fix fake link issues (links without href or buttons that should be links)
function fixFakeLinks() {
    const anchors = document.querySelectorAll('a:not([href])');
    anchors.forEach(anchor => {
        // Check if it's a fake link (navigation without href)
        if (!anchor.getAttribute('href') || anchor.getAttribute('href') === '#') {
            // Convert to button if it triggers an action
            const isActionLink = !anchor.getAttribute('href') || 
                                 anchor.getAttribute('href') === '#';
            if (isActionLink) {
                // Option 1: Add role="button" and tabindex
                anchor.setAttribute('role', 'button');
                anchor.setAttribute('tabindex', '0');
            }
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
    // Track used roles to ensure uniqueness
    const usedRoles = {
        banner: false,
        navigation: false,
        main: false,
        complementary: false,
        contentinfo: false
    };
    
    // Add role="banner" to header elements
    const headers = document.querySelectorAll('header');
    headers.forEach(header => {
        if (!usedRoles.banner) {
            header.setAttribute('role', 'banner');
            usedRoles.banner = true;
        }
    });
    
    // Add role="navigation" to nav elements
    const navs = document.querySelectorAll('nav');
    navs.forEach(nav => {
        if (!usedRoles.navigation) {
            nav.setAttribute('role', 'navigation');
            usedRoles.navigation = true;
        }
    });
    
    // Add role="main" to main elements
    const mains = document.querySelectorAll('main');
    mains.forEach(main => {
        if (!usedRoles.main) {
            main.setAttribute('role', 'main');
            usedRoles.main = true;
        }
    });
    
    // Add role="complementary" to aside elements
    const asides = document.querySelectorAll('aside');
    asides.forEach(aside => {
        if (!usedRoles.complementary) {
            aside.setAttribute('role', 'complementary');
            usedRoles.complementary = true;
        }
    });
    
    // Add role="contentinfo" to footer elements
    const footers = document.querySelectorAll('footer');
    footers.forEach(footer => {
        if (!usedRoles.contentinfo) {
            footer.setAttribute('role', 'contentinfo');
            usedRoles.contentinfo = true;
        }
    });
}

// New function to fix table constraints
function fixTableConstraints() {
    // Enforce at least one THEAD or `${headerRowCount}` rows in TABLEs
    const tables = document.querySelectorAll('table');
    const headerRowCount = 1; // Modify this number if required

    tables.forEach(table => {
        let hasThead = false;
        let theads = table.querySelectorAll('thead');
        
        theads.forEach(thead => {
            if (thead.rows && thead.rows.length > 0) {
                hasThead = true;
            }
        });

        if (!hasThead) {
            // Check if first row(s) should be considered headers
            const tbody = table.querySelector('tbody') || table;
            const rows = table.querySelectorAll('tr');
            
            if (rows.length < headerRowCount) {
                console.warn("Table does not have a thead or enough header rows:", table);
            } else {
                // Wrap first row(s) in thead if they contain th elements
                const firstRows = Array.from(rows).slice(0, headerRowCount);
                const hasTh = firstRows.some(row => row.querySelector('th'));
                
                if (hasTh && !table.querySelector('thead')) {
                    const thead = document.createElement('thead');
                    firstRows.forEach(row => {
                        thead.appendChild(row);
                    });
                    table.insertBefore(thead, table.firstChild);
                }
            }
        }
    });
}

// Master function to apply all accessibility fixes
function applyAccessibilityFixes() {
    addLangAttributeToHtml('en');
    addAllSvgAccessibleNames();
    addAllTableHeadersScope();
    fixInputLabels();
    fixFakeLinks();
    fixTableStructureIssues();
    addProperLandmarkRegions();
    fixTableConstraints();
}

// Export the new functions
export { 
    addLangAttributeToHtml,
    addSvgAccessibleNames, 
    addAllSvgAccessibleNames, 
    addAllTableHeadersScope, 
    addScopeToTableHeaders,
    fixInputLabels,
    fixFakeLinks,
    fixTableStructureIssues, 
    addProperLandmarkRegions, 
    fixTableConstraints,
    applyAccessibilityFixes
};