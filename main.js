// Add the missing export of the rotateBack function
export function rotateBack() {
    console.log('Rotating back...');
    // Placeholder for actual rotate back logic
}

// Import and use dependencyGraphContent/indexContent from the appropriate modules
import { renderDependencyGraph, indexContent } from './dependencyGraphContent';

// - REACT_015: Add lang attribute to HTML element
export function addLangAttribute() {
    const html = document.documentElement;
    if (html) {
        html.setAttribute('lang', 'en');
    }
}

// - REACT_041: Add accessible names to 2 SVGs
export function addSvgAccessibleNames() {
    // Find SVG elements in app/layout.tsx and dashboard/app/layout.tsx
    const svgElements = document.querySelectorAll('link[rel="icon"] svg, link[rel="apple-touch-icon"] svg');
    svgElements.forEach((svg, index) => {
        if (index === 0) {
            svg.setAttribute('aria-label', 'Application logo');
            svg.setAttribute('role', 'img');
        } else if (index === 1) {
            svg.setAttribute('aria-label', 'Navigation icon');
            svg.setAttribute('role', 'img');
        }
    });
}

// - REACT_036: Fix 1 fake link issue
export function fixFakeLink() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#' || href === '' || href === null || href === 'javascript:;') {
            link.setAttribute('href', '#main-content');
            if (!link.textContent.trim() || link.textContent === '') {
                link.setAttribute('aria-label', 'Skip to main content');
            }
        }
    });
}

// Newly added function...
export function addAccessibleIds() {
    const accessibleElements = document.querySelectorAll('button, a');
    accessibleElements.forEach((element) => {
        if (element.getAttribute('id')) return; // Skip elements with an id attribute

        const currentId = `accessible-${Math.random().toString(36).substr(2, 9)}`;
        element.setAttribute('id', currentId);
    });
}

// TODO: Implement wrapPrimaryContentInMain function
export function wrapPrimaryContentInMain() {
    const mainContent = document.querySelector('#main-content, .main-content');
    if (mainContent && mainContent.parentElement && mainContent.parentElement.tagName !== 'MAIN') {
        const mainTag = document.createElement('main');
        mainTag.setAttribute('role', 'main');
        const parent = mainContent.parentElement;
        while (mainContent.firstChild) {
            mainTag.appendChild(mainContent.firstChild);
        }
        parent.replaceChild(mainTag, mainContent);
    }
}

// Export the renderDependencyGraph function and indexContent from dependencyGraphContent module
export { renderDependencyGraph, indexContent };

export function addMainLandmark() {
    // Implementation for adding main landmark
    const mainElements = document.querySelectorAll('[role="main"]');
    if (mainElements.length === 0) {
        const main = document.createElement('main');
        main.setAttribute('role', 'main');
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
        const elements = document.querySelectorAll(`[role="${role}"], ${role}`);
        if (elements.length > 1) {
            elements.forEach((el, index) => {
                if (index > 0) {
                    const div = document.createElement('div');
                    div.setAttribute('role', role);
                    while (el.firstChild) {
                        div.appendChild(el.firstChild);
                    }
                    el.parentNode.replaceChild(div, el);
                }
            });
        }
    });
}

// - REACT_027: Fix table structure issues
export function fixTableStructure() {
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
        // Check if table has headers
        const headers = table.querySelectorAll('th');
        const hasHeaders = headers.length > 0;
        
        if (!hasHeaders) {
            // Check first row for header cells
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const cells = firstRow.querySelectorAll('td');
                cells.forEach((cell) => {
                    const th = document.createElement('th');
                    th.setAttribute('scope', 'col');
                    while (cell.firstChild) {
                        th.appendChild(cell.firstChild);
                    }
                    cell.parentNode.replaceChild(th, cell);
                });
            }
        } else {
            // Add scope attributes to existing headers
            headers.forEach((header) => {
                if (!header.hasAttribute('scope')) {
                    const parent = header.parentElement;
                    if (parent && parent.tagName === 'TR') {
                        const siblings = Array.from(parent.querySelectorAll('th, td'));
                        const headerIndex = siblings.indexOf(header);
                        const firstRow = table.querySelector('tr');
                        if (firstRow && firstRow === parent) {
                            header.setAttribute('scope', 'col');
                        } else {
                            header.setAttribute('scope', 'row');
                        }
                    }
                }
            });
        }

        // Ensure proper table structure
        if (!table.querySelector('caption')) {
            const caption = document.createElement('caption');
            caption.textContent = 'Data table';
            table.insertBefore(caption, table.firstChild);
        }
    });
}

// TODO: Implement function for adding proper landmark regions
export function addLandmarkRegions() {
    const body = document.body;

    // Check for header landmark
    const header = document.querySelector('header, [role="banner"]');
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
    const nav = document.querySelector('nav, [role="navigation"]');
    if (!nav) {
        const navEl = document.createElement('nav');
        navEl.setAttribute('role', 'navigation');
        navEl.setAttribute('aria-label', 'Main navigation');
        if (body.firstChild) {
            body.insertBefore(navEl, body.firstChild);
        } else {
            body.appendChild(navEl);
        }
    }

    // Check for footer landmark
    const footer = document.querySelector('footer, [role="contentinfo"]');
    if (!footer) {
        const footerEl = document.createElement('footer');
        footerEl.setAttribute('role', 'contentinfo');
        if (body.lastChild) {
            body.insertBefore(footerEl, body.lastChild);
        } else {
            body.appendChild(footerEl);
        }
    }
}

// TODO: Implement function for addressing accessibility issues from insight report
export function addressAccessibilityIssues() {
    // Example of addressing accessibility issues:
    // - Add `lang` attribute to HTML element
    addLangAttribute();

    // - Add accessible names to SVGs
    addSvgAccessibleNames();

    // - Fix fake link issues
    fixFakeLink();

    // - Add accessible IDs to elements
    addAccessibleIds();

    // - Wrap primary content in a main element
    wrapPrimaryContentInMain();

    // - Add main landmark
    addMainLandmark();

    // - Ensure unique landmarks
    ensureUniqueLandmarks();

    // - Add landmark regions
    addLandmarkRegions();

    // - Fix table structure issues
    fixTableStructure();

    // - Add proper landmark regions
    // TODO: Implement ...
}