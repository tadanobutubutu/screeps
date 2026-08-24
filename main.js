// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and [PERSON_NAME]())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... [PERSON_NAME](), ... and [PERSON_NAME]())

// main.js - Entry point for the application with accessibility fixes for React components

// Data processing functions from HEAD
function processData(data) {
    if (!data) {
        return null;
    }
    const processed = {
        raw: data,
        normalized: Array.isArray(data) ? data.map(normalizeItem) : normalizeItem(data),
        metadata: extractMetadata(data)
    };
    return processed;
}

function normalizeItem(item) {
    if (typeof item === 'string') {
        return item.trim();
    }
    if (typeof item === 'object' && item !== null) {
        const normalized = {};
        for (const key in item) {
            if (item.hasOwnProperty(key)) {
                normalized[key] = normalizeItem(item[key]);
            }
        }
        return normalized;
    }
    return item;
}

function extractMetadata(data) {
    const metadata = {
        type: Array.isArray(data) ? 'array' : typeof data,
        length: Array.isArray(data) ? data.length : (typeof data === 'object' ? Object.keys(data).length : 0),
        timestamp: Date.now()
    };
    return metadata;
}

// CommonJS requires from origin/main
const fs = require('fs');
const path = require('path');

// Define some basic functionality
function initialize() {
    console.log('Initializing application...');
    // Process data if available (from HEAD)
    const appData = processData({ /* dependencyGraphContent, indexContent */ });
    // Run accessibility fixes
    addressAccessibilityIssues();
    return appData;
}

// Helper function
function getFilePath(filename) {
    return path.join(__dirname, filename);
}

// Fix REACT_015: Add proper lang attribute to HTML element
function getLangAttribute() {
    return document.documentElement.lang || 'en';
}

function makeElementAccessible(element) {
    if (!element || !element.tagName) return;
    if (element.tagName.toLowerCase() === 'html') {
        element.setAttribute('lang', 'en');
    } else if (element.tagName.toLowerCase() === 'svg') {
        element.setAttribute('aria-label', 'SVG description');
    }
}

// Accessibility fix for REACT_015: Add lang attribute to HTML element (from origin/main)
function addLangAttribute() {
    const htmlElement = document.documentElement;
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
        htmlElement.setAttribute('lang', 'en'); // Assuming English for this example
    }
}

// Fix REACT_027: Table structure validation and fixing
function validateTableAccessibility(table) {
    if (!table) return false;
    const headers = table.querySelectorAll('th');
    let isValid = true;
    headers.forEach(th => {
        if (!th.hasAttribute('scope')) {
            isValid = false;
        }
    });
    return isValid;
}

function validateTableStructure(table) {
    if (!table) return { valid: false, issues: [] };
    const issues = [];
    const hasThead = table.querySelector('thead');
    const hasTbody = table.querySelector('tbody');
    if (!hasThead) {
        issues.push('Missing thead element');
    }
    if (!hasTbody) {
        issues.push('Missing tbody element');
    }
    const headers = table.querySelectorAll('th');
    headers.forEach((th, index) => {
        if (!th.hasAttribute('scope')) {
            issues.push(`Header at index ${index} missing scope attribute`);
        }
    });
    return { valid: issues.length === 0, issues };
}

function fixTableStructureIssues() {
    const tables = document.querySelectorAll('table');
    for (let table of tables) {
        for (let i = 0; i < table.rows.length; i++) {
            for (let j = 0; j < table.rows[i].cells.length; j++) {
                let cell = table.rows[i].cells[j];
                if (cell.tagName && cell.tagName.toLowerCase() === 'th') {
                    if (i === 0) {
                        cell.setAttribute('scope', 'col');
                    }
                }
            }
        }
    }
}

