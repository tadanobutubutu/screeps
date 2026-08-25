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
        svgTitle.id = 'svg-title-' + Math.random().toString(36).substring(2, 11);
    }
    if (!svgDesc.id) {
        svgDesc.id = 'svg-desc-' + Math.random().toString(36).substring(2, 11);
    }
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-labelledby', `${svgTitle.id} ${svgDesc.id}`);
}

// Enhanced function to handle SVG accessibility with fallback options
function enhanceSvgAccessibility() {
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
            newTitle.id = 'svg-title-' + Math.random().toString(36).substring(2, 11);
            svg.insertBefore(newTitle, svg.firstChild);

            // Create desc element if needed
            if (!svg.getAttribute('aria-label') && !svg.getAttribute('alt')) {
                const newDesc = document.createElement('desc');
                newDesc.textContent = 'Graphical element';
                newDesc.id = 'svg-desc-' + Math.random().toString(36).substring(2, 11);
                svg.appendChild(newDesc);
            }

            // Set accessibility attributes
            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-labelledby', newTitle.id + (newDesc ? ' ' + newDesc.id : ''));
        } else if (!title) {
            // Only title is missing
            const newTitle = document.createElement('title');
            newTitle.textContent = 'Icon';
            newTitle.id = 'svg-title-' + Math.random().toString(36).substring(2, 11);
            svg.insertBefore(newTitle, svg.firstChild);

            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-labelledby', newTitle.id + ' ' + (desc ? desc.id : ''));
        } else if (!desc) {
            // Only desc is missing
            const newDesc = document.createElement('desc');
            newDesc.textContent = svg.getAttribute('aria-label') || 'Graphical element';
            newDesc.id = 'svg-desc-' + Math.random().toString(36).substring(2, 11);
            svg.appendChild(newDesc);

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
function addMissingSvgAccessibleNames() {
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
            const cells = row.querySelectorAll('td, th');
            if (cells.length > 0) {
                // Check if this row should be in thead or tbody
                const hasHeaderCells = row.querySelector('th') !== null;
                if (hasHeaderCells && !hasThead) {
                    // This might be a header row that should be in thead
                    if (!row.closest('thead')) {
                        // Could move to thead, but that would complicate things
                        // Instead, just ensure proper scope
                        row.querySelectorAll('th').forEach(th => {
                            if (!th.hasAttribute('scope')) {
                                th.setAttribute('scope', 'col');
                            }
                        });
                    }
                }
            }
        });
    });
}

// Function to fix table constraints
function fixTableConstraints() {
    // Example implementation: Enforce at least one THEAD or headerRowCount rows in TABLEs
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        let hasThead = false;
        const headerRowCount = 1; // Modify this number if required

        const theads = table.querySelectorAll('thead');
        theads.forEach(thead => {
            if (thead.rows.length > 0) {
                hasThead = true;
            }
        });

        if (!hasThead && table.rows.length < headerRowCount) {
            console.error("Table does not have a thead or enough header rows:", table);
        }
        
        // Additional check: ensure all th elements have scope attribute
        const thElements = table.querySelectorAll('th');
        thElements.forEach(th => {
            if (!th.hasAttribute('scope')) {
                th.setAttribute('scope', 'col');
            }
        });
        
        // Ensure tables have captions for better accessibility
        if (!table.querySelector('caption')) {
            const caption = document.createElement('caption');
            caption.textContent = 'Data table';
            table.insertBefore(caption, table.firstChild);
        };
    });
}

// NEW CODE FOR TABLE ISSUES END

//------------ NEW AXES HELPERS FOR ACCESSIBILITY CHECKS ------------

// Function to get the lang attribute from the html element
function getLangAttribute() {
    const html = document.querySelector('html');
    if (html) {
        return html.getAttribute('lang');
    }
    return null;
}

// Function to get full lang attribute value (with fallback logic)
function getFullLangAttribute() {
    const lang = getLangAttribute();
    if (lang && lang.trim() !== '') {
        return lang;
    }
    // Fallback logic: could query meta tags or other sources if needed
    const meta = document.querySelector('meta[name="language"]');
    if (meta && meta.content) {
        return meta.content;
    }
    return 'en';
}

//------------ END OF NEW AXES HELPERS ------------

//------------- EXPORTS --------------

export {
    setHtmlLangAttribute,
    ensureLanguageAttribute,
    addSvgAccessibleNames,
    addAllSvgAccessibleNames,
    addMissingSvgAccessibleNames,
    enhanceSvgAccessibility,
    fixTableStructureIssues,
    fixTableConstraints,
    getLangAttribute,
    getFullLangAttribute
};

// Main entry point for the library
// Version: 1.0.0

const utils = require('./utils');
const helpers = require('./helpers');

// Existing implemented exports
function getVersion() {
  return '1.0.0';
}

function getConfig() {
  return {
    name: 'my-library',
    version: getVersion()
  };
}

function formatDate(date) {
  return utils.formatDate(date);
}

function validateInput(input) {
  return helpers.validate(input);
}

// TODO: Implement remaining exports
function calculateTotal(items) {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array');
  }
  return items.reduce((sum, item) => sum + (item.price || 0), 0);
}

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

function mergeObjects(target, source) {
  return { ...target, ...source };
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export all public functions
module.exports = {
  getVersion,
  getConfig,
  formatDate,
  validateInput,
  calculateTotal,
  generateId,
  mergeObjects,
  debounce
};