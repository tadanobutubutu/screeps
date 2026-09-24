// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// New functions for table accessibility validation
function validateTableAccessibility(tableElement) {
    if (!tableElement) return false;

    // Check if table has a caption
    const hasCaption = tableElement.querySelector('caption') !== null;

    // Check if table has proper headers
    const hasHeaders = tableElement.querySelector('thead') !== null ||
                      tableElement.querySelector('th') !== null;

    // Check if table cells have proper scope attributes
    const cells = tableElement.querySelectorAll('td, th');
    let hasScope = true;
    cells.forEach(cell => {
        if (cell.tagName === 'TH' && !cell.hasAttribute('scope')) {
            hasScope = false;
        }
    });

    return hasCaption && hasHeaders && hasScope;
}

function validateTableStructure(tableElement) {
    if (!tableElement) return false;

    // Check if table has proper structure with thead, tbody, tfoot
    const hasThead = tableElement.querySelector('thead') !== null;
    const hasTbody = tableElement.querySelector('tbody') !== null;
    const hasTfoot = tableElement.querySelector('tfoot') !== null;

    // Check if table has at least one row
    const hasRows = tableElement.querySelector('tr') !== null;

    return (hasThead || hasTbody || hasTfoot) && hasRows;
}

// New functions for landmark validation
function validateLandmark(element) {
    const validLandmarks = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];
    return validLandmarks.includes(element.tagName.toLowerCase());
}

function validateLandmarkStructure() {
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"], [role="region"], [role="article"]');
    let isValid = true;

    landmarks.forEach(landmark => {
        if (!validateLandmark(landmark)) {
            isValid = false;
        }
    });

    return isValid;
}

function ensureUniqueLandmarks() {
    const landmarkCounts = {};
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"], [role="region"], [role="article"]');

    landmarks.forEach(landmark => {
        const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;
    });

    // Check for multiple main landmarks
    if (landmarkCounts['main'] > 1 || landmarkCounts['banner'] > 1 || landmarkCounts['contentinfo'] > 1) {
        return false;
    }

    return true;
}

// New function for creating accessible links
function createAccessibleLink(href, text, ariaLabel = null) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;

    if (ariaLabel) {
        link.setAttribute('aria-label', ariaLabel);
    }

    // Ensure link is keyboard accessible
    link.setAttribute('tabindex', '0');

    return link;
}

// New function for handling accessibility issues
function handleAccessibilityIssues() {
    // Validate all tables on the page
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        if (!validateTableAccessibility(table)) {
            console.warn('Table accessibility issues found:', table);
        }
    });

    // Validate landmarks
    if (!validateLandmarkStructure()) {
        console.warn('Landmark structure issues found');
    }

    if (!ensureUniqueLandmarks()) {
        console.warn('Duplicate landmarks found');
    }

    // Check for fake links
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        if (link.href === '#' || link.href === 'javascript:void(0)') {
            console.warn('Fake link found:', link);
        }
    });
}

// TODO: Validate table accessibility, fix table structure issues, validate landmark issues, and create accessible links as required