// main.js

// Some existing utility functions
function greet(name) {
    return `Hello, ${name}!`;
}

function add(a, b) {
    return a + b;
}

// Existing dependency storage
let dependencies = [
    { name: 'lodash', version: '4.17.21' },
    { name: 'express', version: '4.18.2' },
    { name: 'react', version: '18.2.0' }
];

function getDependencies() {
    return dependencies;
}

function addDependency(name, version) {
    dependencies.push({ name, version });
    return dependencies;
}

function removeDependency(name) {
    dependencies = dependencies.filter(dep => dep.name !== name);
    return dependencies;
}

// TODO: Implement a function to count dependencies
function countDependencies() {
    return dependencies.length;
}

// Accessibility functions
function addLangAttribute(htmlElement) {
    if (!htmlElement.hasAttribute('lang')) {
        htmlElement.setAttribute('lang', 'en');
    }
    return htmlElement;
}

function fixTableStructure(tableElement) {
    // Ensure table has proper structure with thead, tbody, etc.
    if (!tableElement.querySelector('thead') || !tableElement.querySelector('tbody')) {
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Move first row to thead if it exists
        const firstRow = tableElement.querySelector('tr');
        if (firstRow) {
            thead.appendChild(firstRow);
        }

        // Move remaining rows to tbody
        const rows = tableElement.querySelectorAll('tr');
        rows.forEach(row => tbody.appendChild(row));

        tableElement.innerHTML = '';
        tableElement.appendChild(thead);
        tableElement.appendChild(tbody);
    }
    return tableElement;
}

function addMainLandmark(mainElement) {
    if (!mainElement.hasAttribute('role') || mainElement.getAttribute('role') !== 'main') {
        mainElement.setAttribute('role', 'main');
    }
    return mainElement;
}

function ensureUniqueLandmarks() {
    const landmarks = ['main', 'navigation', 'search', 'contentinfo'];
    landmarks.forEach(landmark => {
        const elements = document.querySelectorAll(`[role="${landmark}"]`);
        if (elements.length > 1) {
            // Keep first one, remove others
            for (let i = 1; i < elements.length; i++) {
                elements[i].removeAttribute('role');
            }
        }
    });
}

function addSvgAccessibleNames(svgElements) {
    svgElements.forEach(svg => {
        if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
            svg.setAttribute('aria-label', 'Graphic');
        }
    });
}

function fixFakeLinkIssue(linkElement) {
    if (linkElement.getAttribute('href') === '#' && !linkElement.getAttribute('role')) {
        linkElement.setAttribute('role', 'button');
    }
    return linkElement;
}

module.exports = {
    greet,
    add,
    getDependencies,
    addDependency,
    removeDependency,
    countDependencies,
    addLangAttribute,
    fixTableStructure,
    addMainLandmark,
    ensureUniqueLandmarks,
    addSvgAccessibleNames,
    fixFakeLinkIssue
};