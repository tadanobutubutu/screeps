// Existing code in main.js that renders dependency graphs or index views
function renderDependencyGraph() {
    // ... existing code ...
}

function renderIndexView() {
    // ... existing code ...
}

// Updated main.js with changes as per the issue
// Assuming the modules are named 'dependencyGraphModule' and 'indexViewModule'

function renderDependencyGraph() {
    const graphContent = import('./dependencyGraphModule').then(m => m.dependencyGraphContent);
    // ... use graphContent ...
}

function renderIndexView() {
    const indexContent = import('./indexViewModule').then(m => m.indexContent);
    // ... use indexContent ...
}

// New function to add lang attribute to HTML element
function addLangAttribute() {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
        htmlElement.setAttribute('lang', 'en'); // Set the appropriate language code
    }
}

// Rest of the main.js file