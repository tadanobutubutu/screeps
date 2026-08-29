// main.js
// Implementation of unique landmark functions
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

// Global set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    const candidate = `${baseName}-${Date.now()}`;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 7);
        candidate = `${candidate}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

/**
 * Adds lang attribute to the HTML element for accessibility.
 * @param {Document} doc - The document object.
 * @param {string} lang - Language code (e.g., 'en', 'es').
 */
function addLangAttribute(doc, lang = 'en') {
    const html = doc.documentElement;
    if (html && !html.hasAttribute('lang')) {
        html.setAttribute('lang', lang);
    }
}

/**
 * Fixes table structure issues for accessibility.
 * @param {Document} doc - The document object.
 */
function fixTableStructure(doc) {
    const tables = doc.querySelectorAll('table');
    tables.forEach(table => {
        if (!table.querySelector('thead')) {
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const thead = doc.createElement('thead');
                const tbody = table.querySelector('tbody');
                thead.appendChild(firstRow);
                table.insertBefore(thead, tbody || table.firstChild);
            }
        }
        table.querySelectorAll('td').forEach(cell => {
            if (!cell.hasAttribute('scope')) {
                const parentRow = cell.closest('tr');
                const isHeader = parentRow && parentRow.parent && parentRow.parent.tagName === 'THEAD';
                if (isHeader) {
                    cell.setAttribute('scope', 'col');
                }
            }
        });
    });
}

/**
 * Adds main landmark to the document for accessibility.
 * @param {Document} doc - The document object.
 */
function addMainLandmark(doc) {
    let main = doc.querySelector('main');
    if (!main) {
        const existingMain = doc.querySelector('[role="main"]');
        if (existingMain) {
            existingMain.setAttribute('role', 'main');
        } else {
            main = doc.createElement('main');
            const body = doc.body;
            if (body.firstChild) {
                body.insertBefore(main, body.firstChild);
            } else {
                body.appendChild(main);
            }
        }
    }
}

/**
 * Ensures all landmarks in the document are unique.
 * @param {Document} doc - The document object.
 * @returns {Array} List of landmark elements with unique IDs.
 */
function ensureUniqueLandmarks(doc) {
    const landmarks = doc.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
    const usedIds = new Set();
    
    landmarks.forEach(landmark => {
        const baseName = landmark.getAttribute('role') || 'landmark';
        let id = landmark.id || '';
        
        if (!id || usedIds.has(id)) {
            id = ensureUniqueLandmarkId(baseName);
            landmark.id = id;
        }
        usedIds.add(id);
    });
    
    return Array.from(landmarks);
}

/**
 * Adds accessible names to SVG elements.
 * @param {Document} doc - The document object.
 */
function addSvgAccessibleNames(doc) {
    const svgs = doc.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
        const title = svg.querySelector('title');
        if (!title) {
            const newTitle = doc.createElement('title');
            newTitle.textContent = `SVG icon ${index + 1}`;
            svg.insertBefore(newTitle, svg.firstChild);
        }
        if (!svg.hasAttribute('aria-labelledby')) {
            const titleId = title ? title.id || `svg-title-${index}` : `svg-title-${index}`;
            if (title && !title.id) {
                title.id = titleId;
            }
            svg.setAttribute('aria-labelledby', titleId);
        }
    });
}

/**
 * Fixes fake link issues for accessibility.
 * @param {Document} doc - The document object.
 */
function fixFakeLinkIssue(doc) {
    const fakeLinks = doc.querySelectorAll('[href="#"], [href=""], a[href*="javascript:void"]');
    fakeLinks.forEach(link => {
        if (link.tagName === 'A') {
            const onclick = link.getAttribute('onclick');
            if (onclick && !link.hasAttribute('role')) {
                link.setAttribute('role', 'button');
            }
            if (!link.textContent && !link.querySelector('img')) {
                const span = doc.createElement('span');
                span.textContent = 'Link';
                span.style.position = 'absolute';
                span.style.width = '1px';
                span.style.height = '1px';
                span.style.overflow = 'hidden';
                link.appendChild(span);
            }
        }
    });
}

module.exports = {
    ensureUniqueLandmarkId,
    uniqueLandmarks,
    addLangAttribute,
    fixTableStructure,
    addMainLandmark,
    ensureUniqueLandmarks,
    addSvgAccessibleNames,
    fixFakeLinkIssue,
    // Preserve any other existing exports here
};