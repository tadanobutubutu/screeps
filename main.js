/**
 * Accessibility improvements for main.js
 * Addresses issues from insight report:
 * - REACT_015: Add lang attribute to HTML element
 * - REACT_027: Fix 26 table structure issues
 * - REACT_017: Add/fix 2 landmark issues
 * - REACT_041: Add accessible names to 2 SVGs
 * - REACT_025: Ensure unique landmarks
 * - REACT_036: Fix 1 fake link issue
 */

// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)

/**
 * Adds lang attribute to HTML element
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with lang attribute added
 */
export function ... {
  if (typeof html !== 'string') return html;
  
  return ... (match, attrs) => {
    // Check if lang attribute already exists
    if (!attrs || attrs.includes(' lang=')) {
      return match;
    }
    // Add lang attribute with 'en' as default
    return `<html${attrs} lang="en">`;
  });
}

/**
 * Fixes table structure issues for accessibility
 * Ensures tables have proper headers, captions, and structure
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with fixed table structures
 */
export function ... {
  if (typeof html !== 'string') return html;
  
  let result = html;
  
  // Fix tables that need proper scope attributes on headers
  result = ... (match, attrs) => {
    if (attrs && ... {
      return match;
    }
    return `<th${attrs} scope="col">`;
  });
  
  // Ensure tables have associated caption or summary
  result = ... (match, attrs) => {
    if (attrs && ... || ... {
      return match;
    }
    // Add summary attribute for screen readers
    return `<table${attrs} summary="Data table">`;
  });
  
  // Ensure proper thead/tbody structure
  result = ... (match, attrs) => {
    // Check if tbody already exists before this tr
    const trIndex = ...
    const beforeTr = result.substring(0, trIndex);
    if (beforeTr && ... && ... {
      return `<tbody>${match}`;
    }
    return match;
  });
  
  // Close tbody tags that aren't properly closed
  const tableMatches = ... || [];
  tableMatches.forEach(table => {
    const hasThead = /<thead/i.test(table);
    const hasTbody = /<tbody/i.test(table);
    const hasTfoot = /<tfoot/i.test(table);
    
    if (hasThead || hasTbody || hasTfoot) {
      // Ensure proper structure - tbody should wrap data rows
      if (hasTbody && ... {
        result = result.replace(table, ... '$1<tbody>$2</tbody>$3'));
      }
    }
  });
  
  return result;
}

/**
 * Adds main landmark to HTML for proper document structure
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with main landmark added
 */
