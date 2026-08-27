const dependencyGraphContent = require('./modules/dependencyGraph.js').dependencyGraphContent;
const indexContent = require('./modules/indexView.js').indexContent;

app.post('/api/table/generate', (req, res) => {
    try {
        const tableData = req.body.data;
        const formattedTable = formatTable(tableData);
        // Adding table structure fix here
        const structuredTable = {
            __html: formattedTable,
            tagName: 'table'
        };
        res.json({ success: true, table: structuredTable });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

function renderDependencyGraph(containerId, dependencies) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  const graphHtml = dependencyGraphContent(dependencies);
  container.innerHTML = graphHtml;
  return container;
}

function renderIndexView(containerId, files) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  const indexHtml = indexContent(files);
  container.innerHTML = indexHtml;
  return container;
}

function initializeApp() {
  console.log('Application initialized');
}

function getAppVersion() {
  return '1.0.0';
}

// Main entry point
function main() {
  // Implement main functionality here...
  console.log('Running main entry point');
}

exports.renderDependencyGraph = renderDependencyGraph;
exports.renderIndexView = renderIndexView;
exports.initializeApp = initializeApp;
exports.getAppVersion = getAppVersion;
exports.main = main;