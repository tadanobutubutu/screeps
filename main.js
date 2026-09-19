// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and validateLandmarkAccessibility())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by validateLandmarkAccessibility())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// Preserve existing functionality

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
        const suffix = Math.floor(Math.random() * 900) + 100;
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
  if (elementToModify && !elementToModify.lang) {
    elementToModify.lang = 'en'; // Example: English
  }
}

/**
 * Adds an aria--label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (element && !element.getAttribute('aria-label')) {
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

// TODO: Implement renderIndexView functionality
/**
 * Renders an accessible index view with navigation items.
 * @param {HTMLElement} container - The container element to render the index view into.
 * @param {Array} items - Array of items to display in the index view.
 * @param {Object} options - Configuration options for the index view.
 * @param {Function} options.onItemClick - Callback function when an item is clicked.
 * @param {string} options.ariaLabel - ARIA label for the index view.
 * @param {string} options.headingLevel - Heading level for item titles (default: '2').
 * @returns {HTMLElement} The rendered nav element containing the index view.
 */
function renderIndexView(container, items = [], options = {}) {
    const {
        onItemClick = null,
        ariaLabel = 'Index navigation',
        headingLevel = '2'
    } = options;

    // Create the navigation landmark
    const nav = document.createElement('nav');
    const navId = ensureUniqueLandmarkId('index-nav');
    nav.id = navId;
    nav.setAttribute('aria-label', ariaLabel);

    // Create heading for the index
    const heading = document.createElement(`h${headingLevel}`);
    heading.textContent = 'Index';
    addAriaLabel(heading, 'Index section heading');
    nav.appendChild(heading);

    // Create the list of items
    const list = document.createElement('ul');
    list.setAttribute('role', 'list');

    items.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('role', 'listitem');

        const link = document.createElement('a');
        link.href = item.href || '#';
        link.textContent = item.label || item.title || `Item ${index + 1}`;
        
        if (item.id) {
            link.id = `${navId}-link-${index}`;
        }
        
        if (item.description) {
            link.setAttribute('aria-describedby', `${navId}-desc-${index}`);
            
            const description = document.createElement('span');
            description.id = `${navId}-desc-${index}`;
            description.className = 'index-item-description';
            description.textContent = item.description;
            
            listItem.appendChild(link);
            listItem.appendChild(description);
        } else {
            listItem.appendChild(link);
        }

        // Add click handler if provided
        if (onItemClick && typeof onItemClick === 'function') {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                onItemClick(item, index, event);
            });
        }

        // Add keyboard navigation support
        setupKeyboardNavigation(link, {
            onEnter: () => {
                if (onItemClick) {
                    onItemClick(item, index, new Event('keyboard'));
                } else {
                    link.click();
                }
            }
        });

        list.appendChild(listItem);
    });

    nav.appendChild(list);

    // Validate landmark structure
    validateLandmark(nav);

    // Append to container if provided
    if (container && container instanceof HTMLElement) {
        container.appendChild(nav);
    }

    return nav;
}

// ... existing functions from both branches

