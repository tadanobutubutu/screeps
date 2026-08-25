// Accessibility fixes for the application

/**
 * Adds lang attribute to HTML element
 * REACT_015
 */
export function addLangAttribute(document) {
    const html = document.querySelector('html');
    if (html && !html.hasAttribute('lang')) {
        html.setAttribute('lang', 'en');
    }
}

/**
 * Fixes table structure issues
 * REACT_027
 */
export function fixTableStructureIssues(document) {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        // Add caption if missing
        if (!table.querySelector('caption')) {
            const caption = document.createElement('caption');
            caption.textContent = 'Data table';
            table.prepend(caption);
        }
        
        // Add thead if missing but has th elements
        if (!table.querySelector('thead') && table.querySelector('th')) {
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const thead = document.createElement('thead');
                thead.appendChild(firstRow.cloneNode(true));
                table.insertBefore(thead, table.firstChild);
            }
        }
        
        // Wrap loose td elements in tbody
        const rows = Array.from(table.querySelectorAll('tr'));
        const hasTbody = table.querySelector('tbody');
        
        if (!hasTbody && rows.length > 0) {
            const tbody = document.createElement('tbody');
            rows.forEach(row => tbody.appendChild(row));
            if (table.querySelector('thead')) {
                table.querySelector('thead').after(tbody);
            } else {
                table.prepend(tbody);
            }
        }
    });
}

/**
 * Adds main landmark
 * REACT_017
 */
export function addMainLandmark(document) {
    const mains = document.querySelectorAll('main');
    const body = document.querySelector('body');
    
    if (body && mains.length === 0) {
        const main = document.createElement('main');
        const children = Array.from(body.children);
        children.forEach(child => {
            if (!['script', 'style', 'link', 'meta', 'noscript'].includes(child.tagName.toLowerCase())) {
                main.appendChild(child);
            }
        });
        body.prepend(main);
    }
}

/**
 * Adds accessible names to SVGs
 * REACT_041
 */
export function addSvgAccessibleNames(document) {
    const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
    svgs.forEach((svg, index) => {
        svg.setAttribute('aria-label', `Icon ${index + 1}`);
    });
}

/**
 * Ensures unique landmarks
 * REACT_025
 */
export function ensureUniqueLandmarks(document) {
    const landmarks = ['nav', 'main', 'aside', 'header', 'footer'];
    
    landmarks.forEach(landmark => {
        const elements = document.querySelectorAll(landmark);
        if (elements.length > 1) {
            elements.forEach((el, index) => {
                if (index > 0) {
                    const role = el.tagName.toLowerCase();
                    el.setAttribute('aria-label', `${role} section ${index + 1}`);
                }
            });
        }
    });
}

/**
 * Fixes fake link issues
 * REACT_036
 */
export function fixFakeLinkIssue(document) {
    const links = document.querySelectorAll('a[href="#"], a:not([href])');
    links.forEach(link => {
        if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
            const onclick = link.getAttribute('onclick');
            if (onclick) {
                link.setAttribute('role', 'button');
                link.removeAttribute('href');
            }
        }
    });
}

/**
 * Main accessibility fix function
 */
export function runAccessibilityFixes(document) {
    addLangAttribute(document);
    fixTableStructureIssues(document);
    addMainLandmark(document);
    addSvgAccessibleNames(document);
    ensureUniqueLandmarks(document);
    fixFakeLinkIssue(document);
}

// Run fixes if document is provided
if (typeof document !== 'undefined') {
    runAccessibilityFixes(document);
}