// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from the
// appropriate modules.
// Updated: imported and used dependencyGraphContent and indexContent in the
// relevant rendering functions.

const express = require('express');
const router = express.Router();

// Import dependency graph content from the appropriate module
const { dependencyGraphContent } = require('./modules/dependencyGraphContent');

// Import index content from the appropriate module
const { indexContent } = require('./modules/indexContent');

// Existing imports preserved
const path = require('path');
const fs = require('fs');

/**
 * Renders the dependency graph view
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function renderDependencyGraph(req, res) {
  // Use the imported dependencyGraphContent module
  const graphData = dependencyGraphContent.getGraphData();
  const graphHtml = dependencyGraphContent.renderGraph(graphData);
  
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Dependency Graph</title>
      </head>
      <body>
        <h1>Dependency Graph</h1>
        <div id="graph-container">${graphHtml}</div>
      </body>
    </html>
  `);
}

/**
 * Renders the index view
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function renderIndex(req, res) {
  // Use the imported indexContent module
  const indexHtml = indexContent.renderIndex();
  
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Index</title>
      </head>
      <body>
        <h1>Index</h1>
        <div id="index-container">${indexHtml}</div>
      </body>
    </html>
  `);
}

// Existing routes - preserved
router.get('/graph', renderDependencyGraph);
router.get('/', renderIndex);

// Existing functions - preserved
function getPackageInfo() {
  const packagePath = path.join(process.cwd(), 'package.json');
  return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
}

function analyzeDependencies() {
  const pkg = getPackageInfo();
  return {
    dependencies: pkg.dependencies || {},
    devDependencies: pkg.devDependencies || {}
  };
}

// Export all existing items plus new rendering functions
module.exports = {
  router,
  renderDependencyGraph,
  renderIndex,
  getPackageInfo,
  analyzeDependencies
};