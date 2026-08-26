// TODO: Address accessibility issues from insight report
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

const dependencyGraphContent = require('./content/dependencyGraphContent');
const indexContent = require('./content/indexContent');

module.exports = {
  // Existing exports
  renderDependencyGraph: function(data) {
    // Use dependencyGraphContent to render
    return dependencyGraphContent.render(data);
  },
  
  renderIndexView: function(data) {
    // Use indexContent to render
    return indexContent.render(data);
  },
  
  // Keep all existing exports unchanged
  init: function() {
    console.log('Initializing...');
  },
  
  handleRequest: function(req, res) {
    if (req.path === '/dependency-graph') {
      return this.renderDependencyGraph(req.query);
    } else if (req.path === '/index') {
      return this.renderIndexView(req.query);
    }
    return null;
  },

  // Function to add accessible names to SVG elements
  addSvgAccessibleName: function(svgElement, accessibleName) {
    if (svgElement && accessibleName) {
      svgElement.setAttribute('aria-label', accessibleName);
    } else if (svgElement) {
      svgElement.setAttribute('aria-hidden', 'true');
    }
  },

  // Add new function to add accessible name to SVG content
  addSvgTitle: function(svgContent) {
    // Add an accessible name to the SVG content by wrapping the text within a <title> tag
    return svgContent.replace(
      /<text([^>]*)>(.*?)<\/text>/g,
      '<title>$2</title><text$1>$2</text>'
    );
  },

  // Function to ensure HTML has proper lang attribute for accessibility
  ensureHtmlLangAttribute: function(htmlContent, lang) {
    const defaultLang = lang || 'en';
    
    // Check if html tag already has lang attribute
    if (/<html[^>]*lang=["'][^"']*["'][^>]*>/i.test(htmlContent)) {
      // Replace existing lang attribute
      return htmlContent.replace(
        /<html([^>]*)lang=["'][^"']*["']([^>]*)>/i,
        '<html$1lang="' + defaultLang + '"$2>'
      );
    } else {
      // Add lang attribute to html tag
      return htmlContent.replace(
        /<html([^>]*)>/i,
        '<html$1 lang="' + defaultLang + '">'
      );
    }
  }
};