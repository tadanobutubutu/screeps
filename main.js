// Existing code in main.js that renders dependency graphs or index views
function renderDependencyGraph() {
    const graphContent = import('./dependencyGraphModule').then(m => m.dependencyGraphContent);
    // ... use graphContent ...
}

function renderIndexView() {
    const indexContent = import('./indexViewModule').then(m => m.indexContent);
    // ... use indexContent ...
}

// Rest of the main.js file