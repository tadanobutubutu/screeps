// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from the
// appropriate modules.
// Updated: imported and used dependencyGraphContent and indexContent in the
// relevant rendering functions.

const dependencyGraphContent = {
  render: function(data) {
    // Return rendered dependency graph HTML
    // Fixed: Changed <a href="#"> to <button> for "rotate back" action (REACT_036)
    return `
      <div class="dependency-graph">
        <div class="graph-content">
          ${data.nodes ? data.nodes.map(node => `<div class="node">${node}</div>`).join('') : ''}
        </div>
        <button id="unrotate" type="button">rotate back</button>
      </div>
    `;
  }
};
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
      return dependencyGraphContent.render(res.locals.data || {});
    } else if (req.path === '/index') {
      return indexContent.render(res.locals.data || {});
    }
    return null;
  }
};