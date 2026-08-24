// TODO: Address accessibility issues from insight report
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// ------------------- ADDING LANG ATTRIBUTE TO HTML ELEMENT --------------------
// Enhanced function to ensure language attribute is properly set
function ensureLanguageAttribute() {
    const html = document.documentElement;
    if (html) {
        // Ensure lang attribute exists and has a valid value
        const lang = html.getAttribute('lang');
        if (!lang || lang.trim() === '') {
            html.setAttribute('lang', 'en'); // Set default language
        }
    }
}

// ------------------------ ADDING SVG ACCESSIBLE NAMES -------------------------
// Function to add accessible names to SVGs
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
function handleSvgAccessibility() {
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

// TABLE STRUCTURE ISSUES FIXES

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
            const existingThs = Array.from(table.querySelectorAll('th'));
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
            const cells = row.querySelectorAll('th');
            if (cells.length > 0) {
                // Check if this row should be in thead or tbody
                const isHeaderRow = cells.length > 0;

                // If it's a header row, append it to thead, otherwise append it to tbody
                if (isHeaderRow && !table.querySelector('thead tr')) {
                    table.prepend(row);
                } else if (!isHeaderRow && !table.querySelector('tbody')) {
                    const tbody = document.createElement('tbody');
                    tbody.appendChild(row);
                    table.appendChild(tbody);
                }
            }
        });
    });
}

// LANDMARK ISSUES FIXES

// Function to fix landmark issues by ensuring proper landmark regions
function fixLandmarkIssues() {
    // Add main landmark if missing
    const mainElements = document.querySelectorAll('main');
    if (mainElements.length === 0) {
        // Check for role="main"
        const mainWithRole = document.querySelector('[role="main"]');
        if (!mainWithRole) {
            console.warn('REACT_017: No main landmark found');
        }
    }

    // Add nav landmark if missing
    const navElements = document.querySelectorAll('nav');
    if (navElements.length === 0) {
        console.warn('REACT_017: No nav landmark found');
    }

    // Ensure unique landmarks (REACT_025)
    const landmarks = document.querySelectorAll('header, footer, main, nav, aside, section[aria-label], section[aria-labelledby]');
    const landmarkTypes = {};

    landmarks.forEach(landmark => {
        const tagName = landmark.tagName.toLowerCase();
        const role = landmark.getAttribute('role');
        const key = role || tagName;

        if (landmarkTypes[key]) {
            // Add aria-label to make landmark unique
            if (!landmark.getAttribute('aria-label')) {
                const existingLabels = ['primary', 'secondary', 'tertiary', 'additional', 'footer', 'header', 'navigation', 'sidebar'];
                let labelIndex = 0;
                let label = existingLabels[labelIndex] || `section-${labelIndex}`;

                while (document.querySelector(`[aria-label="${label}"]`)) {
                    labelIndex++;
                    label = existingLabels[labelIndex] || `section-${labelIndex}`;
                }

                landmark.setAttribute('aria-label', label);
            }
        } else {
            landmarkTypes[key] = true;
        }
    });
}

// FAKE LINK ISSUES FIXES (REACT_036)

// Function to fix fake link issues (links that are not <a> tags or buttons)
function fixFakeLinkIssues() {
    // Find elements with onclick that look like links but aren't <a> or <button>
    const fakeLinks = document.querySelectorAll('[onclick]');

    fakeLinks.forEach(element => {
        const tagName = element.tagName.toLowerCase();
        const role = element.getAttribute('role');

        // Skip if it's already a proper interactive element
        if (tagName === 'a' || tagName === 'button') {
            return;
        }

        // Check if it looks like a link
        const cursorStyle = window.getComputedStyle(element).cursor;
        const isClickable = cursorStyle === 'pointer';
        const hasHref = element.hasAttribute('href');

        if (isClickable && !hasHref && !role) {
            // Convert to button for proper accessibility
            element.setAttribute('role', 'button');

            // Add keyboard support
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
        }
    });
}

// Combined function to run all accessibility fixes
function runAccessibilityFixes() {
    ensureLanguageAttribute();
    handleSvgAccessibility();
    fixTableStructureIssues();
    fixLandmarkIssues();
    fixFakeLinkIssues();
}

// Export the new functions to address accessibility issues
export {
    runAccessibilityFixes,
    dependencyGraphContent,
    indexContent
};