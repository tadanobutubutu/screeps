// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from the
// appropriate modules.
// Updated: imported and used dependencyGraphContent and indexContent in the
// relevant rendering functions.

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
      return this.renderDependencyGraph(req.data);
    } else if (req.path === '/index') {
      return this.renderIndexView(req.data);
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
  addAccessibleNameToSVG: function(svgContent) {
    // Add an accessible name to the SVG content by wrapping the text within a <title> tag
    return svgContent.replace(
      /<text[^>]*>(.*?)<\/text>/g,
      '<title>$1</title><text$&>'
    );
  }
};