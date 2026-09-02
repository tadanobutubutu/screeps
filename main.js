// Identified and updated specific functions for accessibility validation and UI components

// ... existing code ...

// Line 74 - Implement this function for creating in-page buttons
function createInPageButton(options) {
    const defaults = {
        text: 'Button',
        className: 'in-page-button',
        container: document.body,
        id: null,
        title: '',
        disabled: false
    };

    const settings = Object.assign({}, defaults, options);

    const button = document.createElement('button');
    button.textContent = settings.text;
    button.className = settings.className;
    button.setAttribute('title', settings.title);
    button.disabled = settings.disabled;

    if (settings.id) {
        button.id = settings.id;
    }

    if (settings.style) {
        Object.assign(button.style, settings.style);
    }

    if (settings.onClick) {
        button.addEventListener('click', settings.onClick);
    }

    if (typeof settings.container === 'string') {
        const containerElement = document.querySelector(settings.container);
        if (containerElement) {
            containerElement.appendChild(button);
        }
    } else if (settings.container) {
        settings.container.appendChild(button);
    }

    return button;
}

// Example functionA
function functionA() {
    return 'functionA result';
}

// Example functionB
function functionB() {
    return 'functionB result';
}

// Accessibility validation functions
function updateAccessibleElements() {
    const elements = document.querySelectorAll('[role]');
    elements.forEach(el => {
        el.setAttribute('aria-label', el.getAttribute('aria-label') || el.textContent);
    });
}

function validateTableAccessibility(table) {
    if (!table) return false;
    const hasCaption = table.querySelector('caption');
    const hasHeaders = table.querySelector('th');
    const hasScope = table.querySelectorAll('th[scope]').length > 0;
    return hasCaption && hasHeaders && hasScope;
}

function validateTableStructure(table) {
    if (!table) return false;
    const rows = table.querySelectorAll('tr');
    let cellCount = 0;
    rows.forEach(row => {
        cellCount += row.querySelectorAll('td, th').length;
    });
    return cellCount > 0;
}

function validateLandmark(element) {
    if (!element) return false;
    const role = element.getAttribute('role');
    const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];
    return validLandmarks.includes(role);
}

function validateLandmarkStructure(container) {
    if (!container) return false;
    const landmarks = container.querySelectorAll('[role]');
    const landmarkRoles = new Set();
    landmarks.forEach(el => {
        const role = el.getAttribute('role');
        if (['banner', 'navigation', 'main', 'complementary', 'contentinfo'].includes(role)) {
            landmarkRoles.add(role);
        }
    });
    return landmarkRoles.size <= 1 || landmarkRoles.has('navigation') || landmarkRoles.has('main');
}

function getSvgAccessibleName(svgElement) {
    if (!svgElement) return '';
    const title = svgElement.querySelector('title');
    const ariaLabel = svgElement.getAttribute('aria-label');
    const desc = svgElement.querySelector('desc');
    return ariaLabel || (title ? title.textContent : (desc ? desc.textContent : ''));
}

function ensureUniqueLandmarks(container) {
    if (typeof document === 'undefined') return;
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
    landmarkRoles.forEach(role => {
        const landmarks = (container || document).querySelectorAll(`[role="${role}"]`);
        if (landmarks.length > 1) {
            landmarks.forEach((landmark, index) => {
                if (index > 0) {
                    landmark.removeAttribute('role');
                }
            });
        }
    });
}

function createAccessibleLink(options) {
    const defaults = {
        href: '#',
        text: 'Link',
        title: '',
        target: '_self'
    };
    const settings = Object.assign({}, defaults, options);
    
    const link = document.createElement('a');
    link.href = settings.href;
    link.textContent = settings.text;
    link.setAttribute('title', settings.title);
    link.target = settings.target;
    
    return link;
}

function isLinkAccessible(link) {
    if (!link) return false;
    const href = link.getAttribute('href');
    const text = link.textContent.trim();
    const hasAccessibleText = text.length > 0;
    const isValidHref = href && href !== '#' && href !== '';
    return hasAccessibleText && isValidHref;
}

