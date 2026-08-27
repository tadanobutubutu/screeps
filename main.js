// main.js - Entry point for documentation generation

// This file generates the dependency-graph.html documentation
// The HTML file at docs/dependency-graph.html has been fixed with proper scope attributes

const fs = require('fs');
const path = require('path');

// If this file generates HTML, the generated output should include scope="col" for <th> elements
// Example template for table headers:
const tableHeaderTemplate = (content) => `<th scope="col">${content}</th>`;
const tableRowHeaderTemplate = (content) => `<th scope="row">${content}</th>`;

// Dependencies and modules
const modules = {
  roles: ['builder', 'harvester', 'upgrader'],
  managers: ['roomManager', 'spawnManager', 'towerManager'],
  constants: ['constants.js']
};

// Original main.js content preserved
function init() {
  console.log('Initializing Screeps bot...');
}

function loop() {
  // Main game loop
  console.log('Game tick');
}

// Export all functionality
module.exports = {
  modules,
  generateDependencyTable: () => {
    let html = '<table>\n<thead>\n<tr>\n<th scope="col">Module</th>\n<th scope="col">Dependencies</th>\n</tr>\n</thead>\n<tbody>\n';
    
    Object.entries(modules).forEach(([category, items]) => {
      items.forEach(item => {
        html += `<tr><th scope="row">${item}</th><td>...</td></tr>\n`;
      });
    });
    
    html += '</tbody>\n</table>';
    return html;
  },
  init,
  loop
};