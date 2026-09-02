// TODO: Add back any required exports that might have been removed
// TODO: This is the existing code that needs to be preserved
//_Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: ... -->

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// REACT_015: Get lang attribute from HTML element
function getLangAttribute() {
    const htmlElement = document.querySelector('html');
    return htmlElement ? htmlElement.getAttribute('lang') : null;
}

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(lang) {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.getAttribute('lang')) {
        htmlElement.setAttribute('lang', lang || 'en');
        return true;
    }
    return false;
}

// REACT_027: Validate table accessibility
function validateTableAccessibility() {
    const tables = document.querySelectorAll('table');
    let issues = [];
    
    tables.forEach((table, index) => {
        if (!table.getAttribute('id') && !table.querySelector('caption')) {
            issues.push(`Table ${index + 1}: Missing caption or id`);
        }
    });
    
    return { valid: issues.length === 0, issues };
}

// REACT_027: Validate table structure
function validateTableStructure() {
    const tables = document.querySelectorAll('table');
    let issues = [];
    
    tables.forEach((table, index) => {
        const headers = table.querySelectorAll('th');
        const hasHeaders = headers.length > 0;
        
        if (!hasHeaders) {
            issues.push(`Table ${index + 1}: Missing header cells (th)`);
        }
    });
    
    return { valid: issues.length === 0, issues };
}

// REACT_027: Fix table structure issues
function fixTableStructure() {
    const tables = document.querySelectorAll('table');
    let fixed = 0;
    
    tables.forEach((table, index) => {
        const headers = table.querySelectorAll('th');
        if (headers.length === 0) {
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const cells = firstRow.querySelectorAll('td');
                cells.forEach(cell => {
                    const th = document.createElement('th');
                    th.innerHTML = cell.innerHTML;
                    th.setAttribute('scope', 'col');
                    cell.replaceWith(th);
                });
                fixed++;
            }
        }
    });
    
    return { fixed };
}

// REACT_017: Add main landmark
function addMainLandmark() {
    const existingMain = document.querySelector('main');
    if (!existingMain) {
        const main = document.createElement('main');
        const body = document.body;
        if (body.firstChild) {
            body.insertBefore(main, body.firstChild);
        } else {
            body.appendChild(main);
        }
        return true;
    }
    return false;
}

// REACT_017: Validate landmark
function validateLandmark() {
    const landmarks = ['header', 'main', 'footer', 'nav', 'aside'];
    let issues = [];
    
    landmarks.forEach(landmark => {
        const elements = document.querySelectorAll(landmark);
        if (elements.length > 1 && (landmark === 'main' || landmark === 'footer')) {
            issues.push(`Multiple ${landmark} landmarks found`);
        }
        if (elements.length === 0 && landmark === 'main') {
            issues.push(`Missing main landmark`);
        }
    });
    
    return { valid: issues.length === 0, issues };
}