export function addMainLandmark(html) {
  if (typeof html !== 'string') return html;
  
  // Check if main landmark already exists
  if ... {
    return html;
  }
  
  // Try to match body content
  const bodyMatch = ...
  if (bodyMatch) {
    const bodyAttrs = bodyMatch[1];
    const bodyContent = bodyMatch[2];
    const wrappedContent = `<main ...
    return ... ...
  }
  
  return html;
}

/**
 * Adds accessible names to SVG elements
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with accessible SVG names
 */
export function ... {
  if (typeof html !== 'string') return html;
  
  let svgCounter = 0;
  
  return ... (match, attrs) => {
    const existingLabel = attrs.match(/aria-label=/) || ...
    
    if (existingLabel) {
      return match;
    }
    
    // Extract title if present
    const titleMatch = ...
    let label = titleMatch ? titleMatch[1] : `SVG image ${++svgCounter}`;
    
    // Check for id to reference
    const idMatch = ...
    if (idMatch) {
      return `<svg${attrs} role="img" ...
    }
    
    // Add inline title for accessibility
    const titleId = ...
    return `<svg${attrs} role="img" aria-labelledby="${titleId}"><title ...
  });
}

/**
 * Ensures unique landmark identifiers for screen readers
 * Converts additional <main> landmarks to <section> so only one <main> exists per page.
 * Also assigns unique IDs to other landmark types.
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with unique landmarks
 */
export function ... {
  if (typeof html !== 'string') return html;
  
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  const counters = {};
  
  // Initialize counters for each landmark type
  landmarks.forEach(lm => {
    const regex = new RegExp(`<${lm}\\b`, 'gi');
    const matches = html.match(regex);
    if (matches) {
      counters[lm] = matches.length;
    }
  });
  
  // First, ensure only one <main> landmark exists.
  // Convert subsequent <main> elements to <section> with aria-label.
  let mainSeen = false;
  html = ... (match, attrs) => {
    if (!mainSeen) {
      mainSeen = true;
      return match;
    }
    // Replace additional <main> tags with <section> while preserving any attributes
    const safeAttrs = attrs || '';
    // Avoid duplicating an aria-label if one already exists
    if ... || ... {
      return ...
    }
    return `<section${safeAttrs} aria-label="Content section">`;
  });
  
  // Also update closing tags for converted <main> elements
  // Count occurrences of <main> opening tags in the original-like state and
  // match closing tags. Since we replaced extra <main> with <section>, we must
  // replace the corresponding extra </main> closing tags with </section>.
  const mainOpenCount = (html.match(/<main\b/gi) || []).length;
  const mainCloseCount = (html.match(/<\/main>/gi) || []).length;
  if (mainCloseCount > mainOpenCount) {
    const extras = mainCloseCount - mainOpenCount;
    let replaced = 0;
    html = ... (match) => {
      if (replaced < extras) {
        replaced += 1;
        return '</section>';
      }
      return match;
    });
  }
  
  // Recompute counters after main -> section conversion
  landmarks.forEach(lm => {
    const regex = new RegExp(`<${lm}\\b`, 'gi');
    const matches = html.match(regex);
    counters[lm] = matches ? matches.length : 0;
  });
  
  // Assign unique IDs to remaining landmarks
  landmarks.forEach(lm => {
    const count = counters[lm] || 0;
    if (count === 0) return;
    const seen = {};
    const openRegex = new ... 'gi');
    html = html.replace(openRegex, (match, inner) => {
      // Skip if an id attribute is already present
      if (inner && inner.includes('id=')) {
        return match;
      }
      seen[lm] = (seen[lm] || 0) + 1;
      const id = `${lm}-${seen[lm]}`;
      return `<${lm} id="${id}"${inner || ''}>`;
    });
  });
  
  return html;
}

/**
 * Fixes 1 fake link issue
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with fixed fake link issues
 */
export function ... {
  if (typeof html !== 'string') return html;
  
  // Fix any fake links that do not have a valid href attribute
  return ... (match, attrs) => {
    if (attrs && ... {
      return match;
    }
    return match.replace(/<a/, '<a href="#"');
  });
}

/**
 * Renders a dependency graph for debugging purposes
 * Shows the relationships between modules and their dependencies
 * @param {Object} dependencies - Object containing module dependencies
 * @param {Object} options - Configuration options for rendering
 * @returns {string} ASCII representation of the dependency graph
 */
export function renderDependencyGraph(dependencies, options = {}) {
  if (!dependencies || typeof dependencies !== 'object') {
    return 'No dependencies provided';
  }
  
  const { maxDepth = 3, showVersions = false, showTypes = false } = options;
  
  const renderModule = (name, depth = 0, visited = new Set()) => {
    if (depth > maxDepth || visited.has(name)) {
      return '';
    }
    
    visited.add(name);
    const indent = '  '.repeat(depth);
    const prefix = depth === 0 ? '' : '├─ ';
    const version = showVersions && dependencies[name]?.version 
      ? ` (v${dependencies[name].version})` 
      : '';
    const type = showTypes && dependencies[name]?.type
      ? ` [${dependencies[name].type}]`
      : '';
    
    let output = `${indent}${prefix}${name}${version}${type}\n`;
    
    if (dependencies[name]?.deps && Array.isArray(dependencies[name].deps)) {
      const deps = dependencies[name].deps;
      deps.forEach((dep, index) => {
        const isLast = index === deps.length - 1;
        const childPrefix = isLast ? '└─ ' : '├─ ';
        output += renderModule(dep, depth + 1, visited).replace(/^/, indent + (isLast ? '  ' : '│ ')).replace(/^.{0,2}/, childPrefix);
      });
    }
    
    return output;
  };
  
  let output = 'Dependency Graph:\n';
  output += '================\n\n';
  
  const rootModules = Object.keys(dependencies).filter(mod => {
    return !Object.values(dependencies).some(depObj => 
      depObj.deps && depObj.deps.includes(mod)
    );
  });
  
  if (rootModules.length === 0) {
    rootModules.push(...Object.keys(dependencies));
  }
  
  const shown = new Set();
  rootModules.forEach((mod, index) => {
    const isLast = index === rootModules.length - 1;
    if (!shown.has(mod)) {
      output += renderModule(mod, 0, shown);
      if (!isLast) output += '\n';
    }
  });
  
  return output;
}

/**
 * Displays module structure for debugging purposes
 * Shows exports, imports, and other module metadata
 * @param {Object} moduleInfo - Object containing module structure information
 * @param {Object} options - Configuration options for display
 * @returns {string} Formatted string representation of module structure
 */
export function displayModuleStructure(moduleInfo, options = {}) {
  if (!moduleInfo || typeof moduleInfo !== 'object') {
    return 'No module information provided';