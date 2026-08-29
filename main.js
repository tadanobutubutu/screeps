// Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?

// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report

/**
 * Renders a dependency graph in a readable format for debugging
 * @param {Object} graph - Object where keys are module names and values are arrays of dependencies
 * @returns {string} - Formatted dependency graph representation
 */
function renderDependencyGraph(graph) {
    if (!graph || typeof graph !== 'object') {
        return 'Error: Invalid dependency graph provided';
    }

    let output = 'Dependency Graph:\n';
    output += '=================\n';
    
    const modules = Object.keys(graph).sort();
    
    if (modules.length === 0) {
        return 'No modules found in dependency graph';
    }
    
    modules.forEach(module => {
        const dependencies = graph[module];
        if (Array.isArray(dependencies) && dependencies.length > 0) {
            output += `${module} -> [${dependencies.join(', ')}]\n`;
        } else {
            output += `${module} -> (no dependencies)\n`;
        }
    });
    
    return output;
}

/**
 * Displays module structure with detailed information for debugging
 * @param {Object} modules - Object containing module information
 * @returns {string} - Formatted module structure representation
 */
function displayModuleStructure(modules) {
    if (!modules || typeof modules !== 'object') {
        return 'Error: Invalid modules data provided';
    }

    let output = 'Module Structure:\n';
    output += '================\n';
    
    const moduleNames = Object.keys(modules).sort();
    
    if (moduleNames.length === 0) {
        return 'No modules found';
    }
    
    moduleNames.forEach(name => {
        const module = modules[name];
        output += `\nModule: ${name}\n`;
        output += '-'.repeat(20) + '\n';
        
        if (typeof module === 'object' && module !== null) {
            const properties = Object.keys(module);
            properties.forEach(prop => {
                const value = module[prop];
                if (Array.isArray(value)) {
                    output += `  ${prop}: [${value.join(', ')}]\n`;
                } else if (typeof value === 'object' && value !== null) {
                    output += `  ${prop}: ${JSON.stringify(value)}\n`;
                } else {
                    output += `  ${prop}: ${value}\n`;
                }
            });
        } else {
            output += `  Value: ${module}\n`;
        }
    });
    
    return output;
}

/**
 * Analyzes and displays circular dependencies in the module graph
 * @param {Object} graph - Dependency graph to analyze
 * @returns {string} - Analysis of circular dependencies
 */
function analyzeCircularDependencies(graph) {
    if (!graph || typeof graph !== 'object') {
        return 'Error: Invalid dependency graph provided';
    }

    const visited = new Set();
    const recursionStack = new Set();
    const cycles = [];
    
    function dfs(module, path) {
        if (recursionStack.has(module)) {
            const cycleStart = path.indexOf(module);
            const cycle = path.slice(cycleStart);
            cycles.push(cycle);
            return;
        }
        
        if (visited.has(module)) {
            return;
        }
        
        visited.add(module);
        recursionStack.add(module);
        path.push(module);
        
        const dependencies = graph[module] || [];
        dependencies.forEach(dep => {
            if (graph[dep]) { // Only analyze if dependency exists in graph
                dfs(dep, [...path]);
            }
        });
        
        recursionStack.delete(module);
        path.pop();
    }
    
    Object.keys(graph).forEach(module => {
        if (!visited.has(module)) {
            dfs(module, []);
        }
    });
    
    if (cycles.length === 0) {
        return 'No circular dependencies detected';
    }
    
    let output = 'Circular Dependencies Detected:\n';
    output += '==============================\n';
    cycles.forEach((cycle, index) => {
        output += `Cycle ${index + 1}: ${cycle.join(' -> ')}\n`;
    });
    
    return output;
}

// Export the new functions for testing
module.exports = {
    renderDependencyGraph,
    displayModuleStructure,
    analyzeCircularDependencies
};