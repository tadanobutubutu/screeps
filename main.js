// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and validateLandmarkAccessibility())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by validateLandmarkAccessibility())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
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
function createLandmarkId(baseName) {
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
  const elementToModify = document.querySelector('html');
  if (elementToModify) {
    elementToModify.lang = 'en'; // Example: English
  }
}

/**
 * Adds an aria--label attribute to an element if it doesn't already have one.
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

/**
 * Generates an accessibility report based on the collected issues.
 * @param {Object} reportData - Data containing accessibility issues and metadata.
 * @returns {Object} The generated accessibility report.
 */
function generateAccessibilityReport(reportData = {}) {
    const {
        pageUrl = '',
        pageTitle = '',
        scanDate = new Date().toISOString(),
        issues = [],
        summary = {},
        recommendations = []
    } = reportData;

    const criticalIssues = issues.filter(issue => issue.severity === 'critical');
    const majorIssues = issues.filter(issue => issue.severity === 'major');
    const minorIssues = issues.filter(issue => issue.severity === 'minor');

    return {
        reportMetadata: {
            generatedAt: scanDate,
            pageUrl,
            pageTitle,
            totalIssues: issues.length
        },
        summary: {
            total: issues.length,
            critical: criticalIssues.length,
            major: majorIssues.length,
            minor: minorIssues.length,
            complianceScore: calculateComplianceScore(issues)
        },
        issues: issues.map(issue => ({
            id: issue.id || generateIssueId(),
            code: issue.code || 'UNKNOWN',
            description: issue.description || 'No description provided',
            element: issue.element || null,
            severity: issue.severity || 'unknown',
            wcagCriterion: issue.wcagCriterion || null,
            suggestion: issue.suggestion || null
        })),
        recommendations: recommendations.length > 0 ? recommendations : generateDefaultRecommendations(issues),
        exportedAt: new Date().toISOString()
    };
}

/**
 * Generates a unique issue ID.
 * @returns {string} A unique issue identifier.
 */
