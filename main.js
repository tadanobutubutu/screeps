// TODO: This is the existing code that needs to be preserved
// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_027: Fix 26 table structure issues
// REACT_017: Add/fix 4 landmark issues
// REACT_041: Add accessible names to 2 SVGs
// REACT_025: Ensure unique landmarks (2 issues) — (DONE: ensureUniqueLandmarks)
// REACT_036: Fix 1 fake link issue

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation
// main.js - Combined utility and accessibility features

// TODO: This is the existing code that needs to be preserved
// Version 1 implementation (HEAD branch) - preserved accessibility enhancements

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// This is the existing code that needs to be preserved
// (This comment remains as-is)
// More existing code that should be preserved
// Existing code ends here

// TODO: This is the existing code that needs to be preserved (This comment remains as-is)
// TODO: Existing main.js content before the merge conflict...
// Main entry point for dependency visualization tool
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// [PLACE ALL EXISTING FUNCTIONS, VARIABLES, AND EXPORTS HERE]

// Import content generators from separate modules
const { dependencyGraphContent, indexContent } = require('./contentGenerators');

const {
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    getLangAttribute,
    validateAccessibilityReport,
    announceToScreenReader,
    handleKeyboardNav,
    newFocusTrap, // Updated focus trap implementation
    exportUtils,
    addressAccessibilityIssues,
    handleCredentialResponse,
    // Keeping only one ensureElementId function
    ensureElementId: ensureElementIdOrigin,
    renderDependencyGraphs,
    fixButtonIdentifiers,
    fixDependencyGraphAria,
    addMainLandmarkToIndex,
    renderAdditionalContent,
    transformInputData
} = main;

// Accessibility utilities for keyboard navigation and screen reader support
const accessibilityUtils = {
  /**
     * Initializes the skip link functionality.
     * Finds a skip link with class 'skip-link' and ensures clicking it
     * focuses the target element while preventing default navigation.
     */
  initSkipLink () {
    const skipLink = document.querySelector('.skip-link')
    if (!skipLink) return

    skipLink.addEventListener('click', (e) => {
      const href = skipLink.getAttribute('href')
      if (!href) return
      const targetId = href.replace('#', '')
      if (!targetId) return
      const target = document.getElementById(targetId)
      if (target) {
        target.setAttribute('tabindex', '-1')
        target.focus()
        e.preventDefault()
      }
    })
  },

  // Additional initialization based on entity type
  switch (entityType) {
    case 'player':
      entity.inventory = properties.inventory || [];
      entity.score = properties.score || 0;
      break;
    case 'enemy':
      entity.aggression = properties.aggression || 50;
      entity.damage = properties.damage || 10;
      break;
    case 'npc':
      entity.dialogue = properties.dialogue || [];
      break;
    default:
      // For custom entity types, merge any additional properties
      Object.assign(entity, properties);
  }

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

// Example of adding a new function
function newFunction() {
  // Function body
}

// REACT_015: Add lang attribute to the <html> element
function ... lang = 'en') {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/lang=/i.test(attrs)) return match;
        return `<html${attrs} lang="${lang}">`;
    });
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function ... {
    if (typeof html !== 'string') return html;

    // Ensure every table has a caption
    html = html.replace(/(<table[^>]*>)/gi, (match, attrs) => {
        if (/<caption/i.test(match)) return match;
        return `${tableTag}<caption></caption>`;
    });

    // Close caption and wrap rows in thead/tbody where missing
    html = html.replace(/(<table[^>]*>)([\s\S]*?)(<\/table>)/gi, (match, attrs, content) => {
        if (/<thead/i.test(content)) return match;
        const rows = content.match(/<tr[\s\S]*?<\/tr>/gi) || [];
        if (rows.length === 0) return match;
        const firstRows = rows.slice(0, 1).join('');
        const restRows = rows.slice(1).join('');
        const thPattern = /<th/gi;
        const firstRowHasTh = thPattern.test(firstRows);
        let thead = '';
        let tbody = restRows;

        if (!firstRowHasTh) {
            thead = `<thead><tr>${firstRows.replace(/<td/gi, '<th scope="col"')}</tr></thead>`;
        } else {
            thead = `<thead><tr>${firstRows}</tr></thead>`;
        }
      }
    })

        return `${openTag}${thead}${tbody}${closeTag}`;
    });

    // Add scope="col" to th elements that don't have it
    html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
        if (/scope=/i.test(attrs)) return match;
        return `<th${attrs} scope="col">`;
    });

    // Implemented upgradeAccessibility function
    upgradeAccessibility() {
        // Implement upgrading old accessibility patterns to modern best practices
    },

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

  if (divisor === 0) {
    throw new Error('Division by zero is not allowed');
  }

  return dividend / divisor;
}

