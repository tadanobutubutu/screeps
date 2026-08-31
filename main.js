const express = require('express');
const { createServer, Model } = require('screeps-server');
const { clearCache, initializeApp } = require('./screeps-bootstrap');

// Initialize the Screeps server and express app.
const server = createServer({
  model: new Model()
});

const app = express();
const PORT = process.env.PORT || 5000;

// Accessibility controller to handle insight report issues
class AccessibilityController {
  async addressAccessibilityIssues(insightReport) {
    if (!insightReport || !insightReport.issues) {
      return;
    }

    insightReport.issues.forEach(issue => {
      switch (issue.type) {
        case 'REACT_015':
          // Add lang attribute to HTML element
          if (issue.element) {
            issue.element.setAttribute('lang', 'en');
          }
          break;
        case 'REACT_017':
          // Add landmark roles and fix landmark issues
          if (issue.element) {
            if (!issue.element.getAttribute('role')) {
              issue.element.setAttribute('role', 'main');
            }
          }
          break;
        case 'REACT_041':
          // Add accessible names to SVGs
          if (issue.element) {
            issue.element.setAttribute('role', 'img');
            issue.element.setAttribute('aria-label', issue.accessibleName || 'Accessible SVG Icon');
          }
          break;
        case 'REACT_025':
          // Ensure unique landmarks
          console.log('Ensuring unique landmarks');
          break;
        case 'REACT_036':
          // Fix fake link issues
          if (issue.element && issue.element.tagName === 'A' && !issue.element.getAttribute('href')) {
            issue.element.setAttribute('role', 'button');
          }
          break;
        case 'REACT_027':
          // Add scope to table elements
          if (issue.element && issue.element.tagName === 'TH') {
            if (!issue.element.getAttribute('scope')) {
              issue.element.setAttribute('scope', issue.element.parentNode.tagName === 'THEAD' ? 'col' : 'row');
            }
          }
          break;
        default:
          console.log('Unknown issue type:', issue.type);
      }
    });
  }
}

// Split routes for Screeps and React.
const routes = express.Router();
routes.get('/', (req, res) => {
  res.render('index', { appData });
});
app.use('/', routes);

// Run the Screeps server and React app in separate processes.
server.listen(() => {
  console.log('Screeps server started.');
});

// Cleanup and initialize the application before serving
clearCache();
initializeApp(app, PORT);

app.listen(PORT, () => {
  console.log(`App server started on port ${PORT}`);
});

// Export the combined code as a module.
module.exports = { server, app, AccessibilityController };