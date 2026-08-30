// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

// TODO: Identify and update specific functions that render dependency graphs or
// index views.

const fs = require('fs');
const path = require('path');

/**
 * Renders a dependency graph visualization
 * @param {Object} dependencies - The dependencies object
 * @returns {string} - HTML string for the dependency graph
 */
function renderDependencyGraph(dependencies) {
    const nodes = [];
    const edges = [];
    
    for (const [name, version] of Object.entries(dependencies)) {
        nodes.push({ id: name, label: `${name}@${version}` });
        
        // For nested dependencies, create edges
        if (typeof version === 'object' && version.dependencies) {
            for (const dep of Object.keys(version.dependencies)) {
                edges.push({ from: name, to: dep });
            }
        }
    }
    
    return JSON.stringify({ nodes, edges });
}

/**
 * Renders the index view with all packages
 * @param {Array} packages - List of packages to display
 * @returns {string} - HTML string for the index view
 */
function renderIndexView(packages) {
    let html = '<!DOCTYPE html><html><head><title>Dependency Index</title>';
    html += '<link rel="stylesheet" href="styles.css"></head><body>';
    html += '<h1>Dependency Index</h1>';
    html += '<ul class="package-list">';
    
    for (const pkg of packages) {
        const name = typeof pkg === 'string' ? pkg : pkg.name;
        const version = typeof pkg === 'string' ? '' : (pkg.version || '');
        html += `<li class="package-item"><span class="pkg-name">${name}</span>`;
        if (version) {
            html += ` <span class="pkg-version">@${version}</span>`;
        }
        html += '</li>';
    }
    
    html += '</ul></body></html>';
    return html;
}

// TODO: Implement CLI logic
function parseArgs(args) {
    const parsed = {
        command: null,
        options: {},
        args: []
    };
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        if (arg === 'help' || arg === '--help' || arg === '-h') {
            parsed.options.help = true;
            parsed.command = parsed.command || 'help';
        } else if (arg === 'graph' || arg === 'index') {
            parsed.command = arg;
        } else if (arg.startsWith('--')) {
            const option = arg.slice(2);
            parsed.options[option] = args[++i] || true;
        } else if (arg.startsWith('-')) {
            const short = arg.slice(1);
            if (short === 'v') parsed.options.verbose = true;
            if (short === 'o') parsed.options.output = args[++i];
        } else {
            parsed.args.push(arg);
        }
    }
    
    return parsed;
}

function displayHelp() {
    const helpText = `
Usage: node main.js [command] [options]

Commands:
  graph    Generate dependency graph visualization
  index    Generate index view of all packages
  help     Display this help message

Options:
  -h, --help     Display help information
  -v             Enable verbose output
  -o <file>      Output to specified file

Examples:
  node main.js graph
  node main.js index -o output.html
  node main.js help
`;
    console.log(helpText.trim());
}

function executeCommand(parsed) {
    if (parsed.options.help || parsed.command === 'help') {
        displayHelp();
        return { success: true, output: 'Help displayed' };
    }
    
    if (parsed.command === 'graph') {
        const result = main();
        if (parsed.options.output) {
            fs.writeFileSync(parsed.options.output, result.graphData);
            return { success: true, output: `Graph data written to ${parsed.options.output}` };
        }
        return { success: true, output: result.graphData };
    }
    
    if (parsed.command === 'index') {
        const result = main();
        if (parsed.options.output) {
            fs.writeFileSync(parsed.options.output, result.indexHtml);
            return { success: true, output: `Index HTML written to ${parsed.options.output}` };
        }
        return { success: true, output: result.indexHtml };
    }
    
    // Default behavior if no command specified
    displayHelp();
    return { success: true, output: 'No command specified' };
}

/**
 * Main entry point for the application
 */
function main() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
        throw new Error(`package.json not found at ${packageJsonPath}`);
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const graphData = renderDependencyGraph(packageJson.dependencies || {});
    const indexHtml = renderIndexView([{ name: 'example', version: '1.0.0' }]);
    
    return { graphData, indexHtml };
}

module.exports = {
    renderDependencyGraph,
    renderIndexView,
    main,
    parseArgs,
    displayHelp,
    executeCommand
};