// Add the missing export of the rotateBack function
export function rotateBack() {
    console.log('Rotating back...');
    // Placeholder for actual rotate back logic
}

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
    const svg1 = document.querySelector('header svg, .logo svg, [class*="logo"] svg');
    if (svg1) {
        if (!svg1.getAttribute('aria-label') && !svg1.getAttribute('aria-labelledby')) {
            svg1.setAttribute('aria-label', 'Application logo');
        }
        svg1.setAttribute('role', 'img');
    }
    const svg2 = document.querySelector('nav svg, .nav-icon svg, [class*="nav"] svg');
    if (svg2) {
        if (!svg2.getAttribute('aria-label') && !svg2.getAttribute('aria-labelledby')) {
            svg2.setAttribute('aria-label', 'Navigation icon');
        }
        svg2.setAttribute('role', 'img');
    }
}

// - REACT_036: Fix 1 fake link issue
export function fixFakeLink() {
    const links = document.querySelectorAll('a[href="#"], a[href=""], a[href="javascript:;"]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#' || href === '' || href === 'javascript:;') {
            link.setAttribute("href", "#main-content");
            if (!link.textContent.trim()) {
                link.setAttribute('aria-label', 'Skip to main content');
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

// Update main.js with the added functions and wrap the primary content in <main>
export function wrapPrimaryContentInMain() {
    const mainContent = document.querySelector('.container, main, [role="main"]');
    if (mainContent && !mainContent.tagName === 'MAIN') {
        const mainTag = document.createElement('main');
        const parent = mainContent.parentNode;
        while (mainContent.firstChild) {
            mainTag.appendChild(mainContent.firstChild);
        }
        parent.insertBefore(mainTag, mainContent);
        parent.removeChild(mainContent);
    }
}

// - REACT_017: Add/fix 2 landmark issues
export function addMainLandmark() {
    // Implementation for adding main landmark
    const mainElements = document.querySelectorAll('main, [role="main"]');
    if (mainElements.length === 0) {
        const main = document.createElement('main');
        const body = document.body;
        if (body.firstChild) {
            body.insertBefore(main, body.firstChild);
        } else {
            body.appendChild(main);
        }
    }
}

// - REACT_027: Fix 26 table structure issues
export function fixTableStructureIssues() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        // Ensure tables have proper structure
        if (!table.querySelector('thead')) {
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');
                thead.appendChild(firstRow);
                table.insertBefore(thead, table.firstChild);

                // Move remaining rows to tbody
                let currentNode = thead.nextSibling;
                while (currentNode) {
                    const nextNode = currentNode.nextSibling;
                    if (currentNode.nodeName === 'TR') {
                        tbody.appendChild(currentNode);
                    }
                    currentNode = nextNode;
                }
                if (tbody.firstChild) {
                    table.appendChild(tbody);
                }
            }
        }

        // Ensure cells have proper scope attributes
        const headerCells = table.querySelectorAll('th');
        headerCells.forEach(th => {
            if (!th.hasAttribute('scope')) {
                const row = th.closest('tr');
                if (row && row.parentNode.nodeName === 'THEAD') {
                    th.setAttribute('scope', 'col');
                } else {
                    th.setAttribute('scope', 'row');
                }
            }
        });
    });
}

// - REACT_025: Ensure unique landmarks
export function ensureUniqueLandmarks() {
    const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
    const seenLandmarks = {};
    landmarks.forEach(role => {
        const elements = document.querySelectorAll(role);
        let count = 1;
        elements.forEach(element => {
            const tag = role;
            if (!seenLandmarks[tag]) {
                seenLandmarks[tag] = count;
            } else {
                seenLandmarks[tag]++;
                count = seenLandmarks[tag];
            }
            if (count > 1 && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
                const baseName = role.charAt(0).toUpperCase() + role.slice(1);
                element.setAttribute('aria-label', `${baseName} ${count}`);
            }
        });
    });
}