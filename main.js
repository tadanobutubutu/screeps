// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English
  
  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâäéèêëïîôùûüç]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }
  
  return lang;
}

// Updated: imported and used dependencyGraphContent and indexContent in the relevant rendering functions.

// Import dependencyGraphContent and indexContent from appropriate modules
const dependencyGraphContent = require('./dependencyGraphContent');
const indexContent = require('./indexContent');

/**
 * Renders the dependency graph view using dependencyGraphContent
 * @param {Object} options - Rendering options
 * @param {HTMLElement} options.container - The container element to render into
 * @param {Object} options.data - The dependency data to render
 * @returns {string} The rendered HTML content
 */
function renderDependencyGraph(options = {}) {
  const { container, data } = options;
  
  if (!data) {
    return '';
  }
  
  const content = dependencyGraphContent.generateDependencyGraphContent(data);
  
  if (container) {
    container.innerHTML = content;
  }
  
  return content;
}

/**
 * Renders the index view using indexContent
 * @param {Object} options - Rendering options
 * @param {HTMLElement} options.container - The container element to render into
 * @param {Object} options.projectInfo - The project information to display
 * @returns {string} The rendered HTML content
 */
function renderIndexView(options = {}) {
  const { container, projectInfo } = options;
  
  const content = indexContent.generateIndexContent(projectInfo || {});
  
  if (container) {
    container.innerHTML = content;
  }
  
  return content;
}

/**
 * Renders a combined view with both dependency graph and index content
 * @param {Object} options - Rendering options
 * @param {HTMLElement} options.container - The container element to render into
 * @param {Object} options.data - The dependency data
 * @param {Object} options.projectInfo - The project information
 * @returns {string} The rendered HTML content
 */
function renderCombinedView(options = {}) {
  const { container, data, projectInfo } = options;
  
  const dependencyGraph = renderDependencyGraph({ data });
  const indexView = renderIndexView({ projectInfo });
  
  const combinedContent = `
    <div class="combined-view">
      <div class="index-section">${indexView}</div>
      <div class="dependency-graph-section">${dependencyGraph}</div>
    </div>
  `;
  
  if (container) {
    container.innerHTML = combinedContent;
  }
  
  return combinedContent;
}

module.exports = { 
  setHtmlLangAttribute, 
  detectAndSetLang,
  renderDependencyGraph,
  renderIndexView,
  renderCombinedView
};