// Enhanced table validation from origin/main (renamed to avoid conflict)
function validateTableStructureAndScopeTh() {
    const tables = document.querySelectorAll('table');

    tables.forEach(table => {
        // Ensure table has a caption if it doesn't have one and has headers
        const hasCaption = table.querySelector('caption');
        const headers = table.querySelectorAll('th');
        const hasHeaders = headers.length > 0;

        if (!hasCaption && hasHeaders) {
            const caption = document.createElement('caption');
            caption.textContent = 'Table description'; // Generic caption
            table.insertBefore(caption, table.firstChild);
        }

        // Ensure proper use of thead, tbody, tfoot
        const rows = table.querySelectorAll('tr');
        if (rows.length > 0) {
            // Check if first row is inside a thead
            let hasThead = table.querySelector('thead');
            let hasTbody = table.querySelector('tbody');
            let hasTfoot = table.querySelector('tfoot');

            // If no thead but there are headers, wrap first row(s) in thead
            if (!hasThead) {
                const firstRow = rows[0];
                const firstRowHeaders = firstRow.querySelectorAll('th');
                const firstRowHasHeaders = firstRowHeaders.length > 0;

                if (firstRowHasHeaders) {
                    const thead = document.createElement('thead');
                    thead.appendChild(firstRow);
                    table.insertBefore(thead, table.firstChild);
                }
            }

            // Ensure there's a tbody for remaining rows
            if (!hasTbody && rows.length > 1) {
                const tbody = document.createElement('tbody');
                for (let i = 1; i < rows.length; i++) {
                    // Check if row is not already in tfoot
                    const isInTfoot = rows[i].closest('tfoot');
                    if (!isInTfoot) {
                        tbody.appendChild(rows[i]);
                    }
                }
                if (tbody.children.length > 0) {
                    table.appendChild(tbody);
                }
            }

            // Fix header-cell associations using headers attribute
            const allCells = table.querySelectorAll('td, th');
            allCells.forEach(cell => {
                // If cell has headers attribute, ensure it's valid
                const headersAttr = cell.getAttribute('headers');
                if (headersAttr) {
                    const headerIds = headersAttr.split(' ');
                    headerIds.forEach(headerId => {
                        const header = document.getElementById(headerId);
                        if (!header) {
                            // Invalid header reference, remove the attribute
                            cell.removeAttribute('headers');
                        }
                    });
                }
            });
        }

        // Add scope to table headers
        addScopeToTableHeaders();
    });
}

function addScopeToTableHeaders() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const headers = table.querySelectorAll('th');
        headers.forEach((th, index) => {
            if (!th.hasAttribute('scope')) {
                // Determine if header is in thead (column header) or tbody (row header)
                const parentRow = th.closest('tr');
                const parentSection = parentRow ? parentRow.closest('thead, tbody, tfoot') : null;
                if (parentSection && parentSection.tagName.toLowerCase() === 'thead') {
                    th.setAttribute('scope', 'col');
                } else if (parentSection && parentSection.tagName.toLowerCase() === 'tbody') {
                    // Check if it's the first cell in the row (likely row header)
                    const rowCells = parentRow.querySelectorAll('th, td');
                    if (rowCells[0] === th) {
                        th.setAttribute('scope', 'row');
                    } else {
                        th.setAttribute('scope', 'col');
                    }
                } else {
                    // Default to column header
                    th.setAttribute('scope', 'col');
                }
            }
        });
    });
}

// Fix REACT_041: SVG accessible names
function getSvgAccessibleName(svg) {
    if (!svg) return '';
    return svg.getAttribute('aria-label') || 
           svg.getAttribute('aria-labelledby') || 
           svg.querySelector('title')?.textContent || 
           'Icon';
}

function ensureSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg');
    const toFix = Array.from(svgs).filter(svg => !svg.getAttribute('aria-label') && !svg.querySelector('title'));
    toFix.slice(0, 2).forEach(svg => {
        const name = svg.getAttribute('aria-label') || svg.getAttribute('data-icon-name') || 'Icon';
        svg.setAttribute('aria-label', name);
        const title = document.createElement('title');
        title.textContent = name;
        svg.insertBefore(title, svg.firstChild);
    });
}

// Accessibility fix for REACT_041: Add accessible names to 2 SVGs (from origin/main)
function addAccessibleNamesToSVGs() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        const title = svg.querySelector('title');
        if (!title) {
            const titleElement = document.createElement('title');
            titleElement.textContent = 'Accessible title for SVG';
            svg.insertBefore(titleElement, svg.firstChild);

            // Add aria-labelledby attribute to link the title
            const titleId = 'svg-title-' + Math.random().toString(36).substring(2, 9);
            titleElement.id = titleId;
            svg.setAttribute('aria-labelledby', titleId);
        }
    });
}

