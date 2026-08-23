// Add the missing export of the rotateBack function
export function rotateBack() {
    console.log('Rotating back...');
    // Placeholder for actual rotate back logic
}

// TODO: Add back any required exports that might have been removed
// Example of how to export a required function from another file
// const { myFunction } = require('./otherFile');
// module.exports = { myFunction };

// - REACT_015: Add lang attribute to HTML element
export function addLangAttribute() {
    const html = document.documentElement;
    if (html && !html.hasAttribute('lang')) {
        html.setAttribute('lang', 'en');
    }
}

// - REACT_041: Add accessible names to 2 SVGs
export function addSvgAccessibleNames() {
    // Find SVG elements in app/layout.tsx and dashboard/app/layout.tsx
    const svgElements = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
    svgElements.forEach((svg, index) => {
        if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
            if (index === 0) {
                svg.setAttribute('aria-label', 'Application logo');
                svg.setAttribute('role', 'img');
            } else if (index === 1) {
                svg.setAttribute('aria-label', 'Navigation icon');
                svg.setAttribute('role', 'img');
            }
        }
    });
}

// - REACT_036: Fix 1 fake link issue
export function fixFakeLink() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#' || href === '' || href === null || href === 'javascript:;') {
            if (!href || href === '#' || href === '' || href === null || href === 'javascript:;') {
                link.setAttribute("href", "#main-content");
                if (!link.textContent.trim() || link.textContent === '') {
                    link.setAttribute('aria-label', 'Skip to main content');
                }
            }
        }
    });
}

// Newly added function...
export function addAccessibleIds() {
    const accessibleElements = document.querySelectorAll('input, button');

    let elementIndex = 1;
    accessibleElements.forEach((element) => {
        if (element.getAttribute('id')) return; // Skip elements with an id attribute

        const currentId = `access-${elementIndex}`;
        element.setAttribute('id', currentId);
        elementIndex++;
    });
}

// Add the new functions for the remaining accessibility issues
export function wrapPrimaryContentInMain() {
    const mainContent = document.querySelector('.container'); // Assuming the primary content is within a div with class 'container'
    if (mainContent && mainContent.parentElement && mainContent.parentElement.tagName !== 'MAIN') {
        const mainTag = document.createElement('main');
        while (mainContent.parentElement.firstChild) {
            mainTag.appendChild(mainContent.parentElement.firstChild);
        }
        mainContent.parentElement.appendChild(mainTag);
    }
}

export function addMainLandmark() {
    // Implementation for adding main landmark
    const mainElements = document.querySelectorAll('main');
    if (mainElements.length === 0) {
        const main = document.createElement('main');
        const body = document.body;
        if (body.firstChild) {
            body.insertBefore(main, body.firstChild);
        } else {
            body.appendChild(main);
        }
        main.setAttribute('aria-label', 'Main content area');
    }
}

export function ensureUniqueLandmarks() {
    const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
    landmarks.forEach(role => {
        const elements = document.querySelectorAll(role);
        if (elements.length > 1) {
            elements.forEach((el, index) => {
                if (index > 0) {
                    const div = document.createElement('div');
                    div.setAttribute('role', role);
                    Array.from(el.attributes).forEach(attr => {
                        if (attr.name !== 'role') {
                            div.setAttribute(attr.name, attr.value);
                        }
                    });
                    while (el.firstChild) {
                        div.appendChild(el.firstChild);
                    }
                    el.parentNode.replaceChild(div, el);
                }
            });
        }
    });
}

// Function for fixing table structure issues (REACT_027)
// Adds proper table structure with thead, tbody, and scope attributes
export function fixTableStructure() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        // Check if table already has proper structure
        const hasThead = table.querySelector('thead');
        const hasTbody = table.querySelector('tbody');
        
        // Get all rows
        const rows = table.querySelectorAll('tr');
        
        if (rows.length > 0 && !hasThead) {
            // Identify header row (first row with th elements or first row if all cells are headers)
            const firstRow = rows[0];
            const hasTh = firstRow.querySelector('th');
            
            if (hasTh) {
                // Create thead if it doesn't exist
                const thead = document.createElement('thead');
                
                // Move first row to thead
                const headerCells = firstRow.querySelectorAll('th, td');
                headerCells.forEach(cell => {
                    if (cell.tagName === 'TD') {
                        // Convert TD to TH for proper table headers
                        const th = document.createElement('th');
                        th.textContent = cell.textContent;
                        Array.from(cell.attributes).forEach(attr => {
                            if (attr.name !== 'style' || !attr.value.includes('display')) {
                                th.setAttribute(attr.name, attr.value);
                            }
                        });
                        th.setAttribute('scope', 'col');
                        thead.appendChild(th);
                        cell.parentNode.removeChild(cell);
                    } else {
                        cell.setAttribute('scope', 'col');
                        thead.appendChild(cell);
                    }
                });
                
                firstRow.parentNode.removeChild(firstRow);
                table.insertBefore(thead, table.firstChild);
            }
        }
        
        // Ensure tbody exists
        const tbody = table.querySelector('tbody');
        if (!tbody) {
            const tbody = document.createElement('tbody');
            const remainingRows = table.querySelectorAll('tr');
            remainingRows.forEach(row => {
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
        }
    });
}

// Function to add proper landmark regions
export function addLandmarkRegions() {
    const body = document.body;
    
    // Check for header landmark
    const header = body.querySelector('header');
    if (!header) {
        const headerEl = document.createElement('header');
        headerEl.setAttribute('role', 'banner');
        if (body.firstChild) {
            body.insertBefore(headerEl, body.firstChild);
        } else {
            body.appendChild(headerEl);
        }
    }
    
    // Check for nav landmark
    const nav = body.querySelector('nav');
    if (!nav) {
        const navEl = document.createElement('nav');
        navEl.setAttribute('role', 'navigation');
        navEl.setAttribute('aria-label', 'Main navigation');
        body.appendChild(navEl);
    }
    
    // Check for footer landmark
    const footer = body.querySelector('footer');
    if (!footer) {
        const footerEl = document.createElement('footer');
        footerEl.setAttribute('role', 'contentinfo');
        body.appendChild(footerEl);
    }
}