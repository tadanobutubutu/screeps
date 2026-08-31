// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');

// Existing rendering functions (preserving existing exports and functions)

/**
 * Renders the dependency graph view
 * @param {Object} deps - Dependencies object
 * @param {Object} options - Rendering options
 * @returns {string} Rendered dependency graph HTML
 */
function renderDependencyGraph(deps, options = {}) {
  // Use dependencyGraphContent from the imported module
  return dependencyGraphContent(deps, options);
}

/**
 * Renders the main index view
 * @param {Object} data - View data
 * @param {Object} options - Rendering options
 * @returns {string} Rendered index HTML
 */
function renderIndex(data, options = {}) {
  // Use indexContent from the imported module
  return indexContent(data, options);
}

/**
 * Enhances HTML output with accessibility improvements
 * @param {string} html - Raw HTML content
 * @param {Object} options - Enhancement options
 * @returns {string} Accessibility-enhanced HTML
 */
function enhanceAccessibility(html, options = {}) {
  if (!html || typeof html !== 'string') {
    return html;
  }

  let enhanced = html;

  // Add missing lang attribute to html tag if not present
  if (!enhanced.match(/<html[^>]*\blang\s*=/i)) {
    enhanced = enhanced.replace(/<html([^>]*)>/i, '<html$1 lang="en">');
  }

  // Ensure images have alt attributes (basic check)
  enhanced = enhanced.replace(/<img(?![^>]*\balt\s*=)([^>]*)>/gi, '<img$1 alt="">');

  // Add role="main" to main content area if missing
  if (!enhanced.match(/<main[^>]*\brole\s*=/i) && enhanced.includes('<main')) {
    enhanced = enhanced.replace(/<main([^>]*)>/i, '<main$1 role="main">');
  }

  // Add role="navigation" to nav elements if missing
  if (!enhanced.match(/<nav[^>]*\brole\s*=/i) && enhanced.includes('<nav')) {
    enhanced = enhanced.replace(/<nav([^>]*)>/i, '<nav$1 role="navigation">');
  }

  // Add role="button" to button-like elements with onclick but no role
  enhanced = enhanced.replace(
    /<(div|span|a)([^>]*\bonclick\s*=[^>]*)>/gi,
    (match, tag, attrs) => {
      if (!attrs.includes('role=')) {
        return `<${tag}${attrs} role="button" tabindex="0">`;
      }
      return match;
    }
  );

  return enhanced;
}

/**
 * Renders dependency graph with accessibility enhancements
 * @param {Object} deps - Dependencies object
 * @param {Object} options - Rendering options
 * @returns {string} Accessibility-enhanced dependency graph HTML
 */
function renderDependencyGraphAccessible(deps, options = {}) {
  const html = renderDependencyGraph(deps, options);
  return enhanceAccessibility(html, options);
}

/**
 * Renders index view with accessibility enhancements
 * @param {Object} data - View data
 * @param {Object} options - Rendering options
 * @returns {string} Accessibility-enhanced index HTML
 */
function renderIndexAccessible(data, options = {}) {
  const html = renderIndex(data, options);
  return enhanceAccessibility(html, options);
}

// Preserve all existing exports
module.exports = {
  renderDependencyGraph,
  renderIndex,
  // New accessibility-enhanced exports
  enhanceAccessibility,
  renderDependencyGraphAccessible,
  renderIndexAccessible,
  // Preserve any other existing exports here
};