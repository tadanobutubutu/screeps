// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'
function addLangToHtmlElement(lang = 'en') {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
        htmlElement.setAttribute('lang', lang);
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
    
    // Ensure title and desc have unique IDs
    if (!svgTitle.id) {
        svgTitle.id = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    if (!svgDesc.id) {
        svgDesc.id = `svg-desc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Set aria-labelledby and aria-describedby on the SVG
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-labelledby', svgTitle.id);
    svg.setAttribute('aria-describedby', svgDesc.id);
}

// Function to find all SVG elements on the page and add accessible names
function addAllSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg:not([role="img"]):not([aria-labelledby])');
    svgs.forEach(svg => {
        addSvgAccessibleNames(svg);
    });
}

// Function to add scope attribute to th elements for accessibility
function addScopeToTableHeaders(th) {
    const isHeaderRow = th.closest('thead') !== null || 
                        th.parentElement?.parentElement?.tagName === 'THEAD' ||
                        th.getAttribute('scope') === 'row';
    
    if (th.tagName === 'TH') {
        if (isHeaderRow || th.cellIndex === 0) {
            th.setAttribute('scope', 'col');
        } else {
            th.setAttribute('scope', 'col');
        }
    }
}

// Function to find all th elements on the page and add the scope attribute
function addAllTableHeadersScope() {
    const thElements = document.querySelectorAll('th:not([scope])');
    thElements.forEach(th => {
        addScopeToTableHeaders(th);
    });
}

// Function to implement addressing accessibility issues from insight report
function fixInputLabels() {
    // The implementation will depend on the insight report details
    // As an example, let's assume the report suggests adding labels to inputs
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    inputs.forEach(input => {
        // Check if there's an existing label
        const inputId = input.id || `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        if (!input.id) {
            input.id = inputId;
        }
        
        const existingLabel = document.querySelector(`label[for="${input.id}"]`);
        if (!existingLabel) {
            const label = document.createElement('label');
            label.htmlFor = input.id;
            label.textContent = 'Input description';
            label.style.display = 'none'; // Hidden but associated
            input.parentNode.insertBefore(label, input);
        }
    });
}

// New function to fix table structure issues
function fixTableStructureIssues() {
    // Example implementation: Add scope attribute to all th elements
    addAllTableHeadersScope();
    // Additional fixes can be added here based on the specific issues identified
}

// Function to add proper landmark regions to the page
function addProperLandmarkRegions() {
    // Add role="banner" to header elements
    const headers = document.querySelectorAll('header:not([role])');
    headers.forEach((header, index) => {
        if (!header.closest('article, aside, main, nav, section')) {
            header.setAttribute('role', 'banner');
        }
    });
    
    // Add role="navigation" to nav elements
    const navs = document.querySelectorAll('nav:not([role])');
    navs.forEach((nav, index) => {
        nav.setAttribute('role', 'navigation');
        if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
            nav.setAttribute('aria-label', `Navigation ${index + 1}`);
        }
    });
    
    // Add role="main" to main elements
    const mains = document.querySelectorAll('main:not([role])');
    mains.forEach(main => {
        main.setAttribute('role', 'main');
    });
    
    // Add role="complementary" to aside elements
    const asides = document.querySelectorAll('aside:not([role])');
    asides.forEach((aside, index) => {
        aside.setAttribute('role', 'complementary');
        if (!aside.getAttribute('aria-label') && !aside.getAttribute('aria-labelledby')) {
            aside.setAttribute('aria-label', `Complementary content ${index + 1}`);
        }
    });
    
    // Add role="contentinfo" to footer elements
    const footers = document.querySelectorAll('footer:not([role])');
    footers.forEach(footer => {
        if (!footer.closest('article, aside, main, nav, section')) {
            footer.setAttribute('role', 'contentinfo');
        }
    });
}

// Function to ensure unique landmarks (fix duplicate landmark issues)
function ensureUniqueLandmarks() {
    const landmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
    
    landmarks.forEach(role => {
        const elements = document.querySelectorAll(`[role="${role}"]`);
        elements.forEach((el, index) => {
            // Add unique identifiers to landmarks if they appear more than once
            if (elements.length > 1 && !el.getAttribute('aria-label')) {
                el.setAttribute('aria-label', `${role} ${index + 1}`);
            }
        });
    });
}

// Function to fix fake link issues (links without href or with href="#")
function fixFakeLinks() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        // Fix links that are fake (no href or just "#")
        if (!href || href === '#') {
            // Check if it's meant to be a button
            if (link.getAttribute('role') === 'button' || link.onclick) {
                link.setAttribute('role', 'button');
            } else {
                // Make it a proper link or convert to button
                console.warn('Fake link found:', link.textContent.trim());
                link.setAttribute('aria-disabled', 'true');
            }
        }
    });
}

// Function to enforce table structure with THEAD
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
        
        // Ensure proper scope attributes on th elements
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const ths = row.querySelectorAll('th');
            ths.forEach(th => {
                if (!th.hasAttribute('scope')) {
                    // Determine if this is a row header or column header
                    const isRowHeader = th.cellIndex === 0 && row.parentElement.tagName !== 'THEAD';
                    th.setAttribute('scope', isRowHeader ? 'row' : 'col');
                }
            });
        });
    });
}

// Main function to address all accessibility issues
function addressAccessibilityIssues() {
    // REACT_015: Add lang attribute to HTML element
    addLangToHtmlElement('en');
    
    // REACT_017: Add landmark roles and fix landmark issues
    addProperLandmarkRegions();
    
    // REACT_041: Add accessible names to 2 SVGs
    addAllSvgAccessibleNames();
    
    // REACT_025: Ensure unique landmarks
    ensureUniqueLandmarks();
    
    // REACT_036: Fix fake link issue
    fixFakeLinks();
    
    // REACT_027: Add scope="col" or scope="row" to <th> elements
    addAllTableHeadersScope();
    
    // Fix table structure issues
    fixTableConstraints();
}

// Export the new functions
export { addLangToHtmlElement, addAllSvgAccessibleNames, addAllTableHeadersScope, fixInputLabels, fixTableStructureIssues, addProperLandmarkRegions, ensureUniqueLandmarks, fixFakeLinks, fixTableConstraints, addressAccessibilityIssues };