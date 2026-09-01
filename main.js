// TODO: This is the existing code that needs to be preserved

// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
    const htmlElement = document.documentElement;
    return htmlElement.getAttribute('lang') || '';
}

function ensureDependencyGraphARIA(container) {
    if (!container) return;
    if (!container.hasAttribute('role')) {
        container.setAttribute('role', 'graphics-document');
    }
    if (!container.hasAttribute('aria-label')) {
        container.setAttribute('aria-label', 'Dependency graph');
    }
}