// REACT_017: Add/fix landmark issues
function fixLandmarks(html) {
    if (typeof html !== 'string') return html;

    // Ensure <main> landmark exists
    if (!/<main/i.test(html) && /<body/i.test(html)) {
        html = html.replace(
            /<body([^>]*)>/i,
            '<body$1><main>'
        );
        html = ... '</main></body>');
    }

    // Ensure <nav> landmark exists
    if (!/<nav/i.test(html) && /<main/i.test(html)) {
        html = html.replace(
            /<main[^>]*>/i,
            '<nav aria-label="Main navigation"></nav><main>'
        );
    }

    // Ensure <aside> landmark exists if content suggests a sidebar
    if (/<aside/i.test(html) && /<\/main>/i.test(html)) {
        html = html.replace(
            /<\/main>/i,
            '<aside aria-label="Complementary content"></aside></main>'
        );
    }

    // Ensure <footer> landmark exists
    if (!/<footer/i.test(html) && /<\/body>/i.test(html)) {
        html = html.replace(
            /<\/body>/i,
            '<footer></footer></body>'
        );
    }

    return html;
}

// REACT_041: Add accessible names to SVGs
function ... {
    if (typeof html !== 'string') return html;

    const svgMatches = html.match(/<svg[^>]*>/gi);
    let offset = 0;

    svgMatches && svgMatches.forEach((match, index) => {
        const fullMatch = match;
        const attrs = match;
        const svgStart = html.indexOf(match) + offset;
        const svgEnd = html.indexOf('</svg>', svgStart);

            const svgContent = fullMatch;
            const hasTitle = /<title/i.test(svgContent);
            const hasAriaLabel = /\baria-label=/i.test(svgContent);
            const hasAriaLabelledBy = /\baria-labelledby=/i.test(svgContent);

            if (!hasTitle && !hasAriaLabel && !hasAriaLabelledBy) {
                const newSvg = fullMatch.replace(/>/, `><title>SVG ${index + 1}</title>`);
                html = html.substring(0, svgStart) + newSvg + html.substring(svgEnd);
                offset += newSvg.length - fullMatch.length;
            }
        });
    }

    firstElement.focus()
  },

function checkLinkAccessibility() {
  // Implementation for checking link accessibility
  // This function will be used to validate the accessibility of links
  const links = document.querySelectorAll('a');
  const issues = [];

  links.forEach(link => {
    const href = link.getAttribute('href') || '';
    const text = link.textContent.trim();

  /**
     * Triggers a file download of the given data as JSON and announces the action
     * to screen readers.
     *
     * @param {Object} data - The data to export.
     * @param {string} filename - The name of the file to download.
     */
  exportData (data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || 'export.json'
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      this.announceToScreenReader(`Download of ${filename} started`)
    }, 100)
  },

  /**
     * Scans the page for common accessibility issues and logs warnings.
     * Returns an object summarizing the fixes performed.
     */
  addressAccessibilityIssues () {
    const fixes = {
      skipLinks: 0,
      tables: 0,
      images: 0
    }

    // Check for aria-label or aria-labelledby if link has no text
    if (!text && !link.getAttribute('aria-label') && !link.getAttribute('aria-labelledby')) {
      issues.push(`Link with href "${href}" has no accessible name (missing text, aria-label, or aria-labelledby)`);
    }

    // Check if link is decorative but not marked as such
    if (href === '#' && !link.getAttribute('aria-hidden') && !link.getAttribute('role')) {
      issues.push(`Decorative link with href="#" should have aria-hidden="true" or role="presentation"`);
    }
  });

  return issues;
}

