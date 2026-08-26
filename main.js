// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from the
// appropriate modules.
// Updated: imported and used dependencyGraphContent and indexContent in the
// relevant rendering functions.
// Updated: Wrapped rendered content in <main> landmarks for accessibility (REACT_017).

const dependencyGraphContent = require('./content/dependencyGraphContent');
const indexContent = require('./content/indexContent');

module.exports = {
  // Existing exports
  renderDependencyGraph: function(data) {
    // Use dependencyGraphContent to render, wrapped in <main> landmark for accessibility
    return '<main>' + dependencyGraphContent.render(data) + '</main>';
  },
  
  renderIndexView: function(data) {
    // Use indexContent to render, wrapped in <main> landmark for accessibility
    return '<main>' + indexContent.render(data) + '</main>';
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
  }
};