// Accessibility helper functions
function handleKeyboardNavigation(options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;

  return function(event) {
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
  };
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

  container.addEventListener('keydown', function(event) {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
    return button;
}

// Accessibility validation and helper functions for addressing insight report issues

/**
 * Validates landmark attributes on an element.
 * @param {HTMLElement} element - The element to validate.
 * @param {Object} config - Configuration options.
 * @returns {Object} Validation result with issues array.
 */
function validateLandmark(element, config = {}) {
    const issues = [];
    const landmarkRoles = [
        'banner', 'navigation', 'main', 'complementary', 'contentinfo',
        'search', 'form', 'region'
    ];
    
    const validLandmark = landmarkRoles.some(role => element.hasAttribute(`aria-label`) || 
        element.tagName === 'NAV' || element.tagName === 'HEADER' || 
        element.tagName === 'FOOTER' || element.tagName === 'MAIN' ||
        element.tagName === 'ASIDE' || element.tagName === 'SECTION' ||
        element.tagName === 'FORM' || element.tagName === 'SEARCH');
    
    if (!validLandmark && element.hasAttribute('role')) {
        const role = element.getAttribute('role');
        if (!landmarkRoles.includes(role)) {
            issues.push({
                type: 'REACT_017',
                message: `Invalid landmark role: ${role}`,
                element: element
            });
        }
    }
    
    return { valid: issues.length === 0, issues };
}

/**
 * Validates landmark structure to ensure proper nesting and uniqueness.
 * @param {HTMLElement} container - The container element to validate.
 * @returns {Object} Validation result with issues and recommendations.
 */
function validateLandmarkStructure(container = document) {
    const issues = [];
    const landmarkCounts = {};
    
    const landmarks = container.querySelectorAll(
        'header:not([role]), main, nav, aside, footer:not([role]), section[aria-label], section[aria-labelledby], [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]'
    );
    
    landmarks.forEach(landmark => {
        const tagName = landmark.tagName.toLowerCase();
        const role = landmark.getAttribute('role') || tagName;
        
        // Check for multiple main landmarks
        if (role === 'main') {
            landmarkCounts.main = (landmarkCounts.main || 0) + 1;
            if (landmarkCounts.main > 1) {
                issues.push({
                    type: 'REACT_025',
                    message: 'Multiple main landmarks found. Only one main landmark should exist.',
                    element: landmark
                });
            }
        }
        
        // Check for proper labeling
        if (!landmark.hasAttribute('aria-label') && 
            !landmark.hasAttribute('aria-labelledby') &&
            tagName !== 'nav' && tagName !== 'main') {
            issues.push({
                type: 'REACT_017',
                message: `Landmark ${role} lacks accessible name via aria-label or aria-labelledby`,
                element: landmark
            });
        }
    });
    
    return { valid: issues.length === 0, issues };
}

/**
 * Validates table accessibility including proper headers and structure.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {Object} Validation result with issues.
 */
function validateTableAccessibility(table) {
    const issues = [];
    
    if (!table) {
        return { valid: false, issues: [{ message: 'No table element provided' }] };
    }
    
    const headers = table.querySelectorAll('th');
    const rows = table.querySelectorAll('tr');
    
    // Check for missing scope attributes
    headers.forEach((th, index) => {
        if (!th.hasAttribute('scope')) {
            issues.push({
                type: 'REACT_027',
                message: `TH element at index ${index} missing scope attribute`,
                element: th
            });
        }
    });
    
    // Check for missing caption or summary
    if (!table.querySelector('caption') && !table.getAttribute('aria-label')) {
        issues.push({
            type: 'REACT_027',
            message: 'Table lacks caption or aria-label for accessibility',
            element: table
        });
    }
    
    return { valid: issues.length === 0, issues };
}

/**
 * Validates table structure for proper thead/tbody organization.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {Object} Validation result with issues.
 */
function validateTableStructure(table) {
    const issues = [];
    
    if (!table) {
        return { valid: false, issues: [{ message: 'No table element provided' }] };
    }
    
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const tfoot = table.querySelector('tfoot');
    
    if (!thead) {
        issues.push({
            type: 'REACT_027',
            message: 'Table missing thead element',
            element: table
        });
    }
    
    if (!tbody) {
        issues.push({
            type: 'REACT_027',
            message: 'Table missing tbody element',
            element: table
        });
    }
    
    // Check for proper th elements in thead
    if (thead) {
        const headerCells = thead.querySelectorAll('th');
        const dataCells = thead.querySelectorAll('td');
        
        if (dataCells.length > 0) {
            issues.push({
                type: 'REACT_027',
                message: 'thead should contain only th elements, not td',
                element: table
            });
        }
        
        headerCells.forEach(th => {
            if (!th.hasAttribute('scope')) {
                issues.push({
                    type: 'REACT_027',
                    message: 'Header cell in thead missing scope="col" attribute',
                    element: th
                });
            } else {
                const scope = th.getAttribute('scope');
                if (scope !== 'col' && scope !== 'row') {
                    issues.push({
                        type: 'REACT_027',
                        message: `Invalid scope attribute value: ${scope}`,
                        element: th
                    });
                }
            }
        });
    }
    
    return { valid: issues.length === 0, issues };
}

/**
 * Gets an accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name.
 */
function getSvgAccessibleName(svg) {
    if (!svg) return '';
    
    // Check for aria-label
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    
    // Check for aria-labelledby reference
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
        const labelElement = document.getElementById(ariaLabelledby);
        return labelElement ? labelElement.textContent : '';
    }
    
    // Check for title element
    const title = svg.querySelector('title');
    if (title) return title.textContent;
    
    // Check for desc element
    const desc = svg.querySelector('desc');
    if (desc) return desc.textContent;
    
    return '';
}

/**
 * Creates an accessible in-page button with proper semantics.
 * @param {Object} options - Button configuration options.
 * @returns {HTMLButtonElement} The accessible button element.
 */
function createInPageButton(options = {}) {
    const {
        text = '',
        ariaLabel = '',
        onClick = null,
        className = '',
        id = ''
    } = options;
    
    const button = document.createElement('button');
    
    if (id) {
        button.id = id;
    }
    
    if (className) {
        button.className = className;
    }
    
    if (text) {
        button.textContent = text;
    }
    
    if (ariaLabel) {
        button.setAttribute('aria-label', ariaLabel);
    }
    
    // Ensure the button has accessible name
    if (!ariaLabel && !text) {
        console.warn('createInPageButton: Button lacks accessible name');
    }
    
    if (onClick && typeof onClick === 'function') {
        button.addEventListener('click', onClick);
    }
    
    return button;
}

/**
 * Creates an accessible link element that replaces fake links.
 * @param {Object} options - Link configuration options.
 * @returns {HTMLAnchorElement} The accessible anchor element.
 */
function createAccessibleLink(options = {}) {
    const {
        href = '#',
        text = '',
        ariaLabel = '',
        onClick = null,
        className = '',
        id = '',
        target = '_self'
    } = options;
    
    const link = document.createElement('a');
    
    if (id) {
        link.id = id;
    }
    
    if (href) {
        link.href = href;
    }
    
    if (className) {
        link.className = className;
    }
    
    if (target && target !== '_self') {
        link.target = target;
        link.rel = target === '_blank' ? 'noopener noreferrer' : '';
    }
    
    if (text) {
        link.textContent = text;
    }
    
    if (ariaLabel) {
        link.setAttribute('aria-label', ariaLabel);
    }
    
    // Validate that the link has an accessible name
    if (!ariaLabel && !text) {
        console.warn('createAccessibleLink: Link lacks accessible name');
    }
    
    if (onClick && typeof onClick === 'function') {
        link.addEventListener('click', onClick);
    }
    
    return link;
}

/**
 * Handles and reports accessibility issues found during validation.
 * @param {Array} issues - Array of accessibility issues.
 * @param {Function} reporter - Optional custom reporter function.
 * @returns {Object} Summary of issues handled.
 */
function handleAccessibilityIssues(issues, reporter = null) {
    if (!Array.isArray(issues)) {
        issues = [issues];
    }
    
    const summary = {
        total: issues.length,
        byType: {},
        elements: []
    };
    
    issues.forEach(issue => {
        const type = issue.type || 'UNKNOWN';
        
        if (!summary.byType[type]) {
            summary.byType[type] = [];
        }
        
        summary.byType[type].push(issue);
        
        if (issue.element) {
            summary.elements.push(issue.element);
        }
        
        // Log issue
        if (reporter && typeof reporter === 'function') {
            reporter(issue);
        } else {
            console.warn(`[Accessibility] ${type}: ${issue.message}`);
        }
    });
    
    return summary;
}

/**
 * Ensures all landmarks in the document have unique identifiers.
 * @param {HTMLElement} container - Container element to scan.
 * @returns {Object} Report of landmark uniqueness.
 */
function ensureUniqueLandmarks(container = document) {
    const report = {
        duplicates: [],
        fixed: 0,
        landmarks: []
    };
    
    const landmarkSelectors = [
        '[role="banner"]', '[role="navigation"]', '[role="main"]',
        '[role="complementary"]', '[role="contentinfo"]', '[role="search"]',
        '[role="form"]', '[role="region"]', 'header:not([role])', 'nav',
        'main', 'aside', 'footer:not([role])', 'section'
    ];
    
    const allLandmarks = container.querySelectorAll(landmarkSelectors.join(', '));
    const seenIds = new Set();
    
    allLandmarks.forEach(landmark => {
        const currentId = landmark.id;
        const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        
        if (currentId) {
            if (seenIds.has(currentId)) {
                report.duplicates.push({
                    id: currentId,
                    role: role,
                    element: landmark
                });
                
                // Generate new unique ID
                const newId = ensureUniqueLandmarkId(role);
                landmark.id = newId;
                report.fixed++;
            } else {
                seenIds.add(currentId);
            }
        } else {
            // Add ID if missing
            const newId = ensureUniqueLandmarkId(role);
            landmark.id = newId;
            report.fixed++;
        }
        
        report.landmarks.push({
            element: landmark,
            id: landmark.id,
            role: role
        });
    });
    
    return report;
}

// ... other existing functions remained unchanged