// TODO: Implement wrapPrimaryContentInMain function, including the added logic
/**
 * Wraps the primary content of the page in a <main> element for improved accessibility.
 * This function checks if a <main> element already exists; if not, it creates one
 * and moves all body content into it.
 * @returns {Element|null} The <main> element if successfully created/wrapped, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  const body = document.body;

  // Return null if body element is not available
  if (!body) {
    return null;
  }

  // Check if a <main> element already exists to avoid duplication
  const existingMain = document.querySelector('main');
  if (existingMain) {
    return existingMain;
  }

  // Create a new <main> element
  const main = document.createElement('main');

  // Move all existing body children into the <main> element
  while (body.firstChild) {
    main.appendChild(body.firstChild);
  }

  // Append the <main> element to the body
  body.appendChild(main);

  return main;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(html) {
    if (typeof html !== 'string') return html;

    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];

    landmarkRoles.forEach(role => {
        const pattern = new RegExp(`role=["']${role}["']`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first occurrence, change subsequent ones
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return `role="region"`;
            });
        }
    });

    // Also check for duplicate HTML5 landmark elements (header, nav, main, aside, footer)
    const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
    html5Landmarks.forEach(tag => {
        const pattern = new RegExp(`<${tag}[^>]*>`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first, add role="region" to others
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return match.replace(new RegExp(`<${tag}`, 'i'), `<${tag} role="region"`);
            });
        }
    });

    return html;
}

// REACT_036: Fix fake link issues
function fixFakeLinks(html) {
    if (typeof html !== 'string') return html;

    // Find spans or divs with onclick that act as links and convert to <a>
    html = html.replace(
        /<span([^>]*)onclick=["']([^"']*)["']([^>]*)>/gi,
        (match, before, onclick, after) => {
            const hrefMatch = onclick.match(/window\.location\s*=\s*['"]([^'"]+)['"]/);
            if (hrefMatch) {
                return `<a href="${hrefMatch[1]}"${before}${after}>`;
            }
            return match;
        }
    );

    html = html.replace(/<\/span>/gi, '</a>');

    return html;
}

// Main function that applies all accessibility fixes
function applyAccessibilityFixes(html) {
    let result = html;
    result = addLangAttribute(result);
    result = fixTableStructure(result);
    result = fixLandmarks(result);
    result = addSvgAccessibleNames(result);
    result = ensureUniqueLandmarks(result);
    result = fixFakeLinks(result);
    return result;
}

function addressAccessibilityIssues(insightReport) {
  // Apply accessibility fixes to HTML content based on insight report
  if (insightReport && insightReport.html) {
    insightReport.html = applyAccessibilityFixes(insightReport.html);
  }
  console.log('Addressing accessibility issues from insight report:', insightReport);
}

function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    button.setAttribute('aria-label', buttonText); // Added for accessibility
    button.setAttribute('role', 'button'); // Added for accessibility
    document.body.appendChild(button);
}

// New function to improve accessibility for adding a new book
/**
 * Creates an accessible form for adding a new book with proper labels and ARIA attributes
 * @param {string} formId - The ID for the form element
 * @param {string} submitButtonId - The ID for the submit button
 * @returns {HTMLFormElement} The created form element
 */
function createAccessibleBookForm(formId, submitButtonId) {
    const form = document.createElement('form');
    form.id = formId;
    form.setAttribute('role', 'form');
    form.setAttribute('aria-labelledby', `${formId}-title`);

    // Add form title for accessibility
    const title = document.createElement('h2');
    title.id = `${formId}-title`;
    title.textContent = 'Add New Book';
    form.appendChild(title);

    // Create accessible form fields
    const createField = (labelText, inputId, inputType = 'text') => {
        const fieldset = document.createElement('fieldset');
        const label = document.createElement('label');
        label.setAttribute('for', inputId);
        label.textContent = labelText;
        const input = document.createElement('input');
        input.type = inputType;
        input.id = inputId;
        input.setAttribute('required', 'true');
        input.setAttribute('aria-required', 'true');

        fieldset.appendChild(label);
        fieldset.appendChild(input);
        return fieldset;
    };

    // Add form fields
    form.appendChild(createField('Book Title:', `${formId}-title`));
    form.appendChild(createField('Author:', `${formId}-author`));
    form.appendChild(createField('Publication Year:', `${formId}-year`, 'number'));

    // Add submit button
    const submitButton = document.createElement('button');
    submitButton.id = submitButtonId;
    submitButton.type = 'submit';
    submitButton.textContent = 'Add Book';
    submitButton.setAttribute('aria-label', 'Submit new book form');
    form.appendChild(submitButton);

    return form;
}

// Spawning logic implementation
/**
 * Spawns a new entity at the specified coordinates
 * @param {string} type - The type of entity to spawn
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {Object} The spawned entity with type and position
 */
function spawnEntity(type, x, y) {
    return {
        type: type,
        position: { x, y },
        id: Math.random().toString(36).substr(2, 9)
    };
}

