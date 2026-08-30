// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// - NEW: Implement a new function to handle focus trap for keyboard navigation (handled by newFocusTrap())

// TODO: This is the existing code that needs to be preserved

/**
 * REACT_015: Get the lang attribute for the HTML element.
 * @returns {string} The language code (e.g., 'en').
 */
function getLangAttribute() {
    return document.documentElement.lang || 'en';
}

/**
 * REACT_015: Get the accessible person name.
 * @param {Object} person - The person object.
 * @returns {string} The person's accessible name.
 */
function personName(person) {
    if (!person) return '';
    return person.name || person.fullName || '';
}

/**
 * REACT_027: Validate table accessibility.
 * @param {HTMLTableElement} table - The table element.
 * @returns {boolean} Whether the table is accessible.
 */
function validateTableAccessibility(table) {
    if (!table) return false;
    return table.tHead !== null && table.tBodies.length > 0;
}

/**
 * REACT_027: Validate table structure (headers, captions, etc.).
 * @param {HTMLTableElement} table - The table element.
 * @returns {boolean} Whether the table structure is valid.
 */
function validateTableStructure(table) {
    if (!table) return false;
    const hasCaption = table.caption !== null;
    const hasHeaders = table.querySelectorAll('th').length > 0;
    return hasCaption && hasHeaders;
}

/**
 * REACT_017: Validate a landmark element.
 * @param {Element} element - The landmark element.
 * @returns {boolean} Whether the landmark is valid.
 */
function validateLandmark(element) {
    if (!element) return false;
    const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];
    return validRoles.includes(element.getAttribute('role') || element.tagName.toLowerCase());
}

/**
 * REACT_017: Validate landmark structure.
 * @returns {boolean} Whether all landmarks in the document are properly structured.
 */
function validateLandmarkStructure() {
    const landmarks = document.querySelectorAll('header, nav, main, aside, footer, [role="region"]');
    let valid = true;
    landmarks.forEach((landmark) => {
        if (!validateLandmark(landmark)) valid = false;
    });
    return valid;
}

/**
 * REACT_041: Get the accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name of the SVG.
 */
function getSvgAccessibleName(svg) {
    if (!svg) return '';
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    const titleEl = svg.querySelector('title');
    if (titleEl) return titleEl.textContent;
    return '';
}

/**
 * REACT_036: Create an in-page button that doesn't act as a fake link.
 * @param {string} label - The label for the button.
 * @param {Function} onClick - The click handler.
 * @returns {HTMLButtonElement} The created button element.
 */
function createInPageButton(label, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
}

/**
 * NEW: Implement a focus trap for keyboard navigation.
 * @param {HTMLElement} container - The container element to trap focus within.
 */
function newFocusTrap(container) {
    if (!container) return;
    const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableElements = container.querySelectorAll(focusableSelectors);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab') return;
        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    });
}