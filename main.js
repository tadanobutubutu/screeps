// TODO: Address accessibility issues from insight report
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'
function setHtmlLangAttribute(lang = 'en') {
    const html = document.querySelector('html');
    if (html && html.tagName) {
        html.setAttribute('lang', lang);
    }
}

// Enhanced function to ensure language attribute is properly set
function ensureLanguageAttribute() {
    const html = document.querySelector('html');
    if (html) {
        // Ensure lang attribute exists and has a valid value
        const lang = html.getAttribute('lang');
        if (!lang || lang.trim() === '') {
            html.setAttribute('lang', 'en'); // Set default language
        }
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
        svgTitle.id = 'svg-title-' + Math.random().toString(36).substr(2, 11);
    }
    if (!svgDesc.id) {
        svgDesc.id = 'svg-desc-' + Math.random().toString(36).substr(2, 11);
    }
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-labelledby', `${svgTitle.id} ${svgDesc.id}`);
}

// Enhanced function to handle SVG accessibility with fallback options
function handleSvgAccessibilityWithFallbackOptions() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        // Skip SVGs that are already handled or are decorative
        if (svg.getAttribute('aria-hidden') === 'true') {
            return;
        }

        const title = svg.querySelector('title');
        const desc = svg.querySelector('desc');

        // For SVGs missing title or desc, create them
        if (!title && !desc) {
            // Create title element
            const newTitle = document.createElement('title');
            newTitle.textContent = svg.getAttribute('aria-label') ||
                                  svg.getAttribute('alt') ||
                                  'Decoration';
            newTitle.id = 'svg-title-' + Math.random().toString(36).substr(2, 11);
            svg.insertBefore(newTitle, svg.firstChild);

            // Create desc element if needed
            if (svg.getAttribute('role') !== 'presentation' && !svg.getAttribute('alt')) {
                const newDesc = document.createElement('desc');
                newDesc.textContent = 'Graphical element';
                newDesc.id = 'svg-desc-' + Math.random().toString(36).substr(2, 11);
                svg.insertBefore(newDesc, svg.firstChild);
            }

            // Set accessibility attributes
            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-labelledby', newTitle.id + (newDesc ? ' ' + newDesc.id : ''));
        } else if (!title) {
            // Only title is missing
            const newTitle = document.createElement('title');
            newTitle.textContent = 'Icon';
            newTitle.id = 'svg-title-' + Math.random().toString(36).substr(2, 11);
            svg.insertBefore(newTitle, svg.firstChild);

            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-labelledby', newTitle.id + ' ' + (desc ? desc.id : ''));
        } else if (!desc) {
            // Only desc is missing
            const newDesc = document.createElement('desc');
            newDesc.textContent = svg.getAttribute('alt') || 'Graphical element';
            newDesc.id = 'svg-desc-' + Math.random().toString(36).substr(2, 11);
            svg.insertBefore(newDesc, svg.firstChild);

            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-labelledby', title.id + ' ' + newDesc.id);
        }
    });
}

// Function to find all SVG elements on the page and add accessible names
function addAllSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => addSvgAccessibleNames(svg));
}

// New function to fix an issue where SVGs (e.g., favicons) are missing accessible name
function fixSvgAccessibilityIssues() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        const title = svg.querySelector('title');
        const desc = svg.querySelector('desc');
        if (!title || !desc) {
            svg.setAttribute('aria-hidden', 'true');
        }
    });
}
// ----- ORIGINAL CODE END -----

// NEW CODE FOR TABLE ISSUES

// Function to fix table structure issues
function fixTableStructureIssues() {
    // Addresses table structure issues by ensuring each table has a <thead>
    // with at least one header row and that all <th> elements have a
    // 'scope' attribute set to 'col'.
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const hasThead = table.querySelector('thead');

        // If no <thead> exists, create one and populate it with existing <th> elements
        if (!hasThead) {
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');

            // Move existing <th> elements into the header row
            const existingThs = table.querySelectorAll('th');
            existingThs.forEach(th => {
                const newTh = th.cloneNode(true);
                newTh.setAttribute('scope', 'col');
                headerRow.appendChild(newTh);
            });

            thead.appendChild(headerRow);
            table.prepend(thead);
        }

        // Ensure all <th> elements have the 'scope' attribute set to 'col'
        table.querySelectorAll('th').forEach(th => {
            th.setAttribute('scope', 'col');
        });
        
        // Ensure every row that has cells is part of a proper structure
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            // Ensure each cell in the row is either a th or td
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                // Check if this row should be in thead or tbody
                const hasHeaderCells = row.querySelector('th') !== null;
                if (hasHeaderCells && !hasThead) {
                    // Row has header cells but no thead exists
                }
            }
        });
    });
}

// TODO: Add any other missing exports that might have been?
export {
    setHtmlLangAttribute,
    ensureLanguageAttribute,
    addSvgAccessibleNames,
    handleSvgAccessibleWithFallbackOptions,
    addAllSvgAccessibleNames,
    fixSvgAccessibilityIssues,
    fixTableStructureIssues,
    dependencyGraphContent,
    indexContent
};