function validateImageAccessibility(img) {
    if (!img) return false;
    const alt = img.getAttribute('alt');
    const ariaLabel = img.getAttribute('aria-label');
    const role = img.getAttribute('role');
    return alt !== null || ariaLabel || role === 'presentation';
}

function validateButtonAccessibility(button) {
    if (!button) return false;
    const text = button.textContent.trim();
    const ariaLabel = button.getAttribute('aria-label');
    const ariaLabelledby = button.getAttribute('aria-labelledby');
    const hasAccessibleName = text.length > 0 || ariaLabel || ariaLabelledby;
    return hasAccessibleName;
}

function renderDependencyGraph(dependencies) {
    if (typeof document === 'undefined') return null;
    const container = document.createElement('div');
    container.className = 'dependency-graph';
    
    if (Array.isArray(dependencies)) {
        dependencies.forEach(dep => {
            const node = document.createElement('div');
            node.className = 'graph-node';
            node.textContent = dep.name || dep;
            container.appendChild(node);
        });
    }
    
    return container;
}

function renderIndexView(items) {
    if (typeof document === 'undefined') return null;
    const container = document.createElement('div');
    container.className = 'index-view';
    
    if (Array.isArray(items)) {
        items.forEach(item => {
            const row = document.createElement('div');
            row.className = 'index-row';
            row.textContent = item.title || item.name || item;
            container.appendChild(row);
        });
    }
    
    return container;
}

function towerDefense() {
    if (typeof document === 'undefined') return;
    
    // Tower defense game initialization
    const gameContainer = document.createElement('div');
    gameContainer.id = 'tower-defense-game';
    gameContainer.style.width = '800px';
    gameContainer.style.height = '600px';
    gameContainer.style.border = '1px solid #ccc';
    
    return gameContainer;
}

// Keyboard navigation setup
function setupKeyboardNavigation() {
    if (typeof document === 'undefined') return;

    // Focus management for keyboard users
    document.addEventListener('keydown', (e) => {
        // Skip if modifier keys are pressed
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        // Handle tab key for focus management
        if (e.key === 'Tab') {
            // Add logic for tab navigation if needed
        }

        // Handle arrow keys for navigation
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            const activeElement = document.activeElement;

            // Skip if not in a navigation context
            if (!activeElement || !activeElement.parentElement) return;

            // Handle navigation based on element role
            const role = activeElement.getAttribute('role');
            if (role === 'menuitem' || role === 'tab') {
                e.preventDefault();
                navigateSiblings(activeElement, e.key);
            }
        }
    });

    // Helper function for keyboard navigation
    function navigateSiblings(element, key) {
        const siblings = Array.from(element.parentElement.children).filter(
            el => el.getAttribute('role') === element.getAttribute('role')
        );

        const currentIndex = siblings.indexOf(element);
        let newIndex = currentIndex;

        switch (key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                newIndex = Math.max(0, currentIndex - 1);
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                newIndex = Math.min(siblings.length - 1, currentIndex + 1);
                break;
        }

        if (newIndex !== currentIndex) {
            siblings[newIndex].focus();
        }
    }
}

// Initialize keyboard navigation
setupKeyboardNavigation();

// Global exports for consistency
const exportedFunctions = {
    createInPageButton,
    functionA,
    functionB,
    updateAccessibleElements,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    ensureUniqueLandmarks,
    createAccessibleLink,
    isLinkAccessible,
    validateImageAccessibility,
    validateButtonAccessibility,
    renderDependencyGraph,
    renderIndexView,
    towerDefense
};

// Export for Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportedFunctions;
}

// Export for ES modules
if (typeof exports !== 'undefined') {
    exports = exportedFunctions;
}

// Make functions available globally for browser
if (typeof window !== 'undefined') {
    Object.keys(exportedFunctions).forEach(key => {
        window[key] = exportedFunctions[key];
    });
}