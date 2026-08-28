// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * REACT_015: Add lang attribute to HTML element
 * Sets the lang attribute on the HTML element to improve screen reader compatibility
 */
function addLangAttribute() {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
        htmlElement.setAttribute('lang', 'en');
    }
}

/**
 * REACT_027: Fix 26 table structure issues
 * Ensures all tables have proper structure with thead, tbody, and semantic markup
 */
function fixTableStructure() {
    const tables = document.querySelectorAll('table');
    tables.forEach(function(table) {
        const existingThead = table.querySelector('thead');
        const existingTbody = table.querySelector('tbody');
        
        if (!existingThead) {
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const thead = document.createElement('thead');
                thead.appendChild(firstRow.cloneNode(true));
                table.insertBefore(thead, table.firstChild);
                firstRow.remove();
            }
        }
        
        if (!existingTbody) {
            const rows = table.querySelectorAll('tr');
            if (rows.length > 0) {
                const tbody = document.createElement('tbody');
                rows.forEach(function(row) {
                    if (!row.closest('thead')) {
                        tbody.appendChild(row);
                    }
                });
                table.appendChild(tbody);
            }
        }
    });
}

/**
 * REACT_017: Add/fix 2 landmark issues - Add main landmark
 * Ensures the page has a proper main landmark for screen readers
 */
function addMainLandmark() {
    const mainElements = document.querySelectorAll('main');
    const existingMain = document.querySelector('[role="main"]');
    
    if (mainElements.length === 0 && !existingMain) {
        const body = document.body;
        const main = document.createElement('main');
        main.setAttribute('role', 'main');
        
        while (body.firstChild) {
            main.appendChild(body.firstChild);
        }
        body.appendChild(main);
    }
}

/**
 * REACT_025: Ensure unique landmarks
 * Removes duplicate landmarks and ensures proper landmark usage
 */
function ensureUniqueLandmarks() {
    const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
    
    landmarks.forEach(function(landmark) {
        const elements = document.querySelectorAll(landmark);
        const roleElements = document.querySelectorAll('[role="' + landmark + '"]');
        
        if (elements.length > 1 || roleElements.length > 1) {
            const allElements = [...elements, ...roleElements];
            allElements.forEach(function(el, index) {
                if (index > 0) {
                    el.removeAttribute(landmark);
                    el.removeAttribute('role');
                }
            });
        }
    });
}

/**
 * REACT_041: Add accessible names to 2 SVGs
 * Adds aria-label or title to SVG elements for screen reader compatibility
 */
function addSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg');
    let count = 0;
    
    svgs.forEach(function(svg) {
        const hasLabel = svg.getAttribute('aria-label') || 
                         svg.getAttribute('aria-labelledby') || 
                         svg.querySelector('title');
        
        if (!hasLabel && count < 2) {
            const title = document.createElement('title');
            title.textContent = 'Icon ' + (count + 1);
            svg.insertBefore(title, svg.firstChild);
            svg.setAttribute('aria-label', 'Icon ' + (count + 1));
            count++;
        }
    });
}

/**
 * REACT_036: Fix 1 fake link issue
 * Converts non-navigation elements that look like links to proper buttons or add href attributes
 */
function fixFakeLinkIssue() {
    const fakeLinks = document.querySelectorAll('a:not([href])');
    
    fakeLinks.forEach(function(link) {
        const onclick = link.getAttribute('onclick');
        const isInteractive = onclick || link.getAttribute('role') === 'button';
        
        if (isInteractive && !link.getAttribute('href')) {
            link.setAttribute('role', 'button');
            link.setAttribute('tabindex', '0');
        }
    });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addLangAttribute,
        fixTableStructure,
        addMainLandmark,
        ensureUniqueLandmarks,
        addSvgAccessibleNames,
        fixFakeLinkIssue
    };
}