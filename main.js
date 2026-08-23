function renderDependencyGraphForScope(scope) {
    console.log(`Rendering dependency graph for scope: ${scope}`);
}

const icons = {
  icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y=".9em" font-size="90">🐛</text></svg>',
};

function someFunctionThatUsesDependencyGraph() {
    const dependencies = getDependencies();
    for (const scope of dependencies) {
        renderDependencyGraphForScope(scope);
    }
}

export function someExportedFunction() { }

export function getDependencies() {
    return [];
}

function rotateBack() {
    console.log('Rotating back...');
}

document.documentElement.setAttribute('lang', 'en');
// Placeholder for landmark roles
// Placeholder for accessible names to SVGs
// Placeholder for unique landmarks
// Placeholder for fixing fake link issues