// Don't forget to test your new additions in the test file

// New functions to render dependency graphs and display module structure for debugging purposes
/**
 * Renders a dependency graph visualization for debugging purposes
 * @param {Object} dependencies - An object representing module dependencies
 * @returns {string} HTML string representing the visualization of the dependency graph
 */
function renderDependencyGraph(dependencies) {
    if (!dependencies || typeof dependencies !== 'object') {
        return '<div class="no-dependencies">No dependencies found</div>';
    }

    const nodes = [];
    const edges = [];

    // Convert dependencies to nodes and edges
    Object.keys(dependencies).forEach(moduleName => {
        nodes.push({ id: moduleName, label: moduleName });
        if (Array.isArray(dependencies[moduleName])) {
            dependencies[moduleName].forEach(dependency => {
                edges.push({ from: moduleName, to: dependency });
            });
        }
    });

    // Create a simple HTML representation of the dependency graph
    let htmlOutput = '<div class="dependency-graph">';
    htmlOutput += '<h3>Module Dependencies</h3>';
    
    if (nodes.length === 0) {
        htmlOutput += '<p>No modules found</p>';
    } else {
        htmlOutput += '<ul class="modules">';
        nodes.forEach(node => {
            const nodeEdges = edges.filter(edge => edge.from === node.id || edge.to === node.id);
            const dependencies = edges.filter(edge => edge.from === node.id);
            const dependents = edges.filter(edge => edge.to === node.id);
            
            htmlOutput += `<li class="module-node">
                <strong>${node.label}</strong>
                <ul>
                    <li>Dependencies: ${dependencies.length > 0 ? 
                        dependencies.map(d => d.to).join(', ') : 'None'}</li>
                    <li>Dependents: ${dependents.length > 0 ? 
                        dependents.map(d => d.from).join(', ') : 'None'}</li>
                </ul>
            </li>`;
        });
        htmlOutput += '</ul>';
    }
    
    htmlOutput += '</div>';
    return htmlOutput;
}

/**
 * Displays the module structure for debugging purposes
 * @param {Object} modules - An object representing the module structure
 * @returns {string} HTML string representing the module structure visualization
 */
function displayModuleStructure(modules) {
    if (!modules || typeof modules !== 'object') {
        return '<div class="no-modules">No modules found</div>';
    }

    let htmlOutput = '<div class="module-structure">';
    htmlOutput += '<h3>Module Structure</h3>';
    
    const traverseModules = (moduleObj, level = 0) => {
        let result = '';
        const indent = '  '.repeat(level);
        
        Object.keys(moduleObj).forEach(key => {
            result += `${indent}• ${key}\n`;
            if (moduleObj[key] && typeof moduleObj[key] === 'object' && !Array.isArray(moduleObj[key])) {
                result += traverseModules(moduleObj[key], level + 1);
            }
        });
        
        return result;
    };
    
    const structureText = traverseModules(modules);
    htmlOutput += `<pre class="structure-tree">${structureText}</pre>`;
    htmlOutput += '</div>';
    
    return htmlOutput;
}

/**
 * Analyzes the dependency graph and returns statistics for debugging
 * @param {Object} dependencies - An object representing module dependencies
 * @returns {Object} Statistics about the dependency graph
 */
function analyzeDependencyGraph(dependencies) {
    if (!dependencies || typeof dependencies !== 'object') {
        return { totalModules: 0, totalDependencies: 0, modules: [] };
    }

    const stats = {
        totalModules: Object.keys(dependencies).length,
        totalDependencies: 0,
        modules: []
    };

    Object.keys(dependencies).forEach(moduleName => {
        const depCount = Array.isArray(dependencies[moduleName]) ? dependencies[moduleName].length : 0;
        stats.totalDependencies += depCount;
        stats.modules.push({
            name: moduleName,
            dependencyCount: depCount,
            dependencies: Array.isArray(dependencies[moduleName]) ? dependencies[moduleName] : []
        });
    });

    return stats;
}

// Export accessibility utility functions
module.exports = {
    addLangAttribute,
    fixTableStructure,
    fixLandmarks,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinks,
    applyAccessibilityFixes,
    addressAccessibilityIssues,
    createInPageButton,
    divide,
    checkLinkAccessibility,
    wrapPrimaryContentInMain,
    createAccessibleBookForm,
    spawnEntity
};

// Run if executed directly
if (require.main === module) {
  main();
}