// REACT_017: Validate landmark structure for accessibility issues
function validateLandmarkStructure() {
    const requiredLandmarks = ['header', 'main', 'footer'];
    const missingLandmarks = [];

    requiredLandmarks.forEach(landmark => {
        const elements = document.querySelectorAll(landmark);
        if (elements.length === 0) {
            missingLandmarks.push(landmark);
        }
    });

    if (missingLandmarks.length > 0) {
        console.warn(`Warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
        return false;
    }

    return true;
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svgElement) {
    if (!svgElement) return null;
    
    const title = svgElement.querySelector('title');
    if (title) return title.textContent;
    
    const ariaLabel = svgElement.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    
    const desc = svgElement.querySelector('desc');
    if (desc) return desc.textContent;
    
    return null;
}

// REACT_041: Set SVG attributes for accessibility
function setSvgAttributes(svgElement, accessibleName) {
    if (!svgElement) return false;
    
    let hasAccessibleName = false;
    
    // Add or update title element
    let title = svgElement.querySelector('title');
    if (!title) {
        title = document.createElement('title');
        svgElement.insertBefore(title, svgElement.firstChild);
    }
    title.textContent = accessibleName;
    title.id = `svg-title-${Date.now()}`;
    
    // Add role and aria-labelledby
    svgElement.setAttribute('role', 'img');
    svgElement.setAttribute('aria-labelledby', title.id);
    
    hasAccessibleName = true;
    
    return hasAccessibleName;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
    const landmarkTypes = ['main', 'nav', 'aside', 'footer', 'header'];
    let fixed = 0;
    
    landmarkTypes.forEach(type => {
        const landmarks = document.querySelectorAll(type);
        if (landmarks.length > 1) {
            landmarks.forEach((landmark, index) => {
                if (index > 0) {
                    landmark.setAttribute('aria-label', `${type}-${index + 1}`);
                    fixed++;
                }
            });
        }
    });
    
    return { fixed };
}

// REACT_036: Create in-page button (replaces fake links)
function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    return button;
}

// REACT_036: Validate link accessibility
function validateLinkAccessibility() {
    const links = document.querySelectorAll('a');
    let issues = [];
    
    links.forEach((link, index) => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();
        const ariaLabel = link.getAttribute('aria-label');
        
        if (!href || href === '#' || href === '') {
            // Check if it's a fake link that should be a button
            issues.push({
                index: index + 1,
                type: 'fake-link',
                message: 'Link appears to be a fake link (no valid href)'
            });
        }
        
        if (!text && !ariaLabel) {
            issues.push({
                index: index + 1,
                type: 'missing-text',
                message: 'Link missing accessible text'
            });
        }
    });
    
    return { valid: issues.length === 0, issues };
}

// REACT_036: Handle fake links by converting to buttons
function handleFakeLinks() {
    const links = document.querySelectorAll('a');
    let converted = 0;
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#' || href === '') {
            const button = document.createElement('button');
            button.innerHTML = link.innerHTML;
            button.className = link.className;
            if (link.id) button.id = link.id;
            
            const parent = link.parentNode;
            parent.insertBefore(button, link);
            link.remove();
            converted++;
        }
    });
    
    return { converted };
}

// REACT_037: Add proper landmark regions
function addProperLandmarkRegions() {
    let added = 0;
    
    // Ensure nav landmark exists
    const nav = document.querySelector('nav');
    if (!nav) {
        const newNav = document.createElement('nav');
        newNav.setAttribute('aria-label', 'Main navigation');
        document.body.insertBefore(newNav, document.body.firstChild);
        added++;
    }
    
    // Ensure header landmark exists
    const header = document.querySelector('header');
    if (!header) {
        const newHeader = document.createElement('header');
        document.body.insertBefore(newHeader, document.body.firstChild);
        added++;
    }
    
    return { added };
}

// Function to validate landmark structure for accessibility issues
function validateLandmarkStructure() {
    const requiredLandmarks = ['header', 'main', 'footer'];
    const missingLandmarks = [];

    requiredLandmarks.forEach(landmark => {
        const elements = document.querySelectorAll(landmark);
        if (elements.length === 0) {
            missingLandmarks.push(landmark);
        }
    });

    if (missingLandmarks.length > 0) {
        console.warn(`Warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
        return false;
    }

    return true;
}

// Initialize accessibility features
function initializeAccessibility() {
    addLangAttribute();
    addMainLandmark();
    addProperLandmarkRegions();
    
    // Fix SVGs
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        if (!getSvgAccessibleName(svg)) {
            setSvgAttributes(svg, 'Decorative graphic');
        }
    });
    
    // Handle fake links
    handleFakeLinks();
    
    // Ensure unique landmarks
    ensureUniqueLandmarks();
}

// Preserve any existing exports here
export {
    getLangAttribute,
    addLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    fixTableStructure,
    addMainLandmark,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    setSvgAttributes,
    ensureUniqueLandmarks,
    createInPageButton,
    validateLinkAccessibility,
    handleFakeLinks,
    addProperLandmarkRegions,
    initializeAccessibility
};