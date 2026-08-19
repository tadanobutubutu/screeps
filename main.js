// This is a JavaScript function to fix the HTML file
// We're adding scope="col" to all <th> elements in docs/dependency-graph.html

const fs = require('fs');
const path = require('path');

/**
 * Fixes the dependency graph HTML file by adding scope attributes to th elements
 */
function fixDependencyGraphTable() {
    const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');
    
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace <th> with <th scope="col"> where the th doesn't already have a scope attribute
    // This regex finds <th> tags without scope attribute and adds scope="col"
    content = content.replace(/<th(?!\s[^>]*scope=)[^>]*>/gi, '<th scope="col">');
    
    // Write the file back
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log('Fixed dependency-graph.html by adding scope="col" to <th> elements');
}

// Run the fix
fixDependencyGraphTable();