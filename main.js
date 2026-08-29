// Updated code
// <img src="example.jpg" id="image1" alt="Description of the image" /> // Added alt attribute

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

// Additional functionality from origin/main
const fs = require('fs');
const path = require('path');

/**
 * Counts the total number of dependencies in package.json
 * @returns {Object} An object containing counts for dependencies, devDependencies, and total
 */
function countDependencies() {
  const packagePath = path.join(__dirname, 'package.json');
  
  try {
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    const dependencyCount = Object.keys(dependencies).length;
    const devDependencyCount = Object.keys(devDependencies).length;
    
    return {
      dependencies: dependencyCount,
      devDependencies: devDependencyCount,
      total: dependencyCount + devDependencyCount
    };
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    return {
      dependencies: 0,
      devDependencies: 0,
      total: 0
    };
  }
}

module.exports = { 
  setHtmlLangAttribute, 
  detectAndSetLang,
  renderDependencyGraph,
  renderIndexView,
  renderCombinedView,
  countDependencies
};