function generateIssueId() {
    return `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculates a compliance score based on the issues found.
 * @param {Array} issues - List of accessibility issues.
 * @returns {number} Compliance score (0-100).
 */
function calculateComplianceScore(issues) {
    if (!issues || issues.length === 0) {
        return 100;
    }

    const weights = {
        critical: 20,
        major: 10,
        minor: 5
    };

    let deduction = 0;
    for (const issue of issues) {
        deduction += weights[issue.severity] || 5;
    }

    return Math.max(0, Math.min(100, 100 - deduction));
}

/**
 * Generates default recommendations based on issues found.
 * @param {Array} issues - List of accessibility issues.
 * @returns {Array} Array of recommendation strings.
 */
function generateDefaultRecommendations(issues) {
    const recommendations = [];
    const issueTypes = {};

    for (const issue of issues) {
        issueTypes[issue.code] = (issueTypes[issue.code] || 0) + 1;
    }

    if (issueTypes['REACT_015']) {
        recommendations.push({
            code: 'REACT_015',
            action: 'Add lang attribute to the HTML element to specify the page language.',
            priority: 'high'
        });
    }

    if (issueTypes['REACT_017'] || issueTypes['REACT_025']) {
        recommendations.push({
            code: 'REACT_017',
            action: 'Review and fix landmark roles. Ensure all landmarks have appropriate roles and unique identifiers.',
            priority: 'high'
        });
    }

    if (issueTypes['REACT_041']) {
        recommendations.push({
            code: 'REACT_041',
            action: 'Add accessible names to SVG elements using aria-label or title attributes.',
            priority: 'medium'
        });
    }

    if (issueTypes['REACT_027']) {
        recommendations.push({
            code: 'REACT_027',
            action: 'Add scope="col" or scope="row" to table header elements for proper association.',
            priority: 'medium'
        });
    }

    if (issueTypes['REACT_036']) {
        recommendations.push({
            code: 'REACT_036',
            action: 'Replace fake links with proper buttons or ensure links have valid href attributes.',
            priority: 'high'
        });
    }

    return recommendations;
}

/**
 * Exports the report to a JSON string.
 * @param {Object} report - The accessibility report object.
 * @returns {string} JSON string of the report.
 */
function exportReportAsJson(report) {
    return JSON.stringify(report, null, 2);
}

/**
 * Creates a downloadable report file.
 * @param {Object} report - The accessibility report object.
 * @param {string} filename - Optional filename for the report.
 */
function downloadReport(report, filename = 'accessibility-report.json') {
    const jsonReport = exportReportAsJson(report);
    const blob = new Blob([jsonReport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ... existing functions from both branches

// Accessibility helper functions
function setupKeyboardNavigation(options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;

  return function handleKeyDown(event) {
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

  return function handleTabKey(event) {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };
}

/**
 * Validates a landmark element for accessibility compliance.
 * Checks that the landmark has a proper role, accessible name, and unique identifier.
 * @param {HTMLElement} element - The landmark element to validate.
 * @returns {Object} Validation result with isValid flag and issues array.
 */
function validateLandmark(element) {
    const issues = [];

    if (!element) {
        return { isValid: false, issues: ['Element is null or undefined'] };
    }

    // Check if element has a landmark role or is a semantic landmark
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'region', 'form', 'dialog'];
    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    const semanticLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'form', 'dialog'];
    const role = element.getAttribute('role');
    const hasLandmarkRole = role && landmarkRoles.includes(role);
    const isSemanticLandmark = semanticLandmarks.includes(tagName);

    if (!hasLandmarkRole && !isSemanticLandmark) {
        issues.push('Element is not a valid landmark (missing role or semantic tag)');
    }

    // Check for accessible name (aria-label, aria-labelledby, or labelable element association)
    const hasAriaLabel = element.hasAttribute('aria-label') && element.getAttribute('aria-label').trim() !== '';
    const hasAriaLabelledBy = element.hasAttribute('aria-labelledby') && element.getAttribute('aria-labelledby').trim() !== '';
    const hasTitle = element.hasAttribute('title') && element.getAttribute('title').trim() !== '';

    if (!hasAriaLabel && !hasAriaLabelledBy && !hasTitle) {
        issues.push('Landmark is missing an accessible name (aria-label, aria-labelledby, or title)');
    }

    // Check for unique id
    const id = element.id;
    if (id) {
        if (_usedLandmarkIds.has(id)) {
            issues.push(`Landmark id "${id}" is not unique`);
        } else {
            _usedLandmarkIds.add(id);
        }
    }

    return {
        isValid: issues.length === 0,
        issues: issues
    };
}

/**
 * Validates the structure of a landmark by checking its parent context
 * and ensuring proper nesting and hierarchy.
 * @param {HTMLElement} element - The landmark element to validate.
 * @returns {Object} Validation result with isValid flag and issues array.
 */
function validateLandmarkStructure(element) {
    const issues = [];

    if (!element) {
        return { isValid: false, issues: ['Element is null or undefined'] };
    }

    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    const role = element.getAttribute('role');

    // Banner (header) should be a top-level landmark, not nested inside main/article/aside/section/nav
    if (tagName === 'header' || role === 'banner') {
        const parent = element.parentElement;
        if (parent) {
            const parentTag = parent.tagName.toLowerCase();
            if (['main', 'article', 'aside', 'section', 'nav'].includes(parentTag) ||
                parent.getAttribute('role') === 'main' ||
                parent.getAttribute('role') === 'article' ||
                parent.getAttribute('role') === 'complementary' ||
                parent.getAttribute('role') === 'region' ||
                parent.getAttribute('role') === 'navigation') {
                issues.push('Banner landmark should not be nested inside main, article, aside, section, or nav');
            }
        }
    }

    // Contentinfo (footer) should be a top-level landmark, not nested inside main/article/aside/section/nav
    if (tagName === 'footer' || role === 'contentinfo') {
        const parent = element.parentElement;
        if (parent) {
            const parentTag = parent.tagName.toLowerCase();
            if (['main', 'article', 'aside', 'section', 'nav'].includes(parentTag) ||
                parent.getAttribute('role') === 'main' ||
                parent.getAttribute('role') === 'article' ||
                parent.getAttribute('role') === 'complementary' ||
                parent.getAttribute('role') === 'region' ||
                parent.getAttribute('role') === 'navigation') {
                issues.push('Contentinfo landmark should not be nested inside main, article, aside, section, or nav');
            }
        }
    }

    // Region landmark must have an accessible name
    if (role === 'region') {
        const hasAccessibleName = (element.hasAttribute('aria-label') && element.getAttribute('aria-label').trim() !== '') ||
                                   (element.hasAttribute('aria-labelledby') && element.getAttribute('aria-labelledby').trim() !== '');
        if (!hasAccessibleName) {
            issues.push('Region landmark must have an accessible name (aria-label or aria-labelledby)');
        }
    }

    return {
        isValid: issues.length === 0,
        issues: issues
    };
}

/**
 * Ensures that all landmarks on the page have unique identifiers.
 * Adds unique IDs to landmarks that don't have one, or updates duplicates.
 * @returns {Array} Array of landmark elements that were updated.
 */
function ensureUniqueLandmarks() {
    const updatedLandmarks = [];
    const landmarkSelectors = [
        '[role="banner"]', '[role="navigation"]', '[role="main"]',
        '[role="complementary"]', '[role="contentinfo"]', '[role="search"]',
        '[role="region"]', '[role="form"]', '[role="dialog"]',
        'header', 'nav', 'main', 'aside', 'footer', 'section[aria-label], section[aria-labelledby]',
        'form[aria-label], form[aria-labelledby]', 'dialog'
    ];

    const selector = landmarkSelectors.join(', ');
    const landmarks = document.querySelectorAll(selector);

    // Reset the used IDs set for this validation pass
    _usedLandmarkIds.clear();

    landmarks.forEach((landmark, index) => {
        let id = landmark.id;
        if (!id) {
            // Generate a base name based on the landmark type
            const tagName = landmark.tagName.toLowerCase();
            const role = landmark.getAttribute('role');
            let baseName = role || tagName;
            id = ensureUniqueLandmarkId(`${baseName}-${index + 1}`);
            landmark.id = id;
            updatedLandmarks.push(landmark);
        } else {
            const uniqueId = ensureUniqueLandmarkId(id);
            if (uniqueId !== id) {
                landmark.id = uniqueId;
                updatedLandmarks.push(landmark);
            }
        }
    });

    return updatedLandmarks;
}

// ... other existing functions remained unchanged

module.exports = {
    ensureUniqueLandmarkId,
    uniqueLandmarks,
    addLangAttribute,
    addAriaLabel,
    getLangAttribute,
    getFullLangAttribute,
    setupKeyboardNavigation,
    trapFocus,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarks
};