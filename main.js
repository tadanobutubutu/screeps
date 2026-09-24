/**
 * Main module for the application
 * Handles core functionality including dependency graph rendering and module structure display
 */

// Sample module registry for demonstration
const moduleRegistry = new Map();

/**
 * Registers a module in the registry
 * @param {string} name - Module name
 * @param {object} module - Module object containing dependencies and info
 */
function registerModule(name, module) {
    moduleRegistry.set(name, {
        ...module,
        timestamp: Date.now()
    });
}

/**
 * Renders a dependency graph for visualization
 * @param {string} rootModule - The root module to start rendering from
 * @param {object} options - Rendering options
 * @returns {string} ASCII representation of the dependency graph
 */
function renderDependencyGraph(rootModule, options = {}) {
    const {
        maxDepth = 3,
        showVersions = false,
        format = 'ascii'
    } = options;

    if (!moduleRegistry.has(rootModule)) {
        return `Error: Module '${rootModule}' not found in registry`;
    }

    const visited = new Set();
    const lines = [];

    function traverse(moduleName, depth = 0, prefix = '', isLast = true) {
        if (depth > maxDepth || visited.has(moduleName)) {
            return;
        }
        visited.add(moduleName);

        const module = moduleRegistry.get(moduleName);
        const connector = isLast ? '└── ' : '├── ';
        const version = showVersions && module.version ? `@${module.version}` : '';
        lines.push(`${prefix}${connector}${moduleName}${version}`);

        if (module.dependencies && module.dependencies.length > 0) {
            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            module.dependencies.forEach((dep, index) => {
                const isLastDep = index === module.dependencies.length - 1;
                traverse(dep, depth + 1, newPrefix, isLastDep);
            });
        }
    }

    lines.push(`Dependency Graph: ${rootModule}`);
    lines.push('─'.repeat(40));
    traverse(rootModule);

    return lines.join('\n');
}

/**
 * Displays the structure of a module for debugging purposes
 * @param {string} moduleName - Name of the module to inspect
 * @param {object} options - Display options
 * @returns {string} Formatted module structure
 */
function displayModuleStructure(moduleName, options = {}) {
    const {
        showPrivate = false,
        showMetadata = true,
        indent = '  '
    } = options;

    if (!moduleRegistry.has(moduleName)) {
        return `Error: Module '${moduleName}' not found in registry`;
    }

    const module = moduleRegistry.get(moduleName);
    const lines = [];

    lines.push(`Module: ${moduleName}`);
    lines.push('─'.repeat(40));

    if (showMetadata) {
        lines.push(`Registered: ${new Date(module.timestamp).toISOString()}`);
        if (module.version) {
            lines.push(`Version: ${module.version}`);
        }
    }

    if (module.exports) {
        lines.push('\nExports:');
        const exportsList = module.exports;
        if (Array.isArray(exportsList)) {
            exportsList.forEach(exp => {
                const visibility = typeof exp === 'string' && exp.startsWith('_') ? '[private]' : '[public]';
                if (showPrivate || !showPrivate && visibility === '[public]') {
                    lines.push(`${indent}${visibility} ${exp}`);
                }
            });
        } else {
            lines.push(`${indent}${exportsList}`);
        }
    }

    if (module.dependencies && module.dependencies.length > 0) {
        lines.push('\nDependencies:');
        module.dependencies.forEach(dep => {
            const depInfo = moduleRegistry.get(dep);
            const status = depInfo ? '[registered]' : '[missing]';
            lines.push(`${indent}${dep} ${status}`);
        });
    }

    if (module.dependents && module.dependents.length > 0) {
        lines.push('\nDependents (modules that depend on this):');
        module.dependents.forEach(dep => {
            lines.push(`${indent}${dep}`);
        });
    }

    return lines.join('\n');
}

/**
 * Generates a complete dependency report for debugging
 * @param {string[]} modules - Optional list of modules to include (default: all)
 * @returns {object} Complete dependency report
 */
function generateDependencyReport(modules = null) {
    const targetModules = modules || Array.from(moduleRegistry.keys());
    const report = {
        generatedAt: new Date().toISOString(),
        totalModules: 0,
        modules: {}
    };

    targetModules.forEach(moduleName => {
        if (!moduleRegistry.has(moduleName)) return;

        const module = moduleRegistry.get(moduleName);
        report.modules[moduleName] = {
            dependencies: module.dependencies || [],
            dependencyCount: (module.dependencies || []).length,
            dependents: module.dependents || [],
            dependentCount: (module.dependents || []).length
        };
        report.totalModules++;
    });

    return report;
}

/**
 * Validates dependency graph for circular dependencies
 * @param {string} rootModule - The root module to start validation from
 * @returns {object} Validation result with any circular dependencies found
 */
function validateDependencyGraph(rootModule) {
    const visited = new Set();
    const recursionStack = new Set();
    const circularDeps = [];

    function dfs(moduleName, path = []) {
        if (recursionStack.has(moduleName)) {
            const cycleStart = path.indexOf(moduleName);
            const cycle = path.slice(cycleStart).concat(moduleName);
            circularDeps.push(cycle);
            return;
        }

        if (visited.has(moduleName)) return;

        visited.add(moduleName);
        recursionStack.add(moduleName);

        const module = moduleRegistry.get(moduleName);
        if (module && module.dependencies) {
            module.dependencies.forEach(dep => {
                if (moduleRegistry.has(dep)) {
                    dfs(dep, [...path, moduleName]);
                }
            });
        }

        recursionStack.delete(moduleName);
    }

    dfs(rootModule);

    return {
        isValid: circularDeps.length === 0,
        circularDependencies: circularDeps,
        checkedModules: visited.size
    };
}

/**
 * Exports module registry for external inspection
 * @returns {Map} The module registry
 */
function getModuleRegistry() {
    return moduleRegistry;
}

// Export all functions
module.exports = {
    registerModule,
    renderDependencyGraph,
    displayModuleStructure,
    generateDependencyReport,
    validateDependencyGraph,
    getModuleRegistry
};

// TODO: Implement functions to render dependency graphs and display module structure for debugging purposes.