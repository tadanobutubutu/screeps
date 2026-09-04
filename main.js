( (function() {
    'use strict';
    const dependencyGraph = document.getElementById('dependencyGraph');
    const harvestButton = document.createElement('button');

    function initializeFromScript() {
        function3();
        addressAccessibilityIssues();
        createInPageButton();

        harvestButton.textContent = 'Start Harvest';
        harvestButton.setAttribute('aria-label', 'Start harvest');
        document.body.appendChild(harvestButton);
        return true;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFromScript);
    } else {
        initializeFromScript();
    }
})();

function addDependency(name, version) {
    if (!appData.dependencies) {
        appData.dependencies = {};
    }
    appData.dependencies[name] = version;
}

function removeDependency(name) {
    if (appData.dependencies && appData.dependencies[name]) {
        delete appData.dependencies[name];
    }
}

function countDependencies() {
    return appData.dependencies ? Object.keys(appData.dependencies).length : 0;
}

function someFunction() {
    return 'Some result';
}

function function3() {
    const depGraph = document.getElementById('dependencyGraph') || document.querySelector('.dependency-graph');

    if (depGraph) {
        dependencyGraph.setAttribute('role', 'region');
        dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
        depGraph.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.body.querySelector('button[aria-label="Show accessibility information"]').click();
            }
        });
    }

    /**
     * Adds lang attribute to HTML element
     */
    function addLangAttribute() {
        const htmlElement = document.documentElement;
        if (htmlElement) {
            htmlElement.setAttribute('lang', getLangAttribute());
        }
    }

    /**
     * Logs the current URL to the console
     */
    function logCurrentURL() {
        console.log('Current URL: ' + window.location.href);
    }

    /**
     * Creates an in-page button or link
     * @param {string} [id] - The id for the element
     * @param {string} [text] - The text content
     */
    function createInPageButton(id, text) {
        const button = document.createElement('button');
        button.textContent = text || 'Accessibility Info';
        button.setAttribute('aria-label', text || 'Show accessibility information');
        if (id) {
            button.id = id;
        }
        document.body.appendChild(button);
    }

    // REACT_036: Create accessible links
    function createAccessibleLinks() {
        const skipLink = createInPageButton('main-content', 'Skip to main content');
        const inPageLinks = document.querySelectorAll('a[href^="#"]');

        const links = Array.from(inPageLinks);
        links.forEach(link => {
            const validation = validateLinkAccessibility(link);
            if (!validation.valid) {
                console.warn('Link validation issues:', validation.issues);
            }
        });
    }

    /**
     * Validates table accessibility
     * @param {HTMLElement} table - The table element to validate
     * @returns {boolean} True if table is accessible
     */
    function validateTableAccessibility(table) {
        if (!table) return false;

        const hasCaption = table.query<unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk> -