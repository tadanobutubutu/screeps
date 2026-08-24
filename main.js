import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// Assuming 'main.js' imports and uses the icons from the provided TypeScript files
const icons = {
  icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-label=%22Screeps%20Dashboard%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
};

// Implement function for addressing accessibility issues from insight report
function handleAccessibilityIssues(issues) {
    issues.forEach(issue => {
        switch (issue.type) {
            case 'lang':
                document.documentElement.lang = issue.value;
                break;
            case 'aria':
                // Add ARIA attributes as required
                if (issue.element) {
                    Object.entries(issue.attributes || {}).forEach(([attr, value]) => {
                        issue.element.setAttribute(attr, value);
                    });
                }
                break;
            case 'svg':
                // Add accessible names to 2 SVGs
                if (issue.element) {
                    const title = document.createElement('title');
                    title.textContent = issue.name || 'Accessible SVG';
                    issue.element.insertBefore(title, issue.element.firstChild);
                    issue.element.setAttribute('role', 'img');
                }
                break;
            case 'landmark':
                // Add/fix 4 landmark issues
                if (issue.element) {
                    if (issue.role) {
                        issue.element.setAttribute('role', issue.role);
                    }
                    if (issue.label) {
                        issue.element.setAttribute('aria-label', issue.label);
                    }
                }
                break;
            case 'unique-landmark':
                // Ensure unique landmarks (2 issues)
                if (issue.element && issue.uniqueRole) {
                    issue.element.setAttribute('role', issue.uniqueRole);
                    if (issue.label) {
                        issue.element.setAttribute('aria-label', issue.label);
                    }
                }
                break;
            case 'fake-link':
                // Fix 1 fake link issue
                if (issue.element) {
                    const href = issue.element.getAttribute('href');
                    if (href && !href.startsWith('#') && href !== '') {
                        // Valid link, ensure proper semantics
                        issue.element.setAttribute('role', 'link');
                    }
                }
                break;
            case 'scope':
                // Add scope attribute to th elements
                if (issue.element && issue.element.tagName === 'TH') {
                    issue.element.setAttribute('scope', issue.scope || 'col');
                }
                break;
            default:
                // Handle other accessibility changes based on the issue type
                if (issue.element && issue.attributes) {
                    Object.entries(issue.attributes || {}).forEach(([attr, value]) => {
                        issue.element.setAttribute(attr, value);
                    });
                }
        }
    });
}

// Implement table structure fix function
function fixTableAccessibility(tables) {
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const headers = row.querySelectorAll('th');
            const cells = row.querySelectorAll('td');

            headers.forEach((th) => {
                const isRowHeader = th.getAttribute('data-row-header') !== null;
                th.setAttribute('scope', isRowHeader ? 'row' : 'col');
                if (!th.id) {
                    const tableId = table.id || table.getAttribute('aria-label') || 'table-' + Math.random().toString(36).substr(2, 9);
                    const headerIndex = Array.from(headers).indexOf(th);
                    th.id = tableId + '-th-' + headerIndex;
                }
            });

            cells.forEach((td, index) => {
                const rowHeaders = Array.from(headers).filter(th => th.getAttribute('data-row-header') !== null);
                if (rowHeaders.length > index) {
                    td.setAttribute('headers', rowHeaders[index].id);
                }
            });
        });

        const caption = table.querySelector('caption');
        if (!caption && table.getAttribute('aria-label')) {
            const generatedCaption = document.createElement('caption');
            generatedCaption.textContent = table.getAttribute('aria-label');
            table.insertBefore(generatedCaption, table.firstChild);
        }
    });
}

// Implement landmark handling function
function ensureUniqueLandmarks(landmarkElements) {
    const usedRoles = new Map();

    landmarkElements.forEach(element => {
        const role = element.getAttribute('role') || element.tagName.toLowerCase();
        const existingCount = usedRoles.get(role) || 0;
        usedRoles.set(role, existingCount + 1);

        if (existingCount > 0) {
            if (!element.getAttribute('aria-label')) {
                const label = element.getAttribute('aria-labelledby') || `${role} ${existingCount + 1}`;
                element.setAttribute('aria-label', label);
            }

            if (!usedRoles.has(role + '-unique')) {
                element.setAttribute('role', role);
                usedRoles.set(role + '-unique', true);
            }
        } else {
            if (['nav', 'main', 'header', 'footer', 'aside'].includes(role)) {
                element.setAttribute('role', role === 'nav' ? 'navigation' : role);
            }
        }
    });
}

// Implement wrapPrimaryContentInMain function (fixed)
function wrapPrimaryContentInMain() {
    const existingMain = document.querySelector('main');
    if (existingMain) {
        return existingMain;
    }

    const body = document.body;
    const main = document.createElement('main');
    
    while (body.firstChild) {
        main.appendChild(body.firstChild);
    }
    
    body.appendChild(main);
    return main;
}

// Call the function to ensure the page has a <main> landmark
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.body) {
                wrapPrimaryContentInMain();
            }
        });
    } else if (document.body) {
        wrapPrimaryContentInMain();
    }
}

// Helper function to get lang attribute
function getLangAttribute() {
    return document.documentElement.lang;
}

// Helper function to get full lang attribute with region
function getFullLangAttribute() {
    return document.documentElement.lang;
}

// Validate table accessibility
function validateTableAccessibility(table) {
    const errors = [];
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const headers = row.querySelectorAll('th');
        headers.forEach(th => {
            if (!th.getAttribute('scope')) {
                errors.push('Header missing scope attribute');
            }
        });
    });
    
    return errors;
}

// Validate table structure
function validateTableStructure(table) {
    const issues = [];
    
    if (!table.querySelector('caption') && !table.getAttribute('aria-label')) {
        issues.push('Table missing caption or aria-label');
    }
    
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
        if (!th.id) {
            issues.push('Header missing id attribute');
        }
    });
    
    return issues;
}

// Function to render dependency graph using imported content
function renderDependencyGraph(container) {
    if (container && dependencyGraphContent) {
        container.innerHTML = dependencyGraphContent;
    }
}

// Function to render index view using imported content
function renderIndexView(container) {
    if (container && indexContent) {
        container.innerHTML = indexContent;
    }
}

// Exporting functions as required (do not remove or rename any existing exports)
export function someExistingFunction() {
    // ... (existing function code)
}

export function anotherExistingFunction() {
    // ... (existing function code)
}

// Export new accessibility functions and icons
export {
    handleAccessibilityIssues,
    fixTableAccessibility,
    ensureUniqueLandmarks,
    wrapPrimaryContentInMain,
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    renderDependencyGraph,
    renderIndexView,
    icons
};