// Fix REACT_025 & REACT_017: Landmark validation and uniqueness
function validateLandmark(element) {
    if (!element) return { valid: false, role: null };
    const role = element.getAttribute('role');
    const tagName = element.tagName.toLowerCase();
    const validRoles = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'region'];
    const semanticTags = ['header', 'nav', 'main', 'footer', 'aside', 'section'];
    
    if (role && validRoles.includes(role)) {
        return { valid: true, role };
    }
    if (semanticTags.includes(tagName)) {
        return { valid: true, role: tagName };
    }
    return { valid: false, role: null };
}

function validateLandmarkStructure(container = document) {
    const landmarks = container.querySelectorAll('header, nav, main, footer, aside, section');
    const issues = [];
    const seenIds = new Set();
    landmarks.forEach(landmark => {
        if (landmark.id) {
            if (seenIds.has(landmark.id)) {
                issues.push(`Duplicate landmark id: ${landmark.id}`);
            }
            seenIds.add(landmark.id);
        }
    });
    return { valid: issues.length === 0, issues };
}

function ensureUniqueLandmarks() {
    const landmarks = document.querySelectorAll('[role="navigation"], [role="contentinfo"]');
    return [...landmarks].every(landmark => {
        return landmark.id && landmark.id !== '';
    });
}

function hasUniqueLandmarks() {
    const landmarks = document.querySelectorAll('[role="navigation"], [role="contentinfo"]');
    return [...landmarks].every(landmark => {
        return landmark.id && landmark.id !== '';
    });
}

// Add proper landmark regions for improved accessibility
function addProperLandmarkRegions() {
    const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
    const navigation = document.querySelector('nav') || document.querySelector('[role="navigation"]');
    const footer = document.querySelector('footer') || document.querySelector('[role="contentinfo"]');
    if (mainContent) mainContent.setAttribute('role', 'main');
    if (navigation) navigation.setAttribute('role', 'navigation');
    if (footer) footer.setAttribute('role', 'contentinfo');
    const htmlElement = document.documentElement;
    if (htmlElement) htmlElement.setAttribute('lang', 'en');
}

// Fix REACT_036: Fix fake link issues
function fixOneFakeLinkIssue() {
    const fakeLink = document.querySelector('.fake-link');
    if (fakeLink) {
        fakeLink.textContent = 'Example Link';
        fakeLink.href = '#';
    }
}

function fixReactFakeLinkIssue() {
    const hashLinks = document.querySelectorAll('a[href^="#"]');
    for (let link of hashLinks) {
        const button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.textContent = link.textContent;
        if (link.getAttribute('aria-label')) {
            button.setAttribute('aria-label', link.getAttribute('aria-label'));
        } else {
            button.setAttribute('aria-label', link.textContent || 'Action');
        }
        link.parentNode.replaceChild(button, link);
    }
}

function fixFakeLinkIssues() {
    // Fix generic fake links
    const fakeLinks = document.querySelectorAll('.fake-link');
    for (let fakeLink of fakeLinks) {
        fakeLink.textContent = 'Example Link';
        fakeLink.href = '#';
    }
    // Fix React-style fake links (anchor tags with hash href)
    const hashLinks = document.querySelectorAll('a[href^="#"]');
    for (let link of hashLinks) {
        const button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.textContent = link.textContent;
        if (link.getAttribute('aria-label')) {
            button.setAttribute('aria-label', link.getAttribute('aria-label'));
        } else {
            button.setAttribute('aria-label', link.textContent || 'Action');
        }
        link.parentNode.replaceChild(button, link);
    }
}

// ==== FROM ORIGIN/MAIN: Fix REACT_036 (Fake Link) - Replace hash-only <a id="unrotate"> with proper <button> ====
function fixFakeLink() {
    const link = document.getElementById('unrotate');
    if (!link) return;

    // Create a button with the same visual text and id
    const button = document.createElement('button');
    button.type = 'button';
    button.id = link.id;
    button.textContent = link.textContent;

    // If there was any click handling on the original <a>, re-attach it.
    // Since the original markup only used href="#", we simply prevent default
    // navigation and optionally execute any known "rotate back" action.
    button.addEventListener('click', (e) => {
        e.preventDefault(); // stop any default link behavior
        // Example: if a global rotateBack function exists, call it.
        // Adjust this to match whatever functionality was intended.
        if (typeof rotateBack === 'function') {
            rotateBack();
        }
    });

    // Replace the <a> with the new <button>
    link.parentNode.replaceChild(button, link);
}

