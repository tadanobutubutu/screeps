const express = require('express');
const app = express();

function fixDependencyDashboard() {
  const fs = require('fs');
  const path = require('path');
  const workflowPath = path.join(__dirname, '.github', 'workflows', 'gitstream.yml');
  if (fs.existsSync(workflowPath)) {
    let content = fs.readFileSync(workflowPath, 'utf8');
    content = content.replace(
      /linear-bots\/gitstream-github-action\s+v2/g,
      'linear-bots/gitstream-github-action@v2'
    );
    fs.writeFileSync(workflowPath, content, 'utf8');
  }
}

module.exports = app;
module.exports.fixDependencyDashboard = fixDependencyDashboard;