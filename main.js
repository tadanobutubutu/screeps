// main.js
const fs = require('fs');
const path = require('path');

// Existing code (preserved)
function generateDependencyGraph() {
    // ... existing implementation ...
}

// Add this new function to update the HTML file with proper scope attributes
function updateDependencyGraphWithScope() {
    const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace all <th> tags with scope="col" where needed
    content = content.replace(/<th>/g, '<th scope="col">');

    // Special handling for specific cases if needed
    // For example, if some headers should be scope="row" instead
    content = content.replace(/<th scope="col"><div>src\/constants\.js<\/div><\/th>/g,
        '<th scope="col"><div>src/constants.js</div></th>');
    content = content.replace(/<th scope="col"><div>src\/managers\/roomManager\.js<\/div><\/th>/g,
        '<th scope="col"><div>src/managers/roomManager.js</div></th>');
    content = content.replace(/<th scope="col"><div>src\/managers\/spawnManager\.js<\/div><\/th>/g,
        '<th scope="col"><div>src/managers/spawnManager.js</div></th>');
    content = content.replace(/<th scope="col"><div>src\/managers\/towerManager\.js<\/div><\/th>/g,
        '<th scope="col"><div>src/managers/towerManager.js</div></th>');
    content = content.replace(/<th scope="col"><div>src\/roles\/builder\.js<\/div><\/th>/g,
        '<th scope="col"><div>src/roles/builder.js</div></th>');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated dependency-graph.html with proper scope attributes');
}

// Export existing functions
module.exports = {
    generateDependencyGraph,
    // Add new function to exports
    updateDependencyGraphWithScope
};