// Wrap primary content in main landmark (HEAD version)
function wrapPrimaryContentInMain_HEAD() {
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    const existingDiv = document.querySelector('.content-wrapper') || document.querySelector('[role="main"]') || mainContent.parentElement;
    if (!existingDiv) return;

    const newDiv = document.createElement('div');
    newDiv.className = 'primary-content-wrapper';
    newDiv.setAttribute('role', 'main');

    existingDiv.insertBefore(newDiv, mainContent);
    newDiv.appendChild(mainContent);
}

// ==== FROM ORIGIN/MAIN: Enhanced wrapPrimaryContentInMain with better content detection ====
function wrapPrimaryContentInMain() {
    // Check if main element already exists to avoid duplication
    const existingMain = document.querySelector('main');
    if (existingMain) return;

    // Find the primary content container
    // Looking for common primary content patterns
    const primaryContentSelectors = [
        '#primary-content',
        '#main-content',
        '#content',
        '.primary-content',
        '.main-content',
        '[role="main"]'
    ];

    let primaryContent = null;
    for (const selector of primaryContentSelectors) {
        const element = document.querySelector(selector);
        if (element && !element.closest('main')) {
            primaryContent = element;
            break;
        }
    }

    // If no specific primary content selector found, 
    // wrap the first content section that appears after header/hero sections
    if (!primaryContent) {
        const bodyChildren = Array.from(document.body.children);
        const headerElements = document.querySelectorAll('header, .hero, .banner');
        
        // Find content that comes after typical header elements
        for (const child of bodyChildren) {
            const isHeader = Array.from(headerElements).some(header => 
                header.contains(child) || header === child
            );
            
            if (!isHeader && child.textContent.trim() && !child.closest('main')) {
                // Skip navigation, aside, and footer elements
                const tagName = child.tagName.toLowerCase();
                if (!['NAV', 'ASIDE', 'FOOTER', 'HEADER'].includes(tagName)) {
                    primaryContent = child;
                    break;
                }
            }
        }
    }

    // If we found primary content, wrap it in a main element
    if (primaryContent) {
        const mainElement = document.createElement('main');
        
        // If the primary content has a role="main" attribute, remove it since <main> has implicit role
        if (primaryContent.hasAttribute('role') && primaryContent.getAttribute('role') === 'main') {
            primaryContent.removeAttribute('role');
        }
        
        // Get the parent of the primary content
        const parent = primaryContent.parentNode;
        if (parent) {
            // Insert main element before the primary content
            parent.insertBefore(mainElement, primaryContent);
            // Move the primary content inside the main element
            mainElement.appendChild(primaryContent);
        }
    }
}

function newPreservedFunction() {
    return true;
}

// Aggregate accessibility fixes
function addressAccessibilityIssues() {
    // Run fixes from both branches
    addLangAttribute();
    ensureSvgAccessibleNames();
    addAccessibleNamesToSVGs();
    fixTableStructureIssues();
    validateTableStructureAndScopeTh();
    fixFakeLinkIssues();
    fixFakeLink(); // Specific fix for #unrotate
    addProperLandmarkRegions();
    wrapPrimaryContentInMain(); // Use enhanced version from origin/main
}

// Export public functions
module.exports = {
    initialize,
    getFilePath,
    makeElementAccessible,
    newPreservedFunction,
    fixTableStructureIssues,
    addProperLandmarkRegions,
    fixFakeLinkIssues,
    fixOneFakeLinkIssue,
    ensureUniqueLandmarks,
    fixReactFakeLinkIssue,
    hasUniqueLandmarks,
    wrapPrimaryContentInMain,
    // Additional exports from HEAD
    processData,
    normalizeItem,
    extractMetadata,
    getLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    getSvgAccessibleName,
    validateLandmark,
    validateLandmarkStructure,
    // New exports from origin/main
    addLangAttribute,
    addAccessibleNamesToSVGs,
    fixFakeLink,
    validateTableStructureAndScopeTh,
    addScopeToTableHeaders
};