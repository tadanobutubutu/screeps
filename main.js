// Function to add landmark roles and fix landmark issues
function addLandmarks() {
    // Add lang attribute to HTML
    const html = document.documentElement;
    html.setAttribute('lang', 'en'); // or your language code

    const header = document.querySelector('header');
    if (header) {
        header.setAttribute('role', 'banner');
    }

    const nav = document.querySelector('nav');
    if (nav) {
        nav.setAttribute('role', 'navigation');
    }

    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.setAttribute('role', 'main');
    }

    const footer = document.querySelector('footer');
    if (footer) {
        footer.setAttribute('role', 'contentinfo');
    }

    // Find the elements with the classes corresponding to the roles you want to add
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.setAttribute('role', 'search');
    }

    const loginLink = document.querySelector('.login-link');
    if (loginLink) {
        loginLink.setAttribute('role', 'link');
    }

    // Add accessible names to the SVGs
    const logoSvg = document.querySelector('.logo svg');
    if (logoSvg && !logoSvg.getAttribute('aria-label') && !logoSvg.querySelector('title')) {
        logoSvg.setAttribute('aria-label', 'Site Logo');
    }

    const iconSvg1 = document.querySelector('.icon-1 svg');
    if (iconSvg1 && !iconSvg1.getAttribute('aria-label') && !iconSvg1.querySelector('title')) {
        iconSvg1.setAttribute('aria-label', 'Icon 1');
    }

    // Ensure unique landmarks - include all landmark roles
    const landmarkRoles = [
        { role: 'banner', label: 'Site Header' },
        { role: 'navigation', label: 'Main Navigation' },
        { role: 'main', label: 'Main Content' },
        { role: 'contentinfo', label: 'Site Footer' },
        { role: 'search', label: 'Site Search' }
    ];

    landmarkRoles.forEach((landmark, index) => {
        const element = document.querySelector(`[role="${landmark.role}"]`);
        if (element) {
            const uniqueId = `landmark-${landmark.role}-${index}`;
            element.setAttribute('aria-labelledby', uniqueId);

            const existingLabel = element.querySelector(`#${uniqueId}`);
            if (!existingLabel) {
                const label = document.createElement('span');
                label.id = uniqueId;
                label.textContent = landmark.label;
                label.style.display = 'none';
                element.insertBefore(label, element.firstChild);
            }
        }
    });

    // Ensure login link has accessible name if it's just an icon
    if (loginLink && !loginLink.textContent.trim() && !loginLink.getAttribute('aria-label')) {
        loginLink.setAttribute('aria-label', 'Login');
    }

    // Fix 26 table structure issues
    // Add proper table headers
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(thead.rows);

        if (rows.length > 0) {
            rows.forEach((rowHeader, indexHeader) => {
                const columnCells = Array.from(rowHeader.children);
                const columnHeaders = [];

                tbody.querySelectorAll('tr th, tr td').forEach((cell) => {
                    if (!columnHeaders.includes(cell)) {
                        columnHeaders.push(cell);
                    }
                });

                if (columnHeaders.length > indexHeader) {
                    columnCells.forEach((headerCell) => {
                        headerCell.setAttribute('id', `header-${columnHeaders[indexHeader].textContent.toLowerCase().replace(/\s/g, '-')}`);
                        headerCell.setAttribute('scope', 'col');
                    });
                }
            });
        }
    });

    // Fix 1 fake link issue
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach((link) => {
        if (!link.href) {
            link.removeAttribute('href');
            link.setAttribute('role', 'button');
        }
    });
}

/**
 * Adds landmark roles and fixes landmark issues
 * @returns {void}
 */
function addLandmarksForTables() {
    // Fix table structure issues by ensuring proper header elements
    const tables = document.querySelectorAll('table');
    
    tables.forEach((table) => {
        // Get all header cells from thead or first row of tbody
        const headerCells = Array.from(table.querySelectorAll('th, td'));
        
        if (headerCells.length === 0) return;
        
        // Create unique IDs for each column based on header text
        const columnIds = [];
        headerCells.forEach((cell, index) => {
            const id = `table-column-${index}`;
            cell.setAttribute('data-col-id', id);
            columnIds.push(id);
        });
        
        // Set scope for each column header
        table.querySelectorAll('th, td').forEach((cell, index) => {
            if (columnIds[index]) {
                cell.setAttribute('scope', 'col');
            }
        });
    });
}

// Preserve existing default export but also expose required exports
const exportsObj = {
    icons,
    checkDependencyStatus,
    getDependencyAlerts,
    addLandmarks,
    addLandmarksForTables, // New function to fix table structure issues
    myFunction
};

export default exportsObj;