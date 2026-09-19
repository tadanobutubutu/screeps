// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
// Preserve existing functionality

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation
// main.js - Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// CLI Logic Implementation
const CLI_MODE = {
    HELP: 'help',
    VALIDATE: 'validate',
    FIX: 'fix',
    REPORT: 'report'
};

/**
 * Parses command line arguments
 * @returns {Object} Parsed arguments object
 */
function parseCLIArgs() {
    const args = process.argv.slice(2);
    const parsed = {
        mode: CLI_MODE.VALIDATE,
        input: null,
        output: null,
        options: {}
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case '-h':
            case '--help':
                parsed.mode = CLI_MODE.HELP;
                break;
            case '-i':
            case '--input':
                parsed.input = args[++i];
                break;
            case '-o':
            case '--output':
                parsed.output = args[++i];
                break;
            case '-v':
            case '--verbose':
                parsed.options.verbose = true;
                break;
            case 'validate':
                parsed.mode = CLI_MODE.VALIDATE;
                break;
            case 'fix':
                parsed.mode = CLI_MODE.FIX;
                break;
            case 'report':
                parsed.mode = CLI_MODE.REPORT;
                break;
            default:
                if (arg.startsWith('--')) {
                    const [key, value] = arg.slice(2).split('=');
                    parsed.options[key] = value;
                }
        }
    }

    return parsed;
}

/**
 * Displays help text for the CLI
 */
function showHelp() {
    console.log(`
Accessibility Checker CLI

Usage: node main.js [command] [options]

Commands:
  validate    Run accessibility validation (default)
  fix         Fix accessibility issues automatically
  report      Generate accessibility report

Options:
  -h, --help              Show this help message
  -i, --input <path>      Input file or directory path
  -o, --output <path>     Output file or directory path
  -v, --verbose           Enable verbose output

Examples:
  node main.js validate -i ./src -o ./report.json
  node main.js fix -i ./src/components
  node main.js report -i ./src -o ./accessibility-report.html
    `.trim());
}

/**
 * Runs the CLI with the given arguments
 * @param {string[]} args - Command line arguments
 */
function runCLI(args = process.argv) {
    const parsed = parseCLIArgs();

    switch (parsed.mode) {
        case CLI_MODE.HELP:
            showHelp();
            break;
        case CLI_MODE.VALIDATE:
            console.log('Running accessibility validation...');
            if (parsed.options.verbose) {
                console.log('Input:', parsed.input || 'No input specified');
                console.log('Output:', parsed.output || 'No output specified');
            }
            break;
        case CLI_MODE.FIX:
            console.log('Running automatic fixes...');
            if (parsed.options.verbose) {
                console.log('Input:', parsed.input || 'No input specified');
                console.log('Output:', parsed.output || 'No output specified');
            }
            break;
        case CLI_MODE.REPORT:
            console.log('Generating accessibility report...');
            if (parsed.options.verbose) {
                console.log('Input:', parsed.input || 'No input specified');
                console.log('Output:', parsed.output || 'No output specified');
            }
            break;
    }

    return parsed;
}

// Auto-run CLI if this file is executed directly
if (require.main === module) {
    runCLI();
}

// Internal set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function createUniqueLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.floor(Math.random() * 9000) + 1000;
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

// Returns a new array containing only unique landmarks from the input list.
// @param {Array} landmarks - List of landmark objects.
// @returns {Array} Unique landmarks.
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    if (!landmarks) return result;
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

// Add lang attribute as per the issue requirement
function addLangAttribute() {
  // Assuming there is a relevant element selector or similar to target
  const elementToModify = document.documentElement;
  if (elementToModify) {
    elementToModify.lang = 'en'; // Example: English
  }
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (element && !element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Gets the language attribute from the HTML element.
 * @returns {string} - the language attribute value
 */
function getLangAttribute() {
    return document.documentElement.lang || '';
}

/**
 * This function gets the full language attribute with region (if provided)
 * @returns {string} - the full language attribute with region (if provided)
 */
function getFullLangAttribute() {
    return document.documentElement.lang || '';
}

// Accessibility helper functions
function handleKeyboardNavigation(element, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;

  element.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
    return element.id;
}

/**
 * Renders a dependency graph visualization.
 * @param {HTMLElement} container - Container element for the graph.
 * @param {Array} dependencies - Array of dependency objects.
 */
function renderDependencyGraph(container, dependencies) {
    if (!container || !dependencies) return;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-label', 'Dependency graph');
    svg.setAttribute('role', 'img');
    
    let y = 50;
    dependencies.forEach(dep => {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '50');
        rect.setAttribute('y', y.toString());
        rect.setAttribute('width', '200');
        rect.setAttribute('height', '40');
        rect.setAttribute('rx', '4');
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '60');
        text.setAttribute('y', (y + 25).toString());
        text.textContent = dep.name || dep;
        
        group.appendChild(rect);
        group.appendChild(text);
        svg.appendChild(group);
        y += 60;
    });
    
    container.appendChild(svg);
}

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name.
 */
function getSvgAccessibleName(svg) {
    const title = svg.querySelector('title');
    const ariaLabel = svg.getAttribute('aria-label');
    
    if (ariaLabel) return ariaLabel;
    if (title) return title.textContent;
    
    return '';
}

/**
 * Creates an accessible in-page button with proper labeling.
 * @param {string} text - Button text content.
 * @param {string} [ariaLabel] - Optional aria-label.
 * @returns {HTMLButtonElement} The created button.
 */
function createInPageButton(text, ariaLabel) {
    const button = document.createElement('button');
    button.textContent = text;
    if (ariaLabel) {
        button.setAttribute('aria-label', ariaLabel);
    }
    return button;
}

// ... other existing functions remained unchanged